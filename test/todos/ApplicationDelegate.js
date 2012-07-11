/** 
 * @class       
 * @extends     CB.ApplicationDelegate
 * @author      Jay Phelps
 * @since       1.0
 */
Todos.ApplicationDelegate = CB.Class.create({

    extend: CB.ApplicationDelegate

}, /** @lends Todos.ApplicationDelegate# */ {

    applicationDidFinishLaunching: function (application) {
        var mainPane = new CB.Pane();
        var controller = new Todos.ListViewController();

        mainPane.setRootViewController(controller);

        mainPane.makeKeyAndVisible();
    }

});