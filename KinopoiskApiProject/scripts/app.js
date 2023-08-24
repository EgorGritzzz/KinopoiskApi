const API_KEY = '7065f36b-2fc4-4d4f-9287-df28ec5bd9e9';
const API_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
const API_URL_MOVIE_DETAILS = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/'

getMovies(API_URL)
async function getMovies(url) {
    const resp = await fetch(url, {
        headers: {
            "Content-type": "application/json",
            "X-API-KEY": API_KEY
        },
    });
    const respData = await resp.json();
    showMovies(respData);
};
// Функция распределения цвета в зависимости от рейтинга
function getClassByRate(rate) {
    const parsedRate = parseFloat(rate)/10;
    if(rate >= 7 || parsedRate >= 7) {
        return 'green';
    } else if (rate > 5 || parsedRate > 5 ) {
        return 'orange';
    } else {
        return 'red';
    }
};


//Функция создания 'карточек' фильмов на основе данных из API
function showMovies(data) {
    const moviesEl = document.querySelector(".movies");
    //очищаем список фильмов
    document.querySelector('.movies').innerHTML = '';

    data.films.forEach(movie => {
        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
        <div class="movie__cover-inner">
            <img src="${movie.posterUrlPreview}"
                class="movie__cover" alt="${movie.nameRu}">
            <div class="movie__info">
                <div class="movie__title">${movie.nameRu}</div>
                <div class="movie__category">${movie.genres.map((genre) => `${genre.genre} `)}</div>
                <div class="movie__average movie__average--${getClassByRate(movie.rating)}">${movie.rating}</div>
            </div>
        </div>
        <div class="movie__cover-darkened"></div>
    `;
           movieEl.addEventListener('click', () => openModal(movie.filmId))
           moviesEl.appendChild(movieEl);
    });
};

//событие для поиска фильмов по ключевым словам

const form = document.querySelector('form');
const search = document.querySelector('.header__search');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`
    if(search.value) {
      getMovies(apiSearchUrl);
    }
});

// Модальное окно


const modalEl = document.querySelector('.modal');

async function openModal (id) {

    const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
        headers: {
            "Content-type": "application/json",
            "X-API-KEY": API_KEY
        },
    });
    const respData = await resp.json();
  

    console.log(id)
    modalEl.classList.add('modal-show'); 
    document.body.classList.add('stop-scrolling');

modalEl.innerHTML = `
<div class="modal__card">
           <img src="${respData.posterUrl}" alt="" class="modal__movie__img"> 
           <h2>
            <span class="modal__movie-genre">${respData.nameRu}</span>
            <span class="modal__movie-release-year">${respData.year}</span>
           </h2>
           <ul class="modal__movie-info">
            <div class="loader"></div>
            <li class="modal__movie-genre">Жанр - ${respData.genres.map((elem) => `<span>${elem.genre}<span>`)}</li>
            ${respData.filmLength ? `<li class="modal__movie-runtime">Время - ${respData.filmLength} минут </li>` : '' }
            <li>Сайт: <a class="modal__movie-site" href = "${respData.webUrl}">${respData.webUrl}</a></li>
            <li class="modal__movie-overview">Описание - ${respData.description}</li>
           </ul>
           <button type="button" class="modal__button-close">Закрыть</button>
        </div>
`;
    const btnClose = document.querySelector('.modal__button-close');
    btnClose.addEventListener('click', () => closeModal());

};

function closeModal() {
    modalEl.classList.remove('modal-show');
    document.body.classList.remove('stop-scrolling');
};

window.addEventListener('click', (e) => {
    if (e.target === modalEl) {
        closeModal()
    };
});