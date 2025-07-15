document.addEventListener("DOMContentLoaded", () => {
   activarEventos();
   cargarCarrito();
});



function activarEventos() {
    let botonFlotante = document.getElementById("boton-carrito");
    botonFlotante.addEventListener("click", abrirCarrito);

    let botonCerrarCarrito = document.getElementById("cerrar-carrito");
    botonCerrarCarrito.addEventListener("click", cerrarCarrito);

    let productos = document.getElementsByClassName("agregar-producto");
    for (let i = 0; i < productos.length; i++) {
        productos[i].addEventListener("click", agregarProducto);
    }

    let botonVaciarCarrito = document.getElementById("vaciarCarrito");
    botonVaciarCarrito.addEventListener("click",vaciarCarrito);
}


function abrirCarrito(){
    let carrito = document.getElementById("carrito");
    carrito.style.display = "flex";
}

function cerrarCarrito(){
    let carrito = document.getElementById("carrito");
    carrito.style.display = "none";
}

function vaciarCarrito(){
    localStorage.removeItem("carrito");
    cargarCarrito();
    // Reiniciar la cantidad de productos y actualizar el número en el DOM

    var cantidad = 0;
    localStorage.setItem("cantidad", cantidad); // Guardar la cantidad en el localStorage
    document.getElementById('numeroProductos').textContent = cantidad;
    document.getElementById('numeroProductos').style.display = "none";
}

function agregarProducto(event){

    var producto = {
        nombre: event.target.getAttribute("data-nombre"),
        precio: event.target.getAttribute("data-precio"),
        id: event.target.getAttribute("data-id")
    };

    var carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    var cantidad = parseInt(localStorage.getItem("cantidad")) || 0;
    cantidad++;
    localStorage.setItem("cantidad", cantidad);
    cargarCarrito();
}

function cargarCarrito() {
    var carrito = document.getElementById("carritoItems");
    carrito.innerHTML = ""; // Limpiar el contenido del carrito

    var productos = JSON.parse(localStorage.getItem("carrito")) || [];
    var acumulados = {}; // Objeto para acumular productos por ID

    // Acumular productos por ID
    for (var i = 0; i < productos.length; i++) {
        var producto = productos[i];
        if (!acumulados[producto.id]) {
            acumulados[producto.id] = { ...producto, cantidad: 1 };
        } else {
            acumulados[producto.id].cantidad++;
        }
    }

    // Mostrar productos acumulados en el carrito
    for (var id in acumulados) {
        var producto = acumulados[id];
        var li = document.createElement("li");

        // Mostrar nombre, precio y cantidad
        li.textContent = `${producto.nombre} - $${producto.precio} - Cantidad: ${producto.cantidad}`;

        // Botón para eliminar el producto
        var botonEliminar = document.createElement("button");
        botonEliminar.classList.add("eliminar-producto");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.setAttribute("data-id", producto.id);
        botonEliminar.addEventListener("click", function(event) {
            var id = event.target.getAttribute("data-id");
            eliminarProducto(id);
        });
        li.appendChild(botonEliminar);
        carrito.appendChild(li);
    }

    cantidad = parseInt(localStorage.getItem("cantidad")) || 0;
    if(cantidad== 0) {
        document.getElementById('numeroProductos').style.display = "none";
    }else{
        document.getElementById('numeroProductos').style.display = "block";
        document.getElementById('numeroProductos').textContent = cantidad;
    }
}

function eliminarProducto(id) {
    var carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    var cantidad = parseInt(localStorage.getItem("cantidad")) || 0;
    var productosEliminados = carrito.filter(producto => producto.id === id).length; // Contar cuántos productos se eliminan
    carrito = carrito.filter(producto => producto.id !== id); // Mantener solo los productos que no coincidan con el ID

    // Actualizar la cantidad total de productos
    cantidad -= productosEliminados;

    

    // Actualizar la cantidad de productos en el localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("cantidad", cantidad);

    cargarCarrito();
}