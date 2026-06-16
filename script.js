const boton = document.getElementById('btn-accion');

boton.addEventListener('click', async () => {
    try {
        
// Petición al servidor (Back-end)
const respuesta = await fetch('http://localhost:3000/datos');
const datos = await respuesta.json();

const contenedor = document.getElementById('contenedor-datos');
contenedor.innerHTML = ""; // Limpiar contenedor

// Mapear los documentos de la colección NoSQL
datos.forEach(user => {
contenedor.innerHTML += `
<div class="tarjeta-usuario">
<h3>🎬 ${user.titulo}</h3>  
<p>🎭 Género: ${user.genero}</p>

<p>🏢 Productora: ${user.productora}</p>
<p>📅 Año: ${user.año}</p>
<p>👁️ Estado: ${user.estado ? "Vista" : "No Vista"}</p>

<p>🆔 ${user._id}</p>
<button class="btn-borrar" onclick="eliminarUsuario('${user._id}')">
Eliminar
</button>
</div>
`;
});

} catch (error) {
    console.error("Error concectando con la BD", error);
}
});

const btnGuardar = document.getElementById('btn-guardar');

btnGuardar.addEventListener('click', async () => {
const nombre = document.getElementById('nombre').value;
const genero = document.getElementById('genero').value;
const productora = document.getElementById('productora').value;
const anio = document.getElementById('anio').value;
const estado = document.getElementById('estado').value;

if (!nombre || !genero || !productora || !anio || !estado) return alert("Completa todos los campos");

const datosAEnviar = { nombre, genero, productora, anio, estado };

try {
const respuesta = await fetch('http://localhost:3000/guardar', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(datosAEnviar)
});
if (respuesta.ok) {
alert("¡Datos guardados en la nube NoSQL!");
document.getElementById('nombre').value = ""; // Limpiar campo
}
} catch (error) {
console.error("Error al enviar datos:", error);
}
});

async function eliminarUsuario(id) {
if (confirm("¿Estás seguro de eliminar este registro NoSQL?")) {
try {
const respuesta = await fetch(`http://localhost:3000/eliminar/${id}`, {
method: 'DELETE'
});

if (respuesta.ok) {
alert("Registro borrado");
// Volvemos a cargar la lista automáticamente
document.getElementById('btn-accion').click();
}
} catch (error) {
console.error("Error al borrar:", error);
}
}
}

const btnBuscar = document.getElementById('btn-buscar');

btnBuscar.addEventListener('click', async () => {
const termino = document.getElementById('input-buscar').value;
if (!termino) return alert("Ingresa un término de búsqueda");
try {
const respuesta = await fetch(`http://localhost:3000/buscar/${termino}`);
const resultados = await respuesta.json();

const contenedor = document.getElementById('contenedor-datos');
contenedor.innerHTML = `<h4>Resultados de: "${termino}"</h4>`;

if (resultados.length === 0) {
contenedor.innerHTML += "<p>No se encontraron coincidencias.</p>";
}

resultados.forEach(user => {
contenedor.innerHTML += `
<div class="tarjeta-usuario" style="border-left-color: #ffc107;">
<h3>🎬 ${user.titulo}</h3>
<p>🎭 Génerno: ${user.genero}</p>
<p>🏢 Productora: ${user.productora}</p>
<p>📅 Año: ${user.año}</p>
<p>👁️ Estado: ${user.estado ? "Vista" : "No Vista"}</p>

<button class="btn-editar"
onclick="editarPelicula('${user._id}')">
✏️ Editar
</button>
<button class="btn-borrar"
onclick="eliminarUsuario('${user._id}')">Eliminar</button>
</div>
`;
});
} catch (error) {
console.error("Error en la consulta:", error);
}
});

const btnLimpiar = document.getElementById('btn-limpiar');

btnLimpiar.addEventListener('click', () => {

    document.getElementById('input-buscar').value = "";

    // Simular clic en actualizar vista
    document.getElementById('btn-accion').click();

});



async function editarPelicula(id){
const titulo = prompt("Nuevo título:");
if(!titulo) return;
const genero = prompt("Nuevo género:");
if(!genero) return;
try{
const respuesta = await fetch(
`http://localhost:3000/editar/${id}`,
{
method:'PUT',
headers:{
'Content-Type':'application/json'
},
body: JSON.stringify({
titulo,
genero,
productora,
anio
})
}
);
if(respuesta.ok){
alert("Película actualizada");
document.getElementById('btn-accion').click();
}
}catch(error){
console.error(error);
}
}