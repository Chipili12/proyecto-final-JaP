document.getElementById("login").onsubmit = function(event) {
    event.preventDefault();
    sessionStorage.setItem('authenticated', true);
    this.submit()
};
