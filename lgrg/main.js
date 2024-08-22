const express = require('express');
const mysql2 = require('mysql2/promise');
const path = require('path');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

// Создает пул соединений с базой данных MySQL, что позволяет эффективно управлять ресурсами при большом количестве одновременных запросов.
const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    database: 'usersprofile',
    password: '',
});

const app = express(); // Инициализирует новый экземпляр приложения Express.

app.use(express.static(path.join(__dirname))); // Обрабатывает статические файлы из текущего каталога
app.use(bodyParser.json()); // Парсит JSON тело запроса


app.get('/generate-code', (req, res) => {
    const code = uuidv4(); // Генерируйте уникальный ID
    res.send({ code }); // Отправьте код обратно клиенту
});

// Отвечает на GET запрос к корневому URL, выводит сообщение в консоль и отправляет HTML файл log.html.
app.get('/', (req, res) => {
    console.log('Root route accessed, serving log.html');
    res.sendFile(path.join(__dirname, 'log.html'));
});

// Обрабатывает GET запросы к /users, выполняет SQL-запрос к базе данных для получения всех пользователей и отправляет результат в формате JSON.
app.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM user');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
// Отправляет HTML файл main.html в ответ на GET запрос к /main.
app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});
// Аналогично предыдущему, но для маршрута /log.
app.get('/log', (req, res) => {
    res.sendFile(path.join(__dirname, 'log.html'));
});
// Отправляет HTML файл reg.html в ответ на GET запрос к /reg.
app.get('/reg', (req, res) => {
    res.sendFile(path.join(__dirname, 'reg.html'));
});
// Запуск сервера
app.listen(3000, () => {
    console.log('Server started!');
});
// Обрабатывает POST запросы к /users, добавляет нового пользователя в базу данных с указанным email и паролем.
app.post('/users', async (req, res) => {
    const { Email, Password} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(Password, 10); 
        const [result] = await pool.query(
            `INSERT INTO user (Email, Password) VALUES (?,?)`,
            [Email, hashedPassword]
        );
        res.status(201).json({ message: "The user has been successfully added" });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while adding a user.');
    }
});
// Обрабатывает POST-запросы на вход в систему. Пользователь отправляет свои учетные данные (Email и Пароль), которые затем проверяются на соответствие записям в базе данных.
app.post('/login', async (req, res) => {
    const { Email, Password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM user WHERE Email = ?', [Email]);
        if (rows.length > 0) {
            const user = rows[0];
            const validPassword = await bcrypt.compare(Password, user.Password);
            if (validPassword) {
                res.json({ success: true, message: "The user has successfully logged in" });
            } else {
                res.status(401).json({ success: false, message: "Invalid password" });
            }
        } else {
            res.status(404).json({ success: false, message: "The user was not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
// Получает уровень пользователя по его Email. Этот метод используется для определения доступных прав пользователя внутри системы.
app.get('/user-level', async (req, res) => {
    const { email } = req.query; 
    try {
        const [rows] = await pool.query('SELECT Level FROM user WHERE Email = ?', [email]);
        if (rows.length > 0) {
            const userLevel = rows[0].Level; 
            res.json({ level: userLevel });
        } else {
            res.status(404).json({ success: false, message: "The user was not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
// Удаляет пользователя из базы данных по предоставленному ID.
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query(`DELETE FROM user WHERE id = ?`, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send('User not found.');
        }
        res.sendStatus(204);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while deleting the user.');
    }
});
// Этот метод обрабатывает PUT-запрос на изменение уровня пользователя в базе данных.
app.put('/change-user-level', async (req, res) => {
    const { userId, newLevel } = req.body;
    try {
        const [result] = await pool.query(
            `UPDATE user SET Level = ? WHERE id = ?`,
            [newLevel, userId]
        );
        if (result.changedRows === 0) {
            return res.status(404).send('User not found or no changes made.');
        }
        res.status(200).json({ message: "The user's level has been successfully changed" });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred when changing the user level.');
    }
});
// Отправляет HTML файл faq.html в ответ на GET запрос к /faq.
app.get('/faq', (req, res) => {
    res.sendFile(path.join(__dirname, 'faq.html'));
});