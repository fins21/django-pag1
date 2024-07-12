function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function actualizarStock(productosEnCarrito) {
    if (productosEnCarrito.length === 0) {
        console.log('No hay productos para actualizar');
        return Promise.resolve();
    }

    return fetch('/actualizar-stock/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(productosEnCarrito)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Stock actualizado correctamente');
        } else {
            throw new Error(data.error || 'Error desconocido al actualizar el stock');
        }
    });
}


function vaciarCarrito() {
    localStorage.removeItem("productosEnCarrito");
    localStorage.setItem("cantidadEnCarrito", "0");
    cantidadEnCarrito = 0;

    

    actualizarVisualCarrito();

    const numerito = document.getElementById("numerito");
if (numerito) {
    numerito.textContent = "0";
}

console.log('Carrito vaciado');
}

function actualizarVisualCarrito() {
    var productosEnCarritoContainer = document.getElementById("productos-en-carrito-container");
    productosEnCarritoContainer.innerHTML = "";

    var productosEnCarrito = JSON.parse(localStorage.getItem("productosEnCarrito")) || [];

    productosEnCarrito.forEach(function(producto) {
        var fila = document.createElement("tr");

        var tdImagen = document.createElement("td");
        var img = document.createElement("img");
        img.src = producto.imagen;
        img.alt = producto.nombre;
        tdImagen.appendChild(img);
        fila.appendChild(tdImagen);

        var tdNombre = document.createElement("td");
        tdNombre.textContent = producto.nombre;
        fila.appendChild(tdNombre);

        var tdPrecio = document.createElement("td");
        tdPrecio.textContent = formatearCLP(producto.totalPrecio);
        fila.appendChild(tdPrecio);

        var tdCantidad = document.createElement("td");
        var inputCantidad = document.createElement("input");
        inputCantidad.type = "number";
        inputCantidad.min = "1";
        inputCantidad.value = producto.cantidad;
        inputCantidad.dataset.id = producto.id;
        inputCantidad.addEventListener("change", actualizarCantidadProducto);
        tdCantidad.appendChild(inputCantidad);
        fila.appendChild(tdCantidad);

        productosEnCarritoContainer.appendChild(fila);
    });

    mostrarTotalProductos();
}

function actualizarCantidadProducto() {
    var nuevoValor = parseInt(this.value);
    var productoId = this.dataset.id;
    var productosEnCarrito = JSON.parse(localStorage.getItem("productosEnCarrito")) || [];

    var producto = productosEnCarrito.find(p => p.id === productoId);
    if (producto) {
        cantidadEnCarrito += nuevoValor - producto.cantidad;
        producto.cantidad = nuevoValor;
        producto.totalPrecio = producto.precio * nuevoValor;

        localStorage.setItem("cantidadEnCarrito", cantidadEnCarrito);
        localStorage.setItem("productosEnCarrito", JSON.stringify(productosEnCarrito));

        numerito.textContent = cantidadEnCarrito;
        actualizarVisualCarrito();
    }
}

function mostrarTotalProductos() {
    var total = calcularTotalProductos();
    var totalElemento = document.getElementById("total");
    totalElemento.textContent = "Total: " + formatearCLP(total);
}

function calcularTotalProductos() {
    var productos = JSON.parse(localStorage.getItem("productosEnCarrito")) || [];
    var total = 0;
    productos.forEach(function(producto) {
        total += producto.totalPrecio;
    });
    return total;
}

function formatearCLP(numero) {
    return '$' + numero.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function mostrarAgradecimiento() {
    console.log('Función mostrarAgradecimiento llamada');
    var modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "block";
        console.log('Modal debería estar visible ahora');
    } else {
        console.error("Modal no encontrado en el DOM");
    }
}


let compraPendiente = false;

function realizarCompra() {
    console.log('Función realizarCompra llamada');
    
    if (compraPendiente) {
        console.log('Ya hay una compra en proceso');
        return;
    }
    
    compraPendiente = true;
    console.log('Iniciando proceso de compra');

    var productosEnCarrito = JSON.parse(localStorage.getItem("productosEnCarrito")) || [];
    
    var datosCompra = productosEnCarrito.map(producto => ({
        id: producto.id,
        cantidad: producto.cantidad
    }));

    console.log('Datos de compra a enviar:', datosCompra);

    return fetch('/realizar-compra/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(datosCompra)
    })
    .then(response => {
        console.log('Respuesta recibida del servidor');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(response => response.json())
    .then(data => {
    if (data.success) {
        console.log('Compra realizada correctamente');
        vaciarCarrito();
        mostrarAgradecimiento(); // Llamada a la función que muestra el modal
    } else {
        console.error('Error en la compra:', data.error);
        vaciarCarrito();
        mostrarAgradecimiento();
    }
    })
    .catch(error => {
    console.error('Error al realizar la compra:', error);
    vaciarCarrito();
    mostrarAgradecimiento();
    });
}


document.addEventListener("DOMContentLoaded", function() {
    var agregarBtns = document.querySelectorAll(".btn-agregar-carrito");
    var numerito = document.getElementById("numerito");
    var cantidadEnCarrito = parseInt(localStorage.getItem("cantidadEnCarrito")) || 0;
    numerito.textContent = cantidadEnCarrito;
    const botonesAgregar = document.querySelectorAll('.btn-agregar-carrito');
    const botonComprar = document.getElementById('boton-comprar');
    if (botonComprar) {
        console.log('Botón de compra encontrado');
        botonComprar.removeEventListener('click', realizarCompra); // Elimina cualquier listener previo
        botonComprar.addEventListener('click', function(event) {
            console.log('Botón de compra clickeado');
            event.preventDefault(); // Previene cualquier acción por defecto
            realizarCompra();
        });
    } else {
        console.log('Botón de compra no encontrado');
    }
    

  botonesAgregar.forEach(boton => {
    boton.addEventListener('click', agregarAlCarrito);
  });



  function agregarAlCarrito(event) {
    const boton = event.currentTarget;
    const producto = boton.closest(".product");
    const productoId = producto.dataset.id;
    const productoNombre = producto.querySelector(".product__title").dataset.nombre;
    const productoPrecio = parseFloat(producto.querySelector(".producto__price").dataset.precio);
    const productoImagen = producto.querySelector(".img-product").src;

    var spanCerrar = document.getElementsByClassName("close")[0];
    if (spanCerrar) {
        spanCerrar.onclick = function() {
            var modal = document.getElementById("modal");
            if (modal) {
                modal.style.display = "none";
            }
        }
    }

    window.onclick = function(event) {
        var modal = document.getElementById("modal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    var productosEnCarrito = JSON.parse(localStorage.getItem("productosEnCarrito")) || [];

    var productoExistente = productosEnCarrito.find(p => p.id === productoId);

    if (productoExistente) {
        productoExistente.cantidad += 1;
        productoExistente.totalPrecio += productoPrecio;
    } else {
        productosEnCarrito.push({
            id: productoId,
            nombre: productoNombre,
            precio: productoPrecio,
            cantidad: 1,
            totalPrecio: productoPrecio,
            imagen: productoImagen
        });
    }

    cantidadEnCarrito++;
    numerito.textContent = cantidadEnCarrito;
    localStorage.setItem("cantidadEnCarrito", cantidadEnCarrito);
    localStorage.setItem("productosEnCarrito", JSON.stringify(productosEnCarrito));

    actualizarVisualCarrito();
}

    agregarBtns.forEach(function(btn) {
        btn.addEventListener("click", agregarAlCarrito);
    });

    var botonVaciarCarrito = document.querySelector(".boton-vaciar-carrito");
    botonVaciarCarrito.addEventListener("click", function() {
        vaciarCarrito();
    });


    

    
    
    
    
    

    actualizarVisualCarrito();
});
