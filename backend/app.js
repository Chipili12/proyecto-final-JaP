const express = require("express");
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const app = express(); // Crea una instancia de ExpressJS

app.use(bodyParser.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ecommerce',
    password: 'postgres',
    port: '5432'
})

// inicia el servidor y muestra el puerto.


//Trae el listado de categorías.
app.get("/cats/cat.json", (req, res) => {
    const filePath = path.join(__dirname, 'cats', 'cat.json'); //directorio del Json

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error reading the file");
        }

        res.setHeader('Content-Type', 'application/json'); // Explicita que el tipo de archivo es Json
        res.send(data); //Envia la información dentro de cat.json.
    });
});

//Trae el listado de productos de una categoría.
app.get("/cats_products/:id.json", (req, res) => {
    const { id } = req.params
    const filePath = path.join(__dirname, 'cats_products', `${id}.json`); //directorio del Json

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error reading the file");
        }

        res.setHeader('Content-Type', 'application/json'); // Explicita que el tipo de archivo es Json
        res.send(data); //Envia la información dentro de cat.json.
    });
});

//Trae un producto específico.
app.get("/products/:id.json", (req, res) => {
    const { id } = req.params
    const filePath = path.join(__dirname, 'products', `${id}.json`); //directorio del Json

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error reading the file");
        }

        res.setHeader('Content-Type', 'application/json'); // Explicita que el tipo de archivo es Json
        res.send(data); //Envia la información dentro de cat.json.
    });
});

//Trae una lista de comentarios de cierto producto.
app.get("/products_comments/:id.json", (req, res) => {
    const { id } = req.params
    const filePath = path.join(__dirname, 'products_comments', `${id}.json`); //directorio del Json

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error reading the file");
        }

        res.setHeader('Content-Type', 'application/json'); // Explicita que el tipo de archivo es Json
        res.send(data); //Envia la información dentro de cat.json.
    });
});

//Trae el carrito de un usuario.
app.get("/user_cart/:id.json", (req, res) => {
    const { id } = req.params
    const filePath = path.join(__dirname, 'user_cart', `${id}.json`); //directorio del Json

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error reading the file");
        }

        res.setHeader('Content-Type', 'application/json'); // Explicita que el tipo de archivo es Json
        res.send(data); //Envia la información dentro de cat.json.
    });
});


//login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const result = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Crea un token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '5m' }
        );

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/cart', async (req, res) => {
    const cart = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO Carts (email) VALUES ($1) RETURNING email',
            [cart.email],
            'INSERT '
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})


// Datos del carrito
const email="pijarica@pijarica.com";
const cartItems = [
    {
        product_id: 50922,
        quantity: 1, // Fiat Way
    },
    {
        product_id: 50741,
        quantity: 5, // Oso de peluche
    },
];

// Función para insertar productos en el carrito
async function addItemsToCart(email,items) {
    const client = await pool.connect(); // Conectarse a la base de datos

    try {
        await client.query('BEGIN'); // Iniciar transacción

        const insertQuery = `
      INSERT INTO cart_items (email, product_id, count)
      VALUES ($1, $2, $3)
      ON CONFLICT (email, product_id) DO UPDATE
      SET count = $3
    `;
        // Insertar cada producto en la tabla cart_items
        for (const item of items) {
            await client.query(insertQuery, [email, item.product_id, item.quantity]);
        }

        await client.query('COMMIT'); // Confirmar transacción
        console.log('Productos agregados al carrito exitosamente');
    } catch (error) {
        await client.query('ROLLBACK'); // Revertir cambios en caso de error
        console.error('Error al agregar productos al carrito:', error);
    } finally {
        client.release(); // Liberar conexión
    }
}

// Llamar a la función con los datos del carrito
addItemsToCart(email,cartItems)
    .then(() => console.log('Finalizado'))
    .catch((err) => console.error('Error general:', err));



app.listen(3000, () => {
    console.log(`Servidor corriendo en http://localhost:3000`);
});