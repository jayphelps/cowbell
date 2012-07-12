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
        var controller = new Todos.ListViewController();

        mainPane.setRootViewController(controller);

        mainPane.makeKeyAndVisible();

        /*var source = document.getElementById("template").innerHTML;

        var template = Handlebars.compile(source);

        var context = { title: "My New Post", body: "This is my first post!" };
		var html = template(window);
		console.log(template)

		document.write(html);*/
    }

});