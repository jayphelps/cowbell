CBImport("ListItemView.js");

/** 
 * @class       
 * @extends     CB.View
 * @author      Jay Phelps
 * @since       1.0
 */
Todos.ListView = CB.View.extend({

    tagName: "ul",
    listItems: null,

    __construct: function () {
        this.listItems = [];
    },

    addListItem: function (listItem) {
        this.listItems.push(listItem);

        var listItemView = new Todos.ListItemView();

        listItem.view = listItemView;
        listItemView.taskName = listItem.name;

        this.appendChild(listItemView);
    },

    removeListItem: function (listItem) {
        var listItems = this.listItems;
        var index = CB.indexOf(listItems, listItem);
        
        listItem = listItems.splice(index, 1)[0];
        this.removeChild(listItem.view);
    }

});