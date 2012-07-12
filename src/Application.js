CBImport("Class.js");
CBImport("RootResponder.js");
CBImport("Pane.js");

(function (window, document) {

    /**
     * FIXME: Description needed.
     *
     * @class       
     * @author      Jay Phelps
     * @since       0.1
     */
    var Application = CB.Class.create({

        autoStart: NO,
        delegateName: "ApplicationDelegate",
        keyPane: null,
        mainPane: null,
        delegate: null,
        panes: [],

        __construct: function () {
            if (Application.sharedApplication) throw Error("Cowbell: Only one application can run at a time");

            Application.sharedApplication = this;

            if (this.autoStart) {
                this.start();
            }

            return this;
        },

        start: function () {
            var application = this;

            CB.RootResponder.setup();

            CB.DOM.onReady(function () {
                var delegateClass = application[application.delegateName];

                if (!delegateClass || !delegateClass.isClass) {
                    throw Error("Application Delegate missing or not a class");
                }

                var delegate = new delegateClass();

                if ( !(delegate instanceof CB.ApplicationDelegate) ) {
                    throw Error("Application Delegate must inherit CB.ApplicationDelegate");
                }

                application.delegate = delegate;
                
                // Clear the body so it"s clean slate for the app
                document.body.innerHTML = "";
                
                // Notify app they are ready
                delegate.applicationDidFinishLaunching(application);
            });
        }
    });

    Application.sharedApplication = null;

    Application.create = function (members) {
        return new (CB.Class.create({ extend: CB.Application }, members));
    };

    CB.Application = Application;

})(window, document);