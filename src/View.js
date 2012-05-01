MLImport("Class.js");

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
    
        return ML.indexOf(this, token) !== -1;  
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

        if (ML.isArray(token)) {

            result = [];

            ML.forEach(token, function (token) {
                var ret = classList.add(token);
                if (ret) {
                    result.push( ret );
                }
            });

            return result;
        }
        
        token += "";
        
        if (ML.indexOf(this, token) === -1) {
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
        var index = ML.indexOf(this, token);
        
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
        
        if (ML.indexOf(this, token) === -1) {
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
                    // The first time this runs we need to merge any
                    // existing classNames off the real layer element
                    // with our ClassList otherwise we'll overwrite them
                    if (!classList._hasSetClassNameBefore) {

                        // CSS Classes that already existed on the layer
                        var originalClasses = view.layer.className.split(" ");

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

                    // Finally, change the real className of the HTML element
                    view.layer.className = classList.join(" ");
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
     * @name        ML.View 
     * @extends     ML.Responder
     * @author      Jay Phelps
     * @since       0.1
     */
    var ViewMembers = /** @lends ML.View# */ {

        // =====================================================================
        // instance properties
        // =====================================================================

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
         * @default     Empty array
         * @type        Array
         */
        childViews: null,

        /**
         * @property
         * @default     ClassList with ML-View
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
            return this.layer || this.render();
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
                var layer = this.layer;
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

            return this.innerText;
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        __setInnerText: function (value) {
            this.innerText = value;

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
            if (!this.width || hard) {
                var layer = this.layer;
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

            this.style[key] = value;

            this.whenRendered(function () {
                return (this.layer.style[key] = value);
            });
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        __getStyle: function (key, hard) {
            var value = this.style[key];

            // If a style request turned up undefined or they want a hard refresh
            // we'll actually check out the real style on the layer
            if (typeof value === "undefined" || hard) {
                var layer = this.layer;
                if (layer) {
                    return this.layer.style[key];
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
        __constructor: function (layer) {
            this.layer = layer || null;
            this.childViews = this.childViews || [];
            this.style = this.style || {};

            var classListTmp = new ClassList("ML-View");

            // classList need a reference to the view so they can update the
            // layer.className property
            classListTmp._view = this;

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
            // Allow pre-hooks before render
            this.willRender();

            // Create our layer HTML element=
            this.layer = document.createElement(this.tagName);

            if (!this.layer) {
                throw Error("Failed to render view. Layer value: " + this.layer);
            }

            this.setIsRendered(YES);
            this.classList._updateClassName();

            // Let them know the view is now rendered and the layer exists
            this.didRender();

            return this.layer;
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        prependChild: function (childView) {                    
            this.childViews.unshift(childView);
            
            childView.parentView = this;
            childView.nextResponder = this;
            
            this.whenRendered(function () {
                var childLayer = childView.getLayer();

                // If a first child exists, we're going to insert it before it
                // otherwise we'll just append it since it's the first
                if (this.layer.firstChild) {
                    this.layer.insertBefore(childLayer, this.layer.firstChild);
                } else {
                    this.layer.appendChild(childLayer);
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
                console.log('goos')
                this.layer.appendChild(childView.getLayer());
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
            var index = ML.indexOf(this.childViews, childView);
            
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
            if ( index > -1 && index <= this.childViews.length) {
                                    
                var childView = this.childViews[index];
                
                if (!childView) return false;

                this.childViews.splice(index, 1);
                
                childView.parentView = null;
                childView.nextResponder = null;
                delete childView.nextResponder;
                delete childView.parentView;

                this.whenRendered(function () {
                    this.layer.removeChild(childView.getLayer());
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

            if (this.isRendered && this.layer) {
                callback.call(this, this.layer);
                return;
            }

            this.addObserver("isRendered", function observer(isRendered) {
                if (isRendered && view.layer) {
                    view.removeObserver("isRendered", observer);
                    callback.call(view, view.layer);
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
         * @lends       ML.View
         * @name        willRender
         */
        "willRender",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       ML.View
         * @name        didRender
         */
        "didRender",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       ML.View
         * @name        willEnterDOM
         */
        "willEnterDOM",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       ML.View
         * @name        didEnterDOM
         */
        "didEnterDOM",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       ML.View
         * @name        willLeaveDOM
         */
        "willLeaveDOM",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       ML.View
         * @name        didLeaveDOM
         */
        "didLeaveDOM",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       ML.View
         * @name        willAppear
         */
        "willAppear",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       ML.View
         * @name        didAppear
         */
        "didAppear",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       ML.View
         * @name        willDisappear
         */
        "willDisappear",

        /**
         * No documentation available yet.
         * 
         * @function
         * @lends       ML.View
         * @name        didDisappear
         */
        "didDisappear"
    ];

    notificationMembers.forEach(function (notification) {
        ViewMembers[notification] = function () {
            // Pass the notification along if a delegate is assigned
            if (this.delegate && this.delegate instanceof ML.ViewController) {
                var delegateNotification = "view" + ML.upperCaseFirst(notification);
                // Notify this view's delegate of the event
                this.delegate[delegateNotification](this);
            }
        };
    });

    ML.View = ML.Class.create(ViewMembers);

})(window, document);