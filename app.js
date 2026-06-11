require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const { validateUserData, validateUserUpdate, checkIdCollision } = require('./utils/validateUser')
const { LoggerMiddleware } = require('./middlewares/logger')

const usersFilePath = path.join(__dirname, 'users.json')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
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

app.listen(PORT, () => {
    console.log(`Listening On http://localhost:${PORT}`)
});

