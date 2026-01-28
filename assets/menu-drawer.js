document.addEventListener("DOMContentLoaded", (event) => {
  document.querySelectorAll('.has-child').forEach((el) => {
    el.addEventListener('click', function(event){
        event.preventDefault();
        var panel = el.nextElementSibling;
        el.classList.toggle('open');
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = "1000px";
        }
    })
  })
});