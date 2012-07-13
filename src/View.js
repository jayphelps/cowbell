CBImport("Class.js");
CBImport("Responder.js");
CBImport("RenderContext.js");

(function (window, document) {

    /**
     * No documentation available yet.
     * 
     * @extends     Array
     * @author      Jay Phelps
     * @since       0.1
     */ 
    function ClassList() {
        var classList = this;

        this.isUpdating = NO;
        this.isWaitingForUpdate = false;
        this._view = this._view  || {};
        
        // Apply any constructor-sent items
        this.push.apply(this, arguments);

        var realMutatorProps = {};
        
        // We're using this to hook all the normal mutatorProps Array
        // methods with a call to update the actual className on the
        // DOMElement. This gives us Array-like access that
        // still updates the DOMElement. We have to list all
        // the properties out because there isn't a cross-browser
        // way of enumerating native, non-enumeratable properties
        var mutatorProps = "push pop reverse shift sort splice unshift";
        
        mutatorProps.replace(/\w+/g, function (methodName) {
            
            realMutatorProps[methodName] = classList[methodName];
            
            classList[methodName] = function () {
                // Call the real method
                var result = realMutatorProps[methodName].apply(this, arguments);

                // Update the actual className property on the
                // real DOMElement layer
                this._updateClassName();
                
                return result;
            };
            
        });

        // Prevent leak from closure
        mutatorProps = null;
    }

    // Inherit from Array
    ClassList.prototype = [];

    /**
     * No documentation available yet.
     * 
     * @return  {void}
     */     
    ClassList.prototype.item = function (i) {  
        return this[i];  
    };  

    /**
     * No documentation available yet.
     * 
     * @return  {void}
     */ 
    ClassList.prototype.has = ClassList.prototype.contains = function (token) {  
        token += "";  
    
        return CB.indexOf(this, token) !== -1;  
    };

    /**
     * No documentation available yet.
     * 
     * @return  {void}
     */ 
    ClassList.prototype.add = function (token) {
        var classList = this;
        var result;

        if (!token) {
            return NO;
        }

        if (CB.isArray(token)) {

            result = [];

            CB.forEach(token, function (token) {
                var ret = classList.add(token);
                if (ret) {
                    result.push( ret );
                }
            });

            return result;
        }
        
        token += "";
        
        if (CB.indexOf(this, token) === -1) {
            result = this.push(token);
        }
        
        return result;
    };

    /**
     * No documentation available yet.
     * 
     * @return  {void}
     */ 
    ClassList.prototype.remove = function (token) {
        var result;
        
        token += "";
        var index = CB.indexOf(this, token);
        
        if (index !== -1) {                 
            result = this.splice(index, 1);
        }
        
        return result;      
    };

    /**
     * No documentation available yet.
     * 
     * @return  {void}
     */ 
    ClassList.prototype.toggle = function (token) {
        var result;
        token += "";
        
        if (CB.indexOf(this, token) === -1) {
            result = this.add(token);
        } else {
            result = this.remove(token);
        }
        
        return result;
    };

    /**
     * No documentation available yet.
     * 
     * @return  {void}
     */ 
    ClassList.prototype.clone = function (token) {
        return this.toString().split(",");
    };
    
    /**
     * No documentation available yet.
     * 
     * @return  {void}
     */ 
    ClassList.prototype._updateClassName = function () {
        var classList = this;
        var view = this._view;

        // So we don't update the className an unnecessarily
        if (!this.isWaitingForUpdate) {
            this.isWaitingForUpdate = true;

            // Defer the update until the view's layer is rendered
            view.whenRendered(function () {
                // Put it back to default
                classList.isWaitingForUpdate = false;

                // If our element actually exists we'll 
                // update it with our current classes.
                // Otherwise, we'll just sit on the changes
                if (!classList.isUpdating) {
                    var layer = view.__layer;
                    layer.forEach(function (node) {
                        var className = node.className;

                        // If the node doesn't have a className property let's
                        // get outta here. No work to do.
                        if (className === void 0) return;

                        var isSVG = !CB.isUndefined(className.baseVal);

                        // The first time this runs we need to merge any
                        // existing classNames off the real layer element
                        // with our ClassList otherwise we'll overwrite them
                        if (!classList._hasSetClassNameBefore) {
                            if (isSVG) {
                                className = className.baseVal;
                            }
                            // CSS Classes that already existed on the layer
                            var originalClasses = className.split(" ");

                            // Prevent infite recursion
                            classList.isUpdating = YES;

                            // Add each existing className to our ClassList
                            for (var i = 0, l = originalClasses.length; i < l; i++) {
                                classList.add(originalClasses[i]);
                            }

                            // Back to what it was
                            classList.isUpdating = NO;

                            // So this only runs the first time
                            classList._hasSetClassNameBefore = YES;
                        }

                        var newClassName = classList.join(" ");

                        // Finally, change the real className of the HTML element
                        if (isSVG) {
                            node.className.baseVal = newClassName;
                        } else {
                            node.className = newClassName;
                        }
                    });
                }
            });
        }
    };
        
    /**
     * No documentation available yet.
     * 
     * @return  {void}
     */         
    ClassList.prototype.toString = function () {
        return this.join(",");
    };

    /**
     * Views are cooooool. Yep.
     *
     * @class
     * @name        CB.View 
     * @extends     CB.Responder
     * @author      Jay Phelps
     * @since       0.1
     */
    var ViewMembers = /** @lends CB.View# */ {

        // =====================================================================
        // instance properties
        // =====================================================================

        /**
         * For duck typing
         * 
         * @property
         * @default     YES
         * @type        Boolean
         */
        isView: YES,

        /**
         * If the view is attached to the DOM
         * 
         * @property
         * @default     NO
         * @type        Boolean
         */
        isAttached: NO,

        /**
         * Determines what HTML element the layer should be.
         * 
         * @property
         * @default     "div"
         * @type        String
         */
        tagName: "div",

        /**
         * @property
         * @default     null
         * @type        CB.View
         */
        parentView: null,

        /**
         * @property
         * @default     Empty array
         * @type        Array
         */
        childViews: null,

        /**
         * @property
         * @default     ClassList with CB-View
         * @type        ClassList
         */
        classList: null,

        /**
         * @property
         * @default     NO
         * @type        Boolean
         */
        isRendered: NO,

        // =====================================================================
        // layer + getter/setter
        // =====================================================================

        /**
         * @property
         * @default     null
         * @type        Element
         */
        layer: null,

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        __getLayer: function () {

            if (!this.__layer) {
                if (this.hasYES) {
                    console.log(this.__layer)
                    throw Error('hmm')
                }
                this.hasYES = true;
                // Allow pre-hooks before render
                this.willRender();

                this.render();

                /*// Get the layer out of our context
                this.__layer = context.getBuffer()[0];

                this.__layer = this.__layer && this.__layer.getSurface();
                console.log('layer', this.__layer)

                if (!this.__layer) {
                     this.__layer = document.createElement('no');
                }*/

                this.classList._updateClassName();

                this.setIsRendered(YES);
                
                // Let them know the view is now rendered and the layer exists
                this.didRender();
            }

            return this.__layer;
        },

        // =====================================================================
        // renderContext + getter
        // =====================================================================

        /**
         * @property
         * @default     null
         * @type        CB.RenderContext
         */
        renderContext: null,

        __getRenderContext: function () {
            if (!this.__renderContext) {
                var parentView = this.getParentView();
                var surface = parentView && parentView.getRenderContext().getSurface() || document.body;
                console.log('f', surface)
                this.__renderContext = new CB.HTMLElementContext(surface);
            }

            return this.__renderContext;
        },

        // =====================================================================
        // innerText + getter/setter
        // =====================================================================

        /**
         * @property
         * @default     ""
         * @type        String
         */
        innerText: "",

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        __getInnerText: function (hard) {
            if (hard) {
                var layer = this.__layer;
                if (layer) {
                    if (layer.innerText) {
                        return layer.innerText;
                    } else {
                        var value = layer.innerHTML
                            .replace(/\&lt;br\&gt;/gi,"\n")
                            .replace(/(&lt;([^&gt;]+)&gt;)/gi, "");

                        return value;
                    }
                }
            }

            return this.__innerText;
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        __setInnerText: function (value) {
            this.__innerText = value;

            this.whenRendered(function (layer) {
                if (layer.innerText) {
                    layer.innerText = value;
                } else {
                    layer.innerHTML = value.replace(/(<([^>]+)>)/gi, "<$1>");
                }
            });
        },

        // =====================================================================
        // width + getter/setter
        // =====================================================================

        width: 0,

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        __getWidth: function (hard) {
            // If they want a hard refresh or if the width is falsey we're
            // going to check the real layer to confirm it's true value
            if (!this.__width || hard) {
                var layer = this.__layer;
                if (layer) {
                    return parseInt(layer.clientWidth, 10);
                }
            }

            return this.width;
        },

        // =====================================================================
        // style + getter/setter
        // =====================================================================

        style: null,

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        __setStyle: function (key, value) {
            // Prevents exceptions in strange IE circumstances with bad args
            if (!key || typeof value === 'undefined') {
                return false;
            }

            //this.__style[key] = value;

            this.whenRendered(function () {
                return (this.__layer.style[key] = value);
            });
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        __getStyle: function (key, hard) {
            var value;// = this.__style[key];

            // If a style request turned up undefined or they want a hard refresh
            // we'll actually check out the real style on the layer
            if (typeof value === "undefined" || hard) {
                var layer = this.__layer;
                if (layer) {
                    return this.__layer.style[key];
                }
            }

            return value;
        },

        // =====================================================================
        // constructor
        // =====================================================================

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        __construct: function () {
            this.childViews = this.childViews || [];

            var classListTmp = new ClassList("CB-View");

            // classList need a reference to the view so they can update the
            // layer.className property
            classListTmp._view = this;

            if ( this.name && CB.isString(this.name) ) {
                classListTmp.add(this.name);
            }

            // If class names were already provided during definition we'll
            // auto-add them first.
            if (this.classList) {
                classListTmp.add(this.classList);
            }

            this.classList = classListTmp;
        },

        // =====================================================================
        // instance methods
        // =====================================================================

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        render: function () {
            //this.__layer = document.createDocumentFragment();
            var context = this.getRenderContext();

            this.renderInContext(context);

            this.__layer = context.flush();
            console.log('and boom', this.__layer)
        },

        renderInContext: function (context) {
            var childViews = this.getChildViews();

            context.drawElement(this.getTagName(), function () {
                // Render all our child views inside this new element context
                for (var i = 0, l = childViews.length; i < l; i++) {
                    childViews[i].renderInContext(this);
                }
            });
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        prependChild: function (childView) {       
            throw Error("prependChild broken");             
            this.childViews.unshift(childView);
            
            childView.parentView = this;
            childView.nextResponder = this;
            
            this.whenRendered(function () {
                var childLayer = childView.getLayer();

                // If a first child exists, we're going to insert it before it
                // otherwise we'll just append it since it's the first
                if (this.__layer.firstChild) {
                    this.__layer.insertBefore(childLayer, this.__layer.firstChild);
                } else {
                    this.__layer.appendChild(childLayer);
                }
            });
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        appendChild: function (childView) {
            this.childViews.push(childView);
            
            childView.parentView = this;
            childView.nextResponder = this;

            this.whenRendered(function () {
                //this.__layer.appendChild(childView.getLayer());
            });
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        insertChildBeforeChild: function () {
            this.whenRendered(function () {

            });
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        insertChildAfterChild: function () {
            this.whenRendered(function () {

            });
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        insertChildAtIndex: function () {
            this.whenRendered(function () {

            });
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        removeChild: function (childView) {
            var index = CB.indexOf(this.childViews, childView);
            
            if ( index > -1 && index <= this.childViews.length) {   
                return this.removeChildAtIndex(index);
            }
            
            return false; 
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        removeChildAtIndex: function (index) {
            throw Error("removeChildAtIndex broken");

            if ( index > -1 && index <= this.childViews.length) {
                                    
                var childView = this.childViews[index];
                
                if (!childView) return false;

                this.childViews.splice(index, 1);
                
                childView.parentView = null;
                childView.nextResponder = null;
                delete childView.nextResponder;
                delete childView.parentView;

                this.whenRendered(function () {
                    this.__layer.removeChild(childView.getLayer());
                });
                
                return childView;
            }
            
            return false;
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        removeChildren: function () {
            this.whenRendered(function () {

            });
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        reverseChildren: function () {
            this.whenRendered(function () {

            });
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        replaceChildWithChild: function () {
            this.whenRendered(function () {

            });
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        replaceChildrenWithChild: function () {
            this.whenRendered(function () {

            });
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        hasChildren: function () {
            return !!this.childViews.length;
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        getFirstChild: function () {
            return this.childView[0];
        },
        
        /**
         * No documentation available yet.
         * 
         * @private
         * @return  {void}
         */
        whenRendered: function (callback) {
            var view = this;

            if (this.__isRendered && this.__layer) {
                callback.call(this, this.__layer);
                return;
            }

            this.addObserver("isRendered", function observer(isRendered) {
                if (isRendered && view.__layer) {
                    view.removeObserver("isRendered", observer);
                    callback.call(view, view.__layer);
                }
            });
        }

    };

    var notificationMembers = [

        // =====================================================================
        // instance methods (implemented below)
        // =====================================================================

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.View
         * @name        willRender
         */
        "willRender",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.View
         * @name        didRender
         */
        "didRender",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.View
         * @name        willEnterDOM
         */
        "willEnterDOM",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.View
         * @name        didEnterDOM
         */
        "didEnterDOM",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.View
         * @name        willLeaveDOM
         */
        "willLeaveDOM",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.View
         * @name        didLeaveDOM
         */
        "didLeaveDOM",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.View
         * @name        willAppear
         */
        "willAppear",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.View
         * @name        didAppear
         */
        "didAppear",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.View
         * @name        willDisappear
         */
        "willDisappear",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       CB.View
         * @name        didDisappear
         */
        "didDisappear"
    ];

    notificationMembers.forEach(function (notification) {
        ViewMembers[notification] = function () {
            // Pass the notification along if a delegate is assigned
            if (this.delegate && this.delegate instanceof CB.ViewController) {
                var delegateNotification = "view" + CB.upperCaseFirst(notification);
                // Notify this view's delegate of the event
                this.delegate[delegateNotification](this);
            }
        };
    });

    CB.View = CB.Class.create({ extend: CB.Responder }, ViewMembers);

})(window, document);