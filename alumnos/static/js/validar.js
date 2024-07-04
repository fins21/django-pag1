document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formulario");

  formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    if (validarFormulario()) {
      mostrarNotificacion();
      limpiarFormulario();
    }
  });
});

function validarFormulario() {
  var rut = document.getElementById("rut").value;
  var apellidoPaterno = document.getElementById("apellido_paterno").value;
  var apellidoMaterno = document.getElementById("apellido_materno").value;
  var nombre = document.getElementById("nombre").value;
  var edad = parseInt(document.getElementById("edad").value);
  var genero = document.getElementById("genero").value;
  var telefono = document.getElementById("telefono").value;
  var fechaNacimiento = document.getElementById("fechanacimiento").value;

  var errores = [];

  // Validación de RUT
  if (rut.length < 9 || rut.length > 10) {
    errores.push("El RUT debe tener entre 9 y 10 caracteres.");
  }

  if (nombre.length < 3 || nombre.length > 20) {
    errores.push("El nombre debe tener entre 3 y 20 caracteres.");
  }

  if (apellidoPaterno.length < 3 || apellidoPaterno.length > 20) {
    errores.push("El apellido paterno debe tener entre 3 y 20 caracteres.");
  }

  if (apellidoMaterno.length < 3 || apellidoMaterno.length > 20) {
    errores.push("El apellido materno debe tener entre 3 y 20 caracteres.");
  }

  if (isNaN(edad) || edad < 18 || edad > 100) {
    errores.push("La edad debe estar entre 18 y 100 años.");
  }

  if (genero === "") {
    errores.push("Debe seleccionar un género.");
  }

  if (telefono.length < 9 || telefono.length > 12) {
    errores.push("El número de celular debe tener entre 9 y 12 caracteres.");
  }

  if (fechaNacimiento === "") {
    errores.push("Debe ingresar su fecha de nacimiento.");
  } else {
    const fechaActual = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edadCalculada = fechaActual.getFullYear() - fechaNac.getFullYear();
    const mes = fechaActual.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && fechaActual.getDate() < fechaNac.getDate())) {
      edadCalculada--;
    }
    if (edadCalculada < 18 || edadCalculada > 45) {
      errores.push(
        "La edad calculada a partir de la fecha de nacimiento debe estar entre 18 y 45 años."
      );
    }
  }

  if (errores.length > 0) {
    mostrarErrores(errores);
    return false;
  }

  return true;
}

function mostrarErrores(errores) {
  var mensaje = "Por favor, corrija los siguientes errores:\n\n";
  errores.forEach(function (error) {
    mensaje += "- " + error + "\n";
  });
  alert(mensaje);
}

function mostrarNotificacion() {
  alert("¡Registro Exitoso!");
}

function limpiarFormulario() {
  document.getElementById("formulario").reset();
}
