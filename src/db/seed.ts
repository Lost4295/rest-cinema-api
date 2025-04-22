import {PrismaClient} from './client'
import {userRoles} from '../types/currentUser'

const prisma = new PrismaClient()

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
                onMaintenance: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        })
    }

    //create 10 sessions
    console.log("Adding sessions")
    for (let i = 1; i <= 10; i++) {
        await prisma.session.create({
            data: {
                startDate: new Date(new Date().getTime() + (i % 3 == 0 ? i : -i) * 1000 * 60 * 60),
                endDate: new Date(new Date().getTime() + (i % 3 == 0 ? i : -i) * 1000 * 60 * 60 + 1000 * 60 * 60),
                movieId: Math.floor(Math.random() * 5) + 1,
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
            let t
            if (Math.random() * 2 > 1) {
                t = await prisma.ticket.create({
                    data: {
                        userId: i,
                        sessionId: id,
                    }
                })
                const session = await prisma.session.findUniqueOrThrow({
                    where: {
                        id: id
                    }
                })
                if (session.endDate < new Date()) {
                    await prisma.ticket.update({
                        where: {
                            id: t.id
                        },
                        data: {
                            used: true,
                            remainingUses: 0
                        }
                    })
                }
            } else {
                t = await prisma.superTicket.create({
                    data: {
                        userId: i,
                        session: {
                            connect: {
                                id: id
                            },
                        }
                    }
                })
                const session = await prisma.session.findUniqueOrThrow({
                    where: {
                        id: id
                    }
                })
                if (session.endDate < new Date()) {
                    await prisma.superTicket.update({
                        where: {
                            id: t.id
                        },
                        data: {
                            used: true,
                            remainingUses: t.remainingUses - 1
                        }
                    })
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
