import {PrismaClient} from './client'
import {userRoles} from '../types/currentUser'
import {config} from "../config/config"
import moment from "moment"
import {isChevauchement} from "../utils"

const prisma = new PrismaClient()

const TICKET_PRICE = config.ticketPrice

async function createMovie() {
    console.log("Adding movies")
    for (let i = 1; i <= 10; i++) {
        await prisma.movie.create({
            data: {
                name: `movie${i}`,
                duration: (Math.random() * 61) + 60,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        })
    }
}

async function createRoom() {
    console.log("Adding rooms")
    for (let i = 1; i <= 10; i++) {
        await prisma.room.create({
            data: {
                name: `room${i}`,
                description: `description of room ${i}`,
                images: [],
                type: i % 2 == 0 ? (i % 3 == 0 ? "4D et 3D" : "3D") : "2D",
                seats: Math.floor(Math.random() * 16) + 15,
                disabledAccess: i % 3 == 0,
                onMaintenance: i == 10,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        })
    }
}

async function createSession() {
    console.log("Adding sessions")
    let i = 1
    while (i < 41) {
        const momentstart = moment(getRandomDate(
            moment(new Date()).subtract('2', 'months'),
            moment(new Date()).add('2', 'months'),
            9,
            20
        ))
        const endmoment = moment(momentstart)
        const id = Math.floor(Math.random() * 10) + 1
        const m = await prisma.movie.findUniqueOrThrow({
            where: {id: id}
        })
        const date = momentstart.toISOString()
        const endDate = endmoment.add(m.duration + 30, "minutes").toISOString()
        const sessions = await prisma.session.findMany()
        const roomID = Math.floor(Math.random() * 10) + 1
        const body = {
            startDate: new Date(date),
            endDate: new Date(endDate),
            movieId: id,
            roomId: roomID
        }
        if (isChevauchement(sessions, body)) {
            continue
        }
        await prisma.session.create({
            data: {
                startDate: date,
                endDate: endDate,
                movieId: id,
                roomId: roomID,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        })
        i++
    }
}

async function createUser() {
    console.log("Adding users")
    for (let i = 1; i <= 8; i++) {
        await prisma.user.create({
            data: {
                email: `mail${i}@cinema.com`,
                password: `password${i}`,
                createdAt: new Date(),
                updatedAt: new Date(),
                money: Math.floor(Math.random() * 200) + 1,
                roles: resolveRole(i),
            }
        })
    }
}

async function createTicket() {
    console.log("Adding tickets")
    // create tickets for them randomly
    for (let i = 6; i <= 8; i++) {
        const tickets = Math.floor(Math.random() * 5) + 1
        for (let j = 0; j < tickets; j++) {
            const sessionID = Math.floor(Math.random() * 10) + 1
            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    id: i
                }
            })
            if (Math.random() * 2 > 1 && user.money > TICKET_PRICE * 4) {
                const session = await prisma.session.findUniqueOrThrow({
                    where: {
                        id: sessionID
                    }
                })
                const tr = await prisma.transaction.create({
                    data: {
                        user: {
                            connect: {
                                id: i
                            }
                        },
                        price: TICKET_PRICE * 4,
                        superTicket: {
                            create: {
                                userId: i,
                                session: {
                                    connect: {
                                        id: sessionID
                                    },
                                },
                            }
                        }
                    }, include: {superTicket: true}
                })
                if (!tr.superTicket) {
                    throw new Error()
                }

                if (session.endDate < new Date()) {
                    await prisma.superTicket.update({
                        where: {
                            id: tr.superTicket.id
                        },
                        data: {
                            used: true,
                            remainingUses: tr.superTicket.remainingUses - 1
                        }
                    })
                }
            } else {
                if (user.money >= TICKET_PRICE) {
                    const session = await prisma.session.findUniqueOrThrow({
                        where: {
                            id: sessionID
                        }
                    })
                    const tr = await prisma.transaction.create({
                        data: {
                            user: {
                                connect: {
                                    id: i
                                }
                            },
                            price: TICKET_PRICE,
                            ticket: {
                                create: {
                                    userId: i,
                                    sessionId: sessionID,
                                }
                            }
                        },
                        include: {
                            ticket: true
                        }
                    })
                    if (!tr.ticket) {
                        throw new Error()
                    }

                    if (session.endDate < new Date()) {
                        await prisma.ticket.update({
                            where: {
                                id: tr.ticket.id
                            },
                            data: {
                                used: true,
                                remainingUses: 0
                            }
                        })
                    }
                }
            }
        }
    }
}

async function main() {
    await createMovie()
    await createRoom()
    await createSession()
    await createUser()
    await createTicket()
    console.log("All done !")
}


main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

function resolveRole(i: number) {
    switch (i) {
        case 1:
            return userRoles.SUPER_ADMIN
        case 2:
            return userRoles.ADMIN
        case 3:
            return userRoles.CONFISERY
        case 4:
            return userRoles.PROJECTIONIST
        case 5:
            return userRoles.ACCUEIL
        default:
            return userRoles.CLASSIC
    }
}

function getRandomDate(start: moment.Moment, end: moment.Moment, startHour: number, endHour: number) {
    const date = new Date((+start.unix() + Math.random() * (end.unix() - start.unix())) * 1000)
    const hour = startHour + Math.random() * (endHour - startHour) | 0
    date.setHours(hour)
    return date
}
