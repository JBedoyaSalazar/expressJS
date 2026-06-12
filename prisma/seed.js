const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('Password123*', 10)

    const users = [
        {
            username: 'jefred',
            password: hashedPassword,
            email: 'jefred@mail.com',
            fullName: 'Jefred Bedoya'
        },
        {
            username: 'admin',
            password: hashedPassword,
            email: 'admin@mail.com',
            fullName: 'System Administrator'
        },
        {
            username: 'juanperez',
            password: hashedPassword,
            email: 'juan.perez@mail.com',
            fullName: 'Juan Perez'
        },
        {
            username: 'mariagarcia',
            password: hashedPassword,
            email: 'maria.garcia@mail.com',
            fullName: 'Maria Garcia'
        },
        {
            username: 'carlosruiz',
            password: hashedPassword,
            email: 'carlos.ruiz@mail.com',
            fullName: 'Carlos Ruiz'
        },
        {
            username: 'anatorres',
            password: hashedPassword,
            email: 'ana.torres@mail.com',
            fullName: 'Ana Torres'
        },
        {
            username: 'luisgomez',
            password: hashedPassword,
            email: 'luis.gomez@mail.com',
            fullName: 'Luis Gomez'
        },
        {
            username: 'sofiamartinez',
            password: hashedPassword,
            email: 'sofia.martinez@mail.com',
            fullName: 'Sofia Martinez'
        },
        {
            username: 'davidrojas',
            password: hashedPassword,
            email: 'david.rojas@mail.com',
            fullName: 'David Rojas'
        },
        {
            username: 'lauracastro',
            password: hashedPassword,
            email: 'laura.castro@mail.com',
            fullName: 'Laura Castro'
        }
    ]

    const result = await prisma.user.createMany({
        data: users,
        skipDuplicates: true
    })

    console.log(
        `Seed completed. Inserted ${result.count} users.`
    )
}

main()
    .catch(error => {
        console.error('Seed failed:', error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })