import express from 'express';
import {
    getTodasLasClinicas,
    getUsuariosPorID,
    getUsuariosPorEmail,
    getTodosLosUsuarios,
    checkLogin,
    registerUser,
    getTodasLasValoraciones,
    getCitasPorDia,
    insertarCita,
    getCitasPorUsuario,
} from "./database.js";
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const corsOptions = {
    methods: ["POST", "GET"],
    credentials: true,
};

const app = express();
app.use (express.json()); //Refresca el servidor al hacer cualquier cambio
app.use(cors(corsOptions));

app.get("/usuarios/:id", async (req, res) => {
    const usuarios = await getUsuariosPorID(req.params.id);
    res.status(200).send(usuarios);
})

app.get("/usuariosmail/:email", async (req, res) => {
    const usuario = await getUsuariosPorEmail(req.params.email);
    res.status(200).send(usuario);
})

app.get("/citas/:clinicaId/:dia", async (req, res) => {
    const citas = await getCitasPorDia(req.params.clinicaId, req.params.dia);
    res.status(200).send(citas);
})

app.get("/citas/:usuarioId", async (req, res) => {
    const citas = await getCitasPorUsuario(req.params.usuarioId);
    res.status(200).send(citas);
})

app.get("/clinicas", async (req, res) => {
    const clinicas = await getTodasLasClinicas();
    res.status(200).send(clinicas);
})

app.get("/valoraciones", async (req, res) => {
    const valoraciones = await getTodasLasValoraciones();
    res.status(200).send(valoraciones);
})

app.get("/usuarios", async (req, res) => {
    const usuarios = await getTodosLosUsuarios();
    res.status(200).send(usuarios);
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Verificar si se proporcionaron tanto el nombre de usuario como la contraseña
    if (!email || !password) {
        return res.status(400).json({ error: 'Se requiere un nombre de usuario y una contraseña.' });
    }

    try {
        // Llamar a la función checkLogin para verificar las credenciales
        const usuario = await checkLogin(email, password);

        // Verificar si se encontraron resultados de la consulta
        if (usuario.length === 1) {
            // Si se encontró un usuario con las credenciales proporcionadas, el inicio de sesión es exitoso
            return res.status(200).json({ message: 'Inicio de sesión exitoso.' });
        } else {
            // Si no se encontró ningún usuario con las credenciales proporcionadas, devolver un error
            return res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
})

app.post('/insertar-cita', async (req, res) => {
    const { clinicaId, usuarioId, fechaHora } = req.body;

    // Verificar si se proporcionaron todos los datos necesarios para la cita
    if (!clinicaId || !usuarioId || !fechaHora) {
        return res.status(400).json({ error: 'Se requieren todos los campos para insertar una cita.' });
    }

    try {
        // Llamar a la función insertarCita para insertar la cita en la base de datos
        const citaId = await insertarCita(clinicaId, usuarioId, fechaHora);

        // Verificar si se pudo insertar la cita correctamente
        if (citaId) {
            // Si la cita se insertó correctamente, devolver un mensaje de éxito
            return res.status(200).json({ message: 'Cita confirmada', citaId });
        } else {
            // Si hubo un problema al insertar la cita, devolver un error
            return res.status(500).json({ error: 'No se pudo insertar la cita.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.post('/register', async (req, res) => {
    const {email, nombre, dni, fecha_nacimiento, password1, password2} = req.body;
    
    // Verificar si se proporcionaron todos los campos requeridos
    if (!dni || !nombre || !fecha_nacimiento || !email || !password1 || !password2) {
        return res.status(400).json({ error: 'Se requieren todos los campos para el registro.' });
    } else if (password1 !== password2) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    try {

        // Llamar a la función createUser para insertar un nuevo usuario en la base de datos
        const userId = await registerUser(dni, nombre, fecha_nacimiento, email, password1);

        // Si se insertó el usuario correctamente, devolver un mensaje de éxito
        return res.status(200).json({ message: 'Usuario registrado correctamente.', userId });
    } catch (error) {
        // Si ocurrió algún error durante la inserción, devolver un error
        console.log(error)
        return res.status(500).json({ error: 'Error interno del servidor.'});
    }
})

// Configura multer para manejar la carga de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Establece la carpeta de destino donde se guardarán los archivos subidos
      cb(null, path.join('/home/juanky/proyecto/app-psicologos/client/user_img'));
    },
    filename: (req, file, cb) => {
      // Establece el nombre del archivo como el nombre de usuario seguido de la extensión original del archivo
      console.log(file);
      const fileName = `${file.originalname}`;
      cb(null, fileName);
    }
  });
  
  // Crea el middleware de multer con la configuración de almacenamiento
  const upload = multer({ storage });
  
  // Ruta para manejar la carga de imágenes
  app.post('/upload', upload.single('image'), (req, res) => {
    // Verifica si se subió correctamente un archivo de imagen
    if (req.file) {
      // Si se subió correctamente, devuelve una respuesta con el nombre del archivo
      return res.status(200).json({ message: 'Imagen subida correctamente.', fileName: req.file.filename });
    } else {
      // Si no se subió ningún archivo o hubo un error, devuelve un mensaje de error
      return res.status(400).json({ error: 'No se pudo subir la imagen.' });
    }
  });



const IP = '200.234.236.242';
const PORT = 8080;

app.listen(PORT, IP, () => {
    console.log(`Servidor corriendo en http://${IP}:${PORT}`);
});
