MLImport("Class.js");
MLImport("RootResponder.js");
MLImport("Pane.js");

(function (window, document) {

    /**
     * FIXME: Description needed.
     *
     * @class       
     * @author      Jay Phelps
     * @since       0.1
     */
    var Application = ML.Class.create({

        autoStart: NO,
        delegateName: "ApplicationDelegate",
        keyPane: null,
        mainPane: null,
        delegate: null,
        panes: [],

        __construct: function () {
            if (Application.sharedApplication) throw Error("MLKit: Only one application can run at a time");

            Application.sharedApplication = this;

            if (this.autoStart) {
                this.start();
            }

            return this;
        },

        start: function () {
            var application = this;

            ML.RootResponder.setup();

            ML.DOM.onReady(function () {
                var delegateClass = application[application.delegateName];

                if (!delegateClass || !delegateClass.isClass) {
                    throw Error("Application Delegate missing or not a class");
                }

                var delegate = new delegateClass();

                if ( !(delegate instanceof ML.ApplicationDelegate) ) {
                    throw Error("Application Delegate must inherit ML.ApplicationDelegate");
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
        return new (ML.Class.create({ extend: ML.Application }, members));
    };

    ML.Application = Application;

})(window, document);