CB.RenderContext = CB.Class.create({

    buffer: null,
    surface: null,

    __construct: function () {
        this.resetBuffer();
    },

    resetBuffer: function () {
        this.setBuffer([]);
    },

    push: function () {
        this.buffer.push.apply(this.buffer, arguments);
    }
});


CB.HTMLElementContext = CB.Class.create({ extend: CB.RenderContext }, {

    __construct: function (surface) {
        this.setSurface(surface);
    },

    drawText: function (value, callback) {
        var surface = document.createTextNode(value);
        var context = new CB.HTMLElementContext(surface);
        this.getBuffer().push(context);

        callback && callback.apply(context);
    },

    drawElement: function (tagName, callback) {
        var surface = document.createElement(tagName);
        var elementContext = new CB.HTMLElementContext(surface);
        this.getBuffer().push(elementContext);

        callback && callback.apply(elementContext);
    },

    drawDiv: function (callback) {
        return this.drawElement("div", callback);
    },

    drawSpan: function (callback) {
        return this.drawElement("span", callback);
    },

    flush: function () {
        var buffer = this.getBuffer();
        var surface = this.getSurface();

        buffer.forEach(function (context) {
            context.flush();

            surface.appendChild(context.getSurface());
        });

        this.resetBuffer();

        return Array.prototype.splice.call(surface.childNodes, 0);
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
    }

});
