import axios from "axios"
import Notiflix from "notiflix";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39914228-180044369d14c57dff2914049';

let query = "";
let page = 1;

const searchForm = document.querySelector('.search-form')
const divGallery = document.querySelector('.gallery')
const searchInput = document.querySelector('[name="searchQuery"]'); // 
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.hidden = true;

searchForm.addEventListener('submit', onFormSubmit)
searchInput.addEventListener('input', (e) => {
  query = e.target.value;
});
loadMoreBtn.addEventListener('click', loadMoreImages);

    async function getImages(query) {
        const params = new URLSearchParams({
          key: API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page: page,
        per_page: 40,
        })
        const response = await axios.get(`${BASE_URL}?${params}`);
        console.log(response);
        return response
}

function onFormSubmit(e) {
    e.preventDefault();

    page = 1;
    divGallery.innerHTML = "";
    loadMoreBtn.hidden = true;

    Notiflix.Loading.circle("Loading...");

    getImages(query)
    .then(({data: {hits, totalHits}}) => {
        if (hits.length === 0 || query.trim() === "") {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    divGallery.innerHTML = "";
        
            Notiflix.Loading.remove();

        } else {
            markupCreateCards(hits);
              const totalPages = Math.ceil(totalHits/40);
            if (page === totalPages) {
                loadMoreBtn.hidden = true;
            } else {
                loadMoreBtn.hidden = false;
            }
            Notiflix.Loading.remove();
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        }
    })
    .catch(error =>
        console.log(error));
}

function markupCreateCards(arr) {
    const markup = arr.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
        return `<div class="photo-card">
            <a href="${largeImageURL}">
                <img src="${webformatURL}" width="500" alt="${tags}" loading="lazy" />
            </a>
            <div class="info">
                <p class="info-item"><b>Likes</b> ${likes}</p>
                <p class="info-item"><b>Views</b> ${views}</p>
                <p class="info-item"><b>Comments</b> ${comments}</p>
                <p class="info-item"><b>Downloads</b> ${downloads}</p>
            </div>
        </div>`
    }).join("");
    
    divGallery.insertAdjacentHTML("beforeend", markup);
}


function loadMoreImages() {
  page += 1;
  loadMoreBtn.hidden = true;
  Notiflix.Loading.circle("Loading...");

  getImages(query)
    .then(({data: {hits, totalHits}}) => {
            markupCreateCards(hits);
            const totalPages = Math.ceil(totalHits/40);
            if (page === totalPages) {
              loadMoreBtn.hidden = true;
            } else {
            loadMoreBtn.hidden = false;
            }
            Notiflix.Loading.remove();
        }
      )
    .catch(error =>
        console.log(error));
}