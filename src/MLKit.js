/**
 * MLKit
 * (c) 2012 Jay Phelps
 * MIT licensed
 * https://github.com/jayphelps/MLKit
 */

(function (window, document) {
    // WARNING: MLKit opts into "strict mode". Any script included inside of here
    // has those rules applied, including files we MLImport()!
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
     * Primary namespace for MLKit
     *
     * @namespace
     */
    var ML = window.ML = window.ML || {};

    ML.VERSION = ML.version = "0.1";

    MLImport("utilities.js");

    MLImport("Class.js");
    MLImport("Object.js");
    MLImport("Interface.js");

    MLImport("Event.js");
    MLImport("DOM.js");

    MLImport("Responder.js");
    MLImport("RootResponder.js");

    MLImport("Application.js");
    MLImport("ApplicationDelegate.js");

    MLImport("ViewDelegateInterface.js");
    
    MLImport("View.js");
    MLImport("TemplateView.js");

    MLImport("Pane.js");
    
    MLImport("ViewController.js");

})(window, document);
