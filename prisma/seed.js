const { PrismaClient, Role } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('Password123*', 10)

    const users = [
        {
            username: 'jefred',
            password: hashedPassword,
            email: 'jefred@mail.com',
            fullName: 'Jefred Bedoya',
            role: Role.ADMIN
        },
        {
            username: 'admin',
            password: hashedPassword,
            email: 'admin@mail.com',
            fullName: 'System Administrator',
            role: Role.USER
        },
        {
            username: 'juanperez',
            password: hashedPassword,
            email: 'juan.perez@mail.com',
            fullName: 'Juan Perez',
            role: Role.USER
        },
        {
            username: 'mariagarcia',
            password: hashedPassword,
            email: 'maria.garcia@mail.com',
            fullName: 'Maria Garcia',
            role: Role.USER
        },
        {
            username: 'carlosruiz',
            password: hashedPassword,
            email: 'carlos.ruiz@mail.com',
            fullName: 'Carlos Ruiz',
            role: Role.USER
        },
        {
            username: 'anatorres',
            password: hashedPassword,
            email: 'ana.torres@mail.com',
            fullName: 'Ana Torres',
            role: Role.USER
        },
        {
            username: 'luisgomez',
            password: hashedPassword,
            email: 'luis.gomez@mail.com',
            fullName: 'Luis Gomez',
            role: Role.USER
        },
        {
            username: 'sofiamartinez',
            password: hashedPassword,
            email: 'sofia.martinez@mail.com',
            fullName: 'Sofia Martinez',
            role: Role.USER
        },
        {
            username: 'davidrojas',
            password: hashedPassword,
            email: 'david.rojas@mail.com',
            fullName: 'David Rojas',
            role: Role.USER
        },
        {
            username: 'lauracastro',
            password: hashedPassword,
            email: 'laura.castro@mail.com',
            fullName: 'Laura Castro',
            role: Role.USER
        }
    ]

    const result = await prisma.user.createMany({
        data: users,
        skipDuplicates: true
    })

    console.log(
        `Seed completed. Inserted ${result.count} users.`
    )

    // await prisma.user.deleteMany();

    // console.log('All users deleted');
}

main()
    .catch(error => {
        console.error('Seed failed:', error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })