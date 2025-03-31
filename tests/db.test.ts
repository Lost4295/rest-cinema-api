import {TestDataSource} from "../src/db/tests.database";
import {beforeAll, describe, expect, test} from "@jest/globals";

beforeAll(async () => {
    try {
        return TestDataSource.initialize()
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
        } else {
            console.error('An error occurred')
        }
    }
})


describe('db test', ()=>{
    test('query is ok', async () => {
        const data = await TestDataSource.query("SELECT 1+1")
        expect(data[0]["1+1"]).toBe(2)
    })
})
