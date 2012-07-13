(function (window, document) {

    // Cached internal reference
    var upperCaseFirst = CB.upperCaseFirst;

    // Returns a function that can be used to get a property on a class instance.
    function GetterHelper(key, Key) {
        return function (value) {
            var getter = this["__get" + Key];
            //console.log(key)
            if (getter) {
                return getter.apply(this, arguments);
            }

            return this["__" + key];
        };
    }

    // Returns a function that can be used to set a property on a class instance
    // and will trigger any observers if the value actually changes
    function SetterHelper(key, Key) {
        return function (value) {
            var prevValue = this["__" + key];
            var setter = this["__set" + Key];
            var ret = this;

            if (setter) {
                ret = setter.call(this, value);
            } else {
                this["__" + key] = value;
            }

            if (value !== prevValue) {
                this._triggerObserversForKey(key);
            }

            return ret;
        };
    }

    function definePropertyHelpers(obj, key, value) {
        var Key = upperCaseFirst(key);
        var getter = new GetterHelper(key, Key);
        var setter = new SetterHelper(key, Key);

        // Modern browsers.
        // @FIXME this doesn't check for the exception that will for sure be
        // raised in IE8 since it only supports defineProperty on DOM elements.
        if (Object.defineProperty) {
            Object.defineProperty(obj, key, {
                get: getter,
                set: setter,
                enumerable : true,  
                configurable : true
            });

        // Older Mozilla
        } else if (obj.__defineGetter__ && obj.__defineSetter__) {
            obj.__defineGetter__(key, getter);
            obj.__defineSetter__(key, setter);

        // All others
        } else {
            throw Error("No support for getter/setters");
        }

        obj["get" + Key] = new GetterHelper(key, Key);
        obj["set" + Key] = new SetterHelper(key, Key);

        obj["__" + key] = value;
    }

    // Work in progress...Only works if the protocol types are constructors but
    // should allow them to be instances of objects as well
    function compareObjectWithProtocol(obj, protocol) {
        for (var key in protocol) {
            var imp = obj[key];

            if (typeof imp === "undefined") throw Error("Class does not implement member: " + key);

            var impConstructor = imp && imp.constructor;
            var protocolConstructor = protocol[key];

            if (impConstructor !== protocolConstructor) {
                throw Error("Implements " +  key + " member but is the wrong type. Requires " + protocolConstructor.name + " but defined " + (impConstructor && impConstructor.name) + ".");
            }
        }
    }

    // Used during the inheritance process to prevent the class definition
    // __construct's from being called
    var classIsInitializing = false;

    /**
     * No documentation available yet.
     * 
     * @author      Jay Phelps
     * @since       0.1
     */ 
    var Class = function () {};

    Class.prototype = /** @lends Class# */ {

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        addObserver: function (key, observer) {
            var observersKey = "__" + key + "Observers";
            var observers = this[observersKey] || (this[observersKey] = []);
            observers.push(observer);
        },

        /**
         * No documentation available yet.
         * 
         * @return  {void}
         */
        removeObserver: function (key, observer) {
            var observersKey = "__" + key + "Observers";
            var observers = this[observersKey];

            if (observers) {
                var index = CB.indexOf(observers, observer);

                if (index > -1) {
                    return observers.splice(index, 1);
                }
            }

            return false;
        },

        /**
         * Used internally to trigger any observers on the class when a
         * .set() or .setKey() is called.
         * 
         * @private
         * @return  {void}
         */
        _triggerObserversForKey: function (key) {
            // First look for an observer in the class definition
            var observer = this["__" + key + "DidChange"];
            var value = this[key];

            // If we found one, let it know first, before any of the other
            // registered observers
            if (observer) {
                observer.call(this, value);
            }

            var controller = this;
            var observers = this["__" + key + "Observers"];

            // If an observers storage array exists on this instance, we'll
            // then notify each one of them of the change
            if (observers) {
                // IMPORTANT: We need to clone the observers array for a bit
                // because it's possible for the observers to remove themselves
                // which would cause issues if we just normally looped through
                // them (array length would change and we'd be off as well)
                var observersClone = CB.clone(observers);

                for (var i = 0; i < observersClone.length; i++) {
                    observersClone[i].call(controller, value);
                }
            }
        },

        /**
         * Used to set any property on a class instance. Will notify any observers
         * if the value changes and will also create getter/setters if this is
         * this first time the property is being set.
         * 
         * @return  {void}
         */
        set: function (key, value) {
            var Key = upperCaseFirst(key);
            var setter = this["set"+Key];

            if (setter) {
                setter.call(this, value);
            } else {
                this["get"+Key] = new GetterHelper(key, Key);
                (this["set"+Key] = new SetterHelper(key, Key)).call(this, key, Key);
            }
        },

        /**
         * Bind an event, specified by a string name, `ev`, to a `callback` function.
         * Passing `'all'` will bind the callback to all events fired.
         * 
         * @return {Class} this
         */
        on: function (ev, callback, context) {
            var calls = this._callbacks || (this._callbacks = {});
            var list = calls[ev] || (calls[ev] = []);
            list.push([callback, context]);
            return this;
        },

        /**
         * Remove one or many callbacks. If `callback` is null, removes all
         * callbacks for the event. If `ev` is null, removes all bound callbacks
         * for all events.
         * 
         * @return {Class} this
         */
        off: function (ev, callback) {
            var calls;
            if (!ev) {
                this._callbacks = {};
            } else if (calls = this._callbacks) {
                if (!callback) {
                    calls[ev] = [];
                } else {
                    var list = calls[ev];
                    if (!list) return this;
                    for (var i = 0, l = list.length; i < l; i++) {
                        if (list[i] && callback === list[i][0]) {
                            list[i] = null;
                            break;
                        }
                    }
                }
            }
            return this;
        },

        /**
         * Trigger an event, firing all bound callbacks. Callbacks are passed the
         * same arguments as `trigger` is, apart from the event name.
         * Listening for `'all'` passes the true event name as the first argument.
         * 
         * @return {Class} this
         */
        trigger: function (eventName) {
            var list;
            var calls;
            var ev;
            var callback;
            var args;

            var both = 2;

            var calls = this._callbacks;

            // If there aren't any callbacks let's get outta here!
            if (!calls) {
                return this;
            }

            while (both--) {
                ev = both ? eventName : "all";
                if (list = calls[ev]) {
                    for (var i = 0, l = list.length; i < l; i++) {
                        if (!(callback = list[i])) {
                            list.splice(i, 1);
                            i--;
                            l--;
                        } else {
                            args = both ? Array.prototype.slice.call(arguments, 1) : arguments;
                            callback[0].apply(callback[1] || this, args);
                        }
                    }
                }
            }
            return this;
        },

        /**
         * Bind an event, just like using .on() but will unbind itself
         * automatically after being triggered once.
         * 
         * @return  {void}
         */
        once: function (ev, callback, context) {
            var instance = this;

            this.on(ev, function internal() {
                callback.apply(this, arguments);
                instance.off(ev, internal, context);
            }, context);
        }

    };

    Class.prototype.constructor = Class;

    /**
     * Declare a class definition.
     * 
     * Inspired by: John Resig's Simple JavaScript Inheritance
     *   - who was inspired by base2 and Prototype
     *   - who were inspired by aliens
     */
    Class.create = function (arg1, arg2, arg3) {
        arg1 = arg1 || {};
        arg2 = arg2 || {};
        arg3 = arg3 || {};

        var superClass;
        var protocol;
        var instanceMembers;
        var staticMembers;

        // Caching the results first
        var doesExtend = arg1.hasOwnProperty("extend");
        var doesImplement = arg1.hasOwnProperty("implement");

        // Because we allow class definition arguments to vary slighty on their
        // order we need to check if they are extending or implementing anything
        if (doesExtend || doesImplement) {
            superClass = arg1.extend;
            protocol = arg1.implement;
            instanceMembers = arg2;
            staticMembers = arg3;

            // Double check they passed a valid super class, if declared
            if (doesExtend && typeof superClass !== "function") throw Error("Invalid super class provided: " + superClass);
            // Double check they passed a valid interface, if declared
            if (doesImplement && typeof protocol !== "object") throw Error("Invalid interface provided: " + protocol);

        } else {
            instanceMembers = arg1;
            staticMembers = arg2;
        }

        // If no super class was provided, we'll inherit from the base Class
        // which is "this"
        if (typeof superClass === "undefined") {
            superClass = this;
        }

        // Before we attempt a "new superClass()" we need to be sure it's
        // callable!
        if (typeof superClass !== "function") {
            throw Error("Failed to extend super class: " + superClass);
        }

        // Instantiate a base class but only create the instance,
        // don't run the __construct
        classIsInitializing = true;
        var prototype = new superClass() || {};
        classIsInitializing = false;

        // If they didn't provide a __construct we need to give it a dummy
        // one so we don't double run super constructors because of inheritance
        prototype.__construct = instanceMembers.__construct || function () {};

        // Pass a reference to the super class implementations
        prototype.__super = superClass.prototype;

        // Actual JS constructor that wraps the class's constructor so we can
        // call super constructors
        function Class() {
            // Allows us to create an instance of superClass above without
            // actually calling the class's real __construct
            if (classIsInitializing) return;

            // @TODO I'm sure there's a better way of calling the constructors
            // in the correct order, with the right context.
            var constructors = [];

            // Push the main constructor in first
            if (this.__construct) {  
                constructors.push(this.__construct);
            }

            var superDuper = this.__super;

            // Walk the super class chain pushing the constructors in the stack
            while (superDuper && superDuper.__construct) {
                constructors.push(superDuper.__construct);
                superDuper = superDuper.__super;
            }   

            // Run all the constructors, starting from the bottom (reverse)
            // so subclasses have a chance to override parent
            for (var i = constructors.length-1, l = -1; i > l; i--) {
                constructors[i].apply(this, arguments);
            }
        }

        // Assigning our base class first
        Class.prototype = prototype;
        Class.prototype.constructor = Class;

        // Static properties on class definition
        Class.isClass = true;

        // Add our instance members to the prototype and do getter/setter magic
        for (var key in instanceMembers) {
            prototype[key] = (function (key, imp) {
                // If the implementation isn't a function we're going to auto
                // create getter/setters for them
                if (typeof imp !== "function") {
                    definePropertyHelpers(prototype, key);
                }

                return imp;

            })(key, instanceMembers[key]);
        }

        // Add any static members to our Class
        for (var key in staticMembers) {
            Class[key] = staticMembers[key];
        }

        // If an interface protocol that this class should implement, let's
        // go ahead and confirm it does
        if (protocol) {
            // Go through instance members first
            compareObjectWithProtocol(prototype, protocol.instanceMembers);
            // Now compare static members
            compareObjectWithProtocol(staticMembers, protocol.staticMembers);
        }

        return Class;
    };

    CB.Class = Class;

})(window, document);