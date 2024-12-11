document.addEventListener('DOMContentLoaded', function () {
    const slider = document.getElementById('featuredSlider');
    const arrow = document.querySelector('.scroll-arrow');
    const reviewsSection = document.querySelector('.featured-reviews');

    // Crear tarjeta de reseña
    function createSliderCard(review) {
        const card = document.createElement('div');
        card.classList.add('featured-card');

        const maxLength = 300;
        let truncatedComment = review.comment.length > maxLength 
            ? review.comment.substring(0, maxLength) + '...' 
            : review.comment;

        card.innerHTML = `
            <h3>${review.user}</h3>
            <p class="comment">"${truncatedComment}"</p>
            <p class="rating">⭐ ${review.rating}/5</p>
        `;
        return card;
    }

    // Mostrar seccion de reseñas destacadas al hacer clic en la flecha
    arrow.addEventListener('click', function () {
        window.scrollTo({
            top: reviewsSection.offsetTop - 100,
            behavior: 'smooth'
        });
    });

    // Inicializar slider
    function initializeSlider() {
        $(document).ready(function () {
            $('#featuredSlider').slick({
                dots: true,
                arrows: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 3000,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1
                        }
                    }
                ]
            });
        });
    }

    // Cargar reseñas desde el backend
    function fetchRandomReviews() {
        fetch('http://localhost:8080/reviews/randomReviews')
            .then(response => response.json())
            .then(reviews => {
                reviews.forEach(review => {
                    slider.appendChild(createSliderCard(review));
                });
                initializeSlider();
            })
            .catch(error => console.error('Error al obtener las reseñas:', error));
    }

    fetchRandomReviews();
});
