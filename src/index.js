import { fetchBreeds, fetchCatByBreed } from './cat-api';
import './css/styles.css';
import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

fetchBreeds().then(createBreedsList);

const selectEl = document.querySelector('.breed-select');
selectEl.addEventListener('change', selectElHandler);
const loaderEl = document.querySelector('.loader');

const catInfoDiv = document.querySelector('.cat-info');

function createBreedsList(data) {
  const result = data.map(({ id, name }) => {
    return { text: name, value: id };
  });

  const emptyObj = { text: ' ', value: ' ' };

  result.unshift(emptyObj);

  new SlimSelect({
    select: '.breed-select',
    data: result,
    settings: {
      allowDeselect: true,
    },
  });
}

function selectElHandler(event) {
  loaderEl.classList.remove('visually-hidden');
  const breedId = selectEl.value;

  if (breedId === ' ') {
    setTimeout(hideLoader, 2500);
    return breedId;
  }
  fetchCatByBreed(breedId)
    .then(data => {
      const catImgURL = data[0].url;
      const catBreedInfo = data[0].breeds[0];

      const catInfoCode = `
    <div class="cat-info-box">
    <img id="photo" class="breed-img" src="${catImgURL}" width="350" loading="lazy" >
    <div class="cat-text-box"> 
    <h1 class="breed-name">${catBreedInfo.name}</h1>
    <p class="breed-description">${catBreedInfo.description}</p>
    <h2>Temperament:</h2>
    <p class="breed-temperament"> ${catBreedInfo.temperament}</p></div>
    </div>
    `;
      catInfoDiv.innerHTML = catInfoCode;
    })
    .catch(error => {
      console.log(error);
      const e = error;
      Notiflix.Notify.failure(`Error: ${e}`);
    });
  setTimeout(hideLoader, 2500);
}

function hideLoader() {
  loaderEl.classList.add('visually-hidden');
}
