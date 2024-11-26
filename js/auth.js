const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const users = [ // Test
    { id: 1, username: 'lucasbggv2001@gmail.com', password: 'password123' },
    { id: 2, username: 'test@test.com', password: 'password123' }
];

// Se necesita para generar token
const SECRET_KEY = 'clave_secreta';

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Error' });
    }

    // Se genera el token usando jsonwbtoken
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
});

module.exports = router;
