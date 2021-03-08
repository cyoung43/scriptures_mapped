/**************************************************************************
This file contains the chapter module for The Scriptures, Mapped
***************************************************************************/


// imports
import {books} from './mapScripApi.js'
import {volumes} from './mapScripApi.js'
import api from './mapScripApi.js'
import btnNav from './buttonNav.js'
import html from './htmlHelper.js'
import mapHelp from './mapHelper.js'

// constants
const NAV_HEADING = 'navheading'
const DIV_SCRIPTURES = 'scriptures'
const LINK = 'link'
const NAVIGATION = 'The Scriptures'

// private methods
const getScripturesCallback = function (chapterHtml) {
    document.getElementById(DIV_SCRIPTURES).innerHTML = chapterHtml

    let ids = location.hash.slice(1).split(':')

    document.getElementsByClassName(NAV_HEADING)[0].innerHTML += btnNav.nextIcon(btnNav.nextChapter(Number(ids[1]), Number(ids[2])), btnNav.previousChapter(Number(ids[1]), Number(ids[2])))
    document.getElementsByClassName(NAV_HEADING)[1].innerHTML += btnNav.nextIcon(btnNav.nextChapter(Number(ids[1]), Number(ids[2])), btnNav.previousChapter(Number(ids[1]), Number(ids[2])))

    mapHelp.setupMarkers()
}   

const getScripturesFailure = function () {
    document.getElementById(DIV_SCRIPTURES).innerHTML = 'Unable to retrieve chapter contents.'
}

const navigateChapter = function (bookID, chapter) {
    api.requestChapter(bookID, chapter, getScripturesCallback, getScripturesFailure)

    let ids = location.hash.slice(1).split(':')
    let volume = volumes[ids[0] - 1]
    let book = books[bookID]
    if (chapter) {
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
        })} > ${html.link({
            classKey: LINK,
            id: chapter,
            href: `#${volume.id}:${book.id}`,
            content: book.fullName
        })} > ${chapter}` 
    }
}

// api
const chap = {
    navigateChapter
}

export default Object.freeze(chap)

