const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = 'your_secret_key';
const EXPIRATION_TIME = '1m'; // 1 minute for demo

const users = {
  admin: { password: 'admin', role: 'ADMIN' },
  writer: { password: 'writer', role: 'WRITER' },
  visitor: { password: 'visitor', role: 'VISITOR' }
};

const movies = [];
let movieId = 1;

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (user && user.password === password) {
    const token = jwt.sign({ username, role: user.role }, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.sendStatus(403);
    }
  };
};

app.get('/movies', authenticateJWT, (req, res) => {
  res.json(movies);
});

app.post('/movies', authenticateJWT, authorize(['ADMIN', 'WRITER']), (req, res) => {
  const movie = { id: movieId++, ...req.body, likes: 0 };
  movies.push(movie);
  res.status(201).json(movie);
});

app.put('/movies/:id', authenticateJWT, authorize(['ADMIN', 'WRITER']), (req, res) => {
  const movie = movies.find(m => m.id === parseInt(req.params.id));
  if (movie) {
    Object.assign(movie, req.body);
    res.json(movie);
  } else {
    res.sendStatus(404);
  }
});

app.delete('/movies/:id', authenticateJWT, authorize(['ADMIN']), (req, res) => {
  const movieIndex = movies.findIndex(m => m.id === parseInt(req.params.id));
  if (movieIndex > -1) {
    movies.splice(movieIndex, 1);
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
