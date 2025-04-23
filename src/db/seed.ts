import {PrismaClient} from './client'
import {userRoles} from '../types/currentUser'
import {config} from "../config/config"

const prisma = new PrismaClient()

const TICKET_PRICE = config.ticketPrice

async function main() {
    //create 5 movies
    console.log("Adding movies")
    for (let i = 1; i < 6; i++) {
        await prisma.movie.create({
            data: {
                name: `movie${i}`,
                duration: (Math.random() * 61) + 60,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        })
    }
    //create 10 rooms
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

    //create 10 sessions
    console.log("Adding sessions")
    for (let i = 1; i <= 10; i++) {
        const date = new Date().getTime() + (i % 3 == 0 ? i + 5 : -i - 5) * 1000 * 60 * 60
        const id = Math.floor(Math.random() * 5) + 1
        const m = await prisma.movie.findUniqueOrThrow({
            where: {id: id}
        })
        const endDate = new Date(date + (m.duration * 60 * 1000) + (1000 * 30 * 60 * 60))
        await prisma.session.create({
            data: {
                startDate: new Date(date),
                endDate: endDate,
                movieId: id,
                roomId: Math.floor(Math.random() * 10) + 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        })
    }

    //create 8 users
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
    console.log("Adding tickets")
    // create tickets for them randomly
    for (let i = 6; i <= 8; i++) {
        const tickets = Math.floor(Math.random() * 5) + 1
        for (let j = 0; j < tickets; j++) {
            const id = Math.floor(Math.random() * 10) + 1
            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    id: i
                }
            })
            if (Math.random() * 2 > 1 && user.money > TICKET_PRICE * 4) {
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
                                        id: id
                                    },
                                },
                            }
                        }
                    }, include: {superTicket: true}
                })
                if (!tr.superTicket) {
                    throw new Error()
                }
                const session = await prisma.session.findUniqueOrThrow({
                    where: {
                        id: id
                    }
                })
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
                                    sessionId: id,
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
                    const session = await prisma.session.findUniqueOrThrow({
                        where: {
                            id: id
                        }
                    })
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
