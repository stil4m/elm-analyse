/* This header is placed at the beginning of the output file and defines the
	special `__require`, `__getFilename`, and `__getDirname` functions.
*/
(function() {
	/* __modules is an Array of functions; each function is a module added
		to the project */
var __modules = {},
	/* __modulesCache is an Array of cached modules, much like
		`require.cache`.  Once a module is executed, it is cached. */
	__modulesCache = {},
	/* __moduleIsCached - an Array of booleans, `true` if module is cached. */
	__moduleIsCached = {};
/* If the module with the specified `uid` is cached, return it;
	otherwise, execute and cache it first. */
function __require(uid, parentUid) {
	if(!__moduleIsCached[uid]) {
		// Populate the cache initially with an empty `exports` Object
		__modulesCache[uid] = {"exports": {}, "loaded": false};
		__moduleIsCached[uid] = true;
		if(uid === 0 && typeof require === "function") {
			require.main = __modulesCache[0];
		} else {
			__modulesCache[uid].parent = __modulesCache[parentUid];
		}
		/* Note: if this module requires itself, or if its depenedencies
			require it, they will only see an empty Object for now */
		// Now load the module
		__modules[uid](__modulesCache[uid], __modulesCache[uid].exports);
		__modulesCache[uid].loaded = true;
	}
	return __modulesCache[uid].exports;
}
/* This function is the replacement for all `__filename` references within a
	project file.  The idea is to return the correct `__filename` as if the
	file was not concatenated at all.  Therefore, we should return the
	filename relative to the output file's path.

	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getFilename(path) {
	return require("path").resolve(__dirname + "/" + path);
}
/* Same deal as __getFilename.
	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getDirname(path) {
	return require("path").resolve(__dirname + "/" + path + "/../");
}
/********** End of header **********/
/********** Start module 0: ./dist/app/editor/editor.js **********/
__modules[0] = function(module, exports) {
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*eslint no-undef: 0*/
var WebSocketClient = __importStar(__require(1,0));
var Elm = __require(2,0);
var Editor = Elm.Editor;
module.exports = function setup(port) {
    var ws;
    var listenerId = 0;
    var listeners = {};
    var app = Editor.worker({
        serverHost: 'localhost',
        serverPort: 3000
    });
    var eventListener = {
        onMessage: function incoming(data) {
            try {
                var parsed = JSON.parse(data);
                app.ports.stateListener.send(parsed);
            }
            catch (e) {
                console.log('Parse state failed');
            }
        },
        onReconnect: function () { return console.log('Elm editor: On reconnect'); },
        onOpen: function () { return console.log('Elm editor: On open'); }
    };
    app.ports.editorMessages.subscribe(function (x) {
        Object.keys(listeners).forEach(function (k) {
            listeners[k](x);
        });
    });
    return {
        start: function () {
            if (ws) {
                console.log('Already started');
                return;
            }
            ws = WebSocketClient.connect('ws://localhost:' + port + '/state', eventListener
            );
        },
        onState: function (cb) {
            var identifier = listenerId++;
            listeners[identifier] = cb;
            return function cancel() {
                delete listeners[identifier];
            };
        },
        stop: function () {
            if (ws != null) {
                ws.stop();
            }
            ws = null;
        }
    };
};

return module.exports;
}
/********** End of module 0: ./dist/app/editor/editor.js **********/
/********** Start module 1: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/dist/app/editor/ws-client.js **********/
__modules[1] = function(module, exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(__require(3,1));
function connect(url, es) {
    var ws = new ws_1.default(url);
    var autoReconnectInterval = 5000;
    var number = 0;
    function bind(ws, events, reconnect) {
        ws.on('open', function () {
            if (events.onOpen) {
                events.onOpen();
            }
        });
        ws.on('message', function (data) {
            number++;
            if (events.onMessage) {
                events.onMessage(data, number);
            }
        });
        ws.on('close', function (e) {
            switch (e) {
                case 1000:
                    break;
                default:
                    reconnect(e);
                    break;
            }
            if (events.onClose) {
                events.onClose(e);
            }
        });
        ws.on('error', function (e) {
            switch (e.code) {
                case 'ECONNREFUSED':
                    reconnect(e);
                    break;
                default:
                    if (events.onError) {
                        events.onError(e);
                    }
                    break;
            }
        });
    }
    var reconnect = function () {
        ws.removeAllListeners();
        setTimeout(function () {
            if (es.onReconnect) {
                es.onReconnect();
            }
            ws = new ws_1.default(url);
            bind(ws, es, reconnect);
        }, autoReconnectInterval);
    };
    bind(ws, es, reconnect);
    return {
        stop: function () {
            ws.close();
        }
    };
}
exports.connect = connect;

return module.exports;
}
/********** End of module 1: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/dist/app/editor/ws-client.js **********/
/********** Start module 2: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/dist/app/editor/elm.js **********/
__modules[2] = function(module, exports) {
(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File === 'function' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	/**/
	if (x.$[0] === '#')
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	if (typeof xs === 'string')
	{
		return xs + ys;
	}
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});

function _String_fromNumber(number)
{
	return number + '';
}

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}

function _String_toFloat(s)
{
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.multiline) { flags += 'm'; }
	if (options.caseInsensitive) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;
var $elm$core$List$cons = _List_cons;
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Editor$init = function (flags) {
	return _Utils_Tuple2(
		{enabled: false, flags: flags},
		$elm$core$Platform$Cmd$none);
};
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $author$project$Editor$OnState = function (a) {
	return {$: 'OnState', a: a};
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $author$project$Analyser$State$State = F6(
	function (messages, dependencies, idCount, status, queue, modules) {
		return {dependencies: dependencies, idCount: idCount, messages: messages, modules: modules, queue: queue, status: status};
	});
var $author$project$Analyser$Modules$Modules = F2(
	function (projectModules, dependencies) {
		return {dependencies: dependencies, projectModules: projectModules};
	});
var $elm$json$Json$Decode$list = _Json_decodeList;
var $stil4m$elm_syntax$Elm$Syntax$ModuleName$decoder = $elm$json$Json$Decode$list($elm$json$Json$Decode$string);
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $author$project$Analyser$Modules$tupleFromList = function (x) {
	if ((x.b && x.b.b) && (!x.b.b.b)) {
		var a = x.a;
		var _v1 = x.b;
		var b = _v1.a;
		return $elm$json$Json$Decode$succeed(
			_Utils_Tuple2(a, b));
	} else {
		return $elm$json$Json$Decode$fail('Not a tuple');
	}
};
var $author$project$Analyser$Modules$decodeDependency = A2(
	$elm$json$Json$Decode$andThen,
	$author$project$Analyser$Modules$tupleFromList,
	$elm$json$Json$Decode$list($stil4m$elm_syntax$Elm$Syntax$ModuleName$decoder));
var $elm$json$Json$Decode$map2 = _Json_map2;
var $author$project$Analyser$Modules$decode = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Analyser$Modules$Modules,
	A2(
		$elm$json$Json$Decode$field,
		'projectModules',
		$elm$json$Json$Decode$list($stil4m$elm_syntax$Elm$Syntax$ModuleName$decoder)),
	A2(
		$elm$json$Json$Decode$field,
		'dependencies',
		$elm$json$Json$Decode$list($author$project$Analyser$Modules$decodeDependency)));
var $author$project$Analyser$State$Dependencies$Dependencies = F3(
	function (values, unused, mode) {
		return {mode: mode, unused: unused, values: values};
	});
var $author$project$Analyser$State$Dependencies$DependencyInfo = F3(
	function (dependency, versionState, _package) {
		return {dependency: dependency, _package: _package, versionState: versionState};
	});
var $author$project$Registry$Package$Package = F3(
	function (name, summary, versions) {
		return {name: name, summary: summary, versions: versions};
	});
var $author$project$Registry$Version$Version = F3(
	function (a, b, c) {
		return {$: 'Version', a: a, b: b, c: c};
	});
var $elm$core$Maybe$map3 = F4(
	function (func, ma, mb, mc) {
		if (ma.$ === 'Nothing') {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				if (mc.$ === 'Nothing') {
					return $elm$core$Maybe$Nothing;
				} else {
					var c = mc.a;
					return $elm$core$Maybe$Just(
						A3(func, a, b, c));
				}
			}
		}
	});
var $elm$core$String$toInt = _String_toInt;
var $author$project$Registry$Version$fromStrings = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	var z = _v0.c;
	return A4(
		$elm$core$Maybe$map3,
		$author$project$Registry$Version$Version,
		$elm$core$String$toInt(x),
		$elm$core$String$toInt(y),
		$elm$core$String$toInt(z));
};
var $author$project$Registry$Version$fromString = function (input) {
	var _v0 = A2($elm$core$String$split, '.', input);
	if (((_v0.b && _v0.b.b) && _v0.b.b.b) && (!_v0.b.b.b.b)) {
		var x = _v0.a;
		var _v1 = _v0.b;
		var y = _v1.a;
		var _v2 = _v1.b;
		var z = _v2.a;
		return $author$project$Registry$Version$fromStrings(
			_Utils_Tuple3(x, y, z));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Registry$Version$decode = A2(
	$elm$json$Json$Decode$andThen,
	A2(
		$elm$core$Basics$composeR,
		$author$project$Registry$Version$fromString,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Maybe$map($elm$json$Json$Decode$succeed),
			$elm$core$Maybe$withDefault(
				$elm$json$Json$Decode$fail('not a version')))),
	$elm$json$Json$Decode$string);
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Registry$Package$decode = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Registry$Package$Package,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'summary', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'versions',
		$elm$json$Json$Decode$list($author$project$Registry$Version$decode)));
var $stil4m$elm_syntax$Elm$Dependency$Dependency = F3(
	function (name, version, interfaces) {
		return {interfaces: interfaces, name: name, version: version};
	});
var $stil4m$elm_syntax$Elm$Interface$Alias = function (a) {
	return {$: 'Alias', a: a};
};
var $stil4m$elm_syntax$Elm$Interface$CustomType = function (a) {
	return {$: 'CustomType', a: a};
};
var $stil4m$elm_syntax$Elm$Interface$Function = function (a) {
	return {$: 'Function', a: a};
};
var $stil4m$elm_syntax$Elm$Interface$Operator = function (a) {
	return {$: 'Operator', a: a};
};
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$json$Json$Decode$lazy = function (thunk) {
	return A2(
		$elm$json$Json$Decode$andThen,
		thunk,
		$elm$json$Json$Decode$succeed(_Utils_Tuple0));
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Util$Json$decodeTyped = function (opts) {
	return $elm$json$Json$Decode$lazy(
		function (_v0) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (t) {
					var _v1 = $elm$core$List$head(
						A2(
							$elm$core$List$filter,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Tuple$first,
								$elm$core$Basics$eq(t)),
							opts));
					if (_v1.$ === 'Just') {
						var m = _v1.a;
						return A2($elm$json$Json$Decode$field, 'value', m.b);
					} else {
						return $elm$json$Json$Decode$fail('No decoder for type: ' + t);
					}
				},
				A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
		});
};
var $stil4m$elm_syntax$Elm$Syntax$Infix$Infix = F4(
	function (direction, precedence, operator, _function) {
		return {direction: direction, _function: _function, operator: operator, precedence: precedence};
	});
var $stil4m$elm_syntax$Elm$Syntax$Infix$Left = {$: 'Left'};
var $stil4m$elm_syntax$Elm$Syntax$Infix$Non = {$: 'Non'};
var $stil4m$elm_syntax$Elm$Syntax$Infix$Right = {$: 'Right'};
var $stil4m$elm_syntax$Elm$Syntax$Infix$decodeDirection = A2(
	$elm$json$Json$Decode$andThen,
	function (v) {
		switch (v) {
			case 'left':
				return $elm$json$Json$Decode$succeed($stil4m$elm_syntax$Elm$Syntax$Infix$Left);
			case 'right':
				return $elm$json$Json$Decode$succeed($stil4m$elm_syntax$Elm$Syntax$Infix$Right);
			case 'non':
				return $elm$json$Json$Decode$succeed($stil4m$elm_syntax$Elm$Syntax$Infix$Non);
			default:
				return $elm$json$Json$Decode$fail('Invlalid direction');
		}
	},
	$elm$json$Json$Decode$string);
var $stil4m$elm_syntax$Elm$Syntax$Node$Node = F2(
	function (a, b) {
		return {$: 'Node', a: a, b: b};
	});
var $stil4m$elm_syntax$Elm$Syntax$Range$fromList = function (input) {
	if ((((input.b && input.b.b) && input.b.b.b) && input.b.b.b.b) && (!input.b.b.b.b.b)) {
		var a = input.a;
		var _v1 = input.b;
		var b = _v1.a;
		var _v2 = _v1.b;
		var c = _v2.a;
		var _v3 = _v2.b;
		var d = _v3.a;
		return $elm$core$Result$Ok(
			{
				end: {column: d, row: c},
				start: {column: b, row: a}
			});
	} else {
		return $elm$core$Result$Err('Invalid input list');
	}
};
var $elm_community$json_extra$Json$Decode$Extra$fromResult = function (result) {
	if (result.$ === 'Ok') {
		var successValue = result.a;
		return $elm$json$Json$Decode$succeed(successValue);
	} else {
		var errorMessage = result.a;
		return $elm$json$Json$Decode$fail(errorMessage);
	}
};
var $stil4m$elm_syntax$Elm$Syntax$Range$decoder = A2(
	$elm$json$Json$Decode$andThen,
	A2($elm$core$Basics$composeR, $stil4m$elm_syntax$Elm$Syntax$Range$fromList, $elm_community$json_extra$Json$Decode$Extra$fromResult),
	$elm$json$Json$Decode$list($elm$json$Json$Decode$int));
var $stil4m$elm_syntax$Elm$Syntax$Node$decoder = function (sub) {
	return A3(
		$elm$json$Json$Decode$map2,
		$stil4m$elm_syntax$Elm$Syntax$Node$Node,
		A2($elm$json$Json$Decode$field, 'range', $stil4m$elm_syntax$Elm$Syntax$Range$decoder),
		A2($elm$json$Json$Decode$field, 'value', sub));
};
var $elm$json$Json$Decode$map4 = _Json_map4;
var $stil4m$elm_syntax$Elm$Syntax$Infix$decoder = A5(
	$elm$json$Json$Decode$map4,
	$stil4m$elm_syntax$Elm$Syntax$Infix$Infix,
	A2(
		$elm$json$Json$Decode$field,
		'direction',
		$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$Infix$decodeDirection)),
	A2(
		$elm$json$Json$Decode$field,
		'precedence',
		$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$int)),
	A2(
		$elm$json$Json$Decode$field,
		'operator',
		$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'function',
		$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$string)));
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$Analyser$Files$Json$decodeExposedInterface = $author$project$Util$Json$decodeTyped(
	_List_fromArray(
		[
			_Utils_Tuple2(
			'function',
			A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Interface$Function, $elm$json$Json$Decode$string)),
			_Utils_Tuple2(
			'type_',
			A2(
				$elm$json$Json$Decode$map,
				$stil4m$elm_syntax$Elm$Interface$CustomType,
				A3(
					$elm$json$Json$Decode$map2,
					$elm$core$Tuple$pair,
					A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
					A2(
						$elm$json$Json$Decode$field,
						'constructors',
						$elm$json$Json$Decode$list($elm$json$Json$Decode$string))))),
			_Utils_Tuple2(
			'alias',
			A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Interface$Alias, $elm$json$Json$Decode$string)),
			_Utils_Tuple2(
			'operator',
			A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Interface$Operator, $stil4m$elm_syntax$Elm$Syntax$Infix$decoder))
		]));
var $author$project$Analyser$Files$Json$decodeInterface = $elm$json$Json$Decode$list($author$project$Analyser$Files$Json$decodeExposedInterface);
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $author$project$Analyser$Files$Json$decodeDependency = A4(
	$elm$json$Json$Decode$map3,
	$stil4m$elm_syntax$Elm$Dependency$Dependency,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'version', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'interfaces',
		A2(
			$elm$json$Json$Decode$map,
			$elm$core$Dict$fromList,
			$elm$json$Json$Decode$list(
				A3(
					$elm$json$Json$Decode$map2,
					F2(
						function (a, b) {
							return _Utils_Tuple2(a, b);
						}),
					A2(
						$elm$json$Json$Decode$field,
						'key',
						$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
					A2($elm$json$Json$Decode$field, 'value', $author$project$Analyser$Files$Json$decodeInterface))))));
var $author$project$Analyser$State$Dependencies$MajorBehind = {$: 'MajorBehind'};
var $author$project$Analyser$State$Dependencies$Unknown = {$: 'Unknown'};
var $author$project$Analyser$State$Dependencies$UpToDate = {$: 'UpToDate'};
var $author$project$Analyser$State$Dependencies$Upgradable = {$: 'Upgradable'};
var $author$project$Analyser$State$Dependencies$decodeVersionState = A2(
	$elm$json$Json$Decode$andThen,
	function (s) {
		switch (s) {
			case 'UpToDate':
				return $elm$json$Json$Decode$succeed($author$project$Analyser$State$Dependencies$UpToDate);
			case 'MajorBehind':
				return $elm$json$Json$Decode$succeed($author$project$Analyser$State$Dependencies$MajorBehind);
			case 'Upgradable':
				return $elm$json$Json$Decode$succeed($author$project$Analyser$State$Dependencies$Upgradable);
			case 'Unknown':
				return $elm$json$Json$Decode$succeed($author$project$Analyser$State$Dependencies$Unknown);
			default:
				return $elm$json$Json$Decode$fail('Unknown version state');
		}
	},
	$elm$json$Json$Decode$string);
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $author$project$Analyser$State$Dependencies$decodeDependencyInfo = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Analyser$State$Dependencies$DependencyInfo,
	A2($elm$json$Json$Decode$field, 'dependency', $author$project$Analyser$Files$Json$decodeDependency),
	A2($elm$json$Json$Decode$field, 'versionState', $author$project$Analyser$State$Dependencies$decodeVersionState),
	A2(
		$elm$json$Json$Decode$field,
		'package',
		$elm$json$Json$Decode$maybe($author$project$Registry$Package$decode)));
var $author$project$Analyser$State$Dependencies$Application = {$: 'Application'};
var $author$project$Analyser$State$Dependencies$Package = {$: 'Package'};
var $author$project$Analyser$State$Dependencies$decodeMode = A2(
	$elm$json$Json$Decode$andThen,
	function (v) {
		switch (v) {
			case 'package':
				return $elm$json$Json$Decode$succeed($author$project$Analyser$State$Dependencies$Package);
			case 'application':
				return $elm$json$Json$Decode$succeed($author$project$Analyser$State$Dependencies$Application);
			default:
				return $elm$json$Json$Decode$fail('Unknown mode: ' + v);
		}
	},
	$elm$json$Json$Decode$string);
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $author$project$Analyser$State$Dependencies$decode = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Analyser$State$Dependencies$Dependencies,
	A2(
		$elm$json$Json$Decode$field,
		'values',
		$elm$json$Json$Decode$dict($author$project$Analyser$State$Dependencies$decodeDependencyInfo)),
	A2(
		$elm$json$Json$Decode$field,
		'unused',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2($elm$json$Json$Decode$field, 'mode', $author$project$Analyser$State$Dependencies$decodeMode));
var $author$project$Analyser$Messages$Types$Message = F5(
	function (id, status, file, type_, data) {
		return {data: data, file: file, id: id, status: status, type_: type_};
	});
var $author$project$Analyser$Messages$Types$Applicable = {$: 'Applicable'};
var $author$project$Analyser$Messages$Types$Blocked = {$: 'Blocked'};
var $author$project$Analyser$Messages$Types$Fixing = {$: 'Fixing'};
var $author$project$Analyser$Messages$Types$Outdated = {$: 'Outdated'};
var $author$project$Analyser$Messages$Json$decodeMessageStatus = A2(
	$elm$json$Json$Decode$andThen,
	function (x) {
		switch (x) {
			case 'outdated':
				return $elm$json$Json$Decode$succeed($author$project$Analyser$Messages$Types$Outdated);
			case 'blocked':
				return $elm$json$Json$Decode$succeed($author$project$Analyser$Messages$Types$Blocked);
			case 'applicable':
				return $elm$json$Json$Decode$succeed($author$project$Analyser$Messages$Types$Applicable);
			case 'fixing':
				return $elm$json$Json$Decode$succeed($author$project$Analyser$Messages$Types$Fixing);
			default:
				return $elm$json$Json$Decode$fail('Expecected message status, but got: ' + x);
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Analyser$FileRef$FileRef = F2(
	function (version, path) {
		return {path: path, version: version};
	});
var $author$project$Analyser$FileRef$decoder = A2(
	$elm$json$Json$Decode$map,
	$author$project$Analyser$FileRef$FileRef(''),
	$elm$json$Json$Decode$string);
var $author$project$Analyser$Messages$Data$MessageData = F2(
	function (a, b) {
		return {$: 'MessageData', a: a, b: b};
	});
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $author$project$Analyser$Messages$Data$ErrorMessageV = function (a) {
	return {$: 'ErrorMessageV', a: a};
};
var $author$project$Analyser$Messages$Data$FileNameV = function (a) {
	return {$: 'FileNameV', a: a};
};
var $author$project$Analyser$Messages$Data$ModuleNameV = function (a) {
	return {$: 'ModuleNameV', a: a};
};
var $author$project$Analyser$Messages$Data$RangeListV = function (a) {
	return {$: 'RangeListV', a: a};
};
var $author$project$Analyser$Messages$Data$RangeV = function (a) {
	return {$: 'RangeV', a: a};
};
var $author$project$Analyser$Messages$Data$VariableNameV = function (a) {
	return {$: 'VariableNameV', a: a};
};
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $author$project$Analyser$Messages$Schema$propertyTypeForKey = F2(
	function (k, _v0) {
		var s = _v0.a;
		return A2($elm$core$Dict$get, k, s);
	});
var $author$project$Analyser$Messages$Data$schemaDecoder = F2(
	function (key, schema) {
		var _v0 = A2($author$project$Analyser$Messages$Schema$propertyTypeForKey, key, schema);
		if (_v0.$ === 'Nothing') {
			return $elm$json$Json$Decode$fail('Unknown property key: ' + key);
		} else {
			var propertyType = _v0.a;
			switch (propertyType.$) {
				case 'Range':
					return A2($elm$json$Json$Decode$map, $author$project$Analyser$Messages$Data$RangeV, $stil4m$elm_syntax$Elm$Syntax$Range$decoder);
				case 'FileName':
					return A2($elm$json$Json$Decode$map, $author$project$Analyser$Messages$Data$FileNameV, $elm$json$Json$Decode$string);
				case 'VariableName':
					return A2($elm$json$Json$Decode$map, $author$project$Analyser$Messages$Data$VariableNameV, $elm$json$Json$Decode$string);
				case 'RangeList':
					return A2(
						$elm$json$Json$Decode$map,
						$author$project$Analyser$Messages$Data$RangeListV,
						$elm$json$Json$Decode$list($stil4m$elm_syntax$Elm$Syntax$Range$decoder));
				case 'ModuleName':
					return A2(
						$elm$json$Json$Decode$map,
						$author$project$Analyser$Messages$Data$ModuleNameV,
						$elm$json$Json$Decode$list($elm$json$Json$Decode$string));
				default:
					return A2($elm$json$Json$Decode$map, $author$project$Analyser$Messages$Data$ErrorMessageV, $elm$json$Json$Decode$string);
			}
		}
	});
var $elm$core$Result$toMaybe = function (result) {
	if (result.$ === 'Ok') {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Analyser$Messages$Data$decodeDataValue = F3(
	function (schema, k, value) {
		return $elm$core$Result$toMaybe(
			A2(
				$elm$json$Json$Decode$decodeValue,
				A2($author$project$Analyser$Messages$Data$schemaDecoder, k, schema),
				value));
	});
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm_community$dict_extra$Dict$Extra$filterMap = F2(
	function (f, dict) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, acc) {
					var _v0 = A2(f, k, v);
					if (_v0.$ === 'Just') {
						var newVal = _v0.a;
						return A3($elm$core$Dict$insert, k, newVal, acc);
					} else {
						return acc;
					}
				}),
			$elm$core$Dict$empty,
			dict);
	});
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Analyser$Messages$Data$decodeDataValues = function (schema) {
	return A2(
		$elm$json$Json$Decode$andThen,
		function (d) {
			return $elm$json$Json$Decode$succeed(
				A2(
					$elm_community$dict_extra$Dict$Extra$filterMap,
					$author$project$Analyser$Messages$Data$decodeDataValue(schema),
					d));
		},
		$elm$json$Json$Decode$dict($elm$json$Json$Decode$value));
};
var $author$project$Analyser$Messages$Data$decode = function (schema) {
	return A3(
		$elm$json$Json$Decode$map2,
		$author$project$Analyser$Messages$Data$MessageData,
		A2($elm$json$Json$Decode$field, 'description', $elm$json$Json$Decode$string),
		A2(
			$elm$json$Json$Decode$field,
			'properties',
			$author$project$Analyser$Messages$Data$decodeDataValues(schema)));
};
var $author$project$Analyser$Messages$Schemas$decoderFor = F2(
	function (s, _v0) {
		var d = _v0.a;
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$json$Json$Decode$fail('Unknown schema'),
			A2(
				$elm$core$Maybe$map,
				$author$project$Analyser$Messages$Data$decode,
				A2($elm$core$Dict$get, s, d)));
	});
var $elm$json$Json$Decode$map5 = _Json_map5;
var $author$project$Analyser$Messages$Json$decodeMessage = function (schemas) {
	return A2(
		$elm$json$Json$Decode$andThen,
		function (t) {
			return A6(
				$elm$json$Json$Decode$map5,
				$author$project$Analyser$Messages$Types$Message,
				A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
				A2($elm$json$Json$Decode$field, 'status', $author$project$Analyser$Messages$Json$decodeMessageStatus),
				A2($elm$json$Json$Decode$field, 'file', $author$project$Analyser$FileRef$decoder),
				$elm$json$Json$Decode$succeed(t),
				A2(
					$elm$json$Json$Decode$field,
					'data',
					A2($author$project$Analyser$Messages$Schemas$decoderFor, t, schemas)));
		},
		A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
};
var $author$project$Analyser$State$Fixing = {$: 'Fixing'};
var $author$project$Analyser$State$Idle = {$: 'Idle'};
var $author$project$Analyser$State$Initialising = {$: 'Initialising'};
var $author$project$Analyser$State$decodeStatus = A2(
	$elm$json$Json$Decode$andThen,
	function (x) {
		switch (x) {
			case 'initialising':
				return $elm$json$Json$Decode$succeed($author$project$Analyser$State$Initialising);
			case 'idle':
				return $elm$json$Json$Decode$succeed($author$project$Analyser$State$Idle);
			case 'fixing':
				return $elm$json$Json$Decode$succeed($author$project$Analyser$State$Fixing);
			default:
				return $elm$json$Json$Decode$fail('Could not decode status. got: ' + x);
		}
	},
	$elm$json$Json$Decode$string);
var $elm$json$Json$Decode$map6 = _Json_map6;
var $author$project$Analyser$State$decodeState = function (schemas) {
	return A7(
		$elm$json$Json$Decode$map6,
		$author$project$Analyser$State$State,
		A2(
			$elm$json$Json$Decode$field,
			'messages',
			$elm$json$Json$Decode$list(
				$author$project$Analyser$Messages$Json$decodeMessage(schemas))),
		A2($elm$json$Json$Decode$field, 'dependencies', $author$project$Analyser$State$Dependencies$decode),
		A2($elm$json$Json$Decode$field, 'idCount', $elm$json$Json$Decode$int),
		A2($elm$json$Json$Decode$field, 'status', $author$project$Analyser$State$decodeStatus),
		A2(
			$elm$json$Json$Decode$field,
			'queue',
			$elm$json$Json$Decode$list($elm$json$Json$Decode$int)),
		A2($elm$json$Json$Decode$field, 'modules', $author$project$Analyser$Modules$decode));
};
var $author$project$Analyser$Messages$Schema$Range = {$: 'Range'};
var $author$project$Analyser$Messages$Schema$Schema = function (a) {
	return {$: 'Schema', a: a};
};
var $author$project$Analyser$Messages$Schema$rangeProp = F2(
	function (k, _v0) {
		var s = _v0.a;
		return $author$project$Analyser$Messages$Schema$Schema(
			A3($elm$core$Dict$insert, k, $author$project$Analyser$Messages$Schema$Range, s));
	});
var $author$project$ASTUtil$Inspector$Post = function (a) {
	return {$: 'Post', a: a};
};
var $author$project$ASTUtil$Inspector$Continue = {$: 'Continue'};
var $author$project$ASTUtil$Inspector$defaultConfig = {onCase: $author$project$ASTUtil$Inspector$Continue, onDestructuring: $author$project$ASTUtil$Inspector$Continue, onExpression: $author$project$ASTUtil$Inspector$Continue, onFile: $author$project$ASTUtil$Inspector$Continue, onFunction: $author$project$ASTUtil$Inspector$Continue, onFunctionOrValue: $author$project$ASTUtil$Inspector$Continue, onFunctionSignature: $author$project$ASTUtil$Inspector$Continue, onImport: $author$project$ASTUtil$Inspector$Continue, onLambda: $author$project$ASTUtil$Inspector$Continue, onLetBlock: $author$project$ASTUtil$Inspector$Continue, onOperatorApplication: $author$project$ASTUtil$Inspector$Continue, onPortDeclaration: $author$project$ASTUtil$Inspector$Continue, onPrefixOperator: $author$project$ASTUtil$Inspector$Continue, onRecordAccess: $author$project$ASTUtil$Inspector$Continue, onRecordUpdate: $author$project$ASTUtil$Inspector$Continue, onType: $author$project$ASTUtil$Inspector$Continue, onTypeAlias: $author$project$ASTUtil$Inspector$Continue, onTypeAnnotation: $author$project$ASTUtil$Inspector$Continue};
var $author$project$ASTUtil$Inspector$actionLambda = function (act) {
	switch (act.$) {
		case 'Skip':
			return F3(
				function (_v1, _v2, c) {
					return c;
				});
		case 'Continue':
			return F3(
				function (f, _v3, c) {
					return f(c);
				});
		case 'Pre':
			var g = act.a;
			return F3(
				function (f, x, c) {
					return f(
						A2(g, x, c));
				});
		case 'Post':
			var g = act.a;
			return F3(
				function (f, x, c) {
					return A2(
						g,
						x,
						f(c));
				});
		default:
			var g = act.a;
			return F3(
				function (f, x, c) {
					return A3(g, f, x, c);
				});
	}
};
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $stil4m$elm_syntax$Elm$Syntax$Node$value = function (_v0) {
	var v = _v0.b;
	return v;
};
var $author$project$ASTUtil$Inspector$inspectTypeAnnotation = F3(
	function (config, typeAnnotation, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.onTypeAnnotation,
			A2($author$project$ASTUtil$Inspector$inspectTypeAnnotationInner, config, typeAnnotation),
			typeAnnotation,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectTypeAnnotationInner = F3(
	function (config, _v0, context) {
		var typeRefence = _v0.b;
		switch (typeRefence.$) {
			case 'Typed':
				var typeArgs = typeRefence.b;
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectTypeAnnotation(config),
					context,
					typeArgs);
			case 'Tupled':
				var typeAnnotations = typeRefence.a;
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectTypeAnnotation(config),
					context,
					typeAnnotations);
			case 'Record':
				var recordDefinition = typeRefence.a;
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectTypeAnnotation(config),
					context,
					A2(
						$elm$core$List$map,
						A2($elm$core$Basics$composeR, $stil4m$elm_syntax$Elm$Syntax$Node$value, $elm$core$Tuple$second),
						recordDefinition));
			case 'GenericRecord':
				var recordDefinition = typeRefence.b;
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectTypeAnnotation(config),
					context,
					A2(
						$elm$core$List$map,
						A2($elm$core$Basics$composeR, $stil4m$elm_syntax$Elm$Syntax$Node$value, $elm$core$Tuple$second),
						$stil4m$elm_syntax$Elm$Syntax$Node$value(recordDefinition)));
			case 'FunctionTypeAnnotation':
				var left = typeRefence.a;
				var right = typeRefence.b;
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectTypeAnnotation(config),
					context,
					_List_fromArray(
						[left, right]));
			case 'Unit':
				return context;
			default:
				return context;
		}
	});
var $author$project$ASTUtil$Inspector$inspectSignature = F3(
	function (config, signature, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.onFunctionSignature,
			A2(
				$author$project$ASTUtil$Inspector$inspectTypeAnnotation,
				config,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(signature).typeAnnotation),
			signature,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectCase = F3(
	function (config, caze, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.onCase,
			A2($author$project$ASTUtil$Inspector$inspectExpression, config, caze.b),
			caze,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectDestructuring = F3(
	function (config, destructuring, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.onDestructuring,
			A2($author$project$ASTUtil$Inspector$inspectExpression, config, destructuring.b),
			destructuring,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectExpression = F3(
	function (config, expression, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.onExpression,
			A2(
				$author$project$ASTUtil$Inspector$inspectInnerExpression,
				config,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(expression)),
			expression,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectFunction = F3(
	function (config, functionNode, context) {
		var _function = $stil4m$elm_syntax$Elm$Syntax$Node$value(functionNode);
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.onFunction,
			A2(
				$elm$core$Basics$composeR,
				A2(
					$author$project$ASTUtil$Inspector$inspectExpression,
					config,
					$stil4m$elm_syntax$Elm$Syntax$Node$value(_function.declaration).expression),
				A2(
					$elm$core$Maybe$withDefault,
					$elm$core$Basics$identity,
					A2(
						$elm$core$Maybe$map,
						$author$project$ASTUtil$Inspector$inspectSignature(config),
						_function.signature))),
			functionNode,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectInnerExpression = F3(
	function (config, expression, context) {
		switch (expression.$) {
			case 'UnitExpr':
				return context;
			case 'FunctionOrValue':
				var m = expression.a;
				var functionOrVal = expression.b;
				return A4(
					$author$project$ASTUtil$Inspector$actionLambda,
					config.onFunctionOrValue,
					$elm$core$Basics$identity,
					_Utils_Tuple2(m, functionOrVal),
					context);
			case 'PrefixOperator':
				var prefix = expression.a;
				return A4($author$project$ASTUtil$Inspector$actionLambda, config.onPrefixOperator, $elm$core$Basics$identity, prefix, context);
			case 'Operator':
				return context;
			case 'Integer':
				return context;
			case 'Hex':
				return context;
			case 'Floatable':
				return context;
			case 'Negation':
				var x = expression.a;
				return A3($author$project$ASTUtil$Inspector$inspectExpression, config, x, context);
			case 'Literal':
				return context;
			case 'CharLiteral':
				return context;
			case 'RecordAccess':
				var ex1 = expression.a;
				var key = expression.b;
				return A4(
					$author$project$ASTUtil$Inspector$actionLambda,
					config.onRecordAccess,
					A2($author$project$ASTUtil$Inspector$inspectExpression, config, ex1),
					_Utils_Tuple2(ex1, key),
					context);
			case 'RecordAccessFunction':
				return context;
			case 'GLSLExpression':
				return context;
			case 'Application':
				var expressionList = expression.a;
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectExpression(config),
					context,
					expressionList);
			case 'OperatorApplication':
				var op = expression.a;
				var dir = expression.b;
				var left = expression.c;
				var right = expression.d;
				return A4(
					$author$project$ASTUtil$Inspector$actionLambda,
					config.onOperatorApplication,
					function (a) {
						return A3(
							$elm$core$List$foldl,
							$author$project$ASTUtil$Inspector$inspectExpression(config),
							a,
							_List_fromArray(
								[left, right]));
					},
					{direction: dir, left: left, operator: op, right: right},
					context);
			case 'IfBlock':
				var e1 = expression.a;
				var e2 = expression.b;
				var e3 = expression.c;
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectExpression(config),
					context,
					_List_fromArray(
						[e1, e2, e3]));
			case 'TupledExpression':
				var expressionList = expression.a;
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectExpression(config),
					context,
					expressionList);
			case 'ParenthesizedExpression':
				var inner = expression.a;
				return A3($author$project$ASTUtil$Inspector$inspectExpression, config, inner, context);
			case 'LetExpression':
				var letBlock = expression.a;
				var next = A2(
					$elm$core$Basics$composeR,
					A2($author$project$ASTUtil$Inspector$inspectLetDeclarations, config, letBlock.declarations),
					A2($author$project$ASTUtil$Inspector$inspectExpression, config, letBlock.expression));
				return A4($author$project$ASTUtil$Inspector$actionLambda, config.onLetBlock, next, letBlock, context);
			case 'CaseExpression':
				var caseBlock = expression.a;
				var context2 = A3($author$project$ASTUtil$Inspector$inspectExpression, config, caseBlock.expression, context);
				var context3 = A3(
					$elm$core$List$foldl,
					F2(
						function (a, b) {
							return A3($author$project$ASTUtil$Inspector$inspectCase, config, a, b);
						}),
					context2,
					caseBlock.cases);
				return context3;
			case 'LambdaExpression':
				var lambda = expression.a;
				return A4(
					$author$project$ASTUtil$Inspector$actionLambda,
					config.onLambda,
					A2($author$project$ASTUtil$Inspector$inspectExpression, config, lambda.expression),
					lambda,
					context);
			case 'ListExpr':
				var expressionList = expression.a;
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectExpression(config),
					context,
					expressionList);
			case 'RecordExpr':
				var expressionStringList = expression.a;
				return A3(
					$elm$core$List$foldl,
					F2(
						function (a, b) {
							return A3(
								$author$project$ASTUtil$Inspector$inspectExpression,
								config,
								$stil4m$elm_syntax$Elm$Syntax$Node$value(a).b,
								b);
						}),
					context,
					expressionStringList);
			default:
				var name = expression.a;
				var updates = expression.b;
				return A4(
					$author$project$ASTUtil$Inspector$actionLambda,
					config.onRecordUpdate,
					function (c) {
						return A3(
							$elm$core$List$foldl,
							F2(
								function (a, b) {
									return A3(
										$author$project$ASTUtil$Inspector$inspectExpression,
										config,
										$stil4m$elm_syntax$Elm$Syntax$Node$value(a).b,
										b);
								}),
							c,
							updates);
					},
					_Utils_Tuple2(name, updates),
					context);
		}
	});
var $author$project$ASTUtil$Inspector$inspectLetDeclaration = F3(
	function (config, _v0, context) {
		var r = _v0.a;
		var declaration = _v0.b;
		if (declaration.$ === 'LetFunction') {
			var _function = declaration.a;
			return A3(
				$author$project$ASTUtil$Inspector$inspectFunction,
				config,
				A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, _function),
				context);
		} else {
			var pattern = declaration.a;
			var expression = declaration.b;
			return A3(
				$author$project$ASTUtil$Inspector$inspectDestructuring,
				config,
				_Utils_Tuple2(pattern, expression),
				context);
		}
	});
var $author$project$ASTUtil$Inspector$inspectLetDeclarations = F3(
	function (config, declarations, context) {
		return A3(
			$elm$core$List$foldl,
			$author$project$ASTUtil$Inspector$inspectLetDeclaration(config),
			context,
			declarations);
	});
var $author$project$ASTUtil$Inspector$inspectPortDeclaration = F3(
	function (config, signature, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.onPortDeclaration,
			A2($author$project$ASTUtil$Inspector$inspectSignature, config, signature),
			signature,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectValueConstructor = F3(
	function (config, _v0, context) {
		var valueConstructor = _v0.b;
		return A3(
			$elm$core$List$foldl,
			$author$project$ASTUtil$Inspector$inspectTypeAnnotation(config),
			context,
			valueConstructor._arguments);
	});
var $author$project$ASTUtil$Inspector$inspectType = F3(
	function (config, typeDecl, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.onType,
			function (c) {
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectValueConstructor(config),
					c,
					typeDecl.constructors);
			},
			typeDecl,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectTypeAlias = F3(
	function (config, typeAlias, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.onTypeAlias,
			A2(
				$author$project$ASTUtil$Inspector$inspectTypeAnnotation,
				config,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(typeAlias).typeAnnotation),
			typeAlias,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectDeclaration = F3(
	function (config, _v0, context) {
		var r = _v0.a;
		var declaration = _v0.b;
		switch (declaration.$) {
			case 'FunctionDeclaration':
				var _function = declaration.a;
				return A3(
					$author$project$ASTUtil$Inspector$inspectFunction,
					config,
					A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, _function),
					context);
			case 'AliasDeclaration':
				var typeAlias = declaration.a;
				return A3(
					$author$project$ASTUtil$Inspector$inspectTypeAlias,
					config,
					A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, typeAlias),
					context);
			case 'CustomTypeDeclaration':
				var typeDecl = declaration.a;
				return A3($author$project$ASTUtil$Inspector$inspectType, config, typeDecl, context);
			case 'PortDeclaration':
				var signature = declaration.a;
				return A3(
					$author$project$ASTUtil$Inspector$inspectPortDeclaration,
					config,
					A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, signature),
					context);
			case 'InfixDeclaration':
				return context;
			default:
				var pattern = declaration.a;
				var expresion = declaration.b;
				return A3(
					$author$project$ASTUtil$Inspector$inspectDestructuring,
					config,
					_Utils_Tuple2(pattern, expresion),
					context);
		}
	});
var $author$project$ASTUtil$Inspector$inspectDeclarations = F3(
	function (config, declarations, context) {
		return A3(
			$elm$core$List$foldl,
			$author$project$ASTUtil$Inspector$inspectDeclaration(config),
			context,
			declarations);
	});
var $author$project$ASTUtil$Inspector$inspectImport = F3(
	function (config, imp, context) {
		return A4($author$project$ASTUtil$Inspector$actionLambda, config.onImport, $elm$core$Basics$identity, imp, context);
	});
var $author$project$ASTUtil$Inspector$inspectImports = F3(
	function (config, imports, context) {
		return A3(
			$elm$core$List$foldl,
			$author$project$ASTUtil$Inspector$inspectImport(config),
			context,
			imports);
	});
var $author$project$ASTUtil$Inspector$inspect = F3(
	function (config, file, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.onFile,
			A2(
				$elm$core$Basics$composeR,
				A2($author$project$ASTUtil$Inspector$inspectImports, config, file.imports),
				A2($author$project$ASTUtil$Inspector$inspectDeclarations, config, file.declarations)),
			file,
			context);
	});
var $author$project$Analyser$Messages$Data$addRange = F3(
	function (k, v, _v0) {
		var desc = _v0.a;
		var d = _v0.b;
		return A2(
			$author$project$Analyser$Messages$Data$MessageData,
			desc,
			A3(
				$elm$core$Dict$insert,
				k,
				$author$project$Analyser$Messages$Data$RangeV(v),
				d));
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $author$project$Analyser$Messages$Data$init = function (desc) {
	return A2($author$project$Analyser$Messages$Data$MessageData, desc, $elm$core$Dict$empty);
};
var $author$project$Analyser$Checks$BooleanCase$isBooleanCase = function (_v0) {
	var _v1 = _v0.a;
	var pattern = _v1.b;
	if ((pattern.$ === 'NamedPattern') && (!pattern.b.b)) {
		var qnr = pattern.a;
		return _Utils_eq(qnr.moduleName, _List_Nil) && ((qnr.name === 'True') || (qnr.name === 'False'));
	} else {
		return false;
	}
};
var $author$project$AST$Ranges$locationToString = function (_v0) {
	var row = _v0.row;
	var column = _v0.column;
	return '(' + ($elm$core$String$fromInt(row) + (',' + ($elm$core$String$fromInt(column) + ')')));
};
var $author$project$AST$Ranges$rangeToString = function (_v0) {
	var start = _v0.start;
	var end = _v0.end;
	return '(' + ($author$project$AST$Ranges$locationToString(start) + (',' + ($author$project$AST$Ranges$locationToString(end) + ')')));
};
var $author$project$Analyser$Checks$BooleanCase$onExpression = F2(
	function (_v0, context) {
		var r = _v0.a;
		var inner = _v0.b;
		if (inner.$ === 'CaseExpression') {
			var caseExpression = inner.a;
			return A2($elm$core$List$any, $author$project$Analyser$Checks$BooleanCase$isBooleanCase, caseExpression.cases) ? A2(
				$elm$core$List$cons,
				A3(
					$author$project$Analyser$Messages$Data$addRange,
					'range',
					r,
					$author$project$Analyser$Messages$Data$init(
						$elm$core$String$concat(
							_List_fromArray(
								[
									'Use an if-block instead of an case expression ',
									$author$project$AST$Ranges$rangeToString(r)
								])))),
				context) : context;
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$BooleanCase$scan = F2(
	function (fileContext, _v0) {
		return A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onExpression: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$BooleanCase$onExpression)
				}),
			fileContext.ast,
			_List_Nil);
	});
var $author$project$Analyser$Messages$Schema$schema = $author$project$Analyser$Messages$Schema$Schema($elm$core$Dict$empty);
var $author$project$Analyser$Checks$BooleanCase$checker = {
	check: $author$project$Analyser$Checks$BooleanCase$scan,
	info: {
		description: 'If you case over a boolean value, it maybe better to use an if expression.',
		key: 'BooleanCase',
		name: 'Boolean Case Expression',
		schema: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$DebugCrash$entryForQualifiedExpr = F2(
	function (moduleName, f) {
		return _Utils_eq(
			moduleName,
			_List_fromArray(
				['Debug'])) ? (f === 'todo') : false;
	});
var $author$project$Analyser$Checks$DebugCrash$onExpression = F2(
	function (_v0, context) {
		var range = _v0.a;
		var expression = _v0.b;
		if (expression.$ === 'FunctionOrValue') {
			var moduleName = expression.a;
			var f = expression.b;
			if (A2($author$project$Analyser$Checks$DebugCrash$entryForQualifiedExpr, moduleName, f)) {
				var r = range;
				return A2(
					$elm$core$List$cons,
					A3(
						$author$project$Analyser$Messages$Data$addRange,
						'range',
						r,
						$author$project$Analyser$Messages$Data$init(
							$elm$core$String$concat(
								_List_fromArray(
									[
										'Use of Debug.todo at ',
										$author$project$AST$Ranges$rangeToString(r)
									])))),
					context);
			} else {
				return context;
			}
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$DebugCrash$scan = F2(
	function (fileContext, _v0) {
		return A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onExpression: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$DebugCrash$onExpression)
				}),
			fileContext.ast,
			_List_Nil);
	});
var $author$project$Analyser$Checks$DebugCrash$checker = {
	check: $author$project$Analyser$Checks$DebugCrash$scan,
	info: {
		description: 'You may not want to ship this to your end users.',
		key: 'DebugTodo',
		name: 'Debug Todo',
		schema: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$DebugLog$entryForQualifiedExpr = F2(
	function (moduleName, f) {
		return _Utils_eq(
			moduleName,
			_List_fromArray(
				['Debug'])) ? (f === 'log') : false;
	});
var $author$project$Analyser$Checks$DebugLog$onExpression = F2(
	function (_v0, context) {
		var range = _v0.a;
		var expression = _v0.b;
		if (expression.$ === 'FunctionOrValue') {
			var moduleName = expression.a;
			var f = expression.b;
			return A2($author$project$Analyser$Checks$DebugLog$entryForQualifiedExpr, moduleName, f) ? A2(
				$elm$core$List$cons,
				A3(
					$author$project$Analyser$Messages$Data$addRange,
					'range',
					range,
					$author$project$Analyser$Messages$Data$init(
						$elm$core$String$concat(
							_List_fromArray(
								[
									'Use of Debug.log at ',
									$author$project$AST$Ranges$rangeToString(range)
								])))),
				context) : context;
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$DebugLog$scan = F2(
	function (fileContext, _v0) {
		return A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onExpression: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$DebugLog$onExpression)
				}),
			fileContext.ast,
			_List_Nil);
	});
var $author$project$Analyser$Checks$DebugLog$checker = {
	check: $author$project$Analyser$Checks$DebugLog$scan,
	info: {
		description: 'This is nice for development, but you do not want to ship this to package users or your end users.',
		key: 'DebugLog',
		name: 'Debug Log',
		schema: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$DropConcatOfLists$onExpression = F2(
	function (_v0, context) {
		var r = _v0.a;
		var inner = _v0.b;
		if ((((inner.$ === 'OperatorApplication') && (inner.a === '++')) && (inner.c.b.$ === 'ListExpr')) && (inner.d.b.$ === 'ListExpr')) {
			var _v2 = inner.c;
			var _v3 = inner.d;
			var range = r;
			return A2(
				$elm$core$List$cons,
				A3(
					$author$project$Analyser$Messages$Data$addRange,
					'range',
					range,
					$author$project$Analyser$Messages$Data$init(
						$elm$core$String$concat(
							_List_fromArray(
								[
									'Joining two literal lists with `++`, but instead you can just join the lists. At ',
									$author$project$AST$Ranges$rangeToString(range)
								])))),
				context);
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$DropConcatOfLists$scan = F2(
	function (fileContext, _v0) {
		return A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onExpression: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$DropConcatOfLists$onExpression)
				}),
			fileContext.ast,
			_List_Nil);
	});
var $author$project$Analyser$Checks$DropConcatOfLists$checker = {
	check: $author$project$Analyser$Checks$DropConcatOfLists$scan,
	info: {
		description: 'If you concatenate two lists ([...] ++ [...]), then you can merge them into one list.',
		key: 'DropConcatOfLists',
		name: 'Drop Concat Of Lists',
		schema: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$DropConsOfItemAndList$onExpression = F2(
	function (_v0, context) {
		var r = _v0.a;
		var inner = _v0.b;
		if (((inner.$ === 'OperatorApplication') && (inner.a === '::')) && (inner.d.b.$ === 'ListExpr')) {
			var _v2 = inner.c;
			var headRange = _v2.a;
			var _v3 = inner.d;
			var tailRange = _v3.a;
			var range = r;
			return A2(
				$elm$core$List$cons,
				A3(
					$author$project$Analyser$Messages$Data$addRange,
					'tail',
					tailRange,
					A3(
						$author$project$Analyser$Messages$Data$addRange,
						'head',
						headRange,
						A3(
							$author$project$Analyser$Messages$Data$addRange,
							'range',
							range,
							$author$project$Analyser$Messages$Data$init(
								$elm$core$String$concat(
									_List_fromArray(
										[
											'Adding an item to the front of a literal list, but instead you can just put it in the list. At ',
											$author$project$AST$Ranges$rangeToString(range)
										])))))),
				context);
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$DropConsOfItemAndList$scan = F2(
	function (fileContext, _v0) {
		return A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onExpression: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$DropConsOfItemAndList$onExpression)
				}),
			fileContext.ast,
			_List_Nil);
	});
var $author$project$Analyser$Checks$DropConsOfItemAndList$checker = {
	check: $author$project$Analyser$Checks$DropConsOfItemAndList$scan,
	info: {
		description: 'If you cons an item to a literal list (x :: [1, 2, 3]), then you can just put the item into the list.',
		key: 'DropConsOfItemAndList',
		name: 'Drop Cons Of Item And List',
		schema: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'tail',
			A2(
				$author$project$Analyser$Messages$Schema$rangeProp,
				'head',
				A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)))
	}
};
var $author$project$Analyser$Messages$Schema$ModuleName = {$: 'ModuleName'};
var $author$project$Analyser$Messages$Schema$moduleProp = F2(
	function (k, _v0) {
		var s = _v0.a;
		return $author$project$Analyser$Messages$Schema$Schema(
			A3($elm$core$Dict$insert, k, $author$project$Analyser$Messages$Schema$ModuleName, s));
	});
var $author$project$Analyser$Messages$Schema$RangeList = {$: 'RangeList'};
var $author$project$Analyser$Messages$Schema$rangeListProp = F2(
	function (k, _v0) {
		var s = _v0.a;
		return $author$project$Analyser$Messages$Schema$Schema(
			A3($elm$core$Dict$insert, k, $author$project$Analyser$Messages$Schema$RangeList, s));
	});
var $author$project$ASTUtil$Inspector$Skip = {$: 'Skip'};
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $author$project$Analyser$Messages$Data$addModuleName = F3(
	function (k, v, _v0) {
		var desc = _v0.a;
		var d = _v0.b;
		return A2(
			$author$project$Analyser$Messages$Data$MessageData,
			desc,
			A3(
				$elm$core$Dict$insert,
				k,
				$author$project$Analyser$Messages$Data$ModuleNameV(v),
				d));
	});
var $author$project$Analyser$Messages$Data$addRanges = F3(
	function (k, v, _v0) {
		var desc = _v0.a;
		var d = _v0.b;
		return A2(
			$author$project$Analyser$Messages$Data$MessageData,
			desc,
			A3(
				$elm$core$Dict$insert,
				k,
				$author$project$Analyser$Messages$Data$RangeListV(v),
				d));
	});
var $author$project$Analyser$Checks$DuplicateImport$buildData = function (_v0) {
	var m = _v0.a;
	var rs = _v0.b;
	return A3(
		$author$project$Analyser$Messages$Data$addRanges,
		'ranges',
		rs,
		A3(
			$author$project$Analyser$Messages$Data$addModuleName,
			'moduleName',
			m,
			$author$project$Analyser$Messages$Data$init(
				$elm$core$String$concat(
					_List_fromArray(
						[
							'Duplicate import for module `',
							A2($elm$core$String$join, '.', m),
							'`` at [ ',
							A2(
							$elm$core$String$join,
							' | ',
							A2($elm$core$List$map, $author$project$AST$Ranges$rangeToString, rs)),
							' ]'
						])))));
};
var $elm$core$Dict$filter = F2(
	function (isGood, dict) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, d) {
					return A2(isGood, k, v) ? A3($elm$core$Dict$insert, k, v, d) : d;
				}),
			$elm$core$Dict$empty,
			dict);
	});
var $author$project$Analyser$Checks$DuplicateImport$hasLength = function (f) {
	return A2($elm$core$Basics$composeR, $elm$core$List$length, f);
};
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $author$project$Analyser$Checks$DuplicateImport$onImport = F2(
	function (_v0, context) {
		var range = _v0.a;
		var imp = _v0.b;
		var moduleName = $stil4m$elm_syntax$Elm$Syntax$Node$value(imp.moduleName);
		var _v1 = A2($elm$core$Dict$get, moduleName, context);
		if (_v1.$ === 'Just') {
			return A3(
				$elm$core$Dict$update,
				moduleName,
				$elm$core$Maybe$map(
					function (a) {
						return _Utils_ap(
							a,
							_List_fromArray(
								[range]));
					}),
				context);
		} else {
			return A3(
				$elm$core$Dict$insert,
				moduleName,
				_List_fromArray(
					[range]),
				context);
		}
	});
var $author$project$Analyser$Checks$DuplicateImport$scan = F2(
	function (fileContext, _v0) {
		return A2(
			$elm$core$List$map,
			$author$project$Analyser$Checks$DuplicateImport$buildData,
			$elm$core$Dict$toList(
				A2(
					$elm$core$Dict$filter,
					$elm$core$Basics$always(
						$author$project$Analyser$Checks$DuplicateImport$hasLength(
							$elm$core$Basics$lt(1))),
					A3(
						$author$project$ASTUtil$Inspector$inspect,
						_Utils_update(
							$author$project$ASTUtil$Inspector$defaultConfig,
							{
								onFunction: $author$project$ASTUtil$Inspector$Skip,
								onImport: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$DuplicateImport$onImport)
							}),
						fileContext.ast,
						$elm$core$Dict$empty))));
	});
var $author$project$Analyser$Checks$DuplicateImport$checker = {
	check: $author$project$Analyser$Checks$DuplicateImport$scan,
	info: {
		description: 'You are importing the same module twice.',
		key: 'DuplicateImport',
		name: 'Duplicate Import',
		schema: A2(
			$author$project$Analyser$Messages$Schema$moduleProp,
			'moduleName',
			A2($author$project$Analyser$Messages$Schema$rangeListProp, 'ranges', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$Analyser$Messages$Data$addVarName = F3(
	function (k, v, _v0) {
		var desc = _v0.a;
		var d = _v0.b;
		return A2(
			$author$project$Analyser$Messages$Data$MessageData,
			desc,
			A3(
				$elm$core$Dict$insert,
				k,
				$author$project$Analyser$Messages$Data$VariableNameV(v),
				d));
	});
var $author$project$Analyser$Checks$DuplicateImportedVariable$asMessageData = function (_v0) {
	var a = _v0.a;
	var b = _v0.b;
	var rs = _v0.c;
	return A3(
		$author$project$Analyser$Messages$Data$addRanges,
		'ranges',
		rs,
		A3(
			$author$project$Analyser$Messages$Data$addVarName,
			'varName',
			b,
			A3(
				$author$project$Analyser$Messages$Data$addModuleName,
				'moduleName',
				a,
				$author$project$Analyser$Messages$Data$init(
					$elm$core$String$concat(
						_List_fromArray(
							[
								'Variable `',
								b,
								'` imported multiple times module `',
								A2($elm$core$String$join, '.', a),
								'` at [ ',
								A2(
								$elm$core$String$join,
								' | ',
								A2($elm$core$List$map, $author$project$AST$Ranges$rangeToString, rs)),
								' ]'
							]))))));
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Analyser$Checks$DuplicateImportedVariable$findViolations = function (d) {
	return A2(
		$elm$core$List$filter,
		function (_v2) {
			var rs = _v2.c;
			return $elm$core$List$length(rs) >= 2;
		},
		A2(
			$elm$core$List$concatMap,
			function (_v0) {
				var m = _v0.a;
				var e = _v0.b;
				return A2(
					$elm$core$List$map,
					function (_v1) {
						var n = _v1.a;
						var rs = _v1.b;
						return _Utils_Tuple3(m, n, rs);
					},
					$elm$core$Dict$toList(e));
			},
			$elm$core$Dict$toList(d)));
};
var $author$project$Analyser$Checks$DuplicateImportedVariable$exposingValues = function (_v0) {
	var r = _v0.a;
	var t = _v0.b;
	return A2(
		$stil4m$elm_syntax$Elm$Syntax$Node$Node,
		r,
		function () {
			switch (t.$) {
				case 'TypeExpose':
					var s = t.a;
					return s.name;
				case 'InfixExpose':
					var s = t.a;
					return s;
				case 'FunctionExpose':
					var s = t.a;
					return s;
				default:
					var s = t.a;
					return s;
			}
		}());
};
var $author$project$Analyser$Checks$DuplicateImportedVariable$constructorsAndValues = function (imp) {
	return _Utils_Tuple2(
		_List_Nil,
		function () {
			var _v0 = imp.exposingList;
			if (_v0.$ === 'Nothing') {
				return _List_Nil;
			} else {
				if (_v0.a.b.$ === 'All') {
					var _v1 = _v0.a;
					return _List_Nil;
				} else {
					var _v2 = _v0.a;
					var xs = _v2.b.a;
					return A2($elm$core$List$map, $author$project$Analyser$Checks$DuplicateImportedVariable$exposingValues, xs);
				}
			}
		}());
};
var $author$project$Analyser$Checks$DuplicateImportedVariable$mergeImportedValue = F2(
	function (l, entry) {
		var addPair = F2(
			function (_v0, d) {
				var v = _v0.a;
				var k = _v0.b;
				return A3(
					$elm$core$Dict$update,
					k,
					function (old) {
						return $elm$core$Maybe$Just(
							A2(
								$elm$core$Maybe$withDefault,
								_List_fromArray(
									[v]),
								A2(
									$elm$core$Maybe$map,
									$elm$core$List$cons(v),
									old)));
					},
					d);
			});
		return A3($elm$core$List$foldl, addPair, entry, l);
	});
var $author$project$Analyser$Checks$DuplicateImportedVariable$onImport = F2(
	function (_v0, context) {
		var imp = _v0.b;
		var _v1 = $author$project$Analyser$Checks$DuplicateImportedVariable$constructorsAndValues(imp);
		var cs = _v1.a;
		var vs = _v1.b;
		return _Utils_update(
			context,
			{
				constructors: A3(
					$elm$core$Dict$update,
					$stil4m$elm_syntax$Elm$Syntax$Node$value(imp.moduleName),
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Maybe$withDefault($elm$core$Dict$empty),
						A2(
							$elm$core$Basics$composeR,
							$author$project$Analyser$Checks$DuplicateImportedVariable$mergeImportedValue(cs),
							$elm$core$Maybe$Just)),
					context.constructors),
				functionOrValues: A3(
					$elm$core$Dict$update,
					$stil4m$elm_syntax$Elm$Syntax$Node$value(imp.moduleName),
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Maybe$withDefault($elm$core$Dict$empty),
						A2(
							$elm$core$Basics$composeR,
							$author$project$Analyser$Checks$DuplicateImportedVariable$mergeImportedValue(vs),
							$elm$core$Maybe$Just)),
					context.functionOrValues)
			});
	});
var $author$project$Analyser$Checks$DuplicateImportedVariable$scan = F2(
	function (fileContext, _v0) {
		var result = A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onFunction: $author$project$ASTUtil$Inspector$Skip,
					onImport: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$DuplicateImportedVariable$onImport)
				}),
			fileContext.ast,
			{constructors: $elm$core$Dict$empty, functionOrValues: $elm$core$Dict$empty});
		return A2(
			$elm$core$List$map,
			$author$project$Analyser$Checks$DuplicateImportedVariable$asMessageData,
			_Utils_ap(
				$author$project$Analyser$Checks$DuplicateImportedVariable$findViolations(result.functionOrValues),
				$author$project$Analyser$Checks$DuplicateImportedVariable$findViolations(result.constructors)));
	});
var $author$project$Analyser$Messages$Schema$VariableName = {$: 'VariableName'};
var $author$project$Analyser$Messages$Schema$varProp = F2(
	function (k, _v0) {
		var s = _v0.a;
		return $author$project$Analyser$Messages$Schema$Schema(
			A3($elm$core$Dict$insert, k, $author$project$Analyser$Messages$Schema$VariableName, s));
	});
var $author$project$Analyser$Checks$DuplicateImportedVariable$checker = {
	check: $author$project$Analyser$Checks$DuplicateImportedVariable$scan,
	info: {
		description: 'Importing a variable twice from the same module is noise. Remove this.',
		key: 'DuplicateImportedVariable',
		name: 'Duplicate Imported Variable',
		schema: A2(
			$author$project$Analyser$Messages$Schema$moduleProp,
			'moduleName',
			A2(
				$author$project$Analyser$Messages$Schema$varProp,
				'varName',
				A2($author$project$Analyser$Messages$Schema$rangeListProp, 'ranges', $author$project$Analyser$Messages$Schema$schema)))
	}
};
var $author$project$ASTUtil$Inspector$Inner = function (a) {
	return {$: 'Inner', a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Module$exposingList = function (m) {
	switch (m.$) {
		case 'NormalModule':
			var x = m.a;
			return $stil4m$elm_syntax$Elm$Syntax$Node$value(x.exposingList);
		case 'PortModule':
			var x = m.a;
			return $stil4m$elm_syntax$Elm$Syntax$Node$value(x.exposingList);
		default:
			var x = m.a;
			return $stil4m$elm_syntax$Elm$Syntax$Node$value(x.exposingList);
	}
};
var $author$project$Analyser$Checks$ExposeAll$onFile = F3(
	function (_v0, file, _v1) {
		var _v2 = $stil4m$elm_syntax$Elm$Syntax$Module$exposingList(
			$stil4m$elm_syntax$Elm$Syntax$Node$value(file.moduleDefinition));
		if (_v2.$ === 'All') {
			var x = _v2.a;
			var range = x;
			return _List_fromArray(
				[
					A3(
					$author$project$Analyser$Messages$Data$addRange,
					'range',
					range,
					$author$project$Analyser$Messages$Data$init(
						$elm$core$String$concat(
							_List_fromArray(
								[
									'Exposing all at ',
									$author$project$AST$Ranges$rangeToString(range)
								]))))
				]);
		} else {
			return _List_Nil;
		}
	});
var $author$project$Analyser$Checks$ExposeAll$scan = F2(
	function (fileContext, _v0) {
		return A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onFile: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$ExposeAll$onFile)
				}),
			fileContext.ast,
			_List_Nil);
	});
var $author$project$Analyser$Checks$ExposeAll$checker = {
	check: $author$project$Analyser$Checks$ExposeAll$scan,
	info: {
		description: 'You want to be clear about the API that a module defines.',
		key: 'ExposeAll',
		name: 'Expose All',
		schema: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $stil4m$elm_syntax$Elm$Syntax$Node$range = function (_v0) {
	var r = _v0.a;
	return r;
};
var $author$project$Analyser$Checks$FunctionInLet$asMessage = function (_v0) {
	var declaration = _v0.declaration;
	var range = $stil4m$elm_syntax$Elm$Syntax$Node$range(
		$stil4m$elm_syntax$Elm$Syntax$Node$value(declaration).name);
	return A3(
		$author$project$Analyser$Messages$Data$addRange,
		'range',
		range,
		$author$project$Analyser$Messages$Data$init(
			$elm$core$String$concat(
				_List_fromArray(
					[
						'Let statement containing functions should be avoided at ',
						$author$project$AST$Ranges$rangeToString(range)
					]))));
};
var $author$project$ASTUtil$Functions$isFunctionTypeAnnotation = function (typeAnnotation) {
	if (typeAnnotation.$ === 'FunctionTypeAnnotation') {
		return true;
	} else {
		return false;
	}
};
var $author$project$ASTUtil$Functions$isFunctionSignature = function (_v0) {
	var typeAnnotation = _v0.typeAnnotation;
	return $author$project$ASTUtil$Functions$isFunctionTypeAnnotation(
		$stil4m$elm_syntax$Elm$Syntax$Node$value(typeAnnotation));
};
var $elm$core$Basics$not = _Basics_not;
var $author$project$ASTUtil$Functions$isStatic = function (_function) {
	var decl = $stil4m$elm_syntax$Elm$Syntax$Node$value(_function.declaration);
	return ($elm$core$List$length(decl._arguments) > 0) ? false : A2(
		$elm$core$Maybe$withDefault,
		true,
		A2(
			$elm$core$Maybe$map,
			A2(
				$elm$core$Basics$composeR,
				$stil4m$elm_syntax$Elm$Syntax$Node$value,
				A2($elm$core$Basics$composeR, $author$project$ASTUtil$Functions$isFunctionSignature, $elm$core$Basics$not)),
			_function.signature));
};
var $author$project$Analyser$Checks$FunctionInLet$onFunction = F2(
	function (_v0, context) {
		var _function = _v0.b;
		var isStatic = $author$project$ASTUtil$Functions$isStatic(_function);
		return ((!isStatic) && context.inLetBlock) ? _Utils_update(
			context,
			{
				functions: A2($elm$core$List$cons, _function, context.functions)
			}) : context;
	});
var $author$project$Analyser$Checks$FunctionInLet$onLetBlock = F3(
	function (_continue, _v0, context) {
		return function (after) {
			return _Utils_update(
				after,
				{inLetBlock: context.inLetBlock});
		}(
			_continue(
				_Utils_update(
					context,
					{inLetBlock: true})));
	});
var $author$project$Analyser$Checks$FunctionInLet$startingContext = {functions: _List_Nil, inLetBlock: false};
var $author$project$Analyser$Checks$FunctionInLet$scan = F2(
	function (fileContext, _v0) {
		return A2(
			$elm$core$List$map,
			$author$project$Analyser$Checks$FunctionInLet$asMessage,
			A3(
				$author$project$ASTUtil$Inspector$inspect,
				_Utils_update(
					$author$project$ASTUtil$Inspector$defaultConfig,
					{
						onFunction: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$FunctionInLet$onFunction),
						onLetBlock: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$FunctionInLet$onLetBlock)
					}),
				fileContext.ast,
				$author$project$Analyser$Checks$FunctionInLet$startingContext).functions);
	});
var $author$project$Analyser$Checks$FunctionInLet$checker = {
	check: $author$project$Analyser$Checks$FunctionInLet$scan,
	info: {
		description: 'In a let statement you can define variables and functions in their own scope. But you are already in the scope of a module. Just define the functions you want on a top-level. There is no not much need to define functions in let statements.',
		key: 'FunctionInLet',
		name: 'Function In Let',
		schema: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$ImportAll$onImport = F2(
	function (_v0, context) {
		var imp = _v0.b;
		return function (a) {
			return A2($elm$core$List$append, a, context);
		}(
			function () {
				var _v1 = imp.exposingList;
				if (_v1.$ === 'Nothing') {
					return _List_Nil;
				} else {
					if (_v1.a.b.$ === 'All') {
						var _v2 = _v1.a;
						var range = _v2.b.a;
						var r = range;
						return _List_fromArray(
							[
								A3(
								$author$project$Analyser$Messages$Data$addModuleName,
								'moduleName',
								$stil4m$elm_syntax$Elm$Syntax$Node$value(imp.moduleName),
								A3(
									$author$project$Analyser$Messages$Data$addRange,
									'range',
									r,
									$author$project$Analyser$Messages$Data$init(
										$elm$core$String$concat(
											_List_fromArray(
												[
													'Importing all from module `',
													A2(
													$elm$core$String$join,
													'.',
													$stil4m$elm_syntax$Elm$Syntax$Node$value(imp.moduleName)),
													'` at ',
													$author$project$AST$Ranges$rangeToString(r)
												])))))
							]);
					} else {
						var _v3 = _v1.a;
						return _List_Nil;
					}
				}
			}());
	});
var $author$project$Analyser$Checks$ImportAll$scan = F2(
	function (fileContext, _v0) {
		return A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onImport: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$ImportAll$onImport)
				}),
			fileContext.ast,
			_List_Nil);
	});
var $author$project$Analyser$Checks$ImportAll$checker = {
	check: $author$project$Analyser$Checks$ImportAll$scan,
	info: {
		description: 'When other people read your code, it would be nice if the origin of a used function can be traced back to the providing module.',
		key: 'ImportAll',
		name: 'Import All',
		schema: A2(
			$author$project$Analyser$Messages$Schema$moduleProp,
			'moduleName',
			A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$Analyser$Checks$MapNothingToNothing$buildMessage = function (r) {
	return A3(
		$author$project$Analyser$Messages$Data$addRange,
		'range',
		r,
		$author$project$Analyser$Messages$Data$init(
			$elm$core$String$concat(
				_List_fromArray(
					[
						'`Nothing` mapped to `Nothing` in case expression, but instead you can use `Maybe.map` or `Maybe.andThen`. At ',
						$author$project$AST$Ranges$rangeToString(r)
					]))));
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$FunctionOrValue = F2(
	function (a, b) {
		return {$: 'FunctionOrValue', a: a, b: b};
	});
var $author$project$Analyser$Checks$MapNothingToNothing$isNothingExpression = function (expression) {
	return _Utils_eq(
		expression,
		A2($stil4m$elm_syntax$Elm$Syntax$Expression$FunctionOrValue, _List_Nil, 'Nothing'));
};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$NamedPattern = F2(
	function (a, b) {
		return {$: 'NamedPattern', a: a, b: b};
	});
var $author$project$Analyser$Checks$MapNothingToNothing$isNothingPattern = function (pattern) {
	return _Utils_eq(
		pattern,
		A2(
			$stil4m$elm_syntax$Elm$Syntax$Pattern$NamedPattern,
			{moduleName: _List_Nil, name: 'Nothing'},
			_List_Nil));
};
var $author$project$Analyser$Checks$MapNothingToNothing$onCase = F3(
	function (_v0, _v1, context) {
		var _v2 = _v1.a;
		var start = _v2.a.start;
		var pattern = _v2.b;
		var _v3 = _v1.b;
		var end = _v3.a.end;
		var expression = _v3.b;
		return ($author$project$Analyser$Checks$MapNothingToNothing$isNothingPattern(pattern) && $author$project$Analyser$Checks$MapNothingToNothing$isNothingExpression(expression)) ? A2(
			$elm$core$List$cons,
			$author$project$Analyser$Checks$MapNothingToNothing$buildMessage(
				{end: end, start: start}),
			context) : context;
	});
var $author$project$Analyser$Checks$MapNothingToNothing$scan = F2(
	function (fileContext, _v0) {
		return A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onCase: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$MapNothingToNothing$onCase)
				}),
			fileContext.ast,
			_List_Nil);
	});
var $author$project$Analyser$Checks$MapNothingToNothing$checker = {
	check: $author$project$Analyser$Checks$MapNothingToNothing$scan,
	info: {
		description: 'Do not map a `Nothing` to `Nothing` with a case expression. Use `andThen` or `map` instead.',
		key: 'MapNothingToNothing',
		name: 'Map Nothing To Nothing',
		schema: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$MultiLineRecordFormatting$buildMessageData = function (r) {
	return A3(
		$author$project$Analyser$Messages$Data$addRange,
		'range',
		r,
		$author$project$Analyser$Messages$Data$init(
			$elm$core$String$concat(
				_List_fromArray(
					[
						'Record should be formatted over multiple lines at ',
						$author$project$AST$Ranges$rangeToString(r)
					]))));
};
var $author$project$Analyser$Checks$MultiLineRecordFormatting$typeAnnotationRange = function (_v0) {
	var r = _v0.a;
	return r;
};
var $author$project$Analyser$Checks$MultiLineRecordFormatting$fieldsOnSameLine = function (_v0) {
	var left = _v0.a;
	var right = _v0.b;
	return _Utils_eq(
		$author$project$Analyser$Checks$MultiLineRecordFormatting$typeAnnotationRange(left.b).start.row,
		$author$project$Analyser$Checks$MultiLineRecordFormatting$typeAnnotationRange(right.b).start.row);
};
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $author$project$Analyser$Checks$MultiLineRecordFormatting$firstTwo = function (def) {
	if (def.b && def.b.b) {
		var _v1 = def.a;
		var x = _v1.b;
		var _v2 = def.b;
		var _v3 = _v2.a;
		var y = _v3.b;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(x, y));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Analyser$Checks$MultiLineRecordFormatting$findRecords = function (_v0) {
	var r = _v0.a;
	var x = _v0.b;
	switch (x.$) {
		case 'GenericType':
			return _List_Nil;
		case 'Typed':
			var args = x.b;
			return A2($elm$core$List$concatMap, $author$project$Analyser$Checks$MultiLineRecordFormatting$findRecords, args);
		case 'Unit':
			return _List_Nil;
		case 'Tupled':
			var inner = x.a;
			return A2($elm$core$List$concatMap, $author$project$Analyser$Checks$MultiLineRecordFormatting$findRecords, inner);
		case 'GenericRecord':
			var fields = x.b;
			return A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					r,
					$stil4m$elm_syntax$Elm$Syntax$Node$value(fields)),
				A2(
					$elm$core$List$concatMap,
					A2(
						$elm$core$Basics$composeR,
						$stil4m$elm_syntax$Elm$Syntax$Node$value,
						A2($elm$core$Basics$composeR, $elm$core$Tuple$second, $author$project$Analyser$Checks$MultiLineRecordFormatting$findRecords)),
					$stil4m$elm_syntax$Elm$Syntax$Node$value(fields)));
		case 'Record':
			var fields = x.a;
			return A2(
				$elm$core$List$cons,
				_Utils_Tuple2(r, fields),
				A2(
					$elm$core$List$concatMap,
					A2(
						$elm$core$Basics$composeR,
						$stil4m$elm_syntax$Elm$Syntax$Node$value,
						A2($elm$core$Basics$composeR, $elm$core$Tuple$second, $author$project$Analyser$Checks$MultiLineRecordFormatting$findRecords)),
					fields));
		default:
			var left = x.a;
			var right = x.b;
			return _Utils_ap(
				$author$project$Analyser$Checks$MultiLineRecordFormatting$findRecords(left),
				$author$project$Analyser$Checks$MultiLineRecordFormatting$findRecords(right));
	}
};
var $author$project$Analyser$Checks$MultiLineRecordFormatting$onTypeAlias = F2(
	function (_v0, context) {
		var x = _v0.b;
		return _Utils_ap(
			$author$project$Analyser$Checks$MultiLineRecordFormatting$findRecords(x.typeAnnotation),
			context);
	});
var $author$project$Analyser$Checks$MultiLineRecordFormatting$scan = F2(
	function (fileContext, _v0) {
		var threshold = 2;
		return A2(
			$elm$core$List$map,
			A2($elm$core$Basics$composeR, $elm$core$Tuple$first, $author$project$Analyser$Checks$MultiLineRecordFormatting$buildMessageData),
			A2(
				$elm$core$List$filter,
				A2($elm$core$Basics$composeR, $elm$core$Tuple$second, $author$project$Analyser$Checks$MultiLineRecordFormatting$fieldsOnSameLine),
				A2(
					$elm$core$List$filterMap,
					function (_v1) {
						var range = _v1.a;
						var fields = _v1.b;
						return A2(
							$elm$core$Maybe$map,
							function (b) {
								return _Utils_Tuple2(range, b);
							},
							$author$project$Analyser$Checks$MultiLineRecordFormatting$firstTwo(fields));
					},
					A2(
						$elm$core$List$filter,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Tuple$second,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$List$length,
								$elm$core$Basics$le(threshold))),
						A3(
							$author$project$ASTUtil$Inspector$inspect,
							_Utils_update(
								$author$project$ASTUtil$Inspector$defaultConfig,
								{
									onTypeAlias: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$MultiLineRecordFormatting$onTypeAlias)
								}),
							fileContext.ast,
							_List_Nil)))));
	});
var $author$project$Analyser$Checks$MultiLineRecordFormatting$checker = {
	check: $author$project$Analyser$Checks$MultiLineRecordFormatting$scan,
	info: {
		description: 'Records in type aliases should be formatted on multiple lines to help the reader.',
		key: 'MultiLineRecordFormatting',
		name: 'MultiLine Record Formatting',
		schema: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$NoTopLevelSignature$onFunction = F3(
	function (_v0, _v1, context) {
		var _function = _v1.b;
		var _v2 = _function.signature;
		if (_v2.$ === 'Nothing') {
			var declaration = $stil4m$elm_syntax$Elm$Syntax$Node$value(_function.declaration);
			var _v3 = declaration.name;
			var r = _v3.a;
			var declarationName = _v3.b;
			return A2(
				$elm$core$List$cons,
				A3(
					$author$project$Analyser$Messages$Data$addRange,
					'range',
					r,
					A3(
						$author$project$Analyser$Messages$Data$addVarName,
						'varName',
						declarationName,
						$author$project$Analyser$Messages$Data$init(
							$elm$core$String$concat(
								_List_fromArray(
									[
										'No signature for top level definition `',
										declarationName,
										'` at ',
										$author$project$AST$Ranges$rangeToString(r)
									]))))),
				context);
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$NoTopLevelSignature$scan = F2(
	function (fileContext, _v0) {
		return A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onDestructuring: $author$project$ASTUtil$Inspector$Skip,
					onFunction: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$NoTopLevelSignature$onFunction)
				}),
			fileContext.ast,
			_List_Nil);
	});
var $author$project$Analyser$Checks$NoTopLevelSignature$checker = {
	check: $author$project$Analyser$Checks$NoTopLevelSignature$scan,
	info: {
		description: 'We want our readers to understand our code. Adding a signature is part of this.',
		key: 'NoTopLevelSignature',
		name: 'No Top Level Signature',
		schema: A2(
			$author$project$Analyser$Messages$Schema$varProp,
			'varName',
			A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $elm$core$String$startsWith = _String_startsWith;
var $author$project$Analyser$Checks$NoUncurriedPrefix$onExpression = F2(
	function (_v0, context) {
		var expression = _v0.b;
		if ((((((expression.$ === 'Application') && expression.a.b) && (expression.a.a.b.$ === 'PrefixOperator')) && expression.a.b.b) && expression.a.b.b.b) && (!expression.a.b.b.b.b)) {
			var _v2 = expression.a;
			var _v3 = _v2.a;
			var opRange = _v3.a;
			var x = _v3.b.a;
			var _v4 = _v2.b;
			var _v5 = _v4.a;
			var argRange1 = _v5.a;
			var _v6 = _v4.b;
			var _v7 = _v6.a;
			var argRange2 = _v7.a;
			return A2($elm$core$String$startsWith, ',,', x) ? context : A2(
				$elm$core$List$cons,
				A3(
					$author$project$Analyser$Messages$Data$addRange,
					'arg2',
					argRange2,
					A3(
						$author$project$Analyser$Messages$Data$addRange,
						'arg1',
						argRange1,
						A3(
							$author$project$Analyser$Messages$Data$addRange,
							'range',
							opRange,
							A3(
								$author$project$Analyser$Messages$Data$addVarName,
								'varName',
								x,
								$author$project$Analyser$Messages$Data$init(
									$elm$core$String$concat(
										_List_fromArray(
											[
												'Prefix notation for `',
												x,
												'` is unneeded at ',
												$author$project$AST$Ranges$rangeToString(opRange)
											]))))))),
				context);
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$NoUncurriedPrefix$scan = F2(
	function (fileContext, _v0) {
		return A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onExpression: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$NoUncurriedPrefix$onExpression)
				}),
			fileContext.ast,
			_List_Nil);
	});
var $author$project$Analyser$Checks$NoUncurriedPrefix$checker = {
	check: $author$project$Analyser$Checks$NoUncurriedPrefix$scan,
	info: {
		description: 'It\'s not needed to use an operator in prefix notation when you apply both arguments directly.',
		key: 'NoUncurriedPrefix',
		name: 'Fully Applied Operator as Prefix',
		schema: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'arg2',
			A2(
				$author$project$Analyser$Messages$Schema$rangeProp,
				'arg1',
				A2(
					$author$project$Analyser$Messages$Schema$rangeProp,
					'range',
					A2($author$project$Analyser$Messages$Schema$varProp, 'varName', $author$project$Analyser$Messages$Schema$schema))))
	}
};
var $author$project$Analyser$Checks$SingleFieldRecord$isSingleFieldRecord = function (x) {
	return $elm$core$List$length(x) === 1;
};
var $author$project$Analyser$Checks$SingleFieldRecord$findPlainRecords = function (_v0) {
	var r = _v0.a;
	var x = _v0.b;
	if (x.$ === 'Record') {
		var fields = x.a;
		return _List_fromArray(
			[
				_Utils_Tuple2(r, fields)
			]);
	} else {
		return _List_Nil;
	}
};
var $author$project$Analyser$Checks$SingleFieldRecord$onTypeAnnotation = F2(
	function (x, context) {
		var t = x.b;
		var newWhitelisted = function () {
			if (t.$ === 'Typed') {
				var ws = t.b;
				return _Utils_ap(
					context.whitelisted,
					A2(
						$elm$core$List$map,
						$stil4m$elm_syntax$Elm$Syntax$Node$range,
						A2(
							$elm$core$List$filter,
							function (_v1) {
								var ta = _v1.b;
								if (ta.$ === 'Record') {
									return true;
								} else {
									return false;
								}
							},
							ws)));
			} else {
				return context.whitelisted;
			}
		}();
		return _Utils_update(
			context,
			{
				matches: _Utils_ap(
					$author$project$Analyser$Checks$SingleFieldRecord$findPlainRecords(x),
					context.matches),
				whitelisted: newWhitelisted
			});
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Analyser$Checks$SingleFieldRecord$realMatches = function (_v0) {
	var matches = _v0.matches;
	var whitelisted = _v0.whitelisted;
	return A2(
		$elm$core$List$filter,
		function (m) {
			return !A2($elm$core$List$member, m.a, whitelisted);
		},
		matches);
};
var $author$project$Analyser$Checks$SingleFieldRecord$scan = F2(
	function (fileContext, _v0) {
		return A2(
			$elm$core$List$map,
			function (r) {
				return A3(
					$author$project$Analyser$Messages$Data$addRange,
					'range',
					r,
					$author$project$Analyser$Messages$Data$init(
						$elm$core$String$concat(
							_List_fromArray(
								[
									'Record has only one field. Use the field\'s type or introduce a Type. At ',
									$author$project$AST$Ranges$rangeToString(r)
								]))));
			},
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2(
					$elm$core$List$filter,
					A2($elm$core$Basics$composeR, $elm$core$Tuple$second, $author$project$Analyser$Checks$SingleFieldRecord$isSingleFieldRecord),
					$author$project$Analyser$Checks$SingleFieldRecord$realMatches(
						A3(
							$author$project$ASTUtil$Inspector$inspect,
							_Utils_update(
								$author$project$ASTUtil$Inspector$defaultConfig,
								{
									onTypeAnnotation: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$SingleFieldRecord$onTypeAnnotation)
								}),
							fileContext.ast,
							{matches: _List_Nil, whitelisted: _List_Nil})))));
	});
var $author$project$Analyser$Checks$SingleFieldRecord$checker = {
	check: $author$project$Analyser$Checks$SingleFieldRecord$scan,
	info: {
		description: 'Using a record is obsolete if you only plan to store a single field in it.',
		key: 'SingleFieldRecord',
		name: 'Single Field Record',
		schema: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$TriggerWords$buildMessage = function (_v0) {
	var word = _v0.a;
	var range = _v0.b;
	return A3(
		$author$project$Analyser$Messages$Data$addRange,
		'range',
		range,
		A3(
			$author$project$Analyser$Messages$Data$addVarName,
			'word',
			word,
			$author$project$Analyser$Messages$Data$init(
				$elm$core$String$concat(
					_List_fromArray(
						[
							'`' + (word + '` should not be used in comments at '),
							$author$project$AST$Ranges$rangeToString(range)
						])))));
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $author$project$Analyser$Configuration$checkPropertyAs = F4(
	function (decoder, check, prop, _v0) {
		var raw = _v0.a.raw;
		return A2(
			$elm$core$Maybe$andThen,
			$elm$core$Basics$identity,
			$elm$core$Result$toMaybe(
				A2(
					$elm$json$Json$Decode$decodeString,
					$elm$json$Json$Decode$maybe(
						A2(
							$elm$json$Json$Decode$at,
							_List_fromArray(
								[check, prop]),
							decoder)),
					raw)));
	});
var $author$project$Analyser$Checks$TriggerWords$defaultTriggerWords = _List_fromArray(
	['TODO']);
var $elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm$core$String$toLower = _String_toLower;
var $author$project$Analyser$Checks$TriggerWords$normalizeWord = $elm$core$String$toLower;
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {index: index, match: match, number: number, submatches: submatches};
	});
var $elm$regex$Regex$split = _Regex_splitAtMost(_Regex_infinity);
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{caseInsensitive: false, multiline: false},
		string);
};
var $author$project$Analyser$Checks$TriggerWords$splitRegex = $elm$regex$Regex$fromString('[^\\w]+');
var $author$project$Analyser$Checks$TriggerWords$wordSplitter = A2(
	$elm$core$Maybe$withDefault,
	function (v) {
		return _List_fromArray(
			[v]);
	},
	A2($elm$core$Maybe$map, $elm$regex$Regex$split, $author$project$Analyser$Checks$TriggerWords$splitRegex));
var $author$project$Analyser$Checks$TriggerWords$withTriggerWord = F2(
	function (words, _v0) {
		var range = _v0.a;
		var commentText = _v0.b;
		var commentWords = $elm$core$Set$fromList(
			A2(
				$elm$core$List$map,
				$author$project$Analyser$Checks$TriggerWords$normalizeWord,
				$author$project$Analyser$Checks$TriggerWords$wordSplitter(commentText)));
		return A2(
			$elm$core$Maybe$map,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Tuple$first,
				function (a) {
					return _Utils_Tuple2(a, range);
				}),
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Tuple$second,
						function (a) {
							return A2($elm$core$Set$member, a, commentWords);
						}),
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(
								x,
								$author$project$Analyser$Checks$TriggerWords$normalizeWord(x));
						},
						words))));
	});
var $author$project$Analyser$Checks$TriggerWords$scan = F2(
	function (fileContext, configuration) {
		var triggerWords = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Analyser$Checks$TriggerWords$defaultTriggerWords,
			A4(
				$author$project$Analyser$Configuration$checkPropertyAs,
				$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
				'TriggerWords',
				'words',
				configuration));
		return A2(
			$elm$core$List$map,
			$author$project$Analyser$Checks$TriggerWords$buildMessage,
			A2(
				$elm$core$List$filterMap,
				$author$project$Analyser$Checks$TriggerWords$withTriggerWord(triggerWords),
				fileContext.ast.comments));
	});
var $author$project$Analyser$Checks$TriggerWords$checker = {
	check: $author$project$Analyser$Checks$TriggerWords$scan,
	info: {
		description: 'Comments can tell you what that you have to put your code a bit more attention. You should resolve things as \'TODO\' and such.',
		key: 'TriggerWords',
		name: 'Trigger Words',
		schema: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'range',
			A2($author$project$Analyser$Messages$Schema$varProp, 'word', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $author$project$Analyser$Checks$UnnecessaryListConcat$isListExpression = function (_v0) {
	var inner = _v0.b;
	if (inner.$ === 'ListExpr') {
		return true;
	} else {
		return false;
	}
};
var $author$project$Analyser$Checks$UnnecessaryListConcat$onExpression = F2(
	function (_v0, context) {
		var r = _v0.a;
		var inner = _v0.b;
		if ((((((((((inner.$ === 'Application') && inner.a.b) && (inner.a.a.b.$ === 'FunctionOrValue')) && inner.a.a.b.a.b) && (inner.a.a.b.a.a === 'List')) && (!inner.a.a.b.a.b.b)) && (inner.a.a.b.b === 'concat')) && inner.a.b.b) && (inner.a.b.a.b.$ === 'ListExpr')) && (!inner.a.b.b.b)) {
			var _v2 = inner.a;
			var _v3 = _v2.a;
			var _v4 = _v3.b;
			var _v5 = _v4.a;
			var _v6 = _v2.b;
			var _v7 = _v6.a;
			var args = _v7.b.a;
			if (A2($elm$core$List$all, $author$project$Analyser$Checks$UnnecessaryListConcat$isListExpression, args)) {
				var range = r;
				return A2(
					$elm$core$List$cons,
					A3(
						$author$project$Analyser$Messages$Data$addRange,
						'range',
						range,
						$author$project$Analyser$Messages$Data$init(
							$elm$core$String$concat(
								_List_fromArray(
									[
										'Better merge the arguments of `List.concat` to a single list at ',
										$author$project$AST$Ranges$rangeToString(range)
									])))),
					context);
			} else {
				return context;
			}
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$UnnecessaryListConcat$scan = F2(
	function (fileContext, _v0) {
		return A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onExpression: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnnecessaryListConcat$onExpression)
				}),
			fileContext.ast,
			_List_Nil);
	});
var $author$project$Analyser$Checks$UnnecessaryListConcat$checker = {
	check: $author$project$Analyser$Checks$UnnecessaryListConcat$scan,
	info: {
		description: 'You should not use \'List.concat\' to concatenate literal lists. Just join the lists together.',
		key: 'UnnecessaryListConcat',
		name: 'Unnecessary List Concat',
		schema: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$UnnecessaryLiteralBools$onExpression = F2(
	function (_v0, context) {
		var r = _v0.a;
		var inner = _v0.b;
		var withMsg = function (msg) {
			return A2(
				$elm$core$List$cons,
				A3(
					$author$project$Analyser$Messages$Data$addRange,
					'range',
					r,
					$author$project$Analyser$Messages$Data$init(
						$elm$core$String$concat(
							_List_fromArray(
								[
									msg,
									' ',
									$author$project$AST$Ranges$rangeToString(r)
								])))),
				context);
		};
		if (((inner.$ === 'IfBlock') && (inner.b.b.$ === 'FunctionOrValue')) && (inner.c.b.$ === 'FunctionOrValue')) {
			var _v2 = inner.a;
			var _v3 = inner.b;
			var _v4 = _v3.b;
			var trueVal = _v4.b;
			var _v5 = inner.c;
			var _v6 = _v5.b;
			var falseVal = _v6.b;
			var _v7 = _Utils_Tuple2(trueVal, falseVal);
			_v7$4:
			while (true) {
				switch (_v7.a) {
					case 'True':
						switch (_v7.b) {
							case 'True':
								return withMsg('Replace if-block with True');
							case 'False':
								return withMsg('Replace if-block with just the if-condition');
							default:
								break _v7$4;
						}
					case 'False':
						switch (_v7.b) {
							case 'True':
								return withMsg('Replace if-block with just the negation of the if-condition');
							case 'False':
								return withMsg('Replace if-block with False');
							default:
								break _v7$4;
						}
					default:
						break _v7$4;
				}
			}
			return context;
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$UnnecessaryLiteralBools$scan = F2(
	function (fileContext, _v0) {
		return A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onExpression: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnnecessaryLiteralBools$onExpression)
				}),
			fileContext.ast,
			_List_Nil);
	});
var $author$project$Analyser$Checks$UnnecessaryLiteralBools$checker = {
	check: $author$project$Analyser$Checks$UnnecessaryLiteralBools$scan,
	info: {
		description: 'Directly use the boolean you already have.',
		key: 'UnnecessaryLiteralBools',
		name: 'Unnecessary Literal Booleans',
		schema: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$UnnecessaryParens$buildMessage = function (r) {
	return A3(
		$author$project$Analyser$Messages$Data$addRange,
		'range',
		r,
		$author$project$Analyser$Messages$Data$init(
			$elm$core$String$concat(
				_List_fromArray(
					[
						'Unnecessary parens at ',
						$author$project$AST$Ranges$rangeToString(r)
					]))));
};
var $elm_community$maybe_extra$Maybe$Extra$filter = F2(
	function (f, m) {
		var _v0 = A2($elm$core$Maybe$map, f, m);
		if ((_v0.$ === 'Just') && _v0.a) {
			return m;
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Analyser$Checks$UnnecessaryParens$getParenthesized = function (_v0) {
	var r = _v0.a;
	var e = _v0.b;
	if (e.$ === 'ParenthesizedExpression') {
		var p = e.a;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(r, p));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$isCase = function (e) {
	if (e.$ === 'CaseExpression') {
		return true;
	} else {
		return false;
	}
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$isLambda = function (e) {
	if (e.$ === 'LambdaExpression') {
		return true;
	} else {
		return false;
	}
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$isOperatorApplication = function (e) {
	if (e.$ === 'OperatorApplication') {
		return true;
	} else {
		return false;
	}
};
var $author$project$Analyser$Checks$UnnecessaryParens$onApplication = F2(
	function (parts, context) {
		return A2(
			$elm$core$Maybe$withDefault,
			context,
			A2(
				$elm$core$Maybe$map,
				function (a) {
					return A2($elm$core$List$cons, a, context);
				},
				A2(
					$elm$core$Maybe$map,
					$elm$core$Tuple$first,
					A2(
						$elm_community$maybe_extra$Maybe$Extra$filter,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Tuple$second,
							A2(
								$elm$core$Basics$composeR,
								$stil4m$elm_syntax$Elm$Syntax$Node$value,
								A2($elm$core$Basics$composeR, $stil4m$elm_syntax$Elm$Syntax$Expression$isLambda, $elm$core$Basics$not))),
						A2(
							$elm_community$maybe_extra$Maybe$Extra$filter,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Tuple$second,
								A2(
									$elm$core$Basics$composeR,
									$stil4m$elm_syntax$Elm$Syntax$Node$value,
									A2($elm$core$Basics$composeR, $stil4m$elm_syntax$Elm$Syntax$Expression$isCase, $elm$core$Basics$not))),
							A2(
								$elm_community$maybe_extra$Maybe$Extra$filter,
								A2(
									$elm$core$Basics$composeR,
									$elm$core$Tuple$second,
									A2(
										$elm$core$Basics$composeR,
										$stil4m$elm_syntax$Elm$Syntax$Node$value,
										A2($elm$core$Basics$composeR, $stil4m$elm_syntax$Elm$Syntax$Expression$isOperatorApplication, $elm$core$Basics$not))),
								A2(
									$elm$core$Maybe$andThen,
									$author$project$Analyser$Checks$UnnecessaryParens$getParenthesized,
									$elm$core$List$head(parts))))))));
	});
var $author$project$Analyser$Checks$UnnecessaryParens$onCaseBlock = F2(
	function (caseBlock, context) {
		var _v0 = $author$project$Analyser$Checks$UnnecessaryParens$getParenthesized(caseBlock.expression);
		if (_v0.$ === 'Just') {
			var _v1 = _v0.a;
			var range = _v1.a;
			return A2($elm$core$List$cons, range, context);
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$UnnecessaryParens$onIfBlock = F4(
	function (clause, thenBranch, elseBranch, context) {
		return function (a) {
			return _Utils_ap(a, context);
		}(
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2(
					$elm$core$List$filterMap,
					$author$project$Analyser$Checks$UnnecessaryParens$getParenthesized,
					_List_fromArray(
						[clause, thenBranch, elseBranch]))));
	});
var $author$project$Analyser$Checks$UnnecessaryParens$onListExpr = F2(
	function (exprs, context) {
		return function (a) {
			return _Utils_ap(a, context);
		}(
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filterMap, $author$project$Analyser$Checks$UnnecessaryParens$getParenthesized, exprs)));
	});
var $stil4m$elm_syntax$Elm$Syntax$Expression$isIfElse = function (e) {
	if (e.$ === 'IfBlock') {
		return true;
	} else {
		return false;
	}
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$isLet = function (e) {
	if (e.$ === 'LetExpression') {
		return true;
	} else {
		return false;
	}
};
var $author$project$Analyser$Checks$UnnecessaryParens$operatorHandSideAllowedParens = function (_v0) {
	var expr = _v0.b;
	return A2(
		$elm$core$List$any,
		$elm$core$Basics$apR(expr),
		_List_fromArray(
			[$stil4m$elm_syntax$Elm$Syntax$Expression$isOperatorApplication, $stil4m$elm_syntax$Elm$Syntax$Expression$isIfElse, $stil4m$elm_syntax$Elm$Syntax$Expression$isCase, $stil4m$elm_syntax$Elm$Syntax$Expression$isLet, $stil4m$elm_syntax$Elm$Syntax$Expression$isLambda]));
};
var $author$project$Analyser$Checks$UnnecessaryParens$onOperatorApplication = F3(
	function (left, right, context) {
		var fixHandSide = A2(
			$elm$core$Basics$composeR,
			$author$project$Analyser$Checks$UnnecessaryParens$getParenthesized,
			A2(
				$elm$core$Basics$composeR,
				$elm_community$maybe_extra$Maybe$Extra$filter(
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Tuple$second,
						A2($elm$core$Basics$composeR, $author$project$Analyser$Checks$UnnecessaryParens$operatorHandSideAllowedParens, $elm$core$Basics$not))),
				$elm$core$Maybe$map($elm$core$Tuple$first)));
		return function (a) {
			return _Utils_ap(a, context);
		}(
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						fixHandSide(left),
						fixHandSide(right)
					])));
	});
var $author$project$Analyser$Checks$UnnecessaryParens$onParenthesizedExpression = F3(
	function (range, _v0, context) {
		var expression = _v0.b;
		switch (expression.$) {
			case 'RecordAccess':
				return A2($elm$core$List$cons, range, context);
			case 'RecordAccessFunction':
				return A2($elm$core$List$cons, range, context);
			case 'RecordUpdateExpression':
				return A2($elm$core$List$cons, range, context);
			case 'RecordExpr':
				return A2($elm$core$List$cons, range, context);
			case 'TupledExpression':
				return A2($elm$core$List$cons, range, context);
			case 'ListExpr':
				return A2($elm$core$List$cons, range, context);
			case 'FunctionOrValue':
				return A2($elm$core$List$cons, range, context);
			case 'Integer':
				return A2($elm$core$List$cons, range, context);
			case 'Floatable':
				return A2($elm$core$List$cons, range, context);
			case 'CharLiteral':
				return A2($elm$core$List$cons, range, context);
			case 'Literal':
				return A2($elm$core$List$cons, range, context);
			default:
				return context;
		}
	});
var $author$project$Analyser$Checks$UnnecessaryParens$onRecord = F2(
	function (setters, context) {
		return function (a) {
			return _Utils_ap(a, context);
		}(
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2(
					$elm$core$List$filterMap,
					A2(
						$elm$core$Basics$composeR,
						$stil4m$elm_syntax$Elm$Syntax$Node$value,
						A2($elm$core$Basics$composeR, $elm$core$Tuple$second, $author$project$Analyser$Checks$UnnecessaryParens$getParenthesized)),
					setters)));
	});
var $author$project$Analyser$Checks$UnnecessaryParens$onTuple = F2(
	function (exprs, context) {
		return function (a) {
			return _Utils_ap(a, context);
		}(
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filterMap, $author$project$Analyser$Checks$UnnecessaryParens$getParenthesized, exprs)));
	});
var $author$project$Analyser$Checks$UnnecessaryParens$onExpression = F2(
	function (_v0, context) {
		var range = _v0.a;
		var expression = _v0.b;
		switch (expression.$) {
			case 'ParenthesizedExpression':
				var inner = expression.a;
				return A3($author$project$Analyser$Checks$UnnecessaryParens$onParenthesizedExpression, range, inner, context);
			case 'OperatorApplication':
				var left = expression.c;
				var right = expression.d;
				return A3($author$project$Analyser$Checks$UnnecessaryParens$onOperatorApplication, left, right, context);
			case 'Application':
				var parts = expression.a;
				return A2($author$project$Analyser$Checks$UnnecessaryParens$onApplication, parts, context);
			case 'IfBlock':
				var a = expression.a;
				var b = expression.b;
				var c = expression.c;
				return A4($author$project$Analyser$Checks$UnnecessaryParens$onIfBlock, a, b, c, context);
			case 'CaseExpression':
				var caseBlock = expression.a;
				return A2($author$project$Analyser$Checks$UnnecessaryParens$onCaseBlock, caseBlock, context);
			case 'RecordExpr':
				var parts = expression.a;
				return A2($author$project$Analyser$Checks$UnnecessaryParens$onRecord, parts, context);
			case 'RecordUpdateExpression':
				var updates = expression.b;
				return A2($author$project$Analyser$Checks$UnnecessaryParens$onRecord, updates, context);
			case 'TupledExpression':
				var x = expression.a;
				return A2($author$project$Analyser$Checks$UnnecessaryParens$onTuple, x, context);
			case 'ListExpr':
				var x = expression.a;
				return A2($author$project$Analyser$Checks$UnnecessaryParens$onListExpr, x, context);
			default:
				return context;
		}
	});
var $author$project$Analyser$Checks$UnnecessaryParens$onFunction = F2(
	function (_v0, context) {
		var _function = _v0.b;
		var _v1 = $stil4m$elm_syntax$Elm$Syntax$Node$value(_function.declaration).expression;
		if (_v1.b.$ === 'ParenthesizedExpression') {
			var range = _v1.a;
			return A2($elm$core$List$cons, range, context);
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$UnnecessaryParens$onLambda = F2(
	function (lambda, context) {
		var _v0 = lambda.expression;
		if (_v0.b.$ === 'ParenthesizedExpression') {
			var range = _v0.a;
			return A2($elm$core$List$cons, range, context);
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$UnnecessaryParens$rangeToString = function (range) {
	return A2(
		$elm$core$String$join,
		'|',
		_List_fromArray(
			[
				$elm$core$String$fromInt(range.start.row),
				$elm$core$String$fromInt(range.start.column),
				$elm$core$String$fromInt(range.end.row),
				$elm$core$String$fromInt(range.end.column)
			]));
};
var $elm_community$list_extra$List$Extra$uniqueHelp = F4(
	function (f, existing, remaining, accumulator) {
		uniqueHelp:
		while (true) {
			if (!remaining.b) {
				return $elm$core$List$reverse(accumulator);
			} else {
				var first = remaining.a;
				var rest = remaining.b;
				var computedFirst = f(first);
				if (A2($elm$core$Set$member, computedFirst, existing)) {
					var $temp$f = f,
						$temp$existing = existing,
						$temp$remaining = rest,
						$temp$accumulator = accumulator;
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				} else {
					var $temp$f = f,
						$temp$existing = A2($elm$core$Set$insert, computedFirst, existing),
						$temp$remaining = rest,
						$temp$accumulator = A2($elm$core$List$cons, first, accumulator);
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$uniqueBy = F2(
	function (f, list) {
		return A4($elm_community$list_extra$List$Extra$uniqueHelp, f, $elm$core$Set$empty, list, _List_Nil);
	});
var $author$project$Analyser$Checks$UnnecessaryParens$scan = F2(
	function (fileContext, _v0) {
		var x = A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onExpression: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnnecessaryParens$onExpression),
					onFunction: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnnecessaryParens$onFunction),
					onLambda: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnnecessaryParens$onLambda)
				}),
			fileContext.ast,
			_List_Nil);
		return A2(
			$elm$core$List$map,
			$author$project$Analyser$Checks$UnnecessaryParens$buildMessage,
			A2($elm_community$list_extra$List$Extra$uniqueBy, $author$project$Analyser$Checks$UnnecessaryParens$rangeToString, x));
	});
var $author$project$Analyser$Checks$UnnecessaryParens$checker = {
	check: $author$project$Analyser$Checks$UnnecessaryParens$scan,
	info: {
		description: 'If you want parenthesis, then you might want to look into Lisp.',
		key: 'UnnecessaryParens',
		name: 'Unnecessary Parens',
		schema: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $stil4m$elm_syntax$Elm$Syntax$Module$isPortModule = function (m) {
	if (m.$ === 'PortModule') {
		return true;
	} else {
		return false;
	}
};
var $author$project$Analyser$Checks$UnnecessaryPortModule$onPortDeclaration = F2(
	function (_v0, x) {
		return x + 1;
	});
var $author$project$Analyser$Checks$UnnecessaryPortModule$scan = F2(
	function (fileContext, _v0) {
		if ($stil4m$elm_syntax$Elm$Syntax$Module$isPortModule(
			$stil4m$elm_syntax$Elm$Syntax$Node$value(fileContext.ast.moduleDefinition))) {
			var portDeclCount = A3(
				$author$project$ASTUtil$Inspector$inspect,
				_Utils_update(
					$author$project$ASTUtil$Inspector$defaultConfig,
					{
						onPortDeclaration: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnnecessaryPortModule$onPortDeclaration)
					}),
				fileContext.ast,
				0);
			return (!portDeclCount) ? _List_fromArray(
				[
					$author$project$Analyser$Messages$Data$init('Module defined a `port` module, but is does not declare ports. It may be better to remove these.')
				]) : _List_Nil;
		} else {
			return _List_Nil;
		}
	});
var $author$project$Analyser$Checks$UnnecessaryPortModule$checker = {
	check: $author$project$Analyser$Checks$UnnecessaryPortModule$scan,
	info: {description: 'Dont use the port keyword if you do not need it.', key: 'UnnecessaryPortModule', name: 'Unnecessary Port Module', schema: $author$project$Analyser$Messages$Schema$schema}
};
var $author$project$Analyser$Checks$UnusedImport$buildMessage = function (_v0) {
	var moduleName = _v0.a;
	var range = _v0.b;
	return A3(
		$author$project$Analyser$Messages$Data$addModuleName,
		'moduleName',
		moduleName,
		A3(
			$author$project$Analyser$Messages$Data$addRange,
			'range',
			range,
			$author$project$Analyser$Messages$Data$init(
				$elm$core$String$concat(
					_List_fromArray(
						[
							'Unused import `',
							A2($elm$core$String$join, '.', moduleName),
							'` at ',
							$author$project$AST$Ranges$rangeToString(range)
						])))));
};
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $author$project$Analyser$Checks$UnusedImport$markUsage = F2(
	function (key, context) {
		return A3(
			$elm$core$Dict$update,
			key,
			$elm$core$Maybe$map(
				$elm$core$Tuple$mapSecond(
					$elm$core$Basics$add(1))),
			context);
	});
var $stil4m$elm_syntax$Elm$Syntax$Pattern$moduleNames = function (p) {
	var recur = A2($elm$core$Basics$composeR, $stil4m$elm_syntax$Elm$Syntax$Node$value, $stil4m$elm_syntax$Elm$Syntax$Pattern$moduleNames);
	switch (p.$) {
		case 'TuplePattern':
			var xs = p.a;
			return A2($elm$core$List$concatMap, recur, xs);
		case 'RecordPattern':
			return _List_Nil;
		case 'UnConsPattern':
			var left = p.a;
			var right = p.b;
			return _Utils_ap(
				recur(left),
				recur(right));
		case 'ListPattern':
			var xs = p.a;
			return A2($elm$core$List$concatMap, recur, xs);
		case 'NamedPattern':
			var qualifiedNameRef = p.a;
			var subPatterns = p.b;
			return A2(
				$elm$core$List$cons,
				qualifiedNameRef.moduleName,
				A2($elm$core$List$concatMap, recur, subPatterns));
		case 'AsPattern':
			var inner = p.a;
			return recur(inner);
		case 'ParenthesizedPattern':
			var inner = p.a;
			return recur(inner);
		default:
			return _List_Nil;
	}
};
var $author$project$Analyser$Checks$UnusedImport$onCase = F2(
	function (_v0, context) {
		var _v1 = _v0.a;
		var pattern = _v1.b;
		return A3(
			$elm$core$List$foldl,
			$author$project$Analyser$Checks$UnusedImport$markUsage,
			context,
			$stil4m$elm_syntax$Elm$Syntax$Pattern$moduleNames(pattern));
	});
var $author$project$Analyser$Checks$UnusedImport$onExpression = F2(
	function (expr, context) {
		var _v0 = $stil4m$elm_syntax$Elm$Syntax$Node$value(expr);
		if (_v0.$ === 'FunctionOrValue') {
			var moduleName = _v0.a;
			return A2($author$project$Analyser$Checks$UnusedImport$markUsage, moduleName, context);
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$UnusedImport$onImport = F2(
	function (_v0, context) {
		var range = _v0.a;
		var imp = _v0.b;
		return (_Utils_eq(imp.moduleAlias, $elm$core$Maybe$Nothing) && _Utils_eq(imp.exposingList, $elm$core$Maybe$Nothing)) ? A3(
			$elm$core$Dict$insert,
			$stil4m$elm_syntax$Elm$Syntax$Node$value(imp.moduleName),
			_Utils_Tuple2(range, 0),
			context) : context;
	});
var $author$project$Analyser$Checks$UnusedImport$onTypeAnnotation = F2(
	function (_v0, context) {
		var typeAnnotation = _v0.b;
		if (typeAnnotation.$ === 'Typed') {
			var _v2 = typeAnnotation.a;
			var _v3 = _v2.b;
			var moduleName = _v3.a;
			return A2($author$project$Analyser$Checks$UnusedImport$markUsage, moduleName, context);
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$UnusedImport$scan = F2(
	function (fileContext, _v0) {
		var aliases = A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onImport: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImport$onImport)
				}),
			fileContext.ast,
			$elm$core$Dict$empty);
		return A2(
			$elm$core$List$map,
			$author$project$Analyser$Checks$UnusedImport$buildMessage,
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$mapSecond($elm$core$Tuple$first),
				A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Tuple$second,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Tuple$second,
							$elm$core$Basics$eq(0))),
					$elm$core$Dict$toList(
						A3(
							$author$project$ASTUtil$Inspector$inspect,
							_Utils_update(
								$author$project$ASTUtil$Inspector$defaultConfig,
								{
									onCase: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImport$onCase),
									onExpression: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImport$onExpression),
									onTypeAnnotation: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImport$onTypeAnnotation)
								}),
							fileContext.ast,
							aliases)))));
	});
var $author$project$Analyser$Checks$UnusedImport$checker = {
	check: $author$project$Analyser$Checks$UnusedImport$scan,
	info: {
		description: 'Imports that have no meaning should be removed.',
		key: 'UnusedImport',
		name: 'Unused Import',
		schema: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'range',
			A2($author$project$Analyser$Messages$Schema$moduleProp, 'moduleName', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$Analyser$Checks$UnusedImportAlias$buildMessageData = function (_v0) {
	var moduleName = _v0.a;
	var range = _v0.b;
	return A3(
		$author$project$Analyser$Messages$Data$addRange,
		'range',
		range,
		A3(
			$author$project$Analyser$Messages$Data$addModuleName,
			'moduleName',
			moduleName,
			$author$project$Analyser$Messages$Data$init(
				$elm$core$String$concat(
					_List_fromArray(
						[
							'Unused import alias `',
							A2($elm$core$String$join, '.', moduleName),
							'` at ',
							$author$project$AST$Ranges$rangeToString(range)
						])))));
};
var $author$project$Analyser$Checks$UnusedImportAlias$markUsage = F2(
	function (key, context) {
		return A3(
			$elm$core$Dict$update,
			key,
			$elm$core$Maybe$map(
				$elm$core$Tuple$mapSecond(
					$elm$core$Basics$add(1))),
			context);
	});
var $author$project$Analyser$Checks$UnusedImportAlias$onCase = F2(
	function (_v0, context) {
		var _v1 = _v0.a;
		var pattern = _v1.b;
		return A3(
			$elm$core$List$foldl,
			$author$project$Analyser$Checks$UnusedImportAlias$markUsage,
			context,
			$stil4m$elm_syntax$Elm$Syntax$Pattern$moduleNames(pattern));
	});
var $author$project$Analyser$Checks$UnusedImportAlias$onExpression = F2(
	function (expr, context) {
		var _v0 = $stil4m$elm_syntax$Elm$Syntax$Node$value(expr);
		if (_v0.$ === 'FunctionOrValue') {
			var moduleName = _v0.a;
			return A2($author$project$Analyser$Checks$UnusedImportAlias$markUsage, moduleName, context);
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$UnusedImportAlias$onImport = F2(
	function (_v0, context) {
		var r = _v0.a;
		var imp = _v0.b;
		var _v1 = A2($elm$core$Maybe$map, $stil4m$elm_syntax$Elm$Syntax$Node$value, imp.moduleAlias);
		if (_v1.$ === 'Just') {
			var x = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				x,
				_Utils_Tuple2(r, 0),
				context);
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$UnusedImportAlias$onTypeAnnotation = F2(
	function (_v0, context) {
		var typeAnnotation = _v0.b;
		if (typeAnnotation.$ === 'Typed') {
			var _v2 = typeAnnotation.a;
			var _v3 = _v2.b;
			var moduleName = _v3.a;
			return A2($author$project$Analyser$Checks$UnusedImportAlias$markUsage, moduleName, context);
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$UnusedImportAlias$scan = F2(
	function (fileContext, _v0) {
		var aliases = A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onImport: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImportAlias$onImport)
				}),
			fileContext.ast,
			$elm$core$Dict$empty);
		return A2(
			$elm$core$List$map,
			$author$project$Analyser$Checks$UnusedImportAlias$buildMessageData,
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$mapSecond($elm$core$Tuple$first),
				A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Tuple$second,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Tuple$second,
							$elm$core$Basics$eq(0))),
					$elm$core$Dict$toList(
						A3(
							$author$project$ASTUtil$Inspector$inspect,
							_Utils_update(
								$author$project$ASTUtil$Inspector$defaultConfig,
								{
									onCase: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImportAlias$onCase),
									onExpression: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImportAlias$onExpression),
									onTypeAnnotation: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImportAlias$onTypeAnnotation)
								}),
							fileContext.ast,
							aliases)))));
	});
var $author$project$Analyser$Checks$UnusedImportAlias$checker = {
	check: $author$project$Analyser$Checks$UnusedImportAlias$scan,
	info: {
		description: 'You defined an alias for an import (import Foo as F), but it turns out you never use it.',
		key: 'UnusedImportAlias',
		name: 'Unused Import Alias',
		schema: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'range',
			A2($author$project$Analyser$Messages$Schema$moduleProp, 'moduleName', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$ASTUtil$Inspector$Pre = function (a) {
	return {$: 'Pre', a: a};
};
var $author$project$Analyser$Checks$Variables$UsedVariableContext = function (a) {
	return {$: 'UsedVariableContext', a: a};
};
var $author$project$Analyser$Checks$Variables$emptyContext = {activeScopes: _List_Nil, poppedScopes: _List_Nil};
var $author$project$Tuple$Extra$mapFirst3 = F2(
	function (f, _v0) {
		var a = _v0.a;
		var b = _v0.b;
		var c = _v0.c;
		return _Utils_Tuple3(
			f(a),
			b,
			c);
	});
var $author$project$Analyser$Checks$Variables$flagVariable = F2(
	function (k, l) {
		if (!l.b) {
			return _List_Nil;
		} else {
			var _v1 = l.a;
			var masked = _v1.a;
			var x = _v1.b;
			var xs = l.b;
			return A2($elm$core$List$member, k, masked) ? A2(
				$elm$core$List$cons,
				_Utils_Tuple2(masked, x),
				xs) : (A2($elm$core$Dict$member, k, x) ? A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					masked,
					A3(
						$elm$core$Dict$update,
						k,
						$elm$core$Maybe$map(
							$author$project$Tuple$Extra$mapFirst3(
								$elm$core$Basics$add(1))),
						x)),
				xs) : A2(
				$elm$core$List$cons,
				_Utils_Tuple2(masked, x),
				A2($author$project$Analyser$Checks$Variables$flagVariable, k, xs)));
		}
	});
var $author$project$Analyser$Checks$Variables$addUsedVariable = F2(
	function (x, context) {
		return _Utils_update(
			context,
			{
				activeScopes: A2($author$project$Analyser$Checks$Variables$flagVariable, x, context.activeScopes)
			});
	});
var $author$project$ASTUtil$Variables$qualifiedNameUsedVars = F2(
	function (_v0, range) {
		var moduleName = _v0.moduleName;
		var name = _v0.name;
		return _Utils_eq(moduleName, _List_Nil) ? _List_fromArray(
			[
				A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, range, name)
			]) : _List_Nil;
	});
var $author$project$ASTUtil$Variables$patternToUsedVars = function (_v0) {
	patternToUsedVars:
	while (true) {
		var range = _v0.a;
		var p = _v0.b;
		switch (p.$) {
			case 'TuplePattern':
				var t = p.a;
				return A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToUsedVars, t);
			case 'UnConsPattern':
				var l = p.a;
				var r = p.b;
				return _Utils_ap(
					$author$project$ASTUtil$Variables$patternToUsedVars(l),
					$author$project$ASTUtil$Variables$patternToUsedVars(r));
			case 'ListPattern':
				var l = p.a;
				return A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToUsedVars, l);
			case 'NamedPattern':
				var qualifiedNameRef = p.a;
				var args = p.b;
				return _Utils_ap(
					A2($author$project$ASTUtil$Variables$qualifiedNameUsedVars, qualifiedNameRef, range),
					A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToUsedVars, args));
			case 'AsPattern':
				var sub = p.a;
				var $temp$_v0 = sub;
				_v0 = $temp$_v0;
				continue patternToUsedVars;
			case 'ParenthesizedPattern':
				var sub = p.a;
				var $temp$_v0 = sub;
				_v0 = $temp$_v0;
				continue patternToUsedVars;
			case 'RecordPattern':
				return _List_Nil;
			case 'VarPattern':
				return _List_Nil;
			case 'AllPattern':
				return _List_Nil;
			case 'UnitPattern':
				return _List_Nil;
			case 'CharPattern':
				return _List_Nil;
			case 'StringPattern':
				return _List_Nil;
			case 'IntPattern':
				return _List_Nil;
			case 'HexPattern':
				return _List_Nil;
			default:
				return _List_Nil;
		}
	}
};
var $author$project$ASTUtil$Variables$Defined = {$: 'Defined'};
var $author$project$ASTUtil$Variables$Pattern = {$: 'Pattern'};
var $author$project$ASTUtil$Variables$patternToVarsInner = F2(
	function (isFirst, _v0) {
		var range = _v0.a;
		var p = _v0.b;
		var recur = $author$project$ASTUtil$Variables$patternToVarsInner(false);
		switch (p.$) {
			case 'TuplePattern':
				var t = p.a;
				return A2($elm$core$List$concatMap, recur, t);
			case 'RecordPattern':
				var r = p.a;
				return A2(
					$elm$core$List$map,
					function (a) {
						return _Utils_Tuple2(a, $author$project$ASTUtil$Variables$Pattern);
					},
					r);
			case 'UnConsPattern':
				var l = p.a;
				var r = p.b;
				return _Utils_ap(
					recur(l),
					recur(r));
			case 'ListPattern':
				var l = p.a;
				return A2($elm$core$List$concatMap, recur, l);
			case 'VarPattern':
				var x = p.a;
				return _List_fromArray(
					[
						_Utils_Tuple2(
						A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, range, x),
						isFirst ? $author$project$ASTUtil$Variables$Defined : $author$project$ASTUtil$Variables$Pattern)
					]);
			case 'NamedPattern':
				var args = p.b;
				return A2($elm$core$List$concatMap, recur, args);
			case 'AsPattern':
				var sub = p.a;
				var name = p.b;
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(name, $author$project$ASTUtil$Variables$Pattern),
					recur(sub));
			case 'ParenthesizedPattern':
				var sub = p.a;
				return recur(sub);
			case 'AllPattern':
				return _List_Nil;
			case 'UnitPattern':
				return _List_Nil;
			case 'CharPattern':
				return _List_Nil;
			case 'StringPattern':
				return _List_Nil;
			case 'IntPattern':
				return _List_Nil;
			case 'HexPattern':
				return _List_Nil;
			default:
				return _List_Nil;
		}
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === 'RBEmpty_elm_builtin') {
		return true;
	} else {
		return false;
	}
};
var $author$project$Analyser$Checks$Variables$popScope = function (x) {
	return _Utils_update(
		x,
		{
			activeScopes: A2($elm$core$List$drop, 1, x.activeScopes),
			poppedScopes: A2(
				$elm$core$Maybe$withDefault,
				x.poppedScopes,
				A2(
					$elm$core$Maybe$map,
					function (_v0) {
						var activeScope = _v0.b;
						return $elm$core$Dict$isEmpty(activeScope) ? x.poppedScopes : A2($elm$core$List$cons, activeScope, x.poppedScopes);
					},
					$elm$core$List$head(x.activeScopes)))
		});
};
var $author$project$Analyser$Checks$Variables$pushScope = F2(
	function (vars, x) {
		var y = function (b) {
			return _Utils_Tuple2(_List_Nil, b);
		}(
			$elm$core$Dict$fromList(
				A2(
					$elm$core$List$map,
					function (_v0) {
						var z = _v0.a;
						var t = _v0.b;
						return _Utils_Tuple2(
							$stil4m$elm_syntax$Elm$Syntax$Node$value(z),
							_Utils_Tuple3(
								0,
								t,
								$stil4m$elm_syntax$Elm$Syntax$Node$range(z)));
					},
					vars)));
		return _Utils_update(
			x,
			{
				activeScopes: A2($elm$core$List$cons, y, x.activeScopes)
			});
	});
var $author$project$Analyser$Checks$Variables$onCase = F3(
	function (f, caze, context) {
		var used = A2(
			$elm$core$List$map,
			$stil4m$elm_syntax$Elm$Syntax$Node$value,
			$author$project$ASTUtil$Variables$patternToUsedVars(caze.a));
		var postContext = $author$project$Analyser$Checks$Variables$popScope(
			f(
				function (a) {
					return A2($author$project$Analyser$Checks$Variables$pushScope, a, context);
				}(
					A2($author$project$ASTUtil$Variables$patternToVarsInner, false, caze.a))));
		return A3($elm$core$List$foldl, $author$project$Analyser$Checks$Variables$addUsedVariable, postContext, used);
	});
var $author$project$Analyser$Checks$Variables$onDestructuring = F2(
	function (_v0, context) {
		var pattern = _v0.a;
		return A3(
			$elm$core$List$foldl,
			$author$project$Analyser$Checks$Variables$addUsedVariable,
			context,
			A2(
				$elm$core$List$map,
				$stil4m$elm_syntax$Elm$Syntax$Node$value,
				$author$project$ASTUtil$Variables$patternToUsedVars(pattern)));
	});
var $author$project$ASTUtil$Variables$TopLevel = {$: 'TopLevel'};
var $author$project$ASTUtil$Variables$patternToVars = $author$project$ASTUtil$Variables$patternToVarsInner(true);
var $author$project$ASTUtil$Variables$getDeclarationVars = function (_v0) {
	var decl = _v0.b;
	switch (decl.$) {
		case 'FunctionDeclaration':
			var f = decl.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					$stil4m$elm_syntax$Elm$Syntax$Node$value(f.declaration).name,
					$author$project$ASTUtil$Variables$TopLevel)
				]);
		case 'AliasDeclaration':
			return _List_Nil;
		case 'CustomTypeDeclaration':
			var t = decl.a;
			return A2(
				$elm$core$List$map,
				function (_v2) {
					var name = _v2.b.name;
					return _Utils_Tuple2(name, $author$project$ASTUtil$Variables$TopLevel);
				},
				t.constructors);
		case 'PortDeclaration':
			var p = decl.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(p.name, $author$project$ASTUtil$Variables$TopLevel)
				]);
		case 'InfixDeclaration':
			return _List_Nil;
		default:
			var pattern = decl.a;
			return $author$project$ASTUtil$Variables$patternToVars(pattern);
	}
};
var $author$project$ASTUtil$Variables$getDeclarationsVars = $elm$core$List$concatMap($author$project$ASTUtil$Variables$getDeclarationVars);
var $author$project$ASTUtil$Variables$Imported = {$: 'Imported'};
var $author$project$ASTUtil$Variables$getImportExposedVars = function (e) {
	if (e.$ === 'Nothing') {
		return _List_Nil;
	} else {
		if (e.a.$ === 'All') {
			return _List_Nil;
		} else {
			var l = e.a.a;
			return A2(
				$elm$core$List$concatMap,
				function (_v1) {
					var r = _v1.a;
					var exposed = _v1.b;
					switch (exposed.$) {
						case 'InfixExpose':
							var x = exposed.a;
							return _List_fromArray(
								[
									_Utils_Tuple2(
									A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, x),
									$author$project$ASTUtil$Variables$Imported)
								]);
						case 'FunctionExpose':
							var x = exposed.a;
							return _List_fromArray(
								[
									_Utils_Tuple2(
									A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, x),
									$author$project$ASTUtil$Variables$Imported)
								]);
						case 'TypeOrAliasExpose':
							var x = exposed.a;
							return _List_fromArray(
								[
									_Utils_Tuple2(
									A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, x),
									$author$project$ASTUtil$Variables$Imported)
								]);
						default:
							var exposedType = exposed.a;
							var _v3 = exposedType.open;
							if (_v3.$ === 'Just') {
								return _List_Nil;
							} else {
								return _List_fromArray(
									[
										_Utils_Tuple2(
										A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, exposedType.name),
										$author$project$ASTUtil$Variables$Imported)
									]);
							}
					}
				},
				l);
		}
	}
};
var $author$project$ASTUtil$Variables$getImportVars = function (_v0) {
	var imp = _v0.b;
	return $author$project$ASTUtil$Variables$getImportExposedVars(
		A2($elm$core$Maybe$map, $stil4m$elm_syntax$Elm$Syntax$Node$value, imp.exposingList));
};
var $author$project$ASTUtil$Variables$getImportsVars = $elm$core$List$concatMap($author$project$ASTUtil$Variables$getImportVars);
var $author$project$ASTUtil$Variables$getTopLevels = function (file) {
	return $elm$core$List$concat(
		_List_fromArray(
			[
				$author$project$ASTUtil$Variables$getImportsVars(file.imports),
				$author$project$ASTUtil$Variables$getDeclarationsVars(file.declarations)
			]));
};
var $author$project$Analyser$Checks$Variables$onFile = F2(
	function (file, context) {
		return function (a) {
			return A2($author$project$Analyser$Checks$Variables$pushScope, a, context);
		}(
			$author$project$ASTUtil$Variables$getTopLevels(file));
	});
var $author$project$Analyser$Checks$Variables$maskVariable = F2(
	function (k, context) {
		return _Utils_update(
			context,
			{
				activeScopes: function () {
					var _v0 = context.activeScopes;
					if (!_v0.b) {
						return _List_Nil;
					} else {
						var _v1 = _v0.a;
						var masked = _v1.a;
						var vs = _v1.b;
						var xs = _v0.b;
						return A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								A2($elm$core$List$cons, k, masked),
								vs),
							xs);
					}
				}()
			});
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Analyser$Checks$Variables$unMaskVariable = F2(
	function (k, context) {
		return _Utils_update(
			context,
			{
				activeScopes: function () {
					var _v0 = context.activeScopes;
					if (!_v0.b) {
						return _List_Nil;
					} else {
						var _v1 = _v0.a;
						var masked = _v1.a;
						var vs = _v1.b;
						var xs = _v0.b;
						return A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								A2(
									$elm$core$List$filter,
									$elm$core$Basics$neq(k),
									masked),
								vs),
							xs);
					}
				}()
			});
	});
var $author$project$Analyser$Checks$Variables$onFunction = F3(
	function (f, _v0, context) {
		var _function = _v0.b;
		var functionDeclaration = $stil4m$elm_syntax$Elm$Syntax$Node$value(_function.declaration);
		var postContext = function (c) {
			return A2(
				$author$project$Analyser$Checks$Variables$unMaskVariable,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(functionDeclaration.name),
				$author$project$Analyser$Checks$Variables$popScope(
					f(
						function (a) {
							return A2($author$project$Analyser$Checks$Variables$pushScope, a, c);
						}(
							A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToVars, functionDeclaration._arguments)))));
		}(
			A2(
				$author$project$Analyser$Checks$Variables$maskVariable,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(functionDeclaration.name),
				context));
		var used = A2(
			$elm$core$List$map,
			$stil4m$elm_syntax$Elm$Syntax$Node$value,
			A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToUsedVars, functionDeclaration._arguments));
		return A3($elm$core$List$foldl, $author$project$Analyser$Checks$Variables$addUsedVariable, postContext, used);
	});
var $author$project$Analyser$Checks$Variables$onFunctionOrValue = F2(
	function (_v0, context) {
		var x = _v0.b;
		return A2($author$project$Analyser$Checks$Variables$addUsedVariable, x, context);
	});
var $author$project$Analyser$Checks$Variables$onLambda = F3(
	function (f, lambda, context) {
		var preContext = function (a) {
			return A2($author$project$Analyser$Checks$Variables$pushScope, a, context);
		}(
			A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToVars, lambda.args));
		var postContext = f(preContext);
		return $author$project$Analyser$Checks$Variables$popScope(postContext);
	});
var $author$project$ASTUtil$Variables$getLetDeclarationVars = function (_v0) {
	var decl = _v0.b;
	if (decl.$ === 'LetFunction') {
		var f = decl.a;
		return _List_fromArray(
			[
				_Utils_Tuple2(
				$stil4m$elm_syntax$Elm$Syntax$Node$value(f.declaration).name,
				$author$project$ASTUtil$Variables$TopLevel)
			]);
	} else {
		var pattern = decl.a;
		return $author$project$ASTUtil$Variables$patternToVars(pattern);
	}
};
var $author$project$ASTUtil$Variables$getLetDeclarationsVars = $elm$core$List$concatMap($author$project$ASTUtil$Variables$getLetDeclarationVars);
var $author$project$ASTUtil$Variables$withoutTopLevel = function () {
	var f = function (pair) {
		var pointer = pair.a;
		var variableType = pair.b;
		if (variableType.$ === 'TopLevel') {
			return _Utils_Tuple2(pointer, $author$project$ASTUtil$Variables$Defined);
		} else {
			return pair;
		}
	};
	return $elm$core$List$map(f);
}();
var $author$project$Analyser$Checks$Variables$onLetBlock = F3(
	function (f, letBlock, context) {
		return $author$project$Analyser$Checks$Variables$popScope(
			f(
				function (a) {
					return A2($author$project$Analyser$Checks$Variables$pushScope, a, context);
				}(
					A3($elm$core$Basics$composeR, $author$project$ASTUtil$Variables$getLetDeclarationsVars, $author$project$ASTUtil$Variables$withoutTopLevel, letBlock.declarations))));
	});
var $author$project$Analyser$Checks$Variables$onOperatorAppliction = F2(
	function (_v0, context) {
		var operator = _v0.operator;
		return A2($author$project$Analyser$Checks$Variables$addUsedVariable, operator, context);
	});
var $author$project$Analyser$Checks$Variables$onPrefixOperator = F2(
	function (prefixOperator, context) {
		return A2($author$project$Analyser$Checks$Variables$addUsedVariable, prefixOperator, context);
	});
var $author$project$Analyser$Checks$Variables$onRecordUpdate = F2(
	function (_v0, context) {
		var _v1 = _v0.a;
		var name = _v1.b;
		return A2($author$project$Analyser$Checks$Variables$addUsedVariable, name, context);
	});
var $author$project$Analyser$Checks$Variables$onTypeAnnotation = F2(
	function (_v0, c) {
		var t = _v0.b;
		if ((t.$ === 'Typed') && (!t.a.b.a.b)) {
			var _v2 = t.a;
			var _v3 = _v2.b;
			var name = _v3.b;
			return A2($author$project$Analyser$Checks$Variables$addUsedVariable, name, c);
		} else {
			return c;
		}
	});
var $author$project$Analyser$Checks$Variables$collect = function (fileContext) {
	return $author$project$Analyser$Checks$Variables$UsedVariableContext(
		A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onCase: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$Variables$onCase),
					onDestructuring: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$Variables$onDestructuring),
					onFile: $author$project$ASTUtil$Inspector$Pre($author$project$Analyser$Checks$Variables$onFile),
					onFunction: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$Variables$onFunction),
					onFunctionOrValue: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$Variables$onFunctionOrValue),
					onLambda: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$Variables$onLambda),
					onLetBlock: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$Variables$onLetBlock),
					onOperatorApplication: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$Variables$onOperatorAppliction),
					onPrefixOperator: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$Variables$onPrefixOperator),
					onRecordUpdate: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$Variables$onRecordUpdate),
					onTypeAnnotation: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$Variables$onTypeAnnotation)
				}),
			fileContext.ast,
			$author$project$Analyser$Checks$Variables$emptyContext));
};
var $stil4m$elm_syntax$Elm$Interface$exposesFunction = F2(
	function (k, _interface) {
		return A2(
			$elm$core$List$any,
			function (x) {
				switch (x.$) {
					case 'Function':
						var l = x.a;
						return _Utils_eq(k, l);
					case 'CustomType':
						var _v1 = x.a;
						var constructors = _v1.b;
						return A2($elm$core$List$member, k, constructors);
					case 'Operator':
						var inf = x.a;
						return _Utils_eq(
							$stil4m$elm_syntax$Elm$Syntax$Node$value(inf.operator),
							k);
					default:
						return false;
				}
			},
			_interface);
	});
var $author$project$Analyser$Checks$UnusedImportedVariable$filterForEffectModule = function (_v0) {
	var k = _v0.a;
	return !A2(
		$elm$core$List$member,
		k,
		_List_fromArray(
			['init', 'onEffects', 'onSelfMsg', 'subMap', 'cmdMap']));
};
var $author$project$Analyser$Checks$UnusedImportedVariable$filterByModuleType = function (fileContext) {
	var _v0 = $stil4m$elm_syntax$Elm$Syntax$Node$value(fileContext.ast.moduleDefinition);
	if (_v0.$ === 'EffectModule') {
		return $author$project$Analyser$Checks$UnusedImportedVariable$filterForEffectModule;
	} else {
		return $elm$core$Basics$always(true);
	}
};
var $author$project$Tuple$Extra$first3 = function (_v0) {
	var a = _v0.a;
	return a;
};
var $author$project$Analyser$Checks$UnusedImportedVariable$forVariableType = function (_v0) {
	var variableName = _v0.a;
	var variableType = _v0.b;
	var range = _v0.c;
	if (variableType.$ === 'Imported') {
		return $elm$core$Maybe$Just(
			A3(
				$author$project$Analyser$Messages$Data$addVarName,
				'varName',
				variableName,
				A3(
					$author$project$Analyser$Messages$Data$addRange,
					'range',
					range,
					$author$project$Analyser$Messages$Data$init(
						$elm$core$String$concat(
							_List_fromArray(
								[
									'Unused imported variable `',
									variableName,
									'` at ',
									$author$project$AST$Ranges$rangeToString(range)
								]))))));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Analyser$Checks$Variables$onlyUnused = $elm$core$List$filter(
	A2(
		$elm$core$Basics$composeR,
		$elm$core$Tuple$second,
		A2(
			$elm$core$Basics$composeR,
			$author$project$Tuple$Extra$first3,
			$elm$core$Basics$eq(0))));
var $author$project$Analyser$Checks$Variables$unusedTopLevels = function (_v0) {
	var x = _v0.a;
	return A2(
		$elm$core$List$map,
		function (_v1) {
			var a = _v1.a;
			var _v2 = _v1.b;
			var c = _v2.b;
			var d = _v2.c;
			return _Utils_Tuple3(a, c, d);
		},
		$author$project$Analyser$Checks$Variables$onlyUnused(
			$elm$core$Dict$toList(
				A2(
					$elm$core$Maybe$withDefault,
					$elm$core$Dict$empty,
					A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$second,
						$elm$core$List$head(x.activeScopes))))));
};
var $author$project$Analyser$Checks$Variables$unusedVariables = function (_v0) {
	var x = _v0.a;
	return A2(
		$elm$core$List$map,
		function (_v1) {
			var a = _v1.a;
			var _v2 = _v1.b;
			var c = _v2.b;
			var d = _v2.c;
			return _Utils_Tuple3(a, c, d);
		},
		$author$project$Analyser$Checks$Variables$onlyUnused(
			A2($elm$core$List$concatMap, $elm$core$Dict$toList, x.poppedScopes)));
};
var $author$project$Analyser$Checks$UnusedImportedVariable$scan = F2(
	function (fileContext, _v0) {
		var x = $author$project$Analyser$Checks$Variables$collect(fileContext);
		var unusedVariables = A2(
			$elm$core$List$filterMap,
			$author$project$Analyser$Checks$UnusedImportedVariable$forVariableType,
			$author$project$Analyser$Checks$Variables$unusedVariables(x));
		var unusedTopLevels = A2(
			$elm$core$List$filterMap,
			$author$project$Analyser$Checks$UnusedImportedVariable$forVariableType,
			A2(
				$elm$core$List$filter,
				A2(
					$elm$core$Basics$composeR,
					$author$project$Tuple$Extra$first3,
					A2(
						$elm$core$Basics$composeR,
						function (a) {
							return A2($stil4m$elm_syntax$Elm$Interface$exposesFunction, a, fileContext._interface);
						},
						$elm$core$Basics$not)),
				A2(
					$elm$core$List$filter,
					$author$project$Analyser$Checks$UnusedImportedVariable$filterByModuleType(fileContext),
					$author$project$Analyser$Checks$Variables$unusedTopLevels(x))));
		return _Utils_ap(unusedVariables, unusedTopLevels);
	});
var $author$project$Analyser$Checks$UnusedImportedVariable$checker = {
	check: $author$project$Analyser$Checks$UnusedImportedVariable$scan,
	info: {
		description: 'When a function is imported from a module but is unused, it is better to remove it.',
		key: 'UnusedImportedVariable',
		name: 'Unused Imported Variable',
		schema: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'range',
			A2($author$project$Analyser$Messages$Schema$varProp, 'varName', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$Analyser$Checks$UnusedPatternVariable$emptyContext = {activeScopes: _List_Nil, poppedScopes: _List_Nil};
var $author$project$Analyser$Checks$UnusedPatternVariable$filterForEffectModule = function (_v0) {
	var k = _v0.a;
	return !A2(
		$elm$core$List$member,
		k,
		_List_fromArray(
			['init', 'onEffects', 'onSelfMsg', 'subMap', 'cmdMap']));
};
var $author$project$Analyser$Checks$UnusedPatternVariable$filterByModuleType = function (fileContext) {
	var _v0 = $stil4m$elm_syntax$Elm$Syntax$Node$value(fileContext.ast.moduleDefinition);
	if (_v0.$ === 'EffectModule') {
		return $author$project$Analyser$Checks$UnusedPatternVariable$filterForEffectModule;
	} else {
		return $elm$core$Basics$always(true);
	}
};
var $author$project$Analyser$Checks$UnusedPatternVariable$forVariableType = F3(
	function (variableType, variableName, range) {
		if (variableType.$ === 'Pattern') {
			return $elm$core$Maybe$Just(
				A3(
					$author$project$Analyser$Messages$Data$addRange,
					'range',
					range,
					A3(
						$author$project$Analyser$Messages$Data$addVarName,
						'varName',
						variableName,
						$author$project$Analyser$Messages$Data$init(
							$elm$core$String$concat(
								_List_fromArray(
									[
										'Unused variable `',
										variableName,
										'` inside pattern at ',
										$author$project$AST$Ranges$rangeToString(range)
									]))))));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$flagVariable = F2(
	function (k, l) {
		if (!l.b) {
			return _List_Nil;
		} else {
			var _v1 = l.a;
			var masked = _v1.a;
			var x = _v1.b;
			var xs = l.b;
			return A2($elm$core$List$member, k, masked) ? A2(
				$elm$core$List$cons,
				_Utils_Tuple2(masked, x),
				xs) : (A2($elm$core$Dict$member, k, x) ? A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					masked,
					A3(
						$elm$core$Dict$update,
						k,
						$elm$core$Maybe$map(
							$author$project$Tuple$Extra$mapFirst3(
								$elm$core$Basics$add(1))),
						x)),
				xs) : A2(
				$elm$core$List$cons,
				_Utils_Tuple2(masked, x),
				A2($author$project$Analyser$Checks$UnusedPatternVariable$flagVariable, k, xs)));
		}
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$addUsedVariable = F2(
	function (x, context) {
		return _Utils_update(
			context,
			{
				activeScopes: A2($author$project$Analyser$Checks$UnusedPatternVariable$flagVariable, x, context.activeScopes)
			});
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$popScope = function (x) {
	return _Utils_update(
		x,
		{
			activeScopes: A2($elm$core$List$drop, 1, x.activeScopes),
			poppedScopes: A2(
				$elm$core$Maybe$withDefault,
				x.poppedScopes,
				A2(
					$elm$core$Maybe$map,
					function (_v0) {
						var activeScope = _v0.b;
						return $elm$core$Dict$isEmpty(activeScope) ? x.poppedScopes : A2($elm$core$List$cons, activeScope, x.poppedScopes);
					},
					$elm$core$List$head(x.activeScopes)))
		});
};
var $author$project$Analyser$Checks$UnusedPatternVariable$pushScope = F2(
	function (vars, x) {
		var y = function (b) {
			return _Utils_Tuple2(_List_Nil, b);
		}(
			$elm$core$Dict$fromList(
				A2(
					$elm$core$List$map,
					function (_v0) {
						var _v1 = _v0.a;
						var vr = _v1.a;
						var vv = _v1.b;
						var t = _v0.b;
						return _Utils_Tuple2(
							vv,
							_Utils_Tuple3(0, t, vr));
					},
					vars)));
		return _Utils_update(
			x,
			{
				activeScopes: A2($elm$core$List$cons, y, x.activeScopes)
			});
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$onCase = F3(
	function (f, caze, context) {
		var used = A2(
			$elm$core$List$map,
			$stil4m$elm_syntax$Elm$Syntax$Node$value,
			$author$project$ASTUtil$Variables$patternToUsedVars(caze.a));
		var postContext = $author$project$Analyser$Checks$UnusedPatternVariable$popScope(
			f(
				function (a) {
					return A2($author$project$Analyser$Checks$UnusedPatternVariable$pushScope, a, context);
				}(
					A2($author$project$ASTUtil$Variables$patternToVarsInner, false, caze.a))));
		return A3($elm$core$List$foldl, $author$project$Analyser$Checks$UnusedPatternVariable$addUsedVariable, postContext, used);
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$onDestructuring = F2(
	function (_v0, context) {
		var pattern = _v0.a;
		return A3(
			$elm$core$List$foldl,
			$author$project$Analyser$Checks$UnusedPatternVariable$addUsedVariable,
			context,
			A2(
				$elm$core$List$map,
				$stil4m$elm_syntax$Elm$Syntax$Node$value,
				$author$project$ASTUtil$Variables$patternToUsedVars(pattern)));
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$onFile = F2(
	function (file, context) {
		return function (a) {
			return A2($author$project$Analyser$Checks$UnusedPatternVariable$pushScope, a, context);
		}(
			$author$project$ASTUtil$Variables$getTopLevels(file));
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$maskVariable = F2(
	function (k, context) {
		return _Utils_update(
			context,
			{
				activeScopes: function () {
					var _v0 = context.activeScopes;
					if (!_v0.b) {
						return _List_Nil;
					} else {
						var _v1 = _v0.a;
						var masked = _v1.a;
						var vs = _v1.b;
						var xs = _v0.b;
						return A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								A2($elm$core$List$cons, k, masked),
								vs),
							xs);
					}
				}()
			});
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$unMaskVariable = F2(
	function (k, context) {
		return _Utils_update(
			context,
			{
				activeScopes: function () {
					var _v0 = context.activeScopes;
					if (!_v0.b) {
						return _List_Nil;
					} else {
						var _v1 = _v0.a;
						var masked = _v1.a;
						var vs = _v1.b;
						var xs = _v0.b;
						return A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								A2(
									$elm$core$List$filter,
									$elm$core$Basics$neq(k),
									masked),
								vs),
							xs);
					}
				}()
			});
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$onFunction = F3(
	function (f, _v0, context) {
		var _function = _v0.b;
		var functionDeclaration = $stil4m$elm_syntax$Elm$Syntax$Node$value(_function.declaration);
		var postContext = function (c) {
			return A2(
				$author$project$Analyser$Checks$UnusedPatternVariable$unMaskVariable,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(functionDeclaration.name),
				$author$project$Analyser$Checks$UnusedPatternVariable$popScope(
					f(
						function (a) {
							return A2($author$project$Analyser$Checks$UnusedPatternVariable$pushScope, a, c);
						}(
							A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToVars, functionDeclaration._arguments)))));
		}(
			A2(
				$author$project$Analyser$Checks$UnusedPatternVariable$maskVariable,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(functionDeclaration.name),
				context));
		var used = A2(
			$elm$core$List$map,
			$stil4m$elm_syntax$Elm$Syntax$Node$value,
			A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToUsedVars, functionDeclaration._arguments));
		return A3($elm$core$List$foldl, $author$project$Analyser$Checks$UnusedPatternVariable$addUsedVariable, postContext, used);
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$onFunctionOrValue = F2(
	function (_v0, context) {
		var x = _v0.b;
		return A2($author$project$Analyser$Checks$UnusedPatternVariable$addUsedVariable, x, context);
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$onLambda = F3(
	function (f, lambda, context) {
		var preContext = function (a) {
			return A2($author$project$Analyser$Checks$UnusedPatternVariable$pushScope, a, context);
		}(
			A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToVars, lambda.args));
		var postContext = f(preContext);
		return $author$project$Analyser$Checks$UnusedPatternVariable$popScope(postContext);
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$onLetBlock = F3(
	function (f, letBlock, context) {
		return $author$project$Analyser$Checks$UnusedPatternVariable$popScope(
			f(
				function (a) {
					return A2($author$project$Analyser$Checks$UnusedPatternVariable$pushScope, a, context);
				}(
					A3($elm$core$Basics$composeR, $author$project$ASTUtil$Variables$getLetDeclarationsVars, $author$project$ASTUtil$Variables$withoutTopLevel, letBlock.declarations))));
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$onOperatorApplication = F2(
	function (_v0, context) {
		var operator = _v0.operator;
		return A2($author$project$Analyser$Checks$UnusedPatternVariable$addUsedVariable, operator, context);
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$onPrefixOperator = F2(
	function (prefixOperator, context) {
		return A2($author$project$Analyser$Checks$UnusedPatternVariable$addUsedVariable, prefixOperator, context);
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$onRecordUpdate = F2(
	function (_v0, context) {
		var _v1 = _v0.a;
		var name = _v1.b;
		return A2($author$project$Analyser$Checks$UnusedPatternVariable$addUsedVariable, name, context);
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$onTypeAnnotation = F2(
	function (_v0, c) {
		var t = _v0.b;
		if ((t.$ === 'Typed') && (!t.a.b.a.b)) {
			var _v2 = t.a;
			var _v3 = _v2.b;
			var name = _v3.b;
			return A2($author$project$Analyser$Checks$UnusedPatternVariable$addUsedVariable, name, c);
		} else {
			return c;
		}
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$scan = F2(
	function (fileContext, _v0) {
		var x = A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onCase: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$UnusedPatternVariable$onCase),
					onDestructuring: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedPatternVariable$onDestructuring),
					onFile: $author$project$ASTUtil$Inspector$Pre($author$project$Analyser$Checks$UnusedPatternVariable$onFile),
					onFunction: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$UnusedPatternVariable$onFunction),
					onFunctionOrValue: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedPatternVariable$onFunctionOrValue),
					onLambda: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$UnusedPatternVariable$onLambda),
					onLetBlock: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$UnusedPatternVariable$onLetBlock),
					onOperatorApplication: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedPatternVariable$onOperatorApplication),
					onPrefixOperator: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedPatternVariable$onPrefixOperator),
					onRecordUpdate: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedPatternVariable$onRecordUpdate),
					onTypeAnnotation: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedPatternVariable$onTypeAnnotation)
				}),
			fileContext.ast,
			$author$project$Analyser$Checks$UnusedPatternVariable$emptyContext);
		var onlyUnused = $elm$core$List$filter(
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Tuple$second,
				A2(
					$elm$core$Basics$composeR,
					$author$project$Tuple$Extra$first3,
					$elm$core$Basics$eq(0))));
		var unusedTopLevels = A2(
			$elm$core$List$filterMap,
			function (_v3) {
				var z = _v3.a;
				var _v4 = _v3.b;
				var t = _v4.b;
				var y = _v4.c;
				return A3($author$project$Analyser$Checks$UnusedPatternVariable$forVariableType, t, z, y);
			},
			A2(
				$elm$core$List$filter,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Tuple$first,
					A2(
						$elm$core$Basics$composeR,
						function (a) {
							return A2($stil4m$elm_syntax$Elm$Interface$exposesFunction, a, fileContext._interface);
						},
						$elm$core$Basics$not)),
				A2(
					$elm$core$List$filter,
					$author$project$Analyser$Checks$UnusedPatternVariable$filterByModuleType(fileContext),
					onlyUnused(
						$elm$core$Dict$toList(
							A2(
								$elm$core$Maybe$withDefault,
								$elm$core$Dict$empty,
								A2(
									$elm$core$Maybe$map,
									$elm$core$Tuple$second,
									$elm$core$List$head(x.activeScopes))))))));
		var unusedVariables = A2(
			$elm$core$List$filterMap,
			function (_v1) {
				var z = _v1.a;
				var _v2 = _v1.b;
				var t = _v2.b;
				var y = _v2.c;
				return A3($author$project$Analyser$Checks$UnusedPatternVariable$forVariableType, t, z, y);
			},
			onlyUnused(
				A2($elm$core$List$concatMap, $elm$core$Dict$toList, x.poppedScopes)));
		return _Utils_ap(unusedVariables, unusedTopLevels);
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$checker = {
	check: $author$project$Analyser$Checks$UnusedPatternVariable$scan,
	info: {
		description: 'Variables in pattern matching that are unused should be replaced with \'_\' to avoid unnecessary noise.',
		key: 'UnusedPatternVariable',
		name: 'Unused Pattern Variable',
		schema: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'range',
			A2($author$project$Analyser$Messages$Schema$varProp, 'varName', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$Analyser$Checks$UnusedTopLevel$filterForEffectModule = function (_v0) {
	var k = _v0.a;
	return !A2(
		$elm$core$List$member,
		k,
		_List_fromArray(
			['init', 'onEffects', 'onSelfMsg', 'subMap', 'cmdMap']));
};
var $author$project$Analyser$Checks$UnusedTopLevel$filterByModuleType = function (fileContext) {
	var _v0 = $stil4m$elm_syntax$Elm$Syntax$Node$value(fileContext.ast.moduleDefinition);
	if (_v0.$ === 'EffectModule') {
		return $author$project$Analyser$Checks$UnusedTopLevel$filterForEffectModule;
	} else {
		return $elm$core$Basics$always(true);
	}
};
var $author$project$Analyser$Checks$UnusedTopLevel$forVariableType = function (_v0) {
	var variableName = _v0.a;
	var variableType = _v0.b;
	var range = _v0.c;
	if (variableType.$ === 'TopLevel') {
		return $elm$core$Maybe$Just(
			A3(
				$author$project$Analyser$Messages$Data$addRange,
				'range',
				range,
				A3(
					$author$project$Analyser$Messages$Data$addVarName,
					'varName',
					variableName,
					$author$project$Analyser$Messages$Data$init(
						$elm$core$String$concat(
							_List_fromArray(
								[
									'Unused top level definition `',
									variableName,
									'` at ',
									$author$project$AST$Ranges$rangeToString(range)
								]))))));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Analyser$Checks$UnusedTopLevel$scan = F2(
	function (fileContext, _v0) {
		var x = $author$project$Analyser$Checks$Variables$collect(fileContext);
		var unusedVariables = A2(
			$elm$core$List$filterMap,
			$author$project$Analyser$Checks$UnusedTopLevel$forVariableType,
			$author$project$Analyser$Checks$Variables$unusedVariables(x));
		var unusedTopLevels = A2(
			$elm$core$List$filterMap,
			$author$project$Analyser$Checks$UnusedTopLevel$forVariableType,
			A2(
				$elm$core$List$filter,
				A2(
					$elm$core$Basics$composeR,
					$author$project$Tuple$Extra$first3,
					A2(
						$elm$core$Basics$composeR,
						function (a) {
							return A2($stil4m$elm_syntax$Elm$Interface$exposesFunction, a, fileContext._interface);
						},
						$elm$core$Basics$not)),
				A2(
					$elm$core$List$filter,
					$author$project$Analyser$Checks$UnusedTopLevel$filterByModuleType(fileContext),
					$author$project$Analyser$Checks$Variables$unusedTopLevels(x))));
		return _Utils_ap(unusedVariables, unusedTopLevels);
	});
var $author$project$Analyser$Checks$UnusedTopLevel$checker = {
	check: $author$project$Analyser$Checks$UnusedTopLevel$scan,
	info: {
		description: 'Functions and values that are unused in a module and not exported are dead code.',
		key: 'UnusedTopLevel',
		name: 'Unused Top Level',
		schema: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'range',
			A2($author$project$Analyser$Messages$Schema$varProp, 'varName', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$Analyser$Checks$UnusedTypeAlias$buildMessageData = function (_v0) {
	var varName = _v0.a;
	var range = _v0.b;
	return A3(
		$author$project$Analyser$Messages$Data$addRange,
		'range',
		range,
		A3(
			$author$project$Analyser$Messages$Data$addVarName,
			'varName',
			varName,
			$author$project$Analyser$Messages$Data$init(
				$elm$core$String$concat(
					_List_fromArray(
						[
							'Type alias `',
							varName,
							'` is not used at ',
							$author$project$AST$Ranges$rangeToString(range)
						])))));
};
var $stil4m$elm_syntax$Elm$Interface$exposesAlias = F2(
	function (k, _interface) {
		return A2(
			$elm$core$List$any,
			function (x) {
				if (x.$ === 'Alias') {
					var l = x.a;
					return _Utils_eq(k, l);
				} else {
					return false;
				}
			},
			_interface);
	});
var $author$project$Tuple$Extra$mapThird3 = F2(
	function (f, _v0) {
		var a = _v0.a;
		var b = _v0.b;
		var c = _v0.c;
		return _Utils_Tuple3(
			a,
			b,
			f(c));
	});
var $author$project$Analyser$Checks$UnusedTypeAlias$markTypeAlias = F2(
	function (key, context) {
		return A3(
			$elm$core$Dict$update,
			key,
			$elm$core$Maybe$map(
				$author$project$Tuple$Extra$mapThird3(
					$elm$core$Basics$add(1))),
			context);
	});
var $author$project$Analyser$Checks$UnusedTypeAlias$onFunctionOrValue = A2($elm$core$Basics$composeR, $elm$core$Tuple$second, $author$project$Analyser$Checks$UnusedTypeAlias$markTypeAlias);
var $author$project$Analyser$Checks$UnusedTypeAlias$onTypeAlias = F2(
	function (_v0, context) {
		var range = _v0.a;
		var typeAlias = _v0.b;
		return A3(
			$elm$core$Dict$insert,
			$stil4m$elm_syntax$Elm$Syntax$Node$value(typeAlias.name),
			_Utils_Tuple3(
				$stil4m$elm_syntax$Elm$Syntax$Node$value(typeAlias.name),
				range,
				0),
			context);
	});
var $author$project$Analyser$Checks$UnusedTypeAlias$onTypeAnnotation = F2(
	function (_v0, context) {
		var typeAnnotation = _v0.b;
		if ((typeAnnotation.$ === 'Typed') && (!typeAnnotation.a.b.a.b)) {
			var _v2 = typeAnnotation.a;
			var _v3 = _v2.b;
			var x = _v3.b;
			return A2($author$project$Analyser$Checks$UnusedTypeAlias$markTypeAlias, x, context);
		} else {
			return context;
		}
	});
var $author$project$Tuple$Extra$second3 = function (_v0) {
	var b = _v0.b;
	return b;
};
var $author$project$Tuple$Extra$third3 = function (_v0) {
	var c = _v0.c;
	return c;
};
var $author$project$Analyser$Checks$UnusedTypeAlias$scan = F2(
	function (fileContext, _v0) {
		var collectedAliased = A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onTypeAlias: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedTypeAlias$onTypeAlias)
				}),
			fileContext.ast,
			$elm$core$Dict$empty);
		return A2(
			$elm$core$List$map,
			$author$project$Analyser$Checks$UnusedTypeAlias$buildMessageData,
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$mapSecond($author$project$Tuple$Extra$second3),
				A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Tuple$first,
						A2(
							$elm$core$Basics$composeR,
							function (a) {
								return A2($stil4m$elm_syntax$Elm$Interface$exposesAlias, a, fileContext._interface);
							},
							$elm$core$Basics$not)),
					A2(
						$elm$core$List$filter,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Tuple$second,
							A2(
								$elm$core$Basics$composeR,
								$author$project$Tuple$Extra$third3,
								A2(
									$elm$core$Basics$composeR,
									$elm$core$Basics$lt(0),
									$elm$core$Basics$not))),
						$elm$core$Dict$toList(
							A3(
								$author$project$ASTUtil$Inspector$inspect,
								_Utils_update(
									$author$project$ASTUtil$Inspector$defaultConfig,
									{
										onFunctionOrValue: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedTypeAlias$onFunctionOrValue),
										onTypeAnnotation: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedTypeAlias$onTypeAnnotation)
									}),
								fileContext.ast,
								collectedAliased))))));
	});
var $author$project$Analyser$Checks$UnusedTypeAlias$checker = {
	check: $author$project$Analyser$Checks$UnusedTypeAlias$scan,
	info: {
		description: 'You defined a type alias, but you do not use it in any signature or expose it.',
		key: 'UnusedTypeAlias',
		name: 'Unused Type Alias',
		schema: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'range',
			A2($author$project$Analyser$Messages$Schema$varProp, 'varName', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$Analyser$Checks$UnusedValueConstructor$buildMessageData = function (_v0) {
	var varName = _v0.a;
	var range = _v0.b;
	return A3(
		$author$project$Analyser$Messages$Data$addRange,
		'range',
		range,
		A3(
			$author$project$Analyser$Messages$Data$addVarName,
			'varName',
			varName,
			$author$project$Analyser$Messages$Data$init(
				$elm$core$String$concat(
					_List_fromArray(
						[
							'Value constructor `',
							varName,
							'` is not used. Declared at ',
							$author$project$AST$Ranges$rangeToString(range)
						])))));
};
var $author$project$Analyser$Checks$UnusedValueConstructor$onExpression = F2(
	function (_v0, config) {
		var e = _v0.b;
		if (e.$ === 'FunctionOrValue') {
			var s = e.b;
			return _Utils_update(
				config,
				{
					usedFunctions: A2($elm$core$Set$insert, s, config.usedFunctions)
				});
		} else {
			return config;
		}
	});
var $author$project$Analyser$Checks$UnusedValueConstructor$onType = F3(
	function (_interface, t, context) {
		var nonExposed = A2(
			$elm$core$List$map,
			function (_v1) {
				var r = _v1.a;
				var constructor = _v1.b;
				return _Utils_Tuple2(
					$stil4m$elm_syntax$Elm$Syntax$Node$value(constructor.name),
					r);
			},
			A2(
				$elm$core$List$filter,
				A2(
					$elm$core$Basics$composeL,
					$elm$core$Basics$not,
					function (_v0) {
						var constructor = _v0.b;
						return A2(
							$stil4m$elm_syntax$Elm$Interface$exposesFunction,
							$stil4m$elm_syntax$Elm$Syntax$Node$value(constructor.name),
							_interface);
					}),
				t.constructors));
		return _Utils_update(
			context,
			{
				unexposedConstructors: _Utils_ap(context.unexposedConstructors, nonExposed)
			});
	});
var $author$project$Analyser$Checks$UnusedValueConstructor$scan = F2(
	function (fileContext, _v0) {
		var result = A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onExpression: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedValueConstructor$onExpression),
					onType: $author$project$ASTUtil$Inspector$Inner(
						$elm$core$Basics$always(
							$author$project$Analyser$Checks$UnusedValueConstructor$onType(fileContext._interface)))
				}),
			fileContext.ast,
			{unexposedConstructors: _List_Nil, usedFunctions: $elm$core$Set$empty});
		return A2(
			$elm$core$List$map,
			$author$project$Analyser$Checks$UnusedValueConstructor$buildMessageData,
			A2(
				$elm$core$List$filter,
				function (x) {
					return !A2($elm$core$Set$member, x.a, result.usedFunctions);
				},
				result.unexposedConstructors));
	});
var $author$project$Analyser$Checks$UnusedValueConstructor$checker = {
	check: $author$project$Analyser$Checks$UnusedValueConstructor$scan,
	info: {
		description: 'Value Constructors which are not exposed and used should be eliminated.',
		key: 'UnusedValueConstructor',
		name: 'Unused Value Constructor',
		schema: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'range',
			A2($author$project$Analyser$Messages$Schema$varProp, 'varName', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$Analyser$Checks$UnusedVariable$filterForEffectModule = function (_v0) {
	var k = _v0.a;
	return !A2(
		$elm$core$List$member,
		k,
		_List_fromArray(
			['init', 'onEffects', 'onSelfMsg', 'subMap', 'cmdMap']));
};
var $author$project$Analyser$Checks$UnusedVariable$filterByModuleType = function (fileContext) {
	var _v0 = $stil4m$elm_syntax$Elm$Syntax$Node$value(fileContext.ast.moduleDefinition);
	if (_v0.$ === 'EffectModule') {
		return $author$project$Analyser$Checks$UnusedVariable$filterForEffectModule;
	} else {
		return $elm$core$Basics$always(true);
	}
};
var $author$project$Analyser$Checks$UnusedVariable$buildMessageData = F2(
	function (varName, range) {
		return A3(
			$author$project$Analyser$Messages$Data$addRange,
			'range',
			range,
			A3(
				$author$project$Analyser$Messages$Data$addVarName,
				'varName',
				varName,
				$author$project$Analyser$Messages$Data$init(
					$elm$core$String$concat(
						_List_fromArray(
							[
								'Unused variable `',
								varName,
								'` at ',
								$author$project$AST$Ranges$rangeToString(range)
							])))));
	});
var $author$project$Analyser$Checks$UnusedVariable$forVariableType = F3(
	function (variableType, variableName, range) {
		if (variableType.$ === 'Defined') {
			return $elm$core$Maybe$Just(
				A2($author$project$Analyser$Checks$UnusedVariable$buildMessageData, variableName, range));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Analyser$Checks$UnusedVariable$scan = F2(
	function (fileContext, _v0) {
		var x = $author$project$Analyser$Checks$Variables$collect(fileContext);
		var unusedVariables = A2(
			$elm$core$List$filterMap,
			function (_v2) {
				var z = _v2.a;
				var t = _v2.b;
				var y = _v2.c;
				return A3($author$project$Analyser$Checks$UnusedVariable$forVariableType, t, z, y);
			},
			$author$project$Analyser$Checks$Variables$unusedVariables(x));
		var unusedTopLevels = A2(
			$elm$core$List$filterMap,
			function (_v1) {
				var z = _v1.a;
				var t = _v1.b;
				var y = _v1.c;
				return A3($author$project$Analyser$Checks$UnusedVariable$forVariableType, t, z, y);
			},
			A2(
				$elm$core$List$filter,
				A2(
					$elm$core$Basics$composeR,
					$author$project$Tuple$Extra$first3,
					A2(
						$elm$core$Basics$composeR,
						function (a) {
							return A2($stil4m$elm_syntax$Elm$Interface$exposesFunction, a, fileContext._interface);
						},
						$elm$core$Basics$not)),
				A2(
					$elm$core$List$filter,
					$author$project$Analyser$Checks$UnusedVariable$filterByModuleType(fileContext),
					$author$project$Analyser$Checks$Variables$unusedTopLevels(x))));
		return _Utils_ap(unusedVariables, unusedTopLevels);
	});
var $author$project$Analyser$Checks$UnusedVariable$checker = {
	check: $author$project$Analyser$Checks$UnusedVariable$scan,
	info: {
		description: 'Variables that are not used could be removed or marked as _ to avoid unnecessary noise.',
		key: 'UnusedVariable',
		name: 'Unused Variable',
		schema: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'range',
			A2($author$project$Analyser$Messages$Schema$varProp, 'varName', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$Analyser$Checks$UseConsOverConcat$onExpression = F2(
	function (_v0, context) {
		var r = _v0.a;
		var inner = _v0.b;
		if (((((inner.$ === 'OperatorApplication') && (inner.a === '++')) && (inner.c.b.$ === 'ListExpr')) && inner.c.b.a.b) && (!inner.c.b.a.b.b)) {
			var _v2 = inner.c;
			var _v3 = _v2.b.a;
			return A2(
				$elm$core$List$cons,
				A3(
					$author$project$Analyser$Messages$Data$addRange,
					'range',
					r,
					$author$project$Analyser$Messages$Data$init(
						$elm$core$String$concat(
							_List_fromArray(
								[
									'Use `::` instead of `++` at ',
									$author$project$AST$Ranges$rangeToString(r)
								])))),
				context);
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$UseConsOverConcat$scan = F2(
	function (fileContext, _v0) {
		return A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					onExpression: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UseConsOverConcat$onExpression)
				}),
			fileContext.ast,
			_List_Nil);
	});
var $author$project$Analyser$Checks$UseConsOverConcat$checker = {
	check: $author$project$Analyser$Checks$UseConsOverConcat$scan,
	info: {
		description: 'If you concatenate two lists, but the right hand side is a single element list, then you should use the cons operator.',
		key: 'UseConsOverConcat',
		name: 'Use Cons Over Concat',
		schema: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$all = _List_fromArray(
	[$author$project$Analyser$Checks$UnusedVariable$checker, $author$project$Analyser$Checks$UnusedValueConstructor$checker, $author$project$Analyser$Checks$UnusedImportedVariable$checker, $author$project$Analyser$Checks$UnusedPatternVariable$checker, $author$project$Analyser$Checks$UnusedTopLevel$checker, $author$project$Analyser$Checks$ExposeAll$checker, $author$project$Analyser$Checks$ImportAll$checker, $author$project$Analyser$Checks$NoTopLevelSignature$checker, $author$project$Analyser$Checks$UnnecessaryParens$checker, $author$project$Analyser$Checks$DebugLog$checker, $author$project$Analyser$Checks$DebugCrash$checker, $author$project$Analyser$Checks$DuplicateImport$checker, $author$project$Analyser$Checks$DuplicateImportedVariable$checker, $author$project$Analyser$Checks$UnusedTypeAlias$checker, $author$project$Analyser$Checks$NoUncurriedPrefix$checker, $author$project$Analyser$Checks$UnusedImportAlias$checker, $author$project$Analyser$Checks$UnusedImport$checker, $author$project$Analyser$Checks$UseConsOverConcat$checker, $author$project$Analyser$Checks$DropConcatOfLists$checker, $author$project$Analyser$Checks$DropConsOfItemAndList$checker, $author$project$Analyser$Checks$UnnecessaryListConcat$checker, $author$project$Analyser$Checks$MultiLineRecordFormatting$checker, $author$project$Analyser$Checks$UnnecessaryPortModule$checker, $author$project$Analyser$Checks$FunctionInLet$checker, $author$project$Analyser$Checks$SingleFieldRecord$checker, $author$project$Analyser$Checks$TriggerWords$checker, $author$project$Analyser$Checks$BooleanCase$checker, $author$project$Analyser$Checks$MapNothingToNothing$checker, $author$project$Analyser$Checks$UnnecessaryLiteralBools$checker]);
var $author$project$Analyser$Messages$Schemas$Schemas = function (a) {
	return {$: 'Schemas', a: a};
};
var $author$project$Analyser$Messages$Schemas$buildSchemas = function (checkerList) {
	return $author$project$Analyser$Messages$Schemas$Schemas(
		$elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				function (c) {
					return _Utils_Tuple2(c.info.key, c.info.schema);
				},
				checkerList)));
};
var $author$project$Analyser$Messages$Schema$ErrorMessage = {$: 'ErrorMessage'};
var $author$project$Analyser$Messages$Schema$errorProp = F2(
	function (k, _v0) {
		var s = _v0.a;
		return $author$project$Analyser$Messages$Schema$Schema(
			A3($elm$core$Dict$insert, k, $author$project$Analyser$Messages$Schema$ErrorMessage, s));
	});
var $author$project$Analyser$Checks$FileLoadFailed$scan = F2(
	function (_v0, _v1) {
		return _List_Nil;
	});
var $author$project$Analyser$Checks$FileLoadFailed$checker = {
	check: $author$project$Analyser$Checks$FileLoadFailed$scan,
	info: {
		description: 'We could not analyse this file...',
		key: 'FileLoadFailed',
		name: 'FileLoadFailed',
		schema: A2($author$project$Analyser$Messages$Schema$errorProp, 'message', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$schemas = $author$project$Analyser$Messages$Schemas$buildSchemas(
	A2($elm$core$List$cons, $author$project$Analyser$Checks$FileLoadFailed$checker, $author$project$Analyser$Checks$all));
var $author$project$Editor$stateListener = _Platform_incomingPort('stateListener', $elm$json$Json$Decode$value);
var $author$project$Editor$subscriptions = function (_v0) {
	return $author$project$Editor$stateListener(
		A2(
			$elm$core$Basics$composeR,
			$elm$json$Json$Decode$decodeValue(
				$author$project$Analyser$State$decodeState($author$project$Analyser$Checks$schemas)),
			$author$project$Editor$OnState));
};
var $author$project$Analyser$Messages$Data$description = function (_v0) {
	var d = _v0.a;
	return d;
};
var $author$project$Analyser$Messages$Data$dataValueRanges = function (dv) {
	switch (dv.$) {
		case 'RangeV':
			var r = dv.a;
			return _List_fromArray(
				[r]);
		case 'RangeListV':
			var rs = dv.a;
			return rs;
		default:
			return _List_Nil;
	}
};
var $elm$core$Dict$values = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $author$project$Analyser$Messages$Data$getRanges = function (_v0) {
	var x = _v0.b;
	return A2(
		$elm$core$List$concatMap,
		$author$project$Analyser$Messages$Data$dataValueRanges,
		$elm$core$Dict$values(x));
};
var $author$project$Editor$editorFileMessages = function (m) {
	var editorMessage = F2(
		function (f, r) {
			return {
				description: $author$project$Analyser$Messages$Data$description(m.data),
				excerpt: $author$project$Analyser$Messages$Data$description(m.data),
				location: {
					file: f,
					position: _Utils_Tuple2(
						_Utils_Tuple2(r.start.row, r.start.column),
						_Utils_Tuple2(r.end.row, r.end.column))
				},
				severity: 'info'
			};
		});
	return A2(
		$elm$core$List$map,
		function (r) {
			return _Utils_Tuple2(
				m.file.path,
				A2(editorMessage, m.file.path, r));
		},
		$author$project$Analyser$Messages$Data$getRanges(m.data));
};
var $elm_community$dict_extra$Dict$Extra$groupBy = F2(
	function (keyfn, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A3(
						$elm$core$Dict$update,
						keyfn(x),
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Maybe$map(
								$elm$core$List$cons(x)),
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Maybe$withDefault(
									_List_fromArray(
										[x])),
								$elm$core$Maybe$Just)),
						acc);
				}),
			$elm$core$Dict$empty,
			list);
	});
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2($elm$core$Dict$map, func, left),
				A2($elm$core$Dict$map, func, right));
		}
	});
var $author$project$Editor$buildEditorData = function (state) {
	var editorFiles = A2(
		$elm$core$Dict$map,
		F2(
			function (_v0, v) {
				return A2($elm$core$List$map, $elm$core$Tuple$second, v);
			}),
		A2(
			$elm_community$dict_extra$Dict$Extra$groupBy,
			$elm$core$Tuple$first,
			A2($elm$core$List$concatMap, $author$project$Editor$editorFileMessages, state.messages)));
	return {files: editorFiles, progress: state.status};
};
var $author$project$Editor$editorMessages = _Platform_outgoingPort('editorMessages', $elm$core$Basics$identity);
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $author$project$Editor$encodePosition = function (_v0) {
	var _v1 = _v0.a;
	var sl = _v1.a;
	var sc = _v1.b;
	var _v2 = _v0.b;
	var el = _v2.a;
	var ec = _v2.b;
	return A2(
		$elm$json$Json$Encode$list,
		$elm$core$Basics$identity,
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Encode$list,
				$elm$json$Json$Encode$int,
				_List_fromArray(
					[sl, sc])),
				A2(
				$elm$json$Json$Encode$list,
				$elm$json$Json$Encode$int,
				_List_fromArray(
					[el, ec]))
			]));
};
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Editor$encodeEditorMessage = function (editorMessage) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'severity',
				$elm$json$Json$Encode$string(editorMessage.severity)),
				_Utils_Tuple2(
				'location',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'file',
							$elm$json$Json$Encode$string(editorMessage.location.file)),
							_Utils_Tuple2(
							'position',
							$author$project$Editor$encodePosition(editorMessage.location.position))
						]))),
				_Utils_Tuple2(
				'excerpt',
				$elm$json$Json$Encode$string(editorMessage.excerpt)),
				_Utils_Tuple2(
				'description',
				$elm$json$Json$Encode$string(editorMessage.description))
			]));
};
var $author$project$Analyser$State$encodeStatus = function (s) {
	switch (s.$) {
		case 'Initialising':
			return $elm$json$Json$Encode$string('initialising');
		case 'Idle':
			return $elm$json$Json$Encode$string('idle');
		default:
			return $elm$json$Json$Encode$string('fixing');
	}
};
var $author$project$Editor$encodeEditorData = function (editorData) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'progress',
				$author$project$Analyser$State$encodeStatus(editorData.progress)),
				_Utils_Tuple2(
				'files',
				$elm$json$Json$Encode$object(
					$elm$core$Dict$toList(
						A2(
							$elm$core$Dict$map,
							F2(
								function (_v0, v) {
									return A2($elm$json$Json$Encode$list, $author$project$Editor$encodeEditorMessage, v);
								}),
							editorData.files))))
			]));
};
var $author$project$Editor$sendEditorData = function (x) {
	return $author$project$Editor$editorMessages(
		$author$project$Editor$encodeEditorData(x));
};
var $author$project$Editor$update = F2(
	function (msg, model) {
		var newState = msg.a;
		if (newState.$ === 'Ok') {
			var state = newState.a;
			return _Utils_Tuple2(
				model,
				$author$project$Editor$sendEditorData(
					$author$project$Editor$buildEditorData(state)));
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $elm$core$Platform$worker = _Platform_worker;
var $author$project$Editor$main = $elm$core$Platform$worker(
	{init: $author$project$Editor$init, subscriptions: $author$project$Editor$subscriptions, update: $author$project$Editor$update});
_Platform_export({'Editor':{'init':$author$project$Editor$main(
	A2(
		$elm$json$Json$Decode$andThen,
		function (serverPort) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (serverHost) {
					return $elm$json$Json$Decode$succeed(
						{serverHost: serverHost, serverPort: serverPort});
				},
				A2($elm$json$Json$Decode$field, 'serverHost', $elm$json$Json$Decode$string));
		},
		A2($elm$json$Json$Decode$field, 'serverPort', $elm$json$Json$Decode$int)))(0)}});}(this));
return module.exports;
}
/********** End of module 2: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/dist/app/editor/elm.js **********/
/********** Start module 3: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/index.js **********/
__modules[3] = function(module, exports) {
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

'use strict';

const WebSocket = __require(4,3);

WebSocket.Server = __require(5,3);
WebSocket.Receiver = __require(6,3);
WebSocket.Sender = __require(7,3);

module.exports = WebSocket;

return module.exports;
}
/********** End of module 3: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/index.js **********/
/********** Start module 4: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/WebSocket.js **********/
__modules[4] = function(module, exports) {
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

'use strict';

const EventEmitter = require('events');
const crypto = require('crypto');
const Ultron = __require(8,4);
const https = require('https');
const http = require('http');
const url = require('url');

const PerMessageDeflate = __require(9,4);
const EventTarget = __require(10,4);
const Extensions = __require(11,4);
const constants = __require(12,4);
const Receiver = __require(6,4);
const Sender = __require(7,4);

const protocolVersions = [8, 13];
const closeTimeout = 30 * 1000; // Allow 30 seconds to terminate the connection cleanly.

/**
 * Class representing a WebSocket.
 *
 * @extends EventEmitter
 */
class WebSocket extends EventEmitter {
  /**
   * Create a new `WebSocket`.
   *
   * @param {String} address The URL to which to connect
   * @param {(String|String[])} protocols The subprotocols
   * @param {Object} options Connection options
   */
  constructor (address, protocols, options) {
    super();

    if (!protocols) {
      protocols = [];
    } else if (typeof protocols === 'string') {
      protocols = [protocols];
    } else if (!Array.isArray(protocols)) {
      options = protocols;
      protocols = [];
    }

    this.readyState = WebSocket.CONNECTING;
    this.bytesReceived = 0;
    this.extensions = {};
    this.protocol = '';

    this._binaryType = constants.BINARY_TYPES[0];
    this._finalize = this.finalize.bind(this);
    this._finalizeCalled = false;
    this._closeMessage = null;
    this._closeTimer = null;
    this._closeCode = null;
    this._receiver = null;
    this._sender = null;
    this._socket = null;
    this._ultron = null;

    if (Array.isArray(address)) {
      initAsServerClient.call(this, address[0], address[1], options);
    } else {
      initAsClient.call(this, address, protocols, options);
    }
  }

  get CONNECTING () { return WebSocket.CONNECTING; }
  get CLOSING () { return WebSocket.CLOSING; }
  get CLOSED () { return WebSocket.CLOSED; }
  get OPEN () { return WebSocket.OPEN; }

  /**
   * @type {Number}
   */
  get bufferedAmount () {
    var amount = 0;

    if (this._socket) {
      amount = this._socket.bufferSize + this._sender._bufferedBytes;
    }
    return amount;
  }

  /**
   * This deviates from the WHATWG interface since ws doesn't support the required
   * default "blob" type (instead we define a custom "nodebuffer" type).
   *
   * @type {String}
   */
  get binaryType () {
    return this._binaryType;
  }

  set binaryType (type) {
    if (constants.BINARY_TYPES.indexOf(type) < 0) return;

    this._binaryType = type;
    if (this._receiver) this._receiver._binaryType = type;
  }

  /**
   * Set up the socket and the internal resources.
   *
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @private
   */
  setSocket (socket, head) {
    socket.setTimeout(0);
    socket.setNoDelay();

    this._receiver = new Receiver(this.extensions, this._maxPayload, this.binaryType);
    this._sender = new Sender(socket, this.extensions);
    this._ultron = new Ultron(socket);
    this._socket = socket;
    this._ultron.on('close', this._finalize);
    this._ultron.on('error', this._finalize);
    this._ultron.on('end', this._finalize);
    if (head.length > 0) socket.unshift(head);
    this._ultron.on('data', (data) => {
      this.bytesReceived += data.length;
      this._receiver.add(data);
    });
    this._receiver.onmessage = (data) => this.emit('message', data);
    this._receiver.onping = (data) => {
      this.pong(data, !this._isServer, true);
      this.emit('ping', data);
    };
    this._receiver.onpong = (data) => this.emit('pong', data);
    this._receiver.onclose = (code, reason) => {
      this._closeMessage = reason;
      this._closeCode = code;
      this.close(code, reason);
    };
    this._receiver.onerror = (error, code) => {
      this.close(code, '');
      this.emit('error', error);
    };

    this.readyState = WebSocket.OPEN;
    this.emit('open');
  }

  /**
   * Clean up and release internal resources.
   *
   * @param {(Boolean|Error)} Indicates whether or not an error occurred
   * @private
   */
  finalize (error) {
    if (this._finalizeCalled) return;

    this.readyState = WebSocket.CLOSING;
    this._finalizeCalled = true;

    clearTimeout(this._closeTimer);
    this._closeTimer = null;
    if (error) this._closeCode = 1006;

    if (this._socket) {
      this._ultron.destroy();
      this._socket.on('error', function onerror () {
        this.destroy();
      });

      if (!error) this._socket.end();
      else this._socket.destroy();

      this._receiver.cleanup(() => this.emitClose());

      this._receiver = null;
      this._sender = null;
      this._socket = null;
      this._ultron = null;
    } else {
      this.emitClose();
    }
  }

  /**
   * Emit the `close` event.
   *
   * @private
   */
  emitClose () {
    this.readyState = WebSocket.CLOSED;
    this.emit('close', this._closeCode || 1006, this._closeMessage || '');

    if (this.extensions[PerMessageDeflate.extensionName]) {
      this.extensions[PerMessageDeflate.extensionName].cleanup();
    }

    this.extensions = null;

    this.removeAllListeners();
    this.on('error', constants.NOOP); // Catch all errors after this.
  }

  /**
   * Pause the socket stream.
   *
   * @public
   */
  pause () {
    if (this.readyState !== WebSocket.OPEN) throw new Error('not opened');

    this._socket.pause();
  }

  /**
   * Resume the socket stream
   *
   * @public
   */
  resume () {
    if (this.readyState !== WebSocket.OPEN) throw new Error('not opened');

    this._socket.resume();
  }

  /**
   * Start a closing handshake.
   *
   * @param {Number} code Status code explaining why the connection is closing
   * @param {String} data A string explaining why the connection is closing
   * @public
   */
  close (code, data) {
    if (this.readyState === WebSocket.CLOSED) return;
    if (this.readyState === WebSocket.CONNECTING) {
      if (this._req && !this._req.aborted) {
        this._req.abort();
        this.emit('error', new Error('closed before the connection is established'));
        this.finalize(true);
      }
      return;
    }

    if (this.readyState === WebSocket.CLOSING) {
      if (this._closeCode && this._socket) this._socket.end();
      return;
    }

    this.readyState = WebSocket.CLOSING;
    this._sender.close(code, data, !this._isServer, (err) => {
      if (err) this.emit('error', err);

      if (this._socket) {
        if (this._closeCode) this._socket.end();
        clearTimeout(this._closeTimer);
        this._closeTimer = setTimeout(this._finalize, closeTimeout, true);
      }
    });
  }

  /**
   * Send a ping message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Indicates whether or not to mask `data`
   * @param {Boolean} failSilently Indicates whether or not to throw if `readyState` isn't `OPEN`
   * @public
   */
  ping (data, mask, failSilently) {
    if (this.readyState !== WebSocket.OPEN) {
      if (failSilently) return;
      throw new Error('not opened');
    }

    if (typeof data === 'number') data = data.toString();
    if (mask === undefined) mask = !this._isServer;
    this._sender.ping(data || constants.EMPTY_BUFFER, mask);
  }

  /**
   * Send a pong message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Indicates whether or not to mask `data`
   * @param {Boolean} failSilently Indicates whether or not to throw if `readyState` isn't `OPEN`
   * @public
   */
  pong (data, mask, failSilently) {
    if (this.readyState !== WebSocket.OPEN) {
      if (failSilently) return;
      throw new Error('not opened');
    }

    if (typeof data === 'number') data = data.toString();
    if (mask === undefined) mask = !this._isServer;
    this._sender.pong(data || constants.EMPTY_BUFFER, mask);
  }

  /**
   * Send a data message.
   *
   * @param {*} data The message to send
   * @param {Object} options Options object
   * @param {Boolean} options.compress Specifies whether or not to compress `data`
   * @param {Boolean} options.binary Specifies whether `data` is binary or text
   * @param {Boolean} options.fin Specifies whether the fragment is the last one
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback which is executed when data is written out
   * @public
   */
  send (data, options, cb) {
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }

    if (this.readyState !== WebSocket.OPEN) {
      if (cb) cb(new Error('not opened'));
      else throw new Error('not opened');
      return;
    }

    if (typeof data === 'number') data = data.toString();

    const opts = Object.assign({
      binary: typeof data !== 'string',
      mask: !this._isServer,
      compress: true,
      fin: true
    }, options);

    if (!this.extensions[PerMessageDeflate.extensionName]) {
      opts.compress = false;
    }

    this._sender.send(data || constants.EMPTY_BUFFER, opts, cb);
  }

  /**
   * Forcibly close the connection.
   *
   * @public
   */
  terminate () {
    if (this.readyState === WebSocket.CLOSED) return;
    if (this.readyState === WebSocket.CONNECTING) {
      if (this._req && !this._req.aborted) {
        this._req.abort();
        this.emit('error', new Error('closed before the connection is established'));
        this.finalize(true);
      }
      return;
    }

    this.finalize(true);
  }
}

WebSocket.CONNECTING = 0;
WebSocket.OPEN = 1;
WebSocket.CLOSING = 2;
WebSocket.CLOSED = 3;
['open', 'error', 'close', 'message'].forEach((method) => {
  Object.defineProperty(WebSocket.prototype, `on${method}`, {
    /**
     * Return the listener of the event.
     *
     * @return {(Function|undefined)} The event listener or `undefined`
     * @public
     */
    get () {
      const listeners = this.listeners(method);
      for (var i = 0; i < listeners.length; i++) {
        if (listeners[i]._listener) return listeners[i]._listener;
      }
    },
    /**
     * Add a listener for the event.
     *
     * @param {Function} listener The listener to add
     * @public
     */
    set (listener) {
      const listeners = this.listeners(method);
      for (var i = 0; i < listeners.length; i++) {
        if (listeners[i]._listener) this.removeListener(method, listeners[i]);
      }
      this.addEventListener(method, listener);
    }
  });
});

WebSocket.prototype.addEventListener = EventTarget.addEventListener;
WebSocket.prototype.removeEventListener = EventTarget.removeEventListener;

module.exports = WebSocket;

/**
 * Initialize a WebSocket server client.
 *
 * @param {http.IncomingMessage} req The request object
 * @param {net.Socket} socket The network socket between the server and client
 * @param {Buffer} head The first packet of the upgraded stream
 * @param {Object} options WebSocket attributes
 * @param {Number} options.protocolVersion The WebSocket protocol version
 * @param {Object} options.extensions The negotiated extensions
 * @param {Number} options.maxPayload The maximum allowed message size
 * @param {String} options.protocol The chosen subprotocol
 * @private
 */
function initAsServerClient (socket, head, options) {
  this.protocolVersion = options.protocolVersion;
  this._maxPayload = options.maxPayload;
  this.extensions = options.extensions;
  this.protocol = options.protocol;

  this._isServer = true;

  this.setSocket(socket, head);
}

/**
 * Initialize a WebSocket client.
 *
 * @param {String} address The URL to which to connect
 * @param {String[]} protocols The list of subprotocols
 * @param {Object} options Connection options
 * @param {String} options.protocol Value of the `Sec-WebSocket-Protocol` header
 * @param {(Boolean|Object)} options.perMessageDeflate Enable/disable permessage-deflate
 * @param {Number} options.handshakeTimeout Timeout in milliseconds for the handshake request
 * @param {String} options.localAddress Local interface to bind for network connections
 * @param {Number} options.protocolVersion Value of the `Sec-WebSocket-Version` header
 * @param {Object} options.headers An object containing request headers
 * @param {String} options.origin Value of the `Origin` or `Sec-WebSocket-Origin` header
 * @param {http.Agent} options.agent Use the specified Agent
 * @param {String} options.host Value of the `Host` header
 * @param {Number} options.family IP address family to use during hostname lookup (4 or 6).
 * @param {Function} options.checkServerIdentity A function to validate the server hostname
 * @param {Boolean} options.rejectUnauthorized Verify or not the server certificate
 * @param {String} options.passphrase The passphrase for the private key or pfx
 * @param {String} options.ciphers The ciphers to use or exclude
 * @param {String} options.ecdhCurve The curves for ECDH key agreement to use or exclude
 * @param {(String|String[]|Buffer|Buffer[])} options.cert The certificate key
 * @param {(String|String[]|Buffer|Buffer[])} options.key The private key
 * @param {(String|Buffer)} options.pfx The private key, certificate, and CA certs
 * @param {(String|String[]|Buffer|Buffer[])} options.ca Trusted certificates
 * @private
 */
function initAsClient (address, protocols, options) {
  options = Object.assign({
    protocolVersion: protocolVersions[1],
    protocol: protocols.join(','),
    perMessageDeflate: true,
    handshakeTimeout: null,
    localAddress: null,
    headers: null,
    family: null,
    origin: null,
    agent: null,
    host: null,
    checkServerIdentity: null,
    rejectUnauthorized: null,
    passphrase: null,
    ciphers: null,
    ecdhCurve: null,
    cert: null,
    key: null,
    pfx: null,
    ca: null
  }, options);

  if (protocolVersions.indexOf(options.protocolVersion) === -1) {
    throw new Error(
      `unsupported protocol version: ${options.protocolVersion} ` +
      `(supported versions: ${protocolVersions.join(', ')})`
    );
  }

  this.protocolVersion = options.protocolVersion;
  this._isServer = false;
  this.url = address;

  const serverUrl = url.parse(address);
  const isUnixSocket = serverUrl.protocol === 'ws+unix:';

  if (!serverUrl.host && (!isUnixSocket || !serverUrl.path)) {
    throw new Error('invalid url');
  }

  const isSecure = serverUrl.protocol === 'wss:' || serverUrl.protocol === 'https:';
  const key = crypto.randomBytes(16).toString('base64');
  const httpObj = isSecure ? https : http;
  const extensionsOffer = {};
  var perMessageDeflate;

  if (options.perMessageDeflate) {
    perMessageDeflate = new PerMessageDeflate(
      options.perMessageDeflate !== true ? options.perMessageDeflate : {},
      false
    );
    extensionsOffer[PerMessageDeflate.extensionName] = perMessageDeflate.offer();
  }

  const requestOptions = {
    port: serverUrl.port || (isSecure ? 443 : 80),
    host: serverUrl.hostname,
    path: '/',
    headers: {
      'Sec-WebSocket-Version': options.protocolVersion,
      'Sec-WebSocket-Key': key,
      'Connection': 'Upgrade',
      'Upgrade': 'websocket'
    }
  };

  if (options.headers) Object.assign(requestOptions.headers, options.headers);
  if (Object.keys(extensionsOffer).length) {
    requestOptions.headers['Sec-WebSocket-Extensions'] = Extensions.format(extensionsOffer);
  }
  if (options.protocol) {
    requestOptions.headers['Sec-WebSocket-Protocol'] = options.protocol;
  }
  if (options.origin) {
    if (options.protocolVersion < 13) {
      requestOptions.headers['Sec-WebSocket-Origin'] = options.origin;
    } else {
      requestOptions.headers.Origin = options.origin;
    }
  }
  if (options.host) requestOptions.headers.Host = options.host;
  if (serverUrl.auth) requestOptions.auth = serverUrl.auth;

  if (options.localAddress) requestOptions.localAddress = options.localAddress;
  if (options.family) requestOptions.family = options.family;

  if (isUnixSocket) {
    const parts = serverUrl.path.split(':');

    requestOptions.socketPath = parts[0];
    requestOptions.path = parts[1];
  } else if (serverUrl.path) {
    if (serverUrl.path.charAt(0) !== '/') {
      requestOptions.path = `/${serverUrl.path}`;
    } else {
      requestOptions.path = serverUrl.path;
    }
  }

  var agent = options.agent;
  if (
    options.rejectUnauthorized != null ||
    options.checkServerIdentity ||
    options.passphrase ||
    options.ciphers ||
    options.ecdhCurve ||
    options.cert ||
    options.key ||
    options.pfx ||
    options.ca
  ) {
    if (options.passphrase) requestOptions.passphrase = options.passphrase;
    if (options.ciphers) requestOptions.ciphers = options.ciphers;
    if (options.ecdhCurve) requestOptions.ecdhCurve = options.ecdhCurve;
    if (options.cert) requestOptions.cert = options.cert;
    if (options.key) requestOptions.key = options.key;
    if (options.pfx) requestOptions.pfx = options.pfx;
    if (options.ca) requestOptions.ca = options.ca;
    if (options.checkServerIdentity) {
      requestOptions.checkServerIdentity = options.checkServerIdentity;
    }
    if (options.rejectUnauthorized != null) {
      requestOptions.rejectUnauthorized = options.rejectUnauthorized;
    }

    if (!agent) agent = new httpObj.Agent(requestOptions);
  }

  if (agent) requestOptions.agent = agent;

  this._req = httpObj.get(requestOptions);

  if (options.handshakeTimeout) {
    this._req.setTimeout(options.handshakeTimeout, () => {
      this._req.abort();
      this.emit('error', new Error('opening handshake has timed out'));
      this.finalize(true);
    });
  }

  this._req.on('error', (error) => {
    if (this._req.aborted) return;

    this._req = null;
    this.emit('error', error);
    this.finalize(true);
  });

  this._req.on('response', (res) => {
    if (!this.emit('unexpected-response', this._req, res)) {
      this._req.abort();
      this.emit('error', new Error(`unexpected server response (${res.statusCode})`));
      this.finalize(true);
    }
  });

  this._req.on('upgrade', (res, socket, head) => {
    this.emit('headers', res.headers, res);
    if (this.readyState !== WebSocket.CONNECTING) return;

    this._req = null;

    const digest = crypto.createHash('sha1')
      .update(key + constants.GUID, 'binary')
      .digest('base64');

    if (res.headers['sec-websocket-accept'] !== digest) {
      socket.destroy();
      this.emit('error', new Error('invalid server key'));
      return this.finalize(true);
    }

    const serverProt = res.headers['sec-websocket-protocol'];
    const protList = (options.protocol || '').split(/, */);
    var protError;

    if (!options.protocol && serverProt) {
      protError = 'server sent a subprotocol even though none requested';
    } else if (options.protocol && !serverProt) {
      protError = 'server sent no subprotocol even though requested';
    } else if (serverProt && protList.indexOf(serverProt) === -1) {
      protError = 'server responded with an invalid protocol';
    }

    if (protError) {
      socket.destroy();
      this.emit('error', new Error(protError));
      return this.finalize(true);
    }

    if (serverProt) this.protocol = serverProt;

    const serverExtensions = Extensions.parse(res.headers['sec-websocket-extensions']);

    if (perMessageDeflate && serverExtensions[PerMessageDeflate.extensionName]) {
      try {
        perMessageDeflate.accept(serverExtensions[PerMessageDeflate.extensionName]);
      } catch (err) {
        socket.destroy();
        this.emit('error', new Error('invalid extension parameter'));
        return this.finalize(true);
      }

      this.extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
    }

    this.setSocket(socket, head);
  });
}

return module.exports;
}
/********** End of module 4: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/WebSocket.js **********/
/********** Start module 5: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/WebSocketServer.js **********/
__modules[5] = function(module, exports) {
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

'use strict';

const safeBuffer = __require(13,5);
const EventEmitter = require('events');
const crypto = require('crypto');
const Ultron = __require(8,5);
const http = require('http');
const url = require('url');

const PerMessageDeflate = __require(9,5);
const Extensions = __require(11,5);
const constants = __require(12,5);
const WebSocket = __require(4,5);

const Buffer = safeBuffer.Buffer;

/**
 * Class representing a WebSocket server.
 *
 * @extends EventEmitter
 */
class WebSocketServer extends EventEmitter {
  /**
   * Create a `WebSocketServer` instance.
   *
   * @param {Object} options Configuration options
   * @param {String} options.host The hostname where to bind the server
   * @param {Number} options.port The port where to bind the server
   * @param {http.Server} options.server A pre-created HTTP/S server to use
   * @param {Function} options.verifyClient An hook to reject connections
   * @param {Function} options.handleProtocols An hook to handle protocols
   * @param {String} options.path Accept only connections matching this path
   * @param {Boolean} options.noServer Enable no server mode
   * @param {Boolean} options.clientTracking Specifies whether or not to track clients
   * @param {(Boolean|Object)} options.perMessageDeflate Enable/disable permessage-deflate
   * @param {Number} options.maxPayload The maximum allowed message size
   * @param {Function} callback A listener for the `listening` event
   */
  constructor (options, callback) {
    super();

    options = Object.assign({
      maxPayload: 100 * 1024 * 1024,
      perMessageDeflate: false,
      handleProtocols: null,
      clientTracking: true,
      verifyClient: null,
      noServer: false,
      backlog: null, // use default (511 as implemented in net.js)
      server: null,
      host: null,
      path: null,
      port: null
    }, options);

    if (options.port == null && !options.server && !options.noServer) {
      throw new TypeError('missing or invalid options');
    }

    if (options.port != null) {
      this._server = http.createServer((req, res) => {
        const body = http.STATUS_CODES[426];

        res.writeHead(426, {
          'Content-Length': body.length,
          'Content-Type': 'text/plain'
        });
        res.end(body);
      });
      this._server.allowHalfOpen = false;
      this._server.listen(options.port, options.host, options.backlog, callback);
    } else if (options.server) {
      this._server = options.server;
    }

    if (this._server) {
      this._ultron = new Ultron(this._server);
      this._ultron.on('listening', () => this.emit('listening'));
      this._ultron.on('error', (err) => this.emit('error', err));
      this._ultron.on('upgrade', (req, socket, head) => {
        this.handleUpgrade(req, socket, head, (client) => {
          this.emit('connection', client, req);
        });
      });
    }

    if (options.clientTracking) this.clients = new Set();
    this.options = options;
  }

  /**
   * Close the server.
   *
   * @param {Function} cb Callback
   * @public
   */
  close (cb) {
    if (this.clients) {
      for (const client of this.clients) client.terminate();
    }

    const server = this._server;

    if (server) {
      this._ultron.destroy();
      this._ultron = this._server = null;
      if (this.options.port != null) return server.close(cb);
    }

    if (cb) cb();
  }

  /**
   * See if a given request should be handled by this server instance.
   *
   * @param {http.IncomingMessage} req Request object to inspect
   * @return {Boolean} `true` if the request is valid, else `false`
   * @public
   */
  shouldHandle (req) {
    if (this.options.path && url.parse(req.url).pathname !== this.options.path) {
      return false;
    }

    return true;
  }

  /**
   * Handle a HTTP Upgrade request.
   *
   * @param {http.IncomingMessage} req The request object
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @public
   */
  handleUpgrade (req, socket, head, cb) {
    socket.on('error', socketError);

    const version = +req.headers['sec-websocket-version'];

    if (
      req.method !== 'GET' || req.headers.upgrade.toLowerCase() !== 'websocket' ||
      !req.headers['sec-websocket-key'] || (version !== 8 && version !== 13) ||
      !this.shouldHandle(req)
    ) {
      return abortConnection(socket, 400);
    }

    var protocol = (req.headers['sec-websocket-protocol'] || '').split(/, */);
    if (this.options.handleProtocols) {
      protocol = this.options.handleProtocols(protocol, req);
      if (protocol === false) return abortConnection(socket, 401);
    } else {
      protocol = protocol[0];
    }
    if (this.options.verifyClient) {
      const info = {
        origin: req.headers[`${version === 8 ? 'sec-websocket-origin' : 'origin'}`],
        secure: !!(req.connection.authorized || req.connection.encrypted),
        req
      };

      if (this.options.verifyClient.length === 2) {
        this.options.verifyClient(info, (verified, code, message) => {
          if (!verified) return abortConnection(socket, code || 401, message);

          this.completeUpgrade(protocol, version, req, socket, head, cb);
        });
        return;
      } else if (!this.options.verifyClient(info)) {
        return abortConnection(socket, 401);
      }
    }

    this.completeUpgrade(protocol, version, req, socket, head, cb);
  }

  /**
   * Upgrade the connection to WebSocket.
   *
   * @param {String} protocol The chosen subprotocol
   * @param {Number} version The WebSocket protocol version
   * @param {http.IncomingMessage} req The request object
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @private
   */
  completeUpgrade (protocol, version, req, socket, head, cb) {
    if (!socket.readable || !socket.writable) return socket.destroy();

    const key = crypto.createHash('sha1')
      .update(req.headers['sec-websocket-key'] + constants.GUID, 'binary')
      .digest('base64');

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${key}`
    ];

    if (protocol) headers.push(`Sec-WebSocket-Protocol: ${protocol}`);

    const offer = Extensions.parse(req.headers['sec-websocket-extensions']);
    var extensions;

    try {
      extensions = acceptExtensions(this.options, offer);
    } catch (err) {
      return abortConnection(socket, 400);
    }

    const props = Object.keys(extensions);

    if (props.length) {
      const serverExtensions = props.reduce((obj, key) => {
        obj[key] = [extensions[key].params];
        return obj;
      }, {});

      headers.push(`Sec-WebSocket-Extensions: ${Extensions.format(serverExtensions)}`);
    }
    this.emit('headers', headers, req);

    socket.write(headers.concat('', '').join('\r\n'));

    const client = new WebSocket([socket, head], null, {
      maxPayload: this.options.maxPayload,
      protocolVersion: version,
      extensions,
      protocol
    });

    if (this.clients) {
      this.clients.add(client);
      client.on('close', () => this.clients.delete(client));
    }

    socket.removeListener('error', socketError);
    cb(client);
  }
}

module.exports = WebSocketServer;

/**
 * Handle premature socket errors.
 *
 * @private
 */
function socketError () {
  this.destroy();
}

/**
 * Accept WebSocket extensions.
 *
 * @param {Object} options The `WebSocketServer` configuration options
 * @param {Object} offer The parsed value of the `sec-websocket-extensions` header
 * @return {Object} Accepted extensions
 * @private
 */
function acceptExtensions (options, offer) {
  const pmd = options.perMessageDeflate;
  const extensions = {};

  if (pmd && offer[PerMessageDeflate.extensionName]) {
    const perMessageDeflate = new PerMessageDeflate(
      pmd !== true ? pmd : {},
      true,
      options.maxPayload
    );

    perMessageDeflate.accept(offer[PerMessageDeflate.extensionName]);
    extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
  }

  return extensions;
}

/**
 * Close the connection when preconditions are not fulfilled.
 *
 * @param {net.Socket} socket The socket of the upgrade request
 * @param {Number} code The HTTP response status code
 * @param {String} [message] The HTTP response body
 * @private
 */
function abortConnection (socket, code, message) {
  if (socket.writable) {
    message = message || http.STATUS_CODES[code];
    socket.write(
      `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` +
      'Connection: close\r\n' +
      'Content-type: text/html\r\n' +
      `Content-Length: ${Buffer.byteLength(message)}\r\n` +
      '\r\n' +
      message
    );
  }

  socket.removeListener('error', socketError);
  socket.destroy();
}

return module.exports;
}
/********** End of module 5: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/WebSocketServer.js **********/
/********** Start module 6: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/Receiver.js **********/
__modules[6] = function(module, exports) {
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

'use strict';

const safeBuffer = __require(13,6);

const PerMessageDeflate = __require(9,6);
const isValidUTF8 = __require(14,6);
const bufferUtil = __require(15,6);
const ErrorCodes = __require(16,6);
const constants = __require(12,6);

const Buffer = safeBuffer.Buffer;

const GET_INFO = 0;
const GET_PAYLOAD_LENGTH_16 = 1;
const GET_PAYLOAD_LENGTH_64 = 2;
const GET_MASK = 3;
const GET_DATA = 4;
const INFLATING = 5;

/**
 * HyBi Receiver implementation.
 */
class Receiver {
  /**
   * Creates a Receiver instance.
   *
   * @param {Object} extensions An object containing the negotiated extensions
   * @param {Number} maxPayload The maximum allowed message length
   * @param {String} binaryType The type for binary data
   */
  constructor (extensions, maxPayload, binaryType) {
    this._binaryType = binaryType || constants.BINARY_TYPES[0];
    this._extensions = extensions || {};
    this._maxPayload = maxPayload | 0;

    this._bufferedBytes = 0;
    this._buffers = [];

    this._compressed = false;
    this._payloadLength = 0;
    this._fragmented = 0;
    this._masked = false;
    this._fin = false;
    this._mask = null;
    this._opcode = 0;

    this._totalPayloadLength = 0;
    this._messageLength = 0;
    this._fragments = [];

    this._cleanupCallback = null;
    this._hadError = false;
    this._dead = false;
    this._loop = false;

    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    this.onping = null;
    this.onpong = null;

    this._state = GET_INFO;
  }

  /**
   * Consumes bytes from the available buffered data.
   *
   * @param {Number} bytes The number of bytes to consume
   * @return {Buffer} Consumed bytes
   * @private
   */
  readBuffer (bytes) {
    var offset = 0;
    var dst;
    var l;

    this._bufferedBytes -= bytes;

    if (bytes === this._buffers[0].length) return this._buffers.shift();

    if (bytes < this._buffers[0].length) {
      dst = this._buffers[0].slice(0, bytes);
      this._buffers[0] = this._buffers[0].slice(bytes);
      return dst;
    }

    dst = Buffer.allocUnsafe(bytes);

    while (bytes > 0) {
      l = this._buffers[0].length;

      if (bytes >= l) {
        this._buffers[0].copy(dst, offset);
        offset += l;
        this._buffers.shift();
      } else {
        this._buffers[0].copy(dst, offset, 0, bytes);
        this._buffers[0] = this._buffers[0].slice(bytes);
      }

      bytes -= l;
    }

    return dst;
  }

  /**
   * Checks if the number of buffered bytes is bigger or equal than `n` and
   * calls `cleanup` if necessary.
   *
   * @param {Number} n The number of bytes to check against
   * @return {Boolean} `true` if `bufferedBytes >= n`, else `false`
   * @private
   */
  hasBufferedBytes (n) {
    if (this._bufferedBytes >= n) return true;

    this._loop = false;
    if (this._dead) this.cleanup(this._cleanupCallback);
    return false;
  }

  /**
   * Adds new data to the parser.
   *
   * @public
   */
  add (data) {
    if (this._dead) return;

    this._bufferedBytes += data.length;
    this._buffers.push(data);
    this.startLoop();
  }

  /**
   * Starts the parsing loop.
   *
   * @private
   */
  startLoop () {
    this._loop = true;

    while (this._loop) {
      switch (this._state) {
        case GET_INFO:
          this.getInfo();
          break;
        case GET_PAYLOAD_LENGTH_16:
          this.getPayloadLength16();
          break;
        case GET_PAYLOAD_LENGTH_64:
          this.getPayloadLength64();
          break;
        case GET_MASK:
          this.getMask();
          break;
        case GET_DATA:
          this.getData();
          break;
        default: // `INFLATING`
          this._loop = false;
      }
    }
  }

  /**
   * Reads the first two bytes of a frame.
   *
   * @private
   */
  getInfo () {
    if (!this.hasBufferedBytes(2)) return;

    const buf = this.readBuffer(2);

    if ((buf[0] & 0x30) !== 0x00) {
      this.error(new Error('RSV2 and RSV3 must be clear'), 1002);
      return;
    }

    const compressed = (buf[0] & 0x40) === 0x40;

    if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
      this.error(new Error('RSV1 must be clear'), 1002);
      return;
    }

    this._fin = (buf[0] & 0x80) === 0x80;
    this._opcode = buf[0] & 0x0f;
    this._payloadLength = buf[1] & 0x7f;

    if (this._opcode === 0x00) {
      if (compressed) {
        this.error(new Error('RSV1 must be clear'), 1002);
        return;
      }

      if (!this._fragmented) {
        this.error(new Error(`invalid opcode: ${this._opcode}`), 1002);
        return;
      } else {
        this._opcode = this._fragmented;
      }
    } else if (this._opcode === 0x01 || this._opcode === 0x02) {
      if (this._fragmented) {
        this.error(new Error(`invalid opcode: ${this._opcode}`), 1002);
        return;
      }

      this._compressed = compressed;
    } else if (this._opcode > 0x07 && this._opcode < 0x0b) {
      if (!this._fin) {
        this.error(new Error('FIN must be set'), 1002);
        return;
      }

      if (compressed) {
        this.error(new Error('RSV1 must be clear'), 1002);
        return;
      }

      if (this._payloadLength > 0x7d) {
        this.error(new Error('invalid payload length'), 1002);
        return;
      }
    } else {
      this.error(new Error(`invalid opcode: ${this._opcode}`), 1002);
      return;
    }

    if (!this._fin && !this._fragmented) this._fragmented = this._opcode;

    this._masked = (buf[1] & 0x80) === 0x80;

    if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
    else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
    else this.haveLength();
  }

  /**
   * Gets extended payload length (7+16).
   *
   * @private
   */
  getPayloadLength16 () {
    if (!this.hasBufferedBytes(2)) return;

    this._payloadLength = this.readBuffer(2).readUInt16BE(0, true);
    this.haveLength();
  }

  /**
   * Gets extended payload length (7+64).
   *
   * @private
   */
  getPayloadLength64 () {
    if (!this.hasBufferedBytes(8)) return;

    const buf = this.readBuffer(8);
    const num = buf.readUInt32BE(0, true);
    if (num > Math.pow(2, 53 - 32) - 1) {
      this.error(new Error('max payload size exceeded'), 1009);
      return;
    }

    this._payloadLength = (num * Math.pow(2, 32)) + buf.readUInt32BE(4, true);
    this.haveLength();
  }

  /**
   * Payload length has been read.
   *
   * @private
   */
  haveLength () {
    if (this._opcode < 0x08 && this.maxPayloadExceeded(this._payloadLength)) {
      return;
    }

    if (this._masked) this._state = GET_MASK;
    else this._state = GET_DATA;
  }

  /**
   * Reads mask bytes.
   *
   * @private
   */
  getMask () {
    if (!this.hasBufferedBytes(4)) return;

    this._mask = this.readBuffer(4);
    this._state = GET_DATA;
  }

  /**
   * Reads data bytes.
   *
   * @private
   */
  getData () {
    var data = constants.EMPTY_BUFFER;

    if (this._payloadLength) {
      if (!this.hasBufferedBytes(this._payloadLength)) return;

      data = this.readBuffer(this._payloadLength);
      if (this._masked) bufferUtil.unmask(data, this._mask);
    }

    if (this._opcode > 0x07) {
      this.controlMessage(data);
    } else if (this._compressed) {
      this._state = INFLATING;
      this.decompress(data);
    } else if (this.pushFragment(data)) {
      this.dataMessage();
    }
  }

  /**
   * Decompresses data.
   *
   * @param {Buffer} data Compressed data
   * @private
   */
  decompress (data) {
    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

    perMessageDeflate.decompress(data, this._fin, (err, buf) => {
      if (err) {
        this.error(err, err.closeCode === 1009 ? 1009 : 1007);
        return;
      }

      if (this.pushFragment(buf)) this.dataMessage();
      this.startLoop();
    });
  }

  /**
   * Handles a data message.
   *
   * @private
   */
  dataMessage () {
    if (this._fin) {
      const messageLength = this._messageLength;
      const fragments = this._fragments;

      this._totalPayloadLength = 0;
      this._messageLength = 0;
      this._fragmented = 0;
      this._fragments = [];

      if (this._opcode === 2) {
        var data;

        if (this._binaryType === 'nodebuffer') {
          data = toBuffer(fragments, messageLength);
        } else if (this._binaryType === 'arraybuffer') {
          data = toArrayBuffer(toBuffer(fragments, messageLength));
        } else {
          data = fragments;
        }

        this.onmessage(data);
      } else {
        const buf = toBuffer(fragments, messageLength);

        if (!isValidUTF8(buf)) {
          this.error(new Error('invalid utf8 sequence'), 1007);
          return;
        }

        this.onmessage(buf.toString());
      }
    }

    this._state = GET_INFO;
  }

  /**
   * Handles a control message.
   *
   * @param {Buffer} data Data to handle
   * @private
   */
  controlMessage (data) {
    if (this._opcode === 0x08) {
      if (data.length === 0) {
        this.onclose(1000, '');
        this._loop = false;
        this.cleanup(this._cleanupCallback);
      } else if (data.length === 1) {
        this.error(new Error('invalid payload length'), 1002);
      } else {
        const code = data.readUInt16BE(0, true);

        if (!ErrorCodes.isValidErrorCode(code)) {
          this.error(new Error(`invalid status code: ${code}`), 1002);
          return;
        }

        const buf = data.slice(2);

        if (!isValidUTF8(buf)) {
          this.error(new Error('invalid utf8 sequence'), 1007);
          return;
        }

        this.onclose(code, buf.toString());
        this._loop = false;
        this.cleanup(this._cleanupCallback);
      }

      return;
    }

    if (this._opcode === 0x09) this.onping(data);
    else this.onpong(data);

    this._state = GET_INFO;
  }

  /**
   * Handles an error.
   *
   * @param {Error} err The error
   * @param {Number} code Close code
   * @private
   */
  error (err, code) {
    this.onerror(err, code);
    this._hadError = true;
    this._loop = false;
    this.cleanup(this._cleanupCallback);
  }

  /**
   * Checks payload size, disconnects socket when it exceeds `maxPayload`.
   *
   * @param {Number} length Payload length
   * @private
   */
  maxPayloadExceeded (length) {
    if (length === 0 || this._maxPayload < 1) return false;

    const fullLength = this._totalPayloadLength + length;

    if (fullLength <= this._maxPayload) {
      this._totalPayloadLength = fullLength;
      return false;
    }

    this.error(new Error('max payload size exceeded'), 1009);
    return true;
  }

  /**
   * Appends a fragment in the fragments array after checking that the sum of
   * fragment lengths does not exceed `maxPayload`.
   *
   * @param {Buffer} fragment The fragment to add
   * @return {Boolean} `true` if `maxPayload` is not exceeded, else `false`
   * @private
   */
  pushFragment (fragment) {
    if (fragment.length === 0) return true;

    const totalLength = this._messageLength + fragment.length;

    if (this._maxPayload < 1 || totalLength <= this._maxPayload) {
      this._messageLength = totalLength;
      this._fragments.push(fragment);
      return true;
    }

    this.error(new Error('max payload size exceeded'), 1009);
    return false;
  }

  /**
   * Releases resources used by the receiver.
   *
   * @param {Function} cb Callback
   * @public
   */
  cleanup (cb) {
    this._dead = true;

    if (!this._hadError && (this._loop || this._state === INFLATING)) {
      this._cleanupCallback = cb;
    } else {
      this._extensions = null;
      this._fragments = null;
      this._buffers = null;
      this._mask = null;

      this._cleanupCallback = null;
      this.onmessage = null;
      this.onclose = null;
      this.onerror = null;
      this.onping = null;
      this.onpong = null;

      if (cb) cb();
    }
  }
}

module.exports = Receiver;

/**
 * Makes a buffer from a list of fragments.
 *
 * @param {Buffer[]} fragments The list of fragments composing the message
 * @param {Number} messageLength The length of the message
 * @return {Buffer}
 * @private
 */
function toBuffer (fragments, messageLength) {
  if (fragments.length === 1) return fragments[0];
  if (fragments.length > 1) return bufferUtil.concat(fragments, messageLength);
  return constants.EMPTY_BUFFER;
}

/**
 * Converts a buffer to an `ArrayBuffer`.
 *
 * @param {Buffer} The buffer to convert
 * @return {ArrayBuffer} Converted buffer
 */
function toArrayBuffer (buf) {
  if (buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength) {
    return buf.buffer;
  }

  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

return module.exports;
}
/********** End of module 6: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/Receiver.js **********/
/********** Start module 7: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/Sender.js **********/
__modules[7] = function(module, exports) {
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

'use strict';

const safeBuffer = __require(13,7);
const crypto = require('crypto');

const PerMessageDeflate = __require(9,7);
const bufferUtil = __require(15,7);
const ErrorCodes = __require(16,7);

const Buffer = safeBuffer.Buffer;

/**
 * HyBi Sender implementation.
 */
class Sender {
  /**
   * Creates a Sender instance.
   *
   * @param {net.Socket} socket The connection socket
   * @param {Object} extensions An object containing the negotiated extensions
   */
  constructor (socket, extensions) {
    this._extensions = extensions || {};
    this._socket = socket;

    this._firstFragment = true;
    this._compress = false;

    this._bufferedBytes = 0;
    this._deflating = false;
    this._queue = [];
  }

  /**
   * Frames a piece of data according to the HyBi WebSocket protocol.
   *
   * @param {Buffer} data The data to frame
   * @param {Object} options Options object
   * @param {Number} options.opcode The opcode
   * @param {Boolean} options.readOnly Specifies whether `data` can be modified
   * @param {Boolean} options.fin Specifies whether or not to set the FIN bit
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Boolean} options.rsv1 Specifies whether or not to set the RSV1 bit
   * @return {Buffer[]} The framed data as a list of `Buffer` instances
   * @public
   */
  static frame (data, options) {
    const merge = data.length < 1024 || (options.mask && options.readOnly);
    var offset = options.mask ? 6 : 2;
    var payloadLength = data.length;

    if (data.length >= 65536) {
      offset += 8;
      payloadLength = 127;
    } else if (data.length > 125) {
      offset += 2;
      payloadLength = 126;
    }

    const target = Buffer.allocUnsafe(merge ? data.length + offset : offset);

    target[0] = options.fin ? options.opcode | 0x80 : options.opcode;
    if (options.rsv1) target[0] |= 0x40;

    if (payloadLength === 126) {
      target.writeUInt16BE(data.length, 2, true);
    } else if (payloadLength === 127) {
      target.writeUInt32BE(0, 2, true);
      target.writeUInt32BE(data.length, 6, true);
    }

    if (!options.mask) {
      target[1] = payloadLength;
      if (merge) {
        data.copy(target, offset);
        return [target];
      }

      return [target, data];
    }

    const mask = crypto.randomBytes(4);

    target[1] = payloadLength | 0x80;
    target[offset - 4] = mask[0];
    target[offset - 3] = mask[1];
    target[offset - 2] = mask[2];
    target[offset - 1] = mask[3];

    if (merge) {
      bufferUtil.mask(data, mask, target, offset, data.length);
      return [target];
    }

    bufferUtil.mask(data, mask, data, 0, data.length);
    return [target, data];
  }

  /**
   * Sends a close message to the other peer.
   *
   * @param {(Number|undefined)} code The status code component of the body
   * @param {String} data The message component of the body
   * @param {Boolean} mask Specifies whether or not to mask the message
   * @param {Function} cb Callback
   * @public
   */
  close (code, data, mask, cb) {
    if (code !== undefined && (typeof code !== 'number' || !ErrorCodes.isValidErrorCode(code))) {
      throw new Error('first argument must be a valid error code number');
    }

    const buf = Buffer.allocUnsafe(2 + (data ? Buffer.byteLength(data) : 0));

    buf.writeUInt16BE(code || 1000, 0, true);
    if (buf.length > 2) buf.write(data, 2);

    if (this._deflating) {
      this.enqueue([this.doClose, buf, mask, cb]);
    } else {
      this.doClose(buf, mask, cb);
    }
  }

  /**
   * Frames and sends a close message.
   *
   * @param {Buffer} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback
   * @private
   */
  doClose (data, mask, cb) {
    this.sendFrame(Sender.frame(data, {
      fin: true,
      rsv1: false,
      opcode: 0x08,
      mask,
      readOnly: false
    }), cb);
  }

  /**
   * Sends a ping message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @public
   */
  ping (data, mask) {
    var readOnly = true;

    if (!Buffer.isBuffer(data)) {
      if (data instanceof ArrayBuffer) {
        data = Buffer.from(data);
      } else if (ArrayBuffer.isView(data)) {
        data = viewToBuffer(data);
      } else {
        data = Buffer.from(data);
        readOnly = false;
      }
    }

    if (this._deflating) {
      this.enqueue([this.doPing, data, mask, readOnly]);
    } else {
      this.doPing(data, mask, readOnly);
    }
  }

  /**
   * Frames and sends a ping message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Boolean} readOnly Specifies whether `data` can be modified
   * @private
   */
  doPing (data, mask, readOnly) {
    this.sendFrame(Sender.frame(data, {
      fin: true,
      rsv1: false,
      opcode: 0x09,
      mask,
      readOnly
    }));
  }

  /**
   * Sends a pong message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @public
   */
  pong (data, mask) {
    var readOnly = true;

    if (!Buffer.isBuffer(data)) {
      if (data instanceof ArrayBuffer) {
        data = Buffer.from(data);
      } else if (ArrayBuffer.isView(data)) {
        data = viewToBuffer(data);
      } else {
        data = Buffer.from(data);
        readOnly = false;
      }
    }

    if (this._deflating) {
      this.enqueue([this.doPong, data, mask, readOnly]);
    } else {
      this.doPong(data, mask, readOnly);
    }
  }

  /**
   * Frames and sends a pong message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Boolean} readOnly Specifies whether `data` can be modified
   * @private
   */
  doPong (data, mask, readOnly) {
    this.sendFrame(Sender.frame(data, {
      fin: true,
      rsv1: false,
      opcode: 0x0a,
      mask,
      readOnly
    }));
  }

  /**
   * Sends a data message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Object} options Options object
   * @param {Boolean} options.compress Specifies whether or not to compress `data`
   * @param {Boolean} options.binary Specifies whether `data` is binary or text
   * @param {Boolean} options.fin Specifies whether the fragment is the last one
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback
   * @public
   */
  send (data, options, cb) {
    var opcode = options.binary ? 2 : 1;
    var rsv1 = options.compress;
    var readOnly = true;

    if (!Buffer.isBuffer(data)) {
      if (data instanceof ArrayBuffer) {
        data = Buffer.from(data);
      } else if (ArrayBuffer.isView(data)) {
        data = viewToBuffer(data);
      } else {
        data = Buffer.from(data);
        readOnly = false;
      }
    }

    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

    if (this._firstFragment) {
      this._firstFragment = false;
      if (rsv1 && perMessageDeflate) {
        rsv1 = data.length >= perMessageDeflate._threshold;
      }
      this._compress = rsv1;
    } else {
      rsv1 = false;
      opcode = 0;
    }

    if (options.fin) this._firstFragment = true;

    if (perMessageDeflate) {
      const opts = {
        fin: options.fin,
        rsv1,
        opcode,
        mask: options.mask,
        readOnly
      };

      if (this._deflating) {
        this.enqueue([this.dispatch, data, this._compress, opts, cb]);
      } else {
        this.dispatch(data, this._compress, opts, cb);
      }
    } else {
      this.sendFrame(Sender.frame(data, {
        fin: options.fin,
        rsv1: false,
        opcode,
        mask: options.mask,
        readOnly
      }), cb);
    }
  }

  /**
   * Dispatches a data message.
   *
   * @param {Buffer} data The message to send
   * @param {Boolean} compress Specifies whether or not to compress `data`
   * @param {Object} options Options object
   * @param {Number} options.opcode The opcode
   * @param {Boolean} options.readOnly Specifies whether `data` can be modified
   * @param {Boolean} options.fin Specifies whether or not to set the FIN bit
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Boolean} options.rsv1 Specifies whether or not to set the RSV1 bit
   * @param {Function} cb Callback
   * @private
   */
  dispatch (data, compress, options, cb) {
    if (!compress) {
      this.sendFrame(Sender.frame(data, options), cb);
      return;
    }

    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

    this._deflating = true;
    perMessageDeflate.compress(data, options.fin, (_, buf) => {
      options.readOnly = false;
      this.sendFrame(Sender.frame(buf, options), cb);
      this._deflating = false;
      this.dequeue();
    });
  }

  /**
   * Executes queued send operations.
   *
   * @private
   */
  dequeue () {
    while (!this._deflating && this._queue.length) {
      const params = this._queue.shift();

      this._bufferedBytes -= params[1].length;
      params[0].apply(this, params.slice(1));
    }
  }

  /**
   * Enqueues a send operation.
   *
   * @param {Array} params Send operation parameters.
   * @private
   */
  enqueue (params) {
    this._bufferedBytes += params[1].length;
    this._queue.push(params);
  }

  /**
   * Sends a frame.
   *
   * @param {Buffer[]} list The frame to send
   * @param {Function} cb Callback
   * @private
   */
  sendFrame (list, cb) {
    if (list.length === 2) {
      this._socket.write(list[0]);
      this._socket.write(list[1], cb);
    } else {
      this._socket.write(list[0], cb);
    }
  }
}

module.exports = Sender;

/**
 * Converts an `ArrayBuffer` view into a buffer.
 *
 * @param {(DataView|TypedArray)} view The view to convert
 * @return {Buffer} Converted view
 * @private
 */
function viewToBuffer (view) {
  const buf = Buffer.from(view.buffer);

  if (view.byteLength !== view.buffer.byteLength) {
    return buf.slice(view.byteOffset, view.byteOffset + view.byteLength);
  }

  return buf;
}

return module.exports;
}
/********** End of module 7: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/Sender.js **********/
/********** Start module 8: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/node_modules/ultron/index.js **********/
__modules[8] = function(module, exports) {
'use strict';

var has = Object.prototype.hasOwnProperty;

/**
 * An auto incrementing id which we can use to create "unique" Ultron instances
 * so we can track the event emitters that are added through the Ultron
 * interface.
 *
 * @type {Number}
 * @private
 */
var id = 0;

/**
 * Ultron is high-intelligence robot. It gathers intelligence so it can start improving
 * upon his rudimentary design. It will learn from your EventEmitting patterns
 * and exterminate them.
 *
 * @constructor
 * @param {EventEmitter} ee EventEmitter instance we need to wrap.
 * @api public
 */
function Ultron(ee) {
  if (!(this instanceof Ultron)) return new Ultron(ee);

  this.id = id++;
  this.ee = ee;
}

/**
 * Register a new EventListener for the given event.
 *
 * @param {String} event Name of the event.
 * @param {Functon} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @returns {Ultron}
 * @api public
 */
Ultron.prototype.on = function on(event, fn, context) {
  fn.__ultron = this.id;
  this.ee.on(event, fn, context);

  return this;
};
/**
 * Add an EventListener that's only called once.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @returns {Ultron}
 * @api public
 */
Ultron.prototype.once = function once(event, fn, context) {
  fn.__ultron = this.id;
  this.ee.once(event, fn, context);

  return this;
};

/**
 * Remove the listeners we assigned for the given event.
 *
 * @returns {Ultron}
 * @api public
 */
Ultron.prototype.remove = function remove() {
  var args = arguments
    , ee = this.ee
    , event;
  if (args.length === 1 && 'string' === typeof args[0]) {
    args = args[0].split(/[, ]+/);
  } else if (!args.length) {
    if (ee.eventNames) {
      args = ee.eventNames();
    } else if (ee._events) {
      args = [];

      for (event in ee._events) {
        if (has.call(ee._events, event)) args.push(event);
      }

      if (Object.getOwnPropertySymbols) {
        args = args.concat(Object.getOwnPropertySymbols(ee._events));
      }
    }
  }

  for (var i = 0; i < args.length; i++) {
    var listeners = ee.listeners(args[i]);

    for (var j = 0; j < listeners.length; j++) {
      event = listeners[j];
      if (event.listener) {
        if (event.listener.__ultron !== this.id) continue;
      } else if (event.__ultron !== this.id) {
        continue;
      }

      ee.removeListener(args[i], event);
    }
  }

  return this;
};

/**
 * Destroy the Ultron instance, remove all listeners and release all references.
 *
 * @returns {Boolean}
 * @api public
 */
Ultron.prototype.destroy = function destroy() {
  if (!this.ee) return false;

  this.remove();
  this.ee = null;

  return true;
};
module.exports = Ultron;

return module.exports;
}
/********** End of module 8: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/node_modules/ultron/index.js **********/
/********** Start module 9: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/PerMessageDeflate.js **********/
__modules[9] = function(module, exports) {
'use strict';

const safeBuffer = __require(13,9);
const Limiter = __require(17,9);
const zlib = require('zlib');

const bufferUtil = __require(15,9);

const Buffer = safeBuffer.Buffer;

const TRAILER = Buffer.from([0x00, 0x00, 0xff, 0xff]);
const EMPTY_BLOCK = Buffer.from([0x00]);

const kWriteInProgress = Symbol('write-in-progress');
const kPendingClose = Symbol('pending-close');
const kTotalLength = Symbol('total-length');
const kCallback = Symbol('callback');
const kBuffers = Symbol('buffers');
const kError = Symbol('error');
const kOwner = Symbol('owner');
let zlibLimiter;

/**
 * Per-message Deflate implementation.
 */
class PerMessageDeflate {
  constructor (options, isServer, maxPayload) {
    this._maxPayload = maxPayload | 0;
    this._options = options || {};
    this._threshold = this._options.threshold !== undefined
      ? this._options.threshold
      : 1024;
    this._isServer = !!isServer;
    this._deflate = null;
    this._inflate = null;

    this.params = null;

    if (!zlibLimiter) {
      const concurrency = this._options.concurrencyLimit !== undefined
        ? this._options.concurrencyLimit
        : 10;
      zlibLimiter = new Limiter({ concurrency });
    }
  }

  static get extensionName () {
    return 'permessage-deflate';
  }

  /**
   * Create extension parameters offer.
   *
   * @return {Object} Extension parameters
   * @public
   */
  offer () {
    const params = {};

    if (this._options.serverNoContextTakeover) {
      params.server_no_context_takeover = true;
    }
    if (this._options.clientNoContextTakeover) {
      params.client_no_context_takeover = true;
    }
    if (this._options.serverMaxWindowBits) {
      params.server_max_window_bits = this._options.serverMaxWindowBits;
    }
    if (this._options.clientMaxWindowBits) {
      params.client_max_window_bits = this._options.clientMaxWindowBits;
    } else if (this._options.clientMaxWindowBits == null) {
      params.client_max_window_bits = true;
    }

    return params;
  }

  /**
   * Accept extension offer.
   *
   * @param {Array} paramsList Extension parameters
   * @return {Object} Accepted configuration
   * @public
   */
  accept (paramsList) {
    paramsList = this.normalizeParams(paramsList);

    var params;
    if (this._isServer) {
      params = this.acceptAsServer(paramsList);
    } else {
      params = this.acceptAsClient(paramsList);
    }

    this.params = params;
    return params;
  }

  /**
   * Releases all resources used by the extension.
   *
   * @public
   */
  cleanup () {
    if (this._inflate) {
      if (this._inflate[kWriteInProgress]) {
        this._inflate[kPendingClose] = true;
      } else {
        this._inflate.close();
        this._inflate = null;
      }
    }
    if (this._deflate) {
      if (this._deflate[kWriteInProgress]) {
        this._deflate[kPendingClose] = true;
      } else {
        this._deflate.close();
        this._deflate = null;
      }
    }
  }

  /**
   * Accept extension offer from client.
   *
   * @param {Array} paramsList Extension parameters
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsServer (paramsList) {
    const accepted = {};
    const result = paramsList.some((params) => {
      if (
        (this._options.serverNoContextTakeover === false &&
          params.server_no_context_takeover) ||
        (this._options.serverMaxWindowBits === false &&
          params.server_max_window_bits) ||
        (typeof this._options.serverMaxWindowBits === 'number' &&
          typeof params.server_max_window_bits === 'number' &&
          this._options.serverMaxWindowBits > params.server_max_window_bits) ||
        (typeof this._options.clientMaxWindowBits === 'number' &&
          !params.client_max_window_bits)
      ) {
        return;
      }

      if (
        this._options.serverNoContextTakeover ||
        params.server_no_context_takeover
      ) {
        accepted.server_no_context_takeover = true;
      }
      if (
        this._options.clientNoContextTakeover ||
        (this._options.clientNoContextTakeover !== false &&
          params.client_no_context_takeover)
      ) {
        accepted.client_no_context_takeover = true;
      }
      if (typeof this._options.serverMaxWindowBits === 'number') {
        accepted.server_max_window_bits = this._options.serverMaxWindowBits;
      } else if (typeof params.server_max_window_bits === 'number') {
        accepted.server_max_window_bits = params.server_max_window_bits;
      }
      if (typeof this._options.clientMaxWindowBits === 'number') {
        accepted.client_max_window_bits = this._options.clientMaxWindowBits;
      } else if (
        this._options.clientMaxWindowBits !== false &&
        typeof params.client_max_window_bits === 'number'
      ) {
        accepted.client_max_window_bits = params.client_max_window_bits;
      }
      return true;
    });

    if (!result) throw new Error("Doesn't support the offered configuration");

    return accepted;
  }

  /**
   * Accept extension response from server.
   *
   * @param {Array} paramsList Extension parameters
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsClient (paramsList) {
    const params = paramsList[0];

    if (this._options.clientNoContextTakeover != null) {
      if (
        this._options.clientNoContextTakeover === false &&
        params.client_no_context_takeover
      ) {
        throw new Error('Invalid value for "client_no_context_takeover"');
      }
    }
    if (this._options.clientMaxWindowBits != null) {
      if (
        this._options.clientMaxWindowBits === false &&
        params.client_max_window_bits
      ) {
        throw new Error('Invalid value for "client_max_window_bits"');
      }
      if (
        typeof this._options.clientMaxWindowBits === 'number' &&
        (!params.client_max_window_bits ||
          params.client_max_window_bits > this._options.clientMaxWindowBits)
      ) {
        throw new Error('Invalid value for "client_max_window_bits"');
      }
    }

    return params;
  }

  /**
   * Normalize extensions parameters.
   *
   * @param {Array} paramsList Extension parameters
   * @return {Array} Normalized extensions parameters
   * @private
   */
  normalizeParams (paramsList) {
    return paramsList.map((params) => {
      Object.keys(params).forEach((key) => {
        var value = params[key];
        if (value.length > 1) {
          throw new Error(`Multiple extension parameters for ${key}`);
        }

        value = value[0];

        switch (key) {
          case 'server_no_context_takeover':
          case 'client_no_context_takeover':
            if (value !== true) {
              throw new Error(`invalid extension parameter value for ${key} (${value})`);
            }
            params[key] = true;
            break;
          case 'server_max_window_bits':
          case 'client_max_window_bits':
            if (typeof value === 'string') {
              value = parseInt(value, 10);
              if (
                Number.isNaN(value) ||
                value < zlib.Z_MIN_WINDOWBITS ||
                value > zlib.Z_MAX_WINDOWBITS
              ) {
                throw new Error(`invalid extension parameter value for ${key} (${value})`);
              }
            }
            if (!this._isServer && value === true) {
              throw new Error(`Missing extension parameter value for ${key}`);
            }
            params[key] = value;
            break;
          default:
            throw new Error(`Not defined extension parameter (${key})`);
        }
      });
      return params;
    });
  }

  /**
   * Decompress data. Concurrency limited by async-limiter.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  decompress (data, fin, callback) {
    zlibLimiter.push((done) => {
      this._decompress(data, fin, (err, result) => {
        done();
        callback(err, result);
      });
    });
  }

  /**
   * Compress data. Concurrency limited by async-limiter.
   *
   * @param {Buffer} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  compress (data, fin, callback) {
    zlibLimiter.push((done) => {
      this._compress(data, fin, (err, result) => {
        done();
        callback(err, result);
      });
    });
  }

  /**
   * Decompress data.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _decompress (data, fin, callback) {
    const endpoint = this._isServer ? 'client' : 'server';

    if (!this._inflate) {
      const key = `${endpoint}_max_window_bits`;
      const windowBits = typeof this.params[key] !== 'number'
        ? zlib.Z_DEFAULT_WINDOWBITS
        : this.params[key];

      this._inflate = zlib.createInflateRaw({ windowBits });
      this._inflate[kTotalLength] = 0;
      this._inflate[kBuffers] = [];
      this._inflate[kOwner] = this;
      this._inflate.on('error', inflateOnError);
      this._inflate.on('data', inflateOnData);
    }

    this._inflate[kCallback] = callback;
    this._inflate[kWriteInProgress] = true;

    this._inflate.write(data);
    if (fin) this._inflate.write(TRAILER);

    this._inflate.flush(() => {
      const err = this._inflate[kError];

      if (err) {
        this._inflate.close();
        this._inflate = null;
        callback(err);
        return;
      }

      const data = bufferUtil.concat(
        this._inflate[kBuffers],
        this._inflate[kTotalLength]
      );

      if (
        (fin && this.params[`${endpoint}_no_context_takeover`]) ||
        this._inflate[kPendingClose]
      ) {
        this._inflate.close();
        this._inflate = null;
      } else {
        this._inflate[kWriteInProgress] = false;
        this._inflate[kTotalLength] = 0;
        this._inflate[kBuffers] = [];
      }

      callback(null, data);
    });
  }

  /**
   * Compress data.
   *
   * @param {Buffer} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _compress (data, fin, callback) {
    if (!data || data.length === 0) {
      process.nextTick(callback, null, EMPTY_BLOCK);
      return;
    }

    const endpoint = this._isServer ? 'server' : 'client';

    if (!this._deflate) {
      const key = `${endpoint}_max_window_bits`;
      const windowBits = typeof this.params[key] !== 'number'
        ? zlib.Z_DEFAULT_WINDOWBITS
        : this.params[key];

      this._deflate = zlib.createDeflateRaw({
        memLevel: this._options.memLevel,
        level: this._options.level,
        flush: zlib.Z_SYNC_FLUSH,
        windowBits
      });

      this._deflate[kTotalLength] = 0;
      this._deflate[kBuffers] = [];
      this._deflate.on('data', deflateOnData);
    }

    this._deflate[kWriteInProgress] = true;

    this._deflate.write(data);
    this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
      var data = bufferUtil.concat(
        this._deflate[kBuffers],
        this._deflate[kTotalLength]
      );

      if (fin) data = data.slice(0, data.length - 4);

      if (
        (fin && this.params[`${endpoint}_no_context_takeover`]) ||
        this._deflate[kPendingClose]
      ) {
        this._deflate.close();
        this._deflate = null;
      } else {
        this._deflate[kWriteInProgress] = false;
        this._deflate[kTotalLength] = 0;
        this._deflate[kBuffers] = [];
      }

      callback(null, data);
    });
  }
}

module.exports = PerMessageDeflate;

/**
 * The listener of the `zlib.DeflateRaw` stream `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function deflateOnData (chunk) {
  this[kBuffers].push(chunk);
  this[kTotalLength] += chunk.length;
}

/**
 * The listener of the `zlib.InflateRaw` stream `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function inflateOnData (chunk) {
  this[kTotalLength] += chunk.length;

  if (
    this[kOwner]._maxPayload < 1 ||
    this[kTotalLength] <= this[kOwner]._maxPayload
  ) {
    this[kBuffers].push(chunk);
    return;
  }

  this[kError] = new Error('max payload size exceeded');
  this[kError].closeCode = 1009;
  this.removeListener('data', inflateOnData);
  this.reset();
}

/**
 * The listener of the `zlib.InflateRaw` stream `'error'` event.
 *
 * @param {Error} err The emitted error
 * @private
 */
function inflateOnError (err) {
  this[kOwner]._inflate = null;
  this[kCallback](err);
}

return module.exports;
}
/********** End of module 9: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/PerMessageDeflate.js **********/
/********** Start module 10: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/EventTarget.js **********/
__modules[10] = function(module, exports) {
'use strict';

/**
 * Class representing an event.
 *
 * @private
 */
class Event {
  /**
   * Create a new `Event`.
   *
   * @param {String} type The name of the event
   * @param {Object} target A reference to the target to which the event was dispatched
   */
  constructor (type, target) {
    this.target = target;
    this.type = type;
  }
}

/**
 * Class representing a message event.
 *
 * @extends Event
 * @private
 */
class MessageEvent extends Event {
  /**
   * Create a new `MessageEvent`.
   *
   * @param {(String|Buffer|ArrayBuffer|Buffer[])} data The received data
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor (data, target) {
    super('message', target);

    this.data = data;
  }
}

/**
 * Class representing a close event.
 *
 * @extends Event
 * @private
 */
class CloseEvent extends Event {
  /**
   * Create a new `CloseEvent`.
   *
   * @param {Number} code The status code explaining why the connection is being closed
   * @param {String} reason A human-readable string explaining why the connection is closing
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor (code, reason, target) {
    super('close', target);

    this.wasClean = code === undefined || code === 1000 || (code >= 3000 && code <= 4999);
    this.reason = reason;
    this.code = code;
  }
}

/**
 * Class representing an open event.
 *
 * @extends Event
 * @private
 */
class OpenEvent extends Event {
  /**
   * Create a new `OpenEvent`.
   *
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor (target) {
    super('open', target);
  }
}

/**
 * This provides methods for emulating the `EventTarget` interface. It's not
 * meant to be used directly.
 *
 * @mixin
 */
const EventTarget = {
  /**
   * Register an event listener.
   *
   * @param {String} method A string representing the event type to listen for
   * @param {Function} listener The listener to add
   * @public
   */
  addEventListener (method, listener) {
    if (typeof listener !== 'function') return;

    function onMessage (data) {
      listener.call(this, new MessageEvent(data, this));
    }

    function onClose (code, message) {
      listener.call(this, new CloseEvent(code, message, this));
    }

    function onError (event) {
      event.type = 'error';
      event.target = this;
      listener.call(this, event);
    }

    function onOpen () {
      listener.call(this, new OpenEvent(this));
    }

    if (method === 'message') {
      onMessage._listener = listener;
      this.on(method, onMessage);
    } else if (method === 'close') {
      onClose._listener = listener;
      this.on(method, onClose);
    } else if (method === 'error') {
      onError._listener = listener;
      this.on(method, onError);
    } else if (method === 'open') {
      onOpen._listener = listener;
      this.on(method, onOpen);
    } else {
      this.on(method, listener);
    }
  },

  /**
   * Remove an event listener.
   *
   * @param {String} method A string representing the event type to remove
   * @param {Function} listener The listener to remove
   * @public
   */
  removeEventListener (method, listener) {
    const listeners = this.listeners(method);

    for (var i = 0; i < listeners.length; i++) {
      if (listeners[i] === listener || listeners[i]._listener === listener) {
        this.removeListener(method, listeners[i]);
      }
    }
  }
};

module.exports = EventTarget;

return module.exports;
}
/********** End of module 10: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/EventTarget.js **********/
/********** Start module 11: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/Extensions.js **********/
__modules[11] = function(module, exports) {
'use strict';

/**
 * Parse the `Sec-WebSocket-Extensions` header into an object.
 *
 * @param {String} value field value of the header
 * @return {Object} The parsed object
 * @public
 */
const parse = (value) => {
  value = value || '';

  const extensions = {};

  value.split(',').forEach((v) => {
    const params = v.split(';');
    const token = params.shift().trim();

    if (extensions[token] === undefined) {
      extensions[token] = [];
    } else if (!extensions.hasOwnProperty(token)) {
      return;
    }

    const parsedParams = {};

    params.forEach((param) => {
      const parts = param.trim().split('=');
      const key = parts[0];
      var value = parts[1];

      if (value === undefined) {
        value = true;
      } else {
        if (value[0] === '"') {
          value = value.slice(1);
        }
        if (value[value.length - 1] === '"') {
          value = value.slice(0, value.length - 1);
        }
      }

      if (parsedParams[key] === undefined) {
        parsedParams[key] = [value];
      } else if (parsedParams.hasOwnProperty(key)) {
        parsedParams[key].push(value);
      }
    });

    extensions[token].push(parsedParams);
  });

  return extensions;
};

/**
 * Serialize a parsed `Sec-WebSocket-Extensions` header to a string.
 *
 * @param {Object} value The object to format
 * @return {String} A string representing the given value
 * @public
 */
const format = (value) => {
  return Object.keys(value).map((token) => {
    var paramsList = value[token];
    if (!Array.isArray(paramsList)) paramsList = [paramsList];
    return paramsList.map((params) => {
      return [token].concat(Object.keys(params).map((k) => {
        var p = params[k];
        if (!Array.isArray(p)) p = [p];
        return p.map((v) => v === true ? k : `${k}=${v}`).join('; ');
      })).join('; ');
    }).join(', ');
  }).join(', ');
};

module.exports = { format, parse };

return module.exports;
}
/********** End of module 11: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/Extensions.js **********/
/********** Start module 12: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/Constants.js **********/
__modules[12] = function(module, exports) {
'use strict';

const safeBuffer = __require(13,12);

const Buffer = safeBuffer.Buffer;

exports.BINARY_TYPES = ['nodebuffer', 'arraybuffer', 'fragments'];
exports.GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
exports.EMPTY_BUFFER = Buffer.alloc(0);
exports.NOOP = () => {};

return module.exports;
}
/********** End of module 12: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/Constants.js **********/
/********** Start module 13: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/safe-buffer/index.js **********/
__modules[13] = function(module, exports) {
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

return module.exports;
}
/********** End of module 13: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/safe-buffer/index.js **********/
/********** Start module 14: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/Validation.js **********/
__modules[14] = function(module, exports) {
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

'use strict';

try {
  const isValidUTF8 = __require(18,14);

  module.exports = typeof isValidUTF8 === 'object'
    ? isValidUTF8.Validation.isValidUTF8 // utf-8-validate@<3.0.0
    : isValidUTF8;
} catch (e) /* istanbul ignore next */ {
  module.exports = () => true;
}

return module.exports;
}
/********** End of module 14: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/Validation.js **********/
/********** Start module 15: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/BufferUtil.js **********/
__modules[15] = function(module, exports) {
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

'use strict';

const safeBuffer = __require(13,15);

const Buffer = safeBuffer.Buffer;

/**
 * Merges an array of buffers into a new buffer.
 *
 * @param {Buffer[]} list The array of buffers to concat
 * @param {Number} totalLength The total length of buffers in the list
 * @return {Buffer} The resulting buffer
 * @public
 */
const concat = (list, totalLength) => {
  const target = Buffer.allocUnsafe(totalLength);
  var offset = 0;

  for (var i = 0; i < list.length; i++) {
    const buf = list[i];
    buf.copy(target, offset);
    offset += buf.length;
  }

  return target;
};

try {
  const bufferUtil = __require(19,15);

  module.exports = Object.assign({ concat }, bufferUtil.BufferUtil || bufferUtil);
} catch (e) /* istanbul ignore next */ {
  /**
   * Masks a buffer using the given mask.
   *
   * @param {Buffer} source The buffer to mask
   * @param {Buffer} mask The mask to use
   * @param {Buffer} output The buffer where to store the result
   * @param {Number} offset The offset at which to start writing
   * @param {Number} length The number of bytes to mask.
   * @public
   */
  const mask = (source, mask, output, offset, length) => {
    for (var i = 0; i < length; i++) {
      output[offset + i] = source[i] ^ mask[i & 3];
    }
  };

  /**
   * Unmasks a buffer using the given mask.
   *
   * @param {Buffer} buffer The buffer to unmask
   * @param {Buffer} mask The mask to use
   * @public
   */
  const unmask = (buffer, mask) => {
    const length = buffer.length;
    for (var i = 0; i < length; i++) {
      buffer[i] ^= mask[i & 3];
    }
  };

  module.exports = { concat, mask, unmask };
}

return module.exports;
}
/********** End of module 15: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/BufferUtil.js **********/
/********** Start module 16: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/ErrorCodes.js **********/
__modules[16] = function(module, exports) {
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

'use strict';

module.exports = {
  isValidErrorCode: function (code) {
    return (code >= 1000 && code <= 1013 && code !== 1004 && code !== 1005 && code !== 1006) ||
      (code >= 3000 && code <= 4999);
  },
  1000: 'normal',
  1001: 'going away',
  1002: 'protocol error',
  1003: 'unsupported data',
  1004: 'reserved',
  1005: 'reserved for extensions',
  1006: 'reserved for extensions',
  1007: 'inconsistent or invalid data',
  1008: 'policy violation',
  1009: 'message too big',
  1010: 'extension handshake missing',
  1011: 'an unexpected condition prevented the request from being fulfilled',
  1012: 'service restart',
  1013: 'try again later'
};

return module.exports;
}
/********** End of module 16: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/ws/lib/ErrorCodes.js **********/
/********** Start module 17: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/async-limiter/index.js **********/
__modules[17] = function(module, exports) {
'use strict';

function Queue(options) {
  if (!(this instanceof Queue)) {
    return new Queue(options);
  }

  options = options || {};
  this.concurrency = options.concurrency || Infinity;
  this.pending = 0;
  this.jobs = [];
  this.cbs = [];
  this._done = done.bind(this);
}

var arrayAddMethods = [
  'push',
  'unshift',
  'splice'
];

arrayAddMethods.forEach(function(method) {
  Queue.prototype[method] = function() {
    var methodResult = Array.prototype[method].apply(this.jobs, arguments);
    this._run();
    return methodResult;
  };
});

Object.defineProperty(Queue.prototype, 'length', {
  get: function() {
    return this.pending + this.jobs.length;
  }
});

Queue.prototype._run = function() {
  if (this.pending === this.concurrency) {
    return;
  }
  if (this.jobs.length) {
    var job = this.jobs.shift();
    this.pending++;
    job(this._done);
    this._run();
  }

  if (this.pending === 0) {
    while (this.cbs.length !== 0) {
      var cb = this.cbs.pop();
      process.nextTick(cb);
    }
  }
};

Queue.prototype.onDone = function(cb) {
  if (typeof cb === 'function') {
    this.cbs.push(cb);
    this._run();
  }
};

function done() {
  this.pending--;
  this._run();
}

module.exports = Queue;

return module.exports;
}
/********** End of module 17: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/async-limiter/index.js **********/
/********** Start module 18: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/utf-8-validate/index.js **********/
__modules[18] = function(module, exports) {
'use strict';

try {
  module.exports = __require(20,18)('validation');
} catch (e) {
  module.exports = __require(21,18);
}

return module.exports;
}
/********** End of module 18: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/utf-8-validate/index.js **********/
/********** Start module 19: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/bufferutil/index.js **********/
__modules[19] = function(module, exports) {
'use strict';

try {
  module.exports = __require(20,19)('bufferutil');
} catch (e) {
  module.exports = __require(22,19);
}

return module.exports;
}
/********** End of module 19: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/bufferutil/index.js **********/
/********** Start module 20: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/bindings/bindings.js **********/
__modules[20] = function(module, exports) {

/**
 * Module dependencies.
 */

var fs = require('fs')
  , path = require('path')
  , join = path.join
  , dirname = path.dirname
  , exists = ((fs.accessSync && function (path) { try { fs.accessSync(path); } catch (e) { return false; } return true; })
      || fs.existsSync || path.existsSync)
  , defaults = {
        arrow: process.env.NODE_BINDINGS_ARROW || ' → '
      , compiled: process.env.NODE_BINDINGS_COMPILED_DIR || 'compiled'
      , platform: process.platform
      , arch: process.arch
      , version: process.versions.node
      , bindings: 'bindings.node'
      , try: [
          [ 'module_root', 'build', 'bindings' ]
        , [ 'module_root', 'build', 'Debug', 'bindings' ]
        , [ 'module_root', 'build', 'Release', 'bindings' ]
        , [ 'module_root', 'out', 'Debug', 'bindings' ]
        , [ 'module_root', 'Debug', 'bindings' ]
        , [ 'module_root', 'out', 'Release', 'bindings' ]
        , [ 'module_root', 'Release', 'bindings' ]
        , [ 'module_root', 'build', 'default', 'bindings' ]
        , [ 'module_root', 'compiled', 'version', 'platform', 'arch', 'bindings' ]
        ]
    }

/**
 * The main `bindings()` function loads the compiled bindings for a given module.
 * It uses V8's Error API to determine the parent filename that this function is
 * being invoked from, which is then used to find the root directory.
 */

function bindings (opts) {
  if (typeof opts == 'string') {
    opts = { bindings: opts }
  } else if (!opts) {
    opts = {}
  }
  Object.keys(defaults).map(function(i) {
    if (!(i in opts)) opts[i] = defaults[i];
  });
  if (!opts.module_root) {
    opts.module_root = exports.getRoot(exports.getFileName())
  }
  if (path.extname(opts.bindings) != '.node') {
    opts.bindings += '.node'
  }

  var tries = []
    , i = 0
    , l = opts.try.length
    , n
    , b
    , err

  for (; i<l; i++) {
    n = join.apply(null, opts.try[i].map(function (p) {
      return opts[p] || p
    }))
    tries.push(n)
    try {
      b = opts.path ? require.resolve(n) : require(n)
      if (!opts.path) {
        b.path = n
      }
      return b
    } catch (e) {
      if (!/not find/i.test(e.message)) {
        throw e
      }
    }
  }

  err = new Error('Could not locate the bindings file. Tried:\n'
    + tries.map(function (a) { return opts.arrow + a }).join('\n'))
  err.tries = tries
  throw err
}
module.exports = exports = bindings


/**
 * Gets the filename of the JavaScript file that invokes this function.
 * Used to help find the root directory of a module.
 * Optionally accepts an filename argument to skip when searching for the invoking filename
 */

exports.getFileName = function getFileName (calling_file) {
  var origPST = Error.prepareStackTrace
    , origSTL = Error.stackTraceLimit
    , dummy = {}
    , fileName

  Error.stackTraceLimit = 10

  Error.prepareStackTrace = function (e, st) {
    for (var i=0, l=st.length; i<l; i++) {
      fileName = st[i].getFileName()
      if (fileName !== __getFilename("../../node_modules/bindings/bindings.js")) {
        if (calling_file) {
            if (fileName !== calling_file) {
              return
            }
        } else {
          return
        }
      }
    }
  }
  Error.captureStackTrace(dummy)
  dummy.stack
  Error.prepareStackTrace = origPST
  Error.stackTraceLimit = origSTL

  return fileName
}

/**
 * Gets the root directory of a module, given an arbitrary filename
 * somewhere in the module tree. The "root directory" is the directory
 * containing the `package.json` file.
 *
 *   In:  /home/nate/node-native-module/lib/index.js
 *   Out: /home/nate/node-native-module
 */

exports.getRoot = function getRoot (file) {
  var dir = dirname(file)
    , prev
  while (true) {
    if (dir === '.') {
      dir = process.cwd()
    }
    if (exists(join(dir, 'package.json')) || exists(join(dir, 'node_modules'))) {
      return dir
    }
    if (prev === dir) {
      throw new Error('Could not find module root given file: "' + file
                    + '". Do you have a `package.json` file? ')
    }
    prev = dir
    dir = join(dir, '..')
  }
}

return module.exports;
}
/********** End of module 20: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/bindings/bindings.js **********/
/********** Start module 21: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/utf-8-validate/fallback.js **********/
__modules[21] = function(module, exports) {
/*!
 * UTF-8 validate: UTF-8 validation for WebSockets.
 * Copyright(c) 2015 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

'use strict';

/**
 * Checks if a given buffer contains only correct UTF-8.
 * Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
 * Markus Kuhn.
 *
 * @param {Buffer} buf The buffer to check
 * @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
 * @public
 */
const isValidUTF8 = (buf) => {
  if (!Buffer.isBuffer(buf)) {
    throw new TypeError('First argument needs to be a buffer');
  }

  var len = buf.length;
  var i = 0;

  while (i < len) {
    if (buf[i] < 0x80) {  // 0xxxxxxx
      i++;
    } else if ((buf[i] & 0xe0) === 0xc0) {  // 110xxxxx 10xxxxxx
      if (
        i + 1 === len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i] & 0xfe) === 0xc0  // overlong
      ) {
        return false;
      } else {
        i += 2;
      }
    } else if ((buf[i] & 0xf0) === 0xe0) {  // 1110xxxx 10xxxxxx 10xxxxxx
      if (
        i + 2 >= len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i + 2] & 0xc0) !== 0x80 ||
        buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80 ||  // overlong
        buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0     // surrogate (U+D800 - U+DFFF)
      ) {
        return false;
      } else {
        i += 3;
      }
    } else if ((buf[i] & 0xf8) === 0xf0) {  // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      if (
        i + 3 >= len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i + 2] & 0xc0) !== 0x80 ||
        (buf[i + 3] & 0xc0) !== 0x80 ||
        buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80 ||  // overlong
        buf[i] === 0xf4 && buf[i + 1] > 0x8f || buf[i] > 0xf4  // > U+10FFFF
      ) {
        return false;
      } else {
        i += 4;
      }
    } else {
      return false;
    }
  }

  return true;
};

module.exports = isValidUTF8;

return module.exports;
}
/********** End of module 21: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/utf-8-validate/fallback.js **********/
/********** Start module 22: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/bufferutil/fallback.js **********/
__modules[22] = function(module, exports) {
/*!
 * bufferutil: WebSocket buffer utils
 * Copyright(c) 2015 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

'use strict';

/**
 * Masks a buffer using the given mask.
 *
 * @param {Buffer} source The buffer to mask
 * @param {Buffer} mask The mask to use
 * @param {Buffer} output The buffer where to store the result
 * @param {Number} offset The offset at which to start writing
 * @param {Number} length The number of bytes to mask.
 * @public
 */
const mask = (source, mask, output, offset, length) => {
  for (var i = 0; i < length; i++) {
    output[offset + i] = source[i] ^ mask[i & 3];
  }
};

/**
 * Unmasks a buffer using the given mask.
 *
 * @param {Buffer} buffer The buffer to unmask
 * @param {Buffer} mask The mask to use
 * @public
 */
const unmask = (buffer, mask) => {
  const length = buffer.length;
  for (var i = 0; i < length; i++) {
    buffer[i] ^= mask[i & 3];
  }
};

module.exports = { mask, unmask };

return module.exports;
}
/********** End of module 22: /Users/matstijl/development/repositories/github/stil4m/elm-analyse/node_modules/bufferutil/fallback.js **********/
/********** Footer **********/
if(typeof module === "object")
	module.exports = __require(0);
else
	return __require(0);
})();
/********** End of footer **********/
