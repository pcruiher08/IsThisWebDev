function darkMode() {
    var element = document.getElementById("theme");
    element.classList.remove("claro");
    element.classList.add("oscuro")
}

function lightMode() {
    var element = document.getElementById("theme");
    element.classList.remove("oscuro");
    element.classList.add("claro")
}