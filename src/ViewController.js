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
            // @FIXME This was simply wrong because it should only change the
            // router title if it is the current view controller on the top
            // of the stack.
            // CB.Router.setTitle(value);
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
         * @property
         * @default     null
         * @type        CB.View
         */
        view: null,

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        __getView: function () {
            if (!this.__view) {
                this.init();
            }

            return this.__view;
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        __setView: function (view) {
            if (this.__view && this.__view.parentView) {
                this.__view.parentView.replaceChildWithChild(this.__view, view);
            }

            this.__view = view;
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