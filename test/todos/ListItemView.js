/** 
 * @class       
 * @extends     CB.View
 * @author      Jay Phelps
 * @since       1.0
 */
Todos.ListItemView = CB.View.extend({

    tagName: "li",
    taskName: "",

    __taskNameDidChange: function (value) {
        this.innerText = value;
    },

    renderInContext: function (context) {
        context.drawElement(this.tagName, function () {
            this.drawDiv(function () {
                this.drawSpan()
                    .setClassName("TEST")
                    .setAttribute("EXAMPLE", "man")
                    .drawText("Hello world");

                this.drawHTML("<h1>THIS IS OK<a href='#'>click me</a></h1>");
            });
        });
    }

});