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



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

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


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
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


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
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
	if (region.J.aW === region.bH.aW)
	{
		return 'on line ' + region.J.aW;
	}
	return 'on lines ' + region.J.aW + ' through ' + region.bH.aW;
}



// EQUALITY

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

	/**_UNUSED/
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
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

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



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
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


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

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


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
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



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


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



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
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


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

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


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

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


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
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



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

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


// DECODING OBJECTS

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


// DECODE

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
			// TODO test perf of Object.keys and switch when support is good enough
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


// EQUALITY

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


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

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



// TASKS

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


// PROCESSES

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




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.fY,
		impl.gO,
		impl.gA,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
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



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
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



// ROUTING


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



// BAGS


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



// PIPE BAGS INTO EFFECT MANAGERS


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



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


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

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
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



// INCOMING PORTS


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

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

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



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
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


function _Platform_export_UNUSED(exports)
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



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.f7) { flags += 'm'; }
	if (options.fl) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

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



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $elm$core$List$cons = _List_cons;
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
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
			if (t.$ === -2) {
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
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
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
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
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
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
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
		return {$: 0, a: a, b: b, c: c, d: d};
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
	return {$: 1, a: a};
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
	return {$: 0, a: a};
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
		if (!builder.i) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.l),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.l);
		} else {
			var treeLen = builder.i * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.m) : builder.m;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.i);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.l) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.l);
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
					{m: nodeList, i: (len / $elm$core$Array$branchFactor) | 0, l: tail});
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
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$project_metadata_utils$Elm$Project$Application = function (a) {
	return {$: 0, a: a};
};
var $author$project$Analyser$Finished = {$: 4};
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$project_metadata_utils$Elm$Project$Package = function (a) {
	return {$: 1, a: a};
};
var $elm$project_metadata_utils$Elm$Project$ApplicationInfo = F6(
	function (elm, dirs, depsDirect, depsIndirect, testDepsDirect, testDepsIndirect) {
		return {fB: depsDirect, fC: depsIndirect, fF: dirs, fI: elm, gF: testDepsDirect, gG: testDepsIndirect};
	});
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
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$project_metadata_utils$Elm$Version$Version = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$core$Basics$ge = _Utils_ge;
var $elm$project_metadata_utils$Elm$Version$checkNumbers = F3(
	function (major, minor, patch) {
		return ((major >= 0) && ((minor >= 0) && (patch >= 0))) ? $elm$core$Maybe$Just(
			A3($elm$project_metadata_utils$Elm$Version$Version, major, minor, patch)) : $elm$core$Maybe$Nothing;
	});
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
var $elm$core$String$toInt = _String_toInt;
var $elm$project_metadata_utils$Elm$Version$fromString = function (string) {
	var _v0 = A2(
		$elm$core$List$map,
		$elm$core$String$toInt,
		A2($elm$core$String$split, '.', string));
	if ((((((_v0.b && (!_v0.a.$)) && _v0.b.b) && (!_v0.b.a.$)) && _v0.b.b.b) && (!_v0.b.b.a.$)) && (!_v0.b.b.b.b)) {
		var major = _v0.a.a;
		var _v1 = _v0.b;
		var minor = _v1.a.a;
		var _v2 = _v1.b;
		var patch = _v2.a.a;
		return A3($elm$project_metadata_utils$Elm$Version$checkNumbers, major, minor, patch);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$project_metadata_utils$Elm$Version$decoderHelp = function (string) {
	var _v0 = $elm$project_metadata_utils$Elm$Version$fromString(string);
	if (!_v0.$) {
		var version = _v0.a;
		return $elm$json$Json$Decode$succeed(version);
	} else {
		return $elm$json$Json$Decode$fail('I need a valid version like \"2.0.1\"');
	}
};
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$project_metadata_utils$Elm$Version$decoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$Version$decoderHelp, $elm$json$Json$Decode$string);
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$project_metadata_utils$Elm$Package$Name = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$String$any = _String_any;
var $elm$core$String$contains = _String_contains;
var $elm$project_metadata_utils$Elm$Package$isBadChar = function (_char) {
	return $elm$core$Char$isUpper(_char) || ((_char === '.') || (_char === '_'));
};
var $elm$core$Basics$not = _Basics_not;
var $elm$core$String$startsWith = _String_startsWith;
var $elm$project_metadata_utils$Elm$Package$isBadProjectName = function (project) {
	var _v0 = $elm$core$String$uncons(project);
	if (_v0.$ === 1) {
		return true;
	} else {
		var _v1 = _v0.a;
		var c = _v1.a;
		return A2($elm$core$String$contains, '--', project) || (A2($elm$core$String$any, $elm$project_metadata_utils$Elm$Package$isBadChar, project) || (A2($elm$core$String$startsWith, '-', project) || (!$elm$core$Char$isLower(c))));
	}
};
var $elm$project_metadata_utils$Elm$Package$fromString = function (string) {
	var _v0 = A2($elm$core$String$split, '/', string);
	if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
		var author = _v0.a;
		var _v1 = _v0.b;
		var project = _v1.a;
		return $elm$project_metadata_utils$Elm$Package$isBadProjectName(project) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
			A2($elm$project_metadata_utils$Elm$Package$Name, author, project));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$project_metadata_utils$Elm$Project$verifyDepNames = F2(
	function (revDeps, pairs) {
		verifyDepNames:
		while (true) {
			if (!pairs.b) {
				return $elm$json$Json$Decode$succeed(
					$elm$core$List$reverse(revDeps));
			} else {
				var _v1 = pairs.a;
				var key = _v1.a;
				var con = _v1.b;
				var otherPairs = pairs.b;
				var _v2 = $elm$project_metadata_utils$Elm$Package$fromString(key);
				if (!_v2.$) {
					var pkg = _v2.a;
					var $temp$revDeps = A2(
						$elm$core$List$cons,
						_Utils_Tuple2(pkg, con),
						revDeps),
						$temp$pairs = otherPairs;
					revDeps = $temp$revDeps;
					pairs = $temp$pairs;
					continue verifyDepNames;
				} else {
					return $elm$json$Json$Decode$fail('\"' + (key + '\" is not a valid package name.'));
				}
			}
		}
	});
var $elm$project_metadata_utils$Elm$Project$depsDecoder = function (constraintDecoder) {
	return A2(
		$elm$json$Json$Decode$andThen,
		$elm$project_metadata_utils$Elm$Project$verifyDepNames(_List_Nil),
		$elm$json$Json$Decode$keyValuePairs(constraintDecoder));
};
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$map6 = _Json_map6;
var $elm$project_metadata_utils$Elm$Project$applicationDecoder = A7(
	$elm$json$Json$Decode$map6,
	$elm$project_metadata_utils$Elm$Project$ApplicationInfo,
	A2($elm$json$Json$Decode$field, 'elm-version', $elm$project_metadata_utils$Elm$Version$decoder),
	A2(
		$elm$json$Json$Decode$field,
		'source-directories',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['dependencies', 'direct']),
		$elm$project_metadata_utils$Elm$Project$depsDecoder($elm$project_metadata_utils$Elm$Version$decoder)),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['dependencies', 'indirect']),
		$elm$project_metadata_utils$Elm$Project$depsDecoder($elm$project_metadata_utils$Elm$Version$decoder)),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['test-dependencies', 'direct']),
		$elm$project_metadata_utils$Elm$Project$depsDecoder($elm$project_metadata_utils$Elm$Version$decoder)),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['test-dependencies', 'indirect']),
		$elm$project_metadata_utils$Elm$Project$depsDecoder($elm$project_metadata_utils$Elm$Version$decoder)));
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$project_metadata_utils$Elm$Project$PackageInfo = F8(
	function (name, summary, license, version, exposed, deps, testDeps, elm) {
		return {fA: deps, fI: elm, d3: exposed, eq: license, f8: name, eV: summary, eY: testDeps, p: version};
	});
var $elm$project_metadata_utils$Elm$Constraint$Constraint = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$project_metadata_utils$Elm$Version$compare = F2(
	function (_v0, _v1) {
		var major1 = _v0.a;
		var minor1 = _v0.b;
		var patch1 = _v0.c;
		var major2 = _v1.a;
		var minor2 = _v1.b;
		var patch2 = _v1.c;
		var _v2 = A2($elm$core$Basics$compare, major1, major2);
		switch (_v2) {
			case 0:
				return 0;
			case 2:
				return 2;
			default:
				var _v3 = A2($elm$core$Basics$compare, minor1, minor2);
				switch (_v3) {
					case 0:
						return 0;
					case 1:
						return A2($elm$core$Basics$compare, patch1, patch2);
					default:
						return 2;
				}
		}
	});
var $elm$project_metadata_utils$Elm$Constraint$checkConstraint = function (constraint) {
	var lower = constraint.a;
	var upper = constraint.d;
	var _v0 = A2($elm$project_metadata_utils$Elm$Version$compare, lower, upper);
	switch (_v0) {
		case 0:
			return $elm$core$Maybe$Just(constraint);
		case 1:
			return $elm$core$Maybe$Just(constraint);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Maybe$map4 = F5(
	function (func, ma, mb, mc, md) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				if (mc.$ === 1) {
					return $elm$core$Maybe$Nothing;
				} else {
					var c = mc.a;
					if (md.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var d = md.a;
						return $elm$core$Maybe$Just(
							A4(func, a, b, c, d));
					}
				}
			}
		}
	});
var $elm$project_metadata_utils$Elm$Constraint$LessOrEq = 1;
var $elm$project_metadata_utils$Elm$Constraint$LessThan = 0;
var $elm$project_metadata_utils$Elm$Constraint$opFromString = function (op) {
	switch (op) {
		case '<':
			return $elm$core$Maybe$Just(0);
		case '<=':
			return $elm$core$Maybe$Just(1);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $elm$project_metadata_utils$Elm$Constraint$fromString = function (string) {
	var _v0 = A2($elm$core$String$split, ' ', string);
	if ((((((_v0.b && _v0.b.b) && _v0.b.b.b) && (_v0.b.b.a === 'v')) && _v0.b.b.b.b) && _v0.b.b.b.b.b) && (!_v0.b.b.b.b.b.b)) {
		var lower = _v0.a;
		var _v1 = _v0.b;
		var lop = _v1.a;
		var _v2 = _v1.b;
		var _v3 = _v2.b;
		var uop = _v3.a;
		var _v4 = _v3.b;
		var upper = _v4.a;
		return A2(
			$elm$core$Maybe$andThen,
			$elm$project_metadata_utils$Elm$Constraint$checkConstraint,
			A5(
				$elm$core$Maybe$map4,
				$elm$project_metadata_utils$Elm$Constraint$Constraint,
				$elm$project_metadata_utils$Elm$Version$fromString(lower),
				$elm$project_metadata_utils$Elm$Constraint$opFromString(lop),
				$elm$project_metadata_utils$Elm$Constraint$opFromString(uop),
				$elm$project_metadata_utils$Elm$Version$fromString(upper)));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$project_metadata_utils$Elm$Constraint$decoderHelp = function (string) {
	var _v0 = $elm$project_metadata_utils$Elm$Constraint$fromString(string);
	if (!_v0.$) {
		var constraint = _v0.a;
		return $elm$json$Json$Decode$succeed(constraint);
	} else {
		return $elm$json$Json$Decode$fail('I need a valid constraint like \"1.0.0 <= v < 2.0.0\"');
	}
};
var $elm$project_metadata_utils$Elm$Constraint$decoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$Constraint$decoderHelp, $elm$json$Json$Decode$string);
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
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
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
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
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
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
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
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
var $elm$project_metadata_utils$Elm$License$License = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$project_metadata_utils$Elm$License$osiApprovedSpdxLicenses = _List_fromArray(
	[
		A2($elm$project_metadata_utils$Elm$License$License, 'AFL-1.1', 'Academic Free License v1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'AFL-1.2', 'Academic Free License v1.2'),
		A2($elm$project_metadata_utils$Elm$License$License, 'AFL-2.0', 'Academic Free License v2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'AFL-2.1', 'Academic Free License v2.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'AFL-3.0', 'Academic Free License v3.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'APL-1.0', 'Adaptive Public License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Apache-1.1', 'Apache License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Apache-2.0', 'Apache License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'APSL-1.0', 'Apple Public Source License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'APSL-1.1', 'Apple Public Source License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'APSL-1.2', 'Apple Public Source License 1.2'),
		A2($elm$project_metadata_utils$Elm$License$License, 'APSL-2.0', 'Apple Public Source License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Artistic-1.0', 'Artistic License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Artistic-1.0-Perl', 'Artistic License 1.0 (Perl)'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Artistic-1.0-cl8', 'Artistic License 1.0 w/clause 8'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Artistic-2.0', 'Artistic License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'AAL', 'Attribution Assurance License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'BSL-1.0', 'Boost Software License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'BSD-2-Clause', 'BSD 2-clause \"Simplified\" License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'BSD-3-Clause', 'BSD 3-clause \"New\" or \"Revised\" License'),
		A2($elm$project_metadata_utils$Elm$License$License, '0BSD', 'BSD Zero Clause License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CECILL-2.1', 'CeCILL Free Software License Agreement v2.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CNRI-Python', 'CNRI Python License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CDDL-1.0', 'Common Development and Distribution License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CPAL-1.0', 'Common Public Attribution License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CPL-1.0', 'Common Public License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CATOSL-1.1', 'Computer Associates Trusted Open Source License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CUA-OPL-1.0', 'CUA Office Public License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'EPL-1.0', 'Eclipse Public License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'ECL-1.0', 'Educational Community License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'ECL-2.0', 'Educational Community License v2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'EFL-1.0', 'Eiffel Forum License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'EFL-2.0', 'Eiffel Forum License v2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Entessa', 'Entessa Public License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'EUDatagrid', 'EU DataGrid Software License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'EUPL-1.1', 'European Union Public License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Fair', 'Fair License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Frameworx-1.0', 'Frameworx Open License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'AGPL-3.0', 'GNU Affero General Public License v3.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'GPL-2.0', 'GNU General Public License v2.0 only'),
		A2($elm$project_metadata_utils$Elm$License$License, 'GPL-3.0', 'GNU General Public License v3.0 only'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LGPL-2.1', 'GNU Lesser General Public License v2.1 only'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LGPL-3.0', 'GNU Lesser General Public License v3.0 only'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LGPL-2.0', 'GNU Library General Public License v2 only'),
		A2($elm$project_metadata_utils$Elm$License$License, 'HPND', 'Historic Permission Notice and Disclaimer'),
		A2($elm$project_metadata_utils$Elm$License$License, 'IPL-1.0', 'IBM Public License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Intel', 'Intel Open Source License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'IPA', 'IPA Font License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'ISC', 'ISC License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LPPL-1.3c', 'LaTeX Project Public License v1.3c'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LiLiQ-P-1.1', 'Licence Libre du Québec – Permissive version 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LiLiQ-Rplus-1.1', 'Licence Libre du Québec – Réciprocité forte version 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LiLiQ-R-1.1', 'Licence Libre du Québec – Réciprocité version 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LPL-1.02', 'Lucent Public License v1.02'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LPL-1.0', 'Lucent Public License Version 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MS-PL', 'Microsoft Public License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MS-RL', 'Microsoft Reciprocal License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MirOS', 'MirOS Licence'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MIT', 'MIT License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Motosoto', 'Motosoto License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MPL-1.0', 'Mozilla Public License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MPL-1.1', 'Mozilla Public License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MPL-2.0', 'Mozilla Public License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MPL-2.0-no-copyleft-exception', 'Mozilla Public License 2.0 (no copyleft exception)'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Multics', 'Multics License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'NASA-1.3', 'NASA Open Source Agreement 1.3'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Naumen', 'Naumen Public License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'NGPL', 'Nethack General Public License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Nokia', 'Nokia Open Source License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'NPOSL-3.0', 'Non-Profit Open Software License 3.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'NTP', 'NTP License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OCLC-2.0', 'OCLC Research Public License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OGTSL', 'Open Group Test Suite License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OSL-1.0', 'Open Software License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OSL-2.0', 'Open Software License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OSL-2.1', 'Open Software License 2.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OSL-3.0', 'Open Software License 3.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OSET-PL-2.1', 'OSET Public License version 2.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'PHP-3.0', 'PHP License v3.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'PostgreSQL', 'PostgreSQL License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Python-2.0', 'Python License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'QPL-1.0', 'Q Public License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'RPSL-1.0', 'RealNetworks Public Source License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'RPL-1.1', 'Reciprocal Public License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'RPL-1.5', 'Reciprocal Public License 1.5'),
		A2($elm$project_metadata_utils$Elm$License$License, 'RSCPL', 'Ricoh Source Code Public License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OFL-1.1', 'SIL Open Font License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'SimPL-2.0', 'Simple Public License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Sleepycat', 'Sleepycat License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'SISSL', 'Sun Industry Standards Source License v1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'SPL-1.0', 'Sun Public License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Watcom-1.0', 'Sybase Open Watcom Public License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'UPL-1.0', 'Universal Permissive License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'NCSA', 'University of Illinois/NCSA Open Source License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'VSL-1.0', 'Vovida Software License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'W3C', 'W3C Software Notice and License (2002-12-31)'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Xnet', 'X.Net License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Zlib', 'zlib License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'ZPL-2.0', 'Zope Public License 2.0')
	]);
var $elm$project_metadata_utils$Elm$License$spdxDict = $elm$core$Dict$fromList(
	A2(
		$elm$core$List$map,
		function (license) {
			var abbr = license.a;
			return _Utils_Tuple2(abbr, license);
		},
		$elm$project_metadata_utils$Elm$License$osiApprovedSpdxLicenses));
var $elm$project_metadata_utils$Elm$License$fromString = function (string) {
	return A2($elm$core$Dict$get, string, $elm$project_metadata_utils$Elm$License$spdxDict);
};
var $elm$project_metadata_utils$Elm$License$decoderHelp = function (string) {
	var _v0 = $elm$project_metadata_utils$Elm$License$fromString(string);
	if (!_v0.$) {
		var license = _v0.a;
		return $elm$json$Json$Decode$succeed(license);
	} else {
		return $elm$json$Json$Decode$fail('I need an OSI approved license in SPDX format <https://spdx.org/licenses/>');
	}
};
var $elm$project_metadata_utils$Elm$License$decoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$License$decoderHelp, $elm$json$Json$Decode$string);
var $elm$project_metadata_utils$Elm$Package$decoderHelp = function (string) {
	var _v0 = $elm$project_metadata_utils$Elm$Package$fromString(string);
	if (!_v0.$) {
		var name = _v0.a;
		return $elm$json$Json$Decode$succeed(name);
	} else {
		return $elm$json$Json$Decode$fail('I need a valid package name like \"elm/core\"');
	}
};
var $elm$project_metadata_utils$Elm$Package$decoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$Package$decoderHelp, $elm$json$Json$Decode$string);
var $elm$project_metadata_utils$Elm$Project$ExposedDict = function (a) {
	return {$: 1, a: a};
};
var $elm$project_metadata_utils$Elm$Project$ExposedList = function (a) {
	return {$: 0, a: a};
};
var $elm$core$String$length = _String_length;
var $elm$project_metadata_utils$Elm$Project$checkHeaders = function (dict) {
	checkHeaders:
	while (true) {
		if (!dict.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v1 = dict.a;
			var header = _v1.a;
			var others = dict.b;
			if ($elm$core$String$length(header) < 20) {
				var $temp$dict = others;
				dict = $temp$dict;
				continue checkHeaders;
			} else {
				return $elm$core$Maybe$Just(header);
			}
		}
	}
};
var $elm$project_metadata_utils$Elm$Project$checkExposedDict = function (dict) {
	var _v0 = $elm$project_metadata_utils$Elm$Project$checkHeaders(dict);
	if (_v0.$ === 1) {
		return $elm$json$Json$Decode$succeed(dict);
	} else {
		var badHeader = _v0.a;
		return $elm$json$Json$Decode$fail('The \"' + (badHeader + '\" header is too long. Twenty characters max!'));
	}
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$project_metadata_utils$Elm$Module$Name = $elm$core$Basics$identity;
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
var $elm$project_metadata_utils$Elm$Module$isGoodChunk = function (chunk) {
	var _v0 = $elm$core$String$uncons(chunk);
	if (_v0.$ === 1) {
		return false;
	} else {
		var _v1 = _v0.a;
		var _char = _v1.a;
		var rest = _v1.b;
		return $elm$core$Char$isUpper(_char) && A2($elm$core$String$all, $elm$core$Char$isAlpha, rest);
	}
};
var $elm$project_metadata_utils$Elm$Module$fromString = function (string) {
	return A2(
		$elm$core$List$all,
		$elm$project_metadata_utils$Elm$Module$isGoodChunk,
		A2($elm$core$String$split, '.', string)) ? $elm$core$Maybe$Just(string) : $elm$core$Maybe$Nothing;
};
var $elm$project_metadata_utils$Elm$Module$decoderHelp = function (string) {
	var _v0 = $elm$project_metadata_utils$Elm$Module$fromString(string);
	if (!_v0.$) {
		var name = _v0.a;
		return $elm$json$Json$Decode$succeed(name);
	} else {
		return $elm$json$Json$Decode$fail('I need a valid module name like \"Json.Decode\"');
	}
};
var $elm$project_metadata_utils$Elm$Module$decoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$Module$decoderHelp, $elm$json$Json$Decode$string);
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$project_metadata_utils$Elm$Project$exposedDecoder = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$json$Json$Decode$map,
			$elm$project_metadata_utils$Elm$Project$ExposedList,
			$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Module$decoder)),
			A2(
			$elm$json$Json$Decode$map,
			$elm$project_metadata_utils$Elm$Project$ExposedDict,
			A2(
				$elm$json$Json$Decode$andThen,
				$elm$project_metadata_utils$Elm$Project$checkExposedDict,
				$elm$json$Json$Decode$keyValuePairs(
					$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Module$decoder))))
		]));
var $elm$json$Json$Decode$map8 = _Json_map8;
var $elm$project_metadata_utils$Elm$Project$summaryCheck = function (summary) {
	return ($elm$core$String$length(summary) < 80) ? $elm$json$Json$Decode$succeed(summary) : $elm$json$Json$Decode$fail('The \"summary\" field must have fewer than 80 characters.');
};
var $elm$project_metadata_utils$Elm$Project$summaryDecoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$Project$summaryCheck, $elm$json$Json$Decode$string);
var $elm$project_metadata_utils$Elm$Project$packageDecoder = A9(
	$elm$json$Json$Decode$map8,
	$elm$project_metadata_utils$Elm$Project$PackageInfo,
	A2($elm$json$Json$Decode$field, 'name', $elm$project_metadata_utils$Elm$Package$decoder),
	A2($elm$json$Json$Decode$field, 'summary', $elm$project_metadata_utils$Elm$Project$summaryDecoder),
	A2($elm$json$Json$Decode$field, 'license', $elm$project_metadata_utils$Elm$License$decoder),
	A2($elm$json$Json$Decode$field, 'version', $elm$project_metadata_utils$Elm$Version$decoder),
	A2($elm$json$Json$Decode$field, 'exposed-modules', $elm$project_metadata_utils$Elm$Project$exposedDecoder),
	A2(
		$elm$json$Json$Decode$field,
		'dependencies',
		$elm$project_metadata_utils$Elm$Project$depsDecoder($elm$project_metadata_utils$Elm$Constraint$decoder)),
	A2(
		$elm$json$Json$Decode$field,
		'test-dependencies',
		$elm$project_metadata_utils$Elm$Project$depsDecoder($elm$project_metadata_utils$Elm$Constraint$decoder)),
	A2($elm$json$Json$Decode$field, 'elm-version', $elm$project_metadata_utils$Elm$Constraint$decoder));
var $elm$project_metadata_utils$Elm$Project$decoderHelp = function (tipe) {
	switch (tipe) {
		case 'application':
			return A2($elm$json$Json$Decode$map, $elm$project_metadata_utils$Elm$Project$Application, $elm$project_metadata_utils$Elm$Project$applicationDecoder);
		case 'package':
			return A2($elm$json$Json$Decode$map, $elm$project_metadata_utils$Elm$Project$Package, $elm$project_metadata_utils$Elm$Project$packageDecoder);
		default:
			var other = tipe;
			return $elm$json$Json$Decode$fail('The "type" field must be either "application" or "package", so ' + ('\"' + (other + '\" is not acceptable.')));
	}
};
var $elm$project_metadata_utils$Elm$Project$decoder = A2(
	$elm$json$Json$Decode$andThen,
	$elm$project_metadata_utils$Elm$Project$decoderHelp,
	A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
var $author$project$Analyser$Configuration$Configuration = $elm$core$Basics$identity;
var $author$project$Analyser$Configuration$defaultChecks = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('FunctionInLet', false)
		]));
var $author$project$Analyser$Configuration$defaultConfiguration = {aK: $author$project$Analyser$Configuration$defaultChecks, cY: _List_Nil, dx: ''};
var $author$project$Analyser$ContextLoader$emptyContext = {X: '', c2: _List_Nil, gw: _List_Nil};
var $author$project$Util$Logger$LogMessage = F2(
	function (level, message) {
		return {ep: level, ac: message};
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
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
			_Json_emptyObject(0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Util$Logger$log = _Platform_outgoingPort(
	'log',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'level',
					$elm$json$Json$Encode$string($.ep)),
					_Utils_Tuple2(
					'message',
					$elm$json$Json$Encode$string($.ac))
				]));
	});
var $author$project$Util$Logger$error = A2(
	$elm$core$Basics$composeR,
	$author$project$Util$Logger$LogMessage('ERROR'),
	$author$project$Util$Logger$log);
var $author$project$Registry$Registry = $elm$core$Basics$identity;
var $author$project$Registry$Package$Package = F3(
	function (name, summary, versions) {
		return {f8: name, eV: summary, dM: versions};
	});
var $author$project$Registry$Version$Version = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$core$Maybe$map3 = F4(
	function (func, ma, mb, mc) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				if (mc.$ === 1) {
					return $elm$core$Maybe$Nothing;
				} else {
					var c = mc.a;
					return $elm$core$Maybe$Just(
						A3(func, a, b, c));
				}
			}
		}
	});
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
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
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
var $author$project$Registry$fromValue = function (value) {
	return A2(
		$elm$json$Json$Decode$decodeValue,
		$elm$json$Json$Decode$list($author$project$Registry$Package$decode),
		value);
};
var $author$project$Util$Logger$info = A2(
	$elm$core$Basics$composeR,
	$author$project$Util$Logger$LogMessage('INFO'),
	$author$project$Util$Logger$log);
var $author$project$Analyser$CodeBase$CodeBase = $elm$core$Basics$identity;
var $stil4m$elm_syntax$Elm$Processing$ProcessContext = $elm$core$Basics$identity;
var $stil4m$elm_syntax$Elm$Processing$init = $elm$core$Dict$empty;
var $author$project$Analyser$CodeBase$init = {fz: _List_Nil, aD: $stil4m$elm_syntax$Elm$Processing$init, a3: $elm$core$Dict$empty};
var $author$project$Analyser$State$Initialising = 0;
var $author$project$Analyser$Modules$empty = {fz: _List_Nil, ck: _List_Nil};
var $author$project$Analyser$State$Dependencies$Application = 1;
var $author$project$Analyser$State$Dependencies$none = {b_: 1, gM: _List_Nil, gP: $elm$core$Dict$empty};
var $author$project$Analyser$State$initialState = {fz: $author$project$Analyser$State$Dependencies$none, at: 0, es: _List_Nil, eu: $author$project$Analyser$Modules$empty, ag: _List_Nil, gy: 0};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$project_metadata_utils$Elm$Version$one = A3($elm$project_metadata_utils$Elm$Version$Version, 1, 0, 0);
var $author$project$Analyser$ContextLoadingStage = {$: 0};
var $author$project$Analyser$doSendState = function (_v0) {
	var model = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(model, cmds);
};
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Analyser$ContextLoader$loadContext = _Platform_outgoingPort(
	'loadContext',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Analyser$reset = function (_v0) {
	var model = _v0.a;
	var cmds = _v0.b;
	return $author$project$Analyser$doSendState(
		_Utils_Tuple2(
			_Utils_update(
				model,
				{E: $author$project$Analyser$CodeBase$init, j: $author$project$Analyser$ContextLoadingStage, k: $author$project$Analyser$State$initialState}),
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$author$project$Analyser$ContextLoader$loadContext(0),
						cmds
					]))));
};
var $author$project$Analyser$init = function (flags) {
	var project = A2($elm$json$Json$Decode$decodeValue, $elm$project_metadata_utils$Elm$Project$decoder, flags.R);
	var base = _Utils_Tuple2(
		{
			D: _List_Nil,
			E: $author$project$Analyser$CodeBase$init,
			X: $author$project$Analyser$Configuration$defaultConfiguration,
			aM: $author$project$Analyser$ContextLoader$emptyContext,
			R: $elm$project_metadata_utils$Elm$Project$Application(
				{fB: _List_Nil, fC: _List_Nil, fF: _List_Nil, fI: $elm$project_metadata_utils$Elm$Version$one, gF: _List_Nil, gG: _List_Nil}),
			S: $author$project$Registry$fromValue(flags.S),
			T: flags.T,
			j: $author$project$Analyser$Finished,
			k: $author$project$Analyser$State$initialState
		},
		$elm$core$Platform$Cmd$none);
	if (project.$ === 1) {
		return _Utils_Tuple2(
			base.a,
			$author$project$Util$Logger$error('Could not read project file (./elm.json)'));
	} else {
		var v = project.a;
		return $author$project$Analyser$reset(
			_Utils_Tuple2(
				{
					D: _List_Nil,
					E: $author$project$Analyser$CodeBase$init,
					X: $author$project$Analyser$Configuration$defaultConfiguration,
					aM: $author$project$Analyser$ContextLoader$emptyContext,
					R: v,
					S: $author$project$Registry$fromValue(flags.S),
					T: flags.T,
					j: $author$project$Analyser$Finished,
					k: $author$project$Analyser$State$initialState
				},
				$author$project$Util$Logger$info('Started...')));
	}
};
var $author$project$Analyser$Change = function (a) {
	return {$: 3, a: a};
};
var $author$project$Analyser$DependencyLoadingStageMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Analyser$FixerMsg = function (a) {
	return {$: 8, a: a};
};
var $author$project$Analyser$OnContext = function (a) {
	return {$: 0, a: a};
};
var $author$project$Analyser$OnFixMessage = function (a) {
	return {$: 6, a: a};
};
var $author$project$Analyser$OnQuickFixMessage = function (a) {
	return {$: 7, a: a};
};
var $author$project$Analyser$ReloadTick = {$: 4};
var $author$project$Analyser$Reset = {$: 5};
var $author$project$Analyser$SourceLoadingStageMsg = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {eF: processes, eW: taggers};
	});
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 1) {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
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
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.eF;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.eW);
		if (_v0.$ === 1) {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $elm$core$Platform$Sub$map = _Platform_map;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $author$project$AnalyserPorts$onFixMessage = _Platform_incomingPort('onFixMessage', $elm$json$Json$Decode$int);
var $author$project$AnalyserPorts$onFixQuick = _Platform_incomingPort('onFixQuick', $elm$json$Json$Decode$int);
var $elm$json$Json$Decode$index = _Json_decodeIndex;
var $author$project$Analyser$ContextLoader$onLoadedContext = _Platform_incomingPort(
	'onLoadedContext',
	A2(
		$elm$json$Json$Decode$andThen,
		function (sourceFiles) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (interfaceFiles) {
					return A2(
						$elm$json$Json$Decode$andThen,
						function (configuration) {
							return $elm$json$Json$Decode$succeed(
								{X: configuration, c2: interfaceFiles, gw: sourceFiles});
						},
						A2($elm$json$Json$Decode$field, 'configuration', $elm$json$Json$Decode$string));
				},
				A2(
					$elm$json$Json$Decode$field,
					'interfaceFiles',
					$elm$json$Json$Decode$list(
						A2(
							$elm$json$Json$Decode$andThen,
							function (_v0) {
								return A2(
									$elm$json$Json$Decode$andThen,
									function (_v1) {
										return $elm$json$Json$Decode$succeed(
											_Utils_Tuple2(_v0, _v1));
									},
									A2($elm$json$Json$Decode$index, 1, $elm$json$Json$Decode$string));
							},
							A2($elm$json$Json$Decode$index, 0, $elm$json$Json$Decode$string)))));
		},
		A2(
			$elm$json$Json$Decode$field,
			'sourceFiles',
			$elm$json$Json$Decode$list($elm$json$Json$Decode$string))));
var $author$project$AnalyserPorts$onReset = _Platform_incomingPort('onReset', $elm$json$Json$Decode$bool);
var $author$project$Analyser$DependencyLoadingStage$DependencyLoaderMsg = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Analyser$Files$DependencyLoader$OnCacheRead = function (a) {
	return {$: 0, a: a};
};
var $author$project$Analyser$Files$DependencyLoader$OnLocallyBuildDependency = function (a) {
	return {$: 2, a: a};
};
var $author$project$Analyser$Files$DependencyLoader$OnOnlineDocs = function (a) {
	return {$: 1, a: a};
};
var $stil4m$elm_syntax$Elm$Dependency$Dependency = F3(
	function (name, version, interfaces) {
		return {f_: interfaces, f8: name, p: version};
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
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
var $stil4m$elm_syntax$Elm$Syntax$Node$value = function (_v0) {
	var v = _v0.b;
	return v;
};
var $stil4m$elm_syntax$Elm$Syntax$Module$moduleName = function (m) {
	switch (m.$) {
		case 0:
			var x = m.a;
			return $stil4m$elm_syntax$Elm$Syntax$Node$value(x.a_);
		case 1:
			var x = m.a;
			return $stil4m$elm_syntax$Elm$Syntax$Node$value(x.a_);
		default:
			var x = m.a;
			return $stil4m$elm_syntax$Elm$Syntax$Node$value(x.a_);
	}
};
var $stil4m$elm_syntax$Elm$RawFile$moduleName = function (_v0) {
	var file = _v0;
	return $stil4m$elm_syntax$Elm$Syntax$Module$moduleName(
		$stil4m$elm_syntax$Elm$Syntax$Node$value(file.f6));
};
var $author$project$Analyser$FileContext$moduleName = function (rf) {
	return $stil4m$elm_syntax$Elm$RawFile$moduleName(rf);
};
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Analyser$DependencyHandler$buildDependency = F2(
	function (_v0, loadedFiles) {
		var name = _v0.f8;
		var version = _v0.p;
		return A3(
			$stil4m$elm_syntax$Elm$Dependency$Dependency,
			name,
			version,
			$elm$core$Dict$fromList(
				A2(
					$elm$core$List$filterMap,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Result$toMaybe,
						$elm$core$Maybe$map(
							function (z) {
								return _Utils_Tuple2(
									$author$project$Analyser$FileContext$moduleName(z.fe),
									z.fZ);
							})),
					loadedFiles)));
	});
var $elm$parser$Parser$Problem = function (a) {
	return {$: 12, a: a};
};
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $stil4m$elm_syntax$Elm$Internal$RawFile$Raw = $elm$core$Basics$identity;
var $stil4m$elm_syntax$Elm$Syntax$File$File = F4(
	function (moduleDefinition, imports, declarations, comments) {
		return {fs: comments, dY: declarations, eg: imports, f6: moduleDefinition};
	});
var $stil4m$elm_syntax$Elm$Syntax$Comments$decoder = $elm$json$Json$Decode$string;
var $stil4m$elm_syntax$Elm$Syntax$Declaration$AliasDeclaration = function (a) {
	return {$: 1, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Declaration$CustomTypeDeclaration = function (a) {
	return {$: 2, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Declaration$Destructuring = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $stil4m$elm_syntax$Elm$Syntax$Declaration$FunctionDeclaration = function (a) {
	return {$: 0, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Declaration$InfixDeclaration = function (a) {
	return {$: 4, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Declaration$PortDeclaration = function (a) {
	return {$: 3, a: a};
};
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
		$elm$json$Json$Decode$succeed(0));
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $stil4m$elm_syntax$Elm$Json$Util$decodeTyped = function (opts) {
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
					if (!_v1.$) {
						var m = _v1.a;
						return A2($elm$json$Json$Decode$field, m.a, m.b);
					} else {
						return $elm$json$Json$Decode$fail('No decoder for type: ' + t);
					}
				},
				A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
		});
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$Application = function (a) {
	return {$: 1, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$CaseBlock = F2(
	function (expression, cases) {
		return {fm: cases, bJ: expression};
	});
var $stil4m$elm_syntax$Elm$Syntax$Expression$CaseExpression = function (a) {
	return {$: 16, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$CharLiteral = function (a) {
	return {$: 12, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$Floatable = function (a) {
	return {$: 9, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$Function = F3(
	function (documentation, signature, declaration) {
		return {fx: declaration, fG: documentation, gu: signature};
	});
var $stil4m$elm_syntax$Elm$Syntax$Expression$FunctionImplementation = F3(
	function (name, _arguments, expression) {
		return {fc: _arguments, bJ: expression, f8: name};
	});
var $stil4m$elm_syntax$Elm$Syntax$Expression$FunctionOrValue = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $stil4m$elm_syntax$Elm$Syntax$Expression$GLSLExpression = function (a) {
	return {$: 23, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$Hex = function (a) {
	return {$: 8, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$IfBlock = F3(
	function (a, b, c) {
		return {$: 4, a: a, b: b, c: c};
	});
var $stil4m$elm_syntax$Elm$Syntax$Expression$Integer = function (a) {
	return {$: 7, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$Lambda = F2(
	function (args, expression) {
		return {fa: args, bJ: expression};
	});
var $stil4m$elm_syntax$Elm$Syntax$Expression$LambdaExpression = function (a) {
	return {$: 17, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$LetBlock = F2(
	function (declarations, expression) {
		return {dY: declarations, bJ: expression};
	});
var $stil4m$elm_syntax$Elm$Syntax$Expression$LetDestructuring = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $stil4m$elm_syntax$Elm$Syntax$Expression$LetExpression = function (a) {
	return {$: 15, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$LetFunction = function (a) {
	return {$: 0, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$ListExpr = function (a) {
	return {$: 19, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$Literal = function (a) {
	return {$: 11, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$Negation = function (a) {
	return {$: 10, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$Operator = function (a) {
	return {$: 6, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$OperatorApplication = F4(
	function (a, b, c, d) {
		return {$: 2, a: a, b: b, c: c, d: d};
	});
var $stil4m$elm_syntax$Elm$Syntax$Expression$ParenthesizedExpression = function (a) {
	return {$: 14, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$PrefixOperator = function (a) {
	return {$: 5, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$RecordAccess = F2(
	function (a, b) {
		return {$: 20, a: a, b: b};
	});
var $stil4m$elm_syntax$Elm$Syntax$Expression$RecordAccessFunction = function (a) {
	return {$: 21, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$RecordExpr = function (a) {
	return {$: 18, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$RecordUpdateExpression = F2(
	function (a, b) {
		return {$: 22, a: a, b: b};
	});
var $stil4m$elm_syntax$Elm$Syntax$Expression$TupledExpression = function (a) {
	return {$: 13, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$UnitExpr = {$: 0};
var $stil4m$elm_syntax$Elm$Syntax$Expression$decodeChar = A2(
	$elm$json$Json$Decode$andThen,
	function (s) {
		var _v0 = $elm$core$String$uncons(s);
		if (!_v0.$) {
			var _v1 = _v0.a;
			var c = _v1.a;
			return $elm$json$Json$Decode$succeed(c);
		} else {
			return $elm$json$Json$Decode$fail('Not a char');
		}
	},
	$elm$json$Json$Decode$string);
var $stil4m$elm_syntax$Elm$Syntax$Infix$Left = 0;
var $stil4m$elm_syntax$Elm$Syntax$Infix$Non = 2;
var $stil4m$elm_syntax$Elm$Syntax$Infix$Right = 1;
var $stil4m$elm_syntax$Elm$Syntax$Infix$decodeDirection = A2(
	$elm$json$Json$Decode$andThen,
	function (v) {
		switch (v) {
			case 'left':
				return $elm$json$Json$Decode$succeed(0);
			case 'right':
				return $elm$json$Json$Decode$succeed(1);
			case 'non':
				return $elm$json$Json$Decode$succeed(2);
			default:
				return $elm$json$Json$Decode$fail('Invlalid direction');
		}
	},
	$elm$json$Json$Decode$string);
var $stil4m$elm_syntax$Elm$Syntax$Documentation$decoder = $elm$json$Json$Decode$string;
var $stil4m$elm_syntax$Elm$Syntax$ModuleName$decoder = $elm$json$Json$Decode$list($elm$json$Json$Decode$string);
var $stil4m$elm_syntax$Elm$Syntax$Node$Node = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
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
				bH: {W: d, C: c},
				J: {W: b, C: a}
			});
	} else {
		return $elm$core$Result$Err('Invalid input list');
	}
};
var $elm_community$json_extra$Json$Decode$Extra$fromResult = function (result) {
	if (!result.$) {
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
var $elm$json$Json$Decode$map2 = _Json_map2;
var $stil4m$elm_syntax$Elm$Syntax$Node$decoder = function (sub) {
	return A3(
		$elm$json$Json$Decode$map2,
		$stil4m$elm_syntax$Elm$Syntax$Node$Node,
		A2($elm$json$Json$Decode$field, 'range', $stil4m$elm_syntax$Elm$Syntax$Range$decoder),
		A2($elm$json$Json$Decode$field, 'value', sub));
};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$AllPattern = {$: 0};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$AsPattern = F2(
	function (a, b) {
		return {$: 13, a: a, b: b};
	});
var $stil4m$elm_syntax$Elm$Syntax$Pattern$CharPattern = function (a) {
	return {$: 2, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$FloatPattern = function (a) {
	return {$: 6, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$HexPattern = function (a) {
	return {$: 5, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$IntPattern = function (a) {
	return {$: 4, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$ListPattern = function (a) {
	return {$: 10, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$NamedPattern = F2(
	function (a, b) {
		return {$: 12, a: a, b: b};
	});
var $stil4m$elm_syntax$Elm$Syntax$Pattern$ParenthesizedPattern = function (a) {
	return {$: 14, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$RecordPattern = function (a) {
	return {$: 8, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$StringPattern = function (a) {
	return {$: 3, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$TuplePattern = function (a) {
	return {$: 7, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$UnConsPattern = F2(
	function (a, b) {
		return {$: 9, a: a, b: b};
	});
var $stil4m$elm_syntax$Elm$Syntax$Pattern$UnitPattern = {$: 1};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$VarPattern = function (a) {
	return {$: 11, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$decodeChar = A2(
	$elm$json$Json$Decode$andThen,
	function (s) {
		var _v0 = $elm$core$String$uncons(s);
		if (!_v0.$) {
			var _v1 = _v0.a;
			var c = _v1.a;
			return $elm$json$Json$Decode$succeed(c);
		} else {
			return $elm$json$Json$Decode$fail('Not a char');
		}
	},
	$elm$json$Json$Decode$string);
var $stil4m$elm_syntax$Elm$Syntax$Pattern$QualifiedNameRef = F2(
	function (moduleName, name) {
		return {a_: moduleName, f8: name};
	});
var $stil4m$elm_syntax$Elm$Syntax$Pattern$decodeQualifiedNameRef = A3(
	$elm$json$Json$Decode$map2,
	$stil4m$elm_syntax$Elm$Syntax$Pattern$QualifiedNameRef,
	A2($elm$json$Json$Decode$field, 'moduleName', $stil4m$elm_syntax$Elm$Syntax$ModuleName$decoder),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string));
var $elm$json$Json$Decode$float = _Json_decodeFloat;
function $stil4m$elm_syntax$Elm$Syntax$Pattern$cyclic$decoder() {
	return $elm$json$Json$Decode$lazy(
		function (_v0) {
			return $stil4m$elm_syntax$Elm$Json$Util$decodeTyped(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'all',
						$elm$json$Json$Decode$succeed($stil4m$elm_syntax$Elm$Syntax$Pattern$AllPattern)),
						_Utils_Tuple2(
						'unit',
						$elm$json$Json$Decode$succeed($stil4m$elm_syntax$Elm$Syntax$Pattern$UnitPattern)),
						_Utils_Tuple2(
						'char',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$Pattern$CharPattern,
							A2($elm$json$Json$Decode$field, 'value', $stil4m$elm_syntax$Elm$Syntax$Pattern$decodeChar))),
						_Utils_Tuple2(
						'string',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$Pattern$StringPattern,
							A2($elm$json$Json$Decode$field, 'value', $elm$json$Json$Decode$string))),
						_Utils_Tuple2(
						'hex',
						A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Pattern$HexPattern, $elm$json$Json$Decode$int)),
						_Utils_Tuple2(
						'int',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$Pattern$IntPattern,
							A2($elm$json$Json$Decode$field, 'value', $elm$json$Json$Decode$int))),
						_Utils_Tuple2(
						'float',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$Pattern$FloatPattern,
							A2($elm$json$Json$Decode$field, 'value', $elm$json$Json$Decode$float))),
						_Utils_Tuple2(
						'tuple',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$Pattern$TuplePattern,
							A2(
								$elm$json$Json$Decode$field,
								'value',
								$elm$json$Json$Decode$list(
									$stil4m$elm_syntax$Elm$Syntax$Node$decoder(
										$stil4m$elm_syntax$Elm$Syntax$Pattern$cyclic$decoder()))))),
						_Utils_Tuple2(
						'record',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$Pattern$RecordPattern,
							A2(
								$elm$json$Json$Decode$field,
								'value',
								$elm$json$Json$Decode$list(
									$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$string))))),
						_Utils_Tuple2(
						'uncons',
						A3(
							$elm$json$Json$Decode$map2,
							$stil4m$elm_syntax$Elm$Syntax$Pattern$UnConsPattern,
							A2(
								$elm$json$Json$Decode$field,
								'left',
								$stil4m$elm_syntax$Elm$Syntax$Node$decoder(
									$stil4m$elm_syntax$Elm$Syntax$Pattern$cyclic$decoder())),
							A2(
								$elm$json$Json$Decode$field,
								'right',
								$stil4m$elm_syntax$Elm$Syntax$Node$decoder(
									$stil4m$elm_syntax$Elm$Syntax$Pattern$cyclic$decoder())))),
						_Utils_Tuple2(
						'list',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$Pattern$ListPattern,
							A2(
								$elm$json$Json$Decode$field,
								'value',
								$elm$json$Json$Decode$list(
									$stil4m$elm_syntax$Elm$Syntax$Node$decoder(
										$stil4m$elm_syntax$Elm$Syntax$Pattern$cyclic$decoder()))))),
						_Utils_Tuple2(
						'var',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$Pattern$VarPattern,
							A2($elm$json$Json$Decode$field, 'value', $elm$json$Json$Decode$string))),
						_Utils_Tuple2(
						'named',
						A3(
							$elm$json$Json$Decode$map2,
							$stil4m$elm_syntax$Elm$Syntax$Pattern$NamedPattern,
							A2($elm$json$Json$Decode$field, 'qualified', $stil4m$elm_syntax$Elm$Syntax$Pattern$decodeQualifiedNameRef),
							A2(
								$elm$json$Json$Decode$field,
								'patterns',
								$elm$json$Json$Decode$list(
									$stil4m$elm_syntax$Elm$Syntax$Node$decoder(
										$stil4m$elm_syntax$Elm$Syntax$Pattern$cyclic$decoder()))))),
						_Utils_Tuple2(
						'as',
						A3(
							$elm$json$Json$Decode$map2,
							$stil4m$elm_syntax$Elm$Syntax$Pattern$AsPattern,
							A2(
								$elm$json$Json$Decode$field,
								'pattern',
								$stil4m$elm_syntax$Elm$Syntax$Node$decoder(
									$stil4m$elm_syntax$Elm$Syntax$Pattern$cyclic$decoder())),
							A2(
								$elm$json$Json$Decode$field,
								'name',
								$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$string)))),
						_Utils_Tuple2(
						'parentisized',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$Pattern$ParenthesizedPattern,
							A2(
								$elm$json$Json$Decode$field,
								'value',
								$stil4m$elm_syntax$Elm$Syntax$Node$decoder(
									$stil4m$elm_syntax$Elm$Syntax$Pattern$cyclic$decoder()))))
					]));
		});
}
var $stil4m$elm_syntax$Elm$Syntax$Pattern$decoder = $stil4m$elm_syntax$Elm$Syntax$Pattern$cyclic$decoder();
$stil4m$elm_syntax$Elm$Syntax$Pattern$cyclic$decoder = function () {
	return $stil4m$elm_syntax$Elm$Syntax$Pattern$decoder;
};
var $stil4m$elm_syntax$Elm$Syntax$Signature$Signature = F2(
	function (name, typeAnnotation) {
		return {f8: name, gI: typeAnnotation};
	});
var $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$FunctionTypeAnnotation = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$GenericRecord = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$GenericType = function (a) {
	return {$: 0, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$Record = function (a) {
	return {$: 4, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$Tupled = function (a) {
	return {$: 3, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$Typed = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$Unit = {$: 2};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$decodeModuleNameAndName = A3(
	$elm$json$Json$Decode$map2,
	$elm$core$Tuple$pair,
	A2($elm$json$Json$Decode$field, 'moduleName', $stil4m$elm_syntax$Elm$Syntax$ModuleName$decoder),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string));
function $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$decoder() {
	return $elm$json$Json$Decode$lazy(
		function (_v3) {
			return $stil4m$elm_syntax$Elm$Json$Util$decodeTyped(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'generic',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$GenericType,
							A2($elm$json$Json$Decode$field, 'value', $elm$json$Json$Decode$string))),
						_Utils_Tuple2(
						'typed',
						A3(
							$elm$json$Json$Decode$map2,
							$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$Typed,
							A2(
								$elm$json$Json$Decode$field,
								'moduleNameAndName',
								$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$decodeModuleNameAndName)),
							A2(
								$elm$json$Json$Decode$field,
								'args',
								$elm$json$Json$Decode$list(
									$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$nestedDecoder())))),
						_Utils_Tuple2(
						'unit',
						$elm$json$Json$Decode$succeed($stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$Unit)),
						_Utils_Tuple2(
						'tupled',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$Tupled,
							A2(
								$elm$json$Json$Decode$field,
								'values',
								$elm$json$Json$Decode$list(
									$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$nestedDecoder())))),
						_Utils_Tuple2(
						'function',
						A3(
							$elm$json$Json$Decode$map2,
							$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$FunctionTypeAnnotation,
							A2(
								$elm$json$Json$Decode$field,
								'left',
								$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$nestedDecoder()),
							A2(
								$elm$json$Json$Decode$field,
								'right',
								$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$nestedDecoder()))),
						_Utils_Tuple2(
						'record',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$Record,
							A2(
								$elm$json$Json$Decode$field,
								'value',
								$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$recordDefinitionDecoder()))),
						_Utils_Tuple2(
						'genericRecord',
						A3(
							$elm$json$Json$Decode$map2,
							$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$GenericRecord,
							A2(
								$elm$json$Json$Decode$field,
								'name',
								$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$string)),
							A2(
								$elm$json$Json$Decode$field,
								'values',
								$stil4m$elm_syntax$Elm$Syntax$Node$decoder(
									$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$recordDefinitionDecoder()))))
					]));
		});
}
function $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$nestedDecoder() {
	return $elm$json$Json$Decode$lazy(
		function (_v2) {
			return $stil4m$elm_syntax$Elm$Syntax$Node$decoder(
				$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$decoder());
		});
}
function $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$recordDefinitionDecoder() {
	return $elm$json$Json$Decode$lazy(
		function (_v1) {
			return $elm$json$Json$Decode$list(
				$stil4m$elm_syntax$Elm$Syntax$Node$decoder(
					$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$recordFieldDecoder()));
		});
}
function $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$recordFieldDecoder() {
	return $elm$json$Json$Decode$lazy(
		function (_v0) {
			return A3(
				$elm$json$Json$Decode$map2,
				$elm$core$Tuple$pair,
				A2(
					$elm$json$Json$Decode$field,
					'name',
					$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$string)),
				A2(
					$elm$json$Json$Decode$field,
					'typeAnnotation',
					$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$nestedDecoder()));
		});
}
var $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$decoder = $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$decoder();
$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$decoder = function () {
	return $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$decoder;
};
var $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$nestedDecoder = $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$nestedDecoder();
$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$nestedDecoder = function () {
	return $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$nestedDecoder;
};
var $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$recordDefinitionDecoder = $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$recordDefinitionDecoder();
$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$recordDefinitionDecoder = function () {
	return $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$recordDefinitionDecoder;
};
var $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$recordFieldDecoder = $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$recordFieldDecoder();
$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$recordFieldDecoder = function () {
	return $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$recordFieldDecoder;
};
var $stil4m$elm_syntax$Elm$Syntax$Signature$decoder = A3(
	$elm$json$Json$Decode$map2,
	$stil4m$elm_syntax$Elm$Syntax$Signature$Signature,
	A2(
		$elm$json$Json$Decode$field,
		'name',
		$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'typeAnnotation',
		$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$decoder)));
var $elm$json$Json$Decode$map4 = _Json_map4;
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$nullable = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder)
			]));
};
function $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeCase() {
	return $elm$json$Json$Decode$lazy(
		function (_v10) {
			return A3(
				$elm$json$Json$Decode$map2,
				$elm$core$Tuple$pair,
				A2(
					$elm$json$Json$Decode$field,
					'pattern',
					$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$Pattern$decoder)),
				A2(
					$elm$json$Json$Decode$field,
					'expression',
					$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested()));
		});
}
function $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeCaseBlock() {
	return $elm$json$Json$Decode$lazy(
		function (_v9) {
			return A3(
				$elm$json$Json$Decode$map2,
				$stil4m$elm_syntax$Elm$Syntax$Expression$CaseBlock,
				A2(
					$elm$json$Json$Decode$field,
					'expression',
					$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested()),
				A2(
					$elm$json$Json$Decode$field,
					'cases',
					$elm$json$Json$Decode$list(
						$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeCase())));
		});
}
function $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeFunctionDeclaration() {
	return $elm$json$Json$Decode$lazy(
		function (_v8) {
			return A4(
				$elm$json$Json$Decode$map3,
				$stil4m$elm_syntax$Elm$Syntax$Expression$FunctionImplementation,
				A2(
					$elm$json$Json$Decode$field,
					'name',
					$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$string)),
				A2(
					$elm$json$Json$Decode$field,
					'arguments',
					$elm$json$Json$Decode$list(
						$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$Pattern$decoder))),
				A2(
					$elm$json$Json$Decode$field,
					'expression',
					$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested()));
		});
}
function $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeLambda() {
	return $elm$json$Json$Decode$lazy(
		function (_v7) {
			return A3(
				$elm$json$Json$Decode$map2,
				$stil4m$elm_syntax$Elm$Syntax$Expression$Lambda,
				A2(
					$elm$json$Json$Decode$field,
					'patterns',
					$elm$json$Json$Decode$list(
						$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$Pattern$decoder))),
				A2(
					$elm$json$Json$Decode$field,
					'expression',
					$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested()));
		});
}
function $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeLetBlock() {
	return $elm$json$Json$Decode$lazy(
		function (_v6) {
			return A3(
				$elm$json$Json$Decode$map2,
				$stil4m$elm_syntax$Elm$Syntax$Expression$LetBlock,
				A2(
					$elm$json$Json$Decode$field,
					'declarations',
					$elm$json$Json$Decode$list(
						$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeLetDeclaration())),
				A2(
					$elm$json$Json$Decode$field,
					'expression',
					$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested()));
		});
}
function $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeLetDeclaration() {
	return $elm$json$Json$Decode$lazy(
		function (_v5) {
			return $stil4m$elm_syntax$Elm$Syntax$Node$decoder(
				$stil4m$elm_syntax$Elm$Json$Util$decodeTyped(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'function',
							A2(
								$elm$json$Json$Decode$map,
								$stil4m$elm_syntax$Elm$Syntax$Expression$LetFunction,
								$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$functionDecoder())),
							_Utils_Tuple2(
							'destructuring',
							A3(
								$elm$json$Json$Decode$map2,
								$stil4m$elm_syntax$Elm$Syntax$Expression$LetDestructuring,
								A2(
									$elm$json$Json$Decode$field,
									'pattern',
									$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$Pattern$decoder)),
								A2(
									$elm$json$Json$Decode$field,
									'expression',
									$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested())))
						])));
		});
}
function $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested() {
	return $elm$json$Json$Decode$lazy(
		function (_v4) {
			return $stil4m$elm_syntax$Elm$Syntax$Node$decoder(
				$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decoder());
		});
}
function $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeOperatorApplication() {
	return $elm$json$Json$Decode$lazy(
		function (_v3) {
			return A5(
				$elm$json$Json$Decode$map4,
				$stil4m$elm_syntax$Elm$Syntax$Expression$OperatorApplication,
				A2($elm$json$Json$Decode$field, 'operator', $elm$json$Json$Decode$string),
				A2($elm$json$Json$Decode$field, 'direction', $stil4m$elm_syntax$Elm$Syntax$Infix$decodeDirection),
				A2(
					$elm$json$Json$Decode$field,
					'left',
					$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested()),
				A2(
					$elm$json$Json$Decode$field,
					'right',
					$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested()));
		});
}
function $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeRecordSetter() {
	return $elm$json$Json$Decode$lazy(
		function (_v2) {
			return A3(
				$elm$json$Json$Decode$map2,
				$elm$core$Tuple$pair,
				A2(
					$elm$json$Json$Decode$field,
					'field',
					$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$string)),
				A2(
					$elm$json$Json$Decode$field,
					'expression',
					$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested()));
		});
}
function $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decoder() {
	return $elm$json$Json$Decode$lazy(
		function (_v1) {
			return $stil4m$elm_syntax$Elm$Json$Util$decodeTyped(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'unit',
						$elm$json$Json$Decode$succeed($stil4m$elm_syntax$Elm$Syntax$Expression$UnitExpr)),
						_Utils_Tuple2(
						'application',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$Expression$Application,
							$elm$json$Json$Decode$list(
								$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested()))),
						_Utils_Tuple2(
						'operatorapplication',
						$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeOperatorApplication()),
						_Utils_Tuple2(
						'functionOrValue',
						A3(
							$elm$json$Json$Decode$map2,
							$stil4m$elm_syntax$Elm$Syntax$Expression$FunctionOrValue,
							A2($elm$json$Json$Decode$field, 'moduleName', $stil4m$elm_syntax$Elm$Syntax$ModuleName$decoder),
							A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string))),
						_Utils_Tuple2(
						'ifBlock',
						A4(
							$elm$json$Json$Decode$map3,
							$stil4m$elm_syntax$Elm$Syntax$Expression$IfBlock,
							A2(
								$elm$json$Json$Decode$field,
								'clause',
								$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested()),
							A2(
								$elm$json$Json$Decode$field,
								'then',
								$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested()),
							A2(
								$elm$json$Json$Decode$field,
								'else',
								$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested()))),
						_Utils_Tuple2(
						'prefixoperator',
						A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Expression$PrefixOperator, $elm$json$Json$Decode$string)),
						_Utils_Tuple2(
						'operator',
						A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Expression$Operator, $elm$json$Json$Decode$string)),
						_Utils_Tuple2(
						'hex',
						A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Expression$Hex, $elm$json$Json$Decode$int)),
						_Utils_Tuple2(
						'integer',
						A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Expression$Integer, $elm$json$Json$Decode$int)),
						_Utils_Tuple2(
						'float',
						A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Expression$Floatable, $elm$json$Json$Decode$float)),
						_Utils_Tuple2(
						'negation',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$Expression$Negation,
							$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested())),
						_Utils_Tuple2(
						'literal',
						A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Expression$Literal, $elm$json$Json$Decode$string)),
						_Utils_Tuple2(
						'charLiteral',
						A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Expression$CharLiteral, $stil4m$elm_syntax$Elm$Syntax$Expression$decodeChar)),
						_Utils_Tuple2(
						'tupled',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$Expression$TupledExpression,
							$elm$json$Json$Decode$list(
								$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested()))),
						_Utils_Tuple2(
						'list',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$Expression$ListExpr,
							$elm$json$Json$Decode$list(
								$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested()))),
						_Utils_Tuple2(
						'parenthesized',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$Expression$ParenthesizedExpression,
							$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested())),
						_Utils_Tuple2(
						'let',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$Expression$LetExpression,
							$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeLetBlock())),
						_Utils_Tuple2(
						'case',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$Expression$CaseExpression,
							$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeCaseBlock())),
						_Utils_Tuple2(
						'lambda',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$Expression$LambdaExpression,
							$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeLambda())),
						_Utils_Tuple2(
						'recordAccess',
						A3(
							$elm$json$Json$Decode$map2,
							$stil4m$elm_syntax$Elm$Syntax$Expression$RecordAccess,
							A2(
								$elm$json$Json$Decode$field,
								'expression',
								$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested()),
							A2(
								$elm$json$Json$Decode$field,
								'name',
								$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$string)))),
						_Utils_Tuple2(
						'recordAccessFunction',
						A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Expression$RecordAccessFunction, $elm$json$Json$Decode$string)),
						_Utils_Tuple2(
						'record',
						A2(
							$elm$json$Json$Decode$map,
							$stil4m$elm_syntax$Elm$Syntax$Expression$RecordExpr,
							$elm$json$Json$Decode$list(
								$stil4m$elm_syntax$Elm$Syntax$Node$decoder(
									$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeRecordSetter())))),
						_Utils_Tuple2(
						'recordUpdate',
						A3(
							$elm$json$Json$Decode$map2,
							$stil4m$elm_syntax$Elm$Syntax$Expression$RecordUpdateExpression,
							A2(
								$elm$json$Json$Decode$field,
								'name',
								$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$string)),
							A2(
								$elm$json$Json$Decode$field,
								'updates',
								$elm$json$Json$Decode$list(
									$stil4m$elm_syntax$Elm$Syntax$Node$decoder(
										$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeRecordSetter()))))),
						_Utils_Tuple2(
						'glsl',
						A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Expression$GLSLExpression, $elm$json$Json$Decode$string))
					]));
		});
}
function $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$functionDecoder() {
	return $elm$json$Json$Decode$lazy(
		function (_v0) {
			return A4(
				$elm$json$Json$Decode$map3,
				$stil4m$elm_syntax$Elm$Syntax$Expression$Function,
				A2(
					$elm$json$Json$Decode$field,
					'documentation',
					$elm$json$Json$Decode$nullable(
						$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$Documentation$decoder))),
				A2(
					$elm$json$Json$Decode$field,
					'signature',
					$elm$json$Json$Decode$nullable(
						$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$Signature$decoder))),
				A2(
					$elm$json$Json$Decode$field,
					'declaration',
					$stil4m$elm_syntax$Elm$Syntax$Node$decoder(
						$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeFunctionDeclaration())));
		});
}
var $stil4m$elm_syntax$Elm$Syntax$Expression$decodeCase = $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeCase();
$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeCase = function () {
	return $stil4m$elm_syntax$Elm$Syntax$Expression$decodeCase;
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$decodeCaseBlock = $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeCaseBlock();
$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeCaseBlock = function () {
	return $stil4m$elm_syntax$Elm$Syntax$Expression$decodeCaseBlock;
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$decodeFunctionDeclaration = $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeFunctionDeclaration();
$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeFunctionDeclaration = function () {
	return $stil4m$elm_syntax$Elm$Syntax$Expression$decodeFunctionDeclaration;
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$decodeLambda = $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeLambda();
$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeLambda = function () {
	return $stil4m$elm_syntax$Elm$Syntax$Expression$decodeLambda;
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$decodeLetBlock = $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeLetBlock();
$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeLetBlock = function () {
	return $stil4m$elm_syntax$Elm$Syntax$Expression$decodeLetBlock;
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$decodeLetDeclaration = $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeLetDeclaration();
$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeLetDeclaration = function () {
	return $stil4m$elm_syntax$Elm$Syntax$Expression$decodeLetDeclaration;
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$decodeNested = $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested();
$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeNested = function () {
	return $stil4m$elm_syntax$Elm$Syntax$Expression$decodeNested;
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$decodeOperatorApplication = $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeOperatorApplication();
$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeOperatorApplication = function () {
	return $stil4m$elm_syntax$Elm$Syntax$Expression$decodeOperatorApplication;
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$decodeRecordSetter = $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeRecordSetter();
$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decodeRecordSetter = function () {
	return $stil4m$elm_syntax$Elm$Syntax$Expression$decodeRecordSetter;
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$decoder = $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decoder();
$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$decoder = function () {
	return $stil4m$elm_syntax$Elm$Syntax$Expression$decoder;
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$functionDecoder = $stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$functionDecoder();
$stil4m$elm_syntax$Elm$Syntax$Expression$cyclic$functionDecoder = function () {
	return $stil4m$elm_syntax$Elm$Syntax$Expression$functionDecoder;
};
var $stil4m$elm_syntax$Elm$Syntax$Infix$Infix = F4(
	function (direction, precedence, operator, _function) {
		return {fE: direction, fO: _function, gk: operator, eB: precedence};
	});
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
var $stil4m$elm_syntax$Elm$Syntax$Type$Type = F4(
	function (documentation, name, generics, constructors) {
		return {fu: constructors, fG: documentation, d9: generics, f8: name};
	});
var $stil4m$elm_syntax$Elm$Syntax$Type$ValueConstructor = F2(
	function (name, _arguments) {
		return {fc: _arguments, f8: name};
	});
var $stil4m$elm_syntax$Elm$Syntax$Type$valueConstructorDecoder = A3(
	$elm$json$Json$Decode$map2,
	$stil4m$elm_syntax$Elm$Syntax$Type$ValueConstructor,
	A2(
		$elm$json$Json$Decode$field,
		'name',
		$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'arguments',
		$elm$json$Json$Decode$list(
			$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$decoder))));
var $stil4m$elm_syntax$Elm$Syntax$Type$decoder = A5(
	$elm$json$Json$Decode$map4,
	$stil4m$elm_syntax$Elm$Syntax$Type$Type,
	A2(
		$elm$json$Json$Decode$field,
		'documentation',
		$elm$json$Json$Decode$nullable(
			$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$string))),
	A2(
		$elm$json$Json$Decode$field,
		'name',
		$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'generics',
		$elm$json$Json$Decode$list(
			$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$string))),
	A2(
		$elm$json$Json$Decode$field,
		'constructors',
		$elm$json$Json$Decode$list(
			$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$Type$valueConstructorDecoder))));
var $stil4m$elm_syntax$Elm$Syntax$TypeAlias$TypeAlias = F4(
	function (documentation, name, generics, typeAnnotation) {
		return {fG: documentation, d9: generics, f8: name, gI: typeAnnotation};
	});
var $stil4m$elm_syntax$Elm$Syntax$TypeAlias$decoder = A5(
	$elm$json$Json$Decode$map4,
	$stil4m$elm_syntax$Elm$Syntax$TypeAlias$TypeAlias,
	A2(
		$elm$json$Json$Decode$field,
		'documentation',
		$elm$json$Json$Decode$nullable(
			$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$Documentation$decoder))),
	A2(
		$elm$json$Json$Decode$field,
		'name',
		$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'generics',
		$elm$json$Json$Decode$list(
			$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$string))),
	A2(
		$elm$json$Json$Decode$field,
		'typeAnnotation',
		$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$decoder)));
var $stil4m$elm_syntax$Elm$Syntax$Declaration$decoder = $elm$json$Json$Decode$lazy(
	function (_v0) {
		return $stil4m$elm_syntax$Elm$Json$Util$decodeTyped(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'function',
					A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Declaration$FunctionDeclaration, $stil4m$elm_syntax$Elm$Syntax$Expression$functionDecoder)),
					_Utils_Tuple2(
					'typeAlias',
					A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Declaration$AliasDeclaration, $stil4m$elm_syntax$Elm$Syntax$TypeAlias$decoder)),
					_Utils_Tuple2(
					'typedecl',
					A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Declaration$CustomTypeDeclaration, $stil4m$elm_syntax$Elm$Syntax$Type$decoder)),
					_Utils_Tuple2(
					'port',
					A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Declaration$PortDeclaration, $stil4m$elm_syntax$Elm$Syntax$Signature$decoder)),
					_Utils_Tuple2(
					'infix',
					A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Declaration$InfixDeclaration, $stil4m$elm_syntax$Elm$Syntax$Infix$decoder)),
					_Utils_Tuple2(
					'destructuring',
					A3(
						$elm$json$Json$Decode$map2,
						$stil4m$elm_syntax$Elm$Syntax$Declaration$Destructuring,
						A2(
							$elm$json$Json$Decode$field,
							'pattern',
							$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$Pattern$decoder)),
						A2(
							$elm$json$Json$Decode$field,
							'expression',
							$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$Expression$decoder))))
				]));
	});
var $stil4m$elm_syntax$Elm$Syntax$Import$Import = F3(
	function (moduleName, moduleAlias, exposingList) {
		return {bI: exposingList, et: moduleAlias, a_: moduleName};
	});
var $stil4m$elm_syntax$Elm$Syntax$Exposing$All = function (a) {
	return {$: 0, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Exposing$Explicit = function (a) {
	return {$: 1, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Exposing$FunctionExpose = function (a) {
	return {$: 1, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Exposing$InfixExpose = function (a) {
	return {$: 0, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Exposing$TypeExpose = function (a) {
	return {$: 3, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Exposing$TypeOrAliasExpose = function (a) {
	return {$: 2, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Exposing$ExposedType = F2(
	function (name, open) {
		return {f8: name, ca: open};
	});
var $stil4m$elm_syntax$Elm$Syntax$Exposing$exposedTypeDecoder = A3(
	$elm$json$Json$Decode$map2,
	$stil4m$elm_syntax$Elm$Syntax$Exposing$ExposedType,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'open',
		$elm$json$Json$Decode$nullable($stil4m$elm_syntax$Elm$Syntax$Range$decoder)));
var $stil4m$elm_syntax$Elm$Syntax$Exposing$topLevelExposeDecoder = $stil4m$elm_syntax$Elm$Syntax$Node$decoder(
	$stil4m$elm_syntax$Elm$Json$Util$decodeTyped(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'infix',
				A2(
					$elm$json$Json$Decode$map,
					$stil4m$elm_syntax$Elm$Syntax$Exposing$InfixExpose,
					A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string))),
				_Utils_Tuple2(
				'function',
				A2(
					$elm$json$Json$Decode$map,
					$stil4m$elm_syntax$Elm$Syntax$Exposing$FunctionExpose,
					A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string))),
				_Utils_Tuple2(
				'typeOrAlias',
				A2(
					$elm$json$Json$Decode$map,
					$stil4m$elm_syntax$Elm$Syntax$Exposing$TypeOrAliasExpose,
					A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string))),
				_Utils_Tuple2(
				'typeexpose',
				A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Exposing$TypeExpose, $stil4m$elm_syntax$Elm$Syntax$Exposing$exposedTypeDecoder))
			])));
var $stil4m$elm_syntax$Elm$Syntax$Exposing$decoder = $stil4m$elm_syntax$Elm$Json$Util$decodeTyped(
	_List_fromArray(
		[
			_Utils_Tuple2(
			'all',
			A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Exposing$All, $stil4m$elm_syntax$Elm$Syntax$Range$decoder)),
			_Utils_Tuple2(
			'explicit',
			A2(
				$elm$json$Json$Decode$map,
				$stil4m$elm_syntax$Elm$Syntax$Exposing$Explicit,
				$elm$json$Json$Decode$list($stil4m$elm_syntax$Elm$Syntax$Exposing$topLevelExposeDecoder)))
		]));
var $stil4m$elm_syntax$Elm$Syntax$Import$decoder = A4(
	$elm$json$Json$Decode$map3,
	$stil4m$elm_syntax$Elm$Syntax$Import$Import,
	A2(
		$elm$json$Json$Decode$field,
		'moduleName',
		$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$ModuleName$decoder)),
	A2(
		$elm$json$Json$Decode$field,
		'moduleAlias',
		$elm$json$Json$Decode$nullable(
			$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$ModuleName$decoder))),
	A2(
		$elm$json$Json$Decode$field,
		'exposingList',
		$elm$json$Json$Decode$nullable(
			$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$Exposing$decoder))));
var $stil4m$elm_syntax$Elm$Syntax$Module$EffectModule = function (a) {
	return {$: 2, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Module$NormalModule = function (a) {
	return {$: 0, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Module$PortModule = function (a) {
	return {$: 1, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Module$DefaultModuleData = F2(
	function (moduleName, exposingList) {
		return {bI: exposingList, a_: moduleName};
	});
var $stil4m$elm_syntax$Elm$Syntax$Module$decodeDefaultModuleData = A3(
	$elm$json$Json$Decode$map2,
	$stil4m$elm_syntax$Elm$Syntax$Module$DefaultModuleData,
	A2(
		$elm$json$Json$Decode$field,
		'moduleName',
		$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$ModuleName$decoder)),
	A2(
		$elm$json$Json$Decode$field,
		'exposingList',
		$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$Exposing$decoder)));
var $stil4m$elm_syntax$Elm$Syntax$Module$EffectModuleData = F4(
	function (moduleName, exposingList, command, subscription) {
		return {cS: command, bI: exposingList, a_: moduleName, dF: subscription};
	});
var $stil4m$elm_syntax$Elm$Syntax$Module$decodeEffectModuleData = A5(
	$elm$json$Json$Decode$map4,
	$stil4m$elm_syntax$Elm$Syntax$Module$EffectModuleData,
	A2(
		$elm$json$Json$Decode$field,
		'moduleName',
		$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$ModuleName$decoder)),
	A2(
		$elm$json$Json$Decode$field,
		'exposingList',
		$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$Exposing$decoder)),
	A2(
		$elm$json$Json$Decode$field,
		'command',
		$elm$json$Json$Decode$nullable(
			$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$string))),
	A2(
		$elm$json$Json$Decode$field,
		'subscription',
		$elm$json$Json$Decode$nullable(
			$stil4m$elm_syntax$Elm$Syntax$Node$decoder($elm$json$Json$Decode$string))));
var $stil4m$elm_syntax$Elm$Syntax$Module$decoder = $stil4m$elm_syntax$Elm$Json$Util$decodeTyped(
	_List_fromArray(
		[
			_Utils_Tuple2(
			'normal',
			A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Module$NormalModule, $stil4m$elm_syntax$Elm$Syntax$Module$decodeDefaultModuleData)),
			_Utils_Tuple2(
			'port',
			A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Module$PortModule, $stil4m$elm_syntax$Elm$Syntax$Module$decodeDefaultModuleData)),
			_Utils_Tuple2(
			'effect',
			A2($elm$json$Json$Decode$map, $stil4m$elm_syntax$Elm$Syntax$Module$EffectModule, $stil4m$elm_syntax$Elm$Syntax$Module$decodeEffectModuleData))
		]));
var $stil4m$elm_syntax$Elm$Syntax$File$decoder = A5(
	$elm$json$Json$Decode$map4,
	$stil4m$elm_syntax$Elm$Syntax$File$File,
	A2(
		$elm$json$Json$Decode$field,
		'moduleDefinition',
		$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$Module$decoder)),
	A2(
		$elm$json$Json$Decode$field,
		'imports',
		$elm$json$Json$Decode$list(
			$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$Import$decoder))),
	A2(
		$elm$json$Json$Decode$field,
		'declarations',
		$elm$json$Json$Decode$list(
			$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$Declaration$decoder))),
	A2(
		$elm$json$Json$Decode$field,
		'comments',
		$elm$json$Json$Decode$list(
			$stil4m$elm_syntax$Elm$Syntax$Node$decoder($stil4m$elm_syntax$Elm$Syntax$Comments$decoder))));
var $stil4m$elm_syntax$Elm$RawFile$decoder = A2($elm$json$Json$Decode$map, $elm$core$Basics$identity, $stil4m$elm_syntax$Elm$Syntax$File$decoder);
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $author$project$Result$Extra$merge = function (r) {
	if (!r.$) {
		var rr = r.a;
		return rr;
	} else {
		var rr = r.a;
		return rr;
	}
};
var $stil4m$elm_syntax$Elm$Parser$State$State = $elm$core$Basics$identity;
var $stil4m$elm_syntax$Elm$Parser$State$emptyState = {fs: _List_Nil, ab: _List_Nil};
var $stil4m$elm_syntax$Combine$Parser = $elm$core$Basics$identity;
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = $elm$core$Basics$identity;
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0;
		return function (s0) {
			var _v1 = parseA(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				var _v2 = callback(a);
				var parseB = _v2;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
				}
			}
		};
	});
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					func(a),
					s1);
			} else {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			}
		};
	});
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $stil4m$elm_syntax$Combine$andMap = F2(
	function (_v0, _v1) {
		var rp = _v0;
		var lp = _v1;
		return function (state) {
			return A2(
				$elm$parser$Parser$andThen,
				function (_v2) {
					var newState = _v2.a;
					var a = _v2.b;
					return A2(
						$elm$parser$Parser$map,
						$elm$core$Tuple$mapSecond(a),
						rp(newState));
				},
				lp(state));
		};
	});
var $stil4m$elm_syntax$Elm$Parser$State$getComments = function (_v0) {
	var s = _v0;
	return s.fs;
};
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, a, s);
	};
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $stil4m$elm_syntax$Combine$succeed = function (res) {
	return function (state) {
		return $elm$parser$Parser$succeed(
			_Utils_Tuple2(state, res));
	};
};
var $stil4m$elm_syntax$Combine$withState = function (f) {
	return function (state) {
		return function (_v0) {
			var p = _v0;
			return p(state);
		}(
			f(state));
	};
};
var $stil4m$elm_syntax$Elm$Parser$File$collectComments = $stil4m$elm_syntax$Combine$withState(
	A2($elm$core$Basics$composeR, $stil4m$elm_syntax$Elm$Parser$State$getComments, $stil4m$elm_syntax$Combine$succeed));
var $elm$parser$Parser$Advanced$Empty = {$: 0};
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (!_v1.$) {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
	};
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $stil4m$elm_syntax$Combine$choice = function (xs) {
	return function (state) {
		return $elm$parser$Parser$oneOf(
			A2(
				$elm$core$List$map,
				function (_v0) {
					var x = _v0;
					return x(state);
				},
				xs));
	};
};
var $stil4m$elm_syntax$Elm$Syntax$Range$Range = F2(
	function (start, end) {
		return {bH: end, J: start};
	});
var $stil4m$elm_syntax$Elm$Syntax$Range$emptyRange = {
	bH: {W: 0, C: 0},
	J: {W: 0, C: 0}
};
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $stil4m$elm_syntax$Elm$Syntax$Range$compareLocations = F2(
	function (left, right) {
		return (_Utils_cmp(left.C, right.C) < 0) ? 0 : ((_Utils_cmp(right.C, left.C) < 0) ? 2 : A2($elm$core$Basics$compare, left.W, right.W));
	});
var $elm$core$List$sortWith = _List_sortWith;
var $stil4m$elm_syntax$Elm$Syntax$Range$sortLocations = $elm$core$List$sortWith($stil4m$elm_syntax$Elm$Syntax$Range$compareLocations);
var $stil4m$elm_syntax$Elm$Syntax$Range$combine = function (ranges) {
	var starts = $stil4m$elm_syntax$Elm$Syntax$Range$sortLocations(
		A2(
			$elm$core$List$map,
			function ($) {
				return $.J;
			},
			ranges));
	var ends = $elm$core$List$reverse(
		$stil4m$elm_syntax$Elm$Syntax$Range$sortLocations(
			A2(
				$elm$core$List$map,
				function ($) {
					return $.bH;
				},
				ranges)));
	return A2(
		$elm$core$Maybe$withDefault,
		$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
		A3(
			$elm$core$Maybe$map2,
			$stil4m$elm_syntax$Elm$Syntax$Range$Range,
			$elm$core$List$head(starts),
			$elm$core$List$head(ends)));
};
var $stil4m$elm_syntax$Elm$Syntax$Node$combine = F3(
	function (f, a, b) {
		var r1 = a.a;
		var r2 = b.a;
		return A2(
			$stil4m$elm_syntax$Elm$Syntax$Node$Node,
			$stil4m$elm_syntax$Elm$Syntax$Range$combine(
				_List_fromArray(
					[r1, r2])),
			A2(f, a, b));
	});
var $stil4m$elm_syntax$Combine$Done = function (a) {
	return {$: 1, a: a};
};
var $stil4m$elm_syntax$Combine$Loop = function (a) {
	return {$: 0, a: a};
};
var $stil4m$elm_syntax$Combine$andThen = F2(
	function (f, _v0) {
		var p = _v0;
		return function (state) {
			return A2(
				$elm$parser$Parser$andThen,
				function (_v1) {
					var s = _v1.a;
					var a = _v1.b;
					return function (_v2) {
						var x = _v2;
						return x(s);
					}(
						f(a));
				},
				p(state));
		};
	});
var $elm$parser$Parser$Advanced$backtrackable = function (_v0) {
	var parse = _v0;
	return function (s0) {
		var _v1 = parse(s0);
		if (_v1.$ === 1) {
			var x = _v1.b;
			return A2($elm$parser$Parser$Advanced$Bad, false, x);
		} else {
			var a = _v1.b;
			var s1 = _v1.c;
			return A3($elm$parser$Parser$Advanced$Good, false, a, s1);
		}
	};
};
var $elm$parser$Parser$backtrackable = $elm$parser$Parser$Advanced$backtrackable;
var $stil4m$elm_syntax$Combine$backtrackable = function (_v0) {
	var p = _v0;
	return function (state) {
		return $elm$parser$Parser$backtrackable(
			p(state));
	};
};
var $elm$core$String$slice = _String_slice;
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					A2(
						func,
						A3($elm$core$String$slice, s0.b, s1.b, s0.a),
						a),
					s1);
			}
		};
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $elm$parser$Parser$Expecting = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$toToken = function (str) {
	return A2(
		$elm$parser$Parser$Advanced$Token,
		str,
		$elm$parser$Parser$Expecting(str));
};
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {dV: col, fw: contextStack, eD: problem, C: row};
	});
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.C, s.dV, x, s.aM));
	});
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.b, s.C, s.dV, s.a);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{dV: newCol, aM: s.aM, f: s.f, b: newOffset, C: newRow, a: s.a});
	};
};
var $elm$parser$Parser$token = function (str) {
	return $elm$parser$Parser$Advanced$token(
		$elm$parser$Parser$toToken(str));
};
var $stil4m$elm_syntax$Combine$string = function (s) {
	return function (state) {
		return A2(
			$elm$parser$Parser$map,
			function (x) {
				return _Utils_Tuple2(state, x);
			},
			$elm$parser$Parser$getChompedString(
				$elm$parser$Parser$token(s)));
	};
};
var $stil4m$elm_syntax$Elm$Parser$Tokens$caseToken = $stil4m$elm_syntax$Combine$string('case');
var $elm$parser$Parser$Advanced$problem = function (x) {
	return function (s) {
		return A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$problem = function (msg) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(msg));
};
var $stil4m$elm_syntax$Combine$fail = function (m) {
	return function (state) {
		return A2(
			$elm$parser$Parser$map,
			function (x) {
				return _Utils_Tuple2(state, x);
			},
			$elm$parser$Parser$problem(m));
	};
};
var $elm$parser$Parser$UnexpectedChar = {$: 11};
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$parser$Parser$Advanced$chompIf = F2(
	function (isGood, expecting) {
		return function (s) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, s.b, s.a);
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : (_Utils_eq(newOffset, -2) ? A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{dV: 1, aM: s.aM, f: s.f, b: s.b + 1, C: s.C + 1, a: s.a}) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{dV: s.dV + 1, aM: s.aM, f: s.f, b: newOffset, C: s.C, a: s.a}));
		};
	});
var $elm$parser$Parser$chompIf = function (isGood) {
	return A2($elm$parser$Parser$Advanced$chompIf, isGood, $elm$parser$Parser$UnexpectedChar);
};
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0;
		var parseB = _v1;
		return function (s0) {
			var _v2 = parseA(s0);
			if (_v2.$ === 1) {
				var p = _v2.a;
				var x = _v2.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v2.a;
				var a = _v2.b;
				var s1 = _v2.c;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p1 || p2,
						A2(func, a, b),
						s2);
				}
			}
		};
	});
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $stil4m$elm_syntax$Combine$fromCore = function (p) {
	return function (state) {
		return A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed(
				function (v) {
					return _Utils_Tuple2(state, v);
				}),
			p);
	};
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $stil4m$elm_syntax$Combine$Char$satisfy = function (pred) {
	return $stil4m$elm_syntax$Combine$fromCore(
		A2(
			$elm$parser$Parser$andThen,
			function (s) {
				var _v0 = $elm$core$String$toList(s);
				if (!_v0.b) {
					return $elm$parser$Parser$succeed($elm$core$Maybe$Nothing);
				} else {
					var c = _v0.a;
					return $elm$parser$Parser$succeed(
						$elm$core$Maybe$Just(c));
				}
			},
			$elm$parser$Parser$getChompedString(
				$elm$parser$Parser$chompIf(pred))));
};
var $stil4m$elm_syntax$Combine$Char$anyChar = A2(
	$stil4m$elm_syntax$Combine$andThen,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$Maybe$map($stil4m$elm_syntax$Combine$succeed),
		$elm$core$Maybe$withDefault(
			$stil4m$elm_syntax$Combine$fail('expected any character'))),
	$stil4m$elm_syntax$Combine$Char$satisfy(
		$elm$core$Basics$always(true)));
var $elm$core$String$fromList = _String_fromList;
var $stil4m$elm_syntax$Combine$Char$char = function (c) {
	return A2(
		$stil4m$elm_syntax$Combine$andThen,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Maybe$map($stil4m$elm_syntax$Combine$succeed),
			$elm$core$Maybe$withDefault(
				$stil4m$elm_syntax$Combine$fail(
					'expected \'' + ($elm$core$String$fromList(
						_List_fromArray(
							[c])) + '\'')))),
		$stil4m$elm_syntax$Combine$Char$satisfy(
			$elm$core$Basics$eq(c)));
};
var $stil4m$elm_syntax$Combine$map = F2(
	function (f, _v0) {
		var p = _v0;
		return function (state) {
			return A2(
				$elm$parser$Parser$map,
				function (_v1) {
					var s = _v1.a;
					var a = _v1.b;
					return _Utils_Tuple2(
						s,
						f(a));
				},
				p(state));
		};
	});
var $stil4m$elm_syntax$Combine$continueWith = F2(
	function (target, dropped) {
		return A2(
			$stil4m$elm_syntax$Combine$andMap,
			target,
			A2(
				$stil4m$elm_syntax$Combine$map,
				F2(
					function (b, a) {
						return A2($elm$core$Basics$always, a, b);
					}),
				dropped));
	});
var $stil4m$elm_syntax$Combine$ignore = F2(
	function (dropped, target) {
		return A2(
			$stil4m$elm_syntax$Combine$andMap,
			dropped,
			A2($stil4m$elm_syntax$Combine$map, $elm$core$Basics$always, target));
	});
var $stil4m$elm_syntax$Combine$or = F2(
	function (_v0, _v1) {
		var lp = _v0;
		var rp = _v1;
		return function (state) {
			return $elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						lp(state),
						rp(state)
					]));
		};
	});
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.a);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.b, offset) < 0,
					0,
					{dV: col, aM: s0.aM, f: s0.f, b: offset, C: row, a: s0.a});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return function (s) {
		return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.b, s.C, s.dV, s);
	};
};
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $elm$core$Char$fromCode = _Char_fromCode;
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Basics$pow = _Basics_pow;
var $rtfeldman$elm_hex$Hex$fromStringHelp = F3(
	function (position, chars, accumulated) {
		fromStringHelp:
		while (true) {
			if (!chars.b) {
				return $elm$core$Result$Ok(accumulated);
			} else {
				var _char = chars.a;
				var rest = chars.b;
				switch (_char) {
					case '0':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated;
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '1':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + A2($elm$core$Basics$pow, 16, position);
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '2':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (2 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '3':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (3 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '4':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (4 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '5':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (5 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '6':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (6 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '7':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (7 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '8':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (8 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '9':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (9 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'a':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (10 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'b':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (11 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'c':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (12 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'd':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (13 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'e':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (14 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'f':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (15 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					default:
						var nonHex = _char;
						return $elm$core$Result$Err(
							$elm$core$String$fromChar(nonHex) + ' is not a valid hexadecimal character.');
				}
			}
		}
	});
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $rtfeldman$elm_hex$Hex$fromString = function (str) {
	if ($elm$core$String$isEmpty(str)) {
		return $elm$core$Result$Err('Empty strings are not valid hexadecimal strings.');
	} else {
		var result = function () {
			if (A2($elm$core$String$startsWith, '-', str)) {
				var list = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					$elm$core$List$tail(
						$elm$core$String$toList(str)));
				return A2(
					$elm$core$Result$map,
					$elm$core$Basics$negate,
					A3(
						$rtfeldman$elm_hex$Hex$fromStringHelp,
						$elm$core$List$length(list) - 1,
						list,
						0));
			} else {
				return A3(
					$rtfeldman$elm_hex$Hex$fromStringHelp,
					$elm$core$String$length(str) - 1,
					$elm$core$String$toList(str),
					0);
			}
		}();
		var formatError = function (err) {
			return A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					['\"' + (str + '\"'), 'is not a valid hexadecimal string because', err]));
		};
		return A2($elm$core$Result$mapError, formatError, result);
	}
};
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 8, a: a};
};
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $elm$parser$Parser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $elm$core$String$toLower = _String_toLower;
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $stil4m$elm_syntax$Elm$Parser$Tokens$escapedCharValue = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed('\''),
			$elm$parser$Parser$symbol('\'')),
			A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed('\"'),
			$elm$parser$Parser$symbol('\"')),
			A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed('\n'),
			$elm$parser$Parser$symbol('n')),
			A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed('\t'),
			$elm$parser$Parser$symbol('t')),
			A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed('\u000D'),
			$elm$parser$Parser$symbol('r')),
			A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed('\\'),
			$elm$parser$Parser$symbol('\\')),
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						A2(
							$elm$core$Basics$composeR,
							$elm$core$String$toLower,
							A2(
								$elm$core$Basics$composeR,
								$rtfeldman$elm_hex$Hex$fromString,
								A2(
									$elm$core$Basics$composeR,
									$elm$core$Result$withDefault(0),
									$elm$core$Char$fromCode)))),
					$elm$parser$Parser$symbol('u')),
				$elm$parser$Parser$symbol('{')),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$getChompedString(
					$elm$parser$Parser$chompWhile(
						function (c) {
							return A2(
								$elm$core$String$any,
								$elm$core$Basics$eq(c),
								'0123456789ABCDEFabcdef');
						})),
				$elm$parser$Parser$symbol('}')))
		]));
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $stil4m$elm_syntax$Elm$Parser$Tokens$quotedSingleQuote = $stil4m$elm_syntax$Combine$fromCore(
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				A2(
					$elm$core$Basics$composeR,
					$elm$core$String$toList,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$List$head,
						$elm$core$Maybe$withDefault(' ')))),
			$elm$parser$Parser$symbol('\'')),
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$succeed(
								A2($elm$core$Basics$composeR, $elm$core$List$singleton, $elm$core$String$fromList)),
							$elm$parser$Parser$symbol('\\')),
						$stil4m$elm_syntax$Elm$Parser$Tokens$escapedCharValue),
						$elm$parser$Parser$getChompedString(
						$elm$parser$Parser$chompIf(
							$elm$core$Basics$always(true)))
					])),
			$elm$parser$Parser$symbol('\''))));
var $stil4m$elm_syntax$Elm$Parser$Tokens$characterLiteral = A2(
	$stil4m$elm_syntax$Combine$or,
	$stil4m$elm_syntax$Elm$Parser$Tokens$quotedSingleQuote,
	A2(
		$stil4m$elm_syntax$Combine$ignore,
		$stil4m$elm_syntax$Combine$Char$char('\''),
		A2(
			$stil4m$elm_syntax$Combine$continueWith,
			$stil4m$elm_syntax$Combine$Char$anyChar,
			$stil4m$elm_syntax$Combine$Char$char('\''))));
var $stil4m$elm_syntax$Elm$Parser$Node$asPointerLocation = function (_v0) {
	var line = _v0.aW;
	var column = _v0.W;
	return {W: column, C: line};
};
var $stil4m$elm_syntax$Combine$app = function (_v0) {
	var inner = _v0;
	return inner;
};
var $elm$parser$Parser$Advanced$getPosition = function (s) {
	return A3(
		$elm$parser$Parser$Advanced$Good,
		false,
		_Utils_Tuple2(s.C, s.dV),
		s);
};
var $elm$parser$Parser$getPosition = $elm$parser$Parser$Advanced$getPosition;
var $stil4m$elm_syntax$Combine$withLocation = function (f) {
	return function (state) {
		return A2(
			$elm$parser$Parser$andThen,
			function (loc) {
				return A2(
					$stil4m$elm_syntax$Combine$app,
					f(loc),
					state);
			},
			A2(
				$elm$parser$Parser$map,
				function (_v0) {
					var row = _v0.a;
					var col = _v0.b;
					return {W: col, aW: row};
				},
				$elm$parser$Parser$getPosition));
	};
};
var $stil4m$elm_syntax$Elm$Parser$Node$parser = function (p) {
	return $stil4m$elm_syntax$Combine$withLocation(
		function (start) {
			return A2(
				$stil4m$elm_syntax$Combine$andMap,
				$stil4m$elm_syntax$Combine$withLocation(
					function (end) {
						return $stil4m$elm_syntax$Combine$succeed(
							{
								bH: $stil4m$elm_syntax$Elm$Parser$Node$asPointerLocation(end),
								J: $stil4m$elm_syntax$Elm$Parser$Node$asPointerLocation(start)
							});
					}),
				A2(
					$stil4m$elm_syntax$Combine$andMap,
					p,
					$stil4m$elm_syntax$Combine$succeed(
						F2(
							function (v, r) {
								return A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, v);
							}))));
		});
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$charLiteralExpression = $stil4m$elm_syntax$Elm$Parser$Node$parser(
	A2($stil4m$elm_syntax$Combine$map, $stil4m$elm_syntax$Elm$Syntax$Expression$CharLiteral, $stil4m$elm_syntax$Elm$Parser$Tokens$characterLiteral));
var $stil4m$elm_syntax$Elm$Parser$Tokens$elseToken = $stil4m$elm_syntax$Combine$string('else');
var $stil4m$elm_syntax$Elm$Parser$State$currentIndent = function (_v0) {
	var indents = _v0.ab;
	return A2(
		$elm$core$Maybe$withDefault,
		0,
		$elm$core$List$head(indents));
};
var $stil4m$elm_syntax$Elm$Parser$State$expectedColumn = A2(
	$elm$core$Basics$composeR,
	$stil4m$elm_syntax$Elm$Parser$State$currentIndent,
	$elm$core$Basics$add(1));
var $stil4m$elm_syntax$Combine$between = F3(
	function (lp, rp, p) {
		return A2(
			$stil4m$elm_syntax$Combine$ignore,
			rp,
			A2($stil4m$elm_syntax$Combine$continueWith, p, lp));
	});
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $stil4m$elm_syntax$Elm$Parser$Tokens$reservedList = _List_fromArray(
	['module', 'exposing', 'import', 'as', 'if', 'then', 'else', 'let', 'in', 'case', 'of', 'port', 'infixr', 'infixl', 'type', 'where']);
var $elm$parser$Parser$ExpectingVariable = {$: 7};
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm$parser$Parser$Advanced$varHelp = F7(
	function (isGood, offset, row, col, src, indent, context) {
		varHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, src);
			if (_Utils_eq(newOffset, -1)) {
				return {dV: col, aM: context, f: indent, b: offset, C: row, a: src};
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$src = src,
						$temp$indent = indent,
						$temp$context = context;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					src = $temp$src;
					indent = $temp$indent;
					context = $temp$context;
					continue varHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$src = src,
						$temp$indent = indent,
						$temp$context = context;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					src = $temp$src;
					indent = $temp$indent;
					context = $temp$context;
					continue varHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$variable = function (i) {
	return function (s) {
		var firstOffset = A3($elm$parser$Parser$Advanced$isSubChar, i.J, s.b, s.a);
		if (_Utils_eq(firstOffset, -1)) {
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, i.d2));
		} else {
			var s1 = _Utils_eq(firstOffset, -2) ? A7($elm$parser$Parser$Advanced$varHelp, i.eh, s.b + 1, s.C + 1, 1, s.a, s.f, s.aM) : A7($elm$parser$Parser$Advanced$varHelp, i.eh, firstOffset, s.C, s.dV + 1, s.a, s.f, s.aM);
			var name = A3($elm$core$String$slice, s.b, s1.b, s.a);
			return A2($elm$core$Set$member, name, i.eL) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, i.d2)) : A3($elm$parser$Parser$Advanced$Good, true, name, s1);
		}
	};
};
var $elm$parser$Parser$variable = function (i) {
	return $elm$parser$Parser$Advanced$variable(
		{d2: $elm$parser$Parser$ExpectingVariable, eh: i.eh, eL: i.eL, J: i.J});
};
var $stil4m$elm_syntax$Elm$Parser$Tokens$functionName = $stil4m$elm_syntax$Combine$fromCore(
	$elm$parser$Parser$variable(
		{
			eh: function (c) {
				return $elm$core$Char$isAlphaNum(c) || (c === '_');
			},
			eL: $elm$core$Set$fromList($stil4m$elm_syntax$Elm$Parser$Tokens$reservedList),
			J: $elm$core$Char$isLower
		}));
var $elm$parser$Parser$ExpectingKeyword = function (a) {
	return {$: 9, a: a};
};
var $elm$parser$Parser$Advanced$keyword = function (_v0) {
	var kwd = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(kwd);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, kwd, s.b, s.C, s.dV, s.a);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return (_Utils_eq(newOffset, -1) || (0 <= A3(
			$elm$parser$Parser$Advanced$isSubChar,
			function (c) {
				return $elm$core$Char$isAlphaNum(c) || (c === '_');
			},
			newOffset,
			s.a))) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{dV: newCol, aM: s.aM, f: s.f, b: newOffset, C: newRow, a: s.a});
	};
};
var $elm$parser$Parser$keyword = function (kwd) {
	return $elm$parser$Parser$Advanced$keyword(
		A2(
			$elm$parser$Parser$Advanced$Token,
			kwd,
			$elm$parser$Parser$ExpectingKeyword(kwd)));
};
var $elm$parser$Parser$Advanced$lazy = function (thunk) {
	return function (s) {
		var _v0 = thunk(0);
		var parse = _v0;
		return parse(s);
	};
};
var $elm$parser$Parser$lazy = $elm$parser$Parser$Advanced$lazy;
var $stil4m$elm_syntax$Combine$lazy = function (t) {
	return function (state) {
		return $elm$parser$Parser$lazy(
			function (_v0) {
				return function (_v1) {
					var t_ = _v1;
					return t_(state);
				}(
					t(0));
			});
	};
};
var $elm$parser$Parser$Nestable = 1;
var $elm$parser$Parser$Advanced$findSubString = _Parser_findSubString;
var $elm$parser$Parser$Advanced$fromInfo = F4(
	function (row, col, x, context) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, row, col, x, context));
	});
var $elm$parser$Parser$Advanced$chompUntil = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$findSubString, str, s.b, s.C, s.dV, s.a);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A4($elm$parser$Parser$Advanced$fromInfo, newRow, newCol, expecting, s.aM)) : A3(
			$elm$parser$Parser$Advanced$Good,
			_Utils_cmp(s.b, newOffset) < 0,
			0,
			{dV: newCol, aM: s.aM, f: s.f, b: newOffset, C: newRow, a: s.a});
	};
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$parser$Parser$Advanced$isChar = function (_char) {
	return true;
};
var $elm$parser$Parser$Advanced$revAlways = F2(
	function (_v0, b) {
		return b;
	});
var $elm$parser$Parser$Advanced$skip = F2(
	function (iParser, kParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$parser$Parser$Advanced$revAlways, iParser, kParser);
	});
var $elm$parser$Parser$Advanced$nestableHelp = F5(
	function (isNotRelevant, open, close, expectingClose, nestLevel) {
		return A2(
			$elm$parser$Parser$Advanced$skip,
			$elm$parser$Parser$Advanced$chompWhile(isNotRelevant),
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						(nestLevel === 1) ? close : A2(
						$elm$parser$Parser$Advanced$andThen,
						function (_v0) {
							return A5($elm$parser$Parser$Advanced$nestableHelp, isNotRelevant, open, close, expectingClose, nestLevel - 1);
						},
						close),
						A2(
						$elm$parser$Parser$Advanced$andThen,
						function (_v1) {
							return A5($elm$parser$Parser$Advanced$nestableHelp, isNotRelevant, open, close, expectingClose, nestLevel + 1);
						},
						open),
						A2(
						$elm$parser$Parser$Advanced$andThen,
						function (_v2) {
							return A5($elm$parser$Parser$Advanced$nestableHelp, isNotRelevant, open, close, expectingClose, nestLevel);
						},
						A2($elm$parser$Parser$Advanced$chompIf, $elm$parser$Parser$Advanced$isChar, expectingClose))
					])));
	});
var $elm$parser$Parser$Advanced$nestableComment = F2(
	function (open, close) {
		var oStr = open.a;
		var oX = open.b;
		var cStr = close.a;
		var cX = close.b;
		var _v0 = $elm$core$String$uncons(oStr);
		if (_v0.$ === 1) {
			return $elm$parser$Parser$Advanced$problem(oX);
		} else {
			var _v1 = _v0.a;
			var openChar = _v1.a;
			var _v2 = $elm$core$String$uncons(cStr);
			if (_v2.$ === 1) {
				return $elm$parser$Parser$Advanced$problem(cX);
			} else {
				var _v3 = _v2.a;
				var closeChar = _v3.a;
				var isNotRelevant = function (_char) {
					return (!_Utils_eq(_char, openChar)) && (!_Utils_eq(_char, closeChar));
				};
				var chompOpen = $elm$parser$Parser$Advanced$token(open);
				return A2(
					$elm$parser$Parser$Advanced$ignorer,
					chompOpen,
					A5(
						$elm$parser$Parser$Advanced$nestableHelp,
						isNotRelevant,
						chompOpen,
						$elm$parser$Parser$Advanced$token(close),
						cX,
						1));
			}
		}
	});
var $elm$parser$Parser$Advanced$multiComment = F3(
	function (open, close, nestable) {
		if (!nestable) {
			return A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$token(open),
				$elm$parser$Parser$Advanced$chompUntil(close));
		} else {
			return A2($elm$parser$Parser$Advanced$nestableComment, open, close);
		}
	});
var $elm$parser$Parser$Advanced$Nestable = 1;
var $elm$parser$Parser$Advanced$NotNestable = 0;
var $elm$parser$Parser$toAdvancedNestable = function (nestable) {
	if (!nestable) {
		return 0;
	} else {
		return 1;
	}
};
var $elm$parser$Parser$multiComment = F3(
	function (open, close, nestable) {
		return A3(
			$elm$parser$Parser$Advanced$multiComment,
			$elm$parser$Parser$toToken(open),
			$elm$parser$Parser$toToken(close),
			$elm$parser$Parser$toAdvancedNestable(nestable));
	});
var $stil4m$elm_syntax$Elm$Parser$Comments$multilineCommentInner = $stil4m$elm_syntax$Combine$fromCore(
	$elm$parser$Parser$getChompedString(
		A3($elm$parser$Parser$multiComment, '{-', '-}', 1)));
var $stil4m$elm_syntax$Elm$Parser$State$addComment = F2(
	function (pair, _v0) {
		var s = _v0;
		return _Utils_update(
			s,
			{
				fs: A2($elm$core$List$cons, pair, s.fs)
			});
	});
var $stil4m$elm_syntax$Combine$modifyState = function (f) {
	return function (state) {
		return $elm$parser$Parser$succeed(
			_Utils_Tuple2(
				f(state),
				0));
	};
};
var $stil4m$elm_syntax$Elm$Parser$Comments$addCommentToState = function (p) {
	return A2(
		$stil4m$elm_syntax$Combine$andThen,
		function (pair) {
			return A2(
				$stil4m$elm_syntax$Combine$continueWith,
				$stil4m$elm_syntax$Combine$succeed(0),
				$stil4m$elm_syntax$Combine$modifyState(
					$stil4m$elm_syntax$Elm$Parser$State$addComment(pair)));
		},
		p);
};
var $stil4m$elm_syntax$Elm$Parser$Comments$parseComment = function (commentParser) {
	return $stil4m$elm_syntax$Elm$Parser$Comments$addCommentToState(
		$stil4m$elm_syntax$Elm$Parser$Node$parser(commentParser));
};
var $stil4m$elm_syntax$Elm$Parser$Comments$multilineComment = $stil4m$elm_syntax$Combine$lazy(
	function (_v0) {
		return $stil4m$elm_syntax$Elm$Parser$Comments$parseComment($stil4m$elm_syntax$Elm$Parser$Comments$multilineCommentInner);
	});
var $stil4m$elm_syntax$Elm$Parser$Whitespace$untilNewlineToken = $stil4m$elm_syntax$Combine$fromCore(
	$elm$parser$Parser$getChompedString(
		$elm$parser$Parser$chompWhile(
			function (c) {
				return (c !== '\u000D') && (c !== '\n');
			})));
var $stil4m$elm_syntax$Elm$Parser$Comments$singleLineComment = $stil4m$elm_syntax$Elm$Parser$Comments$parseComment(
	A2(
		$stil4m$elm_syntax$Combine$andMap,
		$stil4m$elm_syntax$Elm$Parser$Whitespace$untilNewlineToken,
		A2(
			$stil4m$elm_syntax$Combine$andMap,
			$stil4m$elm_syntax$Combine$string('--'),
			$stil4m$elm_syntax$Combine$succeed($elm$core$Basics$append))));
var $stil4m$elm_syntax$Elm$Parser$Layout$anyComment = A2($stil4m$elm_syntax$Combine$or, $stil4m$elm_syntax$Elm$Parser$Comments$singleLineComment, $stil4m$elm_syntax$Elm$Parser$Comments$multilineComment);
var $elm$parser$Parser$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0;
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
				if (!step.$) {
					var newState = step.a;
					var $temp$p = p || p1,
						$temp$state = newState,
						$temp$callback = callback,
						$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return function (s) {
			return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
		};
	});
var $elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$toAdvancedStep = function (step) {
	if (!step.$) {
		var s = step.a;
		return $elm$parser$Parser$Advanced$Loop(s);
	} else {
		var a = step.a;
		return $elm$parser$Parser$Advanced$Done(a);
	}
};
var $elm$parser$Parser$loop = F2(
	function (state, callback) {
		return A2(
			$elm$parser$Parser$Advanced$loop,
			state,
			function (s) {
				return A2(
					$elm$parser$Parser$map,
					$elm$parser$Parser$toAdvancedStep,
					callback(s));
			});
	});
var $stil4m$elm_syntax$Combine$many = function (p) {
	var helper = function (_v2) {
		var oldState = _v2.a;
		var items = _v2.b;
		return $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$keeper,
					$elm$parser$Parser$succeed(
						function (_v0) {
							var newState = _v0.a;
							var item = _v0.b;
							return $elm$parser$Parser$Loop(
								_Utils_Tuple2(
									newState,
									A2($elm$core$List$cons, item, items)));
						}),
					A2($stil4m$elm_syntax$Combine$app, p, oldState)),
					A2(
					$elm$parser$Parser$map,
					function (_v1) {
						return $elm$parser$Parser$Done(
							_Utils_Tuple2(
								oldState,
								$elm$core$List$reverse(items)));
					},
					$elm$parser$Parser$succeed(0))
				]));
	};
	return function (state) {
		return A2(
			$elm$parser$Parser$loop,
			_Utils_Tuple2(state, _List_Nil),
			helper);
	};
};
var $stil4m$elm_syntax$Combine$many1 = function (p) {
	return A2(
		$stil4m$elm_syntax$Combine$andMap,
		$stil4m$elm_syntax$Combine$many(p),
		A2(
			$stil4m$elm_syntax$Combine$andMap,
			p,
			$stil4m$elm_syntax$Combine$succeed($elm$core$List$cons)));
};
var $stil4m$elm_syntax$Elm$Parser$Whitespace$many1Spaces = $stil4m$elm_syntax$Combine$fromCore(
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$token(' '),
		$elm$parser$Parser$chompWhile(
			function (c) {
				return c === ' ';
			})));
var $stil4m$elm_syntax$Elm$Parser$Whitespace$realNewLine = $stil4m$elm_syntax$Combine$fromCore(
	$elm$parser$Parser$getChompedString(
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(0),
				$elm$parser$Parser$oneOf(
					_List_fromArray(
						[
							$elm$parser$Parser$chompIf(
							$elm$core$Basics$eq('\u000D')),
							$elm$parser$Parser$succeed(0)
						]))),
			$elm$parser$Parser$symbol('\n'))));
var $stil4m$elm_syntax$Elm$Parser$Layout$verifyIndent = function (f) {
	return $stil4m$elm_syntax$Combine$withState(
		function (s) {
			return $stil4m$elm_syntax$Combine$withLocation(
				function (l) {
					return A2(
						f,
						$stil4m$elm_syntax$Elm$Parser$State$expectedColumn(s),
						l.W) ? $stil4m$elm_syntax$Combine$succeed(0) : $stil4m$elm_syntax$Combine$fail(
						'Expected higher indent than ' + $elm$core$String$fromInt(l.W));
				});
		});
};
var $stil4m$elm_syntax$Elm$Parser$Layout$layout = A2(
	$stil4m$elm_syntax$Combine$continueWith,
	$stil4m$elm_syntax$Elm$Parser$Layout$verifyIndent(
		F2(
			function (stateIndent, current) {
				return _Utils_cmp(stateIndent, current) < 0;
			})),
	$stil4m$elm_syntax$Combine$many1(
		$stil4m$elm_syntax$Combine$choice(
			_List_fromArray(
				[
					$stil4m$elm_syntax$Elm$Parser$Layout$anyComment,
					A2(
					$stil4m$elm_syntax$Combine$continueWith,
					$stil4m$elm_syntax$Combine$choice(
						_List_fromArray(
							[$stil4m$elm_syntax$Elm$Parser$Whitespace$many1Spaces, $stil4m$elm_syntax$Elm$Parser$Layout$anyComment])),
					$stil4m$elm_syntax$Combine$many1($stil4m$elm_syntax$Elm$Parser$Whitespace$realNewLine)),
					$stil4m$elm_syntax$Elm$Parser$Whitespace$many1Spaces
				]))));
var $stil4m$elm_syntax$Combine$maybe = function (_v0) {
	var p = _v0;
	return function (state) {
		return $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$map,
					function (_v1) {
						var c = _v1.a;
						var v = _v1.b;
						return _Utils_Tuple2(
							c,
							$elm$core$Maybe$Just(v));
					},
					p(state)),
					$elm$parser$Parser$succeed(
					_Utils_Tuple2(state, $elm$core$Maybe$Nothing))
				]));
	};
};
var $stil4m$elm_syntax$Elm$Parser$Layout$maybeAroundBothSides = function (x) {
	return A2(
		$stil4m$elm_syntax$Combine$ignore,
		$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
		A2(
			$stil4m$elm_syntax$Combine$continueWith,
			x,
			$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout)));
};
var $elm$parser$Parser$ExpectingBinary = {$: 4};
var $elm$parser$Parser$ExpectingFloat = {$: 5};
var $elm$parser$Parser$ExpectingHex = {$: 2};
var $elm$parser$Parser$ExpectingInt = {$: 1};
var $elm$parser$Parser$ExpectingNumber = {$: 6};
var $elm$parser$Parser$ExpectingOctal = {$: 3};
var $elm$core$Result$fromMaybe = F2(
	function (err, maybe) {
		if (!maybe.$) {
			var v = maybe.a;
			return $elm$core$Result$Ok(v);
		} else {
			return $elm$core$Result$Err(err);
		}
	});
var $elm$parser$Parser$Advanced$consumeBase = _Parser_consumeBase;
var $elm$parser$Parser$Advanced$consumeBase16 = _Parser_consumeBase16;
var $elm$parser$Parser$Advanced$bumpOffset = F2(
	function (newOffset, s) {
		return {dV: s.dV + (newOffset - s.b), aM: s.aM, f: s.f, b: newOffset, C: s.C, a: s.a};
	});
var $elm$parser$Parser$Advanced$chompBase10 = _Parser_chompBase10;
var $elm$parser$Parser$Advanced$isAsciiCode = _Parser_isAsciiCode;
var $elm$parser$Parser$Advanced$consumeExp = F2(
	function (offset, src) {
		if (A3($elm$parser$Parser$Advanced$isAsciiCode, 101, offset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 69, offset, src)) {
			var eOffset = offset + 1;
			var expOffset = (A3($elm$parser$Parser$Advanced$isAsciiCode, 43, eOffset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 45, eOffset, src)) ? (eOffset + 1) : eOffset;
			var newOffset = A2($elm$parser$Parser$Advanced$chompBase10, expOffset, src);
			return _Utils_eq(expOffset, newOffset) ? (-newOffset) : newOffset;
		} else {
			return offset;
		}
	});
var $elm$parser$Parser$Advanced$consumeDotAndExp = F2(
	function (offset, src) {
		return A3($elm$parser$Parser$Advanced$isAsciiCode, 46, offset, src) ? A2(
			$elm$parser$Parser$Advanced$consumeExp,
			A2($elm$parser$Parser$Advanced$chompBase10, offset + 1, src),
			src) : A2($elm$parser$Parser$Advanced$consumeExp, offset, src);
	});
var $elm$parser$Parser$Advanced$finalizeInt = F5(
	function (invalid, handler, startOffset, _v0, s) {
		var endOffset = _v0.a;
		var n = _v0.b;
		if (handler.$ === 1) {
			var x = handler.a;
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		} else {
			var toValue = handler.a;
			return _Utils_eq(startOffset, endOffset) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				_Utils_cmp(s.b, startOffset) < 0,
				A2($elm$parser$Parser$Advanced$fromState, s, invalid)) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				toValue(n),
				A2($elm$parser$Parser$Advanced$bumpOffset, endOffset, s));
		}
	});
var $elm$core$String$toFloat = _String_toFloat;
var $elm$parser$Parser$Advanced$finalizeFloat = F6(
	function (invalid, expecting, intSettings, floatSettings, intPair, s) {
		var intOffset = intPair.a;
		var floatOffset = A2($elm$parser$Parser$Advanced$consumeDotAndExp, intOffset, s.a);
		if (floatOffset < 0) {
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A4($elm$parser$Parser$Advanced$fromInfo, s.C, s.dV - (floatOffset + s.b), invalid, s.aM));
		} else {
			if (_Utils_eq(s.b, floatOffset)) {
				return A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, expecting));
			} else {
				if (_Utils_eq(intOffset, floatOffset)) {
					return A5($elm$parser$Parser$Advanced$finalizeInt, invalid, intSettings, s.b, intPair, s);
				} else {
					if (floatSettings.$ === 1) {
						var x = floatSettings.a;
						return A2(
							$elm$parser$Parser$Advanced$Bad,
							true,
							A2($elm$parser$Parser$Advanced$fromState, s, invalid));
					} else {
						var toValue = floatSettings.a;
						var _v1 = $elm$core$String$toFloat(
							A3($elm$core$String$slice, s.b, floatOffset, s.a));
						if (_v1.$ === 1) {
							return A2(
								$elm$parser$Parser$Advanced$Bad,
								true,
								A2($elm$parser$Parser$Advanced$fromState, s, invalid));
						} else {
							var n = _v1.a;
							return A3(
								$elm$parser$Parser$Advanced$Good,
								true,
								toValue(n),
								A2($elm$parser$Parser$Advanced$bumpOffset, floatOffset, s));
						}
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$number = function (c) {
	return function (s) {
		if (A3($elm$parser$Parser$Advanced$isAsciiCode, 48, s.b, s.a)) {
			var zeroOffset = s.b + 1;
			var baseOffset = zeroOffset + 1;
			return A3($elm$parser$Parser$Advanced$isAsciiCode, 120, zeroOffset, s.a) ? A5(
				$elm$parser$Parser$Advanced$finalizeInt,
				c.f$,
				c.fR,
				baseOffset,
				A2($elm$parser$Parser$Advanced$consumeBase16, baseOffset, s.a),
				s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 111, zeroOffset, s.a) ? A5(
				$elm$parser$Parser$Advanced$finalizeInt,
				c.f$,
				c.ex,
				baseOffset,
				A3($elm$parser$Parser$Advanced$consumeBase, 8, baseOffset, s.a),
				s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 98, zeroOffset, s.a) ? A5(
				$elm$parser$Parser$Advanced$finalizeInt,
				c.f$,
				c.dR,
				baseOffset,
				A3($elm$parser$Parser$Advanced$consumeBase, 2, baseOffset, s.a),
				s) : A6(
				$elm$parser$Parser$Advanced$finalizeFloat,
				c.f$,
				c.d2,
				c.ej,
				c.d7,
				_Utils_Tuple2(zeroOffset, 0),
				s)));
		} else {
			return A6(
				$elm$parser$Parser$Advanced$finalizeFloat,
				c.f$,
				c.d2,
				c.ej,
				c.d7,
				A3($elm$parser$Parser$Advanced$consumeBase, 10, s.b, s.a),
				s);
		}
	};
};
var $elm$parser$Parser$number = function (i) {
	return $elm$parser$Parser$Advanced$number(
		{
			dR: A2($elm$core$Result$fromMaybe, $elm$parser$Parser$ExpectingBinary, i.dR),
			d2: $elm$parser$Parser$ExpectingNumber,
			d7: A2($elm$core$Result$fromMaybe, $elm$parser$Parser$ExpectingFloat, i.d7),
			fR: A2($elm$core$Result$fromMaybe, $elm$parser$Parser$ExpectingHex, i.fR),
			ej: A2($elm$core$Result$fromMaybe, $elm$parser$Parser$ExpectingInt, i.ej),
			f$: $elm$parser$Parser$ExpectingNumber,
			ex: A2($elm$core$Result$fromMaybe, $elm$parser$Parser$ExpectingOctal, i.ex)
		});
};
var $stil4m$elm_syntax$Elm$Parser$Numbers$raw = F3(
	function (floatf, intf, hexf) {
		return $elm$parser$Parser$number(
			{
				dR: $elm$core$Maybe$Nothing,
				d7: $elm$core$Maybe$Just(floatf),
				fR: $elm$core$Maybe$Just(hexf),
				ej: $elm$core$Maybe$Just(intf),
				ex: $elm$core$Maybe$Nothing
			});
	});
var $stil4m$elm_syntax$Elm$Parser$Numbers$number = F3(
	function (floatf, intf, hexf) {
		return $stil4m$elm_syntax$Combine$fromCore(
			A3($stil4m$elm_syntax$Elm$Parser$Numbers$raw, floatf, intf, hexf));
	});
var $stil4m$elm_syntax$Elm$Parser$Patterns$numberPart = A3($stil4m$elm_syntax$Elm$Parser$Numbers$number, $stil4m$elm_syntax$Elm$Syntax$Pattern$FloatPattern, $stil4m$elm_syntax$Elm$Syntax$Pattern$IntPattern, $stil4m$elm_syntax$Elm$Syntax$Pattern$HexPattern);
var $stil4m$elm_syntax$Combine$parens = A2(
	$stil4m$elm_syntax$Combine$between,
	$stil4m$elm_syntax$Combine$string('('),
	$stil4m$elm_syntax$Combine$string(')'));
var $stil4m$elm_syntax$Combine$sepBy1 = F2(
	function (sep, p) {
		return A2(
			$stil4m$elm_syntax$Combine$andMap,
			$stil4m$elm_syntax$Combine$many(
				A2($stil4m$elm_syntax$Combine$continueWith, p, sep)),
			A2(
				$stil4m$elm_syntax$Combine$andMap,
				p,
				$stil4m$elm_syntax$Combine$succeed($elm$core$List$cons)));
	});
var $stil4m$elm_syntax$Elm$Parser$Patterns$recordPart = $stil4m$elm_syntax$Combine$lazy(
	function (_v0) {
		return $stil4m$elm_syntax$Elm$Parser$Node$parser(
			A2(
				$stil4m$elm_syntax$Combine$map,
				$stil4m$elm_syntax$Elm$Syntax$Pattern$RecordPattern,
				A3(
					$stil4m$elm_syntax$Combine$between,
					A2(
						$stil4m$elm_syntax$Combine$continueWith,
						$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
						$stil4m$elm_syntax$Combine$string('{')),
					A2(
						$stil4m$elm_syntax$Combine$continueWith,
						$stil4m$elm_syntax$Combine$string('}'),
						$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout)),
					A2(
						$stil4m$elm_syntax$Combine$sepBy1,
						$stil4m$elm_syntax$Combine$string(','),
						$stil4m$elm_syntax$Elm$Parser$Layout$maybeAroundBothSides(
							$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Tokens$functionName))))));
	});
var $stil4m$elm_syntax$Combine$sepBy = F2(
	function (sep, p) {
		return A2(
			$stil4m$elm_syntax$Combine$or,
			A2($stil4m$elm_syntax$Combine$sepBy1, sep, p),
			$stil4m$elm_syntax$Combine$succeed(_List_Nil));
	});
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $elm$parser$Parser$Advanced$getOffset = function (s) {
	return A3($elm$parser$Parser$Advanced$Good, false, s.b, s);
};
var $elm$parser$Parser$getOffset = $elm$parser$Parser$Advanced$getOffset;
var $stil4m$elm_syntax$Elm$Parser$Tokens$stringLiteral = function () {
	var helper = function (s) {
		return s.G ? A2(
			$elm$parser$Parser$map,
			function (v) {
				return $elm$parser$Parser$Loop(
					_Utils_update(
						s,
						{
							G: false,
							h: A2(
								$elm$core$List$cons,
								$elm$core$String$fromList(
									_List_fromArray(
										[v])),
								s.h)
						}));
			},
			$stil4m$elm_syntax$Elm$Parser$Tokens$escapedCharValue) : $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$map,
					function (_v0) {
						return $elm$parser$Parser$Done(
							$elm$core$String$concat(
								$elm$core$List$reverse(s.h)));
					},
					$elm$parser$Parser$symbol('\"')),
					A2(
					$elm$parser$Parser$map,
					function (_v1) {
						return $elm$parser$Parser$Loop(
							_Utils_update(
								s,
								{G: true, h: s.h}));
					},
					$elm$parser$Parser$getChompedString(
						$elm$parser$Parser$symbol('\\'))),
					A2(
					$elm$parser$Parser$andThen,
					function (_v2) {
						var start = _v2.a;
						var value = _v2.b;
						var end = _v2.c;
						return _Utils_eq(start, end) ? $elm$parser$Parser$problem('Expected a string character or a double quote') : $elm$parser$Parser$succeed(
							$elm$parser$Parser$Loop(
								_Utils_update(
									s,
									{
										h: A2($elm$core$List$cons, value, s.h)
									})));
					},
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$keeper,
								$elm$parser$Parser$succeed(
									F3(
										function (start, value, end) {
											return _Utils_Tuple3(start, value, end);
										})),
								$elm$parser$Parser$getOffset),
							$elm$parser$Parser$getChompedString(
								$elm$parser$Parser$chompWhile(
									function (c) {
										return (c !== '\"') && (c !== '\\');
									}))),
						$elm$parser$Parser$getOffset))
				]));
	};
	return $stil4m$elm_syntax$Combine$fromCore(
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed($elm$core$Basics$identity),
				$elm$parser$Parser$symbol('\"')),
			A2(
				$elm$parser$Parser$loop,
				{G: false, h: _List_Nil},
				helper)));
}();
var $stil4m$elm_syntax$Elm$Parser$Tokens$typeName = $stil4m$elm_syntax$Combine$fromCore(
	$elm$parser$Parser$variable(
		{
			eh: function (c) {
				return $elm$core$Char$isAlphaNum(c) || (c === '_');
			},
			eL: $elm$core$Set$fromList($stil4m$elm_syntax$Elm$Parser$Tokens$reservedList),
			J: $elm$core$Char$isUpper
		}));
var $stil4m$elm_syntax$Elm$Parser$Base$typeIndicator = function () {
	var helper = function (_v0) {
		var n = _v0.a;
		var xs = _v0.b;
		return $stil4m$elm_syntax$Combine$choice(
			_List_fromArray(
				[
					A2(
					$stil4m$elm_syntax$Combine$andThen,
					function (t) {
						return helper(
							_Utils_Tuple2(
								t,
								A2($elm$core$List$cons, n, xs)));
					},
					A2(
						$stil4m$elm_syntax$Combine$continueWith,
						$stil4m$elm_syntax$Elm$Parser$Tokens$typeName,
						$stil4m$elm_syntax$Combine$string('.'))),
					$stil4m$elm_syntax$Combine$succeed(
					_Utils_Tuple2(n, xs))
				]));
	};
	return A2(
		$stil4m$elm_syntax$Combine$map,
		function (_v1) {
			var t = _v1.a;
			var xs = _v1.b;
			return _Utils_Tuple2(
				$elm$core$List$reverse(xs),
				t);
		},
		A2(
			$stil4m$elm_syntax$Combine$andThen,
			function (t) {
				return helper(
					_Utils_Tuple2(t, _List_Nil));
			},
			$stil4m$elm_syntax$Elm$Parser$Tokens$typeName));
}();
var $stil4m$elm_syntax$Elm$Parser$Patterns$variablePart = $stil4m$elm_syntax$Elm$Parser$Node$parser(
	A2($stil4m$elm_syntax$Combine$map, $stil4m$elm_syntax$Elm$Syntax$Pattern$VarPattern, $stil4m$elm_syntax$Elm$Parser$Tokens$functionName));
var $stil4m$elm_syntax$Elm$Parser$Patterns$qualifiedPattern = function (consumeArgs) {
	return A2(
		$stil4m$elm_syntax$Combine$andThen,
		function (_v0) {
			var range = _v0.a;
			var _v1 = _v0.b;
			var mod = _v1.a;
			var name = _v1.b;
			return A2(
				$stil4m$elm_syntax$Combine$map,
				function (args) {
					return A2(
						$stil4m$elm_syntax$Elm$Syntax$Node$Node,
						$stil4m$elm_syntax$Elm$Syntax$Range$combine(
							A2(
								$elm$core$List$cons,
								range,
								A2(
									$elm$core$List$map,
									function (_v2) {
										var r = _v2.a;
										return r;
									},
									args))),
						A2(
							$stil4m$elm_syntax$Elm$Syntax$Pattern$NamedPattern,
							A2($stil4m$elm_syntax$Elm$Syntax$Pattern$QualifiedNameRef, mod, name),
							args));
				},
				consumeArgs ? $stil4m$elm_syntax$Combine$many(
					A2(
						$stil4m$elm_syntax$Combine$ignore,
						$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
						$stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$qualifiedPatternArg())) : $stil4m$elm_syntax$Combine$succeed(_List_Nil));
		},
		A2(
			$stil4m$elm_syntax$Combine$ignore,
			$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
			$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Base$typeIndicator)));
};
var $stil4m$elm_syntax$Elm$Parser$Patterns$tryToCompose = function (x) {
	return A2(
		$stil4m$elm_syntax$Combine$continueWith,
		$stil4m$elm_syntax$Combine$choice(
			_List_fromArray(
				[
					A2(
					$stil4m$elm_syntax$Combine$map,
					function (y) {
						return A3($stil4m$elm_syntax$Elm$Syntax$Node$combine, $stil4m$elm_syntax$Elm$Syntax$Pattern$AsPattern, x, y);
					},
					A2(
						$stil4m$elm_syntax$Combine$continueWith,
						$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Tokens$functionName),
						A2(
							$stil4m$elm_syntax$Combine$ignore,
							$stil4m$elm_syntax$Elm$Parser$Layout$layout,
							$stil4m$elm_syntax$Combine$fromCore(
								$elm$parser$Parser$keyword('as'))))),
					A2(
					$stil4m$elm_syntax$Combine$map,
					function (y) {
						return A3($stil4m$elm_syntax$Elm$Syntax$Node$combine, $stil4m$elm_syntax$Elm$Syntax$Pattern$UnConsPattern, x, y);
					},
					A2(
						$stil4m$elm_syntax$Combine$continueWith,
						$stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$pattern(),
						A2(
							$stil4m$elm_syntax$Combine$ignore,
							$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
							$stil4m$elm_syntax$Combine$fromCore(
								$elm$parser$Parser$symbol('::'))))),
					$stil4m$elm_syntax$Combine$succeed(x)
				])),
		$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout));
};
function $stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$pattern() {
	return A2(
		$stil4m$elm_syntax$Combine$andThen,
		$stil4m$elm_syntax$Elm$Parser$Patterns$tryToCompose,
		$stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$composablePattern());
}
function $stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$composablePattern() {
	return $stil4m$elm_syntax$Combine$choice(
		_List_fromArray(
			[
				$stil4m$elm_syntax$Elm$Parser$Patterns$variablePart,
				$stil4m$elm_syntax$Elm$Parser$Patterns$qualifiedPattern(true),
				$stil4m$elm_syntax$Elm$Parser$Node$parser(
				A2($stil4m$elm_syntax$Combine$map, $stil4m$elm_syntax$Elm$Syntax$Pattern$StringPattern, $stil4m$elm_syntax$Elm$Parser$Tokens$stringLiteral)),
				$stil4m$elm_syntax$Elm$Parser$Node$parser(
				A2($stil4m$elm_syntax$Combine$map, $stil4m$elm_syntax$Elm$Syntax$Pattern$CharPattern, $stil4m$elm_syntax$Elm$Parser$Tokens$characterLiteral)),
				$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Patterns$numberPart),
				$stil4m$elm_syntax$Elm$Parser$Node$parser(
				A2(
					$stil4m$elm_syntax$Combine$map,
					$elm$core$Basics$always($stil4m$elm_syntax$Elm$Syntax$Pattern$UnitPattern),
					$stil4m$elm_syntax$Combine$fromCore(
						$elm$parser$Parser$symbol('()')))),
				$stil4m$elm_syntax$Elm$Parser$Node$parser(
				A2(
					$stil4m$elm_syntax$Combine$map,
					$elm$core$Basics$always($stil4m$elm_syntax$Elm$Syntax$Pattern$AllPattern),
					$stil4m$elm_syntax$Combine$fromCore(
						$elm$parser$Parser$symbol('_')))),
				$stil4m$elm_syntax$Elm$Parser$Patterns$recordPart,
				$stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$listPattern(),
				$stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$parensPattern()
			]));
}
function $stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$qualifiedPatternArg() {
	return $stil4m$elm_syntax$Combine$choice(
		_List_fromArray(
			[
				$stil4m$elm_syntax$Elm$Parser$Patterns$variablePart,
				$stil4m$elm_syntax$Elm$Parser$Patterns$qualifiedPattern(false),
				$stil4m$elm_syntax$Elm$Parser$Node$parser(
				A2($stil4m$elm_syntax$Combine$map, $stil4m$elm_syntax$Elm$Syntax$Pattern$StringPattern, $stil4m$elm_syntax$Elm$Parser$Tokens$stringLiteral)),
				$stil4m$elm_syntax$Elm$Parser$Node$parser(
				A2($stil4m$elm_syntax$Combine$map, $stil4m$elm_syntax$Elm$Syntax$Pattern$CharPattern, $stil4m$elm_syntax$Elm$Parser$Tokens$characterLiteral)),
				$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Patterns$numberPart),
				$stil4m$elm_syntax$Elm$Parser$Node$parser(
				A2(
					$stil4m$elm_syntax$Combine$map,
					$elm$core$Basics$always($stil4m$elm_syntax$Elm$Syntax$Pattern$UnitPattern),
					$stil4m$elm_syntax$Combine$fromCore(
						$elm$parser$Parser$symbol('()')))),
				$stil4m$elm_syntax$Elm$Parser$Node$parser(
				A2(
					$stil4m$elm_syntax$Combine$map,
					$elm$core$Basics$always($stil4m$elm_syntax$Elm$Syntax$Pattern$AllPattern),
					$stil4m$elm_syntax$Combine$fromCore(
						$elm$parser$Parser$symbol('_')))),
				$stil4m$elm_syntax$Elm$Parser$Patterns$recordPart,
				$stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$listPattern(),
				$stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$parensPattern()
			]));
}
function $stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$listPattern() {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v5) {
			return $stil4m$elm_syntax$Elm$Parser$Node$parser(
				A3(
					$stil4m$elm_syntax$Combine$between,
					$stil4m$elm_syntax$Combine$string('['),
					$stil4m$elm_syntax$Combine$string(']'),
					A2(
						$stil4m$elm_syntax$Combine$map,
						$stil4m$elm_syntax$Elm$Syntax$Pattern$ListPattern,
						A2(
							$stil4m$elm_syntax$Combine$sepBy,
							$stil4m$elm_syntax$Combine$string(','),
							$stil4m$elm_syntax$Elm$Parser$Layout$maybeAroundBothSides(
								$stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$pattern())))));
		});
}
function $stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$parensPattern() {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v3) {
			return $stil4m$elm_syntax$Elm$Parser$Node$parser(
				A2(
					$stil4m$elm_syntax$Combine$map,
					function (c) {
						if (c.b && (!c.b.b)) {
							var x = c.a;
							return $stil4m$elm_syntax$Elm$Syntax$Pattern$ParenthesizedPattern(x);
						} else {
							return $stil4m$elm_syntax$Elm$Syntax$Pattern$TuplePattern(c);
						}
					},
					$stil4m$elm_syntax$Combine$parens(
						A2(
							$stil4m$elm_syntax$Combine$sepBy,
							$stil4m$elm_syntax$Combine$string(','),
							$stil4m$elm_syntax$Elm$Parser$Layout$maybeAroundBothSides(
								$stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$pattern())))));
		});
}
var $stil4m$elm_syntax$Elm$Parser$Patterns$pattern = $stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$pattern();
$stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$pattern = function () {
	return $stil4m$elm_syntax$Elm$Parser$Patterns$pattern;
};
var $stil4m$elm_syntax$Elm$Parser$Patterns$composablePattern = $stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$composablePattern();
$stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$composablePattern = function () {
	return $stil4m$elm_syntax$Elm$Parser$Patterns$composablePattern;
};
var $stil4m$elm_syntax$Elm$Parser$Patterns$qualifiedPatternArg = $stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$qualifiedPatternArg();
$stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$qualifiedPatternArg = function () {
	return $stil4m$elm_syntax$Elm$Parser$Patterns$qualifiedPatternArg;
};
var $stil4m$elm_syntax$Elm$Parser$Patterns$listPattern = $stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$listPattern();
$stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$listPattern = function () {
	return $stil4m$elm_syntax$Elm$Parser$Patterns$listPattern;
};
var $stil4m$elm_syntax$Elm$Parser$Patterns$parensPattern = $stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$parensPattern();
$stil4m$elm_syntax$Elm$Parser$Patterns$cyclic$parensPattern = function () {
	return $stil4m$elm_syntax$Elm$Parser$Patterns$parensPattern;
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$functionArgument = $stil4m$elm_syntax$Elm$Parser$Patterns$pattern;
var $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$Eager = 0;
var $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$Lazy = 1;
var $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$asTypeAnnotation = F2(
	function (x, xs) {
		var value = x.b;
		if (!xs.b) {
			return value;
		} else {
			return $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$Tupled(
				A2($elm$core$List$cons, x, xs));
		}
	});
var $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$genericTypeAnnotation = $stil4m$elm_syntax$Combine$lazy(
	function (_v0) {
		return $stil4m$elm_syntax$Elm$Parser$Node$parser(
			A2($stil4m$elm_syntax$Combine$map, $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$GenericType, $stil4m$elm_syntax$Elm$Parser$Tokens$functionName));
	});
var $stil4m$elm_syntax$Elm$Parser$Layout$Indented = 1;
var $stil4m$elm_syntax$Elm$Parser$Layout$Strict = 0;
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $stil4m$elm_syntax$Elm$Parser$State$storedColumns = function (_v0) {
	var indents = _v0.ab;
	return A2(
		$elm$core$List$map,
		$elm$core$Basics$add(1),
		indents);
};
var $stil4m$elm_syntax$Elm$Parser$Layout$compute = $stil4m$elm_syntax$Combine$withState(
	function (s) {
		return $stil4m$elm_syntax$Combine$withLocation(
			function (l) {
				var known = A2(
					$elm$core$List$cons,
					1,
					$stil4m$elm_syntax$Elm$Parser$State$storedColumns(s));
				return A2($elm$core$List$member, l.W, known) ? $stil4m$elm_syntax$Combine$succeed(0) : $stil4m$elm_syntax$Combine$succeed(1);
			});
	});
var $stil4m$elm_syntax$Elm$Parser$Layout$optimisticLayout = A2(
	$stil4m$elm_syntax$Combine$continueWith,
	$stil4m$elm_syntax$Elm$Parser$Layout$compute,
	$stil4m$elm_syntax$Combine$many(
		$stil4m$elm_syntax$Combine$choice(
			_List_fromArray(
				[
					$stil4m$elm_syntax$Elm$Parser$Layout$anyComment,
					A2(
					$stil4m$elm_syntax$Combine$continueWith,
					$stil4m$elm_syntax$Combine$choice(
						_List_fromArray(
							[
								$stil4m$elm_syntax$Elm$Parser$Whitespace$many1Spaces,
								$stil4m$elm_syntax$Elm$Parser$Layout$anyComment,
								$stil4m$elm_syntax$Combine$succeed(0)
							])),
					$stil4m$elm_syntax$Combine$many1($stil4m$elm_syntax$Elm$Parser$Whitespace$realNewLine)),
					$stil4m$elm_syntax$Elm$Parser$Whitespace$many1Spaces
				]))));
var $stil4m$elm_syntax$Elm$Parser$Layout$optimisticLayoutWith = F2(
	function (onStrict, onIndented) {
		return A2(
			$stil4m$elm_syntax$Combine$andThen,
			function (ind) {
				if (!ind) {
					return onStrict(0);
				} else {
					return onIndented(0);
				}
			},
			$stil4m$elm_syntax$Elm$Parser$Layout$optimisticLayout);
	});
var $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$typeAnnotationNoFn = function (mode) {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v7) {
			return $stil4m$elm_syntax$Combine$choice(
				_List_fromArray(
					[
						$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$parensTypeAnnotation(),
						$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$typedTypeAnnotation(mode),
						$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$genericTypeAnnotation,
						$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$recordTypeAnnotation()
					]));
		});
};
var $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$typedTypeAnnotation = function (mode) {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v0) {
			var nodeRanges = $elm$core$List$map(
				function (_v6) {
					var r = _v6.a;
					return r;
				});
			var genericHelper = function (items) {
				return A2(
					$stil4m$elm_syntax$Combine$or,
					A2(
						$stil4m$elm_syntax$Combine$andThen,
						function (next) {
							return A2(
								$stil4m$elm_syntax$Combine$ignore,
								$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
								A2(
									$stil4m$elm_syntax$Elm$Parser$Layout$optimisticLayoutWith,
									function (_v1) {
										return $stil4m$elm_syntax$Combine$succeed(
											$elm$core$List$reverse(
												A2($elm$core$List$cons, next, items)));
									},
									function (_v2) {
										return genericHelper(
											A2($elm$core$List$cons, next, items));
									}));
						},
						$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$typeAnnotationNoFn(1)),
					$stil4m$elm_syntax$Combine$succeed(
						$elm$core$List$reverse(items)));
			};
			return A2(
				$stil4m$elm_syntax$Combine$andThen,
				function (original) {
					var tir = original.a;
					return A2(
						$stil4m$elm_syntax$Elm$Parser$Layout$optimisticLayoutWith,
						function (_v3) {
							return $stil4m$elm_syntax$Combine$succeed(
								A2(
									$stil4m$elm_syntax$Elm$Syntax$Node$Node,
									tir,
									A2($stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$Typed, original, _List_Nil)));
						},
						function (_v4) {
							if (!mode) {
								return A2(
									$stil4m$elm_syntax$Combine$map,
									function (args) {
										return A2(
											$stil4m$elm_syntax$Elm$Syntax$Node$Node,
											$stil4m$elm_syntax$Elm$Syntax$Range$combine(
												A2(
													$elm$core$List$cons,
													tir,
													nodeRanges(args))),
											A2($stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$Typed, original, args));
									},
									genericHelper(_List_Nil));
							} else {
								return $stil4m$elm_syntax$Combine$succeed(
									A2(
										$stil4m$elm_syntax$Elm$Syntax$Node$Node,
										tir,
										A2($stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$Typed, original, _List_Nil)));
							}
						});
				},
				$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Base$typeIndicator));
		});
};
function $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$parensTypeAnnotation() {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v14) {
			var commaSep = $stil4m$elm_syntax$Combine$many(
				A2(
					$stil4m$elm_syntax$Combine$ignore,
					$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
					A2(
						$stil4m$elm_syntax$Combine$continueWith,
						$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$typeAnnotation(),
						A2(
							$stil4m$elm_syntax$Combine$ignore,
							$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
							$stil4m$elm_syntax$Combine$string(',')))));
			var nested = A2(
				$stil4m$elm_syntax$Combine$andMap,
				commaSep,
				A2(
					$stil4m$elm_syntax$Combine$ignore,
					$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
					A2(
						$stil4m$elm_syntax$Combine$andMap,
						$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$typeAnnotation(),
						A2(
							$stil4m$elm_syntax$Combine$ignore,
							$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
							$stil4m$elm_syntax$Combine$succeed($stil4m$elm_syntax$Elm$Parser$TypeAnnotation$asTypeAnnotation)))));
			return $stil4m$elm_syntax$Elm$Parser$Node$parser(
				A2(
					$stil4m$elm_syntax$Combine$continueWith,
					$stil4m$elm_syntax$Combine$choice(
						_List_fromArray(
							[
								A2(
								$stil4m$elm_syntax$Combine$map,
								$elm$core$Basics$always($stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$Unit),
								$stil4m$elm_syntax$Combine$string(')')),
								A2(
								$stil4m$elm_syntax$Combine$ignore,
								$stil4m$elm_syntax$Combine$string(')'),
								nested)
							])),
					$stil4m$elm_syntax$Combine$string('(')));
		});
}
function $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$recordFieldDefinition() {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v13) {
			return A2(
				$stil4m$elm_syntax$Combine$andMap,
				A2(
					$stil4m$elm_syntax$Combine$continueWith,
					$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$typeAnnotation(),
					A2(
						$stil4m$elm_syntax$Combine$continueWith,
						$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
						A2(
							$stil4m$elm_syntax$Combine$continueWith,
							$stil4m$elm_syntax$Combine$string(':'),
							$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout)))),
				A2(
					$stil4m$elm_syntax$Combine$andMap,
					A2(
						$stil4m$elm_syntax$Combine$continueWith,
						$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Tokens$functionName),
						$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout)),
					$stil4m$elm_syntax$Combine$succeed($elm$core$Tuple$pair)));
		});
}
function $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$recordFieldsTypeAnnotation() {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v12) {
			return A2(
				$stil4m$elm_syntax$Combine$sepBy,
				$stil4m$elm_syntax$Combine$string(','),
				$stil4m$elm_syntax$Elm$Parser$Layout$maybeAroundBothSides(
					$stil4m$elm_syntax$Elm$Parser$Node$parser(
						$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$recordFieldDefinition())));
		});
}
function $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$recordTypeAnnotation() {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v11) {
			var nextField = A2(
				$stil4m$elm_syntax$Combine$ignore,
				$stil4m$elm_syntax$Elm$Parser$Layout$optimisticLayout,
				A2(
					$stil4m$elm_syntax$Combine$andMap,
					$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$typeAnnotation(),
					A2(
						$stil4m$elm_syntax$Combine$ignore,
						$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
						A2(
							$stil4m$elm_syntax$Combine$ignore,
							$stil4m$elm_syntax$Combine$string(':'),
							A2(
								$stil4m$elm_syntax$Combine$ignore,
								$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
								A2(
									$stil4m$elm_syntax$Combine$andMap,
									$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Tokens$functionName),
									A2(
										$stil4m$elm_syntax$Combine$ignore,
										$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
										A2(
											$stil4m$elm_syntax$Combine$ignore,
											$stil4m$elm_syntax$Combine$string(','),
											$stil4m$elm_syntax$Combine$succeed(
												F2(
													function (a, b) {
														return _Utils_Tuple2(a, b);
													}))))))))));
			var additionalRecordFields = function (items) {
				return $stil4m$elm_syntax$Combine$choice(
					_List_fromArray(
						[
							A2(
							$stil4m$elm_syntax$Combine$andThen,
							function (next) {
								return additionalRecordFields(
									A2($elm$core$List$cons, next, items));
							},
							$stil4m$elm_syntax$Elm$Parser$Node$parser(nextField)),
							$stil4m$elm_syntax$Combine$succeed(
							$elm$core$List$reverse(items))
						]));
			};
			return $stil4m$elm_syntax$Elm$Parser$Node$parser(
				A2(
					$stil4m$elm_syntax$Combine$continueWith,
					$stil4m$elm_syntax$Combine$choice(
						_List_fromArray(
							[
								A2(
								$stil4m$elm_syntax$Combine$continueWith,
								$stil4m$elm_syntax$Combine$succeed(
									$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$Record(_List_Nil)),
								$stil4m$elm_syntax$Combine$string('}')),
								A2(
								$stil4m$elm_syntax$Combine$andThen,
								function (fname) {
									return $stil4m$elm_syntax$Combine$choice(
										_List_fromArray(
											[
												A2(
												$stil4m$elm_syntax$Combine$ignore,
												$stil4m$elm_syntax$Combine$string('}'),
												A2(
													$stil4m$elm_syntax$Combine$andMap,
													$stil4m$elm_syntax$Elm$Parser$Node$parser(
														$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$recordFieldsTypeAnnotation()),
													A2(
														$stil4m$elm_syntax$Combine$ignore,
														$stil4m$elm_syntax$Combine$string('|'),
														$stil4m$elm_syntax$Combine$succeed(
															$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$GenericRecord(fname))))),
												A2(
												$stil4m$elm_syntax$Combine$ignore,
												$stil4m$elm_syntax$Combine$string('}'),
												A2(
													$stil4m$elm_syntax$Combine$andThen,
													function (ta) {
														return A2(
															$stil4m$elm_syntax$Combine$map,
															$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$Record,
															additionalRecordFields(
																_List_fromArray(
																	[
																		A3($stil4m$elm_syntax$Elm$Syntax$Node$combine, $elm$core$Tuple$pair, fname, ta)
																	])));
													},
													A2(
														$stil4m$elm_syntax$Combine$ignore,
														$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
														A2(
															$stil4m$elm_syntax$Combine$continueWith,
															$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$typeAnnotation(),
															A2(
																$stil4m$elm_syntax$Combine$ignore,
																$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
																$stil4m$elm_syntax$Combine$string(':'))))))
											]));
								},
								A2(
									$stil4m$elm_syntax$Combine$ignore,
									$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
									$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Tokens$functionName)))
							])),
					A2(
						$stil4m$elm_syntax$Combine$ignore,
						$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
						$stil4m$elm_syntax$Combine$string('{'))));
		});
}
function $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$typeAnnotation() {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v8) {
			return A2(
				$stil4m$elm_syntax$Combine$andThen,
				function (typeRef) {
					return A2(
						$stil4m$elm_syntax$Elm$Parser$Layout$optimisticLayoutWith,
						function (_v9) {
							return $stil4m$elm_syntax$Combine$succeed(typeRef);
						},
						function (_v10) {
							return A2(
								$stil4m$elm_syntax$Combine$or,
								A2(
									$stil4m$elm_syntax$Combine$map,
									function (ta) {
										return A3($stil4m$elm_syntax$Elm$Syntax$Node$combine, $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$FunctionTypeAnnotation, typeRef, ta);
									},
									A2(
										$stil4m$elm_syntax$Combine$continueWith,
										$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$typeAnnotation(),
										A2(
											$stil4m$elm_syntax$Combine$ignore,
											$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
											$stil4m$elm_syntax$Combine$string('->')))),
								$stil4m$elm_syntax$Combine$succeed(typeRef));
						});
				},
				$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$typeAnnotationNoFn(0));
		});
}
var $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$parensTypeAnnotation = $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$parensTypeAnnotation();
$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$parensTypeAnnotation = function () {
	return $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$parensTypeAnnotation;
};
var $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$recordFieldDefinition = $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$recordFieldDefinition();
$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$recordFieldDefinition = function () {
	return $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$recordFieldDefinition;
};
var $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$recordFieldsTypeAnnotation = $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$recordFieldsTypeAnnotation();
$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$recordFieldsTypeAnnotation = function () {
	return $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$recordFieldsTypeAnnotation;
};
var $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$recordTypeAnnotation = $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$recordTypeAnnotation();
$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$recordTypeAnnotation = function () {
	return $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$recordTypeAnnotation;
};
var $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$typeAnnotation = $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$typeAnnotation();
$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$cyclic$typeAnnotation = function () {
	return $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$typeAnnotation;
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$functionSignatureFromVarPointer = function (varPointer) {
	return A2(
		$stil4m$elm_syntax$Combine$andMap,
		$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$typeAnnotation,
		A2(
			$stil4m$elm_syntax$Combine$ignore,
			$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
			A2(
				$stil4m$elm_syntax$Combine$ignore,
				$stil4m$elm_syntax$Combine$string(':'),
				$stil4m$elm_syntax$Combine$succeed(
					function (ta) {
						return A3($stil4m$elm_syntax$Elm$Syntax$Node$combine, $stil4m$elm_syntax$Elm$Syntax$Signature$Signature, varPointer, ta);
					}))));
};
var $elm$parser$Parser$NotNestable = 0;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $stil4m$elm_syntax$Elm$Parser$Declarations$glslExpression = function () {
	var start = '[glsl|';
	var end = '|]';
	return $stil4m$elm_syntax$Elm$Parser$Node$parser(
		A2(
			$stil4m$elm_syntax$Combine$ignore,
			$stil4m$elm_syntax$Combine$string(end),
			A2(
				$stil4m$elm_syntax$Combine$map,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$String$dropLeft(
						$elm$core$String$length(start)),
					$stil4m$elm_syntax$Elm$Syntax$Expression$GLSLExpression),
				$stil4m$elm_syntax$Combine$fromCore(
					$elm$parser$Parser$getChompedString(
						A3($elm$parser$Parser$multiComment, start, end, 0))))));
}();
var $stil4m$elm_syntax$Elm$Parser$Tokens$ifToken = $stil4m$elm_syntax$Combine$string('if');
var $stil4m$elm_syntax$Elm$Parser$Tokens$allowedOperatorTokens = _List_fromArray(
	['+', '-', ':', '/', '*', '>', '<', '=', '/', '&', '^', '%', '|', '!', '.', '#', '$', '≡', '~', '?', '@']);
var $stil4m$elm_syntax$Elm$Parser$Tokens$excludedOperators = _List_fromArray(
	[':', '->', '--', '=']);
var $stil4m$elm_syntax$Combine$Char$oneOf = function (cs) {
	return A2(
		$stil4m$elm_syntax$Combine$andThen,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Maybe$map($stil4m$elm_syntax$Combine$succeed),
			$elm$core$Maybe$withDefault(
				$stil4m$elm_syntax$Combine$fail(
					'expected one of \'' + ($elm$core$String$fromList(cs) + '\'')))),
		$stil4m$elm_syntax$Combine$Char$satisfy(
			function (a) {
				return A2($elm$core$List$member, a, cs);
			}));
};
var $stil4m$elm_syntax$Elm$Parser$Tokens$operatorTokenFromList = function (allowedChars) {
	return A2(
		$stil4m$elm_syntax$Combine$andThen,
		function (m) {
			return A2($elm$core$List$member, m, $stil4m$elm_syntax$Elm$Parser$Tokens$excludedOperators) ? $stil4m$elm_syntax$Combine$fail('operator is not allowed') : $stil4m$elm_syntax$Combine$succeed(m);
		},
		A2(
			$stil4m$elm_syntax$Combine$map,
			$elm$core$String$fromList,
			$stil4m$elm_syntax$Combine$many1(
				$stil4m$elm_syntax$Combine$Char$oneOf(allowedChars))));
};
var $stil4m$elm_syntax$Elm$Parser$Tokens$infixOperatorToken = $stil4m$elm_syntax$Elm$Parser$Tokens$operatorTokenFromList($stil4m$elm_syntax$Elm$Parser$Tokens$allowedOperatorTokens);
var $stil4m$elm_syntax$Elm$Parser$Layout$layoutStrict = A2(
	$stil4m$elm_syntax$Combine$continueWith,
	$stil4m$elm_syntax$Elm$Parser$Layout$verifyIndent(
		F2(
			function (stateIndent, current) {
				return _Utils_eq(stateIndent, current);
			})),
	$stil4m$elm_syntax$Combine$many1(
		$stil4m$elm_syntax$Combine$choice(
			_List_fromArray(
				[
					$stil4m$elm_syntax$Elm$Parser$Layout$anyComment,
					A2(
					$stil4m$elm_syntax$Combine$continueWith,
					$stil4m$elm_syntax$Combine$succeed(0),
					$stil4m$elm_syntax$Combine$many1($stil4m$elm_syntax$Elm$Parser$Whitespace$realNewLine)),
					$stil4m$elm_syntax$Elm$Parser$Whitespace$many1Spaces
				]))));
var $stil4m$elm_syntax$Elm$Parser$Declarations$liftRecordAccess = function (e) {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v0) {
			return A2(
				$stil4m$elm_syntax$Combine$or,
				A2(
					$stil4m$elm_syntax$Combine$andThen,
					$stil4m$elm_syntax$Elm$Parser$Declarations$liftRecordAccess,
					$stil4m$elm_syntax$Elm$Parser$Node$parser(
						A2(
							$stil4m$elm_syntax$Combine$map,
							$stil4m$elm_syntax$Elm$Syntax$Expression$RecordAccess(e),
							A2(
								$stil4m$elm_syntax$Combine$continueWith,
								$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Tokens$functionName),
								$stil4m$elm_syntax$Combine$string('.'))))),
				$stil4m$elm_syntax$Combine$succeed(e));
		});
};
var $stil4m$elm_syntax$Elm$Parser$Tokens$multiLineStringLiteral = function () {
	var helper = function (s) {
		return s.G ? A2(
			$elm$parser$Parser$map,
			function (v) {
				return $elm$parser$Parser$Loop(
					_Utils_update(
						s,
						{
							G: false,
							h: A2(
								$elm$core$List$cons,
								$elm$core$String$fromList(
									_List_fromArray(
										[v])),
								s.h)
						}));
			},
			$stil4m$elm_syntax$Elm$Parser$Tokens$escapedCharValue) : $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$map,
					function (_v0) {
						return $elm$parser$Parser$Done(
							$elm$core$String$concat(s.h));
					},
					$elm$parser$Parser$symbol('\"\"\"')),
					A2(
					$elm$parser$Parser$map,
					function (v) {
						return $elm$parser$Parser$Loop(
							_Utils_update(
								s,
								{
									P: s.P + 1,
									h: A2($elm$core$List$cons, v, s.h)
								}));
					},
					$elm$parser$Parser$getChompedString(
						$elm$parser$Parser$symbol('\"'))),
					A2(
					$elm$parser$Parser$map,
					function (_v1) {
						return $elm$parser$Parser$Loop(
							_Utils_update(
								s,
								{P: s.P + 1, G: true, h: s.h}));
					},
					$elm$parser$Parser$getChompedString(
						$elm$parser$Parser$symbol('\\'))),
					A2(
					$elm$parser$Parser$andThen,
					function (_v2) {
						var start = _v2.a;
						var value = _v2.b;
						var end = _v2.c;
						return _Utils_eq(start, end) ? $elm$parser$Parser$problem('Expected a string character or a triple double quote') : $elm$parser$Parser$succeed(
							$elm$parser$Parser$Loop(
								_Utils_update(
									s,
									{
										P: s.P + 1,
										h: A2($elm$core$List$cons, value, s.h)
									})));
					},
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$keeper,
								$elm$parser$Parser$succeed(
									F3(
										function (start, value, end) {
											return _Utils_Tuple3(start, value, end);
										})),
								$elm$parser$Parser$getOffset),
							$elm$parser$Parser$getChompedString(
								$elm$parser$Parser$chompWhile(
									function (c) {
										return (c !== '\"') && (c !== '\\');
									}))),
						$elm$parser$Parser$getOffset))
				]));
	};
	return $stil4m$elm_syntax$Combine$fromCore(
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed($elm$core$Basics$identity),
				$elm$parser$Parser$symbol('\"\"\"')),
			A2(
				$elm$parser$Parser$loop,
				{P: 0, G: false, h: _List_Nil},
				helper)));
}();
var $stil4m$elm_syntax$Elm$Parser$Declarations$literalExpression = $stil4m$elm_syntax$Combine$lazy(
	function (_v0) {
		return $stil4m$elm_syntax$Elm$Parser$Node$parser(
			A2(
				$stil4m$elm_syntax$Combine$map,
				$stil4m$elm_syntax$Elm$Syntax$Expression$Literal,
				A2($stil4m$elm_syntax$Combine$or, $stil4m$elm_syntax$Elm$Parser$Tokens$multiLineStringLiteral, $stil4m$elm_syntax$Elm$Parser$Tokens$stringLiteral)));
	});
var $stil4m$elm_syntax$Combine$loop = F2(
	function (init, stepper) {
		var wrapper = function (_v3) {
			var oldState = _v3.a;
			var v = _v3.b;
			var _v0 = stepper(v);
			var p = _v0;
			return A2(
				$elm$parser$Parser$map,
				function (_v1) {
					var newState = _v1.a;
					var r = _v1.b;
					if (!r.$) {
						var l = r.a;
						return $elm$parser$Parser$Loop(
							_Utils_Tuple2(newState, l));
					} else {
						var d = r.a;
						return $elm$parser$Parser$Done(
							_Utils_Tuple2(newState, d));
					}
				},
				p(oldState));
		};
		return function (state) {
			return A2(
				$elm$parser$Parser$loop,
				_Utils_Tuple2(state, init),
				wrapper);
		};
	});
var $stil4m$elm_syntax$Elm$Parser$Whitespace$manySpaces = $stil4m$elm_syntax$Combine$fromCore(
	$elm$parser$Parser$chompWhile(
		function (c) {
			return c === ' ';
		}));
var $stil4m$elm_syntax$Elm$Parser$Numbers$forgivingNumber = F3(
	function (floatf, intf, hexf) {
		return $stil4m$elm_syntax$Combine$fromCore(
			$elm$parser$Parser$backtrackable(
				A3($stil4m$elm_syntax$Elm$Parser$Numbers$raw, floatf, intf, hexf)));
	});
var $stil4m$elm_syntax$Elm$Parser$Declarations$numberExpression = $stil4m$elm_syntax$Elm$Parser$Node$parser(
	A3($stil4m$elm_syntax$Elm$Parser$Numbers$forgivingNumber, $stil4m$elm_syntax$Elm$Syntax$Expression$Floatable, $stil4m$elm_syntax$Elm$Syntax$Expression$Integer, $stil4m$elm_syntax$Elm$Syntax$Expression$Hex));
var $stil4m$elm_syntax$Elm$Parser$Tokens$ofToken = $stil4m$elm_syntax$Combine$string('of');
var $stil4m$elm_syntax$Elm$Parser$Tokens$allowedPrefixOperatorTokens = A2($elm$core$List$cons, ',', $stil4m$elm_syntax$Elm$Parser$Tokens$allowedOperatorTokens);
var $stil4m$elm_syntax$Elm$Parser$Tokens$prefixOperatorToken = $stil4m$elm_syntax$Elm$Parser$Tokens$operatorTokenFromList($stil4m$elm_syntax$Elm$Parser$Tokens$allowedPrefixOperatorTokens);
var $stil4m$elm_syntax$Elm$Syntax$Node$range = function (_v0) {
	var r = _v0.a;
	return r;
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$recordAccessFunctionExpression = $stil4m$elm_syntax$Elm$Parser$Node$parser(
	A2(
		$stil4m$elm_syntax$Combine$map,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Basics$append('.'),
			$stil4m$elm_syntax$Elm$Syntax$Expression$RecordAccessFunction),
		A2(
			$stil4m$elm_syntax$Combine$continueWith,
			$stil4m$elm_syntax$Elm$Parser$Tokens$functionName,
			$stil4m$elm_syntax$Combine$string('.'))));
var $stil4m$elm_syntax$Elm$Parser$Declarations$reference = function () {
	var justFunction = A2(
		$stil4m$elm_syntax$Combine$map,
		function (v) {
			return _Utils_Tuple2(_List_Nil, v);
		},
		$stil4m$elm_syntax$Elm$Parser$Tokens$functionName);
	var helper = function (_v0) {
		var n = _v0.a;
		var xs = _v0.b;
		return $stil4m$elm_syntax$Combine$choice(
			_List_fromArray(
				[
					A2(
					$stil4m$elm_syntax$Combine$continueWith,
					$stil4m$elm_syntax$Combine$choice(
						_List_fromArray(
							[
								A2(
								$stil4m$elm_syntax$Combine$andThen,
								function (t) {
									return helper(
										_Utils_Tuple2(
											t,
											A2($elm$core$List$cons, n, xs)));
								},
								$stil4m$elm_syntax$Elm$Parser$Tokens$typeName),
								A2(
								$stil4m$elm_syntax$Combine$map,
								function (t) {
									return _Utils_Tuple2(
										t,
										A2($elm$core$List$cons, n, xs));
								},
								$stil4m$elm_syntax$Elm$Parser$Tokens$functionName)
							])),
					$stil4m$elm_syntax$Combine$string('.')),
					$stil4m$elm_syntax$Combine$succeed(
					_Utils_Tuple2(n, xs))
				]));
	};
	var recurring = A2(
		$stil4m$elm_syntax$Combine$map,
		function (_v1) {
			var t = _v1.a;
			var xs = _v1.b;
			return _Utils_Tuple2(
				$elm$core$List$reverse(xs),
				t);
		},
		A2(
			$stil4m$elm_syntax$Combine$andThen,
			function (t) {
				return helper(
					_Utils_Tuple2(t, _List_Nil));
			},
			$stil4m$elm_syntax$Elm$Parser$Tokens$typeName));
	return $stil4m$elm_syntax$Combine$choice(
		_List_fromArray(
			[recurring, justFunction]));
}();
var $stil4m$elm_syntax$Elm$Parser$Declarations$referenceExpression = $stil4m$elm_syntax$Elm$Parser$Node$parser(
	A2(
		$stil4m$elm_syntax$Combine$map,
		function (_v0) {
			var xs = _v0.a;
			var x = _v0.b;
			return A2($stil4m$elm_syntax$Elm$Syntax$Expression$FunctionOrValue, xs, x);
		},
		$stil4m$elm_syntax$Elm$Parser$Declarations$reference));
var $stil4m$elm_syntax$Elm$Parser$Tokens$thenToken = $stil4m$elm_syntax$Combine$string('then');
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
var $stil4m$elm_syntax$Elm$Parser$State$popIndent = function (_v0) {
	var s = _v0;
	return _Utils_update(
		s,
		{
			ab: A2($elm$core$List$drop, 1, s.ab)
		});
};
var $stil4m$elm_syntax$Elm$Parser$State$pushIndent = F2(
	function (x, _v0) {
		var s = _v0;
		return _Utils_update(
			s,
			{
				ab: A2($elm$core$List$cons, x, s.ab)
			});
	});
var $stil4m$elm_syntax$Elm$Parser$State$pushColumn = F2(
	function (col, state) {
		return A2($stil4m$elm_syntax$Elm$Parser$State$pushIndent, col - 1, state);
	});
var $stil4m$elm_syntax$Elm$Parser$Declarations$withIndentedState = function (p) {
	return $stil4m$elm_syntax$Combine$withLocation(
		function (location) {
			return A2(
				$stil4m$elm_syntax$Combine$ignore,
				$stil4m$elm_syntax$Combine$modifyState($stil4m$elm_syntax$Elm$Parser$State$popIndent),
				A2(
					$stil4m$elm_syntax$Combine$continueWith,
					p,
					$stil4m$elm_syntax$Combine$modifyState(
						$stil4m$elm_syntax$Elm$Parser$State$pushColumn(location.W))));
		});
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$functionWithNameNode = function (pointer) {
	var functionImplementationFromVarPointer = function (varPointer) {
		return A2(
			$stil4m$elm_syntax$Combine$andMap,
			$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expression(),
			A2(
				$stil4m$elm_syntax$Combine$ignore,
				$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
				A2(
					$stil4m$elm_syntax$Combine$ignore,
					$stil4m$elm_syntax$Combine$string('='),
					A2(
						$stil4m$elm_syntax$Combine$andMap,
						$stil4m$elm_syntax$Combine$many(
							A2(
								$stil4m$elm_syntax$Combine$ignore,
								$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
								$stil4m$elm_syntax$Elm$Parser$Declarations$functionArgument)),
						$stil4m$elm_syntax$Combine$succeed(
							F2(
								function (args, expr) {
									return A2(
										$stil4m$elm_syntax$Elm$Syntax$Node$Node,
										$stil4m$elm_syntax$Elm$Syntax$Range$combine(
											_List_fromArray(
												[
													$stil4m$elm_syntax$Elm$Syntax$Node$range(varPointer),
													$stil4m$elm_syntax$Elm$Syntax$Node$range(expr)
												])),
										A3($stil4m$elm_syntax$Elm$Syntax$Expression$FunctionImplementation, varPointer, args, expr));
								}))))));
	};
	var functionWithoutSignature = function (varPointer) {
		return A2(
			$stil4m$elm_syntax$Combine$map,
			A2($stil4m$elm_syntax$Elm$Syntax$Expression$Function, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing),
			functionImplementationFromVarPointer(varPointer));
	};
	var fromParts = F2(
		function (sig, decl) {
			return {
				fx: decl,
				fG: $elm$core$Maybe$Nothing,
				gu: $elm$core$Maybe$Just(sig)
			};
		});
	var functionWithSignature = function (varPointer) {
		return A2(
			$stil4m$elm_syntax$Combine$andThen,
			function (sig) {
				return A2(
					$stil4m$elm_syntax$Combine$map,
					fromParts(sig),
					A2(
						$stil4m$elm_syntax$Combine$andThen,
						functionImplementationFromVarPointer,
						A2(
							$stil4m$elm_syntax$Combine$ignore,
							$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
							A2(
								$stil4m$elm_syntax$Combine$continueWith,
								$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Tokens$functionName),
								$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layoutStrict)))));
			},
			$stil4m$elm_syntax$Elm$Parser$Declarations$functionSignatureFromVarPointer(varPointer));
	};
	return $stil4m$elm_syntax$Combine$choice(
		_List_fromArray(
			[
				functionWithSignature(pointer),
				functionWithoutSignature(pointer)
			]));
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$letDestructuringDeclarationWithPattern = function (p) {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v7) {
			return A2(
				$stil4m$elm_syntax$Combine$andMap,
				$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expression(),
				A2(
					$stil4m$elm_syntax$Combine$ignore,
					$stil4m$elm_syntax$Elm$Parser$Layout$layout,
					A2(
						$stil4m$elm_syntax$Combine$ignore,
						$stil4m$elm_syntax$Combine$string('='),
						A2(
							$stil4m$elm_syntax$Combine$ignore,
							$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
							$stil4m$elm_syntax$Combine$succeed(
								$stil4m$elm_syntax$Elm$Syntax$Expression$LetDestructuring(p))))));
		});
};
function $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$caseBlock() {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v23) {
			return A2(
				$stil4m$elm_syntax$Combine$ignore,
				$stil4m$elm_syntax$Elm$Parser$Tokens$ofToken,
				A2(
					$stil4m$elm_syntax$Combine$continueWith,
					$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expression(),
					A2($stil4m$elm_syntax$Combine$continueWith, $stil4m$elm_syntax$Elm$Parser$Layout$layout, $stil4m$elm_syntax$Elm$Parser$Tokens$caseToken)));
		});
}
function $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$caseExpression() {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v21) {
			return A2(
				$stil4m$elm_syntax$Combine$andThen,
				function (_v22) {
					var start = _v22.a;
					return A2(
						$stil4m$elm_syntax$Combine$map,
						function (cb) {
							return A2(
								$stil4m$elm_syntax$Elm$Syntax$Node$Node,
								$stil4m$elm_syntax$Elm$Syntax$Range$combine(
									A2(
										$elm$core$List$cons,
										start,
										A2(
											$elm$core$List$map,
											A2($elm$core$Basics$composeR, $elm$core$Tuple$second, $stil4m$elm_syntax$Elm$Syntax$Node$range),
											cb.fm))),
								$stil4m$elm_syntax$Elm$Syntax$Expression$CaseExpression(cb));
						},
						A2(
							$stil4m$elm_syntax$Combine$andMap,
							A2(
								$stil4m$elm_syntax$Combine$continueWith,
								$stil4m$elm_syntax$Elm$Parser$Declarations$withIndentedState(
									$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$caseStatements()),
								$stil4m$elm_syntax$Elm$Parser$Layout$layout),
							A2(
								$stil4m$elm_syntax$Combine$andMap,
								$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$caseBlock(),
								$stil4m$elm_syntax$Combine$succeed($stil4m$elm_syntax$Elm$Syntax$Expression$CaseBlock))));
				},
				$stil4m$elm_syntax$Elm$Parser$Node$parser(
					$stil4m$elm_syntax$Combine$succeed(0)));
		});
}
function $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$caseStatement() {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v20) {
			return A2(
				$stil4m$elm_syntax$Combine$andMap,
				A2(
					$stil4m$elm_syntax$Combine$continueWith,
					$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expression(),
					A2(
						$stil4m$elm_syntax$Combine$continueWith,
						$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
						A2(
							$stil4m$elm_syntax$Combine$continueWith,
							$stil4m$elm_syntax$Combine$string('->'),
							$stil4m$elm_syntax$Combine$maybe(
								A2($stil4m$elm_syntax$Combine$or, $stil4m$elm_syntax$Elm$Parser$Layout$layout, $stil4m$elm_syntax$Elm$Parser$Layout$layoutStrict))))),
				A2(
					$stil4m$elm_syntax$Combine$andMap,
					$stil4m$elm_syntax$Elm$Parser$Patterns$pattern,
					$stil4m$elm_syntax$Combine$succeed($elm$core$Tuple$pair)));
		});
}
function $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$caseStatements() {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v19) {
			var helper = function (last) {
				return $stil4m$elm_syntax$Combine$withState(
					function (s) {
						return $stil4m$elm_syntax$Combine$withLocation(
							function (l) {
								return _Utils_eq(
									$stil4m$elm_syntax$Elm$Parser$State$expectedColumn(s),
									l.W) ? A2(
									$stil4m$elm_syntax$Combine$map,
									function (c) {
										return $stil4m$elm_syntax$Combine$Loop(
											A2($elm$core$List$cons, c, last));
									},
									$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$caseStatement()) : $stil4m$elm_syntax$Combine$succeed(
									$stil4m$elm_syntax$Combine$Done(
										$elm$core$List$reverse(last)));
							});
					});
			};
			return A2(
				$stil4m$elm_syntax$Combine$andThen,
				function (v) {
					return A2($stil4m$elm_syntax$Combine$loop, v, helper);
				},
				A2(
					$stil4m$elm_syntax$Combine$map,
					$elm$core$List$singleton,
					$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$caseStatement()));
		});
}
function $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expression() {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v15) {
			return A2(
				$stil4m$elm_syntax$Combine$andThen,
				function (first) {
					var complete = function (rest) {
						return $stil4m$elm_syntax$Combine$succeed(
							function () {
								if (!rest.b) {
									return first;
								} else {
									return A2(
										$stil4m$elm_syntax$Elm$Syntax$Node$Node,
										$stil4m$elm_syntax$Elm$Syntax$Range$combine(
											A2(
												$elm$core$List$cons,
												$stil4m$elm_syntax$Elm$Syntax$Node$range(first),
												A2($elm$core$List$map, $stil4m$elm_syntax$Elm$Syntax$Node$range, rest))),
										$stil4m$elm_syntax$Elm$Syntax$Expression$Application(
											A2(
												$elm$core$List$cons,
												first,
												$elm$core$List$reverse(rest))));
								}
							}());
					};
					var promoter = function (rest) {
						return A2(
							$stil4m$elm_syntax$Elm$Parser$Layout$optimisticLayoutWith,
							function (_v16) {
								return complete(rest);
							},
							function (_v17) {
								return A2(
									$stil4m$elm_syntax$Combine$or,
									A2(
										$stil4m$elm_syntax$Combine$andThen,
										function (next) {
											return promoter(
												A2($elm$core$List$cons, next, rest));
										},
										$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expressionNotApplication()),
									complete(rest));
							});
					};
					return promoter(_List_Nil);
				},
				$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expressionNotApplication());
		});
}
function $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expressionNotApplication() {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v14) {
			return A2(
				$stil4m$elm_syntax$Combine$andThen,
				$stil4m$elm_syntax$Elm$Parser$Declarations$liftRecordAccess,
				$stil4m$elm_syntax$Combine$choice(
					_List_fromArray(
						[
							$stil4m$elm_syntax$Elm$Parser$Declarations$numberExpression,
							$stil4m$elm_syntax$Elm$Parser$Declarations$referenceExpression,
							$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$ifBlockExpression(),
							$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$tupledExpression(),
							$stil4m$elm_syntax$Elm$Parser$Declarations$recordAccessFunctionExpression,
							$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$operatorExpression(),
							$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$letExpression(),
							$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$lambdaExpression(),
							$stil4m$elm_syntax$Elm$Parser$Declarations$literalExpression,
							$stil4m$elm_syntax$Elm$Parser$Declarations$charLiteralExpression,
							$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$recordExpression(),
							$stil4m$elm_syntax$Elm$Parser$Declarations$glslExpression,
							$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$listExpression(),
							$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$caseExpression()
						])));
		});
}
function $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$ifBlockExpression() {
	return $stil4m$elm_syntax$Elm$Parser$Node$parser(
		A2(
			$stil4m$elm_syntax$Combine$continueWith,
			$stil4m$elm_syntax$Combine$lazy(
				function (_v13) {
					return A2(
						$stil4m$elm_syntax$Combine$andMap,
						A2(
							$stil4m$elm_syntax$Combine$continueWith,
							$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expression(),
							A2($stil4m$elm_syntax$Combine$continueWith, $stil4m$elm_syntax$Elm$Parser$Layout$layout, $stil4m$elm_syntax$Elm$Parser$Tokens$elseToken)),
						A2(
							$stil4m$elm_syntax$Combine$ignore,
							$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
							A2(
								$stil4m$elm_syntax$Combine$andMap,
								$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expression(),
								A2(
									$stil4m$elm_syntax$Combine$ignore,
									$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
									A2(
										$stil4m$elm_syntax$Combine$ignore,
										$stil4m$elm_syntax$Elm$Parser$Tokens$thenToken,
										A2(
											$stil4m$elm_syntax$Combine$ignore,
											$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
											A2(
												$stil4m$elm_syntax$Combine$andMap,
												$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expression(),
												A2(
													$stil4m$elm_syntax$Combine$ignore,
													$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
													$stil4m$elm_syntax$Combine$succeed($stil4m$elm_syntax$Elm$Syntax$Expression$IfBlock)))))))));
				}),
			$stil4m$elm_syntax$Elm$Parser$Tokens$ifToken));
}
function $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$lambdaExpression() {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v12) {
			return $stil4m$elm_syntax$Elm$Parser$Node$parser(
				A2(
					$stil4m$elm_syntax$Combine$andMap,
					A2(
						$stil4m$elm_syntax$Combine$continueWith,
						$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expression(),
						$stil4m$elm_syntax$Elm$Parser$Layout$maybeAroundBothSides(
							$stil4m$elm_syntax$Combine$string('->'))),
					A2(
						$stil4m$elm_syntax$Combine$andMap,
						A2(
							$stil4m$elm_syntax$Combine$sepBy1,
							$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
							$stil4m$elm_syntax$Elm$Parser$Declarations$functionArgument),
						A2(
							$stil4m$elm_syntax$Combine$ignore,
							$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
							A2(
								$stil4m$elm_syntax$Combine$ignore,
								$stil4m$elm_syntax$Combine$string('\\'),
								$stil4m$elm_syntax$Combine$succeed(
									F2(
										function (args, expr) {
											return $stil4m$elm_syntax$Elm$Syntax$Expression$LambdaExpression(
												A2($stil4m$elm_syntax$Elm$Syntax$Expression$Lambda, args, expr));
										})))))));
		});
}
function $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$letBlock() {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v11) {
			return A2(
				$stil4m$elm_syntax$Combine$ignore,
				A2(
					$stil4m$elm_syntax$Combine$continueWith,
					$stil4m$elm_syntax$Combine$string('in'),
					$stil4m$elm_syntax$Combine$choice(
						_List_fromArray(
							[$stil4m$elm_syntax$Elm$Parser$Layout$layout, $stil4m$elm_syntax$Elm$Parser$Whitespace$manySpaces]))),
				A2(
					$stil4m$elm_syntax$Combine$continueWith,
					$stil4m$elm_syntax$Elm$Parser$Declarations$withIndentedState(
						$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$letBody()),
					A2(
						$stil4m$elm_syntax$Combine$continueWith,
						$stil4m$elm_syntax$Elm$Parser$Layout$layout,
						$stil4m$elm_syntax$Combine$string('let'))));
		});
}
function $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$letBody() {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v8) {
			var blockElement = A2(
				$stil4m$elm_syntax$Combine$andThen,
				function (_v9) {
					var r = _v9.a;
					var p = _v9.b;
					if (p.$ === 11) {
						var v = p.a;
						return A2(
							$stil4m$elm_syntax$Combine$map,
							$stil4m$elm_syntax$Elm$Syntax$Expression$LetFunction,
							$stil4m$elm_syntax$Elm$Parser$Declarations$functionWithNameNode(
								A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, v)));
					} else {
						return $stil4m$elm_syntax$Elm$Parser$Declarations$letDestructuringDeclarationWithPattern(
							A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, p));
					}
				},
				$stil4m$elm_syntax$Elm$Parser$Patterns$pattern);
			return A2(
				$stil4m$elm_syntax$Combine$andMap,
				$stil4m$elm_syntax$Combine$many(
					A2(
						$stil4m$elm_syntax$Combine$ignore,
						$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
						$stil4m$elm_syntax$Elm$Parser$Node$parser(blockElement))),
				A2(
					$stil4m$elm_syntax$Combine$andMap,
					$stil4m$elm_syntax$Elm$Parser$Node$parser(blockElement),
					$stil4m$elm_syntax$Combine$succeed($elm$core$List$cons)));
		});
}
function $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$letExpression() {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v6) {
			return $stil4m$elm_syntax$Elm$Parser$Node$parser(
				A2(
					$stil4m$elm_syntax$Combine$andMap,
					A2(
						$stil4m$elm_syntax$Combine$continueWith,
						$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expression(),
						$stil4m$elm_syntax$Elm$Parser$Layout$layout),
					A2(
						$stil4m$elm_syntax$Combine$andMap,
						$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$letBlock(),
						$stil4m$elm_syntax$Combine$succeed(
							function (decls) {
								return A2(
									$elm$core$Basics$composeR,
									$stil4m$elm_syntax$Elm$Syntax$Expression$LetBlock(decls),
									$stil4m$elm_syntax$Elm$Syntax$Expression$LetExpression);
							}))));
		});
}
function $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$listExpression() {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v5) {
			var innerExpressions = A2(
				$stil4m$elm_syntax$Combine$map,
				$stil4m$elm_syntax$Elm$Syntax$Expression$ListExpr,
				A2(
					$stil4m$elm_syntax$Combine$andMap,
					$stil4m$elm_syntax$Combine$many(
						A2(
							$stil4m$elm_syntax$Combine$continueWith,
							$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expression(),
							A2(
								$stil4m$elm_syntax$Combine$ignore,
								$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
								$stil4m$elm_syntax$Combine$string(',')))),
					A2(
						$stil4m$elm_syntax$Combine$ignore,
						$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
						A2(
							$stil4m$elm_syntax$Combine$andMap,
							$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expression(),
							$stil4m$elm_syntax$Combine$succeed($elm$core$List$cons)))));
			return $stil4m$elm_syntax$Elm$Parser$Node$parser(
				A2(
					$stil4m$elm_syntax$Combine$continueWith,
					$stil4m$elm_syntax$Combine$choice(
						_List_fromArray(
							[
								A2(
								$stil4m$elm_syntax$Combine$map,
								$elm$core$Basics$always(
									$stil4m$elm_syntax$Elm$Syntax$Expression$ListExpr(_List_Nil)),
								$stil4m$elm_syntax$Combine$string(']')),
								A2(
								$stil4m$elm_syntax$Combine$ignore,
								$stil4m$elm_syntax$Combine$string(']'),
								innerExpressions)
							])),
					A2(
						$stil4m$elm_syntax$Combine$ignore,
						$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
						$stil4m$elm_syntax$Combine$string('['))));
		});
}
function $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$operatorExpression() {
	var negationExpression = $stil4m$elm_syntax$Combine$lazy(
		function (_v4) {
			return A2(
				$stil4m$elm_syntax$Combine$map,
				$stil4m$elm_syntax$Elm$Syntax$Expression$Negation,
				A2(
					$stil4m$elm_syntax$Combine$andThen,
					$stil4m$elm_syntax$Elm$Parser$Declarations$liftRecordAccess,
					$stil4m$elm_syntax$Combine$choice(
						_List_fromArray(
							[
								$stil4m$elm_syntax$Elm$Parser$Declarations$referenceExpression,
								$stil4m$elm_syntax$Elm$Parser$Declarations$numberExpression,
								$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$tupledExpression()
							]))));
		});
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v3) {
			return $stil4m$elm_syntax$Combine$choice(
				_List_fromArray(
					[
						$stil4m$elm_syntax$Elm$Parser$Node$parser(
						A2(
							$stil4m$elm_syntax$Combine$continueWith,
							$stil4m$elm_syntax$Combine$choice(
								_List_fromArray(
									[
										negationExpression,
										A2(
										$stil4m$elm_syntax$Combine$ignore,
										$stil4m$elm_syntax$Elm$Parser$Layout$layout,
										$stil4m$elm_syntax$Combine$succeed(
											$stil4m$elm_syntax$Elm$Syntax$Expression$Operator('-')))
									])),
							$stil4m$elm_syntax$Combine$string('-'))),
						$stil4m$elm_syntax$Elm$Parser$Node$parser(
						A2($stil4m$elm_syntax$Combine$map, $stil4m$elm_syntax$Elm$Syntax$Expression$Operator, $stil4m$elm_syntax$Elm$Parser$Tokens$infixOperatorToken))
					]));
		});
}
function $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$recordExpression() {
	return $stil4m$elm_syntax$Elm$Parser$Node$parser(
		$stil4m$elm_syntax$Combine$lazy(
			function (_v2) {
				var recordField = $stil4m$elm_syntax$Elm$Parser$Node$parser(
					A2(
						$stil4m$elm_syntax$Combine$andMap,
						$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expression(),
						A2(
							$stil4m$elm_syntax$Combine$ignore,
							$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
							A2(
								$stil4m$elm_syntax$Combine$ignore,
								$stil4m$elm_syntax$Combine$string('='),
								A2(
									$stil4m$elm_syntax$Combine$ignore,
									$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
									A2(
										$stil4m$elm_syntax$Combine$andMap,
										$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Tokens$functionName),
										$stil4m$elm_syntax$Combine$succeed($elm$core$Tuple$pair)))))));
				var recordFields = A2(
					$stil4m$elm_syntax$Combine$andMap,
					$stil4m$elm_syntax$Combine$many(
						A2(
							$stil4m$elm_syntax$Combine$ignore,
							$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
							A2(
								$stil4m$elm_syntax$Combine$continueWith,
								recordField,
								A2(
									$stil4m$elm_syntax$Combine$ignore,
									$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
									$stil4m$elm_syntax$Combine$string(','))))),
					A2(
						$stil4m$elm_syntax$Combine$ignore,
						$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
						A2(
							$stil4m$elm_syntax$Combine$andMap,
							recordField,
							$stil4m$elm_syntax$Combine$succeed($elm$core$List$cons))));
				var recordUpdateSyntaxParser = function (fname) {
					return A2(
						$stil4m$elm_syntax$Combine$ignore,
						$stil4m$elm_syntax$Combine$string('}'),
						A2(
							$stil4m$elm_syntax$Combine$map,
							function (e) {
								return A2($stil4m$elm_syntax$Elm$Syntax$Expression$RecordUpdateExpression, fname, e);
							},
							A2(
								$stil4m$elm_syntax$Combine$continueWith,
								recordFields,
								A2(
									$stil4m$elm_syntax$Combine$ignore,
									$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
									$stil4m$elm_syntax$Combine$string('|')))));
				};
				var recordContents = A2(
					$stil4m$elm_syntax$Combine$andThen,
					function (fname) {
						return $stil4m$elm_syntax$Combine$choice(
							_List_fromArray(
								[
									recordUpdateSyntaxParser(fname),
									A2(
									$stil4m$elm_syntax$Combine$andThen,
									function (fieldUpdate) {
										return $stil4m$elm_syntax$Combine$choice(
											_List_fromArray(
												[
													A2(
													$stil4m$elm_syntax$Combine$map,
													$elm$core$Basics$always(
														$stil4m$elm_syntax$Elm$Syntax$Expression$RecordExpr(
															_List_fromArray(
																[fieldUpdate]))),
													$stil4m$elm_syntax$Combine$string('}')),
													A2(
													$stil4m$elm_syntax$Combine$ignore,
													$stil4m$elm_syntax$Combine$string('}'),
													A2(
														$stil4m$elm_syntax$Combine$map,
														function (fieldUpdates) {
															return $stil4m$elm_syntax$Elm$Syntax$Expression$RecordExpr(
																A2($elm$core$List$cons, fieldUpdate, fieldUpdates));
														},
														A2(
															$stil4m$elm_syntax$Combine$continueWith,
															recordFields,
															A2(
																$stil4m$elm_syntax$Combine$ignore,
																$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
																$stil4m$elm_syntax$Combine$string(',')))))
												]));
									},
									A2(
										$stil4m$elm_syntax$Combine$ignore,
										$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
										A2(
											$stil4m$elm_syntax$Combine$continueWith,
											A2(
												$stil4m$elm_syntax$Combine$map,
												function (e) {
													return A3($stil4m$elm_syntax$Elm$Syntax$Node$combine, $elm$core$Tuple$pair, fname, e);
												},
												$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expression()),
											A2(
												$stil4m$elm_syntax$Combine$ignore,
												$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
												$stil4m$elm_syntax$Combine$string('=')))))
								]));
					},
					A2(
						$stil4m$elm_syntax$Combine$ignore,
						$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
						$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Tokens$functionName)));
				return A2(
					$stil4m$elm_syntax$Combine$continueWith,
					$stil4m$elm_syntax$Combine$choice(
						_List_fromArray(
							[
								A2(
								$stil4m$elm_syntax$Combine$map,
								$elm$core$Basics$always(
									$stil4m$elm_syntax$Elm$Syntax$Expression$RecordExpr(_List_Nil)),
								$stil4m$elm_syntax$Combine$string('}')),
								recordContents
							])),
					A2(
						$stil4m$elm_syntax$Combine$ignore,
						$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
						$stil4m$elm_syntax$Combine$string('{')));
			}));
}
function $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$tupledExpression() {
	return $stil4m$elm_syntax$Combine$lazy(
		function (_v0) {
			var commaSep = $stil4m$elm_syntax$Combine$many(
				A2(
					$stil4m$elm_syntax$Combine$ignore,
					$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
					A2(
						$stil4m$elm_syntax$Combine$continueWith,
						$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expression(),
						A2(
							$stil4m$elm_syntax$Combine$ignore,
							$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
							$stil4m$elm_syntax$Combine$string(',')))));
			var closingParen = $stil4m$elm_syntax$Combine$fromCore(
				$elm$parser$Parser$symbol(')'));
			var asExpression = F2(
				function (x, xs) {
					if (!xs.b) {
						return $stil4m$elm_syntax$Elm$Syntax$Expression$ParenthesizedExpression(x);
					} else {
						return $stil4m$elm_syntax$Elm$Syntax$Expression$TupledExpression(
							A2($elm$core$List$cons, x, xs));
					}
				});
			var nested = A2(
				$stil4m$elm_syntax$Combine$andMap,
				commaSep,
				A2(
					$stil4m$elm_syntax$Combine$ignore,
					$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
					A2(
						$stil4m$elm_syntax$Combine$andMap,
						$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expression(),
						A2(
							$stil4m$elm_syntax$Combine$ignore,
							$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
							$stil4m$elm_syntax$Combine$succeed(asExpression)))));
			return $stil4m$elm_syntax$Elm$Parser$Node$parser(
				A2(
					$stil4m$elm_syntax$Combine$continueWith,
					$stil4m$elm_syntax$Combine$choice(
						_List_fromArray(
							[
								A2(
								$stil4m$elm_syntax$Combine$map,
								$elm$core$Basics$always($stil4m$elm_syntax$Elm$Syntax$Expression$UnitExpr),
								closingParen),
								$stil4m$elm_syntax$Combine$backtrackable(
								A2(
									$stil4m$elm_syntax$Combine$map,
									$stil4m$elm_syntax$Elm$Syntax$Expression$PrefixOperator,
									A2($stil4m$elm_syntax$Combine$ignore, closingParen, $stil4m$elm_syntax$Elm$Parser$Tokens$prefixOperatorToken))),
								A2($stil4m$elm_syntax$Combine$ignore, closingParen, nested)
							])),
					$stil4m$elm_syntax$Combine$fromCore(
						$elm$parser$Parser$symbol('('))));
		});
}
var $stil4m$elm_syntax$Elm$Parser$Declarations$caseBlock = $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$caseBlock();
$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$caseBlock = function () {
	return $stil4m$elm_syntax$Elm$Parser$Declarations$caseBlock;
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$caseExpression = $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$caseExpression();
$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$caseExpression = function () {
	return $stil4m$elm_syntax$Elm$Parser$Declarations$caseExpression;
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$caseStatement = $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$caseStatement();
$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$caseStatement = function () {
	return $stil4m$elm_syntax$Elm$Parser$Declarations$caseStatement;
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$caseStatements = $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$caseStatements();
$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$caseStatements = function () {
	return $stil4m$elm_syntax$Elm$Parser$Declarations$caseStatements;
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$expression = $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expression();
$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expression = function () {
	return $stil4m$elm_syntax$Elm$Parser$Declarations$expression;
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$expressionNotApplication = $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expressionNotApplication();
$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$expressionNotApplication = function () {
	return $stil4m$elm_syntax$Elm$Parser$Declarations$expressionNotApplication;
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$ifBlockExpression = $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$ifBlockExpression();
$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$ifBlockExpression = function () {
	return $stil4m$elm_syntax$Elm$Parser$Declarations$ifBlockExpression;
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$lambdaExpression = $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$lambdaExpression();
$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$lambdaExpression = function () {
	return $stil4m$elm_syntax$Elm$Parser$Declarations$lambdaExpression;
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$letBlock = $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$letBlock();
$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$letBlock = function () {
	return $stil4m$elm_syntax$Elm$Parser$Declarations$letBlock;
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$letBody = $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$letBody();
$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$letBody = function () {
	return $stil4m$elm_syntax$Elm$Parser$Declarations$letBody;
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$letExpression = $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$letExpression();
$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$letExpression = function () {
	return $stil4m$elm_syntax$Elm$Parser$Declarations$letExpression;
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$listExpression = $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$listExpression();
$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$listExpression = function () {
	return $stil4m$elm_syntax$Elm$Parser$Declarations$listExpression;
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$operatorExpression = $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$operatorExpression();
$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$operatorExpression = function () {
	return $stil4m$elm_syntax$Elm$Parser$Declarations$operatorExpression;
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$recordExpression = $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$recordExpression();
$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$recordExpression = function () {
	return $stil4m$elm_syntax$Elm$Parser$Declarations$recordExpression;
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$tupledExpression = $stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$tupledExpression();
$stil4m$elm_syntax$Elm$Parser$Declarations$cyclic$tupledExpression = function () {
	return $stil4m$elm_syntax$Elm$Parser$Declarations$tupledExpression;
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$destructuringDeclaration = $stil4m$elm_syntax$Combine$lazy(
	function (_v0) {
		return A2(
			$stil4m$elm_syntax$Combine$andMap,
			$stil4m$elm_syntax$Elm$Parser$Declarations$expression,
			A2(
				$stil4m$elm_syntax$Combine$ignore,
				$stil4m$elm_syntax$Elm$Parser$Layout$layout,
				A2(
					$stil4m$elm_syntax$Combine$ignore,
					$stil4m$elm_syntax$Combine$string('='),
					A2(
						$stil4m$elm_syntax$Combine$andMap,
						$stil4m$elm_syntax$Elm$Parser$Patterns$pattern,
						$stil4m$elm_syntax$Combine$succeed(
							F2(
								function (x, y) {
									return A3($stil4m$elm_syntax$Elm$Syntax$Node$combine, $stil4m$elm_syntax$Elm$Syntax$Declaration$Destructuring, x, y);
								}))))));
	});
var $stil4m$elm_syntax$Elm$Syntax$Expression$functionRange = function (_function) {
	return $stil4m$elm_syntax$Elm$Syntax$Range$combine(
		_List_fromArray(
			[
				function () {
				var _v0 = _function.fG;
				if (!_v0.$) {
					var documentation = _v0.a;
					return $stil4m$elm_syntax$Elm$Syntax$Node$range(documentation);
				} else {
					return A2(
						$elm$core$Maybe$withDefault,
						function (_v3) {
							var r = _v3.a;
							return r;
						}(
							$stil4m$elm_syntax$Elm$Syntax$Node$value(_function.fx).f8),
						A2(
							$elm$core$Maybe$map,
							function (_v1) {
								var value = _v1.b;
								var _v2 = value.f8;
								var r = _v2.a;
								return r;
							},
							_function.gu));
				}
			}(),
				function (_v4) {
				var r = _v4.a;
				return r;
			}(
				$stil4m$elm_syntax$Elm$Syntax$Node$value(_function.fx).bJ)
			]));
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$function = $stil4m$elm_syntax$Combine$lazy(
	function (_v0) {
		return A2(
			$stil4m$elm_syntax$Combine$map,
			function (f) {
				return A2(
					$stil4m$elm_syntax$Elm$Syntax$Node$Node,
					$stil4m$elm_syntax$Elm$Syntax$Expression$functionRange(f),
					$stil4m$elm_syntax$Elm$Syntax$Declaration$FunctionDeclaration(f));
			},
			A2(
				$stil4m$elm_syntax$Combine$andThen,
				$stil4m$elm_syntax$Elm$Parser$Declarations$functionWithNameNode,
				A2(
					$stil4m$elm_syntax$Combine$ignore,
					$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
					$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Tokens$functionName))));
	});
var $stil4m$elm_syntax$Elm$Parser$Infix$infixDirection = $stil4m$elm_syntax$Combine$choice(
	_List_fromArray(
		[
			A2(
			$stil4m$elm_syntax$Combine$ignore,
			$stil4m$elm_syntax$Combine$string('right'),
			$stil4m$elm_syntax$Combine$succeed(1)),
			A2(
			$stil4m$elm_syntax$Combine$ignore,
			$stil4m$elm_syntax$Combine$string('left'),
			$stil4m$elm_syntax$Combine$succeed(0)),
			A2(
			$stil4m$elm_syntax$Combine$ignore,
			$stil4m$elm_syntax$Combine$string('non'),
			$stil4m$elm_syntax$Combine$succeed(2))
		]));
var $elm$parser$Parser$Advanced$int = F2(
	function (expecting, invalid) {
		return $elm$parser$Parser$Advanced$number(
			{
				dR: $elm$core$Result$Err(invalid),
				d2: expecting,
				d7: $elm$core$Result$Err(invalid),
				fR: $elm$core$Result$Err(invalid),
				ej: $elm$core$Result$Ok($elm$core$Basics$identity),
				f$: invalid,
				ex: $elm$core$Result$Err(invalid)
			});
	});
var $elm$parser$Parser$int = A2($elm$parser$Parser$Advanced$int, $elm$parser$Parser$ExpectingInt, $elm$parser$Parser$ExpectingInt);
var $stil4m$elm_syntax$Combine$Num$int = $stil4m$elm_syntax$Combine$fromCore($elm$parser$Parser$int);
var $stil4m$elm_syntax$Elm$Parser$Infix$infixDefinition = A2(
	$stil4m$elm_syntax$Combine$andMap,
	$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Tokens$functionName),
	A2(
		$stil4m$elm_syntax$Combine$ignore,
		$stil4m$elm_syntax$Elm$Parser$Layout$layout,
		A2(
			$stil4m$elm_syntax$Combine$ignore,
			$stil4m$elm_syntax$Combine$string('='),
			A2(
				$stil4m$elm_syntax$Combine$ignore,
				$stil4m$elm_syntax$Elm$Parser$Layout$layout,
				A2(
					$stil4m$elm_syntax$Combine$andMap,
					$stil4m$elm_syntax$Elm$Parser$Node$parser(
						$stil4m$elm_syntax$Combine$parens($stil4m$elm_syntax$Elm$Parser$Tokens$prefixOperatorToken)),
					A2(
						$stil4m$elm_syntax$Combine$ignore,
						$stil4m$elm_syntax$Elm$Parser$Layout$layout,
						A2(
							$stil4m$elm_syntax$Combine$andMap,
							$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Combine$Num$int),
							A2(
								$stil4m$elm_syntax$Combine$ignore,
								$stil4m$elm_syntax$Elm$Parser$Layout$layout,
								A2(
									$stil4m$elm_syntax$Combine$andMap,
									$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Infix$infixDirection),
									A2(
										$stil4m$elm_syntax$Combine$ignore,
										$stil4m$elm_syntax$Elm$Parser$Layout$layout,
										A2(
											$stil4m$elm_syntax$Combine$ignore,
											$stil4m$elm_syntax$Combine$fromCore(
												$elm$parser$Parser$keyword('infix')),
											$stil4m$elm_syntax$Combine$succeed($stil4m$elm_syntax$Elm$Syntax$Infix$Infix))))))))))));
var $stil4m$elm_syntax$Elm$Parser$Ranges$asPointerLocation = function (_v0) {
	var line = _v0.aW;
	var column = _v0.W;
	return {W: column, C: line};
};
var $stil4m$elm_syntax$Elm$Parser$Ranges$withCurrentPoint = function (p) {
	return $stil4m$elm_syntax$Combine$withLocation(
		function (start) {
			var k = $stil4m$elm_syntax$Elm$Parser$Ranges$asPointerLocation(start);
			return p(
				{bH: k, J: k});
		});
};
var $stil4m$elm_syntax$Elm$Parser$Declarations$infixDeclaration = $stil4m$elm_syntax$Elm$Parser$Ranges$withCurrentPoint(
	function (current) {
		return A2(
			$stil4m$elm_syntax$Combine$map,
			function (inf) {
				return A2(
					$stil4m$elm_syntax$Elm$Syntax$Node$Node,
					$stil4m$elm_syntax$Elm$Syntax$Range$combine(
						_List_fromArray(
							[
								current,
								$stil4m$elm_syntax$Elm$Syntax$Node$range(inf.fO)
							])),
					$stil4m$elm_syntax$Elm$Syntax$Declaration$InfixDeclaration(inf));
			},
			$stil4m$elm_syntax$Elm$Parser$Infix$infixDefinition);
	});
var $stil4m$elm_syntax$Elm$Parser$Tokens$portToken = $stil4m$elm_syntax$Combine$string('port');
var $stil4m$elm_syntax$Elm$Parser$Declarations$signature = A2(
	$stil4m$elm_syntax$Combine$andMap,
	A2(
		$stil4m$elm_syntax$Combine$continueWith,
		$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$typeAnnotation,
		A2(
			$stil4m$elm_syntax$Combine$continueWith,
			$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
			$stil4m$elm_syntax$Elm$Parser$Layout$maybeAroundBothSides(
				$stil4m$elm_syntax$Combine$string(':')))),
	A2(
		$stil4m$elm_syntax$Combine$andMap,
		$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Tokens$functionName),
		$stil4m$elm_syntax$Combine$succeed($stil4m$elm_syntax$Elm$Syntax$Signature$Signature)));
var $stil4m$elm_syntax$Elm$Parser$Declarations$portDeclaration = $stil4m$elm_syntax$Elm$Parser$Ranges$withCurrentPoint(
	function (current) {
		return A2(
			$stil4m$elm_syntax$Combine$map,
			function (sig) {
				return A2(
					$stil4m$elm_syntax$Elm$Syntax$Node$Node,
					$stil4m$elm_syntax$Elm$Syntax$Range$combine(
						_List_fromArray(
							[
								current,
								function (_v0) {
								var r = _v0.a;
								return r;
							}(sig.gI)
							])),
					$stil4m$elm_syntax$Elm$Syntax$Declaration$PortDeclaration(sig));
			},
			A2(
				$stil4m$elm_syntax$Combine$continueWith,
				$stil4m$elm_syntax$Elm$Parser$Declarations$signature,
				A2($stil4m$elm_syntax$Combine$ignore, $stil4m$elm_syntax$Elm$Parser$Layout$layout, $stil4m$elm_syntax$Elm$Parser$Tokens$portToken)));
	});
var $stil4m$elm_syntax$Elm$Parser$Typings$DefinedAlias = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $stil4m$elm_syntax$Elm$Parser$Typings$DefinedType = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $stil4m$elm_syntax$Elm$Parser$Typings$genericList = $stil4m$elm_syntax$Combine$many(
	A2(
		$stil4m$elm_syntax$Combine$ignore,
		$stil4m$elm_syntax$Elm$Parser$Layout$layout,
		$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Tokens$functionName)));
var $stil4m$elm_syntax$Elm$Parser$Typings$typePrefix = A2(
	$stil4m$elm_syntax$Combine$continueWith,
	$stil4m$elm_syntax$Elm$Parser$Layout$layout,
	$stil4m$elm_syntax$Combine$string('type'));
var $stil4m$elm_syntax$Elm$Parser$TypeAnnotation$typeAnnotationNonGreedy = $stil4m$elm_syntax$Combine$choice(
	_List_fromArray(
		[
			$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$parensTypeAnnotation,
			$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$typedTypeAnnotation(1),
			$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$genericTypeAnnotation,
			$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$recordTypeAnnotation
		]));
var $stil4m$elm_syntax$Elm$Parser$Typings$valueConstructor = A2(
	$stil4m$elm_syntax$Combine$andThen,
	function (tnn) {
		var range = tnn.a;
		var complete = function (args) {
			return $stil4m$elm_syntax$Combine$succeed(
				A2(
					$stil4m$elm_syntax$Elm$Syntax$Node$Node,
					$stil4m$elm_syntax$Elm$Syntax$Range$combine(
						A2(
							$elm$core$List$cons,
							range,
							A2($elm$core$List$map, $stil4m$elm_syntax$Elm$Syntax$Node$range, args))),
					A2($stil4m$elm_syntax$Elm$Syntax$Type$ValueConstructor, tnn, args)));
		};
		var argHelper = function (xs) {
			return A2(
				$stil4m$elm_syntax$Combine$continueWith,
				$stil4m$elm_syntax$Combine$choice(
					_List_fromArray(
						[
							A2(
							$stil4m$elm_syntax$Combine$andThen,
							function (ta) {
								return A2(
									$stil4m$elm_syntax$Elm$Parser$Layout$optimisticLayoutWith,
									function (_v0) {
										return $stil4m$elm_syntax$Combine$succeed(
											$elm$core$List$reverse(
												A2($elm$core$List$cons, ta, xs)));
									},
									function (_v1) {
										return argHelper(
											A2($elm$core$List$cons, ta, xs));
									});
							},
							$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$typeAnnotationNonGreedy),
							$stil4m$elm_syntax$Combine$succeed(
							$elm$core$List$reverse(xs))
						])),
				$stil4m$elm_syntax$Combine$succeed(0));
		};
		return A2(
			$stil4m$elm_syntax$Elm$Parser$Layout$optimisticLayoutWith,
			function (_v2) {
				return complete(_List_Nil);
			},
			function (_v3) {
				return A2(
					$stil4m$elm_syntax$Combine$andThen,
					complete,
					argHelper(_List_Nil));
			});
	},
	A2(
		$stil4m$elm_syntax$Combine$continueWith,
		$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Tokens$typeName),
		$stil4m$elm_syntax$Combine$succeed($stil4m$elm_syntax$Elm$Syntax$Type$ValueConstructor)));
var $stil4m$elm_syntax$Elm$Parser$Typings$valueConstructors = A2(
	$stil4m$elm_syntax$Combine$sepBy1,
	A2(
		$stil4m$elm_syntax$Combine$ignore,
		$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
		$stil4m$elm_syntax$Combine$string('|')),
	$stil4m$elm_syntax$Elm$Parser$Typings$valueConstructor);
var $stil4m$elm_syntax$Elm$Parser$Typings$typeDefinition = $stil4m$elm_syntax$Elm$Parser$Ranges$withCurrentPoint(
	function (start) {
		return A2(
			$stil4m$elm_syntax$Combine$continueWith,
			$stil4m$elm_syntax$Combine$choice(
				_List_fromArray(
					[
						A2(
						$stil4m$elm_syntax$Combine$map,
						function (typeAlias) {
							return A2(
								$stil4m$elm_syntax$Elm$Parser$Typings$DefinedAlias,
								$stil4m$elm_syntax$Elm$Syntax$Range$combine(
									_List_fromArray(
										[
											start,
											$stil4m$elm_syntax$Elm$Syntax$Node$range(typeAlias.gI)
										])),
								typeAlias);
						},
						A2(
							$stil4m$elm_syntax$Combine$andMap,
							$stil4m$elm_syntax$Elm$Parser$TypeAnnotation$typeAnnotation,
							A2(
								$stil4m$elm_syntax$Combine$ignore,
								$stil4m$elm_syntax$Elm$Parser$Layout$layout,
								A2(
									$stil4m$elm_syntax$Combine$ignore,
									$stil4m$elm_syntax$Combine$string('='),
									A2(
										$stil4m$elm_syntax$Combine$andMap,
										$stil4m$elm_syntax$Elm$Parser$Typings$genericList,
										A2(
											$stil4m$elm_syntax$Combine$andMap,
											A2(
												$stil4m$elm_syntax$Combine$ignore,
												$stil4m$elm_syntax$Elm$Parser$Layout$layout,
												$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Tokens$typeName)),
											A2(
												$stil4m$elm_syntax$Combine$ignore,
												A2(
													$stil4m$elm_syntax$Combine$continueWith,
													$stil4m$elm_syntax$Elm$Parser$Layout$layout,
													$stil4m$elm_syntax$Combine$string('alias')),
												$stil4m$elm_syntax$Combine$succeed(
													$stil4m$elm_syntax$Elm$Syntax$TypeAlias$TypeAlias($elm$core$Maybe$Nothing))))))))),
						A2(
						$stil4m$elm_syntax$Combine$map,
						function (tipe) {
							return A2(
								$stil4m$elm_syntax$Elm$Parser$Typings$DefinedType,
								$stil4m$elm_syntax$Elm$Syntax$Range$combine(
									A2(
										$elm$core$List$cons,
										start,
										A2(
											$elm$core$List$map,
											function (_v0) {
												var r = _v0.a;
												return r;
											},
											tipe.fu))),
								tipe);
						},
						A2(
							$stil4m$elm_syntax$Combine$andMap,
							$stil4m$elm_syntax$Elm$Parser$Typings$valueConstructors,
							A2(
								$stil4m$elm_syntax$Combine$ignore,
								A2(
									$stil4m$elm_syntax$Combine$ignore,
									$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
									$stil4m$elm_syntax$Combine$string('=')),
								A2(
									$stil4m$elm_syntax$Combine$ignore,
									$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
									A2(
										$stil4m$elm_syntax$Combine$andMap,
										$stil4m$elm_syntax$Elm$Parser$Typings$genericList,
										A2(
											$stil4m$elm_syntax$Combine$ignore,
											$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
											A2(
												$stil4m$elm_syntax$Combine$andMap,
												$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Tokens$typeName),
												$stil4m$elm_syntax$Combine$succeed(
													$stil4m$elm_syntax$Elm$Syntax$Type$Type($elm$core$Maybe$Nothing)))))))))
					])),
			$stil4m$elm_syntax$Elm$Parser$Typings$typePrefix);
	});
var $stil4m$elm_syntax$Elm$Parser$Declarations$declaration = $stil4m$elm_syntax$Combine$lazy(
	function (_v0) {
		return $stil4m$elm_syntax$Combine$choice(
			_List_fromArray(
				[
					$stil4m$elm_syntax$Elm$Parser$Declarations$infixDeclaration,
					$stil4m$elm_syntax$Elm$Parser$Declarations$function,
					A2(
					$stil4m$elm_syntax$Combine$map,
					function (v) {
						if (!v.$) {
							var r = v.a;
							var t = v.b;
							return A2(
								$stil4m$elm_syntax$Elm$Syntax$Node$Node,
								r,
								$stil4m$elm_syntax$Elm$Syntax$Declaration$CustomTypeDeclaration(t));
						} else {
							var r = v.a;
							var a = v.b;
							return A2(
								$stil4m$elm_syntax$Elm$Syntax$Node$Node,
								r,
								$stil4m$elm_syntax$Elm$Syntax$Declaration$AliasDeclaration(a));
						}
					},
					$stil4m$elm_syntax$Elm$Parser$Typings$typeDefinition),
					$stil4m$elm_syntax$Elm$Parser$Declarations$portDeclaration,
					$stil4m$elm_syntax$Elm$Parser$Declarations$destructuringDeclaration
				]));
	});
var $stil4m$elm_syntax$Elm$Parser$File$fileDeclarations = $stil4m$elm_syntax$Combine$many(
	A2(
		$stil4m$elm_syntax$Combine$ignore,
		$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layoutStrict),
		$stil4m$elm_syntax$Elm$Parser$Declarations$declaration));
var $stil4m$elm_syntax$Elm$Parser$Tokens$asToken = $stil4m$elm_syntax$Combine$fromCore(
	$elm$parser$Parser$keyword('as'));
var $stil4m$elm_syntax$Elm$Parser$Expose$functionExpose = $stil4m$elm_syntax$Elm$Parser$Node$parser(
	A2($stil4m$elm_syntax$Combine$map, $stil4m$elm_syntax$Elm$Syntax$Exposing$FunctionExpose, $stil4m$elm_syntax$Elm$Parser$Tokens$functionName));
var $stil4m$elm_syntax$Combine$while = function (pred) {
	return function (state) {
		return A2(
			$elm$parser$Parser$map,
			function (x) {
				return _Utils_Tuple2(state, x);
			},
			$elm$parser$Parser$getChompedString(
				$elm$parser$Parser$chompWhile(pred)));
	};
};
var $stil4m$elm_syntax$Elm$Parser$Expose$infixExpose = $stil4m$elm_syntax$Combine$lazy(
	function (_v0) {
		return $stil4m$elm_syntax$Elm$Parser$Node$parser(
			A2(
				$stil4m$elm_syntax$Combine$map,
				$stil4m$elm_syntax$Elm$Syntax$Exposing$InfixExpose,
				$stil4m$elm_syntax$Combine$parens(
					$stil4m$elm_syntax$Combine$while(
						$elm$core$Basics$neq(')')))));
	});
var $stil4m$elm_syntax$Elm$Parser$Expose$exposedType = A2(
	$stil4m$elm_syntax$Combine$andThen,
	function (tipe) {
		return $stil4m$elm_syntax$Combine$choice(
			_List_fromArray(
				[
					A2(
					$stil4m$elm_syntax$Combine$map,
					A2(
						$elm$core$Basics$composeR,
						$stil4m$elm_syntax$Elm$Syntax$Node$range,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Maybe$Just,
							A2(
								$elm$core$Basics$composeR,
								function (v) {
									return A2($stil4m$elm_syntax$Elm$Syntax$Exposing$ExposedType, tipe, v);
								},
								$stil4m$elm_syntax$Elm$Syntax$Exposing$TypeExpose))),
					$stil4m$elm_syntax$Elm$Parser$Node$parser(
						$stil4m$elm_syntax$Combine$parens(
							$stil4m$elm_syntax$Elm$Parser$Layout$maybeAroundBothSides(
								$stil4m$elm_syntax$Combine$string('..'))))),
					$stil4m$elm_syntax$Combine$succeed(
					$stil4m$elm_syntax$Elm$Syntax$Exposing$TypeOrAliasExpose(tipe))
				]));
	},
	A2(
		$stil4m$elm_syntax$Combine$ignore,
		$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
		A2(
			$stil4m$elm_syntax$Combine$andMap,
			$stil4m$elm_syntax$Elm$Parser$Tokens$typeName,
			$stil4m$elm_syntax$Combine$succeed($elm$core$Basics$identity))));
var $stil4m$elm_syntax$Elm$Parser$Expose$typeExpose = $stil4m$elm_syntax$Combine$lazy(
	function (_v0) {
		return $stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Expose$exposedType);
	});
var $stil4m$elm_syntax$Elm$Parser$Expose$exposable = $stil4m$elm_syntax$Combine$lazy(
	function (_v0) {
		return $stil4m$elm_syntax$Combine$choice(
			_List_fromArray(
				[$stil4m$elm_syntax$Elm$Parser$Expose$typeExpose, $stil4m$elm_syntax$Elm$Parser$Expose$infixExpose, $stil4m$elm_syntax$Elm$Parser$Expose$functionExpose]));
	});
var $stil4m$elm_syntax$Elm$Parser$Ranges$withRange = function (p) {
	return $stil4m$elm_syntax$Combine$withLocation(
		function (start) {
			return A2(
				$stil4m$elm_syntax$Combine$andMap,
				$stil4m$elm_syntax$Combine$withLocation(
					function (end) {
						return $stil4m$elm_syntax$Combine$succeed(
							{
								bH: $stil4m$elm_syntax$Elm$Parser$Ranges$asPointerLocation(end),
								J: $stil4m$elm_syntax$Elm$Parser$Ranges$asPointerLocation(start)
							});
					}),
				p);
		});
};
var $stil4m$elm_syntax$Elm$Parser$Expose$exposingListInner = $stil4m$elm_syntax$Combine$lazy(
	function (_v0) {
		return A2(
			$stil4m$elm_syntax$Combine$or,
			$stil4m$elm_syntax$Elm$Parser$Ranges$withRange(
				A2(
					$stil4m$elm_syntax$Combine$ignore,
					$stil4m$elm_syntax$Elm$Parser$Layout$maybeAroundBothSides(
						$stil4m$elm_syntax$Combine$string('..')),
					$stil4m$elm_syntax$Combine$succeed($stil4m$elm_syntax$Elm$Syntax$Exposing$All))),
			A2(
				$stil4m$elm_syntax$Combine$map,
				$stil4m$elm_syntax$Elm$Syntax$Exposing$Explicit,
				A2(
					$stil4m$elm_syntax$Combine$sepBy,
					$stil4m$elm_syntax$Combine$Char$char(','),
					$stil4m$elm_syntax$Elm$Parser$Layout$maybeAroundBothSides($stil4m$elm_syntax$Elm$Parser$Expose$exposable))));
	});
var $stil4m$elm_syntax$Elm$Parser$Expose$exposeListWith = $stil4m$elm_syntax$Combine$parens(
	A2(
		$stil4m$elm_syntax$Combine$ignore,
		$stil4m$elm_syntax$Elm$Parser$Layout$optimisticLayout,
		A2($stil4m$elm_syntax$Combine$continueWith, $stil4m$elm_syntax$Elm$Parser$Expose$exposingListInner, $stil4m$elm_syntax$Elm$Parser$Layout$optimisticLayout)));
var $stil4m$elm_syntax$Elm$Parser$Tokens$exposingToken = $stil4m$elm_syntax$Combine$string('exposing');
var $stil4m$elm_syntax$Elm$Parser$Expose$exposeDefinition = A2(
	$stil4m$elm_syntax$Combine$continueWith,
	$stil4m$elm_syntax$Elm$Parser$Expose$exposeListWith,
	A2(
		$stil4m$elm_syntax$Combine$continueWith,
		$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layout),
		$stil4m$elm_syntax$Elm$Parser$Tokens$exposingToken));
var $stil4m$elm_syntax$Elm$Parser$Tokens$importToken = $stil4m$elm_syntax$Combine$fromCore(
	$elm$parser$Parser$keyword('import'));
var $stil4m$elm_syntax$Elm$Parser$Base$moduleName = A2(
	$stil4m$elm_syntax$Combine$sepBy1,
	$stil4m$elm_syntax$Combine$string('.'),
	$stil4m$elm_syntax$Elm$Parser$Tokens$typeName);
var $stil4m$elm_syntax$Elm$Parser$Imports$setupNode = F2(
	function (start, imp) {
		var allRanges = _List_fromArray(
			[
				$elm$core$Maybe$Just(start),
				$elm$core$Maybe$Just(
				$stil4m$elm_syntax$Elm$Syntax$Node$range(imp.a_)),
				A2($elm$core$Maybe$map, $stil4m$elm_syntax$Elm$Syntax$Node$range, imp.bI),
				A2($elm$core$Maybe$map, $stil4m$elm_syntax$Elm$Syntax$Node$range, imp.et)
			]);
		return A2(
			$stil4m$elm_syntax$Elm$Syntax$Node$Node,
			$stil4m$elm_syntax$Elm$Syntax$Range$combine(
				A2($elm$core$List$filterMap, $elm$core$Basics$identity, allRanges)),
			imp);
	});
var $stil4m$elm_syntax$Elm$Parser$Imports$importDefinition = function () {
	var parseExposingDefinition = F2(
		function (mod, asDef) {
			return $stil4m$elm_syntax$Combine$choice(
				_List_fromArray(
					[
						A2(
						$stil4m$elm_syntax$Combine$map,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Maybe$Just,
							A2($stil4m$elm_syntax$Elm$Syntax$Import$Import, mod, asDef)),
						$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Expose$exposeDefinition)),
						$stil4m$elm_syntax$Combine$succeed(
						A3($stil4m$elm_syntax$Elm$Syntax$Import$Import, mod, asDef, $elm$core$Maybe$Nothing))
					]));
		});
	var importAndModuleName = A2(
		$stil4m$elm_syntax$Combine$continueWith,
		$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Base$moduleName),
		A2($stil4m$elm_syntax$Combine$continueWith, $stil4m$elm_syntax$Elm$Parser$Layout$layout, $stil4m$elm_syntax$Elm$Parser$Tokens$importToken));
	var asDefinition = A2(
		$stil4m$elm_syntax$Combine$continueWith,
		$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Base$moduleName),
		A2($stil4m$elm_syntax$Combine$continueWith, $stil4m$elm_syntax$Elm$Parser$Layout$layout, $stil4m$elm_syntax$Elm$Parser$Tokens$asToken));
	var parseAsDefinition = function (mod) {
		return $stil4m$elm_syntax$Combine$choice(
			_List_fromArray(
				[
					A2(
					$stil4m$elm_syntax$Combine$andThen,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Maybe$Just,
						parseExposingDefinition(mod)),
					A2($stil4m$elm_syntax$Combine$ignore, $stil4m$elm_syntax$Elm$Parser$Layout$optimisticLayout, asDefinition)),
					A2(parseExposingDefinition, mod, $elm$core$Maybe$Nothing)
				]));
	};
	return A2(
		$stil4m$elm_syntax$Combine$andThen,
		function (_v0) {
			var start = _v0.a;
			return A2(
				$stil4m$elm_syntax$Combine$map,
				$stil4m$elm_syntax$Elm$Parser$Imports$setupNode(start),
				A2(
					$stil4m$elm_syntax$Combine$andThen,
					parseAsDefinition,
					A2($stil4m$elm_syntax$Combine$ignore, $stil4m$elm_syntax$Elm$Parser$Layout$optimisticLayout, importAndModuleName)));
		},
		$stil4m$elm_syntax$Elm$Parser$Node$parser(
			$stil4m$elm_syntax$Combine$succeed(0)));
}();
var $stil4m$elm_syntax$Elm$Parser$Modules$effectWhereClause = A2(
	$stil4m$elm_syntax$Combine$andMap,
	A2(
		$stil4m$elm_syntax$Combine$continueWith,
		$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Tokens$typeName),
		$stil4m$elm_syntax$Elm$Parser$Layout$maybeAroundBothSides(
			$stil4m$elm_syntax$Combine$string('='))),
	A2(
		$stil4m$elm_syntax$Combine$andMap,
		$stil4m$elm_syntax$Elm$Parser$Tokens$functionName,
		$stil4m$elm_syntax$Combine$succeed($elm$core$Tuple$pair)));
var $stil4m$elm_syntax$Elm$Parser$Modules$whereBlock = A2(
	$stil4m$elm_syntax$Combine$map,
	function (pairs) {
		return {
			cS: A2(
				$elm$core$Maybe$map,
				$elm$core$Tuple$second,
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Tuple$first,
							$elm$core$Basics$eq('command')),
						pairs))),
			dF: A2(
				$elm$core$Maybe$map,
				$elm$core$Tuple$second,
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Tuple$first,
							$elm$core$Basics$eq('subscription')),
						pairs)))
		};
	},
	A3(
		$stil4m$elm_syntax$Combine$between,
		$stil4m$elm_syntax$Combine$string('{'),
		$stil4m$elm_syntax$Combine$string('}'),
		A2(
			$stil4m$elm_syntax$Combine$sepBy1,
			$stil4m$elm_syntax$Combine$string(','),
			$stil4m$elm_syntax$Elm$Parser$Layout$maybeAroundBothSides($stil4m$elm_syntax$Elm$Parser$Modules$effectWhereClause))));
var $stil4m$elm_syntax$Elm$Parser$Modules$effectWhereClauses = A2(
	$stil4m$elm_syntax$Combine$continueWith,
	$stil4m$elm_syntax$Elm$Parser$Modules$whereBlock,
	A2(
		$stil4m$elm_syntax$Combine$continueWith,
		$stil4m$elm_syntax$Elm$Parser$Layout$layout,
		$stil4m$elm_syntax$Combine$string('where')));
var $stil4m$elm_syntax$Elm$Parser$Tokens$moduleToken = $stil4m$elm_syntax$Combine$string('module');
var $stil4m$elm_syntax$Elm$Parser$Modules$effectModuleDefinition = function () {
	var createEffectModule = F3(
		function (name, whereClauses, exp) {
			return $stil4m$elm_syntax$Elm$Syntax$Module$EffectModule(
				{cS: whereClauses.cS, bI: exp, a_: name, dF: whereClauses.dF});
		});
	return A2(
		$stil4m$elm_syntax$Combine$andMap,
		$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Expose$exposeDefinition),
		A2(
			$stil4m$elm_syntax$Combine$ignore,
			$stil4m$elm_syntax$Elm$Parser$Layout$layout,
			A2(
				$stil4m$elm_syntax$Combine$andMap,
				$stil4m$elm_syntax$Elm$Parser$Modules$effectWhereClauses,
				A2(
					$stil4m$elm_syntax$Combine$ignore,
					$stil4m$elm_syntax$Elm$Parser$Layout$layout,
					A2(
						$stil4m$elm_syntax$Combine$andMap,
						$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Base$moduleName),
						A2(
							$stil4m$elm_syntax$Combine$ignore,
							$stil4m$elm_syntax$Elm$Parser$Layout$layout,
							A2(
								$stil4m$elm_syntax$Combine$ignore,
								$stil4m$elm_syntax$Elm$Parser$Tokens$moduleToken,
								A2(
									$stil4m$elm_syntax$Combine$ignore,
									$stil4m$elm_syntax$Elm$Parser$Layout$layout,
									A2(
										$stil4m$elm_syntax$Combine$ignore,
										$stil4m$elm_syntax$Combine$string('effect'),
										$stil4m$elm_syntax$Combine$succeed(createEffectModule))))))))));
}();
var $stil4m$elm_syntax$Elm$Parser$Modules$normalModuleDefinition = A2(
	$stil4m$elm_syntax$Combine$map,
	$stil4m$elm_syntax$Elm$Syntax$Module$NormalModule,
	A2(
		$stil4m$elm_syntax$Combine$andMap,
		$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Expose$exposeDefinition),
		A2(
			$stil4m$elm_syntax$Combine$ignore,
			$stil4m$elm_syntax$Elm$Parser$Layout$layout,
			A2(
				$stil4m$elm_syntax$Combine$andMap,
				$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Base$moduleName),
				A2(
					$stil4m$elm_syntax$Combine$ignore,
					$stil4m$elm_syntax$Elm$Parser$Layout$layout,
					A2(
						$stil4m$elm_syntax$Combine$ignore,
						$stil4m$elm_syntax$Elm$Parser$Tokens$moduleToken,
						$stil4m$elm_syntax$Combine$succeed($stil4m$elm_syntax$Elm$Syntax$Module$DefaultModuleData)))))));
var $stil4m$elm_syntax$Elm$Parser$Modules$portModuleDefinition = A2(
	$stil4m$elm_syntax$Combine$map,
	$stil4m$elm_syntax$Elm$Syntax$Module$PortModule,
	A2(
		$stil4m$elm_syntax$Combine$andMap,
		$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Expose$exposeDefinition),
		A2(
			$stil4m$elm_syntax$Combine$ignore,
			$stil4m$elm_syntax$Elm$Parser$Layout$layout,
			A2(
				$stil4m$elm_syntax$Combine$andMap,
				$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Base$moduleName),
				A2(
					$stil4m$elm_syntax$Combine$ignore,
					$stil4m$elm_syntax$Elm$Parser$Layout$layout,
					A2(
						$stil4m$elm_syntax$Combine$ignore,
						$stil4m$elm_syntax$Elm$Parser$Tokens$moduleToken,
						A2(
							$stil4m$elm_syntax$Combine$ignore,
							$stil4m$elm_syntax$Elm$Parser$Layout$layout,
							A2(
								$stil4m$elm_syntax$Combine$ignore,
								$stil4m$elm_syntax$Elm$Parser$Tokens$portToken,
								$stil4m$elm_syntax$Combine$succeed($stil4m$elm_syntax$Elm$Syntax$Module$DefaultModuleData)))))))));
var $stil4m$elm_syntax$Elm$Parser$Modules$moduleDefinition = $stil4m$elm_syntax$Combine$choice(
	_List_fromArray(
		[$stil4m$elm_syntax$Elm$Parser$Modules$normalModuleDefinition, $stil4m$elm_syntax$Elm$Parser$Modules$portModuleDefinition, $stil4m$elm_syntax$Elm$Parser$Modules$effectModuleDefinition]));
var $stil4m$elm_syntax$Elm$Parser$File$file = A2(
	$stil4m$elm_syntax$Combine$ignore,
	$stil4m$elm_syntax$Elm$Parser$Layout$optimisticLayout,
	A2(
		$stil4m$elm_syntax$Combine$andMap,
		$stil4m$elm_syntax$Elm$Parser$File$collectComments,
		A2(
			$stil4m$elm_syntax$Combine$andMap,
			$stil4m$elm_syntax$Elm$Parser$File$fileDeclarations,
			A2(
				$stil4m$elm_syntax$Combine$ignore,
				$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layoutStrict),
				A2(
					$stil4m$elm_syntax$Combine$andMap,
					$stil4m$elm_syntax$Combine$many(
						A2($stil4m$elm_syntax$Combine$ignore, $stil4m$elm_syntax$Elm$Parser$Layout$optimisticLayout, $stil4m$elm_syntax$Elm$Parser$Imports$importDefinition)),
					A2(
						$stil4m$elm_syntax$Combine$ignore,
						$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layoutStrict),
						A2(
							$stil4m$elm_syntax$Combine$andMap,
							$stil4m$elm_syntax$Elm$Parser$Node$parser($stil4m$elm_syntax$Elm$Parser$Modules$moduleDefinition),
							A2(
								$stil4m$elm_syntax$Combine$ignore,
								$stil4m$elm_syntax$Combine$maybe($stil4m$elm_syntax$Elm$Parser$Layout$layoutStrict),
								$stil4m$elm_syntax$Combine$succeed($stil4m$elm_syntax$Elm$Syntax$File$File)))))))));
var $stil4m$elm_syntax$Elm$Internal$RawFile$fromFile = $elm$core$Basics$identity;
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {dV: col, eD: problem, C: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.C, p.dV, p.eD);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 0:
					return list;
				case 1:
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0;
		var _v1 = parse(
			{dV: 1, aM: _List_Nil, f: 1, b: 0, C: 1, a: src});
		if (!_v1.$) {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (!_v0.$) {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $stil4m$elm_syntax$Combine$runParser = F3(
	function (_v0, st, s) {
		var p = _v0;
		return A2(
			$elm$parser$Parser$run,
			p(st),
			s);
	});
var $elm$parser$Parser$ExpectingEnd = {$: 10};
var $elm$parser$Parser$Advanced$end = function (x) {
	return function (s) {
		return _Utils_eq(
			$elm$core$String$length(s.a),
			s.b) ? A3($elm$parser$Parser$Advanced$Good, false, 0, s) : A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$end = $elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd);
var $stil4m$elm_syntax$Combine$end = function (state) {
	return A2(
		$elm$parser$Parser$map,
		function (x) {
			return _Utils_Tuple2(state, x);
		},
		$elm$parser$Parser$end);
};
var $stil4m$elm_syntax$Elm$Parser$withEnd = function (p) {
	return A2(
		$stil4m$elm_syntax$Combine$ignore,
		$stil4m$elm_syntax$Combine$withLocation(
			function (_v0) {
				return $stil4m$elm_syntax$Combine$end;
			}),
		p);
};
var $stil4m$elm_syntax$Elm$Parser$parse = function (input) {
	var _v0 = A3(
		$stil4m$elm_syntax$Combine$runParser,
		$stil4m$elm_syntax$Elm$Parser$withEnd($stil4m$elm_syntax$Elm$Parser$File$file),
		$stil4m$elm_syntax$Elm$Parser$State$emptyState,
		input + '\n');
	if (!_v0.$) {
		var _v1 = _v0.a;
		var r = _v1.b;
		return $elm$core$Result$Ok(
			$stil4m$elm_syntax$Elm$Internal$RawFile$fromFile(r));
	} else {
		var s = _v0.a;
		return $elm$core$Result$Err(s);
	}
};
var $author$project$Analyser$Files$FileContent$loadedFileFromContent = function (fileContent) {
	var _v0 = fileContent.fv;
	if (!_v0.$) {
		var content = _v0.a;
		return $author$project$Result$Extra$merge(
			A2(
				$elm$core$Result$mapError,
				$elm$core$Result$Err,
				A2(
					$elm$core$Result$map,
					$elm$core$Result$Ok,
					$stil4m$elm_syntax$Elm$Parser$parse(content))));
	} else {
		return $elm$core$Result$Err(
			_List_fromArray(
				[
					{
					dV: 0,
					eD: $elm$parser$Parser$Problem('No file content'),
					C: 0
				}
				]));
	}
};
var $elm_community$maybe_extra$Maybe$Extra$orElseLazy = F2(
	function (fma, mb) {
		if (mb.$ === 1) {
			return fma(0);
		} else {
			return mb;
		}
	});
var $author$project$Analyser$Files$FileContent$asRawFile = function (fileContent) {
	return A2(
		$elm$core$Maybe$withDefault,
		_Utils_Tuple2(
			$elm$core$Result$Err(
				_List_fromArray(
					[
						{
						dV: 0,
						eD: $elm$parser$Parser$Problem('Internal problem in the file loader. Please report an issue.'),
						C: 0
					}
					])),
			false),
		A2(
			$elm_community$maybe_extra$Maybe$Extra$orElseLazy,
			function (_v0) {
				return $elm$core$Maybe$Just(
					_Utils_Tuple2(
						$author$project$Analyser$Files$FileContent$loadedFileFromContent(fileContent),
						true));
			},
			A2(
				$elm$core$Maybe$map,
				function (x) {
					return _Utils_Tuple2(
						$elm$core$Result$Ok(x),
						false);
				},
				A2(
					$elm$core$Maybe$andThen,
					A2(
						$elm$core$Basics$composeR,
						$elm$json$Json$Decode$decodeString($stil4m$elm_syntax$Elm$RawFile$decoder),
						$elm$core$Result$toMaybe),
					fileContent.fe))));
};
var $stil4m$elm_syntax$Elm$Interface$CustomType = function (a) {
	return {$: 1, a: a};
};
var $stil4m$elm_syntax$Elm$Interface$Function = function (a) {
	return {$: 0, a: a};
};
var $stil4m$elm_syntax$Elm$Interface$ifCustomType = F2(
	function (f, i) {
		if (i.$ === 1) {
			var t = i.a;
			return f(t);
		} else {
			return i;
		}
	});
var $stil4m$elm_syntax$Elm$Interface$lookupForDefinition = function (key) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$filter(
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Tuple$first,
				$elm$core$Basics$eq(key))),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$head,
			$elm$core$Maybe$map($elm$core$Tuple$second)));
};
var $stil4m$elm_syntax$Elm$Interface$buildInterfaceFromExplicit = F2(
	function (x, fileDefinitionList) {
		return A2(
			$elm$core$List$filterMap,
			function (_v0) {
				var expose = _v0.b;
				switch (expose.$) {
					case 0:
						var k = expose.a;
						return A2($stil4m$elm_syntax$Elm$Interface$lookupForDefinition, k, fileDefinitionList);
					case 2:
						var s = expose.a;
						return A2(
							$elm$core$Maybe$map,
							$stil4m$elm_syntax$Elm$Interface$ifCustomType(
								function (_v2) {
									var name = _v2.a;
									return $stil4m$elm_syntax$Elm$Interface$CustomType(
										_Utils_Tuple2(name, _List_Nil));
								}),
							A2($stil4m$elm_syntax$Elm$Interface$lookupForDefinition, s, fileDefinitionList));
					case 1:
						var s = expose.a;
						return $elm$core$Maybe$Just(
							$stil4m$elm_syntax$Elm$Interface$Function(s));
					default:
						var exposedType = expose.a;
						var _v3 = exposedType.ca;
						if (_v3.$ === 1) {
							return $elm$core$Maybe$Just(
								$stil4m$elm_syntax$Elm$Interface$CustomType(
									_Utils_Tuple2(exposedType.f8, _List_Nil)));
						} else {
							return A2($stil4m$elm_syntax$Elm$Interface$lookupForDefinition, exposedType.f8, fileDefinitionList);
						}
				}
			},
			x);
	});
var $stil4m$elm_syntax$Elm$Syntax$Module$exposingList = function (m) {
	switch (m.$) {
		case 0:
			var x = m.a;
			return $stil4m$elm_syntax$Elm$Syntax$Node$value(x.bI);
		case 1:
			var x = m.a;
			return $stil4m$elm_syntax$Elm$Syntax$Node$value(x.bI);
		default:
			var x = m.a;
			return $stil4m$elm_syntax$Elm$Syntax$Node$value(x.bI);
	}
};
var $stil4m$elm_syntax$Elm$Interface$Alias = function (a) {
	return {$: 2, a: a};
};
var $stil4m$elm_syntax$Elm$Interface$Operator = function (a) {
	return {$: 3, a: a};
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
var $elm_community$list_extra$List$Extra$unique = function (list) {
	return A4($elm_community$list_extra$List$Extra$uniqueHelp, $elm$core$Basics$identity, $elm$core$Set$empty, list, _List_Nil);
};
var $stil4m$elm_syntax$Elm$Interface$fileToDefinitions = function (file) {
	var getValidOperatorInterface = F2(
		function (t1, t2) {
			var _v6 = _Utils_Tuple2(t1, t2);
			if ((_v6.a.$ === 3) && (_v6.b.$ === 3)) {
				var x = _v6.a.a;
				var y = _v6.b.a;
				return (($stil4m$elm_syntax$Elm$Syntax$Node$value(x.eB) === 5) && (!$stil4m$elm_syntax$Elm$Syntax$Node$value(x.fE))) ? $elm$core$Maybe$Just(
					$stil4m$elm_syntax$Elm$Interface$Operator(y)) : $elm$core$Maybe$Just(
					$stil4m$elm_syntax$Elm$Interface$Operator(x));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		});
	var resolveGroup = function (g) {
		if (!g.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!g.b.b) {
				var x = g.a;
				return $elm$core$Maybe$Just(x);
			} else {
				if (!g.b.b.b) {
					var _v3 = g.a;
					var n1 = _v3.a;
					var t1 = _v3.b;
					var _v4 = g.b;
					var _v5 = _v4.a;
					var t2 = _v5.b;
					return A2(
						$elm$core$Maybe$map,
						function (a) {
							return _Utils_Tuple2(n1, a);
						},
						A2(getValidOperatorInterface, t1, t2));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	};
	var allDeclarations = A2(
		$elm$core$List$filterMap,
		function (_v0) {
			var decl = _v0.b;
			switch (decl.$) {
				case 2:
					var t = decl.a;
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							$stil4m$elm_syntax$Elm$Syntax$Node$value(t.f8),
							$stil4m$elm_syntax$Elm$Interface$CustomType(
								_Utils_Tuple2(
									$stil4m$elm_syntax$Elm$Syntax$Node$value(t.f8),
									A2(
										$elm$core$List$map,
										A2(
											$elm$core$Basics$composeR,
											$stil4m$elm_syntax$Elm$Syntax$Node$value,
											A2(
												$elm$core$Basics$composeR,
												function ($) {
													return $.f8;
												},
												$stil4m$elm_syntax$Elm$Syntax$Node$value)),
										t.fu)))));
				case 1:
					var a = decl.a;
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							$stil4m$elm_syntax$Elm$Syntax$Node$value(a.f8),
							$stil4m$elm_syntax$Elm$Interface$Alias(
								$stil4m$elm_syntax$Elm$Syntax$Node$value(a.f8))));
				case 3:
					var p = decl.a;
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							$stil4m$elm_syntax$Elm$Syntax$Node$value(p.f8),
							$stil4m$elm_syntax$Elm$Interface$Function(
								$stil4m$elm_syntax$Elm$Syntax$Node$value(p.f8))));
				case 0:
					var f = decl.a;
					var declaration = $stil4m$elm_syntax$Elm$Syntax$Node$value(f.fx);
					var name = $stil4m$elm_syntax$Elm$Syntax$Node$value(declaration.f8);
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							name,
							$stil4m$elm_syntax$Elm$Interface$Function(name)));
				case 4:
					var i = decl.a;
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							$stil4m$elm_syntax$Elm$Syntax$Node$value(i.gk),
							$stil4m$elm_syntax$Elm$Interface$Operator(i)));
				default:
					return $elm$core$Maybe$Nothing;
			}
		},
		file.dY);
	return A2(
		$elm$core$List$filterMap,
		A2($elm$core$Basics$composeR, $elm$core$Tuple$second, resolveGroup),
		A2(
			$elm$core$List$map,
			function (x) {
				return _Utils_Tuple2(
					x,
					A2(
						$elm$core$List$filter,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Tuple$first,
							$elm$core$Basics$eq(x)),
						allDeclarations));
			},
			$elm_community$list_extra$List$Extra$unique(
				A2($elm$core$List$map, $elm$core$Tuple$first, allDeclarations))));
};
var $stil4m$elm_syntax$Elm$Interface$build = function (_v0) {
	var file = _v0;
	var fileDefinitionList = $stil4m$elm_syntax$Elm$Interface$fileToDefinitions(file);
	var _v1 = $stil4m$elm_syntax$Elm$Syntax$Module$exposingList(
		$stil4m$elm_syntax$Elm$Syntax$Node$value(file.f6));
	if (_v1.$ === 1) {
		var x = _v1.a;
		return A2($stil4m$elm_syntax$Elm$Interface$buildInterfaceFromExplicit, x, fileDefinitionList);
	} else {
		return A2($elm$core$List$map, $elm$core$Tuple$second, fileDefinitionList);
	}
};
var $author$project$Analyser$DependencyHandler$loadedInterfaceForFile = function (file) {
	return {
		fe: file,
		fZ: $stil4m$elm_syntax$Elm$Interface$build(file),
		a_: $author$project$Analyser$FileContext$moduleName(file)
	};
};
var $author$project$Analyser$DependencyHandler$dependencyFileInterface = A2(
	$elm$core$Basics$composeR,
	$author$project$Analyser$Files$FileContent$asRawFile,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$Tuple$first,
		$elm$core$Result$map($author$project$Analyser$DependencyHandler$loadedInterfaceForFile)));
var $author$project$Result$Extra$isOk = function (r) {
	if (!r.$) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Analyser$DependencyHandler$onDependencyFiles = _Platform_incomingPort(
	'onDependencyFiles',
	A2(
		$elm$json$Json$Decode$andThen,
		function (files) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (dependency) {
					return $elm$json$Json$Decode$succeed(
						{y: dependency, cZ: files});
				},
				A2(
					$elm$json$Json$Decode$field,
					'dependency',
					A2(
						$elm$json$Json$Decode$andThen,
						function (version) {
							return A2(
								$elm$json$Json$Decode$andThen,
								function (name) {
									return $elm$json$Json$Decode$succeed(
										{f8: name, p: version});
								},
								A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string));
						},
						A2($elm$json$Json$Decode$field, 'version', $elm$json$Json$Decode$string))));
		},
		A2(
			$elm$json$Json$Decode$field,
			'files',
			$elm$json$Json$Decode$list(
				A2(
					$elm$json$Json$Decode$andThen,
					function (success) {
						return A2(
							$elm$json$Json$Decode$andThen,
							function (sha1) {
								return A2(
									$elm$json$Json$Decode$andThen,
									function (path) {
										return A2(
											$elm$json$Json$Decode$andThen,
											function (content) {
												return A2(
													$elm$json$Json$Decode$andThen,
													function (ast) {
														return $elm$json$Json$Decode$succeed(
															{fe: ast, fv: content, ci: path, gt: sha1, gB: success});
													},
													A2(
														$elm$json$Json$Decode$field,
														'ast',
														$elm$json$Json$Decode$oneOf(
															_List_fromArray(
																[
																	$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
																	A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $elm$json$Json$Decode$string)
																]))));
											},
											A2(
												$elm$json$Json$Decode$field,
												'content',
												$elm$json$Json$Decode$oneOf(
													_List_fromArray(
														[
															$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
															A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $elm$json$Json$Decode$string)
														]))));
									},
									A2($elm$json$Json$Decode$field, 'path', $elm$json$Json$Decode$string));
							},
							A2(
								$elm$json$Json$Decode$field,
								'sha1',
								$elm$json$Json$Decode$oneOf(
									_List_fromArray(
										[
											$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
											A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $elm$json$Json$Decode$string)
										]))));
					},
					A2($elm$json$Json$Decode$field, 'success', $elm$json$Json$Decode$bool))))));
var $author$project$Analyser$DependencyHandler$onLoadDependencyFilesFromDisk = function (dep) {
	var onRawFiles = function (_v0) {
		var dependency = _v0.y;
		var files = _v0.cZ;
		if (_Utils_eq(dep, dependency)) {
			var loadedFiles = A2($elm$core$List$map, $author$project$Analyser$DependencyHandler$dependencyFileInterface, files);
			return (!A2($elm$core$List$all, $author$project$Result$Extra$isOk, loadedFiles)) ? $elm$core$Maybe$Just(
				$elm$core$Result$Err('Could not load all dependency files')) : $elm$core$Maybe$Just(
				$elm$core$Result$Ok(
					A2($author$project$Analyser$DependencyHandler$buildDependency, dependency, loadedFiles)));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	return $author$project$Analyser$DependencyHandler$onDependencyFiles(onRawFiles);
};
var $elm$project_metadata_utils$Elm$Docs$Module = F6(
	function (name, comment, unions, aliases, values, binops) {
		return {e9: aliases, ff: binops, ao: comment, f8: name, gL: unions, gP: values};
	});
var $elm$project_metadata_utils$Elm$Docs$Alias = F4(
	function (name, comment, args, tipe) {
		return {fa: args, ao: comment, f8: name, a4: tipe};
	});
var $elm$parser$Parser$Forbidden = 0;
var $elm$project_metadata_utils$Elm$Type$Lambda = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$project_metadata_utils$Elm$Type$Record = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$project_metadata_utils$Elm$Type$Type = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$project_metadata_utils$Elm$Type$Var = function (a) {
	return {$: 0, a: a};
};
var $elm$project_metadata_utils$Elm$Type$arrow = $elm$parser$Parser$symbol('->');
var $elm$project_metadata_utils$Elm$Type$comma = $elm$parser$Parser$symbol(',');
var $elm$project_metadata_utils$Elm$Type$isInnerVarChar = function (_char) {
	return $elm$core$Char$isAlphaNum(_char) || (_char === '_');
};
var $elm$project_metadata_utils$Elm$Type$var = function (isFirst) {
	return $elm$parser$Parser$variable(
		{eh: $elm$project_metadata_utils$Elm$Type$isInnerVarChar, eL: $elm$core$Set$empty, J: isFirst});
};
var $elm$project_metadata_utils$Elm$Type$lowVar = $elm$project_metadata_utils$Elm$Type$var($elm$core$Char$isLower);
var $elm$project_metadata_utils$Elm$Type$spaces = $elm$parser$Parser$chompWhile(
	function (_char) {
		return _char === ' ';
	});
var $elm$project_metadata_utils$Elm$Type$extension = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed($elm$core$Maybe$Just),
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$backtrackable($elm$project_metadata_utils$Elm$Type$lowVar),
						$elm$parser$Parser$backtrackable($elm$project_metadata_utils$Elm$Type$spaces)),
					$elm$parser$Parser$symbol('|')),
				$elm$project_metadata_utils$Elm$Type$spaces)),
			$elm$parser$Parser$succeed($elm$core$Maybe$Nothing)
		]));
var $elm$project_metadata_utils$Elm$Type$capVar = $elm$project_metadata_utils$Elm$Type$var($elm$core$Char$isUpper);
var $elm$project_metadata_utils$Elm$Type$qualifiedCapVarHelp = function (_v0) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						$elm$parser$Parser$Loop(0)),
					$elm$parser$Parser$symbol('.')),
				$elm$project_metadata_utils$Elm$Type$capVar),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(0))
			]));
};
var $elm$project_metadata_utils$Elm$Type$qualifiedCapVar = $elm$parser$Parser$getChompedString(
	A2(
		$elm$parser$Parser$ignorer,
		$elm$project_metadata_utils$Elm$Type$capVar,
		A2($elm$parser$Parser$loop, 0, $elm$project_metadata_utils$Elm$Type$qualifiedCapVarHelp)));
var $elm$parser$Parser$Advanced$sequenceEndForbidden = F5(
	function (ender, ws, parseItem, sep, revItems) {
		var chompRest = function (item) {
			return A5(
				$elm$parser$Parser$Advanced$sequenceEndForbidden,
				ender,
				ws,
				parseItem,
				sep,
				A2($elm$core$List$cons, item, revItems));
		};
		return A2(
			$elm$parser$Parser$Advanced$skip,
			ws,
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$Advanced$skip,
						sep,
						A2(
							$elm$parser$Parser$Advanced$skip,
							ws,
							A2(
								$elm$parser$Parser$Advanced$map,
								function (item) {
									return $elm$parser$Parser$Advanced$Loop(
										A2($elm$core$List$cons, item, revItems));
								},
								parseItem))),
						A2(
						$elm$parser$Parser$Advanced$map,
						function (_v0) {
							return $elm$parser$Parser$Advanced$Done(
								$elm$core$List$reverse(revItems));
						},
						ender)
					])));
	});
var $elm$parser$Parser$Advanced$sequenceEndMandatory = F4(
	function (ws, parseItem, sep, revItems) {
		return $elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$Advanced$map,
					function (item) {
						return $elm$parser$Parser$Advanced$Loop(
							A2($elm$core$List$cons, item, revItems));
					},
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						parseItem,
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							ws,
							A2($elm$parser$Parser$Advanced$ignorer, sep, ws)))),
					A2(
					$elm$parser$Parser$Advanced$map,
					function (_v0) {
						return $elm$parser$Parser$Advanced$Done(
							$elm$core$List$reverse(revItems));
					},
					$elm$parser$Parser$Advanced$succeed(0))
				]));
	});
var $elm$parser$Parser$Advanced$sequenceEndOptional = F5(
	function (ender, ws, parseItem, sep, revItems) {
		var parseEnd = A2(
			$elm$parser$Parser$Advanced$map,
			function (_v0) {
				return $elm$parser$Parser$Advanced$Done(
					$elm$core$List$reverse(revItems));
			},
			ender);
		return A2(
			$elm$parser$Parser$Advanced$skip,
			ws,
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$Advanced$skip,
						sep,
						A2(
							$elm$parser$Parser$Advanced$skip,
							ws,
							$elm$parser$Parser$Advanced$oneOf(
								_List_fromArray(
									[
										A2(
										$elm$parser$Parser$Advanced$map,
										function (item) {
											return $elm$parser$Parser$Advanced$Loop(
												A2($elm$core$List$cons, item, revItems));
										},
										parseItem),
										parseEnd
									])))),
						parseEnd
					])));
	});
var $elm$parser$Parser$Advanced$sequenceEnd = F5(
	function (ender, ws, parseItem, sep, trailing) {
		var chompRest = function (item) {
			switch (trailing) {
				case 0:
					return A2(
						$elm$parser$Parser$Advanced$loop,
						_List_fromArray(
							[item]),
						A4($elm$parser$Parser$Advanced$sequenceEndForbidden, ender, ws, parseItem, sep));
				case 1:
					return A2(
						$elm$parser$Parser$Advanced$loop,
						_List_fromArray(
							[item]),
						A4($elm$parser$Parser$Advanced$sequenceEndOptional, ender, ws, parseItem, sep));
				default:
					return A2(
						$elm$parser$Parser$Advanced$ignorer,
						A2(
							$elm$parser$Parser$Advanced$skip,
							ws,
							A2(
								$elm$parser$Parser$Advanced$skip,
								sep,
								A2(
									$elm$parser$Parser$Advanced$skip,
									ws,
									A2(
										$elm$parser$Parser$Advanced$loop,
										_List_fromArray(
											[item]),
										A3($elm$parser$Parser$Advanced$sequenceEndMandatory, ws, parseItem, sep))))),
						ender);
			}
		};
		return $elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					A2($elm$parser$Parser$Advanced$andThen, chompRest, parseItem),
					A2(
					$elm$parser$Parser$Advanced$map,
					function (_v0) {
						return _List_Nil;
					},
					ender)
				]));
	});
var $elm$parser$Parser$Advanced$sequence = function (i) {
	return A2(
		$elm$parser$Parser$Advanced$skip,
		$elm$parser$Parser$Advanced$token(i.J),
		A2(
			$elm$parser$Parser$Advanced$skip,
			i.eR,
			A5(
				$elm$parser$Parser$Advanced$sequenceEnd,
				$elm$parser$Parser$Advanced$token(i.bH),
				i.eR,
				i.ek,
				$elm$parser$Parser$Advanced$token(i.eQ),
				i.e3)));
};
var $elm$parser$Parser$Advanced$Forbidden = 0;
var $elm$parser$Parser$Advanced$Mandatory = 2;
var $elm$parser$Parser$Advanced$Optional = 1;
var $elm$parser$Parser$toAdvancedTrailing = function (trailing) {
	switch (trailing) {
		case 0:
			return 0;
		case 1:
			return 1;
		default:
			return 2;
	}
};
var $elm$parser$Parser$sequence = function (i) {
	return $elm$parser$Parser$Advanced$sequence(
		{
			bH: $elm$parser$Parser$toToken(i.bH),
			ek: i.ek,
			eQ: $elm$parser$Parser$toToken(i.eQ),
			eR: i.eR,
			J: $elm$parser$Parser$toToken(i.J),
			e3: $elm$parser$Parser$toAdvancedTrailing(i.e3)
		});
};
var $elm$project_metadata_utils$Elm$Type$Tuple = function (a) {
	return {$: 2, a: a};
};
var $elm$project_metadata_utils$Elm$Type$tuplize = function (args) {
	if (args.b && (!args.b.b)) {
		var arg = args.a;
		return arg;
	} else {
		return $elm$project_metadata_utils$Elm$Type$Tuple(args);
	}
};
var $elm$project_metadata_utils$Elm$Type$chompArgs = function (revArgs) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$map,
				function (arg) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, arg, revArgs));
				},
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed($elm$core$Basics$identity),
						$elm$parser$Parser$backtrackable($elm$project_metadata_utils$Elm$Type$spaces)),
					$elm$project_metadata_utils$Elm$Type$cyclic$term())),
				A2(
				$elm$parser$Parser$map,
				function (_v2) {
					return $elm$parser$Parser$Done(
						$elm$core$List$reverse(revArgs));
				},
				$elm$parser$Parser$succeed(0))
			]));
};
var $elm$project_metadata_utils$Elm$Type$recordEndHelp = function (revFields) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(
							function (f) {
								return $elm$parser$Parser$Loop(
									A2($elm$core$List$cons, f, revFields));
							}),
						$elm$project_metadata_utils$Elm$Type$comma),
					$elm$project_metadata_utils$Elm$Type$spaces),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$project_metadata_utils$Elm$Type$cyclic$field(),
					$elm$project_metadata_utils$Elm$Type$spaces)),
				A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					function (_v1) {
						return $elm$parser$Parser$Done(
							$elm$core$List$reverse(revFields));
					}),
				$elm$parser$Parser$symbol('}'))
			]));
};
var $elm$project_metadata_utils$Elm$Type$tipeHelp = function (t) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$map,
				$elm$project_metadata_utils$Elm$Type$Lambda(t),
				$elm$project_metadata_utils$Elm$Type$cyclic$arrowAndType()),
				$elm$parser$Parser$succeed(t)
			]));
};
function $elm$project_metadata_utils$Elm$Type$cyclic$arrowAndType() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($elm$core$Basics$identity),
					$elm$parser$Parser$backtrackable($elm$project_metadata_utils$Elm$Type$spaces)),
				$elm$project_metadata_utils$Elm$Type$arrow),
			$elm$project_metadata_utils$Elm$Type$spaces),
		$elm$project_metadata_utils$Elm$Type$cyclic$tipe());
}
function $elm$project_metadata_utils$Elm$Type$cyclic$tipeTerm() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2($elm$parser$Parser$map, $elm$project_metadata_utils$Elm$Type$Var, $elm$project_metadata_utils$Elm$Type$lowVar),
				A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					$elm$parser$Parser$succeed($elm$project_metadata_utils$Elm$Type$Type),
					$elm$project_metadata_utils$Elm$Type$qualifiedCapVar),
				A2($elm$parser$Parser$loop, _List_Nil, $elm$project_metadata_utils$Elm$Type$chompArgs)),
				$elm$project_metadata_utils$Elm$Type$cyclic$record(),
				$elm$project_metadata_utils$Elm$Type$cyclic$tuple()
			]));
}
function $elm$project_metadata_utils$Elm$Type$cyclic$term() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2($elm$parser$Parser$map, $elm$project_metadata_utils$Elm$Type$Var, $elm$project_metadata_utils$Elm$Type$lowVar),
				A2(
				$elm$parser$Parser$map,
				function (name) {
					return A2($elm$project_metadata_utils$Elm$Type$Type, name, _List_Nil);
				},
				$elm$project_metadata_utils$Elm$Type$qualifiedCapVar),
				$elm$project_metadata_utils$Elm$Type$cyclic$record(),
				$elm$project_metadata_utils$Elm$Type$cyclic$tuple()
			]));
}
function $elm$project_metadata_utils$Elm$Type$cyclic$record() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						F2(
							function (ext, fs) {
								return A2($elm$project_metadata_utils$Elm$Type$Record, fs, ext);
							})),
					$elm$parser$Parser$symbol('{')),
				$elm$project_metadata_utils$Elm$Type$spaces),
			$elm$project_metadata_utils$Elm$Type$extension),
		$elm$project_metadata_utils$Elm$Type$cyclic$recordEnd());
}
function $elm$project_metadata_utils$Elm$Type$cyclic$recordEnd() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$andThen,
				function (f) {
					return A2(
						$elm$parser$Parser$loop,
						_List_fromArray(
							[f]),
						$elm$project_metadata_utils$Elm$Type$recordEndHelp);
				},
				A2(
					$elm$parser$Parser$ignorer,
					$elm$project_metadata_utils$Elm$Type$cyclic$field(),
					$elm$project_metadata_utils$Elm$Type$spaces)),
				A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(_List_Nil),
				$elm$parser$Parser$symbol('}'))
			]));
}
function $elm$project_metadata_utils$Elm$Type$cyclic$field() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed($elm$core$Tuple$pair),
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					A2($elm$parser$Parser$ignorer, $elm$project_metadata_utils$Elm$Type$lowVar, $elm$project_metadata_utils$Elm$Type$spaces),
					$elm$parser$Parser$symbol(':')),
				$elm$project_metadata_utils$Elm$Type$spaces)),
		$elm$project_metadata_utils$Elm$Type$cyclic$tipe());
}
function $elm$project_metadata_utils$Elm$Type$cyclic$tuple() {
	return A2(
		$elm$parser$Parser$map,
		$elm$project_metadata_utils$Elm$Type$tuplize,
		$elm$parser$Parser$sequence(
			{
				bH: ')',
				ek: $elm$project_metadata_utils$Elm$Type$cyclic$tipe(),
				eQ: ',',
				eR: $elm$project_metadata_utils$Elm$Type$spaces,
				J: '(',
				e3: 0
			}));
}
function $elm$project_metadata_utils$Elm$Type$cyclic$tipe() {
	return $elm$parser$Parser$lazy(
		function (_v0) {
			return A2(
				$elm$parser$Parser$andThen,
				$elm$project_metadata_utils$Elm$Type$tipeHelp,
				$elm$project_metadata_utils$Elm$Type$cyclic$tipeTerm());
		});
}
var $elm$project_metadata_utils$Elm$Type$arrowAndType = $elm$project_metadata_utils$Elm$Type$cyclic$arrowAndType();
$elm$project_metadata_utils$Elm$Type$cyclic$arrowAndType = function () {
	return $elm$project_metadata_utils$Elm$Type$arrowAndType;
};
var $elm$project_metadata_utils$Elm$Type$tipeTerm = $elm$project_metadata_utils$Elm$Type$cyclic$tipeTerm();
$elm$project_metadata_utils$Elm$Type$cyclic$tipeTerm = function () {
	return $elm$project_metadata_utils$Elm$Type$tipeTerm;
};
var $elm$project_metadata_utils$Elm$Type$term = $elm$project_metadata_utils$Elm$Type$cyclic$term();
$elm$project_metadata_utils$Elm$Type$cyclic$term = function () {
	return $elm$project_metadata_utils$Elm$Type$term;
};
var $elm$project_metadata_utils$Elm$Type$record = $elm$project_metadata_utils$Elm$Type$cyclic$record();
$elm$project_metadata_utils$Elm$Type$cyclic$record = function () {
	return $elm$project_metadata_utils$Elm$Type$record;
};
var $elm$project_metadata_utils$Elm$Type$recordEnd = $elm$project_metadata_utils$Elm$Type$cyclic$recordEnd();
$elm$project_metadata_utils$Elm$Type$cyclic$recordEnd = function () {
	return $elm$project_metadata_utils$Elm$Type$recordEnd;
};
var $elm$project_metadata_utils$Elm$Type$field = $elm$project_metadata_utils$Elm$Type$cyclic$field();
$elm$project_metadata_utils$Elm$Type$cyclic$field = function () {
	return $elm$project_metadata_utils$Elm$Type$field;
};
var $elm$project_metadata_utils$Elm$Type$tuple = $elm$project_metadata_utils$Elm$Type$cyclic$tuple();
$elm$project_metadata_utils$Elm$Type$cyclic$tuple = function () {
	return $elm$project_metadata_utils$Elm$Type$tuple;
};
var $elm$project_metadata_utils$Elm$Type$tipe = $elm$project_metadata_utils$Elm$Type$cyclic$tipe();
$elm$project_metadata_utils$Elm$Type$cyclic$tipe = function () {
	return $elm$project_metadata_utils$Elm$Type$tipe;
};
var $elm$project_metadata_utils$Elm$Type$parse = function (source) {
	return A2($elm$parser$Parser$run, $elm$project_metadata_utils$Elm$Type$tipe, source);
};
var $elm$project_metadata_utils$Elm$Type$decoderHelp = function (string) {
	var _v0 = $elm$project_metadata_utils$Elm$Type$parse(string);
	if (_v0.$ === 1) {
		var error = _v0.a;
		return $elm$json$Json$Decode$fail('TODO');
	} else {
		var actualType = _v0.a;
		return $elm$json$Json$Decode$succeed(actualType);
	}
};
var $elm$project_metadata_utils$Elm$Type$decoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$Type$decoderHelp, $elm$json$Json$Decode$string);
var $elm$project_metadata_utils$Elm$Docs$aliasDecoder = A5(
	$elm$json$Json$Decode$map4,
	$elm$project_metadata_utils$Elm$Docs$Alias,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'comment', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'args',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2($elm$json$Json$Decode$field, 'type', $elm$project_metadata_utils$Elm$Type$decoder));
var $elm$project_metadata_utils$Elm$Docs$Binop = F5(
	function (name, comment, tipe, associativity, precedence) {
		return {fd: associativity, ao: comment, f8: name, eB: precedence, a4: tipe};
	});
var $elm$project_metadata_utils$Elm$Docs$Left = 0;
var $elm$project_metadata_utils$Elm$Docs$None = 1;
var $elm$project_metadata_utils$Elm$Docs$Right = 2;
var $elm$project_metadata_utils$Elm$Docs$toAssoc = function (str) {
	switch (str) {
		case 'left':
			return $elm$json$Json$Decode$succeed(0);
		case 'non':
			return $elm$json$Json$Decode$succeed(1);
		case 'right':
			return $elm$json$Json$Decode$succeed(2);
		default:
			return $elm$json$Json$Decode$fail('expecting one of the following values: left, non, right');
	}
};
var $elm$project_metadata_utils$Elm$Docs$assocDecoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$Docs$toAssoc, $elm$json$Json$Decode$string);
var $elm$json$Json$Decode$map5 = _Json_map5;
var $elm$project_metadata_utils$Elm$Docs$binopDecoder = A6(
	$elm$json$Json$Decode$map5,
	$elm$project_metadata_utils$Elm$Docs$Binop,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'comment', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'type', $elm$project_metadata_utils$Elm$Type$decoder),
	A2($elm$json$Json$Decode$field, 'associativity', $elm$project_metadata_utils$Elm$Docs$assocDecoder),
	A2($elm$json$Json$Decode$field, 'precedence', $elm$json$Json$Decode$int));
var $elm$project_metadata_utils$Elm$Docs$Union = F4(
	function (name, comment, args, tags) {
		return {fa: args, ao: comment, f8: name, gE: tags};
	});
var $elm$project_metadata_utils$Elm$Docs$tagDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$index, 0, $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$index,
		1,
		$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Type$decoder)));
var $elm$project_metadata_utils$Elm$Docs$unionDecoder = A5(
	$elm$json$Json$Decode$map4,
	$elm$project_metadata_utils$Elm$Docs$Union,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'comment', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'args',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'cases',
		$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Docs$tagDecoder)));
var $elm$project_metadata_utils$Elm$Docs$Value = F3(
	function (name, comment, tipe) {
		return {ao: comment, f8: name, a4: tipe};
	});
var $elm$project_metadata_utils$Elm$Docs$valueDecoder = A4(
	$elm$json$Json$Decode$map3,
	$elm$project_metadata_utils$Elm$Docs$Value,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'comment', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'type', $elm$project_metadata_utils$Elm$Type$decoder));
var $elm$project_metadata_utils$Elm$Docs$decoder = A7(
	$elm$json$Json$Decode$map6,
	$elm$project_metadata_utils$Elm$Docs$Module,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'comment', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'unions',
		$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Docs$unionDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'aliases',
		$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Docs$aliasDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'values',
		$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Docs$valueDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'binops',
		$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Docs$binopDecoder)));
var $author$project$Analyser$DependencyHandler$binopToOperator = function (binOp) {
	return {
		fE: A2(
			$stil4m$elm_syntax$Elm$Syntax$Node$Node,
			$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
			function () {
				var _v0 = binOp.fd;
				switch (_v0) {
					case 0:
						return 0;
					case 2:
						return 1;
					default:
						return 0;
				}
			}()),
		fO: A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, $stil4m$elm_syntax$Elm$Syntax$Range$emptyRange, binOp.f8),
		gk: A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, $stil4m$elm_syntax$Elm$Syntax$Range$emptyRange, binOp.f8),
		eB: A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, $stil4m$elm_syntax$Elm$Syntax$Range$emptyRange, binOp.eB)
	};
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
var $author$project$Analyser$DependencyHandler$interfaceFromDocumentation = function (doc) {
	return _Utils_Tuple2(
		A2($elm$core$String$split, '.', doc.f8),
		$elm$core$List$concat(
			_List_fromArray(
				[
					A2(
					$elm$core$List$map,
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.f8;
						},
						$stil4m$elm_syntax$Elm$Interface$Alias),
					doc.e9),
					A2(
					$elm$core$List$map,
					function (t) {
						return $stil4m$elm_syntax$Elm$Interface$CustomType(
							_Utils_Tuple2(
								t.f8,
								A2($elm$core$List$map, $elm$core$Tuple$first, t.gE)));
					},
					doc.gL),
					A2(
					$elm$core$List$map,
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.f8;
						},
						$stil4m$elm_syntax$Elm$Interface$Function),
					doc.gP),
					A2(
					$elm$core$List$map,
					function (v) {
						return $stil4m$elm_syntax$Elm$Interface$Operator(
							$author$project$Analyser$DependencyHandler$binopToOperator(v));
					},
					doc.ff)
				])));
};
var $author$project$Analyser$DependencyHandler$depFromModules = F2(
	function (_v0, docs) {
		var name = _v0.f8;
		var version = _v0.p;
		return {
			f_: $elm$core$Dict$fromList(
				A2($elm$core$List$map, $author$project$Analyser$DependencyHandler$interfaceFromDocumentation, docs)),
			f8: name,
			p: version
		};
	});
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Analyser$DependencyHandler$onHttpDocumentation = _Platform_incomingPort(
	'onHttpDocumentation',
	A2(
		$elm$json$Json$Decode$andThen,
		function (json) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (dependency) {
					return $elm$json$Json$Decode$succeed(
						{y: dependency, ay: json});
				},
				A2(
					$elm$json$Json$Decode$field,
					'dependency',
					A2(
						$elm$json$Json$Decode$andThen,
						function (version) {
							return A2(
								$elm$json$Json$Decode$andThen,
								function (name) {
									return $elm$json$Json$Decode$succeed(
										{f8: name, p: version});
								},
								A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string));
						},
						A2($elm$json$Json$Decode$field, 'version', $elm$json$Json$Decode$string))));
		},
		A2($elm$json$Json$Decode$field, 'json', $elm$json$Json$Decode$value)));
var $author$project$Analyser$DependencyHandler$onOnlineDocumentation = function (dep) {
	return $author$project$Analyser$DependencyHandler$onHttpDocumentation(
		function (_v0) {
			var dependency = _v0.y;
			var json = _v0.ay;
			return _Utils_eq(dependency, dep) ? $elm$core$Maybe$Just(
				A2(
					$elm$core$Result$map,
					$author$project$Analyser$DependencyHandler$depFromModules(dep),
					A2(
						$elm$json$Json$Decode$decodeValue,
						$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Docs$decoder),
						json))) : $elm$core$Maybe$Nothing;
		});
};
var $author$project$Analyser$DependencyHandler$Failed = {$: 1};
var $author$project$Analyser$DependencyHandler$Ignore = {$: 0};
var $author$project$Analyser$DependencyHandler$Success = function (a) {
	return {$: 2, a: a};
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
					if (!_v1.$) {
						var m = _v1.a;
						return A2($elm$json$Json$Decode$field, 'value', m.b);
					} else {
						return $elm$json$Json$Decode$fail('No decoder for type: ' + t);
					}
				},
				A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
		});
};
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
var $author$project$Analyser$Files$Json$deserialiseDependencyValue = A2(
	$elm$core$Basics$composeR,
	$elm$json$Json$Decode$decodeValue($author$project$Analyser$Files$Json$decodeDependency),
	$elm$core$Result$toMaybe);
var $author$project$Analyser$DependencyHandler$onRawDependency = _Platform_incomingPort(
	'onRawDependency',
	A2(
		$elm$json$Json$Decode$andThen,
		function (json) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (dependency) {
					return $elm$json$Json$Decode$succeed(
						{y: dependency, ay: json});
				},
				A2(
					$elm$json$Json$Decode$field,
					'dependency',
					A2(
						$elm$json$Json$Decode$andThen,
						function (version) {
							return A2(
								$elm$json$Json$Decode$andThen,
								function (name) {
									return $elm$json$Json$Decode$succeed(
										{f8: name, p: version});
								},
								A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string));
						},
						A2($elm$json$Json$Decode$field, 'version', $elm$json$Json$Decode$string))));
		},
		A2($elm$json$Json$Decode$field, 'json', $elm$json$Json$Decode$value)));
var $author$project$Analyser$DependencyHandler$onReadFromDisk = function (_v0) {
	var name = _v0.f8;
	var version = _v0.p;
	return $author$project$Analyser$DependencyHandler$onRawDependency(
		function (_v1) {
			var dependency = _v1.y;
			var json = _v1.ay;
			if (_Utils_eq(dependency.f8, name) && _Utils_eq(version, dependency.p)) {
				var _v2 = $author$project$Analyser$Files$Json$deserialiseDependencyValue(json);
				if (_v2.$ === 1) {
					return $author$project$Analyser$DependencyHandler$Failed;
				} else {
					var d = _v2.a;
					return $author$project$Analyser$DependencyHandler$Success(d);
				}
			} else {
				return $author$project$Analyser$DependencyHandler$Ignore;
			}
		});
};
var $author$project$Analyser$Files$DependencyLoader$subscriptions = function (model) {
	var _v0 = model.k;
	switch (_v0.$) {
		case 0:
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Analyser$Files$DependencyLoader$OnCacheRead,
				$author$project$Analyser$DependencyHandler$onReadFromDisk(model.y));
		case 3:
			return $elm$core$Platform$Sub$none;
		case 4:
			return $elm$core$Platform$Sub$none;
		case 1:
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Analyser$Files$DependencyLoader$OnOnlineDocs,
				$author$project$Analyser$DependencyHandler$onOnlineDocumentation(model.y));
		default:
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Analyser$Files$DependencyLoader$OnLocallyBuildDependency,
				$author$project$Analyser$DependencyHandler$onLoadDependencyFilesFromDisk(model.y));
	}
};
var $author$project$Analyser$DependencyLoadingStage$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		A2(
			$elm$core$List$map,
			function (_v0) {
				var name = _v0.a;
				var l = _v0.b;
				return A2(
					$elm$core$Platform$Sub$map,
					$author$project$Analyser$DependencyLoadingStage$DependencyLoaderMsg(name),
					$author$project$Analyser$Files$DependencyLoader$subscriptions(l));
			},
			$elm$core$Dict$toList(model)));
};
var $author$project$Analyser$Fixer$LoadedFileContent = function (a) {
	return {$: 0, a: a};
};
var $author$project$Analyser$Fixer$Stored = function (a) {
	return {$: 1, a: a};
};
var $author$project$Analyser$Fixer$onFileContentWithShas = _Platform_incomingPort(
	'onFileContentWithShas',
	A2(
		$elm$json$Json$Decode$andThen,
		function (file) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (content) {
					return $elm$json$Json$Decode$succeed(
						{fv: content, d5: file});
				},
				A2($elm$json$Json$Decode$field, 'content', $elm$json$Json$Decode$string));
		},
		A2(
			$elm$json$Json$Decode$field,
			'file',
			A2(
				$elm$json$Json$Decode$andThen,
				function (version) {
					return A2(
						$elm$json$Json$Decode$andThen,
						function (path) {
							return $elm$json$Json$Decode$succeed(
								{ci: path, p: version});
						},
						A2($elm$json$Json$Decode$field, 'path', $elm$json$Json$Decode$string));
				},
				A2($elm$json$Json$Decode$field, 'version', $elm$json$Json$Decode$string)))));
var $author$project$Analyser$Fixer$onStoredFiles = _Platform_incomingPort('onStoredFiles', $elm$json$Json$Decode$bool);
var $author$project$Analyser$Fixer$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$Analyser$Fixer$onFileContentWithShas($author$project$Analyser$Fixer$LoadedFileContent),
				$author$project$Analyser$Fixer$onStoredFiles($author$project$Analyser$Fixer$Stored)
			]));
};
var $author$project$Analyser$SourceLoadingStage$FileLoaderMsg = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Analyser$Files$FileLoader$OnFileContent = $elm$core$Basics$identity;
var $author$project$Analyser$Files$FileLoader$fileContent = _Platform_incomingPort(
	'fileContent',
	A2(
		$elm$json$Json$Decode$andThen,
		function (success) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (sha1) {
					return A2(
						$elm$json$Json$Decode$andThen,
						function (path) {
							return A2(
								$elm$json$Json$Decode$andThen,
								function (content) {
									return A2(
										$elm$json$Json$Decode$andThen,
										function (ast) {
											return $elm$json$Json$Decode$succeed(
												{fe: ast, fv: content, ci: path, gt: sha1, gB: success});
										},
										A2(
											$elm$json$Json$Decode$field,
											'ast',
											$elm$json$Json$Decode$oneOf(
												_List_fromArray(
													[
														$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
														A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $elm$json$Json$Decode$string)
													]))));
								},
								A2(
									$elm$json$Json$Decode$field,
									'content',
									$elm$json$Json$Decode$oneOf(
										_List_fromArray(
											[
												$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
												A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $elm$json$Json$Decode$string)
											]))));
						},
						A2($elm$json$Json$Decode$field, 'path', $elm$json$Json$Decode$string));
				},
				A2(
					$elm$json$Json$Decode$field,
					'sha1',
					$elm$json$Json$Decode$oneOf(
						_List_fromArray(
							[
								$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
								A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $elm$json$Json$Decode$string)
							]))));
		},
		A2($elm$json$Json$Decode$field, 'success', $elm$json$Json$Decode$bool)));
var $author$project$Analyser$Files$FileLoader$subscriptions = $author$project$Analyser$Files$FileLoader$fileContent($elm$core$Basics$identity);
var $author$project$Analyser$SourceLoadingStage$subscriptions = function (_v0) {
	var model = _v0;
	return $elm$core$Platform$Sub$batch(
		A2(
			$elm$core$List$map,
			function (n) {
				return A2(
					$elm$core$Platform$Sub$map,
					$author$project$Analyser$SourceLoadingStage$FileLoaderMsg(n),
					$author$project$Analyser$Files$FileLoader$subscriptions);
			},
			$elm$core$Set$toList(model.L)));
};
var $author$project$Analyser$FileWatch$Remove = function (a) {
	return {$: 1, a: a};
};
var $author$project$Analyser$FileWatch$Update = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Analyser$FileWatch$asFileContent = F2(
	function (p, content) {
		return {
			fe: $elm$core$Maybe$Nothing,
			fv: $elm$core$Maybe$Just(content),
			ci: p.d5,
			gt: $elm$core$Maybe$Nothing,
			gB: true
		};
	});
var $author$project$Analyser$FileWatch$asFileChange = function (p) {
	var _v0 = p.cX;
	switch (_v0) {
		case 'update':
			return $elm$core$Maybe$Just(
				A2(
					$author$project$Analyser$FileWatch$Update,
					p.d5,
					A2(
						$elm$core$Maybe$map,
						$author$project$Analyser$FileWatch$asFileContent(p),
						p.fv)));
		case 'remove':
			return $elm$core$Maybe$Just(
				$author$project$Analyser$FileWatch$Remove(p.d5));
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Analyser$FileWatch$fileWatch = _Platform_incomingPort(
	'fileWatch',
	A2(
		$elm$json$Json$Decode$andThen,
		function (file) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (event) {
					return A2(
						$elm$json$Json$Decode$andThen,
						function (content) {
							return $elm$json$Json$Decode$succeed(
								{fv: content, cX: event, d5: file});
						},
						A2(
							$elm$json$Json$Decode$field,
							'content',
							$elm$json$Json$Decode$oneOf(
								_List_fromArray(
									[
										$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
										A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $elm$json$Json$Decode$string)
									]))));
				},
				A2($elm$json$Json$Decode$field, 'event', $elm$json$Json$Decode$string));
		},
		A2($elm$json$Json$Decode$field, 'file', $elm$json$Json$Decode$string)));
var $author$project$Analyser$FileWatch$watcher = function (f) {
	return $author$project$Analyser$FileWatch$fileWatch(
		A2($elm$core$Basics$composeR, $author$project$Analyser$FileWatch$asFileChange, f));
};
var $author$project$Analyser$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$AnalyserPorts$onReset(
				$elm$core$Basics$always($author$project$Analyser$Reset)),
				model.T ? A2(
				$elm$time$Time$every,
				1000,
				$elm$core$Basics$always($author$project$Analyser$ReloadTick)) : $elm$core$Platform$Sub$none,
				$author$project$Analyser$FileWatch$watcher($author$project$Analyser$Change),
				$author$project$AnalyserPorts$onFixMessage($author$project$Analyser$OnFixMessage),
				$author$project$AnalyserPorts$onFixQuick($author$project$Analyser$OnQuickFixMessage),
				function () {
				var _v0 = model.j;
				switch (_v0.$) {
					case 0:
						return $author$project$Analyser$ContextLoader$onLoadedContext($author$project$Analyser$OnContext);
					case 1:
						var stage = _v0.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Analyser$DependencyLoadingStageMsg,
							$author$project$Analyser$DependencyLoadingStage$subscriptions(stage));
					case 2:
						var stage = _v0.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Analyser$SourceLoadingStageMsg,
							$author$project$Analyser$SourceLoadingStage$subscriptions(stage));
					case 4:
						return $elm$core$Platform$Sub$none;
					default:
						var stage = _v0.a;
						return A2(
							$elm$core$Platform$Sub$map,
							$author$project$Analyser$FixerMsg,
							$author$project$Analyser$Fixer$subscriptions(stage));
				}
			}()
			]));
};
var $author$project$Analyser$DependencyLoadingStage = function (a) {
	return {$: 1, a: a};
};
var $author$project$Analyser$State$addFixToQueue = F2(
	function (m, s) {
		return _Utils_update(
			s,
			{
				ag: _Utils_ap(
					s.ag,
					_List_fromArray(
						[m]))
			});
	});
var $author$project$Analyser$State$Dependencies$Package = 0;
var $stil4m$elm_syntax$Elm$Processing$entryFromRawFile = function (rawFile) {
	return _Utils_Tuple2(
		$stil4m$elm_syntax$Elm$RawFile$moduleName(rawFile),
		$stil4m$elm_syntax$Elm$Interface$build(rawFile));
};
var $stil4m$elm_syntax$Elm$Processing$addFile = F2(
	function (file, _v0) {
		var x = _v0;
		var _v1 = $stil4m$elm_syntax$Elm$Processing$entryFromRawFile(file);
		var k = _v1.a;
		var v = _v1.b;
		return A3($elm$core$Dict$insert, k, v, x);
	});
var $author$project$Analyser$CodeBase$mergeLoadedSourceFiles = F2(
	function (newItems, dict) {
		return A3(
			$elm$core$List$foldl,
			function (sourceFile) {
				return A2($elm$core$Dict$insert, sourceFile.a.ci, sourceFile);
			},
			dict,
			newItems);
	});
var $author$project$Analyser$CodeBase$addSourceFiles = F2(
	function (sources, _v0) {
		var codeBase = _v0;
		return _Utils_update(
			codeBase,
			{
				aD: A3(
					$elm$core$List$foldl,
					$stil4m$elm_syntax$Elm$Processing$addFile,
					codeBase.aD,
					A2(
						$elm$core$List$filterMap,
						A2($elm$core$Basics$composeR, $elm$core$Tuple$second, $elm$core$Result$toMaybe),
						sources)),
				a3: A2($author$project$Analyser$CodeBase$mergeLoadedSourceFiles, sources, codeBase.a3)
			});
	});
var $stil4m$elm_syntax$Elm$Processing$expressionOperators = function (_v0) {
	var expression = _v0.b;
	if (expression.$ === 6) {
		var s = expression.a;
		return $elm$core$Maybe$Just(s);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm_community$list_extra$List$Extra$takeWhile = function (predicate) {
	var takeWhileMemo = F2(
		function (memo, list) {
			takeWhileMemo:
			while (true) {
				if (!list.b) {
					return $elm$core$List$reverse(memo);
				} else {
					var x = list.a;
					var xs = list.b;
					if (predicate(x)) {
						var $temp$memo = A2($elm$core$List$cons, x, memo),
							$temp$list = xs;
						memo = $temp$memo;
						list = $temp$list;
						continue takeWhileMemo;
					} else {
						return $elm$core$List$reverse(memo);
					}
				}
			}
		});
	return takeWhileMemo(_List_Nil);
};
var $stil4m$elm_syntax$Elm$Processing$findNextSplit = F2(
	function (dict, exps) {
		var prefix = A2(
			$elm_community$list_extra$List$Extra$takeWhile,
			function (x) {
				return _Utils_eq(
					$elm$core$Maybe$Nothing,
					A2(
						$elm$core$Maybe$andThen,
						function (key) {
							return A2($elm$core$Dict$get, key, dict);
						},
						$stil4m$elm_syntax$Elm$Processing$expressionOperators(x)));
			},
			exps);
		var suffix = A2(
			$elm$core$List$drop,
			$elm$core$List$length(prefix) + 1,
			exps);
		return A2(
			$elm$core$Maybe$map,
			function (x) {
				return _Utils_Tuple3(prefix, x, suffix);
			},
			A2(
				$elm$core$Maybe$andThen,
				function (x) {
					return A2($elm$core$Dict$get, x, dict);
				},
				A2(
					$elm$core$Maybe$andThen,
					$stil4m$elm_syntax$Elm$Processing$expressionOperators,
					$elm$core$List$head(
						A2(
							$elm$core$List$drop,
							$elm$core$List$length(prefix),
							exps)))));
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $stil4m$elm_syntax$Elm$Processing$highestPrecedence = function (input) {
	var maxi = $elm$core$List$maximum(
		A2(
			$elm$core$List$map,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Tuple$second,
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.eB;
					},
					$stil4m$elm_syntax$Elm$Syntax$Node$value)),
			input));
	return $elm$core$Dict$fromList(
		A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				function (m) {
					return A2(
						$elm$core$List$filter,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Tuple$second,
							A2(
								$elm$core$Basics$composeR,
								function ($) {
									return $.eB;
								},
								A2(
									$elm$core$Basics$composeR,
									$stil4m$elm_syntax$Elm$Syntax$Node$value,
									$elm$core$Basics$eq(m)))),
						input);
				},
				maxi)));
};
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === -2) {
		return true;
	} else {
		return false;
	}
};
var $stil4m$elm_syntax$Elm$Processing$fixApplication = F2(
	function (operators, expressions) {
		var ops = $stil4m$elm_syntax$Elm$Processing$highestPrecedence(
			A2(
				$elm$core$List$map,
				function (x) {
					return _Utils_Tuple2(
						x,
						A2(
							$elm$core$Maybe$withDefault,
							{
								fE: A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, $stil4m$elm_syntax$Elm$Syntax$Range$emptyRange, 0),
								fO: A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, $stil4m$elm_syntax$Elm$Syntax$Range$emptyRange, 'todo'),
								gk: A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, $stil4m$elm_syntax$Elm$Syntax$Range$emptyRange, x),
								eB: A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, $stil4m$elm_syntax$Elm$Syntax$Range$emptyRange, 5)
							},
							A2($elm$core$Dict$get, x, operators)));
				},
				A2($elm$core$List$filterMap, $stil4m$elm_syntax$Elm$Processing$expressionOperators, expressions)));
		var fixExprs = function (exps) {
			if (exps.b && (!exps.b.b)) {
				var _v2 = exps.a;
				var x = _v2.b;
				return x;
			} else {
				return $stil4m$elm_syntax$Elm$Syntax$Expression$Application(exps);
			}
		};
		var divideAndConquer = function (exps) {
			return $elm$core$Dict$isEmpty(ops) ? fixExprs(exps) : A2(
				$elm$core$Maybe$withDefault,
				fixExprs(exps),
				A2(
					$elm$core$Maybe$map,
					function (_v0) {
						var p = _v0.a;
						var infix = _v0.b;
						var s = _v0.c;
						return A4(
							$stil4m$elm_syntax$Elm$Syntax$Expression$OperatorApplication,
							$stil4m$elm_syntax$Elm$Syntax$Node$value(infix.gk),
							$stil4m$elm_syntax$Elm$Syntax$Node$value(infix.fE),
							A2(
								$stil4m$elm_syntax$Elm$Syntax$Node$Node,
								$stil4m$elm_syntax$Elm$Syntax$Range$combine(
									A2($elm$core$List$map, $stil4m$elm_syntax$Elm$Syntax$Node$range, p)),
								divideAndConquer(p)),
							A2(
								$stil4m$elm_syntax$Elm$Syntax$Node$Node,
								$stil4m$elm_syntax$Elm$Syntax$Range$combine(
									A2($elm$core$List$map, $stil4m$elm_syntax$Elm$Syntax$Node$range, s)),
								divideAndConquer(s)));
					},
					A2($stil4m$elm_syntax$Elm$Processing$findNextSplit, ops, exps)));
		};
		return divideAndConquer(expressions);
	});
var $stil4m$elm_syntax$Elm$Inspector$Post = function (a) {
	return {$: 3, a: a};
};
var $stil4m$elm_syntax$Elm$Inspector$Continue = {$: 1};
var $stil4m$elm_syntax$Elm$Inspector$defaultConfig = {c8: $stil4m$elm_syntax$Elm$Inspector$Continue, c9: $stil4m$elm_syntax$Elm$Inspector$Continue, da: $stil4m$elm_syntax$Elm$Inspector$Continue, db: $stil4m$elm_syntax$Elm$Inspector$Continue, dc: $stil4m$elm_syntax$Elm$Inspector$Continue, dd: $stil4m$elm_syntax$Elm$Inspector$Continue, df: $stil4m$elm_syntax$Elm$Inspector$Continue, dg: $stil4m$elm_syntax$Elm$Inspector$Continue, dh: $stil4m$elm_syntax$Elm$Inspector$Continue, di: $stil4m$elm_syntax$Elm$Inspector$Continue, dj: $stil4m$elm_syntax$Elm$Inspector$Continue, dk: $stil4m$elm_syntax$Elm$Inspector$Continue, dm: $stil4m$elm_syntax$Elm$Inspector$Continue, dn: $stil4m$elm_syntax$Elm$Inspector$Continue, $7: $stil4m$elm_syntax$Elm$Inspector$Continue, dp: $stil4m$elm_syntax$Elm$Inspector$Continue, dq: $stil4m$elm_syntax$Elm$Inspector$Continue, dr: $stil4m$elm_syntax$Elm$Inspector$Continue};
var $stil4m$elm_syntax$Elm$Inspector$actionLambda = function (act) {
	switch (act.$) {
		case 0:
			return F3(
				function (_v1, _v2, c) {
					return c;
				});
		case 1:
			return F3(
				function (f, _v3, c) {
					return f(c);
				});
		case 2:
			var g = act.a;
			return F3(
				function (f, x, c) {
					return f(
						A2(g, x, c));
				});
		case 3:
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
var $stil4m$elm_syntax$Elm$Inspector$inspectTypeAnnotation = F3(
	function (config, typeAnnotation, context) {
		return A4(
			$stil4m$elm_syntax$Elm$Inspector$actionLambda,
			config.dr,
			A2($stil4m$elm_syntax$Elm$Inspector$inspectTypeAnnotationInner, config, typeAnnotation),
			typeAnnotation,
			context);
	});
var $stil4m$elm_syntax$Elm$Inspector$inspectTypeAnnotationInner = F3(
	function (config, _v0, context) {
		var typeRefence = _v0.b;
		switch (typeRefence.$) {
			case 1:
				var typeArgs = typeRefence.b;
				return A3(
					$elm$core$List$foldl,
					$stil4m$elm_syntax$Elm$Inspector$inspectTypeAnnotation(config),
					context,
					typeArgs);
			case 3:
				var typeAnnotations = typeRefence.a;
				return A3(
					$elm$core$List$foldl,
					$stil4m$elm_syntax$Elm$Inspector$inspectTypeAnnotation(config),
					context,
					typeAnnotations);
			case 4:
				var recordDefinition = typeRefence.a;
				return A3(
					$elm$core$List$foldl,
					$stil4m$elm_syntax$Elm$Inspector$inspectTypeAnnotation(config),
					context,
					A2(
						$elm$core$List$map,
						A2($elm$core$Basics$composeR, $stil4m$elm_syntax$Elm$Syntax$Node$value, $elm$core$Tuple$second),
						recordDefinition));
			case 5:
				var recordDefinition = typeRefence.b;
				return A3(
					$elm$core$List$foldl,
					$stil4m$elm_syntax$Elm$Inspector$inspectTypeAnnotation(config),
					context,
					A2(
						$elm$core$List$map,
						A2($elm$core$Basics$composeR, $stil4m$elm_syntax$Elm$Syntax$Node$value, $elm$core$Tuple$second),
						$stil4m$elm_syntax$Elm$Syntax$Node$value(recordDefinition)));
			case 6:
				var left = typeRefence.a;
				var right = typeRefence.b;
				return A3(
					$elm$core$List$foldl,
					$stil4m$elm_syntax$Elm$Inspector$inspectTypeAnnotation(config),
					context,
					_List_fromArray(
						[left, right]));
			case 2:
				return context;
			default:
				return context;
		}
	});
var $stil4m$elm_syntax$Elm$Inspector$inspectSignature = F3(
	function (config, node, context) {
		var signature = node.b;
		return A4(
			$stil4m$elm_syntax$Elm$Inspector$actionLambda,
			config.$7,
			A2($stil4m$elm_syntax$Elm$Inspector$inspectTypeAnnotation, config, signature.gI),
			node,
			context);
	});
var $stil4m$elm_syntax$Elm$Inspector$inspectCase = F3(
	function (config, caze, context) {
		return A4(
			$stil4m$elm_syntax$Elm$Inspector$actionLambda,
			config.c8,
			A2($stil4m$elm_syntax$Elm$Inspector$inspectExpression, config, caze.b),
			caze,
			context);
	});
var $stil4m$elm_syntax$Elm$Inspector$inspectDestructuring = F3(
	function (config, destructuring, context) {
		return A4(
			$stil4m$elm_syntax$Elm$Inspector$actionLambda,
			config.c9,
			function (c) {
				return A3(
					$stil4m$elm_syntax$Elm$Inspector$inspectExpression,
					config,
					$stil4m$elm_syntax$Elm$Syntax$Node$value(destructuring).b,
					c);
			},
			destructuring,
			context);
	});
var $stil4m$elm_syntax$Elm$Inspector$inspectExpression = F3(
	function (config, node, context) {
		var expression = node.b;
		return A4(
			$stil4m$elm_syntax$Elm$Inspector$actionLambda,
			config.da,
			A2($stil4m$elm_syntax$Elm$Inspector$inspectInnerExpression, config, expression),
			node,
			context);
	});
var $stil4m$elm_syntax$Elm$Inspector$inspectFunction = F3(
	function (config, node, context) {
		var _function = node.b;
		return A4(
			$stil4m$elm_syntax$Elm$Inspector$actionLambda,
			config.dc,
			A2(
				$elm$core$Basics$composeR,
				A2(
					$stil4m$elm_syntax$Elm$Inspector$inspectExpression,
					config,
					$stil4m$elm_syntax$Elm$Syntax$Node$value(_function.fx).bJ),
				A2(
					$elm$core$Maybe$withDefault,
					$elm$core$Basics$identity,
					A2(
						$elm$core$Maybe$map,
						$stil4m$elm_syntax$Elm$Inspector$inspectSignature(config),
						_function.gu))),
			node,
			context);
	});
var $stil4m$elm_syntax$Elm$Inspector$inspectInnerExpression = F3(
	function (config, expression, context) {
		switch (expression.$) {
			case 0:
				return context;
			case 3:
				var moduleName = expression.a;
				var functionOrVal = expression.b;
				return A4(
					$stil4m$elm_syntax$Elm$Inspector$actionLambda,
					config.dd,
					$elm$core$Basics$identity,
					_Utils_Tuple2(moduleName, functionOrVal),
					context);
			case 5:
				return context;
			case 6:
				return context;
			case 8:
				return context;
			case 7:
				return context;
			case 9:
				return context;
			case 10:
				var x = expression.a;
				return A3($stil4m$elm_syntax$Elm$Inspector$inspectExpression, config, x, context);
			case 11:
				return context;
			case 12:
				return context;
			case 20:
				var ex1 = expression.a;
				var key = expression.b;
				return A4(
					$stil4m$elm_syntax$Elm$Inspector$actionLambda,
					config.dm,
					A2($stil4m$elm_syntax$Elm$Inspector$inspectExpression, config, ex1),
					_Utils_Tuple2(ex1, key),
					context);
			case 21:
				return context;
			case 23:
				return context;
			case 1:
				var expressionList = expression.a;
				return A3(
					$elm$core$List$foldl,
					$stil4m$elm_syntax$Elm$Inspector$inspectExpression(config),
					context,
					expressionList);
			case 2:
				var op = expression.a;
				var dir = expression.b;
				var left = expression.c;
				var right = expression.d;
				return A4(
					$stil4m$elm_syntax$Elm$Inspector$actionLambda,
					config.dj,
					function (base) {
						return A3(
							$elm$core$List$foldl,
							$stil4m$elm_syntax$Elm$Inspector$inspectExpression(config),
							base,
							_List_fromArray(
								[left, right]));
					},
					{fE: dir, f1: left, gk: op, gq: right},
					context);
			case 4:
				var e1 = expression.a;
				var e2 = expression.b;
				var e3 = expression.c;
				return A3(
					$elm$core$List$foldl,
					$stil4m$elm_syntax$Elm$Inspector$inspectExpression(config),
					context,
					_List_fromArray(
						[e1, e2, e3]));
			case 13:
				var expressionList = expression.a;
				return A3(
					$elm$core$List$foldl,
					$stil4m$elm_syntax$Elm$Inspector$inspectExpression(config),
					context,
					expressionList);
			case 14:
				var inner = expression.a;
				return A3($stil4m$elm_syntax$Elm$Inspector$inspectExpression, config, inner, context);
			case 15:
				var letBlock = expression.a;
				var next = A2(
					$elm$core$Basics$composeR,
					A2($stil4m$elm_syntax$Elm$Inspector$inspectLetDeclarations, config, letBlock.dY),
					A2($stil4m$elm_syntax$Elm$Inspector$inspectExpression, config, letBlock.bJ));
				return A4($stil4m$elm_syntax$Elm$Inspector$actionLambda, config.di, next, letBlock, context);
			case 16:
				var caseBlock = expression.a;
				var context2 = A3($stil4m$elm_syntax$Elm$Inspector$inspectExpression, config, caseBlock.bJ, context);
				var context3 = A3(
					$elm$core$List$foldl,
					F2(
						function (a, b) {
							return A3($stil4m$elm_syntax$Elm$Inspector$inspectCase, config, a, b);
						}),
					context2,
					caseBlock.fm);
				return context3;
			case 17:
				var lambda = expression.a;
				return A4(
					$stil4m$elm_syntax$Elm$Inspector$actionLambda,
					config.dh,
					A2($stil4m$elm_syntax$Elm$Inspector$inspectExpression, config, lambda.bJ),
					lambda,
					context);
			case 19:
				var expressionList = expression.a;
				return A3(
					$elm$core$List$foldl,
					$stil4m$elm_syntax$Elm$Inspector$inspectExpression(config),
					context,
					expressionList);
			case 18:
				var expressionStringList = expression.a;
				return A3(
					$elm$core$List$foldl,
					F2(
						function (a, b) {
							return A3(
								$stil4m$elm_syntax$Elm$Inspector$inspectExpression,
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
					$stil4m$elm_syntax$Elm$Inspector$actionLambda,
					config.dn,
					function (c) {
						return A3(
							$elm$core$List$foldl,
							F2(
								function (a, b) {
									return A3(
										$stil4m$elm_syntax$Elm$Inspector$inspectExpression,
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
var $stil4m$elm_syntax$Elm$Inspector$inspectLetDeclaration = F3(
	function (config, _v0, context) {
		var range = _v0.a;
		var declaration = _v0.b;
		if (!declaration.$) {
			var _function = declaration.a;
			return A3(
				$stil4m$elm_syntax$Elm$Inspector$inspectFunction,
				config,
				A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, range, _function),
				context);
		} else {
			var pattern = declaration.a;
			var expression = declaration.b;
			return A3(
				$stil4m$elm_syntax$Elm$Inspector$inspectDestructuring,
				config,
				A2(
					$stil4m$elm_syntax$Elm$Syntax$Node$Node,
					range,
					_Utils_Tuple2(pattern, expression)),
				context);
		}
	});
var $stil4m$elm_syntax$Elm$Inspector$inspectLetDeclarations = F3(
	function (config, declarations, context) {
		return A3(
			$elm$core$List$foldl,
			$stil4m$elm_syntax$Elm$Inspector$inspectLetDeclaration(config),
			context,
			declarations);
	});
var $stil4m$elm_syntax$Elm$Inspector$inspectPortDeclaration = F3(
	function (config, signature, context) {
		return A4(
			$stil4m$elm_syntax$Elm$Inspector$actionLambda,
			config.dk,
			A2($stil4m$elm_syntax$Elm$Inspector$inspectSignature, config, signature),
			signature,
			context);
	});
var $stil4m$elm_syntax$Elm$Inspector$inspectValueConstructor = F3(
	function (config, _v0, context) {
		var valueConstructor = _v0.b;
		return A3(
			$elm$core$List$foldl,
			$stil4m$elm_syntax$Elm$Inspector$inspectTypeAnnotation(config),
			context,
			valueConstructor.fc);
	});
var $stil4m$elm_syntax$Elm$Inspector$inspectTypeInner = F3(
	function (config, typeDecl, context) {
		return A3(
			$elm$core$List$foldl,
			$stil4m$elm_syntax$Elm$Inspector$inspectValueConstructor(config),
			context,
			typeDecl.fu);
	});
var $stil4m$elm_syntax$Elm$Inspector$inspectType = F3(
	function (config, tipe, context) {
		return A4(
			$stil4m$elm_syntax$Elm$Inspector$actionLambda,
			config.dp,
			A2(
				$stil4m$elm_syntax$Elm$Inspector$inspectTypeInner,
				config,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(tipe)),
			tipe,
			context);
	});
var $stil4m$elm_syntax$Elm$Inspector$inspectTypeAlias = F3(
	function (config, pair, context) {
		var typeAlias = pair.b;
		return A4(
			$stil4m$elm_syntax$Elm$Inspector$actionLambda,
			config.dq,
			A2($stil4m$elm_syntax$Elm$Inspector$inspectTypeAnnotation, config, typeAlias.gI),
			pair,
			context);
	});
var $stil4m$elm_syntax$Elm$Inspector$inspectDeclaration = F3(
	function (config, _v0, context) {
		var r = _v0.a;
		var declaration = _v0.b;
		switch (declaration.$) {
			case 0:
				var _function = declaration.a;
				return A3(
					$stil4m$elm_syntax$Elm$Inspector$inspectFunction,
					config,
					A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, _function),
					context);
			case 1:
				var typeAlias = declaration.a;
				return A3(
					$stil4m$elm_syntax$Elm$Inspector$inspectTypeAlias,
					config,
					A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, typeAlias),
					context);
			case 2:
				var typeDecl = declaration.a;
				return A3(
					$stil4m$elm_syntax$Elm$Inspector$inspectType,
					config,
					A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, typeDecl),
					context);
			case 3:
				var signature = declaration.a;
				return A3(
					$stil4m$elm_syntax$Elm$Inspector$inspectPortDeclaration,
					config,
					A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, signature),
					context);
			case 4:
				var inf = declaration.a;
				return A4(
					$stil4m$elm_syntax$Elm$Inspector$actionLambda,
					config.dg,
					$elm$core$Basics$identity,
					A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, inf),
					context);
			default:
				var pattern = declaration.a;
				var expresion = declaration.b;
				return A3(
					$stil4m$elm_syntax$Elm$Inspector$inspectDestructuring,
					config,
					A2(
						$stil4m$elm_syntax$Elm$Syntax$Node$Node,
						r,
						_Utils_Tuple2(pattern, expresion)),
					context);
		}
	});
var $stil4m$elm_syntax$Elm$Inspector$inspectDeclarations = F3(
	function (config, declarations, context) {
		return A3(
			$elm$core$List$foldl,
			$stil4m$elm_syntax$Elm$Inspector$inspectDeclaration(config),
			context,
			declarations);
	});
var $stil4m$elm_syntax$Elm$Inspector$inspectImport = F3(
	function (config, imp, context) {
		return A4($stil4m$elm_syntax$Elm$Inspector$actionLambda, config.df, $elm$core$Basics$identity, imp, context);
	});
var $stil4m$elm_syntax$Elm$Inspector$inspectImports = F3(
	function (config, imports, context) {
		return A3(
			$elm$core$List$foldl,
			$stil4m$elm_syntax$Elm$Inspector$inspectImport(config),
			context,
			imports);
	});
var $stil4m$elm_syntax$Elm$Inspector$inspect = F3(
	function (config, file, context) {
		return A4(
			$stil4m$elm_syntax$Elm$Inspector$actionLambda,
			config.db,
			A2(
				$elm$core$Basics$composeR,
				A2($stil4m$elm_syntax$Elm$Inspector$inspectImports, config, file.eg),
				A2($stil4m$elm_syntax$Elm$Inspector$inspectDeclarations, config, file.dY)),
			file,
			context);
	});
var $stil4m$elm_syntax$Elm$Processing$Documentation$isDocumentationForRange = F2(
	function (range, _v0) {
		var commentRange = _v0.a;
		var commentText = _v0.b;
		if (A2($elm$core$String$startsWith, '{-|', commentText)) {
			var functionStartRow = range.J.C;
			return _Utils_eq(commentRange.bH.C + 1, functionStartRow);
		} else {
			return false;
		}
	});
var $stil4m$elm_syntax$Elm$Processing$Documentation$replaceDeclaration = F2(
	function (_v0, _v1) {
		var r1 = _v0.a;
		var _new = _v0.b;
		var r2 = _v1.a;
		var old = _v1.b;
		return A2(
			$stil4m$elm_syntax$Elm$Syntax$Node$Node,
			r2,
			_Utils_eq(r1, r2) ? _new : old);
	});
var $stil4m$elm_syntax$Elm$Processing$Documentation$onFunction = F2(
	function (_v0, file) {
		var functionRange = _v0.a;
		var _function = _v0.b;
		var docs = A2(
			$elm$core$List$filter,
			$stil4m$elm_syntax$Elm$Processing$Documentation$isDocumentationForRange(functionRange),
			file.fs);
		var _v1 = $elm$core$List$head(docs);
		if (!_v1.$) {
			var doc = _v1.a;
			var docRange = doc.a;
			var docString = doc.b;
			return _Utils_update(
				file,
				{
					fs: A2(
						$elm$core$List$filter,
						$elm$core$Basics$neq(doc),
						file.fs),
					dY: A2(
						$elm$core$List$map,
						$stil4m$elm_syntax$Elm$Processing$Documentation$replaceDeclaration(
							A2(
								$stil4m$elm_syntax$Elm$Syntax$Node$Node,
								functionRange,
								$stil4m$elm_syntax$Elm$Syntax$Declaration$FunctionDeclaration(
									_Utils_update(
										_function,
										{
											fG: $elm$core$Maybe$Just(
												A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, docRange, docString))
										})))),
						file.dY)
				});
		} else {
			return file;
		}
	});
var $stil4m$elm_syntax$Elm$Processing$Documentation$onType = F2(
	function (_v0, file) {
		var r = _v0.a;
		var customType = _v0.b;
		var docs = A2(
			$elm$core$List$filter,
			$stil4m$elm_syntax$Elm$Processing$Documentation$isDocumentationForRange(r),
			file.fs);
		var _v1 = $elm$core$List$head(docs);
		if (!_v1.$) {
			var doc = _v1.a;
			var docRange = doc.a;
			var docString = doc.b;
			return _Utils_update(
				file,
				{
					fs: A2(
						$elm$core$List$filter,
						$elm$core$Basics$neq(doc),
						file.fs),
					dY: A2(
						$elm$core$List$map,
						$stil4m$elm_syntax$Elm$Processing$Documentation$replaceDeclaration(
							A2(
								$stil4m$elm_syntax$Elm$Syntax$Node$Node,
								r,
								$stil4m$elm_syntax$Elm$Syntax$Declaration$CustomTypeDeclaration(
									_Utils_update(
										customType,
										{
											fG: $elm$core$Maybe$Just(
												A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, docRange, docString))
										})))),
						file.dY)
				});
		} else {
			return file;
		}
	});
var $stil4m$elm_syntax$Elm$Processing$Documentation$onTypeAlias = F2(
	function (_v0, file) {
		var r = _v0.a;
		var typeAlias = _v0.b;
		var docs = A2(
			$elm$core$List$filter,
			$stil4m$elm_syntax$Elm$Processing$Documentation$isDocumentationForRange(r),
			file.fs);
		var _v1 = $elm$core$List$head(docs);
		if (!_v1.$) {
			var doc = _v1.a;
			var docRange = doc.a;
			var docString = doc.b;
			return _Utils_update(
				file,
				{
					fs: A2(
						$elm$core$List$filter,
						$elm$core$Basics$neq(doc),
						file.fs),
					dY: A2(
						$elm$core$List$map,
						$stil4m$elm_syntax$Elm$Processing$Documentation$replaceDeclaration(
							A2(
								$stil4m$elm_syntax$Elm$Syntax$Node$Node,
								r,
								$stil4m$elm_syntax$Elm$Syntax$Declaration$AliasDeclaration(
									_Utils_update(
										typeAlias,
										{
											fG: $elm$core$Maybe$Just(
												A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, docRange, docString))
										})))),
						file.dY)
				});
		} else {
			return file;
		}
	});
var $stil4m$elm_syntax$Elm$Processing$Documentation$postProcess = function (file) {
	return A3(
		$stil4m$elm_syntax$Elm$Inspector$inspect,
		_Utils_update(
			$stil4m$elm_syntax$Elm$Inspector$defaultConfig,
			{
				dc: $stil4m$elm_syntax$Elm$Inspector$Post($stil4m$elm_syntax$Elm$Processing$Documentation$onFunction),
				dp: $stil4m$elm_syntax$Elm$Inspector$Post($stil4m$elm_syntax$Elm$Processing$Documentation$onType),
				dq: $stil4m$elm_syntax$Elm$Inspector$Post($stil4m$elm_syntax$Elm$Processing$Documentation$onTypeAlias)
			}),
		file,
		file);
};
var $stil4m$elm_syntax$Elm$Interface$operators = $elm$core$List$filterMap(
	function (i) {
		if (i.$ === 3) {
			var o = i.a;
			return $elm$core$Maybe$Just(o);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $stil4m$elm_syntax$Elm$Syntax$Exposing$operator = function (t) {
	if (!t.$) {
		var s = t.a;
		return $elm$core$Maybe$Just(s);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $stil4m$elm_syntax$Elm$Syntax$Exposing$operators = function (l) {
	return A2($elm$core$List$filterMap, $stil4m$elm_syntax$Elm$Syntax$Exposing$operator, l);
};
var $stil4m$elm_syntax$Elm$Processing$buildSingle = F2(
	function (imp, moduleIndex) {
		var _v0 = imp.bI;
		if (_v0.$ === 1) {
			return _List_Nil;
		} else {
			if (!_v0.a.b.$) {
				var _v1 = _v0.a;
				return A2(
					$elm$core$List$map,
					function (x) {
						return _Utils_Tuple2(
							$stil4m$elm_syntax$Elm$Syntax$Node$value(x.gk),
							x);
					},
					$stil4m$elm_syntax$Elm$Interface$operators(
						A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							A2(
								$elm$core$Dict$get,
								$stil4m$elm_syntax$Elm$Syntax$Node$value(imp.a_),
								moduleIndex))));
			} else {
				var _v2 = _v0.a;
				var l = _v2.b.a;
				var selectedOperators = $stil4m$elm_syntax$Elm$Syntax$Exposing$operators(
					A2($elm$core$List$map, $stil4m$elm_syntax$Elm$Syntax$Node$value, l));
				return A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Tuple$first,
						function (elem) {
							return A2($elm$core$List$member, elem, selectedOperators);
						}),
					A2(
						$elm$core$List$map,
						function (x) {
							return _Utils_Tuple2(
								$stil4m$elm_syntax$Elm$Syntax$Node$value(x.gk),
								x);
						},
						$stil4m$elm_syntax$Elm$Interface$operators(
							A2(
								$elm$core$Maybe$withDefault,
								_List_Nil,
								A2(
									$elm$core$Dict$get,
									$stil4m$elm_syntax$Elm$Syntax$Node$value(imp.a_),
									moduleIndex)))));
			}
		}
	});
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $stil4m$elm_syntax$Elm$DefaultImports$defaults = _List_fromArray(
	[
		{
		bI: $elm$core$Maybe$Just(
			A2(
				$stil4m$elm_syntax$Elm$Syntax$Node$Node,
				$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
				$stil4m$elm_syntax$Elm$Syntax$Exposing$All($stil4m$elm_syntax$Elm$Syntax$Range$emptyRange))),
		et: $elm$core$Maybe$Nothing,
		a_: A2(
			$stil4m$elm_syntax$Elm$Syntax$Node$Node,
			$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
			_List_fromArray(
				['Basics']))
	},
		{
		bI: $elm$core$Maybe$Just(
			A2(
				$stil4m$elm_syntax$Elm$Syntax$Node$Node,
				$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
				$stil4m$elm_syntax$Elm$Syntax$Exposing$Explicit(
					_List_fromArray(
						[
							A2(
							$stil4m$elm_syntax$Elm$Syntax$Node$Node,
							$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
							$stil4m$elm_syntax$Elm$Syntax$Exposing$TypeExpose(
								A2($stil4m$elm_syntax$Elm$Syntax$Exposing$ExposedType, 'List', $elm$core$Maybe$Nothing))),
							A2(
							$stil4m$elm_syntax$Elm$Syntax$Node$Node,
							$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
							$stil4m$elm_syntax$Elm$Syntax$Exposing$InfixExpose('::'))
						])))),
		et: $elm$core$Maybe$Nothing,
		a_: A2(
			$stil4m$elm_syntax$Elm$Syntax$Node$Node,
			$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
			_List_fromArray(
				['List']))
	},
		{
		bI: $elm$core$Maybe$Just(
			A2(
				$stil4m$elm_syntax$Elm$Syntax$Node$Node,
				$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
				$stil4m$elm_syntax$Elm$Syntax$Exposing$Explicit(
					_List_fromArray(
						[
							A2(
							$stil4m$elm_syntax$Elm$Syntax$Node$Node,
							$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
							$stil4m$elm_syntax$Elm$Syntax$Exposing$TypeExpose(
								A2(
									$stil4m$elm_syntax$Elm$Syntax$Exposing$ExposedType,
									'Maybe',
									$elm$core$Maybe$Just($stil4m$elm_syntax$Elm$Syntax$Range$emptyRange))))
						])))),
		et: $elm$core$Maybe$Nothing,
		a_: A2(
			$stil4m$elm_syntax$Elm$Syntax$Node$Node,
			$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
			_List_fromArray(
				['Maybe']))
	},
		{
		bI: $elm$core$Maybe$Just(
			A2(
				$stil4m$elm_syntax$Elm$Syntax$Node$Node,
				$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
				$stil4m$elm_syntax$Elm$Syntax$Exposing$Explicit(
					_List_fromArray(
						[
							A2(
							$stil4m$elm_syntax$Elm$Syntax$Node$Node,
							$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
							$stil4m$elm_syntax$Elm$Syntax$Exposing$TypeExpose(
								A2(
									$stil4m$elm_syntax$Elm$Syntax$Exposing$ExposedType,
									'Result',
									$elm$core$Maybe$Just($stil4m$elm_syntax$Elm$Syntax$Range$emptyRange))))
						])))),
		et: $elm$core$Maybe$Nothing,
		a_: A2(
			$stil4m$elm_syntax$Elm$Syntax$Node$Node,
			$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
			_List_fromArray(
				['Result']))
	},
		{
		bI: $elm$core$Maybe$Nothing,
		et: $elm$core$Maybe$Nothing,
		a_: A2(
			$stil4m$elm_syntax$Elm$Syntax$Node$Node,
			$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
			_List_fromArray(
				['String']))
	},
		{
		bI: $elm$core$Maybe$Nothing,
		et: $elm$core$Maybe$Nothing,
		a_: A2(
			$stil4m$elm_syntax$Elm$Syntax$Node$Node,
			$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
			_List_fromArray(
				['Tuple']))
	},
		{
		bI: $elm$core$Maybe$Nothing,
		et: $elm$core$Maybe$Nothing,
		a_: A2(
			$stil4m$elm_syntax$Elm$Syntax$Node$Node,
			$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
			_List_fromArray(
				['Debug']))
	},
		{
		bI: $elm$core$Maybe$Just(
			A2(
				$stil4m$elm_syntax$Elm$Syntax$Node$Node,
				$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
				$stil4m$elm_syntax$Elm$Syntax$Exposing$Explicit(
					_List_fromArray(
						[
							A2(
							$stil4m$elm_syntax$Elm$Syntax$Node$Node,
							$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
							$stil4m$elm_syntax$Elm$Syntax$Exposing$TypeExpose(
								A2($stil4m$elm_syntax$Elm$Syntax$Exposing$ExposedType, 'Program', $elm$core$Maybe$Nothing)))
						])))),
		et: $elm$core$Maybe$Nothing,
		a_: A2(
			$stil4m$elm_syntax$Elm$Syntax$Node$Node,
			$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
			_List_fromArray(
				['Platform']))
	},
		{
		bI: $elm$core$Maybe$Just(
			A2(
				$stil4m$elm_syntax$Elm$Syntax$Node$Node,
				$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
				$stil4m$elm_syntax$Elm$Syntax$Exposing$Explicit(
					_List_fromArray(
						[
							A2(
							$stil4m$elm_syntax$Elm$Syntax$Node$Node,
							$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
							$stil4m$elm_syntax$Elm$Syntax$Exposing$TypeExpose(
								A2($stil4m$elm_syntax$Elm$Syntax$Exposing$ExposedType, 'Cmd', $elm$core$Maybe$Nothing))),
							A2(
							$stil4m$elm_syntax$Elm$Syntax$Node$Node,
							$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
							$stil4m$elm_syntax$Elm$Syntax$Exposing$InfixExpose('!'))
						])))),
		et: $elm$core$Maybe$Nothing,
		a_: A2(
			$stil4m$elm_syntax$Elm$Syntax$Node$Node,
			$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
			_List_fromArray(
				['Platform', 'Cmd']))
	},
		{
		bI: $elm$core$Maybe$Just(
			A2(
				$stil4m$elm_syntax$Elm$Syntax$Node$Node,
				$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
				$stil4m$elm_syntax$Elm$Syntax$Exposing$Explicit(
					_List_fromArray(
						[
							A2(
							$stil4m$elm_syntax$Elm$Syntax$Node$Node,
							$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
							$stil4m$elm_syntax$Elm$Syntax$Exposing$TypeExpose(
								A2($stil4m$elm_syntax$Elm$Syntax$Exposing$ExposedType, 'Sub', $elm$core$Maybe$Nothing)))
						])))),
		et: $elm$core$Maybe$Nothing,
		a_: A2(
			$stil4m$elm_syntax$Elm$Syntax$Node$Node,
			$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
			_List_fromArray(
				['Platform', 'Sub']))
	}
	]);
var $stil4m$elm_syntax$Elm$RawFile$imports = function (_v0) {
	var file = _v0;
	return A2($elm$core$List$map, $stil4m$elm_syntax$Elm$Syntax$Node$value, file.eg);
};
var $stil4m$elm_syntax$Elm$Processing$tableForFile = F2(
	function (rawFile, _v0) {
		var moduleIndex = _v0;
		return $elm$core$Dict$fromList(
			A2(
				$elm$core$List$concatMap,
				function (a) {
					return A2($stil4m$elm_syntax$Elm$Processing$buildSingle, a, moduleIndex);
				},
				_Utils_ap(
					$stil4m$elm_syntax$Elm$DefaultImports$defaults,
					$stil4m$elm_syntax$Elm$RawFile$imports(rawFile))));
	});
var $stil4m$elm_syntax$Elm$Syntax$Node$map = F2(
	function (f, _v0) {
		var r = _v0.a;
		var a = _v0.b;
		return A2(
			$stil4m$elm_syntax$Elm$Syntax$Node$Node,
			r,
			f(a));
	});
var $stil4m$elm_syntax$Elm$Processing$visitExpression = F3(
	function (visitor, context, expression) {
		var inner = A2($stil4m$elm_syntax$Elm$Processing$visitExpressionInner, visitor, context);
		return A3(
			A2(
				$elm$core$Maybe$withDefault,
				F3(
					function (_v4, nest, expr) {
						return nest(expr);
					}),
				visitor),
			context,
			inner,
			expression);
	});
var $stil4m$elm_syntax$Elm$Processing$visitExpressionInner = F3(
	function (visitor, context, _v2) {
		var range = _v2.a;
		var expression = _v2.b;
		var subVisit = A2($stil4m$elm_syntax$Elm$Processing$visitExpression, visitor, context);
		return function (newExpr) {
			return A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, range, newExpr);
		}(
			function () {
				switch (expression.$) {
					case 1:
						var expressionList = expression.a;
						return $stil4m$elm_syntax$Elm$Syntax$Expression$Application(
							A2($elm$core$List$map, subVisit, expressionList));
					case 2:
						var op = expression.a;
						var dir = expression.b;
						var left = expression.c;
						var right = expression.d;
						return A4(
							$stil4m$elm_syntax$Elm$Syntax$Expression$OperatorApplication,
							op,
							dir,
							subVisit(left),
							subVisit(right));
					case 4:
						var e1 = expression.a;
						var e2 = expression.b;
						var e3 = expression.c;
						return A3(
							$stil4m$elm_syntax$Elm$Syntax$Expression$IfBlock,
							subVisit(e1),
							subVisit(e2),
							subVisit(e3));
					case 13:
						var expressionList = expression.a;
						return $stil4m$elm_syntax$Elm$Syntax$Expression$TupledExpression(
							A2($elm$core$List$map, subVisit, expressionList));
					case 14:
						var expr1 = expression.a;
						return $stil4m$elm_syntax$Elm$Syntax$Expression$ParenthesizedExpression(
							subVisit(expr1));
					case 15:
						var letBlock = expression.a;
						return $stil4m$elm_syntax$Elm$Syntax$Expression$LetExpression(
							{
								dY: A3($stil4m$elm_syntax$Elm$Processing$visitLetDeclarations, visitor, context, letBlock.dY),
								bJ: subVisit(letBlock.bJ)
							});
					case 16:
						var caseBlock = expression.a;
						return $stil4m$elm_syntax$Elm$Syntax$Expression$CaseExpression(
							{
								fm: A2(
									$elm$core$List$map,
									$elm$core$Tuple$mapSecond(subVisit),
									caseBlock.fm),
								bJ: subVisit(caseBlock.bJ)
							});
					case 17:
						var lambda = expression.a;
						return $stil4m$elm_syntax$Elm$Syntax$Expression$LambdaExpression(
							_Utils_update(
								lambda,
								{
									bJ: subVisit(lambda.bJ)
								}));
					case 18:
						var expressionStringList = expression.a;
						return $stil4m$elm_syntax$Elm$Syntax$Expression$RecordExpr(
							A2(
								$elm$core$List$map,
								$stil4m$elm_syntax$Elm$Syntax$Node$map(
									$elm$core$Tuple$mapSecond(subVisit)),
								expressionStringList));
					case 19:
						var expressionList = expression.a;
						return $stil4m$elm_syntax$Elm$Syntax$Expression$ListExpr(
							A2($elm$core$List$map, subVisit, expressionList));
					case 22:
						var name = expression.a;
						var updates = expression.b;
						return A2(
							$stil4m$elm_syntax$Elm$Syntax$Expression$RecordUpdateExpression,
							name,
							A2(
								$elm$core$List$map,
								$stil4m$elm_syntax$Elm$Syntax$Node$map(
									$elm$core$Tuple$mapSecond(subVisit)),
								updates));
					default:
						return expression;
				}
			}());
	});
var $stil4m$elm_syntax$Elm$Processing$visitFunctionDecl = F3(
	function (visitor, context, _function) {
		var newFunctionDeclaration = A2(
			$stil4m$elm_syntax$Elm$Syntax$Node$map,
			A2($stil4m$elm_syntax$Elm$Processing$visitFunctionDeclaration, visitor, context),
			_function.fx);
		return _Utils_update(
			_function,
			{fx: newFunctionDeclaration});
	});
var $stil4m$elm_syntax$Elm$Processing$visitFunctionDeclaration = F3(
	function (visitor, context, functionDeclaration) {
		var newExpression = A3($stil4m$elm_syntax$Elm$Processing$visitExpression, visitor, context, functionDeclaration.bJ);
		return _Utils_update(
			functionDeclaration,
			{bJ: newExpression});
	});
var $stil4m$elm_syntax$Elm$Processing$visitLetDeclaration = F3(
	function (visitor, context, _v0) {
		var range = _v0.a;
		var declaration = _v0.b;
		return A2(
			$stil4m$elm_syntax$Elm$Syntax$Node$Node,
			range,
			function () {
				if (!declaration.$) {
					var _function = declaration.a;
					return $stil4m$elm_syntax$Elm$Syntax$Expression$LetFunction(
						A3($stil4m$elm_syntax$Elm$Processing$visitFunctionDecl, visitor, context, _function));
				} else {
					var pattern = declaration.a;
					var expression = declaration.b;
					return A2(
						$stil4m$elm_syntax$Elm$Syntax$Expression$LetDestructuring,
						pattern,
						A3($stil4m$elm_syntax$Elm$Processing$visitExpression, visitor, context, expression));
				}
			}());
	});
var $stil4m$elm_syntax$Elm$Processing$visitLetDeclarations = F3(
	function (visitor, context, declarations) {
		return A2(
			$elm$core$List$map,
			A2($stil4m$elm_syntax$Elm$Processing$visitLetDeclaration, visitor, context),
			declarations);
	});
var $stil4m$elm_syntax$Elm$Processing$visitDeclaration = F3(
	function (visitor, context, _v0) {
		var range = _v0.a;
		var declaration = _v0.b;
		return A2(
			$stil4m$elm_syntax$Elm$Syntax$Node$Node,
			range,
			function () {
				if (!declaration.$) {
					var _function = declaration.a;
					return $stil4m$elm_syntax$Elm$Syntax$Declaration$FunctionDeclaration(
						A3($stil4m$elm_syntax$Elm$Processing$visitFunctionDecl, visitor, context, _function));
				} else {
					return declaration;
				}
			}());
	});
var $stil4m$elm_syntax$Elm$Processing$visitDeclarations = F3(
	function (visitor, context, declarations) {
		return A2(
			$elm$core$List$map,
			A2($stil4m$elm_syntax$Elm$Processing$visitDeclaration, visitor, context),
			declarations);
	});
var $stil4m$elm_syntax$Elm$Processing$visit = F3(
	function (visitor, context, file) {
		var newDeclarations = A3($stil4m$elm_syntax$Elm$Processing$visitDeclarations, visitor, context, file.dY);
		return _Utils_update(
			file,
			{dY: newDeclarations});
	});
var $stil4m$elm_syntax$Elm$Processing$process = F2(
	function (processContext, rawFile) {
		var file = rawFile;
		var table = A2($stil4m$elm_syntax$Elm$Processing$tableForFile, rawFile, processContext);
		var operatorFixed = A3(
			$stil4m$elm_syntax$Elm$Processing$visit,
			$elm$core$Maybe$Just(
				F3(
					function (context, inner, expression) {
						return inner(
							function () {
								if (expression.b.$ === 1) {
									var r = expression.a;
									var args = expression.b.a;
									return A2(
										$stil4m$elm_syntax$Elm$Syntax$Node$Node,
										r,
										A2($stil4m$elm_syntax$Elm$Processing$fixApplication, context, args));
								} else {
									return expression;
								}
							}());
					})),
			table,
			file);
		var documentationFixed = $stil4m$elm_syntax$Elm$Processing$Documentation$postProcess(operatorFixed);
		return documentationFixed;
	});
var $author$project$Analyser$FileContext$buildForFile = F2(
	function (moduleIndex, _v0) {
		var fileContent = _v0.a;
		var r = _v0.b;
		if (r.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var l = r.a;
			return $elm$core$Maybe$Just(
				{
					fe: A2($stil4m$elm_syntax$Elm$Processing$process, moduleIndex, l),
					fv: A2($elm$core$Maybe$withDefault, '', fileContent.fv),
					d5: {
						ci: fileContent.ci,
						p: A2($elm$core$Maybe$withDefault, '', fileContent.gt)
					},
					fZ: $stil4m$elm_syntax$Elm$Interface$build(l),
					a_: $author$project$Analyser$FileContext$moduleName(l)
				});
		}
	});
var $author$project$Analyser$CodeBase$processContext = function (_v0) {
	var codeBase = _v0;
	return codeBase.aD;
};
var $author$project$Analyser$FileContext$build = F2(
	function (codeBase, selected) {
		var moduleIndex = $author$project$Analyser$CodeBase$processContext(codeBase);
		return A2(
			$elm$core$List$filterMap,
			$author$project$Analyser$FileContext$buildForFile(moduleIndex),
			selected);
	});
var $author$project$Analyser$CodeBase$dependencies = function (_v0) {
	var codeBase = _v0;
	return codeBase.fz;
};
var $author$project$Analyser$Checks$UnusedDependency$dependencyIncludesModule = F2(
	function (_v0, dependency) {
		var moduleName = _v0.b;
		return A2($elm$core$Dict$member, moduleName, dependency.f_);
	});
var $author$project$Analyser$Checks$UnusedDependency$markImport = F2(
	function (_v0, deps) {
		var moduleName = _v0.b.a_;
		return A2(
			$elm$core$List$filter,
			A2(
				$elm$core$Basics$composeL,
				$elm$core$Basics$not,
				$author$project$Analyser$Checks$UnusedDependency$dependencyIncludesModule(moduleName)),
			deps);
	});
var $author$project$Analyser$Checks$UnusedDependency$filterUsedDeps = F2(
	function (_v0, deps) {
		var ast = _v0.fe;
		return A3($elm$core$List$foldl, $author$project$Analyser$Checks$UnusedDependency$markImport, deps, ast.eg);
	});
var $author$project$Analyser$Checks$UnusedDependency$notElmLangCore = function (dep) {
	return dep.f8 !== 'elm/core';
};
var $author$project$Analyser$Checks$UnusedDependency$check = F2(
	function (codeBase, files) {
		return A2(
			$elm$core$List$filter,
			$author$project$Analyser$Checks$UnusedDependency$notElmLangCore,
			A3(
				$elm$core$List$foldl,
				$author$project$Analyser$Checks$UnusedDependency$filterUsedDeps,
				$author$project$Analyser$CodeBase$dependencies(codeBase),
				files));
	});
var $author$project$Analyser$Modules$edgesInFile = function (file) {
	return A2(
		$elm$core$List$map,
		function (b) {
			return _Utils_Tuple2(file.a_, b);
		},
		A2(
			$elm$core$List$map,
			$stil4m$elm_syntax$Elm$Syntax$Node$value,
			A2(
				$elm$core$List$map,
				function ($) {
					return $.a_;
				},
				A2($elm$core$List$map, $stil4m$elm_syntax$Elm$Syntax$Node$value, file.fe.eg))));
};
var $author$project$Analyser$Modules$build = F2(
	function (codeBase, sources) {
		var files = A2($author$project$Analyser$FileContext$build, codeBase, sources);
		return _Utils_Tuple2(
			A2($author$project$Analyser$Checks$UnusedDependency$check, codeBase, files),
			{
				fz: A2($elm$core$List$concatMap, $author$project$Analyser$Modules$edgesInFile, files),
				ck: A2(
					$elm$core$List$map,
					function ($) {
						return $.a_;
					},
					files)
			});
	});
var $author$project$Analyser$Messages$Types$Applicable = 3;
var $author$project$Analyser$State$Idle = 2;
var $author$project$Analyser$Messages$Util$messageFile = function (m) {
	return m.d5.ci;
};
var $author$project$Analyser$Messages$Util$compareMessageFile = F2(
	function (a, b) {
		return A2(
			$elm$core$Basics$compare,
			$author$project$Analyser$Messages$Util$messageFile(a),
			$author$project$Analyser$Messages$Util$messageFile(b));
	});
var $author$project$Analyser$Messages$Data$dataValueRanges = function (dv) {
	switch (dv.$) {
		case 0:
			var r = dv.a;
			return _List_fromArray(
				[r]);
		case 3:
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
var $author$project$Analyser$Messages$Data$firstRange = function (x) {
	return $elm$core$List$head(
		$author$project$Analyser$Messages$Data$getRanges(x));
};
var $author$project$Analyser$Messages$Util$firstRange = function (a) {
	return A2(
		$elm$core$Maybe$withDefault,
		$stil4m$elm_syntax$Elm$Syntax$Range$emptyRange,
		$author$project$Analyser$Messages$Data$firstRange(a.cU));
};
var $author$project$AST$Ranges$orderByStart = F2(
	function (r1, r2) {
		return (!_Utils_eq(r1.J.C, r2.J.C)) ? A2($elm$core$Basics$compare, r1.J.C, r2.J.C) : A2($elm$core$Basics$compare, r1.J.W, r2.J.W);
	});
var $author$project$Analyser$Messages$Util$compareMessageLocation = F2(
	function (a, b) {
		return A2(
			$author$project$AST$Ranges$orderByStart,
			$author$project$Analyser$Messages$Util$firstRange(a),
			$author$project$Analyser$Messages$Util$firstRange(b));
	});
var $elm_community$list_extra$List$Extra$groupWhile = F2(
	function (isSameGroup, items) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					if (!acc.b) {
						return _List_fromArray(
							[
								_Utils_Tuple2(x, _List_Nil)
							]);
					} else {
						var _v1 = acc.a;
						var y = _v1.a;
						var restOfGroup = _v1.b;
						var groups = acc.b;
						return A2(isSameGroup, x, y) ? A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								x,
								A2($elm$core$List$cons, y, restOfGroup)),
							groups) : A2(
							$elm$core$List$cons,
							_Utils_Tuple2(x, _List_Nil),
							acc);
					}
				}),
			_List_Nil,
			items);
	});
var $author$project$Analyser$State$sortMessages = function (state) {
	return _Utils_update(
		state,
		{
			es: A2(
				$elm$core$List$concatMap,
				function (_v0) {
					var a = _v0.a;
					var b = _v0.b;
					return A2(
						$elm$core$List$sortWith,
						$author$project$Analyser$Messages$Util$compareMessageLocation,
						A2($elm$core$List$cons, a, b));
				},
				A2(
					$elm_community$list_extra$List$Extra$groupWhile,
					F2(
						function (a, b) {
							return _Utils_eq(
								$author$project$Analyser$Messages$Util$messageFile(a),
								$author$project$Analyser$Messages$Util$messageFile(b));
						}),
					A2($elm$core$List$sortWith, $author$project$Analyser$Messages$Util$compareMessageFile, state.es)))
		});
};
var $author$project$Analyser$State$finishWithNewMessages = F2(
	function (messages, s) {
		var untouchedMessages = A2(
			$elm$core$List$filter,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.gy;
				},
				$elm$core$Basics$eq(3)),
			s.es);
		var messagesWithId = A2(
			$elm$core$List$indexedMap,
			F2(
				function (n, message) {
					return _Utils_update(
						message,
						{fU: n + s.at});
				}),
			messages);
		return $author$project$Analyser$State$sortMessages(
			_Utils_update(
				s,
				{
					at: s.at + $elm$core$List$length(messages),
					es: _Utils_ap(untouchedMessages, messagesWithId),
					gy: 2
				}));
	});
var $author$project$Analyser$FixerStage = function (a) {
	return {$: 3, a: a};
};
var $author$project$Analyser$State$getMessage = function (messageId) {
	return A2(
		$elm$core$Basics$composeR,
		function ($) {
			return $.es;
		},
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$filter(
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.fU;
					},
					$elm$core$Basics$eq(messageId))),
			$elm$core$List$head));
};
var $author$project$Analyser$Fixer$Model = $elm$core$Basics$identity;
var $author$project$Analyser$Fixes$Base$Fixer = F3(
	function (canFix, fix, description) {
		return {fk: canFix, fD: description, d6: fix};
	});
var $author$project$Analyser$Messages$Schema$Range = 0;
var $author$project$Analyser$Messages$Schema$Schema = $elm$core$Basics$identity;
var $author$project$Analyser$Messages$Schema$rangeProp = F2(
	function (k, _v0) {
		var s = _v0;
		return A3($elm$core$Dict$insert, k, 0, s);
	});
var $author$project$ASTUtil$Inspector$Post = function (a) {
	return {$: 3, a: a};
};
var $author$project$ASTUtil$Inspector$Continue = {$: 1};
var $author$project$ASTUtil$Inspector$defaultConfig = {c8: $author$project$ASTUtil$Inspector$Continue, c9: $author$project$ASTUtil$Inspector$Continue, da: $author$project$ASTUtil$Inspector$Continue, db: $author$project$ASTUtil$Inspector$Continue, dc: $author$project$ASTUtil$Inspector$Continue, dd: $author$project$ASTUtil$Inspector$Continue, de: $author$project$ASTUtil$Inspector$Continue, df: $author$project$ASTUtil$Inspector$Continue, dh: $author$project$ASTUtil$Inspector$Continue, di: $author$project$ASTUtil$Inspector$Continue, dj: $author$project$ASTUtil$Inspector$Continue, dk: $author$project$ASTUtil$Inspector$Continue, dl: $author$project$ASTUtil$Inspector$Continue, dm: $author$project$ASTUtil$Inspector$Continue, dn: $author$project$ASTUtil$Inspector$Continue, dp: $author$project$ASTUtil$Inspector$Continue, dq: $author$project$ASTUtil$Inspector$Continue, dr: $author$project$ASTUtil$Inspector$Continue};
var $author$project$ASTUtil$Inspector$actionLambda = function (act) {
	switch (act.$) {
		case 0:
			return F3(
				function (_v1, _v2, c) {
					return c;
				});
		case 1:
			return F3(
				function (f, _v3, c) {
					return f(c);
				});
		case 2:
			var g = act.a;
			return F3(
				function (f, x, c) {
					return f(
						A2(g, x, c));
				});
		case 3:
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
var $author$project$ASTUtil$Inspector$inspectTypeAnnotation = F3(
	function (config, typeAnnotation, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.dr,
			A2($author$project$ASTUtil$Inspector$inspectTypeAnnotationInner, config, typeAnnotation),
			typeAnnotation,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectTypeAnnotationInner = F3(
	function (config, _v0, context) {
		var typeRefence = _v0.b;
		switch (typeRefence.$) {
			case 1:
				var typeArgs = typeRefence.b;
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectTypeAnnotation(config),
					context,
					typeArgs);
			case 3:
				var typeAnnotations = typeRefence.a;
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectTypeAnnotation(config),
					context,
					typeAnnotations);
			case 4:
				var recordDefinition = typeRefence.a;
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectTypeAnnotation(config),
					context,
					A2(
						$elm$core$List$map,
						A2($elm$core$Basics$composeR, $stil4m$elm_syntax$Elm$Syntax$Node$value, $elm$core$Tuple$second),
						recordDefinition));
			case 5:
				var recordDefinition = typeRefence.b;
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectTypeAnnotation(config),
					context,
					A2(
						$elm$core$List$map,
						A2($elm$core$Basics$composeR, $stil4m$elm_syntax$Elm$Syntax$Node$value, $elm$core$Tuple$second),
						$stil4m$elm_syntax$Elm$Syntax$Node$value(recordDefinition)));
			case 6:
				var left = typeRefence.a;
				var right = typeRefence.b;
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectTypeAnnotation(config),
					context,
					_List_fromArray(
						[left, right]));
			case 2:
				return context;
			default:
				return context;
		}
	});
var $author$project$ASTUtil$Inspector$inspectSignature = F3(
	function (config, signature, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.de,
			A2(
				$author$project$ASTUtil$Inspector$inspectTypeAnnotation,
				config,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(signature).gI),
			signature,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectCase = F3(
	function (config, caze, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.c8,
			A2($author$project$ASTUtil$Inspector$inspectExpression, config, caze.b),
			caze,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectDestructuring = F3(
	function (config, destructuring, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.c9,
			A2($author$project$ASTUtil$Inspector$inspectExpression, config, destructuring.b),
			destructuring,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectExpression = F3(
	function (config, expression, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.da,
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
			config.dc,
			A2(
				$elm$core$Basics$composeR,
				A2(
					$author$project$ASTUtil$Inspector$inspectExpression,
					config,
					$stil4m$elm_syntax$Elm$Syntax$Node$value(_function.fx).bJ),
				A2(
					$elm$core$Maybe$withDefault,
					$elm$core$Basics$identity,
					A2(
						$elm$core$Maybe$map,
						$author$project$ASTUtil$Inspector$inspectSignature(config),
						_function.gu))),
			functionNode,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectInnerExpression = F3(
	function (config, expression, context) {
		switch (expression.$) {
			case 0:
				return context;
			case 3:
				var m = expression.a;
				var functionOrVal = expression.b;
				return A4(
					$author$project$ASTUtil$Inspector$actionLambda,
					config.dd,
					$elm$core$Basics$identity,
					_Utils_Tuple2(m, functionOrVal),
					context);
			case 5:
				var prefix = expression.a;
				return A4($author$project$ASTUtil$Inspector$actionLambda, config.dl, $elm$core$Basics$identity, prefix, context);
			case 6:
				return context;
			case 7:
				return context;
			case 8:
				return context;
			case 9:
				return context;
			case 10:
				var x = expression.a;
				return A3($author$project$ASTUtil$Inspector$inspectExpression, config, x, context);
			case 11:
				return context;
			case 12:
				return context;
			case 20:
				var ex1 = expression.a;
				var key = expression.b;
				return A4(
					$author$project$ASTUtil$Inspector$actionLambda,
					config.dm,
					A2($author$project$ASTUtil$Inspector$inspectExpression, config, ex1),
					_Utils_Tuple2(ex1, key),
					context);
			case 21:
				return context;
			case 23:
				return context;
			case 1:
				var expressionList = expression.a;
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectExpression(config),
					context,
					expressionList);
			case 2:
				var op = expression.a;
				var dir = expression.b;
				var left = expression.c;
				var right = expression.d;
				return A4(
					$author$project$ASTUtil$Inspector$actionLambda,
					config.dj,
					function (a) {
						return A3(
							$elm$core$List$foldl,
							$author$project$ASTUtil$Inspector$inspectExpression(config),
							a,
							_List_fromArray(
								[left, right]));
					},
					{fE: dir, f1: left, gk: op, gq: right},
					context);
			case 4:
				var e1 = expression.a;
				var e2 = expression.b;
				var e3 = expression.c;
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectExpression(config),
					context,
					_List_fromArray(
						[e1, e2, e3]));
			case 13:
				var expressionList = expression.a;
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectExpression(config),
					context,
					expressionList);
			case 14:
				var inner = expression.a;
				return A3($author$project$ASTUtil$Inspector$inspectExpression, config, inner, context);
			case 15:
				var letBlock = expression.a;
				var next = A2(
					$elm$core$Basics$composeR,
					A2($author$project$ASTUtil$Inspector$inspectLetDeclarations, config, letBlock.dY),
					A2($author$project$ASTUtil$Inspector$inspectExpression, config, letBlock.bJ));
				return A4($author$project$ASTUtil$Inspector$actionLambda, config.di, next, letBlock, context);
			case 16:
				var caseBlock = expression.a;
				var context2 = A3($author$project$ASTUtil$Inspector$inspectExpression, config, caseBlock.bJ, context);
				var context3 = A3(
					$elm$core$List$foldl,
					F2(
						function (a, b) {
							return A3($author$project$ASTUtil$Inspector$inspectCase, config, a, b);
						}),
					context2,
					caseBlock.fm);
				return context3;
			case 17:
				var lambda = expression.a;
				return A4(
					$author$project$ASTUtil$Inspector$actionLambda,
					config.dh,
					A2($author$project$ASTUtil$Inspector$inspectExpression, config, lambda.bJ),
					lambda,
					context);
			case 19:
				var expressionList = expression.a;
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectExpression(config),
					context,
					expressionList);
			case 18:
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
					config.dn,
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
		if (!declaration.$) {
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
			config.dk,
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
			valueConstructor.fc);
	});
var $author$project$ASTUtil$Inspector$inspectType = F3(
	function (config, typeDecl, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.dp,
			function (c) {
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectValueConstructor(config),
					c,
					typeDecl.fu);
			},
			typeDecl,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectTypeAlias = F3(
	function (config, typeAlias, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.dq,
			A2(
				$author$project$ASTUtil$Inspector$inspectTypeAnnotation,
				config,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(typeAlias).gI),
			typeAlias,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectDeclaration = F3(
	function (config, _v0, context) {
		var r = _v0.a;
		var declaration = _v0.b;
		switch (declaration.$) {
			case 0:
				var _function = declaration.a;
				return A3(
					$author$project$ASTUtil$Inspector$inspectFunction,
					config,
					A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, _function),
					context);
			case 1:
				var typeAlias = declaration.a;
				return A3(
					$author$project$ASTUtil$Inspector$inspectTypeAlias,
					config,
					A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, typeAlias),
					context);
			case 2:
				var typeDecl = declaration.a;
				return A3($author$project$ASTUtil$Inspector$inspectType, config, typeDecl, context);
			case 3:
				var signature = declaration.a;
				return A3(
					$author$project$ASTUtil$Inspector$inspectPortDeclaration,
					config,
					A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, signature),
					context);
			case 4:
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
		return A4($author$project$ASTUtil$Inspector$actionLambda, config.df, $elm$core$Basics$identity, imp, context);
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
			config.db,
			A2(
				$elm$core$Basics$composeR,
				A2($author$project$ASTUtil$Inspector$inspectImports, config, file.eg),
				A2($author$project$ASTUtil$Inspector$inspectDeclarations, config, file.dY)),
			file,
			context);
	});
var $author$project$Analyser$Messages$Data$MessageData = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Analyser$Messages$Data$RangeV = function (a) {
	return {$: 0, a: a};
};
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
var $author$project$Analyser$Messages$Data$init = function (desc) {
	return A2($author$project$Analyser$Messages$Data$MessageData, desc, $elm$core$Dict$empty);
};
var $author$project$AST$Ranges$locationToString = function (_v0) {
	var row = _v0.C;
	var column = _v0.W;
	return '(' + ($elm$core$String$fromInt(row) + (',' + ($elm$core$String$fromInt(column) + ')')));
};
var $author$project$AST$Ranges$rangeToString = function (_v0) {
	var start = _v0.J;
	var end = _v0.bH;
	return '(' + ($author$project$AST$Ranges$locationToString(start) + (',' + ($author$project$AST$Ranges$locationToString(end) + ')')));
};
var $author$project$Analyser$Checks$DropConsOfItemAndList$onExpression = F2(
	function (_v0, context) {
		var r = _v0.a;
		var inner = _v0.b;
		if (((inner.$ === 2) && (inner.a === '::')) && (inner.d.b.$ === 19)) {
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
					da: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$DropConsOfItemAndList$onExpression)
				}),
			fileContext.fe,
			_List_Nil);
	});
var $author$project$Analyser$Messages$Schema$schema = $elm$core$Dict$empty;
var $author$project$Analyser$Checks$DropConsOfItemAndList$checker = {
	fo: $author$project$Analyser$Checks$DropConsOfItemAndList$scan,
	fX: {
		fD: 'If you cons an item to a literal list (x :: [1, 2, 3]), then you can just put the item into the list.',
		f0: 'DropConsOfItemAndList',
		f8: 'Drop Cons Of Item And List',
		gs: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'tail',
			A2(
				$author$project$Analyser$Messages$Schema$rangeProp,
				'head',
				A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)))
	}
};
var $author$project$Analyser$Fixes$Base$IncompatibleData = {$: 0};
var $author$project$Analyser$Fixes$Base$Patched = function (a) {
	return {$: 1, a: a};
};
var $elm$core$String$append = _String_append;
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $author$project$Analyser$Fixes$FileContent$patchRange = function (rawRange) {
	return {
		bH: {W: rawRange.bH.W - 1, C: rawRange.bH.C - 1},
		J: {W: rawRange.J.W - 1, C: rawRange.J.C - 1}
	};
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Analyser$Fixes$FileContent$updateRange = F3(
	function (rawRange, patch, content) {
		var rows = A2($elm$core$String$split, '\n', content);
		var range = $author$project$Analyser$Fixes$FileContent$patchRange(rawRange);
		var rowPostPartTakeFn = $elm$core$String$dropLeft(range.bH.W);
		var rowPrePartTakeFn = $elm$core$String$left(range.J.W);
		var beforeRows = range.J.C;
		var linesBefore = A2($elm$core$List$take, beforeRows, rows);
		var rowPrePart = A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				rowPrePartTakeFn,
				$elm$core$List$head(
					A2($elm$core$List$drop, beforeRows, rows))));
		var newBefore = A2(
			$elm$core$String$join,
			'\n',
			_Utils_ap(
				linesBefore,
				_List_fromArray(
					[rowPrePart])));
		var afterRows = range.bH.C;
		var postRows = A2($elm$core$List$drop, afterRows + 1, rows);
		var rowPostPart = A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				rowPostPartTakeFn,
				$elm$core$List$head(
					A2($elm$core$List$drop, afterRows, rows))));
		var newAfter = A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$cons, rowPostPart, postRows));
		var toPatch = A2(
			$elm$core$String$dropRight,
			$elm$core$String$length(newAfter),
			A2(
				$elm$core$String$dropLeft,
				$elm$core$String$length(newBefore),
				content));
		return $elm$core$String$concat(
			_List_fromArray(
				[
					newBefore,
					patch(toPatch),
					newAfter
				]));
	});
var $author$project$Analyser$Fixes$FileContent$replaceRangeWith = F3(
	function (range, newValue, input) {
		return A3(
			$author$project$Analyser$Fixes$FileContent$updateRange,
			range,
			$elm$core$Basics$always(newValue),
			input);
	});
var $author$project$Analyser$Fixes$DropConsOfItemAndList$fixContent = F3(
	function (headRange, tailRange, content) {
		var middleRange = {bH: tailRange.J, J: headRange.bH};
		return A3(
			$author$project$Analyser$Fixes$FileContent$updateRange,
			headRange,
			$elm$core$String$append('[ '),
			A3(
				$author$project$Analyser$Fixes$FileContent$replaceRangeWith,
				middleRange,
				',',
				A3(
					$author$project$Analyser$Fixes$FileContent$updateRange,
					tailRange,
					$elm$core$String$dropLeft(1),
					content)));
	});
var $author$project$Analyser$Messages$Data$valueAsRange = function (dv) {
	if (!dv.$) {
		var v = dv.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Analyser$Messages$Data$getRange = F2(
	function (k, _v0) {
		var d = _v0.b;
		return A2(
			$elm$core$Maybe$andThen,
			$author$project$Analyser$Messages$Data$valueAsRange,
			A2($elm$core$Dict$get, k, d));
	});
var $author$project$Analyser$Fixes$DropConsOfItemAndList$fix = F2(
	function (_v0, messageData) {
		var content = _v0.a;
		var _v1 = A3(
			$elm$core$Maybe$map2,
			F2(
				function (a, b) {
					return _Utils_Tuple2(a, b);
				}),
			A2($author$project$Analyser$Messages$Data$getRange, 'head', messageData),
			A2($author$project$Analyser$Messages$Data$getRange, 'tail', messageData));
		if (!_v1.$) {
			var _v2 = _v1.a;
			var headRange = _v2.a;
			var tailRange = _v2.b;
			return $author$project$Analyser$Fixes$Base$Patched(
				A3($author$project$Analyser$Fixes$DropConsOfItemAndList$fixContent, headRange, tailRange, content));
		} else {
			return $author$project$Analyser$Fixes$Base$IncompatibleData;
		}
	});
var $author$project$Analyser$Fixes$DropConsOfItemAndList$fixer = A3($author$project$Analyser$Fixes$Base$Fixer, $author$project$Analyser$Checks$DropConsOfItemAndList$checker.fX.f0, $author$project$Analyser$Fixes$DropConsOfItemAndList$fix, 'Combine and format');
var $author$project$Analyser$Messages$Schema$ModuleName = 4;
var $author$project$Analyser$Messages$Schema$moduleProp = F2(
	function (k, _v0) {
		var s = _v0;
		return A3($elm$core$Dict$insert, k, 4, s);
	});
var $author$project$Analyser$Messages$Schema$RangeList = 3;
var $author$project$Analyser$Messages$Schema$rangeListProp = F2(
	function (k, _v0) {
		var s = _v0;
		return A3($elm$core$Dict$insert, k, 3, s);
	});
var $author$project$ASTUtil$Inspector$Skip = {$: 0};
var $author$project$Analyser$Messages$Data$ModuleNameV = function (a) {
	return {$: 4, a: a};
};
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
var $author$project$Analyser$Messages$Data$RangeListV = function (a) {
	return {$: 3, a: a};
};
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
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
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
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
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
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
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
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
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
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
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
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
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
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
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
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
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
				if (_v4.$ === -1) {
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
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
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
						if (_v7.$ === -1) {
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
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
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
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
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
		var moduleName = $stil4m$elm_syntax$Elm$Syntax$Node$value(imp.a_);
		var _v1 = A2($elm$core$Dict$get, moduleName, context);
		if (!_v1.$) {
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
								dc: $author$project$ASTUtil$Inspector$Skip,
								df: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$DuplicateImport$onImport)
							}),
						fileContext.fe,
						$elm$core$Dict$empty))));
	});
var $author$project$Analyser$Checks$DuplicateImport$checker = {
	fo: $author$project$Analyser$Checks$DuplicateImport$scan,
	fX: {
		fD: 'You are importing the same module twice.',
		f0: 'DuplicateImport',
		f8: 'Duplicate Import',
		gs: A2(
			$author$project$Analyser$Messages$Schema$moduleProp,
			'moduleName',
			A2($author$project$Analyser$Messages$Schema$rangeListProp, 'ranges', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$Analyser$Messages$Data$valueAsRangeList = function (dv) {
	if (dv.$ === 3) {
		var v = dv.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Analyser$Messages$Data$getRangeList = F2(
	function (k, _v0) {
		var d = _v0.b;
		return A2(
			$elm$core$Maybe$andThen,
			$author$project$Analyser$Messages$Data$valueAsRangeList,
			A2($elm$core$Dict$get, k, d));
	});
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Analyser$Fixes$DuplicateImport$removeImports = F2(
	function (_v0, ranges) {
		var content = _v0.a;
		return $author$project$Analyser$Fixes$Base$Patched(
			A3(
				$elm$core$List$foldr,
				function (range) {
					return A2($author$project$Analyser$Fixes$FileContent$replaceRangeWith, range, '');
				},
				content,
				$elm$core$List$reverse(
					A2(
						$elm$core$List$sortBy,
						A2(
							$elm$core$Basics$composeR,
							function ($) {
								return $.J;
							},
							function ($) {
								return $.C;
							}),
						ranges))));
	});
var $author$project$Analyser$Fixes$DuplicateImport$fix = F2(
	function (input, messageData) {
		var _v0 = A2($author$project$Analyser$Messages$Data$getRangeList, 'ranges', messageData);
		if (!_v0.$) {
			var ranges = _v0.a;
			return A2(
				$author$project$Analyser$Fixes$DuplicateImport$removeImports,
				input,
				A2($elm$core$List$drop, 1, ranges));
		} else {
			return $author$project$Analyser$Fixes$Base$IncompatibleData;
		}
	});
var $author$project$Analyser$Fixes$DuplicateImport$fixer = A3($author$project$Analyser$Fixes$Base$Fixer, $author$project$Analyser$Checks$DuplicateImport$checker.fX.f0, $author$project$Analyser$Fixes$DuplicateImport$fix, 'Remove extra imports and format');
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
		$author$project$Analyser$Checks$MultiLineRecordFormatting$typeAnnotationRange(left.b).J.C,
		$author$project$Analyser$Checks$MultiLineRecordFormatting$typeAnnotationRange(right.b).J.C);
};
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
		case 0:
			return _List_Nil;
		case 1:
			var args = x.b;
			return A2($elm$core$List$concatMap, $author$project$Analyser$Checks$MultiLineRecordFormatting$findRecords, args);
		case 2:
			return _List_Nil;
		case 3:
			var inner = x.a;
			return A2($elm$core$List$concatMap, $author$project$Analyser$Checks$MultiLineRecordFormatting$findRecords, inner);
		case 5:
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
		case 4:
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
			$author$project$Analyser$Checks$MultiLineRecordFormatting$findRecords(x.gI),
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
									dq: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$MultiLineRecordFormatting$onTypeAlias)
								}),
							fileContext.fe,
							_List_Nil)))));
	});
var $author$project$Analyser$Checks$MultiLineRecordFormatting$checker = {
	fo: $author$project$Analyser$Checks$MultiLineRecordFormatting$scan,
	fX: {
		fD: 'Records in type aliases should be formatted on multiple lines to help the reader.',
		f0: 'MultiLineRecordFormatting',
		f8: 'MultiLine Record Formatting',
		gs: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {fW: index, f3: match, gh: number, gz: submatches};
	});
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{fl: false, f7: false},
		string);
};
var $author$project$Analyser$Fixes$MultiLineRecordFormatting$commaAndIdentifierRegex = $elm$regex$Regex$fromString(',\\s+[a-z][a-zA-Z0-9_]*\'?\\s+:');
var $elm$regex$Regex$replaceAtMost = _Regex_replaceAtMost;
var $author$project$Analyser$Fixes$MultiLineRecordFormatting$replacement = function (_v0) {
	var match = _v0.f3;
	return '\n ' + match;
};
var $author$project$Analyser$Fixes$MultiLineRecordFormatting$replacer = A2(
	$elm$core$Maybe$withDefault,
	$elm$core$Basics$identity,
	A2(
		$elm$core$Maybe$map,
		function (r) {
			return A3($elm$regex$Regex$replaceAtMost, 1, r, $author$project$Analyser$Fixes$MultiLineRecordFormatting$replacement);
		},
		$author$project$Analyser$Fixes$MultiLineRecordFormatting$commaAndIdentifierRegex));
var $author$project$Analyser$Fixes$MultiLineRecordFormatting$fixContent = F2(
	function (range, content) {
		return A3($author$project$Analyser$Fixes$FileContent$updateRange, range, $author$project$Analyser$Fixes$MultiLineRecordFormatting$replacer, content);
	});
var $author$project$Analyser$Fixes$MultiLineRecordFormatting$fix = F2(
	function (input, messageData) {
		var _v0 = A2($author$project$Analyser$Messages$Data$getRange, 'range', messageData);
		if (!_v0.$) {
			var range = _v0.a;
			return $author$project$Analyser$Fixes$Base$Patched(
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Tuple$first,
					$author$project$Analyser$Fixes$MultiLineRecordFormatting$fixContent(range))(input));
		} else {
			return $author$project$Analyser$Fixes$Base$IncompatibleData;
		}
	});
var $author$project$Analyser$Fixes$MultiLineRecordFormatting$fixer = A3($author$project$Analyser$Fixes$Base$Fixer, $author$project$Analyser$Checks$MultiLineRecordFormatting$checker.fX.f0, $author$project$Analyser$Fixes$MultiLineRecordFormatting$fix, 'Rewrite over multiple lines and format');
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
		if ((!_v0.$) && _v0.a) {
			return m;
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Analyser$Checks$UnnecessaryParens$getParenthesized = function (_v0) {
	var r = _v0.a;
	var e = _v0.b;
	if (e.$ === 14) {
		var p = e.a;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(r, p));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$isCase = function (e) {
	if (e.$ === 16) {
		return true;
	} else {
		return false;
	}
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$isLambda = function (e) {
	if (e.$ === 17) {
		return true;
	} else {
		return false;
	}
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$isOperatorApplication = function (e) {
	if (e.$ === 2) {
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
		var _v0 = $author$project$Analyser$Checks$UnnecessaryParens$getParenthesized(caseBlock.bJ);
		if (!_v0.$) {
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
	if (e.$ === 4) {
		return true;
	} else {
		return false;
	}
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$isLet = function (e) {
	if (e.$ === 15) {
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
			case 20:
				return A2($elm$core$List$cons, range, context);
			case 21:
				return A2($elm$core$List$cons, range, context);
			case 22:
				return A2($elm$core$List$cons, range, context);
			case 18:
				return A2($elm$core$List$cons, range, context);
			case 13:
				return A2($elm$core$List$cons, range, context);
			case 19:
				return A2($elm$core$List$cons, range, context);
			case 3:
				return A2($elm$core$List$cons, range, context);
			case 7:
				return A2($elm$core$List$cons, range, context);
			case 9:
				return A2($elm$core$List$cons, range, context);
			case 12:
				return A2($elm$core$List$cons, range, context);
			case 11:
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
			case 14:
				var inner = expression.a;
				return A3($author$project$Analyser$Checks$UnnecessaryParens$onParenthesizedExpression, range, inner, context);
			case 2:
				var left = expression.c;
				var right = expression.d;
				return A3($author$project$Analyser$Checks$UnnecessaryParens$onOperatorApplication, left, right, context);
			case 1:
				var parts = expression.a;
				return A2($author$project$Analyser$Checks$UnnecessaryParens$onApplication, parts, context);
			case 4:
				var a = expression.a;
				var b = expression.b;
				var c = expression.c;
				return A4($author$project$Analyser$Checks$UnnecessaryParens$onIfBlock, a, b, c, context);
			case 16:
				var caseBlock = expression.a;
				return A2($author$project$Analyser$Checks$UnnecessaryParens$onCaseBlock, caseBlock, context);
			case 18:
				var parts = expression.a;
				return A2($author$project$Analyser$Checks$UnnecessaryParens$onRecord, parts, context);
			case 22:
				var updates = expression.b;
				return A2($author$project$Analyser$Checks$UnnecessaryParens$onRecord, updates, context);
			case 13:
				var x = expression.a;
				return A2($author$project$Analyser$Checks$UnnecessaryParens$onTuple, x, context);
			case 19:
				var x = expression.a;
				return A2($author$project$Analyser$Checks$UnnecessaryParens$onListExpr, x, context);
			default:
				return context;
		}
	});
var $author$project$Analyser$Checks$UnnecessaryParens$onFunction = F2(
	function (_v0, context) {
		var _function = _v0.b;
		var _v1 = $stil4m$elm_syntax$Elm$Syntax$Node$value(_function.fx).bJ;
		if (_v1.b.$ === 14) {
			var range = _v1.a;
			return A2($elm$core$List$cons, range, context);
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$UnnecessaryParens$onLambda = F2(
	function (lambda, context) {
		var _v0 = lambda.bJ;
		if (_v0.b.$ === 14) {
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
				$elm$core$String$fromInt(range.J.C),
				$elm$core$String$fromInt(range.J.W),
				$elm$core$String$fromInt(range.bH.C),
				$elm$core$String$fromInt(range.bH.W)
			]));
};
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
					da: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnnecessaryParens$onExpression),
					dc: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnnecessaryParens$onFunction),
					dh: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnnecessaryParens$onLambda)
				}),
			fileContext.fe,
			_List_Nil);
		return A2(
			$elm$core$List$map,
			$author$project$Analyser$Checks$UnnecessaryParens$buildMessage,
			A2($elm_community$list_extra$List$Extra$uniqueBy, $author$project$Analyser$Checks$UnnecessaryParens$rangeToString, x));
	});
var $author$project$Analyser$Checks$UnnecessaryParens$checker = {
	fo: $author$project$Analyser$Checks$UnnecessaryParens$scan,
	fX: {
		fD: 'If you want parenthesis, then you might want to look into Lisp.',
		f0: 'UnnecessaryParens',
		f8: 'Unnecessary Parens',
		gs: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Fixes$Base$Error = function (a) {
	return {$: 2, a: a};
};
var $author$project$Analyser$Fixes$FileContent$patchLocation = function (_v0) {
	var column = _v0.W;
	var row = _v0.C;
	return {W: column - 1, C: row - 1};
};
var $author$project$Analyser$Fixes$FileContent$getCharAtLocation = F2(
	function (pair, input) {
		var _v0 = $author$project$Analyser$Fixes$FileContent$patchLocation(pair);
		var row = _v0.C;
		var column = _v0.W;
		return A2(
			$elm$core$Maybe$map,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$String$dropLeft(column),
				$elm$core$String$left(1)),
			$elm$core$List$head(
				A2(
					$elm$core$List$drop,
					row,
					A2($elm$core$String$split, '\n', input))));
	});
var $elm_community$list_extra$List$Extra$updateIfIndex = F3(
	function (predicate, update, list) {
		return A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, x) {
					return predicate(i) ? update(x) : x;
				}),
			list);
	});
var $author$project$Analyser$Fixes$FileContent$replaceLocationWith = F3(
	function (pair, x, input) {
		var rows = A2($elm$core$String$split, '\n', input);
		var _v0 = $author$project$Analyser$Fixes$FileContent$patchLocation(pair);
		var row = _v0.C;
		var column = _v0.W;
		var lineUpdater = function (target) {
			return $elm$core$String$concat(
				_List_fromArray(
					[
						A2($elm$core$String$left, column, target),
						x,
						A2($elm$core$String$dropLeft, column + 1, target)
					]));
		};
		return A2(
			$elm$core$String$join,
			'\n',
			A3(
				$elm_community$list_extra$List$Extra$updateIfIndex,
				$elm$core$Basics$eq(row),
				lineUpdater,
				rows));
	});
var $author$project$Analyser$Fixes$UnnecessaryParens$fixContent = F2(
	function (range, content) {
		var _v0 = range;
		var start = _v0.J;
		var end = _v0.bH;
		var endLoc = {W: end.W - 1, C: end.C};
		var endChar = A2($author$project$Analyser$Fixes$FileContent$getCharAtLocation, endLoc, content);
		var startChar = A2($author$project$Analyser$Fixes$FileContent$getCharAtLocation, start, content);
		var _v1 = _Utils_Tuple2(startChar, endChar);
		if ((((!_v1.a.$) && (_v1.a.a === '(')) && (!_v1.b.$)) && (_v1.b.a === ')')) {
			return $author$project$Analyser$Fixes$Base$Patched(
				A3(
					$author$project$Analyser$Fixes$FileContent$replaceLocationWith,
					endLoc,
					'',
					A3($author$project$Analyser$Fixes$FileContent$replaceLocationWith, start, ' ', content)));
		} else {
			return $author$project$Analyser$Fixes$Base$Error('Could not locate parens to replace');
		}
	});
var $author$project$Analyser$Fixes$UnnecessaryParens$fix = F2(
	function (input, messageData) {
		var _v0 = A2($author$project$Analyser$Messages$Data$getRange, 'range', messageData);
		if (!_v0.$) {
			var range = _v0.a;
			return A3(
				$elm$core$Basics$composeR,
				$elm$core$Tuple$first,
				$author$project$Analyser$Fixes$UnnecessaryParens$fixContent(range),
				input);
		} else {
			return $author$project$Analyser$Fixes$Base$IncompatibleData;
		}
	});
var $author$project$Analyser$Fixes$UnnecessaryParens$fixer = A3($author$project$Analyser$Fixes$Base$Fixer, $author$project$Analyser$Checks$UnnecessaryParens$checker.fX.f0, $author$project$Analyser$Fixes$UnnecessaryParens$fix, 'Remove and format');
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
		case 7:
			var xs = p.a;
			return A2($elm$core$List$concatMap, recur, xs);
		case 8:
			return _List_Nil;
		case 9:
			var left = p.a;
			var right = p.b;
			return _Utils_ap(
				recur(left),
				recur(right));
		case 10:
			var xs = p.a;
			return A2($elm$core$List$concatMap, recur, xs);
		case 12:
			var qualifiedNameRef = p.a;
			var subPatterns = p.b;
			return A2(
				$elm$core$List$cons,
				qualifiedNameRef.a_,
				A2($elm$core$List$concatMap, recur, subPatterns));
		case 13:
			var inner = p.a;
			return recur(inner);
		case 14:
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
		if (_v0.$ === 3) {
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
		return (_Utils_eq(imp.et, $elm$core$Maybe$Nothing) && _Utils_eq(imp.bI, $elm$core$Maybe$Nothing)) ? A3(
			$elm$core$Dict$insert,
			$stil4m$elm_syntax$Elm$Syntax$Node$value(imp.a_),
			_Utils_Tuple2(range, 0),
			context) : context;
	});
var $author$project$Analyser$Checks$UnusedImport$onTypeAnnotation = F2(
	function (_v0, context) {
		var typeAnnotation = _v0.b;
		if (typeAnnotation.$ === 1) {
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
					df: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImport$onImport)
				}),
			fileContext.fe,
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
									c8: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImport$onCase),
									da: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImport$onExpression),
									dr: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImport$onTypeAnnotation)
								}),
							fileContext.fe,
							aliases)))));
	});
var $author$project$Analyser$Checks$UnusedImport$checker = {
	fo: $author$project$Analyser$Checks$UnusedImport$scan,
	fX: {
		fD: 'Imports that have no meaning should be removed.',
		f0: 'UnusedImport',
		f8: 'Unused Import',
		gs: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'range',
			A2($author$project$Analyser$Messages$Schema$moduleProp, 'moduleName', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$Analyser$Fixes$UnusedImport$canFix = $author$project$Analyser$Checks$UnusedImport$checker.fX.f0;
var $author$project$AST$Ranges$isGte = F2(
	function (a, b) {
		return (_Utils_cmp(a.C, b.C) > 0) ? true : ((_Utils_cmp(a.C, b.C) < 0) ? false : (_Utils_cmp(a.W, b.W) > -1));
	});
var $author$project$AST$Ranges$containsRange = F2(
	function (a, b) {
		return A2($author$project$AST$Ranges$isGte, a.J, b.J) && A2($author$project$AST$Ranges$isGte, b.bH, a.bH);
	});
var $author$project$ASTUtil$Imports$findImportWithRange = F2(
	function (ast, range) {
		return $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				A2(
					$elm$core$Basics$composeR,
					$stil4m$elm_syntax$Elm$Syntax$Node$range,
					$author$project$AST$Ranges$containsRange(range)),
				ast.eg));
	});
var $author$project$Analyser$Fixes$UnusedImport$removeImport = F2(
	function (_v0, range) {
		var content = _v0.a;
		var ast = _v0.b;
		var _v1 = A2($author$project$ASTUtil$Imports$findImportWithRange, ast, range);
		if (!_v1.$) {
			var _v2 = _v1.a;
			var r = _v2.a;
			return $author$project$Analyser$Fixes$Base$Patched(
				A3($author$project$Analyser$Fixes$FileContent$replaceRangeWith, r, '', content));
		} else {
			return $author$project$Analyser$Fixes$Base$Error('Could not locate import for the target range');
		}
	});
var $author$project$Analyser$Fixes$UnusedImport$fix = F2(
	function (input, messageData) {
		var _v0 = A2($author$project$Analyser$Messages$Data$getRange, 'range', messageData);
		if (!_v0.$) {
			var range = _v0.a;
			return A2($author$project$Analyser$Fixes$UnusedImport$removeImport, input, range);
		} else {
			return $author$project$Analyser$Fixes$Base$IncompatibleData;
		}
	});
var $author$project$Analyser$Fixes$UnusedImport$fixer = A3($author$project$Analyser$Fixes$Base$Fixer, $author$project$Analyser$Fixes$UnusedImport$canFix, $author$project$Analyser$Fixes$UnusedImport$fix, 'Remove unused import');
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
		if (_v0.$ === 3) {
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
		var _v1 = A2($elm$core$Maybe$map, $stil4m$elm_syntax$Elm$Syntax$Node$value, imp.et);
		if (!_v1.$) {
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
		if (typeAnnotation.$ === 1) {
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
					df: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImportAlias$onImport)
				}),
			fileContext.fe,
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
									c8: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImportAlias$onCase),
									da: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImportAlias$onExpression),
									dr: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImportAlias$onTypeAnnotation)
								}),
							fileContext.fe,
							aliases)))));
	});
var $author$project$Analyser$Checks$UnusedImportAlias$checker = {
	fo: $author$project$Analyser$Checks$UnusedImportAlias$scan,
	fX: {
		fD: 'You defined an alias for an import (import Foo as F), but it turns out you never use it.',
		f0: 'UnusedImportAlias',
		f8: 'Unused Import Alias',
		gs: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'range',
			A2($author$project$Analyser$Messages$Schema$moduleProp, 'moduleName', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$ASTUtil$Imports$rangesOnDifferentLines = function (ranges) {
	var starts = A2(
		$elm$core$List$map,
		A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.J;
			},
			function ($) {
				return $.C;
			}),
		ranges);
	return _Utils_eq(
		$elm$core$List$length(
			$elm_community$list_extra$List$Extra$unique(starts)),
		$elm$core$List$length(starts));
};
var $author$project$ASTUtil$Imports$stringifyExposedType = function (_v0) {
	var name = _v0.f8;
	var open = _v0.ca;
	return _Utils_ap(
		name,
		function () {
			if (open.$ === 1) {
				return '';
			} else {
				return '(..)';
			}
		}());
};
var $author$project$ASTUtil$Imports$stringifyExpose = function (_v0) {
	var expose = _v0.b;
	switch (expose.$) {
		case 0:
			var s = expose.a;
			return '(' + (s + ')');
		case 1:
			var s = expose.a;
			return s;
		case 2:
			var s = expose.a;
			return s;
		default:
			var exposedType = expose.a;
			return $author$project$ASTUtil$Imports$stringifyExposedType(exposedType);
	}
};
var $author$project$ASTUtil$Imports$stringifyExposingList = function (exp) {
	if (exp.$ === 1) {
		return '';
	} else {
		if (!exp.a.$) {
			return ' exposing (..)';
		} else {
			var explicits = exp.a.a;
			return ' exposing ' + function () {
				if (!explicits.b) {
					return '';
				} else {
					var xs = explicits;
					var areOnDifferentLines = $author$project$ASTUtil$Imports$rangesOnDifferentLines(
						A2($elm$core$List$map, $stil4m$elm_syntax$Elm$Syntax$Node$range, xs));
					var seperator = areOnDifferentLines ? '\n    , ' : ', ';
					return '(' + (A2(
						$elm$core$String$join,
						seperator,
						A2($elm$core$List$map, $author$project$ASTUtil$Imports$stringifyExpose, explicits)) + ')');
				}
			}();
		}
	}
};
var $author$project$ASTUtil$Imports$naiveStringifyImport = function (imp) {
	return $elm$core$String$concat(
		_List_fromArray(
			[
				'import ',
				A2(
				$elm$core$String$join,
				'.',
				$stil4m$elm_syntax$Elm$Syntax$Node$value(imp.a_)),
				A2(
				$elm$core$Maybe$withDefault,
				'',
				A2(
					$elm$core$Maybe$map,
					A2(
						$elm$core$Basics$composeR,
						$stil4m$elm_syntax$Elm$Syntax$Node$value,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$String$join('.'),
							$elm$core$Basics$append(' as '))),
					imp.et)),
				$author$project$ASTUtil$Imports$stringifyExposingList(
				A2($elm$core$Maybe$map, $stil4m$elm_syntax$Elm$Syntax$Node$value, imp.bI))
			]));
};
var $author$project$Analyser$Fixes$FileContent$replaceLines = F3(
	function (_v0, fix, input) {
		var start = _v0.a;
		var end = _v0.b;
		var lines = A2($elm$core$String$split, '\n', input);
		return A2(
			$elm$core$String$join,
			'\n',
			$elm$core$List$concat(
				_List_fromArray(
					[
						A2($elm$core$List$take, start, lines),
						_List_fromArray(
						[fix]),
						A2($elm$core$List$drop, end + 1, lines)
					])));
	});
var $author$project$Analyser$Fixes$UnusedImportAlias$writeNewImport = F3(
	function (syntaxRange, imp, i) {
		return A3(
			$author$project$Analyser$Fixes$FileContent$replaceLines,
			_Utils_Tuple2(syntaxRange.J.C - 1, syntaxRange.bH.C - 1),
			$author$project$ASTUtil$Imports$naiveStringifyImport(imp),
			i);
	});
var $author$project$Analyser$Fixes$UnusedImportAlias$updateImport = F2(
	function (_v0, range) {
		var content = _v0.a;
		var ast = _v0.b;
		var _v1 = A2($author$project$ASTUtil$Imports$findImportWithRange, ast, range);
		if (!_v1.$) {
			var _v2 = _v1.a;
			var r = _v2.a;
			var imp = _v2.b;
			return $author$project$Analyser$Fixes$Base$Patched(
				A3(
					$author$project$Analyser$Fixes$UnusedImportAlias$writeNewImport,
					r,
					_Utils_update(
						imp,
						{et: $elm$core$Maybe$Nothing}),
					content));
		} else {
			return $author$project$Analyser$Fixes$Base$Error('Could not locate import for the target range');
		}
	});
var $author$project$Analyser$Fixes$UnusedImportAlias$fix = F2(
	function (input, messageData) {
		var _v0 = A2($author$project$Analyser$Messages$Data$getRange, 'range', messageData);
		if (!_v0.$) {
			var range = _v0.a;
			return A2($author$project$Analyser$Fixes$UnusedImportAlias$updateImport, input, range);
		} else {
			return $author$project$Analyser$Fixes$Base$IncompatibleData;
		}
	});
var $author$project$Analyser$Fixes$UnusedImportAlias$fixer = A3($author$project$Analyser$Fixes$Base$Fixer, $author$project$Analyser$Checks$UnusedImportAlias$checker.fX.f0, $author$project$Analyser$Fixes$UnusedImportAlias$fix, 'Remove alias and format');
var $author$project$ASTUtil$Inspector$Inner = function (a) {
	return {$: 4, a: a};
};
var $author$project$ASTUtil$Inspector$Pre = function (a) {
	return {$: 2, a: a};
};
var $author$project$Analyser$Checks$Variables$UsedVariableContext = $elm$core$Basics$identity;
var $author$project$Analyser$Checks$Variables$emptyContext = {r: _List_Nil, af: _List_Nil};
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
				r: A2($author$project$Analyser$Checks$Variables$flagVariable, x, context.r)
			});
	});
var $author$project$ASTUtil$Variables$qualifiedNameUsedVars = F2(
	function (_v0, range) {
		var moduleName = _v0.a_;
		var name = _v0.f8;
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
			case 7:
				var t = p.a;
				return A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToUsedVars, t);
			case 9:
				var l = p.a;
				var r = p.b;
				return _Utils_ap(
					$author$project$ASTUtil$Variables$patternToUsedVars(l),
					$author$project$ASTUtil$Variables$patternToUsedVars(r));
			case 10:
				var l = p.a;
				return A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToUsedVars, l);
			case 12:
				var qualifiedNameRef = p.a;
				var args = p.b;
				return _Utils_ap(
					A2($author$project$ASTUtil$Variables$qualifiedNameUsedVars, qualifiedNameRef, range),
					A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToUsedVars, args));
			case 13:
				var sub = p.a;
				var $temp$_v0 = sub;
				_v0 = $temp$_v0;
				continue patternToUsedVars;
			case 14:
				var sub = p.a;
				var $temp$_v0 = sub;
				_v0 = $temp$_v0;
				continue patternToUsedVars;
			case 8:
				return _List_Nil;
			case 11:
				return _List_Nil;
			case 0:
				return _List_Nil;
			case 1:
				return _List_Nil;
			case 2:
				return _List_Nil;
			case 3:
				return _List_Nil;
			case 4:
				return _List_Nil;
			case 5:
				return _List_Nil;
			default:
				return _List_Nil;
		}
	}
};
var $author$project$ASTUtil$Variables$Defined = 2;
var $author$project$ASTUtil$Variables$Pattern = 1;
var $author$project$ASTUtil$Variables$patternToVarsInner = F2(
	function (isFirst, _v0) {
		var range = _v0.a;
		var p = _v0.b;
		var recur = $author$project$ASTUtil$Variables$patternToVarsInner(false);
		switch (p.$) {
			case 7:
				var t = p.a;
				return A2($elm$core$List$concatMap, recur, t);
			case 8:
				var r = p.a;
				return A2(
					$elm$core$List$map,
					function (a) {
						return _Utils_Tuple2(a, 1);
					},
					r);
			case 9:
				var l = p.a;
				var r = p.b;
				return _Utils_ap(
					recur(l),
					recur(r));
			case 10:
				var l = p.a;
				return A2($elm$core$List$concatMap, recur, l);
			case 11:
				var x = p.a;
				return _List_fromArray(
					[
						_Utils_Tuple2(
						A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, range, x),
						isFirst ? 2 : 1)
					]);
			case 12:
				var args = p.b;
				return A2($elm$core$List$concatMap, recur, args);
			case 13:
				var sub = p.a;
				var name = p.b;
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(name, 1),
					recur(sub));
			case 14:
				var sub = p.a;
				return recur(sub);
			case 0:
				return _List_Nil;
			case 1:
				return _List_Nil;
			case 2:
				return _List_Nil;
			case 3:
				return _List_Nil;
			case 4:
				return _List_Nil;
			case 5:
				return _List_Nil;
			default:
				return _List_Nil;
		}
	});
var $author$project$Analyser$Checks$Variables$popScope = function (x) {
	return _Utils_update(
		x,
		{
			r: A2($elm$core$List$drop, 1, x.r),
			af: A2(
				$elm$core$Maybe$withDefault,
				x.af,
				A2(
					$elm$core$Maybe$map,
					function (_v0) {
						var activeScope = _v0.b;
						return $elm$core$Dict$isEmpty(activeScope) ? x.af : A2($elm$core$List$cons, activeScope, x.af);
					},
					$elm$core$List$head(x.r)))
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
				r: A2($elm$core$List$cons, y, x.r)
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
var $author$project$ASTUtil$Variables$TopLevel = 3;
var $author$project$ASTUtil$Variables$patternToVars = $author$project$ASTUtil$Variables$patternToVarsInner(true);
var $author$project$ASTUtil$Variables$getDeclarationVars = function (_v0) {
	var decl = _v0.b;
	switch (decl.$) {
		case 0:
			var f = decl.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					$stil4m$elm_syntax$Elm$Syntax$Node$value(f.fx).f8,
					3)
				]);
		case 1:
			return _List_Nil;
		case 2:
			var t = decl.a;
			return A2(
				$elm$core$List$map,
				function (_v2) {
					var name = _v2.b.f8;
					return _Utils_Tuple2(name, 3);
				},
				t.fu);
		case 3:
			var p = decl.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(p.f8, 3)
				]);
		case 4:
			return _List_Nil;
		default:
			var pattern = decl.a;
			return $author$project$ASTUtil$Variables$patternToVars(pattern);
	}
};
var $author$project$ASTUtil$Variables$getDeclarationsVars = $elm$core$List$concatMap($author$project$ASTUtil$Variables$getDeclarationVars);
var $author$project$ASTUtil$Variables$Imported = 0;
var $author$project$ASTUtil$Variables$getImportExposedVars = function (e) {
	if (e.$ === 1) {
		return _List_Nil;
	} else {
		if (!e.a.$) {
			return _List_Nil;
		} else {
			var l = e.a.a;
			return A2(
				$elm$core$List$concatMap,
				function (_v1) {
					var r = _v1.a;
					var exposed = _v1.b;
					switch (exposed.$) {
						case 0:
							var x = exposed.a;
							return _List_fromArray(
								[
									_Utils_Tuple2(
									A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, x),
									0)
								]);
						case 1:
							var x = exposed.a;
							return _List_fromArray(
								[
									_Utils_Tuple2(
									A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, x),
									0)
								]);
						case 2:
							var x = exposed.a;
							return _List_fromArray(
								[
									_Utils_Tuple2(
									A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, x),
									0)
								]);
						default:
							var exposedType = exposed.a;
							var _v3 = exposedType.ca;
							if (!_v3.$) {
								return _List_Nil;
							} else {
								return _List_fromArray(
									[
										_Utils_Tuple2(
										A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, exposedType.f8),
										0)
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
		A2($elm$core$Maybe$map, $stil4m$elm_syntax$Elm$Syntax$Node$value, imp.bI));
};
var $author$project$ASTUtil$Variables$getImportsVars = $elm$core$List$concatMap($author$project$ASTUtil$Variables$getImportVars);
var $author$project$ASTUtil$Variables$getTopLevels = function (file) {
	return $elm$core$List$concat(
		_List_fromArray(
			[
				$author$project$ASTUtil$Variables$getImportsVars(file.eg),
				$author$project$ASTUtil$Variables$getDeclarationsVars(file.dY)
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
				r: function () {
					var _v0 = context.r;
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
var $author$project$Analyser$Checks$Variables$unMaskVariable = F2(
	function (k, context) {
		return _Utils_update(
			context,
			{
				r: function () {
					var _v0 = context.r;
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
		var functionDeclaration = $stil4m$elm_syntax$Elm$Syntax$Node$value(_function.fx);
		var postContext = function (c) {
			return A2(
				$author$project$Analyser$Checks$Variables$unMaskVariable,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(functionDeclaration.f8),
				$author$project$Analyser$Checks$Variables$popScope(
					f(
						function (a) {
							return A2($author$project$Analyser$Checks$Variables$pushScope, a, c);
						}(
							A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToVars, functionDeclaration.fc)))));
		}(
			A2(
				$author$project$Analyser$Checks$Variables$maskVariable,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(functionDeclaration.f8),
				context));
		var used = A2(
			$elm$core$List$map,
			$stil4m$elm_syntax$Elm$Syntax$Node$value,
			A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToUsedVars, functionDeclaration.fc));
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
			A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToVars, lambda.fa));
		var postContext = f(preContext);
		return $author$project$Analyser$Checks$Variables$popScope(postContext);
	});
var $author$project$ASTUtil$Variables$getLetDeclarationVars = function (_v0) {
	var decl = _v0.b;
	if (!decl.$) {
		var f = decl.a;
		return _List_fromArray(
			[
				_Utils_Tuple2(
				$stil4m$elm_syntax$Elm$Syntax$Node$value(f.fx).f8,
				3)
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
		if (variableType === 3) {
			return _Utils_Tuple2(pointer, 2);
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
					A3($elm$core$Basics$composeR, $author$project$ASTUtil$Variables$getLetDeclarationsVars, $author$project$ASTUtil$Variables$withoutTopLevel, letBlock.dY))));
	});
var $author$project$Analyser$Checks$Variables$onOperatorAppliction = F2(
	function (_v0, context) {
		var operator = _v0.gk;
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
		if ((t.$ === 1) && (!t.a.b.a.b)) {
			var _v2 = t.a;
			var _v3 = _v2.b;
			var name = _v3.b;
			return A2($author$project$Analyser$Checks$Variables$addUsedVariable, name, c);
		} else {
			return c;
		}
	});
var $author$project$Analyser$Checks$Variables$collect = function (fileContext) {
	return A3(
		$author$project$ASTUtil$Inspector$inspect,
		_Utils_update(
			$author$project$ASTUtil$Inspector$defaultConfig,
			{
				c8: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$Variables$onCase),
				c9: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$Variables$onDestructuring),
				db: $author$project$ASTUtil$Inspector$Pre($author$project$Analyser$Checks$Variables$onFile),
				dc: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$Variables$onFunction),
				dd: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$Variables$onFunctionOrValue),
				dh: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$Variables$onLambda),
				di: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$Variables$onLetBlock),
				dj: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$Variables$onOperatorAppliction),
				dl: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$Variables$onPrefixOperator),
				dn: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$Variables$onRecordUpdate),
				dr: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$Variables$onTypeAnnotation)
			}),
		fileContext.fe,
		$author$project$Analyser$Checks$Variables$emptyContext);
};
var $stil4m$elm_syntax$Elm$Interface$exposesFunction = F2(
	function (k, _interface) {
		return A2(
			$elm$core$List$any,
			function (x) {
				switch (x.$) {
					case 0:
						var l = x.a;
						return _Utils_eq(k, l);
					case 1:
						var _v1 = x.a;
						var constructors = _v1.b;
						return A2($elm$core$List$member, k, constructors);
					case 3:
						var inf = x.a;
						return _Utils_eq(
							$stil4m$elm_syntax$Elm$Syntax$Node$value(inf.gk),
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
	var _v0 = $stil4m$elm_syntax$Elm$Syntax$Node$value(fileContext.fe.f6);
	if (_v0.$ === 2) {
		return $author$project$Analyser$Checks$UnusedImportedVariable$filterForEffectModule;
	} else {
		return $elm$core$Basics$always(true);
	}
};
var $author$project$Tuple$Extra$first3 = function (_v0) {
	var a = _v0.a;
	return a;
};
var $author$project$Analyser$Messages$Data$VariableNameV = function (a) {
	return {$: 2, a: a};
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
var $author$project$Analyser$Checks$UnusedImportedVariable$forVariableType = function (_v0) {
	var variableName = _v0.a;
	var variableType = _v0.b;
	var range = _v0.c;
	if (!variableType) {
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
	var x = _v0;
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
						$elm$core$List$head(x.r))))));
};
var $author$project$Analyser$Checks$Variables$unusedVariables = function (_v0) {
	var x = _v0;
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
			A2($elm$core$List$concatMap, $elm$core$Dict$toList, x.af)));
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
							return A2($stil4m$elm_syntax$Elm$Interface$exposesFunction, a, fileContext.fZ);
						},
						$elm$core$Basics$not)),
				A2(
					$elm$core$List$filter,
					$author$project$Analyser$Checks$UnusedImportedVariable$filterByModuleType(fileContext),
					$author$project$Analyser$Checks$Variables$unusedTopLevels(x))));
		return _Utils_ap(unusedVariables, unusedTopLevels);
	});
var $author$project$Analyser$Messages$Schema$VariableName = 2;
var $author$project$Analyser$Messages$Schema$varProp = F2(
	function (k, _v0) {
		var s = _v0;
		return A3($elm$core$Dict$insert, k, 2, s);
	});
var $author$project$Analyser$Checks$UnusedImportedVariable$checker = {
	fo: $author$project$Analyser$Checks$UnusedImportedVariable$scan,
	fX: {
		fD: 'When a function is imported from a module but is unused, it is better to remove it.',
		f0: 'UnusedImportedVariable',
		f8: 'Unused Imported Variable',
		gs: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'range',
			A2($author$project$Analyser$Messages$Schema$varProp, 'varName', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$ASTUtil$Imports$removeRangeFromExpose = F2(
	function (range, _v0) {
		var r = _v0.a;
		var expose = _v0.b;
		return A2(
			$elm$core$Maybe$map,
			function (b) {
				return A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, b);
			},
			function () {
				switch (expose.$) {
					case 0:
						var x = expose.a;
						return _Utils_eq(r, range) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
							$stil4m$elm_syntax$Elm$Syntax$Exposing$InfixExpose(x));
					case 1:
						var x = expose.a;
						return _Utils_eq(r, range) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
							$stil4m$elm_syntax$Elm$Syntax$Exposing$FunctionExpose(x));
					case 2:
						var x = expose.a;
						return _Utils_eq(r, range) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
							$stil4m$elm_syntax$Elm$Syntax$Exposing$TypeOrAliasExpose(x));
					default:
						var exposedType = expose.a;
						return $elm$core$Maybe$Just(
							$stil4m$elm_syntax$Elm$Syntax$Exposing$TypeExpose(
								_Utils_update(
									exposedType,
									{
										ca: _Utils_eq(
											exposedType.ca,
											$elm$core$Maybe$Just(range)) ? $elm$core$Maybe$Nothing : exposedType.ca
									})));
				}
			}());
	});
var $author$project$ASTUtil$Imports$removeRangeFromExposingList = F2(
	function (range, _v0) {
		var er = _v0.a;
		var exp = _v0.b;
		if (!exp.$) {
			var r = exp.a;
			return _Utils_eq(r, range) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
				A2(
					$stil4m$elm_syntax$Elm$Syntax$Node$Node,
					er,
					$stil4m$elm_syntax$Elm$Syntax$Exposing$All(r)));
		} else {
			var exposedTypes = exp.a;
			var _v2 = A2(
				$elm$core$List$filterMap,
				$author$project$ASTUtil$Imports$removeRangeFromExpose(range),
				exposedTypes);
			if (!_v2.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = _v2;
				return $elm$core$Maybe$Just(
					A2(
						$stil4m$elm_syntax$Elm$Syntax$Node$Node,
						er,
						$stil4m$elm_syntax$Elm$Syntax$Exposing$Explicit(x)));
			}
		}
	});
var $author$project$ASTUtil$Imports$removeRangeFromImport = F2(
	function (range, imp) {
		return _Utils_update(
			imp,
			{
				bI: A2(
					$elm$core$Maybe$andThen,
					$author$project$ASTUtil$Imports$removeRangeFromExposingList(range),
					imp.bI)
			});
	});
var $author$project$Analyser$Fixes$UnusedImportedVariable$writeNewImport = F3(
	function (syntaxRange, imp, i) {
		return A3(
			$author$project$Analyser$Fixes$FileContent$replaceLines,
			_Utils_Tuple2(syntaxRange.J.C - 1, syntaxRange.bH.C - 1),
			$author$project$ASTUtil$Imports$naiveStringifyImport(imp),
			i);
	});
var $author$project$Analyser$Fixes$UnusedImportedVariable$removeImport = F2(
	function (_v0, range) {
		var content = _v0.a;
		var ast = _v0.b;
		var _v1 = A2($author$project$ASTUtil$Imports$findImportWithRange, ast, range);
		if (!_v1.$) {
			var _v2 = _v1.a;
			var r = _v2.a;
			var imp = _v2.b;
			return $author$project$Analyser$Fixes$Base$Patched(
				A3(
					$author$project$Analyser$Fixes$UnusedImportedVariable$writeNewImport,
					r,
					A2($author$project$ASTUtil$Imports$removeRangeFromImport, range, imp),
					content));
		} else {
			return $author$project$Analyser$Fixes$Base$Error('Could not locate import for the target range');
		}
	});
var $author$project$Analyser$Fixes$UnusedImportedVariable$fix = F2(
	function (input, messageData) {
		var _v0 = A2($author$project$Analyser$Messages$Data$getRange, 'range', messageData);
		if (!_v0.$) {
			var range = _v0.a;
			return A2($author$project$Analyser$Fixes$UnusedImportedVariable$removeImport, input, range);
		} else {
			return $author$project$Analyser$Fixes$Base$IncompatibleData;
		}
	});
var $author$project$Analyser$Fixes$UnusedImportedVariable$fixer = A3($author$project$Analyser$Fixes$Base$Fixer, $author$project$Analyser$Checks$UnusedImportedVariable$checker.fX.f0, $author$project$Analyser$Fixes$UnusedImportedVariable$fix, 'Remove variable from from import list and format');
var $author$project$Analyser$Checks$UnusedPatternVariable$emptyContext = {r: _List_Nil, af: _List_Nil};
var $author$project$Analyser$Checks$UnusedPatternVariable$filterForEffectModule = function (_v0) {
	var k = _v0.a;
	return !A2(
		$elm$core$List$member,
		k,
		_List_fromArray(
			['init', 'onEffects', 'onSelfMsg', 'subMap', 'cmdMap']));
};
var $author$project$Analyser$Checks$UnusedPatternVariable$filterByModuleType = function (fileContext) {
	var _v0 = $stil4m$elm_syntax$Elm$Syntax$Node$value(fileContext.fe.f6);
	if (_v0.$ === 2) {
		return $author$project$Analyser$Checks$UnusedPatternVariable$filterForEffectModule;
	} else {
		return $elm$core$Basics$always(true);
	}
};
var $author$project$Analyser$Checks$UnusedPatternVariable$forVariableType = F3(
	function (variableType, variableName, range) {
		if (variableType === 1) {
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
				r: A2($author$project$Analyser$Checks$UnusedPatternVariable$flagVariable, x, context.r)
			});
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$popScope = function (x) {
	return _Utils_update(
		x,
		{
			r: A2($elm$core$List$drop, 1, x.r),
			af: A2(
				$elm$core$Maybe$withDefault,
				x.af,
				A2(
					$elm$core$Maybe$map,
					function (_v0) {
						var activeScope = _v0.b;
						return $elm$core$Dict$isEmpty(activeScope) ? x.af : A2($elm$core$List$cons, activeScope, x.af);
					},
					$elm$core$List$head(x.r)))
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
				r: A2($elm$core$List$cons, y, x.r)
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
				r: function () {
					var _v0 = context.r;
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
				r: function () {
					var _v0 = context.r;
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
		var functionDeclaration = $stil4m$elm_syntax$Elm$Syntax$Node$value(_function.fx);
		var postContext = function (c) {
			return A2(
				$author$project$Analyser$Checks$UnusedPatternVariable$unMaskVariable,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(functionDeclaration.f8),
				$author$project$Analyser$Checks$UnusedPatternVariable$popScope(
					f(
						function (a) {
							return A2($author$project$Analyser$Checks$UnusedPatternVariable$pushScope, a, c);
						}(
							A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToVars, functionDeclaration.fc)))));
		}(
			A2(
				$author$project$Analyser$Checks$UnusedPatternVariable$maskVariable,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(functionDeclaration.f8),
				context));
		var used = A2(
			$elm$core$List$map,
			$stil4m$elm_syntax$Elm$Syntax$Node$value,
			A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToUsedVars, functionDeclaration.fc));
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
			A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToVars, lambda.fa));
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
					A3($elm$core$Basics$composeR, $author$project$ASTUtil$Variables$getLetDeclarationsVars, $author$project$ASTUtil$Variables$withoutTopLevel, letBlock.dY))));
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$onOperatorApplication = F2(
	function (_v0, context) {
		var operator = _v0.gk;
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
		if ((t.$ === 1) && (!t.a.b.a.b)) {
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
					c8: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$UnusedPatternVariable$onCase),
					c9: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedPatternVariable$onDestructuring),
					db: $author$project$ASTUtil$Inspector$Pre($author$project$Analyser$Checks$UnusedPatternVariable$onFile),
					dc: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$UnusedPatternVariable$onFunction),
					dd: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedPatternVariable$onFunctionOrValue),
					dh: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$UnusedPatternVariable$onLambda),
					di: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$UnusedPatternVariable$onLetBlock),
					dj: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedPatternVariable$onOperatorApplication),
					dl: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedPatternVariable$onPrefixOperator),
					dn: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedPatternVariable$onRecordUpdate),
					dr: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedPatternVariable$onTypeAnnotation)
				}),
			fileContext.fe,
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
							return A2($stil4m$elm_syntax$Elm$Interface$exposesFunction, a, fileContext.fZ);
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
									$elm$core$List$head(x.r))))))));
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
				A2($elm$core$List$concatMap, $elm$core$Dict$toList, x.af)));
		return _Utils_ap(unusedVariables, unusedTopLevels);
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$checker = {
	fo: $author$project$Analyser$Checks$UnusedPatternVariable$scan,
	fX: {
		fD: 'Variables in pattern matching that are unused should be replaced with \'_\' to avoid unnecessary noise.',
		f0: 'UnusedPatternVariable',
		f8: 'Unused Pattern Variable',
		gs: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'range',
			A2($author$project$Analyser$Messages$Schema$varProp, 'varName', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$ASTUtil$Patterns$findParentPattern = F2(
	function (file, range) {
		var onLambda = function (l) {
			return $elm_community$maybe_extra$Maybe$Extra$orElseLazy(
				function (_v5) {
					return $elm$core$List$head(
						A2(
							$elm$core$List$filter,
							A2(
								$elm$core$Basics$composeR,
								$stil4m$elm_syntax$Elm$Syntax$Node$range,
								$author$project$AST$Ranges$containsRange(range)),
							l.fa));
				});
		};
		var onFunction = function (_v4) {
			var func = _v4.b;
			return $elm_community$maybe_extra$Maybe$Extra$orElseLazy(
				function (_v3) {
					return $elm$core$List$head(
						A2(
							$elm$core$List$filter,
							A2(
								$elm$core$Basics$composeR,
								$stil4m$elm_syntax$Elm$Syntax$Node$range,
								$author$project$AST$Ranges$containsRange(range)),
							$stil4m$elm_syntax$Elm$Syntax$Node$value(func.fx).fc));
				});
		};
		var onDestructuring = function (_v2) {
			var patt = _v2.a;
			return $elm_community$maybe_extra$Maybe$Extra$orElseLazy(
				function (_v1) {
					return A2(
						$author$project$AST$Ranges$containsRange,
						range,
						$stil4m$elm_syntax$Elm$Syntax$Node$range(patt)) ? $elm$core$Maybe$Just(patt) : $elm$core$Maybe$Nothing;
				});
		};
		var onCase = function (c) {
			return $elm_community$maybe_extra$Maybe$Extra$orElseLazy(
				function (_v0) {
					return A2(
						$author$project$AST$Ranges$containsRange,
						range,
						$stil4m$elm_syntax$Elm$Syntax$Node$range(c.a)) ? $elm$core$Maybe$Just(c.a) : $elm$core$Maybe$Nothing;
				});
		};
		return A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					c8: $author$project$ASTUtil$Inspector$Pre(onCase),
					c9: $author$project$ASTUtil$Inspector$Pre(onDestructuring),
					dc: $author$project$ASTUtil$Inspector$Pre(onFunction),
					dh: $author$project$ASTUtil$Inspector$Pre(onLambda)
				}),
			file,
			$elm$core$Maybe$Nothing);
	});
var $author$project$ASTUtil$PatternOptimizer$emptyRange = {
	bH: {W: 0, C: 0},
	J: {W: 0, C: 0}
};
var $author$project$ASTUtil$PatternOptimizer$isAllPattern = function (p) {
	var _v0 = $stil4m$elm_syntax$Elm$Syntax$Node$value(p);
	if (!_v0.$) {
		return true;
	} else {
		return false;
	}
};
var $author$project$ASTUtil$PatternOptimizer$optimize = F2(
	function (range, input) {
		var r = input.a;
		var pattern = input.b;
		if (_Utils_eq(r, range)) {
			return A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, $author$project$ASTUtil$PatternOptimizer$emptyRange, $stil4m$elm_syntax$Elm$Syntax$Pattern$AllPattern);
		} else {
			switch (pattern.$) {
				case 7:
					var xs = pattern.a;
					var cleaned = A2(
						$elm$core$List$map,
						$author$project$ASTUtil$PatternOptimizer$optimize(range),
						xs);
					return A2($elm$core$List$all, $author$project$ASTUtil$PatternOptimizer$isAllPattern, cleaned) ? A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, $author$project$ASTUtil$PatternOptimizer$emptyRange, $stil4m$elm_syntax$Elm$Syntax$Pattern$AllPattern) : A2(
						$stil4m$elm_syntax$Elm$Syntax$Node$Node,
						r,
						$stil4m$elm_syntax$Elm$Syntax$Pattern$TuplePattern(cleaned));
				case 8:
					var inner = pattern.a;
					var cleaned = A2(
						$elm$core$List$filter,
						A2(
							$elm$core$Basics$composeR,
							$stil4m$elm_syntax$Elm$Syntax$Node$range,
							$elm$core$Basics$neq(range)),
						inner);
					if (!cleaned.b) {
						return A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, $author$project$ASTUtil$PatternOptimizer$emptyRange, $stil4m$elm_syntax$Elm$Syntax$Pattern$AllPattern);
					} else {
						var xs = cleaned;
						return A2(
							$stil4m$elm_syntax$Elm$Syntax$Node$Node,
							r,
							$stil4m$elm_syntax$Elm$Syntax$Pattern$RecordPattern(xs));
					}
				case 9:
					var left = pattern.a;
					var right = pattern.b;
					return A2(
						$stil4m$elm_syntax$Elm$Syntax$Node$Node,
						r,
						A2(
							$stil4m$elm_syntax$Elm$Syntax$Pattern$UnConsPattern,
							A2($author$project$ASTUtil$PatternOptimizer$optimize, range, left),
							A2($author$project$ASTUtil$PatternOptimizer$optimize, range, right)));
				case 10:
					var xs = pattern.a;
					return A2(
						$stil4m$elm_syntax$Elm$Syntax$Node$Node,
						r,
						$stil4m$elm_syntax$Elm$Syntax$Pattern$ListPattern(
							A2(
								$elm$core$List$map,
								$author$project$ASTUtil$PatternOptimizer$optimize(range),
								xs)));
				case 12:
					var qnr = pattern.a;
					var inner = pattern.b;
					return A2(
						$stil4m$elm_syntax$Elm$Syntax$Node$Node,
						r,
						A2(
							$stil4m$elm_syntax$Elm$Syntax$Pattern$NamedPattern,
							qnr,
							A2(
								$elm$core$List$map,
								$author$project$ASTUtil$PatternOptimizer$optimize(range),
								inner)));
				case 13:
					var subPattern = pattern.a;
					var asPointer = pattern.b;
					if (_Utils_eq(
						$stil4m$elm_syntax$Elm$Syntax$Node$range(asPointer),
						range)) {
						return subPattern;
					} else {
						var _v2 = A2($author$project$ASTUtil$PatternOptimizer$optimize, range, subPattern);
						if (!_v2.b.$) {
							var _v3 = _v2.b;
							return A2(
								$stil4m$elm_syntax$Elm$Syntax$Node$Node,
								$stil4m$elm_syntax$Elm$Syntax$Node$range(asPointer),
								$stil4m$elm_syntax$Elm$Syntax$Pattern$VarPattern(
									$stil4m$elm_syntax$Elm$Syntax$Node$value(asPointer)));
						} else {
							var other = _v2;
							return A2(
								$stil4m$elm_syntax$Elm$Syntax$Node$Node,
								r,
								A2($stil4m$elm_syntax$Elm$Syntax$Pattern$AsPattern, other, asPointer));
						}
					}
				case 14:
					var inner = pattern.a;
					return A2(
						$stil4m$elm_syntax$Elm$Syntax$Node$Node,
						r,
						$stil4m$elm_syntax$Elm$Syntax$Pattern$ParenthesizedPattern(
							A2($author$project$ASTUtil$PatternOptimizer$optimize, range, inner)));
				case 11:
					return input;
				case 0:
					return input;
				case 1:
					return input;
				case 2:
					return input;
				case 3:
					return input;
				case 4:
					return input;
				case 5:
					return input;
				default:
					return input;
			}
		}
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $stil4m$structured_writer$StructuredWriter$asIndent = function (amount) {
	return A2($elm$core$String$repeat, amount, ' ');
};
var $stil4m$structured_writer$StructuredWriter$writeIndented = F2(
	function (indent_, w) {
		switch (w.$) {
			case 0:
				var _v1 = w.a;
				var pre = _v1.a;
				var sep = _v1.b;
				var post = _v1.c;
				var differentLines = w.b;
				var items = w.c;
				var seperator = differentLines ? ('\n' + ($stil4m$structured_writer$StructuredWriter$asIndent(indent_) + sep)) : sep;
				return $elm$core$String$concat(
					_List_fromArray(
						[
							pre,
							A2(
							$elm$core$String$join,
							seperator,
							A2(
								$elm$core$List$map,
								A2(
									$elm$core$Basics$composeR,
									$elm$core$Basics$identity,
									$stil4m$structured_writer$StructuredWriter$writeIndented(indent_)),
								items)),
							post
						]));
			case 1:
				var items = w.a;
				return A2(
					$elm$core$String$join,
					'\n' + $stil4m$structured_writer$StructuredWriter$asIndent(indent_),
					A2(
						$elm$core$List$concatMap,
						A2(
							$elm$core$Basics$composeR,
							$stil4m$structured_writer$StructuredWriter$writeIndented(0),
							$elm$core$String$split('\n')),
						items));
			case 2:
				var s = w.a;
				return s;
			case 4:
				var n = w.a;
				var next = w.b;
				return _Utils_ap(
					$stil4m$structured_writer$StructuredWriter$asIndent(n + indent_),
					A2($stil4m$structured_writer$StructuredWriter$writeIndented, n + indent_, next));
			case 5:
				var items = w.a;
				return A2(
					$elm$core$String$join,
					' ',
					A2(
						$elm$core$List$map,
						$stil4m$structured_writer$StructuredWriter$writeIndented(indent_),
						items));
			case 6:
				var items = w.a;
				return $elm$core$String$concat(
					A2(
						$elm$core$List$map,
						$stil4m$structured_writer$StructuredWriter$writeIndented(indent_),
						items));
			default:
				var x = w.a;
				var y = w.b;
				return _Utils_ap(
					A2($stil4m$structured_writer$StructuredWriter$writeIndented, indent_, x),
					A2($stil4m$structured_writer$StructuredWriter$writeIndented, indent_, y));
		}
	});
var $stil4m$structured_writer$StructuredWriter$write = $stil4m$structured_writer$StructuredWriter$writeIndented(0);
var $stil4m$elm_syntax$Elm$Writer$write = $stil4m$structured_writer$StructuredWriter$write;
var $stil4m$structured_writer$StructuredWriter$Sep = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $stil4m$structured_writer$StructuredWriter$bracesComma = $stil4m$structured_writer$StructuredWriter$Sep(
	_Utils_Tuple3('{', ', ', '}'));
var $stil4m$structured_writer$StructuredWriter$bracketsComma = $stil4m$structured_writer$StructuredWriter$Sep(
	_Utils_Tuple3('[', ', ', ']'));
var $elm$core$String$fromFloat = _String_fromNumber;
var $stil4m$structured_writer$StructuredWriter$Joined = function (a) {
	return {$: 6, a: a};
};
var $stil4m$structured_writer$StructuredWriter$join = $stil4m$structured_writer$StructuredWriter$Joined;
var $stil4m$structured_writer$StructuredWriter$parensComma = $stil4m$structured_writer$StructuredWriter$Sep(
	_Utils_Tuple3('(', ', ', ')'));
var $stil4m$structured_writer$StructuredWriter$Spaced = function (a) {
	return {$: 5, a: a};
};
var $stil4m$structured_writer$StructuredWriter$spaced = $stil4m$structured_writer$StructuredWriter$Spaced;
var $stil4m$structured_writer$StructuredWriter$Str = function (a) {
	return {$: 2, a: a};
};
var $stil4m$structured_writer$StructuredWriter$string = $stil4m$structured_writer$StructuredWriter$Str;
var $elm$core$Basics$modBy = _Basics_modBy;
var $rtfeldman$elm_hex$Hex$unsafeToDigit = function (num) {
	unsafeToDigit:
	while (true) {
		switch (num) {
			case 0:
				return '0';
			case 1:
				return '1';
			case 2:
				return '2';
			case 3:
				return '3';
			case 4:
				return '4';
			case 5:
				return '5';
			case 6:
				return '6';
			case 7:
				return '7';
			case 8:
				return '8';
			case 9:
				return '9';
			case 10:
				return 'a';
			case 11:
				return 'b';
			case 12:
				return 'c';
			case 13:
				return 'd';
			case 14:
				return 'e';
			case 15:
				return 'f';
			default:
				var $temp$num = num;
				num = $temp$num;
				continue unsafeToDigit;
		}
	}
};
var $rtfeldman$elm_hex$Hex$unsafePositiveToDigits = F2(
	function (digits, num) {
		unsafePositiveToDigits:
		while (true) {
			if (num < 16) {
				return A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(num),
					digits);
			} else {
				var $temp$digits = A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(
						A2($elm$core$Basics$modBy, 16, num)),
					digits),
					$temp$num = (num / 16) | 0;
				digits = $temp$digits;
				num = $temp$num;
				continue unsafePositiveToDigits;
			}
		}
	});
var $rtfeldman$elm_hex$Hex$toString = function (num) {
	return $elm$core$String$fromList(
		(num < 0) ? A2(
			$elm$core$List$cons,
			'-',
			A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, num));
};
var $stil4m$elm_syntax$Elm$Writer$writeModuleName = function (moduleName) {
	return $stil4m$structured_writer$StructuredWriter$string(
		A2($elm$core$String$join, '.', moduleName));
};
var $stil4m$elm_syntax$Elm$Writer$writeQualifiedNameRef = function (_v0) {
	var moduleName = _v0.a_;
	var name = _v0.f8;
	if (!moduleName.b) {
		return $stil4m$structured_writer$StructuredWriter$string(name);
	} else {
		return $stil4m$structured_writer$StructuredWriter$join(
			_List_fromArray(
				[
					$stil4m$elm_syntax$Elm$Writer$writeModuleName(moduleName),
					$stil4m$structured_writer$StructuredWriter$string('.'),
					$stil4m$structured_writer$StructuredWriter$string(name)
				]));
	}
};
var $stil4m$elm_syntax$Elm$Writer$writePattern = function (_v0) {
	var p = _v0.b;
	switch (p.$) {
		case 0:
			return $stil4m$structured_writer$StructuredWriter$string('_');
		case 1:
			return $stil4m$structured_writer$StructuredWriter$string('()');
		case 2:
			var c = p.a;
			return $stil4m$structured_writer$StructuredWriter$string(
				'\'' + ($elm$core$String$fromList(
					_List_fromArray(
						[c])) + '\''));
		case 3:
			var s = p.a;
			return $stil4m$structured_writer$StructuredWriter$string(s);
		case 5:
			var h = p.a;
			return $stil4m$structured_writer$StructuredWriter$join(
				_List_fromArray(
					[
						$stil4m$structured_writer$StructuredWriter$string('0x'),
						$stil4m$structured_writer$StructuredWriter$string(
						$rtfeldman$elm_hex$Hex$toString(h))
					]));
		case 4:
			var i = p.a;
			return $stil4m$structured_writer$StructuredWriter$string(
				$elm$core$String$fromInt(i));
		case 6:
			var f = p.a;
			return $stil4m$structured_writer$StructuredWriter$string(
				$elm$core$String$fromFloat(f));
		case 7:
			var inner = p.a;
			return A2(
				$stil4m$structured_writer$StructuredWriter$parensComma,
				false,
				A2($elm$core$List$map, $stil4m$elm_syntax$Elm$Writer$writePattern, inner));
		case 8:
			var inner = p.a;
			return A2(
				$stil4m$structured_writer$StructuredWriter$bracesComma,
				false,
				A2(
					$elm$core$List$map,
					A2($elm$core$Basics$composeR, $stil4m$elm_syntax$Elm$Syntax$Node$value, $stil4m$structured_writer$StructuredWriter$string),
					inner));
		case 9:
			var left = p.a;
			var right = p.b;
			return $stil4m$structured_writer$StructuredWriter$spaced(
				_List_fromArray(
					[
						$stil4m$elm_syntax$Elm$Writer$writePattern(left),
						$stil4m$structured_writer$StructuredWriter$string('::'),
						$stil4m$elm_syntax$Elm$Writer$writePattern(right)
					]));
		case 10:
			var inner = p.a;
			return A2(
				$stil4m$structured_writer$StructuredWriter$bracketsComma,
				false,
				A2($elm$core$List$map, $stil4m$elm_syntax$Elm$Writer$writePattern, inner));
		case 11:
			var _var = p.a;
			return $stil4m$structured_writer$StructuredWriter$string(_var);
		case 12:
			var qnr = p.a;
			var others = p.b;
			return $stil4m$structured_writer$StructuredWriter$spaced(
				_List_fromArray(
					[
						$stil4m$elm_syntax$Elm$Writer$writeQualifiedNameRef(qnr),
						$stil4m$structured_writer$StructuredWriter$spaced(
						A2($elm$core$List$map, $stil4m$elm_syntax$Elm$Writer$writePattern, others))
					]));
		case 13:
			var innerPattern = p.a;
			var asName = p.b;
			return $stil4m$structured_writer$StructuredWriter$spaced(
				_List_fromArray(
					[
						$stil4m$elm_syntax$Elm$Writer$writePattern(innerPattern),
						$stil4m$structured_writer$StructuredWriter$string('as'),
						$stil4m$structured_writer$StructuredWriter$string(
						$stil4m$elm_syntax$Elm$Syntax$Node$value(asName))
					]));
		default:
			var innerPattern = p.a;
			return $stil4m$structured_writer$StructuredWriter$spaced(
				_List_fromArray(
					[
						$stil4m$structured_writer$StructuredWriter$string('('),
						$stil4m$elm_syntax$Elm$Writer$writePattern(innerPattern),
						$stil4m$structured_writer$StructuredWriter$string(')')
					]));
	}
};
var $author$project$Analyser$Fixes$UnusedPatternVariable$fixPattern = F2(
	function (_v0, range) {
		var content = _v0.a;
		var ast = _v0.b;
		var _v1 = A2($author$project$ASTUtil$Patterns$findParentPattern, ast, range);
		if (!_v1.$) {
			var parentPattern = _v1.a;
			return $author$project$Analyser$Fixes$Base$Patched(
				A3(
					$author$project$Analyser$Fixes$FileContent$replaceRangeWith,
					$stil4m$elm_syntax$Elm$Syntax$Node$range(parentPattern),
					$stil4m$elm_syntax$Elm$Writer$write(
						$stil4m$elm_syntax$Elm$Writer$writePattern(
							A2($author$project$ASTUtil$PatternOptimizer$optimize, range, parentPattern))),
					content));
		} else {
			return $author$project$Analyser$Fixes$Base$Error('Could not find location to replace unused variable in pattern');
		}
	});
var $author$project$Analyser$Fixes$UnusedPatternVariable$fix = F2(
	function (input, messageData) {
		var _v0 = A2($author$project$Analyser$Messages$Data$getRange, 'range', messageData);
		if (!_v0.$) {
			var range = _v0.a;
			return A2($author$project$Analyser$Fixes$UnusedPatternVariable$fixPattern, input, range);
		} else {
			return $author$project$Analyser$Fixes$Base$IncompatibleData;
		}
	});
var $author$project$Analyser$Fixes$UnusedPatternVariable$fixer = A3($author$project$Analyser$Fixes$Base$Fixer, $author$project$Analyser$Checks$UnusedPatternVariable$checker.fX.f0, $author$project$Analyser$Fixes$UnusedPatternVariable$fix, 'Optimize pattern and format');
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
				if (x.$ === 2) {
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
			$stil4m$elm_syntax$Elm$Syntax$Node$value(typeAlias.f8),
			_Utils_Tuple3(
				$stil4m$elm_syntax$Elm$Syntax$Node$value(typeAlias.f8),
				range,
				0),
			context);
	});
var $author$project$Analyser$Checks$UnusedTypeAlias$onTypeAnnotation = F2(
	function (_v0, context) {
		var typeAnnotation = _v0.b;
		if ((typeAnnotation.$ === 1) && (!typeAnnotation.a.b.a.b)) {
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
					dq: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedTypeAlias$onTypeAlias)
				}),
			fileContext.fe,
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
								return A2($stil4m$elm_syntax$Elm$Interface$exposesAlias, a, fileContext.fZ);
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
										dd: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedTypeAlias$onFunctionOrValue),
										dr: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedTypeAlias$onTypeAnnotation)
									}),
								fileContext.fe,
								collectedAliased))))));
	});
var $author$project$Analyser$Checks$UnusedTypeAlias$checker = {
	fo: $author$project$Analyser$Checks$UnusedTypeAlias$scan,
	fX: {
		fD: 'You defined a type alias, but you do not use it in any signature or expose it.',
		f0: 'UnusedTypeAlias',
		f8: 'Unused Type Alias',
		gs: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'range',
			A2($author$project$Analyser$Messages$Schema$varProp, 'varName', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$Analyser$Fixes$UnusedTypeAlias$findTypeAlias = F2(
	function (range, file) {
		return $elm$core$List$head(
			A2(
				$elm$core$List$filterMap,
				function (_v0) {
					var r = _v0.a;
					var decl = _v0.b;
					if (decl.$ === 1) {
						var typeAlias = decl.a;
						return _Utils_eq(r, range) ? $elm$core$Maybe$Just(
							A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, typeAlias)) : $elm$core$Maybe$Nothing;
					} else {
						return $elm$core$Maybe$Nothing;
					}
				},
				file.dY));
	});
var $author$project$Analyser$Fixes$UnusedTypeAlias$removeTypeAlias = F2(
	function (_v0, content) {
		var range = _v0.a;
		var typeAlias = _v0.b;
		var start = A2(
			$elm$core$Maybe$withDefault,
			range.J,
			A2(
				$elm$core$Maybe$map,
				A2(
					$elm$core$Basics$composeR,
					$stil4m$elm_syntax$Elm$Syntax$Node$range,
					function ($) {
						return $.J;
					}),
				typeAlias.fG));
		var end = range.bH;
		return A3(
			$author$project$Analyser$Fixes$FileContent$replaceRangeWith,
			A2($stil4m$elm_syntax$Elm$Syntax$Range$Range, start, end),
			'',
			content);
	});
var $author$project$Analyser$Fixes$UnusedTypeAlias$findAndRemoveTypeAlias = F2(
	function (_v0, range) {
		var content = _v0.a;
		var file = _v0.b;
		return A2(
			$elm$core$Maybe$map,
			function (typeAlias) {
				return A2($author$project$Analyser$Fixes$UnusedTypeAlias$removeTypeAlias, typeAlias, content);
			},
			A2($author$project$Analyser$Fixes$UnusedTypeAlias$findTypeAlias, range, file));
	});
var $author$project$Analyser$Fixes$UnusedTypeAlias$fix = F2(
	function (input, messageData) {
		var _v0 = A2($author$project$Analyser$Messages$Data$getRange, 'range', messageData);
		if (!_v0.$) {
			var range = _v0.a;
			return A2(
				$elm$core$Maybe$withDefault,
				$author$project$Analyser$Fixes$Base$Error('Could not find type alias'),
				A2(
					$elm$core$Maybe$map,
					$author$project$Analyser$Fixes$Base$Patched,
					A2($author$project$Analyser$Fixes$UnusedTypeAlias$findAndRemoveTypeAlias, input, range)));
		} else {
			return $author$project$Analyser$Fixes$Base$IncompatibleData;
		}
	});
var $author$project$Analyser$Fixes$UnusedTypeAlias$fixer = A3($author$project$Analyser$Fixes$Base$Fixer, $author$project$Analyser$Checks$UnusedTypeAlias$checker.fX.f0, $author$project$Analyser$Fixes$UnusedTypeAlias$fix, 'Remove type alias and format');
var $author$project$Analyser$Fixers$all = _List_fromArray(
	[$author$project$Analyser$Fixes$UnnecessaryParens$fixer, $author$project$Analyser$Fixes$UnusedImport$fixer, $author$project$Analyser$Fixes$UnusedImportedVariable$fixer, $author$project$Analyser$Fixes$UnusedImportAlias$fixer, $author$project$Analyser$Fixes$UnusedPatternVariable$fixer, $author$project$Analyser$Fixes$UnusedTypeAlias$fixer, $author$project$Analyser$Fixes$MultiLineRecordFormatting$fixer, $author$project$Analyser$Fixes$DropConsOfItemAndList$fixer, $author$project$Analyser$Fixes$DuplicateImport$fixer]);
var $author$project$Analyser$Fixers$getFixer = function (m) {
	return $elm$core$List$head(
		A2(
			$elm$core$List$filter,
			function (x) {
				return _Utils_eq(x.fk, m.gJ);
			},
			$author$project$Analyser$Fixers$all));
};
var $author$project$Analyser$Fixer$loadFileContentWithSha = _Platform_outgoingPort('loadFileContentWithSha', $elm$json$Json$Encode$string);
var $author$project$Analyser$State$Fixing = 1;
var $author$project$Analyser$Messages$Types$Blocked = 1;
var $author$project$Analyser$Messages$Util$blockForShas = F2(
	function (sha, message) {
		return _Utils_eq(message.d5.p, sha) ? _Utils_update(
			message,
			{gy: 1}) : message;
	});
var $author$project$Analyser$Messages$Types$Fixing = 2;
var $author$project$Analyser$Messages$Util$markFixing = F2(
	function (x, message) {
		return _Utils_eq(message.fU, x) ? _Utils_update(
			message,
			{gy: 2}) : message;
	});
var $author$project$Analyser$State$startFixing = F2(
	function (message, state) {
		return _Utils_update(
			state,
			{
				es: A2(
					$elm$core$List$map,
					$author$project$Analyser$Messages$Util$markFixing(message.fU),
					A2(
						$elm$core$List$map,
						$author$project$Analyser$Messages$Util$blockForShas(message.d5.p),
						state.es)),
				gy: 1
			});
	});
var $author$project$Analyser$Fixer$initWithMessage = F2(
	function (mess, state) {
		return A2(
			$elm$core$Maybe$map,
			function (fixer) {
				return _Utils_Tuple3(
					{ap: false, bK: fixer, ac: mess, gB: true},
					$author$project$Analyser$Fixer$loadFileContentWithSha(mess.d5.ci),
					A2($author$project$Analyser$State$startFixing, mess, state));
			},
			$author$project$Analyser$Fixers$getFixer(mess));
	});
var $author$project$Analyser$Fixer$init = F2(
	function (x, state) {
		return A2(
			$elm$core$Maybe$andThen,
			function (a) {
				return A2($author$project$Analyser$Fixer$initWithMessage, a, state);
			},
			A2($author$project$Analyser$State$getMessage, x, state));
	});
var $elm$core$Platform$Cmd$map = _Platform_map;
var $author$project$Analyser$State$nextTask = function (state) {
	var _v0 = state.ag;
	if (!_v0.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		var x = _v0.a;
		var xs = _v0.b;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(
				_Utils_update(
					state,
					{ag: xs}),
				x));
	}
};
var $author$project$Analyser$handleNextStep = function (input) {
	var model = input.a;
	var cmds = input.b;
	var _v0 = model.j;
	if (_v0.$ === 4) {
		var _v1 = $author$project$Analyser$State$nextTask(model.k);
		if (_v1.$ === 1) {
			return input;
		} else {
			var _v2 = _v1.a;
			var newState = _v2.a;
			var taskId = _v2.b;
			var _v3 = A2($author$project$Analyser$Fixer$init, taskId, newState);
			if (_v3.$ === 1) {
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{k: newState}),
					$author$project$Util$Logger$info(
						'Could not fix message: \'' + ($elm$core$String$fromInt(taskId) + '\'.')));
			} else {
				var _v4 = _v3.a;
				var fixerModel = _v4.a;
				var fixerCmds = _v4.b;
				var newState2 = _v4.c;
				return $author$project$Analyser$doSendState(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								j: $author$project$Analyser$FixerStage(fixerModel),
								k: newState2
							}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									cmds,
									A2($elm$core$Platform$Cmd$map, $author$project$Analyser$FixerMsg, fixerCmds)
								]))));
			}
		}
	} else {
		return input;
	}
};
var $author$project$Analyser$State$Dependencies$Unknown = 3;
var $author$project$Analyser$State$Dependencies$MajorBehind = 1;
var $author$project$Analyser$State$Dependencies$UpToDate = 0;
var $author$project$Analyser$State$Dependencies$Upgradable = 2;
var $author$project$Registry$Version$isMajorUpgrade = F2(
	function (_v0, _v1) {
		var a = _v0.a;
		var b = _v1.a;
		return _Utils_cmp(a, b) < 0;
	});
var $elm_community$list_extra$List$Extra$last = function (items) {
	last:
	while (true) {
		if (!items.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!items.b.b) {
				var x = items.a;
				return $elm$core$Maybe$Just(x);
			} else {
				var rest = items.b;
				var $temp$items = rest;
				items = $temp$items;
				continue last;
			}
		}
	}
};
var $author$project$Registry$Version$order = F2(
	function (_v0, _v1) {
		var a = _v0.a;
		var b = _v0.b;
		var c = _v0.c;
		var x = _v1.a;
		var y = _v1.b;
		var z = _v1.c;
		return (!_Utils_eq(a, x)) ? A2($elm$core$Basics$compare, a, x) : ((!_Utils_eq(b, y)) ? A2($elm$core$Basics$compare, b, y) : A2($elm$core$Basics$compare, c, z));
	});
var $author$project$Registry$Package$newestVersion = function (p) {
	return $elm_community$list_extra$List$Extra$last(
		A2($elm$core$List$sortWith, $author$project$Registry$Version$order, p.dM));
};
var $author$project$Analyser$State$Dependencies$computeVersionState = F3(
	function (mode, dep, pack) {
		var _v0 = $author$project$Registry$Version$fromString(dep.p);
		if (_v0.$ === 1) {
			return 3;
		} else {
			var current = _v0.a;
			var _v1 = $author$project$Registry$Package$newestVersion(pack);
			if (_v1.$ === 1) {
				return 3;
			} else {
				var newest = _v1.a;
				if (_Utils_eq(current, newest)) {
					return 0;
				} else {
					if (A2($author$project$Registry$Version$isMajorUpgrade, current, newest)) {
						return 1;
					} else {
						if (mode === 1) {
							return 2;
						} else {
							return 0;
						}
					}
				}
			}
		}
	});
var $author$project$Registry$lookup = F2(
	function (key, _v0) {
		var values = _v0;
		return A2(
			$elm$core$Maybe$andThen,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$List$filter(
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.f8;
						},
						$elm$core$Basics$eq(key))),
				$elm$core$List$head),
			$elm$core$Result$toMaybe(values));
	});
var $author$project$Analyser$State$Dependencies$dependencyInfo = F3(
	function (mode, dep, registry) {
		var _package = A2($author$project$Registry$lookup, dep.f8, registry);
		var versionState = A2(
			$elm$core$Maybe$withDefault,
			3,
			A2(
				$elm$core$Maybe$map,
				A2($author$project$Analyser$State$Dependencies$computeVersionState, mode, dep),
				_package));
		return {y: dep, ds: _package, dL: versionState};
	});
var $author$project$Analyser$State$Dependencies$init = F4(
	function (mode, unused, dependencies, registry) {
		return {
			b_: mode,
			gM: unused,
			gP: $elm$core$Dict$fromList(
				A2(
					$elm$core$List$map,
					function (dep) {
						return _Utils_Tuple2(
							dep.f8,
							A3($author$project$Analyser$State$Dependencies$dependencyInfo, mode, dep, registry));
					},
					dependencies))
		};
	});
var $author$project$Analyser$Configuration$isPathExcluded = F2(
	function (p, _v0) {
		var excludedPaths = _v0.cY;
		return A2(
			$elm$core$List$any,
			function (a) {
				return A2($elm$core$String$startsWith, a, p);
			},
			excludedPaths);
	});
var $author$project$Analyser$isSourceFileIncluded = function (configuration) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$Tuple$first,
		A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.ci;
			},
			A2(
				$elm$core$Basics$composeR,
				function (a) {
					return A2($author$project$Analyser$Configuration$isPathExcluded, a, configuration);
				},
				$elm$core$Basics$not)));
};
var $author$project$Analyser$SourceLoadingStage$parsedFiles = function (_v0) {
	var model = _v0;
	return model.aB;
};
var $author$project$Analyser$Messages$Data$ErrorMessageV = function (a) {
	return {$: 5, a: a};
};
var $author$project$Analyser$Messages$Data$addErrorMessage = F3(
	function (k, v, _v0) {
		var desc = _v0.a;
		var d = _v0.b;
		return A2(
			$author$project$Analyser$Messages$Data$MessageData,
			desc,
			A3(
				$elm$core$Dict$insert,
				k,
				$author$project$Analyser$Messages$Data$ErrorMessageV(v),
				d));
	});
var $author$project$Analyser$Checks$BooleanCase$isBooleanCase = function (_v0) {
	var _v1 = _v0.a;
	var pattern = _v1.b;
	if ((pattern.$ === 12) && (!pattern.b.b)) {
		var qnr = pattern.a;
		return _Utils_eq(qnr.a_, _List_Nil) && ((qnr.f8 === 'True') || (qnr.f8 === 'False'));
	} else {
		return false;
	}
};
var $author$project$Analyser$Checks$BooleanCase$onExpression = F2(
	function (_v0, context) {
		var r = _v0.a;
		var inner = _v0.b;
		if (inner.$ === 16) {
			var caseExpression = inner.a;
			return A2($elm$core$List$any, $author$project$Analyser$Checks$BooleanCase$isBooleanCase, caseExpression.fm) ? A2(
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
					da: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$BooleanCase$onExpression)
				}),
			fileContext.fe,
			_List_Nil);
	});
var $author$project$Analyser$Checks$BooleanCase$checker = {
	fo: $author$project$Analyser$Checks$BooleanCase$scan,
	fX: {
		fD: 'If you case over a boolean value, it maybe better to use an if expression.',
		f0: 'BooleanCase',
		f8: 'Boolean Case Expression',
		gs: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
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
		if (expression.$ === 3) {
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
					da: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$DebugCrash$onExpression)
				}),
			fileContext.fe,
			_List_Nil);
	});
var $author$project$Analyser$Checks$DebugCrash$checker = {
	fo: $author$project$Analyser$Checks$DebugCrash$scan,
	fX: {
		fD: 'You may not want to ship this to your end users.',
		f0: 'DebugTodo',
		f8: 'Debug Todo',
		gs: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
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
		if (expression.$ === 3) {
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
					da: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$DebugLog$onExpression)
				}),
			fileContext.fe,
			_List_Nil);
	});
var $author$project$Analyser$Checks$DebugLog$checker = {
	fo: $author$project$Analyser$Checks$DebugLog$scan,
	fX: {
		fD: 'This is nice for development, but you do not want to ship this to package users or your end users.',
		f0: 'DebugLog',
		f8: 'Debug Log',
		gs: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$DropConcatOfLists$onExpression = F2(
	function (_v0, context) {
		var r = _v0.a;
		var inner = _v0.b;
		if ((((inner.$ === 2) && (inner.a === '++')) && (inner.c.b.$ === 19)) && (inner.d.b.$ === 19)) {
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
					da: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$DropConcatOfLists$onExpression)
				}),
			fileContext.fe,
			_List_Nil);
	});
var $author$project$Analyser$Checks$DropConcatOfLists$checker = {
	fo: $author$project$Analyser$Checks$DropConcatOfLists$scan,
	fX: {
		fD: 'If you concatenate two lists ([...] ++ [...]), then you can merge them into one list.',
		f0: 'DropConcatOfLists',
		f8: 'Drop Concat Of Lists',
		gs: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
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
				case 3:
					var s = t.a;
					return s.f8;
				case 0:
					var s = t.a;
					return s;
				case 1:
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
			var _v0 = imp.bI;
			if (_v0.$ === 1) {
				return _List_Nil;
			} else {
				if (!_v0.a.b.$) {
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
				fu: A3(
					$elm$core$Dict$update,
					$stil4m$elm_syntax$Elm$Syntax$Node$value(imp.a_),
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Maybe$withDefault($elm$core$Dict$empty),
						A2(
							$elm$core$Basics$composeR,
							$author$project$Analyser$Checks$DuplicateImportedVariable$mergeImportedValue(cs),
							$elm$core$Maybe$Just)),
					context.fu),
				aO: A3(
					$elm$core$Dict$update,
					$stil4m$elm_syntax$Elm$Syntax$Node$value(imp.a_),
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Maybe$withDefault($elm$core$Dict$empty),
						A2(
							$elm$core$Basics$composeR,
							$author$project$Analyser$Checks$DuplicateImportedVariable$mergeImportedValue(vs),
							$elm$core$Maybe$Just)),
					context.aO)
			});
	});
var $author$project$Analyser$Checks$DuplicateImportedVariable$scan = F2(
	function (fileContext, _v0) {
		var result = A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					dc: $author$project$ASTUtil$Inspector$Skip,
					df: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$DuplicateImportedVariable$onImport)
				}),
			fileContext.fe,
			{fu: $elm$core$Dict$empty, aO: $elm$core$Dict$empty});
		return A2(
			$elm$core$List$map,
			$author$project$Analyser$Checks$DuplicateImportedVariable$asMessageData,
			_Utils_ap(
				$author$project$Analyser$Checks$DuplicateImportedVariable$findViolations(result.aO),
				$author$project$Analyser$Checks$DuplicateImportedVariable$findViolations(result.fu)));
	});
var $author$project$Analyser$Checks$DuplicateImportedVariable$checker = {
	fo: $author$project$Analyser$Checks$DuplicateImportedVariable$scan,
	fX: {
		fD: 'Importing a variable twice from the same module is noise. Remove this.',
		f0: 'DuplicateImportedVariable',
		f8: 'Duplicate Imported Variable',
		gs: A2(
			$author$project$Analyser$Messages$Schema$moduleProp,
			'moduleName',
			A2(
				$author$project$Analyser$Messages$Schema$varProp,
				'varName',
				A2($author$project$Analyser$Messages$Schema$rangeListProp, 'ranges', $author$project$Analyser$Messages$Schema$schema)))
	}
};
var $author$project$Analyser$Checks$ExposeAll$onFile = F3(
	function (_v0, file, _v1) {
		var _v2 = $stil4m$elm_syntax$Elm$Syntax$Module$exposingList(
			$stil4m$elm_syntax$Elm$Syntax$Node$value(file.f6));
		if (!_v2.$) {
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
					db: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$ExposeAll$onFile)
				}),
			fileContext.fe,
			_List_Nil);
	});
var $author$project$Analyser$Checks$ExposeAll$checker = {
	fo: $author$project$Analyser$Checks$ExposeAll$scan,
	fX: {
		fD: 'You want to be clear about the API that a module defines.',
		f0: 'ExposeAll',
		f8: 'Expose All',
		gs: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$FunctionInLet$asMessage = function (_v0) {
	var declaration = _v0.fx;
	var range = $stil4m$elm_syntax$Elm$Syntax$Node$range(
		$stil4m$elm_syntax$Elm$Syntax$Node$value(declaration).f8);
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
	if (typeAnnotation.$ === 6) {
		return true;
	} else {
		return false;
	}
};
var $author$project$ASTUtil$Functions$isFunctionSignature = function (_v0) {
	var typeAnnotation = _v0.gI;
	return $author$project$ASTUtil$Functions$isFunctionTypeAnnotation(
		$stil4m$elm_syntax$Elm$Syntax$Node$value(typeAnnotation));
};
var $author$project$ASTUtil$Functions$isStatic = function (_function) {
	var decl = $stil4m$elm_syntax$Elm$Syntax$Node$value(_function.fx);
	return ($elm$core$List$length(decl.fc) > 0) ? false : A2(
		$elm$core$Maybe$withDefault,
		true,
		A2(
			$elm$core$Maybe$map,
			A2(
				$elm$core$Basics$composeR,
				$stil4m$elm_syntax$Elm$Syntax$Node$value,
				A2($elm$core$Basics$composeR, $author$project$ASTUtil$Functions$isFunctionSignature, $elm$core$Basics$not)),
			_function.gu));
};
var $author$project$Analyser$Checks$FunctionInLet$onFunction = F2(
	function (_v0, context) {
		var _function = _v0.b;
		var isStatic = $author$project$ASTUtil$Functions$isStatic(_function);
		return ((!isStatic) && context.au) ? _Utils_update(
			context,
			{
				aP: A2($elm$core$List$cons, _function, context.aP)
			}) : context;
	});
var $author$project$Analyser$Checks$FunctionInLet$onLetBlock = F3(
	function (_continue, _v0, context) {
		return function (after) {
			return _Utils_update(
				after,
				{au: context.au});
		}(
			_continue(
				_Utils_update(
					context,
					{au: true})));
	});
var $author$project$Analyser$Checks$FunctionInLet$startingContext = {aP: _List_Nil, au: false};
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
						dc: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$FunctionInLet$onFunction),
						di: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$FunctionInLet$onLetBlock)
					}),
				fileContext.fe,
				$author$project$Analyser$Checks$FunctionInLet$startingContext).aP);
	});
var $author$project$Analyser$Checks$FunctionInLet$checker = {
	fo: $author$project$Analyser$Checks$FunctionInLet$scan,
	fX: {
		fD: 'In a let statement you can define variables and functions in their own scope. But you are already in the scope of a module. Just define the functions you want on a top-level. There is no not much need to define functions in let statements.',
		f0: 'FunctionInLet',
		f8: 'Function In Let',
		gs: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$ImportAll$onImport = F2(
	function (_v0, context) {
		var imp = _v0.b;
		return function (a) {
			return A2($elm$core$List$append, a, context);
		}(
			function () {
				var _v1 = imp.bI;
				if (_v1.$ === 1) {
					return _List_Nil;
				} else {
					if (!_v1.a.b.$) {
						var _v2 = _v1.a;
						var range = _v2.b.a;
						var r = range;
						return _List_fromArray(
							[
								A3(
								$author$project$Analyser$Messages$Data$addModuleName,
								'moduleName',
								$stil4m$elm_syntax$Elm$Syntax$Node$value(imp.a_),
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
													$stil4m$elm_syntax$Elm$Syntax$Node$value(imp.a_)),
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
					df: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$ImportAll$onImport)
				}),
			fileContext.fe,
			_List_Nil);
	});
var $author$project$Analyser$Checks$ImportAll$checker = {
	fo: $author$project$Analyser$Checks$ImportAll$scan,
	fX: {
		fD: 'When other people read your code, it would be nice if the origin of a used function can be traced back to the providing module.',
		f0: 'ImportAll',
		f8: 'Import All',
		gs: A2(
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
var $author$project$Analyser$Checks$MapNothingToNothing$isNothingExpression = function (expression) {
	return _Utils_eq(
		expression,
		A2($stil4m$elm_syntax$Elm$Syntax$Expression$FunctionOrValue, _List_Nil, 'Nothing'));
};
var $author$project$Analyser$Checks$MapNothingToNothing$isNothingPattern = function (pattern) {
	return _Utils_eq(
		pattern,
		A2(
			$stil4m$elm_syntax$Elm$Syntax$Pattern$NamedPattern,
			{a_: _List_Nil, f8: 'Nothing'},
			_List_Nil));
};
var $author$project$Analyser$Checks$MapNothingToNothing$onCase = F3(
	function (_v0, _v1, context) {
		var _v2 = _v1.a;
		var start = _v2.a.J;
		var pattern = _v2.b;
		var _v3 = _v1.b;
		var end = _v3.a.bH;
		var expression = _v3.b;
		return ($author$project$Analyser$Checks$MapNothingToNothing$isNothingPattern(pattern) && $author$project$Analyser$Checks$MapNothingToNothing$isNothingExpression(expression)) ? A2(
			$elm$core$List$cons,
			$author$project$Analyser$Checks$MapNothingToNothing$buildMessage(
				{bH: end, J: start}),
			context) : context;
	});
var $author$project$Analyser$Checks$MapNothingToNothing$scan = F2(
	function (fileContext, _v0) {
		return A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					c8: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$MapNothingToNothing$onCase)
				}),
			fileContext.fe,
			_List_Nil);
	});
var $author$project$Analyser$Checks$MapNothingToNothing$checker = {
	fo: $author$project$Analyser$Checks$MapNothingToNothing$scan,
	fX: {
		fD: 'Do not map a `Nothing` to `Nothing` with a case expression. Use `andThen` or `map` instead.',
		f0: 'MapNothingToNothing',
		f8: 'Map Nothing To Nothing',
		gs: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$NoTopLevelSignature$onFunction = F3(
	function (_v0, _v1, context) {
		var _function = _v1.b;
		var _v2 = _function.gu;
		if (_v2.$ === 1) {
			var declaration = $stil4m$elm_syntax$Elm$Syntax$Node$value(_function.fx);
			var _v3 = declaration.f8;
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
					c9: $author$project$ASTUtil$Inspector$Skip,
					dc: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$NoTopLevelSignature$onFunction)
				}),
			fileContext.fe,
			_List_Nil);
	});
var $author$project$Analyser$Checks$NoTopLevelSignature$checker = {
	fo: $author$project$Analyser$Checks$NoTopLevelSignature$scan,
	fX: {
		fD: 'We want our readers to understand our code. Adding a signature is part of this.',
		f0: 'NoTopLevelSignature',
		f8: 'No Top Level Signature',
		gs: A2(
			$author$project$Analyser$Messages$Schema$varProp,
			'varName',
			A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$Analyser$Checks$NoUncurriedPrefix$onExpression = F2(
	function (_v0, context) {
		var expression = _v0.b;
		if ((((((expression.$ === 1) && expression.a.b) && (expression.a.a.b.$ === 5)) && expression.a.b.b) && expression.a.b.b.b) && (!expression.a.b.b.b.b)) {
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
					da: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$NoUncurriedPrefix$onExpression)
				}),
			fileContext.fe,
			_List_Nil);
	});
var $author$project$Analyser$Checks$NoUncurriedPrefix$checker = {
	fo: $author$project$Analyser$Checks$NoUncurriedPrefix$scan,
	fX: {
		fD: 'It\'s not needed to use an operator in prefix notation when you apply both arguments directly.',
		f0: 'NoUncurriedPrefix',
		f8: 'Fully Applied Operator as Prefix',
		gs: A2(
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
	if (x.$ === 4) {
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
			if (t.$ === 1) {
				var ws = t.b;
				return _Utils_ap(
					context.aH,
					A2(
						$elm$core$List$map,
						$stil4m$elm_syntax$Elm$Syntax$Node$range,
						A2(
							$elm$core$List$filter,
							function (_v1) {
								var ta = _v1.b;
								if (ta.$ === 4) {
									return true;
								} else {
									return false;
								}
							},
							ws)));
			} else {
				return context.aH;
			}
		}();
		return _Utils_update(
			context,
			{
				aX: _Utils_ap(
					$author$project$Analyser$Checks$SingleFieldRecord$findPlainRecords(x),
					context.aX),
				aH: newWhitelisted
			});
	});
var $author$project$Analyser$Checks$SingleFieldRecord$realMatches = function (_v0) {
	var matches = _v0.aX;
	var whitelisted = _v0.aH;
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
									dr: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$SingleFieldRecord$onTypeAnnotation)
								}),
							fileContext.fe,
							{aX: _List_Nil, aH: _List_Nil})))));
	});
var $author$project$Analyser$Checks$SingleFieldRecord$checker = {
	fo: $author$project$Analyser$Checks$SingleFieldRecord$scan,
	fX: {
		fD: 'Using a record is obsolete if you only plan to store a single field in it.',
		f0: 'SingleFieldRecord',
		f8: 'Single Field Record',
		gs: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
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
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $author$project$Analyser$Configuration$checkPropertyAs = F4(
	function (decoder, check, prop, _v0) {
		var raw = _v0.dx;
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
var $author$project$Analyser$Checks$TriggerWords$normalizeWord = $elm$core$String$toLower;
var $elm$regex$Regex$split = _Regex_splitAtMost(_Regex_infinity);
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
				fileContext.fe.fs));
	});
var $author$project$Analyser$Checks$TriggerWords$checker = {
	fo: $author$project$Analyser$Checks$TriggerWords$scan,
	fX: {
		fD: 'Comments can tell you what that you have to put your code a bit more attention. You should resolve things as \'TODO\' and such.',
		f0: 'TriggerWords',
		f8: 'Trigger Words',
		gs: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'range',
			A2($author$project$Analyser$Messages$Schema$varProp, 'word', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$Analyser$Checks$UnnecessaryListConcat$isListExpression = function (_v0) {
	var inner = _v0.b;
	if (inner.$ === 19) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Analyser$Checks$UnnecessaryListConcat$onExpression = F2(
	function (_v0, context) {
		var r = _v0.a;
		var inner = _v0.b;
		if ((((((((((inner.$ === 1) && inner.a.b) && (inner.a.a.b.$ === 3)) && inner.a.a.b.a.b) && (inner.a.a.b.a.a === 'List')) && (!inner.a.a.b.a.b.b)) && (inner.a.a.b.b === 'concat')) && inner.a.b.b) && (inner.a.b.a.b.$ === 19)) && (!inner.a.b.b.b)) {
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
					da: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnnecessaryListConcat$onExpression)
				}),
			fileContext.fe,
			_List_Nil);
	});
var $author$project$Analyser$Checks$UnnecessaryListConcat$checker = {
	fo: $author$project$Analyser$Checks$UnnecessaryListConcat$scan,
	fX: {
		fD: 'You should not use \'List.concat\' to concatenate literal lists. Just join the lists together.',
		f0: 'UnnecessaryListConcat',
		f8: 'Unnecessary List Concat',
		gs: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
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
		if (((inner.$ === 4) && (inner.b.b.$ === 3)) && (inner.c.b.$ === 3)) {
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
					da: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnnecessaryLiteralBools$onExpression)
				}),
			fileContext.fe,
			_List_Nil);
	});
var $author$project$Analyser$Checks$UnnecessaryLiteralBools$checker = {
	fo: $author$project$Analyser$Checks$UnnecessaryLiteralBools$scan,
	fX: {
		fD: 'Directly use the boolean you already have.',
		f0: 'UnnecessaryLiteralBools',
		f8: 'Unnecessary Literal Booleans',
		gs: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $stil4m$elm_syntax$Elm$Syntax$Module$isPortModule = function (m) {
	if (m.$ === 1) {
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
			$stil4m$elm_syntax$Elm$Syntax$Node$value(fileContext.fe.f6))) {
			var portDeclCount = A3(
				$author$project$ASTUtil$Inspector$inspect,
				_Utils_update(
					$author$project$ASTUtil$Inspector$defaultConfig,
					{
						dk: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnnecessaryPortModule$onPortDeclaration)
					}),
				fileContext.fe,
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
	fo: $author$project$Analyser$Checks$UnnecessaryPortModule$scan,
	fX: {fD: 'Dont use the port keyword if you do not need it.', f0: 'UnnecessaryPortModule', f8: 'Unnecessary Port Module', gs: $author$project$Analyser$Messages$Schema$schema}
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
	var _v0 = $stil4m$elm_syntax$Elm$Syntax$Node$value(fileContext.fe.f6);
	if (_v0.$ === 2) {
		return $author$project$Analyser$Checks$UnusedTopLevel$filterForEffectModule;
	} else {
		return $elm$core$Basics$always(true);
	}
};
var $author$project$Analyser$Checks$UnusedTopLevel$forVariableType = function (_v0) {
	var variableName = _v0.a;
	var variableType = _v0.b;
	var range = _v0.c;
	if (variableType === 3) {
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
							return A2($stil4m$elm_syntax$Elm$Interface$exposesFunction, a, fileContext.fZ);
						},
						$elm$core$Basics$not)),
				A2(
					$elm$core$List$filter,
					$author$project$Analyser$Checks$UnusedTopLevel$filterByModuleType(fileContext),
					$author$project$Analyser$Checks$Variables$unusedTopLevels(x))));
		return _Utils_ap(unusedVariables, unusedTopLevels);
	});
var $author$project$Analyser$Checks$UnusedTopLevel$checker = {
	fo: $author$project$Analyser$Checks$UnusedTopLevel$scan,
	fX: {
		fD: 'Functions and values that are unused in a module and not exported are dead code.',
		f0: 'UnusedTopLevel',
		f8: 'Unused Top Level',
		gs: A2(
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
		if (e.$ === 3) {
			var s = e.b;
			return _Utils_update(
				config,
				{
					ba: A2($elm$core$Set$insert, s, config.ba)
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
					$stil4m$elm_syntax$Elm$Syntax$Node$value(constructor.f8),
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
							$stil4m$elm_syntax$Elm$Syntax$Node$value(constructor.f8),
							_interface);
					}),
				t.fu));
		return _Utils_update(
			context,
			{
				a9: _Utils_ap(context.a9, nonExposed)
			});
	});
var $author$project$Analyser$Checks$UnusedValueConstructor$scan = F2(
	function (fileContext, _v0) {
		var result = A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					da: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedValueConstructor$onExpression),
					dp: $author$project$ASTUtil$Inspector$Inner(
						$elm$core$Basics$always(
							$author$project$Analyser$Checks$UnusedValueConstructor$onType(fileContext.fZ)))
				}),
			fileContext.fe,
			{a9: _List_Nil, ba: $elm$core$Set$empty});
		return A2(
			$elm$core$List$map,
			$author$project$Analyser$Checks$UnusedValueConstructor$buildMessageData,
			A2(
				$elm$core$List$filter,
				function (x) {
					return !A2($elm$core$Set$member, x.a, result.ba);
				},
				result.a9));
	});
var $author$project$Analyser$Checks$UnusedValueConstructor$checker = {
	fo: $author$project$Analyser$Checks$UnusedValueConstructor$scan,
	fX: {
		fD: 'Value Constructors which are not exposed and used should be eliminated.',
		f0: 'UnusedValueConstructor',
		f8: 'Unused Value Constructor',
		gs: A2(
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
	var _v0 = $stil4m$elm_syntax$Elm$Syntax$Node$value(fileContext.fe.f6);
	if (_v0.$ === 2) {
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
		if (variableType === 2) {
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
							return A2($stil4m$elm_syntax$Elm$Interface$exposesFunction, a, fileContext.fZ);
						},
						$elm$core$Basics$not)),
				A2(
					$elm$core$List$filter,
					$author$project$Analyser$Checks$UnusedVariable$filterByModuleType(fileContext),
					$author$project$Analyser$Checks$Variables$unusedTopLevels(x))));
		return _Utils_ap(unusedVariables, unusedTopLevels);
	});
var $author$project$Analyser$Checks$UnusedVariable$checker = {
	fo: $author$project$Analyser$Checks$UnusedVariable$scan,
	fX: {
		fD: 'Variables that are not used could be removed or marked as _ to avoid unnecessary noise.',
		f0: 'UnusedVariable',
		f8: 'Unused Variable',
		gs: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'range',
			A2($author$project$Analyser$Messages$Schema$varProp, 'varName', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$Analyser$Checks$UseConsOverConcat$onExpression = F2(
	function (_v0, context) {
		var r = _v0.a;
		var inner = _v0.b;
		if (((((inner.$ === 2) && (inner.a === '++')) && (inner.c.b.$ === 19)) && inner.c.b.a.b) && (!inner.c.b.a.b.b)) {
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
					da: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UseConsOverConcat$onExpression)
				}),
			fileContext.fe,
			_List_Nil);
	});
var $author$project$Analyser$Checks$UseConsOverConcat$checker = {
	fo: $author$project$Analyser$Checks$UseConsOverConcat$scan,
	fX: {
		fD: 'If you concatenate two lists, but the right hand side is a single element list, then you should use the cons operator.',
		f0: 'UseConsOverConcat',
		f8: 'Use Cons Over Concat',
		gs: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$all = _List_fromArray(
	[$author$project$Analyser$Checks$UnusedVariable$checker, $author$project$Analyser$Checks$UnusedValueConstructor$checker, $author$project$Analyser$Checks$UnusedImportedVariable$checker, $author$project$Analyser$Checks$UnusedPatternVariable$checker, $author$project$Analyser$Checks$UnusedTopLevel$checker, $author$project$Analyser$Checks$ExposeAll$checker, $author$project$Analyser$Checks$ImportAll$checker, $author$project$Analyser$Checks$NoTopLevelSignature$checker, $author$project$Analyser$Checks$UnnecessaryParens$checker, $author$project$Analyser$Checks$DebugLog$checker, $author$project$Analyser$Checks$DebugCrash$checker, $author$project$Analyser$Checks$DuplicateImport$checker, $author$project$Analyser$Checks$DuplicateImportedVariable$checker, $author$project$Analyser$Checks$UnusedTypeAlias$checker, $author$project$Analyser$Checks$NoUncurriedPrefix$checker, $author$project$Analyser$Checks$UnusedImportAlias$checker, $author$project$Analyser$Checks$UnusedImport$checker, $author$project$Analyser$Checks$UseConsOverConcat$checker, $author$project$Analyser$Checks$DropConcatOfLists$checker, $author$project$Analyser$Checks$DropConsOfItemAndList$checker, $author$project$Analyser$Checks$UnnecessaryListConcat$checker, $author$project$Analyser$Checks$MultiLineRecordFormatting$checker, $author$project$Analyser$Checks$UnnecessaryPortModule$checker, $author$project$Analyser$Checks$FunctionInLet$checker, $author$project$Analyser$Checks$SingleFieldRecord$checker, $author$project$Analyser$Checks$TriggerWords$checker, $author$project$Analyser$Checks$BooleanCase$checker, $author$project$Analyser$Checks$MapNothingToNothing$checker, $author$project$Analyser$Checks$UnnecessaryLiteralBools$checker]);
var $author$project$Analyser$Files$FileContent$asFileRef = function (x) {
	return {
		ci: x.ci,
		p: A2($elm$core$Maybe$withDefault, '', x.gt)
	};
};
var $author$project$Analyser$Configuration$checkEnabled = F2(
	function (k, _v0) {
		var configuration = _v0;
		return A2(
			$elm$core$Maybe$withDefault,
			true,
			A2($elm$core$Dict$get, k, configuration.aK));
	});
var $author$project$Analyser$Messages$Schema$ErrorMessage = 5;
var $author$project$Analyser$Messages$Schema$errorProp = F2(
	function (k, _v0) {
		var s = _v0;
		return A3($elm$core$Dict$insert, k, 5, s);
	});
var $author$project$Analyser$Checks$FileLoadFailed$scan = F2(
	function (_v0, _v1) {
		return _List_Nil;
	});
var $author$project$Analyser$Checks$FileLoadFailed$checker = {
	fo: $author$project$Analyser$Checks$FileLoadFailed$scan,
	fX: {
		fD: 'We could not analyse this file...',
		f0: 'FileLoadFailed',
		f8: 'FileLoadFailed',
		gs: A2($author$project$Analyser$Messages$Schema$errorProp, 'message', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Messages$Types$Message = F5(
	function (id, status, file, type_, data) {
		return {cU: data, d5: file, fU: id, gy: status, gJ: type_};
	});
var $author$project$Analyser$Messages$Types$newMessage = A2($author$project$Analyser$Messages$Types$Message, 0, 3);
var $author$project$Inspection$inspectFileContext = F3(
	function (configuration, enabledChecks, fileContext) {
		return A2(
			$elm$core$List$map,
			function (_v0) {
				var c = _v0.a;
				var data = _v0.b;
				return A3($author$project$Analyser$Messages$Types$newMessage, fileContext.d5, c.fX.f0, data);
			},
			A2(
				$elm$core$List$concatMap,
				function (c) {
					return A2(
						$elm$core$List$map,
						function (b) {
							return _Utils_Tuple2(c, b);
						},
						A2(c.fo, fileContext, configuration));
				},
				enabledChecks));
	});
var $author$project$Inspection$run = F3(
	function (codeBase, includedSources, configuration) {
		var failedMessages = A2(
			$elm$core$List$map,
			function (_v2) {
				var source = _v2.a;
				return A3(
					$author$project$Analyser$Messages$Types$newMessage,
					$author$project$Analyser$Files$FileContent$asFileRef(source),
					$author$project$Analyser$Checks$FileLoadFailed$checker.fX.f0,
					A3(
						$author$project$Analyser$Messages$Data$addErrorMessage,
						'message',
						'Unexpected parse error',
						$author$project$Analyser$Messages$Data$init('Could not load file due to: Unexpected parse error')));
			},
			A2(
				$elm$core$List$filterMap,
				function (_v0) {
					var source = _v0.a;
					var result = _v0.b;
					if (result.$ === 1) {
						var e = result.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(source, e));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				},
				A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Tuple$second,
						A2($elm$core$Basics$composeR, $author$project$Result$Extra$isOk, $elm$core$Basics$not)),
					includedSources)));
		var enabledChecks = A2(
			$elm$core$List$filter,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.fX;
				},
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.f0;
					},
					function (a) {
						return A2($author$project$Analyser$Configuration$checkEnabled, a, configuration);
					})),
			$author$project$Analyser$Checks$all);
		var inspectionMessages = A2(
			$elm$core$List$concatMap,
			A2($author$project$Inspection$inspectFileContext, configuration, enabledChecks),
			A2($author$project$Analyser$FileContext$build, codeBase, includedSources));
		var messages = $elm$core$List$concat(
			_List_fromArray(
				[failedMessages, inspectionMessages]));
		return messages;
	});
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $stil4m$elm_syntax$Elm$Syntax$ModuleName$encode = $elm$json$Json$Encode$list($elm$json$Json$Encode$string);
var $author$project$Analyser$Modules$encodeDependency = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return A2(
		$elm$json$Json$Encode$list,
		$stil4m$elm_syntax$Elm$Syntax$ModuleName$encode,
		_List_fromArray(
			[x, y]));
};
var $author$project$Analyser$Modules$encode = function (e) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'projectModules',
				A2($elm$json$Json$Encode$list, $stil4m$elm_syntax$Elm$Syntax$ModuleName$encode, e.ck)),
				_Utils_Tuple2(
				'dependencies',
				A2($elm$json$Json$Encode$list, $author$project$Analyser$Modules$encodeDependency, e.fz))
			]));
};
var $author$project$Analyser$FileRef$encode = function (fileRef) {
	return $elm$json$Json$Encode$string(fileRef.ci);
};
var $elm$json$Json$Encode$int = _Json_wrap;
var $stil4m$elm_syntax$Elm$Syntax$Range$encode = function (_v0) {
	var start = _v0.J;
	var end = _v0.bH;
	return A2(
		$elm$json$Json$Encode$list,
		$elm$json$Json$Encode$int,
		_List_fromArray(
			[start.C, start.W, end.C, end.W]));
};
var $author$project$Analyser$Messages$Data$encodeDataValue = function (dataValue) {
	switch (dataValue.$) {
		case 0:
			var v = dataValue.a;
			return $stil4m$elm_syntax$Elm$Syntax$Range$encode(v);
		case 1:
			var v = dataValue.a;
			return $elm$json$Json$Encode$string(v);
		case 2:
			var v = dataValue.a;
			return $elm$json$Json$Encode$string(v);
		case 3:
			var v = dataValue.a;
			return A2($elm$json$Json$Encode$list, $stil4m$elm_syntax$Elm$Syntax$Range$encode, v);
		case 4:
			var v = dataValue.a;
			return A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, v);
		default:
			var v = dataValue.a;
			return $elm$json$Json$Encode$string(v);
	}
};
var $author$project$Analyser$Messages$Data$encode = function (_v0) {
	var desc = _v0.a;
	var m = _v0.b;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'description',
				$elm$json$Json$Encode$string(desc)),
				_Utils_Tuple2(
				'properties',
				$elm$json$Json$Encode$object(
					A2(
						$elm$core$List$map,
						$elm$core$Tuple$mapSecond($author$project$Analyser$Messages$Data$encodeDataValue),
						$elm$core$Dict$toList(m))))
			]));
};
var $author$project$Analyser$Messages$Json$encodeMessageStatus = function (m) {
	return $elm$json$Json$Encode$string(
		function () {
			switch (m) {
				case 3:
					return 'applicable';
				case 0:
					return 'outdated';
				case 1:
					return 'blocked';
				default:
					return 'fixing';
			}
		}());
};
var $author$project$Analyser$Messages$Json$encodeMessage = function (m) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$int(m.fU)),
				_Utils_Tuple2(
				'status',
				$author$project$Analyser$Messages$Json$encodeMessageStatus(m.gy)),
				_Utils_Tuple2(
				'file',
				$author$project$Analyser$FileRef$encode(m.d5)),
				_Utils_Tuple2(
				'type',
				$elm$json$Json$Encode$string(m.gJ)),
				_Utils_Tuple2(
				'data',
				$author$project$Analyser$Messages$Data$encode(m.cU))
			]));
};
var $author$project$Analyser$Report$encode = function (r) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'messages',
				A2($elm$json$Json$Encode$list, $author$project$Analyser$Messages$Json$encodeMessage, r.es)),
				_Utils_Tuple2(
				'modules',
				$author$project$Analyser$Modules$encode(r.eu)),
				_Utils_Tuple2(
				'unusedDependencies',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, r.gN))
			]));
};
var $author$project$AnalyserPorts$sendReportValue = _Platform_outgoingPort('sendReportValue', $elm$core$Basics$identity);
var $author$project$AnalyserPorts$sendReport = A2($elm$core$Basics$composeL, $author$project$AnalyserPorts$sendReportValue, $author$project$Analyser$Report$encode);
var $author$project$Registry$Version$asString = function (_v0) {
	var a = _v0.a;
	var b = _v0.b;
	var c = _v0.c;
	return A2(
		$elm$core$String$join,
		'.',
		_List_fromArray(
			[
				$elm$core$String$fromInt(a),
				$elm$core$String$fromInt(b),
				$elm$core$String$fromInt(c)
			]));
};
var $author$project$Registry$Version$encode = A2($elm$core$Basics$composeL, $elm$json$Json$Encode$string, $author$project$Registry$Version$asString);
var $author$project$Registry$Package$encode = function (_package) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(_package.f8)),
				_Utils_Tuple2(
				'summary',
				$elm$json$Json$Encode$string(_package.eV)),
				_Utils_Tuple2(
				'versions',
				A2($elm$json$Json$Encode$list, $author$project$Registry$Version$encode, _package.dM))
			]));
};
var $stil4m$elm_syntax$Elm$Syntax$Node$encode = F2(
	function (f, _v0) {
		var r = _v0.a;
		var v = _v0.b;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'range',
					$stil4m$elm_syntax$Elm$Syntax$Range$encode(r)),
					_Utils_Tuple2(
					'value',
					f(v))
				]));
	});
var $stil4m$elm_syntax$Elm$Syntax$Infix$encodeDirection = function (d) {
	switch (d) {
		case 0:
			return $elm$json$Json$Encode$string('left');
		case 1:
			return $elm$json$Json$Encode$string('right');
		default:
			return $elm$json$Json$Encode$string('non');
	}
};
var $stil4m$elm_syntax$Elm$Syntax$Infix$encode = function (inf) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'direction',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Infix$encodeDirection, inf.fE)),
				_Utils_Tuple2(
				'precedence',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $elm$json$Json$Encode$int, inf.eB)),
				_Utils_Tuple2(
				'operator',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $elm$json$Json$Encode$string, inf.gk)),
				_Utils_Tuple2(
				'function',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $elm$json$Json$Encode$string, inf.fO))
			]));
};
var $author$project$Util$Json$encodeTyped = F2(
	function (x, v) {
		return _List_fromArray(
			[
				_Utils_Tuple2(
				'type',
				$elm$json$Json$Encode$string(x)),
				_Utils_Tuple2('value', v)
			]);
	});
var $author$project$Analyser$Files$Json$encodeExposedInterface = function (x) {
	return $elm$json$Json$Encode$object(
		function () {
			switch (x.$) {
				case 0:
					var s = x.a;
					return A2(
						$author$project$Util$Json$encodeTyped,
						'function',
						$elm$json$Json$Encode$string(s));
				case 1:
					var _v1 = x.a;
					var name = _v1.a;
					var constructors = _v1.b;
					return A2(
						$author$project$Util$Json$encodeTyped,
						'type_',
						$elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'name',
									$elm$json$Json$Encode$string(name)),
									_Utils_Tuple2(
									'constructors',
									A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, constructors))
								])));
				case 2:
					var s = x.a;
					return A2(
						$author$project$Util$Json$encodeTyped,
						'alias',
						$elm$json$Json$Encode$string(s));
				default:
					var s = x.a;
					return A2(
						$author$project$Util$Json$encodeTyped,
						'operator',
						$stil4m$elm_syntax$Elm$Syntax$Infix$encode(s));
			}
		}());
};
var $author$project$Analyser$Files$Json$encodeInterface = $elm$json$Json$Encode$list($author$project$Analyser$Files$Json$encodeExposedInterface);
var $author$project$Analyser$Files$Json$encodeDependency = function (dep) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(dep.f8)),
				_Utils_Tuple2(
				'version',
				$elm$json$Json$Encode$string(dep.p)),
				_Utils_Tuple2(
				'interfaces',
				A2(
					$elm$json$Json$Encode$list,
					function (_v0) {
						var k = _v0.a;
						var v = _v0.b;
						return $elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'key',
									A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, k)),
									_Utils_Tuple2(
									'value',
									$author$project$Analyser$Files$Json$encodeInterface(v))
								]));
					},
					$elm$core$Dict$toList(dep.f_)))
			]));
};
var $author$project$Analyser$State$Dependencies$encodeVersionState = function (vs) {
	return $elm$json$Json$Encode$string(
		function () {
			switch (vs) {
				case 0:
					return 'UpToDate';
				case 1:
					return 'MajorBehind';
				case 2:
					return 'Upgradable';
				default:
					return 'Unknown';
			}
		}());
};
var $author$project$Analyser$State$Dependencies$encodeDependencyInfo = function (depInfo) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'dependency',
				$author$project$Analyser$Files$Json$encodeDependency(depInfo.y)),
				_Utils_Tuple2(
				'versionState',
				$author$project$Analyser$State$Dependencies$encodeVersionState(depInfo.dL)),
				_Utils_Tuple2(
				'package',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Registry$Package$encode, depInfo.ds)))
			]));
};
var $author$project$Analyser$State$Dependencies$encodeMode = function (m) {
	if (m === 1) {
		return $elm$json$Json$Encode$string('application');
	} else {
		return $elm$json$Json$Encode$string('package');
	}
};
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === -2) {
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
var $author$project$Analyser$State$Dependencies$encode = function (dependencies) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'values',
				$elm$json$Json$Encode$object(
					$elm$core$Dict$toList(
						A2(
							$elm$core$Dict$map,
							function (_v0) {
								return $author$project$Analyser$State$Dependencies$encodeDependencyInfo;
							},
							dependencies.gP)))),
				_Utils_Tuple2(
				'unused',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, dependencies.gM)),
				_Utils_Tuple2(
				'mode',
				$author$project$Analyser$State$Dependencies$encodeMode(dependencies.b_))
			]));
};
var $author$project$Analyser$State$encodeStatus = function (s) {
	switch (s) {
		case 0:
			return $elm$json$Json$Encode$string('initialising');
		case 2:
			return $elm$json$Json$Encode$string('idle');
		default:
			return $elm$json$Json$Encode$string('fixing');
	}
};
var $author$project$Analyser$State$encodeState = function (state) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'messages',
				A2($elm$json$Json$Encode$list, $author$project$Analyser$Messages$Json$encodeMessage, state.es)),
				_Utils_Tuple2(
				'dependencies',
				$author$project$Analyser$State$Dependencies$encode(state.fz)),
				_Utils_Tuple2(
				'idCount',
				$elm$json$Json$Encode$int(state.at)),
				_Utils_Tuple2(
				'status',
				$author$project$Analyser$State$encodeStatus(state.gy)),
				_Utils_Tuple2(
				'queue',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$int, state.ag)),
				_Utils_Tuple2(
				'modules',
				$author$project$Analyser$Modules$encode(state.eu))
			]));
};
var $author$project$AnalyserPorts$sendState = _Platform_outgoingPort('sendState', $elm$core$Basics$identity);
var $author$project$AnalyserPorts$sendStateValue = A2($elm$core$Basics$composeL, $author$project$AnalyserPorts$sendState, $author$project$Analyser$State$encodeState);
var $author$project$Analyser$CodeBase$sourceFiles = function (_v0) {
	var codeBase = _v0;
	return $elm$core$Dict$values(codeBase.a3);
};
var $author$project$Analyser$State$updateModules = F2(
	function (newModules, s) {
		return _Utils_update(
			s,
			{eu: newModules});
	});
var $author$project$Analyser$State$withDependencies = F2(
	function (dep, state) {
		return _Utils_update(
			state,
			{fz: dep});
	});
var $author$project$Analyser$finishProcess = F3(
	function (newStage, cmds, model) {
		var mode = function () {
			var _v1 = model.R;
			if (!_v1.$) {
				return 1;
			} else {
				return 0;
			}
		}();
		var loadedSourceFiles = $author$project$Analyser$SourceLoadingStage$parsedFiles(newStage);
		var newCodeBase = A2($author$project$Analyser$CodeBase$addSourceFiles, loadedSourceFiles, model.E);
		var includedSources = A2(
			$elm$core$List$filter,
			$author$project$Analyser$isSourceFileIncluded(model.X),
			loadedSourceFiles);
		var messages = A3($author$project$Inspection$run, newCodeBase, includedSources, model.X);
		var _v0 = A2(
			$author$project$Analyser$Modules$build,
			newCodeBase,
			$author$project$Analyser$CodeBase$sourceFiles(newCodeBase));
		var unusedDeps = _v0.a;
		var newModules = _v0.b;
		var deps = A4(
			$author$project$Analyser$State$Dependencies$init,
			mode,
			A2(
				$elm$core$List$map,
				function ($) {
					return $.f8;
				},
				unusedDeps),
			$author$project$Analyser$CodeBase$dependencies(newCodeBase),
			model.S);
		var newState = A2(
			$author$project$Analyser$State$withDependencies,
			deps,
			A2(
				$author$project$Analyser$State$updateModules,
				newModules,
				A2($author$project$Analyser$State$finishWithNewMessages, messages, model.k)));
		var newModel = _Utils_update(
			model,
			{E: newCodeBase, j: $author$project$Analyser$Finished, k: newState});
		return $author$project$Analyser$handleNextStep(
			_Utils_Tuple2(
				newModel,
				$elm$core$Platform$Cmd$batch(
					_List_fromArray(
						[
							$author$project$AnalyserPorts$sendReport(
							{es: newState.es, eu: newState.eu, gN: newState.fz.gM}),
							$author$project$AnalyserPorts$sendStateValue(newState),
							A2($elm$core$Platform$Cmd$map, $author$project$Analyser$SourceLoadingStageMsg, cmds)
						]))));
	});
var $author$project$Analyser$Configuration$ConfigurationInner = F3(
	function (raw, checks, excludedPaths) {
		return {aK: checks, cY: excludedPaths, dx: raw};
	});
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $author$project$Analyser$Configuration$decodeChecks = $elm$json$Json$Decode$dict($elm$json$Json$Decode$bool);
var $author$project$Analyser$Configuration$decodeConfiguration = function (raw) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Basics$identity,
		A3(
			$elm$json$Json$Decode$map2,
			$author$project$Analyser$Configuration$ConfigurationInner(raw),
			$elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						A2($elm$json$Json$Decode$field, 'checks', $author$project$Analyser$Configuration$decodeChecks),
						$elm$json$Json$Decode$succeed($elm$core$Dict$empty)
					])),
			$elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$json$Json$Decode$field,
						'excludedPaths',
						$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
						$elm$json$Json$Decode$succeed(_List_Nil)
					]))));
};
var $author$project$Analyser$Configuration$withDefaultChecks = function (x) {
	return A6(
		$elm$core$Dict$merge,
		$elm$core$Dict$insert,
		F4(
			function (k, _v0, b, result) {
				return A3($elm$core$Dict$insert, k, b, result);
			}),
		$elm$core$Dict$insert,
		$author$project$Analyser$Configuration$defaultChecks,
		x,
		$elm$core$Dict$empty);
};
var $author$project$Analyser$Configuration$mergeWithDefaults = function (_v0) {
	var innerConfig = _v0;
	return _Utils_update(
		innerConfig,
		{
			aK: $author$project$Analyser$Configuration$withDefaultChecks(innerConfig.aK)
		});
};
var $author$project$Analyser$Configuration$fromString = function (input) {
	if (input === '') {
		return _Utils_Tuple2(
			$author$project$Analyser$Configuration$defaultConfiguration,
			_List_fromArray(
				['No configuration provided. Using default configuration.']));
	} else {
		var _v0 = A2(
			$elm$json$Json$Decode$decodeString,
			$author$project$Analyser$Configuration$decodeConfiguration(input),
			input);
		if (_v0.$ === 1) {
			var e = _v0.a;
			return _Utils_Tuple2(
				$author$project$Analyser$Configuration$defaultConfiguration,
				_List_fromArray(
					[
						'Failed to decode defined configuration due to: ' + ($elm$json$Json$Decode$errorToString(e) + '. Falling back to default configuration')
					]));
		} else {
			var x = _v0.a;
			return _Utils_Tuple2(
				$author$project$Analyser$Configuration$mergeWithDefaults(x),
				_List_Nil);
		}
	}
};
var $author$project$Analyser$CodeBase$getFile = F2(
	function (path, _v0) {
		var codeBase = _v0;
		return A2($elm$core$Dict$get, path, codeBase.a3);
	});
var $elm_community$maybe_extra$Maybe$Extra$join = function (mx) {
	if (!mx.$) {
		var x = mx.a;
		return x;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Analyser$getFileContext = F2(
	function (path, codeBase) {
		return $elm_community$maybe_extra$Maybe$Extra$join(
			A2(
				$elm$core$Maybe$map,
				$author$project$Analyser$FileContext$buildForFile(
					$author$project$Analyser$CodeBase$processContext(codeBase)),
				A2($author$project$Analyser$CodeBase$getFile, path, codeBase)));
	});
var $author$project$Analyser$Fixer$getFixedFile = F2(
	function (mess, fileContext) {
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Result$Err('Unable to find fixer'),
			A2(
				$elm$core$Maybe$map,
				function (fixer) {
					var _v0 = A2(
						fixer.d6,
						_Utils_Tuple2(fileContext.fv, fileContext.fe),
						mess.cU);
					switch (_v0.$) {
						case 2:
							var e = _v0.a;
							return $elm$core$Result$Err(e);
						case 1:
							var p = _v0.a;
							return $elm$core$Result$Ok(p);
						default:
							return $elm$core$Result$Err(
								'Invalid message data for fixer, message id: ' + $elm$core$String$fromInt(mess.fU));
					}
				},
				$author$project$Analyser$Fixers$getFixer(mess)));
	});
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $elm$project_metadata_utils$Elm$Constraint$opToString = function (op) {
	if (!op) {
		return ' < ';
	} else {
		return ' <= ';
	}
};
var $elm$project_metadata_utils$Elm$Version$toString = function (_v0) {
	var major = _v0.a;
	var minor = _v0.b;
	var patch = _v0.c;
	return $elm$core$String$fromInt(major) + ('.' + ($elm$core$String$fromInt(minor) + ('.' + $elm$core$String$fromInt(patch))));
};
var $elm$project_metadata_utils$Elm$Constraint$toString = function (_v0) {
	var lower = _v0.a;
	var lop = _v0.b;
	var uop = _v0.c;
	var upper = _v0.d;
	return $elm$project_metadata_utils$Elm$Version$toString(lower) + ($elm$project_metadata_utils$Elm$Constraint$opToString(lop) + ('v' + ($elm$project_metadata_utils$Elm$Constraint$opToString(uop) + $elm$project_metadata_utils$Elm$Version$toString(upper))));
};
var $elm$project_metadata_utils$Elm$Package$toString = function (_v0) {
	var user = _v0.a;
	var project = _v0.b;
	return user + ('/' + project);
};
var $author$project$Analyser$DependencyLoadingStage$collectDependencies = function (p) {
	if (!p.$) {
		var appInfo = p.a;
		return A2(
			$elm$core$List$map,
			$elm$core$Tuple$mapSecond($elm$project_metadata_utils$Elm$Version$toString),
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$mapFirst($elm$project_metadata_utils$Elm$Package$toString),
				appInfo.fB));
	} else {
		var packageInfo = p.a;
		return A2(
			$elm$core$List$map,
			$elm$core$Tuple$mapSecond(
				A2(
					$elm$core$Basics$composeR,
					$elm$project_metadata_utils$Elm$Constraint$toString,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$String$split(' '),
						A2(
							$elm$core$Basics$composeR,
							$elm$core$List$head,
							$elm$core$Maybe$withDefault(
								$elm$project_metadata_utils$Elm$Version$toString($elm$project_metadata_utils$Elm$Version$one)))))),
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$mapFirst($elm$project_metadata_utils$Elm$Package$toString),
				packageInfo.fA));
	}
};
var $author$project$Analyser$Files$DependencyLoader$AwaitingCache = {$: 0};
var $author$project$Analyser$DependencyHandler$loadRawDependency = _Platform_outgoingPort(
	'loadRawDependency',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'name',
					$elm$json$Json$Encode$string($.f8)),
					_Utils_Tuple2(
					'version',
					$elm$json$Json$Encode$string($.p))
				]));
	});
var $author$project$Analyser$DependencyHandler$readFromDisk = function (dependency) {
	return $author$project$Analyser$DependencyHandler$loadRawDependency(dependency);
};
var $author$project$Analyser$Files$DependencyLoader$init = function (dep) {
	return _Utils_Tuple2(
		{y: dep, k: $author$project$Analyser$Files$DependencyLoader$AwaitingCache},
		$elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					$author$project$Analyser$DependencyHandler$readFromDisk(dep),
					$author$project$Util$Logger$info('Load dependency ' + (dep.f8 + (' ' + dep.p)))
				])));
};
var $author$project$Analyser$DependencyLoadingStage$init = function (elmProject) {
	var inits = A2(
		$elm$core$List$map,
		function (_v4) {
			var s = _v4.a;
			var v = _v4.b;
			return _Utils_Tuple2(
				s,
				$author$project$Analyser$Files$DependencyLoader$init(
					{f8: s, p: v}));
		},
		$author$project$Analyser$DependencyLoadingStage$collectDependencies(elmProject));
	return _Utils_Tuple2(
		$elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				function (_v0) {
					var a = _v0.a;
					var _v1 = _v0.b;
					var b = _v1.a;
					return _Utils_Tuple2(a, b);
				},
				inits)),
		$elm$core$Platform$Cmd$batch(
			A2(
				$elm$core$List$map,
				function (_v2) {
					var a = _v2.a;
					var _v3 = _v2.b;
					var c = _v3.b;
					return A2(
						$elm$core$Platform$Cmd$map,
						$author$project$Analyser$DependencyLoadingStage$DependencyLoaderMsg(a),
						c);
				},
				inits)));
};
var $author$project$Analyser$SourceLoadingStage$Model = $elm$core$Basics$identity;
var $author$project$Analyser$Files$FileLoader$AstStore = F2(
	function (sha1, ast) {
		return {fe: ast, gt: sha1};
	});
var $stil4m$elm_syntax$Elm$Syntax$Comments$encode = $elm$json$Json$Encode$string;
var $stil4m$elm_syntax$Elm$Syntax$Documentation$encode = $elm$json$Json$Encode$string;
var $stil4m$elm_syntax$Elm$Json$Util$encodeTyped = F2(
	function (x, v) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string(x)),
					_Utils_Tuple2(x, v)
				]));
	});
var $elm$json$Json$Encode$float = _Json_wrap;
var $stil4m$elm_syntax$Elm$Syntax$Pattern$encode = function (pattern) {
	switch (pattern.$) {
		case 0:
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'all',
				$elm$json$Json$Encode$object(_List_Nil));
		case 1:
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'unit',
				$elm$json$Json$Encode$object(_List_Nil));
		case 2:
			var c = pattern.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'char',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'value',
							$elm$json$Json$Encode$string(
								$elm$core$String$fromChar(c)))
						])));
		case 3:
			var v = pattern.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'string',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'value',
							$elm$json$Json$Encode$string(v))
						])));
		case 5:
			var h = pattern.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'hex',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'value',
							$elm$json$Json$Encode$int(h))
						])));
		case 4:
			var i = pattern.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'int',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'value',
							$elm$json$Json$Encode$int(i))
						])));
		case 6:
			var f = pattern.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'float',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'value',
							$elm$json$Json$Encode$float(f))
						])));
		case 7:
			var patterns = pattern.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'tuple',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'value',
							A2(
								$elm$json$Json$Encode$list,
								$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Pattern$encode),
								patterns))
						])));
		case 8:
			var pointers = pattern.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'record',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'value',
							A2(
								$elm$json$Json$Encode$list,
								$stil4m$elm_syntax$Elm$Syntax$Node$encode($elm$json$Json$Encode$string),
								pointers))
						])));
		case 9:
			var p1 = pattern.a;
			var p2 = pattern.b;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'uncons',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'left',
							A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Pattern$encode, p1)),
							_Utils_Tuple2(
							'right',
							A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Pattern$encode, p2))
						])));
		case 10:
			var patterns = pattern.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'list',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'value',
							A2(
								$elm$json$Json$Encode$list,
								$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Pattern$encode),
								patterns))
						])));
		case 11:
			var name = pattern.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'var',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'value',
							$elm$json$Json$Encode$string(name))
						])));
		case 12:
			var qualifiedNameRef = pattern.a;
			var patterns = pattern.b;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'named',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'qualified',
							$elm$json$Json$Encode$object(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'moduleName',
										$stil4m$elm_syntax$Elm$Syntax$ModuleName$encode(qualifiedNameRef.a_)),
										_Utils_Tuple2(
										'name',
										$elm$json$Json$Encode$string(qualifiedNameRef.f8))
									]))),
							_Utils_Tuple2(
							'patterns',
							A2(
								$elm$json$Json$Encode$list,
								$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Pattern$encode),
								patterns))
						])));
		case 13:
			var destructured = pattern.a;
			var name = pattern.b;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'as',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'name',
							A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $elm$json$Json$Encode$string, name)),
							_Utils_Tuple2(
							'pattern',
							A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Pattern$encode, destructured))
						])));
		default:
			var p1 = pattern.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'parentisized',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'value',
							A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Pattern$encode, p1))
						])));
	}
};
var $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$encode = function (typeAnnotation) {
	switch (typeAnnotation.$) {
		case 0:
			var name = typeAnnotation.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'generic',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'value',
							$elm$json$Json$Encode$string(name))
						])));
		case 1:
			var moduleNameAndName = typeAnnotation.a;
			var args = typeAnnotation.b;
			var inner = function (_v2) {
				var mod = _v2.a;
				var n = _v2.b;
				return $elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'moduleName',
							$stil4m$elm_syntax$Elm$Syntax$ModuleName$encode(mod)),
							_Utils_Tuple2(
							'name',
							$elm$json$Json$Encode$string(n))
						]));
			};
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'typed',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'moduleNameAndName',
							A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, inner, moduleNameAndName)),
							_Utils_Tuple2(
							'args',
							A2(
								$elm$json$Json$Encode$list,
								$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$encode),
								args))
						])));
		case 2:
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'unit',
				$elm$json$Json$Encode$object(_List_Nil));
		case 3:
			var t = typeAnnotation.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'tupled',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'values',
							A2(
								$elm$json$Json$Encode$list,
								$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$encode),
								t))
						])));
		case 6:
			var left = typeAnnotation.a;
			var right = typeAnnotation.b;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'function',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'left',
							A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$encode, left)),
							_Utils_Tuple2(
							'right',
							A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$encode, right))
						])));
		case 4:
			var recordDefinition = typeAnnotation.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'record',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'value',
							$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$encodeRecordDefinition()(recordDefinition))
						])));
		default:
			var name = typeAnnotation.a;
			var recordDefinition = typeAnnotation.b;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'genericRecord',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'name',
							A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $elm$json$Json$Encode$string, name)),
							_Utils_Tuple2(
							'values',
							A2(
								$stil4m$elm_syntax$Elm$Syntax$Node$encode,
								$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$encodeRecordDefinition(),
								recordDefinition))
						])));
	}
};
var $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$encodeRecordField = function (_v0) {
	var name = _v0.a;
	var ref = _v0.b;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $elm$json$Json$Encode$string, name)),
				_Utils_Tuple2(
				'typeAnnotation',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$encode, ref))
			]));
};
function $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$encodeRecordDefinition() {
	return $elm$json$Json$Encode$list(
		$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$encodeRecordField));
}
var $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$encodeRecordDefinition = $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$encodeRecordDefinition();
$stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$cyclic$encodeRecordDefinition = function () {
	return $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$encodeRecordDefinition;
};
var $stil4m$elm_syntax$Elm$Syntax$Signature$encode = function (_v0) {
	var name = _v0.f8;
	var typeAnnotation = _v0.gI;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $elm$json$Json$Encode$string, name)),
				_Utils_Tuple2(
				'typeAnnotation',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$encode, typeAnnotation))
			]));
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$encode = function (expr) {
	switch (expr.$) {
		case 0:
			return A2($stil4m$elm_syntax$Elm$Json$Util$encodeTyped, 'unit', $elm$json$Json$Encode$null);
		case 1:
			var l = expr.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'application',
				A2(
					$elm$json$Json$Encode$list,
					$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Expression$encode),
					l));
		case 2:
			var op = expr.a;
			var dir = expr.b;
			var left = expr.c;
			var right = expr.d;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'operatorapplication',
				A4($stil4m$elm_syntax$Elm$Syntax$Expression$encodeOperatorApplication, op, dir, left, right));
		case 3:
			var moduleName = expr.a;
			var name = expr.b;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'functionOrValue',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'moduleName',
							$stil4m$elm_syntax$Elm$Syntax$ModuleName$encode(moduleName)),
							_Utils_Tuple2(
							'name',
							$elm$json$Json$Encode$string(name))
						])));
		case 4:
			var c = expr.a;
			var t = expr.b;
			var e = expr.c;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'ifBlock',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'clause',
							A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Expression$encode, c)),
							_Utils_Tuple2(
							'then',
							A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Expression$encode, t)),
							_Utils_Tuple2(
							'else',
							A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Expression$encode, e))
						])));
		case 5:
			var x = expr.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'prefixoperator',
				$elm$json$Json$Encode$string(x));
		case 6:
			var x = expr.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'operator',
				$elm$json$Json$Encode$string(x));
		case 8:
			var h = expr.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'hex',
				$elm$json$Json$Encode$int(h));
		case 7:
			var x = expr.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'integer',
				$elm$json$Json$Encode$int(x));
		case 9:
			var x = expr.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'float',
				$elm$json$Json$Encode$float(x));
		case 10:
			var x = expr.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'negation',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Expression$encode, x));
		case 11:
			var x = expr.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'literal',
				$elm$json$Json$Encode$string(x));
		case 12:
			var c = expr.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'charLiteral',
				$elm$json$Json$Encode$string(
					$elm$core$String$fromChar(c)));
		case 13:
			var xs = expr.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'tupled',
				A2(
					$elm$json$Json$Encode$list,
					$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Expression$encode),
					xs));
		case 19:
			var xs = expr.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'list',
				A2(
					$elm$json$Json$Encode$list,
					$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Expression$encode),
					xs));
		case 14:
			var x = expr.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'parenthesized',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Expression$encode, x));
		case 15:
			var x = expr.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'let',
				$stil4m$elm_syntax$Elm$Syntax$Expression$encodeLetBlock(x));
		case 16:
			var x = expr.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'case',
				$stil4m$elm_syntax$Elm$Syntax$Expression$encodeCaseBlock(x));
		case 17:
			var x = expr.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'lambda',
				$stil4m$elm_syntax$Elm$Syntax$Expression$encodeLambda(x));
		case 20:
			var exp = expr.a;
			var name = expr.b;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'recordAccess',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'expression',
							A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Expression$encode, exp)),
							_Utils_Tuple2(
							'name',
							A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $elm$json$Json$Encode$string, name))
						])));
		case 21:
			var x = expr.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'recordAccessFunction',
				$elm$json$Json$Encode$string(x));
		case 18:
			var xs = expr.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'record',
				A2(
					$elm$json$Json$Encode$list,
					$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Expression$encodeRecordSetter),
					xs));
		case 22:
			var name = expr.a;
			var updates = expr.b;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'recordUpdate',
				A2($stil4m$elm_syntax$Elm$Syntax$Expression$encodeRecordUpdate, name, updates));
		default:
			var x = expr.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'glsl',
				$elm$json$Json$Encode$string(x));
	}
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$encodeCase = function (_v7) {
	var pattern = _v7.a;
	var expression = _v7.b;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'pattern',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Pattern$encode, pattern)),
				_Utils_Tuple2(
				'expression',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Expression$encode, expression))
			]));
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$encodeCaseBlock = function (_v6) {
	var cases = _v6.fm;
	var expression = _v6.bJ;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'cases',
				A2($elm$json$Json$Encode$list, $stil4m$elm_syntax$Elm$Syntax$Expression$encodeCase, cases)),
				_Utils_Tuple2(
				'expression',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Expression$encode, expression))
			]));
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$encodeDestructuring = F2(
	function (pattern, expression) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'pattern',
					A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Pattern$encode, pattern)),
					_Utils_Tuple2(
					'expression',
					A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Expression$encode, expression))
				]));
	});
var $stil4m$elm_syntax$Elm$Syntax$Expression$encodeFunction = function (_v5) {
	var documentation = _v5.fG;
	var signature = _v5.gu;
	var declaration = _v5.fx;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'documentation',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2(
						$elm$core$Maybe$map,
						$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Documentation$encode),
						documentation))),
				_Utils_Tuple2(
				'signature',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2(
						$elm$core$Maybe$map,
						$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Signature$encode),
						signature))),
				_Utils_Tuple2(
				'declaration',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Expression$encodeFunctionDeclaration, declaration))
			]));
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$encodeFunctionDeclaration = function (_v4) {
	var name = _v4.f8;
	var _arguments = _v4.fc;
	var expression = _v4.bJ;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $elm$json$Json$Encode$string, name)),
				_Utils_Tuple2(
				'arguments',
				A2(
					$elm$json$Json$Encode$list,
					$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Pattern$encode),
					_arguments)),
				_Utils_Tuple2(
				'expression',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Expression$encode, expression))
			]));
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$encodeLambda = function (_v3) {
	var args = _v3.fa;
	var expression = _v3.bJ;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'patterns',
				A2(
					$elm$json$Json$Encode$list,
					$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Pattern$encode),
					args)),
				_Utils_Tuple2(
				'expression',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Expression$encode, expression))
			]));
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$encodeLetBlock = function (_v2) {
	var declarations = _v2.dY;
	var expression = _v2.bJ;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'declarations',
				A2(
					$elm$json$Json$Encode$list,
					$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Expression$encodeLetDeclaration),
					declarations)),
				_Utils_Tuple2(
				'expression',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Expression$encode, expression))
			]));
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$encodeLetDeclaration = function (letDeclaration) {
	if (!letDeclaration.$) {
		var f = letDeclaration.a;
		return A2(
			$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
			'function',
			$stil4m$elm_syntax$Elm$Syntax$Expression$encodeFunction(f));
	} else {
		var pattern = letDeclaration.a;
		var expression = letDeclaration.b;
		return A2(
			$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
			'destructuring',
			A2($stil4m$elm_syntax$Elm$Syntax$Expression$encodeDestructuring, pattern, expression));
	}
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$encodeOperatorApplication = F4(
	function (operator, direction, left, right) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'operator',
					$elm$json$Json$Encode$string(operator)),
					_Utils_Tuple2(
					'direction',
					$stil4m$elm_syntax$Elm$Syntax$Infix$encodeDirection(direction)),
					_Utils_Tuple2(
					'left',
					A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Expression$encode, left)),
					_Utils_Tuple2(
					'right',
					A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Expression$encode, right))
				]));
	});
var $stil4m$elm_syntax$Elm$Syntax$Expression$encodeRecordSetter = function (_v0) {
	var field = _v0.a;
	var expression = _v0.b;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'field',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $elm$json$Json$Encode$string, field)),
				_Utils_Tuple2(
				'expression',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Expression$encode, expression))
			]));
};
var $stil4m$elm_syntax$Elm$Syntax$Expression$encodeRecordUpdate = F2(
	function (name, updates) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'name',
					A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $elm$json$Json$Encode$string, name)),
					_Utils_Tuple2(
					'updates',
					A2(
						$elm$json$Json$Encode$list,
						$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Expression$encodeRecordSetter),
						updates))
				]));
	});
var $stil4m$elm_syntax$Elm$Syntax$Type$encodeValueConstructor = function (_v0) {
	var name = _v0.f8;
	var _arguments = _v0.fc;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $elm$json$Json$Encode$string, name)),
				_Utils_Tuple2(
				'arguments',
				A2(
					$elm$json$Json$Encode$list,
					$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$encode),
					_arguments))
			]));
};
var $stil4m$elm_syntax$Elm$Syntax$Type$encode = function (_v0) {
	var documentation = _v0.fG;
	var name = _v0.f8;
	var generics = _v0.d9;
	var constructors = _v0.fu;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'documentation',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2(
						$elm$core$Maybe$map,
						$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Documentation$encode),
						documentation))),
				_Utils_Tuple2(
				'name',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $elm$json$Json$Encode$string, name)),
				_Utils_Tuple2(
				'generics',
				A2(
					$elm$json$Json$Encode$list,
					$stil4m$elm_syntax$Elm$Syntax$Node$encode($elm$json$Json$Encode$string),
					generics)),
				_Utils_Tuple2(
				'constructors',
				A2(
					$elm$json$Json$Encode$list,
					$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Type$encodeValueConstructor),
					constructors))
			]));
};
var $stil4m$elm_syntax$Elm$Syntax$TypeAlias$encode = function (_v0) {
	var documentation = _v0.fG;
	var name = _v0.f8;
	var generics = _v0.d9;
	var typeAnnotation = _v0.gI;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'documentation',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2(
						$elm$core$Maybe$map,
						$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Documentation$encode),
						documentation))),
				_Utils_Tuple2(
				'name',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $elm$json$Json$Encode$string, name)),
				_Utils_Tuple2(
				'generics',
				A2(
					$elm$json$Json$Encode$list,
					$stil4m$elm_syntax$Elm$Syntax$Node$encode($elm$json$Json$Encode$string),
					generics)),
				_Utils_Tuple2(
				'typeAnnotation',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$TypeAnnotation$encode, typeAnnotation))
			]));
};
var $stil4m$elm_syntax$Elm$Syntax$Declaration$encode = function (decl) {
	switch (decl.$) {
		case 0:
			var _function = decl.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'function',
				$stil4m$elm_syntax$Elm$Syntax$Expression$encodeFunction(_function));
		case 1:
			var typeAlias = decl.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'typeAlias',
				$stil4m$elm_syntax$Elm$Syntax$TypeAlias$encode(typeAlias));
		case 2:
			var typeDeclaration = decl.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'typedecl',
				$stil4m$elm_syntax$Elm$Syntax$Type$encode(typeDeclaration));
		case 3:
			var sig = decl.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'port',
				$stil4m$elm_syntax$Elm$Syntax$Signature$encode(sig));
		case 4:
			var inf = decl.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'infix',
				$stil4m$elm_syntax$Elm$Syntax$Infix$encode(inf));
		default:
			var pattern = decl.a;
			var expression = decl.b;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'destructuring',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'pattern',
							A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Pattern$encode, pattern)),
							_Utils_Tuple2(
							'expression',
							A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Expression$encode, expression))
						])));
	}
};
var $stil4m$elm_syntax$Elm$Syntax$Exposing$encodeExposedType = function (_v0) {
	var name = _v0.f8;
	var open = _v0.ca;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(name)),
				_Utils_Tuple2(
				'open',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $stil4m$elm_syntax$Elm$Syntax$Range$encode, open)))
			]));
};
var $stil4m$elm_syntax$Elm$Syntax$Exposing$encodeTopLevelExpose = $stil4m$elm_syntax$Elm$Syntax$Node$encode(
	function (exp) {
		switch (exp.$) {
			case 0:
				var x = exp.a;
				return A2(
					$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
					'infix',
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'name',
								$elm$json$Json$Encode$string(x))
							])));
			case 1:
				var x = exp.a;
				return A2(
					$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
					'function',
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'name',
								$elm$json$Json$Encode$string(x))
							])));
			case 2:
				var x = exp.a;
				return A2(
					$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
					'typeOrAlias',
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'name',
								$elm$json$Json$Encode$string(x))
							])));
			default:
				var exposedType = exp.a;
				return A2(
					$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
					'typeexpose',
					$stil4m$elm_syntax$Elm$Syntax$Exposing$encodeExposedType(exposedType));
		}
	});
var $stil4m$elm_syntax$Elm$Syntax$Exposing$encode = function (exp) {
	if (!exp.$) {
		var r = exp.a;
		return A2(
			$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
			'all',
			$stil4m$elm_syntax$Elm$Syntax$Range$encode(r));
	} else {
		var l = exp.a;
		return A2(
			$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
			'explicit',
			A2($elm$json$Json$Encode$list, $stil4m$elm_syntax$Elm$Syntax$Exposing$encodeTopLevelExpose, l));
	}
};
var $stil4m$elm_syntax$Elm$Syntax$Import$encode = function (_v0) {
	var moduleName = _v0.a_;
	var moduleAlias = _v0.et;
	var exposingList = _v0.bI;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'moduleName',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$ModuleName$encode, moduleName)),
				_Utils_Tuple2(
				'moduleAlias',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2(
						$elm$core$Maybe$map,
						$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$ModuleName$encode),
						moduleAlias))),
				_Utils_Tuple2(
				'exposingList',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2(
						$elm$core$Maybe$map,
						$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Exposing$encode),
						exposingList)))
			]));
};
var $stil4m$elm_syntax$Elm$Syntax$Module$encodeDefaultModuleData = function (moduleData) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'moduleName',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$ModuleName$encode, moduleData.a_)),
				_Utils_Tuple2(
				'exposingList',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Exposing$encode, moduleData.bI))
			]));
};
var $stil4m$elm_syntax$Elm$Syntax$Module$encodeEffectModuleData = function (moduleData) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'moduleName',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$ModuleName$encode, moduleData.a_)),
				_Utils_Tuple2(
				'exposingList',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Exposing$encode, moduleData.bI)),
				_Utils_Tuple2(
				'command',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2(
						$elm$core$Maybe$map,
						$stil4m$elm_syntax$Elm$Syntax$Node$encode($elm$json$Json$Encode$string),
						moduleData.cS))),
				_Utils_Tuple2(
				'subscription',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2(
						$elm$core$Maybe$map,
						$stil4m$elm_syntax$Elm$Syntax$Node$encode($elm$json$Json$Encode$string),
						moduleData.dF)))
			]));
};
var $stil4m$elm_syntax$Elm$Syntax$Module$encode = function (m) {
	switch (m.$) {
		case 0:
			var d = m.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'normal',
				$stil4m$elm_syntax$Elm$Syntax$Module$encodeDefaultModuleData(d));
		case 1:
			var d = m.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'port',
				$stil4m$elm_syntax$Elm$Syntax$Module$encodeDefaultModuleData(d));
		default:
			var d = m.a;
			return A2(
				$stil4m$elm_syntax$Elm$Json$Util$encodeTyped,
				'effect',
				$stil4m$elm_syntax$Elm$Syntax$Module$encodeEffectModuleData(d));
	}
};
var $stil4m$elm_syntax$Elm$Syntax$File$encode = function (_v0) {
	var moduleDefinition = _v0.f6;
	var imports = _v0.eg;
	var declarations = _v0.dY;
	var comments = _v0.fs;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'moduleDefinition',
				A2($stil4m$elm_syntax$Elm$Syntax$Node$encode, $stil4m$elm_syntax$Elm$Syntax$Module$encode, moduleDefinition)),
				_Utils_Tuple2(
				'imports',
				A2(
					$elm$json$Json$Encode$list,
					$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Import$encode),
					imports)),
				_Utils_Tuple2(
				'declarations',
				A2(
					$elm$json$Json$Encode$list,
					$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Declaration$encode),
					declarations)),
				_Utils_Tuple2(
				'comments',
				A2(
					$elm$json$Json$Encode$list,
					$stil4m$elm_syntax$Elm$Syntax$Node$encode($stil4m$elm_syntax$Elm$Syntax$Comments$encode),
					comments))
			]));
};
var $stil4m$elm_syntax$Elm$RawFile$encode = function (_v0) {
	var file = _v0;
	return $stil4m$elm_syntax$Elm$Syntax$File$encode(file);
};
var $author$project$Analyser$Files$FileLoader$storeAstForSha = _Platform_outgoingPort(
	'storeAstForSha',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'ast',
					$elm$core$Basics$identity($.fe)),
					_Utils_Tuple2(
					'sha1',
					$elm$json$Json$Encode$string($.gt))
				]));
	});
var $author$project$Analyser$Files$FileLoader$load = function (fc) {
	var _v0 = $author$project$Analyser$Files$FileContent$asRawFile(fc);
	var fileLoad = _v0.a;
	var store = _v0.b;
	var cmd = store ? A2(
		$elm$core$Maybe$withDefault,
		$elm$core$Platform$Cmd$none,
		A2(
			$elm$core$Maybe$map,
			$author$project$Analyser$Files$FileLoader$storeAstForSha,
			A3(
				$elm$core$Maybe$map2,
				$author$project$Analyser$Files$FileLoader$AstStore,
				fc.gt,
				A2(
					$elm$core$Maybe$map,
					$stil4m$elm_syntax$Elm$RawFile$encode,
					$elm$core$Result$toMaybe(fileLoad))))) : $elm$core$Platform$Cmd$none;
	return _Utils_Tuple2(
		_Utils_Tuple2(fc, fileLoad),
		cmd);
};
var $author$project$Analyser$SourceLoadingStage$initWithContent = function (input) {
	var _v0 = $author$project$Analyser$Files$FileLoader$load(input);
	var loadedSourceFile = _v0.a;
	var cmds = _v0.b;
	return _Utils_Tuple2(
		{
			aq: _List_Nil,
			L: $elm$core$Set$empty,
			aB: _List_fromArray(
				[loadedSourceFile])
		},
		cmds);
};
var $author$project$Analyser$Files$DependencyLoader$getDependency = function (m) {
	var _v0 = m.k;
	if (_v0.$ === 4) {
		var d = _v0.a;
		return $elm$core$Maybe$Just(d);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Analyser$DependencyLoadingStage$getDependencies = function (model) {
	return A2(
		$elm$core$List$filterMap,
		$author$project$Analyser$Files$DependencyLoader$getDependency,
		$elm$core$Dict$values(model));
};
var $author$project$Analyser$Files$DependencyLoader$isDone = function (m) {
	var _v0 = m.k;
	switch (_v0.$) {
		case 3:
			return true;
		case 4:
			return true;
		default:
			return false;
	}
};
var $author$project$Analyser$DependencyLoadingStage$isDone = function (model) {
	return A2(
		$elm$core$List$all,
		$author$project$Analyser$Files$DependencyLoader$isDone,
		$elm$core$Dict$values(model));
};
var $stil4m$elm_syntax$Elm$Processing$addDependency = F2(
	function (dep, _v0) {
		var x = _v0;
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, d) {
					return A3($elm$core$Dict$insert, k, v, d);
				}),
			x,
			dep.f_);
	});
var $author$project$Analyser$CodeBase$setDependencies = F2(
	function (deps, _v0) {
		var codeBase = _v0;
		return _Utils_update(
			codeBase,
			{
				fz: deps,
				aD: A3($elm$core$List$foldl, $stil4m$elm_syntax$Elm$Processing$addDependency, codeBase.aD, deps)
			});
	});
var $author$project$Analyser$SourceLoadingStage = function (a) {
	return {$: 2, a: a};
};
var $author$project$Analyser$Files$FileLoader$loadFile = _Platform_outgoingPort('loadFile', $elm$json$Json$Encode$string);
var $author$project$Analyser$Files$FileLoader$init = function (s) {
	return $elm$core$Platform$Cmd$batch(
		_List_fromArray(
			[
				$author$project$Analyser$Files$FileLoader$loadFile(s),
				$author$project$Util$Logger$info('Load file ' + (s + '...'))
			]));
};
var $elm_community$list_extra$List$Extra$uncons = function (list) {
	if (!list.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		var first = list.a;
		var rest = list.b;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(first, rest));
	}
};
var $author$project$Analyser$SourceLoadingStage$loadNextFile = function (_v0) {
	var model = _v0.a;
	var msgs = _v0.b;
	return A2(
		$elm$core$Maybe$withDefault,
		_Utils_Tuple2(model, msgs),
		A2(
			$elm$core$Maybe$map,
			function (_v1) {
				var next = _v1.a;
				var rest = _v1.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aq: rest,
							L: A2($elm$core$Set$insert, next, model.L)
						}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								msgs,
								A2(
								$elm$core$Platform$Cmd$map,
								$author$project$Analyser$SourceLoadingStage$FileLoaderMsg(next),
								$author$project$Analyser$Files$FileLoader$init(next))
							])));
			},
			$elm_community$list_extra$List$Extra$uncons(model.aq)));
};
var $author$project$Analyser$SourceLoadingStage$init = function (input) {
	return $author$project$Analyser$SourceLoadingStage$loadNextFile(
		_Utils_Tuple2(
			{aq: input, L: $elm$core$Set$empty, aB: _List_Nil},
			$elm$core$Platform$Cmd$none));
};
var $author$project$Analyser$startSourceLoading = F2(
	function (files, _v0) {
		var model = _v0.a;
		var cmds = _v0.b;
		var _v1 = function () {
			if (!files.b) {
				return _Utils_Tuple2($author$project$Analyser$Finished, $elm$core$Platform$Cmd$none);
			} else {
				var files_ = files;
				return A2(
					$elm$core$Tuple$mapSecond,
					$elm$core$Platform$Cmd$map($author$project$Analyser$SourceLoadingStageMsg),
					A2(
						$elm$core$Tuple$mapFirst,
						$author$project$Analyser$SourceLoadingStage,
						$author$project$Analyser$SourceLoadingStage$init(files_)));
			}
		}();
		var nextStage = _v1.a;
		var stageCmds = _v1.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{j: nextStage}),
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[stageCmds, cmds])));
	});
var $author$project$Analyser$Files$DependencyLoader$Done = function (a) {
	return {$: 4, a: a};
};
var $author$project$Analyser$Files$DependencyLoader$Failure = {$: 3};
var $author$project$Analyser$Files$DependencyLoader$LoadingOnlineDocs = {$: 1};
var $author$project$Analyser$Files$DependencyLoader$RawDiskLoading = {$: 2};
var $author$project$Analyser$DependencyHandler$loadDependencyFiles = _Platform_outgoingPort(
	'loadDependencyFiles',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'name',
					$elm$json$Json$Encode$string($.f8)),
					_Utils_Tuple2(
					'version',
					$elm$json$Json$Encode$string($.p))
				]));
	});
var $author$project$Analyser$DependencyHandler$loadHttpDocumentation = _Platform_outgoingPort(
	'loadHttpDocumentation',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'name',
					$elm$json$Json$Encode$string($.f8)),
					_Utils_Tuple2(
					'version',
					$elm$json$Json$Encode$string($.p))
				]));
	});
var $author$project$Analyser$DependencyHandler$loadOnlineDocumentation = $author$project$Analyser$DependencyHandler$loadHttpDocumentation;
var $author$project$Analyser$Files$Json$serialiseDependency = A2(
	$elm$core$Basics$composeL,
	$elm$json$Json$Encode$encode(2),
	$author$project$Analyser$Files$Json$encodeDependency);
var $author$project$Analyser$DependencyHandler$storeRawDependency = _Platform_outgoingPort(
	'storeRawDependency',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'content',
					$elm$json$Json$Encode$string($.fv)),
					_Utils_Tuple2(
					'dependency',
					function ($) {
						return $elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'name',
									$elm$json$Json$Encode$string($.f8)),
									_Utils_Tuple2(
									'version',
									$elm$json$Json$Encode$string($.p))
								]));
					}($.y))
				]));
	});
var $author$project$Analyser$DependencyHandler$storeToDisk = function (dependency) {
	return $author$project$Analyser$DependencyHandler$storeRawDependency(
		{
			fv: $author$project$Analyser$Files$Json$serialiseDependency(dependency),
			y: {f8: dependency.f8, p: dependency.p}
		});
};
var $author$project$Analyser$Files$DependencyLoader$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var read = msg.a;
				switch (read.$) {
					case 2:
						var result = read.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									k: $author$project$Analyser$Files$DependencyLoader$Done(result)
								}),
							$author$project$Util$Logger$info('Loaded ' + (model.y.f8 + ' from cache')));
					case 1:
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{k: $author$project$Analyser$Files$DependencyLoader$LoadingOnlineDocs}),
							$author$project$Analyser$DependencyHandler$loadOnlineDocumentation(model.y));
					default:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 1:
				var result = msg.a;
				if (result.$ === 1) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					if (result.a.$ === 1) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{k: $author$project$Analyser$Files$DependencyLoader$RawDiskLoading}),
							$author$project$Analyser$DependencyHandler$loadDependencyFiles(model.y));
					} else {
						var decodedDependency = result.a.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									k: $author$project$Analyser$Files$DependencyLoader$Done(decodedDependency)
								}),
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Analyser$DependencyHandler$storeToDisk(decodedDependency),
										$author$project$Util$Logger$info('Loaded ' + (model.y.f8 + ' from package.elm-lang.org'))
									])));
					}
				}
			default:
				var result = msg.a;
				if (result.$ === 1) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					if (result.a.$ === 1) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{k: $author$project$Analyser$Files$DependencyLoader$Failure}),
							$author$project$Util$Logger$info('Failed to load dependency: ' + model.y.f8));
					} else {
						var decodedDependency = result.a.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									k: $author$project$Analyser$Files$DependencyLoader$Done(decodedDependency)
								}),
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Analyser$DependencyHandler$storeToDisk(decodedDependency),
										$author$project$Util$Logger$info('Loaded ' + (model.y.f8 + ' by building dependency from plain source files'))
									])));
					}
				}
		}
	});
var $author$project$Analyser$DependencyLoadingStage$update = F2(
	function (msg, model) {
		var name = msg.a;
		var subMsg = msg.b;
		var loader = A2($elm$core$Dict$get, name, model);
		if (loader.$ === 1) {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		} else {
			var l = loader.a;
			var _v2 = A2($author$project$Analyser$Files$DependencyLoader$update, subMsg, l);
			var newLoader = _v2.a;
			var cmds = _v2.b;
			return _Utils_Tuple2(
				A3($elm$core$Dict$insert, name, newLoader, model),
				A2(
					$elm$core$Platform$Cmd$map,
					$author$project$Analyser$DependencyLoadingStage$DependencyLoaderMsg(name),
					cmds));
		}
	});
var $author$project$Analyser$onDependencyLoadingStageMsg = F3(
	function (x, stage, model) {
		var _v0 = A2($author$project$Analyser$DependencyLoadingStage$update, x, stage);
		var newStage = _v0.a;
		var cmds = _v0.b;
		if ($author$project$Analyser$DependencyLoadingStage$isDone(newStage)) {
			var newDependencies = $author$project$Analyser$DependencyLoadingStage$getDependencies(newStage);
			return A2(
				$author$project$Analyser$startSourceLoading,
				model.aM.gw,
				_Utils_Tuple2(
					_Utils_update(
						model,
						{
							E: A2($author$project$Analyser$CodeBase$setDependencies, newDependencies, model.E)
						}),
					A2($elm$core$Platform$Cmd$map, $author$project$Analyser$DependencyLoadingStageMsg, cmds)));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						j: $author$project$Analyser$DependencyLoadingStage(newStage)
					}),
				A2($elm$core$Platform$Cmd$map, $author$project$Analyser$DependencyLoadingStageMsg, cmds));
		}
	});
var $author$project$Analyser$Fixer$isDone = function (_v0) {
	var m = _v0;
	return m.ap;
};
var $author$project$Analyser$Fixer$message = function (_v0) {
	var m = _v0;
	return m.ac;
};
var $author$project$Analyser$Fixer$succeeded = function (_v0) {
	var m = _v0;
	return m.gB;
};
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (!result.$) {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $author$project$Analyser$Fixer$applyFix = F2(
	function (model, pair) {
		var _v0 = A2(model.bK.d6, pair, model.ac.cU);
		switch (_v0.$) {
			case 2:
				var e = _v0.a;
				return $elm$core$Result$Err(e);
			case 1:
				var p = _v0.a;
				return $elm$core$Result$Ok(p);
			default:
				return $elm$core$Result$Err('Invalid message data for fixer ' + model.bK.fk);
		}
	});
var $author$project$Analyser$Messages$Data$description = function (_v0) {
	var d = _v0.a;
	return d;
};
var $author$project$Analyser$Fixer$fileHashEqual = F2(
	function (reference, mess) {
		return _Utils_eq(reference.d5, mess.d5);
	});
var $author$project$Analyser$Fixer$storeFile = _Platform_outgoingPort(
	'storeFile',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'file',
					$elm$json$Json$Encode$string($.d5)),
					_Utils_Tuple2(
					'newContent',
					$elm$json$Json$Encode$string($.c4))
				]));
	});
var $author$project$Util$Logger$warning = A2(
	$elm$core$Basics$composeR,
	$author$project$Util$Logger$LogMessage('WARN'),
	$author$project$Util$Logger$log);
var $author$project$Analyser$Fixer$update = F3(
	function (codeBase, msg, _v0) {
		var model = _v0;
		if (!msg.$) {
			var reference = msg.a;
			if (!A2($author$project$Analyser$Fixer$fileHashEqual, reference, model.ac)) {
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ap: true, gB: false}),
					$author$project$Util$Logger$warning('Could not fix file: Sha1 mismatch. Message is outdated for the corresponding file. Maybe refresh the messages.'));
			} else {
				var changedContent = A2(
					$elm$core$Result$andThen,
					function (x) {
						return A2($author$project$Analyser$Fixer$applyFix, model, x);
					},
					A2(
						$elm$core$Result$fromMaybe,
						'Could not parse file',
						function (fileLoad) {
							return $elm$core$Result$toMaybe(
								A2(
									$elm$core$Result$map,
									function (b) {
										return _Utils_Tuple2(fileLoad.fv, b);
									},
									A2(
										$elm$core$Result$map,
										$stil4m$elm_syntax$Elm$Processing$process(
											$author$project$Analyser$CodeBase$processContext(codeBase)),
										$stil4m$elm_syntax$Elm$Parser$parse(fileLoad.fv))));
						}(reference)));
				if (!changedContent.$) {
					var newContent = changedContent.a;
					return _Utils_Tuple2(
						model,
						$author$project$Analyser$Fixer$storeFile(
							{d5: model.ac.d5.ci, c4: newContent}));
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{ap: true, gB: false}),
						$author$project$Util$Logger$warning('Could not fix file: There was an error while loading the file.'));
				}
			}
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{ap: true}),
				$author$project$Util$Logger$info(
					'Fixed message: ' + $author$project$Analyser$Messages$Data$description(model.ac.cU)));
		}
	});
var $author$project$Analyser$onFixerMsg = F3(
	function (x, stage, model) {
		var _v0 = A2(
			$elm$core$Tuple$mapSecond,
			$elm$core$Platform$Cmd$map($author$project$Analyser$FixerMsg),
			A3($author$project$Analyser$Fixer$update, model.E, x, stage));
		var newFixerModel = _v0.a;
		var fixerCmds = _v0.b;
		return $author$project$Analyser$Fixer$isDone(newFixerModel) ? ($author$project$Analyser$Fixer$succeeded(newFixerModel) ? _Utils_Tuple2(
			_Utils_update(
				model,
				{j: $author$project$Analyser$Finished}),
			fixerCmds) : A2(
			$author$project$Analyser$startSourceLoading,
			_List_fromArray(
				[
					$author$project$Analyser$Messages$Util$messageFile(
					$author$project$Analyser$Fixer$message(newFixerModel))
				]),
			_Utils_Tuple2(model, fixerCmds))) : _Utils_Tuple2(
			_Utils_update(
				model,
				{
					j: $author$project$Analyser$FixerStage(newFixerModel)
				}),
			fixerCmds);
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Set$isEmpty = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$isEmpty(dict);
};
var $author$project$Analyser$SourceLoadingStage$isDone = function (_v0) {
	var model = _v0;
	return $elm$core$List$isEmpty(model.aq) && $elm$core$Set$isEmpty(model.L);
};
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$remove, key, dict);
	});
var $author$project$Analyser$Files$FileLoader$update = function (msg) {
	var fc = msg;
	return $author$project$Analyser$Files$FileLoader$load(fc);
};
var $author$project$Analyser$SourceLoadingStage$update = F2(
	function (msg, _v0) {
		var state = _v0;
		var name = msg.a;
		var subMsg = msg.b;
		var _v2 = $author$project$Analyser$Files$FileLoader$update(subMsg);
		var fileLoad = _v2.a;
		var cmd = _v2.b;
		return $author$project$Analyser$SourceLoadingStage$loadNextFile(
			_Utils_Tuple2(
				_Utils_update(
					state,
					{
						L: A2($elm$core$Set$remove, name, state.L),
						aB: A2($elm$core$List$cons, fileLoad, state.aB)
					}),
				A2(
					$elm$core$Platform$Cmd$map,
					$author$project$Analyser$SourceLoadingStage$FileLoaderMsg(name),
					cmd)));
	});
var $author$project$Analyser$onSourceLoadingStageMsg = F3(
	function (x, stage, model) {
		var _v0 = A2($author$project$Analyser$SourceLoadingStage$update, x, stage);
		var newStage = _v0.a;
		var cmds = _v0.b;
		return $author$project$Analyser$SourceLoadingStage$isDone(newStage) ? A3($author$project$Analyser$finishProcess, newStage, cmds, model) : _Utils_Tuple2(
			_Utils_update(
				model,
				{
					j: $author$project$Analyser$SourceLoadingStage(newStage)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Analyser$SourceLoadingStageMsg, cmds));
	});
var $author$project$Analyser$Messages$Types$Outdated = 0;
var $author$project$Analyser$Messages$Types$outdate = function (m) {
	return _Utils_update(
		m,
		{gy: 0});
};
var $author$project$Analyser$State$outdateMessagesForFile = F2(
	function (fileName, state) {
		return _Utils_update(
			state,
			{
				es: A2(
					$elm$core$List$map,
					function (m) {
						return _Utils_eq(
							$author$project$Analyser$Messages$Util$messageFile(m),
							fileName) ? $author$project$Analyser$Messages$Types$outdate(m) : m;
					},
					state.es)
			});
	});
var $author$project$Analyser$State$removeMessagesForFile = F2(
	function (fileName, state) {
		return _Utils_update(
			state,
			{
				es: A2(
					$elm$core$List$filter,
					function (m) {
						return !_Utils_eq(
							$author$project$Analyser$Messages$Util$messageFile(m),
							fileName);
					},
					state.es)
			});
	});
var $author$project$AnalyserPorts$sendFixedFile = _Platform_outgoingPort(
	'sendFixedFile',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'content',
					$elm$json$Json$Encode$string($.fv)),
					_Utils_Tuple2(
					'path',
					$elm$json$Json$Encode$string($.ci))
				]));
	});
var $author$project$Analyser$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 6:
				var messageId = msg.a;
				return $author$project$Analyser$handleNextStep(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								k: A2($author$project$Analyser$State$addFixToQueue, messageId, model.k)
							}),
						$elm$core$Platform$Cmd$none));
			case 7:
				var messageId = msg.a;
				var applyFix = function (message) {
					return A2(
						$elm$core$Maybe$withDefault,
						$elm$core$Result$Err(
							'Unable to fix messageId: ' + $elm$core$String$fromInt(messageId)),
						A2(
							$elm$core$Maybe$map,
							$author$project$Analyser$Fixer$getFixedFile(message),
							A2($author$project$Analyser$getFileContext, message.d5.ci, model.E)));
				};
				var _v1 = A2($author$project$Analyser$State$getMessage, messageId, model.k);
				if (!_v1.$) {
					var message = _v1.a;
					var _v2 = applyFix(message);
					if (!_v2.$) {
						var fixedFile = _v2.a;
						return _Utils_Tuple2(
							model,
							$author$project$AnalyserPorts$sendFixedFile(
								{fv: fixedFile, ci: message.d5.ci}));
					} else {
						var err = _v2.a;
						return _Utils_Tuple2(
							model,
							$author$project$Util$Logger$error(err));
					}
				} else {
					return _Utils_Tuple2(
						model,
						$author$project$Util$Logger$info(
							'Unable to apply fix, unable to find messageId: ' + $elm$core$String$fromInt(messageId)));
				}
			case 5:
				return $author$project$Analyser$reset(
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
			case 0:
				var context = msg.a;
				var _v3 = $author$project$Analyser$Configuration$fromString(context.X);
				var configuration = _v3.a;
				var messages = _v3.b;
				var _v4 = $author$project$Analyser$DependencyLoadingStage$init(model.R);
				var stage = _v4.a;
				var cmds = _v4.b;
				return $author$project$Analyser$doSendState(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								X: configuration,
								aM: context,
								j: $author$project$Analyser$DependencyLoadingStage(stage)
							}),
						$elm$core$Platform$Cmd$batch(
							A2(
								$elm$core$List$cons,
								A2($elm$core$Platform$Cmd$map, $author$project$Analyser$DependencyLoadingStageMsg, cmds),
								A2($elm$core$List$map, $author$project$Util$Logger$info, messages)))));
			case 1:
				var x = msg.a;
				var _v5 = model.j;
				if (_v5.$ === 1) {
					var stage = _v5.a;
					return A3($author$project$Analyser$onDependencyLoadingStageMsg, x, stage, model);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 2:
				var x = msg.a;
				var _v6 = model.j;
				if (_v6.$ === 2) {
					var stage = _v6.a;
					return A3($author$project$Analyser$onSourceLoadingStageMsg, x, stage, model);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 8:
				var x = msg.a;
				var _v7 = model.j;
				if (_v7.$ === 3) {
					var stage = _v7.a;
					return A3($author$project$Analyser$onFixerMsg, x, stage, model);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 4:
				return (_Utils_eq(model.j, $author$project$Analyser$Finished) && (!_Utils_eq(model.D, _List_Nil))) ? A2(
					$author$project$Analyser$startSourceLoading,
					model.D,
					_Utils_Tuple2(
						_Utils_update(
							model,
							{D: _List_Nil}),
						$elm$core$Platform$Cmd$none)) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			default:
				if (msg.a.$ === 1) {
					var _v11 = msg.a;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					if (!msg.a.a.$) {
						var _v8 = msg.a.a;
						var path = _v8.a;
						var maybeContent = _v8.b;
						if (!maybeContent.$) {
							var content = maybeContent.a;
							var finishQuick = function (_v10) {
								var sourceModel = _v10.a;
								var sourceCmds = _v10.b;
								return A3(
									$author$project$Analyser$finishProcess,
									sourceModel,
									sourceCmds,
									_Utils_update(
										model,
										{
											k: A2($author$project$Analyser$State$outdateMessagesForFile, path, model.k)
										}));
							};
							return finishQuick(
								$author$project$Analyser$SourceLoadingStage$initWithContent(content));
						} else {
							return A2(
								$author$project$Analyser$startSourceLoading,
								A2($elm$core$List$cons, path, model.D),
								_Utils_Tuple2(
									_Utils_update(
										model,
										{
											D: _List_Nil,
											k: A2($author$project$Analyser$State$outdateMessagesForFile, path, model.k)
										}),
									$elm$core$Platform$Cmd$none));
						}
					} else {
						var x = msg.a.a.a;
						return $author$project$Analyser$doSendState(
							_Utils_Tuple2(
								_Utils_update(
									model,
									{
										D: A2(
											$elm$core$List$filter,
											A2(
												$elm$core$Basics$composeL,
												$elm$core$Basics$not,
												$elm$core$Basics$eq(x)),
											model.D),
										k: A2($author$project$Analyser$State$removeMessagesForFile, x, model.k)
									}),
								$author$project$Util$Logger$info('File was removed: \'' + (x + '\'. Removing known messages.'))));
					}
				}
		}
	});
var $elm$core$Platform$worker = _Platform_worker;
var $author$project$Analyser$main = $elm$core$Platform$worker(
	{fY: $author$project$Analyser$init, gA: $author$project$Analyser$subscriptions, gO: $author$project$Analyser$update});
_Platform_export({'Analyser':{'init':$author$project$Analyser$main(
	A2(
		$elm$json$Json$Decode$andThen,
		function (server) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (registry) {
					return A2(
						$elm$json$Json$Decode$andThen,
						function (project) {
							return $elm$json$Json$Decode$succeed(
								{R: project, S: registry, T: server});
						},
						A2($elm$json$Json$Decode$field, 'project', $elm$json$Json$Decode$value));
				},
				A2($elm$json$Json$Decode$field, 'registry', $elm$json$Json$Decode$value));
		},
		A2($elm$json$Json$Decode$field, 'server', $elm$json$Json$Decode$bool)))(0)}});}(this));