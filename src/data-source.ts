import { DataSource } from "typeorm";
import { join } from "path";

console.log(__dirname + '/database/migrations/*.{js,ts}');
export const AppDataSource = new DataSource({
    type: "mongodb",
    host: "192.168.0.99",
    port: 27017,
    database: "social_chat",
    synchronize: false,
    logging: true,
    entities: [],
    subscribers: [],
    migrations: [__dirname + '/database/migrations/*.{js,ts}'],
})
