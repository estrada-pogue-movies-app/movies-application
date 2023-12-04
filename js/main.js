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
          /// run patch method
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
     });
}

const renderMovie = ({id, title, rating, poster, genre}) => {
     const movieCol = document.querySelector('.page-wrapper .movie-wrapper');
     const movieCard = document.createElement('div');
     movieCard.classList.add('card');
     movieCard.innerHTML = `
          <img src="../img/${poster}" className="card-img-top" alt="${title}">
          <div className="card-body">
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
     genreSelect.addEventListener('change', e=>{
          getMovies()
          .then(movies=> {
               let movieResult = movies;
               console.log(e);
               movieResult = movieResult.filter(movie => {
                    if (e.target.value==="all") {
                         return true;
                    } else {
                         return movie.genre === e.target.value;
                    }
               });
               renderMovies(movieResult);
          });
     });
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