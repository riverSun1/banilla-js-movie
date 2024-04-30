const API_URL = "https://api.themoviedb.org/3/movie/popular?language=ko-KR&api_key=a047e5786421470e5226ee225453e02c";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w1280/";
const SEARCH_API =
  'https://api.themoviedb.org/3/search/movie?language=ko-KR&api_key=a047e5786421470e5226ee225453e02c&query="';

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

const COUNT_PER_PAGE = 20; // 한 페이지 당 최대 20개의 요소를 보여줄 것

let searchTerm = ""; // 검색어를 저장할 변수
let currentPage = 1; // 현재 페이지 번호를 저장할 변수

getMovies(API_URL, 1); // 초기 영화 목록 로드

// 영화 데이터 가져오기
async function getMovies(url, page) {
  const res = await fetch(url + `&page=${page}`);
  const data = await res.json();
  showMovies(data.results);
}

// 영화 목록 보여주기
function showMovies(movies) {
  main.innerHTML = "";

  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview, id } = movie;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    movieEl.innerHTML = `
            <img src="${IMG_BASE_URL + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">⭐${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>
        `;
    movieEl.addEventListener("click", () => {
      window.alert(`영화 id : ${id}`);
    });
    main.appendChild(movieEl);
  });
  createPagination(); // 페이지네이션 생성
}

// 페이지네이션 생성
function createPagination() {
  pagination.innerHTML = "";

  for (let i = 1; i <= 20; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.innerText = i;
    pageBtn.addEventListener("click", () => {
      currentPage = i; // 페이지 버튼 클릭 시 현재 페이지 번호 변경
      if (searchTerm !== "") {
        getMovies(SEARCH_API + searchTerm, currentPage);
      } else {
        getMovies(API_URL, currentPage);
      }
    });
    pagination.appendChild(pageBtn);
  }
}

// 영화 평점에 따라 CSS 클래스를 반환하는 함수
function getClassByRate(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

// 검색 폼 제출 시 실행되는 이벤트 핸들러
form.addEventListener("submit", (event) => {
  event.preventDefault();

  searchTerm = search.value;

  if (searchTerm !== "") {
    getMovies(SEARCH_API + searchTerm, currentPage); // 검색어에 따른 영화 목록 로드
    search.value = ""; // 검색어 입력 필드 비우기
  } else {
    window.location.reload(); // 검색어가 없으면 페이지 새로고침
  }
});
