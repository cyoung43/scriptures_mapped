/**************************************************************************
This file contains the api module for The Scriptures, Mapped
***************************************************************************/


// constants
const URL_BASE = 'https://scriptures.byu.edu'
const URL_BOOKS = `${URL_BASE}/mapscrip/model/books.php`
const URL_SCRIPTURES = `${URL_BASE}/mapscrip/mapgetscrip.php`
const URL_VOLUMES = `${URL_BASE}/mapscrip/model/volumes.php`

// private variables
let books
let volumes

// private methods
const ajax = function (url, successCallBack, failureCallBack, skipJSONparse) {
    fetch(url).then(
        response => {
            if (response.ok) {
                if (skipJSONparse) {
                    return response.text()
                }

                return response.json()
            }
        }
    ).then(
        result => {
            successCallBack(result  )
        }
    ).catch(
        function (error) {
            if (typeof failureCallBack === 'function') {
                console.log('Error: ', error.message)
                failureCallBack()
            }
            else {
                console.log('Error: ', error.message)
            }
        }
    )
}

const cacheBooks = function (callback) {
    volumes.forEach(volume => {
        let volumeBooks = []
        let bookID = volume.minBookId
        
        while (bookID <= volume.maxBookId) {
            volumeBooks.push(books[bookID])
            bookID += 1
        }
        volume.Books = volumeBooks
    })
    
    if (typeof callback === 'function') {
        callback()
    }
}

const encodedScripturesUrlParameters = function (bookID, chapter, verses, isJst) {
    if (bookID !== undefined && chapter !== undefined) {
        let options = ''

        if (verses !== undefined) {
            options += verses
        }

        if (isJst !== undefined) {
            options += '&jst=JST'
        }

        return `${URL_SCRIPTURES}?book=${bookID}&chap=${chapter}&verses${options}`
    }
}

const init = function (callback) {
    let booksLoaded = false
    let volumesLoaded = false

    ajax(URL_BOOKS, data => {
        books = data
        booksLoaded = true

        if (volumesLoaded) {
            cacheBooks(callback)
        }
    })

    ajax(URL_VOLUMES, data => {
        volumes = data
        volumesLoaded = true

        if (booksLoaded) {
            cacheBooks(callback)
        }
    })
}

const requestChapter = function (bookID, chapter, success, failure) {
    ajax(encodedScripturesUrlParameters(bookID, chapter), success, failure, true)
}

// api
const api = {
    init,
    requestChapter
}

export {books, volumes}
export default Object.freeze(api)