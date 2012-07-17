CBImport("ListViewController.js");

/** 
 * @class       
 * @extends     CB.ApplicationDelegate
 * @author      Jay Phelps
 * @since       1.0
 */
Todos.ApplicationDelegate = CB.ApplicationDelegate.extend(/** @lends Todos.ApplicationDelegate# */{

    router: null,

    applicationDidFinishLaunching: function (application) {
        this.router = new CB.Router();
        this.router.start();
    }

});