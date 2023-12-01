const getMovie = () => {
    const url = `http://localhost:3000/movies`;
    const options = {
         method: "GET",
         headers: {
              "Content-Type": "application/json"
         }
    };
    return fetch (url,options).then(response => response.json())
        .then(movies => {
            return console.log(movies);
        })
}





//MAIN
(() => {
getMovie();
//ƒ json() { [native code] }
})();