export function renderImages(array, item) {
  const imagesMarkup = array
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
  <img data-image="${largeImageURL}" src="${webformatURL}" alt="${tags}" />
  <div class="stats">
    <p class="stats-item">
      <i class="material-icons">thumb_up</i>
      ${likes}
    </p>
    <p class="stats-item">
      <i class="material-icons">visibility</i>
      ${views}
    </p>
    <p class="stats-item">
      <i class="material-icons">comment</i>
      ${comments}
    </p>
    <p class="stats-item">
      <i class="material-icons">cloud_download</i>
      ${downloads}
    </p>
  </div>
</div>`;
    })
    .join("");
  item.insertAdjacentHTML("beforeend", imagesMarkup);
}