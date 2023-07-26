export default function galleryMarkup(data) {
  return data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
        <a class="img-link" href="${largeImageURL}">
          <img class="img-item" src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <ul class="info">
        <li>
          <p class="info-item">
            <b>Likes</b>
            ${likes}
          </p>
        </li>
        <li>
          <p class="info-item">
            <b>Views</b>
            ${views}
          </p>
        </li>
        <li>
          <p class="info-item">
            <b>Comments</b>
            ${comments}
          </p>
        </li>
        <li>
          <p class="info-item">
            <b>Downloads</b>
            ${downloads}
          </p>
        </li>
        </ul>
      </div>`;
      }
    )
    .join('');
}
