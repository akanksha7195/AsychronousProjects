'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderError = function(msg) {
  countriesContainer.insertAdjacentHTML('beforeend', msg);
}

const getJSON = function(url, errorMsg = 'Something went wrong') {
  return fetch(url).then((response) => {
    if(!response.ok) {
      throw new Error(`${errorMsg} (${response.status})`)
    }
    return response.json();
  });
 };

const getCountryNeighbourData = function(country) {

  getJSON(`https://restcountries.com/v2/name/${country}`, 'Country not found')
  .then((data) => {
      getCountryData(data[0])
      console.log(data);
      const neighbour = data[0].borders?.[0];
      if(!neighbour) throw new Error('No neighbour found!');
      return getJSON(`https://restcountries.com/v2/alpha/${neighbour}`, 'Country not found')
    })
  .then((data2) => getCountryData(data2, 'neighbour'))
  .catch((err) => renderError(`Something went wrong! ${err.message} : Try again.`))
  .finally(() => {
    countriesContainer.style.opacity = 1;
  });
  // const request = fetch(`https://restcountries.com/v2/name/${country}`)
  // .then((response) => {
  //   console.log(response);
  //   if(!response.ok) {
  //     throw new Error(`Country not found (${response.status})`)
  //   }
  //   return response.json()
  // })
  // .then((data) => {
  //   getCountryData(data[0])
  //   console.log(data);
  //   const neighbour = data[0].borders?.[0];
  //   return fetch(`https://restcountries.com/v2/alpha/${neighbour}`)
  // })
  // .then((response) => {
  //   if(!response.ok) {
  //     throw new Error(`Country not found (${response.status})`)
  //   }
  //   response.json()
  // })
  // .then((data2) => getCountryData(data2, 'neighbour'))
  // .catch((err) => renderError(`Something went wrong! ${err.message} : Try again.`))
  // .finally(() => {
  //   countriesContainer.style.opacity = 1;
  // });
}


const getCountryData = function (data, className = '') {
    const html = `
    <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)}</p>
      <p class="country__row"><span>🗣️</span>${data.languages?.[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies?.[0].name}</p>
    </div>
  </article>
    `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
} 

btn.addEventListener('click', function () {
    getCountryNeighbourData('australia');
})

