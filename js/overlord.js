let menuToggle = document.querySelector('.menu-toggle');
let header = document.querySelector('header');
menuToggle.onclick = function(){
    header.classList.toggle('active');
}
