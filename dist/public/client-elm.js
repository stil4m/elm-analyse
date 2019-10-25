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
	if (region.E.aL === region.bw.aL)
	{
		return 'on line ' + region.E.aL;
	}
	return 'on lines ' + region.E.aL + ' through ' + region.bw.aL;
}



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
		impl.fS,
		impl.gF,
		impl.gv,
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




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		S: func(record.S),
		dt: record.dt,
		dk: record.dk
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.S;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.dt;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.dk) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.fS,
		impl.gF,
		impl.gv,
		function(sendToApp, initialModel) {
			var view = impl.gJ;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.fS,
		impl.gF,
		impl.gv,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.dq && impl.dq(sendToApp)
			var view = impl.gJ;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.e7);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.gA) && (_VirtualDom_doc.title = title = doc.gA);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.gc;
	var onUrlRequest = impl.gd;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		dq: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.ex === next.ex
							&& curr.d2 === next.d2
							&& curr.es.a === next.es.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		fS: function(flags)
		{
			return A3(impl.fS, flags, _Browser_getUrl(), key);
		},
		gJ: impl.gJ,
		gF: impl.gF,
		gv: impl.gv
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { fN: 'hidden', ff: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { fN: 'mozHidden', ff: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { fN: 'msHidden', ff: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { fN: 'webkitHidden', ff: 'webkitvisibilitychange' }
		: { fN: 'hidden', ff: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		eG: _Browser_getScene(),
		e$: {
			cE: _Browser_window.pageXOffset,
			cF: _Browser_window.pageYOffset,
			aw: _Browser_doc.documentElement.clientWidth,
			ah: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		aw: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		ah: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			eG: {
				aw: node.scrollWidth,
				ah: node.scrollHeight
			},
			e$: {
				cE: node.scrollLeft,
				cF: node.scrollTop,
				aw: node.clientWidth,
				ah: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			eG: _Browser_getScene(),
			e$: {
				cE: x,
				cF: y,
				aw: _Browser_doc.documentElement.clientWidth,
				ah: _Browser_doc.documentElement.clientHeight
			},
			fw: {
				cE: x + rect.left,
				cF: y + rect.top,
				aw: rect.width,
				ah: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}


// SEND REQUEST

var _Http_toTask = F2(function(request, maybeProgress)
{
	return _Scheduler_binding(function(callback)
	{
		var xhr = new XMLHttpRequest();

		_Http_configureProgress(xhr, maybeProgress);

		xhr.addEventListener('error', function() {
			callback(_Scheduler_fail($elm$http$Http$NetworkError));
		});
		xhr.addEventListener('timeout', function() {
			callback(_Scheduler_fail($elm$http$Http$Timeout));
		});
		xhr.addEventListener('load', function() {
			callback(_Http_handleResponse(xhr, request.fy.a));
		});

		try
		{
			xhr.open(request.f_, request.gG, true);
		}
		catch (e)
		{
			return callback(_Scheduler_fail($elm$http$Http$BadUrl(request.gG)));
		}

		_Http_configureRequest(xhr, request);

		var body = request.e7;
		xhr.send($elm$http$Http$Internal$isStringBody(body)
			? (xhr.setRequestHeader('Content-Type', body.a), body.b)
			: body.a
		);

		return function() { xhr.abort(); };
	});
});

function _Http_configureProgress(xhr, maybeProgress)
{
	if (!$elm$core$Maybe$isJust(maybeProgress))
	{
		return;
	}

	xhr.addEventListener('progress', function(event) {
		if (!event.lengthComputable)
		{
			return;
		}
		_Scheduler_rawSpawn(maybeProgress.a({
			fa: event.loaded,
			fb: event.total
		}));
	});
}

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.fL; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}

	xhr.responseType = request.fy.b;
	xhr.withCredentials = request.gK;

	$elm$core$Maybe$isJust(request.gz) && (xhr.timeout = request.gz.a);
}


// RESPONSES

function _Http_handleResponse(xhr, responseToResult)
{
	var response = _Http_toResponse(xhr);

	if (xhr.status < 200 || 300 <= xhr.status)
	{
		response.body = xhr.responseText;
		return _Scheduler_fail($elm$http$Http$BadStatus(response));
	}

	var result = responseToResult(response);

	if ($elm$core$Result$isOk(result))
	{
		return _Scheduler_succeed(result.a);
	}
	else
	{
		response.body = xhr.responseText;
		return _Scheduler_fail(A2($elm$http$Http$BadPayload, result.a, response));
	}
}

function _Http_toResponse(xhr)
{
	return {
		gG: xhr.responseURL,
		gt: { fj: xhr.status, S: xhr.statusText },
		fL: _Http_parseHeaders(xhr.getAllResponseHeaders()),
		e7: xhr.response
	};
}

function _Http_parseHeaders(rawHeaders)
{
	var headers = $elm$core$Dict$empty;

	if (!rawHeaders)
	{
		return headers;
	}

	var headerPairs = rawHeaders.split('\u000d\u000a');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf('\u003a\u0020');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}

	return headers;
}


// EXPECTORS

function _Http_expectStringResponse(responseToResult)
{
	return {
		$: 0,
		b: 'text',
		a: responseToResult
	};
}

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		b: expect.b,
		a: function(response) {
			var convertedResponse = expect.a(response);
			return A2($elm$core$Result$map, func, convertedResponse);
		}
	};
});


// BODY

function _Http_multipart(parts)
{


	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}

	return $elm$http$Http$Internal$FormDataBody(formData);
}



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


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.f1) { flags += 'm'; }
	if (options.fd) { flags += 'i'; }

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
var $author$project$Client$App$App$OnUrlChange = function (a) {
	return {$: 4, a: a};
};
var $author$project$Client$App$App$OnUrlRequest = function (a) {
	return {$: 3, a: a};
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
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
		if (!builder.h) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.i),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.i);
		} else {
			var treeLen = builder.h * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.j) : builder.j;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.h);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.i) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.i);
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
					{j: nodeList, h: (len / $elm$core$Array$branchFactor) | 0, i: tail});
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
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {d$: fragment, d2: host, gg: path, es: port_, ex: protocol, ey: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
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
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
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
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$application = _Browser_application;
var $krisajenkins$remotedata$RemoteData$Loading = {$: 1};
var $author$project$Client$App$App$NotFound = {$: 6};
var $author$project$Client$Routing$NotFound = 6;
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {Q: frag, V: params, L: unvisited, F: value, Z: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.L;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.F);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.F);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 1) {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$core$Basics$compare = _Utils_compare;
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
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
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
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 1) {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 1) {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 1) {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.gg),
					$elm$url$Url$Parser$prepareQuery(url.ey),
					url.d$,
					$elm$core$Basics$identity)));
	});
var $author$project$Client$Routing$Dashboard = 0;
var $author$project$Client$Routing$Dependencies = 1;
var $author$project$Client$Routing$FileTree = 4;
var $author$project$Client$Routing$Messages = 3;
var $author$project$Client$Routing$Modules = 2;
var $author$project$Client$Routing$PackageDependencies = 5;
var $elm$url$Url$Parser$Parser = $elm$core$Basics$identity;
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.Z;
		var unvisited = _v0.L;
		var params = _v0.V;
		var frag = _v0.Q;
		var value = _v0.F;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0;
		return function (_v1) {
			var visited = _v1.Z;
			var unvisited = _v1.L;
			var params = _v1.V;
			var frag = _v1.Q;
			var value = _v1.F;
			return A2(
				$elm$core$List$map,
				$elm$url$Url$Parser$mapState(value),
				parseArg(
					A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
		};
	});
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
var $elm$url$Url$Parser$oneOf = function (parsers) {
	return function (state) {
		return A2(
			$elm$core$List$concatMap,
			function (_v0) {
				var parser = _v0;
				return parser(state);
			},
			parsers);
	};
};
var $elm$url$Url$Parser$s = function (str) {
	return function (_v0) {
		var visited = _v0.Z;
		var unvisited = _v0.L;
		var params = _v0.V;
		var frag = _v0.Q;
		var value = _v0.F;
		if (!unvisited.b) {
			return _List_Nil;
		} else {
			var next = unvisited.a;
			var rest = unvisited.b;
			return _Utils_eq(next, str) ? _List_fromArray(
				[
					A5(
					$elm$url$Url$Parser$State,
					A2($elm$core$List$cons, next, visited),
					rest,
					params,
					frag,
					value)
				]) : _List_Nil;
		}
	};
};
var $elm$url$Url$Parser$top = function (state) {
	return _List_fromArray(
		[state]);
};
var $author$project$Client$Routing$parser = $elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2($elm$url$Url$Parser$map, 0, $elm$url$Url$Parser$top),
			A2(
			$elm$url$Url$Parser$map,
			0,
			$elm$url$Url$Parser$s('dashboard')),
			A2(
			$elm$url$Url$Parser$map,
			1,
			$elm$url$Url$Parser$s('dependencies')),
			A2(
			$elm$url$Url$Parser$map,
			2,
			$elm$url$Url$Parser$s('modules')),
			A2(
			$elm$url$Url$Parser$map,
			3,
			$elm$url$Url$Parser$s('messages')),
			A2(
			$elm$url$Url$Parser$map,
			4,
			$elm$url$Url$Parser$s('tree')),
			A2(
			$elm$url$Url$Parser$map,
			5,
			$elm$url$Url$Parser$s('package-dependencies'))
		]));
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Client$Routing$fromUrl = function (url) {
	return A2(
		$elm$core$Maybe$withDefault,
		6,
		A2($elm$url$Url$Parser$parse, $author$project$Client$Routing$parser, url));
};
var $author$project$Client$App$App$DashboardContent = {$: 1};
var $author$project$Client$App$App$DependenciesPageContent = {$: 2};
var $author$project$Client$App$App$FileTreeContent = function (a) {
	return {$: 3, a: a};
};
var $author$project$Client$App$App$FileTreeMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Client$App$App$GraphContent = function (a) {
	return {$: 4, a: a};
};
var $author$project$Client$App$App$MessagesPageContent = function (a) {
	return {$: 0, a: a};
};
var $author$project$Client$App$App$PackageDependenciesContent = function (a) {
	return {$: 5, a: a};
};
var $author$project$Client$Components$FileTree$OnFileTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $author$project$Analyser$Messages$Grouped$GroupedMessages = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
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
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Analyser$Messages$Grouped$byType = function (messages) {
	return A2(
		$author$project$Analyser$Messages$Grouped$GroupedMessages,
		A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.dZ;
			},
			function ($) {
				return $.gg;
			}),
		A2(
			$elm$core$List$sortBy,
			$elm$core$Tuple$first,
			$elm$core$Dict$toList(
				A2(
					$elm_community$dict_extra$Dict$Extra$groupBy,
					function ($) {
						return $.gD;
					},
					messages))));
};
var $elm$http$Http$Internal$EmptyBody = {$: 0};
var $elm$http$Http$emptyBody = $elm$http$Http$Internal$EmptyBody;
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$http$Http$BadPayload = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$BadStatus = function (a) {
	return {$: 3, a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Internal$FormDataBody = function (a) {
	return {$: 2, a: a};
};
var $elm$http$Http$NetworkError = {$: 2};
var $elm$http$Http$Timeout = {$: 1};
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$http$Http$Internal$isStringBody = function (body) {
	if (body.$ === 1) {
		return true;
	} else {
		return false;
	}
};
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
var $elm$http$Http$expectStringResponse = _Http_expectStringResponse;
var $elm$http$Http$expectJson = function (decoder) {
	return $elm$http$Http$expectStringResponse(
		function (response) {
			var _v0 = A2($elm$json$Json$Decode$decodeString, decoder, response.e7);
			if (_v0.$ === 1) {
				var decodeError = _v0.a;
				return $elm$core$Result$Err(
					$elm$json$Json$Decode$errorToString(decodeError));
			} else {
				var value = _v0.a;
				return $elm$core$Result$Ok(value);
			}
		});
};
var $elm$http$Http$Internal$Request = $elm$core$Basics$identity;
var $elm$http$Http$request = $elm$core$Basics$identity;
var $elm$http$Http$get = F2(
	function (url, decoder) {
		return $elm$http$Http$request(
			{
				e7: $elm$http$Http$emptyBody,
				fy: $elm$http$Http$expectJson(decoder),
				fL: _List_Nil,
				f_: 'GET',
				gz: $elm$core$Maybe$Nothing,
				gG: url,
				gK: false
			});
	});
var $author$project$Client$Components$MessageList$Model = F2(
	function (messages, active) {
		return {aa: active, o: messages};
	});
var $author$project$Client$Components$ActiveMessageDialog$init = $elm$core$Maybe$Nothing;
var $author$project$Client$Components$MessageList$init = function (m) {
	return A2($author$project$Client$Components$MessageList$Model, m, $author$project$Client$Components$ActiveMessageDialog$init);
};
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			A2(
				$elm$core$Task$onError,
				A2(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
					$elm$core$Result$Err),
				A2(
					$elm$core$Task$andThen,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Ok),
					task)));
	});
var $elm$http$Http$toTask = function (_v0) {
	var request_ = _v0;
	return A2(_Http_toTask, request_, $elm$core$Maybe$Nothing);
};
var $elm$http$Http$send = F2(
	function (resultToMessage, request_) {
		return A2(
			$elm$core$Task$attempt,
			resultToMessage,
			$elm$http$Http$toTask(request_));
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Client$Components$FileTree$init = _Utils_Tuple2(
	{
		aC: $elm$core$Maybe$Nothing,
		ai: true,
		T: $author$project$Client$Components$MessageList$init(
			$author$project$Analyser$Messages$Grouped$byType(_List_Nil)),
		aU: $elm$core$Maybe$Nothing,
		cs: $elm$core$Maybe$Nothing
	},
	$elm$core$Platform$Cmd$batch(
		_List_fromArray(
			[
				A2(
				$elm$http$Http$send,
				$author$project$Client$Components$FileTree$OnFileTree,
				A2(
					$elm$http$Http$get,
					'/api/tree',
					$elm$json$Json$Decode$list($elm$json$Json$Decode$string)))
			])));
var $author$project$Client$Graph$Graph$Model = $elm$core$Basics$identity;
var $elm_community$graph$Graph$Node = F2(
	function (id, label) {
		return {d5: id, ef: label};
	});
var $elm_community$graph$Graph$Edge = F3(
	function (from, to, label) {
		return {fF: from, ef: label, gB: to};
	});
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
var $author$project$ModuleGraph$nodeFromModuleName = function (x) {
	return {
		aP: x,
		eT: A2($elm$core$String$join, '.', x)
	};
};
var $author$project$Client$GraphBuilder$edgesInFile = F2(
	function (moduleIndex, _v0) {
		var from = _v0.a;
		var to = _v0.b;
		var lookup = A2(
			$elm$core$Basics$composeR,
			$elm$core$String$join('.'),
			function (a) {
				return A2($elm$core$Dict$get, a, moduleIndex);
			});
		return A2(
			$elm$core$Maybe$map,
			function (_v1) {
				var fromId = _v1.a;
				var toId = _v1.b;
				return A3(
					$elm_community$graph$Graph$Edge,
					fromId,
					toId,
					$author$project$ModuleGraph$nodeFromModuleName(from));
			},
			A3(
				$elm$core$Maybe$map2,
				F2(
					function (a, b) {
						return _Utils_Tuple2(a, b);
					}),
				lookup(from),
				lookup(to)));
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
var $elm_community$graph$Graph$Graph = $elm$core$Basics$identity;
var $elm_community$graph$Graph$NodeContext = F3(
	function (node, incoming, outgoing) {
		return {d7: incoming, en: node, eq: outgoing};
	});
var $elm_community$intdict$IntDict$Empty = {$: 0};
var $elm_community$intdict$IntDict$empty = $elm_community$intdict$IntDict$Empty;
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm_community$intdict$IntDict$Inner = function (a) {
	return {$: 2, a: a};
};
var $elm_community$intdict$IntDict$size = function (dict) {
	switch (dict.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		default:
			var i = dict.a;
			return i.dr;
	}
};
var $elm_community$intdict$IntDict$inner = F3(
	function (p, l, r) {
		var _v0 = _Utils_Tuple2(l, r);
		if (!_v0.a.$) {
			var _v1 = _v0.a;
			return r;
		} else {
			if (!_v0.b.$) {
				var _v2 = _v0.b;
				return l;
			} else {
				return $elm_community$intdict$IntDict$Inner(
					{
						fX: l,
						d: p,
						gm: r,
						dr: $elm_community$intdict$IntDict$size(l) + $elm_community$intdict$IntDict$size(r)
					});
			}
		}
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Bitwise$complement = _Bitwise_complement;
var $elm$core$Bitwise$or = _Bitwise_or;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm_community$intdict$IntDict$highestBitSet = function (n) {
	var shiftOr = F2(
		function (i, shift) {
			return i | (i >>> shift);
		});
	var n1 = A2(shiftOr, n, 1);
	var n2 = A2(shiftOr, n1, 2);
	var n3 = A2(shiftOr, n2, 4);
	var n4 = A2(shiftOr, n3, 8);
	var n5 = A2(shiftOr, n4, 16);
	return n5 & (~(n5 >>> 1));
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm_community$intdict$IntDict$signBit = $elm_community$intdict$IntDict$highestBitSet(-1);
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm_community$intdict$IntDict$isBranchingBitSet = function (p) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$Bitwise$xor($elm_community$intdict$IntDict$signBit),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Bitwise$and(p.ae),
			$elm$core$Basics$neq(0)));
};
var $elm_community$intdict$IntDict$higherBitMask = function (branchingBit) {
	return branchingBit ^ (~(branchingBit - 1));
};
var $elm_community$intdict$IntDict$lcp = F2(
	function (x, y) {
		var branchingBit = $elm_community$intdict$IntDict$highestBitSet(x ^ y);
		var mask = $elm_community$intdict$IntDict$higherBitMask(branchingBit);
		var prefixBits = x & mask;
		return {ae: branchingBit, D: prefixBits};
	});
var $elm_community$intdict$IntDict$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm_community$intdict$IntDict$leaf = F2(
	function (k, v) {
		return $elm_community$intdict$IntDict$Leaf(
			{fW: k, F: v});
	});
var $elm_community$intdict$IntDict$prefixMatches = F2(
	function (p, n) {
		return _Utils_eq(
			n & $elm_community$intdict$IntDict$higherBitMask(p.ae),
			p.D);
	});
var $elm_community$intdict$IntDict$update = F3(
	function (key, alter, dict) {
		var join = F2(
			function (_v2, _v3) {
				var k1 = _v2.a;
				var l = _v2.b;
				var k2 = _v3.a;
				var r = _v3.b;
				var prefix = A2($elm_community$intdict$IntDict$lcp, k1, k2);
				return A2($elm_community$intdict$IntDict$isBranchingBitSet, prefix, k2) ? A3($elm_community$intdict$IntDict$inner, prefix, l, r) : A3($elm_community$intdict$IntDict$inner, prefix, r, l);
			});
		var alteredNode = function (mv) {
			var _v1 = alter(mv);
			if (!_v1.$) {
				var v = _v1.a;
				return A2($elm_community$intdict$IntDict$leaf, key, v);
			} else {
				return $elm_community$intdict$IntDict$empty;
			}
		};
		switch (dict.$) {
			case 0:
				return alteredNode($elm$core$Maybe$Nothing);
			case 1:
				var l = dict.a;
				return _Utils_eq(l.fW, key) ? alteredNode(
					$elm$core$Maybe$Just(l.F)) : A2(
					join,
					_Utils_Tuple2(
						key,
						alteredNode($elm$core$Maybe$Nothing)),
					_Utils_Tuple2(l.fW, dict));
			default:
				var i = dict.a;
				return A2($elm_community$intdict$IntDict$prefixMatches, i.d, key) ? (A2($elm_community$intdict$IntDict$isBranchingBitSet, i.d, key) ? A3(
					$elm_community$intdict$IntDict$inner,
					i.d,
					i.fX,
					A3($elm_community$intdict$IntDict$update, key, alter, i.gm)) : A3(
					$elm_community$intdict$IntDict$inner,
					i.d,
					A3($elm_community$intdict$IntDict$update, key, alter, i.fX),
					i.gm)) : A2(
					join,
					_Utils_Tuple2(
						key,
						alteredNode($elm$core$Maybe$Nothing)),
					_Utils_Tuple2(i.d.D, dict));
		}
	});
var $elm_community$intdict$IntDict$insert = F3(
	function (key, value, dict) {
		return A3(
			$elm_community$intdict$IntDict$update,
			key,
			$elm$core$Basics$always(
				$elm$core$Maybe$Just(value)),
			dict);
	});
var $elm$core$Basics$not = _Basics_not;
var $elm_community$intdict$IntDict$get = F2(
	function (key, dict) {
		get:
		while (true) {
			switch (dict.$) {
				case 0:
					return $elm$core$Maybe$Nothing;
				case 1:
					var l = dict.a;
					return _Utils_eq(l.fW, key) ? $elm$core$Maybe$Just(l.F) : $elm$core$Maybe$Nothing;
				default:
					var i = dict.a;
					if (!A2($elm_community$intdict$IntDict$prefixMatches, i.d, key)) {
						return $elm$core$Maybe$Nothing;
					} else {
						if (A2($elm_community$intdict$IntDict$isBranchingBitSet, i.d, key)) {
							var $temp$key = key,
								$temp$dict = i.gm;
							key = $temp$key;
							dict = $temp$dict;
							continue get;
						} else {
							var $temp$key = key,
								$temp$dict = i.fX;
							key = $temp$key;
							dict = $temp$dict;
							continue get;
						}
					}
			}
		}
	});
var $elm_community$intdict$IntDict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm_community$intdict$IntDict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm_community$graph$Graph$fromNodesAndEdges = F2(
	function (nodes_, edges_) {
		var nodeRep = A3(
			$elm$core$List$foldl,
			function (n) {
				return A2(
					$elm_community$intdict$IntDict$insert,
					n.d5,
					A3($elm_community$graph$Graph$NodeContext, n, $elm_community$intdict$IntDict$empty, $elm_community$intdict$IntDict$empty));
			},
			$elm_community$intdict$IntDict$empty,
			nodes_);
		var addEdge = F2(
			function (edge, rep) {
				var updateOutgoing = function (ctx) {
					return _Utils_update(
						ctx,
						{
							eq: A3($elm_community$intdict$IntDict$insert, edge.gB, edge.ef, ctx.eq)
						});
				};
				var updateIncoming = function (ctx) {
					return _Utils_update(
						ctx,
						{
							d7: A3($elm_community$intdict$IntDict$insert, edge.fF, edge.ef, ctx.d7)
						});
				};
				return A3(
					$elm_community$intdict$IntDict$update,
					edge.gB,
					$elm$core$Maybe$map(updateIncoming),
					A3(
						$elm_community$intdict$IntDict$update,
						edge.fF,
						$elm$core$Maybe$map(updateOutgoing),
						rep));
			});
		var addEdgeIfValid = F2(
			function (edge, rep) {
				return (A2($elm_community$intdict$IntDict$member, edge.fF, rep) && A2($elm_community$intdict$IntDict$member, edge.gB, rep)) ? A2(addEdge, edge, rep) : rep;
			});
		return A3($elm$core$List$foldl, addEdgeIfValid, nodeRep, edges_);
	});
var $author$project$Client$GraphBuilder$run = function (m) {
	var moduleNames = m.b7;
	var nodes = A2(
		$elm$core$List$indexedMap,
		F2(
			function (n, x) {
				return A2(
					$elm_community$graph$Graph$Node,
					n,
					$author$project$ModuleGraph$nodeFromModuleName(x));
			}),
		moduleNames);
	var indexedModuleNames = $elm$core$Dict$fromList(
		A2(
			$elm$core$List$map,
			function (_v0) {
				var id = _v0.d5;
				var label = _v0.ef;
				return _Utils_Tuple2(label.eT, id);
			},
			nodes));
	var edges = A2(
		$elm$core$List$filterMap,
		$author$project$Client$GraphBuilder$edgesInFile(indexedModuleNames),
		m.cL);
	return A2($elm_community$graph$Graph$fromNodesAndEdges, nodes, edges);
};
var $krisajenkins$remotedata$RemoteData$Failure = function (a) {
	return {$: 2, a: a};
};
var $krisajenkins$remotedata$RemoteData$NotAsked = {$: 0};
var $krisajenkins$remotedata$RemoteData$Success = function (a) {
	return {$: 3, a: a};
};
var $krisajenkins$remotedata$RemoteData$map = F2(
	function (f, data) {
		switch (data.$) {
			case 3:
				var value = data.a;
				return $krisajenkins$remotedata$RemoteData$Success(
					f(value));
			case 1:
				return $krisajenkins$remotedata$RemoteData$Loading;
			case 0:
				return $krisajenkins$remotedata$RemoteData$NotAsked;
			default:
				var error = data.a;
				return $krisajenkins$remotedata$RemoteData$Failure(error);
		}
	});
var $krisajenkins$remotedata$RemoteData$withDefault = F2(
	function (_default, data) {
		if (data.$ === 3) {
			var x = data.a;
			return x;
		} else {
			return _default;
		}
	});
var $krisajenkins$remotedata$RemoteData$toMaybe = A2(
	$elm$core$Basics$composeR,
	$krisajenkins$remotedata$RemoteData$map($elm$core$Maybe$Just),
	$krisajenkins$remotedata$RemoteData$withDefault($elm$core$Maybe$Nothing));
var $author$project$Client$State$toMaybe = $krisajenkins$remotedata$RemoteData$toMaybe;
var $author$project$Client$Graph$Graph$init = function (state) {
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.bP;
			},
			$author$project$Client$GraphBuilder$run),
		$author$project$Client$State$toMaybe(state));
};
var $author$project$Client$Graph$PackageDependencies$InnerModel = F4(
	function (names, relations, selected, graph) {
		return {fJ: graph, el: names, eA: relations, dp: selected};
	});
var $elm_community$graph$Graph$unGraph = function (graph) {
	var rep = graph;
	return rep;
};
var $elm_community$graph$Graph$get = function (nodeId) {
	return A2(
		$elm$core$Basics$composeR,
		$elm_community$graph$Graph$unGraph,
		$elm_community$intdict$IntDict$get(nodeId));
};
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm_community$list_extra$List$Extra$init = function (items) {
	if (!items.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		var nonEmptyList = items;
		return A2(
			$elm$core$Maybe$map,
			$elm$core$List$reverse,
			$elm$core$List$tail(
				$elm$core$List$reverse(nonEmptyList)));
	}
};
var $author$project$Client$Graph$PackageDependencies$edgeToPackageRel = F2(
	function (graph, edge) {
		var toList = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.en;
					},
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.ef;
						},
						function ($) {
							return $.aP;
						})),
				A2($elm_community$graph$Graph$get, edge.gB, graph)));
		var toPackage = A2(
			$elm$core$String$join,
			'.',
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$elm_community$list_extra$List$Extra$init(toList)));
		var fromList = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.en;
					},
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.ef;
						},
						function ($) {
							return $.aP;
						})),
				A2($elm_community$graph$Graph$get, edge.fF, graph)));
		var fromPackage = A2(
			$elm$core$String$join,
			'.',
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$elm_community$list_extra$List$Extra$init(fromList)));
		return _Utils_Tuple2(
			_Utils_Tuple2(fromPackage, toPackage),
			_Utils_Tuple2(
				A2($elm$core$String$join, '.', fromList),
				A2($elm$core$String$join, '.', toList)));
	});
var $elm_community$intdict$IntDict$foldl = F3(
	function (f, acc, dict) {
		foldl:
		while (true) {
			switch (dict.$) {
				case 0:
					return acc;
				case 1:
					var l = dict.a;
					return A3(f, l.fW, l.F, acc);
				default:
					var i = dict.a;
					var $temp$f = f,
						$temp$acc = A3($elm_community$intdict$IntDict$foldl, f, acc, i.fX),
						$temp$dict = i.gm;
					f = $temp$f;
					acc = $temp$acc;
					dict = $temp$dict;
					continue foldl;
			}
		}
	});
var $elm_community$graph$Graph$edges = function (graph) {
	var flippedFoldl = F3(
		function (f, dict, list) {
			return A3($elm_community$intdict$IntDict$foldl, f, list, dict);
		});
	var prependEdges = F2(
		function (node1, ctx) {
			return A2(
				flippedFoldl,
				F2(
					function (node2, e) {
						return $elm$core$List$cons(
							{fF: node1, ef: e, gB: node2});
					}),
				ctx.eq);
		});
	return A3(
		flippedFoldl,
		prependEdges,
		$elm_community$graph$Graph$unGraph(graph),
		_List_Nil);
};
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
var $author$project$Client$Graph$PackageDependencies$packageListRelationAsBag = A2(
	$elm$core$List$foldr,
	F2(
		function (_v0, base) {
			var key = _v0.a;
			var value = _v0.b;
			return A3(
				$elm$core$Dict$update,
				key,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Maybe$map(
						$elm$core$List$cons(value)),
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Maybe$withDefault(
							_List_fromArray(
								[value])),
						$elm$core$Maybe$Just)),
				base);
		}),
	$elm$core$Dict$empty);
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $author$project$Client$Graph$PackageDependencies$innerInit = function (_v0) {
	var modules = _v0.bP;
	var graph = $author$project$Client$GraphBuilder$run(modules);
	var relations = $author$project$Client$Graph$PackageDependencies$packageListRelationAsBag(
		A2(
			$elm$core$List$map,
			$author$project$Client$Graph$PackageDependencies$edgeToPackageRel(graph),
			$elm_community$graph$Graph$edges(graph)));
	var names = $elm$core$List$sort(
		$elm$core$Set$toList(
			$elm$core$Set$fromList(
				A2(
					$elm$core$List$concatMap,
					function (_v1) {
						var a = _v1.a;
						var b = _v1.b;
						return _List_fromArray(
							[a, b]);
					},
					$elm$core$Dict$keys(relations)))));
	return A4($author$project$Client$Graph$PackageDependencies$InnerModel, names, relations, $elm$core$Maybe$Nothing, graph);
};
var $krisajenkins$remotedata$RemoteData$mapError = F2(
	function (f, data) {
		switch (data.$) {
			case 3:
				var x = data.a;
				return $krisajenkins$remotedata$RemoteData$Success(x);
			case 2:
				var e = data.a;
				return $krisajenkins$remotedata$RemoteData$Failure(
					f(e));
			case 1:
				return $krisajenkins$remotedata$RemoteData$Loading;
			default:
				return $krisajenkins$remotedata$RemoteData$NotAsked;
		}
	});
var $author$project$Client$Graph$PackageDependencies$init = function (s) {
	return A2(
		$krisajenkins$remotedata$RemoteData$mapError,
		$elm$core$Basics$always('Some error occured...'),
		A2($krisajenkins$remotedata$RemoteData$map, $author$project$Client$Graph$PackageDependencies$innerInit, s));
};
var $author$project$Client$MessagesPage$GroupByFileName = 0;
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
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Analyser$Messages$Grouped$byFileName = function (messages) {
	return A2(
		$author$project$Analyser$Messages$Grouped$GroupedMessages,
		function ($) {
			return $.gD;
		},
		A2(
			$elm$core$List$sortBy,
			$elm$core$Tuple$first,
			$elm$core$Dict$toList(
				A2(
					$elm$core$Dict$map,
					F2(
						function (_v0, v) {
							return A2($elm$core$List$map, $elm$core$Tuple$second, v);
						}),
					A2(
						$elm_community$dict_extra$Dict$Extra$groupBy,
						$elm$core$Tuple$first,
						A2(
							$elm$core$List$map,
							function (m) {
								return _Utils_Tuple2(m.dZ.gg, m);
							},
							messages))))));
};
var $author$project$Client$MessagesPage$groupMessages = F2(
	function (s, m) {
		return A2(
			$krisajenkins$remotedata$RemoteData$withDefault,
			$author$project$Analyser$Messages$Grouped$byFileName(_List_Nil),
			A2(
				$krisajenkins$remotedata$RemoteData$map,
				function (state) {
					if (!m) {
						return $author$project$Analyser$Messages$Grouped$byFileName(state.o);
					} else {
						return $author$project$Analyser$Messages$Grouped$byType(state.o);
					}
				},
				s));
	});
var $author$project$Client$Components$MessageList$withMessages = F2(
	function (x, m) {
		return _Utils_update(
			m,
			{o: x});
	});
var $author$project$Client$MessagesPage$buildMessageList = F3(
	function (s, grouper, old) {
		return A2(
			$author$project$Client$Components$MessageList$withMessages,
			A2($author$project$Client$MessagesPage$groupMessages, s, grouper),
			old);
	});
var $author$project$Client$MessagesPage$init = function (state) {
	return {
		ap: 0,
		T: A3(
			$author$project$Client$MessagesPage$buildMessageList,
			state,
			0,
			$author$project$Client$Components$MessageList$init(
				$author$project$Analyser$Messages$Grouped$byFileName(_List_Nil)))
	};
};
var $elm$core$Platform$Cmd$map = _Platform_map;
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Client$App$App$onRoute = F2(
	function (route, model) {
		switch (route) {
			case 4:
				var _v1 = model.cJ;
				if (_v1.$ === 3) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					return A2(
						$elm$core$Tuple$mapSecond,
						$elm$core$Platform$Cmd$map($author$project$Client$App$App$FileTreeMsg),
						A2(
							$elm$core$Tuple$mapFirst,
							function (x) {
								return _Utils_update(
									model,
									{
										cJ: $author$project$Client$App$App$FileTreeContent(x),
										y: route
									});
							},
							$author$project$Client$Components$FileTree$init));
				}
			case 2:
				var _v2 = model.cJ;
				if (_v2.$ === 4) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								cJ: $author$project$Client$App$App$GraphContent(
									$author$project$Client$Graph$Graph$init(model.x)),
								y: route
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 5:
				var _v3 = model.cJ;
				if (_v3.$ === 5) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								cJ: $author$project$Client$App$App$PackageDependenciesContent(
									$author$project$Client$Graph$PackageDependencies$init(model.x)),
								y: route
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 3:
				var _v4 = model.cJ;
				if (_v4.$ === 5) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								cJ: $author$project$Client$App$App$MessagesPageContent(
									$author$project$Client$MessagesPage$init(model.x)),
								y: route
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 1:
				var _v5 = model.cJ;
				if (_v5.$ === 2) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{cJ: $author$project$Client$App$App$DependenciesPageContent, y: route}),
						$elm$core$Platform$Cmd$none);
				}
			case 0:
				var _v6 = model.cJ;
				if (_v6.$ === 1) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{cJ: $author$project$Client$App$App$DashboardContent, y: route}),
						$elm$core$Platform$Cmd$none);
				}
			default:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cJ: $author$project$Client$App$App$NotFound, y: route}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Client$App$App$onLocation = F2(
	function (url, model) {
		return A2(
			$author$project$Client$App$App$onRoute,
			$author$project$Client$Routing$fromUrl(url),
			model);
	});
var $author$project$Client$App$App$init = F3(
	function (_v0, l, key) {
		return A2(
			$author$project$Client$App$App$onLocation,
			l,
			{cJ: $author$project$Client$App$App$NotFound, fW: key, y: 6, x: $krisajenkins$remotedata$RemoteData$Loading});
	});
var $author$project$Client$App$App$Tick = {$: 5};
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {ew: processes, eO: taggers};
	});
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
		var processes = _v0.ew;
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
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.eO);
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
var $author$project$Client$App$App$subscriptions = function (_v0) {
	return A2(
		$elm$time$Time$every,
		1000,
		$elm$core$Basics$always($author$project$Client$App$App$Tick));
};
var $author$project$Client$App$App$NewState = function (a) {
	return {$: 6, a: a};
};
var $author$project$Client$Components$FileTree$MessageListMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Client$Components$MessageList$ActiveMessageDialogMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Analyser$Messages$Types$Fixing = 2;
var $author$project$Analyser$Messages$Grouped$markFixed = F2(
	function (m, _v0) {
		var f = _v0.a;
		var l = _v0.b;
		var markIfIsInputMessage = function (other) {
			return _Utils_eq(m.d5, other.d5) ? _Utils_update(
				other,
				{gt: 2}) : other;
		};
		var patched = A2(
			$elm$core$List$map,
			$elm$core$Tuple$mapSecond(
				$elm$core$List$map(markIfIsInputMessage)),
			l);
		return A2($author$project$Analyser$Messages$Grouped$GroupedMessages, f, patched);
	});
var $author$project$Client$Components$ActiveMessageDialog$OnFile = function (a) {
	return {$: 1, a: a};
};
var $elm$url$Url$Builder$toQueryPair = function (_v0) {
	var key = _v0.a;
	var value = _v0.b;
	return key + ('=' + value);
};
var $elm$url$Url$Builder$toQuery = function (parameters) {
	if (!parameters.b) {
		return '';
	} else {
		return '?' + A2(
			$elm$core$String$join,
			'&',
			A2($elm$core$List$map, $elm$url$Url$Builder$toQueryPair, parameters));
	}
};
var $elm$url$Url$Builder$absolute = F2(
	function (pathSegments, parameters) {
		return '/' + (A2($elm$core$String$join, '/', pathSegments) + $elm$url$Url$Builder$toQuery(parameters));
	});
var $elm$http$Http$expectString = $elm$http$Http$expectStringResponse(
	function (response) {
		return $elm$core$Result$Ok(response.e7);
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
var $author$project$Analyser$Messages$Util$messageFile = function (m) {
	return m.dZ.gg;
};
var $elm$url$Url$Builder$QueryParameter = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $elm$url$Url$Builder$string = F2(
	function (key, value) {
		return A2(
			$elm$url$Url$Builder$QueryParameter,
			$elm$url$Url$percentEncode(key),
			$elm$url$Url$percentEncode(value));
	});
var $author$project$Client$Components$ActiveMessageDialog$show = F2(
	function (m, _v0) {
		return _Utils_Tuple2(
			$elm$core$Maybe$Just(
				{
					br: $krisajenkins$remotedata$RemoteData$Loading,
					bz: false,
					S: m,
					dl: $author$project$Analyser$Messages$Data$getRanges(m.fq)
				}),
			A2(
				$elm$http$Http$send,
				$author$project$Client$Components$ActiveMessageDialog$OnFile,
				$elm$http$Http$request(
					{
						e7: $elm$http$Http$emptyBody,
						fy: $elm$http$Http$expectString,
						fL: _List_Nil,
						f_: 'GET',
						gz: $elm$core$Maybe$Nothing,
						gG: A2(
							$elm$url$Url$Builder$absolute,
							_List_fromArray(
								['file']),
							_List_fromArray(
								[
									A2(
									$elm$url$Url$Builder$string,
									'file',
									$author$project$Analyser$Messages$Util$messageFile(m))
								])),
						gK: false
					})));
	});
var $author$project$Client$Components$ActiveMessageDialog$Close = {$: 0};
var $author$project$Client$Components$ActiveMessageDialog$Fixed = $elm$core$Basics$identity;
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$http$Http$Internal$StringBody = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		$elm$http$Http$Internal$StringBody,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
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
			_Json_emptyObject(0),
			pairs));
};
var $elm$http$Http$post = F3(
	function (url, body, decoder) {
		return $elm$http$Http$request(
			{
				e7: body,
				fy: $elm$http$Http$expectJson(decoder),
				fL: _List_Nil,
				f_: 'POST',
				gz: $elm$core$Maybe$Nothing,
				gG: url,
				gK: false
			});
	});
var $author$project$Client$State$fix = function (mess) {
	return A2(
		$elm$http$Http$send,
		$elm$core$Basics$identity,
		A3(
			$elm$http$Http$post,
			'/api/fix',
			$elm$http$Http$jsonBody(
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'id',
							$elm$json$Json$Encode$int(mess.d5))
						]))),
			$elm$json$Json$Decode$succeed(0)));
};
var $krisajenkins$remotedata$RemoteData$fromResult = function (result) {
	if (result.$ === 1) {
		var e = result.a;
		return $krisajenkins$remotedata$RemoteData$Failure(e);
	} else {
		var x = result.a;
		return $krisajenkins$remotedata$RemoteData$Success(x);
	}
};
var $author$project$Client$Components$ActiveMessageDialog$hide = $elm$core$Basics$always($elm$core$Maybe$Nothing);
var $author$project$Client$Components$ActiveMessageDialog$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				return _Utils_Tuple3(
					$author$project$Client$Components$ActiveMessageDialog$hide(model),
					$elm$core$Platform$Cmd$none,
					$elm$core$Maybe$Nothing);
			case 1:
				var x = msg.a;
				return function (a) {
					return _Utils_Tuple3(a, $elm$core$Platform$Cmd$none, $elm$core$Maybe$Nothing);
				}(
					A2(
						$elm$core$Maybe$map,
						function (y) {
							return _Utils_update(
								y,
								{
									br: $krisajenkins$remotedata$RemoteData$fromResult(x)
								});
						},
						model));
			default:
				return A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple3(model, $elm$core$Platform$Cmd$none, $elm$core$Maybe$Nothing),
					A2(
						$elm$core$Maybe$map,
						function (y) {
							return _Utils_Tuple3(
								$elm$core$Maybe$Just(
									_Utils_update(
										y,
										{bz: true})),
								A2(
									$elm$core$Platform$Cmd$map,
									$elm$core$Basics$always($author$project$Client$Components$ActiveMessageDialog$Close),
									$author$project$Client$State$fix(y.S)),
								$elm$core$Maybe$Just(y.S));
						},
						model));
		}
	});
var $author$project$Client$Components$MessageList$update = F2(
	function (msg, model) {
		if (!msg.$) {
			var m = msg.a;
			return A2(
				$elm$core$Tuple$mapSecond,
				$elm$core$Platform$Cmd$map($author$project$Client$Components$MessageList$ActiveMessageDialogMsg),
				A2(
					$elm$core$Tuple$mapFirst,
					function (x) {
						return _Utils_update(
							model,
							{aa: x});
					},
					A2($author$project$Client$Components$ActiveMessageDialog$show, m, model.aa)));
		} else {
			var subMsg = msg.a;
			var _v1 = A2($author$project$Client$Components$ActiveMessageDialog$update, subMsg, model.aa);
			var newActiveDialog = _v1.a;
			var cmds = _v1.b;
			var info = _v1.c;
			var newMessages = function () {
				if (!info.$) {
					var m = info.a;
					return A2($author$project$Analyser$Messages$Grouped$markFixed, m, model.o);
				} else {
					return model.o;
				}
			}();
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{aa: newActiveDialog, o: newMessages}),
				A2($elm$core$Platform$Cmd$map, $author$project$Client$Components$MessageList$ActiveMessageDialogMsg, cmds));
		}
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
var $author$project$Client$Components$FileTree$updateFileIndex = F2(
	function (maybeMessages, model) {
		var messagesForFile = F2(
			function (file, messages) {
				return A2(
					$elm$core$List$filter,
					function (ms) {
						return _Utils_eq(ms.dZ.gg, file);
					},
					messages);
			});
		var buildTree = F2(
			function (messages, tree) {
				return A2(
					$elm$core$List$map,
					function (file) {
						return _Utils_Tuple2(
							file,
							A2(messagesForFile, file, messages));
					},
					tree);
			});
		return _Utils_update(
			model,
			{
				aC: A3($elm$core$Maybe$map2, buildTree, maybeMessages, model.cs)
			});
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
var $author$project$Client$Components$FileTree$messagesForSelectedFile = function (m) {
	var _v0 = m.aC;
	if (!_v0.$) {
		var fileIndex = _v0.a;
		return $author$project$Analyser$Messages$Grouped$byType(
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					$elm$core$Maybe$map,
					$elm$core$Tuple$second,
					$elm$core$List$head(
						A2(
							$elm$core$List$filter,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Tuple$first,
								A2(
									$elm$core$Basics$composeR,
									$elm$core$Maybe$Just,
									$elm$core$Basics$eq(m.aU))),
							fileIndex)))));
	} else {
		return $author$project$Analyser$Messages$Grouped$byType(_List_Nil);
	}
};
var $author$project$Client$Components$FileTree$updateMessageList = function (m) {
	return _Utils_update(
		m,
		{
			T: A2(
				$author$project$Client$Components$MessageList$withMessages,
				$author$project$Client$Components$FileTree$messagesForSelectedFile(m),
				m.T)
		});
};
var $author$project$Client$Components$FileTree$update = F3(
	function (state, msg, model) {
		switch (msg.$) {
			case 0:
				var x = msg.a;
				if (!x.$) {
					var value = x.a;
					return _Utils_Tuple2(
						A2(
							$author$project$Client$Components$FileTree$updateFileIndex,
							A2(
								$elm$core$Maybe$map,
								function ($) {
									return $.o;
								},
								$author$project$Client$State$toMaybe(state)),
							_Utils_update(
								model,
								{
									cs: $elm$core$Maybe$Just(value)
								})),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 2:
				var x = msg.a;
				return _Utils_Tuple2(
					$author$project$Client$Components$FileTree$updateMessageList(
						_Utils_update(
							model,
							{
								aU: $elm$core$Maybe$Just(x)
							})),
					$elm$core$Platform$Cmd$none);
			case 3:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ai: !model.ai}),
					$elm$core$Platform$Cmd$none);
			default:
				var subMsg = msg.a;
				return A2(
					$elm$core$Tuple$mapSecond,
					$elm$core$Platform$Cmd$map($author$project$Client$Components$FileTree$MessageListMsg),
					A2(
						$elm$core$Tuple$mapFirst,
						function (x) {
							return _Utils_update(
								model,
								{T: x});
						},
						A2($author$project$Client$Components$MessageList$update, subMsg, model.T)));
		}
	});
var $author$project$Client$App$App$onFileTreeMsg = F2(
	function (subMsg, model) {
		var _v0 = model.cJ;
		if (_v0.$ === 3) {
			var subModel = _v0.a;
			return A2(
				$elm$core$Tuple$mapSecond,
				$elm$core$Platform$Cmd$map($author$project$Client$App$App$FileTreeMsg),
				A2(
					$elm$core$Tuple$mapFirst,
					function (x) {
						return _Utils_update(
							model,
							{
								cJ: $author$project$Client$App$App$FileTreeContent(x)
							});
					},
					A3($author$project$Client$Components$FileTree$update, model.x, subMsg, subModel)));
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Client$App$App$MessagesPageMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Client$MessagesPage$MessageListMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Client$MessagesPage$update = F3(
	function (state, msg, model) {
		if (!msg.$) {
			var subMsg = msg.a;
			return A2(
				$elm$core$Tuple$mapSecond,
				$elm$core$Platform$Cmd$map($author$project$Client$MessagesPage$MessageListMsg),
				A2(
					$elm$core$Tuple$mapFirst,
					function (x) {
						return _Utils_update(
							model,
							{T: x});
					},
					A2($author$project$Client$Components$MessageList$update, subMsg, model.T)));
		} else {
			var messageGrouper = msg.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						ap: messageGrouper,
						T: A3($author$project$Client$MessagesPage$buildMessageList, state, messageGrouper, model.T)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Client$App$App$onMessagesPageMsg = F2(
	function (subMsg, model) {
		var _v0 = model.cJ;
		if (!_v0.$) {
			var subModel = _v0.a;
			return A2(
				$elm$core$Tuple$mapSecond,
				$elm$core$Platform$Cmd$map($author$project$Client$App$App$MessagesPageMsg),
				A2(
					$elm$core$Tuple$mapFirst,
					function (x) {
						return _Utils_update(
							model,
							{
								cJ: $author$project$Client$App$App$MessagesPageContent(x)
							});
					},
					A3($author$project$Client$MessagesPage$update, model.x, subMsg, subModel)));
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Client$Components$FileTree$onNewState = F2(
	function (s, model) {
		var messages = A2(
			$elm$core$Maybe$map,
			function ($) {
				return $.o;
			},
			$author$project$Client$State$toMaybe(s));
		return $author$project$Client$Components$FileTree$updateMessageList(
			A2($author$project$Client$Components$FileTree$updateFileIndex, messages, model));
	});
var $author$project$Client$Graph$Graph$onNewState = F2(
	function (state, _v0) {
		return $author$project$Client$Graph$Graph$init(state);
	});
var $author$project$Client$Graph$PackageDependencies$onNewState = F2(
	function (s, _v0) {
		return $author$project$Client$Graph$PackageDependencies$init(s);
	});
var $author$project$Client$MessagesPage$onNewState = F2(
	function (s, model) {
		return _Utils_update(
			model,
			{
				T: A3($author$project$Client$MessagesPage$buildMessageList, s, model.ap, model.T)
			});
	});
var $author$project$Client$App$App$updateStateInContent = F2(
	function (state, content) {
		switch (content.$) {
			case 0:
				var sub = content.a;
				return $author$project$Client$App$App$MessagesPageContent(
					A2($author$project$Client$MessagesPage$onNewState, state, sub));
			case 1:
				return content;
			case 2:
				return content;
			case 3:
				var sub = content.a;
				return $author$project$Client$App$App$FileTreeContent(
					A2($author$project$Client$Components$FileTree$onNewState, state, sub));
			case 4:
				var sub = content.a;
				return $author$project$Client$App$App$GraphContent(
					A2($author$project$Client$Graph$Graph$onNewState, state, sub));
			case 5:
				var sub = content.a;
				return $author$project$Client$App$App$PackageDependenciesContent(
					A2($author$project$Client$Graph$PackageDependencies$onNewState, state, sub));
			default:
				return content;
		}
	});
var $author$project$Client$App$App$onNewState = F2(
	function (s, model) {
		return _Utils_update(
			model,
			{
				cJ: A2($author$project$Client$App$App$updateStateInContent, s, model.cJ),
				x: s
			});
	});
var $author$project$Client$Graph$PackageDependencies$update = F2(
	function (msg, model) {
		var from = msg.a;
		var to = msg.b;
		return A2(
			$krisajenkins$remotedata$RemoteData$map,
			function (inner) {
				return _Utils_update(
					inner,
					{
						dp: $elm$core$Maybe$Just(
							_Utils_Tuple2(from, to))
					});
			},
			model);
	});
var $author$project$Client$App$App$onPackageDependenciesMsg = F2(
	function (subMsg, model) {
		var _v0 = model.cJ;
		if (_v0.$ === 5) {
			var subModel = _v0.a;
			return _Utils_update(
				model,
				{
					cJ: $author$project$Client$App$App$PackageDependenciesContent(
						A2($author$project$Client$Graph$PackageDependencies$update, subMsg, subModel))
				});
		} else {
			return model;
		}
	});
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $author$project$Client$Routing$toUrl = function (route) {
	return '/' + function () {
		switch (route) {
			case 1:
				return 'dependencies';
			case 0:
				return 'dashboard';
			case 2:
				return 'modules';
			case 3:
				return 'messages';
			case 4:
				return 'tree';
			case 5:
				return 'package-dependencies';
			default:
				return '/';
		}
	}();
};
var $author$project$Client$Routing$setRoute = F2(
	function (key, route) {
		return A2(
			$elm$browser$Browser$Navigation$pushUrl,
			key,
			$author$project$Client$Routing$toUrl(route));
	});
var $author$project$Analyser$State$State = F6(
	function (messages, dependencies, idCount, status, queue, modules) {
		return {cL: dependencies, aj: idCount, o: messages, bP: modules, X: queue, gt: status};
	});
var $author$project$Analyser$Modules$Modules = F2(
	function (projectModules, dependencies) {
		return {cL: dependencies, b7: projectModules};
	});
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $stil4m$elm_syntax$Elm$Syntax$ModuleName$decoder = $elm$json$Json$Decode$list($elm$json$Json$Decode$string);
var $elm$json$Json$Decode$fail = _Json_fail;
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
var $elm$json$Json$Decode$field = _Json_decodeField;
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
		return {bN: mode, ct: unused, cC: values};
	});
var $author$project$Analyser$State$Dependencies$DependencyInfo = F3(
	function (dependency, versionState, _package) {
		return {cM: dependency, dg: _package, dz: versionState};
	});
var $author$project$Registry$Package$Package = F3(
	function (name, summary, versions) {
		return {f2: name, eN: summary, gI: versions};
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
		return {fU: interfaces, f2: name, gH: version};
	});
var $stil4m$elm_syntax$Elm$Interface$Alias = function (a) {
	return {$: 2, a: a};
};
var $stil4m$elm_syntax$Elm$Interface$CustomType = function (a) {
	return {$: 1, a: a};
};
var $stil4m$elm_syntax$Elm$Interface$Function = function (a) {
	return {$: 0, a: a};
};
var $stil4m$elm_syntax$Elm$Interface$Operator = function (a) {
	return {$: 3, a: a};
};
var $elm$json$Json$Decode$lazy = function (thunk) {
	return A2(
		$elm$json$Json$Decode$andThen,
		thunk,
		$elm$json$Json$Decode$succeed(0));
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
var $stil4m$elm_syntax$Elm$Syntax$Infix$Infix = F4(
	function (direction, precedence, operator, _function) {
		return {fu: direction, fG: _function, ge: operator, gh: precedence};
	});
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
				bw: {M: d, z: c},
				E: {M: b, z: a}
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
var $elm$json$Json$Decode$int = _Json_decodeInt;
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
var $author$project$Analyser$State$Dependencies$MajorBehind = 1;
var $author$project$Analyser$State$Dependencies$Unknown = 3;
var $author$project$Analyser$State$Dependencies$UpToDate = 0;
var $author$project$Analyser$State$Dependencies$Upgradable = 2;
var $author$project$Analyser$State$Dependencies$decodeVersionState = A2(
	$elm$json$Json$Decode$andThen,
	function (s) {
		switch (s) {
			case 'UpToDate':
				return $elm$json$Json$Decode$succeed(0);
			case 'MajorBehind':
				return $elm$json$Json$Decode$succeed(1);
			case 'Upgradable':
				return $elm$json$Json$Decode$succeed(2);
			case 'Unknown':
				return $elm$json$Json$Decode$succeed(3);
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
var $author$project$Analyser$State$Dependencies$Application = 1;
var $author$project$Analyser$State$Dependencies$Package = 0;
var $author$project$Analyser$State$Dependencies$decodeMode = A2(
	$elm$json$Json$Decode$andThen,
	function (v) {
		switch (v) {
			case 'package':
				return $elm$json$Json$Decode$succeed(0);
			case 'application':
				return $elm$json$Json$Decode$succeed(1);
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
		return {fq: data, dZ: file, d5: id, gt: status, gD: type_};
	});
var $author$project$Analyser$Messages$Types$Applicable = 3;
var $author$project$Analyser$Messages$Types$Blocked = 1;
var $author$project$Analyser$Messages$Types$Outdated = 0;
var $author$project$Analyser$Messages$Json$decodeMessageStatus = A2(
	$elm$json$Json$Decode$andThen,
	function (x) {
		switch (x) {
			case 'outdated':
				return $elm$json$Json$Decode$succeed(0);
			case 'blocked':
				return $elm$json$Json$Decode$succeed(1);
			case 'applicable':
				return $elm$json$Json$Decode$succeed(3);
			case 'fixing':
				return $elm$json$Json$Decode$succeed(2);
			default:
				return $elm$json$Json$Decode$fail('Expecected message status, but got: ' + x);
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Analyser$FileRef$FileRef = F2(
	function (version, path) {
		return {gg: path, gH: version};
	});
var $author$project$Analyser$FileRef$decoder = A2(
	$elm$json$Json$Decode$map,
	$author$project$Analyser$FileRef$FileRef(''),
	$elm$json$Json$Decode$string);
var $author$project$Analyser$Messages$Data$MessageData = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $author$project$Analyser$Messages$Data$ErrorMessageV = function (a) {
	return {$: 5, a: a};
};
var $author$project$Analyser$Messages$Data$FileNameV = function (a) {
	return {$: 1, a: a};
};
var $author$project$Analyser$Messages$Data$ModuleNameV = function (a) {
	return {$: 4, a: a};
};
var $author$project$Analyser$Messages$Data$RangeListV = function (a) {
	return {$: 3, a: a};
};
var $author$project$Analyser$Messages$Data$RangeV = function (a) {
	return {$: 0, a: a};
};
var $author$project$Analyser$Messages$Data$VariableNameV = function (a) {
	return {$: 2, a: a};
};
var $author$project$Analyser$Messages$Schema$propertyTypeForKey = F2(
	function (k, _v0) {
		var s = _v0;
		return A2($elm$core$Dict$get, k, s);
	});
var $author$project$Analyser$Messages$Data$schemaDecoder = F2(
	function (key, schema) {
		var _v0 = A2($author$project$Analyser$Messages$Schema$propertyTypeForKey, key, schema);
		if (_v0.$ === 1) {
			return $elm$json$Json$Decode$fail('Unknown property key: ' + key);
		} else {
			var propertyType = _v0.a;
			switch (propertyType) {
				case 0:
					return A2($elm$json$Json$Decode$map, $author$project$Analyser$Messages$Data$RangeV, $stil4m$elm_syntax$Elm$Syntax$Range$decoder);
				case 1:
					return A2($elm$json$Json$Decode$map, $author$project$Analyser$Messages$Data$FileNameV, $elm$json$Json$Decode$string);
				case 2:
					return A2($elm$json$Json$Decode$map, $author$project$Analyser$Messages$Data$VariableNameV, $elm$json$Json$Decode$string);
				case 3:
					return A2(
						$elm$json$Json$Decode$map,
						$author$project$Analyser$Messages$Data$RangeListV,
						$elm$json$Json$Decode$list($stil4m$elm_syntax$Elm$Syntax$Range$decoder));
				case 4:
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
	if (!result.$) {
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
var $elm_community$dict_extra$Dict$Extra$filterMap = F2(
	function (f, dict) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, acc) {
					var _v0 = A2(f, k, v);
					if (!_v0.$) {
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
		var d = _v0;
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
var $author$project$Analyser$State$Fixing = 1;
var $author$project$Analyser$State$Idle = 2;
var $author$project$Analyser$State$Initialising = 0;
var $author$project$Analyser$State$decodeStatus = A2(
	$elm$json$Json$Decode$andThen,
	function (x) {
		switch (x) {
			case 'initialising':
				return $elm$json$Json$Decode$succeed(0);
			case 'idle':
				return $elm$json$Json$Decode$succeed(2);
			case 'fixing':
				return $elm$json$Json$Decode$succeed(1);
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
var $author$project$ASTUtil$Inspector$defaultConfig = {cY: $author$project$ASTUtil$Inspector$Continue, cZ: $author$project$ASTUtil$Inspector$Continue, c_: $author$project$ASTUtil$Inspector$Continue, c$: $author$project$ASTUtil$Inspector$Continue, c0: $author$project$ASTUtil$Inspector$Continue, c1: $author$project$ASTUtil$Inspector$Continue, c2: $author$project$ASTUtil$Inspector$Continue, c3: $author$project$ASTUtil$Inspector$Continue, c5: $author$project$ASTUtil$Inspector$Continue, c6: $author$project$ASTUtil$Inspector$Continue, c7: $author$project$ASTUtil$Inspector$Continue, c8: $author$project$ASTUtil$Inspector$Continue, c9: $author$project$ASTUtil$Inspector$Continue, da: $author$project$ASTUtil$Inspector$Continue, db: $author$project$ASTUtil$Inspector$Continue, dd: $author$project$ASTUtil$Inspector$Continue, de: $author$project$ASTUtil$Inspector$Continue, df: $author$project$ASTUtil$Inspector$Continue};
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
var $stil4m$elm_syntax$Elm$Syntax$Node$value = function (_v0) {
	var v = _v0.b;
	return v;
};
var $author$project$ASTUtil$Inspector$inspectTypeAnnotation = F3(
	function (config, typeAnnotation, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.df,
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
			config.c2,
			A2(
				$author$project$ASTUtil$Inspector$inspectTypeAnnotation,
				config,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(signature).gC),
			signature,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectCase = F3(
	function (config, caze, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.cY,
			A2($author$project$ASTUtil$Inspector$inspectExpression, config, caze.b),
			caze,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectDestructuring = F3(
	function (config, destructuring, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.cZ,
			A2($author$project$ASTUtil$Inspector$inspectExpression, config, destructuring.b),
			destructuring,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectExpression = F3(
	function (config, expression, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.c_,
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
			config.c0,
			A2(
				$elm$core$Basics$composeR,
				A2(
					$author$project$ASTUtil$Inspector$inspectExpression,
					config,
					$stil4m$elm_syntax$Elm$Syntax$Node$value(_function.fr).by),
				A2(
					$elm$core$Maybe$withDefault,
					$elm$core$Basics$identity,
					A2(
						$elm$core$Maybe$map,
						$author$project$ASTUtil$Inspector$inspectSignature(config),
						_function.gq))),
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
					config.c1,
					$elm$core$Basics$identity,
					_Utils_Tuple2(m, functionOrVal),
					context);
			case 5:
				var prefix = expression.a;
				return A4($author$project$ASTUtil$Inspector$actionLambda, config.c9, $elm$core$Basics$identity, prefix, context);
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
					config.da,
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
					config.c7,
					function (a) {
						return A3(
							$elm$core$List$foldl,
							$author$project$ASTUtil$Inspector$inspectExpression(config),
							a,
							_List_fromArray(
								[left, right]));
					},
					{fu: dir, fX: left, ge: op, gm: right},
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
					A2($author$project$ASTUtil$Inspector$inspectLetDeclarations, config, letBlock.dM),
					A2($author$project$ASTUtil$Inspector$inspectExpression, config, letBlock.by));
				return A4($author$project$ASTUtil$Inspector$actionLambda, config.c6, next, letBlock, context);
			case 16:
				var caseBlock = expression.a;
				var context2 = A3($author$project$ASTUtil$Inspector$inspectExpression, config, caseBlock.by, context);
				var context3 = A3(
					$elm$core$List$foldl,
					F2(
						function (a, b) {
							return A3($author$project$ASTUtil$Inspector$inspectCase, config, a, b);
						}),
					context2,
					caseBlock.fe);
				return context3;
			case 17:
				var lambda = expression.a;
				return A4(
					$author$project$ASTUtil$Inspector$actionLambda,
					config.c5,
					A2($author$project$ASTUtil$Inspector$inspectExpression, config, lambda.by),
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
					config.db,
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
			config.c8,
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
			valueConstructor.e4);
	});
var $author$project$ASTUtil$Inspector$inspectType = F3(
	function (config, typeDecl, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.dd,
			function (c) {
				return A3(
					$elm$core$List$foldl,
					$author$project$ASTUtil$Inspector$inspectValueConstructor(config),
					c,
					typeDecl.fn);
			},
			typeDecl,
			context);
	});
var $author$project$ASTUtil$Inspector$inspectTypeAlias = F3(
	function (config, typeAlias, context) {
		return A4(
			$author$project$ASTUtil$Inspector$actionLambda,
			config.de,
			A2(
				$author$project$ASTUtil$Inspector$inspectTypeAnnotation,
				config,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(typeAlias).gC),
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
		return A4($author$project$ASTUtil$Inspector$actionLambda, config.c3, $elm$core$Basics$identity, imp, context);
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
			config.c$,
			A2(
				$elm$core$Basics$composeR,
				A2($author$project$ASTUtil$Inspector$inspectImports, config, file.d6),
				A2($author$project$ASTUtil$Inspector$inspectDeclarations, config, file.dM)),
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
	if ((pattern.$ === 12) && (!pattern.b.b)) {
		var qnr = pattern.a;
		return _Utils_eq(qnr.aP, _List_Nil) && ((qnr.f2 === 'True') || (qnr.f2 === 'False'));
	} else {
		return false;
	}
};
var $author$project$AST$Ranges$locationToString = function (_v0) {
	var row = _v0.z;
	var column = _v0.M;
	return '(' + ($elm$core$String$fromInt(row) + (',' + ($elm$core$String$fromInt(column) + ')')));
};
var $author$project$AST$Ranges$rangeToString = function (_v0) {
	var start = _v0.E;
	var end = _v0.bw;
	return '(' + ($author$project$AST$Ranges$locationToString(start) + (',' + ($author$project$AST$Ranges$locationToString(end) + ')')));
};
var $author$project$Analyser$Checks$BooleanCase$onExpression = F2(
	function (_v0, context) {
		var r = _v0.a;
		var inner = _v0.b;
		if (inner.$ === 16) {
			var caseExpression = inner.a;
			return A2($elm$core$List$any, $author$project$Analyser$Checks$BooleanCase$isBooleanCase, caseExpression.fe) ? A2(
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
					c_: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$BooleanCase$onExpression)
				}),
			fileContext.e6,
			_List_Nil);
	});
var $author$project$Analyser$Messages$Schema$schema = $elm$core$Dict$empty;
var $author$project$Analyser$Checks$BooleanCase$checker = {
	fg: $author$project$Analyser$Checks$BooleanCase$scan,
	fR: {
		ft: 'If you case over a boolean value, it maybe better to use an if expression.',
		fW: 'BooleanCase',
		f2: 'Boolean Case Expression',
		go: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
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
					c_: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$DebugCrash$onExpression)
				}),
			fileContext.e6,
			_List_Nil);
	});
var $author$project$Analyser$Checks$DebugCrash$checker = {
	fg: $author$project$Analyser$Checks$DebugCrash$scan,
	fR: {
		ft: 'You may not want to ship this to your end users.',
		fW: 'DebugTodo',
		f2: 'Debug Todo',
		go: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
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
					c_: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$DebugLog$onExpression)
				}),
			fileContext.e6,
			_List_Nil);
	});
var $author$project$Analyser$Checks$DebugLog$checker = {
	fg: $author$project$Analyser$Checks$DebugLog$scan,
	fR: {
		ft: 'This is nice for development, but you do not want to ship this to package users or your end users.',
		fW: 'DebugLog',
		f2: 'Debug Log',
		go: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
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
					c_: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$DropConcatOfLists$onExpression)
				}),
			fileContext.e6,
			_List_Nil);
	});
var $author$project$Analyser$Checks$DropConcatOfLists$checker = {
	fg: $author$project$Analyser$Checks$DropConcatOfLists$scan,
	fR: {
		ft: 'If you concatenate two lists ([...] ++ [...]), then you can merge them into one list.',
		fW: 'DropConcatOfLists',
		f2: 'Drop Concat Of Lists',
		go: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
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
					c_: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$DropConsOfItemAndList$onExpression)
				}),
			fileContext.e6,
			_List_Nil);
	});
var $author$project$Analyser$Checks$DropConsOfItemAndList$checker = {
	fg: $author$project$Analyser$Checks$DropConsOfItemAndList$scan,
	fR: {
		ft: 'If you cons an item to a literal list (x :: [1, 2, 3]), then you can just put the item into the list.',
		fW: 'DropConsOfItemAndList',
		f2: 'Drop Cons Of Item And List',
		go: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'tail',
			A2(
				$author$project$Analyser$Messages$Schema$rangeProp,
				'head',
				A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)))
	}
};
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
var $author$project$Analyser$Checks$DuplicateImport$onImport = F2(
	function (_v0, context) {
		var range = _v0.a;
		var imp = _v0.b;
		var moduleName = $stil4m$elm_syntax$Elm$Syntax$Node$value(imp.aP);
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
								c0: $author$project$ASTUtil$Inspector$Skip,
								c3: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$DuplicateImport$onImport)
							}),
						fileContext.e6,
						$elm$core$Dict$empty))));
	});
var $author$project$Analyser$Checks$DuplicateImport$checker = {
	fg: $author$project$Analyser$Checks$DuplicateImport$scan,
	fR: {
		ft: 'You are importing the same module twice.',
		fW: 'DuplicateImport',
		f2: 'Duplicate Import',
		go: A2(
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
				case 3:
					var s = t.a;
					return s.f2;
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
			var _v0 = imp.bx;
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
				fn: A3(
					$elm$core$Dict$update,
					$stil4m$elm_syntax$Elm$Syntax$Node$value(imp.aP),
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Maybe$withDefault($elm$core$Dict$empty),
						A2(
							$elm$core$Basics$composeR,
							$author$project$Analyser$Checks$DuplicateImportedVariable$mergeImportedValue(cs),
							$elm$core$Maybe$Just)),
					context.fn),
				aD: A3(
					$elm$core$Dict$update,
					$stil4m$elm_syntax$Elm$Syntax$Node$value(imp.aP),
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Maybe$withDefault($elm$core$Dict$empty),
						A2(
							$elm$core$Basics$composeR,
							$author$project$Analyser$Checks$DuplicateImportedVariable$mergeImportedValue(vs),
							$elm$core$Maybe$Just)),
					context.aD)
			});
	});
var $author$project$Analyser$Checks$DuplicateImportedVariable$scan = F2(
	function (fileContext, _v0) {
		var result = A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					c0: $author$project$ASTUtil$Inspector$Skip,
					c3: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$DuplicateImportedVariable$onImport)
				}),
			fileContext.e6,
			{fn: $elm$core$Dict$empty, aD: $elm$core$Dict$empty});
		return A2(
			$elm$core$List$map,
			$author$project$Analyser$Checks$DuplicateImportedVariable$asMessageData,
			_Utils_ap(
				$author$project$Analyser$Checks$DuplicateImportedVariable$findViolations(result.aD),
				$author$project$Analyser$Checks$DuplicateImportedVariable$findViolations(result.fn)));
	});
var $author$project$Analyser$Messages$Schema$VariableName = 2;
var $author$project$Analyser$Messages$Schema$varProp = F2(
	function (k, _v0) {
		var s = _v0;
		return A3($elm$core$Dict$insert, k, 2, s);
	});
var $author$project$Analyser$Checks$DuplicateImportedVariable$checker = {
	fg: $author$project$Analyser$Checks$DuplicateImportedVariable$scan,
	fR: {
		ft: 'Importing a variable twice from the same module is noise. Remove this.',
		fW: 'DuplicateImportedVariable',
		f2: 'Duplicate Imported Variable',
		go: A2(
			$author$project$Analyser$Messages$Schema$moduleProp,
			'moduleName',
			A2(
				$author$project$Analyser$Messages$Schema$varProp,
				'varName',
				A2($author$project$Analyser$Messages$Schema$rangeListProp, 'ranges', $author$project$Analyser$Messages$Schema$schema)))
	}
};
var $author$project$ASTUtil$Inspector$Inner = function (a) {
	return {$: 4, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Module$exposingList = function (m) {
	switch (m.$) {
		case 0:
			var x = m.a;
			return $stil4m$elm_syntax$Elm$Syntax$Node$value(x.bx);
		case 1:
			var x = m.a;
			return $stil4m$elm_syntax$Elm$Syntax$Node$value(x.bx);
		default:
			var x = m.a;
			return $stil4m$elm_syntax$Elm$Syntax$Node$value(x.bx);
	}
};
var $author$project$Analyser$Checks$ExposeAll$onFile = F3(
	function (_v0, file, _v1) {
		var _v2 = $stil4m$elm_syntax$Elm$Syntax$Module$exposingList(
			$stil4m$elm_syntax$Elm$Syntax$Node$value(file.f0));
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
					c$: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$ExposeAll$onFile)
				}),
			fileContext.e6,
			_List_Nil);
	});
var $author$project$Analyser$Checks$ExposeAll$checker = {
	fg: $author$project$Analyser$Checks$ExposeAll$scan,
	fR: {
		ft: 'You want to be clear about the API that a module defines.',
		fW: 'ExposeAll',
		f2: 'Expose All',
		go: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $stil4m$elm_syntax$Elm$Syntax$Node$range = function (_v0) {
	var r = _v0.a;
	return r;
};
var $author$project$Analyser$Checks$FunctionInLet$asMessage = function (_v0) {
	var declaration = _v0.fr;
	var range = $stil4m$elm_syntax$Elm$Syntax$Node$range(
		$stil4m$elm_syntax$Elm$Syntax$Node$value(declaration).f2);
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
	var typeAnnotation = _v0.gC;
	return $author$project$ASTUtil$Functions$isFunctionTypeAnnotation(
		$stil4m$elm_syntax$Elm$Syntax$Node$value(typeAnnotation));
};
var $author$project$ASTUtil$Functions$isStatic = function (_function) {
	var decl = $stil4m$elm_syntax$Elm$Syntax$Node$value(_function.fr);
	return ($elm$core$List$length(decl.e4) > 0) ? false : A2(
		$elm$core$Maybe$withDefault,
		true,
		A2(
			$elm$core$Maybe$map,
			A2(
				$elm$core$Basics$composeR,
				$stil4m$elm_syntax$Elm$Syntax$Node$value,
				A2($elm$core$Basics$composeR, $author$project$ASTUtil$Functions$isFunctionSignature, $elm$core$Basics$not)),
			_function.gq));
};
var $author$project$Analyser$Checks$FunctionInLet$onFunction = F2(
	function (_v0, context) {
		var _function = _v0.b;
		var isStatic = $author$project$ASTUtil$Functions$isStatic(_function);
		return ((!isStatic) && context.ak) ? _Utils_update(
			context,
			{
				aE: A2($elm$core$List$cons, _function, context.aE)
			}) : context;
	});
var $author$project$Analyser$Checks$FunctionInLet$onLetBlock = F3(
	function (_continue, _v0, context) {
		return function (after) {
			return _Utils_update(
				after,
				{ak: context.ak});
		}(
			_continue(
				_Utils_update(
					context,
					{ak: true})));
	});
var $author$project$Analyser$Checks$FunctionInLet$startingContext = {aE: _List_Nil, ak: false};
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
						c0: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$FunctionInLet$onFunction),
						c6: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$FunctionInLet$onLetBlock)
					}),
				fileContext.e6,
				$author$project$Analyser$Checks$FunctionInLet$startingContext).aE);
	});
var $author$project$Analyser$Checks$FunctionInLet$checker = {
	fg: $author$project$Analyser$Checks$FunctionInLet$scan,
	fR: {
		ft: 'In a let statement you can define variables and functions in their own scope. But you are already in the scope of a module. Just define the functions you want on a top-level. There is no not much need to define functions in let statements.',
		fW: 'FunctionInLet',
		f2: 'Function In Let',
		go: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$ImportAll$onImport = F2(
	function (_v0, context) {
		var imp = _v0.b;
		return function (a) {
			return A2($elm$core$List$append, a, context);
		}(
			function () {
				var _v1 = imp.bx;
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
								$stil4m$elm_syntax$Elm$Syntax$Node$value(imp.aP),
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
													$stil4m$elm_syntax$Elm$Syntax$Node$value(imp.aP)),
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
					c3: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$ImportAll$onImport)
				}),
			fileContext.e6,
			_List_Nil);
	});
var $author$project$Analyser$Checks$ImportAll$checker = {
	fg: $author$project$Analyser$Checks$ImportAll$scan,
	fR: {
		ft: 'When other people read your code, it would be nice if the origin of a used function can be traced back to the providing module.',
		fW: 'ImportAll',
		f2: 'Import All',
		go: A2(
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
		return {$: 3, a: a, b: b};
	});
var $author$project$Analyser$Checks$MapNothingToNothing$isNothingExpression = function (expression) {
	return _Utils_eq(
		expression,
		A2($stil4m$elm_syntax$Elm$Syntax$Expression$FunctionOrValue, _List_Nil, 'Nothing'));
};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$NamedPattern = F2(
	function (a, b) {
		return {$: 12, a: a, b: b};
	});
var $author$project$Analyser$Checks$MapNothingToNothing$isNothingPattern = function (pattern) {
	return _Utils_eq(
		pattern,
		A2(
			$stil4m$elm_syntax$Elm$Syntax$Pattern$NamedPattern,
			{aP: _List_Nil, f2: 'Nothing'},
			_List_Nil));
};
var $author$project$Analyser$Checks$MapNothingToNothing$onCase = F3(
	function (_v0, _v1, context) {
		var _v2 = _v1.a;
		var start = _v2.a.E;
		var pattern = _v2.b;
		var _v3 = _v1.b;
		var end = _v3.a.bw;
		var expression = _v3.b;
		return ($author$project$Analyser$Checks$MapNothingToNothing$isNothingPattern(pattern) && $author$project$Analyser$Checks$MapNothingToNothing$isNothingExpression(expression)) ? A2(
			$elm$core$List$cons,
			$author$project$Analyser$Checks$MapNothingToNothing$buildMessage(
				{bw: end, E: start}),
			context) : context;
	});
var $author$project$Analyser$Checks$MapNothingToNothing$scan = F2(
	function (fileContext, _v0) {
		return A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					cY: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$MapNothingToNothing$onCase)
				}),
			fileContext.e6,
			_List_Nil);
	});
var $author$project$Analyser$Checks$MapNothingToNothing$checker = {
	fg: $author$project$Analyser$Checks$MapNothingToNothing$scan,
	fR: {
		ft: 'Do not map a `Nothing` to `Nothing` with a case expression. Use `andThen` or `map` instead.',
		fW: 'MapNothingToNothing',
		f2: 'Map Nothing To Nothing',
		go: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
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
		$author$project$Analyser$Checks$MultiLineRecordFormatting$typeAnnotationRange(left.b).E.z,
		$author$project$Analyser$Checks$MultiLineRecordFormatting$typeAnnotationRange(right.b).E.z);
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
			$author$project$Analyser$Checks$MultiLineRecordFormatting$findRecords(x.gC),
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
									de: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$MultiLineRecordFormatting$onTypeAlias)
								}),
							fileContext.e6,
							_List_Nil)))));
	});
var $author$project$Analyser$Checks$MultiLineRecordFormatting$checker = {
	fg: $author$project$Analyser$Checks$MultiLineRecordFormatting$scan,
	fR: {
		ft: 'Records in type aliases should be formatted on multiple lines to help the reader.',
		fW: 'MultiLineRecordFormatting',
		f2: 'MultiLine Record Formatting',
		go: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$NoTopLevelSignature$onFunction = F3(
	function (_v0, _v1, context) {
		var _function = _v1.b;
		var _v2 = _function.gq;
		if (_v2.$ === 1) {
			var declaration = $stil4m$elm_syntax$Elm$Syntax$Node$value(_function.fr);
			var _v3 = declaration.f2;
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
					cZ: $author$project$ASTUtil$Inspector$Skip,
					c0: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$NoTopLevelSignature$onFunction)
				}),
			fileContext.e6,
			_List_Nil);
	});
var $author$project$Analyser$Checks$NoTopLevelSignature$checker = {
	fg: $author$project$Analyser$Checks$NoTopLevelSignature$scan,
	fR: {
		ft: 'We want our readers to understand our code. Adding a signature is part of this.',
		fW: 'NoTopLevelSignature',
		f2: 'No Top Level Signature',
		go: A2(
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
					c_: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$NoUncurriedPrefix$onExpression)
				}),
			fileContext.e6,
			_List_Nil);
	});
var $author$project$Analyser$Checks$NoUncurriedPrefix$checker = {
	fg: $author$project$Analyser$Checks$NoUncurriedPrefix$scan,
	fR: {
		ft: 'It\'s not needed to use an operator in prefix notation when you apply both arguments directly.',
		fW: 'NoUncurriedPrefix',
		f2: 'Fully Applied Operator as Prefix',
		go: A2(
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
					context.av,
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
				return context.av;
			}
		}();
		return _Utils_update(
			context,
			{
				aM: _Utils_ap(
					$author$project$Analyser$Checks$SingleFieldRecord$findPlainRecords(x),
					context.aM),
				av: newWhitelisted
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
	var matches = _v0.aM;
	var whitelisted = _v0.av;
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
									df: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$SingleFieldRecord$onTypeAnnotation)
								}),
							fileContext.e6,
							{aM: _List_Nil, av: _List_Nil})))));
	});
var $author$project$Analyser$Checks$SingleFieldRecord$checker = {
	fg: $author$project$Analyser$Checks$SingleFieldRecord$scan,
	fR: {
		ft: 'Using a record is obsolete if you only plan to store a single field in it.',
		fW: 'SingleFieldRecord',
		f2: 'Single Field Record',
		go: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
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
		if (!maybeValue.$) {
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
var $author$project$Analyser$Configuration$checkPropertyAs = F4(
	function (decoder, check, prop, _v0) {
		var raw = _v0.dm;
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
var $elm$core$String$toLower = _String_toLower;
var $author$project$Analyser$Checks$TriggerWords$normalizeWord = $elm$core$String$toLower;
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {fQ: index, fZ: match, gb: number, gu: submatches};
	});
var $elm$regex$Regex$split = _Regex_splitAtMost(_Regex_infinity);
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{fd: false, f1: false},
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
				fileContext.e6.fl));
	});
var $author$project$Analyser$Checks$TriggerWords$checker = {
	fg: $author$project$Analyser$Checks$TriggerWords$scan,
	fR: {
		ft: 'Comments can tell you what that you have to put your code a bit more attention. You should resolve things as \'TODO\' and such.',
		fW: 'TriggerWords',
		f2: 'Trigger Words',
		go: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'range',
			A2($author$project$Analyser$Messages$Schema$varProp, 'word', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
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
					c_: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnnecessaryListConcat$onExpression)
				}),
			fileContext.e6,
			_List_Nil);
	});
var $author$project$Analyser$Checks$UnnecessaryListConcat$checker = {
	fg: $author$project$Analyser$Checks$UnnecessaryListConcat$scan,
	fR: {
		ft: 'You should not use \'List.concat\' to concatenate literal lists. Just join the lists together.',
		fW: 'UnnecessaryListConcat',
		f2: 'Unnecessary List Concat',
		go: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
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
					c_: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnnecessaryLiteralBools$onExpression)
				}),
			fileContext.e6,
			_List_Nil);
	});
var $author$project$Analyser$Checks$UnnecessaryLiteralBools$checker = {
	fg: $author$project$Analyser$Checks$UnnecessaryLiteralBools$scan,
	fR: {
		ft: 'Directly use the boolean you already have.',
		fW: 'UnnecessaryLiteralBools',
		f2: 'Unnecessary Literal Booleans',
		go: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
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
		var _v0 = $author$project$Analyser$Checks$UnnecessaryParens$getParenthesized(caseBlock.by);
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
		var _v1 = $stil4m$elm_syntax$Elm$Syntax$Node$value(_function.fr).by;
		if (_v1.b.$ === 14) {
			var range = _v1.a;
			return A2($elm$core$List$cons, range, context);
		} else {
			return context;
		}
	});
var $author$project$Analyser$Checks$UnnecessaryParens$onLambda = F2(
	function (lambda, context) {
		var _v0 = lambda.by;
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
				$elm$core$String$fromInt(range.E.z),
				$elm$core$String$fromInt(range.E.M),
				$elm$core$String$fromInt(range.bw.z),
				$elm$core$String$fromInt(range.bw.M)
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
					c_: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnnecessaryParens$onExpression),
					c0: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnnecessaryParens$onFunction),
					c5: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnnecessaryParens$onLambda)
				}),
			fileContext.e6,
			_List_Nil);
		return A2(
			$elm$core$List$map,
			$author$project$Analyser$Checks$UnnecessaryParens$buildMessage,
			A2($elm_community$list_extra$List$Extra$uniqueBy, $author$project$Analyser$Checks$UnnecessaryParens$rangeToString, x));
	});
var $author$project$Analyser$Checks$UnnecessaryParens$checker = {
	fg: $author$project$Analyser$Checks$UnnecessaryParens$scan,
	fR: {
		ft: 'If you want parenthesis, then you might want to look into Lisp.',
		fW: 'UnnecessaryParens',
		f2: 'Unnecessary Parens',
		go: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
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
			$stil4m$elm_syntax$Elm$Syntax$Node$value(fileContext.e6.f0))) {
			var portDeclCount = A3(
				$author$project$ASTUtil$Inspector$inspect,
				_Utils_update(
					$author$project$ASTUtil$Inspector$defaultConfig,
					{
						c8: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnnecessaryPortModule$onPortDeclaration)
					}),
				fileContext.e6,
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
	fg: $author$project$Analyser$Checks$UnnecessaryPortModule$scan,
	fR: {ft: 'Dont use the port keyword if you do not need it.', fW: 'UnnecessaryPortModule', f2: 'Unnecessary Port Module', go: $author$project$Analyser$Messages$Schema$schema}
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
				qualifiedNameRef.aP,
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
		return (_Utils_eq(imp.ej, $elm$core$Maybe$Nothing) && _Utils_eq(imp.bx, $elm$core$Maybe$Nothing)) ? A3(
			$elm$core$Dict$insert,
			$stil4m$elm_syntax$Elm$Syntax$Node$value(imp.aP),
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
					c3: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImport$onImport)
				}),
			fileContext.e6,
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
									cY: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImport$onCase),
									c_: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImport$onExpression),
									df: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImport$onTypeAnnotation)
								}),
							fileContext.e6,
							aliases)))));
	});
var $author$project$Analyser$Checks$UnusedImport$checker = {
	fg: $author$project$Analyser$Checks$UnusedImport$scan,
	fR: {
		ft: 'Imports that have no meaning should be removed.',
		fW: 'UnusedImport',
		f2: 'Unused Import',
		go: A2(
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
		var _v1 = A2($elm$core$Maybe$map, $stil4m$elm_syntax$Elm$Syntax$Node$value, imp.ej);
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
					c3: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImportAlias$onImport)
				}),
			fileContext.e6,
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
									cY: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImportAlias$onCase),
									c_: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImportAlias$onExpression),
									df: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedImportAlias$onTypeAnnotation)
								}),
							fileContext.e6,
							aliases)))));
	});
var $author$project$Analyser$Checks$UnusedImportAlias$checker = {
	fg: $author$project$Analyser$Checks$UnusedImportAlias$scan,
	fR: {
		ft: 'You defined an alias for an import (import Foo as F), but it turns out you never use it.',
		fW: 'UnusedImportAlias',
		f2: 'Unused Import Alias',
		go: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'range',
			A2($author$project$Analyser$Messages$Schema$moduleProp, 'moduleName', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$ASTUtil$Inspector$Pre = function (a) {
	return {$: 2, a: a};
};
var $author$project$Analyser$Checks$Variables$UsedVariableContext = $elm$core$Basics$identity;
var $author$project$Analyser$Checks$Variables$emptyContext = {n: _List_Nil, W: _List_Nil};
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
				n: A2($author$project$Analyser$Checks$Variables$flagVariable, x, context.n)
			});
	});
var $author$project$ASTUtil$Variables$qualifiedNameUsedVars = F2(
	function (_v0, range) {
		var moduleName = _v0.aP;
		var name = _v0.f2;
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
	if (dict.$ === -2) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Analyser$Checks$Variables$popScope = function (x) {
	return _Utils_update(
		x,
		{
			n: A2($elm$core$List$drop, 1, x.n),
			W: A2(
				$elm$core$Maybe$withDefault,
				x.W,
				A2(
					$elm$core$Maybe$map,
					function (_v0) {
						var activeScope = _v0.b;
						return $elm$core$Dict$isEmpty(activeScope) ? x.W : A2($elm$core$List$cons, activeScope, x.W);
					},
					$elm$core$List$head(x.n)))
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
				n: A2($elm$core$List$cons, y, x.n)
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
					$stil4m$elm_syntax$Elm$Syntax$Node$value(f.fr).f2,
					3)
				]);
		case 1:
			return _List_Nil;
		case 2:
			var t = decl.a;
			return A2(
				$elm$core$List$map,
				function (_v2) {
					var name = _v2.b.f2;
					return _Utils_Tuple2(name, 3);
				},
				t.fn);
		case 3:
			var p = decl.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(p.f2, 3)
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
							var _v3 = exposedType.b_;
							if (!_v3.$) {
								return _List_Nil;
							} else {
								return _List_fromArray(
									[
										_Utils_Tuple2(
										A2($stil4m$elm_syntax$Elm$Syntax$Node$Node, r, exposedType.f2),
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
		A2($elm$core$Maybe$map, $stil4m$elm_syntax$Elm$Syntax$Node$value, imp.bx));
};
var $author$project$ASTUtil$Variables$getImportsVars = $elm$core$List$concatMap($author$project$ASTUtil$Variables$getImportVars);
var $author$project$ASTUtil$Variables$getTopLevels = function (file) {
	return $elm$core$List$concat(
		_List_fromArray(
			[
				$author$project$ASTUtil$Variables$getImportsVars(file.d6),
				$author$project$ASTUtil$Variables$getDeclarationsVars(file.dM)
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
				n: function () {
					var _v0 = context.n;
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
				n: function () {
					var _v0 = context.n;
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
		var functionDeclaration = $stil4m$elm_syntax$Elm$Syntax$Node$value(_function.fr);
		var postContext = function (c) {
			return A2(
				$author$project$Analyser$Checks$Variables$unMaskVariable,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(functionDeclaration.f2),
				$author$project$Analyser$Checks$Variables$popScope(
					f(
						function (a) {
							return A2($author$project$Analyser$Checks$Variables$pushScope, a, c);
						}(
							A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToVars, functionDeclaration.e4)))));
		}(
			A2(
				$author$project$Analyser$Checks$Variables$maskVariable,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(functionDeclaration.f2),
				context));
		var used = A2(
			$elm$core$List$map,
			$stil4m$elm_syntax$Elm$Syntax$Node$value,
			A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToUsedVars, functionDeclaration.e4));
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
			A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToVars, lambda.e2));
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
				$stil4m$elm_syntax$Elm$Syntax$Node$value(f.fr).f2,
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
					A3($elm$core$Basics$composeR, $author$project$ASTUtil$Variables$getLetDeclarationsVars, $author$project$ASTUtil$Variables$withoutTopLevel, letBlock.dM))));
	});
var $author$project$Analyser$Checks$Variables$onOperatorAppliction = F2(
	function (_v0, context) {
		var operator = _v0.ge;
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
				cY: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$Variables$onCase),
				cZ: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$Variables$onDestructuring),
				c$: $author$project$ASTUtil$Inspector$Pre($author$project$Analyser$Checks$Variables$onFile),
				c0: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$Variables$onFunction),
				c1: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$Variables$onFunctionOrValue),
				c5: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$Variables$onLambda),
				c6: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$Variables$onLetBlock),
				c7: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$Variables$onOperatorAppliction),
				c9: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$Variables$onPrefixOperator),
				db: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$Variables$onRecordUpdate),
				df: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$Variables$onTypeAnnotation)
			}),
		fileContext.e6,
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
							$stil4m$elm_syntax$Elm$Syntax$Node$value(inf.ge),
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
	var _v0 = $stil4m$elm_syntax$Elm$Syntax$Node$value(fileContext.e6.f0);
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
						$elm$core$List$head(x.n))))));
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
			A2($elm$core$List$concatMap, $elm$core$Dict$toList, x.W)));
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
							return A2($stil4m$elm_syntax$Elm$Interface$exposesFunction, a, fileContext.fT);
						},
						$elm$core$Basics$not)),
				A2(
					$elm$core$List$filter,
					$author$project$Analyser$Checks$UnusedImportedVariable$filterByModuleType(fileContext),
					$author$project$Analyser$Checks$Variables$unusedTopLevels(x))));
		return _Utils_ap(unusedVariables, unusedTopLevels);
	});
var $author$project$Analyser$Checks$UnusedImportedVariable$checker = {
	fg: $author$project$Analyser$Checks$UnusedImportedVariable$scan,
	fR: {
		ft: 'When a function is imported from a module but is unused, it is better to remove it.',
		fW: 'UnusedImportedVariable',
		f2: 'Unused Imported Variable',
		go: A2(
			$author$project$Analyser$Messages$Schema$rangeProp,
			'range',
			A2($author$project$Analyser$Messages$Schema$varProp, 'varName', $author$project$Analyser$Messages$Schema$schema))
	}
};
var $author$project$Analyser$Checks$UnusedPatternVariable$emptyContext = {n: _List_Nil, W: _List_Nil};
var $author$project$Analyser$Checks$UnusedPatternVariable$filterForEffectModule = function (_v0) {
	var k = _v0.a;
	return !A2(
		$elm$core$List$member,
		k,
		_List_fromArray(
			['init', 'onEffects', 'onSelfMsg', 'subMap', 'cmdMap']));
};
var $author$project$Analyser$Checks$UnusedPatternVariable$filterByModuleType = function (fileContext) {
	var _v0 = $stil4m$elm_syntax$Elm$Syntax$Node$value(fileContext.e6.f0);
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
				n: A2($author$project$Analyser$Checks$UnusedPatternVariable$flagVariable, x, context.n)
			});
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$popScope = function (x) {
	return _Utils_update(
		x,
		{
			n: A2($elm$core$List$drop, 1, x.n),
			W: A2(
				$elm$core$Maybe$withDefault,
				x.W,
				A2(
					$elm$core$Maybe$map,
					function (_v0) {
						var activeScope = _v0.b;
						return $elm$core$Dict$isEmpty(activeScope) ? x.W : A2($elm$core$List$cons, activeScope, x.W);
					},
					$elm$core$List$head(x.n)))
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
				n: A2($elm$core$List$cons, y, x.n)
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
				n: function () {
					var _v0 = context.n;
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
				n: function () {
					var _v0 = context.n;
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
		var functionDeclaration = $stil4m$elm_syntax$Elm$Syntax$Node$value(_function.fr);
		var postContext = function (c) {
			return A2(
				$author$project$Analyser$Checks$UnusedPatternVariable$unMaskVariable,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(functionDeclaration.f2),
				$author$project$Analyser$Checks$UnusedPatternVariable$popScope(
					f(
						function (a) {
							return A2($author$project$Analyser$Checks$UnusedPatternVariable$pushScope, a, c);
						}(
							A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToVars, functionDeclaration.e4)))));
		}(
			A2(
				$author$project$Analyser$Checks$UnusedPatternVariable$maskVariable,
				$stil4m$elm_syntax$Elm$Syntax$Node$value(functionDeclaration.f2),
				context));
		var used = A2(
			$elm$core$List$map,
			$stil4m$elm_syntax$Elm$Syntax$Node$value,
			A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToUsedVars, functionDeclaration.e4));
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
			A2($elm$core$List$concatMap, $author$project$ASTUtil$Variables$patternToVars, lambda.e2));
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
					A3($elm$core$Basics$composeR, $author$project$ASTUtil$Variables$getLetDeclarationsVars, $author$project$ASTUtil$Variables$withoutTopLevel, letBlock.dM))));
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$onOperatorApplication = F2(
	function (_v0, context) {
		var operator = _v0.ge;
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
					cY: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$UnusedPatternVariable$onCase),
					cZ: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedPatternVariable$onDestructuring),
					c$: $author$project$ASTUtil$Inspector$Pre($author$project$Analyser$Checks$UnusedPatternVariable$onFile),
					c0: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$UnusedPatternVariable$onFunction),
					c1: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedPatternVariable$onFunctionOrValue),
					c5: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$UnusedPatternVariable$onLambda),
					c6: $author$project$ASTUtil$Inspector$Inner($author$project$Analyser$Checks$UnusedPatternVariable$onLetBlock),
					c7: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedPatternVariable$onOperatorApplication),
					c9: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedPatternVariable$onPrefixOperator),
					db: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedPatternVariable$onRecordUpdate),
					df: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedPatternVariable$onTypeAnnotation)
				}),
			fileContext.e6,
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
							return A2($stil4m$elm_syntax$Elm$Interface$exposesFunction, a, fileContext.fT);
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
									$elm$core$List$head(x.n))))))));
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
				A2($elm$core$List$concatMap, $elm$core$Dict$toList, x.W)));
		return _Utils_ap(unusedVariables, unusedTopLevels);
	});
var $author$project$Analyser$Checks$UnusedPatternVariable$checker = {
	fg: $author$project$Analyser$Checks$UnusedPatternVariable$scan,
	fR: {
		ft: 'Variables in pattern matching that are unused should be replaced with \'_\' to avoid unnecessary noise.',
		fW: 'UnusedPatternVariable',
		f2: 'Unused Pattern Variable',
		go: A2(
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
	var _v0 = $stil4m$elm_syntax$Elm$Syntax$Node$value(fileContext.e6.f0);
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
							return A2($stil4m$elm_syntax$Elm$Interface$exposesFunction, a, fileContext.fT);
						},
						$elm$core$Basics$not)),
				A2(
					$elm$core$List$filter,
					$author$project$Analyser$Checks$UnusedTopLevel$filterByModuleType(fileContext),
					$author$project$Analyser$Checks$Variables$unusedTopLevels(x))));
		return _Utils_ap(unusedVariables, unusedTopLevels);
	});
var $author$project$Analyser$Checks$UnusedTopLevel$checker = {
	fg: $author$project$Analyser$Checks$UnusedTopLevel$scan,
	fR: {
		ft: 'Functions and values that are unused in a module and not exported are dead code.',
		fW: 'UnusedTopLevel',
		f2: 'Unused Top Level',
		go: A2(
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
			$stil4m$elm_syntax$Elm$Syntax$Node$value(typeAlias.f2),
			_Utils_Tuple3(
				$stil4m$elm_syntax$Elm$Syntax$Node$value(typeAlias.f2),
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
					de: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedTypeAlias$onTypeAlias)
				}),
			fileContext.e6,
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
								return A2($stil4m$elm_syntax$Elm$Interface$exposesAlias, a, fileContext.fT);
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
										c1: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedTypeAlias$onFunctionOrValue),
										df: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedTypeAlias$onTypeAnnotation)
									}),
								fileContext.e6,
								collectedAliased))))));
	});
var $author$project$Analyser$Checks$UnusedTypeAlias$checker = {
	fg: $author$project$Analyser$Checks$UnusedTypeAlias$scan,
	fR: {
		ft: 'You defined a type alias, but you do not use it in any signature or expose it.',
		fW: 'UnusedTypeAlias',
		f2: 'Unused Type Alias',
		go: A2(
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
					a2: A2($elm$core$Set$insert, s, config.a2)
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
					$stil4m$elm_syntax$Elm$Syntax$Node$value(constructor.f2),
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
							$stil4m$elm_syntax$Elm$Syntax$Node$value(constructor.f2),
							_interface);
					}),
				t.fn));
		return _Utils_update(
			context,
			{
				a0: _Utils_ap(context.a0, nonExposed)
			});
	});
var $author$project$Analyser$Checks$UnusedValueConstructor$scan = F2(
	function (fileContext, _v0) {
		var result = A3(
			$author$project$ASTUtil$Inspector$inspect,
			_Utils_update(
				$author$project$ASTUtil$Inspector$defaultConfig,
				{
					c_: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UnusedValueConstructor$onExpression),
					dd: $author$project$ASTUtil$Inspector$Inner(
						$elm$core$Basics$always(
							$author$project$Analyser$Checks$UnusedValueConstructor$onType(fileContext.fT)))
				}),
			fileContext.e6,
			{a0: _List_Nil, a2: $elm$core$Set$empty});
		return A2(
			$elm$core$List$map,
			$author$project$Analyser$Checks$UnusedValueConstructor$buildMessageData,
			A2(
				$elm$core$List$filter,
				function (x) {
					return !A2($elm$core$Set$member, x.a, result.a2);
				},
				result.a0));
	});
var $author$project$Analyser$Checks$UnusedValueConstructor$checker = {
	fg: $author$project$Analyser$Checks$UnusedValueConstructor$scan,
	fR: {
		ft: 'Value Constructors which are not exposed and used should be eliminated.',
		fW: 'UnusedValueConstructor',
		f2: 'Unused Value Constructor',
		go: A2(
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
	var _v0 = $stil4m$elm_syntax$Elm$Syntax$Node$value(fileContext.e6.f0);
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
							return A2($stil4m$elm_syntax$Elm$Interface$exposesFunction, a, fileContext.fT);
						},
						$elm$core$Basics$not)),
				A2(
					$elm$core$List$filter,
					$author$project$Analyser$Checks$UnusedVariable$filterByModuleType(fileContext),
					$author$project$Analyser$Checks$Variables$unusedTopLevels(x))));
		return _Utils_ap(unusedVariables, unusedTopLevels);
	});
var $author$project$Analyser$Checks$UnusedVariable$checker = {
	fg: $author$project$Analyser$Checks$UnusedVariable$scan,
	fR: {
		ft: 'Variables that are not used could be removed or marked as _ to avoid unnecessary noise.',
		fW: 'UnusedVariable',
		f2: 'Unused Variable',
		go: A2(
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
					c_: $author$project$ASTUtil$Inspector$Post($author$project$Analyser$Checks$UseConsOverConcat$onExpression)
				}),
			fileContext.e6,
			_List_Nil);
	});
var $author$project$Analyser$Checks$UseConsOverConcat$checker = {
	fg: $author$project$Analyser$Checks$UseConsOverConcat$scan,
	fR: {
		ft: 'If you concatenate two lists, but the right hand side is a single element list, then you should use the cons operator.',
		fW: 'UseConsOverConcat',
		f2: 'Use Cons Over Concat',
		go: A2($author$project$Analyser$Messages$Schema$rangeProp, 'range', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$all = _List_fromArray(
	[$author$project$Analyser$Checks$UnusedVariable$checker, $author$project$Analyser$Checks$UnusedValueConstructor$checker, $author$project$Analyser$Checks$UnusedImportedVariable$checker, $author$project$Analyser$Checks$UnusedPatternVariable$checker, $author$project$Analyser$Checks$UnusedTopLevel$checker, $author$project$Analyser$Checks$ExposeAll$checker, $author$project$Analyser$Checks$ImportAll$checker, $author$project$Analyser$Checks$NoTopLevelSignature$checker, $author$project$Analyser$Checks$UnnecessaryParens$checker, $author$project$Analyser$Checks$DebugLog$checker, $author$project$Analyser$Checks$DebugCrash$checker, $author$project$Analyser$Checks$DuplicateImport$checker, $author$project$Analyser$Checks$DuplicateImportedVariable$checker, $author$project$Analyser$Checks$UnusedTypeAlias$checker, $author$project$Analyser$Checks$NoUncurriedPrefix$checker, $author$project$Analyser$Checks$UnusedImportAlias$checker, $author$project$Analyser$Checks$UnusedImport$checker, $author$project$Analyser$Checks$UseConsOverConcat$checker, $author$project$Analyser$Checks$DropConcatOfLists$checker, $author$project$Analyser$Checks$DropConsOfItemAndList$checker, $author$project$Analyser$Checks$UnnecessaryListConcat$checker, $author$project$Analyser$Checks$MultiLineRecordFormatting$checker, $author$project$Analyser$Checks$UnnecessaryPortModule$checker, $author$project$Analyser$Checks$FunctionInLet$checker, $author$project$Analyser$Checks$SingleFieldRecord$checker, $author$project$Analyser$Checks$TriggerWords$checker, $author$project$Analyser$Checks$BooleanCase$checker, $author$project$Analyser$Checks$MapNothingToNothing$checker, $author$project$Analyser$Checks$UnnecessaryLiteralBools$checker]);
var $author$project$Analyser$Messages$Schemas$Schemas = $elm$core$Basics$identity;
var $author$project$Analyser$Messages$Schemas$buildSchemas = function (checkerList) {
	return $elm$core$Dict$fromList(
		A2(
			$elm$core$List$map,
			function (c) {
				return _Utils_Tuple2(c.fR.fW, c.fR.go);
			},
			checkerList));
};
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
	fg: $author$project$Analyser$Checks$FileLoadFailed$scan,
	fR: {
		ft: 'We could not analyse this file...',
		fW: 'FileLoadFailed',
		f2: 'FileLoadFailed',
		go: A2($author$project$Analyser$Messages$Schema$errorProp, 'message', $author$project$Analyser$Messages$Schema$schema)
	}
};
var $author$project$Analyser$Checks$schemas = $author$project$Analyser$Messages$Schemas$buildSchemas(
	A2($elm$core$List$cons, $author$project$Analyser$Checks$FileLoadFailed$checker, $author$project$Analyser$Checks$all));
var $author$project$Client$State$tick = function (_v0) {
	return A2(
		$elm$core$Platform$Cmd$map,
		$krisajenkins$remotedata$RemoteData$fromResult,
		A2(
			$elm$http$Http$send,
			$elm$core$Basics$identity,
			A2(
				$elm$http$Http$get,
				'/state',
				$author$project$Analyser$State$decodeState($author$project$Analyser$Checks$schemas))));
};
var $author$project$Client$App$App$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 4:
				var u = msg.a;
				var route = $author$project$Client$Routing$fromUrl(u);
				return A2($author$project$Client$App$App$onRoute, route, model);
			case 3:
				var req = msg.a;
				if (!req.$) {
					var u = req.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Client$Routing$setRoute,
							model.fW,
							$author$project$Client$Routing$fromUrl(u)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 5:
				return _Utils_Tuple2(
					model,
					A2(
						$elm$core$Platform$Cmd$map,
						$author$project$Client$App$App$NewState,
						$author$project$Client$State$tick(model.y)));
			case 0:
				var subMsg = msg.a;
				return A2($author$project$Client$App$App$onMessagesPageMsg, subMsg, model);
			case 1:
				var subMsg = msg.a;
				return A2($author$project$Client$App$App$onFileTreeMsg, subMsg, model);
			case 2:
				var subMsg = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Client$App$App$onPackageDependenciesMsg, subMsg, model),
					$elm$core$Platform$Cmd$none);
			default:
				var state = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Client$App$App$onNewState, state, model),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Client$App$App$PackageDependenciesMsg = function (a) {
	return {$: 2, a: a};
};
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$i = _VirtualDom_node('i');
var $author$project$Client$App$Menu$isActiveClass = F2(
	function (l, r) {
		return _Utils_eq(l, r) ? 'active' : '';
	});
var $elm$html$Html$li = _VirtualDom_node('li');
var $author$project$Client$App$Menu$menuItem = F4(
	function (location, route, name, icon) {
		return A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					A2($author$project$Client$App$Menu$isActiveClass, location, route))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href(
							$author$project$Client$Routing$toUrl(route))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$i,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('fa fa-' + (icon + ' fa-fw'))
								]),
							_List_Nil),
							$elm$html$Html$text(' '),
							$elm$html$Html$text(name)
						]))
				]));
	});
var $elm$html$Html$nav = _VirtualDom_node('nav');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$Client$App$Menu$view = function (l) {
	return A2(
		$elm$html$Html$nav,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('navbar navbar-default navbar-static-top'),
				A2($elm$html$Html$Attributes$attribute, 'role', 'navigation'),
				A2($elm$html$Html$Attributes$style, 'margin-bottom', '0')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('navbar-header')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('navbar-brand'),
								$elm$html$Html$Attributes$href('/')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Elm Analyse')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('navbar-default sidebar'),
						A2($elm$html$Html$Attributes$attribute, 'role', 'navigation')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('sidebar-nav')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$ul,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('nav in')
									]),
								_List_fromArray(
									[
										A4($author$project$Client$App$Menu$menuItem, l, 0, 'Dashboard', 'dashboard'),
										A4($author$project$Client$App$Menu$menuItem, l, 3, 'All Messages', 'list'),
										A4($author$project$Client$App$Menu$menuItem, l, 4, 'Tree', 'files-o'),
										A4($author$project$Client$App$Menu$menuItem, l, 1, 'Dependencies', 'arrows'),
										A4($author$project$Client$App$Menu$menuItem, l, 2, 'Modules', 'cubes')
									]))
							]))
					]))
			]));
};
var $author$project$Client$Components$FileTree$OnSelectFile = function (a) {
	return {$: 2, a: a};
};
var $author$project$Client$Components$FileTree$ToggleHideGoodFiles = {$: 3};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$html$Html$hr = _VirtualDom_node('hr');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$Client$Components$MessageList$Focus = function (a) {
	return {$: 0, a: a};
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Analyser$Messages$Grouped$isEmpty = function (_v0) {
	var xs = _v0.b;
	return $elm$core$List$isEmpty(xs);
};
var $author$project$Analyser$Messages$Data$description = function (_v0) {
	var d = _v0.a;
	return d;
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
var $author$project$Client$Highlight$afterHighlight = F3(
	function (rowsAround, targetRows, range) {
		var _v0 = _Utils_Tuple3(range.E.z, range.bw.z, range.bw.M);
		var endRow = _v0.b;
		var endColumn = _v0.c;
		var postLineText = A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				$elm$core$String$dropLeft(endColumn - 1),
				$elm$core$List$head(
					A2($elm$core$List$drop, endRow - 1, targetRows))));
		var postLines = A2(
			$elm$core$List$take,
			rowsAround,
			A2($elm$core$List$drop, endRow, targetRows));
		return A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$cons, postLineText, postLines));
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $author$project$Client$Highlight$beforeHighlight = F3(
	function (rowsAround, targetRows, range) {
		var startColumn = range.E.M;
		var preLineText = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				$elm$core$List$singleton,
				A2(
					$elm$core$Maybe$map,
					$elm$core$String$left(startColumn - 1),
					$elm$core$List$head(
						A2($elm$core$List$drop, range.E.z - 1, targetRows)))));
		var linesToDrop = (range.E.z - 1) - rowsAround;
		var linesToKeep = A2($elm$core$Basics$min, rowsAround, rowsAround + linesToDrop);
		var preLines = A2(
			$elm$core$List$take,
			linesToKeep,
			A2($elm$core$List$drop, linesToDrop, targetRows));
		return A2(
			$elm$core$String$join,
			'\n',
			_Utils_ap(preLines, preLineText));
	});
var $stil4m$elm_syntax$Elm$Syntax$Range$emptyRange = {
	bw: {M: 0, z: 0},
	E: {M: 0, z: 0}
};
var $author$project$Client$Highlight$highlightedString = F2(
	function (targetRows, range) {
		var isMultiRow = !_Utils_eq(range.E.z, range.bw.z);
		var tailString = isMultiRow ? A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				$elm$core$List$singleton,
				A2(
					$elm$core$Maybe$map,
					$elm$core$String$left(range.bw.M),
					$elm$core$List$head(
						A2($elm$core$List$drop, range.bw.z - 1, targetRows))))) : _List_Nil;
		var headString = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				$elm$core$List$singleton,
				A2(
					$elm$core$Maybe$map,
					function (v) {
						return isMultiRow ? v : A2($elm$core$String$left, range.bw.M - range.E.M, v);
					},
					A2(
						$elm$core$Maybe$map,
						$elm$core$String$dropLeft(range.E.M - 1),
						$elm$core$List$head(
							A2($elm$core$List$drop, range.E.z - 1, targetRows))))));
		var bodyString = A2(
			$elm$core$List$take,
			(range.bw.z - 1) - range.E.z,
			A2($elm$core$List$drop, range.E.z, targetRows));
		return A2(
			$elm$core$String$join,
			'\n',
			_Utils_ap(
				headString,
				_Utils_ap(bodyString, tailString)));
	});
var $elm$html$Html$pre = _VirtualDom_node('pre');
var $author$project$Client$Highlight$highlightedPre = F3(
	function (rowsAround, content, range) {
		if (_Utils_eq(range, $stil4m$elm_syntax$Elm$Syntax$Range$emptyRange)) {
			return A2(
				$elm$html$Html$pre,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(content)
					]));
		} else {
			var lines = A2($elm$core$String$split, '\n', content);
			var postText = A3($author$project$Client$Highlight$afterHighlight, rowsAround, lines, range);
			var preText = A3($author$project$Client$Highlight$beforeHighlight, rowsAround, lines, range);
			var highlighedSection = A2($author$project$Client$Highlight$highlightedString, lines, range);
			var _v0 = _Utils_Tuple2(range.E.z, range.bw.z);
			return A2(
				$elm$html$Html$pre,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(preText),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('highlight'),
								A2($elm$html$Html$Attributes$style, 'color', 'white'),
								A2($elm$html$Html$Attributes$style, 'background', 'red')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(highlighedSection)
							])),
						$elm$html$Html$text(postText)
					]));
		}
	});
var $author$project$Client$Components$ActiveMessageDialog$viewWithFileContent = F2(
	function (state, x) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'max-height', '400px'),
					A2($elm$html$Html$Attributes$style, 'overflow', 'auto')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					A2(
						$elm$core$List$map,
						A2($author$project$Client$Highlight$highlightedPre, 3, x),
						state.dl)),
					$elm$html$Html$text(
					$author$project$Analyser$Messages$Data$description(state.S.fq))
				]));
	});
var $author$project$Client$Components$ActiveMessageDialog$dialogBody = function (state) {
	var _v0 = state.br;
	switch (_v0.$) {
		case 0:
			return A2($elm$html$Html$div, _List_Nil, _List_Nil);
		case 1:
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Loading...')
					]));
		case 3:
			var x = _v0.a;
			return A2($author$project$Client$Components$ActiveMessageDialog$viewWithFileContent, state, x);
		default:
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Something went wrong.')
					]));
	}
};
var $author$project$Client$Components$ActiveMessageDialog$dialogHeader = function (state) {
	var filePath = state.S.dZ.gg;
	return A2(
		$elm$html$Html$h3,
		_List_Nil,
		_List_fromArray(
			[
				$elm$html$Html$text('Message (' + (filePath + ')'))
			]));
};
var $author$project$Client$Components$ActiveMessageDialog$Fix = {$: 2};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $author$project$Client$Components$ActiveMessageDialog$fixableFooter = F2(
	function (fixing, fixer) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('btn btn-success'),
							$elm$html$Html$Events$onClick($author$project$Client$Components$ActiveMessageDialog$Fix),
							$elm$html$Html$Attributes$disabled(fixing)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(fixer.ft)
						]))
				]));
	});
var $author$project$Analyser$Fixes$Base$Fixer = F3(
	function (canFix, fix, description) {
		return {fc: canFix, ft: description, fD: fix};
	});
var $author$project$Analyser$Fixes$Base$IncompatibleData = {$: 0};
var $author$project$Analyser$Fixes$Base$Patched = function (a) {
	return {$: 1, a: a};
};
var $elm$core$String$append = _String_append;
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $author$project$Analyser$Fixes$FileContent$patchRange = function (rawRange) {
	return {
		bw: {M: rawRange.bw.M - 1, z: rawRange.bw.z - 1},
		E: {M: rawRange.E.M - 1, z: rawRange.E.z - 1}
	};
};
var $author$project$Analyser$Fixes$FileContent$updateRange = F3(
	function (rawRange, patch, content) {
		var rows = A2($elm$core$String$split, '\n', content);
		var range = $author$project$Analyser$Fixes$FileContent$patchRange(rawRange);
		var rowPostPartTakeFn = $elm$core$String$dropLeft(range.bw.M);
		var rowPrePartTakeFn = $elm$core$String$left(range.E.M);
		var beforeRows = range.E.z;
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
		var afterRows = range.bw.z;
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
		var middleRange = {bw: tailRange.E, E: headRange.bw};
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
var $author$project$Analyser$Fixes$DropConsOfItemAndList$fixer = A3($author$project$Analyser$Fixes$Base$Fixer, $author$project$Analyser$Checks$DropConsOfItemAndList$checker.fR.fW, $author$project$Analyser$Fixes$DropConsOfItemAndList$fix, 'Combine and format');
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
								return $.E;
							},
							function ($) {
								return $.z;
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
var $author$project$Analyser$Fixes$DuplicateImport$fixer = A3($author$project$Analyser$Fixes$Base$Fixer, $author$project$Analyser$Checks$DuplicateImport$checker.fR.fW, $author$project$Analyser$Fixes$DuplicateImport$fix, 'Remove extra imports and format');
var $author$project$Analyser$Fixes$MultiLineRecordFormatting$commaAndIdentifierRegex = $elm$regex$Regex$fromString(',\\s+[a-z][a-zA-Z0-9_]*\'?\\s+:');
var $elm$regex$Regex$replaceAtMost = _Regex_replaceAtMost;
var $author$project$Analyser$Fixes$MultiLineRecordFormatting$replacement = function (_v0) {
	var match = _v0.fZ;
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
var $author$project$Analyser$Fixes$MultiLineRecordFormatting$fixer = A3($author$project$Analyser$Fixes$Base$Fixer, $author$project$Analyser$Checks$MultiLineRecordFormatting$checker.fR.fW, $author$project$Analyser$Fixes$MultiLineRecordFormatting$fix, 'Rewrite over multiple lines and format');
var $author$project$Analyser$Fixes$Base$Error = function (a) {
	return {$: 2, a: a};
};
var $author$project$Analyser$Fixes$FileContent$patchLocation = function (_v0) {
	var column = _v0.M;
	var row = _v0.z;
	return {M: column - 1, z: row - 1};
};
var $author$project$Analyser$Fixes$FileContent$getCharAtLocation = F2(
	function (pair, input) {
		var _v0 = $author$project$Analyser$Fixes$FileContent$patchLocation(pair);
		var row = _v0.z;
		var column = _v0.M;
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
		var row = _v0.z;
		var column = _v0.M;
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
		var start = _v0.E;
		var end = _v0.bw;
		var endLoc = {M: end.M - 1, z: end.z};
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
var $author$project$Analyser$Fixes$UnnecessaryParens$fixer = A3($author$project$Analyser$Fixes$Base$Fixer, $author$project$Analyser$Checks$UnnecessaryParens$checker.fR.fW, $author$project$Analyser$Fixes$UnnecessaryParens$fix, 'Remove and format');
var $author$project$Analyser$Fixes$UnusedImport$canFix = $author$project$Analyser$Checks$UnusedImport$checker.fR.fW;
var $author$project$AST$Ranges$isGte = F2(
	function (a, b) {
		return (_Utils_cmp(a.z, b.z) > 0) ? true : ((_Utils_cmp(a.z, b.z) < 0) ? false : (_Utils_cmp(a.M, b.M) > -1));
	});
var $author$project$AST$Ranges$containsRange = F2(
	function (a, b) {
		return A2($author$project$AST$Ranges$isGte, a.E, b.E) && A2($author$project$AST$Ranges$isGte, b.bw, a.bw);
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
				ast.d6));
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
var $elm_community$list_extra$List$Extra$unique = function (list) {
	return A4($elm_community$list_extra$List$Extra$uniqueHelp, $elm$core$Basics$identity, $elm$core$Set$empty, list, _List_Nil);
};
var $author$project$ASTUtil$Imports$rangesOnDifferentLines = function (ranges) {
	var starts = A2(
		$elm$core$List$map,
		A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.E;
			},
			function ($) {
				return $.z;
			}),
		ranges);
	return _Utils_eq(
		$elm$core$List$length(
			$elm_community$list_extra$List$Extra$unique(starts)),
		$elm$core$List$length(starts));
};
var $author$project$ASTUtil$Imports$stringifyExposedType = function (_v0) {
	var name = _v0.f2;
	var open = _v0.b_;
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
				$stil4m$elm_syntax$Elm$Syntax$Node$value(imp.aP)),
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
					imp.ej)),
				$author$project$ASTUtil$Imports$stringifyExposingList(
				A2($elm$core$Maybe$map, $stil4m$elm_syntax$Elm$Syntax$Node$value, imp.bx))
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
			_Utils_Tuple2(syntaxRange.E.z - 1, syntaxRange.bw.z - 1),
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
						{ej: $elm$core$Maybe$Nothing}),
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
var $author$project$Analyser$Fixes$UnusedImportAlias$fixer = A3($author$project$Analyser$Fixes$Base$Fixer, $author$project$Analyser$Checks$UnusedImportAlias$checker.fR.fW, $author$project$Analyser$Fixes$UnusedImportAlias$fix, 'Remove alias and format');
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
										b_: _Utils_eq(
											exposedType.b_,
											$elm$core$Maybe$Just(range)) ? $elm$core$Maybe$Nothing : exposedType.b_
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
				bx: A2(
					$elm$core$Maybe$andThen,
					$author$project$ASTUtil$Imports$removeRangeFromExposingList(range),
					imp.bx)
			});
	});
var $author$project$Analyser$Fixes$UnusedImportedVariable$writeNewImport = F3(
	function (syntaxRange, imp, i) {
		return A3(
			$author$project$Analyser$Fixes$FileContent$replaceLines,
			_Utils_Tuple2(syntaxRange.E.z - 1, syntaxRange.bw.z - 1),
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
var $author$project$Analyser$Fixes$UnusedImportedVariable$fixer = A3($author$project$Analyser$Fixes$Base$Fixer, $author$project$Analyser$Checks$UnusedImportedVariable$checker.fR.fW, $author$project$Analyser$Fixes$UnusedImportedVariable$fix, 'Remove variable from from import list and format');
var $elm_community$maybe_extra$Maybe$Extra$orElseLazy = F2(
	function (fma, mb) {
		if (mb.$ === 1) {
			return fma(0);
		} else {
			return mb;
		}
	});
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
							l.e2));
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
							$stil4m$elm_syntax$Elm$Syntax$Node$value(func.fr).e4));
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
					cY: $author$project$ASTUtil$Inspector$Pre(onCase),
					cZ: $author$project$ASTUtil$Inspector$Pre(onDestructuring),
					c0: $author$project$ASTUtil$Inspector$Pre(onFunction),
					c5: $author$project$ASTUtil$Inspector$Pre(onLambda)
				}),
			file,
			$elm$core$Maybe$Nothing);
	});
var $stil4m$elm_syntax$Elm$Syntax$Pattern$AllPattern = {$: 0};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$AsPattern = F2(
	function (a, b) {
		return {$: 13, a: a, b: b};
	});
var $stil4m$elm_syntax$Elm$Syntax$Pattern$ListPattern = function (a) {
	return {$: 10, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$ParenthesizedPattern = function (a) {
	return {$: 14, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$RecordPattern = function (a) {
	return {$: 8, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$TuplePattern = function (a) {
	return {$: 7, a: a};
};
var $stil4m$elm_syntax$Elm$Syntax$Pattern$UnConsPattern = F2(
	function (a, b) {
		return {$: 9, a: a, b: b};
	});
var $stil4m$elm_syntax$Elm$Syntax$Pattern$VarPattern = function (a) {
	return {$: 11, a: a};
};
var $author$project$ASTUtil$PatternOptimizer$emptyRange = {
	bw: {M: 0, z: 0},
	E: {M: 0, z: 0}
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
var $elm$core$String$fromList = _String_fromList;
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
	var moduleName = _v0.aP;
	var name = _v0.f2;
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
var $author$project$Analyser$Fixes$UnusedPatternVariable$fixer = A3($author$project$Analyser$Fixes$Base$Fixer, $author$project$Analyser$Checks$UnusedPatternVariable$checker.fR.fW, $author$project$Analyser$Fixes$UnusedPatternVariable$fix, 'Optimize pattern and format');
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
				file.dM));
	});
var $stil4m$elm_syntax$Elm$Syntax$Range$Range = F2(
	function (start, end) {
		return {bw: end, E: start};
	});
var $author$project$Analyser$Fixes$UnusedTypeAlias$removeTypeAlias = F2(
	function (_v0, content) {
		var range = _v0.a;
		var typeAlias = _v0.b;
		var start = A2(
			$elm$core$Maybe$withDefault,
			range.E,
			A2(
				$elm$core$Maybe$map,
				A2(
					$elm$core$Basics$composeR,
					$stil4m$elm_syntax$Elm$Syntax$Node$range,
					function ($) {
						return $.E;
					}),
				typeAlias.fv));
		var end = range.bw;
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
var $author$project$Analyser$Fixes$UnusedTypeAlias$fixer = A3($author$project$Analyser$Fixes$Base$Fixer, $author$project$Analyser$Checks$UnusedTypeAlias$checker.fR.fW, $author$project$Analyser$Fixes$UnusedTypeAlias$fix, 'Remove type alias and format');
var $author$project$Analyser$Fixers$all = _List_fromArray(
	[$author$project$Analyser$Fixes$UnnecessaryParens$fixer, $author$project$Analyser$Fixes$UnusedImport$fixer, $author$project$Analyser$Fixes$UnusedImportedVariable$fixer, $author$project$Analyser$Fixes$UnusedImportAlias$fixer, $author$project$Analyser$Fixes$UnusedPatternVariable$fixer, $author$project$Analyser$Fixes$UnusedTypeAlias$fixer, $author$project$Analyser$Fixes$MultiLineRecordFormatting$fixer, $author$project$Analyser$Fixes$DropConsOfItemAndList$fixer, $author$project$Analyser$Fixes$DuplicateImport$fixer]);
var $author$project$Analyser$Fixers$getFixer = function (m) {
	return $elm$core$List$head(
		A2(
			$elm$core$List$filter,
			function (x) {
				return _Utils_eq(x.fc, m.gD);
			},
			$author$project$Analyser$Fixers$all));
};
var $author$project$Client$Components$ActiveMessageDialog$footer = F2(
	function (fixing, message) {
		return A2(
			$elm$core$Maybe$withDefault,
			A2(
				$elm$html$Html$i,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Fix has to be implemented. Pull requests are welcome.')
					])),
			A2(
				$elm$core$Maybe$map,
				$author$project$Client$Components$ActiveMessageDialog$fixableFooter(fixing),
				$author$project$Analyser$Fixers$getFixer(message)));
	});
var $author$project$Client$Components$ActiveMessageDialog$dialogConfig = function (state) {
	return {
		e7: $elm$core$Maybe$Just(
			$author$project$Client$Components$ActiveMessageDialog$dialogBody(state)),
		fi: $elm$core$Maybe$Just($author$project$Client$Components$ActiveMessageDialog$Close),
		fo: $elm$core$Maybe$Just('message-dialog'),
		fE: $elm$core$Maybe$Just(
			A2($author$project$Client$Components$ActiveMessageDialog$footer, state.bz, state.S)),
		fK: $elm$core$Maybe$Just(
			$author$project$Client$Components$ActiveMessageDialog$dialogHeader(state))
	};
};
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $alex_tan$elm_dialog$Dialog$isJust = function (m) {
	if (!m.$) {
		return true;
	} else {
		return false;
	}
};
var $alex_tan$elm_dialog$Dialog$backdrop = function (config) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'modal-backdrop in',
						$alex_tan$elm_dialog$Dialog$isJust(config))
					]))
			]),
		_List_Nil);
};
var $alex_tan$elm_dialog$Dialog$empty = A2($elm$html$Html$span, _List_Nil, _List_Nil);
var $alex_tan$elm_dialog$Dialog$maybe = F3(
	function (_default, f, value) {
		if (!value.$) {
			var value_ = value.a;
			return f(value_);
		} else {
			return _default;
		}
	});
var $alex_tan$elm_dialog$Dialog$wrapBody = function (body) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('modal-body')
			]),
		_List_fromArray(
			[body]));
};
var $alex_tan$elm_dialog$Dialog$wrapFooter = function (footer) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('modal-footer')
			]),
		_List_fromArray(
			[footer]));
};
var $alex_tan$elm_dialog$Dialog$closeButton = function (closeMessage) {
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('close'),
				$elm$html$Html$Events$onClick(closeMessage)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('x')
			]));
};
var $alex_tan$elm_dialog$Dialog$wrapHeader = F2(
	function (closeMessage, header) {
		return (_Utils_eq(closeMessage, $elm$core$Maybe$Nothing) && _Utils_eq(header, $elm$core$Maybe$Nothing)) ? $alex_tan$elm_dialog$Dialog$empty : A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('modal-header')
				]),
			_List_fromArray(
				[
					A3($alex_tan$elm_dialog$Dialog$maybe, $alex_tan$elm_dialog$Dialog$empty, $alex_tan$elm_dialog$Dialog$closeButton, closeMessage),
					A2($elm$core$Maybe$withDefault, $alex_tan$elm_dialog$Dialog$empty, header)
				]));
	});
var $alex_tan$elm_dialog$Dialog$view = function (maybeConfig) {
	var displayed = $alex_tan$elm_dialog$Dialog$isJust(maybeConfig);
	return A2(
		$elm$html$Html$div,
		function () {
			var _v0 = A2(
				$elm$core$Maybe$andThen,
				function ($) {
					return $.fo;
				},
				maybeConfig);
			if (_v0.$ === 1) {
				return _List_Nil;
			} else {
				var containerClass = _v0.a;
				return _List_fromArray(
					[
						$elm$html$Html$Attributes$class(containerClass)
					]);
			}
		}(),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('modal', true),
								_Utils_Tuple2('in', displayed)
							])),
						A2(
						$elm$html$Html$Attributes$style,
						'display',
						displayed ? 'block' : 'none')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('modal-dialog')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('modal-content')
									]),
								function () {
									if (maybeConfig.$ === 1) {
										return _List_fromArray(
											[$alex_tan$elm_dialog$Dialog$empty]);
									} else {
										var config = maybeConfig.a;
										return _List_fromArray(
											[
												A2($alex_tan$elm_dialog$Dialog$wrapHeader, config.fi, config.fK),
												A3($alex_tan$elm_dialog$Dialog$maybe, $alex_tan$elm_dialog$Dialog$empty, $alex_tan$elm_dialog$Dialog$wrapBody, config.e7),
												A3($alex_tan$elm_dialog$Dialog$maybe, $alex_tan$elm_dialog$Dialog$empty, $alex_tan$elm_dialog$Dialog$wrapFooter, config.fE)
											]);
									}
								}())
							]))
					])),
				$alex_tan$elm_dialog$Dialog$backdrop(maybeConfig)
			]));
};
var $author$project$Client$Components$ActiveMessageDialog$view = function (model) {
	return $alex_tan$elm_dialog$Dialog$view(
		A2($elm$core$Maybe$map, $author$project$Client$Components$ActiveMessageDialog$dialogConfig, model));
};
var $author$project$Analyser$Messages$Grouped$map = F2(
	function (f, _v0) {
		var mf = _v0.a;
		var gm = _v0.b;
		return A2(
			$elm$core$List$map,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Tuple$mapSecond(
					$elm$core$List$map(
						function (x) {
							return _Utils_Tuple2(
								mf(x),
								x);
						})),
				f),
			gm);
	});
var $elm$html$Html$h5 = _VirtualDom_node('h5');
var $author$project$Client$Messages$labelIndex = $elm$core$Dict$fromList(
	A2(
		$elm$core$List$map,
		function (k) {
			return _Utils_Tuple2(k.fR.fW, k.fR.f2);
		},
		$author$project$Analyser$Checks$all));
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$strong = _VirtualDom_node('strong');
var $author$project$Client$Messages$view = F4(
	function (tag, n, label, message) {
		return A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'margin', '10px'),
					A2($elm$html$Html$Attributes$style, 'padding', '10px'),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid #ccc'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '3px'),
					A2(
					$elm$html$Html$Attributes$style,
					'background',
					(message.gt === 2) ? '#dff0d8' : '#fafafa'),
					A2(
					$elm$html$Html$Attributes$style,
					'opacity',
					(!message.gt) ? '.5' : '1.0')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'table-row')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									tag(message)),
									$elm$html$Html$Attributes$href('#'),
									A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
									A2($elm$html$Html$Attributes$style, 'display', 'table-cell'),
									A2($elm$html$Html$Attributes$style, 'padding-right', '20px'),
									A2($elm$html$Html$Attributes$style, 'font-size', '200%'),
									A2($elm$html$Html$Attributes$style, 'vertical-align', 'middle')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$strong,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											'#' + $elm$core$String$fromInt(n + 1))
										]))
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'table-cell')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													A2(
														$elm$core$Maybe$withDefault,
														label,
														A2($elm$core$Dict$get, label, $author$project$Client$Messages$labelIndex)))
												]))
										])),
									$elm$html$Html$text(
									$author$project$Analyser$Messages$Data$description(message.fq))
								]))
						]))
				]));
	});
var $author$project$Client$Messages$renderGroup = F2(
	function (tag, _v0) {
		var title = _v0.a;
		var xs = _v0.b;
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h5,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(title)
						])),
					A2(
					$elm$html$Html$div,
					_List_Nil,
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (n, _v1) {
								var label = _v1.a;
								var message = _v1.b;
								return A4($author$project$Client$Messages$view, tag, n, label, message);
							}),
						xs))
				]));
	});
var $author$project$Client$Messages$viewAll = F2(
	function (tag, messages) {
		return A2(
			$elm$html$Html$ul,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'list-style', 'none'),
					A2($elm$html$Html$Attributes$style, 'padding', '0')
				]),
			A2(
				$author$project$Analyser$Messages$Grouped$map,
				$author$project$Client$Messages$renderGroup(tag),
				messages));
	});
var $author$project$Client$Components$MessageList$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				$author$project$Analyser$Messages$Grouped$isEmpty(model.o) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('alert alert-success')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('No messages')
					])) : A2($author$project$Client$Messages$viewAll, $author$project$Client$Components$MessageList$Focus, model.o),
				A2(
				$elm$html$Html$map,
				$author$project$Client$Components$MessageList$ActiveMessageDialogMsg,
				$author$project$Client$Components$ActiveMessageDialog$view(model.aa))
			]));
};
var $author$project$Client$Components$FileTree$view = function (m) {
	var asItem = function (_v2) {
		var fileName = _v2.a;
		var messages = _v2.b;
		return A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('list-group-item'),
					$elm$html$Html$Events$onClick(
					$author$project$Client$Components$FileTree$OnSelectFile(fileName)),
					$elm$html$Html$Attributes$href('#')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('badge')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(
								$elm$core$List$length(messages)))
						])),
					$elm$html$Html$text(fileName)
				]));
	};
	var allowFile = function (_v1) {
		var mess = _v1.b;
		return m.ai ? ($elm$core$List$length(mess) > 0) : true;
	};
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('checkbox')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('checkbox'),
										$elm$html$Html$Attributes$checked(m.ai),
										$elm$html$Html$Events$onClick($author$project$Client$Components$FileTree$ToggleHideGoodFiles)
									]),
								_List_Nil),
								$elm$html$Html$text('Only show files with messages')
							]))
					])),
				A2($elm$html$Html$hr, _List_Nil, _List_Nil),
				function () {
				var _v0 = m.aC;
				if (!_v0.$) {
					var fileIndex = _v0.a;
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('row'),
								A2($elm$html$Html$Attributes$style, 'padding-top', '10px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('col-md-6 col-sm-6')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('list-group')
											]),
										A2(
											$elm$core$List$map,
											asItem,
											A2($elm$core$List$filter, allowFile, fileIndex)))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('col-md-6 col-sm-6')
									]),
								_List_fromArray(
									[
										_Utils_eq(m.aU, $elm$core$Maybe$Nothing) ? A2($elm$html$Html$div, _List_Nil, _List_Nil) : A2(
										$elm$html$Html$map,
										$author$project$Client$Components$FileTree$MessageListMsg,
										$author$project$Client$Components$MessageList$view(m.T))
									]))
							]));
				} else {
					return A2($elm$html$Html$div, _List_Nil, _List_Nil);
				}
			}()
			]));
};
var $author$project$Client$LoadingScreen$viewRemoteData = F2(
	function (rd, f) {
		switch (rd.$) {
			case 1:
				return $elm$html$Html$text('Loading...');
			case 3:
				var state = rd.a;
				return f(state);
			case 2:
				return A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Something went wrong...')
						]));
			default:
				return A2($elm$html$Html$div, _List_Nil, _List_Nil);
		}
	});
var $author$project$Analyser$State$isBusy = function (s) {
	var _v0 = s.gt;
	switch (_v0) {
		case 2:
			return false;
		case 0:
			return true;
		default:
			return false;
	}
};
var $author$project$Client$LoadingScreen$viewState = F2(
	function (f, state) {
		return $author$project$Analyser$State$isBusy(state) ? $elm$html$Html$text('Loading...') : f(state);
	});
var $author$project$Client$LoadingScreen$viewStateFromRemoteData = F2(
	function (rd, f) {
		return A2(
			$author$project$Client$LoadingScreen$viewRemoteData,
			rd,
			$author$project$Client$LoadingScreen$viewState(f));
	});
var $author$project$Client$State$view = F2(
	function (s, f) {
		return A2($author$project$Client$LoadingScreen$viewStateFromRemoteData, s, f);
	});
var $author$project$Client$View$Widget$Default = 0;
var $author$project$Client$View$Widget$Error = 1;
var $author$project$Client$View$Widget$Success = 2;
var $author$project$Client$View$Widget$colorForCategory = function (category) {
	switch (category) {
		case 0:
			return 'primary';
		case 1:
			return 'red';
		case 2:
			return 'green';
		default:
			return 'yellow';
	}
};
var $author$project$Client$View$Widget$view = F4(
	function (category, title, icon, value) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('col-lg-6 col-md-6')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							'panel panel-' + $author$project$Client$View$Widget$colorForCategory(category))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('panel-heading')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('row')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('col-xs-3')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$i,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('fa fa-5x ' + icon)
														]),
													_List_Nil)
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('col-xs-9 text-right')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('huge')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(value)
														])),
													A2(
													$elm$html$Html$div,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text(title)
														]))
												]))
										]))
								]))
						]))
				]));
	});
var $author$project$Client$Dashboard$listValueWidget = F2(
	function (title, x) {
		var _v0 = $elm$core$List$isEmpty(x) ? _Utils_Tuple2(2, 'fa-check-circle-o') : _Utils_Tuple2(1, ' fa-times-circle-o');
		var t = _v0.a;
		var i = _v0.b;
		return A4(
			$author$project$Client$View$Widget$view,
			t,
			title,
			i,
			$elm$core$String$fromInt(
				$elm$core$List$length(x)));
	});
var $author$project$Client$Dashboard$viewState = function (state) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'padding-top', '20px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('col-md-12')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href(
										$author$project$Client$Routing$toUrl(4))
									]),
								_List_fromArray(
									[
										A4(
										$author$project$Client$View$Widget$view,
										0,
										'Modules',
										'fa-info-circle',
										$elm$core$String$fromInt(
											$elm$core$List$length(state.bP.b7)))
									])),
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href(
										$author$project$Client$Routing$toUrl(2))
									]),
								_List_fromArray(
									[
										A4(
										$author$project$Client$View$Widget$view,
										0,
										'Imports',
										'fa-info-circle',
										$elm$core$String$fromInt(
											$elm$core$List$length(state.bP.cL)))
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('col-md-12')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href(
										$author$project$Client$Routing$toUrl(3))
									]),
								_List_fromArray(
									[
										A2($author$project$Client$Dashboard$listValueWidget, 'Messages', state.o)
									])),
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href(
										$author$project$Client$Routing$toUrl(1))
									]),
								_List_fromArray(
									[
										A2($author$project$Client$Dashboard$listValueWidget, 'Unused dependencies', state.cL.ct)
									]))
							]))
					]))
			]));
};
var $author$project$Client$Dashboard$view = function (state) {
	return A2($author$project$Client$State$view, state, $author$project$Client$Dashboard$viewState);
};
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$tbody = _VirtualDom_node('tbody');
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
var $author$project$Client$DependenciesPage$depStatus = F2(
	function (unused, depInfo) {
		if (A2($elm$core$List$member, depInfo.cM.f2, unused)) {
			return A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'color', '#d9534f')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$i,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('fa fa-exclamation-circle')
							]),
						_List_Nil),
						$elm$html$Html$text(' Unused')
					]));
		} else {
			var _v0 = depInfo.dz;
			switch (_v0) {
				case 0:
					return A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', '#5cb85c')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$i,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('fa fa-check-circle')
									]),
								_List_Nil),
								$elm$html$Html$text(' Up to date')
							]));
				case 1:
					return A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', '#f0ad4e')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$i,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('fa fa-exclamation-circle')
									]),
								_List_Nil),
								$elm$html$Html$text(' New major')
							]));
				case 2:
					return A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', '#f0ad4e')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$i,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('fa fa-dot-circle-o')
									]),
								_List_Nil),
								$elm$html$Html$text(' Upgradable')
							]));
				default:
					return A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', '#5bc0de')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$i,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('fa fa-question-circle-o')
									]),
								_List_Nil),
								$elm$html$Html$text(' Unknown')
							]));
			}
		}
	});
var $author$project$Client$DependenciesPage$dependencyLink = F2(
	function (name, version) {
		return $elm$html$Html$Attributes$href('http://package.elm-lang.org/packages/' + (name + ('/' + version)));
	});
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
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $author$project$Client$DependenciesPage$viewDependency = F2(
	function (unusedDeps, depInfo) {
		var newerDependencies = function () {
			var _v0 = $author$project$Registry$Version$fromString(depInfo.cM.gH);
			if (_v0.$ === 1) {
				return _List_Nil;
			} else {
				var current = _v0.a;
				return A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					A2(
						$elm$core$Maybe$map,
						$elm$core$List$filter(
							function (v) {
								return !A2($author$project$Registry$Version$order, current, v);
							}),
						A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.gI;
							},
							depInfo.dg)));
			}
		}();
		return A2(
			$elm$html$Html$tr,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$td,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('col-md-3 col-sm-4')
						]),
					_List_fromArray(
						[
							A2($author$project$Client$DependenciesPage$depStatus, unusedDeps, depInfo)
						])),
					A2(
					$elm$html$Html$td,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('col-md-5 col-sm-6')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									A2($author$project$Client$DependenciesPage$dependencyLink, depInfo.cM.f2, depInfo.cM.gH),
									$elm$html$Html$Attributes$target('_blank')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(depInfo.cM.f2),
									$elm$html$Html$text('@'),
									$elm$html$Html$text(depInfo.cM.gH)
								]))
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$elm$core$List$isEmpty(newerDependencies) ? A2($elm$html$Html$span, _List_Nil, _List_Nil) : A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Newer dependencies:')
												]))
										])),
									A2(
									$elm$html$Html$ul,
									_List_Nil,
									A2(
										$elm$core$List$map,
										function (v) {
											return A2(
												$elm$html$Html$li,
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$elm$html$Html$a,
														_List_fromArray(
															[
																A2(
																$author$project$Client$DependenciesPage$dependencyLink,
																depInfo.cM.f2,
																$author$project$Registry$Version$asString(v)),
																$elm$html$Html$Attributes$target('_blank')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(
																$author$project$Registry$Version$asString(v))
															]))
													]));
										},
										newerDependencies))
								]))
						]))
				]));
	});
var $author$project$Client$DependenciesPage$viewState = function (state) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Project Dependencies')
					])),
				A2(
				$elm$html$Html$table,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('table table-condensed')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$tbody,
						_List_Nil,
						A2(
							$elm$core$List$map,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Tuple$second,
								$author$project$Client$DependenciesPage$viewDependency(state.cL.ct)),
							$elm$core$Dict$toList(state.cL.cC)))
					]))
			]));
};
var $author$project$Client$DependenciesPage$view = function (state) {
	return A2($author$project$Client$State$view, state, $author$project$Client$DependenciesPage$viewState);
};
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$virtual_dom$VirtualDom$lazy = _VirtualDom_lazy;
var $elm$html$Html$Lazy$lazy = $elm$virtual_dom$VirtualDom$lazy;
var $elm_community$graph$Graph$DOT$Styles = F4(
	function (rankdir, graph, node, edge) {
		return {dT: edge, fJ: graph, en: node, ez: rankdir};
	});
var $elm_community$graph$Graph$DOT$TB = 0;
var $elm_community$graph$Graph$DOT$defaultStyles = A4($elm_community$graph$Graph$DOT$Styles, 0, '', '', '');
var $elm_community$intdict$IntDict$foldr = F3(
	function (f, acc, dict) {
		foldr:
		while (true) {
			switch (dict.$) {
				case 0:
					return acc;
				case 1:
					var l = dict.a;
					return A3(f, l.fW, l.F, acc);
				default:
					var i = dict.a;
					var $temp$f = f,
						$temp$acc = A3($elm_community$intdict$IntDict$foldr, f, acc, i.gm),
						$temp$dict = i.fX;
					f = $temp$f;
					acc = $temp$acc;
					dict = $temp$dict;
					continue foldr;
			}
		}
	});
var $elm_community$intdict$IntDict$values = function (dict) {
	return A3(
		$elm_community$intdict$IntDict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $elm_community$graph$Graph$nodes = A2(
	$elm$core$Basics$composeR,
	$elm_community$graph$Graph$unGraph,
	A2(
		$elm$core$Basics$composeR,
		$elm_community$intdict$IntDict$values,
		$elm$core$List$map(
			function ($) {
				return $.en;
			})));
var $elm$core$List$sortWith = _List_sortWith;
var $elm_community$graph$Graph$DOT$outputWithStylesAndAttributes = F4(
	function (styles, nodeAttrs, edgeAttrs, graph) {
		var rankDirToString = function (r) {
			switch (r) {
				case 0:
					return 'TB';
				case 1:
					return 'LR';
				case 2:
					return 'BT';
				default:
					return 'RL';
			}
		};
		var nodes = $elm_community$graph$Graph$nodes(graph);
		var encode = A2(
			$elm$core$Basics$composeR,
			$elm$json$Json$Encode$string,
			$elm$json$Json$Encode$encode(0));
		var edges = function () {
			var compareEdge = F2(
				function (a, b) {
					var _v1 = A2($elm$core$Basics$compare, a.fF, b.fF);
					switch (_v1) {
						case 0:
							return 0;
						case 2:
							return 2;
						default:
							return A2($elm$core$Basics$compare, a.gB, b.gB);
					}
				});
			return A2(
				$elm$core$List$sortWith,
				compareEdge,
				$elm_community$graph$Graph$edges(graph));
		}();
		var attrAssocs = A2(
			$elm$core$Basics$composeR,
			$elm$core$Dict$toList,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$List$map(
					function (_v0) {
						var k = _v0.a;
						var v = _v0.b;
						return k + ('=' + encode(v));
					}),
				$elm$core$String$join(', ')));
		var makeAttrs = function (d) {
			return $elm$core$Dict$isEmpty(d) ? '' : (' [' + (attrAssocs(d) + ']'));
		};
		var edge = function (e) {
			return '  ' + ($elm$core$String$fromInt(e.fF) + (' -> ' + ($elm$core$String$fromInt(e.gB) + makeAttrs(
				edgeAttrs(e.ef)))));
		};
		var edgesString = A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$map, edge, edges));
		var node = function (n) {
			return '  ' + ($elm$core$String$fromInt(n.d5) + makeAttrs(
				nodeAttrs(n.ef)));
		};
		var nodesString = A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$map, node, nodes));
		return A2(
			$elm$core$String$join,
			'\n',
			_List_fromArray(
				[
					'digraph G {',
					'  rankdir=' + rankDirToString(styles.ez),
					'  graph [' + (styles.fJ + ']'),
					'  node [' + (styles.en + ']'),
					'  edge [' + (styles.dT + ']'),
					'',
					edgesString,
					'',
					nodesString,
					'}'
				]));
	});
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $elm_community$graph$Graph$DOT$outputWithStyles = F4(
	function (styles, mapNode, mapEdge, graph) {
		var labelOnly = function (maybeLabel) {
			if (maybeLabel.$ === 1) {
				return $elm$core$Dict$empty;
			} else {
				var l = maybeLabel.a;
				return A2($elm$core$Dict$singleton, 'label', l);
			}
		};
		return A4(
			$elm_community$graph$Graph$DOT$outputWithStylesAndAttributes,
			styles,
			A2($elm$core$Basics$composeL, labelOnly, mapNode),
			A2($elm$core$Basics$composeL, labelOnly, mapEdge),
			graph);
	});
var $elm_community$graph$Graph$DOT$output = $elm_community$graph$Graph$DOT$outputWithStyles($elm_community$graph$Graph$DOT$defaultStyles);
var $elm_community$graph$Graph$empty = $elm_community$intdict$IntDict$empty;
var $elm_community$graph$Graph$isEmpty = function (graph) {
	return _Utils_eq(graph, $elm_community$graph$Graph$empty);
};
var $author$project$Client$View$Panel$WidthHalf = 1;
var $author$project$Client$View$Panel$Documentation = function (a) {
	return {$: 0, a: a};
};
var $author$project$Client$View$Panel$documentationButton = function (path) {
	return $author$project$Client$View$Panel$Documentation('https://stil4m.github.io/elm-analyse/#features/' + path);
};
var $elm$html$Html$th = _VirtualDom_node('th');
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $author$project$Client$Graph$Table$topList = function (nodeContexts) {
	return A2(
		$elm$html$Html$table,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('table')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$thead,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$tr,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$th,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Module')
									])),
								A2(
								$elm$html$Html$th,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Imported by')
									])),
								A2(
								$elm$html$Html$th,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Importing')
									]))
							]))
					])),
				A2(
				$elm$html$Html$tbody,
				_List_Nil,
				A2(
					$elm$core$List$map,
					function (nodeContext) {
						return A2(
							$elm$html$Html$tr,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$td,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(nodeContext.en.ef.eT)
										])),
									A2(
									$elm$html$Html$td,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											$elm$core$String$fromInt(
												$elm_community$intdict$IntDict$size(nodeContext.d7)))
										])),
									A2(
									$elm$html$Html$td,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											$elm$core$String$fromInt(
												$elm_community$intdict$IntDict$size(nodeContext.eq)))
										]))
								]));
					},
					nodeContexts))
			]));
};
var $author$project$Client$View$Panel$classForWidth = function (panelWidth) {
	if (!panelWidth) {
		return $elm$html$Html$Attributes$class('col-lg-12');
	} else {
		return $elm$html$Html$Attributes$class('col-lg-6');
	}
};
var $author$project$Client$View$Panel$headerButton = function (button) {
	if (!button.$) {
		var href = button.a;
		return A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$href(href),
					A2($elm$html$Html$Attributes$style, 'float', 'right')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$i,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('fa fa-book')
						]),
					_List_Nil)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$Client$View$Panel$panelFooter = function (maybeContent) {
	if (!maybeContent.$) {
		var content = maybeContent.a;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('panel-footer')
				]),
			_List_fromArray(
				[content]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$Client$View$Panel$viewWithFooter = F5(
	function (panelWidth, title, button, content, maybeFooter) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$author$project$Client$View$Panel$classForWidth(panelWidth)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('panel panel-default')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('panel-heading')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(title),
									$author$project$Client$View$Panel$headerButton(button)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('panel-body')
								]),
							_List_fromArray(
								[content])),
							$author$project$Client$View$Panel$panelFooter(maybeFooter)
						]))
				]));
	});
var $author$project$Client$View$Panel$view = F4(
	function (panelWidth, title, button, content) {
		return A5($author$project$Client$View$Panel$viewWithFooter, panelWidth, title, button, content, $elm$core$Maybe$Nothing);
	});
var $author$project$Client$Graph$Table$topListInAndOut = F2(
	function (count, graph) {
		var nodeContexts = A2(
			$elm$core$List$filterMap,
			function (x) {
				return A2($elm_community$graph$Graph$get, x.d5, graph);
			},
			$elm_community$graph$Graph$nodes(graph));
		var topImportees = A2(
			$elm$core$List$sortBy,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.d7;
				},
				A2(
					$elm$core$Basics$composeR,
					$elm_community$intdict$IntDict$size,
					$elm$core$Basics$mul(-1))),
			nodeContexts);
		var topImporters = A2(
			$elm$core$List$sortBy,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.eq;
				},
				A2(
					$elm$core$Basics$composeR,
					$elm_community$intdict$IntDict$size,
					$elm$core$Basics$mul(-1))),
			nodeContexts);
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A4(
					$author$project$Client$View$Panel$view,
					1,
					'Top importees',
					$author$project$Client$View$Panel$documentationButton('top-importees'),
					$author$project$Client$Graph$Table$topList(
						A2($elm$core$List$take, count, topImportees))),
					A4(
					$author$project$Client$View$Panel$view,
					1,
					'Top importers',
					$author$project$Client$View$Panel$documentationButton('top-importers'),
					$author$project$Client$Graph$Table$topList(
						A2($elm$core$List$take, count, topImporters)))
				]));
	});
var $author$project$Client$Graph$Table$view = F2(
	function (count, graph) {
		return $elm_community$graph$Graph$isEmpty(graph) ? $elm$html$Html$text('') : A2($author$project$Client$Graph$Table$topListInAndOut, count, graph);
	});
var $author$project$Client$Graph$Widgets$countImports = function (edges) {
	return A4(
		$author$project$Client$View$Widget$view,
		2,
		'Total imports',
		'fa-arrow-circle-o-down',
		$elm$core$String$fromInt(
			$elm$core$List$length(edges)));
};
var $author$project$Client$Graph$Widgets$countModules = function (nodes) {
	return A4(
		$author$project$Client$View$Widget$view,
		2,
		'Total modules',
		'fa-cube',
		$elm$core$String$fromInt(
			$elm$core$List$length(nodes)));
};
var $author$project$Client$Graph$Graph$widgets = function (graph) {
	return _List_fromArray(
		[
			$author$project$Client$Graph$Widgets$countModules(
			$elm_community$graph$Graph$nodes(graph)),
			$author$project$Client$Graph$Widgets$countImports(
			$elm_community$graph$Graph$edges(graph))
		]);
};
var $author$project$Client$Graph$Graph$view = F2(
	function (s, _v0) {
		var g = _v0;
		return A2(
			$author$project$Client$State$view,
			s,
			function (_v1) {
				if (g.$ === 1) {
					return A2($elm$html$Html$div, _List_Nil, _List_Nil);
				} else {
					var graph = g.a;
					return A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h3,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Modules')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row')
									]),
								$author$project$Client$Graph$Graph$widgets(graph)),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$Lazy$lazy,
										$author$project$Client$Graph$Table$view(20),
										graph)
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$h2,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('DOT file')
											])),
										A2(
										$elm$html$Html$pre,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(
												A3(
													$elm_community$graph$Graph$DOT$output,
													A2(
														$elm$core$Basics$composeL,
														$elm$core$Maybe$Just,
														function ($) {
															return $.eT;
														}),
													A2(
														$elm$core$Basics$composeL,
														$elm$core$Maybe$Just,
														function ($) {
															return $.eT;
														}),
													graph))
											]))
									]))
							]));
				}
			});
	});
var $author$project$Client$Graph$PackageDependencies$packageNameHtml = function (input) {
	if (input === '') {
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'color', '#999')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('<<root>>')
				]));
	} else {
		return $elm$html$Html$text(input);
	}
};
var $author$project$Client$Graph$PackageDependencies$headerNameTd = function (x) {
	var height = 200;
	return A2(
		$elm$html$Html$th,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$Attributes$style,
				'height',
				$elm$core$String$fromInt(height) + 'px'),
				A2($elm$html$Html$Attributes$style, 'text-align', 'left'),
				A2($elm$html$Html$Attributes$style, 'whitespace', 'nowrap'),
				A2($elm$html$Html$Attributes$style, 'width', '30px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$Attributes$style,
						'transform',
						'rotate(-90deg) translate(' + ($elm$core$String$fromInt((-height) + 40) + 'px, 0px)')),
						A2($elm$html$Html$Attributes$style, 'width', '30px')
					]),
				_List_fromArray(
					[
						$author$project$Client$Graph$PackageDependencies$packageNameHtml(x)
					]))
			]));
};
var $author$project$Client$Graph$PackageDependencies$interPackageRelationTable = F2(
	function (_v0, rels) {
		var from = _v0.a;
		var to = _v0.b;
		return A2(
			$elm$html$Html$table,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('table')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$thead,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$tr,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$th,
									_List_Nil,
									_List_fromArray(
										[
											$author$project$Client$Graph$PackageDependencies$packageNameHtml(from),
											$elm$html$Html$text(' -> '),
											$author$project$Client$Graph$PackageDependencies$packageNameHtml(to)
										]))
								]))
						])),
					A2(
					$elm$html$Html$tbody,
					_List_Nil,
					function () {
						if (!rels.b) {
							return _List_fromArray(
								[
									A2(
									$elm$html$Html$tr,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$td,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$i,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'color', '#777')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('No dependencies')
														]))
												]))
										]))
								]);
						} else {
							return A2(
								$elm$core$List$map,
								function (x) {
									return A2(
										$elm$html$Html$tr,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$td,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text(x)
													]))
											]));
								},
								A2(
									$elm$core$List$map,
									function (_v2) {
										var a = _v2.a;
										var b = _v2.b;
										return a + (' -> ' + b);
									},
									rels));
						}
					}())
				]));
	});
var $author$project$Client$Graph$PackageDependencies$interPackageRelationsTable = F2(
	function (relations, _v0) {
		var from = _v0.a;
		var to = _v0.b;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('row')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('col-md-6')
						]),
					_List_fromArray(
						[
							A2(
							$author$project$Client$Graph$PackageDependencies$interPackageRelationTable,
							_Utils_Tuple2(from, to),
							A2(
								$elm$core$Maybe$withDefault,
								_List_Nil,
								A2(
									$elm$core$Dict$get,
									_Utils_Tuple2(from, to),
									relations)))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('col-md-6')
						]),
					_List_fromArray(
						[
							A2(
							$author$project$Client$Graph$PackageDependencies$interPackageRelationTable,
							_Utils_Tuple2(to, from),
							A2(
								$elm$core$Maybe$withDefault,
								_List_Nil,
								A2(
									$elm$core$Dict$get,
									_Utils_Tuple2(to, from),
									relations)))
						]))
				]));
	});
var $author$project$Client$Graph$PackageDependencies$asNameTd = function (x) {
	return A2(
		$elm$html$Html$th,
		_List_Nil,
		_List_fromArray(
			[
				$author$project$Client$Graph$PackageDependencies$packageNameHtml(x)
			]));
};
var $author$project$Client$Graph$PackageDependencies$Select = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Client$Graph$PackageDependencies$packageContentTd = F4(
	function (from, to, relations, selected) {
		if (_Utils_eq(from, to)) {
			return A2(
				$elm$html$Html$td,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'background', 'black')
					]),
				_List_Nil);
		} else {
			var styleClass = (_Utils_eq(
				selected,
				$elm$core$Maybe$Just(
					_Utils_Tuple2(from, to))) || _Utils_eq(
				selected,
				$elm$core$Maybe$Just(
					_Utils_Tuple2(to, from)))) ? 'info' : ((A2(
				$elm$core$Dict$member,
				_Utils_Tuple2(from, to),
				relations) && A2(
				$elm$core$Dict$member,
				_Utils_Tuple2(to, from),
				relations)) ? 'danger' : '');
			return A2(
				$elm$html$Html$td,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(styleClass),
						A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
						$elm$html$Html$Events$onClick(
						A2($author$project$Client$Graph$PackageDependencies$Select, from, to))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						A2(
							$elm$core$Maybe$withDefault,
							'',
							A2(
								$elm$core$Maybe$map,
								A2($elm$core$Basics$composeR, $elm$core$List$length, $elm$core$String$fromInt),
								A2(
									$elm$core$Dict$get,
									_Utils_Tuple2(from, to),
									relations))))
					]));
		}
	});
var $author$project$Client$Graph$PackageDependencies$packageCycleRow = F4(
	function (name, names, relations, selected) {
		return A2(
			$elm$html$Html$tr,
			_List_Nil,
			A2(
				$elm$core$List$cons,
				$author$project$Client$Graph$PackageDependencies$asNameTd(name),
				A2(
					$elm$core$List$map,
					function (other) {
						return A4($author$project$Client$Graph$PackageDependencies$packageContentTd, name, other, relations, selected);
					},
					names)));
	});
var $author$project$Client$Graph$PackageDependencies$view = function (model) {
	return A2(
		$author$project$Client$LoadingScreen$viewRemoteData,
		model,
		function (_v0) {
			var names = _v0.el;
			var relations = _v0.eA;
			var selected = _v0.dp;
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$table,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('table table-condensed')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$tbody,
								_List_Nil,
								A2(
									$elm$core$List$cons,
									A2(
										$elm$html$Html$tr,
										_List_Nil,
										A2(
											$elm$core$List$cons,
											A2($elm$html$Html$td, _List_Nil, _List_Nil),
											A2($elm$core$List$map, $author$project$Client$Graph$PackageDependencies$headerNameTd, names))),
									A2(
										$elm$core$List$map,
										function (x) {
											return A4($author$project$Client$Graph$PackageDependencies$packageCycleRow, x, names, relations, selected);
										},
										names)))
							])),
						A2(
						$elm$core$Maybe$withDefault,
						A2($elm$html$Html$div, _List_Nil, _List_Nil),
						A2(
							$elm$core$Maybe$map,
							$author$project$Client$Graph$PackageDependencies$interPackageRelationsTable(relations),
							selected))
					]));
		});
};
var $author$project$Client$MessagesPage$GroupBy = function (a) {
	return {$: 1, a: a};
};
var $author$project$Client$MessagesPage$GroupByType = 1;
var $author$project$Client$MessagesPage$view = F2(
	function (state, m) {
		return A2(
			$author$project$Client$LoadingScreen$viewStateFromRemoteData,
			state,
			function (_v0) {
				return A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('clearfix')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h3,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('pull-left')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Messages')
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('btn-group pull-right margin-top')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$type_('button'),
													$elm$html$Html$Attributes$class('btn btn-default'),
													$elm$html$Html$Attributes$classList(
													_List_fromArray(
														[
															_Utils_Tuple2('active', !m.ap)
														])),
													$elm$html$Html$Events$onClick(
													$author$project$Client$MessagesPage$GroupBy(0))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Group by file')
												])),
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$type_('button'),
													$elm$html$Html$Attributes$class('btn btn-default'),
													$elm$html$Html$Attributes$classList(
													_List_fromArray(
														[
															_Utils_Tuple2('active', m.ap === 1)
														])),
													$elm$html$Html$Events$onClick(
													$author$project$Client$MessagesPage$GroupBy(1))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Group by type')
												]))
										]))
								])),
							A2(
							$elm$html$Html$map,
							$author$project$Client$MessagesPage$MessageListMsg,
							$author$project$Client$Components$MessageList$view(m.T))
						]));
			});
	});
var $author$project$Client$App$App$viewInner = function (m) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				$author$project$Client$App$Menu$view(m.y),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('page-wrapper'),
						A2($elm$html$Html$Attributes$style, 'overflow', 'auto')
					]),
				_List_fromArray(
					[
						function () {
						var _v0 = m.cJ;
						switch (_v0.$) {
							case 0:
								var subModel = _v0.a;
								return A2(
									$elm$html$Html$map,
									$author$project$Client$App$App$MessagesPageMsg,
									A2($author$project$Client$MessagesPage$view, m.x, subModel));
							case 4:
								var subModel = _v0.a;
								return A2($author$project$Client$Graph$Graph$view, m.x, subModel);
							case 3:
								var subModel = _v0.a;
								return A2(
									$elm$html$Html$map,
									$author$project$Client$App$App$FileTreeMsg,
									$author$project$Client$Components$FileTree$view(subModel));
							case 5:
								var subModel = _v0.a;
								return A2(
									$elm$html$Html$map,
									$author$project$Client$App$App$PackageDependenciesMsg,
									$author$project$Client$Graph$PackageDependencies$view(subModel));
							case 1:
								return $author$project$Client$Dashboard$view(m.x);
							case 2:
								return $author$project$Client$DependenciesPage$view(m.x);
							default:
								return A2(
									$elm$html$Html$h3,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Not Found')
										]));
						}
					}()
					]))
			]));
};
var $author$project$Client$App$App$view = function (model) {
	return {
		e7: _List_fromArray(
			[
				$author$project$Client$App$App$viewInner(model)
			]),
		gA: 'Elm Analyse'
	};
};
var $author$project$Client$App$App$main = $elm$browser$Browser$application(
	{fS: $author$project$Client$App$App$init, gc: $author$project$Client$App$App$OnUrlChange, gd: $author$project$Client$App$App$OnUrlRequest, gv: $author$project$Client$App$App$subscriptions, gF: $author$project$Client$App$App$update, gJ: $author$project$Client$App$App$view});
var $author$project$Client$main = $author$project$Client$App$App$main;
_Platform_export({'Client':{'init':$author$project$Client$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));