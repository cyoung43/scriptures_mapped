/**************************************************************************
This file contains the map module for The Scriptures, Mapped
***************************************************************************/


// constants
const INDEX_PLACENAME = 2
const INDEX_LATITUDE = 3
const INDEX_LONGITUDE = 4
const INDEX_FLAG = 11
const LAT_LONG_PARSER = /\((.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),'(.*)'\)/
const ZOOM_LEVEL = 10

// private variables
let gmMarkers = []

// private methods
const addMarker = function (placename, latitude, longitude) {
    let duplicate = false
    let count = 0
    let flag = false
    let element

    gmMarkers.map(location => {
        if (Number(latitude) === location.position.lat() && Number(longitude) === location.position.lng()) {
            duplicate = true

            if (!location.labelContent.includes(placename)) {
                // create a new marker with updated label, and then remove the previous label
                singleMarker(location.labelContent + `, ${placename}`, latitude, longitude)

                // set delete flag to true and get element to delete
                element = count
                flag = true
            }   
        }
        else {
            count += 1
        }
    })

    if (!duplicate) {
        // markerLabel adapted from https://github.com/googlemaps/js-markerwithlabel
        singleMarker(placename, latitude, longitude)
    }
    else if (flag) {
        gmMarkers.splice(element, 1)
    }
}

const clearMarkers = function () {
    gmMarkers.forEach(function (marker) {
        marker.setMap(null)
    })

    gmMarkers = []

    map.setCenter(new google.maps.LatLng(31.7683, 35.2137))
    map.setZoom(8)
}

const setupMarkers = function () {
    if (gmMarkers.length > 0) {
        clearMarkers()
    }

    document.querySelectorAll('a[onclick^=\'showLocation(\']').forEach(function (element) {
        let matches = LAT_LONG_PARSER.exec(element.getAttribute('onclick'))

        if (matches) {
            let placename = matches[INDEX_PLACENAME]
            let latitude = matches[INDEX_LATITUDE]
            let longitude = matches[INDEX_LONGITUDE]
            let flag = matches[INDEX_FLAG]

            if (flag !== '') {
                placename = `${placename} ${flag}`
            }

            addMarker(placename, latitude, longitude)
        }
    })
    setZoom()
}

const setZoom = function () {
    let bounds = new google.maps.LatLngBounds()

    // in case there is only one marker, need to not zoom in so much
    if (gmMarkers.length === 1) {
        bounds.extend(gmMarkers[0].getPosition())
        map.fitBounds(bounds)
        map.setZoom(ZOOM_LEVEL)
    }
    else {
        gmMarkers.map(location => {
            bounds.extend(location.getPosition())
            map.fitBounds(bounds)
        })
    }
}

const showLocation = function (geotagId, placename, latitude, longitude, viewLatitude, viewLongitude, viewTilt, viewRoll, viewAltitude, viewHeading) {
    console.log(geotagId + ' ' + placename + ' ' + latitude + ' ' + longitude + ' ' + viewLatitude + ' ' + viewLongitude + ' ' + viewTilt + ' ' + viewRoll + ' ' + viewAltitude + ' ' + viewHeading)
    
    // let bounds = new google.maps.LatLngBounds()
    // bounds.extend({lat: Number(latitude), lng: Number(longitude)})
    // map.fitBounds(bounds)

    // change to .panTo function instead of using bounds
    map.panTo({lat: Number(latitude), lng: Number(longitude)})
    map.setZoom(ZOOM_LEVEL)
}

const singleMarker = function (placename, latitude, longitude) {
    let marker = new MarkerWithLabel({
        position: {lat: Number(latitude), lng: Number(longitude)},
        clickable: true,
        draggable: false,
        map,
        animation: google.maps.Animation.DROP,
        labelContent: placename,
        labelClass: "labels",
        labelStyle: {
            opacity: .2,
            backgroundColor: "white"
        }
    })

    gmMarkers.push(marker)
}

// api
const mapHelp = {
    clearMarkers,
    setupMarkers,
    setZoom,
    showLocation
}

export default Object.freeze(mapHelp)