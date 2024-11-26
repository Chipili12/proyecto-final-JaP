(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', async event => {
      event.preventDefault();

      const email = form.querySelector('#email');
      const password = form.querySelector('#password');
      const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (password.value.length < 6) {
        password.setCustomValidity('Debe ingresar una contraseña mayor a 6 caracteres.');
      } else {
        password.setCustomValidity('');
      }

      if (!emailValidation.test(email.value)) {
        email.setCustomValidity('Por favor ingrese un formato de correo válido.');
      } else {
        email.setCustomValidity('');
      }

      if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: email.value, password: password.value }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al iniciar sesión');
        }

        const data = await response.json();
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('email', email.value);
        localStorage.setItem('token', data.token); 
        window.location.href = 'index.html';

      } catch (error) {
        console.error(error);
        alert('Error: ' + error.message);
      }
    }, false);
  });
})();
