/** 
 * @class       
 * @extends     ML.View
 * @author      Jay Phelps
 * @since       1.0
 */
Todos.ListItemView = ML.Class.create({ extend: ML.View }, {

    tagName: "li",
    taskName: "",

    __taskNameDidChange: function (value) {
        this.setInnerText(value);
    }

});