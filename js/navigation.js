/**************************************************************************
This file contains the navigation module for The Scriptures, Mapped
***************************************************************************/


// imports
import {books} from './mapScripApi.js'
import {volumes} from './mapScripApi.js'
import chap from './chapter.js'
import mapHelp from './mapHelper.js'
import html from './htmlHelper.js'

// constants
const BOTTOM_PADDING = '<br /><br />'
const CLASS_BOOKS = 'books'
const CLASS_BTN = 'waves-effect my-btn'
const CLASS_CHAPTER = 'chapter'
const CLASS_VOLUME = 'volume'
const DIV_SCRIPTURES_NAVIGATOR = 'scripnav'
const LINK = 'link'
const NAVIGATION = 'The Scriptures'
const TAG_HEADER5 = 'h5'

// private variables
let oldHash = '#1'

// private methods
const bookChapterValid =  function (bookID, chapter) {
    let book = books[bookID]

    if (book === undefined || chapter < 0 || chapter > book.numChapters) {
        return false
    }

    if (chapter === 0 && book.numChapters > 0) {
        return false
    }

    return true
}

const booksGrid = function (volume) {
    return html.div({
        classKey: CLASS_BOOKS,
        content: booksGridContent(volume)
    })
}

const booksGridContent = function (volume) {
    let gridContent = ''

    volume.Books.forEach(function (book) {
        gridContent += html.link({
            classKey: CLASS_BTN,
            id: book.id,
            href: `#${volume.id}:${book.id}`,
            content: book.gridName
        })
    })
    
    return gridContent
}

const changeHash = function (hashArguments) {
    let hash = hashArguments.split(',')
    let book = books[hash[0]]
    oldHash = setOldHash(location.hash)
    
    location.hash = `#${book.parentBookId}:${Number(hash[0])}:${Number(hash[1])}`
}

const chaptersGrid = function (book) {
    return html.div({
        classKey: CLASS_VOLUME,
        content: html.element(TAG_HEADER5, book.fullName)
    }) + html.div({
        classKey: CLASS_BOOKS,
        content: chaptersGridContent(book)
    })
}

const chaptersGridContent = function (book) {
    let gridContent = ''
    let chapter = 1

    // grab volume for href string
    let ids = location.hash.slice(1).split(':')

    while (chapter <= book.numChapters) {
        gridContent += html.link({
            classKey: `${CLASS_BTN} ${CLASS_CHAPTER}`,
            id: chapter,
            href: `#${ids[0]}:${book.id}:${chapter}`,
            content: chapter
        })
        chapter += 1
    }

    return gridContent
}

const getOldHash = function () {
    return oldHash
}

const navigateBook = function (bookID) {
    let book = books[bookID]

    if (book.numChapters <= 1) {
        chap.navigateChapter(bookID, book.numChapters)
    }
    else {
        setOldHash('#1')
        chap.crossfadeAnimation(html.div({
            id: DIV_SCRIPTURES_NAVIGATOR,
            content: chaptersGrid(book)
        }))
    }

    let ids = location.hash.slice(1).split(':')
    let volume = volumes[ids[0] - 1]
    if (bookID) {
        document.getElementById('crumb').innerHTML = `${html.link({
            classKey: LINK,
            id: volume.id,
            href: `#`,
            content: NAVIGATION
        })} > ${html.link({
            classKey: LINK,
            id: book.id,
            href: `#${volume.id}`,
            content: volume.fullName
        })} > ${book.fullName}` 
    }
}

const navigateHome = function (volumeID) {
    setOldHash('#1')
    chap.crossfadeAnimation(html.div({
        id: DIV_SCRIPTURES_NAVIGATOR,
        content: volumesGridContent(volumeID)
    }))

    document.getElementById('crumb').innerHTML = NAVIGATION

    if (volumeID) {
        let volume = volumes[volumeID - 1]
        document.getElementById('crumb').innerHTML = `${html.link({
            classKey: LINK,
            id: volume.id,
            href: `#`,
            content: NAVIGATION
        })} > ${volume.fullName}` 
    }     
}

const onHashChanged = function () {
    let ids = []
    mapHelp.clearMarkers()

    if (!volumes) {
        return 'no volumes'
    }

    if (location.hash !== '' && location.hash.length > 1) {
        ids = location.hash.slice(1).split(':')
    }

    if (ids.length <= 0) {
        oldHash = setOldHash('#1')
        navigateHome()
    }
    else if (ids.length === 1) {
        let volumeID = Number(ids[0])

        if (volumeID < volumes[0].id || volumeID > volumes.slice(-1)[0].id) {
            oldHash = setOldHash('#1')
            navigateHome()
        }
        else {
            oldHash = setOldHash('#1')
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
                oldHash = setOldHash('#1')
                navigateBook(bookID)
            }
            else {
                let chapter = Number(ids[2])

                if (bookChapterValid(bookID, chapter)) {
                    if (getOldHash().split(':').length !== 3) {
                        oldHash = setOldHash('#1')
                    }
                    chap.navigateChapter(bookID, chapter)
                }
                else {
                    navigateHome()
                }
            }
        }
    }
}

const setOldHash = function (hash) {
    let oldHash = hash

    return oldHash
}

const volumesGridContent = function (volumeID) {
    let gridContent = ''

    volumes.forEach(function (volume) {
        if (volumeID === undefined || volumeID === volume.id) {
            gridContent += html.div({
                classKey: CLASS_VOLUME,
                content: html.anchor(volume) + html.element(TAG_HEADER5, volume.fullName)
            })

            gridContent += booksGrid(volume)
        }
    })

    return gridContent + BOTTOM_PADDING
}

// api
const navigation = {
    changeHash,
    getOldHash,
    onHashChanged
}

export default Object.freeze(navigation)