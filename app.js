require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const fs = require('fs')
const path = require('path')
const { validateUserData, validateUserUpdate, checkIdCollision } = require('./utils/validateUser')
const { validateRegisterData } = require('./utils/validateRegister')
const { LoggerMiddleware } = require('./middlewares/logger')
const ErrorHandlerMiddleware = require('./middlewares/errorHandler')
const { authenticateToken } = require('./middlewares/auth')

const usersFilePath = path.join(__dirname, 'users.json')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(LoggerMiddleware)

const PORT = process.env.PORT

app.get('/', (req, res) => {
    res.send(`
        <h1>Curso Express JS</h1>
        <p>Aplicativo NodeJS con express</p>
        <p>Running on ${PORT}</p>
        `)
})

app.get('/users/:id', (req, res) => {
    const userId = req.params.id
    res.send(`Mostrar informacion del usuarion con ID: ${userId}`)
})

app.get('/search', (req, res) => {
    const terms = req.query.terms || `No especificado`
    const category = req.query.category || `Todas`
    res.send(`
        <h2>Resultados De Busqueda</h2>
        <p>Termino: ${terms}</p>
        <p>Categoria: ${category}</p>
        `)
})

app.post('/form', (req, res) => {
    const name = req.body.name || `Anonimo`
    const email = req.body.email || `N/G`
    res.status(201).json({
        message: `Datos recibidos con exito`,
        data: {
            name,
            email
        }
    })
})

app.post('/api/data', (req, res) => {
    const data = req.body
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'No se han recibido datos' })
    }

    res.status(201).json({
        message: "Datos JSON recibidos",
        data
    })
})

app.get('/users', (req, res) => {
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                error: `Error con conexion de datos:
                ${err}
            ` })
        }
        const users = JSON.parse(data)
        res.json(users)
    })
})

app.post('/users', (req, res) => {
    const newUser = req.body;

    const validation = validateUserData(newUser);
    if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
    }

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: `Error con conexion de datos: ${err}` });
        }

        const users = JSON.parse(data);

        if (checkIdCollision(newUser.id, users)) {
            return res.status(409).json({ error: `User with id ${newUser.id} already exists` });
        }

        users.push(newUser);
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: `Error con conexion de datos: ${err}` });
            }
            return res.status(201).json(newUser);
        });
    });
});

app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const updatedUser = req.body;

    const validation = validateUserUpdate(updatedUser);
    if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
    }

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: `Error desde el server: ${err}` });
        }

        let users = JSON.parse(data);

        const userExists = users.some(user => user.id === userId);
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        let finalUpdatedUser;
        users = users.map(user => {
            if (user.id === userId) {
                finalUpdatedUser = { ...user, ...updatedUser, id: userId };
                return finalUpdatedUser;
            }
            return user;
        });

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: `Error al actualizar el usuario: ${err}` });
            }
            return res.json(finalUpdatedUser);
        });
    });
});

app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10)
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: `Error desde el server: ${err}` });
        }

        let users = JSON.parse(data);
        users = users.filter(user => user.id !== userId);

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: `Error al eliminar el usuario: ${err}` });
            }
            return res.status(204).send();
        });
    })
})

app.get('/db-users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        })
        res.json(users)
    } catch (error) {
        return res.status(500).json({ error: `Error desde el server: ${error}` })
    }
})

app.get('/secret-profile', authenticateToken, (req,res) => {
    res.send('Esta ruta es privada y solo usuarios autenticados pueden verla')
})

app.post('/register', async (req, res) => {
    try {
        const validation = validateRegisterData(req.body)

        if (!validation.valid) {
            return res.status(400).json({
                error: validation.message
            })
        }

        const {
            username,
            email,
            password,
            fullName
        } = req.body

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        })

        if (existingUser) {
            return res.status(409).json({
                error: 'Username or email already exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                fullName
            },
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        })

        return res.status(201).json({
            message: 'User created successfully',
            user
        })

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            error: 'Internal server error'
        })
    }
})

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({
                error: 'Username and password are required'
            })
        }

        const user = await prisma.user.findUnique({
            where: {
                username
            }
        })

        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials'
            })
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        )

        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid credentials'
            })
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        )

        return res.status(200).json({
            message: 'Login successful',
            token
        })

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            error: 'Internal server error'
        })
    }
})


app.use(ErrorHandlerMiddleware)

app.listen(PORT, () => {
    console.log(`Listening On http://localhost:${PORT}`)
});

