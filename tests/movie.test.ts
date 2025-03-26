import {TestDataSource} from "../src/db/tests.database";
import {beforeAll, beforeEach, describe, expect, it, jest} from "@jest/globals";
import {MovieController} from "../src/controllers/MovieController";
import {getMockReq, getMockRes} from '@jest-mock/express'
import {AppDataSource} from "../src/db/database";


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
const {res, next, mockClear} = getMockRes()

//TODO : test routes
beforeEach(() => {
    mockClear() // can also use clearMockRes()
})

describe('movie controller :', () => {
    const movieController = new MovieController()
    it('returns nothing on GET:/movies when no data is there', async () => {
        if (!TestDataSource.isInitialized && !AppDataSource.isInitialized) {
            console.log('no init !!')
            await TestDataSource.initialize()
            await AppDataSource.initialize()
        } else{
            console.log('Inited')
        }
        const req = getMockReq()
        await movieController.get(req, res)
        expect(res.json).toBe([])
    })
})