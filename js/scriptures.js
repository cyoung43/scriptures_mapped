/*********************************************************************************
Author: Chris Young
Project: The Scriptures, Mapped
Class: IS 542
Date: 8 March 2021
Version: 2.0
*********************************************************************************/


// imports
import api from './mapScripApi.js'
import mapHelp from './mapHelper.js'
import navigation from './navigation.js'

// public api
const Scriptures = {
    changeHash: navigation.changeHash,
    init: api.init,
    onHashChanged: navigation.onHashChanged,
    setZoom: mapHelp.setZoom,
    showLocation: mapHelp.showLocation
}

export default Object.freeze(Scriptures)
