const baseUrl = 'http://localhost:3000'; // Измените, если сервер на другом адресе

// Элементы формы регистрации
const registerForm = document.getElementById('register-form');
const usernameInput = document.getElementById('register-username');
const passwordInput = document.getElementById('register-password');

// Элементы формы авторизации
const loginForm = document.getElementById('login-form');
const loginUsernameInput = document.getElementById('login-username');
const loginPasswordInput = document.getElementById('login-password');

// Элементы для отображения пользователя
const userSection = document.getElementById('user-section');
const usernameSpan = document.getElementById('username');

// Элементы формы добавления фильма
const movieForm = document.getElementById('movie-form');
const titleInput = document.getElementById('title');
const yearInput = document.getElementById('year');
const actorsInput = document.getElementById('actors');
const budgetInput = document.getElementById('budget');
const grossInput = document.getElementById('gross');
const descriptionInput = document.getElementById('description');

// Элементы для отображения списка фильмов
const moviesList = document.getElementById('movies-list');

// Обработчик события для регистрации
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;

  try {
    const response = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const user = await response.json();
      alert(`Пользователь ${user.username} успешно зарегистрирован!`);
      registerForm.reset();
    } else {
      const error = await response.json();
      alert(error.message);
    }
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    alert('Ошибка при регистрации');
  }
});

// Обработчик события для авторизации
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = loginUsernameInput.value;
  const password = loginPasswordInput.value;

  try {
    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);
      loginForm.reset();
      showUser(username);
      displayMovies();
    } else {
      const error = await response.json();
      alert(error.message);
    }
  } catch (error) {
    console.error('Ошибка при авторизации:', error);
    alert('Ошибка при авторизации');
  }
});

// Отображение информации о пользователе
function showUser(username) {
  userSection.style.display = 'block';
  usernameSpan.textContent = username;
}

// Скрытие информации о пользователе
function hideUser() {
  userSection.style.display = 'none';
  usernameSpan.textContent = '';
}

// Обработчик события для добавления фильма
movieForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = titleInput.value;
  const year = yearInput.value;
  const actors = actorsInput.value;
  const budget = budgetInput.value;
  const gross = grossInput.value;
  const description = descriptionInput.value;

  try {
    const response = await fetch(`${baseUrl}/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, year, actors, budget, gross, description })
    });

    if (response.ok) {
      const movie = await response.json();
      alert(`Фильм "${movie.title}" добавлен!`);
      movieForm.reset();
      displayMovies();
    } else {
      const error = await response.json();
      alert(error.message);
    }
  } catch (error) {
    console.error('Ошибка при добавлении фильма:', error);
    alert('Ошибка при добавлении фильма');
  }
});

// Отображение списка фильмов
async function displayMovies() {
  try {
    const response = await fetch(`${baseUrl}/movies`);
    const movies = await response.json();

    moviesList.innerHTML = '';

    movies.forEach(movie => {
      const li = document.createElement('li');
      li.innerHTML = `
        <h3>${movie.title} (${movie.year})</h3>
        <p>Актеры: ${movie.actors}</p>
        <p>Бюджет: ${movie.budget}</p>
        <p>Сборы: ${movie.gross}</p>
        <p>${movie.description}</p>
        <p>Добавил: ${movie.addedBy}</p>
      `;
      moviesList.appendChild(li);
    });
  } catch (error) {
    console.error('Ошибка при загрузке фильмов:', error);
    alert('Ошибка при загрузке фильмов');
  }
}

// Вызов функции для отображения фильмов при загрузке страницы
window.onload = () => {
  displayMovies();
};