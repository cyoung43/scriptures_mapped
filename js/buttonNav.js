/**************************************************************************
This file contains the button navigation module for The Scriptures, Mapped
***************************************************************************/


// import
import {books} from './mapScripApi.js'
import html from './htmlHelper.js'

// private methods
const nextChapter =  function (bookID, chapter) {
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

const nextIcon = function (next, previous) {
    let classString = 'fas fa-chevron-circle-'
    let refreshString = 'fas fa-sync'
    let left =  'left'
    let right = 'right'

    if (next !== undefined && previous !== undefined) {
        return html.div({
            classKey: 'nextprev',
            content: html.hashLink(previous, html.icon(classString + left)) + '\t' +
                html.hashLink(undefined, html.icon(refreshString, true)) + '\t' +
                html.hashLink(next, html.icon(classString + right))
        })
    }
    else if (next !== undefined) {
        return html.div({
            classKey: 'nextprev',
            content: html.hashLink(next, html.icon(classString + right))
        })
    }
    else if (previous !== undefined) {
        return html.div({
            classKey: 'nextprev',
            content: html.hashLink(previous, html.icon(classString + left))
        })
    }
}

const previousChapter = function (bookID, chapter) {
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

const titleForBookChapter = function (book, chapter) {
    if (book !== undefined) {
        if (chapter > 0) {
            return `${book.tocName} ${chapter}`
        }

        return book.tocName
    }
}

// api
const btnNav = {
    nextChapter,
    nextIcon,
    previousChapter
}

export default Object.freeze(btnNav)