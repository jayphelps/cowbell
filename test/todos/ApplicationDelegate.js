Handlebars.registerHelper("view", function(text) {
    //text = Handlebars.Utils.escapeExpression(text);
    //url  = Handlebars.Utils.escapeExpression(url);

    var result = "";
    console.log(arguments)

    return ""//new Handlebars.SafeString(result);
});

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

        mainPane.rootViewController = new Todos.ListViewController();

        mainPane.makeKeyAndVisible();
    }

});