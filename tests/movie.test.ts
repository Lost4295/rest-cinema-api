import {beforeAll, beforeEach, describe, expect, it} from "@jest/globals"
import {MovieController} from "../src/controllers/MovieController"
import {getMockReq, getMockRes} from '@jest-mock/express'
import {AppDataSource} from "../src/db/database"

beforeAll(async () => {
    try {
        return AppDataSource.initialize()
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
        } else {
            console.error('An error occurred')
        }
    }
})
const {res, mockClear} = getMockRes()

//TODO : test routes
beforeEach(() => {
    mockClear() // can also use clearMockRes()
})

describe('movie controller :', () => {
    const movieController = new MovieController()
    it('returns nothing on GET:/movies when no data is there', async () => {
        const req = getMockReq()
        await movieController.get(req, res)
        expect(res.send).toHaveBeenCalledTimes(1)
        expect(res.send).toHaveBeenCalledWith([])
        // expect(res.send.mock.calls.length).toBe(1)

    })
})
