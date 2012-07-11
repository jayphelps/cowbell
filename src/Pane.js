CBImport("Class.js");
CBImport("View.js");

/**
 * No documentation available yet.
 * 
 * @extends     CB.View
 * @author      Jay Phelps
 * @since       0.1
 */ 
CB.Pane = CB.Class.create({ extend: CB.View }, {

    name: "CB-Pane",
    isPane: YES,
    isKeyPane: NO,
    acceptsKeyPane: NO,
    firstResponder: null,
    rootResponder: null,

    rootViewController: null,

    __rootViewControllerDidChange: function (controller) {
        if ( !CB.implementsInterface(controller) ) {
            throw Error("rootViewController does not conform to the CB.ViewDelegateInterface");
        }

        var rootView = controller.getView();
        this.appendChild(rootView);
    },

    makeFirstResponder: function () {
        this.firstResponder = this;
    },

    makeKeyPane: function () {
        CB.RootResponder.setKeyPane(this);
    },

    becomeKeyPane: function () {
        CB.RootResponder.setKeyPane(this);
    },

    resignKeyPane: function () {
        this.isKeyPane = NO;
    },

    appendTo: function (element) {
        if (!CB.isElement(element)) return false;
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