/**
 * Cowbell
 * (c) 2012 Jay Phelps
 * MIT licensed
 * https://github.com/jayphelps/Cowbell
 */

(function (window, document) {
    // WARNING: Cowbell opts into "strict mode". Any script included inside of here
    // has those rules applied, including files we CBImport()!
    "use strict";

    // prevent a console.log from blowing things up if we are on a browser that
    // does not support it
    if (typeof console === "undefined") {
        window.console = {}

        console.profile  = console.assert = console.info = console.time  =
        console.timeEnd  = console.debug  = console.warn = console.error =
        console.groupEnd = console.trace  = console.dir  = console.log   =
        console.groupCollapsed = function () {};
    }

    // Alternative booleans for people who prefer obj-c style
    window.YES = true;
    window.NO = false;

    /**
     * Primary namespace for Cowbell
     *
     * @namespace
     */
    var CB = window.CB = window.CB || {};

    CB.VERSION = CB.version = "0.1";

    CBImport("utilities.js");

    CBImport("Class.js");
    CBImport("Object.js");
    CBImport("Interface.js");

    CBImport("Event.js");
    CBImport("DOM.js");

    CBImport("Responder.js");
    CBImport("RootResponder.js");

    CBImport("Application.js");
    CBImport("ApplicationDelegate.js");

    CBImport("ViewDelegateInterface.js");
    
    CBImport("View.js");
    CBImport("TemplateView.js");

    CBImport("Pane.js");
    
    CBImport("ViewController.js");

})(window, document);
