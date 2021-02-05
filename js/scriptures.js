// Chris Young | The Scriptures, Mapped | IS542

const scriptures = (function () {
    // constants
    const URL_BASE = 'https://scriptures.byu.edu/'
    const URL_BOOKS = `${URL_BASE}/mapscrip/model/books.php`
    const URL_VOLUMES = `${URL_BASE}mapscrip/model/volumes.php`

    // private variables
    let books
    let volumes

    // private method declarations
    let init
    let cacheBooks
    let ajax

    // private methods
    ajax = function (url, successCallBack, failureCallBack) {
        let request = new XMLHttpRequest()

        request.open('GET', url, true)

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                let data = JSON.parse(request.responseText)
                if (typeof successCallBack === 'function') {
                    successCallBack(data)
                }
            }
            else {
                if (typeof failureCallBack === 'function') {
                    failureCallBack(request)
                }
            }
        }

        request.onerror = failureCallBack
        request.send()
    }

    cacheBooks = function (callback) {
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

    init = function (callback) {
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
    // public api

    return {
        init
    }
}())