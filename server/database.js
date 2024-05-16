import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql
.createPool ({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
})
.promise();

export async function getUsuariosPorID(id) {
    const [row] = await pool.query(
        `SELECT * FROM usuarios WHERE id = ?`,
        [id]
    )
    return row[0];
}

export async function getTodasLasClinicas() {
    const [rows] = await pool.query(
        `SELECT * FROM clinicas`
    );
    return rows;
}

export async function getTodosLosUsuarios() {
    const [rows] = await pool.query(
        `SELECT * FROM usuarios`
    );
    return rows;
}

export async function checkLogin(email, password) {
    const [rows] = await pool.query(
        `SELECT * FROM usuarios WHERE email = ? and password = ?`,
        [email, password]
    );
    return rows;
}

export async function registerUser(dni, nombre, fecha_nacimiento, email, password) {
    const [rows] = await pool.query(
        `INSERT INTO usuarios (dni, nombre, fecha_nacimiento, email, password) VALUES (?, ?, ?, ?, ?)`,
        [dni, nombre, fecha_nacimiento, email, password]
      );
      return rows.insertId;
}