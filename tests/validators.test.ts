import {describe, expect, test} from "@jest/globals"
import {createMovieValidator, movieIdValidator, updateMovieValidator} from "../src/validators/movie"
import {cinemaRoomIdValidator, createCinemaRoomValidator, updateCinemaRoomValidator} from "../src/validators/rooms"
import {
    cinemaSessionIdValidator,
    createCinemaSessionValidator,
    updateCinemaSessionValidator
} from "../src/validators/session"
import {createUserWithRoleValidator, updatePasswordValidator, userIdValidator} from "../src/validators/user"
import {userRoles} from "../src/types/currentUser";
import {authValidator} from "../src/validators/auth";
import {periodValidator, sessionOptionsValidator} from "../src/validators/period";
import {
    ticketCreateValidator,
    ticketIdValidator,
    ticketUpdateValidator,
    ticketUseValidator
} from "../src/validators/ticket";

describe("validator set", () => {

    describe("Movie validator : ", () => {
        test('createValidator is invalid when parameter is not provided', () => {
            const body = {}
            const validator = createMovieValidator.validate(body)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"name\" is required. \"duration\" is required")
        })
        test('createValidator is invalid when paramater is missing', () => {
            const body1 = {
                name: "mobie"
            }
            const validator = createMovieValidator.validate(body1)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"duration\" is required")
            const body2 = {
                duration: 85022
            }
            const validator2 = createMovieValidator.validate(body2)
            expect(validator2.error).not.toBe(undefined)
            expect(validator2.error?.message).toBe("\"name\" is required")
        })
        test('createValidator is invalid when parameters are not required type', () => {
            const body = {
                name: 58,
                duration: 'hale'
            }
            const validator = createMovieValidator.validate(body)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"name\" must be a string. \"duration\" must be a number")
        })
        test('createValidator is valid ', () => {
            const body = {
                name: "somename",
                duration: 60
            }
            const validator = createMovieValidator.validate(body)
            expect(validator.error).toBe(undefined)
            expect(validator.value!.name).toBe(body.name)
            expect(validator.value!.duration).toBe(body.duration)
        })
        test('id Validator is invalid when parameter is not provided', () => {
            const body = {}
            const validator = movieIdValidator.validate(body)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"id\" is required")
        })
        test('id Validator is invalid when parameter is not allowed', () => {
            const body1 = {
                id: 8952,
                name: "mobie"
            }
            const validator = movieIdValidator.validate(body1)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"name\" is not allowed")
        })
        test('id Validator is invalid when parameters are not required type', () => {
            const body = {
                id: 'hale'
            }
            const validator = movieIdValidator.validate(body)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"id\" must be a number")
        })
        test('id Validator is valid ', () => {
            const body = {
                id: 98562
            }
            const validator = movieIdValidator.validate(body)
            expect(validator.error).toBe(undefined)
            expect(validator.value!.id).toBe(body.id)
        })
        test('update Validator is invalid when parameter is not provided', () => {
            const body = {}
            const validator = updateMovieValidator.validate(body)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"value\" must contain at least one of [name, duration]")
        })
        test('update Validator is invalid when parameter are missing', () => {
            const body = {}
            const validator = updateMovieValidator.validate(body)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"value\" must contain at least one of [name, duration]")
        })
        test('update Validator is valid ', () => {
            const body = {
                duration: 60
            }
            const validator = updateMovieValidator.validate(body)
            expect(validator.error).toBe(undefined)
            expect(validator.value!.duration).toBe(body.duration)
            const body2 = {
                name: "somename",
            }
            const validator2 = updateMovieValidator.validate(body2)
            expect(validator2.error).toBe(undefined)
            expect(validator2.value!.name).toBe(body2.name)
        })
    })
    describe("Rooms validator : ", () => {
        test('createValidator is invalid when parameter is not provided', () => {
            const body = {}
            const validator = createCinemaRoomValidator.validate(body)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"name\" is required. \"description\" is required. \"images\" is required."
                + " \"type\" is required. \"seats\" is required. \"disabledAccess\" is required")
        })
        test('createValidator is invalid when paramater is missing', () => {
            const body1 = {
                name: "mobie",
                description: "some descc"
            }
            const validator = createCinemaRoomValidator.validate(body1)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"images\" is required. \"type\" is required. \"seats\" is required." +
                " \"disabledAccess\" is required")
        })
        test('createValidator is invalid when body is invalid ', () => {
            const body = {
                name: 58,
                duration: 'hale',
                description: [7, 5, 3],
                images: {tats: "gfg"},
                seats: "bob"
            }
            const validator = createCinemaRoomValidator.validate(body)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"name\" must be a string. \"description\" must be a string." +
                " \"images\" must be an array. \"type\" is required. \"seats\" must be a number." +
                " \"disabledAccess\" is required. \"duration\" is not allowed")
            const body2 = {
                seats: 5642,
                disabledAccess: () => console.log(),
                images: ["ytcd", NaN, "yen"]
            }
            const validator2 = createCinemaRoomValidator.validate(body2)
            expect(validator2.error).not.toBe(undefined)
            expect(validator2.error?.message).toBe("\"name\" is required. \"description\" is required." +
                " \"images[1]\" must be a string. \"type\" is required. \"seats\" must be less than or equal to 30." +
                " \"disabledAccess\" must be a boolean")
        })
        test('createValidator is valid ', () => {
            const body = {
                name: "somename",
                description: 'somedesc',
                type: "Typede salle",
                seats: 25,
                disabledAccess: true,
                images: ["string", 'values']
            }
            const validator = createCinemaRoomValidator.validate(body)
            expect(validator.error).toBe(undefined)
            expect(validator.value!.name).toBe(body.name)
            expect(validator.value!.disabledAccess).toBe(body.disabledAccess)
        })
        test('id Validator is invalid when parameter is not provided', () => {
            const body = {}
            const validator = cinemaRoomIdValidator.validate(body)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"id\" is required")
        })
        test('id Validator is invalid when parameter is not allowed', () => {
            const body1 = {
                id: 8952,
                name: "mobie"
            }
            const validator = cinemaRoomIdValidator.validate(body1)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"name\" is not allowed")
        })
        test('id Validator is invalid when parameters are not required type', () => {
            const body = {
                id: 'hale'
            }
            const validator = cinemaRoomIdValidator.validate(body)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"id\" must be a number")
        })
        test('id Validator is valid ', () => {
            const body = {
                id: 98562
            }
            const validator = cinemaRoomIdValidator.validate(body)
            expect(validator.error).toBe(undefined)
            expect(validator.value!.id).toBe(body.id)
        })
        test('update Validator is invalid when parameter is not provided', () => {
            const body = {}
            const validator = updateCinemaRoomValidator.validate(body)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"value\" must contain at least one of " +
                "[name, description, images, type, seats, disabledAccess]")
        })
        test('update Validator is invalid when parameter are missing', () => {
            const body = {
            }
            const validator = updateCinemaRoomValidator.validate(body)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"value\" must contain at least one of " +
                "[name, description, images, type, seats, disabledAccess]")
        })
        test('update Validator is valid ', () => {
            const body = {
                images: ["test"]
            }
            const validator = updateCinemaRoomValidator.validate(body)
            expect(validator.error).toBe(undefined)
            expect(validator.value!.images).toStrictEqual(body.images) //checks if objects are exactly the same
            const body2 = {
                disabledAccess: true,
            }
            const validator2 = updateCinemaRoomValidator.validate(body2)
            expect(validator2.error).toBe(undefined)
            expect(validator2.value!.disabledAccess).toBe(body2.disabledAccess)
        })
    })
    describe("Session validator", () => {
        test('createValidator is invalid when parameter is not provided', () => {
            const body = {}
            const validator = createCinemaSessionValidator.validate(body)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"startDate\" is required. \"endDate\" is required. \"movieId\" is" +
                " required. \"roomId\" is required")
        })
        test('createValidator is invalid when paramater is missing', () => {
            const body1 = {
                startDate: new Date()
            }
            const validator = createCinemaSessionValidator.validate(body1)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"endDate\" is required. \"movieId\" is required. \"roomId\" is required")
        })
        //TODO : finish validator
        test('createValidator is invalid when parameters are not required type', () => {
            const body = {
                movieId: {},
                startDate: 'hale'
            }
            const validator = createCinemaSessionValidator.validate(body)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"startDate\" must be a valid date. \"endDate\" is required." +
                " \"movieId\" must be a number. \"roomId\" is required")
        })
        //TODO : finish validator
        test('createValidator is valid ', () => {
            const body = {
                startDate: new Date(),
                endDate: new Date(),
                movieId: 5,
                roomId: 8
            }
            const validator = createCinemaSessionValidator.validate(body)
            expect(validator.error).toBe(undefined)
            expect(validator.value!.startDate).toBe(body.startDate)
            expect(validator.value!.movieId).toBe(body.movieId)
        })
        test('id Validator is invalid when parameter is not provided', () => {
            const body = {}
            const validator = cinemaSessionIdValidator.validate(body)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"id\" is required")
        })
        test('id Validator is invalid when parameter is not allowed', () => {
            const body1 = {
                id: 8952,
                name: "mobie"
            }
            const validator = cinemaSessionIdValidator.validate(body1)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"name\" is not allowed")
        })
        test('id Validator is invalid when parameters are not required type', () => {
            const body = {
                id: 'hale'
            }
            const validator = cinemaSessionIdValidator.validate(body)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"id\" must be a number")
        })
        test('id Validator is valid ', () => {
            const body = {
                id: 98562
            }
            const validator = cinemaSessionIdValidator.validate(body)
            expect(validator.error).toBe(undefined)
            expect(validator.value!.id).toBe(body.id)
        })
        test('update Validator is invalid when parameter is not provided', () => {
            const body = {}
            const validator = updateCinemaSessionValidator.validate(body)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"id\" is required. \"value\" must contain at least one of " +
                "[startDate, endDate, movie]")
        })
        test('update Validator is invalid when parameter are missing', () => {
            const body = {
                id: 5
            }
            const validator = updateCinemaSessionValidator.validate(body)
            expect(validator.error).not.toBe(undefined)
            expect(validator.error?.message).toBe("\"value\" must contain at least one of [startDate, endDate, movie]")
        })
        //TODO : finish validator
        test('update Validator is valid ', () => {
            const body = {
                id: 5,
                startDate: new Date()
            }
            const validator = updateCinemaSessionValidator.validate(body)
            expect(validator.error).toBe(undefined)
            expect(validator.value!.startDate).toBe(body.startDate)
            const body2 = {
                id: 5,
                endDate: new Date(9850060700),
                movie: 8451
            }
            const validator2 = updateCinemaSessionValidator.validate(body2)
            expect(validator2.error).toBe(undefined)
            expect(validator2.value!.movie).toBe(body2.movie)
            expect(validator2.value!.endDate).toBe(body2.endDate)
        })
    })
    describe("User validators", () => {
        describe("createUserWithRoleValidator", () => {
            test("should be invalid when required fields are missing", () => {
                const body = {}
                const validator = createUserWithRoleValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toContain("\"email\" is required")
                expect(validator.error?.message).toContain("\"password\" is required")
                expect(validator.error?.message).toContain("\"roles\" is required")
            })

            test("should be invalid when fields are of incorrect type", () => {
                const body = {
                    email: 12345,
                    password: true,
                    roles: "invalidRole"
                }
                const validator = createUserWithRoleValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toContain("\"email\" must be a string")
                expect(validator.error?.message).toContain("\"password\" must be a string")
                expect(validator.error?.message).toContain("\"roles\" must be ")
            })

            test("should be valid when all fields are correct", () => {
                const body = {
                    email: "user@example.com",
                    password: "password123",
                    roles: userRoles.CLASSIC
                }
                const validator = createUserWithRoleValidator.validate(body)
                expect(validator.error).toBe(undefined)
                expect(validator.value).toEqual(body)
            })
        })

        describe("userIdValidator", () => {
            test("should be invalid when id is missing", () => {
                const body = {}
                const validator = userIdValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"id\" is required")
            })

            test("should be invalid when id is not a number", () => {
                const body = {id: "notANumber"}
                const validator = userIdValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"id\" must be a number")
            })

            test("should be valid when id is a number", () => {
                const body = {id: 123}
                const validator = userIdValidator.validate(body)
                expect(validator.error).toBe(undefined)
                expect(validator.value).toEqual(body)
            })
        })

        describe("updatePasswordValidator", () => {
            test("should be invalid when required fields are missing", () => {
                const body = {}
                const validator = updatePasswordValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toContain("\"oldPassword\" is required")
                expect(validator.error?.message).toContain("\"newPassword\" is required")
            })

            test("should be invalid when fields are of incorrect type", () => {
                const body = {
                    oldPassword: 12345,
                    newPassword: true
                }
                const validator = updatePasswordValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toContain("\"oldPassword\" must be a string")
                expect(validator.error?.message).toContain("\"newPassword\" must be a string")
            })

            test("should be invalid when password length is out of range", () => {
                const body = {
                    oldPassword: "short",
                    newPassword: "toolongpasswordtoolongpassword"
                }
                const validator = updatePasswordValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toContain("\"oldPassword\" length must be at least 6 characters long")
                expect(validator.error?.message).toContain("\"newPassword\" length must be less than or equal to 20 characters long")
            })

            test("should be valid when all fields are correct", () => {
                const body = {
                    oldPassword: "password123",
                    newPassword: "newpassword456"
                }
                const validator = updatePasswordValidator.validate(body)
                expect(validator.error).toBe(undefined)
                expect(validator.value).toEqual(body)
            })
        })
    })
    describe("ticket validator", () => {
        describe("ticketCreateValidator", () => {
            test('create Validator is invalid when parameter is not provided', () => {
                const body = {}
                const validator = ticketCreateValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"superTicket\" is required")
            })
            test('create Validator is invalid when parameter is not allowed or is missing', () => {
                const body = {
                    haha: 8451
                }
                const validator = ticketCreateValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"superTicket\" is required. \"haha\" is not allowed")
            })
            test('create Validator is invalid when parameters are not required type', () => {
                const body = {
                    superTicket: "no"
                }
                const validator = ticketCreateValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"superTicket\" must be a boolean")
            })
            test('create Validator is valid ', () => {
                const body1 = {
                    superTicket: true
                }
                const validator1 = ticketCreateValidator.validate(body1)
                expect(validator1.error).toBe(undefined)
                expect(validator1.value.superTicket).toBe(true)
                const body2 = {
                    superTicket: false
                }
                const validator2 = ticketCreateValidator.validate(body2)
                expect(validator2.error).toBe(undefined)
                expect(validator2.value.superTicket).toBe(false)
            })
        })
        describe("ticketIdValidator", () => {
            test('id Validator is invalid when parameter is not provided', () => {
                const body = {}
                const validator = ticketIdValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"id\" is required")
            })
            test('id Validator is invalid when parameter is not allowed or is missing', () => {
                const body = {
                    haha: 8451
                }
                const validator = ticketIdValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"id\" is required. \"haha\" is not allowed")
            })
            test('id Validator is invalid when parameters are not required type', () => {
                const body = {
                    id: {}
                }
                const validator = ticketIdValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"id\" must be a number")
            })
            test('id Validator is valid ', () => {
                const body = {
                    id: 8451
                }
                const validator = ticketIdValidator.validate(body)
                expect(validator.error).toBe(undefined)
                expect(validator.value.id).toBe(body.id)
            })
        })
        describe("ticketUseValidator", () => {
            test('use Validator is invalid when parameter is not provided', () => {
                const body = {}
                const validator = ticketUseValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"sessionId\" is required")
            })
            test('use Validator is invalid when parameter is not allowed or is missing', () => {
                const body = {
                    haha: 8451
                }
                const validator = ticketUseValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"sessionId\" is required. \"haha\" is not allowed")
            })
            test('use Validator is invalid when parameters are not required type', () => {
                const body = {
                    sessionId: "str"
                }
                const validator = ticketUseValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"sessionId\" must be a number")
            })
            test('use Validator is valid ', () => {
                const body = {
                    sessionId: 8451
                }
                const validator = ticketUseValidator.validate(body)
                expect(validator.error).toBe(undefined)
                expect(validator.value.sessionId).toBe(body.sessionId)
            })
        })
        describe("ticketUpdateValidator", () => {
            test('update Validator is invalid when parameter is not provided', () => {
                const body = {}
                const validator = ticketUpdateValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"value\" must contain at least one of [sessionId, userId, " +
                    "used, remainingUses]")
            })
            test('update Validator is invalid when parameter is not allowed', () => {
                const body = {
                    haha: 8451
                }
                const validator = ticketUpdateValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"haha\" is not allowed. \"value\" must contain at least one of " +
                    "[sessionId, userId, used, remainingUses]")
            })
            test('update Validator is invalid when parameters are not required type', () => {
                const body = {
                    used: 8451,
                    sessionId: null,
                    remainingUses: "",
                    userId: []
                }
                const validator = ticketUpdateValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"sessionId\" must be a number. \"userId\" must be a number." +
                    " \"used\" must be a boolean. \"remainingUses\" must be a number")
            })
            test('update Validator is valid ', () => {
                const body1 = {
                    sessionId: 3
                }
                const validator1 = ticketUpdateValidator.validate(body1)
                expect(validator1.error).toBe(undefined)
                expect(validator1.value.sessionId).toBe(body1.sessionId)
                const body2 = {
                    userId: 9856
                }
                const validator2 = ticketUpdateValidator.validate(body2)
                expect(validator2.error).toBe(undefined)
                expect(validator2.value.userId).toBe(body2.userId)
                const body3 = {
                    used: true
                }
                const validator3 = ticketUpdateValidator.validate(body3)
                expect(validator3.error).toBe(undefined)
                expect(validator3.value.used).toBe(body3.used)
                const body4 = {
                    remainingUses: 5
                }
                const validator4 = ticketUpdateValidator.validate(body4)
                expect(validator4.error).toBe(undefined)
                expect(validator4.value.remainingUses).toBe(body4.remainingUses)

            })
        })
    })
    describe("period validator", () => {
        describe("sessionOptions", () => {
            test('id Validator is valid when parameter is not provided', () => {
                const body = {}
                const validator = sessionOptionsValidator.validate(body)
                expect(validator.error).toBe(undefined)
                expect(validator.value).toStrictEqual({})
            })
            test('id Validator is invalid when parameter is not allowed or is missing', () => {
                const body = {
                    startDate: new Date()
                }
                const validator = sessionOptionsValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"endDate\" is required")
            })
            test('id Validator is invalid when parameters are not required type', () => {
                const body = {
                    allSessions: {},
                    startDate: "mu",
                    endDate: "sic"
                }
                const validator = sessionOptionsValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"startDate\" must be a valid date. \"endDate\" must be a " +
                    "valid date. \"allSessions\" is not allowed")
                const body2 = {
                    allSessions: {},
                }
                const validator2 = sessionOptionsValidator.validate(body2)
                expect(validator2.error).not.toBe(undefined)
                expect(validator2.error?.message).toBe("\"allSessions\" must be a boolean")
                const body3 = {
                    startDate: "mu",
                    endDate: "sic"
                }
                const validator3 = sessionOptionsValidator.validate(body3)
                expect(validator3.error).not.toBe(undefined)
                expect(validator3.error?.message).toBe("\"startDate\" must be a valid date. \"endDate\" must be a " +
                    "valid date")
            })
            test('id Validator is valid ', () => {
                const body = {
                    allSessions: true,
                }
                const validator = sessionOptionsValidator.validate(body)
                expect(validator.error).toBe(undefined)
                expect(validator.value.allSessions).toBe(body.allSessions)
                const body2 = {
                    startDate: new Date(1),
                    endDate: new Date(2)
                }
                const validator2 = sessionOptionsValidator.validate(body2)
                expect(validator2.error).toBe(undefined)
                expect(validator2.value.startDate).toBe(body2.startDate)
                expect(validator2.value.endDate).toBe(body2.endDate)
            })
            test('ensure dates are in the right order', () => {
                const body = {
                    startDate: new Date(10),
                    endDate: new Date(2)
                }
                const validator = sessionOptionsValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("The startDate cannot be after the endDate.")
            })
        })
        describe("period", () => {
            test('id Validator is invalid when parameter is not allowed', () => {
                const body = {
                    tata: undefined
                }
                const validator = periodValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"tata\" is not allowed")
            })
            test('id Validator is invalid when one parameter is missing', () => {
                const body = {
                    startDate: new Date()
                }
                const validator = periodValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"endDate\" is required")
            })
            test('id Validator is invalid when parameters are not required type', () => {
                const body = {
                    startDate: new Date().toLocaleDateString(),
                    endDate: new Date().toLocaleDateString()
                }
                const validator = periodValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"startDate\" must be a valid date. \"endDate\" must be a" +
                    " valid date")
            })
            test('Validator is valid when parameter is not provided (optional)', () => {
                const body = {}
                const validator = periodValidator.validate(body)
                expect(validator.error).toBe(undefined)
                expect(validator.value).toStrictEqual({})//checks if objects are exactly the same
            })
            test('id Validator is valid ', () => {
                const body = {
                    startDate: new Date(),
                    endDate: new Date()
                }
                const validator = periodValidator.validate(body)
                expect(validator.error).toBe(undefined)
                expect(validator.value).toStrictEqual(body)
            })
            test('ensure dates are in the right order', () => {
                const body = {
                    startDate: new Date(10),
                    endDate: new Date(2)
                }
                const validator = periodValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("The startDate cannot be after the endDate.")
            })
        })
    })
    describe("auth validator", () => {
        describe("auth", () => {
            test('id Validator is invalid when parameter is not provided', () => {
                const body = {}
                const validator = authValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"email\" is required. \"password\" is required")
            })
            test('id Validator is invalid when parameter is not allowed', () => {
                const body = {
                    "email": "j@ma.fr",
                    "password": "gsgspfe",
                    'p': 'd'
                }
                const validator = authValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"p\" is not allowed")
            })
            test('id Validator is invalid when parameters are not required type', () => {
                const body = {
                    "email": "j",
                    "password": 8452,
                    'p': 'd'
                }
                const validator = authValidator.validate(body)
                expect(validator.error).not.toBe(undefined)
                expect(validator.error?.message).toBe("\"email\" must be a valid email. \"password\" must be a " +
                    "string. \"p\" is not allowed")
            })
            test('id Validator is valid ', () => {
                const body = {
                    "email": "j@ma.fr",
                    "password": "gsgspfe",
                }
                const validator = authValidator.validate(body)
                expect(validator.error).toBe(undefined)
                expect(validator.value).toStrictEqual(body)
            })
        })
    })
})
