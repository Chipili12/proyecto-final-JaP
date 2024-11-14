(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {

      const email = form.querySelector('#email');
      const password = form.querySelector('#password');
      const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (password.value.length<6) {
        password.setCustomValidity("Debe ingresar una contraseña mayor a 6 caracteres.");
      } else {
        password.setCustomValidity('');
      }

      if (!emailValidation.test(email.value)) {
          email.setCustomValidity('Por favor ingrese un formato de correo válido.');
      } else {
          email.setCustomValidity('');
      }




      if (!form.checkValidity()) { // si el formulario no es valido, no se envia
        event.preventDefault()
        event.stopPropagation()
      } else {
        event.preventDefault()
        localStorage.setItem("isAuthenticated", "true"); // cuando el usuario envia el formulario, lo marca como autenticado
        localStorage.setItem("email", document.getElementById("email").value);
        window.location.href = "index.html"; // Redirigir al index si se autentica
       }
      form.classList.add('was-validated'); 
    }, false); 
  });
})();


