(function (window, document) {

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

    // To preserve memory, this dummy function is used internally as a safe
    // placeholder for method implementations that do nothing.
    ML.dummyFunction = function () {};

    ML.upperCaseFirst = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

// Because underscore.js assigns itself to "this._" instead of "window._"
// we need to apply the window context because all of MLKit is in running in
// strict mode which causes "this" to be undefined in otherwise implied globals
}).call(window, window, document);
