CB.RenderContext = CB.Class.create({

    buffer: null,
    element: null,

    __construct: function (tagName, previousContext) {
        tagName = tagName || "div";
        this.element = document.createElement(tagName);
        this.resetBuffer();
    },

    beginDraw: function () {
        this.resetBuffer();
    },

    endDraw: function () {
        var element = this.getElement();

        CB.forEach(this.getBuffer(), function (item) {
            if (item instanceof HTMLElement) {
                element.appendChild(item);
            } else {
                var xElement = document.createElement("x-element");
                xElement.innerHTML = item;
                element.appendChild(xElement.firstChild);
            }
        });

        this.resetBuffer();
    },

    resetBuffer: function () {
        this.setBuffer([]);
    },

    drawElement: function (tagName) {
        this.buffer.push(document.createElement(tagName));
    },

    push: function () {
        this.buffer.push.apply(this.buffer, arguments);
    }

});

CB.SVGRenderContext = CB.Class.create({ extend: CB.RenderContext }, {

    contextContainer: null,
    _raphaelContext: null,

    __construct: function () {
        this.contextContainer = document.createElement("ml-render-context-container");

        var paper = new Raphael(this.contextContainer);

        var descElement = paper.canvas.firstChild;
        if (descElement instanceof SVGDescElement) {
            paper.canvas.removeChild(descElement);
        }

        delete paper.desc;
        
        this.element = paper.canvas;
        this._raphaelContext = paper;
    },

    drawCircle: function () {
        return this._raphaelContext.circle.apply(this._raphaelContext, arguments);
    },

    drawRect: function () {
        this._raphaelContext.rect.apply(this._raphaelContext, arguments);
    }

});


/** 
 * @class       
 * @extends     CB.View
 * @author      Jay Phelps
 * @since       1.0
 */
CB.SVGView = CB.Class.create({ extend: CB.Object }, {

    __getRenderContext: function () {
        return this.renderContext || (this.renderContext = new CB.SVGRenderContext());
    },

    render: function (context) {
        context.beginDraw();
            context.drawCircle(100, 100, 80).attr({ fill: "red" });
            context.drawRect(10, 20, 300, 200);
        context.endDraw();
    }

});