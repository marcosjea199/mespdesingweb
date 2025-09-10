(function () {
  'use strict'

  // Selecciona el formulario que necesita validación
  const form = document.querySelector('.needs-validation')

  // Añade un 'event listener' para cuando el formulario intente ser enviado
  form.addEventListener('submit', function (event) {
    // Si el formulario no es válido, evita que se envíe
    if (!form.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
    }

    // Agrega la clase de validación de Bootstrap al formulario
    // Esto mostrará los mensajes de error/éxito
    form.classList.add('was-validated')
  }, false)
})()