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
import navigation from './navigation.js'

// constants
const NAV_HEADING = 'navheading'
const CURRENT = 's1'
const LINK = 'link'
const s1 = ['#s1', 0, 1, 's1', 0, 1]
const s2 = ['#s2', 2, 3, 's2', 0, 1]
const NAVIGATION = 'The Scriptures'

// private variables
let visible = s1
let offscreen = s2
let temp

// private methods
const animateTransition = function (chapterHtml) {
    let newHash = location.hash.split(':')
    let old = navigation.getOldHash().split(':')

    if (Number(newHash[2]) > Number(old[2]) || Number(newHash[1]) > Number(old[1])) {
        if (Number(newHash[1]) < Number(old[1])) {
            $(visible[0]).css({left: '0%', opacity: 1})
            $(offscreen[0]).css({left: '-100%', opacity: 1})
            $(offscreen[0]).html(chapterHtml)
            $(visible[0]).animate({left: '100%'}, {duration: 500})
            $(offscreen[0]).animate({left: '0%'}, {duration: 500})
            // reset to previous layout
            document.getElementsByClassName(NAV_HEADING)[offscreen[1]].innerHTML += btnNav.nextIcon(btnNav.nextChapter(Number(newHash[1]), Number(newHash[2])), btnNav.previousChapter(Number(newHash[1]), Number(newHash[2])))
            document.getElementsByClassName(NAV_HEADING)[offscreen[2]].innerHTML += btnNav.nextIcon(btnNav.nextChapter(Number(newHash[1]), Number(newHash[2])), btnNav.previousChapter(Number(newHash[1]), Number(newHash[2])))
            temp = visible
            visible = offscreen
            offscreen = temp
        }
        else {
            $(visible[0]).css({left: '0%', opacity: 1})
            $(offscreen[0]).css({left: '100%', opacity: 1})
            $(offscreen[0]).html(chapterHtml)
            $(visible[0]).animate({left: '-100%'}, {duration: 500})
            $(offscreen[0]).animate({left: '0%'}, {duration: 500})
            // reset to previous layout
            document.getElementsByClassName(NAV_HEADING)[offscreen[1]].innerHTML += btnNav.nextIcon(btnNav.nextChapter(Number(newHash[1]), Number(newHash[2])), btnNav.previousChapter(Number(newHash[1]), Number(newHash[2])))
            document.getElementsByClassName(NAV_HEADING)[offscreen[2]].innerHTML += btnNav.nextIcon(btnNav.nextChapter(Number(newHash[1]), Number(newHash[2])), btnNav.previousChapter(Number(newHash[1]), Number(newHash[2])))
            temp = visible
            visible = offscreen
            offscreen = temp
        }
    }
    else {
        $(visible[0]).css({left: '0%', opacity: 1})
        $(offscreen[0]).css({left: '-100%', opacity: 1})
        $(offscreen[0]).html(chapterHtml)
        $(visible[0]).animate({left: '100%'}, {duration: 500})
        $(offscreen[0]).animate({left: '0%'}, {duration: 500})
        // reset to previous layout
        document.getElementsByClassName(NAV_HEADING)[offscreen[1]].innerHTML += btnNav.nextIcon(btnNav.nextChapter(Number(newHash[1]), Number(newHash[2])), btnNav.previousChapter(Number(newHash[1]), Number(newHash[2])))
        document.getElementsByClassName(NAV_HEADING)[offscreen[2]].innerHTML += btnNav.nextIcon(btnNav.nextChapter(Number(newHash[1]), Number(newHash[2])), btnNav.previousChapter(Number(newHash[1]), Number(newHash[2])))
        temp = visible
        visible = offscreen
        offscreen = temp
    }
}

const crossfadeAnimation = function (html) {
    $(offscreen[0]).css({left: '0%', opacity: 0, 'z-index': 2})
    $(offscreen[0]).html(html)
    $(visible[0]).css({'z-index': 1})
    $(visible[0]).animate({opacity: 0}, {duration: 1000})
    $(offscreen[0]).animate({opacity: 1}, {duration: 1000})
    temp = visible
    visible = offscreen
    offscreen = temp
}

const getScripturesCallback = function (chapterHtml) {
    if (navigation.getOldHash() && navigation.getOldHash().split(':').length === 3) {
        animateTransition(chapterHtml)
    }
    else {
        //document.getElementById(visible[3]).innerHTML = chapterHtml
        crossfadeAnimation(chapterHtml)
    
        let ids = location.hash.slice(1).split(':')
    
        document.getElementsByClassName(NAV_HEADING)[visible[4]].innerHTML += btnNav.nextIcon(btnNav.nextChapter(Number(ids[1]), Number(ids[2])), btnNav.previousChapter(Number(ids[1]), Number(ids[2])))
        document.getElementsByClassName(NAV_HEADING)[visible[5]].innerHTML += btnNav.nextIcon(btnNav.nextChapter(Number(ids[1]), Number(ids[2])), btnNav.previousChapter(Number(ids[1]), Number(ids[2])))
    }

    mapHelp.setupMarkers()
}   

const getScripturesFailure = function () {
    document.getElementById(CURRENT).innerHTML = 'Unable to retrieve chapter contents.'
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
    crossfadeAnimation,
    navigateChapter
}

export {visible, offscreen, temp}
export default Object.freeze(chap)

