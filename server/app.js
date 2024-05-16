import express from 'express';
import {
    getTodasLasClinicas,
    getUsuariosPorID,
    getTodosLosUsuarios,
    checkLogin,
    registerUser,
} from "./database.js";
import cors from 'cors';

const corsOptions = {
    origin: "http://139.47.13.144:5173",
    methods: ["POST", "GET"],
    credentials: true,
};

const app = express();
app.use (express.json()); //Refresca el servidor al hacer cualquier cambio
app.use(cors(corsOptions));

app.get("/usuarios/:id", async (req, res) => {
    const usuarios = await getUsuariosByID(req.params.id);
    res.status(200).send(usuarios);
})

app.get("/clinicas", async (req, res) => {
    const clinicas = await getTodasLasClinicas();
    res.status(200).send(clinicas);
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



app.listen (8080, () => {
    console.log("Servidor corriendo en el puerto 8080");
})