document.addEventListener('DOMContentLoaded', function () {
  const toggleFiltersButton = document.getElementById('toggle-filters');

  
  toggleFiltersButton.addEventListener('click', () => {
    const advancedFilters = document.getElementById('advanced-filters');
    const filterBar = document.querySelector('.filter-bar');

    // Alternar la visibilidad de los filtros avanzados
    advancedFilters.classList.toggle('hidden');
    filterBar.classList.toggle('filters-active');


    if (!advancedFilters.classList.contains('hidden')) {
      toggleFiltersButton.textContent = '- Filtros'
    } else {
      toggleFiltersButton.textContent = '+ Filtros'
      clearFilters(); // Limpiar los filtros
    }
  });

  
  const moviesContainer = document.getElementById('movies-container');
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const genreInput = document.getElementById('genre-input');
  const yearInput = document.getElementById('year-input');
  
  function showLoading() {
    moviesContainer.innerHTML = '<p>Loading...</p>';
  }

  function clearFilters() {
    genreInput.selectedIndex = 0;
    yearInput.value = '';
  }

  // Crear tarjeta de pelicula
  function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    const placeholderImage = '/placeholder/imgPlaceholder.jpeg';
    const movieImage = movie.urlFilm || placeholderImage;

    movieCard.innerHTML = `
      <h2 class="movie-title">${movie.name}</h2>
      <img src="${movieImage}" alt="${movie.name}" class="movie-image" onerror="this.src='${placeholderImage}';">
      <div class="movie-info">Año: ${movie.year}</div>
      <div class="movie-info">Director: ${movie.director}</div>
      <div class="movie-info">
        Calificación:
        <div class="star-rating">${renderStars(movie.avgRating)}</div>
      </div>
      <div class="movie-genre">Géneros: ${movie.genre}</div>
    `;

    movieCard.addEventListener('click', () => {
      window.location.href = `reviews.html?name=${movie.name}`;
    });

    return movieCard;
  }

  // Generar estrellas de calificacion
  function renderStars(avgRating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= avgRating) {
        stars += '<i class="fas fa-star star filled"></i>';
      } else if (i - avgRating < 1) {
        stars += '<i class="fas fa-star-half-alt star filled"></i>';
      } else {
        stars += '<i class="far fa-star star"></i>';
      }
    }
    return stars;
  }

  // Obtener peliculas desde el backend
  function fetchMovies(name = '', genre = '', year = '') {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (genre) params.append('genre', genre);
    if (year) params.append('year', year);

    const url = `http://localhost:8080/films/filter?${params.toString()}`;
    showLoading();

    fetch(url, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(movies => {
        moviesContainer.innerHTML = ''; 
        if (movies.length === 0) {
          moviesContainer.innerHTML = '<p>No se encontraron resultados.</p>';
        } else {
          movies.forEach(movie => {
            moviesContainer.appendChild(createMovieCard(movie));
          });
        }
      })
      .catch(error => {
        console.error(error);
        moviesContainer.innerHTML = '<p>Error al cargar las películas.</p>';
      });
  }

  // Filtrar peliculas al hacer busqueda
  searchButton.addEventListener('click', () => {
    const name = searchInput.value;
    const genre = genreInput.value;
    const year = yearInput.value;
    fetchMovies(name, genre, year);
  });

  fetchMovies();
});
