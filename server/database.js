import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql
.createPool ({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
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

export async function getUsuariosPorEmail(email) {
    const [row] = await pool.query(
        `SELECT * FROM usuarios WHERE email = ?`,
        [email]
    )
    return row[0];
}

export async function getCitasPorDia(clinicaId, fecha) {
  const [rows] = await pool.query(
    `SELECT * FROM citas WHERE clinica_id = ? AND DATE(fecha_hora) = ?`,
    [clinicaId, fecha]
  );

  return rows.map(row => {
    const fecha = new Date(row.fecha_hora);
    let horas = fecha.getHours();
    let minutos = fecha.getMinutes();

    // Formatear horas y minutos para que no tengan cero inicial
    horas = horas.toString();
    minutos = minutos < 10 ? '0' + minutos : minutos.toString();

    return {
      hora: `${horas}:${minutos}`
    };
  });
}

export async function getCitasPorUsuario(usuarioId) {
    const [rows] = await pool.query(
      `SELECT citas.*, clinicas.nombre AS nombre_clinica 
       FROM citas 
       JOIN clinicas ON citas.clinica_id = clinicas.id 
       WHERE citas.usuario_id = ? AND citas.fecha_hora > NOW()`,
      [usuarioId]
    );
  
    return rows;
}  
export async function getCitasPorUsuario(usuarioId) {
    const [rows] = await pool.query(
      `SELECT citas.*, clinicas.nombre AS nombre_clinica 
       FROM citas 
       JOIN clinicas ON citas.clinica_id = clinicas.id 
       WHERE citas.usuario_id = ? AND citas.fecha_hora > NOW()`,
      [usuarioId]
    );
  
    return rows;
}

export async function insertarCita(clinicaId, usuarioId, fechaHora) {
    const result = await pool.query(
        'INSERT INTO citas (clinica_id, usuario_id, fecha_hora) VALUES (?, ?, ?)',
        [clinicaId, usuarioId, fechaHora]
    );
    return result;
}  

export async function getTodasLasClinicas() {
    const [rows] = await pool.query(
        `SELECT * FROM clinicas`
    );
    return rows;
}

export async function cancelarCitaPorId(citaId) {
    const [result] = await pool.query(
        'DELETE FROM citas WHERE id = ?',
        [citaId]
    );

    return result;
}

export async function borrarValoracionPorId(valoracionId) {
    const [result] = await pool.query(
        'DELETE FROM valoraciones WHERE id = ?',
        [valoracionId]
    );

    return result;
}

export async function getTodasLasValoraciones() {
    const [rows] = await pool.query(
        `SELECT vc.id, vc.valoracion, vc.comentario, vc.clinica_id, vc.usuario_id, u.nombre AS nombre_usuario
        FROM valoraciones_clinica vc
        LEFT JOIN usuarios u ON vc.usuario_id = u.id;
        `
    );
    return rows;
}

export async function getValoracionesPorUsuarioId(usuarioId) {
    const [rows] = await pool.query(
        `SELECT vc.id, vc.valoracion, vc.comentario, vc.clinica_id, vc.usuario_id, c.nombre AS nombre_clinica
        FROM valoraciones_clinica vc
        LEFT JOIN clinicas c ON vc.clinica_id = c.id
        WHERE vc.usuario_id = ?`,
        [usuarioId]
    );
    return rows;
}

export async function getTodosLosUsuarios() {
    const [rows] = await pool.query(
        `SELECT * FROM usuarios`
    );
    return rows;
}

export async function updateFotoPerfil() {
    const [result] = await pool.query(
        `UPDATE usuarios SET foto_perfil_url = ? WHERE id = ?`,
        [nuevaUrl, usuarioId]
    );
    return result.affectedRows;
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
