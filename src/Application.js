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

        keyPane: null,
        mainPane: null,
        panes: [],

        __construct: function () {
            if (Application.sharedApplication) throw Error("MLKit: Only one application can run at a time");
            Application.sharedApplication = this;
        },

        initWithDelegate: function (delegateInstance) {
            this.delegateInstance = delegateInstance;
            return this;
        }

    });

    Application.sharedApplication = null;

    ML.Application = Application;

    /**
     * FIXME: Description needed.
     *
     * @function        
     * @author      Jay Phelps
     * @since       0.1
     */
    var startApplication = function (appNamespace, appDelegateName) {
        appNamespace = appNamespace || window;

        var delegate = appNamespace[appDelegateName];

        if (!delegate.isClass || !ML.isFunction(delegate)) throw Error("Delegate is not a class");

        var delegateInstance = new delegate();

        var application = (new ML.Application).initWithDelegate(delegateInstance);

        var applicationDidFinishLaunching = ML.bind(
            delegateInstance.applicationDidFinishLaunching,
            delegateInstance,
            application
        );

        ML.RootResponder.setup();

        ML.DOM.onReady(function () {
            // Clear the body so it"s clean slate for the app
            document.body.innerHTML = "";
            
            // Notify app they are ready
            applicationDidFinishLaunching();
        });
    }

    ML.startApplication = startApplication;

})(window, document);