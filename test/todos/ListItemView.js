/** 
 * @class       
 * @extends     CB.View
 * @author      Jay Phelps
 * @since       1.0
 */
Todos.ListItemView = CB.Class.create({ extend: CB.View }, {

    tagName: "li",
    taskName: "",

    __taskNameDidChange: function (value) {
        this.setInnerText(value);
    }

});