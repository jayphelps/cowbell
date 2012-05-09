(function (ML, window, document) {

    /**
     * Borrowed heavily from SproutCore for now.
     * 
     * @author      Jay Phelps
     * @since       0.1
     */ 
    ML.Event = function (originalEvent) {
        var idx;
        var len;

        // copy properties from original event, if passed in.
        if (originalEvent) {
            this.originalEvent = originalEvent;
            var props = ML.Event._props;
            var key;
            len = props.length;
            idx = len;
            while (--idx >= 0) {
                key = props[idx];
                this[key] = originalEvent[key];
            }
        }

        // Fix timeStamp
        this.timeStamp = this.timeStamp || Date.now();

        // Fix target property, if necessary
        // Fixes #1925 where srcElement might not be defined either
        if (!this.target) this.target = this.srcElement || document;

        // check if target is a textnode (safari)
        if (this.target.nodeType === 3) this.target = this.target.parentNode;

        // Add relatedTarget, if necessary
        if (!this.relatedTarget && this.fromElement) {
            this.relatedTarget = (this.fromElement === this.target) ? this.toElement : this.fromElement;
        }

        // Calculate pageX/Y if missing and clientX/Y available
        if (ML.none(this.pageX) && !ML.none(this.clientX)) {
            var doc = document.documentElement;
            var body = document.body;
            this.pageX = this.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
            this.pageY = this.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
        }

        // Add which for key events
        if (!this.which && ((this.charCode || originalEvent.charCode === 0) ? this.charCode : this.keyCode)) {
            this.which = this.charCode || this.keyCode;
        }

        // Add metaKey to non-Mac browsers (use ctrl for PC"s and Meta for Macs)
        if (!this.metaKey && this.ctrlKey) this.metaKey = this.ctrlKey;

        // Add which for click: 1 == left; 2 == middle; 3 == right
        // Note: button is not normalized, so don"t use it
        if (!this.which && this.button) {
            this.which = ((this.button & 1) ? 1 : ((this.button & 2) ? 3 : ((this.button & 4) ? 2 : 0)));
        }

        /*

        @TODO Removed because right now the code to support this requires browser
              sniffing we aren't doing right now. Figure out a way to change that.

        // Normalize wheel delta values for mousewheel events
        if (this.type === "mousewheel" || this.type === "DOMMouseScroll" || this.type === "MozMousePixelScroll") {
            var deltaMultiplier = ML.Event.MOUSE_WHEEL_MULTIPLIER;

            // normalize wheelDelta, wheelDeltaX, & wheelDeltaY for Safari
            if (ML.browser.isWebkit && originalEvent.wheelDelta !== undefined) {
                this.wheelDelta = 0 - (originalEvent.wheelDeltaY || originalEvent.wheelDeltaX);
                this.wheelDeltaY = 0 - (originalEvent.wheelDeltaY || 0);
                this.wheelDeltaX = 0 - (originalEvent.wheelDeltaX || 0);

                // normalize wheelDelta for Firefox (all Mozilla browsers)
                // note that we multiple the delta on FF to make it"s acceleration more
                // natural.
            } else if (!ML.none(originalEvent.detail) && ML.browser.isMozilla) {
                if (originalEvent.axis && (originalEvent.axis === originalEvent.HORIZONTAL_AXIS)) {
                    this.wheelDeltaX = originalEvent.detail;
                    this.wheelDeltaY = this.wheelDelta = 0;
                } else {
                    this.wheelDeltaY = this.wheelDelta = originalEvent.detail;
                    this.wheelDeltaX = 0;
                }

                // handle all other legacy browser
            } else {
                this.wheelDelta = this.wheelDeltaY = ML.browser.isIE || ML.browser.isOpera ? 0 - originalEvent.wheelDelta : originalEvent.wheelDelta;
                this.wheelDeltaX = 0;
            }

            this.wheelDelta *= deltaMultiplier;
            this.wheelDeltaX *= deltaMultiplier;
            this.wheelDeltaY *= deltaMultiplier;
        }*/

        return this;
    };

    ML.extend(ML.Event, {

        create: function (e) {
            return new ML.Event(e);
        },

        bind: function (elem, eventType, target, method, context, useCapture) {
            if (elem && window.MLView && elem instanceof MLView) {
                elem = elem.layer;
            }

            // if a CQ object is passed in, either call add on each item in the
            // matched set, or simply get the first element and use that.
            if (elem && elem.isCoreQuery) {
                if (elem.length > 0) {
                    elem.forEach(function (e) {
                        this.bind(e, eventType, target, method, context);
                    }, this);
                    return this;
                } else elem = elem[0];
            }
            if (!elem) {
                // nothing to do
                return this;
            }

            if (!useCapture) {
                useCapture = NO;
            }

            // cannot register events on text nodes, etc.
            if (elem.nodeType === 3 || elem.nodeType === 8) return ML.Event;

            // For whatever reason, IE has trouble passing the window object
            // around, causing it to be cloned in the process
            
            // @TODO add this back in with the right check
            /*if (ML.browser.name === ML.BROWSER.ie && elem.setInterval) elem = window;*/

            // if target is a function, treat it as the method, with optional context
            if ( ML.isFunction(target) ) {
                context = method;
                method = target;
                target = null;

                // handle case where passed method is a key on the target.
            } else if (target && ML.isString(method)) {
                method = target[method];
            }

            // Get the handlers queue for this element/eventType.  If the queue does
            // not exist yet, create it and also setup the shared listener for this
            // eventType.
            var events = ML.data(elem, "ml_events") || ML.data(elem, "ml_events", {}),
                handlers = events[eventType];
            if (!handlers) {
                handlers = events[eventType] = {};
                this._addEventListener(elem, eventType, useCapture);
            }

            // Build the handler array and add to queue
            handlers[ML.hashFor(target, method)] = [target, method, context];
            ML.Event._global[eventType] = YES; // optimization for global triggers
            // Nullify elem to prevent memory leaks in IE
            elem = events = handlers = null;
            return this;
        },

        handle: function (event) {
            // ignore events triggered after window is unloaded or if double-called
            // from within a trigger.
            if ((typeof ML === "undefined") || ML.Event.triggered) return YES;

            // returned undefined or NO
            var val, ret, namespace, all, handlers, args, key, handler, method, target;

            // normalize event across browsers.  The new event will actually wrap the
            // real event with a normalized API.
            args = ML.toArray(arguments);
            args[0] = event = ML.Event.normalizeEvent(event || window.event);

            // get the handlers for this event type
            handlers = (ML.data(this, "ml_events") || {})[event.type];

            if (!handlers) return NO; // nothing to do
            // invoke all handlers
            for (key in handlers) {
                handler = handlers[key];
                // handler = [target, method, context]
                method = handler[1];

                // Pass in a reference to the handler function itself
                // So that we can later remove it
                event.handler = method;
                event.data = event.context = handler[2];

                target = handler[0] || this;

                if (!ML.isFunction(method)) {
                    console.log('NOT A FUNCTION:', event, handlers);
                }

                ret = method.apply(target, args);

                if (val !== NO) val = ret;

                // if method returned NO, do not continue.  Stop propagation and
                // return default.  Note that we test explicitly for NO since
                // if the handler returns no specific value, we do not want to stop.
                if (ret === NO) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }

            return val;
        },

        _addEventListener: function (elem, eventType, useCapture) {
            var listener;
            useCapture = useCapture || NO;

            // Save element in cache.  This must be removed later to
            // avoid memory leaks!
            var guid = ML.uniqueId(elem);
            this._elements[guid] = elem;

            listener = ML.data(elem, "listener") || ML.data(elem, "listener", function () {
                return ML.Event.handle.apply(ML.Event._elements[guid], arguments);
            });

            // Bind the global event handler to the element
            if (elem.addEventListener) {
                elem.addEventListener(eventType, listener, useCapture);
            } else if (elem.attachEvent) {
                // attachEvent is not working for IE8 and xhr objects
                // there is currently a hack in request , but it needs to fixed here.
                elem.attachEvent("on" + eventType, listener);
            }

            // Avoid memory reference leak
            elem = listener = null;
        },

        normalizeEvent: function (event) {
            if (event === window.event) {
                // IE can"t do event.normalized on an Event object
                return ML.Event.create(event);
            } else {
                return event.normalized ? event : ML.Event.create(event);
            }
        },

        _elements: {},

        _global: {},

        /**
         * @private properties to copy from native event onto the event
         */
        _props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target timeStamp toElement type view which touches targetTouches changedTouches animationName elapsedTime dataTransfer".split(" ")

    });

})(ML, window, document);