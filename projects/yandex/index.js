import './yandex.html'
import { formTemplate } from './templates';

const reviews = []


document.addEventListener('DOMContentLoaded', () => {
    ymaps.ready(init);

    function init() {
        const myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 13
        })

        myMap.events.add('click', function (e) {
            const coords = e.get('coords');

            openBalloon(myMap, coords)
        })
    }
})

function getOptionsCluster(coords) {
    const clusterObjects = [];

    for (const review of reviews) {
        if (JSON.stringify(review.coords) === JSON.stringify(coords)){
            const geoObj = new ymaps.GeoObject({
                geometry: {type: 'Point', coordinates: coords}
            })
            clusterObjects.push(geoObj);
        }
        
    }
    return clusterObjects;
}

function addCluster(map, coords) {
    const clusterer = new ymaps.Clusterer({clusterDisableClickZoom: true});
    clusterer.options.set('hasBalloon', false);

    function addToCluster() {
        const myGeoObjects = getOptionsCluster(coords);
        clusterer.add(myGeoObjects);
        map.geoObjects.add(clusterer);
        map.balloon.close()
    }

    clusterer.events.add('click', function (e) {
        e.preventDefault();
        openBalloon(map, coords, clusterer, addToCluster)
    })

    addToCluster();
}

function getReviewList(coords) {
    let reviewListHTML = '';

    for (const review of reviews) {
        if (JSON.stringify(review.coords) === JSON.stringify(coords)) {
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

async function openBalloon(map, coords, clusterer, fn) {
    await map.balloon.open(coords, {
        content: `<div class="reviews">${getReviewList(coords)}</div>${formTemplate}`
    })

    document.querySelector('#add-form').addEventListener('submit', function(e) {
        e.preventDefault();
        if (clusterer) {
            clusterer.removeAll();
        }

        reviews.push({
            coords: coords,
            author: this.elements.author.value,
            place: this.elements.place.value,
            reviewText: this.elements.review.value,
        })
        !fn ? addCluster(map, coords) : fn()
        map.balloon.close()
    })
}

var today = new Date();
var date = today.getDate()+'.'+(today.getMonth()+1)+'.'+today.getFullYear();
