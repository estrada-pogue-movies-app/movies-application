const getMovies = () => {
    const url = `http://localhost:3000/movies`;
    const options = {
         method: "GET",
         headers: {
              "Content-Type": "application/json"
         }
    };
    return fetch (url,options).then(response => response.json())
        .then(movies => {
            return movies;
        })
}

const renderMovies = (movies) => {
     const loadingSpinner = document.querySelector('#loading-wrapper');
     loadingSpinner.remove();
     const movieCol = document.querySelector('.page-wrapper .col');
     for (let movie of movies) {
          const movieCard = document.createElement('div');
          movieCard.innerHTML = `
          <p>Number: ${movie.id}</p>
          <p>Title: ${movie.title}</p>
          <p>Rating: ${movie.rating}</p>
     `
     movieCol.appendChild(movieCard);
     }
}





//MAIN
(() => {
getMovies()
     .then(movies => {
          renderMovies(movies);
     });
//ƒ json() { [native code] }
})();