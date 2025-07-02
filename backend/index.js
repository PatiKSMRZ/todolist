const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// GET /users – pobieranie użytkowników
app.get('/User', async (req, res) => {
  const users = await prisma.User.findMany();
  res.json(users);
});

// POST /users – dodawanie użytkownika / rejestracja (bez haszowania)
app.post('/User', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await prisma.User.create({
      data: { name, email, password },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd podczas dodawania użytkownika' });
  }
});

// POST /login – prosty login bez JWT i bez haszowania
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.User.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    }

    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Wewnętrzny błąd serwera' });
  }
});

// Start serwera
app.listen(4000, () => {
  console.log('✅ Backend działa na http://localhost:4000');
});