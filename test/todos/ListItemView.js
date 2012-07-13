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
    },

    renderInContext: function (context) {
        context.drawElement(this.getTagName(), function () {
            this.drawDiv(function () {
                this.drawSpan(function () {
                    this.drawText("Hello world");
                });
            });
        });
    }

});