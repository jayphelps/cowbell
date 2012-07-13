CBImport("ListView.js");

/** 
 * @class       
 * @extends     CB.ViewController
 * @author      Jay Phelps
 * @since       1.0
 */
Todos.ListViewController = CB.ViewController.extend({

    loadView: function () {
        this.view = new Todos.ListView();
    },

    viewDidLoad: function (view) {
        var listView = this.view;

        var item1 = { name: "Kick a dog" };
        var item2 = { name: "Punch a baby" };

        listView.addListItem(item1);
        listView.addListItem(item2);
    }

});