document.addEventListener('DOMContentLoaded', function(){
    const storeEmail = sessionStorage.getItem('email');
    if(storeEmail){
        document.getElementById('E-mail').value = storeEmail;
    }
});