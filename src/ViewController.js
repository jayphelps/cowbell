CBImport("ViewDelegateInterface.js");

(function (window, document) {

    /**
     * No documentation available yet.
     *
     * @class   
     * @name        CB.ViewController   
     * @author      Jay Phelps
     * @since       0.1
     */
    var ViewControllerMembers = {

        /**
         * @property
         * @default     null
         * @type        CB.View
         */
        view: null,

        /**
         * @property
         * @default     ""
         * @type        String
         */
        title: "",

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        __titleDidChange: function (value) {
            CB.Router.setTitle(value);
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        __getTitle: function () {
            return this.title || CB.Router.getTitle();
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        __getView: function () {
            if (!this.view) {
                this.init();
            }

            return this.view;
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        __setView: function (view) {
            if (this.view && this.view.parentView) {
                this.view.parentView.replaceChildWithChild(this.view, view);
            }

            this.view = view;
            view.nextResponder = this;
            view.delegate = this;
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        init: function () {
            // Try loading the view
            this.loadView();

            // If that didn't work out, we gotta bolt
            if (!this.view) throw Error('You must set the view by the end of loadView in CB.ViewController');

            // Notify them of what's up yo
            this.viewDidLoad();
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        loadView: function () {
            // Just in case they don't provide a loadView, we'll set up a default
            // view for them
            this.setView(new CB.View());
        }
        
    };

    var notifications = [

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.ViewController
         * @name        viewDidLoad
         */
        "viewDidLoad",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.ViewController
         * @name        viewWillRender
         */
        "viewWillRender",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.ViewController
         * @name        viewDidRender
         */
        "viewDidRender",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.ViewController
         * @name        viewWillEnterDOM
         */
        "viewWillEnterDOM",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.ViewController
         * @name        viewDidEnterDOM
         */
        "viewDidEnterDOM",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.ViewController
         * @name        viewWillLeaveDOM
         */
        "viewWillLeaveDOM",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.ViewController
         * @name        viewDidLeaveDOM
         */
        "viewDidLeaveDOM",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.ViewController
         * @name        viewWillAppear
         */
        "viewWillAppear",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.ViewController
         * @name        viewDidAppear
         */
        "viewDidAppear",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.ViewController
         * @name        viewWillDisappear
         */
        "viewWillDisappear",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.ViewController
         * @name        viewDidDisappear
         */
        "viewDidDisappear"
    ];

    // All of the default implementations do nothing, so we're going to point
    // them all to a single function to preserve memory but still allow them
    // to be executed safely
    notifications.forEach(function (notification) {
        ViewControllerMembers[notification] = CB.dummyFunction;
    });

    CB.ViewController = CB.Class.create({ implement: CB.ViewDelegateInterface }, ViewControllerMembers);

})(window, document);