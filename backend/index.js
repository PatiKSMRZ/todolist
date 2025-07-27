const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { use } = require('react');
const authMiddleware = require('./middleware/authMiddleware');


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

// Endpoint chroniony - pobieranie zadań użytkownika
app.get('/todos', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const todos = await prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd podczas pobierania zadań' });
  }
});


app.post('/todos', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // ID użytkownika z tokena
    const { title } = req.body; // tytuł zadania przesłany z frontu

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Tytuł zadania jest wymagany' });
    }

    const newTodo = await prisma.todo.create({
      data: {
        title,
        userId,
      },
    });

    res.status(201).json(newTodo); // zwracamy nowo utworzone zadanie
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd podczas tworzenia zadania' });
  }
});

app.patch('/todos/:id', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const todoId = parseInt(req.params.id);
  const { title, completed } = req.body;

  try {
    // Sprawdź czy zadanie należy do użytkownika
    const existingTodo = await prisma.todo.findUnique({ where: { id: todoId } });
    if (!existingTodo || existingTodo.userId !== userId) {
      return res.status(404).json({ error: 'Zadanie nie znalezione' });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: {
        ...(title !== undefined && { title }),
        ...(completed !== undefined && { completed }),
      },
    });

    res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd podczas aktualizacji zadania' });
  }
});

// DELETE /todos/:id - usuwanie zadania
app.delete('/todos/:id', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const todoId = parseInt(req.params.id);

  try {
    const existingTodo = await prisma.todo.findUnique({ where: { id: todoId } });
    if (!existingTodo || existingTodo.userId !== userId) {
      return res.status(404).json({ error: 'Zadanie nie znalezione' });
    }

    await prisma.todo.delete({ where: { id: todoId } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Błąd podczas usuwania zadania' });
  }
});



// Start serwera
app.listen(4000, () => {
  console.log('✅ Backend działa na http://localhost:4000');
});