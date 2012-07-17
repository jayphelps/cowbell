CBImport("Class.js");

/**
 * No documentation available yet.
 * 
 * @extends     Array
 * @author      Jay Phelps
 * @since       0.1
 */ 
CB.Router = CB.Class.create({

    routes: null,
    panes: null,
    keyPane: null,

    __getKeyPane: function () {
        return this.getPanes()[0];
    },

    __construct: function () {
        this.setRoutes([]);
        this.setPanes([]);
    },

    start: function () {
        this.routePath(window.location.pathname);
        var mainPane = new CB.Pane();

        mainPane.setRootViewController(new Todos.ListViewController());
        mainPane.makeKeyAndVisible();

        this.getPanes().push(mainPane);
    },

    routePath: function (path) {
        var routes = this.getRoutes();
    }

});