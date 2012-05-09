MLImport("Class.js");
MLImport("View.js");

/**
 * No documentation available yet.
 * 
 * @extends     ML.View
 * @author      Jay Phelps
 * @since       0.1
 */ 
ML.Pane = ML.Class.create({ extend: ML.View }, {

    name: "ML-Pane",
    isPane: YES,
    isKeyPane: NO,
    acceptsKeyPane: NO,
    firstResponder: null,
    rootResponder: null,

    rootViewController: null,

    __rootViewControllerDidChange: function (controller) {
        console.log(controller)
        if ( !ML.implementsInterface(controller) ) {
            throw Error("rootViewController does not conform to the ML.ViewDelegateInterface");
        }

        var rootView = controller.getView();
        this.appendChild(rootView);
    },

    makeFirstResponder: function () {
        this.firstResponder = this;
    },

    makeKeyPane: function () {
        ML.RootResponder.setKeyPane(this);
    },

    becomeKeyPane: function () {
        ML.RootResponder.setKeyPane(this);
    },

    resignKeyPane: function () {
        this.isKeyPane = NO;
    },

    appendTo: function (element) {
        if (!ML.isElement(element)) return false;
        return !!element.appendChild(this.getLayer());
    },

    paneDidAttach: function() {
        // hook into root responder
        var responder = this.rootResponder = SC.RootResponder.responder;
        responder.panes.add(this);

        // set currentWindowSize
        this.set("currentWindowSize", responder.computeWindowSize());

        // update my own location
        this.set("isAttached", YES);
        this.parentViewDidChange();

        return this;
    },

    makeKeyAndVisible: function () {
        this.appendTo(document.body);
    }

});