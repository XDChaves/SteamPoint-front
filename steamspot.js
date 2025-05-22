window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 0) {
        header.classList.add('scrolled-header');
    } else {
        header.classList.remove('scrolled-header');
    }
});

document.addEventListener('DOMContentLoaded', function() { 
    const slidebox = document.querySelector('.firstcontainer');
    const titleElement = document.querySelector('.backgroundtext .textabout h1');
    const descriptionElement = document.querySelector('.backgroundtext .textabout p');
    const radioButtons = document.querySelectorAll('.carousel-radio');

    let slides = [];
    let currentIndex = 0;
    let interval;

    function updateSlide() {
        if (slides.length === 0) return;

        const currentSlide = slides[currentIndex];

        slidebox.style.backgroundImage = `url('${currentSlide.image}')`;
        slidebox.style.backgroundPosition = currentSlide.backgroundPosition || "0 8%"; // valor padrão

        titleElement.textContent = currentSlide.title;
        descriptionElement.textContent = currentSlide.description;

        document.getElementById(`slide${currentIndex + 1}`).checked = true;
    }

    function changeBackground() {
        if (slides.length === 0) return;
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlide();
    }

    function setSlide(index) {
        clearInterval(interval);
        currentIndex = index;
        updateSlide();
        startAutoSlide();
    }

    function startAutoSlide() {
        interval = setInterval(changeBackground, 15000);
    }

    /* https://xdchaves.github.io/ REPOSITÓRIO / ARQUIVO.JSON */
    fetch(`https://xdchaves.github.io/carousel/steamspot.json?t=${Date.now()}`)
    .then(response => response.json())
    .then(data => {
        // Transforma os destaques em uma lista
        slides = Object.values(data);
        updateSlide();
        startAutoSlide(); 

        radioButtons.forEach(button => {
            button.addEventListener('change', function() {
                setSlide(parseInt(this.dataset.index, 10));
            });
        });
    })
    .catch(error => console.error("Erro ao carregar os slides:", error));
});