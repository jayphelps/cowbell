CBImport("ListViewController.js");

/** 
 * @class       
 * @extends     CB.ApplicationDelegate
 * @author      Jay Phelps
 * @since       1.0
 */
Todos.ApplicationDelegate = CB.ApplicationDelegate.extend(/** @lends Todos.ApplicationDelegate# */{

    applicationDidFinishLaunching: function (application) {
        var mainPane = new CB.Pane();

        mainPane.rootViewController = new Todos.ListViewController();

        mainPane.makeKeyAndVisible();
    }

});