import { logger } from 'src/logs/nest.log';
import { Job } from 'bullmq';
import { Processor, OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { IUserConversationRepository } from 'src/domain/chat/repository/user-conversation.repository';

@Processor('conversation', {
    concurrency: 10
})
export class ConversationQueue extends WorkerHost {
    private readonly logger = new Logger(ConversationQueue.name);

    constructor(
        private readonly userConversationRepository: IUserConversationRepository
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
                    const userConversations = await this.userConversationRepository.findByConversationId(job.data.conversationId);
                    await this.userConversationRepository.bulkWriteUpsert(userConversations, job.data.userSend.id, job.data.latestMessageId);
                } catch (error: any) {
                    logger.error(error.stack);
                    console.log(error);
                }

			default:
				console.log('Prepare queue conversation finished');
                break;
		}
	}
}