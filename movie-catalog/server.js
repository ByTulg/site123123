const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, 'data', 'movies.json');
let movies = loadMovies(); // Загрузка данных из файла

// Загрузка данных из файла JSON
function loadMovies() {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка при загрузке фильмов:', error);
    return [];
  }
}

// Сохранение данных в файл JSON
function saveMovies(movies) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(movies, null, 2), 'utf8');
  } catch (error) {
    console.error('Ошибка при сохранении фильмов:', error);
  }
}

// Пользователи (в памяти, пока нет базы данных)
let users = [];

// Маршрут для получения всех фильмов
app.get('/movies', (req, res) => {
  res.json(movies);
});

// Маршрут для добавления фильма
app.post('/movies', (req, res) => {
  const newMovie = req.body;
  newMovie.addedBy = req.user ? req.user.username : 'Anonymous'; // Добавление автора
  movies.push(newMovie);
  saveMovies(movies);
  res.status(201).json(newMovie);
});

// Маршрут для обновления фильма
app.put('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedMovie = req.body;
  const movieIndex = movies.findIndex(movie => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Фильм не найден' });
  }

  movies[movieIndex] = updatedMovie;
  saveMovies(movies);
  res.json(updatedMovie);
});

// Маршрут для удаления фильма
app.delete('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movieIndex = movies.findIndex(movie => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Фильм не найден' });
  }

  movies.splice(movieIndex, 1);
  saveMovies(movies);
  res.json({ message: 'Фильм удален' });
});

// Маршрут для регистрации пользователя
app.post('/users', (req, res) => {
  const newUser = req.body;
  if (users.find(user => user.username === newUser.username)) {
    return res.status(409).json({ message: 'Пользователь с таким именем уже существует' });
  }
  users.push(newUser);
  res.status(201).json(newUser);
});

// Маршрут для авторизации (простой)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    req.user = user; // Запись пользователя в req
    res.json({ message: 'Авторизация успешна' });
  } else {
    res.status(401).json({ message: 'Неверный логин или пароль' });
  }
});

// Middleware для проверки авторизации
app.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: 'Необходимо авторизоваться' });
  }
});

// Маршрут для получения данных о текущем пользователе
app.get('/user', (req, res) => {
  res.json(req.user);
});

// Запуск сервера
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});