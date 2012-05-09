/** 
 * @class       
 * @extends     ML.ApplicationDelegate
 * @author      Jay Phelps
 * @since       1.0
 */
Todos.ApplicationDelegate = ML.Class.create({

    extend: ML.ApplicationDelegate

}, /** @lends Todos.ApplicationDelegate# */ {

    applicationDidFinishLaunching:  function (application) {
        var mainPane = new ML.Pane();
        var controller = new Todos.ListViewController();

        mainPane.setRootViewController(controller);

        mainPane.makeKeyAndVisible();
    }

});