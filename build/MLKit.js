/**
 * @namespace
 */
window.ML = window.ML || {};

// Since we don't know what order this script will be included we have to be
// sure we don't clobber a previously included version of library we require.
// So we stash any conflicts, include our versions and reassign them, then put
// the stashed version back.
(function (window, document) {

	var libs = ["_", "Sizzle"];
	var stash = {};

	for (var i = 0, l = libs.length; i < l; i++) {
		var libName = libs[i];
		stash[libName] = window[libName];
	}

/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;

	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];

			parts.push( m[1] );

			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}

				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];

		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );

			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}

			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},

	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},

		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					if ( type === "first" ) {
						return true;
					}

					node = elem;

					/* falls through */
				case "last":
					while ( (node = node.nextSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}

					doneName = match[0];
					parent = elem.parentNode;

					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;

						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						}

						parent[ expando ] = doneName;
					}

					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},

		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}
// Expose origPOS
// "global" as in regardless of relation to brackets/parens
Expr.match.globalPOS = origPOS;

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}

	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}

		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );

					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}

				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );

					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}

						} else {
							return makeArray( [], extra );
						}
					}

					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}

			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );

		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try {
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}

	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE

window.Sizzle = Sizzle;

})();

//     Underscore.js 1.3.1
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.3.1';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    if (obj.length === +obj.length) results.length = obj.length;
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = _.toArray(obj).reverse();
    if (context && !initial) iterator = _.bind(iterator, context);
    return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    found = any(obj, function(value) {
      return value === target;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (_.isFunction(method) ? method || value : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.max.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.min.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var shuffled = [], rand;
    each(obj, function(value, index, list) {
      if (index == 0) {
        shuffled[0] = value;
      } else {
        rand = Math.floor(Math.random() * (index + 1));
        shuffled[index] = shuffled[rand];
        shuffled[rand] = value;
      }
    });
    return shuffled;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, val) {
    var result = {};
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    each(obj, function(value, index) {
      var key = iterator(value, index);
      (result[key] || (result[key] = [])).push(value);
    });
    return result;
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(iterable) {
    if (!iterable)                return [];
    if (iterable.toArray)         return iterable.toArray();
    if (_.isArray(iterable))      return slice.call(iterable);
    if (_.isArguments(iterable))  return slice.call(iterable);
    return _.values(iterable);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.toArray(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head`. The **guard** check allows it to work
  // with `_.map`.
  _.first = _.head = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especcialy useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(shallow ? value : _.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator) {
    var initial = iterator ? _.map(array, iterator) : array;
    var result = [];
    _.reduce(initial, function(memo, el, i) {
      if (0 == i || (isSorted === true ? _.last(memo) != el : !_.include(memo, el))) {
        memo[memo.length] = el;
        result[result.length] = array[i];
      }
      return memo;
    }, []);
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays. (Aliased as "intersect" for back-compat.)
  _.intersection = _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = _.flatten(slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.include(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function bind(func, context) {
    var bound, args;
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, throttling, more;
    var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
    return function() {
      context = this; args = arguments;
      var later = function() {
        timeout = null;
        if (more) func.apply(context, args);
        whenDone();
      };
      if (!timeout) timeout = setTimeout(later, wait);
      if (throttling) {
        more = true;
      } else {
        func.apply(context, args);
      }
      whenDone();
      throttling = true;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds.
  _.debounce = function(func, wait) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments, 0));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) { return func.apply(this, arguments); }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function.
  function eq(a, b, stack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // Invoke a custom `isEqual` method if one is provided.
    if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);
    if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = stack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (stack[length] == a) return true;
    }
    // Add the first object to the stack of traversed objects.
    stack.push(a);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          // Ensure commutative equality for sparse arrays.
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent.
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], stack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    stack.pop();
    return result;
  }

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return toString.call(obj) == '[object Arguments]';
  };
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Is a given value a function?
  _.isFunction = function(obj) {
    return toString.call(obj) == '[object Function]';
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return toString.call(obj) == '[object String]';
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return toString.call(obj) == '[object Number]';
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    // `NaN` is the only value for which `===` is not reflexive.
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return toString.call(obj) == '[object Date]';
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return toString.call(obj) == '[object RegExp]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Has own property?
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Escape a string for HTML interpolation.
  _.escape = function(string) {
    return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /.^/;

  // Within an interpolation, evaluation, or escaping, remove HTML escaping
  // that had been previously added.
  var unescape = function(code) {
    return code.replace(/\\\\/g, '\\').replace(/\\'/g, "'");
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(str, data) {
    var c  = _.templateSettings;
    var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
      'with(obj||{}){__p.push(\'' +
      str.replace(/\\/g, '\\\\')
         .replace(/'/g, "\\'")
         .replace(c.escape || noMatch, function(match, code) {
           return "',_.escape(" + unescape(code) + "),'";
         })
         .replace(c.interpolate || noMatch, function(match, code) {
           return "'," + unescape(code) + ",'";
         })
         .replace(c.evaluate || noMatch, function(match, code) {
           return "');" + unescape(code).replace(/[\r\n\t]/g, ' ') + ";__p.push('";
         })
         .replace(/\r/g, '\\r')
         .replace(/\n/g, '\\n')
         .replace(/\t/g, '\\t')
         + "');}return __p.join('');";
    var func = new Function('obj', '_', tmpl);
    if (data) return func(data, _);
    return function(data) {
      return func.call(this, data, _);
    };
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      var wrapped = this._wrapped;
      method.apply(wrapped, arguments);
      var length = wrapped.length;
      if ((name == 'shift' || name == 'splice') && length === 0) delete wrapped[0];
      return result(wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

}).call(this);

	_.extend(ML, window._);
	ML.$ = window.Sizzle;

	for (var i = 0, l = libs.length; i < l; i++) {
		var libName = libs[i];

		try {
			delete window[libName];
		} catch (e) {
			// IE <= 8 throws nasty exceptions
			// for window property deletes...
			window[libName] = undefined;
		}

		var stashedLib = stash[libName];

		if (stashedLib) {
			window[libName] = stashedLib;
		}
	}

})(window, document);

/**
 * NOTE: any script included inside here is in "strict mode", including any
 * files you may MLImport()!
 */
(function (window, document) {
	"use strict";

	// prevent a console.log from blowing things up if we are on a browser that
	// does not support it
	if (typeof console === "undefined") {
		window.console = {} ;
		console.log = console.dir = console.info = console.warn = console.error = function () {};
	}

	window.YES = true;
	window.NO = false;

	var ML = window.ML;

	ML.VERSION = ML.version = "0.1";

	// To preserve memory, this dummy function is used internally as a safe
	// placeholder for method implementations that do nothing.
	ML.dummyFunction = function () {};

	ML.upperCaseFirst = function (string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	};

(function (window, document) {

    // Cached internal reference
    var upperCaseFirst = ML.upperCaseFirst;

    // Returns a function that can be used to get a property on a class instance.
    function GetterHelper(key, Key) {
        return function (value) {
            var getter = this["__get" + Key];

            if (getter) {
                return getter.apply(this, arguments);
            }

            return this[key];
        };
    }

    // Returns a function that can be used to set a property on a class instance
    // and will trigger any observers if the value actually changes
    function SetterHelper(key, Key) {
        return function (value) {
            var prevValue = this[key];
            var setter = this["__set" + Key];
            var ret = this;

            if (setter) {
                ret = setter.call(this, value);
            } else {
                this[key] = value;
            }

            if (value !== prevValue) {
                this._triggerObserversForKey(key);
            }

            return ret;
        };
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
				throw Error('Implements ' +  key + ' member but is the wrong type. Requires ' + protocolConstructor.name + ' but defined ' + (impConstructor && impConstructor.name) + '.');
			}
		}
    }

    // Used during the inheritance process to prevent the class definition
    // __constructor's from being called
    var classIsInitializing = false;

    /**
	 * No documentation available yet.
	 * 
	 * @author		Jay Phelps
 	 * @since		0.1
	 */	
    var Class = function () {};

    Class.prototype = /** @lends Class# */ {

    	/**
		 * No documentation available yet.
		 * 
		 * @return 	{void}
		 */
    	addObserver: function (key, observer) {
			var observersKey = "__" + key + "Observers";
			var observers = this[observersKey] || (this[observersKey] = []);

			observers.push(observer);
		},

		/**
		 * No documentation available yet.
		 * 
		 * @return 	{void}
		 */
		removeObserver: function (key, observer) {
			var observersKey = "__" + key + "Observers";
			var observers = this[observersKey];

			if (observers) {
				var index = ML.indexOf(observers, observer);

				if (index) {
					return observers.splice(index);
				}
			}

			return false;
		},

        /**
		 * Used internally to trigger any observers on the class when a
         * .set() or .setKey() is called.
		 * 
		 * @private
		 * @return 	{void}
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
            observers && ML.forEach(observers, function (observer) {
                observer.call(controller, value);
            });
        },

        /**
		 * Used to set any property on a class instance. Will notify any observers
         * if the value changes and will also create getter/setters if this is
         * this first time the property is being set.
		 * 
		 * @return 	{void}
		 */
        set: function (key, value) {
            var Key = upperCaseFirst(key);
            var setter = this['set'+Key];

            if (setter) {
                setter.call(this, value);
            } else {
                this['get'+Key] = new getterHelper(key, Key);
                (this['set'+Key] = new setterHelper(key, Key)).call(this, key, Key);
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
		 * @return 	{void}
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
        // don't run the __constructor
        classIsInitializing = true;
        var prototype = new superClass() || {};
        classIsInitializing = false;

        // If they didn't provide a __constructor we need to give it a dummy
        // one so we don't double run super constructors because of inheritance
        prototype.__constructor = instanceMembers.__constructor || function () {};

        // Pass a reference to the super class implementations
        prototype.super = superClass.prototype;

        // Actual JS constructor that wraps the class's constructor so we can
        // call super constructors
        function Class() {
            // Allows us to create an instance of superClass above without
            // actually calling the class's real __constructor
            if (classIsInitializing) return;

            // @TODO I'm sure there's a better way of calling the constructors
            // in the correct order, with the right context.
            var constructors = [];

            // Push the main constructor in first
            if (this.__constructor) {  
            	constructors.push(this.__constructor);
            }

            var superDuper = this.super;

            // Walk the super class chain pushing the constructors in the stack
            while (superDuper && superDuper.__constructor) {
            	constructors.push(superDuper.__constructor);
            	superDuper = superDuper.super;
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
                    var Key = upperCaseFirst(key);
                    prototype['get' + Key] = new GetterHelper(key, Key);
                    prototype['set' + Key] = new SetterHelper(key, Key);
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

    ML.Class = Class;

})(window, document);
/**
 * Does nothing right now...
 * 
 * @class
 * @name    ML.Object
 */
ML.Object = ML.Class.create({}, {

    create: function (obj) {
        return obj;
    }

});
(function () {

	var Interface = ML.Object.create({

		create: function (instanceMembers, staticMembers) {
			return {
                instanceMembers: instanceMembers,
                staticMembers: staticMembers
            };
		}

	});
	
	ML.Interface = Interface;

})();
(function (window, document) {
    
    var DOM = {

        isReady: false,
        callbacks: [],

        ready: function () {
            this.isReady = true;

            var callbacks = this.callbacks;

            for (var i = 0, l = callbacks.length; i < l; i++) {
                callbacks[i]();
            }
        },

        onReady: function (fn) {
            if (this.isReady) {
                fn();
                return true;
            }

            this.callbacks.push(fn);
            return false;
        }
    };

    var readyBound = false;

    function bindDOMReady() {

        if (readyBound) return;
        readyBound = true;

        // Catch cases where the the DOM is already ready
        if (document.readyState === "complete") {
            // Defer execution of ready() to not block the thread while other
            // scripts set things up
            return setTimeout(DOM.ready, 1);
        }

        // All decent browsers support this
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", function DOMContentLoaded() {
                document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
                DOM.ready();
            }, false);

        // Good old IE...
        } else if (document.attachEvent) {
            // Safely for use in iframes
            document.attachEvent("onreadystatechange", function DOMContentLoaded() {
                if (document.readyState === "complete") {
                    document.detachEvent("onreadystatechange", DOMContentLoaded);
                    DOM.ready();
                }
            });

            // A fallback to window.onload, that will always work
            window.attachEvent("onload", DOM.ready);

            // If IE and not an iframe
            // continually check to see if the document is ready
            if (document.documentElement.doScroll && window == window.top)(function doScrollCheck() {
                if (DOM.isReady) return;

                try {
                    // IE ready detection trick by Diego Perini
                    // http://javascript.nwbox.com/IEContentLoaded/
                    document.documentElement.doScroll("left");
                } catch (error) {
                    setTimeout(doScrollCheck, 0);
                    return;
                }

                // Once we make it here, we"re ready to go
                DOM.ready();
            })();
        }
    }

    bindDOMReady();

    ML.DOM = DOM;

})(window, document);

(function (window, document) {

	/**
	 * FIXME: Description needed.
	 *
	 * @class		
	 * @author		Jay Phelps
	 * @since		0.1
	 */
	var Application = ML.Class.create({

		keyWindow: window,
		windows: null,

		__constructor: function () { 
			if (Application.sharedApplication) throw Error("MLKit: Only one application can run at a time");
			
			this.windows = [];
			Application.sharedApplication = this;
		},

		initWithDelegate: function (delegateInstance) {
			this.delegateInstance = delegateInstance;
			return this;
		}

	});

	Application.sharedApplication = null;

	ML.Application = Application;

	/**
	 * FIXME: Description needed.
	 *
	 * @function		
	 * @extends		MLControlView
	 * @author		Jay Phelps
	 * @since		0.1
	 */
	var startApplication = function (appNamespace, appDelegateName) {
		appNamespace = appNamespace || window;

		var delegate = appNamespace[appDelegateName];

		if (!delegate.isClass || !ML.isFunction(delegate)) throw Error("Delegate is not a class");

		var delegateInstance = new delegate();

		var application = (new ML.Application).initWithDelegate(delegateInstance);
		
		var keyWindow = application.keyWindow;
		
		delegateInstance.window = keyWindow;

		var applicationDidFinishLaunching = ML.bind(
			delegateInstance.applicationDidFinishLaunching,
			delegateInstance,
			application
		);

		ML.DOM.onReady(function () {
			// Clear the body so it"s clean slate for the app
			document.body.innerHTML = "";
			
			// Notify app they are ready
			applicationDidFinishLaunching();
		});
	}

	ML.startApplication = startApplication;

})(window, document);
/**
 * Defines the default implementation of an app's main delegate. Extend this
 * this class to handle the main application events.
 *
 * @class		
 * @author		Jay Phelps
 * @since		0.1
 */
ML.ApplicationDelegate = ML.Class.create({
		
	/**
	 * No documentation available yet.
	 * 
	 * @return 	{void}
	 */
	applicationDidFinishLaunching: ML.dummyFunction,

	/**
	 * No documentation available yet.
	 * 
	 * @return 	{void}
	 */
	applicationWillTerminate: ML.dummyFunction,

	/**
	 * No documentation available yet.
	 * 
	 * @return 	{void}
	 */
	applicationDidEnterBackground: ML.dummyFunction,

	/**
	 * No documentation available yet.
	 * 
	 * @return 	{void}
	 */
	applicationDidEnterForeground: ML.dummyFunction

});



(function (window, document) {

	/**
	 * No documentation available yet.
	 * 
	 * @extends		Array
	 * @author		Jay Phelps
 	 * @since		0.1
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
	 * @return 	{void}
	 */		
	ClassList.prototype.item = function (i) {  
	    return this[i];  
	};  

	/**
	 * No documentation available yet.
	 * 
	 * @return 	{void}
	 */	
	ClassList.prototype.has = ClassList.prototype.contains = function (token) {  
	    token += "";  
	
	    return ML.indexOf(this, token) !== -1;  
	};

	/**
	 * No documentation available yet.
	 * 
	 * @return 	{void}
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
	 * @return 	{void}
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
	 * @return 	{void}
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
	 * @return 	{void}
	 */	
	ClassList.prototype.clone = function (token) {
		return this.toString().split(",");
	};
	
	/**
	 * No documentation available yet.
	 * 
	 * @return 	{void}
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
	 * @return 	{void}
	 */			
	ClassList.prototype.toString = function () {
		return this.join(",");
	};

	/**
	 * Views are cooooool. Yep.
	 *
	 * @class
	 * @name 		ML.View	
	 * @extends		ML.Responder
	 * @author		Jay Phelps
	 * @since		0.1
	 */
	var ViewMembers = /** @lends ML.View# */ {

		/**
		 * Determines what HTML element the layer should be.
		 * 
		 * @property
		 * @default 	"div"
	     * @type		String
	     */
		tagName: "div",

		/**
		 * @property
		 * @default 	Empty array
	     * @type		Array
	     */
		childViews: null,

		/**
		 * @property
		 * @default 	ClassList with ML-View
	     * @type		ClassList
	     */
		classList: null,

		/**
		 * @property
		 * @default 	NO
	     * @type		Boolean
	     */
		isRendered: NO,

		/**
		 * @property
		 * @default 	null
	     * @type		Element
	     */
		layer: null,

		/**
		 * No documentation available yet.
		 * 
		 * @return 	{void}
		 */
		__getLayer: function () {
			return this.layer || this.render();
		},

		/**
		 * @property
		 * @default 	""
	     * @type		String
	     */
		innerText: "",

		/**
		 * No documentation available yet.
		 * 
		 * @return 	{void}
		 */
		__getInnerText: function (hard) {
			if (hard) {
				var layer = this.layer;
				if (layer) {
					if (layer.innerText) {
						return layer.innerText;
					} else {
						return layer.innerHTML.replace(/\&lt;br\&gt;/gi,"\n").replace(/(&lt;([^&gt;]+)&gt;)/gi, "");
					}
				}
			}

			return this.innerText;
		},

		/**
		 * No documentation available yet.
		 * 
		 * @return 	{void}
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

		/**
		 * No documentation available yet.
		 * 
		 * @return 	{void}
		 */
		__constructor: function (layer) {
			this.layer = layer || null;
			this.childViews = this.childViews || [];

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

		/**
		 * No documentation available yet.
		 * 
		 * @return 	{void}
		 */
		render: function () {
			// Allow pre-hooks before render
			this.willRender();

			// Create our layer HTML element=
			this.layer = document.createElement(this.tagName);

			if (!this.layer) throw Error("Failed to render view. Layer value: " + this.layer);

			this.setIsRendered(YES);
			this.classList._updateClassName();

			// Let them know the view is now rendered and the layer exists
			this.didRender();

			return this.layer;
		},

		/**
		 * No documentation available yet.
		 * 
		 * @return 	{void}
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
		 * @return 	{void}
		 */
		appendChild: function (childView) {
			this.childViews.push(childView);
			
			childView.parentView = this;
			childView.nextResponder = this;
			
			this.whenRendered(function () {
				this.layer.appendChild(childView.getLayer());
			});
		},
		
		/**
		 * No documentation available yet.
		 * 
		 * @private
		 * @return 	{void}
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

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.View
		 * @name 		willRender
		 */
		"willRender",

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.View
		 * @name 		didRender
		 */
		"didRender",

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.View
		 * @name 		willEnterDOM
		 */
		"willEnterDOM",

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.View
		 * @name 		didEnterDOM
		 */
		"didEnterDOM",

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.View
		 * @name 		willLeaveDOM
		 */
		"willLeaveDOM",

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.View
		 * @name 		didLeaveDOM
		 */
		"didLeaveDOM",

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.View
		 * @name 		willAppear
		 */
		"willAppear",

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.View
		 * @name 		didAppear
		 */
		"didAppear",

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.View
		 * @name 		willDisappear
		 */
		"willDisappear",

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.View
		 * @name 		didDisappear
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
/**
 * No documentation available yet.
 *
 * @interface
 * @author      Jay Phelps
 * @since       0.1
 */
ML.ViewDelegateInterface = ML.Interface.create({

    loadView:           Function,
    viewDidLoad:        Function,
    viewWillRender:     Function,
    viewDidRender:      Function,
    viewWillAppear:     Function,
    viewDidAppear:      Function,
    viewWillDisappear:  Function,
    viewDidDisappear:   Function

});

(function (window, document) {

	/**
	 * No documentation available yet.
	 *
	 * @class	
	 * @name 		ML.ViewController	
	 * @author		Jay Phelps
	 * @since		0.1
	 */
	var ViewControllerMembers = {

		/**
		 * @property
		 * @default 	null
	     * @type		ML.View
	     */
		view: null,

		/**
		 * @property
		 * @default 	""
	     * @type		String
	     */
		title: "",

		/**
		 * No documentation available yet.
		 * 
		 * @return 	{void}
		 */
		__setTitle: function (value) {
			this.title = value;
			MLRouter.setTitle(value);
		},

		/**
		 * No documentation available yet.
		 * 
		 * @return 	{void}
		 */
		__getTitle: function () {
			return this.title || MLRouter.getTitle();
		},

		/**
		 * No documentation available yet.
		 * 
		 * @return 	{void}
		 */
		__getView: function () {
			if (!this.view) {
				this.init();
			}

			return this.view;
		},

		/**
		 * No documentation available yet.
		 * 
		 * @return 	{void}
		 */
		__setView: function (view) {
			if (this.view && this.view.parentView) {
				this.view.parentView.replaceChildWithChild(this.view, view);
			}

			this.view = view;
			view.nextResponder = this;
			view.delegate = this;
		},

		/**
		 * No documentation available yet.
		 * 
		 * @return 	{void}
		 */
		init: function () {
			// Try loading the view
			this.loadView();

			// If that didn't work out, we gotta bolt
			if (!this.view) throw Error('You must set the view by the end of loadView in ML.ViewController');

			// Notify them of what's up yo
			this.viewDidLoad();
		},

		/**
		 * No documentation available yet.
		 * 
		 * @return 	{void}
		 */
		loadView: function () {
			// Just in case they don't provide a loadView, we'll set up a default
			// view for them
			this.setView(new ML.View());
		}
		
	};

	var notifications = [

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.ViewController
		 * @name 		viewDidLoad
		 */
		"viewDidLoad",

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.ViewController
		 * @name 		viewWillRender
		 */
		"viewWillRender",

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.ViewController
		 * @name 		viewDidRender
		 */
		"viewDidRender",

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.ViewController
		 * @name 		viewWillEnterDOM
		 */
		"viewWillEnterDOM",

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.ViewController
		 * @name 		viewDidEnterDOM
		 */
		"viewDidEnterDOM",

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.ViewController
		 * @name 		viewWillLeaveDOM
		 */
		"viewWillLeaveDOM",

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.ViewController
		 * @name 		viewDidLeaveDOM
		 */
		"viewDidLeaveDOM",

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.ViewController
		 * @name 		viewWillAppear
		 */
		"viewWillAppear",

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.ViewController
		 * @name 		viewDidAppear
		 */
		"viewDidAppear",

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.ViewController
		 * @name 		viewWillDisappear
		 */
		"viewWillDisappear",

		/**
		 * No documentation available yet.
		 * 
		 * @function
		 * @lends 		ML.ViewController
		 * @name 		viewDidDisappear
		 */
		"viewDidDisappear"
	];

	// All of the default implementations do nothing, so we're going to point
	// them all to a single function to preserve memory but still allow them
	// to be executed safely
	notifications.forEach(function (notification) {
		ViewControllerMembers[notification] = ML.dummyFunction;
	});

	ML.ViewController = ML.Class.create({ implement: ML.ViewDelegateInterface }, ViewControllerMembers);

})(window, document);

})(window, document);
