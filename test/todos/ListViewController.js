/** 
 * @class       
 * @extends     ML.ViewController
 * @author      Jay Phelps
 * @since       1.0
 */
Todos.ListViewController = ML.Class.create({ extend: ML.ViewController }, {

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

        ML.delay(function () {
            listView.removeListItem(item1);
        }, 3000);

        
    }

});