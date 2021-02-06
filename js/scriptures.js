// Chris Young | The Scriptures, Mapped | IS542

const Scriptures = (function () {
    // constants
    const BOTTOM_PADDING = '<br /><br />'
    const CLASS_BOOKS = 'books'
    const CLASS_VOLUME = 'volume'
    const DIV_SCRIPTURES_NAVIGATOR = 'scripnav'
    const DIV_SCRIPTURES = 'scriptures'
    const REQUEST_GET = 'GET'
    const REQUEST_STATUS_OK = 200
    const REQUEST_STATUS_ERROR = 400
    const TAG_HEADERS = 'h5'
    const URL_BASE = 'https://scriptures.byu.edu'
    const URL_BOOKS = `${URL_BASE}/mapscrip/model/books.php`
    const URL_VOLUMES = `${URL_BASE}/mapscrip/model/volumes.php`

    // private variables
    let books
    let volumes

    // private method declarations
    let ajax
    let bookChapterValid
    let cacheBooks
    let htmlAnchor
    let htmlDiv
    let htmlElement
    let htmlLink
    let htmlHashLink
    let init
    let navigateBook
    let navigateChapter
    let navigateHome
    let onHashChanged

    // private methods
    ajax = function (url, successCallBack, failureCallBack) {
        let request = new XMLHttpRequest()

        request.open(REQUEST_GET, url, true)

        request.onload = function () {
            if (request.status >= REQUEST_STATUS_OK && request.status < REQUEST_STATUS_ERROR) {
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

    bookChapterValid =  function (bookID, chapter) {
        let book = books[bookID]

        if (book === undefined || chapter < 0 || chapter > book.numChapters) {
            return false
        }

        if (chapter === 0 && book.numChapters > 0) {
            return false
        }

        return true
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

    htmlAnchor = function (volume) {
        return `<a name='${volume.id}' />`
    }
    
    htmlDiv = function (parameters) {
        let classString = ''
        let contentString = ''
        let idString = ''
    
        if (parameters.classKey !== undefined) {
            classString = `class='${parameters.classKey}'`
        }
        if (parameters.content !== undefined) {
            contentString = parameters.content
        }
        if (parameters.id !== undefined) {
            idString = `id='${parameters.id}'`
        }
    
        return `<div ${idString} ${classString}>${contentString}</div>`
    }
    
    htmlElement = function (tagName, content) {
        return `<${tagName}>${content}</${tagName}>`
    }
    
    htmlLink = function (parameters) {
        let classString = ''
        let contentString = ''
        let hrefString = ''
        let idString = ''
    
        if (parameters.classKey != undefined) {
            classString = `class='${parameters.classKey}'`
        }
        if (parameters.content !== undefined) {
            contentString = paramters.content
        }
        if (parameters.href !== undefined) {
            hrefString = `href='${parameters.href}'`
        }
        if (parameters.id !== undefined) {
            idString = `id='${parameters.id}'`
        }
    
        return `<a ${idString} ${classString} ${hrefString}>${contentString}</a>`
    }
    
    htmlHashLink = function (hashArguments, content) {
        return `<a href='javascript:void(0)' onclick='changeHash(${hashArguments})'>${content}</a>`
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

    navigateBook = function (bookID) {
        console.log('Navigate book: ' + bookID)
    }

    navigateChapter = function (bookID, chapter) {
        console.log('Navigate chapter: ' + bookID + ', ' + chapter)
    }

    navigateHome = function (volumeID) {
        document.getElementById(DIV_SCRIPTURES).innerHTML = 
            '<div>Old Testament</div>' +
            '<div>New Testament</div>' +
            '<div>Book of Mormon</div>' +
            '<div>Doctrine and Covenants</div>' +
            '<div>Pearl of Great Price</div>' + volumeID
    }

    onHashChanged = function () {
        let ids = []
        
        if (!volumes) {
            return 'no volumes'
        }

        if (location.hash !== '' && location.hash.length > 1) {
            ids = location.hash.slice(1).split(':')
        }

        if (ids.length <= 0) {
            navigateHome()
        }
        else if (ids.length === 1) {
            let volumeID = Number(ids[0])

            if (volumeID < volumes[0].id || volumeID > volumes.slice(-1)[0].id) {
                navigateHome()
            }
            else {
                navigateHome(volumeID)
            }
        }
        else {
            let bookID = Number(ids[1])

            if (books[bookID] === undefined) {
                navigateHome()
            }
            else {
                
                if (ids.length === 2) {
                    navigateBook(bookID)
                }
                else {
                    let chapter = Number(ids[2])
                    if (bookChapterValid(bookID, chapter)) {
                        navigateChapter(bookID, chapter)
                    }
                    else {
                        navigateHome()
                    }
                }
            }
        }
    }

    // public api

    return {
        init,
        onHashChanged
    }
}())