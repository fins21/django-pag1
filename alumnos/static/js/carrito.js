document.addEventListener("DOMContentLoaded", function() {
  var agregarBtns = document.querySelectorAll(".fa-sharp.fa-solid.fa-cart-plus");
  var numerito = document.getElementById("numerito");
  var cantidadEnCarrito = parseInt(localStorage.getItem("cantidadEnCarrito")) || 0;
  numerito.textContent = cantidadEnCarrito;

  function agregarAlCarrito() {
      cantidadEnCarrito++;
      numerito.textContent = cantidadEnCarrito;
      localStorage.setItem("cantidadEnCarrito", cantidadEnCarrito);

      var producto = this.closest(".product");

      var productosEnCarrito = JSON.parse(localStorage.getItem("productosEnCarrito")) || [];
      productosEnCarrito.push(producto.outerHTML);
      localStorage.setItem("productosEnCarrito", JSON.stringify(productosEnCarrito));

      agregarAlCarritoVisual(producto);
  }

  agregarBtns.forEach(function(btn) {
      btn.addEventListener("click", agregarAlCarrito);
  });

  var botonComprar = document.querySelector(".boton-comprar");
  botonComprar.addEventListener("click", function() {
      alert("¡Muchas gracias por su compra!");
      document.getElementById("productos-en-carrito-container").innerHTML = "";
      numerito.textContent = "0";
      localStorage.removeItem("productosEnCarrito");
      localStorage.setItem("cantidadEnCarrito", "0");

      // Obtener la URL de índice del atributo de datos
      var indexUrl = document.body.getAttribute('data-index-url');

      // Redirigir a la página de índice
      if (indexUrl) {
          window.location.href = indexUrl;
      } else {
          console.error("No se pudo encontrar la URL de índice");
      }
  });

  function validarBotonComprar(cantidadProductos) {
      if (cantidadProductos === 0) {
          botonComprar.disabled = true;
      } else {
          botonComprar.disabled = false;
      }
  }

  validarBotonComprar(cantidadEnCarrito);
});


function mostrarTotalProductos() {
  var total = calcularTotalProductos();
  var totalElemento = document.getElementById("total");
  totalElemento.textContent = total.toFixed(2); // Formatea el total a dos decimales
}

function calcularTotalProductos() {
  var productos = document.querySelectorAll(".product");
  var total = 0;
  productos.forEach(function(producto) {
      var precioTexto = producto.querySelector(".producto__price").textContent;
      var precioNumerico = parseFloat(precioTexto.replace("$", "").replace(",", ""));
      total += precioNumerico;
  });
  return total;
}

// Llama a la función para mostrar el total cuando se cargue la página
window.addEventListener("DOMContentLoaded", function() {
  mostrarTotalProductos();
});


function agregarAlCarritoVisual(producto) {
  var nuevoProducto = document.createElement("div");
  nuevoProducto.classList.add("product", "producto-en-carrito");
  nuevoProducto.innerHTML = `
  <div class="product" style="width: 14rem">
      <img src="adidas/ad1.png" alt="" class="img-product" />
      <span class="badge bg-secondary position-absolute translate-middle bg-warning"></span>
      <div class="producto__description">
          <h6 class="product_categoria">ADIDAS</h6>
          <h5 class="product__title">MEDIUM</h5>
          <h5 class="product__title">ROJA</h5>
          <span class="producto__price">$99.990</span>
      </div>
  </div>
  `;
  var productosEnCarritoContainer = document.getElementById("productos-en-carrito-container");
  productosEnCarritoContainer.appendChild(nuevoProducto);
}

document.addEventListener("DOMContentLoaded", function() {
  var productosEnCarritoContainer = document.getElementById("productos-en-carrito-container");
  var numerito = document.getElementById("numerito");
  var vaciarBtn = document.querySelector(".boton-vaciar-carrito");

  function vaciarCarrito() {
      if (productosEnCarritoContainer.children.length === 0) {
          alert("Por favor, realice una compra.");
          window.location.href = "{% url 'carrito' %}";
          return;
      }

      productosEnCarritoContainer.innerHTML = "";
      var cantidadEnCarrito = 0;
      numerito.textContent = cantidadEnCarrito;
      localStorage.removeItem("productosEnCarrito");
      localStorage.setItem("cantidadEnCarrito", cantidadEnCarrito);

      mostrarTotalProductos();
  }

  vaciarBtn.addEventListener("click", vaciarCarrito);

  var productosEnCarrito = JSON.parse(localStorage.getItem("productosEnCarrito")) || [];
  var cantidadEnCarrito = productosEnCarrito.length;
  numerito.textContent = cantidadEnCarrito;

  productosEnCarrito.forEach(function(productoHTML) {
      var nuevoProducto = document.createElement("div");
      nuevoProducto.innerHTML = productoHTML;
      var boton = nuevoProducto.querySelector(".fa-sharp.fa-solid.fa-cart-plus");
      if (boton) {
          boton.remove();
      }
      productosEnCarritoContainer.appendChild(nuevoProducto);
  });
});

document.querySelectorAll('.fa-sharp.fa-solid.fa-cart-plus').forEach(function(boton) {
  boton.addEventListener('click', function() {
      var nombreProducto = this.closest('.card').querySelector('h3').textContent;
      alert("Su producto " + nombreProducto + " se ha agregado al carrito");
  });
});