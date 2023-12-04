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
               <p>Title: ${title}</p>
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
               <p>Title: ${editTitle}</p>
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
     const movieCol = document.querySelector('.page-wrapper .col');
     const movieCard = document.createElement('div');
     movieCard.classList.add('movie-card');
     movieCard.innerHTML = `
          <p>Title: ${title}</p>
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
          renderMovie(movie);
     }
}

const editMovieHandler = (movies) => {
     const editBtns = document.querySelectorAll('.edit');
     for (let i = 0; i<editBtns.length; i++) {
          editBtns[i].addEventListener('click', e=> {
               editBtns[i].parentElement.innerHTML = `
               <p>Title: ${movies[i].title}</p>
               <input id="title-form${movies[i].id}" class="edit-title" type="text" name="title" value="${movies[i].title}" placeholder="Movie Title">
               <p>Rating: ${movies[i].rating}</p>
               <input id="rating-form${movies[i].id}" class="edit-rating" type="text" name="rating" value="${movies[i].rating}" placeholder="Movie Rating">
               <button id=submit-id${movies[i].id} class="submit">Submit Edit</button>
               <button class="delete">Delete Movie</button>
               `
          });
     }
}





//MAIN
(() => {
getMovies()
     .then(movies => {
          renderMovies(movies);
          editMovieHandler(movies);
     });
formHandler();

//ƒ json() { [native code] }
})();