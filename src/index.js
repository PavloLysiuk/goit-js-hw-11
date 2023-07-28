import AxiosApiService from './js/find-image-api';
import galleryMarkup from './js/gallery-markup';
import smoothScroll from './js/smooth-scroll';
import galleryLightbox from './js/simple-lightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const axiosApiService = new AxiosApiService();

const selectors = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  spinner: document.querySelector('.loader'),
  // loadMoreBtn: document.querySelector('.load-more'),
};

selectors.spinner.classList.add('is-hidden');

let totalHits = 0;

selectors.searchForm.addEventListener('submit', onSearch);
// selectors.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  try {
    e.preventDefault();
    removeMarkup();
    selectors.spinner.classList.remove('is-hidden');

    if (e.currentTarget.elements.searchQuery.value.trim() === '') {
      selectors.spinner.classList.add('is-hidden');
      return Notify.failure('Please, enter a search query.');
    }

    axiosApiService.resetPage();
    axiosApiService.query = e.currentTarget.elements.searchQuery.value.trim();

    const images = await axiosApiService.fetchImages();

    if (images.hits.length === 0) {
      selectors.spinner.classList.add('is-hidden');
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    totalHits = images.totalHits;
    Notify.success(`Hooray! We found ${totalHits} images.`);
    totalHits -= images.hits.length;
    addToHTML(galleryMarkup(images.hits));
    selectors.spinner.classList.add('is-hidden');

    // if (totalHits !== 0) {
    //   selectors.loadMoreBtn.classList.remove('is-hidden');
    // } else {
    //   selectors.loadMoreBtn.classList.add('is-hidden');
    // }

    galleryLightbox.refresh();
  } catch (error) {
    selectors.spinner.classList.add('is-hidden');
    console.error('An error occurred during the search:', error);
    Notify.failure('Oops! Something went wrong. Please try again later.');
  }
}

// async function onLoadMore() {
//   const images = await axiosApiService.fetchImages();

//   totalHits -= images.hits.length;

//   addToHTML(galleryMarkup(images.hits));

//   if (totalHits === 0 || totalHits < 0) {
//     selectors.loadMoreBtn.style.display = 'none';
//     Notify.info("We're sorry, but you've reached the end of search results.");
//     return;
//   }

//   galleryLightbox.refresh();
//   smoothScroll();
// }

let page = 1;
let isFetching = false;

async function onScroll() {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  const scrollPosition = scrollTop + clientHeight;

  if (scrollPosition >= scrollHeight - 10 && totalHits > 0 && !isFetching) {
    await infiniteScroll();
  }
}

async function infiniteScroll() {
  if (isFetching || totalHits === 0) return;

  isFetching = true;

  try {
    const nextPage = page + 1;

    if (nextPage * axiosApiService.axiosConfig.params.per_page > totalHits) {
      window.removeEventListener('scroll', onScroll);
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }

    const images = await axiosApiService.fetchImages(nextPage);

    if (images.hits.length === 0) {
      window.removeEventListener('scroll', onScroll);
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }

    totalHits = images.totalHits;
    page = nextPage;

    addToHTML(galleryMarkup(images.hits));
    galleryLightbox.refresh();
    smoothScroll();
  } catch (error) {
    console.error('An error occurred while loading more images:', error);
    Notify.failure(
      'Oops! Something went wrong while loading more images. Please try again later.'
    );
  } finally {
    isFetching = false;
  }
}

window.addEventListener('scroll', onScroll);

function addToHTML(markup) {
  selectors.gallery.insertAdjacentHTML('beforeend', markup);
}

function removeMarkup() {
  selectors.gallery.innerHTML = '';
}
