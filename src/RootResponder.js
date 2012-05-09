MLImport("Class.js");
MLImport("Object.js");

/**
 * No documentation available yet.
 * 
 * @author      Jay Phelps
 * @since       0.1
 */ 
ML.RootResponder = ML.Object.create(/** @lends ML.RootResponder# */{

    keyPane: null,

    setKeyPane: function (pane) {
        this.keyPane = pane;
    },

    methodConversionTable: {
        "click":         "mouseClicked",
        "dblclick":      "mouseDoubleClicked", 
        "mousedown":     "mousePressed",
        "mouseup":       "mouseReleased",
        "mousemove":     "mouseMoved",
        "mouseenter":    "mouseEntered",
        "keyup":         "keyReleased",
        "keydown":       "keyPressed",
        "keypress":      "keyTyped",
        "focusin":       "focused",
        "focus":         "focused",
        "focusout":      "blurred",
        "blur":          "blurred",
        "transitionend": "CSSTransitionEnded",
        "change":        "changed"
    },

    listenFor: function (keyNames, target, receiver, useCapture) {
        receiver = receiver || this;

        ML.forEach(keyNames, function (keyName) {

            var method = receiver[keyName] = function (e) {
                
            };

            if (method) ML.Event.bind(
                target,
                keyName,
                receiver,
                method,
                null,
                useCapture
            );

        }, this);

        return receiver;
    },

    setup: function () {
        // handle basic events
        this.listenFor([
            "mouseup", "click", "dblclick", "mousedown", "mousemove",
            "keydown", "keyup", "selectstart", "contextmenu",
            "beforedeactivate"
        ], document);

    }

});