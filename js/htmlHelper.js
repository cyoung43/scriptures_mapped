/**************************************************************************
This file contains the html helpers for The Scriptures, Mapped
***************************************************************************/

// constants
const REFRESH = 'Reset Map'

// private methods
const anchor = function (volume) {
    return `<a name='${volume.id}' />`
}

const div = function (parameters) {
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

const element = function (tagName, content) {
    return `<${tagName}>${content}</${tagName}>`
}

const link = function (parameters) {
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

const hashLink = function (hashArguments, content) {
    // error with the changeHash function receiving chapter name (missing '') after hashArguments?)
    // had to add "" around the parameter in the function call
    // I want a refresh button too for the map

    if (hashArguments !== undefined) {
        return `<a href='javascript:void(0)' onclick='changeHash("${hashArguments}")' title='${hashArguments[2]}'>${content}</a>`
    }
    else {
        return `<a href='javascript:void(0)' onclick='setZoom()' title='${REFRESH}'>${content}</a>`
    }

}

const icon = function (classKey, flag) {
    let classString = ''
    let sizeString = ''

    if (classKey !== undefined) {
        classString = `class = '${classKey}'`
    }

    if (flag) {
        sizeString = 'style="font-size:1rem"'
    }
    
    return `<i ${classString} ${sizeString}></i>`
}

// public api
const html = {
    anchor,
    div,
    element,
    link,
    hashLink,
    icon
}

export default Object.freeze(html)