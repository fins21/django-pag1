document.addEventListener("DOMContentLoaded", function() {
    var agregarBtns = document.querySelectorAll(".fa-sharp.fa-solid.fa-cart-plus");
    var numerito = document.getElementById("numerito");
    var cantidadEnCarrito = parseInt(localStorage.getItem("cantidadEnCarrito")) || 0;
    numerito.textContent = cantidadEnCarrito;

    function agregarAlCarrito() {
        var producto = this.closest(".product");
        var productoId = producto.dataset.id;
        var productoNombre = producto.querySelector(".product__title").textContent;
        var productoPrecio = parseFloat(producto.querySelector(".producto__price").textContent.replace("$", "").replace(/\./g, "").replace(",", "."));
        var productoImagen = producto.querySelector(".img-product").src;

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

    var botonComprar = document.querySelector(".boton-comprar");
    botonComprar.addEventListener("click", function() {
        mostrarAgradecimiento();
        vaciarCarrito();
    });

    function mostrarAgradecimiento() {
        var modal = document.getElementById("modal");
        modal.style.display = "block";
    }

    var spanCerrar = document.getElementsByClassName("close")[0];
    spanCerrar.onclick = function() {
        var modal = document.getElementById("modal");
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        var modal = document.getElementById("modal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    function vaciarCarrito() {
        localStorage.removeItem("productosEnCarrito");
        localStorage.setItem("cantidadEnCarrito", "0");

        cantidadEnCarrito = 0;
        numerito.textContent = "0";

        var productosEnCarritoContainer = document.getElementById("productos-en-carrito-container");
        productosEnCarritoContainer.innerHTML = "";

        mostrarTotalProductos();
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

    actualizarVisualCarrito();
});
