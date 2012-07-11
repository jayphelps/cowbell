/** 
 * @class       
 * @extends     CB.ViewController
 * @author      Jay Phelps
 * @since       1.0
 */
Todos.ListViewController = CB.Class.create({ extend: CB.ViewController }, {

    loadView: function () {
        var listView = new Todos.ListView();
        this.setView(listView);
    },

    viewDidLoad: function (view) {
        var listView = this.getView();

        var item1 = { name: "Kick a dog" };
        var item2 = { name: "Punch a baby" };

        listView.addListItem(item1);
        listView.addListItem(item2);

        CB.delay(function () {
            listView.removeListItem(item1);
        }, 3000);

        
    }

});