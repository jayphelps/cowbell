/**
 * @namespace
 */
window.ML = window.ML || {};

// Since we don't know what order this script will be included we have to be
// sure we don't clobber a previously included version of library we require.
// So we stash any conflicts, include our versions and reassign them, then put
// the stashed version back.
(function (window, document) {

    var libs = ["_"];
    var stash = {};

    for (var i = 0, l = libs.length; i < l; i++) {
        var libName = libs[i];
        stash[libName] = window[libName];
    }

    MLImport("../lib/underscore.js");

    _.extend(ML, window._);

    for (var i = 0, l = libs.length; i < l; i++) {
        var libName = libs[i];

        try {
            delete window[libName];
        } catch (e) {
            // IE <= 8 throws nasty exceptions
            // for window property deletes...
            window[libName] = undefined;
        }

        var stashedLib = stash[libName];

        if (stashedLib) {
            window[libName] = stashedLib;
        }
    }

})(window, document);

/**
 * NOTE: any script included inside here is in "strict mode", including any
 * files you may MLImport()!
 */
(function (window, document) {
    "use strict";

    // prevent a console.log from blowing things up if we are on a browser that
    // does not support it
    if (typeof console === "undefined") {
        window.console = {}

        console.debug = console.dir = console.error = console.groupCollapsed =
        console.groupEnd = console.info = console.log = console.time =
        console.timeEnd = console.trace = console.warn = console.assert = 
        console.profile = function () {};
    }

    window.YES = true;
    window.NO = false;

    var ML = window.ML;

    ML.VERSION = ML.version = "0.1";

    // To preserve memory, this dummy function is used internally as a safe
    // placeholder for method implementations that do nothing.
    ML.dummyFunction = function () {};

    ML.upperCaseFirst = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    MLImport("Class.js");
    MLImport("Object.js");
    MLImport("Interface.js");
    MLImport("DOM.js");

    MLImport("Application.js");
    MLImport("ApplicationDelegate.js");

    MLImport("View.js");
    MLImport("ViewController.js");

})(window, document);
