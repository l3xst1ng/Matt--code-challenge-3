const baseUrl = "http://localhost:3000";

// Fetch and display the first movie's details
fetchAndDisplayFirstMovie();

// Fetch and display the list of movies
fetchAndDisplayMovieList();

// Event listener for the Buy Ticket button
document.getElementById("buy-ticket").addEventListener("click", buyTicket);

// Event listener for clicking on a movie in the list
const movieList = document.getElementById("films");
movieList.addEventListener("click", (event) => {
  if (event.target.classList.contains("film")) {
    const movieId = event.target.dataset.id;
    fetchAndDisplayMovie(movieId);
  } else if (event.target.classList.contains("delete-button")) {
    const movieId = event.target.dataset.id;
    deleteMovie(movieId);
  }
});

// Fetch and display the first movie's details
function fetchAndDisplayFirstMovie() {
  fetch(`${baseUrl}/films/1`)
    .then((response) => response.json())
    .then((movie) => {
      displayMovieDetails(movie);
    })
    .catch((error) => console.error(error));
}

// Fetching and display the selected movie's details
function fetchAndDisplayMovie(movieId) {
  fetch(`${baseUrl}/films/${movieId}`)
    .then((response) => response.json())
    .then((movie) => {
      displayMovieDetails(movie);
    })
    .catch((error) => console.error(error));
}

// Displaying  movie details
function displayMovieDetails(movie) {
  document.getElementById("title").textContent = movie.title;
  document.getElementById("title").dataset.id = movie.id; // Add movie ID to the title element
  document.getElementById("runtime").textContent = `${movie.runtime} minutes`;
  document.getElementById("film-info").textContent = movie.description;
  document.getElementById("showtime").textContent = movie.showtime;
  document.getElementById("ticket-num").textContent =
    movie.capacity - movie.tickets_sold;
  document.getElementById("poster").src = movie.poster;
  document.getElementById("poster").alt = movie.title;

  const buyTicketButton = document.getElementById("buy-ticket");
  if (movie.capacity - movie.tickets_sold === 0) {
    buyTicketButton.textContent = "Sold Out";
    buyTicketButton.disabled = true;
  } else {
    buyTicketButton.textContent = "Buy Ticket";
    buyTicketButton.disabled = false;
  }
}

// Fetching and displaying the list of movies from API
function fetchAndDisplayMovieList() {
  fetch(`${baseUrl}/films`)
    .then((response) => response.json())
    .then((movies) => {
      const movieList = document.getElementById("films");
      movieList.innerHTML = "";
      movies.forEach((movie) => {
        const movieItem = document.createElement("li");
        movieItem.classList.add("film", "item");
        movieItem.textContent = movie.title;
        movieItem.dataset.id = movie.id;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.dataset.id = movie.id;

        movieItem.appendChild(deleteButton);

        if (movie.capacity - movie.tickets_sold === 0) {
          movieItem.classList.add("sold-out");
        }
        movieList.appendChild(movieItem);
      });
    })
    .catch((error) => console.error(error));
}

// Buying a ticket section
function buyTicket() {
  const movieId = document.getElementById("title").dataset.id;
  const ticketsRemaining = parseInt(
    document.getElementById("ticket-num").textContent
  );

  if (ticketsRemaining > 0) {
    fetch(`${baseUrl}/films/${movieId}`)
      .then((response) => response.json())
      .then((movie) => {
        const updatedTicketsSold = movie.tickets_sold + 1;
        fetch(`${baseUrl}/films/${movieId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
        })
          .then((response) => response.json())
          .then((updatedMovie) => {
            displayMovieDetails(updatedMovie);

            fetch(`${baseUrl}/tickets`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                film_id: updatedMovie.id,
                number_of_tickets: 1,
              }),
            })
              .then((response) => response.json())
              .then((ticket) => console.log("Ticket purchased:", ticket))
              .catch((error) => console.error(error));
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  }
}

// Deleting a film
function deleteMovie(movieId) {
  fetch(`${baseUrl}/films/${movieId}`, {
    method: "DELETE",
  })
    .then(() => {
      const movieItem = document.querySelector(`li[data-id="${movieId}"]`);
      movieItem.remove();
    })
    .catch((error) => console.error(error));
}
