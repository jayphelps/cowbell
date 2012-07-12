/** 
 * @class       
 * @extends     CB.View
 * @author      Jay Phelps
 * @since       1.0
 */
Todos.ListView = CB.Class.create({ extend: CB.View }, {

    tagName: "ul",
    listItems: null,

    __construct: function () {
        this.listItems = [];
    },

    addListItem: function (listItem) {
        this.listItems.push(listItem);

        var listItemView = new Todos.ListItemView();

        listItemView.setTaskName(listItem.name);

        this.appendChild(listItemView);

        listItem.view = listItemView;
    },

    removeListItem: function (listItem) {
        var listItems = this.listItems;
        var index = CB.indexOf(listItems, listItem);
        
        listItem = listItems.splice(index, 1)[0];
        console.log(listItem.view, this)
        this.removeChild(listItem.view);
    },

    _renderd: function (context) {
        context.begin();
            var layer = context.createElement(this.tagName);
            context.push("Hello world");
        context.end();
    }

});