const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 1. Conexión a la Base de Datos NoSQL
require('dotenv').config();
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

// 2. Definición del Esquema (Estructura flexible NoSQL)
const Peliculaschema = new mongoose.Schema({
titulo: String,
genero: String,
productora: String,
año: Number,
estado: Boolean
});

const Pelicula = mongoose.model('Peliculas', Peliculaschema);

// 3. Ruta para obtener los datos
app.get('/datos', async (req, res) => {
const Peliculass = await Pelicula.find();
res.json(Peliculass);
});

// Ruta POST para recibir y guardar datos
app.post('/guardar', async (req, res) => {
try {
const nuevaPelicula = new Pelicula({
titulo: req.body.nombre,
genero: req.body.genero,
productora: req.body.productora,
año: req.body.anio,
estado: req.body.estado === "true" // Por defecto activo
});

await nuevaPelicula.save(); // Guarda el documento en MongoDB
res.status(201).json({ mensaje: "Pelicula guardada con éxito" });
} catch (error) {
res.status(500).json({ error: "Error al guardar" });
}
});

// Ruta DELETE para eliminar por ID
app.delete('/eliminar/:id', async (req, res) => {
try {
const id = req.params.id;
await Pelicula.findByIdAndDelete(id);
res.json({ mensaje: "Pelicula eliminada correctamente" });
} catch (error) {
console.error(error);
res.status(500).json({ error: "Error al eliminar" });
}
});

app.put('/editar/:id', async (req,res)=>{
try{
await Pelicula.findByIdAndUpdate(
req.params.id,
{
titulo: req.body.titulo,
genero: req.body.genero,
productora: req.body.productora,
año: req.body.anio,
}
);
res.json({
mensaje:"Película actualizada"
});
}catch(error){
res.status(500).json({
error:"Error al actualizar"
});
}
});


// Ruta para buscar usuarios por nombre (Case-insensitive)
app.get('/buscar/:nombre', async (req, res) => {
try {
const nombreBusqueda = req.params.nombre;
// Buscamos con una expresión regular para que sea flexible
const resultados = await Pelicula.find({
$or: [
{ titulo: { $regex: nombreBusqueda, $options: 'i' } },
{ genero: { $regex: nombreBusqueda, $options: 'i' } }
]
});

res.json(resultados);
} catch (error) {
res.status(500).json({ error: "Error en la búsqueda" });
}
});