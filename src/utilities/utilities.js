(function (CB, window, document) {

    // Since we don't know what order Cowbell will be included we have to be
    // sure we don't clobber a previously included version of lodash.
    // To solve, we simply stash the existing version and reassign it after.
    // Underscore has a noConflict() helper, however, if there isn't actually
    // a conflict it keeps itself in the global namespace. We may eventually
    // remove lodash or fork it directly into Cowbell so we don't want any
    // one to depend on it existing.
    var stashedLodash = window._;

    CBImport("../../lib/lodash.js");

    // Inherit lodash on our namespace. Since lodash has a VERSION property and
    // we do too, we need to override theirs.
    _.extend(CB, window._, { VERSION: CB.VERSION });

    // If a stashed version existed, put it back the way it was, otherwise
    // we'll get rid of the global lodash we created
    if (stashedLodash) {
        window._ = stashedLodash;
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
    CBImport("string.js");

    // Function helpers
    CBImport("function.js"); 

    // Data storage
    CBImport("data.js");

    CB.implementsInterface = function (obj, protocol) {
        for (var key in protocol) {
            var imp = obj[key];

            if (typeof imp === "undefined") return false;

            var impConstructor = imp && imp.constructor;
            var protocolConstructor = protocol[key];

            if (impConstructor !== protocolConstructor) return false;
        }

        return true;
    };

    CB.hashFor = function () {
        var h = "";
        var obj;
        var f;

        for (var i = 0, l = arguments.length; i < l; i++) {
            obj = arguments[i];
            h += (obj && (f = obj.hash) && ( CB.isFunction(f) )) ? f.call(obj) : this.uniqueId(obj);
        }

        return h === "" ? null : h;
    };

    CB.none = function(obj) {
        return obj == null;
    };

// Because lodash.js assigns itself to "this._" instead of "window._"
// we need to apply the window context because all of Cowbell is in running in
// strict mode which causes "this" to be undefined in otherwise implied globals
}).call(window, CB, window, document);
