import {describe, expect, test} from "@jest/globals";
import {createMovieValidator, movieIdValidator, updateMovieValidator} from "../src/validators/movie";
import {cinemaRoomIdValidator, createCinemaRoomValidator, updateCinemaRoomValidator} from "../src/validators/rooms";
import {
    cinemaSessionIdValidator,
    createCinemaSessionValidator,
    updateCinemaSessionValidator
} from "../src/validators/session";

describe("Movie validator : ", () => {
    test('createValidator is invalid when parameter is not provided', () => {
        const body = {}
        const validator = createMovieValidator.validate(body)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"name\" is required. \"duration\" is required")
    });
    test('createValidator is invalid when paramater is missing', () => {
        const body1 = {
            name: "mobie"
        }
        const validator = createMovieValidator.validate(body1)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"duration\" is required")
        const body2 = {
            duration: 85022
        }
        const validator2 = createMovieValidator.validate(body2)
        expect(validator2.error).not.toBe(undefined);
        expect(validator2.error?.message).toBe("\"name\" is required")
    })
    test('createValidator is invalid when parameters are not required type', () => {
        const body = {
            name: 58,
            duration: 'hale'
        }
        const validator = createMovieValidator.validate(body)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"name\" must be a string. \"duration\" must be a number")
    })
    test('createValidator is valid ', () => {
        const body = {
            name: "somename",
            duration: 60
        }
        const validator = createMovieValidator.validate(body)
        expect(validator.error).toBe(undefined);
        expect(validator.value!.name).toBe(body.name)
        expect(validator.value!.duration).toBe(body.duration)
    })
    test('id Validator is invalid when parameter is not provided', () => {
        const body = {}
        const validator = movieIdValidator.validate(body)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"id\" is required")
    });
    test('id Validator is invalid when parameter is not allowed', () => {
        const body1 = {
            id: 8952,
            name: "mobie"
        }
        const validator = movieIdValidator.validate(body1)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"name\" is not allowed")
    })
    test('id Validator is invalid when parameters are not required type', () => {
        const body = {
            id: 'hale'
        }
        const validator = movieIdValidator.validate(body)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"id\" must be a number")
    })
    test('id Validator is valid ', () => {
        const body = {
            id: 98562
        }
        const validator = movieIdValidator.validate(body)
        expect(validator.error).toBe(undefined);
        expect(validator.value!.id).toBe(body.id)
    })
    test('update Validator is invalid when parameter is not provided', () => {
        const body = {}
        const validator = updateMovieValidator.validate(body)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"id\" is required. \"value\" must contain at least one of [name, duration]")
    });
    test('update Validator is invalid when parameter are missing', () => {
        const body = {
            id: 5
        }
        const validator = updateMovieValidator.validate(body)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"value\" must contain at least one of [name, duration]")
    });
    test('update Validator is valid ', () => {
        const body = {
            id: 5,
            duration: 60
        }
        const validator = updateMovieValidator.validate(body)
        expect(validator.error).toBe(undefined);
        expect(validator.value!.duration).toBe(body.duration)
        const body2 = {
            id: 5,
            name: "somename",
        }
        const validator2 = updateMovieValidator.validate(body2)
        expect(validator2.error).toBe(undefined);
        expect(validator2.value!.name).toBe(body2.name)
    })
})
describe("Rooms validator : ", () => {
    test('createValidator is invalid when parameter is not provided', () => {
        const body = {}
        const validator = createCinemaRoomValidator.validate(body)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"name\" is required. \"description\" is required. \"images\" is required."
            + " \"type\" is required. \"capacity\" is required. \"disabledAccess\" is required")
    });
    test('createValidator is invalid when paramater is missing', () => {
        const body1 = {
            name: "mobie",
            description: "some descc"
        }
        const validator = createCinemaRoomValidator.validate(body1)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"images\" is required. \"type\" is required. \"capacity\" is required." +
            " \"disabledAccess\" is required")
    })
    test('createValidator is invalid when body is invalid ', () => {
        const body = {
            name: 58,
            duration: 'hale',
            description: [7, 5, 3],
            images: {tats: "gfg"},
            capacity: "bob"
        }
        const validator = createCinemaRoomValidator.validate(body)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"name\" must be a string. \"description\" must be a string." +
            " \"images\" must be an array. \"type\" is required. \"capacity\" must be a number." +
            " \"disabledAccess\" is required. \"duration\" is not allowed")
        const body2 = {
            capacity: 5642,
            disabledAccess: () => console.log(),
            images: ["ytcd", NaN, "yen"]
        }
        const validator2 = createCinemaRoomValidator.validate(body2)
        expect(validator2.error).not.toBe(undefined);
        expect(validator2.error?.message).toBe("\"name\" is required. \"description\" is required." +
            " \"images[1]\" must be a string. \"type\" is required. \"capacity\" must be less than or equal to 30." +
            " \"disabledAccess\" must be a boolean")
    })
    test('createValidator is valid ', () => {
        const body = {
            name: "somename",
            description: 'somedesc',
            type: "Typede salle",
            capacity: 25,
            disabledAccess: true,
            images: ["string", 'values']
        }
        const validator = createCinemaRoomValidator.validate(body)
        expect(validator.error).toBe(undefined);
        expect(validator.value!.name).toBe(body.name)
        expect(validator.value!.disabledAccess).toBe(body.disabledAccess)
    })
    test('id Validator is invalid when parameter is not provided', () => {
        const body = {}
        const validator = cinemaRoomIdValidator.validate(body)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"id\" is required")
    });
    test('id Validator is invalid when parameter is not allowed', () => {
        const body1 = {
            id: 8952,
            name: "mobie"
        }
        const validator = cinemaRoomIdValidator.validate(body1)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"name\" is not allowed")
    })
    test('id Validator is invalid when parameters are not required type', () => {
        const body = {
            id: 'hale'
        }
        const validator = cinemaRoomIdValidator.validate(body)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"id\" must be a number")
    })
    test('id Validator is valid ', () => {
        const body = {
            id: 98562
        }
        const validator = cinemaRoomIdValidator.validate(body)
        expect(validator.error).toBe(undefined);
        expect(validator.value!.id).toBe(body.id)
    })
    test('update Validator is invalid when parameter is not provided', () => {
        const body = {}
        const validator = updateCinemaRoomValidator.validate(body)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"id\" is required. \"value\" must contain at least one of " +
            "[name, description, images, type, capacity, disabledAccess]")
    });
    test('update Validator is invalid when parameter are missing', () => {
        const body = {
            id: 5
        }
        const validator = updateCinemaRoomValidator.validate(body)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"value\" must contain at least one of " +
            "[name, description, images, type, capacity, disabledAccess]")
    });
    test('update Validator is valid ', () => {
        const body = {
            id: 5,
            images: ["test"]
        }
        const validator = updateCinemaRoomValidator.validate(body)
        expect(validator.error).toBe(undefined);
        expect(validator.value!.images).toStrictEqual(body.images)
        const body2 = {
            id: 5,
            disabledAccess: true,
        }
        const validator2 = updateCinemaRoomValidator.validate(body2)
        expect(validator2.error).toBe(undefined);
        expect(validator2.value!.disabledAccess).toBe(body2.disabledAccess)
    })
})
describe("Session validator", () => {
    test('createValidator is invalid when parameter is not provided', () => {
        const body = {}
        const validator = createCinemaSessionValidator.validate(body)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"startDate\" is required. \"endDate\" is required. \"movie\" is required")
    });
    test('createValidator is invalid when paramater is missing', () => {
        const body1 = {
            startDate: new Date()
        }
        const validator = createCinemaSessionValidator.validate(body1)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"endDate\" is required. \"movie\" is required")
    })
    test('createValidator is invalid when parameters are not required type', () => {
        const body = {
            movie: 58,
            startDate: 'hale'
        }
        const validator = createCinemaSessionValidator.validate(body)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"name\" must be a string. \"duration\" must be a number")
    })
    test('createValidator is valid ', () => {
        const body = {
            name: "somename",
            duration: 60
        }
        const validator = createCinemaSessionValidator.validate(body)
        expect(validator.error).toBe(undefined);
        expect(validator.value!.name).toBe(body.name)
        expect(validator.value!.duration).toBe(body.duration)
    })
    test('id Validator is invalid when parameter is not provided', () => {
        const body = {}
        const validator = cinemaSessionIdValidator.validate(body)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"id\" is required")
    });
    test('id Validator is invalid when parameter is not allowed', () => {
        const body1 = {
            id: 8952,
            name: "mobie"
        }
        const validator = cinemaSessionIdValidator.validate(body1)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"name\" is not allowed")
    })
    test('id Validator is invalid when parameters are not required type', () => {
        const body = {
            id: 'hale'
        }
        const validator = cinemaSessionIdValidator.validate(body)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"id\" must be a number")
    })
    test('id Validator is valid ', () => {
        const body = {
            id: 98562
        }
        const validator = cinemaSessionIdValidator.validate(body)
        expect(validator.error).toBe(undefined);
        expect(validator.value!.id).toBe(body.id)
    })
    test('update Validator is invalid when parameter is not provided', () => {
        const body = {}
        const validator = updateCinemaSessionValidator.validate(body)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"id\" is required. \"value\" must contain at least one of " +
            "[startDate, endDate, movie]")
    });
    test('update Validator is invalid when parameter are missing', () => {
        const body = {
            id: 5
        }
        const validator = updateCinemaSessionValidator.validate(body)
        expect(validator.error).not.toBe(undefined);
        expect(validator.error?.message).toBe("\"value\" must contain at least one of [name, duration]")
    });
    test('update Validator is valid ', () => {
        const body = {
            id: 5,
            duration: 60
        }
        const validator = updateCinemaSessionValidator.validate(body)
        expect(validator.error).toBe(undefined);
        expect(validator.value!.duration).toBe(body.duration)
        const body2 = {
            id: 5,
            name: "somename",
        }
        const validator2 = updateMovieValidator.validate(body2)
        expect(validator2.error).toBe(undefined);
        expect(validator2.value!.name).toBe(body2.name)
    })
})
