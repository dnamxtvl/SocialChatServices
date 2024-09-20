import { logger } from 'src/logs/nest.log';
import { Job } from 'bullmq';
import { Processor, OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { IUserConversationRepository } from 'src/domain/chat/repository/user-conversation.repository';
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { MessageGateway } from '../gateway/message.gateway';
import { TypeMessageEnum } from 'src/infrastructure/entities/message.entity';
import { MessageModel } from 'src/domain/chat/models/message/message.model';
import { IMessageRepository } from 'src/domain/chat/repository/message.repository';
import { FileContent } from 'src/@type/Message';
import { getTypeMessageForFile, sortedFiles } from 'src/helpers/message.helper';
import { APPLICATION_CONST } from 'src/const/application';

@Processor('conversation', {
    concurrency: 10
})
export class ConversationQueue extends WorkerHost {
    private readonly logger = new Logger(ConversationQueue.name);

    constructor(
        private readonly userConversationRepository: IUserConversationRepository,
		private readonly messageGateway: MessageGateway,
		private readonly messageRepository: IMessageRepository,
    ) {
        super();    
    }

    @OnWorkerEvent('active')
	onQueueActive(job: Job) {
		this.logger.log(`Job has been started: ${job.id}` + ' name ' + job.name);
        logger.info(`Job has been started: ${job.id}` + ' name ' + job.name);
	}

	@OnWorkerEvent('completed')
	onQueueComplete(job: Job, result: any) {
		this.logger.log(`Job has been finished: ${job.id}` + ' name ' + job.name);
        logger.info(`Job has been finished: ${job.id}` + ' name ' + job.name);
	}

	@OnWorkerEvent('failed')
	onQueueFailed(job: Job, err: any) {
		this.logger.log(`Job has been failed: ${job.id}`);
		this.logger.log({ err });
        logger.error(`Job has been failed: ${job.id}` + ' ' + job.name + ' name ' + err.stack);
	}

	@OnWorkerEvent('error')
	onQueueError(err: any) {
		this.logger.error(`Job has got error: `);
		this.logger.error({ err });
        logger.error(`Job has got error: ` + ' name ' + err.stack );
	}

    async process(job: Job<any, any, string>, token?: string): Promise<any> {
		switch (job.name) {
			case 'message_sent':
                logger.info(`Prepare job ' + ${job.id}` + ' name ' + job.name + ' in function process');
                try {
                    const userConversations = await this.userConversationRepository.findByConversationId(job.data.conversation.id);
                    await this.userConversationRepository.bulkWriteUpsert(userConversations, job.data.userSend, job.data.latestMessage.id);
					this.messageGateway.server.to(job.data.conversation.id).emit('sendMessageDone', {
						messageUUId: job.data.messageUUId,
						message: job.data.latestMessage,
						uploadDone: true,
						userSend: job.data.userSend,
						conversation: job.data.conversation,
					});
                } catch (error: any) {
                    logger.error(error.stack);
                    console.log(error);
                }

				break;

			case 'upload_file':
				const now = new Date();
				const Bucket = process.env.AWS_BUCKET_NAME;
				const s3 = new S3Client({
					region: process.env.AWS_REGION,
					credentials: {
						accessKeyId: process.env.AWS_ACCESS_ID as string,
						secretAccessKey: process.env.AWS_SECRET_ID as string,
					},
				});
				let files = job.data.files;
				logger.info(`Prepare job ' + ${job.id}` + ' name ' + job.name + ' in function process');
				const fileIdPush = files.reduce((acc: any, file: any) => {
					acc['conversation/' + '_' + file.fileId + '_' + file.name] = file.fileId;
					return acc;
				}, {});
				const countImages = files.filter((file: any) => file.mimetype.includes('image')).length;
				let imagesObjects = [];
				let imageUUIds = [];
				let countImagesUploaded = 0;
				let firstOfAvgTime = job.data.firstOfAvgTime;
				let countUploaded = 0;
				for (const file of countImages > 0 ? sortedFiles(job.data.files) : job.data.files) {
					let key = 'conversation/' + '_' + file.fileId + '_' + file.name;
					let Body = Buffer.from(file.buffer, 'base64');
					let parallelUploads3 = new Upload({
					  client: s3,
					  queueSize: APPLICATION_CONST.AWS_UPLOAD_QUEUE_SIZE, // optional concurrency configuration
					  partSize: APPLICATION_CONST.AWS_STREAM_CHUNK_SIZE, // optional size of each part
					  leavePartsOnError: false, // optional manually handle dropped parts
					  params: { Bucket, Key: key, Body },
					});
					parallelUploads3.on("httpUploadProgress", async (progress: any) => {
						this.messageGateway.server.to(job.data.userId).emit('uploadFilesProgress', {
							messageUUId: fileIdPush[progress.Key],
							percent: Math.round((progress.loaded / progress.total) * 100),
							uploadDone: progress.loaded === progress.total,
							userSend: job.data.userSend,
							conversation: job.data.conversation,
						});
					});
					let response = await parallelUploads3.done();
					let fileUploaded: FileContent = {
						name: file.name,
						path: response.Location,
						mimeType: file.mimetype,
						size: file.size,
					}
					let isImage =  file.mimetype.includes('image');
					if (countImages >= 1 && isImage) {
						countImagesUploaded ++;
						imagesObjects.push(fileUploaded);
						imageUUIds.push(file.fileId);
					}

					if (imagesObjects.length == countImages && imagesObjects.length > countUploaded && countImages >= 1) { //upload images
						let latestMessage = await this.saveMessageIsFile(job.data, firstOfAvgTime, countImages == 1 ? imagesObjects[0] : imagesObjects, countImages == 1 ? TypeMessageEnum.IMAGE  : TypeMessageEnum.IMAGES, now);
						const userConversations = await this.userConversationRepository.findByConversationId(job.data.conversation.id);
                    	await this.userConversationRepository.bulkWriteUpsert(userConversations, job.data.userSend, latestMessage.getId());
						this.messageGateway.server.to(job.data.conversation.id).emit('sendMessageDone', {
							messageUUId: file.fileId,
							message: latestMessage,
							uploadDone: true,
							userSend: job.data.userSend,
							conversation: job.data.conversation,
						});
						if (firstOfAvgTime) {
							firstOfAvgTime = false;
						}
					}

					if (!isImage) { //upload image,video,audio,file
						let latestMessage = await this.saveMessageIsFile(job.data, firstOfAvgTime, fileUploaded, getTypeMessageForFile(file.mimetype), now);
						const userConversations = await this.userConversationRepository.findByConversationId(job.data.conversation.id);
                    	await this.userConversationRepository.bulkWriteUpsert(userConversations, job.data.userSend, latestMessage.getId());
						this.messageGateway.server.to(job.data.conversation.id).emit('sendMessageDone', {
							messageUUId: file.fileId,
							message: latestMessage,
							uploadDone: true,
							userSend: job.data.userSend,
							conversation: job.data.conversation,
						});
						if (firstOfAvgTime) {
							firstOfAvgTime = false;
						}
					}

					countUploaded ++;
				}
				break;

			default:
				console.log('Prepare queue conversation finished');
                break;
		}
	}

	private async saveMessageIsFile(data: any, firstOfAvgTime: boolean, content: any , type: TypeMessageEnum, time: Date) : Promise<MessageModel> {
		let message = new MessageModel(
			type,
			data.conversation.id,
			firstOfAvgTime,
			data.userId,
			null,
			content,
			data.replyMessageId,
			null, null, null, time
		);
		let newMessage = await this.messageRepository.saveMessage(message);

		return newMessage;
	}
}