from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)

# Файл данных
data_file = os.path.join(os.path.dirname(__file__), 'data', 'movies.json')

# Загрузка данных из файла
def load_movies():
    try:
        with open(data_file, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

# Сохранение данных в файл
def save_movies(movies):
    with open(data_file, 'w') as f:
        json.dump(movies, f, indent=2)

# Список пользователей (в памяти)
users = []

# Загрузка данных при запуске сервера
movies = load_movies()

# Маршрут для получения всех фильмов
@app.route('/movies', methods=['GET'])
def get_movies():
    return jsonify(movies)

# Маршрут для добавления фильма
@app.route('/movies', methods=['POST'])
def add_movie():
    new_movie = request.get_json()
    new_movie['addedBy'] = 'Anonymous'  # Добавление автора
    movies.append(new_movie)
    save_movies(movies)
    return jsonify(new_movie), 201

# Маршрут для обновления фильма
@app.route('/movies/<int:movie_id>', methods=['PUT'])
def update_movie(movie_id):
    updated_movie = request.get_json()
    movie_index = next((index for index, movie in enumerate(movies) if movie['id'] == movie_id), None)
    if movie_index is not None:
        movies[movie_index] = updated_movie
        save_movies(movies)
        return jsonify(updated_movie)
    else:
        return jsonify({'message': 'Фильм не найден'}), 404

# Маршрут для удаления фильма
@app.route('/movies/<int:movie_id>', methods=['DELETE'])
def delete_movie(movie_id):
    movie_index = next((index for index, movie in enumerate(movies) if movie['id'] == movie_id), None)
    if movie_index is not None:
        del movies[movie_index]
        save_movies(movies)
        return jsonify({'message': 'Фильм удален'})
    else:
        return jsonify({'message': 'Фильм не найден'}), 404

# Маршрут для регистрации пользователя
@app.route('/users', methods=['POST'])
def register_user():
    new_user = request.get_json()
    if any(user['username'] == new_user['username'] for user in users):
        return jsonify({'message': 'Пользователь с таким именем уже существует'}), 409
    users.append(new_user)
    return jsonify(new_user), 201

# Маршрут для авторизации (простой)
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = next((user for user in users if user['username'] == data['username'] and user['password'] == data['password']), None)
    if user:
        return jsonify({'message': 'Авторизация успешна'})
    else:
        return jsonify({'message': 'Неверный логин или пароль'}), 401

# Запуск сервера
if __name__ == '__main__':
    app.run(debug=True)