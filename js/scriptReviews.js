document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');

    if (name) {
        fetch(`http://localhost:8080/films/${name}`)
            .then(response => response.json())
            .then(movie => {
                document.getElementById('movie-title').innerText = movie.name;
                document.getElementById('movie-image').src = movie.urlFilm || '/placeholder/imgPlaceholder.jpeg';
                document.getElementById('movie-year').innerText = `Año: ${movie.year}`;
                document.getElementById('movie-director').innerText = `Director: ${movie.director}`;
                document.getElementById('movie-synopsis').innerText = `Sinopsis: ${movie.synopsis}`;
                document.getElementById('movie-genre').innerText = `Género: ${movie.genre}`;
                document.getElementById('movie-rating').innerText = `Calificación: ${movie.avgRating.toFixed(1)}`;

                // Filtrar y mostrar plataformas de streaming
                const streamingContainer = document.getElementById('movie-providers');
                const validProviders = ['Netflix', 'Max', 'Amazon Prime Video', 'Movistar Plus+', 'Disney Plus'];
                const iconMap = {
                    "Netflix": "netflix.svg",
                    "Amazon Prime Video": "amazon-prime.svg",
                    "Disney Plus": "disney-plus.svg",
                    "Max": "hbo-max.svg",
                    "Movistar Plus+": "movistar-plus.svg" 
                  };
                  

                streamingContainer.innerHTML = ''; 
                const selectedProviders = movie.providerNames.filter(provider => validProviders.includes(provider));
                const basePath = './assets/svg/'; 

                selectedProviders.forEach(provider => {
                    const iconClass = iconMap[provider];
                    if (iconClass) {
                        const img = document.createElement('img');
                        img.src = `${basePath}${iconClass}`; 
                        img.width = 100; 
                        streamingContainer.appendChild(img);
                    }
                });
             

                // reseñas
                const reviewsContainer = document.getElementById('movie-reviews');
                movie.review.forEach(review => {
                    const reviewElement = document.createElement('div');
                    reviewElement.classList.add('review');
                    reviewElement.innerHTML = `
                        <p class="review-user"> ${review.user}</p>
                        <p class="review-text">${review.comment}</p>
                        <p class="review-rating">Calificación: ${review.rating.toFixed(1)}</p>
                    `;
                    reviewsContainer.appendChild(reviewElement);
                });
            })
            .catch(error => {
                console.error('Error al obtener los detalles de la película:', error);
            });
    }

    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const reviewText = document.getElementById('review-text').value;
        const reviewRating = parseFloat(document.getElementById('review-rating').value);

        const reviewData = {
            comment: reviewText,
            rating: reviewRating
        };

        fetch(`http://localhost:8080/reviews/${name}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Reseña enviada:', data);
            const reviewsContainer = document.getElementById('movie-reviews');
            const newReviewElement = document.createElement('div');
            newReviewElement.classList.add('review');
            newReviewElement.innerHTML = `
                <p class="review-user">anonymous</p>
                <p class="review-text">${reviewText}</p>
                <p class="review-rating">Calificación: ${reviewRating.toFixed(1)}</p>
            `;
            reviewsContainer.appendChild(newReviewElement);
            reviewForm.reset();
            displayMessage('Reseña enviada correctamente', 'success');
        })
        .catch(error => {
            console.error('Error al enviar la reseña:', error);
            displayMessage('Hubo un error al enviar la reseña', 'error');
        });

        function displayMessage(message, type) {
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = message;
            messageDiv.className = type;
            messageDiv.style.display = 'block';
        }
    });
});
