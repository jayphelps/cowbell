/** 
 * @class       
 * @extends     CB.ViewController
 * @author      Jay Phelps
 * @since       1.0
 */
Todos.ListViewController = CB.Class.create({ extend: CB.ViewController }, {

    loadView: function () {
        this.view = new Todos.ListView();
    },

    viewDidLoad: function (view) {
        var listView = this.view;

        var item1 = { name: "Kick a dog" };
        var item2 = { name: "Punch a baby" };

        listView.addListItem(item1);
        listView.addListItem(item2);

        CB.delay(function () {
            //listView.removeListItem(item1);
        }, 1000);

        
    }

});

window.count = 0;