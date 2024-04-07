// Your code here

const baseUrl = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const filmList = document.querySelector("#films");
  const showing = document.querySelector("#showing");
  const buyTicketButton = document.querySelector("#buy-ticket");
  const ticketNum = document.querySelector("#ticket-num");

  function displayFilmDetails(film) {
    document.querySelector("#title").textContent = film.title;
    document.querySelector("#runtime").textContent = `${film.runtime} minutes`;
    document.querySelector("#film-info").textContent = film.description;
    document.querySelector("#showtime").textContent = film.showtime;
    ticketNum.textContent = `${
      film.capacity - film.tickets_sold
    } remaining tickets`;
    document.querySelector("#poster").src = film.poster;
  }

  function updateTicketCount(filmId, newTicketCount) {
    fetch(`${baseUrl}/films/${filmId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tickets_sold: newTicketCount }),
    })
      .then((response) => response.json())
      .then((updatedFilm) => {
        displayFilmDetails(updatedFilm);
        if (updatedFilm.tickets_sold === updatedFilm.capacity) {
          buyTicketButton.textContent = "Sold Out";
          buyTicketButton.disabled = true;
          filmList
            .querySelector(`[data-film-id="${filmId}"]`)
            .classList.add("sold-out");
        }
      });
  }

  function buyTicket(filmId) {
    const currentTicketNum = parseInt(ticketNum.textContent.split(" ")[0]);
    if (currentTicketNum > 0) {
      updateTicketCount(filmId, currentTicketNum + 1);
    }
  }

  function deleteFilm(filmId) {
    fetch(`${baseUrl}/films/${filmId}`, {
      method: "DELETE",
    }).then(() => {
      filmList.querySelector(`[data-film-id="${filmId}"]`).remove();
    });
  }

  function getFilms() {
    fetch(`${baseUrl}/films`)
      .then((response) => response.json())
      .then((films) => {
        films.forEach((film) => {
          const listItem = document.createElement("li");
          listItem.className = "film item";
          listItem.textContent = film.title;
          listItem.dataset.filmId = film.id;
          if (film.tickets_sold === film.capacity) {
            listItem.classList.add("sold-out");
          }
          listItem.addEventListener("click", () => {
            displayFilmDetails(film);
            buyTicketButton.textContent = "Buy Ticket";
            buyTicketButton.disabled = false;
            buyTicketButton.addEventListener("click", () => buyTicket(film.id));
          });
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", () => deleteFilm(film.id));
          listItem.appendChild(deleteButton);
          filmList.appendChild(listItem);
        });
      });
  }

  getFilms();

  fetch(`${baseUrl}/films/1`)
    .then((response) => response.json())
    .then((film) => {
      displayFilmDetails(film);
      buyTicketButton.addEventListener("click", () => buyTicket(film.id));
    });
});
