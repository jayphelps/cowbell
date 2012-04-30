(function (window, document) {
    
    var DOM = {

        isReady: false,
        callbacks: [],

        ready: function () {
            this.isReady = true;

            var callbacks = this.callbacks;

            for (var i = 0, l = callbacks.length; i < l; i++) {
                callbacks[i]();
            }
        },

        onReady: function (fn) {
            if (this.isReady) {
                fn();
                return true;
            }

            this.callbacks.push(fn);
            return false;
        }
    };

    var readyBound = false;

    function bindDOMReady() {

        if (readyBound) return;
        readyBound = true;

        // Catch cases where the the DOM is already ready
        if (document.readyState === "complete") {
            // Defer execution of ready() to not block the thread while other
            // scripts set things up
            return setTimeout(DOM.ready, 1);
        }

        // All decent browsers support this
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", function DOMContentLoaded() {
                document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
                DOM.ready();
            }, false);

        // Good old IE...
        } else if (document.attachEvent) {
            // Safely for use in iframes
            document.attachEvent("onreadystatechange", function DOMContentLoaded() {
                if (document.readyState === "complete") {
                    document.detachEvent("onreadystatechange", DOMContentLoaded);
                    DOM.ready();
                }
            });

            // A fallback to window.onload, that will always work
            window.attachEvent("onload", DOM.ready);

            // If IE and not an iframe
            // continually check to see if the document is ready
            if (document.documentElement.doScroll && window == window.top)(function doScrollCheck() {
                if (DOM.isReady) return;

                try {
                    // IE ready detection trick by Diego Perini
                    // http://javascript.nwbox.com/IEContentLoaded/
                    document.documentElement.doScroll("left");
                } catch (error) {
                    setTimeout(doScrollCheck, 0);
                    return;
                }

                // Once we make it here, we"re ready to go
                DOM.ready();
            })();
        }
    }

    bindDOMReady();

    ML.DOM = DOM;

})(window, document);