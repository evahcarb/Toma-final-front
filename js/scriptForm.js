document.getElementById('movie-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const movieData = {
        name: document.getElementById('name').value.trim(),
        urlFilm: document.getElementById('img').value.trim(),
        year: parseInt(document.getElementById('year').value),
        director: document.getElementById('director').value.trim(),
        synopsis: document.getElementById('synopsis').value.trim(),
        genre: document.getElementById('genero').value.trim() 
    };

    // Validación de datos
    if (!validateMovieData(movieData)) {
        displayMessage('Por favor, completa todos los campos requeridos correctamente.', 'error');
        return;
    }

    fetch('http://localhost:8080/films', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movieData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la inserción de la película');
        }
        return response.json();
    })
    .then(data => {
        displayMessage('Película agregada con éxito: ' + data.name, 'success'); 
        document.getElementById('movie-form').reset(); 
    })
    .catch(error => {
        console.error('Error:', error);
        displayMessage('Error al agregar la película.', 'error');
    });
});


function validateMovieData(data) {
    return data.name && data.urlFilm && !isNaN(data.year) && data.director && data.synopsis && data.genre;
}

// Función para mostrar mensajes
function displayMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = type; 
    messageDiv.style.display = 'block'; 
}
