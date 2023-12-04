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

const patchMovie = (id, movie) => {
     const newMovie = {
          ...movie
     }
     const body = JSON.stringify(newMovie);

     const url = `http://localhost:3000/movies/${id}`;
     const options = {
          method: "PATCH",
          headers: {
               "Content-Type": "application/json",
          },
          body: body,
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

const handleMovieEdit = ({id, title, rating}, movieCard) => {
     movieCard.innerHTML = `
               <p>${title}</p>
               <input id="title-form${id}" class="edit-title" type="text" name="title" value="${title}" placeholder="Movie Title">
               <p>Rating: ${rating}</p>
               <input id="rating-form${id}" class="edit-rating" type="text" name="rating" value="${rating}" placeholder="Movie Rating">
               <button class="submit">Submit Edit</button>
               <button class="delete">Delete Movie</button>
          `;
     const submitBtn = movieCard.querySelector("button.submit");
     submitBtn.addEventListener("click", e=>{
          /// run patch method
          const editTitle = movieCard.querySelector('.edit-title').value;
          const editRating = movieCard.querySelector('.edit-rating').value;
          const editedMovie = {
               id: id,
               title: editTitle,
               rating: editRating,
          }
          patchMovie(id, editedMovie);
          movieCard.innerHTML = `
               <p>${editTitle}</p>
               <p>Rating: ${editRating}</p>
               <button class="edit">Edit Movie</button>
               <button class="delete">Delete Movie</button>
          `;
          const editBtn = movieCard.querySelector("button.edit");
          editBtn.addEventListener("click", e=>{
               handleMovieEdit({id, title, rating}, movieCard);
          })
     });
}

const renderMovie = ({id, title, rating}) => {
     const movieCol = document.querySelector('.page-wrapper .movie-wrapper');
     const movieCard = document.createElement('div');
     movieCard.classList.add('movie-card', 'col-3');
     movieCard.innerHTML = `
          <p>${title}</p>
          <p>Rating: ${rating}</p>
          <button class="edit">Edit Movie</button>
          <button class="delete">Delete Movie</button>
     `;
     const editBtn = movieCard.querySelector("button.edit");
     editBtn.addEventListener("click", e=>{
          handleMovieEdit({id, title, rating}, movieCard);
     });
     const deleteBtn = movieCard.querySelector("button.delete");
     deleteBtn.addEventListener("click", e => {
          handleMovieDelete({id, title, rating}, movieCard);
          movieCard.remove();
     })
     movieCol.appendChild(movieCard);
}

const handleMovieDelete = ({id, title, rating}, movieCard) => {
     const url = `http://localhost:3000/movies/${id}`;
     const options = {
          method: "DELETE",
          headers: {
               "Content-Type": "application/json"
          }
     }
     return fetch (url, options).then(response => response.json())
         .then(movies => {
              return movies;
         })
}

const renderMovies = (movies) => {
     const movieCol = document.querySelector('.page-wrapper .movie-wrapper');
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
          renderMovie(movie);
     }
}

const filterMovies = () => {
     const searchInput = document.querySelector('#search');
     searchInput.addEventListener('input', e => {
          getMovies()
               .then(movies=> {
                    let movieResult = movies;
                    const searchValue = e.target.value;
                    movieResult = movieResult.filter(movie => {
                         if (!searchValue) {
                              return true;
                         }
                         return movie.title.toLowerCase().includes(searchValue.toLowerCase());
                    });
                    renderMovies(movieResult);
               });
     });
}

//MAIN
(() => {
getMovies()
     .then(movies => {
          renderMovies(movies);
     });
formHandler();
filterMovies();

//ƒ json() { [native code] }
})();