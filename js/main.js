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

const postMovie = (title, rating) => {
     const newMovie = {
          title,
          rating
     }
     const body = JSON.stringify(newMovie);
     const url = `http://localhost:3000/movies`;
     const options = {
          method: "POST",
          headers: {
               "Content-Type": "application/json"
          },
          body: body
     };
     return fetch (url,options).then(response => response.json())
     .then(movies => {
          return movies;
     })
}

const formHandler = () => {
     const formBtn = document.querySelector('#submit-movie');
     formBtn.addEventListener('click', e=>{
          e.preventDefault();
          const titleValue = document.querySelector('#title-form').value;
          console.log(titleValue);
          const ratingValue = document.querySelector('#rating-form').value;
          console.log(ratingValue);
          postMovie(titleValue, ratingValue);
          getMovies()
          .then(movies => {
               renderMovies(movies);
          });
     });
};

const renderMovies = (movies) => {
     const movieCol = document.querySelector('.page-wrapper .col');
     movieCol.innerHTML = `
          <div id=\"loading-wrapper\">Loading...
               <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
               </div>               
          </div>
`;
     const loadingSpinner = document.querySelector('#loading-wrapper');
     loadingSpinner.remove();
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
formHandler();

//ƒ json() { [native code] }
})();