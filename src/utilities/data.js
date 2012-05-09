 (function(ML, window, document) {

    var rbrace = /^(?:\{.*\}|\[.*\])$/;
    var rmultiDash = /([A-Z])/g;

    /**
     * Borrowed heavily from SproutCore for now.
     */
    ML.extend(ML, {
        cache: {},

        // Please use with caution
        uuid: 0,

        // Unique for each copy of ML on the page
        // Non-digits removed to match rinlineML
        expando: "MLKit" + ( ML.version + Math.random() ).replace( /\D/g, "" ),

        // The following elements throw uncatchable exceptions if you
        // attempt to add expando properties to them.
        noData: {
            "embed": true,
            // Ban all objects except for Flash (which handle expandos)
            "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            "applet": true
        },

        hasData: function( elem ) {
            elem = elem.nodeType ? ML.cache[ elem[ML.expando] ] : elem[ ML.expando ];
            return !!elem && !isEmptyDataObject( elem );
        },

        data: function( elem, name, data, pvt /* Internal Use Only */ ) {
            if ( !ML.acceptData( elem ) ) {
                return;
            }

            var privateCache;
            var thisCache;
            var ret;
            var internalKey = ML.expando;
            var getByName = typeof name === "string";

            // We have to handle DOM nodes and JS objects differently because IE6-7
            // can't GC object references properly across the DOM-JS boundary
            var isNode = elem.nodeType;

            // Only DOM nodes need the global ML cache; JS object data is
            // attached directly to the object so GC can occur automatically
            var cache = isNode ? ML.cache : elem;

            // Only defining an ID for JS objects if its cache already exists allows
            // the code to shortcut on the same path as a DOM node with no cache
            var id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;
            var isEvents = name === "events";

            // Avoid doing any more work than we need to when trying to get data on an
            // object that has no data at all
            if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
                return;
            }

            if ( !id ) {
                // Only DOM nodes need a new unique ID for each element since their data
                // ends up in the global cache
                if ( isNode ) {
                    elem[ internalKey ] = id = ++ML.uuid;
                } else {
                    id = internalKey;
                }
            }

            if ( !cache[ id ] ) {
                cache[ id ] = {};

                // Avoids exposing ML metadata on plain JS objects when the object
                // is serialized using JSON.stringify
                if ( !isNode ) {
                    cache[ id ].toJSON = ML.noop;
                }
            }

            // An object can be passed to ML.data instead of a key/value pair; this gets
            // shallow copied over onto the existing cache
            if ( typeof name === "object" || typeof name === "function" ) {
                if ( pvt ) {
                    cache[ id ] = ML.extend( cache[ id ], name );
                } else {
                    cache[ id ].data = ML.extend( cache[ id ].data, name );
                }
            }

            privateCache = thisCache = cache[ id ];

            // ML data() is stored in a separate object inside the object's internal data
            // cache in order to avoid key collisions between internal data and user-defined
            // data.
            if ( !pvt ) {
                if ( !thisCache.data ) {
                    thisCache.data = {};
                }

                thisCache = thisCache.data;
            }

            if ( data !== undefined ) {
                thisCache[ ML.hyphensToLowerCamelCase( name ) ] = data;
            }

            // Users should not attempt to inspect the internal events object using ML.data,
            // it is undocumented and subject to change. But does anyone listen? No.
            if ( isEvents && !thisCache[ name ] ) {
                return privateCache.events;
            }

            // Check for both converted-to-camel and non-converted data property names
            // If a data property was specified
            if ( getByName ) {

                // First Try to find as-is property data
                ret = thisCache[ name ];

                // Test for null|undefined property data
                if ( ret == null ) {

                    // Try to find the camelCased property
                    ret = thisCache[ ML.hyphensToLowerCamelCase( name ) ];
                }
            } else {
                ret = thisCache;
            }

            return ret;
        },

        removeData: function( elem, name, pvt /* Internal Use Only */ ) {
            if ( !ML.acceptData( elem ) ) {
                return;
            }

            var thisCache, i, l,

                // Reference to internal data cache key
                internalKey = ML.expando,

                isNode = elem.nodeType,

                // See ML.data for more information
                cache = isNode ? ML.cache : elem,

                // See ML.data for more information
                id = isNode ? elem[ internalKey ] : internalKey;

            // If there is already no cache entry for this object, there is no
            // purpose in continuing
            if ( !cache[ id ] ) {
                return;
            }

            if ( name ) {

                thisCache = pvt ? cache[ id ] : cache[ id ].data;

                if ( thisCache ) {

                    // Support array or space separated string names for data keys
                    if ( !ML.isArray( name ) ) {

                        // try the string as a key before any manipulation
                        if ( name in thisCache ) {
                            name = [ name ];
                        } else {

                            // split the camel cased version by spaces unless a key with the spaces exists
                            name = ML.hyphensToLowerCamelCase( name );
                            if ( name in thisCache ) {
                                name = [ name ];
                            } else {
                                name = name.split( " " );
                            }
                        }
                    }

                    for ( i = 0, l = name.length; i < l; i++ ) {
                        delete thisCache[ name[i] ];
                    }

                    // If there is no data left in the cache, we want to continue
                    // and let the cache object itself get destroyed
                    if ( !( pvt ? isEmptyDataObject : ML.isEmptyObject )( thisCache ) ) {
                        return;
                    }
                }
            }

            // See ML.data for more information
            if ( !pvt ) {
                delete cache[ id ].data;

                // Don't destroy the parent cache unless the internal data object
                // had been the only thing left in it
                if ( !isEmptyDataObject(cache[ id ]) ) {
                    return;
                }
            }

            // Browsers that fail expando deletion also refuse to delete expandos on
            // the window, but it will allow it on all other JS objects; other browsers
            // don't care
            // Ensure that `cache` is not a window object #10080
            if ( ML.support.deleteExpando || !cache.setInterval ) {
                delete cache[ id ];
            } else {
                cache[ id ] = null;
            }

            // We destroyed the cache and need to eliminate the expando on the node to avoid
            // false lookups in the cache for entries that no longer exist
            if ( isNode ) {
                // IE does not allow us to delete expando properties from nodes,
                // nor does it have a removeAttribute function on Document nodes;
                // we must handle all of these cases
                if ( ML.support.deleteExpando ) {
                    delete elem[ internalKey ];
                } else if ( elem.removeAttribute ) {
                    elem.removeAttribute( internalKey );
                } else {
                    elem[ internalKey ] = null;
                }
            }
        },

        // For internal use only.
        _data: function( elem, name, data ) {
            return ML.data( elem, name, data, true );
        },

        // A method for determining if a DOM node can handle the data expando
        acceptData: function( elem ) {
            if ( elem.nodeName ) {
                var match = ML.noData[ elem.nodeName.toLowerCase() ];

                if ( match ) {
                    return !(match === true || elem.getAttribute("classid") !== match);
                }
            }

            return true;
        }
    });

    function dataAttr( elem, key, data ) {
        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if ( data === undefined && elem.nodeType === 1 ) {

            var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

            data = elem.getAttribute( name );

            if ( typeof data === "string" ) {
                try {
                    data = data === "true" ? true :
                    data === "false" ? false :
                    data === "null" ? null :
                    ML.isNumeric( data ) ? +data :
                        rbrace.test( data ) ? ML.parseJSON( data ) :
                        data;
                } catch( e ) {}

                // Make sure we set the data so it isn't changed later
                ML.data( elem, key, data );

            } else {
                data = undefined;
            }
        }

        return data;
    }

    // checks a cache object for emptiness
    function isEmptyDataObject( obj ) {
        for ( var name in obj ) {

            // if the public data object is empty, the private is still empty
            if ( name === "data" && ML.isEmptyObject( obj[name] ) ) {
                continue;
            }
            if ( name !== "toJSON" ) {
                return false;
            }
        }

        return true;
    }

 })(ML, window, document);