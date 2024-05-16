-- Añadir usuarios
INSERT INTO usuarios (dni, nombre, fecha_nacimiento, email, tipo)
VALUES
('11111111A', 'Usuario Dueño 1', '1990-01-01', 'usuario_dueño1@example.com', 'dueño_clinica'),
('22222222B', 'Usuario Dueño 2', '1985-05-15', 'usuario_dueño2@example.com', 'dueño_clinica'),
('33333333C', 'Usuario Corriente 1', '1995-09-20', 'usuario_corriente1@example.com', 'usuario_corriente'),
('44444444D', 'Usuario Corriente 2', '1992-03-10', 'usuario_corriente2@example.com', 'usuario_corriente'),
('55555555E', 'Usuario Corriente 3', '1988-07-08', 'usuario_corriente3@example.com', 'usuario_corriente'),
('66666666F', 'Usuario Corriente 4', '1993-11-25', 'usuario_corriente4@example.com', 'usuario_corriente'),
('77777777G', 'Usuario Corriente 5', '1991-02-14', 'usuario_corriente5@example.com', 'usuario_corriente'),
('88888888H', 'Usuario Corriente 6', '1987-06-30', 'usuario_corriente6@example.com', 'usuario_corriente'),
('99999999I', 'Usuario Corriente 7', '1996-08-12', 'usuario_corriente7@example.com', 'usuario_corriente'),
('10101010J', 'Usuario Corriente 8', '1989-12-05', 'usuario_corriente8@example.com', 'usuario_corriente');

-- Añadir clínicas
INSERT INTO clinicas (nombre, ubicacion, telefono, dueño_id)
VALUES
('Clínica 1', 'Dirección Clínica 1', '123456789', 1), -- Dueño: Usuario Dueño 1
('Clínica 2', 'Dirección Clínica 2', '987654321', 2); -- Dueño: Usuario Dueño 2

-- Añadir valoraciones para Clínica 1
INSERT INTO valoraciones_clinica (clinica_id, valoracion, comentario)
VALUES
(1, 4.5, 'Excelente clínica, personal muy amable.'),
(1, 3.8, 'Buenos servicios, pero podría mejorar en la puntualidad.'),
(1, 5.0, 'Muy satisfecho con el tratamiento recibido.'),
(1, 4.0, 'Instalaciones limpias y modernas.'),
(1, 4.2, 'Profesionales muy cualificados.');

-- Añadir valoraciones para Clínica 2
INSERT INTO valoraciones_clinica (clinica_id, valoracion, comentario)
VALUES
(2, 4.0, 'Buena atención al cliente, pero precios elevados.'),
(2, 3.5, 'Trato correcto, pero la espera fue larga.'),
(2, 4.8, 'Gran experiencia en general, altamente recomendado.'),
(2, 4.2, 'Instalaciones acogedoras, personal atento.'),
(2, 3.0, 'Experiencia aceptable, pero no excelente.');
