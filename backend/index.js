const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { use } = require('react');


const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const JWT_TOKEN = 'tajny_klucz';


// GET /users – pobieranie użytkowników
app.get('/User', async (req, res) => {
  const users = await prisma.User.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    }
  });
  res.json(users);
});

// POST /users – dodawanie użytkownika / rejestracja (bez haszowania)
app.post('/User', async (req, res) => {
  const { name, email, password } = req.body;
  try {
  //  const user = await prisma.User.create({ stary kod - przed hashowaniem hasła
 //     data: { name, email, password },
//    });

      const existingUser = await prisma.User.findUnique({ where: {email}});
        if (existingUser) {
          return res.status(400).json({ error: 'Email jest już zajęty'});
        }
        //haszowanie hasła
         const hashedPassword = await bcrypt.hash(password, 10);
         //uzytkownik z haszem zamiast hasła
         const user = await prisma.User.create({
          data: {name, email, password: hashedPassword },
         });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd podczas dodawania użytkownika' });
  }
});

// POST /login 
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.User.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    } const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch) {
      return res.status(401).json({error: 'nieprawidłowy email lub hasło'});
    }

    //generowanie tokena JWT
    const token = jwt.sign(
      {id: user.id, email: user.email, name: user.name},
      JWT_TOKEN, {expiresIn: '2h'}
    );


    res.json({token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Wewnętrzny błąd serwera' });
  }
});

// Start serwera
app.listen(4000, () => {
  console.log('✅ Backend działa na http://localhost:4000');
});