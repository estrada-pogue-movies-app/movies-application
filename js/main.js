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

const postMovie = (title, rating, genre) => {
     const newMovie = {
          title,
          rating,
          genre
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
     const formBtn = document.querySelector('button.add-btn');
     formBtn.addEventListener('click', e=>{
          const titleValue = document.querySelector('#title-form').value;
          const ratingValue = document.querySelector('#rating-form').value;
          const genreValue = document.querySelector('#genre-add').value;
          postMovie(titleValue, ratingValue, genreValue);
          getMovies()
          .then(movies => {
               renderMovies(movies);
          });
     });
};

const handleMovieEdit = ({id, title, rating, poster, genre}, movieCard) => {
     movieCard.innerHTML = `
               <img src="../img/${poster}" className="card-img-top" alt="${title}">
               <div className="card-body">
               <span>Title:</span><input id="title-form${id}" class="edit-title" type="text" name="title" value="${title}" placeholder="Movie Title">
               <span>Genre:<select id="genre-submit" type="genre">
                    <option>family</option>
                    <option>sci-fi</option>
                    <option>comedy</option>
                    <option>drama</option>
                    <option>horror</option>
               </select></span>
               <span>Rating:</span><input id="rating-form${id}" class="edit-rating" type="text" name="rating" value="${rating}" placeholder="Movie Rating"><br>
               <button class="submit"><img src="../img/bandaid.svg"</button>
               <button class="delete"><img src="../img/trash-fill.svg"</button>
               </div>
          `;
     const submitBtn = movieCard.querySelector("button.submit");
     submitBtn.addEventListener("click", e=>{
          const editTitle = movieCard.querySelector('.edit-title').value;
          const editRating = movieCard.querySelector('.edit-rating').value;
          const editGenre = movieCard.querySelector('#genre-submit').value;
          const editedMovie = {
               id: id,
               title: editTitle,
               rating: editRating,
               genre: editGenre,
               poster: poster,
          }
          patchMovie(id, editedMovie);
          movieCard.innerHTML = `
               <img src="../img/${poster}" className="card-img-top" alt="${title}">
               <div className="card-body">
               <h5 className="card-title">${editTitle}</h5>
               <p>${editGenre}</p><span className="card-text">${editRating}/10</span>
               <button class="edit"><img src="../img/bandaid-fill.svg"></button><button class="delete"><img src="../img/trash-fill.svg"</button>
               </div>
          `;
          const editBtn = movieCard.querySelector("button.edit");
          editBtn.addEventListener("click", e=>{
               handleMovieEdit({id, title, rating, poster, genre}, movieCard);
          })
          const deleteBtn = movieCard.querySelector("button.delete");
          deleteBtn.addEventListener("click", e => {
               handleMovieDelete({id, title, rating, poster, genre}, movieCard);
               movieCard.remove();
          })
     });
}

const renderMovie = ({id, title, rating, poster, genre}) => {
     const movieCol = document.querySelector('.page-wrapper .movie-wrapper');
     const movieCard = document.createElement('div');
     movieCard.classList.add('card', 'img-wrapper');
     movieCard.innerHTML = `
               <img src="../img/${poster}" className="card-img-top" alt="${title}">
               <div class="card-body">
                    <h5 className="card-title">${title}</h5>
                    <p>${genre}</p><span className="card-text">${rating}/10</span>
                    <button class="edit"><img src="../img/bandaid-fill.svg"></button><button class="delete"><img src="../img/trash-fill.svg"</button>
               </div>  
          `;
     const editBtn = movieCard.querySelector("button.edit");
     editBtn.addEventListener("click", e=>{
          handleMovieEdit({id, title, rating, poster, genre}, movieCard);
     });
     const deleteBtn = movieCard.querySelector("button.delete");
     deleteBtn.addEventListener("click", e => {
          handleMovieDelete({id, title, rating, poster, genre}, movieCard);
          movieCard.remove();
     })
     movieCol.appendChild(movieCard);
}

const handleMovieDelete = ({id, title, rating, poster, genre}, movieCard) => {
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
     console.log("renderMovies called with movies => ", movies);
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
     const genreSelect = document.querySelector('#genre');
     let filteredMovies = [];
     getMovies()
          .then(movies=> {
               genreSelect.addEventListener('change', e=>{
                         filteredMovies = handleFilter(movies);
                         renderMovies(filteredMovies);
                    });
               searchInput.addEventListener('input', e => {
                    getMovies()
                    .then(movies=> {
                         filteredMovies = handleFilter(movies);
                         renderMovies(filteredMovies);
                    });
               });
          });
}

const handleFilter = (movies) => {
     const searchValue = document.querySelector('#search').value;
     const genreValue = document.querySelector('#genre').value;
     let movieResult = movies;
     movieResult = movieResult.filter(movie => {
          if(genreValue.toLowerCase() === "all") {
               return true;
          }
          return movie.genre.toLowerCase() === genreValue.toLowerCase();
     });
     movieResult = movieResult.filter(movie => {
          if(!searchValue) {
               return true;
          }
          return movie.title.toLowerCase().includes(searchValue.toLowerCase());
     });
     return movieResult;
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