(function (ML, window, document) {

    // Since we don't know what order MLKit will be included we have to be
    // sure we don't clobber a previously included version of underscore.
    // To solve, we simply stash the existing version and reassign it after.
    // Underscore has a noConflict() helper, however, if there isn't actually
    // a conflict it keeps itself in the global namespace. We may eventually
    // remove underscore or fork it directly into MLKit so we don't want any
    // one to depend on it existing.
    var stashedUnderscore = window._;

    MLImport("../lib/underscore.js");

    _.extend(ML, window._);

    // If a stashed version existed, put it back the way it was, otherwise
    // we'll get rid of the global underscore we created
    if (stashedUnderscore) {
        window._ = stashedUnderscore;
    } else {
        try {
            delete window._;
        } catch (e) {
            // IE <= 8 throws nasty exceptions
            // for window property deletes...
            window._ = undefined;
        }
    }

    // String helpers
    MLImport("utilities/string.js");

    // Function helpers
    MLImport("utilities/function.js"); 

    // Data storage
    MLImport("utilities/data.js");

    ML.implementsInterface = function (obj, protocol) {
        for (var key in protocol) {
            var imp = obj[key];

            if (typeof imp === "undefined") return false;

            var impConstructor = imp && imp.constructor;
            var protocolConstructor = protocol[key];

            if (impConstructor !== protocolConstructor) return false;
        }

        return true;
    };

    ML.hashFor = function () {
        var h = "";
        var obj;
        var f;

        for (var i = 0, l = arguments.length; i < l; i++) {
            obj = arguments[i];
            h += (obj && (f = obj.hash) && ( ML.isFunction(f) )) ? f.call(obj) : this.uniqueId(obj);
        }

        return h === "" ? null : h;
    };

    ML.none = function(obj) {
        return obj == null;
    };

// Because underscore.js assigns itself to "this._" instead of "window._"
// we need to apply the window context because all of MLKit is in running in
// strict mode which causes "this" to be undefined in otherwise implied globals
}).call(window, ML, window, document);
