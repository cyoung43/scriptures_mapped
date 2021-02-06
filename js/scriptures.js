// Chris Young | The Scriptures, Mapped | IS542

const Scriptures = (function () {
    // constants
    const BOTTOM_PADDING = '<br /><br />'
    const CLASS_BOOKS = 'books'
    const CLASS_BTN = 'btn'
    const CLASS_CHAPTER = 'chapter'
    const CLASS_VOLUME = 'volume'
    const DIV_SCRIPTURES_NAVIGATOR = 'scripnav'
    const DIV_SCRIPTURES = 'scriptures'
    const INDEX_PLACENAME = 2
    const INDEX_LATITUDE = 3
    const INDEX_LONGITUDE = 4
    const INDEX_FLAG = 11
    const LAT_LONG_PARSER = /\((.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),'(.*)'\)/
    const REQUEST_GET = 'GET'
    const REQUEST_STATUS_OK = 200
    const REQUEST_STATUS_ERROR = 400
    const TAG_HEADER5 = 'h5'
    const URL_BASE = 'https://scriptures.byu.edu'
    const URL_BOOKS = `${URL_BASE}/mapscrip/model/books.php`
    const URL_SCRIPTURES = `${URL_BASE}/mapscrip/mapgetscrip.php`
    const URL_VOLUMES = `${URL_BASE}/mapscrip/model/volumes.php`

    // private variables
    let books
    let gmMarkers = []
    let volumes

    // private method declarations
    let addMarker
    let ajax
    let bookChapterValid
    let booksGrid
    let booksGridContent
    let cacheBooks
    let chaptersGrid
    let chaptersGridContent
    let clearMarkers
    let encodedScripturesUrlParameters
    let getScripturesCallback
    let getScripturesFailure
    let htmlAnchor
    let htmlDiv
    let htmlElement
    let htmlLink
    let htmlHashLink
    let init
    let navigateBook
    let navigateChapter
    let navigateHome
    let nextChapter
    let onHashChanged
    let previousChapter
    let setupMarkers
    let showLocation
    let titleForBookChapter
    let volumesGridContent

    // private methods
    addMarker = function (placename, latitude, longitude) {
        // NEEDSWORK: check if we already have this longitude/latitude in
        //      the gm array
        // NEEDSWORK: create the marker and append it to gmMarkers  
        // how do I build a marker and how do I build it to the map?  
        let marker = new google.maps.Marker({
            position: {lat: Number(latitude), lng: Number(longitude)},
            map,
            title: placename,
            animation: google.maps.Animation.DROP
        })

        gmMarkers.push(marker)
    }

    ajax = function (url, successCallBack, failureCallBack, skipJSONparse) {
        let request = new XMLHttpRequest()

        request.open(REQUEST_GET, url, true)

        request.onload = function () {
            if (request.status >= REQUEST_STATUS_OK && request.status < REQUEST_STATUS_ERROR) {
                let data = skipJSONparse? request.response : JSON.parse(request.responseText)
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

    booksGrid = function (volume) {
        return htmlDiv({
            classKey: CLASS_BOOKS,
            content: booksGridContent(volume)
        })
    }

    booksGridContent = function (volume) {
        let gridContent = ''

        volume.Books.forEach(function (book) {
            gridContent += htmlLink({
                classKey: CLASS_BTN,
                id: book.id,
                href: `#${volume.id}:${book.id}`,
                content: book.gridName
            })
        })

        return gridContent
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

        console.log(previousChapter(101, 2))
        console.log(previousChapter(213, 1))
        console.log(previousChapter(166, 21))
        console.log(previousChapter(204, 0))
        console.log(previousChapter(101, 1))
    }

    chaptersGrid = function (book) {
        return htmlDiv({
            classKey: CLASS_VOLUME,
            content: htmlElement(TAG_HEADER5, book.fullName)
        }) + htmlDiv({
            classKey: CLASS_BOOKS,
            content: chaptersGridContent(book)
        })
    }

    chaptersGridContent = function (book) {
        let gridContent = ''
        let chapter = 1

        // grab volume for href string
        let ids = location.hash.slice(1).split(':')

        while (chapter <= book.numChapters) {
            gridContent += htmlLink({
                classKey: `${CLASS_BTN} ${CLASS_CHAPTER}`,
                id: chapter,
                href: `#${ids[0]}:${book.id}:${chapter}`,
                content: chapter
            })
            chapter += 1
        }

        return gridContent
    }

    clearMarkers = function () {
        gmMarkers.forEach(function (marker) {
            marker.setMap(null)
        })

        gmMarkers = []
    }

    encodedScripturesUrlParameters = function (bookID, chapter, verses, isJst) {
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

    getScripturesCallback = function (chapterHtml) {
        document.getElementById(DIV_SCRIPTURES).innerHTML = chapterHtml

        setupMarkers()
    }   

    getScripturesFailure = function () {
        document.getElementById(DIV_SCRIPTURES).innerHTML = 'Unable to retrieve chapter contents.'
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
            contentString = parameters.content
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
        let book = books[bookID]

        if (book.numChapters <= 1) {
            navigateChapter(bookID, book.numChapters)
        }
        else {
            document.getElementById(DIV_SCRIPTURES).innerHTML = htmlDiv({
                id: DIV_SCRIPTURES_NAVIGATOR,
                content: chaptersGrid(book)
            })
        }
    }

    navigateChapter = function (bookID, chapter) {
        ajax(encodedScripturesUrlParameters(bookID, chapter), getScripturesCallback, getScripturesFailure, true)
    }

    navigateHome = function (volumeID) {
        document.getElementById(DIV_SCRIPTURES).innerHTML = htmlDiv({
            id: DIV_SCRIPTURES_NAVIGATOR,
            content: volumesGridContent(volumeID)
        })
            
    }

    nextChapter =  function (bookID, chapter) {
        let book = books[bookID]

        if (book !== undefined) {
            if (chapter < book.numChapters) {
                return [
                    bookID,
                    chapter + 1,
                    titleForBookChapter(book, chapter + 1)
                ]
            }
        }

        let nextBook = books[bookID + 1]

        if (nextBook !== undefined) {
            let nextChapterValue = 0

            if (nextBook.numChapters > 0) {
                nextChapterValue = 1
            }

            return [
                nextBook.id,
                nextChapterValue,
                titleForBookChapter(nextBook, nextChapterValue)
            ]
        }
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

    previousChapter = function (bookID, chapter) {
        let book = books[bookID]

        if (book !== undefined) {
            if (chapter > 1) {
                return [
                    bookID,
                    chapter - 1,
                    titleForBookChapter(book, chapter - 1)
                ]
            }

            let previousBook = books[bookID - 1]

            if (previousBook !== undefined) {
                let previousChapterValue = previousBook.numChapters

                return [
                    previousBook.id,
                    previousChapterValue,
                    titleForBookChapter(previousBook, previousChapterValue)
                ]
            }
        }
    }

    setupMarkers = function () {
        if (gmMarkers .length > 0) {
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
    }

    showLocation = function () {
        
    }

    titleForBookChapter = function (book, chapter) {
        if (book !== undefined) {
            if (chapter > 0) {
                return `${book.tocName} ${chapter}`
            }

            return book.tocName
        }
    }

    volumesGridContent = function (volumeID) {
        let gridContent = ''

        volumes.forEach(function (volume) {
            if (volumeID === undefined || volumeID === volume.id) {
                gridContent += htmlDiv({
                    classKey: CLASS_VOLUME,
                    content: htmlAnchor(volume) + htmlElement(TAG_HEADER5, volume.fullName)
                })

                gridContent += booksGrid(volume)
            }
        })

        return gridContent + BOTTOM_PADDING
    }

    // public api

    return {
        init,
        onHashChanged,
        showLocation
    }
}())