import {DataSource} from "typeorm"

export const TestDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    logging: true,
    synchronize:true,
    entities: ["src/db/test/*.ts"],
})
