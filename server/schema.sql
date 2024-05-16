DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS valoraciones_clinica;
DROP TABLE IF EXISTS citas;
DROP TABLE IF EXISTS clinicas;
DROP TABLE IF EXISTS usuarios;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    tipo ENUM('usuario_corriente', 'dueño_clinica') NOT NULL,
    foto_perfil_url VARCHAR(255) -- Ruta de la imagen de perfil
);

-- Tabla de clínicas
CREATE TABLE clinicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    foto_logo_url VARCHAR(255),
    dueño_id INT,
    FOREIGN KEY (dueño_id) REFERENCES usuarios(id)
);

-- Tabla de citas
CREATE TABLE citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clinica_id INT,
    usuario_id INT,
    fecha_hora DATETIME NOT NULL,
    FOREIGN KEY (clinica_id) REFERENCES clinicas(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de valoraciones de la clínica
CREATE TABLE valoraciones_clinica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clinica_id INT,
    valoracion FLOAT NOT NULL,
    comentario TEXT,
    FOREIGN KEY (clinica_id) REFERENCES clinicas(id)
);

-- Tabla de blogs
CREATE TABLE blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    autor_id INT,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    fecha_publicacion DATE NOT NULL,
    FOREIGN KEY (autor_id) REFERENCES usuarios(id)
);
