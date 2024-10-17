const input = document.getElementById("uploadImage"); // botón donde se sube la imagen
const profilePicture = document.getElementById("profilePicture"); // elemento donde se muestra la imagen
const savedProfilePicture = localStorage.getItem("profilePicture"); // obtener la imagen guardada en el localStorage

document.addEventListener("DOMContentLoaded", function () {
    const storeEmail = sessionStorage.getItem("email");
    if (storeEmail) {
        document.getElementById("E-mail").value = storeEmail;
    }
    if (savedProfilePicture) {
        profilePicture.src = savedProfilePicture;
    }
});


// Evento para cuando se sube una imagen
input.addEventListener("change", () => {
    // change es un evento que se dispara cuando cambia el valor de un input
    const fr = new FileReader(); // objeto FileReader para leer la imagen
    fr.readAsDataURL(input.files[0]); // leer el archivo seleccionado como data URL (base64)

    fr.addEventListener("load", () => {
        // evento que se dispara cuando se termina de cargar la imagen
        const url = fr.result; // obtener la data URL de la imagen
        console.log(url);

        localStorage.setItem("profilePicture", url); // guardar la imagen en el localStorage
    });
});
