(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form) return;

  const alertBox = document.getElementById('form-alert');
  const endpoint = 'https://formspree.io/f/maygbkvd'; // Reemplaza con tu endpoint

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    event.stopPropagation();

    alertBox.classList.add('d-none');

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    form.classList.add('was-validated');
    const formData = new FormData(form);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      if (response.ok) {
        alertBox.textContent = 'Mensaje enviado con éxito.';
        alertBox.className = 'alert alert-success mt-3';
        form.reset();
        form.classList.remove('was-validated');
      } else {
        throw new Error('Error en la respuesta');
      }
    } catch (err) {
      alertBox.textContent = 'Ocurrió un error al enviar el mensaje. Inténtalo de nuevo más tarde.';
      alertBox.className = 'alert alert-danger mt-3';
    }
  });
})();

