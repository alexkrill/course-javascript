import './yandex.html'
import { formTemplate } from './templates';

let clusterer;

document.addEventListener('DOMContentLoaded', () => {
    ymaps.ready(init);

    function init() {
        const myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 13
        })

        myMap.events.add('click', async function (e) {
            const coords = e.get('coords');

            openBalloon(myMap, coords, [])
        })

        clusterer = new ymaps.Clusterer({ clusterDisableClickZoom: true });
        clusterer.options.set('hasBalloon', false);

        getGeoObjects(myMap)
        clusterer.events.add('click', function(e) {
          let geoObjectsInCluster = e.get('target').getGeoObjects()
          openBalloon(myMap, e.get('coords'), geoObjectsInCluster)
        })
    }
})

function getReviewsFromLS() {
    const reviews = localStorage.reviews
    return JSON.parse(reviews || "[]")
  }

function getGeoObjects(map) {
    const geoObjects = []
    for (const review of getReviewsFromLS() || []) {
      const placemark = new ymaps.Placemark(review.coords);
      placemark.events.add('click', e => {
        e.stopPropagation();
        openBalloon(map, e.get('coords'), [e.get('target')])
      })
      geoObjects.push(placemark);
    }
  
    clusterer.removeAll()
    map.geoObjects.remove(clusterer)
    clusterer.add(geoObjects)
    map.geoObjects.add(clusterer)
  }

function getReviewList(currentGeoObjects) {
    let reviewListHTML = '';

    for (const review of getReviewsFromLS()) {
        if (currentGeoObjects.some(geoObject => JSON.stringify(geoObject.geometry._coordinates) === JSON.stringify(review.coords))) {
            reviewListHTML += `
            <div class="user-review">
                <div class="user-info">
                    <div class="name">${review.author}</div>
                    <div class="place">${review.place}</div>
                    <div class="date">${date}</div>
                </div>
                <div class="user-text">${review.reviewText}</div>
            </div>
            
            `
        }
    }
    return reviewListHTML;
}

async function openBalloon(map, coords, currentGeoObjects) {
    await map.balloon.open(coords, {
        content: `<div class="reviews">${getReviewList(currentGeoObjects)}</div>${formTemplate}`
    })

    document.querySelector('#add-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const review = {
            coords,
            author: this.elements.author.value,
            place: this.elements.place.value,
            reviewText: this.elements.review.value,
        };

        localStorage.reviews = JSON.stringify([...getReviewsFromLS(), review])

        getGeoObjects(map)
    
        map.balloon.close();
    
    })
}

var today = new Date();
var date = today.getDate()+'.'+(today.getMonth()+1)+'.'+today.getFullYear();
