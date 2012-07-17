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

    attributes: null,
    className: "",

    __classNameDidChange: function (value) {
        this.getSurface().className = value;
    },

    __construct: function (surface) {
        if (!surface) throw Error("CB.HTMLElementContext created without a surface.");

        this.setSurface(surface);
        this.setAttributes([]);
    },

    setAttribute: function (key, value) {
        if (key === void 0) return false;

        this.getSurface().setAttribute(key, value);

        return this;
    },

    drawText: function (value, callback) {
        var surface = document.createTextNode(value);
        var textContext = new CB.HTMLElementContext(surface);
        this.getBuffer().push(textContext);

        callback && callback.apply(textContext);

        return textContext;
    },

    drawElement: function (tagName, callback) {
        var surface = document.createElement(tagName);
        var elementContext = new CB.HTMLElementContext(surface);
        this.getBuffer().push(elementContext);

        callback && callback.apply(elementContext);

        return elementContext;
    },

    drawDiv: function (callback) {
        return this.drawElement("div", callback);
    },

    drawSpan: function (callback) {
        return this.drawElement("span", callback);
    },

    drawHTML: function (html, callback) {
        var xElement = document.createElement('x-element');
        xElement.innerHTML = html;

        var surface = document.createDocumentFragment();
        var childNodes = xElement.childNodes;

        for (var i = 0, l = childNodes.length; i < l; i++) {
            surface.appendChild(childNodes[i]);
        }

        var fragmentContext = new CB.HTMLElementContext(surface);
        this.getBuffer().push(fragmentContext);

        if (callback) throw Error("drawHTML does not have an internal context callback.");

        return fragmentContext;
    },

    flush: function () {
        var buffer = this.getBuffer();
        var surface = this.getSurface();

        for (var context, j = 0, k = buffer.length; j < k; j++) {
            context = buffer[j];
            context.flush();

            surface.appendChild(context.getSurface());
        }

        this.resetBuffer();

        return buffer;
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
