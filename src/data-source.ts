import "dotenv/config"
import path from "path"
import "reflect-metadata"
import { DataSource, DataSourceOptions } from "typeorm"


export class AppDataSource {

    private entitiesPath: string;
    private migrationsPath: string;
    private dbUrl: string | undefined;
    private config: DataSourceOptions;

    constructor() { 
        this.entitiesPath = path.join(__dirname, "./entities/**.ts")
        this.migrationsPath = path.join(__dirname, "./migrations/**.ts");

        this.dbUrl = process.env.DATABASE_URL;

        if (!this.dbUrl) {
            throw new Error("ENV var DATABASE_URL does not exist");
        }

        this.config = {
            type: "mysql",
            url: process.env.DATABASE_URL!,
            synchronize: false,
            logging: true,
            migrations: [this.migrationsPath],
            entities: [this.entitiesPath],
        };
    }

    getConfig() {
        return this.config;
    }
}

const dataSourceConfig = new AppDataSource();

const dbConfig = dataSourceConfig.getConfig();

const appDataSource = new DataSource(dbConfig)

export { appDataSource };


// const dataSourceConfig = (): DataSourceOptions => {

//     const nodeEnv: string | undefined  = process.env.NODE_ENV

//     let entitiesPath: string = path.join(__dirname, "./entities/**.ts")
//     let migrationsPath: string = path.join(__dirname, "./migrations/**.ts")

//     const testeArray = []

//     // if (nodeEnv === "prod") {
//     //     entitiesPath = path.join(__dirname, "./entities/**.js")
//     //     migrationsPath = path.join(__dirname, "./migrations/**.js")
//     // }

//     const dbUrl: string | undefined = process.env.DATABASE_URL

//     if(!dbUrl) {
//         throw new Error("ENV var DATABASE_URL does not exists")
//     }

//     // if(nodeEnv === "test"){
//     //     return {
//     //         type: "sqlite",
//     //         database: ":memory:",
//     //         synchronize: true,
//     //         entities: [entitiesPath]
//     //     }

//     // }

//     return {
//         type: "mysql",
//         url: process.env.DATABASE_URL!,
//         synchronize: false,
//         logging: true,
//         migrations: [migrationsPath],
//         entities: [entitiesPath],
//     }
// }

// const appDataSource = new DataSource(dataSourceConfig())

// export {appDataSource}