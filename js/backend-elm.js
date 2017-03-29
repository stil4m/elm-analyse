
(function() {
'use strict';

function F2(fun)
{
  function wrapper(a) { return function(b) { return fun(a,b); }; }
  wrapper.arity = 2;
  wrapper.func = fun;
  return wrapper;
}

function F3(fun)
{
  function wrapper(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  }
  wrapper.arity = 3;
  wrapper.func = fun;
  return wrapper;
}

function F4(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  }
  wrapper.arity = 4;
  wrapper.func = fun;
  return wrapper;
}

function F5(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  }
  wrapper.arity = 5;
  wrapper.func = fun;
  return wrapper;
}

function F6(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  }
  wrapper.arity = 6;
  wrapper.func = fun;
  return wrapper;
}

function F7(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  }
  wrapper.arity = 7;
  wrapper.func = fun;
  return wrapper;
}

function F8(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  }
  wrapper.arity = 8;
  wrapper.func = fun;
  return wrapper;
}

function F9(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  }
  wrapper.arity = 9;
  wrapper.func = fun;
  return wrapper;
}

function A2(fun, a, b)
{
  return fun.arity === 2
    ? fun.func(a, b)
    : fun(a)(b);
}
function A3(fun, a, b, c)
{
  return fun.arity === 3
    ? fun.func(a, b, c)
    : fun(a)(b)(c);
}
function A4(fun, a, b, c, d)
{
  return fun.arity === 4
    ? fun.func(a, b, c, d)
    : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e)
{
  return fun.arity === 5
    ? fun.func(a, b, c, d, e)
    : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f)
{
  return fun.arity === 6
    ? fun.func(a, b, c, d, e, f)
    : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g)
{
  return fun.arity === 7
    ? fun.func(a, b, c, d, e, f, g)
    : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h)
{
  return fun.arity === 8
    ? fun.func(a, b, c, d, e, f, g, h)
    : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i)
{
  return fun.arity === 9
    ? fun.func(a, b, c, d, e, f, g, h, i)
    : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

//import Native.Utils //

var _elm_lang$core$Native_Basics = function() {

function div(a, b)
{
	return (a / b) | 0;
}
function rem(a, b)
{
	return a % b;
}
function mod(a, b)
{
	if (b === 0)
	{
		throw new Error('Cannot perform mod 0. Division by zero error.');
	}
	var r = a % b;
	var m = a === 0 ? 0 : (b > 0 ? (a >= 0 ? r : r + b) : -mod(-a, -b));

	return m === b ? 0 : m;
}
function logBase(base, n)
{
	return Math.log(n) / Math.log(base);
}
function negate(n)
{
	return -n;
}
function abs(n)
{
	return n < 0 ? -n : n;
}

function min(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) < 0 ? a : b;
}
function max(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) > 0 ? a : b;
}
function clamp(lo, hi, n)
{
	return _elm_lang$core$Native_Utils.cmp(n, lo) < 0
		? lo
		: _elm_lang$core$Native_Utils.cmp(n, hi) > 0
			? hi
			: n;
}

var ord = ['LT', 'EQ', 'GT'];

function compare(x, y)
{
	return { ctor: ord[_elm_lang$core$Native_Utils.cmp(x, y) + 1] };
}

function xor(a, b)
{
	return a !== b;
}
function not(b)
{
	return !b;
}
function isInfinite(n)
{
	return n === Infinity || n === -Infinity;
}

function truncate(n)
{
	return n | 0;
}

function degrees(d)
{
	return d * Math.PI / 180;
}
function turns(t)
{
	return 2 * Math.PI * t;
}
function fromPolar(point)
{
	var r = point._0;
	var t = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(r * Math.cos(t), r * Math.sin(t));
}
function toPolar(point)
{
	var x = point._0;
	var y = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(Math.sqrt(x * x + y * y), Math.atan2(y, x));
}

return {
	div: F2(div),
	rem: F2(rem),
	mod: F2(mod),

	pi: Math.PI,
	e: Math.E,
	cos: Math.cos,
	sin: Math.sin,
	tan: Math.tan,
	acos: Math.acos,
	asin: Math.asin,
	atan: Math.atan,
	atan2: F2(Math.atan2),

	degrees: degrees,
	turns: turns,
	fromPolar: fromPolar,
	toPolar: toPolar,

	sqrt: Math.sqrt,
	logBase: F2(logBase),
	negate: negate,
	abs: abs,
	min: F2(min),
	max: F2(max),
	clamp: F3(clamp),
	compare: F2(compare),

	xor: F2(xor),
	not: not,

	truncate: truncate,
	ceiling: Math.ceil,
	floor: Math.floor,
	round: Math.round,
	toFloat: function(x) { return x; },
	isNaN: isNaN,
	isInfinite: isInfinite
};

}();
//import //

var _elm_lang$core$Native_Utils = function() {

// COMPARISONS

function eq(x, y)
{
	var stack = [];
	var isEqual = eqHelp(x, y, 0, stack);
	var pair;
	while (isEqual && (pair = stack.pop()))
	{
		isEqual = eqHelp(pair.x, pair.y, 0, stack);
	}
	return isEqual;
}


function eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push({ x: x, y: y });
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object')
	{
		if (typeof x === 'function')
		{
			throw new Error(
				'Trying to use `(==)` on functions. There is no way to know if functions are "the same" in the Elm sense.'
				+ ' Read more about this at http://package.elm-lang.org/packages/elm-lang/core/latest/Basics#=='
				+ ' which describes why it is this way and what the better version will look like.'
			);
		}
		return false;
	}

	if (x === null || y === null)
	{
		return false
	}

	if (x instanceof Date)
	{
		return x.getTime() === y.getTime();
	}

	if (!('ctor' in x))
	{
		for (var key in x)
		{
			if (!eqHelp(x[key], y[key], depth + 1, stack))
			{
				return false;
			}
		}
		return true;
	}

	// convert Dicts and Sets to lists
	if (x.ctor === 'RBNode_elm_builtin' || x.ctor === 'RBEmpty_elm_builtin')
	{
		x = _elm_lang$core$Dict$toList(x);
		y = _elm_lang$core$Dict$toList(y);
	}
	if (x.ctor === 'Set_elm_builtin')
	{
		x = _elm_lang$core$Set$toList(x);
		y = _elm_lang$core$Set$toList(y);
	}

	// check if lists are equal without recursion
	if (x.ctor === '::')
	{
		var a = x;
		var b = y;
		while (a.ctor === '::' && b.ctor === '::')
		{
			if (!eqHelp(a._0, b._0, depth + 1, stack))
			{
				return false;
			}
			a = a._1;
			b = b._1;
		}
		return a.ctor === b.ctor;
	}

	// check if Arrays are equal
	if (x.ctor === '_Array')
	{
		var xs = _elm_lang$core$Native_Array.toJSArray(x);
		var ys = _elm_lang$core$Native_Array.toJSArray(y);
		if (xs.length !== ys.length)
		{
			return false;
		}
		for (var i = 0; i < xs.length; i++)
		{
			if (!eqHelp(xs[i], ys[i], depth + 1, stack))
			{
				return false;
			}
		}
		return true;
	}

	if (!eqHelp(x.ctor, y.ctor, depth + 1, stack))
	{
		return false;
	}

	for (var key in x)
	{
		if (!eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

var LT = -1, EQ = 0, GT = 1;

function cmp(x, y)
{
	if (typeof x !== 'object')
	{
		return x === y ? EQ : x < y ? LT : GT;
	}

	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? EQ : a < b ? LT : GT;
	}

	if (x.ctor === '::' || x.ctor === '[]')
	{
		while (x.ctor === '::' && y.ctor === '::')
		{
			var ord = cmp(x._0, y._0);
			if (ord !== EQ)
			{
				return ord;
			}
			x = x._1;
			y = y._1;
		}
		return x.ctor === y.ctor ? EQ : x.ctor === '[]' ? LT : GT;
	}

	if (x.ctor.slice(0, 6) === '_Tuple')
	{
		var ord;
		var n = x.ctor.slice(6) - 0;
		var err = 'cannot compare tuples with more than 6 elements.';
		if (n === 0) return EQ;
		if (n >= 1) { ord = cmp(x._0, y._0); if (ord !== EQ) return ord;
		if (n >= 2) { ord = cmp(x._1, y._1); if (ord !== EQ) return ord;
		if (n >= 3) { ord = cmp(x._2, y._2); if (ord !== EQ) return ord;
		if (n >= 4) { ord = cmp(x._3, y._3); if (ord !== EQ) return ord;
		if (n >= 5) { ord = cmp(x._4, y._4); if (ord !== EQ) return ord;
		if (n >= 6) { ord = cmp(x._5, y._5); if (ord !== EQ) return ord;
		if (n >= 7) throw new Error('Comparison error: ' + err); } } } } } }
		return EQ;
	}

	throw new Error(
		'Comparison error: comparison is only defined on ints, '
		+ 'floats, times, chars, strings, lists of comparable values, '
		+ 'and tuples of comparable values.'
	);
}


// COMMON VALUES

var Tuple0 = {
	ctor: '_Tuple0'
};

function Tuple2(x, y)
{
	return {
		ctor: '_Tuple2',
		_0: x,
		_1: y
	};
}

function chr(c)
{
	return new String(c);
}


// GUID

var count = 0;
function guid(_)
{
	return count++;
}


// RECORDS

function update(oldRecord, updatedFields)
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


//// LIST STUFF ////

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return {
		ctor: '::',
		_0: hd,
		_1: tl
	};
}

function append(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (xs.ctor === '[]')
	{
		return ys;
	}
	var root = Cons(xs._0, Nil);
	var curr = root;
	xs = xs._1;
	while (xs.ctor !== '[]')
	{
		curr._1 = Cons(xs._0, Nil);
		xs = xs._1;
		curr = curr._1;
	}
	curr._1 = ys;
	return root;
}


// CRASHES

function crash(moduleName, region)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '` ' + regionToString(region) + '\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function crashCase(moduleName, region, value)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '`\n\n'
			+ 'This was caused by the `case` expression ' + regionToString(region) + '.\n'
			+ 'One of the branches ended with a crash and the following value got through:\n\n    ' + toString(value) + '\n\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function regionToString(region)
{
	if (region.start.line == region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'between lines ' + region.start.line + ' and ' + region.end.line;
}


// TO STRING

function toString(v)
{
	var type = typeof v;
	if (type === 'function')
	{
		return '<function>';
	}

	if (type === 'boolean')
	{
		return v ? 'True' : 'False';
	}

	if (type === 'number')
	{
		return v + '';
	}

	if (v instanceof String)
	{
		return '\'' + addSlashes(v, true) + '\'';
	}

	if (type === 'string')
	{
		return '"' + addSlashes(v, false) + '"';
	}

	if (v === null)
	{
		return 'null';
	}

	if (type === 'object' && 'ctor' in v)
	{
		var ctorStarter = v.ctor.substring(0, 5);

		if (ctorStarter === '_Tupl')
		{
			var output = [];
			for (var k in v)
			{
				if (k === 'ctor') continue;
				output.push(toString(v[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (ctorStarter === '_Task')
		{
			return '<task>'
		}

		if (v.ctor === '_Array')
		{
			var list = _elm_lang$core$Array$toList(v);
			return 'Array.fromList ' + toString(list);
		}

		if (v.ctor === '<decoder>')
		{
			return '<decoder>';
		}

		if (v.ctor === '_Process')
		{
			return '<process:' + v.id + '>';
		}

		if (v.ctor === '::')
		{
			var output = '[' + toString(v._0);
			v = v._1;
			while (v.ctor === '::')
			{
				output += ',' + toString(v._0);
				v = v._1;
			}
			return output + ']';
		}

		if (v.ctor === '[]')
		{
			return '[]';
		}

		if (v.ctor === 'Set_elm_builtin')
		{
			return 'Set.fromList ' + toString(_elm_lang$core$Set$toList(v));
		}

		if (v.ctor === 'RBNode_elm_builtin' || v.ctor === 'RBEmpty_elm_builtin')
		{
			return 'Dict.fromList ' + toString(_elm_lang$core$Dict$toList(v));
		}

		var output = '';
		for (var i in v)
		{
			if (i === 'ctor') continue;
			var str = toString(v[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return v.ctor + output;
	}

	if (type === 'object')
	{
		if (v instanceof Date)
		{
			return '<' + v.toString() + '>';
		}

		if (v.elm_web_socket)
		{
			return '<websocket>';
		}

		var output = [];
		for (var k in v)
		{
			output.push(k + ' = ' + toString(v[k]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return '<internal structure>';
}

function addSlashes(str, isChar)
{
	var s = str.replace(/\\/g, '\\\\')
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


return {
	eq: eq,
	cmp: cmp,
	Tuple0: Tuple0,
	Tuple2: Tuple2,
	chr: chr,
	update: update,
	guid: guid,

	append: F2(append),

	crash: crash,
	crashCase: crashCase,

	toString: toString
};

}();
var _elm_lang$core$Basics$never = function (_p0) {
	never:
	while (true) {
		var _p1 = _p0;
		var _v1 = _p1._0;
		_p0 = _v1;
		continue never;
	}
};
var _elm_lang$core$Basics$uncurry = F2(
	function (f, _p2) {
		var _p3 = _p2;
		return A2(f, _p3._0, _p3._1);
	});
var _elm_lang$core$Basics$curry = F3(
	function (f, a, b) {
		return f(
			{ctor: '_Tuple2', _0: a, _1: b});
	});
var _elm_lang$core$Basics$flip = F3(
	function (f, b, a) {
		return A2(f, a, b);
	});
var _elm_lang$core$Basics$always = F2(
	function (a, _p4) {
		return a;
	});
var _elm_lang$core$Basics$identity = function (x) {
	return x;
};
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<|'] = F2(
	function (f, x) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['|>'] = F2(
	function (x, f) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>>'] = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<<'] = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['++'] = _elm_lang$core$Native_Utils.append;
var _elm_lang$core$Basics$toString = _elm_lang$core$Native_Utils.toString;
var _elm_lang$core$Basics$isInfinite = _elm_lang$core$Native_Basics.isInfinite;
var _elm_lang$core$Basics$isNaN = _elm_lang$core$Native_Basics.isNaN;
var _elm_lang$core$Basics$toFloat = _elm_lang$core$Native_Basics.toFloat;
var _elm_lang$core$Basics$ceiling = _elm_lang$core$Native_Basics.ceiling;
var _elm_lang$core$Basics$floor = _elm_lang$core$Native_Basics.floor;
var _elm_lang$core$Basics$truncate = _elm_lang$core$Native_Basics.truncate;
var _elm_lang$core$Basics$round = _elm_lang$core$Native_Basics.round;
var _elm_lang$core$Basics$not = _elm_lang$core$Native_Basics.not;
var _elm_lang$core$Basics$xor = _elm_lang$core$Native_Basics.xor;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['||'] = _elm_lang$core$Native_Basics.or;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['&&'] = _elm_lang$core$Native_Basics.and;
var _elm_lang$core$Basics$max = _elm_lang$core$Native_Basics.max;
var _elm_lang$core$Basics$min = _elm_lang$core$Native_Basics.min;
var _elm_lang$core$Basics$compare = _elm_lang$core$Native_Basics.compare;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>='] = _elm_lang$core$Native_Basics.ge;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<='] = _elm_lang$core$Native_Basics.le;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>'] = _elm_lang$core$Native_Basics.gt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<'] = _elm_lang$core$Native_Basics.lt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/='] = _elm_lang$core$Native_Basics.neq;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['=='] = _elm_lang$core$Native_Basics.eq;
var _elm_lang$core$Basics$e = _elm_lang$core$Native_Basics.e;
var _elm_lang$core$Basics$pi = _elm_lang$core$Native_Basics.pi;
var _elm_lang$core$Basics$clamp = _elm_lang$core$Native_Basics.clamp;
var _elm_lang$core$Basics$logBase = _elm_lang$core$Native_Basics.logBase;
var _elm_lang$core$Basics$abs = _elm_lang$core$Native_Basics.abs;
var _elm_lang$core$Basics$negate = _elm_lang$core$Native_Basics.negate;
var _elm_lang$core$Basics$sqrt = _elm_lang$core$Native_Basics.sqrt;
var _elm_lang$core$Basics$atan2 = _elm_lang$core$Native_Basics.atan2;
var _elm_lang$core$Basics$atan = _elm_lang$core$Native_Basics.atan;
var _elm_lang$core$Basics$asin = _elm_lang$core$Native_Basics.asin;
var _elm_lang$core$Basics$acos = _elm_lang$core$Native_Basics.acos;
var _elm_lang$core$Basics$tan = _elm_lang$core$Native_Basics.tan;
var _elm_lang$core$Basics$sin = _elm_lang$core$Native_Basics.sin;
var _elm_lang$core$Basics$cos = _elm_lang$core$Native_Basics.cos;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['^'] = _elm_lang$core$Native_Basics.exp;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['%'] = _elm_lang$core$Native_Basics.mod;
var _elm_lang$core$Basics$rem = _elm_lang$core$Native_Basics.rem;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['//'] = _elm_lang$core$Native_Basics.div;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/'] = _elm_lang$core$Native_Basics.floatDiv;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['*'] = _elm_lang$core$Native_Basics.mul;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['-'] = _elm_lang$core$Native_Basics.sub;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['+'] = _elm_lang$core$Native_Basics.add;
var _elm_lang$core$Basics$toPolar = _elm_lang$core$Native_Basics.toPolar;
var _elm_lang$core$Basics$fromPolar = _elm_lang$core$Native_Basics.fromPolar;
var _elm_lang$core$Basics$turns = _elm_lang$core$Native_Basics.turns;
var _elm_lang$core$Basics$degrees = _elm_lang$core$Native_Basics.degrees;
var _elm_lang$core$Basics$radians = function (t) {
	return t;
};
var _elm_lang$core$Basics$GT = {ctor: 'GT'};
var _elm_lang$core$Basics$EQ = {ctor: 'EQ'};
var _elm_lang$core$Basics$LT = {ctor: 'LT'};
var _elm_lang$core$Basics$JustOneMore = function (a) {
	return {ctor: 'JustOneMore', _0: a};
};

//import Native.Utils //

var _elm_lang$core$Native_Debug = function() {

function log(tag, value)
{
	var msg = tag + ': ' + _elm_lang$core$Native_Utils.toString(value);
	var process = process || {};
	if (process.stdout)
	{
		process.stdout.write(msg);
	}
	else
	{
		console.log(msg);
	}
	return value;
}

function crash(message)
{
	throw new Error(message);
}

return {
	crash: crash,
	log: F2(log)
};

}();
var _elm_lang$core$Debug$crash = _elm_lang$core$Native_Debug.crash;
var _elm_lang$core$Debug$log = _elm_lang$core$Native_Debug.log;

var _elm_lang$core$Maybe$withDefault = F2(
	function ($default, maybe) {
		var _p0 = maybe;
		if (_p0.ctor === 'Just') {
			return _p0._0;
		} else {
			return $default;
		}
	});
var _elm_lang$core$Maybe$Nothing = {ctor: 'Nothing'};
var _elm_lang$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		var _p1 = maybeValue;
		if (_p1.ctor === 'Just') {
			return callback(_p1._0);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$Just = function (a) {
	return {ctor: 'Just', _0: a};
};
var _elm_lang$core$Maybe$map = F2(
	function (f, maybe) {
		var _p2 = maybe;
		if (_p2.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(
				f(_p2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		var _p3 = {ctor: '_Tuple2', _0: ma, _1: mb};
		if (((_p3.ctor === '_Tuple2') && (_p3._0.ctor === 'Just')) && (_p3._1.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A2(func, _p3._0._0, _p3._1._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map3 = F4(
	function (func, ma, mb, mc) {
		var _p4 = {ctor: '_Tuple3', _0: ma, _1: mb, _2: mc};
		if ((((_p4.ctor === '_Tuple3') && (_p4._0.ctor === 'Just')) && (_p4._1.ctor === 'Just')) && (_p4._2.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A3(func, _p4._0._0, _p4._1._0, _p4._2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map4 = F5(
	function (func, ma, mb, mc, md) {
		var _p5 = {ctor: '_Tuple4', _0: ma, _1: mb, _2: mc, _3: md};
		if (((((_p5.ctor === '_Tuple4') && (_p5._0.ctor === 'Just')) && (_p5._1.ctor === 'Just')) && (_p5._2.ctor === 'Just')) && (_p5._3.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A4(func, _p5._0._0, _p5._1._0, _p5._2._0, _p5._3._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map5 = F6(
	function (func, ma, mb, mc, md, me) {
		var _p6 = {ctor: '_Tuple5', _0: ma, _1: mb, _2: mc, _3: md, _4: me};
		if ((((((_p6.ctor === '_Tuple5') && (_p6._0.ctor === 'Just')) && (_p6._1.ctor === 'Just')) && (_p6._2.ctor === 'Just')) && (_p6._3.ctor === 'Just')) && (_p6._4.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A5(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0, _p6._4._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});

//import Native.Utils //

var _elm_lang$core$Native_List = function() {

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return { ctor: '::', _0: hd, _1: tl };
}

function fromArray(arr)
{
	var out = Nil;
	for (var i = arr.length; i--; )
	{
		out = Cons(arr[i], out);
	}
	return out;
}

function toArray(xs)
{
	var out = [];
	while (xs.ctor !== '[]')
	{
		out.push(xs._0);
		xs = xs._1;
	}
	return out;
}

function foldr(f, b, xs)
{
	var arr = toArray(xs);
	var acc = b;
	for (var i = arr.length; i--; )
	{
		acc = A2(f, arr[i], acc);
	}
	return acc;
}

function map2(f, xs, ys)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]')
	{
		arr.push(A2(f, xs._0, ys._0));
		xs = xs._1;
		ys = ys._1;
	}
	return fromArray(arr);
}

function map3(f, xs, ys, zs)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]')
	{
		arr.push(A3(f, xs._0, ys._0, zs._0));
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map4(f, ws, xs, ys, zs)
{
	var arr = [];
	while (   ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A4(f, ws._0, xs._0, ys._0, zs._0));
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map5(f, vs, ws, xs, ys, zs)
{
	var arr = [];
	while (   vs.ctor !== '[]'
		   && ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A5(f, vs._0, ws._0, xs._0, ys._0, zs._0));
		vs = vs._1;
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function sortBy(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		return _elm_lang$core$Native_Utils.cmp(f(a), f(b));
	}));
}

function sortWith(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		var ord = f(a)(b).ctor;
		return ord === 'EQ' ? 0 : ord === 'LT' ? -1 : 1;
	}));
}

return {
	Nil: Nil,
	Cons: Cons,
	cons: F2(Cons),
	toArray: toArray,
	fromArray: fromArray,

	foldr: F3(foldr),

	map2: F3(map2),
	map3: F4(map3),
	map4: F5(map4),
	map5: F6(map5),
	sortBy: F2(sortBy),
	sortWith: F2(sortWith)
};

}();
var _elm_lang$core$List$sortWith = _elm_lang$core$Native_List.sortWith;
var _elm_lang$core$List$sortBy = _elm_lang$core$Native_List.sortBy;
var _elm_lang$core$List$sort = function (xs) {
	return A2(_elm_lang$core$List$sortBy, _elm_lang$core$Basics$identity, xs);
};
var _elm_lang$core$List$singleton = function (value) {
	return {
		ctor: '::',
		_0: value,
		_1: {ctor: '[]'}
	};
};
var _elm_lang$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return list;
			} else {
				var _p0 = list;
				if (_p0.ctor === '[]') {
					return list;
				} else {
					var _v1 = n - 1,
						_v2 = _p0._1;
					n = _v1;
					list = _v2;
					continue drop;
				}
			}
		}
	});
var _elm_lang$core$List$map5 = _elm_lang$core$Native_List.map5;
var _elm_lang$core$List$map4 = _elm_lang$core$Native_List.map4;
var _elm_lang$core$List$map3 = _elm_lang$core$Native_List.map3;
var _elm_lang$core$List$map2 = _elm_lang$core$Native_List.map2;
var _elm_lang$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			var _p1 = list;
			if (_p1.ctor === '[]') {
				return false;
			} else {
				if (isOkay(_p1._0)) {
					return true;
				} else {
					var _v4 = isOkay,
						_v5 = _p1._1;
					isOkay = _v4;
					list = _v5;
					continue any;
				}
			}
		}
	});
var _elm_lang$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			_elm_lang$core$List$any,
			function (_p2) {
				return !isOkay(_p2);
			},
			list);
	});
var _elm_lang$core$List$foldr = _elm_lang$core$Native_List.foldr;
var _elm_lang$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			var _p3 = list;
			if (_p3.ctor === '[]') {
				return acc;
			} else {
				var _v7 = func,
					_v8 = A2(func, _p3._0, acc),
					_v9 = _p3._1;
				func = _v7;
				acc = _v8;
				list = _v9;
				continue foldl;
			}
		}
	});
var _elm_lang$core$List$length = function (xs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p4, i) {
				return i + 1;
			}),
		0,
		xs);
};
var _elm_lang$core$List$sum = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x + y;
			}),
		0,
		numbers);
};
var _elm_lang$core$List$product = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x * y;
			}),
		1,
		numbers);
};
var _elm_lang$core$List$maximum = function (list) {
	var _p5 = list;
	if (_p5.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$max, _p5._0, _p5._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$minimum = function (list) {
	var _p6 = list;
	if (_p6.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$min, _p6._0, _p6._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$member = F2(
	function (x, xs) {
		return A2(
			_elm_lang$core$List$any,
			function (a) {
				return _elm_lang$core$Native_Utils.eq(a, x);
			},
			xs);
	});
var _elm_lang$core$List$isEmpty = function (xs) {
	var _p7 = xs;
	if (_p7.ctor === '[]') {
		return true;
	} else {
		return false;
	}
};
var _elm_lang$core$List$tail = function (list) {
	var _p8 = list;
	if (_p8.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p8._1);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$head = function (list) {
	var _p9 = list;
	if (_p9.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p9._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List_ops = _elm_lang$core$List_ops || {};
_elm_lang$core$List_ops['::'] = _elm_lang$core$Native_List.cons;
var _elm_lang$core$List$map = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			F2(
				function (x, acc) {
					return {
						ctor: '::',
						_0: f(x),
						_1: acc
					};
				}),
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$filter = F2(
	function (pred, xs) {
		var conditionalCons = F2(
			function (front, back) {
				return pred(front) ? {ctor: '::', _0: front, _1: back} : back;
			});
		return A3(
			_elm_lang$core$List$foldr,
			conditionalCons,
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _p10 = f(mx);
		if (_p10.ctor === 'Just') {
			return {ctor: '::', _0: _p10._0, _1: xs};
		} else {
			return xs;
		}
	});
var _elm_lang$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			_elm_lang$core$List$maybeCons(f),
			{ctor: '[]'},
			xs);
	});
var _elm_lang$core$List$reverse = function (list) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return {ctor: '::', _0: x, _1: y};
			}),
		{ctor: '[]'},
		list);
};
var _elm_lang$core$List$scanl = F3(
	function (f, b, xs) {
		var scan1 = F2(
			function (x, accAcc) {
				var _p11 = accAcc;
				if (_p11.ctor === '::') {
					return {
						ctor: '::',
						_0: A2(f, x, _p11._0),
						_1: accAcc
					};
				} else {
					return {ctor: '[]'};
				}
			});
		return _elm_lang$core$List$reverse(
			A3(
				_elm_lang$core$List$foldl,
				scan1,
				{
					ctor: '::',
					_0: b,
					_1: {ctor: '[]'}
				},
				xs));
	});
var _elm_lang$core$List$append = F2(
	function (xs, ys) {
		var _p12 = ys;
		if (_p12.ctor === '[]') {
			return xs;
		} else {
			return A3(
				_elm_lang$core$List$foldr,
				F2(
					function (x, y) {
						return {ctor: '::', _0: x, _1: y};
					}),
				ys,
				xs);
		}
	});
var _elm_lang$core$List$concat = function (lists) {
	return A3(
		_elm_lang$core$List$foldr,
		_elm_lang$core$List$append,
		{ctor: '[]'},
		lists);
};
var _elm_lang$core$List$concatMap = F2(
	function (f, list) {
		return _elm_lang$core$List$concat(
			A2(_elm_lang$core$List$map, f, list));
	});
var _elm_lang$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _p13) {
				var _p14 = _p13;
				var _p16 = _p14._0;
				var _p15 = _p14._1;
				return pred(x) ? {
					ctor: '_Tuple2',
					_0: {ctor: '::', _0: x, _1: _p16},
					_1: _p15
				} : {
					ctor: '_Tuple2',
					_0: _p16,
					_1: {ctor: '::', _0: x, _1: _p15}
				};
			});
		return A3(
			_elm_lang$core$List$foldr,
			step,
			{
				ctor: '_Tuple2',
				_0: {ctor: '[]'},
				_1: {ctor: '[]'}
			},
			list);
	});
var _elm_lang$core$List$unzip = function (pairs) {
	var step = F2(
		function (_p18, _p17) {
			var _p19 = _p18;
			var _p20 = _p17;
			return {
				ctor: '_Tuple2',
				_0: {ctor: '::', _0: _p19._0, _1: _p20._0},
				_1: {ctor: '::', _0: _p19._1, _1: _p20._1}
			};
		});
	return A3(
		_elm_lang$core$List$foldr,
		step,
		{
			ctor: '_Tuple2',
			_0: {ctor: '[]'},
			_1: {ctor: '[]'}
		},
		pairs);
};
var _elm_lang$core$List$intersperse = F2(
	function (sep, xs) {
		var _p21 = xs;
		if (_p21.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			var step = F2(
				function (x, rest) {
					return {
						ctor: '::',
						_0: sep,
						_1: {ctor: '::', _0: x, _1: rest}
					};
				});
			var spersed = A3(
				_elm_lang$core$List$foldr,
				step,
				{ctor: '[]'},
				_p21._1);
			return {ctor: '::', _0: _p21._0, _1: spersed};
		}
	});
var _elm_lang$core$List$takeReverse = F3(
	function (n, list, taken) {
		takeReverse:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return taken;
			} else {
				var _p22 = list;
				if (_p22.ctor === '[]') {
					return taken;
				} else {
					var _v23 = n - 1,
						_v24 = _p22._1,
						_v25 = {ctor: '::', _0: _p22._0, _1: taken};
					n = _v23;
					list = _v24;
					taken = _v25;
					continue takeReverse;
				}
			}
		}
	});
var _elm_lang$core$List$takeTailRec = F2(
	function (n, list) {
		return _elm_lang$core$List$reverse(
			A3(
				_elm_lang$core$List$takeReverse,
				n,
				list,
				{ctor: '[]'}));
	});
var _elm_lang$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
			return {ctor: '[]'};
		} else {
			var _p23 = {ctor: '_Tuple2', _0: n, _1: list};
			_v26_5:
			do {
				_v26_1:
				do {
					if (_p23.ctor === '_Tuple2') {
						if (_p23._1.ctor === '[]') {
							return list;
						} else {
							if (_p23._1._1.ctor === '::') {
								switch (_p23._0) {
									case 1:
										break _v26_1;
									case 2:
										return {
											ctor: '::',
											_0: _p23._1._0,
											_1: {
												ctor: '::',
												_0: _p23._1._1._0,
												_1: {ctor: '[]'}
											}
										};
									case 3:
										if (_p23._1._1._1.ctor === '::') {
											return {
												ctor: '::',
												_0: _p23._1._0,
												_1: {
													ctor: '::',
													_0: _p23._1._1._0,
													_1: {
														ctor: '::',
														_0: _p23._1._1._1._0,
														_1: {ctor: '[]'}
													}
												}
											};
										} else {
											break _v26_5;
										}
									default:
										if ((_p23._1._1._1.ctor === '::') && (_p23._1._1._1._1.ctor === '::')) {
											var _p28 = _p23._1._1._1._0;
											var _p27 = _p23._1._1._0;
											var _p26 = _p23._1._0;
											var _p25 = _p23._1._1._1._1._0;
											var _p24 = _p23._1._1._1._1._1;
											return (_elm_lang$core$Native_Utils.cmp(ctr, 1000) > 0) ? {
												ctor: '::',
												_0: _p26,
												_1: {
													ctor: '::',
													_0: _p27,
													_1: {
														ctor: '::',
														_0: _p28,
														_1: {
															ctor: '::',
															_0: _p25,
															_1: A2(_elm_lang$core$List$takeTailRec, n - 4, _p24)
														}
													}
												}
											} : {
												ctor: '::',
												_0: _p26,
												_1: {
													ctor: '::',
													_0: _p27,
													_1: {
														ctor: '::',
														_0: _p28,
														_1: {
															ctor: '::',
															_0: _p25,
															_1: A3(_elm_lang$core$List$takeFast, ctr + 1, n - 4, _p24)
														}
													}
												}
											};
										} else {
											break _v26_5;
										}
								}
							} else {
								if (_p23._0 === 1) {
									break _v26_1;
								} else {
									break _v26_5;
								}
							}
						}
					} else {
						break _v26_5;
					}
				} while(false);
				return {
					ctor: '::',
					_0: _p23._1._0,
					_1: {ctor: '[]'}
				};
			} while(false);
			return list;
		}
	});
var _elm_lang$core$List$take = F2(
	function (n, list) {
		return A3(_elm_lang$core$List$takeFast, 0, n, list);
	});
var _elm_lang$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return result;
			} else {
				var _v27 = {ctor: '::', _0: value, _1: result},
					_v28 = n - 1,
					_v29 = value;
				result = _v27;
				n = _v28;
				value = _v29;
				continue repeatHelp;
			}
		}
	});
var _elm_lang$core$List$repeat = F2(
	function (n, value) {
		return A3(
			_elm_lang$core$List$repeatHelp,
			{ctor: '[]'},
			n,
			value);
	});
var _elm_lang$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(lo, hi) < 1) {
				var _v30 = lo,
					_v31 = hi - 1,
					_v32 = {ctor: '::', _0: hi, _1: list};
				lo = _v30;
				hi = _v31;
				list = _v32;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var _elm_lang$core$List$range = F2(
	function (lo, hi) {
		return A3(
			_elm_lang$core$List$rangeHelp,
			lo,
			hi,
			{ctor: '[]'});
	});
var _elm_lang$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$map2,
			f,
			A2(
				_elm_lang$core$List$range,
				0,
				_elm_lang$core$List$length(xs) - 1),
			xs);
	});

var _elm_lang$core$Result$toMaybe = function (result) {
	var _p0 = result;
	if (_p0.ctor === 'Ok') {
		return _elm_lang$core$Maybe$Just(_p0._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$Result$withDefault = F2(
	function (def, result) {
		var _p1 = result;
		if (_p1.ctor === 'Ok') {
			return _p1._0;
		} else {
			return def;
		}
	});
var _elm_lang$core$Result$Err = function (a) {
	return {ctor: 'Err', _0: a};
};
var _elm_lang$core$Result$andThen = F2(
	function (callback, result) {
		var _p2 = result;
		if (_p2.ctor === 'Ok') {
			return callback(_p2._0);
		} else {
			return _elm_lang$core$Result$Err(_p2._0);
		}
	});
var _elm_lang$core$Result$Ok = function (a) {
	return {ctor: 'Ok', _0: a};
};
var _elm_lang$core$Result$map = F2(
	function (func, ra) {
		var _p3 = ra;
		if (_p3.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(
				func(_p3._0));
		} else {
			return _elm_lang$core$Result$Err(_p3._0);
		}
	});
var _elm_lang$core$Result$map2 = F3(
	function (func, ra, rb) {
		var _p4 = {ctor: '_Tuple2', _0: ra, _1: rb};
		if (_p4._0.ctor === 'Ok') {
			if (_p4._1.ctor === 'Ok') {
				return _elm_lang$core$Result$Ok(
					A2(func, _p4._0._0, _p4._1._0));
			} else {
				return _elm_lang$core$Result$Err(_p4._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p4._0._0);
		}
	});
var _elm_lang$core$Result$map3 = F4(
	function (func, ra, rb, rc) {
		var _p5 = {ctor: '_Tuple3', _0: ra, _1: rb, _2: rc};
		if (_p5._0.ctor === 'Ok') {
			if (_p5._1.ctor === 'Ok') {
				if (_p5._2.ctor === 'Ok') {
					return _elm_lang$core$Result$Ok(
						A3(func, _p5._0._0, _p5._1._0, _p5._2._0));
				} else {
					return _elm_lang$core$Result$Err(_p5._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p5._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p5._0._0);
		}
	});
var _elm_lang$core$Result$map4 = F5(
	function (func, ra, rb, rc, rd) {
		var _p6 = {ctor: '_Tuple4', _0: ra, _1: rb, _2: rc, _3: rd};
		if (_p6._0.ctor === 'Ok') {
			if (_p6._1.ctor === 'Ok') {
				if (_p6._2.ctor === 'Ok') {
					if (_p6._3.ctor === 'Ok') {
						return _elm_lang$core$Result$Ok(
							A4(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0));
					} else {
						return _elm_lang$core$Result$Err(_p6._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p6._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p6._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p6._0._0);
		}
	});
var _elm_lang$core$Result$map5 = F6(
	function (func, ra, rb, rc, rd, re) {
		var _p7 = {ctor: '_Tuple5', _0: ra, _1: rb, _2: rc, _3: rd, _4: re};
		if (_p7._0.ctor === 'Ok') {
			if (_p7._1.ctor === 'Ok') {
				if (_p7._2.ctor === 'Ok') {
					if (_p7._3.ctor === 'Ok') {
						if (_p7._4.ctor === 'Ok') {
							return _elm_lang$core$Result$Ok(
								A5(func, _p7._0._0, _p7._1._0, _p7._2._0, _p7._3._0, _p7._4._0));
						} else {
							return _elm_lang$core$Result$Err(_p7._4._0);
						}
					} else {
						return _elm_lang$core$Result$Err(_p7._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p7._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p7._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p7._0._0);
		}
	});
var _elm_lang$core$Result$mapError = F2(
	function (f, result) {
		var _p8 = result;
		if (_p8.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(_p8._0);
		} else {
			return _elm_lang$core$Result$Err(
				f(_p8._0));
		}
	});
var _elm_lang$core$Result$fromMaybe = F2(
	function (err, maybe) {
		var _p9 = maybe;
		if (_p9.ctor === 'Just') {
			return _elm_lang$core$Result$Ok(_p9._0);
		} else {
			return _elm_lang$core$Result$Err(err);
		}
	});

//import Maybe, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_String = function() {

function isEmpty(str)
{
	return str.length === 0;
}
function cons(chr, str)
{
	return chr + str;
}
function uncons(str)
{
	var hd = str[0];
	if (hd)
	{
		return _elm_lang$core$Maybe$Just(_elm_lang$core$Native_Utils.Tuple2(_elm_lang$core$Native_Utils.chr(hd), str.slice(1)));
	}
	return _elm_lang$core$Maybe$Nothing;
}
function append(a, b)
{
	return a + b;
}
function concat(strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join('');
}
function length(str)
{
	return str.length;
}
function map(f, str)
{
	var out = str.split('');
	for (var i = out.length; i--; )
	{
		out[i] = f(_elm_lang$core$Native_Utils.chr(out[i]));
	}
	return out.join('');
}
function filter(pred, str)
{
	return str.split('').map(_elm_lang$core$Native_Utils.chr).filter(pred).join('');
}
function reverse(str)
{
	return str.split('').reverse().join('');
}
function foldl(f, b, str)
{
	var len = str.length;
	for (var i = 0; i < len; ++i)
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function foldr(f, b, str)
{
	for (var i = str.length; i--; )
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function split(sep, str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(sep));
}
function join(sep, strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join(sep);
}
function repeat(n, str)
{
	var result = '';
	while (n > 0)
	{
		if (n & 1)
		{
			result += str;
		}
		n >>= 1, str += str;
	}
	return result;
}
function slice(start, end, str)
{
	return str.slice(start, end);
}
function left(n, str)
{
	return n < 1 ? '' : str.slice(0, n);
}
function right(n, str)
{
	return n < 1 ? '' : str.slice(-n);
}
function dropLeft(n, str)
{
	return n < 1 ? str : str.slice(n);
}
function dropRight(n, str)
{
	return n < 1 ? str : str.slice(0, -n);
}
function pad(n, chr, str)
{
	var half = (n - str.length) / 2;
	return repeat(Math.ceil(half), chr) + str + repeat(half | 0, chr);
}
function padRight(n, chr, str)
{
	return str + repeat(n - str.length, chr);
}
function padLeft(n, chr, str)
{
	return repeat(n - str.length, chr) + str;
}

function trim(str)
{
	return str.trim();
}
function trimLeft(str)
{
	return str.replace(/^\s+/, '');
}
function trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function words(str)
{
	return _elm_lang$core$Native_List.fromArray(str.trim().split(/\s+/g));
}
function lines(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(/\r\n|\r|\n/g));
}

function toUpper(str)
{
	return str.toUpperCase();
}
function toLower(str)
{
	return str.toLowerCase();
}

function any(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return true;
		}
	}
	return false;
}
function all(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (!pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return false;
		}
	}
	return true;
}

function contains(sub, str)
{
	return str.indexOf(sub) > -1;
}
function startsWith(sub, str)
{
	return str.indexOf(sub) === 0;
}
function endsWith(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
}
function indexes(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _elm_lang$core$Native_List.Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _elm_lang$core$Native_List.fromArray(is);
}


function toInt(s)
{
	var len = s.length;

	// if empty
	if (len === 0)
	{
		return intErr(s);
	}

	// if hex
	var c = s[0];
	if (c === '0' && s[1] === 'x')
	{
		for (var i = 2; i < len; ++i)
		{
			var c = s[i];
			if (('0' <= c && c <= '9') || ('A' <= c && c <= 'F') || ('a' <= c && c <= 'f'))
			{
				continue;
			}
			return intErr(s);
		}
		return _elm_lang$core$Result$Ok(parseInt(s, 16));
	}

	// is decimal
	if (c > '9' || (c < '0' && c !== '-' && c !== '+'))
	{
		return intErr(s);
	}
	for (var i = 1; i < len; ++i)
	{
		var c = s[i];
		if (c < '0' || '9' < c)
		{
			return intErr(s);
		}
	}

	return _elm_lang$core$Result$Ok(parseInt(s, 10));
}

function intErr(s)
{
	return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int");
}


function toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return floatErr(s);
	}
	var n = +s;
	// faster isNaN check
	return n === n ? _elm_lang$core$Result$Ok(n) : floatErr(s);
}

function floatErr(s)
{
	return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float");
}


function toList(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split('').map(_elm_lang$core$Native_Utils.chr));
}
function fromList(chars)
{
	return _elm_lang$core$Native_List.toArray(chars).join('');
}

return {
	isEmpty: isEmpty,
	cons: F2(cons),
	uncons: uncons,
	append: F2(append),
	concat: concat,
	length: length,
	map: F2(map),
	filter: F2(filter),
	reverse: reverse,
	foldl: F3(foldl),
	foldr: F3(foldr),

	split: F2(split),
	join: F2(join),
	repeat: F2(repeat),

	slice: F3(slice),
	left: F2(left),
	right: F2(right),
	dropLeft: F2(dropLeft),
	dropRight: F2(dropRight),

	pad: F3(pad),
	padLeft: F3(padLeft),
	padRight: F3(padRight),

	trim: trim,
	trimLeft: trimLeft,
	trimRight: trimRight,

	words: words,
	lines: lines,

	toUpper: toUpper,
	toLower: toLower,

	any: F2(any),
	all: F2(all),

	contains: F2(contains),
	startsWith: F2(startsWith),
	endsWith: F2(endsWith),
	indexes: F2(indexes),

	toInt: toInt,
	toFloat: toFloat,
	toList: toList,
	fromList: fromList
};

}();

//import Native.Utils //

var _elm_lang$core$Native_Char = function() {

return {
	fromCode: function(c) { return _elm_lang$core$Native_Utils.chr(String.fromCharCode(c)); },
	toCode: function(c) { return c.charCodeAt(0); },
	toUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toUpperCase()); },
	toLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLowerCase()); },
	toLocaleUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleUpperCase()); },
	toLocaleLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleLowerCase()); }
};

}();
var _elm_lang$core$Char$fromCode = _elm_lang$core$Native_Char.fromCode;
var _elm_lang$core$Char$toCode = _elm_lang$core$Native_Char.toCode;
var _elm_lang$core$Char$toLocaleLower = _elm_lang$core$Native_Char.toLocaleLower;
var _elm_lang$core$Char$toLocaleUpper = _elm_lang$core$Native_Char.toLocaleUpper;
var _elm_lang$core$Char$toLower = _elm_lang$core$Native_Char.toLower;
var _elm_lang$core$Char$toUpper = _elm_lang$core$Native_Char.toUpper;
var _elm_lang$core$Char$isBetween = F3(
	function (low, high, $char) {
		var code = _elm_lang$core$Char$toCode($char);
		return (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(low)) > -1) && (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(high)) < 1);
	});
var _elm_lang$core$Char$isUpper = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('A'),
	_elm_lang$core$Native_Utils.chr('Z'));
var _elm_lang$core$Char$isLower = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('a'),
	_elm_lang$core$Native_Utils.chr('z'));
var _elm_lang$core$Char$isDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('9'));
var _elm_lang$core$Char$isOctDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('7'));
var _elm_lang$core$Char$isHexDigit = function ($char) {
	return _elm_lang$core$Char$isDigit($char) || (A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('a'),
		_elm_lang$core$Native_Utils.chr('f'),
		$char) || A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('A'),
		_elm_lang$core$Native_Utils.chr('F'),
		$char));
};

var _elm_lang$core$String$fromList = _elm_lang$core$Native_String.fromList;
var _elm_lang$core$String$toList = _elm_lang$core$Native_String.toList;
var _elm_lang$core$String$toFloat = _elm_lang$core$Native_String.toFloat;
var _elm_lang$core$String$toInt = _elm_lang$core$Native_String.toInt;
var _elm_lang$core$String$indices = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$indexes = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$endsWith = _elm_lang$core$Native_String.endsWith;
var _elm_lang$core$String$startsWith = _elm_lang$core$Native_String.startsWith;
var _elm_lang$core$String$contains = _elm_lang$core$Native_String.contains;
var _elm_lang$core$String$all = _elm_lang$core$Native_String.all;
var _elm_lang$core$String$any = _elm_lang$core$Native_String.any;
var _elm_lang$core$String$toLower = _elm_lang$core$Native_String.toLower;
var _elm_lang$core$String$toUpper = _elm_lang$core$Native_String.toUpper;
var _elm_lang$core$String$lines = _elm_lang$core$Native_String.lines;
var _elm_lang$core$String$words = _elm_lang$core$Native_String.words;
var _elm_lang$core$String$trimRight = _elm_lang$core$Native_String.trimRight;
var _elm_lang$core$String$trimLeft = _elm_lang$core$Native_String.trimLeft;
var _elm_lang$core$String$trim = _elm_lang$core$Native_String.trim;
var _elm_lang$core$String$padRight = _elm_lang$core$Native_String.padRight;
var _elm_lang$core$String$padLeft = _elm_lang$core$Native_String.padLeft;
var _elm_lang$core$String$pad = _elm_lang$core$Native_String.pad;
var _elm_lang$core$String$dropRight = _elm_lang$core$Native_String.dropRight;
var _elm_lang$core$String$dropLeft = _elm_lang$core$Native_String.dropLeft;
var _elm_lang$core$String$right = _elm_lang$core$Native_String.right;
var _elm_lang$core$String$left = _elm_lang$core$Native_String.left;
var _elm_lang$core$String$slice = _elm_lang$core$Native_String.slice;
var _elm_lang$core$String$repeat = _elm_lang$core$Native_String.repeat;
var _elm_lang$core$String$join = _elm_lang$core$Native_String.join;
var _elm_lang$core$String$split = _elm_lang$core$Native_String.split;
var _elm_lang$core$String$foldr = _elm_lang$core$Native_String.foldr;
var _elm_lang$core$String$foldl = _elm_lang$core$Native_String.foldl;
var _elm_lang$core$String$reverse = _elm_lang$core$Native_String.reverse;
var _elm_lang$core$String$filter = _elm_lang$core$Native_String.filter;
var _elm_lang$core$String$map = _elm_lang$core$Native_String.map;
var _elm_lang$core$String$length = _elm_lang$core$Native_String.length;
var _elm_lang$core$String$concat = _elm_lang$core$Native_String.concat;
var _elm_lang$core$String$append = _elm_lang$core$Native_String.append;
var _elm_lang$core$String$uncons = _elm_lang$core$Native_String.uncons;
var _elm_lang$core$String$cons = _elm_lang$core$Native_String.cons;
var _elm_lang$core$String$fromChar = function ($char) {
	return A2(_elm_lang$core$String$cons, $char, '');
};
var _elm_lang$core$String$isEmpty = _elm_lang$core$Native_String.isEmpty;

var _elm_lang$core$Tuple$mapSecond = F2(
	function (func, _p0) {
		var _p1 = _p0;
		return {
			ctor: '_Tuple2',
			_0: _p1._0,
			_1: func(_p1._1)
		};
	});
var _elm_lang$core$Tuple$mapFirst = F2(
	function (func, _p2) {
		var _p3 = _p2;
		return {
			ctor: '_Tuple2',
			_0: func(_p3._0),
			_1: _p3._1
		};
	});
var _elm_lang$core$Tuple$second = function (_p4) {
	var _p5 = _p4;
	return _p5._1;
};
var _elm_lang$core$Tuple$first = function (_p6) {
	var _p7 = _p6;
	return _p7._0;
};

//import //

var _elm_lang$core$Native_Platform = function() {


// PROGRAMS

function program(impl)
{
	return function(flagDecoder)
	{
		return function(object, moduleName)
		{
			object['worker'] = function worker(flags)
			{
				if (typeof flags !== 'undefined')
				{
					throw new Error(
						'The `' + moduleName + '` module does not need flags.\n'
						+ 'Call ' + moduleName + '.worker() with no arguments and you should be all set!'
					);
				}

				return initialize(
					impl.init,
					impl.update,
					impl.subscriptions,
					renderer
				);
			};
		};
	};
}

function programWithFlags(impl)
{
	return function(flagDecoder)
	{
		return function(object, moduleName)
		{
			object['worker'] = function worker(flags)
			{
				if (typeof flagDecoder === 'undefined')
				{
					throw new Error(
						'Are you trying to sneak a Never value into Elm? Trickster!\n'
						+ 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n'
						+ 'Use `program` instead if you do not want flags.'
					);
				}

				var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
				if (result.ctor === 'Err')
				{
					throw new Error(
						moduleName + '.worker(...) was called with an unexpected argument.\n'
						+ 'I tried to convert it to an Elm value, but ran into this problem:\n\n'
						+ result._0
					);
				}

				return initialize(
					impl.init(result._0),
					impl.update,
					impl.subscriptions,
					renderer
				);
			};
		};
	};
}

function renderer(enqueue, _)
{
	return function(_) {};
}


// HTML TO PROGRAM

function htmlToProgram(vnode)
{
	var emptyBag = batch(_elm_lang$core$Native_List.Nil);
	var noChange = _elm_lang$core$Native_Utils.Tuple2(
		_elm_lang$core$Native_Utils.Tuple0,
		emptyBag
	);

	return _elm_lang$virtual_dom$VirtualDom$program({
		init: noChange,
		view: function(model) { return main; },
		update: F2(function(msg, model) { return noChange; }),
		subscriptions: function (model) { return emptyBag; }
	});
}


// INITIALIZE A PROGRAM

function initialize(init, update, subscriptions, renderer)
{
	// ambient state
	var managers = {};
	var updateView;

	// init and update state in main process
	var initApp = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
		var model = init._0;
		updateView = renderer(enqueue, model);
		var cmds = init._1;
		var subs = subscriptions(model);
		dispatchEffects(managers, cmds, subs);
		callback(_elm_lang$core$Native_Scheduler.succeed(model));
	});

	function onMessage(msg, model)
	{
		return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
			var results = A2(update, msg, model);
			model = results._0;
			updateView(model);
			var cmds = results._1;
			var subs = subscriptions(model);
			dispatchEffects(managers, cmds, subs);
			callback(_elm_lang$core$Native_Scheduler.succeed(model));
		});
	}

	var mainProcess = spawnLoop(initApp, onMessage);

	function enqueue(msg)
	{
		_elm_lang$core$Native_Scheduler.rawSend(mainProcess, msg);
	}

	var ports = setupEffects(managers, enqueue);

	return ports ? { ports: ports } : {};
}


// EFFECT MANAGERS

var effectManagers = {};

function setupEffects(managers, callback)
{
	var ports;

	// setup all necessary effect managers
	for (var key in effectManagers)
	{
		var manager = effectManagers[key];

		if (manager.isForeign)
		{
			ports = ports || {};
			ports[key] = manager.tag === 'cmd'
				? setupOutgoingPort(key)
				: setupIncomingPort(key, callback);
		}

		managers[key] = makeManager(manager, callback);
	}

	return ports;
}

function makeManager(info, callback)
{
	var router = {
		main: callback,
		self: undefined
	};

	var tag = info.tag;
	var onEffects = info.onEffects;
	var onSelfMsg = info.onSelfMsg;

	function onMessage(msg, state)
	{
		if (msg.ctor === 'self')
		{
			return A3(onSelfMsg, router, msg._0, state);
		}

		var fx = msg._0;
		switch (tag)
		{
			case 'cmd':
				return A3(onEffects, router, fx.cmds, state);

			case 'sub':
				return A3(onEffects, router, fx.subs, state);

			case 'fx':
				return A4(onEffects, router, fx.cmds, fx.subs, state);
		}
	}

	var process = spawnLoop(info.init, onMessage);
	router.self = process;
	return process;
}

function sendToApp(router, msg)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		router.main(msg);
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sendToSelf(router, msg)
{
	return A2(_elm_lang$core$Native_Scheduler.send, router.self, {
		ctor: 'self',
		_0: msg
	});
}


// HELPER for STATEFUL LOOPS

function spawnLoop(init, onMessage)
{
	var andThen = _elm_lang$core$Native_Scheduler.andThen;

	function loop(state)
	{
		var handleMsg = _elm_lang$core$Native_Scheduler.receive(function(msg) {
			return onMessage(msg, state);
		});
		return A2(andThen, loop, handleMsg);
	}

	var task = A2(andThen, loop, init);

	return _elm_lang$core$Native_Scheduler.rawSpawn(task);
}


// BAGS

function leaf(home)
{
	return function(value)
	{
		return {
			type: 'leaf',
			home: home,
			value: value
		};
	};
}

function batch(list)
{
	return {
		type: 'node',
		branches: list
	};
}

function map(tagger, bag)
{
	return {
		type: 'map',
		tagger: tagger,
		tree: bag
	}
}


// PIPE BAGS INTO EFFECT MANAGERS

function dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	gatherEffects(true, cmdBag, effectsDict, null);
	gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		var fx = home in effectsDict
			? effectsDict[home]
			: {
				cmds: _elm_lang$core$Native_List.Nil,
				subs: _elm_lang$core$Native_List.Nil
			};

		_elm_lang$core$Native_Scheduler.rawSend(managers[home], { ctor: 'fx', _0: fx });
	}
}

function gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.type)
	{
		case 'leaf':
			var home = bag.home;
			var effect = toEffect(isCmd, home, taggers, bag.value);
			effectsDict[home] = insert(isCmd, effect, effectsDict[home]);
			return;

		case 'node':
			var list = bag.branches;
			while (list.ctor !== '[]')
			{
				gatherEffects(isCmd, list._0, effectsDict, taggers);
				list = list._1;
			}
			return;

		case 'map':
			gatherEffects(isCmd, bag.tree, effectsDict, {
				tagger: bag.tagger,
				rest: taggers
			});
			return;
	}
}

function toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		var temp = taggers;
		while (temp)
		{
			x = temp.tagger(x);
			temp = temp.rest;
		}
		return x;
	}

	var map = isCmd
		? effectManagers[home].cmdMap
		: effectManagers[home].subMap;

	return A2(map, applyTaggers, value)
}

function insert(isCmd, newEffect, effects)
{
	effects = effects || {
		cmds: _elm_lang$core$Native_List.Nil,
		subs: _elm_lang$core$Native_List.Nil
	};
	if (isCmd)
	{
		effects.cmds = _elm_lang$core$Native_List.Cons(newEffect, effects.cmds);
		return effects;
	}
	effects.subs = _elm_lang$core$Native_List.Cons(newEffect, effects.subs);
	return effects;
}


// PORTS

function checkPortName(name)
{
	if (name in effectManagers)
	{
		throw new Error('There can only be one port named `' + name + '`, but your program has multiple.');
	}
}


// OUTGOING PORTS

function outgoingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'cmd',
		cmdMap: outgoingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var outgoingPortMap = F2(function cmdMap(tagger, value) {
	return value;
});

function setupOutgoingPort(name)
{
	var subs = [];
	var converter = effectManagers[name].converter;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function onEffects(router, cmdList, state)
	{
		while (cmdList.ctor !== '[]')
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = converter(cmdList._0);
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
			cmdList = cmdList._1;
		}
		return init;
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

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

function incomingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'sub',
		subMap: incomingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var incomingPortMap = F2(function subMap(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});

function setupIncomingPort(name, callback)
{
	var sentBeforeInit = [];
	var subs = _elm_lang$core$Native_List.Nil;
	var converter = effectManagers[name].converter;
	var currentOnEffects = preInitOnEffects;
	var currentSend = preInitSend;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function preInitOnEffects(router, subList, state)
	{
		var postInitResult = postInitOnEffects(router, subList, state);

		for(var i = 0; i < sentBeforeInit.length; i++)
		{
			postInitSend(sentBeforeInit[i]);
		}

		sentBeforeInit = null; // to release objects held in queue
		currentSend = postInitSend;
		currentOnEffects = postInitOnEffects;
		return postInitResult;
	}

	function postInitOnEffects(router, subList, state)
	{
		subs = subList;
		return init;
	}

	function onEffects(router, subList, state)
	{
		return currentOnEffects(router, subList, state);
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

	// PUBLIC API

	function preInitSend(value)
	{
		sentBeforeInit.push(value);
	}

	function postInitSend(value)
	{
		var temp = subs;
		while (temp.ctor !== '[]')
		{
			callback(temp._0(value));
			temp = temp._1;
		}
	}

	function send(incomingValue)
	{
		var result = A2(_elm_lang$core$Json_Decode$decodeValue, converter, incomingValue);
		if (result.ctor === 'Err')
		{
			throw new Error('Trying to send an unexpected type of value through port `' + name + '`:\n' + result._0);
		}

		currentSend(result._0);
	}

	return { send: send };
}

return {
	// routers
	sendToApp: F2(sendToApp),
	sendToSelf: F2(sendToSelf),

	// global setup
	effectManagers: effectManagers,
	outgoingPort: outgoingPort,
	incomingPort: incomingPort,

	htmlToProgram: htmlToProgram,
	program: program,
	programWithFlags: programWithFlags,
	initialize: initialize,

	// effect bags
	leaf: leaf,
	batch: batch,
	map: F2(map)
};

}();

//import Native.Utils //

var _elm_lang$core$Native_Scheduler = function() {

var MAX_STEPS = 10000;


// TASKS

function succeed(value)
{
	return {
		ctor: '_Task_succeed',
		value: value
	};
}

function fail(error)
{
	return {
		ctor: '_Task_fail',
		value: error
	};
}

function nativeBinding(callback)
{
	return {
		ctor: '_Task_nativeBinding',
		callback: callback,
		cancel: null
	};
}

function andThen(callback, task)
{
	return {
		ctor: '_Task_andThen',
		callback: callback,
		task: task
	};
}

function onError(callback, task)
{
	return {
		ctor: '_Task_onError',
		callback: callback,
		task: task
	};
}

function receive(callback)
{
	return {
		ctor: '_Task_receive',
		callback: callback
	};
}


// PROCESSES

function rawSpawn(task)
{
	var process = {
		ctor: '_Process',
		id: _elm_lang$core$Native_Utils.guid(),
		root: task,
		stack: null,
		mailbox: []
	};

	enqueue(process);

	return process;
}

function spawn(task)
{
	return nativeBinding(function(callback) {
		var process = rawSpawn(task);
		callback(succeed(process));
	});
}

function rawSend(process, msg)
{
	process.mailbox.push(msg);
	enqueue(process);
}

function send(process, msg)
{
	return nativeBinding(function(callback) {
		rawSend(process, msg);
		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function kill(process)
{
	return nativeBinding(function(callback) {
		var root = process.root;
		if (root.ctor === '_Task_nativeBinding' && root.cancel)
		{
			root.cancel();
		}

		process.root = null;

		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sleep(time)
{
	return nativeBinding(function(callback) {
		var id = setTimeout(function() {
			callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}


// STEP PROCESSES

function step(numSteps, process)
{
	while (numSteps < MAX_STEPS)
	{
		var ctor = process.root.ctor;

		if (ctor === '_Task_succeed')
		{
			while (process.stack && process.stack.ctor === '_Task_onError')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_fail')
		{
			while (process.stack && process.stack.ctor === '_Task_andThen')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_andThen')
		{
			process.stack = {
				ctor: '_Task_andThen',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_onError')
		{
			process.stack = {
				ctor: '_Task_onError',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_nativeBinding')
		{
			process.root.cancel = process.root.callback(function(newRoot) {
				process.root = newRoot;
				enqueue(process);
			});

			break;
		}

		if (ctor === '_Task_receive')
		{
			var mailbox = process.mailbox;
			if (mailbox.length === 0)
			{
				break;
			}

			process.root = process.root.callback(mailbox.shift());
			++numSteps;
			continue;
		}

		throw new Error(ctor);
	}

	if (numSteps < MAX_STEPS)
	{
		return numSteps + 1;
	}
	enqueue(process);

	return numSteps;
}


// WORK QUEUE

var working = false;
var workQueue = [];

function enqueue(process)
{
	workQueue.push(process);

	if (!working)
	{
		setTimeout(work, 0);
		working = true;
	}
}

function work()
{
	var numSteps = 0;
	var process;
	while (numSteps < MAX_STEPS && (process = workQueue.shift()))
	{
		if (process.root)
		{
			numSteps = step(numSteps, process);
		}
	}
	if (!process)
	{
		working = false;
		return;
	}
	setTimeout(work, 0);
}


return {
	succeed: succeed,
	fail: fail,
	nativeBinding: nativeBinding,
	andThen: F2(andThen),
	onError: F2(onError),
	receive: receive,

	spawn: spawn,
	kill: kill,
	sleep: sleep,
	send: F2(send),

	rawSpawn: rawSpawn,
	rawSend: rawSend
};

}();
var _elm_lang$core$Platform_Cmd$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Cmd$none = _elm_lang$core$Platform_Cmd$batch(
	{ctor: '[]'});
var _elm_lang$core$Platform_Cmd_ops = _elm_lang$core$Platform_Cmd_ops || {};
_elm_lang$core$Platform_Cmd_ops['!'] = F2(
	function (model, commands) {
		return {
			ctor: '_Tuple2',
			_0: model,
			_1: _elm_lang$core$Platform_Cmd$batch(commands)
		};
	});
var _elm_lang$core$Platform_Cmd$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Cmd$Cmd = {ctor: 'Cmd'};

var _elm_lang$core$Platform_Sub$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Sub$none = _elm_lang$core$Platform_Sub$batch(
	{ctor: '[]'});
var _elm_lang$core$Platform_Sub$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Sub$Sub = {ctor: 'Sub'};

var _elm_lang$core$Platform$hack = _elm_lang$core$Native_Scheduler.succeed;
var _elm_lang$core$Platform$sendToSelf = _elm_lang$core$Native_Platform.sendToSelf;
var _elm_lang$core$Platform$sendToApp = _elm_lang$core$Native_Platform.sendToApp;
var _elm_lang$core$Platform$programWithFlags = _elm_lang$core$Native_Platform.programWithFlags;
var _elm_lang$core$Platform$program = _elm_lang$core$Native_Platform.program;
var _elm_lang$core$Platform$Program = {ctor: 'Program'};
var _elm_lang$core$Platform$Task = {ctor: 'Task'};
var _elm_lang$core$Platform$ProcessId = {ctor: 'ProcessId'};
var _elm_lang$core$Platform$Router = {ctor: 'Router'};

var _Fresheyeball$elm_tuple_extra$Tuple2$toList = function (_p0) {
	var _p1 = _p0;
	return {
		ctor: '::',
		_0: _p1._0,
		_1: {
			ctor: '::',
			_0: _p1._1,
			_1: {ctor: '[]'}
		}
	};
};
var _Fresheyeball$elm_tuple_extra$Tuple2$sortWith = F2(
	function (cmp, _p2) {
		var _p3 = _p2;
		var _p6 = _p3._1;
		var _p5 = _p3._0;
		var _p4 = A2(cmp, _p5, _p6);
		if (_p4.ctor === 'GT') {
			return {ctor: '_Tuple2', _0: _p6, _1: _p5};
		} else {
			return {ctor: '_Tuple2', _0: _p5, _1: _p6};
		}
	});
var _Fresheyeball$elm_tuple_extra$Tuple2$sortBy = F2(
	function (f, _p7) {
		var _p8 = _p7;
		var _p10 = _p8._1;
		var _p9 = _p8._0;
		return (_elm_lang$core$Native_Utils.cmp(
			f(_p9),
			f(_p10)) > 0) ? {ctor: '_Tuple2', _0: _p10, _1: _p9} : {ctor: '_Tuple2', _0: _p9, _1: _p10};
	});
var _Fresheyeball$elm_tuple_extra$Tuple2$sort = function (_p11) {
	var _p12 = _p11;
	var _p14 = _p12._1;
	var _p13 = _p12._0;
	return (_elm_lang$core$Native_Utils.cmp(_p13, _p14) > 0) ? {ctor: '_Tuple2', _0: _p14, _1: _p13} : {ctor: '_Tuple2', _0: _p13, _1: _p14};
};
var _Fresheyeball$elm_tuple_extra$Tuple2$swap = function (_p15) {
	var _p16 = _p15;
	return {ctor: '_Tuple2', _0: _p16._1, _1: _p16._0};
};
var _Fresheyeball$elm_tuple_extra$Tuple2$mapBoth = F2(
	function (f, _p17) {
		var _p18 = _p17;
		return {
			ctor: '_Tuple2',
			_0: f(_p18._0),
			_1: f(_p18._1)
		};
	});
var _Fresheyeball$elm_tuple_extra$Tuple2$mapEach = F3(
	function (f, f_, _p19) {
		var _p20 = _p19;
		return {
			ctor: '_Tuple2',
			_0: f(_p20._0),
			_1: f_(_p20._1)
		};
	});
var _Fresheyeball$elm_tuple_extra$Tuple2$mapSecond = F2(
	function (f, _p21) {
		var _p22 = _p21;
		return {
			ctor: '_Tuple2',
			_0: _p22._0,
			_1: f(_p22._1)
		};
	});
var _Fresheyeball$elm_tuple_extra$Tuple2$map = _Fresheyeball$elm_tuple_extra$Tuple2$mapSecond;
var _Fresheyeball$elm_tuple_extra$Tuple2$mapFirst = F2(
	function (f, _p23) {
		var _p24 = _p23;
		return {
			ctor: '_Tuple2',
			_0: f(_p24._0),
			_1: _p24._1
		};
	});
var _Fresheyeball$elm_tuple_extra$Tuple2_ops = _Fresheyeball$elm_tuple_extra$Tuple2_ops || {};
_Fresheyeball$elm_tuple_extra$Tuple2_ops['=>'] = F2(
	function (a, b) {
		return {ctor: '_Tuple2', _0: a, _1: b};
	});

var _Fresheyeball$elm_tuple_extra$Tuple3$toList = function (_p0) {
	var _p1 = _p0;
	return {
		ctor: '::',
		_0: _p1._0,
		_1: {
			ctor: '::',
			_0: _p1._1,
			_1: {
				ctor: '::',
				_0: _p1._2,
				_1: {ctor: '[]'}
			}
		}
	};
};
var _Fresheyeball$elm_tuple_extra$Tuple3$swirll = function (_p2) {
	var _p3 = _p2;
	return {ctor: '_Tuple3', _0: _p3._2, _1: _p3._0, _2: _p3._1};
};
var _Fresheyeball$elm_tuple_extra$Tuple3$swirlr = function (_p4) {
	var _p5 = _p4;
	return {ctor: '_Tuple3', _0: _p5._1, _1: _p5._2, _2: _p5._0};
};
var _Fresheyeball$elm_tuple_extra$Tuple3$sortWith = F2(
	function (cmp, _p6) {
		var _p7 = _p6;
		var _p9 = _p7._2;
		var _p8 = A2(
			_Fresheyeball$elm_tuple_extra$Tuple2$sortWith,
			cmp,
			{ctor: '_Tuple2', _0: _p7._0, _1: _p7._1});
		var a_ = _p8._0;
		var b_ = _p8._1;
		var goesBefore = F2(
			function (x, y) {
				return !_elm_lang$core$Native_Utils.eq(
					A2(cmp, x, y),
					_elm_lang$core$Basics$GT);
			});
		return A2(goesBefore, _p9, a_) ? {ctor: '_Tuple3', _0: _p9, _1: a_, _2: b_} : (A2(goesBefore, _p9, b_) ? {ctor: '_Tuple3', _0: a_, _1: _p9, _2: b_} : {ctor: '_Tuple3', _0: a_, _1: b_, _2: _p9});
	});
var _Fresheyeball$elm_tuple_extra$Tuple3$sortBy = function (conv) {
	return _Fresheyeball$elm_tuple_extra$Tuple3$sortWith(
		F2(
			function (x, y) {
				return A2(
					_elm_lang$core$Basics$compare,
					conv(x),
					conv(y));
			}));
};
var _Fresheyeball$elm_tuple_extra$Tuple3$sort = _Fresheyeball$elm_tuple_extra$Tuple3$sortWith(_elm_lang$core$Basics$compare);
var _Fresheyeball$elm_tuple_extra$Tuple3$mapAll = F2(
	function (f, _p10) {
		var _p11 = _p10;
		return {
			ctor: '_Tuple3',
			_0: f(_p11._0),
			_1: f(_p11._1),
			_2: f(_p11._2)
		};
	});
var _Fresheyeball$elm_tuple_extra$Tuple3$mapEach = F4(
	function (f, f_, f__, _p12) {
		var _p13 = _p12;
		return {
			ctor: '_Tuple3',
			_0: f(_p13._0),
			_1: f_(_p13._1),
			_2: f__(_p13._2)
		};
	});
var _Fresheyeball$elm_tuple_extra$Tuple3$mapThird = F2(
	function (f, _p14) {
		var _p15 = _p14;
		return {
			ctor: '_Tuple3',
			_0: _p15._0,
			_1: _p15._1,
			_2: f(_p15._2)
		};
	});
var _Fresheyeball$elm_tuple_extra$Tuple3$map = _Fresheyeball$elm_tuple_extra$Tuple3$mapThird;
var _Fresheyeball$elm_tuple_extra$Tuple3$mapSecond = F2(
	function (f, _p16) {
		var _p17 = _p16;
		return {
			ctor: '_Tuple3',
			_0: _p17._0,
			_1: f(_p17._1),
			_2: _p17._2
		};
	});
var _Fresheyeball$elm_tuple_extra$Tuple3$mapFirst = F2(
	function (f, _p18) {
		var _p19 = _p18;
		return {
			ctor: '_Tuple3',
			_0: f(_p19._0),
			_1: _p19._1,
			_2: _p19._2
		};
	});
var _Fresheyeball$elm_tuple_extra$Tuple3$init = function (_p20) {
	var _p21 = _p20;
	return {ctor: '_Tuple2', _0: _p21._0, _1: _p21._1};
};
var _Fresheyeball$elm_tuple_extra$Tuple3$tail = function (_p22) {
	var _p23 = _p22;
	return {ctor: '_Tuple2', _0: _p23._1, _1: _p23._2};
};
var _Fresheyeball$elm_tuple_extra$Tuple3$third = function (_p24) {
	var _p25 = _p24;
	return _p25._2;
};
var _Fresheyeball$elm_tuple_extra$Tuple3$second = function (_p26) {
	var _p27 = _p26;
	return _p27._1;
};
var _Fresheyeball$elm_tuple_extra$Tuple3$first = function (_p28) {
	var _p29 = _p28;
	return _p29._0;
};

//import Native.List //

var _elm_lang$core$Native_Array = function() {

// A RRB-Tree has two distinct data types.
// Leaf -> "height"  is always 0
//         "table"   is an array of elements
// Node -> "height"  is always greater than 0
//         "table"   is an array of child nodes
//         "lengths" is an array of accumulated lengths of the child nodes

// M is the maximal table size. 32 seems fast. E is the allowed increase
// of search steps when concatting to find an index. Lower values will
// decrease balancing, but will increase search steps.
var M = 32;
var E = 2;

// An empty array.
var empty = {
	ctor: '_Array',
	height: 0,
	table: []
};


function get(i, array)
{
	if (i < 0 || i >= length(array))
	{
		throw new Error(
			'Index ' + i + ' is out of range. Check the length of ' +
			'your array first or use getMaybe or getWithDefault.');
	}
	return unsafeGet(i, array);
}


function unsafeGet(i, array)
{
	for (var x = array.height; x > 0; x--)
	{
		var slot = i >> (x * 5);
		while (array.lengths[slot] <= i)
		{
			slot++;
		}
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array = array.table[slot];
	}
	return array.table[i];
}


// Sets the value at the index i. Only the nodes leading to i will get
// copied and updated.
function set(i, item, array)
{
	if (i < 0 || length(array) <= i)
	{
		return array;
	}
	return unsafeSet(i, item, array);
}


function unsafeSet(i, item, array)
{
	array = nodeCopy(array);

	if (array.height === 0)
	{
		array.table[i] = item;
	}
	else
	{
		var slot = getSlot(i, array);
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array.table[slot] = unsafeSet(i, item, array.table[slot]);
	}
	return array;
}


function initialize(len, f)
{
	if (len <= 0)
	{
		return empty;
	}
	var h = Math.floor( Math.log(len) / Math.log(M) );
	return initialize_(f, h, 0, len);
}

function initialize_(f, h, from, to)
{
	if (h === 0)
	{
		var table = new Array((to - from) % (M + 1));
		for (var i = 0; i < table.length; i++)
		{
		  table[i] = f(from + i);
		}
		return {
			ctor: '_Array',
			height: 0,
			table: table
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = initialize_(f, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i-1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

function fromList(list)
{
	if (list.ctor === '[]')
	{
		return empty;
	}

	// Allocate M sized blocks (table) and write list elements to it.
	var table = new Array(M);
	var nodes = [];
	var i = 0;

	while (list.ctor !== '[]')
	{
		table[i] = list._0;
		list = list._1;
		i++;

		// table is full, so we can push a leaf containing it into the
		// next node.
		if (i === M)
		{
			var leaf = {
				ctor: '_Array',
				height: 0,
				table: table
			};
			fromListPush(leaf, nodes);
			table = new Array(M);
			i = 0;
		}
	}

	// Maybe there is something left on the table.
	if (i > 0)
	{
		var leaf = {
			ctor: '_Array',
			height: 0,
			table: table.splice(0, i)
		};
		fromListPush(leaf, nodes);
	}

	// Go through all of the nodes and eventually push them into higher nodes.
	for (var h = 0; h < nodes.length - 1; h++)
	{
		if (nodes[h].table.length > 0)
		{
			fromListPush(nodes[h], nodes);
		}
	}

	var head = nodes[nodes.length - 1];
	if (head.height > 0 && head.table.length === 1)
	{
		return head.table[0];
	}
	else
	{
		return head;
	}
}

// Push a node into a higher node as a child.
function fromListPush(toPush, nodes)
{
	var h = toPush.height;

	// Maybe the node on this height does not exist.
	if (nodes.length === h)
	{
		var node = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
		nodes.push(node);
	}

	nodes[h].table.push(toPush);
	var len = length(toPush);
	if (nodes[h].lengths.length > 0)
	{
		len += nodes[h].lengths[nodes[h].lengths.length - 1];
	}
	nodes[h].lengths.push(len);

	if (nodes[h].table.length === M)
	{
		fromListPush(nodes[h], nodes);
		nodes[h] = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
	}
}

// Pushes an item via push_ to the bottom right of a tree.
function push(item, a)
{
	var pushed = push_(item, a);
	if (pushed !== null)
	{
		return pushed;
	}

	var newTree = create(item, a.height);
	return siblise(a, newTree);
}

// Recursively tries to push an item to the bottom-right most
// tree possible. If there is no space left for the item,
// null will be returned.
function push_(item, a)
{
	// Handle resursion stop at leaf level.
	if (a.height === 0)
	{
		if (a.table.length < M)
		{
			var newA = {
				ctor: '_Array',
				height: 0,
				table: a.table.slice()
			};
			newA.table.push(item);
			return newA;
		}
		else
		{
		  return null;
		}
	}

	// Recursively push
	var pushed = push_(item, botRight(a));

	// There was space in the bottom right tree, so the slot will
	// be updated.
	if (pushed !== null)
	{
		var newA = nodeCopy(a);
		newA.table[newA.table.length - 1] = pushed;
		newA.lengths[newA.lengths.length - 1]++;
		return newA;
	}

	// When there was no space left, check if there is space left
	// for a new slot with a tree which contains only the item
	// at the bottom.
	if (a.table.length < M)
	{
		var newSlot = create(item, a.height - 1);
		var newA = nodeCopy(a);
		newA.table.push(newSlot);
		newA.lengths.push(newA.lengths[newA.lengths.length - 1] + length(newSlot));
		return newA;
	}
	else
	{
		return null;
	}
}

// Converts an array into a list of elements.
function toList(a)
{
	return toList_(_elm_lang$core$Native_List.Nil, a);
}

function toList_(list, a)
{
	for (var i = a.table.length - 1; i >= 0; i--)
	{
		list =
			a.height === 0
				? _elm_lang$core$Native_List.Cons(a.table[i], list)
				: toList_(list, a.table[i]);
	}
	return list;
}

// Maps a function over the elements of an array.
function map(f, a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? f(a.table[i])
				: map(f, a.table[i]);
	}
	return newA;
}

// Maps a function over the elements with their index as first argument.
function indexedMap(f, a)
{
	return indexedMap_(f, a, 0);
}

function indexedMap_(f, a, from)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? A2(f, from + i, a.table[i])
				: indexedMap_(f, a.table[i], i == 0 ? from : from + a.lengths[i - 1]);
	}
	return newA;
}

function foldl(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = foldl(f, b, a.table[i]);
		}
	}
	return b;
}

function foldr(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = a.table.length; i--; )
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = a.table.length; i--; )
		{
			b = foldr(f, b, a.table[i]);
		}
	}
	return b;
}

// TODO: currently, it slices the right, then the left. This can be
// optimized.
function slice(from, to, a)
{
	if (from < 0)
	{
		from += length(a);
	}
	if (to < 0)
	{
		to += length(a);
	}
	return sliceLeft(from, sliceRight(to, a));
}

function sliceRight(to, a)
{
	if (to === length(a))
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(0, to);
		return newA;
	}

	// Slice the right recursively.
	var right = getSlot(to, a);
	var sliced = sliceRight(to - (right > 0 ? a.lengths[right - 1] : 0), a.table[right]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (right === 0)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(0, right),
		lengths: a.lengths.slice(0, right)
	};
	if (sliced.table.length > 0)
	{
		newA.table[right] = sliced;
		newA.lengths[right] = length(sliced) + (right > 0 ? newA.lengths[right - 1] : 0);
	}
	return newA;
}

function sliceLeft(from, a)
{
	if (from === 0)
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(from, a.table.length + 1);
		return newA;
	}

	// Slice the left recursively.
	var left = getSlot(from, a);
	var sliced = sliceLeft(from - (left > 0 ? a.lengths[left - 1] : 0), a.table[left]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (left === a.table.length - 1)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(left, a.table.length + 1),
		lengths: new Array(a.table.length - left)
	};
	newA.table[0] = sliced;
	var len = 0;
	for (var i = 0; i < newA.table.length; i++)
	{
		len += length(newA.table[i]);
		newA.lengths[i] = len;
	}

	return newA;
}

// Appends two trees.
function append(a,b)
{
	if (a.table.length === 0)
	{
		return b;
	}
	if (b.table.length === 0)
	{
		return a;
	}

	var c = append_(a, b);

	// Check if both nodes can be crunshed together.
	if (c[0].table.length + c[1].table.length <= M)
	{
		if (c[0].table.length === 0)
		{
			return c[1];
		}
		if (c[1].table.length === 0)
		{
			return c[0];
		}

		// Adjust .table and .lengths
		c[0].table = c[0].table.concat(c[1].table);
		if (c[0].height > 0)
		{
			var len = length(c[0]);
			for (var i = 0; i < c[1].lengths.length; i++)
			{
				c[1].lengths[i] += len;
			}
			c[0].lengths = c[0].lengths.concat(c[1].lengths);
		}

		return c[0];
	}

	if (c[0].height > 0)
	{
		var toRemove = calcToRemove(a, b);
		if (toRemove > E)
		{
			c = shuffle(c[0], c[1], toRemove);
		}
	}

	return siblise(c[0], c[1]);
}

// Returns an array of two nodes; right and left. One node _may_ be empty.
function append_(a, b)
{
	if (a.height === 0 && b.height === 0)
	{
		return [a, b];
	}

	if (a.height !== 1 || b.height !== 1)
	{
		if (a.height === b.height)
		{
			a = nodeCopy(a);
			b = nodeCopy(b);
			var appended = append_(botRight(a), botLeft(b));

			insertRight(a, appended[1]);
			insertLeft(b, appended[0]);
		}
		else if (a.height > b.height)
		{
			a = nodeCopy(a);
			var appended = append_(botRight(a), b);

			insertRight(a, appended[0]);
			b = parentise(appended[1], appended[1].height + 1);
		}
		else
		{
			b = nodeCopy(b);
			var appended = append_(a, botLeft(b));

			var left = appended[0].table.length === 0 ? 0 : 1;
			var right = left === 0 ? 1 : 0;
			insertLeft(b, appended[left]);
			a = parentise(appended[right], appended[right].height + 1);
		}
	}

	// Check if balancing is needed and return based on that.
	if (a.table.length === 0 || b.table.length === 0)
	{
		return [a, b];
	}

	var toRemove = calcToRemove(a, b);
	if (toRemove <= E)
	{
		return [a, b];
	}
	return shuffle(a, b, toRemove);
}

// Helperfunctions for append_. Replaces a child node at the side of the parent.
function insertRight(parent, node)
{
	var index = parent.table.length - 1;
	parent.table[index] = node;
	parent.lengths[index] = length(node);
	parent.lengths[index] += index > 0 ? parent.lengths[index - 1] : 0;
}

function insertLeft(parent, node)
{
	if (node.table.length > 0)
	{
		parent.table[0] = node;
		parent.lengths[0] = length(node);

		var len = length(parent.table[0]);
		for (var i = 1; i < parent.lengths.length; i++)
		{
			len += length(parent.table[i]);
			parent.lengths[i] = len;
		}
	}
	else
	{
		parent.table.shift();
		for (var i = 1; i < parent.lengths.length; i++)
		{
			parent.lengths[i] = parent.lengths[i] - parent.lengths[0];
		}
		parent.lengths.shift();
	}
}

// Returns the extra search steps for E. Refer to the paper.
function calcToRemove(a, b)
{
	var subLengths = 0;
	for (var i = 0; i < a.table.length; i++)
	{
		subLengths += a.table[i].table.length;
	}
	for (var i = 0; i < b.table.length; i++)
	{
		subLengths += b.table[i].table.length;
	}

	var toRemove = a.table.length + b.table.length;
	return toRemove - (Math.floor((subLengths - 1) / M) + 1);
}

// get2, set2 and saveSlot are helpers for accessing elements over two arrays.
function get2(a, b, index)
{
	return index < a.length
		? a[index]
		: b[index - a.length];
}

function set2(a, b, index, value)
{
	if (index < a.length)
	{
		a[index] = value;
	}
	else
	{
		b[index - a.length] = value;
	}
}

function saveSlot(a, b, index, slot)
{
	set2(a.table, b.table, index, slot);

	var l = (index === 0 || index === a.lengths.length)
		? 0
		: get2(a.lengths, a.lengths, index - 1);

	set2(a.lengths, b.lengths, index, l + length(slot));
}

// Creates a node or leaf with a given length at their arrays for perfomance.
// Is only used by shuffle.
function createNode(h, length)
{
	if (length < 0)
	{
		length = 0;
	}
	var a = {
		ctor: '_Array',
		height: h,
		table: new Array(length)
	};
	if (h > 0)
	{
		a.lengths = new Array(length);
	}
	return a;
}

// Returns an array of two balanced nodes.
function shuffle(a, b, toRemove)
{
	var newA = createNode(a.height, Math.min(M, a.table.length + b.table.length - toRemove));
	var newB = createNode(a.height, newA.table.length - (a.table.length + b.table.length - toRemove));

	// Skip the slots with size M. More precise: copy the slot references
	// to the new node
	var read = 0;
	while (get2(a.table, b.table, read).table.length % M === 0)
	{
		set2(newA.table, newB.table, read, get2(a.table, b.table, read));
		set2(newA.lengths, newB.lengths, read, get2(a.lengths, b.lengths, read));
		read++;
	}

	// Pulling items from left to right, caching in a slot before writing
	// it into the new nodes.
	var write = read;
	var slot = new createNode(a.height - 1, 0);
	var from = 0;

	// If the current slot is still containing data, then there will be at
	// least one more write, so we do not break this loop yet.
	while (read - write - (slot.table.length > 0 ? 1 : 0) < toRemove)
	{
		// Find out the max possible items for copying.
		var source = get2(a.table, b.table, read);
		var to = Math.min(M - slot.table.length, source.table.length);

		// Copy and adjust size table.
		slot.table = slot.table.concat(source.table.slice(from, to));
		if (slot.height > 0)
		{
			var len = slot.lengths.length;
			for (var i = len; i < len + to - from; i++)
			{
				slot.lengths[i] = length(slot.table[i]);
				slot.lengths[i] += (i > 0 ? slot.lengths[i - 1] : 0);
			}
		}

		from += to;

		// Only proceed to next slots[i] if the current one was
		// fully copied.
		if (source.table.length <= to)
		{
			read++; from = 0;
		}

		// Only create a new slot if the current one is filled up.
		if (slot.table.length === M)
		{
			saveSlot(newA, newB, write, slot);
			slot = createNode(a.height - 1, 0);
			write++;
		}
	}

	// Cleanup after the loop. Copy the last slot into the new nodes.
	if (slot.table.length > 0)
	{
		saveSlot(newA, newB, write, slot);
		write++;
	}

	// Shift the untouched slots to the left
	while (read < a.table.length + b.table.length )
	{
		saveSlot(newA, newB, write, get2(a.table, b.table, read));
		read++;
		write++;
	}

	return [newA, newB];
}

// Navigation functions
function botRight(a)
{
	return a.table[a.table.length - 1];
}
function botLeft(a)
{
	return a.table[0];
}

// Copies a node for updating. Note that you should not use this if
// only updating only one of "table" or "lengths" for performance reasons.
function nodeCopy(a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice()
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths.slice();
	}
	return newA;
}

// Returns how many items are in the tree.
function length(array)
{
	if (array.height === 0)
	{
		return array.table.length;
	}
	else
	{
		return array.lengths[array.lengths.length - 1];
	}
}

// Calculates in which slot of "table" the item probably is, then
// find the exact slot via forward searching in  "lengths". Returns the index.
function getSlot(i, a)
{
	var slot = i >> (5 * a.height);
	while (a.lengths[slot] <= i)
	{
		slot++;
	}
	return slot;
}

// Recursively creates a tree with a given height containing
// only the given item.
function create(item, h)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: [item]
		};
	}
	return {
		ctor: '_Array',
		height: h,
		table: [create(item, h - 1)],
		lengths: [1]
	};
}

// Recursively creates a tree that contains the given tree.
function parentise(tree, h)
{
	if (h === tree.height)
	{
		return tree;
	}

	return {
		ctor: '_Array',
		height: h,
		table: [parentise(tree, h - 1)],
		lengths: [length(tree)]
	};
}

// Emphasizes blood brotherhood beneath two trees.
function siblise(a, b)
{
	return {
		ctor: '_Array',
		height: a.height + 1,
		table: [a, b],
		lengths: [length(a), length(a) + length(b)]
	};
}

function toJSArray(a)
{
	var jsArray = new Array(length(a));
	toJSArray_(jsArray, 0, a);
	return jsArray;
}

function toJSArray_(jsArray, i, a)
{
	for (var t = 0; t < a.table.length; t++)
	{
		if (a.height === 0)
		{
			jsArray[i + t] = a.table[t];
		}
		else
		{
			var inc = t === 0 ? 0 : a.lengths[t - 1];
			toJSArray_(jsArray, i + inc, a.table[t]);
		}
	}
}

function fromJSArray(jsArray)
{
	if (jsArray.length === 0)
	{
		return empty;
	}
	var h = Math.floor(Math.log(jsArray.length) / Math.log(M));
	return fromJSArray_(jsArray, h, 0, jsArray.length);
}

function fromJSArray_(jsArray, h, from, to)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: jsArray.slice(from, to)
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = fromJSArray_(jsArray, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i - 1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

return {
	empty: empty,
	fromList: fromList,
	toList: toList,
	initialize: F2(initialize),
	append: F2(append),
	push: F2(push),
	slice: F3(slice),
	get: F2(get),
	set: F3(set),
	map: F2(map),
	indexedMap: F2(indexedMap),
	foldl: F3(foldl),
	foldr: F3(foldr),
	length: length,

	toJSArray: toJSArray,
	fromJSArray: fromJSArray
};

}();
var _elm_lang$core$Array$append = _elm_lang$core$Native_Array.append;
var _elm_lang$core$Array$length = _elm_lang$core$Native_Array.length;
var _elm_lang$core$Array$isEmpty = function (array) {
	return _elm_lang$core$Native_Utils.eq(
		_elm_lang$core$Array$length(array),
		0);
};
var _elm_lang$core$Array$slice = _elm_lang$core$Native_Array.slice;
var _elm_lang$core$Array$set = _elm_lang$core$Native_Array.set;
var _elm_lang$core$Array$get = F2(
	function (i, array) {
		return ((_elm_lang$core$Native_Utils.cmp(0, i) < 1) && (_elm_lang$core$Native_Utils.cmp(
			i,
			_elm_lang$core$Native_Array.length(array)) < 0)) ? _elm_lang$core$Maybe$Just(
			A2(_elm_lang$core$Native_Array.get, i, array)) : _elm_lang$core$Maybe$Nothing;
	});
var _elm_lang$core$Array$push = _elm_lang$core$Native_Array.push;
var _elm_lang$core$Array$empty = _elm_lang$core$Native_Array.empty;
var _elm_lang$core$Array$filter = F2(
	function (isOkay, arr) {
		var update = F2(
			function (x, xs) {
				return isOkay(x) ? A2(_elm_lang$core$Native_Array.push, x, xs) : xs;
			});
		return A3(_elm_lang$core$Native_Array.foldl, update, _elm_lang$core$Native_Array.empty, arr);
	});
var _elm_lang$core$Array$foldr = _elm_lang$core$Native_Array.foldr;
var _elm_lang$core$Array$foldl = _elm_lang$core$Native_Array.foldl;
var _elm_lang$core$Array$indexedMap = _elm_lang$core$Native_Array.indexedMap;
var _elm_lang$core$Array$map = _elm_lang$core$Native_Array.map;
var _elm_lang$core$Array$toIndexedList = function (array) {
	return A3(
		_elm_lang$core$List$map2,
		F2(
			function (v0, v1) {
				return {ctor: '_Tuple2', _0: v0, _1: v1};
			}),
		A2(
			_elm_lang$core$List$range,
			0,
			_elm_lang$core$Native_Array.length(array) - 1),
		_elm_lang$core$Native_Array.toList(array));
};
var _elm_lang$core$Array$toList = _elm_lang$core$Native_Array.toList;
var _elm_lang$core$Array$fromList = _elm_lang$core$Native_Array.fromList;
var _elm_lang$core$Array$initialize = _elm_lang$core$Native_Array.initialize;
var _elm_lang$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			_elm_lang$core$Array$initialize,
			n,
			_elm_lang$core$Basics$always(e));
	});
var _elm_lang$core$Array$Array = {ctor: 'Array'};

var _elm_lang$core$Dict$foldr = F3(
	function (f, acc, t) {
		foldr:
		while (true) {
			var _p0 = t;
			if (_p0.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v1 = f,
					_v2 = A3(
					f,
					_p0._1,
					_p0._2,
					A3(_elm_lang$core$Dict$foldr, f, acc, _p0._4)),
					_v3 = _p0._3;
				f = _v1;
				acc = _v2;
				t = _v3;
				continue foldr;
			}
		}
	});
var _elm_lang$core$Dict$keys = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return {ctor: '::', _0: key, _1: keyList};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$values = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return {ctor: '::', _0: value, _1: valueList};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$toList = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: key, _1: value},
					_1: list
				};
			}),
		{ctor: '[]'},
		dict);
};
var _elm_lang$core$Dict$foldl = F3(
	function (f, acc, dict) {
		foldl:
		while (true) {
			var _p1 = dict;
			if (_p1.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v5 = f,
					_v6 = A3(
					f,
					_p1._1,
					_p1._2,
					A3(_elm_lang$core$Dict$foldl, f, acc, _p1._3)),
					_v7 = _p1._4;
				f = _v5;
				acc = _v6;
				dict = _v7;
				continue foldl;
			}
		}
	});
var _elm_lang$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _p2) {
				stepState:
				while (true) {
					var _p3 = _p2;
					var _p9 = _p3._1;
					var _p8 = _p3._0;
					var _p4 = _p8;
					if (_p4.ctor === '[]') {
						return {
							ctor: '_Tuple2',
							_0: _p8,
							_1: A3(rightStep, rKey, rValue, _p9)
						};
					} else {
						var _p7 = _p4._1;
						var _p6 = _p4._0._1;
						var _p5 = _p4._0._0;
						if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) < 0) {
							var _v10 = rKey,
								_v11 = rValue,
								_v12 = {
								ctor: '_Tuple2',
								_0: _p7,
								_1: A3(leftStep, _p5, _p6, _p9)
							};
							rKey = _v10;
							rValue = _v11;
							_p2 = _v12;
							continue stepState;
						} else {
							if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) > 0) {
								return {
									ctor: '_Tuple2',
									_0: _p8,
									_1: A3(rightStep, rKey, rValue, _p9)
								};
							} else {
								return {
									ctor: '_Tuple2',
									_0: _p7,
									_1: A4(bothStep, _p5, _p6, rValue, _p9)
								};
							}
						}
					}
				}
			});
		var _p10 = A3(
			_elm_lang$core$Dict$foldl,
			stepState,
			{
				ctor: '_Tuple2',
				_0: _elm_lang$core$Dict$toList(leftDict),
				_1: initialResult
			},
			rightDict);
		var leftovers = _p10._0;
		var intermediateResult = _p10._1;
		return A3(
			_elm_lang$core$List$foldl,
			F2(
				function (_p11, result) {
					var _p12 = _p11;
					return A3(leftStep, _p12._0, _p12._1, result);
				}),
			intermediateResult,
			leftovers);
	});
var _elm_lang$core$Dict$reportRemBug = F4(
	function (msg, c, lgot, rgot) {
		return _elm_lang$core$Native_Debug.crash(
			_elm_lang$core$String$concat(
				{
					ctor: '::',
					_0: 'Internal red-black tree invariant violated, expected ',
					_1: {
						ctor: '::',
						_0: msg,
						_1: {
							ctor: '::',
							_0: ' and got ',
							_1: {
								ctor: '::',
								_0: _elm_lang$core$Basics$toString(c),
								_1: {
									ctor: '::',
									_0: '/',
									_1: {
										ctor: '::',
										_0: lgot,
										_1: {
											ctor: '::',
											_0: '/',
											_1: {
												ctor: '::',
												_0: rgot,
												_1: {
													ctor: '::',
													_0: '\nPlease report this bug to <https://github.com/elm-lang/core/issues>',
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}));
	});
var _elm_lang$core$Dict$isBBlack = function (dict) {
	var _p13 = dict;
	_v14_2:
	do {
		if (_p13.ctor === 'RBNode_elm_builtin') {
			if (_p13._0.ctor === 'BBlack') {
				return true;
			} else {
				break _v14_2;
			}
		} else {
			if (_p13._0.ctor === 'LBBlack') {
				return true;
			} else {
				break _v14_2;
			}
		}
	} while(false);
	return false;
};
var _elm_lang$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			var _p14 = dict;
			if (_p14.ctor === 'RBEmpty_elm_builtin') {
				return n;
			} else {
				var _v16 = A2(_elm_lang$core$Dict$sizeHelp, n + 1, _p14._4),
					_v17 = _p14._3;
				n = _v16;
				dict = _v17;
				continue sizeHelp;
			}
		}
	});
var _elm_lang$core$Dict$size = function (dict) {
	return A2(_elm_lang$core$Dict$sizeHelp, 0, dict);
};
var _elm_lang$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			var _p15 = dict;
			if (_p15.ctor === 'RBEmpty_elm_builtin') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				var _p16 = A2(_elm_lang$core$Basics$compare, targetKey, _p15._1);
				switch (_p16.ctor) {
					case 'LT':
						var _v20 = targetKey,
							_v21 = _p15._3;
						targetKey = _v20;
						dict = _v21;
						continue get;
					case 'EQ':
						return _elm_lang$core$Maybe$Just(_p15._2);
					default:
						var _v22 = targetKey,
							_v23 = _p15._4;
						targetKey = _v22;
						dict = _v23;
						continue get;
				}
			}
		}
	});
var _elm_lang$core$Dict$member = F2(
	function (key, dict) {
		var _p17 = A2(_elm_lang$core$Dict$get, key, dict);
		if (_p17.ctor === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var _elm_lang$core$Dict$maxWithDefault = F3(
	function (k, v, r) {
		maxWithDefault:
		while (true) {
			var _p18 = r;
			if (_p18.ctor === 'RBEmpty_elm_builtin') {
				return {ctor: '_Tuple2', _0: k, _1: v};
			} else {
				var _v26 = _p18._1,
					_v27 = _p18._2,
					_v28 = _p18._4;
				k = _v26;
				v = _v27;
				r = _v28;
				continue maxWithDefault;
			}
		}
	});
var _elm_lang$core$Dict$NBlack = {ctor: 'NBlack'};
var _elm_lang$core$Dict$BBlack = {ctor: 'BBlack'};
var _elm_lang$core$Dict$Black = {ctor: 'Black'};
var _elm_lang$core$Dict$blackish = function (t) {
	var _p19 = t;
	if (_p19.ctor === 'RBNode_elm_builtin') {
		var _p20 = _p19._0;
		return _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$Black) || _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$BBlack);
	} else {
		return true;
	}
};
var _elm_lang$core$Dict$Red = {ctor: 'Red'};
var _elm_lang$core$Dict$moreBlack = function (color) {
	var _p21 = color;
	switch (_p21.ctor) {
		case 'Black':
			return _elm_lang$core$Dict$BBlack;
		case 'Red':
			return _elm_lang$core$Dict$Black;
		case 'NBlack':
			return _elm_lang$core$Dict$Red;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a double black node more black!');
	}
};
var _elm_lang$core$Dict$lessBlack = function (color) {
	var _p22 = color;
	switch (_p22.ctor) {
		case 'BBlack':
			return _elm_lang$core$Dict$Black;
		case 'Black':
			return _elm_lang$core$Dict$Red;
		case 'Red':
			return _elm_lang$core$Dict$NBlack;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a negative black node less black!');
	}
};
var _elm_lang$core$Dict$LBBlack = {ctor: 'LBBlack'};
var _elm_lang$core$Dict$LBlack = {ctor: 'LBlack'};
var _elm_lang$core$Dict$RBEmpty_elm_builtin = function (a) {
	return {ctor: 'RBEmpty_elm_builtin', _0: a};
};
var _elm_lang$core$Dict$empty = _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
var _elm_lang$core$Dict$isEmpty = function (dict) {
	return _elm_lang$core$Native_Utils.eq(dict, _elm_lang$core$Dict$empty);
};
var _elm_lang$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {ctor: 'RBNode_elm_builtin', _0: a, _1: b, _2: c, _3: d, _4: e};
	});
var _elm_lang$core$Dict$ensureBlackRoot = function (dict) {
	var _p23 = dict;
	if ((_p23.ctor === 'RBNode_elm_builtin') && (_p23._0.ctor === 'Red')) {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p23._1, _p23._2, _p23._3, _p23._4);
	} else {
		return dict;
	}
};
var _elm_lang$core$Dict$lessBlackTree = function (dict) {
	var _p24 = dict;
	if (_p24.ctor === 'RBNode_elm_builtin') {
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$lessBlack(_p24._0),
			_p24._1,
			_p24._2,
			_p24._3,
			_p24._4);
	} else {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	}
};
var _elm_lang$core$Dict$balancedTree = function (col) {
	return function (xk) {
		return function (xv) {
			return function (yk) {
				return function (yv) {
					return function (zk) {
						return function (zv) {
							return function (a) {
								return function (b) {
									return function (c) {
										return function (d) {
											return A5(
												_elm_lang$core$Dict$RBNode_elm_builtin,
												_elm_lang$core$Dict$lessBlack(col),
												yk,
												yv,
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, xk, xv, a, b),
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, zk, zv, c, d));
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _elm_lang$core$Dict$blacken = function (t) {
	var _p25 = t;
	if (_p25.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p25._1, _p25._2, _p25._3, _p25._4);
	}
};
var _elm_lang$core$Dict$redden = function (t) {
	var _p26 = t;
	if (_p26.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Native_Debug.crash('can\'t make a Leaf red');
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, _p26._1, _p26._2, _p26._3, _p26._4);
	}
};
var _elm_lang$core$Dict$balanceHelp = function (tree) {
	var _p27 = tree;
	_v36_6:
	do {
		_v36_5:
		do {
			_v36_4:
			do {
				_v36_3:
				do {
					_v36_2:
					do {
						_v36_1:
						do {
							_v36_0:
							do {
								if (_p27.ctor === 'RBNode_elm_builtin') {
									if (_p27._3.ctor === 'RBNode_elm_builtin') {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._3._0.ctor) {
												case 'Red':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																		break _v36_2;
																	} else {
																		if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																			break _v36_3;
																		} else {
																			break _v36_6;
																		}
																	}
																}
															}
														case 'NBlack':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																		break _v36_4;
																	} else {
																		break _v36_6;
																	}
																}
															}
														default:
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v36_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v36_1;
																} else {
																	break _v36_6;
																}
															}
													}
												case 'NBlack':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v36_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v36_3;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v36_5;
																	} else {
																		break _v36_6;
																	}
																}
															}
														case 'NBlack':
															if (_p27._0.ctor === 'BBlack') {
																if ((((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																	break _v36_4;
																} else {
																	if ((((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v36_5;
																	} else {
																		break _v36_6;
																	}
																}
															} else {
																break _v36_6;
															}
														default:
															if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																break _v36_5;
															} else {
																break _v36_6;
															}
													}
												default:
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v36_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v36_3;
																} else {
																	break _v36_6;
																}
															}
														case 'NBlack':
															if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																break _v36_4;
															} else {
																break _v36_6;
															}
														default:
															break _v36_6;
													}
											}
										} else {
											switch (_p27._3._0.ctor) {
												case 'Red':
													if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
														break _v36_0;
													} else {
														if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
															break _v36_1;
														} else {
															break _v36_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
														break _v36_5;
													} else {
														break _v36_6;
													}
												default:
													break _v36_6;
											}
										}
									} else {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._4._0.ctor) {
												case 'Red':
													if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
														break _v36_2;
													} else {
														if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
															break _v36_3;
														} else {
															break _v36_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
														break _v36_4;
													} else {
														break _v36_6;
													}
												default:
													break _v36_6;
											}
										} else {
											break _v36_6;
										}
									}
								} else {
									break _v36_6;
								}
							} while(false);
							return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._3._1)(_p27._3._3._2)(_p27._3._1)(_p27._3._2)(_p27._1)(_p27._2)(_p27._3._3._3)(_p27._3._3._4)(_p27._3._4)(_p27._4);
						} while(false);
						return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._1)(_p27._3._2)(_p27._3._4._1)(_p27._3._4._2)(_p27._1)(_p27._2)(_p27._3._3)(_p27._3._4._3)(_p27._3._4._4)(_p27._4);
					} while(false);
					return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._3._1)(_p27._4._3._2)(_p27._4._1)(_p27._4._2)(_p27._3)(_p27._4._3._3)(_p27._4._3._4)(_p27._4._4);
				} while(false);
				return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._1)(_p27._4._2)(_p27._4._4._1)(_p27._4._4._2)(_p27._3)(_p27._4._3)(_p27._4._4._3)(_p27._4._4._4);
			} while(false);
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_elm_lang$core$Dict$Black,
				_p27._4._3._1,
				_p27._4._3._2,
				A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3, _p27._4._3._3),
				A5(
					_elm_lang$core$Dict$balance,
					_elm_lang$core$Dict$Black,
					_p27._4._1,
					_p27._4._2,
					_p27._4._3._4,
					_elm_lang$core$Dict$redden(_p27._4._4)));
		} while(false);
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$Black,
			_p27._3._4._1,
			_p27._3._4._2,
			A5(
				_elm_lang$core$Dict$balance,
				_elm_lang$core$Dict$Black,
				_p27._3._1,
				_p27._3._2,
				_elm_lang$core$Dict$redden(_p27._3._3),
				_p27._3._4._3),
			A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3._4._4, _p27._4));
	} while(false);
	return tree;
};
var _elm_lang$core$Dict$balance = F5(
	function (c, k, v, l, r) {
		var tree = A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
		return _elm_lang$core$Dict$blackish(tree) ? _elm_lang$core$Dict$balanceHelp(tree) : tree;
	});
var _elm_lang$core$Dict$bubble = F5(
	function (c, k, v, l, r) {
		return (_elm_lang$core$Dict$isBBlack(l) || _elm_lang$core$Dict$isBBlack(r)) ? A5(
			_elm_lang$core$Dict$balance,
			_elm_lang$core$Dict$moreBlack(c),
			k,
			v,
			_elm_lang$core$Dict$lessBlackTree(l),
			_elm_lang$core$Dict$lessBlackTree(r)) : A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
	});
var _elm_lang$core$Dict$removeMax = F5(
	function (c, k, v, l, r) {
		var _p28 = r;
		if (_p28.ctor === 'RBEmpty_elm_builtin') {
			return A3(_elm_lang$core$Dict$rem, c, l, r);
		} else {
			return A5(
				_elm_lang$core$Dict$bubble,
				c,
				k,
				v,
				l,
				A5(_elm_lang$core$Dict$removeMax, _p28._0, _p28._1, _p28._2, _p28._3, _p28._4));
		}
	});
var _elm_lang$core$Dict$rem = F3(
	function (color, left, right) {
		var _p29 = {ctor: '_Tuple2', _0: left, _1: right};
		if (_p29._0.ctor === 'RBEmpty_elm_builtin') {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p30 = color;
				switch (_p30.ctor) {
					case 'Red':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
					case 'Black':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBBlack);
					default:
						return _elm_lang$core$Native_Debug.crash('cannot have bblack or nblack nodes at this point');
				}
			} else {
				var _p33 = _p29._1._0;
				var _p32 = _p29._0._0;
				var _p31 = {ctor: '_Tuple3', _0: color, _1: _p32, _2: _p33};
				if ((((_p31.ctor === '_Tuple3') && (_p31._0.ctor === 'Black')) && (_p31._1.ctor === 'LBlack')) && (_p31._2.ctor === 'Red')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._1._1, _p29._1._2, _p29._1._3, _p29._1._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/LBlack/Red',
						color,
						_elm_lang$core$Basics$toString(_p32),
						_elm_lang$core$Basics$toString(_p33));
				}
			}
		} else {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p36 = _p29._1._0;
				var _p35 = _p29._0._0;
				var _p34 = {ctor: '_Tuple3', _0: color, _1: _p35, _2: _p36};
				if ((((_p34.ctor === '_Tuple3') && (_p34._0.ctor === 'Black')) && (_p34._1.ctor === 'Red')) && (_p34._2.ctor === 'LBlack')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._0._1, _p29._0._2, _p29._0._3, _p29._0._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/Red/LBlack',
						color,
						_elm_lang$core$Basics$toString(_p35),
						_elm_lang$core$Basics$toString(_p36));
				}
			} else {
				var _p40 = _p29._0._2;
				var _p39 = _p29._0._4;
				var _p38 = _p29._0._1;
				var newLeft = A5(_elm_lang$core$Dict$removeMax, _p29._0._0, _p38, _p40, _p29._0._3, _p39);
				var _p37 = A3(_elm_lang$core$Dict$maxWithDefault, _p38, _p40, _p39);
				var k = _p37._0;
				var v = _p37._1;
				return A5(_elm_lang$core$Dict$bubble, color, k, v, newLeft, right);
			}
		}
	});
var _elm_lang$core$Dict$map = F2(
	function (f, dict) {
		var _p41 = dict;
		if (_p41.ctor === 'RBEmpty_elm_builtin') {
			return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
		} else {
			var _p42 = _p41._1;
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_p41._0,
				_p42,
				A2(f, _p42, _p41._2),
				A2(_elm_lang$core$Dict$map, f, _p41._3),
				A2(_elm_lang$core$Dict$map, f, _p41._4));
		}
	});
var _elm_lang$core$Dict$Same = {ctor: 'Same'};
var _elm_lang$core$Dict$Remove = {ctor: 'Remove'};
var _elm_lang$core$Dict$Insert = {ctor: 'Insert'};
var _elm_lang$core$Dict$update = F3(
	function (k, alter, dict) {
		var up = function (dict) {
			var _p43 = dict;
			if (_p43.ctor === 'RBEmpty_elm_builtin') {
				var _p44 = alter(_elm_lang$core$Maybe$Nothing);
				if (_p44.ctor === 'Nothing') {
					return {ctor: '_Tuple2', _0: _elm_lang$core$Dict$Same, _1: _elm_lang$core$Dict$empty};
				} else {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Dict$Insert,
						_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, k, _p44._0, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty)
					};
				}
			} else {
				var _p55 = _p43._2;
				var _p54 = _p43._4;
				var _p53 = _p43._3;
				var _p52 = _p43._1;
				var _p51 = _p43._0;
				var _p45 = A2(_elm_lang$core$Basics$compare, k, _p52);
				switch (_p45.ctor) {
					case 'EQ':
						var _p46 = alter(
							_elm_lang$core$Maybe$Just(_p55));
						if (_p46.ctor === 'Nothing') {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Remove,
								_1: A3(_elm_lang$core$Dict$rem, _p51, _p53, _p54)
							};
						} else {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Same,
								_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p46._0, _p53, _p54)
							};
						}
					case 'LT':
						var _p47 = up(_p53);
						var flag = _p47._0;
						var newLeft = _p47._1;
						var _p48 = flag;
						switch (_p48.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, newLeft, _p54)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, newLeft, _p54)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, newLeft, _p54)
								};
						}
					default:
						var _p49 = up(_p54);
						var flag = _p49._0;
						var newRight = _p49._1;
						var _p50 = flag;
						switch (_p50.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, _p53, newRight)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, _p53, newRight)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, _p53, newRight)
								};
						}
				}
			}
		};
		var _p56 = up(dict);
		var flag = _p56._0;
		var updatedDict = _p56._1;
		var _p57 = flag;
		switch (_p57.ctor) {
			case 'Same':
				return updatedDict;
			case 'Insert':
				return _elm_lang$core$Dict$ensureBlackRoot(updatedDict);
			default:
				return _elm_lang$core$Dict$blacken(updatedDict);
		}
	});
var _elm_lang$core$Dict$insert = F3(
	function (key, value, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(
				_elm_lang$core$Maybe$Just(value)),
			dict);
	});
var _elm_lang$core$Dict$singleton = F2(
	function (key, value) {
		return A3(_elm_lang$core$Dict$insert, key, value, _elm_lang$core$Dict$empty);
	});
var _elm_lang$core$Dict$union = F2(
	function (t1, t2) {
		return A3(_elm_lang$core$Dict$foldl, _elm_lang$core$Dict$insert, t2, t1);
	});
var _elm_lang$core$Dict$filter = F2(
	function (predicate, dictionary) {
		var add = F3(
			function (key, value, dict) {
				return A2(predicate, key, value) ? A3(_elm_lang$core$Dict$insert, key, value, dict) : dict;
			});
		return A3(_elm_lang$core$Dict$foldl, add, _elm_lang$core$Dict$empty, dictionary);
	});
var _elm_lang$core$Dict$intersect = F2(
	function (t1, t2) {
		return A2(
			_elm_lang$core$Dict$filter,
			F2(
				function (k, _p58) {
					return A2(_elm_lang$core$Dict$member, k, t2);
				}),
			t1);
	});
var _elm_lang$core$Dict$partition = F2(
	function (predicate, dict) {
		var add = F3(
			function (key, value, _p59) {
				var _p60 = _p59;
				var _p62 = _p60._1;
				var _p61 = _p60._0;
				return A2(predicate, key, value) ? {
					ctor: '_Tuple2',
					_0: A3(_elm_lang$core$Dict$insert, key, value, _p61),
					_1: _p62
				} : {
					ctor: '_Tuple2',
					_0: _p61,
					_1: A3(_elm_lang$core$Dict$insert, key, value, _p62)
				};
			});
		return A3(
			_elm_lang$core$Dict$foldl,
			add,
			{ctor: '_Tuple2', _0: _elm_lang$core$Dict$empty, _1: _elm_lang$core$Dict$empty},
			dict);
	});
var _elm_lang$core$Dict$fromList = function (assocs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p63, dict) {
				var _p64 = _p63;
				return A3(_elm_lang$core$Dict$insert, _p64._0, _p64._1, dict);
			}),
		_elm_lang$core$Dict$empty,
		assocs);
};
var _elm_lang$core$Dict$remove = F2(
	function (key, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(_elm_lang$core$Maybe$Nothing),
			dict);
	});
var _elm_lang$core$Dict$diff = F2(
	function (t1, t2) {
		return A3(
			_elm_lang$core$Dict$foldl,
			F3(
				function (k, v, t) {
					return A2(_elm_lang$core$Dict$remove, k, t);
				}),
			t1,
			t2);
	});

//import Maybe, Native.Array, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_Json = function() {


// CORE DECODERS

function succeed(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'succeed',
		msg: msg
	};
}

function fail(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'fail',
		msg: msg
	};
}

function decodePrimitive(tag)
{
	return {
		ctor: '<decoder>',
		tag: tag
	};
}

function decodeContainer(tag, decoder)
{
	return {
		ctor: '<decoder>',
		tag: tag,
		decoder: decoder
	};
}

function decodeNull(value)
{
	return {
		ctor: '<decoder>',
		tag: 'null',
		value: value
	};
}

function decodeField(field, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'field',
		field: field,
		decoder: decoder
	};
}

function decodeIndex(index, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'index',
		index: index,
		decoder: decoder
	};
}

function decodeKeyValuePairs(decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'key-value',
		decoder: decoder
	};
}

function mapMany(f, decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'map-many',
		func: f,
		decoders: decoders
	};
}

function andThen(callback, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'andThen',
		decoder: decoder,
		callback: callback
	};
}

function oneOf(decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'oneOf',
		decoders: decoders
	};
}


// DECODING OBJECTS

function map1(f, d1)
{
	return mapMany(f, [d1]);
}

function map2(f, d1, d2)
{
	return mapMany(f, [d1, d2]);
}

function map3(f, d1, d2, d3)
{
	return mapMany(f, [d1, d2, d3]);
}

function map4(f, d1, d2, d3, d4)
{
	return mapMany(f, [d1, d2, d3, d4]);
}

function map5(f, d1, d2, d3, d4, d5)
{
	return mapMany(f, [d1, d2, d3, d4, d5]);
}

function map6(f, d1, d2, d3, d4, d5, d6)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6]);
}

function map7(f, d1, d2, d3, d4, d5, d6, d7)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
}

function map8(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
}


// DECODE HELPERS

function ok(value)
{
	return { tag: 'ok', value: value };
}

function badPrimitive(type, value)
{
	return { tag: 'primitive', type: type, value: value };
}

function badIndex(index, nestedProblems)
{
	return { tag: 'index', index: index, rest: nestedProblems };
}

function badField(field, nestedProblems)
{
	return { tag: 'field', field: field, rest: nestedProblems };
}

function badIndex(index, nestedProblems)
{
	return { tag: 'index', index: index, rest: nestedProblems };
}

function badOneOf(problems)
{
	return { tag: 'oneOf', problems: problems };
}

function bad(msg)
{
	return { tag: 'fail', msg: msg };
}

function badToString(problem)
{
	var context = '_';
	while (problem)
	{
		switch (problem.tag)
		{
			case 'primitive':
				return 'Expecting ' + problem.type
					+ (context === '_' ? '' : ' at ' + context)
					+ ' but instead got: ' + jsToString(problem.value);

			case 'index':
				context += '[' + problem.index + ']';
				problem = problem.rest;
				break;

			case 'field':
				context += '.' + problem.field;
				problem = problem.rest;
				break;

			case 'oneOf':
				var problems = problem.problems;
				for (var i = 0; i < problems.length; i++)
				{
					problems[i] = badToString(problems[i]);
				}
				return 'I ran into the following problems'
					+ (context === '_' ? '' : ' at ' + context)
					+ ':\n\n' + problems.join('\n');

			case 'fail':
				return 'I ran into a `fail` decoder'
					+ (context === '_' ? '' : ' at ' + context)
					+ ': ' + problem.msg;
		}
	}
}

function jsToString(value)
{
	return value === undefined
		? 'undefined'
		: JSON.stringify(value);
}


// DECODE

function runOnString(decoder, string)
{
	var json;
	try
	{
		json = JSON.parse(string);
	}
	catch (e)
	{
		return _elm_lang$core$Result$Err('Given an invalid JSON: ' + e.message);
	}
	return run(decoder, json);
}

function run(decoder, value)
{
	var result = runHelp(decoder, value);
	return (result.tag === 'ok')
		? _elm_lang$core$Result$Ok(result.value)
		: _elm_lang$core$Result$Err(badToString(result));
}

function runHelp(decoder, value)
{
	switch (decoder.tag)
	{
		case 'bool':
			return (typeof value === 'boolean')
				? ok(value)
				: badPrimitive('a Bool', value);

		case 'int':
			if (typeof value !== 'number') {
				return badPrimitive('an Int', value);
			}

			if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
				return ok(value);
			}

			if (isFinite(value) && !(value % 1)) {
				return ok(value);
			}

			return badPrimitive('an Int', value);

		case 'float':
			return (typeof value === 'number')
				? ok(value)
				: badPrimitive('a Float', value);

		case 'string':
			return (typeof value === 'string')
				? ok(value)
				: (value instanceof String)
					? ok(value + '')
					: badPrimitive('a String', value);

		case 'null':
			return (value === null)
				? ok(decoder.value)
				: badPrimitive('null', value);

		case 'value':
			return ok(value);

		case 'list':
			if (!(value instanceof Array))
			{
				return badPrimitive('a List', value);
			}

			var list = _elm_lang$core$Native_List.Nil;
			for (var i = value.length; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result)
				}
				list = _elm_lang$core$Native_List.Cons(result.value, list);
			}
			return ok(list);

		case 'array':
			if (!(value instanceof Array))
			{
				return badPrimitive('an Array', value);
			}

			var len = value.length;
			var array = new Array(len);
			for (var i = len; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result);
				}
				array[i] = result.value;
			}
			return ok(_elm_lang$core$Native_Array.fromJSArray(array));

		case 'maybe':
			var result = runHelp(decoder.decoder, value);
			return (result.tag === 'ok')
				? ok(_elm_lang$core$Maybe$Just(result.value))
				: ok(_elm_lang$core$Maybe$Nothing);

		case 'field':
			var field = decoder.field;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return badPrimitive('an object with a field named `' + field + '`', value);
			}

			var result = runHelp(decoder.decoder, value[field]);
			return (result.tag === 'ok') ? result : badField(field, result);

		case 'index':
			var index = decoder.index;
			if (!(value instanceof Array))
			{
				return badPrimitive('an array', value);
			}
			if (index >= value.length)
			{
				return badPrimitive('a longer array. Need index ' + index + ' but there are only ' + value.length + ' entries', value);
			}

			var result = runHelp(decoder.decoder, value[index]);
			return (result.tag === 'ok') ? result : badIndex(index, result);

		case 'key-value':
			if (typeof value !== 'object' || value === null || value instanceof Array)
			{
				return badPrimitive('an object', value);
			}

			var keyValuePairs = _elm_lang$core$Native_List.Nil;
			for (var key in value)
			{
				var result = runHelp(decoder.decoder, value[key]);
				if (result.tag !== 'ok')
				{
					return badField(key, result);
				}
				var pair = _elm_lang$core$Native_Utils.Tuple2(key, result.value);
				keyValuePairs = _elm_lang$core$Native_List.Cons(pair, keyValuePairs);
			}
			return ok(keyValuePairs);

		case 'map-many':
			var answer = decoder.func;
			var decoders = decoder.decoders;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = runHelp(decoders[i], value);
				if (result.tag !== 'ok')
				{
					return result;
				}
				answer = answer(result.value);
			}
			return ok(answer);

		case 'andThen':
			var result = runHelp(decoder.decoder, value);
			return (result.tag !== 'ok')
				? result
				: runHelp(decoder.callback(result.value), value);

		case 'oneOf':
			var errors = [];
			var temp = decoder.decoders;
			while (temp.ctor !== '[]')
			{
				var result = runHelp(temp._0, value);

				if (result.tag === 'ok')
				{
					return result;
				}

				errors.push(result);

				temp = temp._1;
			}
			return badOneOf(errors);

		case 'fail':
			return bad(decoder.msg);

		case 'succeed':
			return ok(decoder.msg);
	}
}


// EQUALITY

function equality(a, b)
{
	if (a === b)
	{
		return true;
	}

	if (a.tag !== b.tag)
	{
		return false;
	}

	switch (a.tag)
	{
		case 'succeed':
		case 'fail':
			return a.msg === b.msg;

		case 'bool':
		case 'int':
		case 'float':
		case 'string':
		case 'value':
			return true;

		case 'null':
			return a.value === b.value;

		case 'list':
		case 'array':
		case 'maybe':
		case 'key-value':
			return equality(a.decoder, b.decoder);

		case 'field':
			return a.field === b.field && equality(a.decoder, b.decoder);

		case 'index':
			return a.index === b.index && equality(a.decoder, b.decoder);

		case 'map-many':
			if (a.func !== b.func)
			{
				return false;
			}
			return listEquality(a.decoders, b.decoders);

		case 'andThen':
			return a.callback === b.callback && equality(a.decoder, b.decoder);

		case 'oneOf':
			return listEquality(a.decoders, b.decoders);
	}
}

function listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

function encode(indentLevel, value)
{
	return JSON.stringify(value, null, indentLevel);
}

function identity(value)
{
	return value;
}

function encodeObject(keyValuePairs)
{
	var obj = {};
	while (keyValuePairs.ctor !== '[]')
	{
		var pair = keyValuePairs._0;
		obj[pair._0] = pair._1;
		keyValuePairs = keyValuePairs._1;
	}
	return obj;
}

return {
	encode: F2(encode),
	runOnString: F2(runOnString),
	run: F2(run),

	decodeNull: decodeNull,
	decodePrimitive: decodePrimitive,
	decodeContainer: F2(decodeContainer),

	decodeField: F2(decodeField),
	decodeIndex: F2(decodeIndex),

	map1: F2(map1),
	map2: F3(map2),
	map3: F4(map3),
	map4: F5(map4),
	map5: F6(map5),
	map6: F7(map6),
	map7: F8(map7),
	map8: F9(map8),
	decodeKeyValuePairs: decodeKeyValuePairs,

	andThen: F2(andThen),
	fail: fail,
	succeed: succeed,
	oneOf: oneOf,

	identity: identity,
	encodeNull: null,
	encodeArray: _elm_lang$core$Native_Array.toJSArray,
	encodeList: _elm_lang$core$Native_List.toArray,
	encodeObject: encodeObject,

	equality: equality
};

}();

var _elm_lang$core$Json_Encode$list = _elm_lang$core$Native_Json.encodeList;
var _elm_lang$core$Json_Encode$array = _elm_lang$core$Native_Json.encodeArray;
var _elm_lang$core$Json_Encode$object = _elm_lang$core$Native_Json.encodeObject;
var _elm_lang$core$Json_Encode$null = _elm_lang$core$Native_Json.encodeNull;
var _elm_lang$core$Json_Encode$bool = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$float = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$int = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$string = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$encode = _elm_lang$core$Native_Json.encode;
var _elm_lang$core$Json_Encode$Value = {ctor: 'Value'};

var _elm_lang$core$Json_Decode$null = _elm_lang$core$Native_Json.decodeNull;
var _elm_lang$core$Json_Decode$value = _elm_lang$core$Native_Json.decodePrimitive('value');
var _elm_lang$core$Json_Decode$andThen = _elm_lang$core$Native_Json.andThen;
var _elm_lang$core$Json_Decode$fail = _elm_lang$core$Native_Json.fail;
var _elm_lang$core$Json_Decode$succeed = _elm_lang$core$Native_Json.succeed;
var _elm_lang$core$Json_Decode$lazy = function (thunk) {
	return A2(
		_elm_lang$core$Json_Decode$andThen,
		thunk,
		_elm_lang$core$Json_Decode$succeed(
			{ctor: '_Tuple0'}));
};
var _elm_lang$core$Json_Decode$decodeValue = _elm_lang$core$Native_Json.run;
var _elm_lang$core$Json_Decode$decodeString = _elm_lang$core$Native_Json.runOnString;
var _elm_lang$core$Json_Decode$map8 = _elm_lang$core$Native_Json.map8;
var _elm_lang$core$Json_Decode$map7 = _elm_lang$core$Native_Json.map7;
var _elm_lang$core$Json_Decode$map6 = _elm_lang$core$Native_Json.map6;
var _elm_lang$core$Json_Decode$map5 = _elm_lang$core$Native_Json.map5;
var _elm_lang$core$Json_Decode$map4 = _elm_lang$core$Native_Json.map4;
var _elm_lang$core$Json_Decode$map3 = _elm_lang$core$Native_Json.map3;
var _elm_lang$core$Json_Decode$map2 = _elm_lang$core$Native_Json.map2;
var _elm_lang$core$Json_Decode$map = _elm_lang$core$Native_Json.map1;
var _elm_lang$core$Json_Decode$oneOf = _elm_lang$core$Native_Json.oneOf;
var _elm_lang$core$Json_Decode$maybe = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'maybe', decoder);
};
var _elm_lang$core$Json_Decode$index = _elm_lang$core$Native_Json.decodeIndex;
var _elm_lang$core$Json_Decode$field = _elm_lang$core$Native_Json.decodeField;
var _elm_lang$core$Json_Decode$at = F2(
	function (fields, decoder) {
		return A3(_elm_lang$core$List$foldr, _elm_lang$core$Json_Decode$field, decoder, fields);
	});
var _elm_lang$core$Json_Decode$keyValuePairs = _elm_lang$core$Native_Json.decodeKeyValuePairs;
var _elm_lang$core$Json_Decode$dict = function (decoder) {
	return A2(
		_elm_lang$core$Json_Decode$map,
		_elm_lang$core$Dict$fromList,
		_elm_lang$core$Json_Decode$keyValuePairs(decoder));
};
var _elm_lang$core$Json_Decode$array = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'array', decoder);
};
var _elm_lang$core$Json_Decode$list = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'list', decoder);
};
var _elm_lang$core$Json_Decode$nullable = function (decoder) {
	return _elm_lang$core$Json_Decode$oneOf(
		{
			ctor: '::',
			_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
			_1: {
				ctor: '::',
				_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, decoder),
				_1: {ctor: '[]'}
			}
		});
};
var _elm_lang$core$Json_Decode$float = _elm_lang$core$Native_Json.decodePrimitive('float');
var _elm_lang$core$Json_Decode$int = _elm_lang$core$Native_Json.decodePrimitive('int');
var _elm_lang$core$Json_Decode$bool = _elm_lang$core$Native_Json.decodePrimitive('bool');
var _elm_lang$core$Json_Decode$string = _elm_lang$core$Native_Json.decodePrimitive('string');
var _elm_lang$core$Json_Decode$Decoder = {ctor: 'Decoder'};

//import Result //

var _elm_lang$core$Native_Date = function() {

function fromString(str)
{
	var date = new Date(str);
	return isNaN(date.getTime())
		? _elm_lang$core$Result$Err('Unable to parse \'' + str + '\' as a date. Dates must be in the ISO 8601 format.')
		: _elm_lang$core$Result$Ok(date);
}

var dayTable = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var monthTable =
	['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


return {
	fromString: fromString,
	year: function(d) { return d.getFullYear(); },
	month: function(d) { return { ctor: monthTable[d.getMonth()] }; },
	day: function(d) { return d.getDate(); },
	hour: function(d) { return d.getHours(); },
	minute: function(d) { return d.getMinutes(); },
	second: function(d) { return d.getSeconds(); },
	millisecond: function(d) { return d.getMilliseconds(); },
	toTime: function(d) { return d.getTime(); },
	fromTime: function(t) { return new Date(t); },
	dayOfWeek: function(d) { return { ctor: dayTable[d.getDay()] }; }
};

}();
var _elm_lang$core$Task$onError = _elm_lang$core$Native_Scheduler.onError;
var _elm_lang$core$Task$andThen = _elm_lang$core$Native_Scheduler.andThen;
var _elm_lang$core$Task$spawnCmd = F2(
	function (router, _p0) {
		var _p1 = _p0;
		return _elm_lang$core$Native_Scheduler.spawn(
			A2(
				_elm_lang$core$Task$andThen,
				_elm_lang$core$Platform$sendToApp(router),
				_p1._0));
	});
var _elm_lang$core$Task$fail = _elm_lang$core$Native_Scheduler.fail;
var _elm_lang$core$Task$mapError = F2(
	function (convert, task) {
		return A2(
			_elm_lang$core$Task$onError,
			function (_p2) {
				return _elm_lang$core$Task$fail(
					convert(_p2));
			},
			task);
	});
var _elm_lang$core$Task$succeed = _elm_lang$core$Native_Scheduler.succeed;
var _elm_lang$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return _elm_lang$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var _elm_lang$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return _elm_lang$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$map3 = F4(
	function (func, taskA, taskB, taskC) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return A2(
							_elm_lang$core$Task$andThen,
							function (c) {
								return _elm_lang$core$Task$succeed(
									A3(func, a, b, c));
							},
							taskC);
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$map4 = F5(
	function (func, taskA, taskB, taskC, taskD) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return A2(
							_elm_lang$core$Task$andThen,
							function (c) {
								return A2(
									_elm_lang$core$Task$andThen,
									function (d) {
										return _elm_lang$core$Task$succeed(
											A4(func, a, b, c, d));
									},
									taskD);
							},
							taskC);
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$map5 = F6(
	function (func, taskA, taskB, taskC, taskD, taskE) {
		return A2(
			_elm_lang$core$Task$andThen,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					function (b) {
						return A2(
							_elm_lang$core$Task$andThen,
							function (c) {
								return A2(
									_elm_lang$core$Task$andThen,
									function (d) {
										return A2(
											_elm_lang$core$Task$andThen,
											function (e) {
												return _elm_lang$core$Task$succeed(
													A5(func, a, b, c, d, e));
											},
											taskE);
									},
									taskD);
							},
							taskC);
					},
					taskB);
			},
			taskA);
	});
var _elm_lang$core$Task$sequence = function (tasks) {
	var _p3 = tasks;
	if (_p3.ctor === '[]') {
		return _elm_lang$core$Task$succeed(
			{ctor: '[]'});
	} else {
		return A3(
			_elm_lang$core$Task$map2,
			F2(
				function (x, y) {
					return {ctor: '::', _0: x, _1: y};
				}),
			_p3._0,
			_elm_lang$core$Task$sequence(_p3._1));
	}
};
var _elm_lang$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			_elm_lang$core$Task$map,
			function (_p4) {
				return {ctor: '_Tuple0'};
			},
			_elm_lang$core$Task$sequence(
				A2(
					_elm_lang$core$List$map,
					_elm_lang$core$Task$spawnCmd(router),
					commands)));
	});
var _elm_lang$core$Task$init = _elm_lang$core$Task$succeed(
	{ctor: '_Tuple0'});
var _elm_lang$core$Task$onSelfMsg = F3(
	function (_p7, _p6, _p5) {
		return _elm_lang$core$Task$succeed(
			{ctor: '_Tuple0'});
	});
var _elm_lang$core$Task$command = _elm_lang$core$Native_Platform.leaf('Task');
var _elm_lang$core$Task$Perform = function (a) {
	return {ctor: 'Perform', _0: a};
};
var _elm_lang$core$Task$perform = F2(
	function (toMessage, task) {
		return _elm_lang$core$Task$command(
			_elm_lang$core$Task$Perform(
				A2(_elm_lang$core$Task$map, toMessage, task)));
	});
var _elm_lang$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return _elm_lang$core$Task$command(
			_elm_lang$core$Task$Perform(
				A2(
					_elm_lang$core$Task$onError,
					function (_p8) {
						return _elm_lang$core$Task$succeed(
							resultToMessage(
								_elm_lang$core$Result$Err(_p8)));
					},
					A2(
						_elm_lang$core$Task$andThen,
						function (_p9) {
							return _elm_lang$core$Task$succeed(
								resultToMessage(
									_elm_lang$core$Result$Ok(_p9)));
						},
						task))));
	});
var _elm_lang$core$Task$cmdMap = F2(
	function (tagger, _p10) {
		var _p11 = _p10;
		return _elm_lang$core$Task$Perform(
			A2(_elm_lang$core$Task$map, tagger, _p11._0));
	});
_elm_lang$core$Native_Platform.effectManagers['Task'] = {pkg: 'elm-lang/core', init: _elm_lang$core$Task$init, onEffects: _elm_lang$core$Task$onEffects, onSelfMsg: _elm_lang$core$Task$onSelfMsg, tag: 'cmd', cmdMap: _elm_lang$core$Task$cmdMap};

//import Native.Scheduler //

var _elm_lang$core$Native_Time = function() {

var now = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
{
	callback(_elm_lang$core$Native_Scheduler.succeed(Date.now()));
});

function setInterval_(interval, task)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		var id = setInterval(function() {
			_elm_lang$core$Native_Scheduler.rawSpawn(task);
		}, interval);

		return function() { clearInterval(id); };
	});
}

return {
	now: now,
	setInterval_: F2(setInterval_)
};

}();
var _elm_lang$core$Time$setInterval = _elm_lang$core$Native_Time.setInterval_;
var _elm_lang$core$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		var _p0 = intervals;
		if (_p0.ctor === '[]') {
			return _elm_lang$core$Task$succeed(processes);
		} else {
			var _p1 = _p0._0;
			var spawnRest = function (id) {
				return A3(
					_elm_lang$core$Time$spawnHelp,
					router,
					_p0._1,
					A3(_elm_lang$core$Dict$insert, _p1, id, processes));
			};
			var spawnTimer = _elm_lang$core$Native_Scheduler.spawn(
				A2(
					_elm_lang$core$Time$setInterval,
					_p1,
					A2(_elm_lang$core$Platform$sendToSelf, router, _p1)));
			return A2(_elm_lang$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var _elm_lang$core$Time$addMySub = F2(
	function (_p2, state) {
		var _p3 = _p2;
		var _p6 = _p3._1;
		var _p5 = _p3._0;
		var _p4 = A2(_elm_lang$core$Dict$get, _p5, state);
		if (_p4.ctor === 'Nothing') {
			return A3(
				_elm_lang$core$Dict$insert,
				_p5,
				{
					ctor: '::',
					_0: _p6,
					_1: {ctor: '[]'}
				},
				state);
		} else {
			return A3(
				_elm_lang$core$Dict$insert,
				_p5,
				{ctor: '::', _0: _p6, _1: _p4._0},
				state);
		}
	});
var _elm_lang$core$Time$inMilliseconds = function (t) {
	return t;
};
var _elm_lang$core$Time$millisecond = 1;
var _elm_lang$core$Time$second = 1000 * _elm_lang$core$Time$millisecond;
var _elm_lang$core$Time$minute = 60 * _elm_lang$core$Time$second;
var _elm_lang$core$Time$hour = 60 * _elm_lang$core$Time$minute;
var _elm_lang$core$Time$inHours = function (t) {
	return t / _elm_lang$core$Time$hour;
};
var _elm_lang$core$Time$inMinutes = function (t) {
	return t / _elm_lang$core$Time$minute;
};
var _elm_lang$core$Time$inSeconds = function (t) {
	return t / _elm_lang$core$Time$second;
};
var _elm_lang$core$Time$now = _elm_lang$core$Native_Time.now;
var _elm_lang$core$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _p7 = A2(_elm_lang$core$Dict$get, interval, state.taggers);
		if (_p7.ctor === 'Nothing') {
			return _elm_lang$core$Task$succeed(state);
		} else {
			var tellTaggers = function (time) {
				return _elm_lang$core$Task$sequence(
					A2(
						_elm_lang$core$List$map,
						function (tagger) {
							return A2(
								_elm_lang$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						_p7._0));
			};
			return A2(
				_elm_lang$core$Task$andThen,
				function (_p8) {
					return _elm_lang$core$Task$succeed(state);
				},
				A2(_elm_lang$core$Task$andThen, tellTaggers, _elm_lang$core$Time$now));
		}
	});
var _elm_lang$core$Time$subscription = _elm_lang$core$Native_Platform.leaf('Time');
var _elm_lang$core$Time$State = F2(
	function (a, b) {
		return {taggers: a, processes: b};
	});
var _elm_lang$core$Time$init = _elm_lang$core$Task$succeed(
	A2(_elm_lang$core$Time$State, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty));
var _elm_lang$core$Time$onEffects = F3(
	function (router, subs, _p9) {
		var _p10 = _p9;
		var rightStep = F3(
			function (_p12, id, _p11) {
				var _p13 = _p11;
				return {
					ctor: '_Tuple3',
					_0: _p13._0,
					_1: _p13._1,
					_2: A2(
						_elm_lang$core$Task$andThen,
						function (_p14) {
							return _p13._2;
						},
						_elm_lang$core$Native_Scheduler.kill(id))
				};
			});
		var bothStep = F4(
			function (interval, taggers, id, _p15) {
				var _p16 = _p15;
				return {
					ctor: '_Tuple3',
					_0: _p16._0,
					_1: A3(_elm_lang$core$Dict$insert, interval, id, _p16._1),
					_2: _p16._2
				};
			});
		var leftStep = F3(
			function (interval, taggers, _p17) {
				var _p18 = _p17;
				return {
					ctor: '_Tuple3',
					_0: {ctor: '::', _0: interval, _1: _p18._0},
					_1: _p18._1,
					_2: _p18._2
				};
			});
		var newTaggers = A3(_elm_lang$core$List$foldl, _elm_lang$core$Time$addMySub, _elm_lang$core$Dict$empty, subs);
		var _p19 = A6(
			_elm_lang$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			_p10.processes,
			{
				ctor: '_Tuple3',
				_0: {ctor: '[]'},
				_1: _elm_lang$core$Dict$empty,
				_2: _elm_lang$core$Task$succeed(
					{ctor: '_Tuple0'})
			});
		var spawnList = _p19._0;
		var existingDict = _p19._1;
		var killTask = _p19._2;
		return A2(
			_elm_lang$core$Task$andThen,
			function (newProcesses) {
				return _elm_lang$core$Task$succeed(
					A2(_elm_lang$core$Time$State, newTaggers, newProcesses));
			},
			A2(
				_elm_lang$core$Task$andThen,
				function (_p20) {
					return A3(_elm_lang$core$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var _elm_lang$core$Time$Every = F2(
	function (a, b) {
		return {ctor: 'Every', _0: a, _1: b};
	});
var _elm_lang$core$Time$every = F2(
	function (interval, tagger) {
		return _elm_lang$core$Time$subscription(
			A2(_elm_lang$core$Time$Every, interval, tagger));
	});
var _elm_lang$core$Time$subMap = F2(
	function (f, _p21) {
		var _p22 = _p21;
		return A2(
			_elm_lang$core$Time$Every,
			_p22._0,
			function (_p23) {
				return f(
					_p22._1(_p23));
			});
	});
_elm_lang$core$Native_Platform.effectManagers['Time'] = {pkg: 'elm-lang/core', init: _elm_lang$core$Time$init, onEffects: _elm_lang$core$Time$onEffects, onSelfMsg: _elm_lang$core$Time$onSelfMsg, tag: 'sub', subMap: _elm_lang$core$Time$subMap};

var _elm_lang$core$Date$millisecond = _elm_lang$core$Native_Date.millisecond;
var _elm_lang$core$Date$second = _elm_lang$core$Native_Date.second;
var _elm_lang$core$Date$minute = _elm_lang$core$Native_Date.minute;
var _elm_lang$core$Date$hour = _elm_lang$core$Native_Date.hour;
var _elm_lang$core$Date$dayOfWeek = _elm_lang$core$Native_Date.dayOfWeek;
var _elm_lang$core$Date$day = _elm_lang$core$Native_Date.day;
var _elm_lang$core$Date$month = _elm_lang$core$Native_Date.month;
var _elm_lang$core$Date$year = _elm_lang$core$Native_Date.year;
var _elm_lang$core$Date$fromTime = _elm_lang$core$Native_Date.fromTime;
var _elm_lang$core$Date$toTime = _elm_lang$core$Native_Date.toTime;
var _elm_lang$core$Date$fromString = _elm_lang$core$Native_Date.fromString;
var _elm_lang$core$Date$now = A2(_elm_lang$core$Task$map, _elm_lang$core$Date$fromTime, _elm_lang$core$Time$now);
var _elm_lang$core$Date$Date = {ctor: 'Date'};
var _elm_lang$core$Date$Sun = {ctor: 'Sun'};
var _elm_lang$core$Date$Sat = {ctor: 'Sat'};
var _elm_lang$core$Date$Fri = {ctor: 'Fri'};
var _elm_lang$core$Date$Thu = {ctor: 'Thu'};
var _elm_lang$core$Date$Wed = {ctor: 'Wed'};
var _elm_lang$core$Date$Tue = {ctor: 'Tue'};
var _elm_lang$core$Date$Mon = {ctor: 'Mon'};
var _elm_lang$core$Date$Dec = {ctor: 'Dec'};
var _elm_lang$core$Date$Nov = {ctor: 'Nov'};
var _elm_lang$core$Date$Oct = {ctor: 'Oct'};
var _elm_lang$core$Date$Sep = {ctor: 'Sep'};
var _elm_lang$core$Date$Aug = {ctor: 'Aug'};
var _elm_lang$core$Date$Jul = {ctor: 'Jul'};
var _elm_lang$core$Date$Jun = {ctor: 'Jun'};
var _elm_lang$core$Date$May = {ctor: 'May'};
var _elm_lang$core$Date$Apr = {ctor: 'Apr'};
var _elm_lang$core$Date$Mar = {ctor: 'Mar'};
var _elm_lang$core$Date$Feb = {ctor: 'Feb'};
var _elm_lang$core$Date$Jan = {ctor: 'Jan'};

var _elm_lang$core$Set$foldr = F3(
	function (f, b, _p0) {
		var _p1 = _p0;
		return A3(
			_elm_lang$core$Dict$foldr,
			F3(
				function (k, _p2, b) {
					return A2(f, k, b);
				}),
			b,
			_p1._0);
	});
var _elm_lang$core$Set$foldl = F3(
	function (f, b, _p3) {
		var _p4 = _p3;
		return A3(
			_elm_lang$core$Dict$foldl,
			F3(
				function (k, _p5, b) {
					return A2(f, k, b);
				}),
			b,
			_p4._0);
	});
var _elm_lang$core$Set$toList = function (_p6) {
	var _p7 = _p6;
	return _elm_lang$core$Dict$keys(_p7._0);
};
var _elm_lang$core$Set$size = function (_p8) {
	var _p9 = _p8;
	return _elm_lang$core$Dict$size(_p9._0);
};
var _elm_lang$core$Set$member = F2(
	function (k, _p10) {
		var _p11 = _p10;
		return A2(_elm_lang$core$Dict$member, k, _p11._0);
	});
var _elm_lang$core$Set$isEmpty = function (_p12) {
	var _p13 = _p12;
	return _elm_lang$core$Dict$isEmpty(_p13._0);
};
var _elm_lang$core$Set$Set_elm_builtin = function (a) {
	return {ctor: 'Set_elm_builtin', _0: a};
};
var _elm_lang$core$Set$empty = _elm_lang$core$Set$Set_elm_builtin(_elm_lang$core$Dict$empty);
var _elm_lang$core$Set$singleton = function (k) {
	return _elm_lang$core$Set$Set_elm_builtin(
		A2(
			_elm_lang$core$Dict$singleton,
			k,
			{ctor: '_Tuple0'}));
};
var _elm_lang$core$Set$insert = F2(
	function (k, _p14) {
		var _p15 = _p14;
		return _elm_lang$core$Set$Set_elm_builtin(
			A3(
				_elm_lang$core$Dict$insert,
				k,
				{ctor: '_Tuple0'},
				_p15._0));
	});
var _elm_lang$core$Set$fromList = function (xs) {
	return A3(_elm_lang$core$List$foldl, _elm_lang$core$Set$insert, _elm_lang$core$Set$empty, xs);
};
var _elm_lang$core$Set$map = F2(
	function (f, s) {
		return _elm_lang$core$Set$fromList(
			A2(
				_elm_lang$core$List$map,
				f,
				_elm_lang$core$Set$toList(s)));
	});
var _elm_lang$core$Set$remove = F2(
	function (k, _p16) {
		var _p17 = _p16;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$remove, k, _p17._0));
	});
var _elm_lang$core$Set$union = F2(
	function (_p19, _p18) {
		var _p20 = _p19;
		var _p21 = _p18;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$union, _p20._0, _p21._0));
	});
var _elm_lang$core$Set$intersect = F2(
	function (_p23, _p22) {
		var _p24 = _p23;
		var _p25 = _p22;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$intersect, _p24._0, _p25._0));
	});
var _elm_lang$core$Set$diff = F2(
	function (_p27, _p26) {
		var _p28 = _p27;
		var _p29 = _p26;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$diff, _p28._0, _p29._0));
	});
var _elm_lang$core$Set$filter = F2(
	function (p, _p30) {
		var _p31 = _p30;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(
				_elm_lang$core$Dict$filter,
				F2(
					function (k, _p32) {
						return p(k);
					}),
				_p31._0));
	});
var _elm_lang$core$Set$partition = F2(
	function (p, _p33) {
		var _p34 = _p33;
		var _p35 = A2(
			_elm_lang$core$Dict$partition,
			F2(
				function (k, _p36) {
					return p(k);
				}),
			_p34._0);
		var p1 = _p35._0;
		var p2 = _p35._1;
		return {
			ctor: '_Tuple2',
			_0: _elm_lang$core$Set$Set_elm_builtin(p1),
			_1: _elm_lang$core$Set$Set_elm_builtin(p2)
		};
	});

var _elm_community$json_extra$Json_Decode_Extra$fromResult = function (result) {
	var _p0 = result;
	if (_p0.ctor === 'Ok') {
		return _elm_lang$core$Json_Decode$succeed(_p0._0);
	} else {
		return _elm_lang$core$Json_Decode$fail(_p0._0);
	}
};
var _elm_community$json_extra$Json_Decode_Extra$sequenceHelp = F2(
	function (decoders, jsonValues) {
		return (!_elm_lang$core$Native_Utils.eq(
			_elm_lang$core$List$length(jsonValues),
			_elm_lang$core$List$length(decoders))) ? _elm_lang$core$Json_Decode$fail('Number of decoders does not match number of values') : _elm_community$json_extra$Json_Decode_Extra$fromResult(
			A3(
				_elm_lang$core$List$foldr,
				_elm_lang$core$Result$map2(
					F2(
						function (x, y) {
							return {ctor: '::', _0: x, _1: y};
						})),
				_elm_lang$core$Result$Ok(
					{ctor: '[]'}),
				A3(_elm_lang$core$List$map2, _elm_lang$core$Json_Decode$decodeValue, decoders, jsonValues)));
	});
var _elm_community$json_extra$Json_Decode_Extra$sequence = function (decoders) {
	return A2(
		_elm_lang$core$Json_Decode$andThen,
		_elm_community$json_extra$Json_Decode_Extra$sequenceHelp(decoders),
		_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$value));
};
var _elm_community$json_extra$Json_Decode_Extra$optionalField = F2(
	function (fieldName, decoder) {
		var finishDecoding = function (json) {
			var _p1 = A2(
				_elm_lang$core$Json_Decode$decodeValue,
				A2(_elm_lang$core$Json_Decode$field, fieldName, _elm_lang$core$Json_Decode$value),
				json);
			if (_p1.ctor === 'Ok') {
				return A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, decoder);
			} else {
				return _elm_lang$core$Json_Decode$succeed(_elm_lang$core$Maybe$Nothing);
			}
		};
		return A2(_elm_lang$core$Json_Decode$andThen, finishDecoding, _elm_lang$core$Json_Decode$value);
	});
var _elm_community$json_extra$Json_Decode_Extra$withDefault = F2(
	function (fallback, decoder) {
		return A2(
			_elm_lang$core$Json_Decode$andThen,
			function (_p2) {
				return _elm_lang$core$Json_Decode$succeed(
					A2(_elm_lang$core$Maybe$withDefault, fallback, _p2));
			},
			_elm_lang$core$Json_Decode$maybe(decoder));
	});
var _elm_community$json_extra$Json_Decode_Extra$decodeDictFromTuples = F2(
	function (keyDecoder, tuples) {
		var _p3 = tuples;
		if (_p3.ctor === '[]') {
			return _elm_lang$core$Json_Decode$succeed(_elm_lang$core$Dict$empty);
		} else {
			var _p4 = A2(_elm_lang$core$Json_Decode$decodeString, keyDecoder, _p3._0._0);
			if (_p4.ctor === 'Ok') {
				return A2(
					_elm_lang$core$Json_Decode$andThen,
					function (_p5) {
						return _elm_lang$core$Json_Decode$succeed(
							A3(_elm_lang$core$Dict$insert, _p4._0, _p3._0._1, _p5));
					},
					A2(_elm_community$json_extra$Json_Decode_Extra$decodeDictFromTuples, keyDecoder, _p3._1));
			} else {
				return _elm_lang$core$Json_Decode$fail(_p4._0);
			}
		}
	});
var _elm_community$json_extra$Json_Decode_Extra$dict2 = F2(
	function (keyDecoder, valueDecoder) {
		return A2(
			_elm_lang$core$Json_Decode$andThen,
			function (_p6) {
				return A2(
					_elm_community$json_extra$Json_Decode_Extra$decodeDictFromTuples,
					keyDecoder,
					_elm_lang$core$Dict$toList(_p6));
			},
			_elm_lang$core$Json_Decode$dict(valueDecoder));
	});
var _elm_community$json_extra$Json_Decode_Extra$set = function (decoder) {
	return A2(
		_elm_lang$core$Json_Decode$andThen,
		function (_p7) {
			return _elm_lang$core$Json_Decode$succeed(
				_elm_lang$core$Set$fromList(_p7));
		},
		_elm_lang$core$Json_Decode$list(decoder));
};
var _elm_community$json_extra$Json_Decode_Extra$date = A2(
	_elm_lang$core$Json_Decode$andThen,
	function (_p8) {
		return _elm_community$json_extra$Json_Decode_Extra$fromResult(
			_elm_lang$core$Date$fromString(_p8));
	},
	_elm_lang$core$Json_Decode$string);
var _elm_community$json_extra$Json_Decode_Extra$andMap = _elm_lang$core$Json_Decode$map2(
	F2(
		function (x, y) {
			return y(x);
		}));
var _elm_community$json_extra$Json_Decode_Extra_ops = _elm_community$json_extra$Json_Decode_Extra_ops || {};
_elm_community$json_extra$Json_Decode_Extra_ops['|:'] = _elm_lang$core$Basics$flip(_elm_community$json_extra$Json_Decode_Extra$andMap);

var _elm_community$list_extra$List_Extra$greedyGroupsOfWithStep = F3(
	function (size, step, xs) {
		var okayXs = _elm_lang$core$Native_Utils.cmp(
			_elm_lang$core$List$length(xs),
			0) > 0;
		var okayArgs = (_elm_lang$core$Native_Utils.cmp(size, 0) > 0) && (_elm_lang$core$Native_Utils.cmp(step, 0) > 0);
		var xs_ = A2(_elm_lang$core$List$drop, step, xs);
		var group = A2(_elm_lang$core$List$take, size, xs);
		return (okayArgs && okayXs) ? {
			ctor: '::',
			_0: group,
			_1: A3(_elm_community$list_extra$List_Extra$greedyGroupsOfWithStep, size, step, xs_)
		} : {ctor: '[]'};
	});
var _elm_community$list_extra$List_Extra$greedyGroupsOf = F2(
	function (size, xs) {
		return A3(_elm_community$list_extra$List_Extra$greedyGroupsOfWithStep, size, size, xs);
	});
var _elm_community$list_extra$List_Extra$groupsOfWithStep = F3(
	function (size, step, xs) {
		var okayArgs = (_elm_lang$core$Native_Utils.cmp(size, 0) > 0) && (_elm_lang$core$Native_Utils.cmp(step, 0) > 0);
		var xs_ = A2(_elm_lang$core$List$drop, step, xs);
		var group = A2(_elm_lang$core$List$take, size, xs);
		var okayLength = _elm_lang$core$Native_Utils.eq(
			size,
			_elm_lang$core$List$length(group));
		return (okayArgs && okayLength) ? {
			ctor: '::',
			_0: group,
			_1: A3(_elm_community$list_extra$List_Extra$groupsOfWithStep, size, step, xs_)
		} : {ctor: '[]'};
	});
var _elm_community$list_extra$List_Extra$groupsOf = F2(
	function (size, xs) {
		return A3(_elm_community$list_extra$List_Extra$groupsOfWithStep, size, size, xs);
	});
var _elm_community$list_extra$List_Extra$zip5 = _elm_lang$core$List$map5(
	F5(
		function (v0, v1, v2, v3, v4) {
			return {ctor: '_Tuple5', _0: v0, _1: v1, _2: v2, _3: v3, _4: v4};
		}));
var _elm_community$list_extra$List_Extra$zip4 = _elm_lang$core$List$map4(
	F4(
		function (v0, v1, v2, v3) {
			return {ctor: '_Tuple4', _0: v0, _1: v1, _2: v2, _3: v3};
		}));
var _elm_community$list_extra$List_Extra$zip3 = _elm_lang$core$List$map3(
	F3(
		function (v0, v1, v2) {
			return {ctor: '_Tuple3', _0: v0, _1: v1, _2: v2};
		}));
var _elm_community$list_extra$List_Extra$zip = _elm_lang$core$List$map2(
	F2(
		function (v0, v1) {
			return {ctor: '_Tuple2', _0: v0, _1: v1};
		}));
var _elm_community$list_extra$List_Extra$isPrefixOf = F2(
	function (prefix, xs) {
		var _p0 = {ctor: '_Tuple2', _0: prefix, _1: xs};
		if (_p0._0.ctor === '[]') {
			return true;
		} else {
			if (_p0._1.ctor === '[]') {
				return false;
			} else {
				return _elm_lang$core$Native_Utils.eq(_p0._0._0, _p0._1._0) && A2(_elm_community$list_extra$List_Extra$isPrefixOf, _p0._0._1, _p0._1._1);
			}
		}
	});
var _elm_community$list_extra$List_Extra$isSuffixOf = F2(
	function (suffix, xs) {
		return A2(
			_elm_community$list_extra$List_Extra$isPrefixOf,
			_elm_lang$core$List$reverse(suffix),
			_elm_lang$core$List$reverse(xs));
	});
var _elm_community$list_extra$List_Extra$selectSplit = function (xs) {
	var _p1 = xs;
	if (_p1.ctor === '[]') {
		return {ctor: '[]'};
	} else {
		var _p5 = _p1._1;
		var _p4 = _p1._0;
		return {
			ctor: '::',
			_0: {
				ctor: '_Tuple3',
				_0: {ctor: '[]'},
				_1: _p4,
				_2: _p5
			},
			_1: A2(
				_elm_lang$core$List$map,
				function (_p2) {
					var _p3 = _p2;
					return {
						ctor: '_Tuple3',
						_0: {ctor: '::', _0: _p4, _1: _p3._0},
						_1: _p3._1,
						_2: _p3._2
					};
				},
				_elm_community$list_extra$List_Extra$selectSplit(_p5))
		};
	}
};
var _elm_community$list_extra$List_Extra$select = function (xs) {
	var _p6 = xs;
	if (_p6.ctor === '[]') {
		return {ctor: '[]'};
	} else {
		var _p10 = _p6._1;
		var _p9 = _p6._0;
		return {
			ctor: '::',
			_0: {ctor: '_Tuple2', _0: _p9, _1: _p10},
			_1: A2(
				_elm_lang$core$List$map,
				function (_p7) {
					var _p8 = _p7;
					return {
						ctor: '_Tuple2',
						_0: _p8._0,
						_1: {ctor: '::', _0: _p9, _1: _p8._1}
					};
				},
				_elm_community$list_extra$List_Extra$select(_p10))
		};
	}
};
var _elm_community$list_extra$List_Extra$tailsHelp = F2(
	function (e, list) {
		var _p11 = list;
		if (_p11.ctor === '::') {
			var _p12 = _p11._0;
			return {
				ctor: '::',
				_0: {ctor: '::', _0: e, _1: _p12},
				_1: {ctor: '::', _0: _p12, _1: _p11._1}
			};
		} else {
			return {ctor: '[]'};
		}
	});
var _elm_community$list_extra$List_Extra$tails = A2(
	_elm_lang$core$List$foldr,
	_elm_community$list_extra$List_Extra$tailsHelp,
	{
		ctor: '::',
		_0: {ctor: '[]'},
		_1: {ctor: '[]'}
	});
var _elm_community$list_extra$List_Extra$isInfixOf = F2(
	function (infix, xs) {
		return A2(
			_elm_lang$core$List$any,
			_elm_community$list_extra$List_Extra$isPrefixOf(infix),
			_elm_community$list_extra$List_Extra$tails(xs));
	});
var _elm_community$list_extra$List_Extra$inits = A2(
	_elm_lang$core$List$foldr,
	F2(
		function (e, acc) {
			return {
				ctor: '::',
				_0: {ctor: '[]'},
				_1: A2(
					_elm_lang$core$List$map,
					F2(
						function (x, y) {
							return {ctor: '::', _0: x, _1: y};
						})(e),
					acc)
			};
		}),
	{
		ctor: '::',
		_0: {ctor: '[]'},
		_1: {ctor: '[]'}
	});
var _elm_community$list_extra$List_Extra$groupWhileTransitively = F2(
	function (cmp, xs_) {
		var _p13 = xs_;
		if (_p13.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			if (_p13._1.ctor === '[]') {
				return {
					ctor: '::',
					_0: {
						ctor: '::',
						_0: _p13._0,
						_1: {ctor: '[]'}
					},
					_1: {ctor: '[]'}
				};
			} else {
				var _p15 = _p13._0;
				var _p14 = A2(_elm_community$list_extra$List_Extra$groupWhileTransitively, cmp, _p13._1);
				if (_p14.ctor === '::') {
					return A2(cmp, _p15, _p13._1._0) ? {
						ctor: '::',
						_0: {ctor: '::', _0: _p15, _1: _p14._0},
						_1: _p14._1
					} : {
						ctor: '::',
						_0: {
							ctor: '::',
							_0: _p15,
							_1: {ctor: '[]'}
						},
						_1: _p14
					};
				} else {
					return {ctor: '[]'};
				}
			}
		}
	});
var _elm_community$list_extra$List_Extra$stripPrefix = F2(
	function (prefix, xs) {
		var step = F2(
			function (e, m) {
				var _p16 = m;
				if (_p16.ctor === 'Nothing') {
					return _elm_lang$core$Maybe$Nothing;
				} else {
					if (_p16._0.ctor === '[]') {
						return _elm_lang$core$Maybe$Nothing;
					} else {
						return _elm_lang$core$Native_Utils.eq(e, _p16._0._0) ? _elm_lang$core$Maybe$Just(_p16._0._1) : _elm_lang$core$Maybe$Nothing;
					}
				}
			});
		return A3(
			_elm_lang$core$List$foldl,
			step,
			_elm_lang$core$Maybe$Just(xs),
			prefix);
	});
var _elm_community$list_extra$List_Extra$dropWhileRight = function (p) {
	return A2(
		_elm_lang$core$List$foldr,
		F2(
			function (x, xs) {
				return (p(x) && _elm_lang$core$List$isEmpty(xs)) ? {ctor: '[]'} : {ctor: '::', _0: x, _1: xs};
			}),
		{ctor: '[]'});
};
var _elm_community$list_extra$List_Extra$takeWhileRight = function (p) {
	var step = F2(
		function (x, _p17) {
			var _p18 = _p17;
			var _p19 = _p18._0;
			return (p(x) && _p18._1) ? {
				ctor: '_Tuple2',
				_0: {ctor: '::', _0: x, _1: _p19},
				_1: true
			} : {ctor: '_Tuple2', _0: _p19, _1: false};
		});
	return function (_p20) {
		return _elm_lang$core$Tuple$first(
			A3(
				_elm_lang$core$List$foldr,
				step,
				{
					ctor: '_Tuple2',
					_0: {ctor: '[]'},
					_1: true
				},
				_p20));
	};
};
var _elm_community$list_extra$List_Extra$splitAt = F2(
	function (n, xs) {
		return {
			ctor: '_Tuple2',
			_0: A2(_elm_lang$core$List$take, n, xs),
			_1: A2(_elm_lang$core$List$drop, n, xs)
		};
	});
var _elm_community$list_extra$List_Extra$groupsOfVarying_ = F3(
	function (listOflengths, list, accu) {
		groupsOfVarying_:
		while (true) {
			var _p21 = {ctor: '_Tuple2', _0: listOflengths, _1: list};
			if (((_p21.ctor === '_Tuple2') && (_p21._0.ctor === '::')) && (_p21._1.ctor === '::')) {
				var _p22 = A2(_elm_community$list_extra$List_Extra$splitAt, _p21._0._0, list);
				var head = _p22._0;
				var tail = _p22._1;
				var _v11 = _p21._0._1,
					_v12 = tail,
					_v13 = {ctor: '::', _0: head, _1: accu};
				listOflengths = _v11;
				list = _v12;
				accu = _v13;
				continue groupsOfVarying_;
			} else {
				return _elm_lang$core$List$reverse(accu);
			}
		}
	});
var _elm_community$list_extra$List_Extra$groupsOfVarying = F2(
	function (listOflengths, list) {
		return A3(
			_elm_community$list_extra$List_Extra$groupsOfVarying_,
			listOflengths,
			list,
			{ctor: '[]'});
	});
var _elm_community$list_extra$List_Extra$unfoldr = F2(
	function (f, seed) {
		var _p23 = f(seed);
		if (_p23.ctor === 'Nothing') {
			return {ctor: '[]'};
		} else {
			return {
				ctor: '::',
				_0: _p23._0._0,
				_1: A2(_elm_community$list_extra$List_Extra$unfoldr, f, _p23._0._1)
			};
		}
	});
var _elm_community$list_extra$List_Extra$scanr1 = F2(
	function (f, xs_) {
		var _p24 = xs_;
		if (_p24.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			if (_p24._1.ctor === '[]') {
				return {
					ctor: '::',
					_0: _p24._0,
					_1: {ctor: '[]'}
				};
			} else {
				var _p25 = A2(_elm_community$list_extra$List_Extra$scanr1, f, _p24._1);
				if (_p25.ctor === '::') {
					return {
						ctor: '::',
						_0: A2(f, _p24._0, _p25._0),
						_1: _p25
					};
				} else {
					return {ctor: '[]'};
				}
			}
		}
	});
var _elm_community$list_extra$List_Extra$scanr = F3(
	function (f, acc, xs_) {
		var _p26 = xs_;
		if (_p26.ctor === '[]') {
			return {
				ctor: '::',
				_0: acc,
				_1: {ctor: '[]'}
			};
		} else {
			var _p27 = A3(_elm_community$list_extra$List_Extra$scanr, f, acc, _p26._1);
			if (_p27.ctor === '::') {
				return {
					ctor: '::',
					_0: A2(f, _p26._0, _p27._0),
					_1: _p27
				};
			} else {
				return {ctor: '[]'};
			}
		}
	});
var _elm_community$list_extra$List_Extra$scanl1 = F2(
	function (f, xs_) {
		var _p28 = xs_;
		if (_p28.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			return A3(_elm_lang$core$List$scanl, f, _p28._0, _p28._1);
		}
	});
var _elm_community$list_extra$List_Extra$indexedFoldr = F3(
	function (func, acc, list) {
		var step = F2(
			function (x, _p29) {
				var _p30 = _p29;
				var _p31 = _p30._0;
				return {
					ctor: '_Tuple2',
					_0: _p31 - 1,
					_1: A3(func, _p31, x, _p30._1)
				};
			});
		return _elm_lang$core$Tuple$second(
			A3(
				_elm_lang$core$List$foldr,
				step,
				{
					ctor: '_Tuple2',
					_0: _elm_lang$core$List$length(list) - 1,
					_1: acc
				},
				list));
	});
var _elm_community$list_extra$List_Extra$indexedFoldl = F3(
	function (func, acc, list) {
		var step = F2(
			function (x, _p32) {
				var _p33 = _p32;
				var _p34 = _p33._0;
				return {
					ctor: '_Tuple2',
					_0: _p34 + 1,
					_1: A3(func, _p34, x, _p33._1)
				};
			});
		return _elm_lang$core$Tuple$second(
			A3(
				_elm_lang$core$List$foldl,
				step,
				{ctor: '_Tuple2', _0: 0, _1: acc},
				list));
	});
var _elm_community$list_extra$List_Extra$foldr1 = F2(
	function (f, xs) {
		var mf = F2(
			function (x, m) {
				return _elm_lang$core$Maybe$Just(
					function () {
						var _p35 = m;
						if (_p35.ctor === 'Nothing') {
							return x;
						} else {
							return A2(f, x, _p35._0);
						}
					}());
			});
		return A3(_elm_lang$core$List$foldr, mf, _elm_lang$core$Maybe$Nothing, xs);
	});
var _elm_community$list_extra$List_Extra$foldl1 = F2(
	function (f, xs) {
		var mf = F2(
			function (x, m) {
				return _elm_lang$core$Maybe$Just(
					function () {
						var _p36 = m;
						if (_p36.ctor === 'Nothing') {
							return x;
						} else {
							return A2(f, _p36._0, x);
						}
					}());
			});
		return A3(_elm_lang$core$List$foldl, mf, _elm_lang$core$Maybe$Nothing, xs);
	});
var _elm_community$list_extra$List_Extra$interweaveHelp = F3(
	function (l1, l2, acc) {
		interweaveHelp:
		while (true) {
			var _p37 = {ctor: '_Tuple2', _0: l1, _1: l2};
			_v24_1:
			do {
				if (_p37._0.ctor === '::') {
					if (_p37._1.ctor === '::') {
						var _v25 = _p37._0._1,
							_v26 = _p37._1._1,
							_v27 = A2(
							_elm_lang$core$Basics_ops['++'],
							acc,
							{
								ctor: '::',
								_0: _p37._0._0,
								_1: {
									ctor: '::',
									_0: _p37._1._0,
									_1: {ctor: '[]'}
								}
							});
						l1 = _v25;
						l2 = _v26;
						acc = _v27;
						continue interweaveHelp;
					} else {
						break _v24_1;
					}
				} else {
					if (_p37._1.ctor === '[]') {
						break _v24_1;
					} else {
						return A2(_elm_lang$core$Basics_ops['++'], acc, _p37._1);
					}
				}
			} while(false);
			return A2(_elm_lang$core$Basics_ops['++'], acc, _p37._0);
		}
	});
var _elm_community$list_extra$List_Extra$interweave = F2(
	function (l1, l2) {
		return A3(
			_elm_community$list_extra$List_Extra$interweaveHelp,
			l1,
			l2,
			{ctor: '[]'});
	});
var _elm_community$list_extra$List_Extra$permutations = function (xs_) {
	var _p38 = xs_;
	if (_p38.ctor === '[]') {
		return {
			ctor: '::',
			_0: {ctor: '[]'},
			_1: {ctor: '[]'}
		};
	} else {
		var f = function (_p39) {
			var _p40 = _p39;
			return A2(
				_elm_lang$core$List$map,
				F2(
					function (x, y) {
						return {ctor: '::', _0: x, _1: y};
					})(_p40._0),
				_elm_community$list_extra$List_Extra$permutations(_p40._1));
		};
		return A2(
			_elm_lang$core$List$concatMap,
			f,
			_elm_community$list_extra$List_Extra$select(_p38));
	}
};
var _elm_community$list_extra$List_Extra$isPermutationOf = F2(
	function (permut, xs) {
		return A2(
			_elm_lang$core$List$member,
			permut,
			_elm_community$list_extra$List_Extra$permutations(xs));
	});
var _elm_community$list_extra$List_Extra$subsequencesNonEmpty = function (xs) {
	var _p41 = xs;
	if (_p41.ctor === '[]') {
		return {ctor: '[]'};
	} else {
		var _p42 = _p41._0;
		var f = F2(
			function (ys, r) {
				return {
					ctor: '::',
					_0: ys,
					_1: {
						ctor: '::',
						_0: {ctor: '::', _0: _p42, _1: ys},
						_1: r
					}
				};
			});
		return {
			ctor: '::',
			_0: {
				ctor: '::',
				_0: _p42,
				_1: {ctor: '[]'}
			},
			_1: A3(
				_elm_lang$core$List$foldr,
				f,
				{ctor: '[]'},
				_elm_community$list_extra$List_Extra$subsequencesNonEmpty(_p41._1))
		};
	}
};
var _elm_community$list_extra$List_Extra$subsequences = function (xs) {
	return {
		ctor: '::',
		_0: {ctor: '[]'},
		_1: _elm_community$list_extra$List_Extra$subsequencesNonEmpty(xs)
	};
};
var _elm_community$list_extra$List_Extra$isSubsequenceOf = F2(
	function (subseq, xs) {
		return A2(
			_elm_lang$core$List$member,
			subseq,
			_elm_community$list_extra$List_Extra$subsequences(xs));
	});
var _elm_community$list_extra$List_Extra$transpose = function (ll) {
	transpose:
	while (true) {
		var _p43 = ll;
		if (_p43.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			if (_p43._0.ctor === '[]') {
				var _v32 = _p43._1;
				ll = _v32;
				continue transpose;
			} else {
				var _p44 = _p43._1;
				var tails = A2(_elm_lang$core$List$filterMap, _elm_lang$core$List$tail, _p44);
				var heads = A2(_elm_lang$core$List$filterMap, _elm_lang$core$List$head, _p44);
				return {
					ctor: '::',
					_0: {ctor: '::', _0: _p43._0._0, _1: heads},
					_1: _elm_community$list_extra$List_Extra$transpose(
						{ctor: '::', _0: _p43._0._1, _1: tails})
				};
			}
		}
	}
};
var _elm_community$list_extra$List_Extra$intercalate = function (xs) {
	return function (_p45) {
		return _elm_lang$core$List$concat(
			A2(_elm_lang$core$List$intersperse, xs, _p45));
	};
};
var _elm_community$list_extra$List_Extra$filterNot = F2(
	function (pred, list) {
		return A2(
			_elm_lang$core$List$filter,
			function (_p46) {
				return !pred(_p46);
			},
			list);
	});
var _elm_community$list_extra$List_Extra$removeAt = F2(
	function (index, l) {
		if (_elm_lang$core$Native_Utils.cmp(index, 0) < 0) {
			return l;
		} else {
			var tail = _elm_lang$core$List$tail(
				A2(_elm_lang$core$List$drop, index, l));
			var head = A2(_elm_lang$core$List$take, index, l);
			var _p47 = tail;
			if (_p47.ctor === 'Nothing') {
				return l;
			} else {
				return A2(_elm_lang$core$List$append, head, _p47._0);
			}
		}
	});
var _elm_community$list_extra$List_Extra$stableSortWith = F2(
	function (pred, list) {
		var predWithIndex = F2(
			function (_p49, _p48) {
				var _p50 = _p49;
				var _p51 = _p48;
				var result = A2(pred, _p50._0, _p51._0);
				var _p52 = result;
				if (_p52.ctor === 'EQ') {
					return A2(_elm_lang$core$Basics$compare, _p50._1, _p51._1);
				} else {
					return result;
				}
			});
		var listWithIndex = A2(
			_elm_lang$core$List$indexedMap,
			F2(
				function (i, a) {
					return {ctor: '_Tuple2', _0: a, _1: i};
				}),
			list);
		return A2(
			_elm_lang$core$List$map,
			_elm_lang$core$Tuple$first,
			A2(_elm_lang$core$List$sortWith, predWithIndex, listWithIndex));
	});
var _elm_community$list_extra$List_Extra$setAt = F3(
	function (index, value, l) {
		if (_elm_lang$core$Native_Utils.cmp(index, 0) < 0) {
			return _elm_lang$core$Maybe$Nothing;
		} else {
			var tail = _elm_lang$core$List$tail(
				A2(_elm_lang$core$List$drop, index, l));
			var head = A2(_elm_lang$core$List$take, index, l);
			var _p53 = tail;
			if (_p53.ctor === 'Nothing') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				return _elm_lang$core$Maybe$Just(
					A2(
						_elm_lang$core$List$append,
						head,
						{ctor: '::', _0: value, _1: _p53._0}));
			}
		}
	});
var _elm_community$list_extra$List_Extra$remove = F2(
	function (x, xs) {
		var _p54 = xs;
		if (_p54.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			var _p56 = _p54._1;
			var _p55 = _p54._0;
			return _elm_lang$core$Native_Utils.eq(x, _p55) ? _p56 : {
				ctor: '::',
				_0: _p55,
				_1: A2(_elm_community$list_extra$List_Extra$remove, x, _p56)
			};
		}
	});
var _elm_community$list_extra$List_Extra$updateIfIndex = F3(
	function (predicate, update, list) {
		return A2(
			_elm_lang$core$List$indexedMap,
			F2(
				function (i, x) {
					return predicate(i) ? update(x) : x;
				}),
			list);
	});
var _elm_community$list_extra$List_Extra$updateAt = F3(
	function (index, update, list) {
		return ((_elm_lang$core$Native_Utils.cmp(index, 0) < 0) || (_elm_lang$core$Native_Utils.cmp(
			index,
			_elm_lang$core$List$length(list)) > -1)) ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$Maybe$Just(
			A3(
				_elm_community$list_extra$List_Extra$updateIfIndex,
				F2(
					function (x, y) {
						return _elm_lang$core$Native_Utils.eq(x, y);
					})(index),
				update,
				list));
	});
var _elm_community$list_extra$List_Extra$updateIf = F3(
	function (predicate, update, list) {
		return A2(
			_elm_lang$core$List$map,
			function (item) {
				return predicate(item) ? update(item) : item;
			},
			list);
	});
var _elm_community$list_extra$List_Extra$replaceIf = F3(
	function (predicate, replacement, list) {
		return A3(
			_elm_community$list_extra$List_Extra$updateIf,
			predicate,
			_elm_lang$core$Basics$always(replacement),
			list);
	});
var _elm_community$list_extra$List_Extra$findIndices = function (p) {
	return function (_p57) {
		return A2(
			_elm_lang$core$List$map,
			_elm_lang$core$Tuple$first,
			A2(
				_elm_lang$core$List$filter,
				function (_p58) {
					var _p59 = _p58;
					return p(_p59._1);
				},
				A2(
					_elm_lang$core$List$indexedMap,
					F2(
						function (v0, v1) {
							return {ctor: '_Tuple2', _0: v0, _1: v1};
						}),
					_p57)));
	};
};
var _elm_community$list_extra$List_Extra$findIndex = function (p) {
	return function (_p60) {
		return _elm_lang$core$List$head(
			A2(_elm_community$list_extra$List_Extra$findIndices, p, _p60));
	};
};
var _elm_community$list_extra$List_Extra$elemIndices = function (x) {
	return _elm_community$list_extra$List_Extra$findIndices(
		F2(
			function (x, y) {
				return _elm_lang$core$Native_Utils.eq(x, y);
			})(x));
};
var _elm_community$list_extra$List_Extra$elemIndex = function (x) {
	return _elm_community$list_extra$List_Extra$findIndex(
		F2(
			function (x, y) {
				return _elm_lang$core$Native_Utils.eq(x, y);
			})(x));
};
var _elm_community$list_extra$List_Extra$find = F2(
	function (predicate, list) {
		find:
		while (true) {
			var _p61 = list;
			if (_p61.ctor === '[]') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				var _p62 = _p61._0;
				if (predicate(_p62)) {
					return _elm_lang$core$Maybe$Just(_p62);
				} else {
					var _v41 = predicate,
						_v42 = _p61._1;
					predicate = _v41;
					list = _v42;
					continue find;
				}
			}
		}
	});
var _elm_community$list_extra$List_Extra$notMember = function (x) {
	return function (_p63) {
		return !A2(_elm_lang$core$List$member, x, _p63);
	};
};
var _elm_community$list_extra$List_Extra$andThen = _elm_lang$core$List$concatMap;
var _elm_community$list_extra$List_Extra$lift2 = F3(
	function (f, la, lb) {
		return A2(
			_elm_community$list_extra$List_Extra$andThen,
			function (a) {
				return A2(
					_elm_community$list_extra$List_Extra$andThen,
					function (b) {
						return {
							ctor: '::',
							_0: A2(f, a, b),
							_1: {ctor: '[]'}
						};
					},
					lb);
			},
			la);
	});
var _elm_community$list_extra$List_Extra$lift3 = F4(
	function (f, la, lb, lc) {
		return A2(
			_elm_community$list_extra$List_Extra$andThen,
			function (a) {
				return A2(
					_elm_community$list_extra$List_Extra$andThen,
					function (b) {
						return A2(
							_elm_community$list_extra$List_Extra$andThen,
							function (c) {
								return {
									ctor: '::',
									_0: A3(f, a, b, c),
									_1: {ctor: '[]'}
								};
							},
							lc);
					},
					lb);
			},
			la);
	});
var _elm_community$list_extra$List_Extra$lift4 = F5(
	function (f, la, lb, lc, ld) {
		return A2(
			_elm_community$list_extra$List_Extra$andThen,
			function (a) {
				return A2(
					_elm_community$list_extra$List_Extra$andThen,
					function (b) {
						return A2(
							_elm_community$list_extra$List_Extra$andThen,
							function (c) {
								return A2(
									_elm_community$list_extra$List_Extra$andThen,
									function (d) {
										return {
											ctor: '::',
											_0: A4(f, a, b, c, d),
											_1: {ctor: '[]'}
										};
									},
									ld);
							},
							lc);
					},
					lb);
			},
			la);
	});
var _elm_community$list_extra$List_Extra$andMap = F2(
	function (l, fl) {
		return A3(
			_elm_lang$core$List$map2,
			F2(
				function (x, y) {
					return x(y);
				}),
			fl,
			l);
	});
var _elm_community$list_extra$List_Extra$uniqueHelp = F3(
	function (f, existing, remaining) {
		uniqueHelp:
		while (true) {
			var _p64 = remaining;
			if (_p64.ctor === '[]') {
				return {ctor: '[]'};
			} else {
				var _p66 = _p64._1;
				var _p65 = _p64._0;
				var computedFirst = f(_p65);
				if (A2(_elm_lang$core$Set$member, computedFirst, existing)) {
					var _v44 = f,
						_v45 = existing,
						_v46 = _p66;
					f = _v44;
					existing = _v45;
					remaining = _v46;
					continue uniqueHelp;
				} else {
					return {
						ctor: '::',
						_0: _p65,
						_1: A3(
							_elm_community$list_extra$List_Extra$uniqueHelp,
							f,
							A2(_elm_lang$core$Set$insert, computedFirst, existing),
							_p66)
					};
				}
			}
		}
	});
var _elm_community$list_extra$List_Extra$uniqueBy = F2(
	function (f, list) {
		return A3(_elm_community$list_extra$List_Extra$uniqueHelp, f, _elm_lang$core$Set$empty, list);
	});
var _elm_community$list_extra$List_Extra$allDifferentBy = F2(
	function (f, list) {
		return _elm_lang$core$Native_Utils.eq(
			_elm_lang$core$List$length(list),
			_elm_lang$core$List$length(
				A2(_elm_community$list_extra$List_Extra$uniqueBy, f, list)));
	});
var _elm_community$list_extra$List_Extra$allDifferent = function (list) {
	return A2(_elm_community$list_extra$List_Extra$allDifferentBy, _elm_lang$core$Basics$identity, list);
};
var _elm_community$list_extra$List_Extra$unique = function (list) {
	return A3(_elm_community$list_extra$List_Extra$uniqueHelp, _elm_lang$core$Basics$identity, _elm_lang$core$Set$empty, list);
};
var _elm_community$list_extra$List_Extra$dropWhile = F2(
	function (predicate, list) {
		dropWhile:
		while (true) {
			var _p67 = list;
			if (_p67.ctor === '[]') {
				return {ctor: '[]'};
			} else {
				if (predicate(_p67._0)) {
					var _v48 = predicate,
						_v49 = _p67._1;
					predicate = _v48;
					list = _v49;
					continue dropWhile;
				} else {
					return list;
				}
			}
		}
	});
var _elm_community$list_extra$List_Extra$takeWhile = function (predicate) {
	var takeWhileMemo = F2(
		function (memo, list) {
			takeWhileMemo:
			while (true) {
				var _p68 = list;
				if (_p68.ctor === '[]') {
					return _elm_lang$core$List$reverse(memo);
				} else {
					var _p69 = _p68._0;
					if (predicate(_p69)) {
						var _v51 = {ctor: '::', _0: _p69, _1: memo},
							_v52 = _p68._1;
						memo = _v51;
						list = _v52;
						continue takeWhileMemo;
					} else {
						return _elm_lang$core$List$reverse(memo);
					}
				}
			}
		});
	return takeWhileMemo(
		{ctor: '[]'});
};
var _elm_community$list_extra$List_Extra$span = F2(
	function (p, xs) {
		return {
			ctor: '_Tuple2',
			_0: A2(_elm_community$list_extra$List_Extra$takeWhile, p, xs),
			_1: A2(_elm_community$list_extra$List_Extra$dropWhile, p, xs)
		};
	});
var _elm_community$list_extra$List_Extra$break = function (p) {
	return _elm_community$list_extra$List_Extra$span(
		function (_p70) {
			return !p(_p70);
		});
};
var _elm_community$list_extra$List_Extra$groupWhile = F2(
	function (eq, xs_) {
		var _p71 = xs_;
		if (_p71.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			var _p73 = _p71._0;
			var _p72 = A2(
				_elm_community$list_extra$List_Extra$span,
				eq(_p73),
				_p71._1);
			var ys = _p72._0;
			var zs = _p72._1;
			return {
				ctor: '::',
				_0: {ctor: '::', _0: _p73, _1: ys},
				_1: A2(_elm_community$list_extra$List_Extra$groupWhile, eq, zs)
			};
		}
	});
var _elm_community$list_extra$List_Extra$group = _elm_community$list_extra$List_Extra$groupWhile(
	F2(
		function (x, y) {
			return _elm_lang$core$Native_Utils.eq(x, y);
		}));
var _elm_community$list_extra$List_Extra$minimumBy = F2(
	function (f, ls) {
		var minBy = F2(
			function (x, _p74) {
				var _p75 = _p74;
				var _p76 = _p75._1;
				var fx = f(x);
				return (_elm_lang$core$Native_Utils.cmp(fx, _p76) < 0) ? {ctor: '_Tuple2', _0: x, _1: fx} : {ctor: '_Tuple2', _0: _p75._0, _1: _p76};
			});
		var _p77 = ls;
		if (_p77.ctor === '::') {
			if (_p77._1.ctor === '[]') {
				return _elm_lang$core$Maybe$Just(_p77._0);
			} else {
				var _p78 = _p77._0;
				return _elm_lang$core$Maybe$Just(
					_elm_lang$core$Tuple$first(
						A3(
							_elm_lang$core$List$foldl,
							minBy,
							{
								ctor: '_Tuple2',
								_0: _p78,
								_1: f(_p78)
							},
							_p77._1)));
			}
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_community$list_extra$List_Extra$maximumBy = F2(
	function (f, ls) {
		var maxBy = F2(
			function (x, _p79) {
				var _p80 = _p79;
				var _p81 = _p80._1;
				var fx = f(x);
				return (_elm_lang$core$Native_Utils.cmp(fx, _p81) > 0) ? {ctor: '_Tuple2', _0: x, _1: fx} : {ctor: '_Tuple2', _0: _p80._0, _1: _p81};
			});
		var _p82 = ls;
		if (_p82.ctor === '::') {
			if (_p82._1.ctor === '[]') {
				return _elm_lang$core$Maybe$Just(_p82._0);
			} else {
				var _p83 = _p82._0;
				return _elm_lang$core$Maybe$Just(
					_elm_lang$core$Tuple$first(
						A3(
							_elm_lang$core$List$foldl,
							maxBy,
							{
								ctor: '_Tuple2',
								_0: _p83,
								_1: f(_p83)
							},
							_p82._1)));
			}
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_community$list_extra$List_Extra$uncons = function (xs) {
	var _p84 = xs;
	if (_p84.ctor === '[]') {
		return _elm_lang$core$Maybe$Nothing;
	} else {
		return _elm_lang$core$Maybe$Just(
			{ctor: '_Tuple2', _0: _p84._0, _1: _p84._1});
	}
};
var _elm_community$list_extra$List_Extra$swapAt = F3(
	function (index1, index2, l) {
		swapAt:
		while (true) {
			if (_elm_lang$core$Native_Utils.eq(index1, index2)) {
				return _elm_lang$core$Maybe$Just(l);
			} else {
				if (_elm_lang$core$Native_Utils.cmp(index1, index2) > 0) {
					var _v59 = index2,
						_v60 = index1,
						_v61 = l;
					index1 = _v59;
					index2 = _v60;
					l = _v61;
					continue swapAt;
				} else {
					if (_elm_lang$core$Native_Utils.cmp(index1, 0) < 0) {
						return _elm_lang$core$Maybe$Nothing;
					} else {
						var _p85 = A2(_elm_community$list_extra$List_Extra$splitAt, index1, l);
						var part1 = _p85._0;
						var tail1 = _p85._1;
						var _p86 = A2(_elm_community$list_extra$List_Extra$splitAt, index2 - index1, tail1);
						var head2 = _p86._0;
						var tail2 = _p86._1;
						return A3(
							_elm_lang$core$Maybe$map2,
							F2(
								function (_p88, _p87) {
									var _p89 = _p88;
									var _p90 = _p87;
									return _elm_lang$core$List$concat(
										{
											ctor: '::',
											_0: part1,
											_1: {
												ctor: '::',
												_0: {ctor: '::', _0: _p90._0, _1: _p89._1},
												_1: {
													ctor: '::',
													_0: {ctor: '::', _0: _p89._0, _1: _p90._1},
													_1: {ctor: '[]'}
												}
											}
										});
								}),
							_elm_community$list_extra$List_Extra$uncons(head2),
							_elm_community$list_extra$List_Extra$uncons(tail2));
					}
				}
			}
		}
	});
var _elm_community$list_extra$List_Extra$iterate = F2(
	function (f, x) {
		var _p91 = f(x);
		if (_p91.ctor === 'Just') {
			return {
				ctor: '::',
				_0: x,
				_1: A2(_elm_community$list_extra$List_Extra$iterate, f, _p91._0)
			};
		} else {
			return {
				ctor: '::',
				_0: x,
				_1: {ctor: '[]'}
			};
		}
	});
var _elm_community$list_extra$List_Extra$getAt = F2(
	function (idx, xs) {
		return (_elm_lang$core$Native_Utils.cmp(idx, 0) < 0) ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$List$head(
			A2(_elm_lang$core$List$drop, idx, xs));
	});
var _elm_community$list_extra$List_Extra_ops = _elm_community$list_extra$List_Extra_ops || {};
_elm_community$list_extra$List_Extra_ops['!!'] = _elm_lang$core$Basics$flip(_elm_community$list_extra$List_Extra$getAt);
var _elm_community$list_extra$List_Extra$init = function () {
	var maybe = F2(
		function (d, f) {
			return function (_p92) {
				return A2(
					_elm_lang$core$Maybe$withDefault,
					d,
					A2(_elm_lang$core$Maybe$map, f, _p92));
			};
		});
	return A2(
		_elm_lang$core$List$foldr,
		function (x) {
			return function (_p93) {
				return _elm_lang$core$Maybe$Just(
					A3(
						maybe,
						{ctor: '[]'},
						F2(
							function (x, y) {
								return {ctor: '::', _0: x, _1: y};
							})(x),
						_p93));
			};
		},
		_elm_lang$core$Maybe$Nothing);
}();
var _elm_community$list_extra$List_Extra$last = _elm_community$list_extra$List_Extra$foldl1(
	_elm_lang$core$Basics$flip(_elm_lang$core$Basics$always));

var _elm_community$maybe_extra$Maybe_Extra$foldrValues = F2(
	function (item, list) {
		var _p0 = item;
		if (_p0.ctor === 'Nothing') {
			return list;
		} else {
			return {ctor: '::', _0: _p0._0, _1: list};
		}
	});
var _elm_community$maybe_extra$Maybe_Extra$values = A2(
	_elm_lang$core$List$foldr,
	_elm_community$maybe_extra$Maybe_Extra$foldrValues,
	{ctor: '[]'});
var _elm_community$maybe_extra$Maybe_Extra$filter = F2(
	function (f, m) {
		var _p1 = A2(_elm_lang$core$Maybe$map, f, m);
		if ((_p1.ctor === 'Just') && (_p1._0 === true)) {
			return m;
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_community$maybe_extra$Maybe_Extra$traverseArray = function (f) {
	var step = F2(
		function (e, acc) {
			var _p2 = f(e);
			if (_p2.ctor === 'Nothing') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				return A2(
					_elm_lang$core$Maybe$map,
					_elm_lang$core$Array$push(_p2._0),
					acc);
			}
		});
	return A2(
		_elm_lang$core$Array$foldl,
		step,
		_elm_lang$core$Maybe$Just(_elm_lang$core$Array$empty));
};
var _elm_community$maybe_extra$Maybe_Extra$combineArray = _elm_community$maybe_extra$Maybe_Extra$traverseArray(_elm_lang$core$Basics$identity);
var _elm_community$maybe_extra$Maybe_Extra$traverse = function (f) {
	var step = F2(
		function (e, acc) {
			var _p3 = f(e);
			if (_p3.ctor === 'Nothing') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				return A2(
					_elm_lang$core$Maybe$map,
					F2(
						function (x, y) {
							return {ctor: '::', _0: x, _1: y};
						})(_p3._0),
					acc);
			}
		});
	return A2(
		_elm_lang$core$List$foldr,
		step,
		_elm_lang$core$Maybe$Just(
			{ctor: '[]'}));
};
var _elm_community$maybe_extra$Maybe_Extra$combine = _elm_community$maybe_extra$Maybe_Extra$traverse(_elm_lang$core$Basics$identity);
var _elm_community$maybe_extra$Maybe_Extra$maybeToArray = function (m) {
	var _p4 = m;
	if (_p4.ctor === 'Nothing') {
		return _elm_lang$core$Array$empty;
	} else {
		return A2(_elm_lang$core$Array$repeat, 1, _p4._0);
	}
};
var _elm_community$maybe_extra$Maybe_Extra$maybeToList = function (m) {
	var _p5 = m;
	if (_p5.ctor === 'Nothing') {
		return {ctor: '[]'};
	} else {
		return {
			ctor: '::',
			_0: _p5._0,
			_1: {ctor: '[]'}
		};
	}
};
var _elm_community$maybe_extra$Maybe_Extra$orElse = F2(
	function (ma, mb) {
		var _p6 = mb;
		if (_p6.ctor === 'Nothing') {
			return ma;
		} else {
			return mb;
		}
	});
var _elm_community$maybe_extra$Maybe_Extra$orElseLazy = F2(
	function (fma, mb) {
		var _p7 = mb;
		if (_p7.ctor === 'Nothing') {
			return fma(
				{ctor: '_Tuple0'});
		} else {
			return mb;
		}
	});
var _elm_community$maybe_extra$Maybe_Extra$orLazy = F2(
	function (ma, fmb) {
		var _p8 = ma;
		if (_p8.ctor === 'Nothing') {
			return fmb(
				{ctor: '_Tuple0'});
		} else {
			return ma;
		}
	});
var _elm_community$maybe_extra$Maybe_Extra$or = F2(
	function (ma, mb) {
		var _p9 = ma;
		if (_p9.ctor === 'Nothing') {
			return mb;
		} else {
			return ma;
		}
	});
var _elm_community$maybe_extra$Maybe_Extra$prev = _elm_lang$core$Maybe$map2(_elm_lang$core$Basics$always);
var _elm_community$maybe_extra$Maybe_Extra$next = _elm_lang$core$Maybe$map2(
	_elm_lang$core$Basics$flip(_elm_lang$core$Basics$always));
var _elm_community$maybe_extra$Maybe_Extra$andMap = _elm_lang$core$Maybe$map2(
	F2(
		function (x, y) {
			return y(x);
		}));
var _elm_community$maybe_extra$Maybe_Extra$unpack = F3(
	function (d, f, m) {
		var _p10 = m;
		if (_p10.ctor === 'Nothing') {
			return d(
				{ctor: '_Tuple0'});
		} else {
			return f(_p10._0);
		}
	});
var _elm_community$maybe_extra$Maybe_Extra$unwrap = F3(
	function (d, f, m) {
		var _p11 = m;
		if (_p11.ctor === 'Nothing') {
			return d;
		} else {
			return f(_p11._0);
		}
	});
var _elm_community$maybe_extra$Maybe_Extra$isJust = function (m) {
	var _p12 = m;
	if (_p12.ctor === 'Nothing') {
		return false;
	} else {
		return true;
	}
};
var _elm_community$maybe_extra$Maybe_Extra$isNothing = function (m) {
	var _p13 = m;
	if (_p13.ctor === 'Nothing') {
		return true;
	} else {
		return false;
	}
};
var _elm_community$maybe_extra$Maybe_Extra$join = function (mx) {
	var _p14 = mx;
	if (_p14.ctor === 'Just') {
		return _p14._0;
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_community$maybe_extra$Maybe_Extra_ops = _elm_community$maybe_extra$Maybe_Extra_ops || {};
_elm_community$maybe_extra$Maybe_Extra_ops['?'] = F2(
	function (mx, x) {
		return A2(_elm_lang$core$Maybe$withDefault, x, mx);
	});

var _elm_lang$lazy$Native_Lazy = function() {

function memoize(thunk)
{
    var value;
    var isForced = false;
    return function(tuple0) {
        if (!isForced) {
            value = thunk(tuple0);
            isForced = true;
        }
        return value;
    };
}

return {
    memoize: memoize
};

}();

var _elm_lang$lazy$Lazy$force = function (_p0) {
	var _p1 = _p0;
	return _p1._0(
		{ctor: '_Tuple0'});
};
var _elm_lang$lazy$Lazy$Lazy = function (a) {
	return {ctor: 'Lazy', _0: a};
};
var _elm_lang$lazy$Lazy$lazy = function (thunk) {
	return _elm_lang$lazy$Lazy$Lazy(
		_elm_lang$lazy$Native_Lazy.memoize(thunk));
};
var _elm_lang$lazy$Lazy$map = F2(
	function (f, a) {
		return _elm_lang$lazy$Lazy$lazy(
			function (_p2) {
				var _p3 = _p2;
				return f(
					_elm_lang$lazy$Lazy$force(a));
			});
	});
var _elm_lang$lazy$Lazy$map2 = F3(
	function (f, a, b) {
		return _elm_lang$lazy$Lazy$lazy(
			function (_p4) {
				var _p5 = _p4;
				return A2(
					f,
					_elm_lang$lazy$Lazy$force(a),
					_elm_lang$lazy$Lazy$force(b));
			});
	});
var _elm_lang$lazy$Lazy$map3 = F4(
	function (f, a, b, c) {
		return _elm_lang$lazy$Lazy$lazy(
			function (_p6) {
				var _p7 = _p6;
				return A3(
					f,
					_elm_lang$lazy$Lazy$force(a),
					_elm_lang$lazy$Lazy$force(b),
					_elm_lang$lazy$Lazy$force(c));
			});
	});
var _elm_lang$lazy$Lazy$map4 = F5(
	function (f, a, b, c, d) {
		return _elm_lang$lazy$Lazy$lazy(
			function (_p8) {
				var _p9 = _p8;
				return A4(
					f,
					_elm_lang$lazy$Lazy$force(a),
					_elm_lang$lazy$Lazy$force(b),
					_elm_lang$lazy$Lazy$force(c),
					_elm_lang$lazy$Lazy$force(d));
			});
	});
var _elm_lang$lazy$Lazy$map5 = F6(
	function (f, a, b, c, d, e) {
		return _elm_lang$lazy$Lazy$lazy(
			function (_p10) {
				var _p11 = _p10;
				return A5(
					f,
					_elm_lang$lazy$Lazy$force(a),
					_elm_lang$lazy$Lazy$force(b),
					_elm_lang$lazy$Lazy$force(c),
					_elm_lang$lazy$Lazy$force(d),
					_elm_lang$lazy$Lazy$force(e));
			});
	});
var _elm_lang$lazy$Lazy$apply = F2(
	function (f, x) {
		return _elm_lang$lazy$Lazy$lazy(
			function (_p12) {
				var _p13 = _p12;
				return A2(
					_elm_lang$lazy$Lazy$force,
					f,
					_elm_lang$lazy$Lazy$force(x));
			});
	});
var _elm_lang$lazy$Lazy$andThen = F2(
	function (callback, a) {
		return _elm_lang$lazy$Lazy$lazy(
			function (_p14) {
				var _p15 = _p14;
				return _elm_lang$lazy$Lazy$force(
					callback(
						_elm_lang$lazy$Lazy$force(a)));
			});
	});

//import Maybe, Native.List //

var _elm_lang$core$Native_Regex = function() {

function escape(str)
{
	return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
function caseInsensitive(re)
{
	return new RegExp(re.source, 'gi');
}
function regex(raw)
{
	return new RegExp(raw, 'g');
}

function contains(re, string)
{
	return string.match(re) !== null;
}

function find(n, re, str)
{
	n = n.ctor === 'All' ? Infinity : n._0;
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex === re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch === undefined
				? _elm_lang$core$Maybe$Nothing
				: _elm_lang$core$Maybe$Just(submatch);
		}
		out.push({
			match: result[0],
			submatches: _elm_lang$core$Native_List.fromArray(subs),
			index: result.index,
			number: number
		});
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _elm_lang$core$Native_List.fromArray(out);
}

function replace(n, re, replacer, string)
{
	n = n.ctor === 'All' ? Infinity : n._0;
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
			submatches[--i] = submatch === undefined
				? _elm_lang$core$Maybe$Nothing
				: _elm_lang$core$Maybe$Just(submatch);
		}
		return replacer({
			match: match,
			submatches: _elm_lang$core$Native_List.fromArray(submatches),
			index: arguments[arguments.length - 2],
			number: count
		});
	}
	return string.replace(re, jsReplacer);
}

function split(n, re, str)
{
	n = n.ctor === 'All' ? Infinity : n._0;
	if (n === Infinity)
	{
		return _elm_lang$core$Native_List.fromArray(str.split(re));
	}
	var string = str;
	var result;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		if (!(result = re.exec(string))) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _elm_lang$core$Native_List.fromArray(out);
}

return {
	regex: regex,
	caseInsensitive: caseInsensitive,
	escape: escape,

	contains: F2(contains),
	find: F3(find),
	replace: F4(replace),
	split: F3(split)
};

}();

var _elm_lang$core$Regex$split = _elm_lang$core$Native_Regex.split;
var _elm_lang$core$Regex$replace = _elm_lang$core$Native_Regex.replace;
var _elm_lang$core$Regex$find = _elm_lang$core$Native_Regex.find;
var _elm_lang$core$Regex$contains = _elm_lang$core$Native_Regex.contains;
var _elm_lang$core$Regex$caseInsensitive = _elm_lang$core$Native_Regex.caseInsensitive;
var _elm_lang$core$Regex$regex = _elm_lang$core$Native_Regex.regex;
var _elm_lang$core$Regex$escape = _elm_lang$core$Native_Regex.escape;
var _elm_lang$core$Regex$Match = F4(
	function (a, b, c, d) {
		return {match: a, submatches: b, index: c, number: d};
	});
var _elm_lang$core$Regex$Regex = {ctor: 'Regex'};
var _elm_lang$core$Regex$AtMost = function (a) {
	return {ctor: 'AtMost', _0: a};
};
var _elm_lang$core$Regex$All = {ctor: 'All'};

var _elm_community$parser_combinators$Combine$app = function (p) {
	var _p0 = p;
	if (_p0.ctor === 'Parser') {
		return _p0._0;
	} else {
		return _elm_lang$lazy$Lazy$force(_p0._0);
	}
};
var _elm_community$parser_combinators$Combine$InputStream = F3(
	function (a, b, c) {
		return {data: a, input: b, position: c};
	});
var _elm_community$parser_combinators$Combine$initStream = function (s) {
	return A3(_elm_community$parser_combinators$Combine$InputStream, s, s, 0);
};
var _elm_community$parser_combinators$Combine$runParser = F3(
	function (p, st, s) {
		var _p1 = A3(
			_elm_community$parser_combinators$Combine$app,
			p,
			st,
			_elm_community$parser_combinators$Combine$initStream(s));
		if (_p1._2.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(
				{ctor: '_Tuple3', _0: _p1._0, _1: _p1._1, _2: _p1._2._0});
		} else {
			return _elm_lang$core$Result$Err(
				{ctor: '_Tuple3', _0: _p1._0, _1: _p1._1, _2: _p1._2._0});
		}
	});
var _elm_community$parser_combinators$Combine$parse = function (p) {
	return A2(
		_elm_community$parser_combinators$Combine$runParser,
		p,
		{ctor: '_Tuple0'});
};
var _elm_community$parser_combinators$Combine$ParseLocation = F3(
	function (a, b, c) {
		return {source: a, line: b, column: c};
	});
var _elm_community$parser_combinators$Combine$currentLocation = function (stream) {
	var find = F3(
		function (position, currentLine, lines) {
			find:
			while (true) {
				var _p2 = lines;
				if (_p2.ctor === '[]') {
					return A3(_elm_community$parser_combinators$Combine$ParseLocation, '', 1, position);
				} else {
					if (_p2._1.ctor === '[]') {
						return A3(_elm_community$parser_combinators$Combine$ParseLocation, _p2._0, currentLine + 1, position);
					} else {
						var _p3 = _p2._0;
						var length = _elm_lang$core$String$length(_p3);
						if (_elm_lang$core$Native_Utils.cmp(position, length) > -1) {
							var _v3 = (position - length) - 1,
								_v4 = currentLine + 1,
								_v5 = _p2._1;
							position = _v3;
							currentLine = _v4;
							lines = _v5;
							continue find;
						} else {
							if (_elm_lang$core$Native_Utils.eq(currentLine, 0)) {
								return A3(_elm_community$parser_combinators$Combine$ParseLocation, _p3, 1, position);
							} else {
								return A3(_elm_community$parser_combinators$Combine$ParseLocation, _p3, currentLine, position - 1);
							}
						}
					}
				}
			}
		});
	var lines = A2(_elm_lang$core$String$split, '\n', stream.data);
	return A3(find, stream.position, 0, lines);
};
var _elm_community$parser_combinators$Combine$currentSourceLine = function (_p4) {
	return function (_) {
		return _.source;
	}(
		_elm_community$parser_combinators$Combine$currentLocation(_p4));
};
var _elm_community$parser_combinators$Combine$currentLine = function (_p5) {
	return function (_) {
		return _.line;
	}(
		_elm_community$parser_combinators$Combine$currentLocation(_p5));
};
var _elm_community$parser_combinators$Combine$currentColumn = function (_p6) {
	return function (_) {
		return _.column;
	}(
		_elm_community$parser_combinators$Combine$currentLocation(_p6));
};
var _elm_community$parser_combinators$Combine$RecursiveParser = function (a) {
	return {ctor: 'RecursiveParser', _0: a};
};
var _elm_community$parser_combinators$Combine$lazy = function (t) {
	return _elm_community$parser_combinators$Combine$RecursiveParser(
		_elm_lang$lazy$Lazy$lazy(
			function (_p7) {
				var _p8 = _p7;
				return _elm_community$parser_combinators$Combine$app(
					t(
						{ctor: '_Tuple0'}));
			}));
};
var _elm_community$parser_combinators$Combine$Parser = function (a) {
	return {ctor: 'Parser', _0: a};
};
var _elm_community$parser_combinators$Combine$primitive = _elm_community$parser_combinators$Combine$Parser;
var _elm_community$parser_combinators$Combine$bimap = F3(
	function (fok, ferr, p) {
		return _elm_community$parser_combinators$Combine$Parser(
			F2(
				function (state, stream) {
					var _p9 = A3(_elm_community$parser_combinators$Combine$app, p, state, stream);
					if (_p9._2.ctor === 'Ok') {
						return {
							ctor: '_Tuple3',
							_0: _p9._0,
							_1: _p9._1,
							_2: _elm_lang$core$Result$Ok(
								fok(_p9._2._0))
						};
					} else {
						return {
							ctor: '_Tuple3',
							_0: _p9._0,
							_1: _p9._1,
							_2: _elm_lang$core$Result$Err(
								ferr(_p9._2._0))
						};
					}
				}));
	});
var _elm_community$parser_combinators$Combine$map = F2(
	function (f, p) {
		return A3(_elm_community$parser_combinators$Combine$bimap, f, _elm_lang$core$Basics$identity, p);
	});
var _elm_community$parser_combinators$Combine_ops = _elm_community$parser_combinators$Combine_ops || {};
_elm_community$parser_combinators$Combine_ops['<$>'] = _elm_community$parser_combinators$Combine$map;
var _elm_community$parser_combinators$Combine_ops = _elm_community$parser_combinators$Combine_ops || {};
_elm_community$parser_combinators$Combine_ops['<$'] = function (res) {
	return _elm_community$parser_combinators$Combine$map(
		_elm_lang$core$Basics$always(res));
};
var _elm_community$parser_combinators$Combine$skip = function (p) {
	return A2(
		_elm_community$parser_combinators$Combine_ops['<$'],
		{ctor: '_Tuple0'},
		p);
};
var _elm_community$parser_combinators$Combine_ops = _elm_community$parser_combinators$Combine_ops || {};
_elm_community$parser_combinators$Combine_ops['$>'] = _elm_lang$core$Basics$flip(
	F2(
		function (x, y) {
			return A2(_elm_community$parser_combinators$Combine_ops['<$'], x, y);
		}));
var _elm_community$parser_combinators$Combine$mapError = _elm_community$parser_combinators$Combine$bimap(_elm_lang$core$Basics$identity);
var _elm_community$parser_combinators$Combine_ops = _elm_community$parser_combinators$Combine_ops || {};
_elm_community$parser_combinators$Combine_ops['<?>'] = F2(
	function (p, m) {
		return A2(
			_elm_community$parser_combinators$Combine$mapError,
			_elm_lang$core$Basics$always(
				{
					ctor: '::',
					_0: m,
					_1: {ctor: '[]'}
				}),
			p);
	});
var _elm_community$parser_combinators$Combine$withState = function (f) {
	return _elm_community$parser_combinators$Combine$Parser(
		F2(
			function (state, stream) {
				return A3(
					_elm_community$parser_combinators$Combine$app,
					f(state),
					state,
					stream);
			}));
};
var _elm_community$parser_combinators$Combine$withLocation = function (f) {
	return _elm_community$parser_combinators$Combine$Parser(
		F2(
			function (state, stream) {
				return A3(
					_elm_community$parser_combinators$Combine$app,
					f(
						_elm_community$parser_combinators$Combine$currentLocation(stream)),
					state,
					stream);
			}));
};
var _elm_community$parser_combinators$Combine$withLine = function (f) {
	return _elm_community$parser_combinators$Combine$Parser(
		F2(
			function (state, stream) {
				return A3(
					_elm_community$parser_combinators$Combine$app,
					f(
						_elm_community$parser_combinators$Combine$currentLine(stream)),
					state,
					stream);
			}));
};
var _elm_community$parser_combinators$Combine$withColumn = function (f) {
	return _elm_community$parser_combinators$Combine$Parser(
		F2(
			function (state, stream) {
				return A3(
					_elm_community$parser_combinators$Combine$app,
					f(
						_elm_community$parser_combinators$Combine$currentColumn(stream)),
					state,
					stream);
			}));
};
var _elm_community$parser_combinators$Combine$andThen = F2(
	function (f, p) {
		return _elm_community$parser_combinators$Combine$Parser(
			F2(
				function (state, stream) {
					var _p10 = A3(_elm_community$parser_combinators$Combine$app, p, state, stream);
					if (_p10._2.ctor === 'Ok') {
						return A3(
							_elm_community$parser_combinators$Combine$app,
							f(_p10._2._0),
							_p10._0,
							_p10._1);
					} else {
						return {
							ctor: '_Tuple3',
							_0: _p10._0,
							_1: _p10._1,
							_2: _elm_lang$core$Result$Err(_p10._2._0)
						};
					}
				}));
	});
var _elm_community$parser_combinators$Combine_ops = _elm_community$parser_combinators$Combine_ops || {};
_elm_community$parser_combinators$Combine_ops['>>='] = _elm_lang$core$Basics$flip(_elm_community$parser_combinators$Combine$andThen);
var _elm_community$parser_combinators$Combine$andMap = F2(
	function (rp, lp) {
		return A2(
			_elm_community$parser_combinators$Combine_ops['>>='],
			lp,
			A2(_elm_lang$core$Basics$flip, _elm_community$parser_combinators$Combine$map, rp));
	});
var _elm_community$parser_combinators$Combine_ops = _elm_community$parser_combinators$Combine_ops || {};
_elm_community$parser_combinators$Combine_ops['<*>'] = _elm_lang$core$Basics$flip(_elm_community$parser_combinators$Combine$andMap);
var _elm_community$parser_combinators$Combine_ops = _elm_community$parser_combinators$Combine_ops || {};
_elm_community$parser_combinators$Combine_ops['<*'] = F2(
	function (lp, rp) {
		return A2(
			_elm_community$parser_combinators$Combine$andMap,
			rp,
			A2(_elm_community$parser_combinators$Combine$map, _elm_lang$core$Basics$always, lp));
	});
var _elm_community$parser_combinators$Combine_ops = _elm_community$parser_combinators$Combine_ops || {};
_elm_community$parser_combinators$Combine_ops['*>'] = F2(
	function (lp, rp) {
		return A2(
			_elm_community$parser_combinators$Combine$andMap,
			rp,
			A2(
				_elm_community$parser_combinators$Combine$map,
				_elm_lang$core$Basics$flip(_elm_lang$core$Basics$always),
				lp));
	});
var _elm_community$parser_combinators$Combine$between = F3(
	function (lp, rp, p) {
		return A2(
			_elm_community$parser_combinators$Combine_ops['<*'],
			A2(_elm_community$parser_combinators$Combine_ops['*>'], lp, p),
			rp);
	});
var _elm_community$parser_combinators$Combine$sequence = function (ps) {
	var accumulate = F4(
		function (acc, ps, state, stream) {
			accumulate:
			while (true) {
				var _p11 = ps;
				if (_p11.ctor === '[]') {
					return {
						ctor: '_Tuple3',
						_0: state,
						_1: stream,
						_2: _elm_lang$core$Result$Ok(
							_elm_lang$core$List$reverse(acc))
					};
				} else {
					var _p12 = A3(_elm_community$parser_combinators$Combine$app, _p11._0, state, stream);
					if (_p12._2.ctor === 'Ok') {
						var _v11 = {ctor: '::', _0: _p12._2._0, _1: acc},
							_v12 = _p11._1,
							_v13 = _p12._0,
							_v14 = _p12._1;
						acc = _v11;
						ps = _v12;
						state = _v13;
						stream = _v14;
						continue accumulate;
					} else {
						return {
							ctor: '_Tuple3',
							_0: _p12._0,
							_1: _p12._1,
							_2: _elm_lang$core$Result$Err(_p12._2._0)
						};
					}
				}
			}
		});
	return _elm_community$parser_combinators$Combine$Parser(
		F2(
			function (state, stream) {
				return A4(
					accumulate,
					{ctor: '[]'},
					ps,
					state,
					stream);
			}));
};
var _elm_community$parser_combinators$Combine$fail = function (m) {
	return _elm_community$parser_combinators$Combine$Parser(
		F2(
			function (state, stream) {
				return {
					ctor: '_Tuple3',
					_0: state,
					_1: stream,
					_2: _elm_lang$core$Result$Err(
						{
							ctor: '::',
							_0: m,
							_1: {ctor: '[]'}
						})
				};
			}));
};
var _elm_community$parser_combinators$Combine$emptyErr = _elm_community$parser_combinators$Combine$Parser(
	F2(
		function (state, stream) {
			return {
				ctor: '_Tuple3',
				_0: state,
				_1: stream,
				_2: _elm_lang$core$Result$Err(
					{ctor: '[]'})
			};
		}));
var _elm_community$parser_combinators$Combine$succeed = function (res) {
	return _elm_community$parser_combinators$Combine$Parser(
		F2(
			function (state, stream) {
				return {
					ctor: '_Tuple3',
					_0: state,
					_1: stream,
					_2: _elm_lang$core$Result$Ok(res)
				};
			}));
};
var _elm_community$parser_combinators$Combine$putState = function (state) {
	return _elm_community$parser_combinators$Combine$Parser(
		F2(
			function (_p13, stream) {
				return A3(
					_elm_community$parser_combinators$Combine$app,
					_elm_community$parser_combinators$Combine$succeed(
						{ctor: '_Tuple0'}),
					state,
					stream);
			}));
};
var _elm_community$parser_combinators$Combine$modifyState = function (f) {
	return _elm_community$parser_combinators$Combine$Parser(
		F2(
			function (state, stream) {
				return A3(
					_elm_community$parser_combinators$Combine$app,
					_elm_community$parser_combinators$Combine$succeed(
						{ctor: '_Tuple0'}),
					f(state),
					stream);
			}));
};
var _elm_community$parser_combinators$Combine$count = F2(
	function (n, p) {
		var accumulate = F2(
			function (x, acc) {
				return (_elm_lang$core$Native_Utils.cmp(x, 0) < 1) ? _elm_community$parser_combinators$Combine$succeed(
					_elm_lang$core$List$reverse(acc)) : A2(
					_elm_community$parser_combinators$Combine$andThen,
					function (res) {
						return A2(
							accumulate,
							x - 1,
							{ctor: '::', _0: res, _1: acc});
					},
					p);
			});
		return A2(
			accumulate,
			n,
			{ctor: '[]'});
	});
var _elm_community$parser_combinators$Combine$string = function (s) {
	return _elm_community$parser_combinators$Combine$Parser(
		F2(
			function (state, stream) {
				if (A2(_elm_lang$core$String$startsWith, s, stream.input)) {
					var len = _elm_lang$core$String$length(s);
					var rem = A2(_elm_lang$core$String$dropLeft, len, stream.input);
					var pos = stream.position + len;
					return {
						ctor: '_Tuple3',
						_0: state,
						_1: _elm_lang$core$Native_Utils.update(
							stream,
							{input: rem, position: pos}),
						_2: _elm_lang$core$Result$Ok(s)
					};
				} else {
					return {
						ctor: '_Tuple3',
						_0: state,
						_1: stream,
						_2: _elm_lang$core$Result$Err(
							{
								ctor: '::',
								_0: A2(
									_elm_lang$core$Basics_ops['++'],
									'expected ',
									_elm_lang$core$Basics$toString(s)),
								_1: {ctor: '[]'}
							})
					};
				}
			}));
};
var _elm_community$parser_combinators$Combine$parens = A2(
	_elm_community$parser_combinators$Combine$between,
	_elm_community$parser_combinators$Combine$string('('),
	_elm_community$parser_combinators$Combine$string(')'));
var _elm_community$parser_combinators$Combine$braces = A2(
	_elm_community$parser_combinators$Combine$between,
	_elm_community$parser_combinators$Combine$string('{'),
	_elm_community$parser_combinators$Combine$string('}'));
var _elm_community$parser_combinators$Combine$brackets = A2(
	_elm_community$parser_combinators$Combine$between,
	_elm_community$parser_combinators$Combine$string('['),
	_elm_community$parser_combinators$Combine$string(']'));
var _elm_community$parser_combinators$Combine$regex = function (pat) {
	var pattern = A2(_elm_lang$core$String$startsWith, '^', pat) ? pat : A2(_elm_lang$core$Basics_ops['++'], '^', pat);
	return _elm_community$parser_combinators$Combine$Parser(
		F2(
			function (state, stream) {
				var _p14 = A3(
					_elm_lang$core$Regex$find,
					_elm_lang$core$Regex$AtMost(1),
					_elm_lang$core$Regex$regex(pattern),
					stream.input);
				if ((_p14.ctor === '::') && (_p14._1.ctor === '[]')) {
					var _p15 = _p14._0;
					var len = _elm_lang$core$String$length(_p15.match);
					var rem = A2(_elm_lang$core$String$dropLeft, len, stream.input);
					var pos = stream.position + len;
					return {
						ctor: '_Tuple3',
						_0: state,
						_1: _elm_lang$core$Native_Utils.update(
							stream,
							{input: rem, position: pos}),
						_2: _elm_lang$core$Result$Ok(_p15.match)
					};
				} else {
					return {
						ctor: '_Tuple3',
						_0: state,
						_1: stream,
						_2: _elm_lang$core$Result$Err(
							{
								ctor: '::',
								_0: A2(
									_elm_lang$core$Basics_ops['++'],
									'expected input matching Regexp /',
									A2(_elm_lang$core$Basics_ops['++'], pattern, '/')),
								_1: {ctor: '[]'}
							})
					};
				}
			}));
};
var _elm_community$parser_combinators$Combine$whitespace = A2(
	_elm_community$parser_combinators$Combine_ops['<?>'],
	_elm_community$parser_combinators$Combine$regex('[ \t\r\n]*'),
	'whitespace');
var _elm_community$parser_combinators$Combine$while = function (pred) {
	var accumulate = F3(
		function (acc, state, stream) {
			accumulate:
			while (true) {
				var _p16 = _elm_lang$core$String$uncons(stream.input);
				if (_p16.ctor === 'Just') {
					var _p17 = _p16._0._0;
					if (pred(_p17)) {
						var pos = stream.position + 1;
						var c = A2(_elm_lang$core$String$cons, _p17, '');
						var _v17 = A2(_elm_lang$core$Basics_ops['++'], acc, c),
							_v18 = state,
							_v19 = _elm_lang$core$Native_Utils.update(
							stream,
							{input: _p16._0._1, position: pos});
						acc = _v17;
						state = _v18;
						stream = _v19;
						continue accumulate;
					} else {
						return {ctor: '_Tuple3', _0: state, _1: stream, _2: acc};
					}
				} else {
					return {ctor: '_Tuple3', _0: state, _1: stream, _2: acc};
				}
			}
		});
	return _elm_community$parser_combinators$Combine$Parser(
		F2(
			function (state, stream) {
				var _p18 = A3(accumulate, '', state, stream);
				var rstate = _p18._0;
				var rstream = _p18._1;
				var res = _p18._2;
				return {
					ctor: '_Tuple3',
					_0: rstate,
					_1: rstream,
					_2: _elm_lang$core$Result$Ok(res)
				};
			}));
};
var _elm_community$parser_combinators$Combine$end = _elm_community$parser_combinators$Combine$Parser(
	F2(
		function (state, stream) {
			return _elm_lang$core$Native_Utils.eq(stream.input, '') ? {
				ctor: '_Tuple3',
				_0: state,
				_1: stream,
				_2: _elm_lang$core$Result$Ok(
					{ctor: '_Tuple0'})
			} : {
				ctor: '_Tuple3',
				_0: state,
				_1: stream,
				_2: _elm_lang$core$Result$Err(
					{
						ctor: '::',
						_0: 'expected end of input',
						_1: {ctor: '[]'}
					})
			};
		}));
var _elm_community$parser_combinators$Combine$lookAhead = function (p) {
	return _elm_community$parser_combinators$Combine$Parser(
		F2(
			function (state, stream) {
				var _p19 = A3(_elm_community$parser_combinators$Combine$app, p, state, stream);
				if ((_p19.ctor === '_Tuple3') && (_p19._2.ctor === 'Ok')) {
					return {
						ctor: '_Tuple3',
						_0: _p19._0,
						_1: stream,
						_2: _elm_lang$core$Result$Ok(_p19._2._0)
					};
				} else {
					return _p19;
				}
			}));
};
var _elm_community$parser_combinators$Combine$or = F2(
	function (lp, rp) {
		return _elm_community$parser_combinators$Combine$Parser(
			F2(
				function (state, stream) {
					var _p20 = A3(_elm_community$parser_combinators$Combine$app, lp, state, stream);
					if (_p20._2.ctor === 'Ok') {
						return _p20;
					} else {
						var _p21 = A3(_elm_community$parser_combinators$Combine$app, rp, state, stream);
						if (_p21._2.ctor === 'Ok') {
							return _p21;
						} else {
							return {
								ctor: '_Tuple3',
								_0: state,
								_1: stream,
								_2: _elm_lang$core$Result$Err(
									A2(_elm_lang$core$Basics_ops['++'], _p20._2._0, _p21._2._0))
							};
						}
					}
				}));
	});
var _elm_community$parser_combinators$Combine$choice = function (xs) {
	return A3(_elm_lang$core$List$foldr, _elm_community$parser_combinators$Combine$or, _elm_community$parser_combinators$Combine$emptyErr, xs);
};
var _elm_community$parser_combinators$Combine_ops = _elm_community$parser_combinators$Combine_ops || {};
_elm_community$parser_combinators$Combine_ops['<|>'] = _elm_community$parser_combinators$Combine$or;
var _elm_community$parser_combinators$Combine$optional = F2(
	function (res, p) {
		return A2(
			_elm_community$parser_combinators$Combine_ops['<|>'],
			p,
			_elm_community$parser_combinators$Combine$succeed(res));
	});
var _elm_community$parser_combinators$Combine$chainl = F2(
	function (op, p) {
		var accumulate = function (x) {
			return A2(
				_elm_community$parser_combinators$Combine_ops['<|>'],
				A2(
					_elm_community$parser_combinators$Combine$andThen,
					function (f) {
						return A2(
							_elm_community$parser_combinators$Combine$andThen,
							function (y) {
								return accumulate(
									A2(f, x, y));
							},
							p);
					},
					op),
				_elm_community$parser_combinators$Combine$succeed(x));
		};
		return A2(_elm_community$parser_combinators$Combine$andThen, accumulate, p);
	});
var _elm_community$parser_combinators$Combine$chainr = F2(
	function (op, p) {
		var accumulate = function (x) {
			return A2(
				_elm_community$parser_combinators$Combine_ops['<|>'],
				A2(
					_elm_community$parser_combinators$Combine$andThen,
					function (f) {
						return A2(
							_elm_community$parser_combinators$Combine$andThen,
							function (y) {
								return _elm_community$parser_combinators$Combine$succeed(
									A2(f, x, y));
							},
							A2(_elm_community$parser_combinators$Combine$andThen, accumulate, p));
					},
					op),
				_elm_community$parser_combinators$Combine$succeed(x));
		};
		return A2(_elm_community$parser_combinators$Combine$andThen, accumulate, p);
	});
var _elm_community$parser_combinators$Combine$maybe = function (p) {
	return _elm_community$parser_combinators$Combine$Parser(
		F2(
			function (state, stream) {
				var _p22 = A3(_elm_community$parser_combinators$Combine$app, p, state, stream);
				if ((_p22.ctor === '_Tuple3') && (_p22._2.ctor === 'Ok')) {
					return {
						ctor: '_Tuple3',
						_0: _p22._0,
						_1: _p22._1,
						_2: _elm_lang$core$Result$Ok(
							_elm_lang$core$Maybe$Just(_p22._2._0))
					};
				} else {
					return {
						ctor: '_Tuple3',
						_0: state,
						_1: stream,
						_2: _elm_lang$core$Result$Ok(_elm_lang$core$Maybe$Nothing)
					};
				}
			}));
};
var _elm_community$parser_combinators$Combine$many = function (p) {
	var accumulate = F3(
		function (acc, state, stream) {
			accumulate:
			while (true) {
				var _p23 = A3(_elm_community$parser_combinators$Combine$app, p, state, stream);
				if ((_p23.ctor === '_Tuple3') && (_p23._2.ctor === 'Ok')) {
					var _p25 = _p23._1;
					var _p24 = _p23._0;
					if (_elm_lang$core$Native_Utils.eq(stream, _p25)) {
						return {
							ctor: '_Tuple3',
							_0: _p24,
							_1: _p25,
							_2: _elm_lang$core$List$reverse(acc)
						};
					} else {
						var _v25 = {ctor: '::', _0: _p23._2._0, _1: acc},
							_v26 = _p24,
							_v27 = _p25;
						acc = _v25;
						state = _v26;
						stream = _v27;
						continue accumulate;
					}
				} else {
					return {
						ctor: '_Tuple3',
						_0: state,
						_1: stream,
						_2: _elm_lang$core$List$reverse(acc)
					};
				}
			}
		});
	return _elm_community$parser_combinators$Combine$Parser(
		F2(
			function (state, stream) {
				var _p26 = A3(
					accumulate,
					{ctor: '[]'},
					state,
					stream);
				var rstate = _p26._0;
				var rstream = _p26._1;
				var res = _p26._2;
				return {
					ctor: '_Tuple3',
					_0: rstate,
					_1: rstream,
					_2: _elm_lang$core$Result$Ok(res)
				};
			}));
};
var _elm_community$parser_combinators$Combine$many1 = function (p) {
	return A2(
		_elm_community$parser_combinators$Combine_ops['<*>'],
		A2(
			_elm_community$parser_combinators$Combine_ops['<$>'],
			F2(
				function (x, y) {
					return {ctor: '::', _0: x, _1: y};
				}),
			p),
		_elm_community$parser_combinators$Combine$many(p));
};
var _elm_community$parser_combinators$Combine$skipMany1 = function (p) {
	return A2(
		_elm_community$parser_combinators$Combine_ops['<$'],
		{ctor: '_Tuple0'},
		_elm_community$parser_combinators$Combine$many1(
			_elm_community$parser_combinators$Combine$skip(p)));
};
var _elm_community$parser_combinators$Combine$sepBy1 = F2(
	function (sep, p) {
		return A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			A2(
				_elm_community$parser_combinators$Combine_ops['<$>'],
				F2(
					function (x, y) {
						return {ctor: '::', _0: x, _1: y};
					}),
				p),
			_elm_community$parser_combinators$Combine$many(
				A2(_elm_community$parser_combinators$Combine_ops['*>'], sep, p)));
	});
var _elm_community$parser_combinators$Combine$sepBy = F2(
	function (sep, p) {
		return A2(
			_elm_community$parser_combinators$Combine_ops['<|>'],
			A2(_elm_community$parser_combinators$Combine$sepBy1, sep, p),
			_elm_community$parser_combinators$Combine$succeed(
				{ctor: '[]'}));
	});
var _elm_community$parser_combinators$Combine$sepEndBy1 = F2(
	function (sep, p) {
		return A2(
			_elm_community$parser_combinators$Combine_ops['<*'],
			A2(_elm_community$parser_combinators$Combine$sepBy1, sep, p),
			_elm_community$parser_combinators$Combine$maybe(sep));
	});
var _elm_community$parser_combinators$Combine$sepEndBy = F2(
	function (sep, p) {
		return A2(
			_elm_community$parser_combinators$Combine_ops['<|>'],
			A2(_elm_community$parser_combinators$Combine$sepEndBy1, sep, p),
			_elm_community$parser_combinators$Combine$succeed(
				{ctor: '[]'}));
	});
var _elm_community$parser_combinators$Combine$skipMany = function (p) {
	return A2(
		_elm_community$parser_combinators$Combine_ops['<$'],
		{ctor: '_Tuple0'},
		_elm_community$parser_combinators$Combine$many(
			_elm_community$parser_combinators$Combine$skip(p)));
};
var _elm_community$parser_combinators$Combine$manyTill = F2(
	function (p, end) {
		var accumulate = F3(
			function (acc, state, stream) {
				accumulate:
				while (true) {
					var _p27 = A3(_elm_community$parser_combinators$Combine$app, end, state, stream);
					if (_p27._2.ctor === 'Ok') {
						return {
							ctor: '_Tuple3',
							_0: _p27._0,
							_1: _p27._1,
							_2: _elm_lang$core$Result$Ok(
								_elm_lang$core$List$reverse(acc))
						};
					} else {
						var _p28 = A3(_elm_community$parser_combinators$Combine$app, p, state, stream);
						if ((_p28.ctor === '_Tuple3') && (_p28._2.ctor === 'Ok')) {
							var _v30 = {ctor: '::', _0: _p28._2._0, _1: acc},
								_v31 = _p28._0,
								_v32 = _p28._1;
							acc = _v30;
							state = _v31;
							stream = _v32;
							continue accumulate;
						} else {
							return {
								ctor: '_Tuple3',
								_0: _p27._0,
								_1: _p27._1,
								_2: _elm_lang$core$Result$Err(_p27._2._0)
							};
						}
					}
				}
			});
		return _elm_community$parser_combinators$Combine$Parser(
			accumulate(
				{ctor: '[]'}));
	});

var _elm_community$parser_combinators$Combine_Char$crlf = A2(
	_elm_community$parser_combinators$Combine_ops['<$'],
	_elm_lang$core$Native_Utils.chr('\n'),
	A2(
		_elm_community$parser_combinators$Combine_ops['<?>'],
		_elm_community$parser_combinators$Combine$regex('\r\n'),
		'expected crlf'));
var _elm_community$parser_combinators$Combine_Char$satisfy = function (pred) {
	return _elm_community$parser_combinators$Combine$primitive(
		F2(
			function (state, stream) {
				var message = 'could not satisfy predicate';
				var _p0 = _elm_lang$core$String$uncons(stream.input);
				if (_p0.ctor === 'Just') {
					var _p1 = _p0._0._0;
					return pred(_p1) ? {
						ctor: '_Tuple3',
						_0: state,
						_1: _elm_lang$core$Native_Utils.update(
							stream,
							{input: _p0._0._1, position: stream.position + 1}),
						_2: _elm_lang$core$Result$Ok(_p1)
					} : {
						ctor: '_Tuple3',
						_0: state,
						_1: stream,
						_2: _elm_lang$core$Result$Err(
							{
								ctor: '::',
								_0: message,
								_1: {ctor: '[]'}
							})
					};
				} else {
					return {
						ctor: '_Tuple3',
						_0: state,
						_1: stream,
						_2: _elm_lang$core$Result$Err(
							{
								ctor: '::',
								_0: message,
								_1: {ctor: '[]'}
							})
					};
				}
			}));
};
var _elm_community$parser_combinators$Combine_Char$char = function (c) {
	return A2(
		_elm_community$parser_combinators$Combine_ops['<?>'],
		_elm_community$parser_combinators$Combine_Char$satisfy(
			F2(
				function (x, y) {
					return _elm_lang$core$Native_Utils.eq(x, y);
				})(c)),
		A2(
			_elm_lang$core$Basics_ops['++'],
			'expected ',
			_elm_lang$core$Basics$toString(c)));
};
var _elm_community$parser_combinators$Combine_Char$anyChar = A2(
	_elm_community$parser_combinators$Combine_ops['<?>'],
	_elm_community$parser_combinators$Combine_Char$satisfy(
		_elm_lang$core$Basics$always(true)),
	'expected any character');
var _elm_community$parser_combinators$Combine_Char$oneOf = function (cs) {
	return A2(
		_elm_community$parser_combinators$Combine_ops['<?>'],
		_elm_community$parser_combinators$Combine_Char$satisfy(
			A2(_elm_lang$core$Basics$flip, _elm_lang$core$List$member, cs)),
		A2(
			_elm_lang$core$Basics_ops['++'],
			'expected one of ',
			_elm_lang$core$Basics$toString(cs)));
};
var _elm_community$parser_combinators$Combine_Char$noneOf = function (cs) {
	return A2(
		_elm_community$parser_combinators$Combine_ops['<?>'],
		_elm_community$parser_combinators$Combine_Char$satisfy(
			function (_p2) {
				return !A3(_elm_lang$core$Basics$flip, _elm_lang$core$List$member, cs, _p2);
			}),
		A2(
			_elm_lang$core$Basics_ops['++'],
			'expected none of ',
			_elm_lang$core$Basics$toString(cs)));
};
var _elm_community$parser_combinators$Combine_Char$space = A2(
	_elm_community$parser_combinators$Combine_ops['<?>'],
	_elm_community$parser_combinators$Combine_Char$satisfy(
		F2(
			function (x, y) {
				return _elm_lang$core$Native_Utils.eq(x, y);
			})(
			_elm_lang$core$Native_Utils.chr(' '))),
	'expected space');
var _elm_community$parser_combinators$Combine_Char$tab = A2(
	_elm_community$parser_combinators$Combine_ops['<?>'],
	_elm_community$parser_combinators$Combine_Char$satisfy(
		F2(
			function (x, y) {
				return _elm_lang$core$Native_Utils.eq(x, y);
			})(
			_elm_lang$core$Native_Utils.chr('\t'))),
	'expected tab');
var _elm_community$parser_combinators$Combine_Char$newline = A2(
	_elm_community$parser_combinators$Combine_ops['<?>'],
	_elm_community$parser_combinators$Combine_Char$satisfy(
		F2(
			function (x, y) {
				return _elm_lang$core$Native_Utils.eq(x, y);
			})(
			_elm_lang$core$Native_Utils.chr('\n'))),
	'expected newline');
var _elm_community$parser_combinators$Combine_Char$eol = A2(_elm_community$parser_combinators$Combine_ops['<|>'], _elm_community$parser_combinators$Combine_Char$newline, _elm_community$parser_combinators$Combine_Char$crlf);
var _elm_community$parser_combinators$Combine_Char$lower = A2(
	_elm_community$parser_combinators$Combine_ops['<?>'],
	_elm_community$parser_combinators$Combine_Char$satisfy(_elm_lang$core$Char$isLower),
	'expected a lowercase character');
var _elm_community$parser_combinators$Combine_Char$upper = A2(
	_elm_community$parser_combinators$Combine_ops['<?>'],
	_elm_community$parser_combinators$Combine_Char$satisfy(_elm_lang$core$Char$isUpper),
	'expected an uppercase character');
var _elm_community$parser_combinators$Combine_Char$digit = A2(
	_elm_community$parser_combinators$Combine_ops['<?>'],
	_elm_community$parser_combinators$Combine_Char$satisfy(_elm_lang$core$Char$isDigit),
	'expected a digit');
var _elm_community$parser_combinators$Combine_Char$octDigit = A2(
	_elm_community$parser_combinators$Combine_ops['<?>'],
	_elm_community$parser_combinators$Combine_Char$satisfy(_elm_lang$core$Char$isOctDigit),
	'expected an octal digit');
var _elm_community$parser_combinators$Combine_Char$hexDigit = A2(
	_elm_community$parser_combinators$Combine_ops['<?>'],
	_elm_community$parser_combinators$Combine_Char$satisfy(_elm_lang$core$Char$isHexDigit),
	'expected a hexadecimal digit');

var _elm_community$parser_combinators$Combine_Num$digit = function () {
	var toDigit = function (c) {
		return _elm_lang$core$Char$toCode(c) - _elm_lang$core$Char$toCode(
			_elm_lang$core$Native_Utils.chr('0'));
	};
	return A2(
		_elm_community$parser_combinators$Combine_ops['<$>'],
		toDigit,
		A2(_elm_community$parser_combinators$Combine_ops['<?>'], _elm_community$parser_combinators$Combine_Char$digit, 'expected a digit'));
}();
var _elm_community$parser_combinators$Combine_Num$sign = A2(
	_elm_community$parser_combinators$Combine$optional,
	1,
	_elm_community$parser_combinators$Combine$choice(
		{
			ctor: '::',
			_0: A2(
				_elm_community$parser_combinators$Combine_ops['<$'],
				1,
				_elm_community$parser_combinators$Combine$string('+')),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_community$parser_combinators$Combine_ops['<$'],
					-1,
					_elm_community$parser_combinators$Combine$string('-')),
				_1: {ctor: '[]'}
			}
		}));
var _elm_community$parser_combinators$Combine_Num$unwrap = F2(
	function (f, s) {
		var _p0 = f(s);
		if (_p0.ctor === 'Ok') {
			return _p0._0;
		} else {
			return _elm_lang$core$Native_Utils.crashCase(
				'Combine.Num',
				{
					start: {line: 23, column: 5},
					end: {line: 28, column: 85}
				},
				_p0)(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'impossible state in Combine.Num.unwrap: ',
					_elm_lang$core$Basics$toString(_p0._0)));
		}
	});
var _elm_community$parser_combinators$Combine_Num$toInt = _elm_community$parser_combinators$Combine_Num$unwrap(_elm_lang$core$String$toInt);
var _elm_community$parser_combinators$Combine_Num$int = A2(
	_elm_community$parser_combinators$Combine_ops['<*>'],
	A2(
		_elm_community$parser_combinators$Combine_ops['<$>'],
		F2(
			function (x, y) {
				return x * y;
			}),
		_elm_community$parser_combinators$Combine_Num$sign),
	A2(
		_elm_community$parser_combinators$Combine_ops['<?>'],
		A2(
			_elm_community$parser_combinators$Combine_ops['<$>'],
			_elm_community$parser_combinators$Combine_Num$toInt,
			_elm_community$parser_combinators$Combine$regex('(0|[1-9][0-9]*)')),
		'expected an integer'));
var _elm_community$parser_combinators$Combine_Num$toFloat = _elm_community$parser_combinators$Combine_Num$unwrap(_elm_lang$core$String$toFloat);
var _elm_community$parser_combinators$Combine_Num$float = A2(
	_elm_community$parser_combinators$Combine_ops['<*>'],
	A2(
		_elm_community$parser_combinators$Combine_ops['<$>'],
		function (_p2) {
			return F2(
				function (x, y) {
					return x * y;
				})(
				_elm_lang$core$Basics$toFloat(_p2));
		},
		_elm_community$parser_combinators$Combine_Num$sign),
	A2(
		_elm_community$parser_combinators$Combine_ops['<?>'],
		A2(
			_elm_community$parser_combinators$Combine_ops['<$>'],
			_elm_community$parser_combinators$Combine_Num$toFloat,
			_elm_community$parser_combinators$Combine$regex('(0|[1-9][0-9]*)(\\.[0-9]+)')),
		'expected a float'));

var _elm_community$result_extra$Result_Extra$merge = function (r) {
	var _p0 = r;
	if (_p0.ctor === 'Ok') {
		return _p0._0;
	} else {
		return _p0._0;
	}
};
var _elm_community$result_extra$Result_Extra$orElse = F2(
	function (ra, rb) {
		var _p1 = rb;
		if (_p1.ctor === 'Err') {
			return ra;
		} else {
			return rb;
		}
	});
var _elm_community$result_extra$Result_Extra$orElseLazy = F2(
	function (fra, rb) {
		var _p2 = rb;
		if (_p2.ctor === 'Err') {
			return fra(
				{ctor: '_Tuple0'});
		} else {
			return rb;
		}
	});
var _elm_community$result_extra$Result_Extra$orLazy = F2(
	function (ra, frb) {
		var _p3 = ra;
		if (_p3.ctor === 'Err') {
			return frb(
				{ctor: '_Tuple0'});
		} else {
			return ra;
		}
	});
var _elm_community$result_extra$Result_Extra$or = F2(
	function (ra, rb) {
		var _p4 = ra;
		if (_p4.ctor === 'Err') {
			return rb;
		} else {
			return ra;
		}
	});
var _elm_community$result_extra$Result_Extra$andMap = F2(
	function (ra, rb) {
		var _p5 = {ctor: '_Tuple2', _0: ra, _1: rb};
		if (_p5._1.ctor === 'Err') {
			return _elm_lang$core$Result$Err(_p5._1._0);
		} else {
			return A2(_elm_lang$core$Result$map, _p5._1._0, _p5._0);
		}
	});
var _elm_community$result_extra$Result_Extra$singleton = _elm_lang$core$Result$Ok;
var _elm_community$result_extra$Result_Extra$combine = A2(
	_elm_lang$core$List$foldr,
	_elm_lang$core$Result$map2(
		F2(
			function (x, y) {
				return {ctor: '::', _0: x, _1: y};
			})),
	_elm_lang$core$Result$Ok(
		{ctor: '[]'}));
var _elm_community$result_extra$Result_Extra$mapBoth = F3(
	function (errFunc, okFunc, result) {
		var _p6 = result;
		if (_p6.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(
				okFunc(_p6._0));
		} else {
			return _elm_lang$core$Result$Err(
				errFunc(_p6._0));
		}
	});
var _elm_community$result_extra$Result_Extra$unpack = F3(
	function (errFunc, okFunc, result) {
		var _p7 = result;
		if (_p7.ctor === 'Ok') {
			return okFunc(_p7._0);
		} else {
			return errFunc(_p7._0);
		}
	});
var _elm_community$result_extra$Result_Extra$unwrap = F3(
	function (defaultValue, okFunc, result) {
		var _p8 = result;
		if (_p8.ctor === 'Ok') {
			return okFunc(_p8._0);
		} else {
			return defaultValue;
		}
	});
var _elm_community$result_extra$Result_Extra$extract = F2(
	function (f, x) {
		var _p9 = x;
		if (_p9.ctor === 'Ok') {
			return _p9._0;
		} else {
			return f(_p9._0);
		}
	});
var _elm_community$result_extra$Result_Extra$isErr = function (x) {
	var _p10 = x;
	if (_p10.ctor === 'Ok') {
		return false;
	} else {
		return true;
	}
};
var _elm_community$result_extra$Result_Extra$isOk = function (x) {
	var _p11 = x;
	if (_p11.ctor === 'Ok') {
		return true;
	} else {
		return false;
	}
};

var _iosphere$elm_network_graph$Graph_Node$dictFromList = function (nodes) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (node, dict) {
				return A3(_elm_lang$core$Dict$insert, node.identifier, node, dict);
			}),
		_elm_lang$core$Dict$empty,
		nodes);
};
var _iosphere$elm_network_graph$Graph_Node$identifierFromName = function (name) {
	return A2(_elm_lang$core$String$join, '-', name);
};
var _iosphere$elm_network_graph$Graph_Node$namePrefix = F2(
	function (n, name) {
		return A2(_elm_lang$core$List$take, n, name);
	});
var _iosphere$elm_network_graph$Graph_Node$fromName = function (name) {
	return {
		identifier: _iosphere$elm_network_graph$Graph_Node$identifierFromName(name),
		name: name
	};
};
var _iosphere$elm_network_graph$Graph_Node$Node = F2(
	function (a, b) {
		return {identifier: a, name: b};
	});

var _iosphere$elm_network_graph$Graph_Edge$filterForIdentifiers = function (identifiers) {
	return _elm_lang$core$List$filter(
		function (edge) {
			return A2(_elm_lang$core$Set$member, edge.to, identifiers) && A2(_elm_lang$core$Set$member, edge.from, identifiers);
		});
};
var _iosphere$elm_network_graph$Graph_Edge$Edge = F2(
	function (a, b) {
		return {from: a, to: b};
	});

var _iosphere$elm_network_graph$Graph$filterEdgesForNodes = F2(
	function (edges, nodes) {
		var identifiers = _elm_lang$core$Set$fromList(
			A2(
				_elm_lang$core$List$map,
				function (_) {
					return _.identifier;
				},
				nodes));
		return A2(_iosphere$elm_network_graph$Graph_Edge$filterForIdentifiers, identifiers, edges);
	});
var _iosphere$elm_network_graph$Graph$Graph = F2(
	function (a, b) {
		return {edges: a, nodes: b};
	});
var _iosphere$elm_network_graph$Graph$init = _iosphere$elm_network_graph$Graph$Graph;
var _iosphere$elm_network_graph$Graph$empty = A2(
	_iosphere$elm_network_graph$Graph$init,
	{ctor: '[]'},
	{ctor: '[]'});
var _iosphere$elm_network_graph$Graph$filter = F2(
	function (filterBy, graph) {
		var filteredNodes = A2(_elm_lang$core$List$filter, filterBy, graph.nodes);
		var filteredEdges = A2(_iosphere$elm_network_graph$Graph$filterEdgesForNodes, graph.edges, filteredNodes);
		return A2(_iosphere$elm_network_graph$Graph$Graph, filteredEdges, filteredNodes);
	});
var _iosphere$elm_network_graph$Graph$filterByName = function (namesPrefix) {
	var filterBy = function (node) {
		return _elm_lang$core$Native_Utils.eq(
			A2(
				_elm_lang$core$List$take,
				_elm_lang$core$List$length(namesPrefix),
				node.name),
			namesPrefix);
	};
	return _iosphere$elm_network_graph$Graph$filter(filterBy);
};

var _iosphere$elm_network_graph$Graph_Edge_Json$encode = function (record) {
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'id',
				_1: _elm_lang$core$Json_Encode$string(
					A2(
						_elm_lang$core$Basics_ops['++'],
						record.from,
						A2(_elm_lang$core$Basics_ops['++'], '<->', record.to)))
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'source',
					_1: _elm_lang$core$Json_Encode$string(record.from)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'target',
						_1: _elm_lang$core$Json_Encode$string(record.to)
					},
					_1: {ctor: '[]'}
				}
			}
		});
};
var _iosphere$elm_network_graph$Graph_Edge_Json$decode = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		_elm_lang$core$Json_Decode$succeed(_iosphere$elm_network_graph$Graph_Edge$Edge),
		A2(_elm_lang$core$Json_Decode$field, 'source', _elm_lang$core$Json_Decode$string)),
	A2(_elm_lang$core$Json_Decode$field, 'target', _elm_lang$core$Json_Decode$string));

var _iosphere$elm_network_graph$Graph_Node_Json$encode = function (record) {
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'id',
				_1: _elm_lang$core$Json_Encode$string(record.identifier)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'name',
					_1: _elm_lang$core$Json_Encode$list(
						A2(_elm_lang$core$List$map, _elm_lang$core$Json_Encode$string, record.name))
				},
				_1: {ctor: '[]'}
			}
		});
};
var _iosphere$elm_network_graph$Graph_Node_Json$decode = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		_elm_lang$core$Json_Decode$succeed(_iosphere$elm_network_graph$Graph_Node$Node),
		A2(_elm_lang$core$Json_Decode$field, 'id', _elm_lang$core$Json_Decode$string)),
	A2(
		_elm_lang$core$Json_Decode$field,
		'name',
		_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string)));

var _iosphere$elm_network_graph$Graph_Json$encode = function (record) {
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'edges',
				_1: _elm_lang$core$Json_Encode$list(
					A2(_elm_lang$core$List$map, _iosphere$elm_network_graph$Graph_Edge_Json$encode, record.edges))
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'nodes',
					_1: _elm_lang$core$Json_Encode$list(
						A2(_elm_lang$core$List$map, _iosphere$elm_network_graph$Graph_Node_Json$encode, record.nodes))
				},
				_1: {ctor: '[]'}
			}
		});
};
var _iosphere$elm_network_graph$Graph_Json$decode = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		_elm_lang$core$Json_Decode$succeed(_iosphere$elm_network_graph$Graph$Graph),
		A2(
			_elm_lang$core$Json_Decode$field,
			'edges',
			_elm_lang$core$Json_Decode$list(_iosphere$elm_network_graph$Graph_Edge_Json$decode))),
	A2(
		_elm_lang$core$Json_Decode$field,
		'nodes',
		_elm_lang$core$Json_Decode$list(_iosphere$elm_network_graph$Graph_Node_Json$decode)));

var _rtfeldman$hex$Hex$toString = function (num) {
	return _elm_lang$core$String$fromList(
		(_elm_lang$core$Native_Utils.cmp(num, 0) < 0) ? {
			ctor: '::',
			_0: _elm_lang$core$Native_Utils.chr('-'),
			_1: A2(
				_rtfeldman$hex$Hex$unsafePositiveToDigits,
				{ctor: '[]'},
				_elm_lang$core$Basics$negate(num))
		} : A2(
			_rtfeldman$hex$Hex$unsafePositiveToDigits,
			{ctor: '[]'},
			num));
};
var _rtfeldman$hex$Hex$unsafePositiveToDigits = F2(
	function (digits, num) {
		unsafePositiveToDigits:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(num, 16) < 0) {
				return {
					ctor: '::',
					_0: _rtfeldman$hex$Hex$unsafeToDigit(num),
					_1: digits
				};
			} else {
				var _v0 = {
					ctor: '::',
					_0: _rtfeldman$hex$Hex$unsafeToDigit(
						A2(_elm_lang$core$Basics_ops['%'], num, 16)),
					_1: digits
				},
					_v1 = (num / 16) | 0;
				digits = _v0;
				num = _v1;
				continue unsafePositiveToDigits;
			}
		}
	});
var _rtfeldman$hex$Hex$unsafeToDigit = function (num) {
	var _p0 = num;
	switch (_p0) {
		case 0:
			return _elm_lang$core$Native_Utils.chr('0');
		case 1:
			return _elm_lang$core$Native_Utils.chr('1');
		case 2:
			return _elm_lang$core$Native_Utils.chr('2');
		case 3:
			return _elm_lang$core$Native_Utils.chr('3');
		case 4:
			return _elm_lang$core$Native_Utils.chr('4');
		case 5:
			return _elm_lang$core$Native_Utils.chr('5');
		case 6:
			return _elm_lang$core$Native_Utils.chr('6');
		case 7:
			return _elm_lang$core$Native_Utils.chr('7');
		case 8:
			return _elm_lang$core$Native_Utils.chr('8');
		case 9:
			return _elm_lang$core$Native_Utils.chr('9');
		case 10:
			return _elm_lang$core$Native_Utils.chr('a');
		case 11:
			return _elm_lang$core$Native_Utils.chr('b');
		case 12:
			return _elm_lang$core$Native_Utils.chr('c');
		case 13:
			return _elm_lang$core$Native_Utils.chr('d');
		case 14:
			return _elm_lang$core$Native_Utils.chr('e');
		case 15:
			return _elm_lang$core$Native_Utils.chr('f');
		default:
			return _elm_lang$core$Native_Utils.crashCase(
				'Hex',
				{
					start: {line: 138, column: 5},
					end: {line: 188, column: 84}
				},
				_p0)(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'Tried to convert ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_rtfeldman$hex$Hex$toString(num),
						' to hexadecimal.')));
	}
};
var _rtfeldman$hex$Hex$fromStringHelp = F3(
	function (position, chars, accumulated) {
		var _p2 = chars;
		if (_p2.ctor === '[]') {
			return _elm_lang$core$Result$Ok(accumulated);
		} else {
			var recurse = function (additional) {
				return A3(
					_rtfeldman$hex$Hex$fromStringHelp,
					position - 1,
					_p2._1,
					accumulated + (additional * Math.pow(16, position)));
			};
			var _p3 = _p2._0;
			switch (_p3.valueOf()) {
				case '0':
					return recurse(0);
				case '1':
					return recurse(1);
				case '2':
					return recurse(2);
				case '3':
					return recurse(3);
				case '4':
					return recurse(4);
				case '5':
					return recurse(5);
				case '6':
					return recurse(6);
				case '7':
					return recurse(7);
				case '8':
					return recurse(8);
				case '9':
					return recurse(9);
				case 'a':
					return recurse(10);
				case 'b':
					return recurse(11);
				case 'c':
					return recurse(12);
				case 'd':
					return recurse(13);
				case 'e':
					return recurse(14);
				case 'f':
					return recurse(15);
				default:
					return _elm_lang$core$Result$Err(
						A2(
							_elm_lang$core$Basics_ops['++'],
							_elm_lang$core$Basics$toString(_p3),
							' is not a valid hexadecimal character.'));
			}
		}
	});
var _rtfeldman$hex$Hex$fromString = function (str) {
	if (_elm_lang$core$String$isEmpty(str)) {
		return _elm_lang$core$Result$Err('Empty strings are not valid hexadecimal strings.');
	} else {
		var formatError = function (err) {
			return A2(
				_elm_lang$core$String$join,
				' ',
				{
					ctor: '::',
					_0: _elm_lang$core$Basics$toString(str),
					_1: {
						ctor: '::',
						_0: 'is not a valid hexadecimal string because',
						_1: {
							ctor: '::',
							_0: err,
							_1: {ctor: '[]'}
						}
					}
				});
		};
		var result = function () {
			if (A2(_elm_lang$core$String$startsWith, '-', str)) {
				var list = A2(
					_elm_lang$core$Maybe$withDefault,
					{ctor: '[]'},
					_elm_lang$core$List$tail(
						_elm_lang$core$String$toList(str)));
				return A2(
					_elm_lang$core$Result$map,
					_elm_lang$core$Basics$negate,
					A3(
						_rtfeldman$hex$Hex$fromStringHelp,
						_elm_lang$core$List$length(list) - 1,
						list,
						0));
			} else {
				return A3(
					_rtfeldman$hex$Hex$fromStringHelp,
					_elm_lang$core$String$length(str) - 1,
					_elm_lang$core$String$toList(str),
					0);
			}
		}();
		return A2(_elm_lang$core$Result$mapError, formatError, result);
	}
};

var _user$project$AST_Ranges$isGte = F2(
	function (a, b) {
		return (_elm_lang$core$Native_Utils.cmp(a.row, b.row) > 0) ? true : ((_elm_lang$core$Native_Utils.cmp(a.row, b.row) < 0) ? false : (_elm_lang$core$Native_Utils.cmp(a.column, b.column) > -1));
	});
var _user$project$AST_Ranges$containsRange = F2(
	function (a, b) {
		return A2(_user$project$AST_Ranges$isGte, a.start, b.start) && A2(_user$project$AST_Ranges$isGte, b.end, a.end);
	});
var _user$project$AST_Ranges$locationToString = function (_p0) {
	var _p1 = _p0;
	return A2(
		_elm_lang$core$Basics_ops['++'],
		'(',
		A2(
			_elm_lang$core$Basics_ops['++'],
			_elm_lang$core$Basics$toString(_p1.row),
			A2(
				_elm_lang$core$Basics_ops['++'],
				',',
				A2(
					_elm_lang$core$Basics_ops['++'],
					_elm_lang$core$Basics$toString(_p1.column),
					')'))));
};
var _user$project$AST_Ranges$compareLocations = F2(
	function (left, right) {
		return (_elm_lang$core$Native_Utils.cmp(left.row, right.row) < 0) ? _elm_lang$core$Basics$LT : ((_elm_lang$core$Native_Utils.cmp(right.row, left.row) < 0) ? _elm_lang$core$Basics$GT : A2(_elm_lang$core$Basics$compare, left.column, right.column));
	});
var _user$project$AST_Ranges$sortLocations = _elm_lang$core$List$sortWith(_user$project$AST_Ranges$compareLocations);
var _user$project$AST_Ranges$compareRangeStarts = F2(
	function (a, b) {
		return A2(_user$project$AST_Ranges$compareLocations, a.start, b.start);
	});
var _user$project$AST_Ranges$emptyRange = {
	start: {row: 0, column: 0},
	end: {row: 0, column: 0}
};
var _user$project$AST_Ranges$rangeToString = function (_p2) {
	var _p3 = _p2;
	return A2(
		_elm_lang$core$Basics_ops['++'],
		'(',
		A2(
			_elm_lang$core$Basics_ops['++'],
			_user$project$AST_Ranges$locationToString(_p3.start),
			A2(
				_elm_lang$core$Basics_ops['++'],
				',',
				A2(
					_elm_lang$core$Basics_ops['++'],
					_user$project$AST_Ranges$locationToString(_p3.end),
					')'))));
};
var _user$project$AST_Ranges$orderByStart = F2(
	function (r1, r2) {
		return (!_elm_lang$core$Native_Utils.eq(r1.start.row, r2.start.row)) ? A2(_elm_lang$core$Basics$compare, r1.start.row, r2.start.row) : A2(_elm_lang$core$Basics$compare, r1.start.column, r2.start.column);
	});
var _user$project$AST_Ranges$encode = function (_p4) {
	var _p5 = _p4;
	var _p7 = _p5.start;
	var _p6 = _p5.end;
	return _elm_lang$core$Json_Encode$list(
		{
			ctor: '::',
			_0: _elm_lang$core$Json_Encode$int(_p7.row),
			_1: {
				ctor: '::',
				_0: _elm_lang$core$Json_Encode$int(_p7.column),
				_1: {
					ctor: '::',
					_0: _elm_lang$core$Json_Encode$int(_p6.row),
					_1: {
						ctor: '::',
						_0: _elm_lang$core$Json_Encode$int(_p6.column),
						_1: {ctor: '[]'}
					}
				}
			}
		});
};
var _user$project$AST_Ranges$fromList = function (input) {
	var _p8 = input;
	if (((((_p8.ctor === '::') && (_p8._1.ctor === '::')) && (_p8._1._1.ctor === '::')) && (_p8._1._1._1.ctor === '::')) && (_p8._1._1._1._1.ctor === '[]')) {
		return _elm_lang$core$Result$Ok(
			{
				start: {row: _p8._0, column: _p8._1._0},
				end: {row: _p8._1._1._0, column: _p8._1._1._1._0}
			});
	} else {
		return _elm_lang$core$Result$Err('Invalid input list');
	}
};
var _user$project$AST_Ranges$decode = A2(
	_elm_lang$core$Json_Decode$andThen,
	function (_p9) {
		return _elm_community$json_extra$Json_Decode_Extra$fromResult(
			_user$project$AST_Ranges$fromList(_p9));
	},
	_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$int));
var _user$project$AST_Ranges$Location = F2(
	function (a, b) {
		return {row: a, column: b};
	});
var _user$project$AST_Ranges$Range = F2(
	function (a, b) {
		return {start: a, end: b};
	});
var _user$project$AST_Ranges$getRange = function (ranges) {
	var ends = _elm_lang$core$List$reverse(
		_user$project$AST_Ranges$sortLocations(
			A2(
				_elm_lang$core$List$map,
				function (_) {
					return _.end;
				},
				ranges)));
	var starts = _user$project$AST_Ranges$sortLocations(
		A2(
			_elm_lang$core$List$map,
			function (_) {
				return _.start;
			},
			ranges));
	return A2(
		_elm_lang$core$Maybe$withDefault,
		_user$project$AST_Ranges$emptyRange,
		A3(
			_elm_lang$core$Maybe$map2,
			_user$project$AST_Ranges$Range,
			_elm_lang$core$List$head(starts),
			_elm_lang$core$List$head(ends)));
};

var _user$project$AST_Types$VariablePointer = F2(
	function (a, b) {
		return {value: a, range: b};
	});
var _user$project$AST_Types$File = F4(
	function (a, b, c, d) {
		return {moduleDefinition: a, imports: b, declarations: c, comments: d};
	});
var _user$project$AST_Types$DefaultModuleData = F2(
	function (a, b) {
		return {moduleName: a, exposingList: b};
	});
var _user$project$AST_Types$EffectModuleData = F4(
	function (a, b, c, d) {
		return {moduleName: a, exposingList: b, command: c, subscription: d};
	});
var _user$project$AST_Types$Destructuring = F2(
	function (a, b) {
		return {pattern: a, expression: b};
	});
var _user$project$AST_Types$Infix = F3(
	function (a, b, c) {
		return {direction: a, precedence: b, operator: c};
	});
var _user$project$AST_Types$QualifiedNameRef = F2(
	function (a, b) {
		return {moduleName: a, name: b};
	});
var _user$project$AST_Types$FunctionSignature = F4(
	function (a, b, c, d) {
		return {operatorDefinition: a, name: b, typeReference: c, range: d};
	});
var _user$project$AST_Types$FunctionDeclaration = F4(
	function (a, b, c, d) {
		return {operatorDefinition: a, name: b, $arguments: c, expression: d};
	});
var _user$project$AST_Types$Function = F3(
	function (a, b, c) {
		return {documentation: a, signature: b, declaration: c};
	});
var _user$project$AST_Types$RecordUpdate = F2(
	function (a, b) {
		return {name: a, updates: b};
	});
var _user$project$AST_Types$CaseBlock = F2(
	function (a, b) {
		return {expression: a, cases: b};
	});
var _user$project$AST_Types$LetBlock = F2(
	function (a, b) {
		return {declarations: a, expression: b};
	});
var _user$project$AST_Types$Lambda = F2(
	function (a, b) {
		return {args: a, expression: b};
	});
var _user$project$AST_Types$TypeAlias = F5(
	function (a, b, c, d, e) {
		return {documentation: a, name: b, generics: c, typeReference: d, range: e};
	});
var _user$project$AST_Types$Type = F3(
	function (a, b, c) {
		return {name: a, generics: b, constructors: c};
	});
var _user$project$AST_Types$ValueConstructor = F3(
	function (a, b, c) {
		return {name: a, $arguments: b, range: c};
	});
var _user$project$AST_Types$Import = F4(
	function (a, b, c, d) {
		return {moduleName: a, moduleAlias: b, exposingList: c, range: d};
	});
var _user$project$AST_Types$ExposedType = F3(
	function (a, b, c) {
		return {name: a, constructors: b, range: c};
	});
var _user$project$AST_Types$NoModule = {ctor: 'NoModule'};
var _user$project$AST_Types$EffectModule = function (a) {
	return {ctor: 'EffectModule', _0: a};
};
var _user$project$AST_Types$PortModule = function (a) {
	return {ctor: 'PortModule', _0: a};
};
var _user$project$AST_Types$NormalModule = function (a) {
	return {ctor: 'NormalModule', _0: a};
};
var _user$project$AST_Types$DestructuringDeclaration = function (a) {
	return {ctor: 'DestructuringDeclaration', _0: a};
};
var _user$project$AST_Types$InfixDeclaration = function (a) {
	return {ctor: 'InfixDeclaration', _0: a};
};
var _user$project$AST_Types$PortDeclaration = function (a) {
	return {ctor: 'PortDeclaration', _0: a};
};
var _user$project$AST_Types$TypeDecl = function (a) {
	return {ctor: 'TypeDecl', _0: a};
};
var _user$project$AST_Types$AliasDecl = function (a) {
	return {ctor: 'AliasDecl', _0: a};
};
var _user$project$AST_Types$FuncDecl = function (a) {
	return {ctor: 'FuncDecl', _0: a};
};
var _user$project$AST_Types$Right = {ctor: 'Right'};
var _user$project$AST_Types$Left = {ctor: 'Left'};
var _user$project$AST_Types$ParenthesizedPattern = F2(
	function (a, b) {
		return {ctor: 'ParenthesizedPattern', _0: a, _1: b};
	});
var _user$project$AST_Types$AsPattern = F3(
	function (a, b, c) {
		return {ctor: 'AsPattern', _0: a, _1: b, _2: c};
	});
var _user$project$AST_Types$QualifiedNamePattern = F2(
	function (a, b) {
		return {ctor: 'QualifiedNamePattern', _0: a, _1: b};
	});
var _user$project$AST_Types$NamedPattern = F3(
	function (a, b, c) {
		return {ctor: 'NamedPattern', _0: a, _1: b, _2: c};
	});
var _user$project$AST_Types$VarPattern = F2(
	function (a, b) {
		return {ctor: 'VarPattern', _0: a, _1: b};
	});
var _user$project$AST_Types$ListPattern = F2(
	function (a, b) {
		return {ctor: 'ListPattern', _0: a, _1: b};
	});
var _user$project$AST_Types$UnConsPattern = F3(
	function (a, b, c) {
		return {ctor: 'UnConsPattern', _0: a, _1: b, _2: c};
	});
var _user$project$AST_Types$RecordPattern = F2(
	function (a, b) {
		return {ctor: 'RecordPattern', _0: a, _1: b};
	});
var _user$project$AST_Types$TuplePattern = F2(
	function (a, b) {
		return {ctor: 'TuplePattern', _0: a, _1: b};
	});
var _user$project$AST_Types$FloatPattern = F2(
	function (a, b) {
		return {ctor: 'FloatPattern', _0: a, _1: b};
	});
var _user$project$AST_Types$IntPattern = F2(
	function (a, b) {
		return {ctor: 'IntPattern', _0: a, _1: b};
	});
var _user$project$AST_Types$StringPattern = F2(
	function (a, b) {
		return {ctor: 'StringPattern', _0: a, _1: b};
	});
var _user$project$AST_Types$CharPattern = F2(
	function (a, b) {
		return {ctor: 'CharPattern', _0: a, _1: b};
	});
var _user$project$AST_Types$UnitPattern = function (a) {
	return {ctor: 'UnitPattern', _0: a};
};
var _user$project$AST_Types$AllPattern = function (a) {
	return {ctor: 'AllPattern', _0: a};
};
var _user$project$AST_Types$GLSLExpression = function (a) {
	return {ctor: 'GLSLExpression', _0: a};
};
var _user$project$AST_Types$RecordUpdateExpression = function (a) {
	return {ctor: 'RecordUpdateExpression', _0: a};
};
var _user$project$AST_Types$RecordAccessFunction = function (a) {
	return {ctor: 'RecordAccessFunction', _0: a};
};
var _user$project$AST_Types$RecordAccess = F2(
	function (a, b) {
		return {ctor: 'RecordAccess', _0: a, _1: b};
	});
var _user$project$AST_Types$QualifiedExpr = F2(
	function (a, b) {
		return {ctor: 'QualifiedExpr', _0: a, _1: b};
	});
var _user$project$AST_Types$ListExpr = function (a) {
	return {ctor: 'ListExpr', _0: a};
};
var _user$project$AST_Types$RecordExpr = function (a) {
	return {ctor: 'RecordExpr', _0: a};
};
var _user$project$AST_Types$LambdaExpression = function (a) {
	return {ctor: 'LambdaExpression', _0: a};
};
var _user$project$AST_Types$CaseExpression = function (a) {
	return {ctor: 'CaseExpression', _0: a};
};
var _user$project$AST_Types$LetExpression = function (a) {
	return {ctor: 'LetExpression', _0: a};
};
var _user$project$AST_Types$ParenthesizedExpression = function (a) {
	return {ctor: 'ParenthesizedExpression', _0: a};
};
var _user$project$AST_Types$TupledExpression = function (a) {
	return {ctor: 'TupledExpression', _0: a};
};
var _user$project$AST_Types$CharLiteral = function (a) {
	return {ctor: 'CharLiteral', _0: a};
};
var _user$project$AST_Types$Literal = function (a) {
	return {ctor: 'Literal', _0: a};
};
var _user$project$AST_Types$Negation = function (a) {
	return {ctor: 'Negation', _0: a};
};
var _user$project$AST_Types$Floatable = function (a) {
	return {ctor: 'Floatable', _0: a};
};
var _user$project$AST_Types$Integer = function (a) {
	return {ctor: 'Integer', _0: a};
};
var _user$project$AST_Types$Operator = function (a) {
	return {ctor: 'Operator', _0: a};
};
var _user$project$AST_Types$PrefixOperator = function (a) {
	return {ctor: 'PrefixOperator', _0: a};
};
var _user$project$AST_Types$IfBlock = F3(
	function (a, b, c) {
		return {ctor: 'IfBlock', _0: a, _1: b, _2: c};
	});
var _user$project$AST_Types$FunctionOrValue = function (a) {
	return {ctor: 'FunctionOrValue', _0: a};
};
var _user$project$AST_Types$OperatorApplication = F4(
	function (a, b, c, d) {
		return {ctor: 'OperatorApplication', _0: a, _1: b, _2: c, _3: d};
	});
var _user$project$AST_Types$Application = function (a) {
	return {ctor: 'Application', _0: a};
};
var _user$project$AST_Types$UnitExpr = {ctor: 'UnitExpr'};
var _user$project$AST_Types$FunctionTypeReference = F3(
	function (a, b, c) {
		return {ctor: 'FunctionTypeReference', _0: a, _1: b, _2: c};
	});
var _user$project$AST_Types$GenericRecord = F3(
	function (a, b, c) {
		return {ctor: 'GenericRecord', _0: a, _1: b, _2: c};
	});
var _user$project$AST_Types$Record = F2(
	function (a, b) {
		return {ctor: 'Record', _0: a, _1: b};
	});
var _user$project$AST_Types$Tupled = F2(
	function (a, b) {
		return {ctor: 'Tupled', _0: a, _1: b};
	});
var _user$project$AST_Types$Unit = function (a) {
	return {ctor: 'Unit', _0: a};
};
var _user$project$AST_Types$Typed = F4(
	function (a, b, c, d) {
		return {ctor: 'Typed', _0: a, _1: b, _2: c, _3: d};
	});
var _user$project$AST_Types$GenericType = F2(
	function (a, b) {
		return {ctor: 'GenericType', _0: a, _1: b};
	});
var _user$project$AST_Types$Explicit = function (a) {
	return {ctor: 'Explicit', _0: a};
};
var _user$project$AST_Types$All = function (a) {
	return {ctor: 'All', _0: a};
};
var _user$project$AST_Types$None = {ctor: 'None'};
var _user$project$AST_Types$TypeExpose = function (a) {
	return {ctor: 'TypeExpose', _0: a};
};
var _user$project$AST_Types$TypeOrAliasExpose = F2(
	function (a, b) {
		return {ctor: 'TypeOrAliasExpose', _0: a, _1: b};
	});
var _user$project$AST_Types$FunctionExpose = F2(
	function (a, b) {
		return {ctor: 'FunctionExpose', _0: a, _1: b};
	});
var _user$project$AST_Types$InfixExpose = F2(
	function (a, b) {
		return {ctor: 'InfixExpose', _0: a, _1: b};
	});

var _user$project$Util_Json$decodeTyped = function (opts) {
	return _elm_lang$core$Json_Decode$lazy(
		function (_p0) {
			var _p1 = _p0;
			return A2(
				_elm_lang$core$Json_Decode$andThen,
				function (t) {
					var _p3 = _elm_lang$core$List$head(
						A2(
							_elm_lang$core$List$filter,
							function (_p2) {
								return A2(
									F2(
										function (x, y) {
											return _elm_lang$core$Native_Utils.eq(x, y);
										}),
									t,
									_elm_lang$core$Tuple$first(_p2));
							},
							opts));
					if (_p3.ctor === 'Just') {
						var _p4 = _p3._0;
						return A2(
							_elm_lang$core$Json_Decode$field,
							_elm_lang$core$Tuple$first(_p4),
							_elm_lang$core$Tuple$second(_p4));
					} else {
						return _elm_lang$core$Json_Decode$fail(
							A2(_elm_lang$core$Basics_ops['++'], 'No decoder for type: ', t));
					}
				},
				A2(_elm_lang$core$Json_Decode$field, 'type', _elm_lang$core$Json_Decode$string));
		});
};
var _user$project$Util_Json$encodeTyped = F2(
	function (x, v) {
		return _elm_lang$core$Json_Encode$object(
			{
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'type',
					_1: _elm_lang$core$Json_Encode$string(x)
				},
				_1: {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: x, _1: v},
					_1: {ctor: '[]'}
				}
			});
	});

var _user$project$AST_Decoding$decodeInfixDirection = A2(
	_elm_lang$core$Json_Decode$andThen,
	function (v) {
		var _p0 = v;
		switch (_p0) {
			case 'left':
				return _elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$Left);
			case 'right':
				return _elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$Right);
			default:
				return _elm_lang$core$Json_Decode$fail('Invlalid direction');
		}
	},
	_elm_lang$core$Json_Decode$string);
var _user$project$AST_Decoding$decodeChar = A2(
	_elm_lang$core$Json_Decode$andThen,
	function (s) {
		var _p1 = _elm_lang$core$String$uncons(s);
		if (_p1.ctor === 'Just') {
			return _elm_lang$core$Json_Decode$succeed(_p1._0._0);
		} else {
			return _elm_lang$core$Json_Decode$fail('Not a char');
		}
	},
	_elm_lang$core$Json_Decode$string);
var _user$project$AST_Decoding$decodeInfix = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$Infix),
			A2(_elm_lang$core$Json_Decode$field, 'direction', _user$project$AST_Decoding$decodeInfixDirection)),
		A2(_elm_lang$core$Json_Decode$field, 'precedence', _elm_lang$core$Json_Decode$int)),
	A2(_elm_lang$core$Json_Decode$field, 'operator', _elm_lang$core$Json_Decode$string));
var _user$project$AST_Decoding$decodeExposingList = function (x) {
	return _elm_lang$core$Json_Decode$lazy(
		function (_p2) {
			var _p3 = _p2;
			return _user$project$Util_Json$decodeTyped(
				{
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'none',
						_1: _elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$None)
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'all',
							_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$All, _user$project$AST_Ranges$decode)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'explicit',
								_1: A2(
									_elm_lang$core$Json_Decode$map,
									_user$project$AST_Types$Explicit,
									_elm_lang$core$Json_Decode$list(x))
							},
							_1: {ctor: '[]'}
						}
					}
				});
		});
};
var _user$project$AST_Decoding$decodeModuleName = _elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string);
var _user$project$AST_Decoding$decodeComment = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		_elm_lang$core$Json_Decode$succeed(
			F2(
				function (v0, v1) {
					return {ctor: '_Tuple2', _0: v0, _1: v1};
				})),
		A2(_elm_lang$core$Json_Decode$field, 'text', _elm_lang$core$Json_Decode$string)),
	A2(_elm_lang$core$Json_Decode$field, 'range', _user$project$AST_Ranges$decode));
var _user$project$AST_Decoding$nameField = A2(_elm_lang$core$Json_Decode$field, 'name', _elm_lang$core$Json_Decode$string);
var _user$project$AST_Decoding$decodeQualifiedNameRef = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$QualifiedNameRef),
		A2(_elm_lang$core$Json_Decode$field, 'moduleName', _user$project$AST_Decoding$decodeModuleName)),
	_user$project$AST_Decoding$nameField);
var _user$project$AST_Decoding$rangeField = A2(_elm_lang$core$Json_Decode$field, 'range', _user$project$AST_Ranges$decode);
var _user$project$AST_Decoding$decodeValueConstructorExpose = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		_elm_lang$core$Json_Decode$succeed(
			F2(
				function (v0, v1) {
					return {ctor: '_Tuple2', _0: v0, _1: v1};
				})),
		_user$project$AST_Decoding$nameField),
	_user$project$AST_Decoding$rangeField);
var _user$project$AST_Decoding$decodeExposedType = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$ExposedType),
			_user$project$AST_Decoding$nameField),
		A2(
			_elm_lang$core$Json_Decode$field,
			'inner',
			_user$project$AST_Decoding$decodeExposingList(_user$project$AST_Decoding$decodeValueConstructorExpose))),
	_user$project$AST_Decoding$rangeField);
var _user$project$AST_Decoding$decodeExpose = _user$project$Util_Json$decodeTyped(
	{
		ctor: '::',
		_0: {
			ctor: '_Tuple2',
			_0: 'infix',
			_1: A3(_elm_lang$core$Json_Decode$map2, _user$project$AST_Types$InfixExpose, _user$project$AST_Decoding$nameField, _user$project$AST_Decoding$rangeField)
		},
		_1: {
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'function',
				_1: A3(_elm_lang$core$Json_Decode$map2, _user$project$AST_Types$FunctionExpose, _user$project$AST_Decoding$nameField, _user$project$AST_Decoding$rangeField)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'typeOrAlias',
					_1: A3(_elm_lang$core$Json_Decode$map2, _user$project$AST_Types$TypeOrAliasExpose, _user$project$AST_Decoding$nameField, _user$project$AST_Decoding$rangeField)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'typeexpose',
						_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$TypeExpose, _user$project$AST_Decoding$decodeExposedType)
					},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$AST_Decoding$decodeDefaultModuleData = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$DefaultModuleData),
		A2(_elm_lang$core$Json_Decode$field, 'moduleName', _user$project$AST_Decoding$decodeModuleName)),
	A2(
		_elm_lang$core$Json_Decode$field,
		'exposingList',
		_user$project$AST_Decoding$decodeExposingList(_user$project$AST_Decoding$decodeExpose)));
var _user$project$AST_Decoding$decodeEffectModuleData = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$EffectModuleData),
				A2(_elm_lang$core$Json_Decode$field, 'moduleName', _user$project$AST_Decoding$decodeModuleName)),
			A2(
				_elm_lang$core$Json_Decode$field,
				'exposingList',
				_user$project$AST_Decoding$decodeExposingList(_user$project$AST_Decoding$decodeExpose))),
		A2(
			_elm_lang$core$Json_Decode$field,
			'command',
			_elm_lang$core$Json_Decode$nullable(_elm_lang$core$Json_Decode$string))),
	A2(
		_elm_lang$core$Json_Decode$field,
		'subscription',
		_elm_lang$core$Json_Decode$nullable(_elm_lang$core$Json_Decode$string)));
var _user$project$AST_Decoding$decodeModule = _user$project$Util_Json$decodeTyped(
	{
		ctor: '::',
		_0: {
			ctor: '_Tuple2',
			_0: 'normal',
			_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$NormalModule, _user$project$AST_Decoding$decodeDefaultModuleData)
		},
		_1: {
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'port',
				_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$PortModule, _user$project$AST_Decoding$decodeDefaultModuleData)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'effect',
					_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$EffectModule, _user$project$AST_Decoding$decodeEffectModuleData)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'nomodule',
						_1: _elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$NoModule)
					},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$AST_Decoding$decodeImport = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$Import),
				A2(_elm_lang$core$Json_Decode$field, 'moduleName', _user$project$AST_Decoding$decodeModuleName)),
			A2(
				_elm_lang$core$Json_Decode$field,
				'moduleAlias',
				_elm_lang$core$Json_Decode$nullable(_user$project$AST_Decoding$decodeModuleName))),
		A2(
			_elm_lang$core$Json_Decode$field,
			'exposingList',
			_user$project$AST_Decoding$decodeExposingList(_user$project$AST_Decoding$decodeExpose))),
	_user$project$AST_Decoding$rangeField);
var _user$project$AST_Decoding$decodeDocumentation = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		_elm_lang$core$Json_Decode$succeed(
			F2(
				function (v0, v1) {
					return {ctor: '_Tuple2', _0: v0, _1: v1};
				})),
		A2(_elm_lang$core$Json_Decode$field, 'value', _elm_lang$core$Json_Decode$string)),
	_user$project$AST_Decoding$rangeField);
var _user$project$AST_Decoding$decodeTypeReference = _elm_lang$core$Json_Decode$lazy(
	function (_p4) {
		var _p5 = _p4;
		return _user$project$Util_Json$decodeTyped(
			{
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'generic',
					_1: A3(
						_elm_lang$core$Json_Decode$map2,
						_user$project$AST_Types$GenericType,
						A2(_elm_lang$core$Json_Decode$field, 'value', _elm_lang$core$Json_Decode$string),
						_user$project$AST_Decoding$rangeField)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'typed',
						_1: A5(
							_elm_lang$core$Json_Decode$map4,
							_user$project$AST_Types$Typed,
							A2(_elm_lang$core$Json_Decode$field, 'moduleName', _user$project$AST_Decoding$decodeModuleName),
							_user$project$AST_Decoding$nameField,
							A2(
								_elm_lang$core$Json_Decode$field,
								'args',
								_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodeTypeReference)),
							_user$project$AST_Decoding$rangeField)
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'unit',
							_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$Unit, _user$project$AST_Decoding$rangeField)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'tupled',
								_1: A3(
									_elm_lang$core$Json_Decode$map2,
									_user$project$AST_Types$Tupled,
									A2(
										_elm_lang$core$Json_Decode$field,
										'values',
										_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodeTypeReference)),
									_user$project$AST_Decoding$rangeField)
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'function',
									_1: A4(
										_elm_lang$core$Json_Decode$map3,
										_user$project$AST_Types$FunctionTypeReference,
										A2(_elm_lang$core$Json_Decode$field, 'left', _user$project$AST_Decoding$decodeTypeReference),
										A2(_elm_lang$core$Json_Decode$field, 'right', _user$project$AST_Decoding$decodeTypeReference),
										_user$project$AST_Decoding$rangeField)
								},
								_1: {
									ctor: '::',
									_0: {
										ctor: '_Tuple2',
										_0: 'record',
										_1: A3(
											_elm_lang$core$Json_Decode$map2,
											_user$project$AST_Types$Record,
											A2(_elm_lang$core$Json_Decode$field, 'value', _user$project$AST_Decoding$decodeRecordDefinition),
											_user$project$AST_Decoding$rangeField)
									},
									_1: {
										ctor: '::',
										_0: {
											ctor: '_Tuple2',
											_0: 'genericRecord',
											_1: A4(
												_elm_lang$core$Json_Decode$map3,
												_user$project$AST_Types$GenericRecord,
												_user$project$AST_Decoding$nameField,
												A2(_elm_lang$core$Json_Decode$field, 'values', _user$project$AST_Decoding$decodeRecordDefinition),
												_user$project$AST_Decoding$rangeField)
										},
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}
				}
			});
	});
var _user$project$AST_Decoding$decodeRecordDefinition = _elm_lang$core$Json_Decode$lazy(
	function (_p6) {
		var _p7 = _p6;
		return _elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodeRecordField);
	});
var _user$project$AST_Decoding$decodeRecordField = _elm_lang$core$Json_Decode$lazy(
	function (_p8) {
		var _p9 = _p8;
		return A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				_elm_lang$core$Json_Decode$succeed(
					F2(
						function (v0, v1) {
							return {ctor: '_Tuple2', _0: v0, _1: v1};
						})),
				_user$project$AST_Decoding$nameField),
			A2(_elm_lang$core$Json_Decode$field, 'typeReference', _user$project$AST_Decoding$decodeTypeReference));
	});
var _user$project$AST_Decoding$decodeValueConstructor = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$ValueConstructor),
			_user$project$AST_Decoding$nameField),
		A2(
			_elm_lang$core$Json_Decode$field,
			'arguments',
			_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodeTypeReference))),
	_user$project$AST_Decoding$rangeField);
var _user$project$AST_Decoding$decodeType = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$Type),
			_user$project$AST_Decoding$nameField),
		A2(
			_elm_lang$core$Json_Decode$field,
			'generics',
			_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string))),
	A2(
		_elm_lang$core$Json_Decode$field,
		'constructors',
		_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodeValueConstructor)));
var _user$project$AST_Decoding$decodeTypeAlias = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				A2(
					_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
					_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$TypeAlias),
					A2(
						_elm_lang$core$Json_Decode$field,
						'documentation',
						_elm_lang$core$Json_Decode$nullable(_user$project$AST_Decoding$decodeDocumentation))),
				_user$project$AST_Decoding$nameField),
			A2(
				_elm_lang$core$Json_Decode$field,
				'generics',
				_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string))),
		A2(_elm_lang$core$Json_Decode$field, 'typeReference', _user$project$AST_Decoding$decodeTypeReference)),
	_user$project$AST_Decoding$rangeField);
var _user$project$AST_Decoding$decodeSignature = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$FunctionSignature),
				A2(_elm_lang$core$Json_Decode$field, 'operatorDefinition', _elm_lang$core$Json_Decode$bool)),
			_user$project$AST_Decoding$nameField),
		A2(_elm_lang$core$Json_Decode$field, 'typeReference', _user$project$AST_Decoding$decodeTypeReference)),
	_user$project$AST_Decoding$rangeField);
var _user$project$AST_Decoding$decodeVariablePointer = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$VariablePointer),
		A2(_elm_lang$core$Json_Decode$field, 'value', _elm_lang$core$Json_Decode$string)),
	_user$project$AST_Decoding$rangeField);
var _user$project$AST_Decoding$decodeTypedWithRange = function (opts) {
	return _elm_lang$core$Json_Decode$lazy(
		function (_p10) {
			var _p11 = _p10;
			return A2(
				_elm_lang$core$Json_Decode$andThen,
				function (t) {
					var _p13 = _elm_lang$core$List$head(
						A2(
							_elm_lang$core$List$filter,
							function (_p12) {
								return A2(
									F2(
										function (x, y) {
											return _elm_lang$core$Native_Utils.eq(x, y);
										}),
									t,
									_elm_lang$core$Tuple$first(_p12));
							},
							opts));
					if (_p13.ctor === 'Just') {
						var _p14 = _p13._0;
						return A2(
							_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
							A2(
								_elm_lang$core$Json_Decode$field,
								_elm_lang$core$Tuple$first(_p14),
								_elm_lang$core$Tuple$second(_p14)),
							A2(
								_elm_lang$core$Json_Decode$at,
								{
									ctor: '::',
									_0: _elm_lang$core$Tuple$first(_p14),
									_1: {
										ctor: '::',
										_0: 'range',
										_1: {ctor: '[]'}
									}
								},
								_user$project$AST_Ranges$decode));
					} else {
						return _elm_lang$core$Json_Decode$fail(
							A2(_elm_lang$core$Basics_ops['++'], 'No decoder for type: ', t));
					}
				},
				A2(_elm_lang$core$Json_Decode$field, 'type', _elm_lang$core$Json_Decode$string));
		});
};
var _user$project$AST_Decoding$decodePattern = _elm_lang$core$Json_Decode$lazy(
	function (_p15) {
		var _p16 = _p15;
		return _user$project$AST_Decoding$decodeTypedWithRange(
			{
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'all',
					_1: _elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$AllPattern)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'unit',
						_1: _elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$UnitPattern)
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'char',
							_1: A2(
								_elm_lang$core$Json_Decode$map,
								_user$project$AST_Types$CharPattern,
								A2(_elm_lang$core$Json_Decode$field, 'value', _user$project$AST_Decoding$decodeChar))
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'string',
								_1: A2(
									_elm_lang$core$Json_Decode$map,
									_user$project$AST_Types$StringPattern,
									A2(_elm_lang$core$Json_Decode$field, 'value', _elm_lang$core$Json_Decode$string))
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'int',
									_1: A2(
										_elm_lang$core$Json_Decode$map,
										_user$project$AST_Types$IntPattern,
										A2(_elm_lang$core$Json_Decode$field, 'value', _elm_lang$core$Json_Decode$int))
								},
								_1: {
									ctor: '::',
									_0: {
										ctor: '_Tuple2',
										_0: 'float',
										_1: A2(
											_elm_lang$core$Json_Decode$map,
											_user$project$AST_Types$FloatPattern,
											A2(_elm_lang$core$Json_Decode$field, 'value', _elm_lang$core$Json_Decode$float))
									},
									_1: {
										ctor: '::',
										_0: {
											ctor: '_Tuple2',
											_0: 'tuple',
											_1: A2(
												_elm_lang$core$Json_Decode$map,
												_user$project$AST_Types$TuplePattern,
												A2(
													_elm_lang$core$Json_Decode$field,
													'value',
													_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodePattern)))
										},
										_1: {
											ctor: '::',
											_0: {
												ctor: '_Tuple2',
												_0: 'record',
												_1: A2(
													_elm_lang$core$Json_Decode$map,
													_user$project$AST_Types$RecordPattern,
													A2(
														_elm_lang$core$Json_Decode$field,
														'value',
														_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodeVariablePointer)))
											},
											_1: {
												ctor: '::',
												_0: {
													ctor: '_Tuple2',
													_0: 'uncons',
													_1: A3(
														_elm_lang$core$Json_Decode$map2,
														_user$project$AST_Types$UnConsPattern,
														A2(_elm_lang$core$Json_Decode$field, 'left', _user$project$AST_Decoding$decodePattern),
														A2(_elm_lang$core$Json_Decode$field, 'right', _user$project$AST_Decoding$decodePattern))
												},
												_1: {
													ctor: '::',
													_0: {
														ctor: '_Tuple2',
														_0: 'list',
														_1: A2(
															_elm_lang$core$Json_Decode$map,
															_user$project$AST_Types$ListPattern,
															A2(
																_elm_lang$core$Json_Decode$field,
																'value',
																_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodePattern)))
													},
													_1: {
														ctor: '::',
														_0: {
															ctor: '_Tuple2',
															_0: 'var',
															_1: A2(
																_elm_lang$core$Json_Decode$map,
																_user$project$AST_Types$VarPattern,
																A2(_elm_lang$core$Json_Decode$field, 'value', _elm_lang$core$Json_Decode$string))
														},
														_1: {
															ctor: '::',
															_0: {
																ctor: '_Tuple2',
																_0: 'named',
																_1: A3(
																	_elm_lang$core$Json_Decode$map2,
																	_user$project$AST_Types$NamedPattern,
																	A2(_elm_lang$core$Json_Decode$field, 'qualified', _user$project$AST_Decoding$decodeQualifiedNameRef),
																	A2(
																		_elm_lang$core$Json_Decode$field,
																		'patterns',
																		_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodePattern)))
															},
															_1: {
																ctor: '::',
																_0: {
																	ctor: '_Tuple2',
																	_0: 'qualifiedName',
																	_1: A2(
																		_elm_lang$core$Json_Decode$map,
																		_user$project$AST_Types$QualifiedNamePattern,
																		A2(_elm_lang$core$Json_Decode$field, 'value', _user$project$AST_Decoding$decodeQualifiedNameRef))
																},
																_1: {
																	ctor: '::',
																	_0: {
																		ctor: '_Tuple2',
																		_0: 'as',
																		_1: A3(
																			_elm_lang$core$Json_Decode$map2,
																			_user$project$AST_Types$AsPattern,
																			A2(_elm_lang$core$Json_Decode$field, 'pattern', _user$project$AST_Decoding$decodePattern),
																			A2(_elm_lang$core$Json_Decode$field, 'name', _user$project$AST_Decoding$decodeVariablePointer))
																	},
																	_1: {
																		ctor: '::',
																		_0: {
																			ctor: '_Tuple2',
																			_0: 'parentisized',
																			_1: A2(
																				_elm_lang$core$Json_Decode$map,
																				_user$project$AST_Types$ParenthesizedPattern,
																				A2(_elm_lang$core$Json_Decode$field, 'value', _user$project$AST_Decoding$decodePattern))
																		},
																		_1: {ctor: '[]'}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			});
	});
var _user$project$AST_Decoding$decodeCase = _elm_lang$core$Json_Decode$lazy(
	function (_p17) {
		var _p18 = _p17;
		return A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				_elm_lang$core$Json_Decode$succeed(
					F2(
						function (v0, v1) {
							return {ctor: '_Tuple2', _0: v0, _1: v1};
						})),
				A2(_elm_lang$core$Json_Decode$field, 'pattern', _user$project$AST_Decoding$decodePattern)),
			A2(_elm_lang$core$Json_Decode$field, 'expression', _user$project$AST_Decoding$decodeExpression));
	});
var _user$project$AST_Decoding$decodeExpression = _elm_lang$core$Json_Decode$lazy(
	function (_p19) {
		var _p20 = _p19;
		return A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				_elm_lang$core$Json_Decode$succeed(
					F2(
						function (v0, v1) {
							return {ctor: '_Tuple2', _0: v0, _1: v1};
						})),
				_user$project$AST_Decoding$rangeField),
			A2(_elm_lang$core$Json_Decode$field, 'inner', _user$project$AST_Decoding$decodeInnerExpression));
	});
var _user$project$AST_Decoding$decodeInnerExpression = _elm_lang$core$Json_Decode$lazy(
	function (_p21) {
		var _p22 = _p21;
		return _user$project$Util_Json$decodeTyped(
			{
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'unit',
					_1: _elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$UnitExpr)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'application',
						_1: A2(
							_elm_lang$core$Json_Decode$map,
							_user$project$AST_Types$Application,
							_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodeExpression))
					},
					_1: {
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: 'operatorapplication', _1: _user$project$AST_Decoding$decodeOperatorApplication},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'functionOrValue',
								_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$FunctionOrValue, _elm_lang$core$Json_Decode$string)
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'ifBlock',
									_1: A4(
										_elm_lang$core$Json_Decode$map3,
										_user$project$AST_Types$IfBlock,
										A2(_elm_lang$core$Json_Decode$field, 'clause', _user$project$AST_Decoding$decodeExpression),
										A2(_elm_lang$core$Json_Decode$field, 'then', _user$project$AST_Decoding$decodeExpression),
										A2(_elm_lang$core$Json_Decode$field, 'else', _user$project$AST_Decoding$decodeExpression))
								},
								_1: {
									ctor: '::',
									_0: {
										ctor: '_Tuple2',
										_0: 'prefixoperator',
										_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$PrefixOperator, _elm_lang$core$Json_Decode$string)
									},
									_1: {
										ctor: '::',
										_0: {
											ctor: '_Tuple2',
											_0: 'operator',
											_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$Operator, _elm_lang$core$Json_Decode$string)
										},
										_1: {
											ctor: '::',
											_0: {
												ctor: '_Tuple2',
												_0: 'integer',
												_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$Integer, _elm_lang$core$Json_Decode$int)
											},
											_1: {
												ctor: '::',
												_0: {
													ctor: '_Tuple2',
													_0: 'float',
													_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$Floatable, _elm_lang$core$Json_Decode$float)
												},
												_1: {
													ctor: '::',
													_0: {
														ctor: '_Tuple2',
														_0: 'negation',
														_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$Negation, _user$project$AST_Decoding$decodeExpression)
													},
													_1: {
														ctor: '::',
														_0: {
															ctor: '_Tuple2',
															_0: 'literal',
															_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$Literal, _elm_lang$core$Json_Decode$string)
														},
														_1: {
															ctor: '::',
															_0: {
																ctor: '_Tuple2',
																_0: 'charLiteral',
																_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$CharLiteral, _user$project$AST_Decoding$decodeChar)
															},
															_1: {
																ctor: '::',
																_0: {
																	ctor: '_Tuple2',
																	_0: 'tupled',
																	_1: A2(
																		_elm_lang$core$Json_Decode$map,
																		_user$project$AST_Types$TupledExpression,
																		_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodeExpression))
																},
																_1: {
																	ctor: '::',
																	_0: {
																		ctor: '_Tuple2',
																		_0: 'list',
																		_1: A2(
																			_elm_lang$core$Json_Decode$map,
																			_user$project$AST_Types$ListExpr,
																			_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodeExpression))
																	},
																	_1: {
																		ctor: '::',
																		_0: {
																			ctor: '_Tuple2',
																			_0: 'parenthesized',
																			_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$ParenthesizedExpression, _user$project$AST_Decoding$decodeExpression)
																		},
																		_1: {
																			ctor: '::',
																			_0: {
																				ctor: '_Tuple2',
																				_0: 'let',
																				_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$LetExpression, _user$project$AST_Decoding$decodeLetBlock)
																			},
																			_1: {
																				ctor: '::',
																				_0: {
																					ctor: '_Tuple2',
																					_0: 'case',
																					_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$CaseExpression, _user$project$AST_Decoding$decodeCaseBlock)
																				},
																				_1: {
																					ctor: '::',
																					_0: {
																						ctor: '_Tuple2',
																						_0: 'lambda',
																						_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$LambdaExpression, _user$project$AST_Decoding$decodeLambda)
																					},
																					_1: {
																						ctor: '::',
																						_0: {
																							ctor: '_Tuple2',
																							_0: 'qualified',
																							_1: A3(
																								_elm_lang$core$Json_Decode$map2,
																								_user$project$AST_Types$QualifiedExpr,
																								A2(_elm_lang$core$Json_Decode$field, 'moduleName', _user$project$AST_Decoding$decodeModuleName),
																								_user$project$AST_Decoding$nameField)
																						},
																						_1: {
																							ctor: '::',
																							_0: {
																								ctor: '_Tuple2',
																								_0: 'recordAccess',
																								_1: A3(
																									_elm_lang$core$Json_Decode$map2,
																									_user$project$AST_Types$RecordAccess,
																									A2(_elm_lang$core$Json_Decode$field, 'expression', _user$project$AST_Decoding$decodeExpression),
																									_user$project$AST_Decoding$nameField)
																							},
																							_1: {
																								ctor: '::',
																								_0: {
																									ctor: '_Tuple2',
																									_0: 'recordAccessFunction',
																									_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$RecordAccessFunction, _elm_lang$core$Json_Decode$string)
																								},
																								_1: {
																									ctor: '::',
																									_0: {
																										ctor: '_Tuple2',
																										_0: 'record',
																										_1: A2(
																											_elm_lang$core$Json_Decode$map,
																											_user$project$AST_Types$RecordExpr,
																											_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodeRecordSetter))
																									},
																									_1: {
																										ctor: '::',
																										_0: {
																											ctor: '_Tuple2',
																											_0: 'recordUpdate',
																											_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$RecordUpdateExpression, _user$project$AST_Decoding$decodeRecordUpdate)
																										},
																										_1: {
																											ctor: '::',
																											_0: {
																												ctor: '_Tuple2',
																												_0: 'glsl',
																												_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$GLSLExpression, _elm_lang$core$Json_Decode$string)
																											},
																											_1: {ctor: '[]'}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			});
	});
var _user$project$AST_Decoding$decodeCaseBlock = _elm_lang$core$Json_Decode$lazy(
	function (_p23) {
		var _p24 = _p23;
		return A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$CaseBlock),
				A2(_elm_lang$core$Json_Decode$field, 'expression', _user$project$AST_Decoding$decodeExpression)),
			A2(
				_elm_lang$core$Json_Decode$field,
				'cases',
				_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodeCase)));
	});
var _user$project$AST_Decoding$decodeLambda = _elm_lang$core$Json_Decode$lazy(
	function (_p25) {
		var _p26 = _p25;
		return A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$Lambda),
				A2(
					_elm_lang$core$Json_Decode$field,
					'patterns',
					_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodePattern))),
			A2(_elm_lang$core$Json_Decode$field, 'expression', _user$project$AST_Decoding$decodeExpression));
	});
var _user$project$AST_Decoding$decodeLetBlock = _elm_lang$core$Json_Decode$lazy(
	function (_p27) {
		var _p28 = _p27;
		return A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$LetBlock),
				A2(
					_elm_lang$core$Json_Decode$field,
					'declarations',
					_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodeDeclaration))),
			A2(_elm_lang$core$Json_Decode$field, 'expression', _user$project$AST_Decoding$decodeExpression));
	});
var _user$project$AST_Decoding$decodeDeclaration = _elm_lang$core$Json_Decode$lazy(
	function (_p29) {
		var _p30 = _p29;
		return _user$project$Util_Json$decodeTyped(
			{
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'function',
					_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$FuncDecl, _user$project$AST_Decoding$decodeFunction)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'typeAlias',
						_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$AliasDecl, _user$project$AST_Decoding$decodeTypeAlias)
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'typedecl',
							_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$TypeDecl, _user$project$AST_Decoding$decodeType)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'port',
								_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$PortDeclaration, _user$project$AST_Decoding$decodeSignature)
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'infix',
									_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$InfixDeclaration, _user$project$AST_Decoding$decodeInfix)
								},
								_1: {
									ctor: '::',
									_0: {
										ctor: '_Tuple2',
										_0: 'destrucutring',
										_1: A2(_elm_lang$core$Json_Decode$map, _user$project$AST_Types$DestructuringDeclaration, _user$project$AST_Decoding$decodeDestructuring)
									},
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			});
	});
var _user$project$AST_Decoding$decodeDestructuring = _elm_lang$core$Json_Decode$lazy(
	function (_p31) {
		var _p32 = _p31;
		return A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$Destructuring),
				A2(_elm_lang$core$Json_Decode$field, 'pattern', _user$project$AST_Decoding$decodePattern)),
			A2(_elm_lang$core$Json_Decode$field, 'expression', _user$project$AST_Decoding$decodeExpression));
	});
var _user$project$AST_Decoding$decodeFunction = _elm_lang$core$Json_Decode$lazy(
	function (_p33) {
		var _p34 = _p33;
		return A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				A2(
					_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
					_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$Function),
					A2(
						_elm_lang$core$Json_Decode$field,
						'documentation',
						_elm_lang$core$Json_Decode$nullable(_user$project$AST_Decoding$decodeDocumentation))),
				A2(
					_elm_lang$core$Json_Decode$field,
					'signature',
					_elm_lang$core$Json_Decode$nullable(_user$project$AST_Decoding$decodeSignature))),
			A2(_elm_lang$core$Json_Decode$field, 'declaration', _user$project$AST_Decoding$decodeFunctionDeclaration));
	});
var _user$project$AST_Decoding$decodeFunctionDeclaration = _elm_lang$core$Json_Decode$lazy(
	function (_p35) {
		var _p36 = _p35;
		return A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				A2(
					_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
					A2(
						_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
						_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$FunctionDeclaration),
						A2(_elm_lang$core$Json_Decode$field, 'operatorDefinition', _elm_lang$core$Json_Decode$bool)),
					A2(_elm_lang$core$Json_Decode$field, 'name', _user$project$AST_Decoding$decodeVariablePointer)),
				A2(
					_elm_lang$core$Json_Decode$field,
					'arguments',
					_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodePattern))),
			A2(_elm_lang$core$Json_Decode$field, 'expression', _user$project$AST_Decoding$decodeExpression));
	});
var _user$project$AST_Decoding$decodeOperatorApplication = _elm_lang$core$Json_Decode$lazy(
	function (_p37) {
		var _p38 = _p37;
		return A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				A2(
					_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
					A2(
						_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
						_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$OperatorApplication),
						A2(_elm_lang$core$Json_Decode$field, 'operator', _elm_lang$core$Json_Decode$string)),
					A2(_elm_lang$core$Json_Decode$field, 'direction', _user$project$AST_Decoding$decodeInfixDirection)),
				A2(_elm_lang$core$Json_Decode$field, 'left', _user$project$AST_Decoding$decodeExpression)),
			A2(_elm_lang$core$Json_Decode$field, 'right', _user$project$AST_Decoding$decodeExpression));
	});
var _user$project$AST_Decoding$decodeRecordSetter = _elm_lang$core$Json_Decode$lazy(
	function (_p39) {
		var _p40 = _p39;
		return A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				_elm_lang$core$Json_Decode$succeed(
					F2(
						function (v0, v1) {
							return {ctor: '_Tuple2', _0: v0, _1: v1};
						})),
				A2(_elm_lang$core$Json_Decode$field, 'field', _elm_lang$core$Json_Decode$string)),
			A2(_elm_lang$core$Json_Decode$field, 'expression', _user$project$AST_Decoding$decodeExpression));
	});
var _user$project$AST_Decoding$decodeRecordUpdate = _elm_lang$core$Json_Decode$lazy(
	function (_p41) {
		var _p42 = _p41;
		return A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$RecordUpdate),
				_user$project$AST_Decoding$nameField),
			A2(
				_elm_lang$core$Json_Decode$field,
				'updates',
				_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodeRecordSetter)));
	});
var _user$project$AST_Decoding$decode = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				_elm_lang$core$Json_Decode$succeed(_user$project$AST_Types$File),
				A2(_elm_lang$core$Json_Decode$field, 'moduleDefinition', _user$project$AST_Decoding$decodeModule)),
			A2(
				_elm_lang$core$Json_Decode$field,
				'imports',
				_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodeImport))),
		A2(
			_elm_lang$core$Json_Decode$field,
			'declarations',
			_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodeDeclaration))),
	A2(
		_elm_lang$core$Json_Decode$field,
		'comments',
		_elm_lang$core$Json_Decode$list(_user$project$AST_Decoding$decodeComment)));

var _user$project$AST_Encoding$encodeInfixDirection = function (d) {
	var _p0 = d;
	if (_p0.ctor === 'Left') {
		return _elm_lang$core$Json_Encode$string('left');
	} else {
		return _elm_lang$core$Json_Encode$string('right');
	}
};
var _user$project$AST_Encoding$encodeInfix = function (inf) {
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'direction',
				_1: _user$project$AST_Encoding$encodeInfixDirection(inf.direction)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'precedence',
					_1: _elm_lang$core$Json_Encode$int(inf.precedence)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'operator',
						_1: _elm_lang$core$Json_Encode$string(inf.operator)
					},
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$AST_Encoding$encodeModuleName = function (_p1) {
	return _elm_lang$core$Json_Encode$list(
		A2(_elm_lang$core$List$map, _elm_lang$core$Json_Encode$string, _p1));
};
var _user$project$AST_Encoding$rangeField = function (r) {
	return {
		ctor: '_Tuple2',
		_0: 'range',
		_1: _user$project$AST_Ranges$encode(r)
	};
};
var _user$project$AST_Encoding$encodeComment = function (_p2) {
	var _p3 = _p2;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'text',
				_1: _elm_lang$core$Json_Encode$string(_p3._0)
			},
			_1: {
				ctor: '::',
				_0: _user$project$AST_Encoding$rangeField(_p3._1),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$AST_Encoding$encodeDocumentation = function (_p4) {
	var _p5 = _p4;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'value',
				_1: _elm_lang$core$Json_Encode$string(_p5._0)
			},
			_1: {
				ctor: '::',
				_0: _user$project$AST_Encoding$rangeField(_p5._1),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$AST_Encoding$encodeVariablePointer = function (_p6) {
	var _p7 = _p6;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'value',
				_1: _elm_lang$core$Json_Encode$string(_p7.value)
			},
			_1: {
				ctor: '::',
				_0: _user$project$AST_Encoding$rangeField(_p7.range),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$AST_Encoding$nameField = function (x) {
	return {
		ctor: '_Tuple2',
		_0: 'name',
		_1: _elm_lang$core$Json_Encode$string(x)
	};
};
var _user$project$AST_Encoding$encodeValueConstructorExpose = function (_p8) {
	var _p9 = _p8;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: _user$project$AST_Encoding$nameField(_p9._0),
			_1: {
				ctor: '::',
				_0: _user$project$AST_Encoding$rangeField(_p9._1),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$AST_Encoding$encodeQualifiedNameRef = function (_p10) {
	var _p11 = _p10;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'moduleName',
				_1: _user$project$AST_Encoding$encodeModuleName(_p11.moduleName)
			},
			_1: {
				ctor: '::',
				_0: _user$project$AST_Encoding$nameField(_p11.name),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$AST_Encoding$asList = function (f) {
	return function (_p12) {
		return _elm_lang$core$Json_Encode$list(
			A2(_elm_lang$core$List$map, f, _p12));
	};
};
var _user$project$AST_Encoding$encodeExposingList = F2(
	function (exp, f) {
		var _p13 = exp;
		switch (_p13.ctor) {
			case 'None':
				return A2(_user$project$Util_Json$encodeTyped, 'none', _elm_lang$core$Json_Encode$null);
			case 'All':
				return A2(
					_user$project$Util_Json$encodeTyped,
					'all',
					_user$project$AST_Ranges$encode(_p13._0));
			default:
				return A2(
					_user$project$Util_Json$encodeTyped,
					'explicit',
					A2(_user$project$AST_Encoding$asList, f, _p13._0));
		}
	});
var _user$project$AST_Encoding$encodeExposedType = function (_p14) {
	var _p15 = _p14;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: _user$project$AST_Encoding$nameField(_p15.name),
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'inner',
					_1: A2(_user$project$AST_Encoding$encodeExposingList, _p15.constructors, _user$project$AST_Encoding$encodeValueConstructorExpose)
				},
				_1: {
					ctor: '::',
					_0: _user$project$AST_Encoding$rangeField(_p15.range),
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$AST_Encoding$encodeExpose = function (exp) {
	var _p16 = exp;
	switch (_p16.ctor) {
		case 'InfixExpose':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'infix',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: _user$project$AST_Encoding$nameField(_p16._0),
						_1: {
							ctor: '::',
							_0: _user$project$AST_Encoding$rangeField(_p16._1),
							_1: {ctor: '[]'}
						}
					}));
		case 'FunctionExpose':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'function',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: _user$project$AST_Encoding$nameField(_p16._0),
						_1: {
							ctor: '::',
							_0: _user$project$AST_Encoding$rangeField(_p16._1),
							_1: {ctor: '[]'}
						}
					}));
		case 'TypeOrAliasExpose':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'typeOrAlias',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: _user$project$AST_Encoding$nameField(_p16._0),
						_1: {
							ctor: '::',
							_0: _user$project$AST_Encoding$rangeField(_p16._1),
							_1: {ctor: '[]'}
						}
					}));
		default:
			return A2(
				_user$project$Util_Json$encodeTyped,
				'typeexpose',
				_user$project$AST_Encoding$encodeExposedType(_p16._0));
	}
};
var _user$project$AST_Encoding$encodeEffectModuleData = function (_p17) {
	var _p18 = _p17;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'moduleName',
				_1: _user$project$AST_Encoding$encodeModuleName(_p18.moduleName)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'exposingList',
					_1: A2(_user$project$AST_Encoding$encodeExposingList, _p18.exposingList, _user$project$AST_Encoding$encodeExpose)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'command',
						_1: A2(
							_elm_lang$core$Maybe$withDefault,
							_elm_lang$core$Json_Encode$null,
							A2(_elm_lang$core$Maybe$map, _elm_lang$core$Json_Encode$string, _p18.command))
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'subscription',
							_1: A2(
								_elm_lang$core$Maybe$withDefault,
								_elm_lang$core$Json_Encode$null,
								A2(_elm_lang$core$Maybe$map, _elm_lang$core$Json_Encode$string, _p18.subscription))
						},
						_1: {ctor: '[]'}
					}
				}
			}
		});
};
var _user$project$AST_Encoding$encodeDefaultModuleData = function (_p19) {
	var _p20 = _p19;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'moduleName',
				_1: _user$project$AST_Encoding$encodeModuleName(_p20.moduleName)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'exposingList',
					_1: A2(_user$project$AST_Encoding$encodeExposingList, _p20.exposingList, _user$project$AST_Encoding$encodeExpose)
				},
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$AST_Encoding$encodeModule = function (m) {
	var _p21 = m;
	switch (_p21.ctor) {
		case 'NormalModule':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'normal',
				_user$project$AST_Encoding$encodeDefaultModuleData(_p21._0));
		case 'PortModule':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'port',
				_user$project$AST_Encoding$encodeDefaultModuleData(_p21._0));
		case 'EffectModule':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'effect',
				_user$project$AST_Encoding$encodeEffectModuleData(_p21._0));
		default:
			return A2(_user$project$Util_Json$encodeTyped, 'nomodule', _elm_lang$core$Json_Encode$null);
	}
};
var _user$project$AST_Encoding$encodeImport = function (_p22) {
	var _p23 = _p22;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'moduleName',
				_1: _user$project$AST_Encoding$encodeModuleName(_p23.moduleName)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'moduleAlias',
					_1: A2(
						_elm_lang$core$Maybe$withDefault,
						_elm_lang$core$Json_Encode$null,
						A2(_elm_lang$core$Maybe$map, _user$project$AST_Encoding$encodeModuleName, _p23.moduleAlias))
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'exposingList',
						_1: A2(_user$project$AST_Encoding$encodeExposingList, _p23.exposingList, _user$project$AST_Encoding$encodeExpose)
					},
					_1: {
						ctor: '::',
						_0: _user$project$AST_Encoding$rangeField(_p23.range),
						_1: {ctor: '[]'}
					}
				}
			}
		});
};
var _user$project$AST_Encoding$encodeTypeReference = function (typeReference) {
	var _p24 = typeReference;
	switch (_p24.ctor) {
		case 'GenericType':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'generic',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'value',
							_1: _elm_lang$core$Json_Encode$string(_p24._0)
						},
						_1: {
							ctor: '::',
							_0: _user$project$AST_Encoding$rangeField(_p24._1),
							_1: {ctor: '[]'}
						}
					}));
		case 'Typed':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'typed',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'moduleName',
							_1: _user$project$AST_Encoding$encodeModuleName(_p24._0)
						},
						_1: {
							ctor: '::',
							_0: _user$project$AST_Encoding$nameField(_p24._1),
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'args',
									_1: A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodeTypeReference, _p24._2)
								},
								_1: {
									ctor: '::',
									_0: _user$project$AST_Encoding$rangeField(_p24._3),
									_1: {ctor: '[]'}
								}
							}
						}
					}));
		case 'Unit':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'unit',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: _user$project$AST_Encoding$rangeField(_p24._0),
						_1: {ctor: '[]'}
					}));
		case 'Tupled':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'tupled',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'values',
							_1: A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodeTypeReference, _p24._0)
						},
						_1: {
							ctor: '::',
							_0: _user$project$AST_Encoding$rangeField(_p24._1),
							_1: {ctor: '[]'}
						}
					}));
		case 'FunctionTypeReference':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'function',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'left',
							_1: _user$project$AST_Encoding$encodeTypeReference(_p24._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'right',
								_1: _user$project$AST_Encoding$encodeTypeReference(_p24._1)
							},
							_1: {
								ctor: '::',
								_0: _user$project$AST_Encoding$rangeField(_p24._2),
								_1: {ctor: '[]'}
							}
						}
					}));
		case 'Record':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'record',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'value',
							_1: _user$project$AST_Encoding$encodeRecordDefinition(_p24._0)
						},
						_1: {
							ctor: '::',
							_0: _user$project$AST_Encoding$rangeField(_p24._1),
							_1: {ctor: '[]'}
						}
					}));
		default:
			return A2(
				_user$project$Util_Json$encodeTyped,
				'genericRecord',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: _user$project$AST_Encoding$nameField(_p24._0),
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'values',
								_1: _user$project$AST_Encoding$encodeRecordDefinition(_p24._1)
							},
							_1: {
								ctor: '::',
								_0: _user$project$AST_Encoding$rangeField(_p24._2),
								_1: {ctor: '[]'}
							}
						}
					}));
	}
};
var _user$project$AST_Encoding$encodeRecordDefinition = function (_p25) {
	return _elm_lang$core$Json_Encode$list(
		A2(_elm_lang$core$List$map, _user$project$AST_Encoding$encodeRecordField, _p25));
};
var _user$project$AST_Encoding$encodeRecordField = function (_p26) {
	var _p27 = _p26;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: _user$project$AST_Encoding$nameField(_p27._0),
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'typeReference',
					_1: _user$project$AST_Encoding$encodeTypeReference(_p27._1)
				},
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$AST_Encoding$encodeValueConstructor = function (_p28) {
	var _p29 = _p28;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: _user$project$AST_Encoding$nameField(_p29.name),
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'arguments',
					_1: A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodeTypeReference, _p29.$arguments)
				},
				_1: {
					ctor: '::',
					_0: _user$project$AST_Encoding$rangeField(_p29.range),
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$AST_Encoding$encodeType = function (_p30) {
	var _p31 = _p30;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: _user$project$AST_Encoding$nameField(_p31.name),
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'generics',
					_1: A2(_user$project$AST_Encoding$asList, _elm_lang$core$Json_Encode$string, _p31.generics)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'constructors',
						_1: A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodeValueConstructor, _p31.constructors)
					},
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$AST_Encoding$encodeTypeAlias = function (_p32) {
	var _p33 = _p32;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'documentation',
				_1: A2(
					_elm_lang$core$Maybe$withDefault,
					_elm_lang$core$Json_Encode$null,
					A2(_elm_lang$core$Maybe$map, _user$project$AST_Encoding$encodeDocumentation, _p33.documentation))
			},
			_1: {
				ctor: '::',
				_0: _user$project$AST_Encoding$nameField(_p33.name),
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'generics',
						_1: A2(_user$project$AST_Encoding$asList, _elm_lang$core$Json_Encode$string, _p33.generics)
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'typeReference',
							_1: _user$project$AST_Encoding$encodeTypeReference(_p33.typeReference)
						},
						_1: {
							ctor: '::',
							_0: _user$project$AST_Encoding$rangeField(_p33.range),
							_1: {ctor: '[]'}
						}
					}
				}
			}
		});
};
var _user$project$AST_Encoding$encodeSignature = function (_p34) {
	var _p35 = _p34;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'operatorDefinition',
				_1: _elm_lang$core$Json_Encode$bool(_p35.operatorDefinition)
			},
			_1: {
				ctor: '::',
				_0: _user$project$AST_Encoding$nameField(_p35.name),
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'typeReference',
						_1: _user$project$AST_Encoding$encodeTypeReference(_p35.typeReference)
					},
					_1: {
						ctor: '::',
						_0: _user$project$AST_Encoding$rangeField(_p35.range),
						_1: {ctor: '[]'}
					}
				}
			}
		});
};
var _user$project$AST_Encoding$encodePattern = function (pattern) {
	var _p36 = pattern;
	switch (_p36.ctor) {
		case 'AllPattern':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'all',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'range',
							_1: _user$project$AST_Ranges$encode(_p36._0)
						},
						_1: {ctor: '[]'}
					}));
		case 'UnitPattern':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'unit',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'range',
							_1: _user$project$AST_Ranges$encode(_p36._0)
						},
						_1: {ctor: '[]'}
					}));
		case 'CharPattern':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'char',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'value',
							_1: _elm_lang$core$Json_Encode$string(
								_elm_lang$core$String$fromChar(_p36._0))
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p36._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'StringPattern':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'char',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'value',
							_1: _elm_lang$core$Json_Encode$string(_p36._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p36._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'IntPattern':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'int',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'value',
							_1: _elm_lang$core$Json_Encode$int(_p36._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p36._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'FloatPattern':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'float',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'value',
							_1: _elm_lang$core$Json_Encode$float(_p36._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p36._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'TuplePattern':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'tuple',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'value',
							_1: A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodePattern, _p36._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p36._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'RecordPattern':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'record',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'value',
							_1: A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodeVariablePointer, _p36._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p36._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'UnConsPattern':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'uncons',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'left',
							_1: _user$project$AST_Encoding$encodePattern(_p36._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'right',
								_1: _user$project$AST_Encoding$encodePattern(_p36._1)
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'range',
									_1: _user$project$AST_Ranges$encode(_p36._2)
								},
								_1: {ctor: '[]'}
							}
						}
					}));
		case 'ListPattern':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'list',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'value',
							_1: A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodePattern, _p36._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p36._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'VarPattern':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'var',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'value',
							_1: _elm_lang$core$Json_Encode$string(_p36._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p36._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'NamedPattern':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'named',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'qualified',
							_1: _user$project$AST_Encoding$encodeQualifiedNameRef(_p36._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'patterns',
								_1: A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodePattern, _p36._1)
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'range',
									_1: _user$project$AST_Ranges$encode(_p36._2)
								},
								_1: {ctor: '[]'}
							}
						}
					}));
		case 'QualifiedNamePattern':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'qualifiedName',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'value',
							_1: _user$project$AST_Encoding$encodeQualifiedNameRef(_p36._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p36._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'AsPattern':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'as',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'name',
							_1: _user$project$AST_Encoding$encodeVariablePointer(_p36._1)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'pattern',
								_1: _user$project$AST_Encoding$encodePattern(_p36._0)
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'range',
									_1: _user$project$AST_Ranges$encode(_p36._2)
								},
								_1: {ctor: '[]'}
							}
						}
					}));
		default:
			return A2(
				_user$project$Util_Json$encodeTyped,
				'parentisized',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'value',
							_1: _user$project$AST_Encoding$encodePattern(_p36._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p36._1)
							},
							_1: {ctor: '[]'}
						}
					}));
	}
};
var _user$project$AST_Encoding$encodeLetBlock = function (_p37) {
	var _p38 = _p37;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'declarations',
				_1: A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodeDeclaration, _p38.declarations)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'expression',
					_1: _user$project$AST_Encoding$encodeExpression(_p38.expression)
				},
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$AST_Encoding$encodeDeclaration = function (decl) {
	var _p39 = decl;
	switch (_p39.ctor) {
		case 'FuncDecl':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'function',
				_user$project$AST_Encoding$encodeFunction(_p39._0));
		case 'AliasDecl':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'typeAlias',
				_user$project$AST_Encoding$encodeTypeAlias(_p39._0));
		case 'TypeDecl':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'typedecl',
				_user$project$AST_Encoding$encodeType(_p39._0));
		case 'PortDeclaration':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'port',
				_user$project$AST_Encoding$encodeSignature(_p39._0));
		case 'InfixDeclaration':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'infix',
				_user$project$AST_Encoding$encodeInfix(_p39._0));
		default:
			return A2(
				_user$project$Util_Json$encodeTyped,
				'destrucutring',
				_user$project$AST_Encoding$encodeDestructuring(_p39._0));
	}
};
var _user$project$AST_Encoding$encodeDestructuring = function (_p40) {
	var _p41 = _p40;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'pattern',
				_1: _user$project$AST_Encoding$encodePattern(_p41.pattern)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'expression',
					_1: _user$project$AST_Encoding$encodeExpression(_p41.expression)
				},
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$AST_Encoding$encodeExpression = function (_p42) {
	var _p43 = _p42;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: _user$project$AST_Encoding$rangeField(_p43._0),
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'inner',
					_1: function () {
						var _p44 = _p43._1;
						switch (_p44.ctor) {
							case 'UnitExpr':
								return A2(_user$project$Util_Json$encodeTyped, 'unit', _elm_lang$core$Json_Encode$null);
							case 'Application':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'application',
									A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodeExpression, _p44._0));
							case 'OperatorApplication':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'operatorapplication',
									A4(_user$project$AST_Encoding$encodeOperatorApplication, _p44._0, _p44._1, _p44._2, _p44._3));
							case 'FunctionOrValue':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'functionOrValue',
									_elm_lang$core$Json_Encode$string(_p44._0));
							case 'IfBlock':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'ifBlock',
									_elm_lang$core$Json_Encode$object(
										{
											ctor: '::',
											_0: {
												ctor: '_Tuple2',
												_0: 'clause',
												_1: _user$project$AST_Encoding$encodeExpression(_p44._0)
											},
											_1: {
												ctor: '::',
												_0: {
													ctor: '_Tuple2',
													_0: 'then',
													_1: _user$project$AST_Encoding$encodeExpression(_p44._1)
												},
												_1: {
													ctor: '::',
													_0: {
														ctor: '_Tuple2',
														_0: 'else',
														_1: _user$project$AST_Encoding$encodeExpression(_p44._2)
													},
													_1: {ctor: '[]'}
												}
											}
										}));
							case 'PrefixOperator':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'prefixoperator',
									_elm_lang$core$Json_Encode$string(_p44._0));
							case 'Operator':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'operator',
									_elm_lang$core$Json_Encode$string(_p44._0));
							case 'Integer':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'integer',
									_elm_lang$core$Json_Encode$int(_p44._0));
							case 'Floatable':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'float',
									_elm_lang$core$Json_Encode$float(_p44._0));
							case 'Negation':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'negation',
									_user$project$AST_Encoding$encodeExpression(_p44._0));
							case 'Literal':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'literal',
									_elm_lang$core$Json_Encode$string(_p44._0));
							case 'CharLiteral':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'charLiteral',
									_elm_lang$core$Json_Encode$string(
										_elm_lang$core$String$fromChar(_p44._0)));
							case 'TupledExpression':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'tupled',
									A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodeExpression, _p44._0));
							case 'ListExpr':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'list',
									A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodeExpression, _p44._0));
							case 'ParenthesizedExpression':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'parenthesized',
									_user$project$AST_Encoding$encodeExpression(_p44._0));
							case 'LetExpression':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'let',
									_user$project$AST_Encoding$encodeLetBlock(_p44._0));
							case 'CaseExpression':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'case',
									_user$project$AST_Encoding$encodeCaseBlock(_p44._0));
							case 'LambdaExpression':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'lambda',
									_user$project$AST_Encoding$encodeLambda(_p44._0));
							case 'QualifiedExpr':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'qualified',
									_elm_lang$core$Json_Encode$object(
										{
											ctor: '::',
											_0: {
												ctor: '_Tuple2',
												_0: 'moduleName',
												_1: _user$project$AST_Encoding$encodeModuleName(_p44._0)
											},
											_1: {
												ctor: '::',
												_0: _user$project$AST_Encoding$nameField(_p44._1),
												_1: {ctor: '[]'}
											}
										}));
							case 'RecordAccess':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'recordAccess',
									_elm_lang$core$Json_Encode$object(
										{
											ctor: '::',
											_0: {
												ctor: '_Tuple2',
												_0: 'expression',
												_1: _user$project$AST_Encoding$encodeExpression(_p44._0)
											},
											_1: {
												ctor: '::',
												_0: _user$project$AST_Encoding$nameField(_p44._1),
												_1: {ctor: '[]'}
											}
										}));
							case 'RecordAccessFunction':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'recordAccessFunction',
									_elm_lang$core$Json_Encode$string(_p44._0));
							case 'RecordExpr':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'record',
									A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodeRecordSetter, _p44._0));
							case 'RecordUpdateExpression':
								return A2(
									_user$project$Util_Json$encodeTyped,
									'recordUpdate',
									_user$project$AST_Encoding$encodeRecordUpdate(_p44._0));
							default:
								return A2(
									_user$project$Util_Json$encodeTyped,
									'glsl',
									_elm_lang$core$Json_Encode$string(_p44._0));
						}
					}()
				},
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$AST_Encoding$encodeCaseBlock = function (_p45) {
	var _p46 = _p45;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'cases',
				_1: A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodeCase, _p46.cases)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'expression',
					_1: _user$project$AST_Encoding$encodeExpression(_p46.expression)
				},
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$AST_Encoding$encodeCase = function (_p47) {
	var _p48 = _p47;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'pattern',
				_1: _user$project$AST_Encoding$encodePattern(_p48._0)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'expression',
					_1: _user$project$AST_Encoding$encodeExpression(_p48._1)
				},
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$AST_Encoding$encodeLambda = function (_p49) {
	var _p50 = _p49;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'patterns',
				_1: A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodePattern, _p50.args)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'expression',
					_1: _user$project$AST_Encoding$encodeExpression(_p50.expression)
				},
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$AST_Encoding$encodeOperatorApplication = F4(
	function (operator, direction, left, right) {
		return _elm_lang$core$Json_Encode$object(
			{
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'operator',
					_1: _elm_lang$core$Json_Encode$string(operator)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'direction',
						_1: _user$project$AST_Encoding$encodeInfixDirection(direction)
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'left',
							_1: _user$project$AST_Encoding$encodeExpression(left)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'right',
								_1: _user$project$AST_Encoding$encodeExpression(right)
							},
							_1: {ctor: '[]'}
						}
					}
				}
			});
	});
var _user$project$AST_Encoding$encodeRecordSetter = function (_p51) {
	var _p52 = _p51;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'field',
				_1: _elm_lang$core$Json_Encode$string(_p52._0)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'expression',
					_1: _user$project$AST_Encoding$encodeExpression(_p52._1)
				},
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$AST_Encoding$encodeRecordUpdate = function (_p53) {
	var _p54 = _p53;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: _user$project$AST_Encoding$nameField(_p54.name),
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'updates',
					_1: A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodeRecordSetter, _p54.updates)
				},
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$AST_Encoding$encodeFunction = function (_p55) {
	var _p56 = _p55;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'documentation',
				_1: A2(
					_elm_lang$core$Maybe$withDefault,
					_elm_lang$core$Json_Encode$null,
					A2(_elm_lang$core$Maybe$map, _user$project$AST_Encoding$encodeDocumentation, _p56.documentation))
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'signature',
					_1: A2(
						_elm_lang$core$Maybe$withDefault,
						_elm_lang$core$Json_Encode$null,
						A2(_elm_lang$core$Maybe$map, _user$project$AST_Encoding$encodeSignature, _p56.signature))
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'declaration',
						_1: _user$project$AST_Encoding$encodeFunctionDeclaration(_p56.declaration)
					},
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$AST_Encoding$encodeFunctionDeclaration = function (_p57) {
	var _p58 = _p57;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'operatorDefinition',
				_1: _elm_lang$core$Json_Encode$bool(_p58.operatorDefinition)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'name',
					_1: _user$project$AST_Encoding$encodeVariablePointer(_p58.name)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'arguments',
						_1: A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodePattern, _p58.$arguments)
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'expression',
							_1: _user$project$AST_Encoding$encodeExpression(_p58.expression)
						},
						_1: {ctor: '[]'}
					}
				}
			}
		});
};
var _user$project$AST_Encoding$encode = function (_p59) {
	var _p60 = _p59;
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'moduleDefinition',
				_1: _user$project$AST_Encoding$encodeModule(_p60.moduleDefinition)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'imports',
					_1: A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodeImport, _p60.imports)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'declarations',
						_1: A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodeDeclaration, _p60.declarations)
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'comments',
							_1: A2(_user$project$AST_Encoding$asList, _user$project$AST_Encoding$encodeComment, _p60.comments)
						},
						_1: {ctor: '[]'}
					}
				}
			}
		});
};

var _user$project$AST_Util$patternModuleNames = function (p) {
	patternModuleNames:
	while (true) {
		var _p0 = p;
		switch (_p0.ctor) {
			case 'TuplePattern':
				return A2(_elm_lang$core$List$concatMap, _user$project$AST_Util$patternModuleNames, _p0._0);
			case 'RecordPattern':
				return {ctor: '[]'};
			case 'UnConsPattern':
				return A2(
					_elm_lang$core$Basics_ops['++'],
					_user$project$AST_Util$patternModuleNames(_p0._0),
					_user$project$AST_Util$patternModuleNames(_p0._1));
			case 'ListPattern':
				return A2(_elm_lang$core$List$concatMap, _user$project$AST_Util$patternModuleNames, _p0._0);
			case 'NamedPattern':
				return {
					ctor: '::',
					_0: _p0._0.moduleName,
					_1: A2(_elm_lang$core$List$concatMap, _user$project$AST_Util$patternModuleNames, _p0._1)
				};
			case 'QualifiedNamePattern':
				return {
					ctor: '::',
					_0: _p0._0.moduleName,
					_1: {ctor: '[]'}
				};
			case 'AsPattern':
				var _v1 = _p0._0;
				p = _v1;
				continue patternModuleNames;
			case 'ParenthesizedPattern':
				var _v2 = _p0._0;
				p = _v2;
				continue patternModuleNames;
			default:
				return {ctor: '[]'};
		}
	}
};
var _user$project$AST_Util$getParenthesized = function (_p1) {
	var _p2 = _p1;
	var _p3 = _p2._1;
	if (_p3.ctor === 'ParenthesizedExpression') {
		return _elm_lang$core$Maybe$Just(
			{ctor: '_Tuple2', _0: _p2._0, _1: _p3._0});
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _user$project$AST_Util$isOperatorApplication = function (_p4) {
	var _p5 = _p4;
	var _p6 = _p5._1;
	if (_p6.ctor === 'OperatorApplication') {
		return true;
	} else {
		return false;
	}
};
var _user$project$AST_Util$isCase = function (_p7) {
	var _p8 = _p7;
	var _p9 = _p8._1;
	if (_p9.ctor === 'CaseExpression') {
		return true;
	} else {
		return false;
	}
};
var _user$project$AST_Util$isIf = function (_p10) {
	var _p11 = _p10;
	var _p12 = _p11._1;
	if (_p12.ctor === 'IfBlock') {
		return true;
	} else {
		return false;
	}
};
var _user$project$AST_Util$isLambda = function (_p13) {
	var _p14 = _p13;
	var _p15 = _p14._1;
	if (_p15.ctor === 'LambdaExpression') {
		return true;
	} else {
		return false;
	}
};
var _user$project$AST_Util$fileModuleName = function (file) {
	var _p16 = file.moduleDefinition;
	switch (_p16.ctor) {
		case 'NormalModule':
			return _elm_lang$core$Maybe$Just(_p16._0.moduleName);
		case 'PortModule':
			return _elm_lang$core$Maybe$Just(_p16._0.moduleName);
		case 'EffectModule':
			return _elm_lang$core$Maybe$Just(_p16._0.moduleName);
		default:
			return _elm_lang$core$Maybe$Nothing;
	}
};
var _user$project$AST_Util$fileExposingList = function (file) {
	var _p17 = file.moduleDefinition;
	switch (_p17.ctor) {
		case 'NormalModule':
			return _elm_lang$core$Maybe$Just(_p17._0.exposingList);
		case 'PortModule':
			return _elm_lang$core$Maybe$Just(_p17._0.exposingList);
		case 'EffectModule':
			return _elm_lang$core$Maybe$Just(_p17._0.exposingList);
		default:
			return _elm_lang$core$Maybe$Nothing;
	}
};
var _user$project$AST_Util$isPortModule = function (file) {
	var _p18 = file.moduleDefinition;
	if (_p18.ctor === 'PortModule') {
		return true;
	} else {
		return false;
	}
};
var _user$project$AST_Util$moduleExposingList = function (m) {
	var _p19 = m;
	switch (_p19.ctor) {
		case 'NormalModule':
			return _p19._0.exposingList;
		case 'PortModule':
			return _p19._0.exposingList;
		case 'EffectModule':
			return _p19._0.exposingList;
		default:
			return _user$project$AST_Types$None;
	}
};

var _user$project$ASTUtil_Writer$startOnDifferentLines = function (xs) {
	return _elm_lang$core$Native_Utils.cmp(
		_elm_lang$core$List$length(
			_elm_community$list_extra$List_Extra$unique(
				A2(
					_elm_lang$core$List$map,
					function (_p0) {
						return function (_) {
							return _.row;
						}(
							function (_) {
								return _.start;
							}(_p0));
					},
					xs))),
		1) > 0;
};
var _user$project$ASTUtil_Writer$asIndent = A2(_elm_lang$core$Basics$flip, _elm_lang$core$String$repeat, ' ');
var _user$project$ASTUtil_Writer$writeIndented = F2(
	function (indent, w) {
		var _p1 = w;
		switch (_p1.ctor) {
			case 'Sep':
				var _p4 = _p1._0._1;
				var _p3 = _p1._1;
				var differentLines = _user$project$ASTUtil_Writer$startOnDifferentLines(
					A2(_elm_lang$core$List$map, _elm_lang$core$Tuple$first, _p3));
				var seperator = differentLines ? A2(
					_elm_lang$core$Basics_ops['++'],
					'\n',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_user$project$ASTUtil_Writer$asIndent(indent),
						_p4)) : _p4;
				return _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: _p1._0._0,
						_1: {
							ctor: '::',
							_0: A2(
								_elm_lang$core$String$join,
								seperator,
								A2(
									_elm_lang$core$List$map,
									function (_p2) {
										return A2(
											_user$project$ASTUtil_Writer$writeIndented,
											indent,
											_elm_lang$core$Tuple$second(_p2));
									},
									_p3)),
							_1: {
								ctor: '::',
								_0: _p1._0._2,
								_1: {ctor: '[]'}
							}
						}
					});
			case 'Breaked':
				return A2(
					_elm_lang$core$String$join,
					A2(
						_elm_lang$core$Basics_ops['++'],
						'\n',
						_user$project$ASTUtil_Writer$asIndent(indent)),
					A2(
						_elm_lang$core$List$map,
						_user$project$ASTUtil_Writer$writeIndented(indent),
						_p1._0));
			case 'Str':
				return _p1._0;
			case 'Indent':
				var _p5 = _p1._0;
				return A2(
					_elm_lang$core$Basics_ops['++'],
					_user$project$ASTUtil_Writer$asIndent(_p5 + indent),
					A2(_user$project$ASTUtil_Writer$writeIndented, _p5 + indent, _p1._1));
			case 'Spaced':
				return A2(
					_elm_lang$core$String$join,
					' ',
					A2(
						_elm_lang$core$List$map,
						_user$project$ASTUtil_Writer$writeIndented(indent),
						_p1._0));
			case 'Joined':
				return _elm_lang$core$String$concat(
					A2(
						_elm_lang$core$List$map,
						_user$project$ASTUtil_Writer$writeIndented(indent),
						_p1._0));
			default:
				return A2(
					_elm_lang$core$Basics_ops['++'],
					A2(_user$project$ASTUtil_Writer$writeIndented, indent, _p1._0),
					A2(_user$project$ASTUtil_Writer$writeIndented, indent, _p1._1));
		}
	});
var _user$project$ASTUtil_Writer$write = _user$project$ASTUtil_Writer$writeIndented(0);
var _user$project$ASTUtil_Writer$Joined = function (a) {
	return {ctor: 'Joined', _0: a};
};
var _user$project$ASTUtil_Writer$join = _user$project$ASTUtil_Writer$Joined;
var _user$project$ASTUtil_Writer$Spaced = function (a) {
	return {ctor: 'Spaced', _0: a};
};
var _user$project$ASTUtil_Writer$spaced = _user$project$ASTUtil_Writer$Spaced;
var _user$project$ASTUtil_Writer$Indent = F2(
	function (a, b) {
		return {ctor: 'Indent', _0: a, _1: b};
	});
var _user$project$ASTUtil_Writer$indent = _user$project$ASTUtil_Writer$Indent;
var _user$project$ASTUtil_Writer$Append = F2(
	function (a, b) {
		return {ctor: 'Append', _0: a, _1: b};
	});
var _user$project$ASTUtil_Writer$append = _user$project$ASTUtil_Writer$Append;
var _user$project$ASTUtil_Writer$Str = function (a) {
	return {ctor: 'Str', _0: a};
};
var _user$project$ASTUtil_Writer$epsilon = _user$project$ASTUtil_Writer$Str('');
var _user$project$ASTUtil_Writer$maybe = _elm_lang$core$Maybe$withDefault(_user$project$ASTUtil_Writer$epsilon);
var _user$project$ASTUtil_Writer$string = _user$project$ASTUtil_Writer$Str;
var _user$project$ASTUtil_Writer$Breaked = function (a) {
	return {ctor: 'Breaked', _0: a};
};
var _user$project$ASTUtil_Writer$breaked = _user$project$ASTUtil_Writer$Breaked;
var _user$project$ASTUtil_Writer$Sep = F2(
	function (a, b) {
		return {ctor: 'Sep', _0: a, _1: b};
	});
var _user$project$ASTUtil_Writer$parensComma = _user$project$ASTUtil_Writer$Sep(
	{ctor: '_Tuple3', _0: '(', _1: ', ', _2: ')'});
var _user$project$ASTUtil_Writer$bracesComma = _user$project$ASTUtil_Writer$Sep(
	{ctor: '_Tuple3', _0: '{', _1: ', ', _2: '}'});
var _user$project$ASTUtil_Writer$bracketsComma = _user$project$ASTUtil_Writer$Sep(
	{ctor: '_Tuple3', _0: '[', _1: ', ', _2: ']'});
var _user$project$ASTUtil_Writer$sepByComma = _user$project$ASTUtil_Writer$Sep(
	{ctor: '_Tuple3', _0: '', _1: ', ', _2: ''});
var _user$project$ASTUtil_Writer$sepBySpace = _user$project$ASTUtil_Writer$Sep(
	{ctor: '_Tuple3', _0: '', _1: ' ', _2: ''});
var _user$project$ASTUtil_Writer$sepBy = _user$project$ASTUtil_Writer$Sep;

var _user$project$ASTUtil_Expose$range = function (e) {
	var _p0 = e;
	switch (_p0.ctor) {
		case 'InfixExpose':
			return _p0._1;
		case 'FunctionExpose':
			return _p0._1;
		case 'TypeOrAliasExpose':
			return _p0._1;
		default:
			return _p0._0.range;
	}
};
var _user$project$ASTUtil_Expose$exposesFunction = F2(
	function (s, exposure) {
		var _p1 = exposure;
		switch (_p1.ctor) {
			case 'All':
				return true;
			case 'None':
				return false;
			default:
				return A2(
					_elm_lang$core$List$any,
					function (x) {
						var _p2 = x;
						if (_p2.ctor === 'FunctionExpose') {
							return _elm_lang$core$Native_Utils.eq(_p2._0, s);
						} else {
							return false;
						}
					},
					_p1._0);
		}
	});

var _user$project$ASTUtil_ASTWriter$writeInfix = function (_p0) {
	var _p1 = _p0;
	return _user$project$ASTUtil_Writer$spaced(
		{
			ctor: '::',
			_0: function () {
				var _p2 = _p1.direction;
				if (_p2.ctor === 'Left') {
					return _user$project$ASTUtil_Writer$string('infixl');
				} else {
					return _user$project$ASTUtil_Writer$string('infixr');
				}
			}(),
			_1: {
				ctor: '::',
				_0: _user$project$ASTUtil_Writer$string(
					_elm_lang$core$Basics$toString(_p1.precedence)),
				_1: {
					ctor: '::',
					_0: _user$project$ASTUtil_Writer$string(_p1.operator),
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$ASTUtil_ASTWriter$writeDocumentation = function (_p3) {
	return _user$project$ASTUtil_Writer$string(
		_elm_lang$core$Tuple$first(_p3));
};
var _user$project$ASTUtil_ASTWriter$writeExposureValueConstructor = function (x) {
	var _p4 = x;
	switch (_p4.ctor) {
		case 'None':
			return _user$project$ASTUtil_Writer$epsilon;
		case 'All':
			return _user$project$ASTUtil_Writer$string('(..)');
		default:
			return _user$project$ASTUtil_Writer$parensComma(
				A2(
					_elm_lang$core$List$map,
					function (_p5) {
						var _p6 = _p5;
						return {
							ctor: '_Tuple2',
							_0: _p6._1,
							_1: _user$project$ASTUtil_Writer$string(_p6._0)
						};
					},
					_p4._0));
	}
};
var _user$project$ASTUtil_ASTWriter$writeExpose = function (exp) {
	var _p7 = exp;
	switch (_p7.ctor) {
		case 'InfixExpose':
			return _user$project$ASTUtil_Writer$string(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'(',
					A2(_elm_lang$core$Basics_ops['++'], _p7._0, ')')));
		case 'FunctionExpose':
			return _user$project$ASTUtil_Writer$string(_p7._0);
		case 'TypeOrAliasExpose':
			return _user$project$ASTUtil_Writer$string(_p7._0);
		default:
			return _user$project$ASTUtil_Writer$spaced(
				{
					ctor: '::',
					_0: _user$project$ASTUtil_Writer$string(_p7._0.name),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_ASTWriter$writeExposureValueConstructor(_p7._0.constructors),
						_1: {ctor: '[]'}
					}
				});
	}
};
var _user$project$ASTUtil_ASTWriter$writeExposureExpose = function (x) {
	return _user$project$ASTUtil_Writer$spaced(
		{
			ctor: '::',
			_0: _user$project$ASTUtil_Writer$string('exposing'),
			_1: {
				ctor: '::',
				_0: function () {
					var _p8 = x;
					switch (_p8.ctor) {
						case 'None':
							return _user$project$ASTUtil_Writer$epsilon;
						case 'All':
							return _user$project$ASTUtil_Writer$string('(..)');
						default:
							return _user$project$ASTUtil_Writer$parensComma(
								A2(
									_elm_lang$core$List$map,
									function (item) {
										return {
											ctor: '_Tuple2',
											_0: _user$project$ASTUtil_Expose$range(item),
											_1: _user$project$ASTUtil_ASTWriter$writeExpose(item)
										};
									},
									_p8._0));
					}
				}(),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$ASTUtil_ASTWriter$writeModuleName = function (moduleName) {
	return _user$project$ASTUtil_Writer$string(
		A2(_elm_lang$core$String$join, '.', moduleName));
};
var _user$project$ASTUtil_ASTWriter$writeImport = function (_p9) {
	var _p10 = _p9;
	return _user$project$ASTUtil_Writer$spaced(
		{
			ctor: '::',
			_0: _user$project$ASTUtil_Writer$string('import'),
			_1: {
				ctor: '::',
				_0: _user$project$ASTUtil_ASTWriter$writeModuleName(_p10.moduleName),
				_1: {
					ctor: '::',
					_0: _user$project$ASTUtil_Writer$maybe(
						A2(
							_elm_lang$core$Maybe$map,
							function (_p11) {
								return function (x) {
									return _user$project$ASTUtil_Writer$spaced(
										{
											ctor: '::',
											_0: _user$project$ASTUtil_Writer$string('as'),
											_1: {
												ctor: '::',
												_0: x,
												_1: {ctor: '[]'}
											}
										});
								}(
									_user$project$ASTUtil_ASTWriter$writeModuleName(_p11));
							},
							_p10.moduleAlias)),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_ASTWriter$writeExposureExpose(_p10.exposingList),
						_1: {ctor: '[]'}
					}
				}
			}
		});
};
var _user$project$ASTUtil_ASTWriter$writeTypeReference = function (typeReference) {
	var _p12 = typeReference;
	switch (_p12.ctor) {
		case 'GenericType':
			return _user$project$ASTUtil_Writer$string(_p12._0);
		case 'Typed':
			return _user$project$ASTUtil_Writer$spaced(
				{
					ctor: '::',
					_0: _user$project$ASTUtil_Writer$join(
						{
							ctor: '::',
							_0: _user$project$ASTUtil_ASTWriter$writeModuleName(_p12._0),
							_1: {
								ctor: '::',
								_0: _user$project$ASTUtil_Writer$string(_p12._1),
								_1: {ctor: '[]'}
							}
						}),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$spaced(
							A2(_elm_lang$core$List$map, _user$project$ASTUtil_ASTWriter$writeTypeReference, _p12._2)),
						_1: {ctor: '[]'}
					}
				});
		case 'Unit':
			return _user$project$ASTUtil_Writer$string('()');
		case 'Tupled':
			return _user$project$ASTUtil_Writer$parensComma(
				A2(
					_elm_lang$core$List$map,
					function (x) {
						return {
							ctor: '_Tuple2',
							_0: _user$project$AST_Ranges$emptyRange,
							_1: _user$project$ASTUtil_ASTWriter$writeTypeReference(x)
						};
					},
					_p12._0));
		case 'Record':
			return _user$project$ASTUtil_Writer$bracesComma(
				A2(
					_elm_lang$core$List$map,
					function (x) {
						return {
							ctor: '_Tuple2',
							_0: _user$project$AST_Ranges$emptyRange,
							_1: _user$project$ASTUtil_ASTWriter$writeRecordField(x)
						};
					},
					_p12._0));
		case 'GenericRecord':
			return _user$project$ASTUtil_Writer$spaced(
				{
					ctor: '::',
					_0: _user$project$ASTUtil_Writer$string('{'),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$string(_p12._0),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_Writer$string('|'),
							_1: {
								ctor: '::',
								_0: _user$project$ASTUtil_Writer$sepByComma(
									A2(
										_elm_lang$core$List$map,
										function (x) {
											return {
												ctor: '_Tuple2',
												_0: _user$project$AST_Ranges$emptyRange,
												_1: _user$project$ASTUtil_ASTWriter$writeRecordField(x)
											};
										},
										_p12._1)),
								_1: {
									ctor: '::',
									_0: _user$project$ASTUtil_Writer$string('}'),
									_1: {ctor: '[]'}
								}
							}
						}
					}
				});
		default:
			return _user$project$ASTUtil_Writer$spaced(
				{
					ctor: '::',
					_0: _user$project$ASTUtil_ASTWriter$writeTypeReference(_p12._0),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$string('->'),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_ASTWriter$writeTypeReference(_p12._1),
							_1: {ctor: '[]'}
						}
					}
				});
	}
};
var _user$project$ASTUtil_ASTWriter$writeRecordField = function (_p13) {
	var _p14 = _p13;
	return _user$project$ASTUtil_Writer$spaced(
		{
			ctor: '::',
			_0: _user$project$ASTUtil_Writer$string(_p14._0),
			_1: {
				ctor: '::',
				_0: _user$project$ASTUtil_Writer$string(':'),
				_1: {
					ctor: '::',
					_0: _user$project$ASTUtil_ASTWriter$writeTypeReference(_p14._1),
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$ASTUtil_ASTWriter$writeSignature = function (signature) {
	return _user$project$ASTUtil_Writer$spaced(
		{
			ctor: '::',
			_0: signature.operatorDefinition ? _user$project$ASTUtil_Writer$string(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'(',
					A2(_elm_lang$core$Basics_ops['++'], signature.name, ')'))) : _user$project$ASTUtil_Writer$string(signature.name),
			_1: {
				ctor: '::',
				_0: _user$project$ASTUtil_Writer$string(':'),
				_1: {
					ctor: '::',
					_0: _user$project$ASTUtil_ASTWriter$writeTypeReference(signature.typeReference),
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$ASTUtil_ASTWriter$writePortDeclaration = function (signature) {
	return _user$project$ASTUtil_Writer$spaced(
		{
			ctor: '::',
			_0: _user$project$ASTUtil_Writer$string('port'),
			_1: {
				ctor: '::',
				_0: _user$project$ASTUtil_ASTWriter$writeSignature(signature),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$ASTUtil_ASTWriter$writeTypeAlias = function (typeAlias) {
	return _user$project$ASTUtil_Writer$breaked(
		{
			ctor: '::',
			_0: _user$project$ASTUtil_Writer$spaced(
				{
					ctor: '::',
					_0: _user$project$ASTUtil_Writer$string('type alias'),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$string(typeAlias.name),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_Writer$spaced(
								A2(_elm_lang$core$List$map, _user$project$ASTUtil_Writer$string, typeAlias.generics)),
							_1: {
								ctor: '::',
								_0: _user$project$ASTUtil_Writer$string('='),
								_1: {ctor: '[]'}
							}
						}
					}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_user$project$ASTUtil_Writer$indent,
					4,
					_user$project$ASTUtil_ASTWriter$writeTypeReference(typeAlias.typeReference)),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$ASTUtil_ASTWriter$writeValueConstructor = function (_p15) {
	var _p16 = _p15;
	return {
		ctor: '_Tuple2',
		_0: _p16.range,
		_1: _user$project$ASTUtil_Writer$spaced(
			{
				ctor: '::',
				_0: _user$project$ASTUtil_Writer$string(_p16.name),
				_1: {
					ctor: '::',
					_0: _user$project$ASTUtil_Writer$spaced(
						A2(_elm_lang$core$List$map, _user$project$ASTUtil_ASTWriter$writeTypeReference, _p16.$arguments)),
					_1: {ctor: '[]'}
				}
			})
	};
};
var _user$project$ASTUtil_ASTWriter$writeType = function (type_) {
	return _user$project$ASTUtil_Writer$breaked(
		{
			ctor: '::',
			_0: _user$project$ASTUtil_Writer$spaced(
				{
					ctor: '::',
					_0: _user$project$ASTUtil_Writer$string('type'),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$string(type_.name),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_Writer$spaced(
								A2(_elm_lang$core$List$map, _user$project$ASTUtil_Writer$string, type_.generics)),
							_1: {
								ctor: '::',
								_0: _user$project$ASTUtil_Writer$string('='),
								_1: {ctor: '[]'}
							}
						}
					}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_user$project$ASTUtil_Writer$sepBy,
					{ctor: '_Tuple3', _0: '=', _1: '|', _2: ''},
					A2(_elm_lang$core$List$map, _user$project$ASTUtil_ASTWriter$writeValueConstructor, type_.constructors)),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$ASTUtil_ASTWriter$writeQualifiedNameRef = function (_p17) {
	var _p18 = _p17;
	var _p21 = _p18.name;
	var _p20 = _p18.moduleName;
	var _p19 = _p20;
	if (_p19.ctor === '[]') {
		return _user$project$ASTUtil_Writer$string(_p21);
	} else {
		return _user$project$ASTUtil_Writer$join(
			{
				ctor: '::',
				_0: _user$project$ASTUtil_ASTWriter$writeModuleName(_p20),
				_1: {
					ctor: '::',
					_0: _user$project$ASTUtil_Writer$string('.'),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$string(_p21),
						_1: {ctor: '[]'}
					}
				}
			});
	}
};
var _user$project$ASTUtil_ASTWriter$writePattern = function (p) {
	var _p22 = p;
	switch (_p22.ctor) {
		case 'AllPattern':
			return _user$project$ASTUtil_Writer$string('_');
		case 'UnitPattern':
			return _user$project$ASTUtil_Writer$string('()');
		case 'CharPattern':
			return _user$project$ASTUtil_Writer$string(
				_elm_lang$core$Basics$toString(_p22._0));
		case 'StringPattern':
			return _user$project$ASTUtil_Writer$string(_p22._0);
		case 'IntPattern':
			return _user$project$ASTUtil_Writer$string(
				_elm_lang$core$Basics$toString(_p22._0));
		case 'FloatPattern':
			return _user$project$ASTUtil_Writer$string(
				_elm_lang$core$Basics$toString(_p22._0));
		case 'TuplePattern':
			return _user$project$ASTUtil_Writer$parensComma(
				A2(
					_elm_lang$core$List$map,
					function (_p23) {
						return A2(
							F2(
								function (v0, v1) {
									return {ctor: '_Tuple2', _0: v0, _1: v1};
								}),
							_user$project$AST_Ranges$emptyRange,
							_user$project$ASTUtil_ASTWriter$writePattern(_p23));
					},
					_p22._0));
		case 'RecordPattern':
			return _user$project$ASTUtil_Writer$bracesComma(
				A2(
					_elm_lang$core$List$map,
					function (_p24) {
						return A2(
							F2(
								function (v0, v1) {
									return {ctor: '_Tuple2', _0: v0, _1: v1};
								}),
							_user$project$AST_Ranges$emptyRange,
							_user$project$ASTUtil_Writer$string(
								function (_) {
									return _.value;
								}(_p24)));
					},
					_p22._0));
		case 'UnConsPattern':
			return _user$project$ASTUtil_Writer$spaced(
				{
					ctor: '::',
					_0: _user$project$ASTUtil_ASTWriter$writePattern(_p22._0),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$string('::'),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_ASTWriter$writePattern(_p22._1),
							_1: {ctor: '[]'}
						}
					}
				});
		case 'ListPattern':
			return _user$project$ASTUtil_Writer$bracketsComma(
				A2(
					_elm_lang$core$List$map,
					function (_p25) {
						return A2(
							F2(
								function (v0, v1) {
									return {ctor: '_Tuple2', _0: v0, _1: v1};
								}),
							_user$project$AST_Ranges$emptyRange,
							_user$project$ASTUtil_ASTWriter$writePattern(_p25));
					},
					_p22._0));
		case 'VarPattern':
			return _user$project$ASTUtil_Writer$string(_p22._0);
		case 'NamedPattern':
			return _user$project$ASTUtil_Writer$spaced(
				{
					ctor: '::',
					_0: _user$project$ASTUtil_ASTWriter$writeQualifiedNameRef(_p22._0),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$spaced(
							A2(_elm_lang$core$List$map, _user$project$ASTUtil_ASTWriter$writePattern, _p22._1)),
						_1: {ctor: '[]'}
					}
				});
		case 'QualifiedNamePattern':
			return _user$project$ASTUtil_ASTWriter$writeQualifiedNameRef(_p22._0);
		case 'AsPattern':
			return _user$project$ASTUtil_Writer$spaced(
				{
					ctor: '::',
					_0: _user$project$ASTUtil_ASTWriter$writePattern(_p22._0),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$string('as'),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_Writer$string(_p22._1.value),
							_1: {ctor: '[]'}
						}
					}
				});
		default:
			return _user$project$ASTUtil_Writer$spaced(
				{
					ctor: '::',
					_0: _user$project$ASTUtil_Writer$string('('),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_ASTWriter$writePattern(_p22._0),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_Writer$string(')'),
							_1: {ctor: '[]'}
						}
					}
				});
	}
};
var _user$project$ASTUtil_ASTWriter$writeExpression = function (_p26) {
	writeExpression:
	while (true) {
		var _p27 = _p26;
		var writeRecordSetter = function (_p28) {
			var _p29 = _p28;
			var _p30 = _p29._1;
			return {
				ctor: '_Tuple2',
				_0: _elm_lang$core$Tuple$first(_p30),
				_1: _user$project$ASTUtil_Writer$spaced(
					{
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$string(_p29._0),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_Writer$string('='),
							_1: {
								ctor: '::',
								_0: _user$project$ASTUtil_ASTWriter$writeExpression(_p30),
								_1: {ctor: '[]'}
							}
						}
					})
			};
		};
		var recurRangeHelper = function (_p31) {
			var _p32 = _p31;
			var _p33 = _p32._0;
			return {
				ctor: '_Tuple2',
				_0: _p33,
				_1: _user$project$ASTUtil_ASTWriter$writeExpression(
					{ctor: '_Tuple2', _0: _p33, _1: _p32._1})
			};
		};
		var _p34 = _p27._1;
		switch (_p34.ctor) {
			case 'UnitExpr':
				return _user$project$ASTUtil_Writer$string('()');
			case 'Application':
				var _p35 = _p34._0;
				if (_p35.ctor === '[]') {
					return _user$project$ASTUtil_Writer$epsilon;
				} else {
					if (_p35._1.ctor === '[]') {
						var _v18 = _p35._0;
						_p26 = _v18;
						continue writeExpression;
					} else {
						return _user$project$ASTUtil_Writer$spaced(
							{
								ctor: '::',
								_0: _user$project$ASTUtil_ASTWriter$writeExpression(_p35._0),
								_1: {
									ctor: '::',
									_0: _user$project$ASTUtil_Writer$sepBySpace(
										A2(_elm_lang$core$List$map, recurRangeHelper, _p35._1)),
									_1: {ctor: '[]'}
								}
							});
					}
				}
			case 'OperatorApplication':
				var _p39 = _p34._0;
				var _p38 = _p34._3;
				var _p37 = _p34._2;
				var _p36 = _p34._1;
				if (_p36.ctor === 'Left') {
					return _user$project$ASTUtil_Writer$sepBySpace(
						{
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Tuple$first(_p37),
								_1: _user$project$ASTUtil_ASTWriter$writeExpression(_p37)
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: _p27._0,
									_1: _user$project$ASTUtil_Writer$spaced(
										{
											ctor: '::',
											_0: _user$project$ASTUtil_Writer$string(_p39),
											_1: {
												ctor: '::',
												_0: _user$project$ASTUtil_ASTWriter$writeExpression(_p38),
												_1: {ctor: '[]'}
											}
										})
								},
								_1: {ctor: '[]'}
							}
						});
				} else {
					return _user$project$ASTUtil_Writer$sepBySpace(
						{
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Tuple$first(_p37),
								_1: _user$project$ASTUtil_Writer$spaced(
									{
										ctor: '::',
										_0: _user$project$ASTUtil_ASTWriter$writeExpression(_p37),
										_1: {
											ctor: '::',
											_0: _user$project$ASTUtil_Writer$string(_p39),
											_1: {ctor: '[]'}
										}
									})
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Tuple$first(_p38),
									_1: _user$project$ASTUtil_ASTWriter$writeExpression(_p38)
								},
								_1: {ctor: '[]'}
							}
						});
				}
			case 'FunctionOrValue':
				return _user$project$ASTUtil_Writer$string(_p34._0);
			case 'IfBlock':
				return _user$project$ASTUtil_Writer$breaked(
					{
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$spaced(
							{
								ctor: '::',
								_0: _user$project$ASTUtil_Writer$string('if'),
								_1: {
									ctor: '::',
									_0: _user$project$ASTUtil_ASTWriter$writeExpression(_p34._0),
									_1: {
										ctor: '::',
										_0: _user$project$ASTUtil_Writer$string('then'),
										_1: {ctor: '[]'}
									}
								}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_user$project$ASTUtil_Writer$indent,
								2,
								_user$project$ASTUtil_ASTWriter$writeExpression(_p34._1)),
							_1: {
								ctor: '::',
								_0: _user$project$ASTUtil_Writer$string('else'),
								_1: {
									ctor: '::',
									_0: A2(
										_user$project$ASTUtil_Writer$indent,
										2,
										_user$project$ASTUtil_ASTWriter$writeExpression(_p34._2)),
									_1: {ctor: '[]'}
								}
							}
						}
					});
			case 'PrefixOperator':
				return _user$project$ASTUtil_Writer$string(
					A2(
						_elm_lang$core$Basics_ops['++'],
						'(',
						A2(_elm_lang$core$Basics_ops['++'], _p34._0, ')')));
			case 'Operator':
				return _user$project$ASTUtil_Writer$string(_p34._0);
			case 'Integer':
				return _user$project$ASTUtil_Writer$string(
					_elm_lang$core$Basics$toString(_p34._0));
			case 'Floatable':
				return _user$project$ASTUtil_Writer$string(
					_elm_lang$core$Basics$toString(_p34._0));
			case 'Negation':
				return A2(
					_user$project$ASTUtil_Writer$append,
					_user$project$ASTUtil_Writer$string('-'),
					_user$project$ASTUtil_ASTWriter$writeExpression(_p34._0));
			case 'Literal':
				return _user$project$ASTUtil_Writer$string(
					_elm_lang$core$Basics$toString(_p34._0));
			case 'CharLiteral':
				return _user$project$ASTUtil_Writer$string(
					_elm_lang$core$Basics$toString(_p34._0));
			case 'TupledExpression':
				return _user$project$ASTUtil_Writer$sepByComma(
					A2(_elm_lang$core$List$map, recurRangeHelper, _p34._0));
			case 'ParenthesizedExpression':
				return _user$project$ASTUtil_Writer$join(
					{
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$string('('),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_ASTWriter$writeExpression(_p34._0),
							_1: {
								ctor: '::',
								_0: _user$project$ASTUtil_Writer$string(')'),
								_1: {ctor: '[]'}
							}
						}
					});
			case 'LetExpression':
				var _p40 = _p34._0;
				return _user$project$ASTUtil_Writer$breaked(
					{
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$string('let'),
						_1: {
							ctor: '::',
							_0: A2(
								_user$project$ASTUtil_Writer$indent,
								2,
								_user$project$ASTUtil_Writer$breaked(
									A2(_elm_lang$core$List$map, _user$project$ASTUtil_ASTWriter$writeDeclaration, _p40.declarations))),
							_1: {
								ctor: '::',
								_0: _user$project$ASTUtil_Writer$string('in'),
								_1: {
									ctor: '::',
									_0: A2(
										_user$project$ASTUtil_Writer$indent,
										2,
										_user$project$ASTUtil_ASTWriter$writeExpression(_p40.expression)),
									_1: {ctor: '[]'}
								}
							}
						}
					});
			case 'CaseExpression':
				var _p43 = _p34._0;
				var writeCaseBranch = function (_p41) {
					var _p42 = _p41;
					return _user$project$ASTUtil_Writer$breaked(
						{
							ctor: '::',
							_0: _user$project$ASTUtil_Writer$spaced(
								{
									ctor: '::',
									_0: _user$project$ASTUtil_ASTWriter$writePattern(_p42._0),
									_1: {
										ctor: '::',
										_0: _user$project$ASTUtil_Writer$string('->'),
										_1: {ctor: '[]'}
									}
								}),
							_1: {
								ctor: '::',
								_0: A2(
									_user$project$ASTUtil_Writer$indent,
									2,
									_user$project$ASTUtil_ASTWriter$writeExpression(_p42._1)),
								_1: {ctor: '[]'}
							}
						});
				};
				return _user$project$ASTUtil_Writer$breaked(
					{
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$spaced(
							{
								ctor: '::',
								_0: _user$project$ASTUtil_Writer$string('case'),
								_1: {
									ctor: '::',
									_0: _user$project$ASTUtil_ASTWriter$writeExpression(_p43.expression),
									_1: {
										ctor: '::',
										_0: _user$project$ASTUtil_Writer$string('of'),
										_1: {ctor: '[]'}
									}
								}
							}),
						_1: {
							ctor: '::',
							_0: A2(
								_user$project$ASTUtil_Writer$indent,
								2,
								_user$project$ASTUtil_Writer$breaked(
									A2(_elm_lang$core$List$map, writeCaseBranch, _p43.cases))),
							_1: {ctor: '[]'}
						}
					});
			case 'LambdaExpression':
				var _p44 = _p34._0;
				return _user$project$ASTUtil_Writer$spaced(
					{
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$join(
							{
								ctor: '::',
								_0: _user$project$ASTUtil_Writer$string('\\'),
								_1: {
									ctor: '::',
									_0: _user$project$ASTUtil_Writer$spaced(
										A2(_elm_lang$core$List$map, _user$project$ASTUtil_ASTWriter$writePattern, _p44.args)),
									_1: {ctor: '[]'}
								}
							}),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_Writer$string('->'),
							_1: {
								ctor: '::',
								_0: _user$project$ASTUtil_ASTWriter$writeExpression(_p44.expression),
								_1: {ctor: '[]'}
							}
						}
					});
			case 'RecordExpr':
				return _user$project$ASTUtil_Writer$bracesComma(
					A2(_elm_lang$core$List$map, writeRecordSetter, _p34._0));
			case 'ListExpr':
				return _user$project$ASTUtil_Writer$bracketsComma(
					A2(_elm_lang$core$List$map, recurRangeHelper, _p34._0));
			case 'QualifiedExpr':
				return _user$project$ASTUtil_Writer$join(
					{
						ctor: '::',
						_0: _user$project$ASTUtil_ASTWriter$writeModuleName(_p34._0),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_Writer$string(_p34._1),
							_1: {ctor: '[]'}
						}
					});
			case 'RecordAccess':
				return _user$project$ASTUtil_Writer$join(
					{
						ctor: '::',
						_0: _user$project$ASTUtil_ASTWriter$writeExpression(_p34._0),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_Writer$string('.'),
							_1: {
								ctor: '::',
								_0: _user$project$ASTUtil_Writer$string(_p34._1),
								_1: {ctor: '[]'}
							}
						}
					});
			case 'RecordAccessFunction':
				return _user$project$ASTUtil_Writer$join(
					{
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$string('.'),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_Writer$string(_p34._0),
							_1: {ctor: '[]'}
						}
					});
			case 'RecordUpdateExpression':
				return _user$project$ASTUtil_Writer$spaced(
					{
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$string('{'),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_Writer$string(_p34._0.name),
							_1: {
								ctor: '::',
								_0: _user$project$ASTUtil_Writer$string('|'),
								_1: {
									ctor: '::',
									_0: _user$project$ASTUtil_Writer$sepByComma(
										A2(_elm_lang$core$List$map, writeRecordSetter, _p34._0.updates)),
									_1: {
										ctor: '::',
										_0: _user$project$ASTUtil_Writer$string('}'),
										_1: {ctor: '[]'}
									}
								}
							}
						}
					});
			default:
				return _user$project$ASTUtil_Writer$join(
					{
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$string('[glsl|'),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_Writer$string(_p34._0),
							_1: {
								ctor: '::',
								_0: _user$project$ASTUtil_Writer$string('|]'),
								_1: {ctor: '[]'}
							}
						}
					});
		}
	}
};
var _user$project$ASTUtil_ASTWriter$writeDeclaration = function (decl) {
	var _p45 = decl;
	switch (_p45.ctor) {
		case 'FuncDecl':
			return _user$project$ASTUtil_ASTWriter$writeFunction(_p45._0);
		case 'AliasDecl':
			return _user$project$ASTUtil_ASTWriter$writeTypeAlias(_p45._0);
		case 'TypeDecl':
			return _user$project$ASTUtil_ASTWriter$writeType(_p45._0);
		case 'PortDeclaration':
			return _user$project$ASTUtil_ASTWriter$writePortDeclaration(_p45._0);
		case 'InfixDeclaration':
			return _user$project$ASTUtil_ASTWriter$writeInfix(_p45._0);
		default:
			return _user$project$ASTUtil_ASTWriter$writeDestructuring(_p45._0);
	}
};
var _user$project$ASTUtil_ASTWriter$writeDestructuring = function (_p46) {
	var _p47 = _p46;
	return _user$project$ASTUtil_Writer$breaked(
		{
			ctor: '::',
			_0: _user$project$ASTUtil_Writer$spaced(
				{
					ctor: '::',
					_0: _user$project$ASTUtil_ASTWriter$writePattern(_p47.pattern),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$string('='),
						_1: {ctor: '[]'}
					}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_user$project$ASTUtil_Writer$indent,
					4,
					_user$project$ASTUtil_ASTWriter$writeExpression(_p47.expression)),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$ASTUtil_ASTWriter$writeFunction = function (_p48) {
	var _p49 = _p48;
	return _user$project$ASTUtil_Writer$breaked(
		{
			ctor: '::',
			_0: _user$project$ASTUtil_Writer$maybe(
				A2(_elm_lang$core$Maybe$map, _user$project$ASTUtil_ASTWriter$writeDocumentation, _p49.documentation)),
			_1: {
				ctor: '::',
				_0: _user$project$ASTUtil_Writer$maybe(
					A2(_elm_lang$core$Maybe$map, _user$project$ASTUtil_ASTWriter$writeSignature, _p49.signature)),
				_1: {
					ctor: '::',
					_0: _user$project$ASTUtil_ASTWriter$writeFunctionDeclaration(_p49.declaration),
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$ASTUtil_ASTWriter$writeFunctionDeclaration = function (declaration) {
	return _user$project$ASTUtil_Writer$breaked(
		{
			ctor: '::',
			_0: _user$project$ASTUtil_Writer$spaced(
				{
					ctor: '::',
					_0: declaration.operatorDefinition ? _user$project$ASTUtil_Writer$string(
						A2(
							_elm_lang$core$Basics_ops['++'],
							'(',
							A2(_elm_lang$core$Basics_ops['++'], declaration.name.value, ')'))) : _user$project$ASTUtil_Writer$string(declaration.name.value),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$spaced(
							A2(_elm_lang$core$List$map, _user$project$ASTUtil_ASTWriter$writePattern, declaration.$arguments)),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_Writer$string('='),
							_1: {ctor: '[]'}
						}
					}
				}),
			_1: {
				ctor: '::',
				_0: A2(
					_user$project$ASTUtil_Writer$indent,
					4,
					_user$project$ASTUtil_ASTWriter$writeExpression(declaration.expression)),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$ASTUtil_ASTWriter$writeWhere = function (input) {
	var _p50 = input;
	if (_p50._0.ctor === 'Nothing') {
		if (_p50._1.ctor === 'Nothing') {
			return _user$project$ASTUtil_Writer$epsilon;
		} else {
			return _user$project$ASTUtil_Writer$spaced(
				{
					ctor: '::',
					_0: _user$project$ASTUtil_Writer$string('where { subscription ='),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$string(_p50._1._0),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_Writer$string('}'),
							_1: {ctor: '[]'}
						}
					}
				});
		}
	} else {
		if (_p50._1.ctor === 'Nothing') {
			return _user$project$ASTUtil_Writer$spaced(
				{
					ctor: '::',
					_0: _user$project$ASTUtil_Writer$string('where { command ='),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$string(_p50._0._0),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_Writer$string('}'),
							_1: {ctor: '[]'}
						}
					}
				});
		} else {
			return _user$project$ASTUtil_Writer$spaced(
				{
					ctor: '::',
					_0: _user$project$ASTUtil_Writer$string('where { command ='),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_Writer$string(_p50._0._0),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_Writer$string(', subscription ='),
							_1: {
								ctor: '::',
								_0: _user$project$ASTUtil_Writer$string(_p50._1._0),
								_1: {
									ctor: '::',
									_0: _user$project$ASTUtil_Writer$string('}'),
									_1: {ctor: '[]'}
								}
							}
						}
					}
				});
		}
	}
};
var _user$project$ASTUtil_ASTWriter$writeEffectModuleData = function (_p51) {
	var _p52 = _p51;
	return _user$project$ASTUtil_Writer$spaced(
		{
			ctor: '::',
			_0: _user$project$ASTUtil_Writer$string('effect'),
			_1: {
				ctor: '::',
				_0: _user$project$ASTUtil_Writer$string('module'),
				_1: {
					ctor: '::',
					_0: _user$project$ASTUtil_ASTWriter$writeModuleName(_p52.moduleName),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_ASTWriter$writeWhere(
							{ctor: '_Tuple2', _0: _p52.command, _1: _p52.subscription}),
						_1: {
							ctor: '::',
							_0: _user$project$ASTUtil_ASTWriter$writeExposureExpose(_p52.exposingList),
							_1: {ctor: '[]'}
						}
					}
				}
			}
		});
};
var _user$project$ASTUtil_ASTWriter$writeDefaultModuleData = function (_p53) {
	var _p54 = _p53;
	return _user$project$ASTUtil_Writer$spaced(
		{
			ctor: '::',
			_0: _user$project$ASTUtil_Writer$string('module'),
			_1: {
				ctor: '::',
				_0: _user$project$ASTUtil_ASTWriter$writeModuleName(_p54.moduleName),
				_1: {
					ctor: '::',
					_0: _user$project$ASTUtil_ASTWriter$writeExposureExpose(_p54.exposingList),
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$ASTUtil_ASTWriter$writeModule = function (m) {
	var _p55 = m;
	switch (_p55.ctor) {
		case 'NormalModule':
			return _user$project$ASTUtil_ASTWriter$writeDefaultModuleData(_p55._0);
		case 'PortModule':
			return _user$project$ASTUtil_Writer$spaced(
				{
					ctor: '::',
					_0: _user$project$ASTUtil_Writer$string('port'),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_ASTWriter$writeDefaultModuleData(_p55._0),
						_1: {ctor: '[]'}
					}
				});
		case 'EffectModule':
			return _user$project$ASTUtil_ASTWriter$writeEffectModuleData(_p55._0);
		default:
			return _user$project$ASTUtil_Writer$epsilon;
	}
};
var _user$project$ASTUtil_ASTWriter$writeFile = function (file) {
	return _user$project$ASTUtil_Writer$breaked(
		{
			ctor: '::',
			_0: _user$project$ASTUtil_ASTWriter$writeModule(file.moduleDefinition),
			_1: {
				ctor: '::',
				_0: _user$project$ASTUtil_Writer$breaked(
					A2(_elm_lang$core$List$map, _user$project$ASTUtil_ASTWriter$writeImport, file.imports)),
				_1: {
					ctor: '::',
					_0: _user$project$ASTUtil_Writer$breaked(
						A2(_elm_lang$core$List$map, _user$project$ASTUtil_ASTWriter$writeDeclaration, file.declarations)),
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$ASTUtil_ASTWriter$write = _user$project$ASTUtil_Writer$write;

var _user$project$ASTUtil_Functions$isFunctionTypeReference = function (typeReference) {
	var _p0 = typeReference;
	if (_p0.ctor === 'FunctionTypeReference') {
		return true;
	} else {
		return false;
	}
};
var _user$project$ASTUtil_Functions$isFunctionSignature = function (_p1) {
	var _p2 = _p1;
	return _user$project$ASTUtil_Functions$isFunctionTypeReference(_p2.typeReference);
};
var _user$project$ASTUtil_Functions$isStatic = function ($function) {
	return (_elm_lang$core$Native_Utils.cmp(
		_elm_lang$core$List$length($function.declaration.$arguments),
		0) > 0) ? false : ($function.declaration.operatorDefinition ? false : (A2(
		_elm_lang$core$Maybe$withDefault,
		false,
		A2(_elm_lang$core$Maybe$map, _user$project$ASTUtil_Functions$isFunctionSignature, $function.signature)) ? false : true));
};

var _user$project$ASTUtil_Imports$removeRangeFromConstructors = F2(
	function (range, exp) {
		var _p0 = exp;
		switch (_p0.ctor) {
			case 'None':
				return _user$project$AST_Types$None;
			case 'All':
				var _p1 = _p0._0;
				return _elm_lang$core$Native_Utils.eq(_p1, range) ? _user$project$AST_Types$None : _user$project$AST_Types$All(_p1);
			default:
				var _p3 = A2(
					_elm_lang$core$List$filter,
					function (_p2) {
						return A2(
							F2(
								function (x, y) {
									return !_elm_lang$core$Native_Utils.eq(x, y);
								}),
							range,
							_elm_lang$core$Tuple$second(_p2));
					},
					_p0._0);
				if (_p3.ctor === '[]') {
					return _user$project$AST_Types$None;
				} else {
					return _user$project$AST_Types$Explicit(_p3);
				}
		}
	});
var _user$project$ASTUtil_Imports$removeRangeFromExpose = F2(
	function (range, expose) {
		var _p4 = expose;
		switch (_p4.ctor) {
			case 'InfixExpose':
				var _p5 = _p4._1;
				return _elm_lang$core$Native_Utils.eq(_p5, range) ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$Maybe$Just(
					A2(_user$project$AST_Types$InfixExpose, _p4._0, _p5));
			case 'FunctionExpose':
				var _p6 = _p4._1;
				return _elm_lang$core$Native_Utils.eq(_p6, range) ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$Maybe$Just(
					A2(_user$project$AST_Types$FunctionExpose, _p4._0, _p6));
			case 'TypeOrAliasExpose':
				var _p7 = _p4._1;
				return _elm_lang$core$Native_Utils.eq(_p7, range) ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$Maybe$Just(
					A2(_user$project$AST_Types$TypeOrAliasExpose, _p4._0, _p7));
			default:
				var _p8 = _p4._0;
				return _elm_lang$core$Maybe$Just(
					_user$project$AST_Types$TypeExpose(
						_elm_lang$core$Native_Utils.update(
							_p8,
							{
								constructors: A2(_user$project$ASTUtil_Imports$removeRangeFromConstructors, range, _p8.constructors)
							})));
		}
	});
var _user$project$ASTUtil_Imports$removeRangeFromExposingList = F2(
	function (range, exp) {
		var _p9 = exp;
		switch (_p9.ctor) {
			case 'None':
				return _user$project$AST_Types$None;
			case 'All':
				var _p10 = _p9._0;
				return _elm_lang$core$Native_Utils.eq(_p10, range) ? _user$project$AST_Types$None : _user$project$AST_Types$All(_p10);
			default:
				var _p11 = A2(
					_elm_lang$core$List$filterMap,
					_user$project$ASTUtil_Imports$removeRangeFromExpose(range),
					_p9._0);
				if (_p11.ctor === '[]') {
					return _user$project$AST_Types$None;
				} else {
					return _user$project$AST_Types$Explicit(_p11);
				}
		}
	});
var _user$project$ASTUtil_Imports$removeRangeFromImport = F2(
	function (range, imp) {
		return _elm_lang$core$Native_Utils.update(
			imp,
			{
				exposingList: A2(_user$project$ASTUtil_Imports$removeRangeFromExposingList, range, imp.exposingList)
			});
	});
var _user$project$ASTUtil_Imports$stringifyExposedType = function (_p12) {
	var _p13 = _p12;
	return A2(
		_elm_lang$core$Basics_ops['++'],
		_p13.name,
		function () {
			var _p14 = _p13.constructors;
			switch (_p14.ctor) {
				case 'None':
					return '';
				case 'All':
					return '(..)';
				default:
					var _p16 = _p14._0;
					var _p15 = _p16;
					if (_p15.ctor === '[]') {
						return '';
					} else {
						var areOnDifferentLines = false;
						var seperator = areOnDifferentLines ? '\n    , ' : ', ';
						return A2(
							_elm_lang$core$Basics_ops['++'],
							'(',
							A2(
								_elm_lang$core$Basics_ops['++'],
								A2(
									_elm_lang$core$String$join,
									seperator,
									A2(_elm_lang$core$List$map, _elm_lang$core$Tuple$first, _p16)),
								')'));
					}
			}
		}());
};
var _user$project$ASTUtil_Imports$stringifyExpose = function (expose) {
	var _p17 = expose;
	switch (_p17.ctor) {
		case 'InfixExpose':
			return A2(
				_elm_lang$core$Basics_ops['++'],
				'(',
				A2(_elm_lang$core$Basics_ops['++'], _p17._0, ')'));
		case 'FunctionExpose':
			return _p17._0;
		case 'TypeOrAliasExpose':
			return _p17._0;
		default:
			return _user$project$ASTUtil_Imports$stringifyExposedType(_p17._0);
	}
};
var _user$project$ASTUtil_Imports$stringifyExposingList = function (exp) {
	var _p18 = exp;
	switch (_p18.ctor) {
		case 'None':
			return '';
		case 'All':
			return ' exposing (..)';
		default:
			var _p20 = _p18._0;
			return A2(
				_elm_lang$core$Basics_ops['++'],
				' exposing ',
				function () {
					var _p19 = _p20;
					if (_p19.ctor === '[]') {
						return '';
					} else {
						var areOnDifferentLines = false;
						var seperator = areOnDifferentLines ? '\n    , ' : ', ';
						return A2(
							_elm_lang$core$Basics_ops['++'],
							'(',
							A2(
								_elm_lang$core$Basics_ops['++'],
								A2(
									_elm_lang$core$String$join,
									seperator,
									A2(_elm_lang$core$List$map, _user$project$ASTUtil_Imports$stringifyExpose, _p20)),
								')'));
					}
				}());
	}
};
var _user$project$ASTUtil_Imports$naiveStringifyImport = function (imp) {
	return _elm_lang$core$String$concat(
		{
			ctor: '::',
			_0: 'import ',
			_1: {
				ctor: '::',
				_0: A2(_elm_lang$core$String$join, '.', imp.moduleName),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$core$Maybe$withDefault,
						'',
						A2(
							_elm_lang$core$Maybe$map,
							function (_p21) {
								return A2(
									F2(
										function (x, y) {
											return A2(_elm_lang$core$Basics_ops['++'], x, y);
										}),
									' as ',
									A2(_elm_lang$core$String$join, '.', _p21));
							},
							imp.moduleAlias)),
					_1: {
						ctor: '::',
						_0: _user$project$ASTUtil_Imports$stringifyExposingList(imp.exposingList),
						_1: {ctor: '[]'}
					}
				}
			}
		});
};
var _user$project$ASTUtil_Imports$buildImportInformation = F3(
	function (moduleName, $function, file) {
		return A2(
			_elm_lang$core$Maybe$map,
			function (i) {
				return {
					moduleName: A2(_elm_lang$core$Maybe$withDefault, i.moduleName, i.moduleAlias),
					exposesRegex: A2(_user$project$ASTUtil_Expose$exposesFunction, $function, i.exposingList)
				};
			},
			_elm_lang$core$List$head(
				A2(
					_elm_lang$core$List$filter,
					function (i) {
						return _elm_lang$core$Native_Utils.eq(i.moduleName, moduleName);
					},
					file.imports)));
	});
var _user$project$ASTUtil_Imports$findImportWithRange = F2(
	function (ast, range) {
		return _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$filter,
				function (_p22) {
					return A2(
						_user$project$AST_Ranges$containsRange,
						range,
						function (_) {
							return _.range;
						}(_p22));
				},
				ast.imports));
	});
var _user$project$ASTUtil_Imports$FunctionReference = F2(
	function (a, b) {
		return {moduleName: a, exposesRegex: b};
	});

var _user$project$ASTUtil_PatternOptimizer$patternRange = function (p) {
	var _p0 = p;
	switch (_p0.ctor) {
		case 'VarPattern':
			return _p0._1;
		case 'AllPattern':
			return _p0._0;
		case 'UnitPattern':
			return _p0._0;
		case 'CharPattern':
			return _p0._1;
		case 'StringPattern':
			return _p0._1;
		case 'IntPattern':
			return _p0._1;
		case 'FloatPattern':
			return _p0._1;
		case 'TuplePattern':
			return _p0._1;
		case 'RecordPattern':
			return _p0._1;
		case 'UnConsPattern':
			return _p0._2;
		case 'ListPattern':
			return _p0._1;
		case 'NamedPattern':
			return _p0._2;
		case 'QualifiedNamePattern':
			return _p0._1;
		case 'AsPattern':
			return _p0._2;
		default:
			return _p0._1;
	}
};
var _user$project$ASTUtil_PatternOptimizer$isAllPattern = function (p) {
	var _p1 = p;
	if (_p1.ctor === 'AllPattern') {
		return true;
	} else {
		return false;
	}
};
var _user$project$ASTUtil_PatternOptimizer$emptyRange = {
	start: {row: 0, column: 0},
	end: {row: 0, column: 0}
};
var _user$project$ASTUtil_PatternOptimizer$replaceWithAllIfRangeMatches = F3(
	function (p, x, y) {
		return _elm_lang$core$Native_Utils.eq(x, y) ? _user$project$AST_Types$AllPattern(_user$project$ASTUtil_PatternOptimizer$emptyRange) : p;
	});
var _user$project$ASTUtil_PatternOptimizer$optimize = F2(
	function (range, pattern) {
		if (_elm_lang$core$Native_Utils.eq(
			_user$project$ASTUtil_PatternOptimizer$patternRange(pattern),
			range)) {
			return _user$project$AST_Types$AllPattern(_user$project$ASTUtil_PatternOptimizer$emptyRange);
		} else {
			var _p2 = pattern;
			switch (_p2.ctor) {
				case 'TuplePattern':
					var cleaned = A2(
						_elm_lang$core$List$map,
						_user$project$ASTUtil_PatternOptimizer$optimize(range),
						_p2._0);
					return A2(_elm_lang$core$List$all, _user$project$ASTUtil_PatternOptimizer$isAllPattern, cleaned) ? _user$project$AST_Types$AllPattern(_user$project$ASTUtil_PatternOptimizer$emptyRange) : A2(_user$project$AST_Types$TuplePattern, cleaned, _p2._1);
				case 'RecordPattern':
					var cleaned = A2(
						_elm_lang$core$List$filter,
						function (_p3) {
							return A2(
								F2(
									function (x, y) {
										return !_elm_lang$core$Native_Utils.eq(x, y);
									}),
								range,
								function (_) {
									return _.range;
								}(_p3));
						},
						_p2._0);
					var _p4 = cleaned;
					if (_p4.ctor === '[]') {
						return _user$project$AST_Types$AllPattern(_user$project$ASTUtil_PatternOptimizer$emptyRange);
					} else {
						return A2(_user$project$AST_Types$RecordPattern, _p4, _p2._1);
					}
				case 'UnConsPattern':
					return A3(
						_user$project$AST_Types$UnConsPattern,
						A2(_user$project$ASTUtil_PatternOptimizer$optimize, range, _p2._0),
						A2(_user$project$ASTUtil_PatternOptimizer$optimize, range, _p2._1),
						_p2._2);
				case 'ListPattern':
					return A2(
						_user$project$AST_Types$ListPattern,
						A2(
							_elm_lang$core$List$map,
							_user$project$ASTUtil_PatternOptimizer$optimize(range),
							_p2._0),
						_p2._1);
				case 'NamedPattern':
					return A3(
						_user$project$AST_Types$NamedPattern,
						_p2._0,
						A2(
							_elm_lang$core$List$map,
							_user$project$ASTUtil_PatternOptimizer$optimize(range),
							_p2._1),
						_p2._2);
				case 'QualifiedNamePattern':
					return A3(_user$project$ASTUtil_PatternOptimizer$replaceWithAllIfRangeMatches, pattern, range, _p2._1);
				case 'AsPattern':
					var _p7 = _p2._0;
					var _p6 = _p2._1;
					if (_elm_lang$core$Native_Utils.eq(_p6.range, range)) {
						return _p7;
					} else {
						var _p5 = A2(_user$project$ASTUtil_PatternOptimizer$optimize, range, _p7);
						if (_p5.ctor === 'AllPattern') {
							return A2(_user$project$AST_Types$VarPattern, _p6.value, _p6.range);
						} else {
							return A3(_user$project$AST_Types$AsPattern, _p5, _p6, _p2._2);
						}
					}
				case 'ParenthesizedPattern':
					return A2(
						_user$project$AST_Types$ParenthesizedPattern,
						A2(_user$project$ASTUtil_PatternOptimizer$optimize, range, _p2._0),
						_p2._1);
				case 'VarPattern':
					return pattern;
				case 'AllPattern':
					return pattern;
				case 'UnitPattern':
					return pattern;
				case 'CharPattern':
					return pattern;
				case 'StringPattern':
					return pattern;
				case 'IntPattern':
					return pattern;
				default:
					return pattern;
			}
		}
	});

var _user$project$Inspector$actionLambda = function (act) {
	var _p0 = act;
	switch (_p0.ctor) {
		case 'Skip':
			return F3(
				function (_p2, _p1, c) {
					return c;
				});
		case 'Continue':
			return F3(
				function (f, _p3, c) {
					return f(c);
				});
		case 'Pre':
			return F3(
				function (f, x, c) {
					return f(
						A2(_p0._0, x, c));
				});
		case 'Post':
			return F3(
				function (f, x, c) {
					return A2(
						_p0._0,
						x,
						f(c));
				});
		default:
			return F3(
				function (f, x, c) {
					return A3(_p0._0, f, x, c);
				});
	}
};
var _user$project$Inspector$inspectImport = F3(
	function (config, imp, context) {
		return A4(_user$project$Inspector$actionLambda, config.onImport, _elm_lang$core$Basics$identity, imp, context);
	});
var _user$project$Inspector$inspectImports = F3(
	function (config, imports, context) {
		return A3(
			_elm_lang$core$List$foldl,
			_user$project$Inspector$inspectImport(config),
			context,
			imports);
	});
var _user$project$Inspector$inspectTypeReference = F3(
	function (config, typeReference, context) {
		return A4(
			_user$project$Inspector$actionLambda,
			config.onTypeReference,
			A2(_user$project$Inspector$inspectTypeReferenceInner, config, typeReference),
			typeReference,
			context);
	});
var _user$project$Inspector$inspectTypeReferenceInner = F3(
	function (config, typeRefence, context) {
		var _p4 = typeRefence;
		switch (_p4.ctor) {
			case 'Typed':
				return A3(
					_elm_lang$core$List$foldl,
					_user$project$Inspector$inspectTypeReference(config),
					context,
					_p4._2);
			case 'Tupled':
				return A3(
					_elm_lang$core$List$foldl,
					_user$project$Inspector$inspectTypeReference(config),
					context,
					_p4._0);
			case 'Record':
				return A3(
					_elm_lang$core$List$foldl,
					_user$project$Inspector$inspectTypeReference(config),
					context,
					A2(_elm_lang$core$List$map, _elm_lang$core$Tuple$second, _p4._0));
			case 'GenericRecord':
				return A3(
					_elm_lang$core$List$foldl,
					_user$project$Inspector$inspectTypeReference(config),
					context,
					A2(_elm_lang$core$List$map, _elm_lang$core$Tuple$second, _p4._1));
			case 'FunctionTypeReference':
				return A3(
					_elm_lang$core$List$foldl,
					_user$project$Inspector$inspectTypeReference(config),
					context,
					{
						ctor: '::',
						_0: _p4._0,
						_1: {
							ctor: '::',
							_0: _p4._1,
							_1: {ctor: '[]'}
						}
					});
			case 'Unit':
				return context;
			default:
				return context;
		}
	});
var _user$project$Inspector$inspectValueConstructor = F3(
	function (config, valueConstructor, context) {
		return A3(
			_elm_lang$core$List$foldl,
			_user$project$Inspector$inspectTypeReference(config),
			context,
			valueConstructor.$arguments);
	});
var _user$project$Inspector$inspectType = F3(
	function (config, typeDecl, context) {
		return A3(
			_elm_lang$core$List$foldl,
			_user$project$Inspector$inspectValueConstructor(config),
			context,
			typeDecl.constructors);
	});
var _user$project$Inspector$inspectTypeAlias = F3(
	function (config, typeAlias, context) {
		return A4(
			_user$project$Inspector$actionLambda,
			config.onTypeAlias,
			A2(_user$project$Inspector$inspectTypeReference, config, typeAlias.typeReference),
			typeAlias,
			context);
	});
var _user$project$Inspector$inspectSignature = F3(
	function (config, signature, context) {
		return A4(
			_user$project$Inspector$actionLambda,
			config.onFunctionSignature,
			A2(_user$project$Inspector$inspectTypeReference, config, signature.typeReference),
			signature,
			context);
	});
var _user$project$Inspector$inspectPortDeclaration = F3(
	function (config, signature, context) {
		return A4(
			_user$project$Inspector$actionLambda,
			config.onPortDeclaration,
			A2(_user$project$Inspector$inspectSignature, config, signature),
			signature,
			context);
	});
var _user$project$Inspector$inspectCase = F3(
	function (config, caze, context) {
		return A4(
			_user$project$Inspector$actionLambda,
			config.onCase,
			A2(
				_user$project$Inspector$inspectExpression,
				config,
				_elm_lang$core$Tuple$second(caze)),
			caze,
			context);
	});
var _user$project$Inspector$inspectExpression = F3(
	function (config, expression, context) {
		return A4(
			_user$project$Inspector$actionLambda,
			config.onExpression,
			A2(
				_user$project$Inspector$inspectInnerExpression,
				config,
				_elm_lang$core$Tuple$second(expression)),
			expression,
			context);
	});
var _user$project$Inspector$inspectInnerExpression = F3(
	function (config, expression, context) {
		var _p5 = expression;
		switch (_p5.ctor) {
			case 'UnitExpr':
				return context;
			case 'FunctionOrValue':
				return A4(_user$project$Inspector$actionLambda, config.onFunctionOrValue, _elm_lang$core$Basics$identity, _p5._0, context);
			case 'PrefixOperator':
				return context;
			case 'Operator':
				return context;
			case 'Integer':
				return context;
			case 'Floatable':
				return context;
			case 'Negation':
				return A3(_user$project$Inspector$inspectExpression, config, _p5._0, context);
			case 'Literal':
				return context;
			case 'CharLiteral':
				return context;
			case 'QualifiedExpr':
				return context;
			case 'RecordAccess':
				var _p6 = _p5._0;
				return A4(
					_user$project$Inspector$actionLambda,
					config.onRecordAccess,
					A2(_user$project$Inspector$inspectExpression, config, _p6),
					{ctor: '_Tuple2', _0: _p6, _1: _p5._1},
					context);
			case 'RecordAccessFunction':
				return context;
			case 'GLSLExpression':
				return context;
			case 'Application':
				return A3(
					_elm_lang$core$List$foldl,
					_user$project$Inspector$inspectExpression(config),
					context,
					_p5._0);
			case 'OperatorApplication':
				var _p8 = _p5._3;
				var _p7 = _p5._2;
				return A4(
					_user$project$Inspector$actionLambda,
					config.onOperatorApplication,
					A2(
						_elm_lang$core$Basics$flip,
						_elm_lang$core$List$foldl(
							_user$project$Inspector$inspectExpression(config)),
						{
							ctor: '::',
							_0: _p7,
							_1: {
								ctor: '::',
								_0: _p8,
								_1: {ctor: '[]'}
							}
						}),
					{ctor: '_Tuple4', _0: _p5._0, _1: _p5._1, _2: _p7, _3: _p8},
					context);
			case 'IfBlock':
				return A3(
					_elm_lang$core$List$foldl,
					_user$project$Inspector$inspectExpression(config),
					context,
					{
						ctor: '::',
						_0: _p5._0,
						_1: {
							ctor: '::',
							_0: _p5._1,
							_1: {
								ctor: '::',
								_0: _p5._2,
								_1: {ctor: '[]'}
							}
						}
					});
			case 'TupledExpression':
				return A3(
					_elm_lang$core$List$foldl,
					_user$project$Inspector$inspectExpression(config),
					context,
					_p5._0);
			case 'ParenthesizedExpression':
				return A3(_user$project$Inspector$inspectExpression, config, _p5._0, context);
			case 'LetExpression':
				var _p10 = _p5._0;
				var next = function (_p9) {
					return A3(
						_user$project$Inspector$inspectExpression,
						config,
						_p10.expression,
						A3(_user$project$Inspector$inspectDeclarations, config, _p10.declarations, _p9));
				};
				return A4(_user$project$Inspector$actionLambda, config.onLetBlock, next, _p10, context);
			case 'CaseExpression':
				var _p11 = _p5._0;
				var context2 = A3(_user$project$Inspector$inspectExpression, config, _p11.expression, context);
				var context3 = A3(
					_elm_lang$core$List$foldl,
					F2(
						function (a, b) {
							return A3(_user$project$Inspector$inspectCase, config, a, b);
						}),
					context2,
					_p11.cases);
				return context3;
			case 'LambdaExpression':
				var _p12 = _p5._0;
				return A4(
					_user$project$Inspector$actionLambda,
					config.onLambda,
					A2(_user$project$Inspector$inspectExpression, config, _p12.expression),
					_p12,
					context);
			case 'ListExpr':
				return A3(
					_elm_lang$core$List$foldl,
					_user$project$Inspector$inspectExpression(config),
					context,
					_p5._0);
			case 'RecordExpr':
				return A3(
					_elm_lang$core$List$foldl,
					F2(
						function (a, b) {
							return A3(
								_user$project$Inspector$inspectExpression,
								config,
								_elm_lang$core$Tuple$second(a),
								b);
						}),
					context,
					_p5._0);
			default:
				var _p13 = _p5._0;
				return A4(
					_user$project$Inspector$actionLambda,
					config.onRecordUpdate,
					function (c) {
						return A3(
							_elm_lang$core$List$foldl,
							F2(
								function (a, b) {
									return A3(
										_user$project$Inspector$inspectExpression,
										config,
										_elm_lang$core$Tuple$second(a),
										b);
								}),
							c,
							_p13.updates);
					},
					_p13,
					context);
		}
	});
var _user$project$Inspector$inspectDeclarations = F3(
	function (config, declarations, context) {
		return A3(
			_elm_lang$core$List$foldl,
			_user$project$Inspector$inspectDeclaration(config),
			context,
			declarations);
	});
var _user$project$Inspector$inspectDeclaration = F3(
	function (config, declaration, context) {
		var _p14 = declaration;
		switch (_p14.ctor) {
			case 'FuncDecl':
				return A3(_user$project$Inspector$inspectFunction, config, _p14._0, context);
			case 'AliasDecl':
				return A3(_user$project$Inspector$inspectTypeAlias, config, _p14._0, context);
			case 'TypeDecl':
				return A3(_user$project$Inspector$inspectType, config, _p14._0, context);
			case 'PortDeclaration':
				return A3(_user$project$Inspector$inspectPortDeclaration, config, _p14._0, context);
			case 'InfixDeclaration':
				return context;
			default:
				return A3(_user$project$Inspector$inspectDestructuring, config, _p14._0, context);
		}
	});
var _user$project$Inspector$inspectDestructuring = F3(
	function (config, destructuring, context) {
		return A4(
			_user$project$Inspector$actionLambda,
			config.onDestructuring,
			A2(_user$project$Inspector$inspectExpression, config, destructuring.expression),
			destructuring,
			context);
	});
var _user$project$Inspector$inspectFunction = F3(
	function (config, $function, context) {
		return A4(
			_user$project$Inspector$actionLambda,
			config.onFunction,
			function (_p15) {
				return A2(
					_elm_lang$core$Maybe$withDefault,
					_elm_lang$core$Basics$identity,
					A2(
						_elm_lang$core$Maybe$map,
						_user$project$Inspector$inspectSignature(config),
						$function.signature))(
					A3(_user$project$Inspector$inspectExpression, config, $function.declaration.expression, _p15));
			},
			$function,
			context);
	});
var _user$project$Inspector$inspect = F3(
	function (config, file, context) {
		return A4(
			_user$project$Inspector$actionLambda,
			config.onFile,
			function (_p16) {
				return A3(
					_user$project$Inspector$inspectDeclarations,
					config,
					file.declarations,
					A3(_user$project$Inspector$inspectImports, config, file.imports, _p16));
			},
			file,
			context);
	});
var _user$project$Inspector$Config = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return function (k) {
											return function (l) {
												return function (m) {
													return function (n) {
														return function (o) {
															return function (p) {
																return {onFile: a, onImport: b, onFunction: c, onFunctionSignature: d, onPortDeclaration: e, onTypeAlias: f, onDestructuring: g, onExpression: h, onOperatorApplication: i, onTypeReference: j, onLambda: k, onLetBlock: l, onCase: m, onFunctionOrValue: n, onRecordAccess: o, onRecordUpdate: p};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _user$project$Inspector$Inner = function (a) {
	return {ctor: 'Inner', _0: a};
};
var _user$project$Inspector$Post = function (a) {
	return {ctor: 'Post', _0: a};
};
var _user$project$Inspector$Pre = function (a) {
	return {ctor: 'Pre', _0: a};
};
var _user$project$Inspector$Continue = {ctor: 'Continue'};
var _user$project$Inspector$defaultConfig = {onFile: _user$project$Inspector$Continue, onImport: _user$project$Inspector$Continue, onFunction: _user$project$Inspector$Continue, onPortDeclaration: _user$project$Inspector$Continue, onFunctionSignature: _user$project$Inspector$Continue, onTypeReference: _user$project$Inspector$Continue, onTypeAlias: _user$project$Inspector$Continue, onDestructuring: _user$project$Inspector$Continue, onExpression: _user$project$Inspector$Continue, onLambda: _user$project$Inspector$Continue, onOperatorApplication: _user$project$Inspector$Continue, onLetBlock: _user$project$Inspector$Continue, onCase: _user$project$Inspector$Continue, onFunctionOrValue: _user$project$Inspector$Continue, onRecordAccess: _user$project$Inspector$Continue, onRecordUpdate: _user$project$Inspector$Continue};
var _user$project$Inspector$Skip = {ctor: 'Skip'};

var _user$project$ASTUtil_Patterns$findParentPattern = F2(
	function (file, range) {
		var onLambda = function (l) {
			return _elm_community$maybe_extra$Maybe_Extra$orElseLazy(
				function (_p0) {
					var _p1 = _p0;
					return _elm_lang$core$List$head(
						A2(
							_elm_lang$core$List$filter,
							function (_p2) {
								return A2(
									_user$project$AST_Ranges$containsRange,
									range,
									_user$project$ASTUtil_PatternOptimizer$patternRange(_p2));
							},
							l.args));
				});
		};
		var onCase = function (c) {
			return _elm_community$maybe_extra$Maybe_Extra$orElseLazy(
				function (_p3) {
					var _p4 = _p3;
					return A2(
						_user$project$AST_Ranges$containsRange,
						range,
						_user$project$ASTUtil_PatternOptimizer$patternRange(
							_elm_lang$core$Tuple$first(c))) ? _elm_lang$core$Maybe$Just(
						_elm_lang$core$Tuple$first(c)) : _elm_lang$core$Maybe$Nothing;
				});
		};
		var onFunction = function (func) {
			return _elm_community$maybe_extra$Maybe_Extra$orElseLazy(
				function (_p5) {
					var _p6 = _p5;
					return _elm_lang$core$List$head(
						A2(
							_elm_lang$core$List$filter,
							function (_p7) {
								return A2(
									_user$project$AST_Ranges$containsRange,
									range,
									_user$project$ASTUtil_PatternOptimizer$patternRange(_p7));
							},
							func.declaration.$arguments));
				});
		};
		return A3(
			_user$project$Inspector$inspect,
			_elm_lang$core$Native_Utils.update(
				_user$project$Inspector$defaultConfig,
				{
					onFunction: _user$project$Inspector$Pre(onFunction),
					onCase: _user$project$Inspector$Pre(onCase),
					onLambda: _user$project$Inspector$Pre(onLambda)
				}),
			file,
			_elm_lang$core$Maybe$Nothing);
	});

var _user$project$ASTUtil_Variables$qualifiedNameUsedVars = F2(
	function (_p0, range) {
		var _p1 = _p0;
		return _elm_lang$core$Native_Utils.eq(
			_p1.moduleName,
			{ctor: '[]'}) ? {
			ctor: '::',
			_0: {value: _p1.name, range: range},
			_1: {ctor: '[]'}
		} : {ctor: '[]'};
	});
var _user$project$ASTUtil_Variables$patternToUsedVars = function (p) {
	patternToUsedVars:
	while (true) {
		var _p2 = p;
		switch (_p2.ctor) {
			case 'TuplePattern':
				return A2(_elm_lang$core$List$concatMap, _user$project$ASTUtil_Variables$patternToUsedVars, _p2._0);
			case 'UnConsPattern':
				return A2(
					_elm_lang$core$Basics_ops['++'],
					_user$project$ASTUtil_Variables$patternToUsedVars(_p2._0),
					_user$project$ASTUtil_Variables$patternToUsedVars(_p2._1));
			case 'ListPattern':
				return A2(_elm_lang$core$List$concatMap, _user$project$ASTUtil_Variables$patternToUsedVars, _p2._0);
			case 'NamedPattern':
				return A2(
					_elm_lang$core$Basics_ops['++'],
					A2(_user$project$ASTUtil_Variables$qualifiedNameUsedVars, _p2._0, _p2._2),
					A2(_elm_lang$core$List$concatMap, _user$project$ASTUtil_Variables$patternToUsedVars, _p2._1));
			case 'AsPattern':
				var _v2 = _p2._0;
				p = _v2;
				continue patternToUsedVars;
			case 'ParenthesizedPattern':
				var _v3 = _p2._0;
				p = _v3;
				continue patternToUsedVars;
			case 'QualifiedNamePattern':
				return A2(_user$project$ASTUtil_Variables$qualifiedNameUsedVars, _p2._0, _p2._1);
			case 'RecordPattern':
				return {ctor: '[]'};
			case 'VarPattern':
				return {ctor: '[]'};
			case 'AllPattern':
				return {ctor: '[]'};
			case 'UnitPattern':
				return {ctor: '[]'};
			case 'CharPattern':
				return {ctor: '[]'};
			case 'StringPattern':
				return {ctor: '[]'};
			case 'IntPattern':
				return {ctor: '[]'};
			default:
				return {ctor: '[]'};
		}
	}
};
var _user$project$ASTUtil_Variables$TopLevel = {ctor: 'TopLevel'};
var _user$project$ASTUtil_Variables$Defined = {ctor: 'Defined'};
var _user$project$ASTUtil_Variables$withoutTopLevel = function () {
	var f = function (_p3) {
		var _p4 = _p3;
		var _p5 = _p4._1;
		if (_p5.ctor === 'TopLevel') {
			return {ctor: '_Tuple2', _0: _p4._0, _1: _user$project$ASTUtil_Variables$Defined};
		} else {
			return _p4;
		}
	};
	return _elm_lang$core$List$map(f);
}();
var _user$project$ASTUtil_Variables$Pattern = {ctor: 'Pattern'};
var _user$project$ASTUtil_Variables$patternToVarsInner = F2(
	function (isFirst, p) {
		var recur = _user$project$ASTUtil_Variables$patternToVarsInner(false);
		var _p6 = p;
		switch (_p6.ctor) {
			case 'TuplePattern':
				return A2(_elm_lang$core$List$concatMap, recur, _p6._0);
			case 'RecordPattern':
				return A2(
					_elm_lang$core$List$map,
					A2(
						_elm_lang$core$Basics$flip,
						F2(
							function (v0, v1) {
								return {ctor: '_Tuple2', _0: v0, _1: v1};
							}),
						_user$project$ASTUtil_Variables$Pattern),
					_p6._0);
			case 'UnConsPattern':
				return A2(
					_elm_lang$core$Basics_ops['++'],
					recur(_p6._0),
					recur(_p6._1));
			case 'ListPattern':
				return A2(_elm_lang$core$List$concatMap, recur, _p6._0);
			case 'VarPattern':
				return {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: {value: _p6._0, range: _p6._1},
						_1: isFirst ? _user$project$ASTUtil_Variables$Defined : _user$project$ASTUtil_Variables$Pattern
					},
					_1: {ctor: '[]'}
				};
			case 'NamedPattern':
				return A2(_elm_lang$core$List$concatMap, recur, _p6._1);
			case 'AsPattern':
				return {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _p6._1, _1: _user$project$ASTUtil_Variables$Pattern},
					_1: recur(_p6._0)
				};
			case 'ParenthesizedPattern':
				return recur(_p6._0);
			case 'QualifiedNamePattern':
				return {ctor: '[]'};
			case 'AllPattern':
				return {ctor: '[]'};
			case 'UnitPattern':
				return {ctor: '[]'};
			case 'CharPattern':
				return {ctor: '[]'};
			case 'StringPattern':
				return {ctor: '[]'};
			case 'IntPattern':
				return {ctor: '[]'};
			default:
				return {ctor: '[]'};
		}
	});
var _user$project$ASTUtil_Variables$patternToVars = _user$project$ASTUtil_Variables$patternToVarsInner(true);
var _user$project$ASTUtil_Variables$getDeclarationVars = function (decl) {
	var _p7 = decl;
	switch (_p7.ctor) {
		case 'FuncDecl':
			return {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _p7._0.declaration.name, _1: _user$project$ASTUtil_Variables$TopLevel},
				_1: {ctor: '[]'}
			};
		case 'AliasDecl':
			return {ctor: '[]'};
		case 'TypeDecl':
			return A2(
				_elm_lang$core$List$map,
				function (_p8) {
					var _p9 = _p8;
					return {
						ctor: '_Tuple2',
						_0: {value: _p9.name, range: _p9.range},
						_1: _user$project$ASTUtil_Variables$TopLevel
					};
				},
				_p7._0.constructors);
		case 'PortDeclaration':
			return {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: {value: _p7._0.name, range: _user$project$AST_Ranges$emptyRange},
					_1: _user$project$ASTUtil_Variables$TopLevel
				},
				_1: {ctor: '[]'}
			};
		case 'InfixDeclaration':
			return {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: {value: _p7._0.operator, range: _user$project$AST_Ranges$emptyRange},
					_1: _user$project$ASTUtil_Variables$TopLevel
				},
				_1: {ctor: '[]'}
			};
		default:
			return _user$project$ASTUtil_Variables$patternToVars(_p7._0.pattern);
	}
};
var _user$project$ASTUtil_Variables$getDeclarationsVars = _elm_lang$core$List$concatMap(_user$project$ASTUtil_Variables$getDeclarationVars);
var _user$project$ASTUtil_Variables$Imported = {ctor: 'Imported'};
var _user$project$ASTUtil_Variables$getImportExposedVars = function (e) {
	var _p10 = e;
	switch (_p10.ctor) {
		case 'All':
			return {ctor: '[]'};
		case 'None':
			return {ctor: '[]'};
		default:
			return A2(
				_elm_lang$core$List$concatMap,
				function (exposed) {
					var _p11 = exposed;
					switch (_p11.ctor) {
						case 'InfixExpose':
							return {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: A2(_user$project$AST_Types$VariablePointer, _p11._0, _p11._1),
									_1: _user$project$ASTUtil_Variables$Imported
								},
								_1: {ctor: '[]'}
							};
						case 'FunctionExpose':
							return {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: A2(_user$project$AST_Types$VariablePointer, _p11._0, _p11._1),
									_1: _user$project$ASTUtil_Variables$Imported
								},
								_1: {ctor: '[]'}
							};
						case 'TypeOrAliasExpose':
							return {ctor: '[]'};
						default:
							var _p12 = _p11._0.constructors;
							switch (_p12.ctor) {
								case 'All':
									return {ctor: '[]'};
								case 'None':
									return {ctor: '[]'};
								default:
									return A2(
										_elm_lang$core$List$map,
										function (_p13) {
											return A3(
												_elm_lang$core$Basics$flip,
												F2(
													function (v0, v1) {
														return {ctor: '_Tuple2', _0: v0, _1: v1};
													}),
												_user$project$ASTUtil_Variables$Imported,
												A2(_elm_lang$core$Basics$uncurry, _user$project$AST_Types$VariablePointer, _p13));
										},
										_p12._0);
							}
					}
				},
				_p10._0);
	}
};
var _user$project$ASTUtil_Variables$getImportVars = function (imp) {
	return _user$project$ASTUtil_Variables$getImportExposedVars(imp.exposingList);
};
var _user$project$ASTUtil_Variables$getImportsVars = _elm_lang$core$List$concatMap(_user$project$ASTUtil_Variables$getImportVars);
var _user$project$ASTUtil_Variables$getTopLevels = function (file) {
	return _elm_lang$core$List$concat(
		{
			ctor: '::',
			_0: _user$project$ASTUtil_Variables$getImportsVars(file.imports),
			_1: {
				ctor: '::',
				_0: _user$project$ASTUtil_Variables$getDeclarationsVars(file.declarations),
				_1: {ctor: '[]'}
			}
		});
};

var _user$project$Analyser_Files_Types$Dependency = F3(
	function (a, b, c) {
		return {name: a, version: b, interfaces: c};
	});
var _user$project$Analyser_Files_Types$LoadedFileData = F3(
	function (a, b, c) {
		return {$interface: a, moduleName: b, ast: c};
	});
var _user$project$Analyser_Files_Types$FileContent = F6(
	function (a, b, c, d, e, f) {
		return {path: a, success: b, sha1: c, content: d, ast: e, formatted: f};
	});
var _user$project$Analyser_Files_Types$Operator = function (a) {
	return {ctor: 'Operator', _0: a};
};
var _user$project$Analyser_Files_Types$Alias = function (a) {
	return {ctor: 'Alias', _0: a};
};
var _user$project$Analyser_Files_Types$Type = function (a) {
	return {ctor: 'Type', _0: a};
};
var _user$project$Analyser_Files_Types$Function = function (a) {
	return {ctor: 'Function', _0: a};
};
var _user$project$Analyser_Files_Types$Loaded = function (a) {
	return {ctor: 'Loaded', _0: a};
};
var _user$project$Analyser_Files_Types$Failed = function (a) {
	return {ctor: 'Failed', _0: a};
};

var _user$project$Analyser_Files_Interface$fileToDefinitions = function (file) {
	var getValidOperatorInterface = F2(
		function (t1, t2) {
			var _p0 = {ctor: '_Tuple2', _0: t1, _1: t2};
			if (((_p0.ctor === '_Tuple2') && (_p0._0.ctor === 'Operator')) && (_p0._1.ctor === 'Operator')) {
				var _p1 = _p0._0._0;
				return (_elm_lang$core$Native_Utils.eq(_p1.precedence, 5) && _elm_lang$core$Native_Utils.eq(_p1.direction, _user$project$AST_Types$Left)) ? _elm_lang$core$Maybe$Just(
					_user$project$Analyser_Files_Types$Operator(_p0._1._0)) : _elm_lang$core$Maybe$Just(
					_user$project$Analyser_Files_Types$Operator(_p1));
			} else {
				return _elm_lang$core$Maybe$Nothing;
			}
		});
	var resolveGroup = function (g) {
		var _p2 = g;
		if (_p2.ctor === '[]') {
			return _elm_lang$core$Maybe$Nothing;
		} else {
			if (_p2._1.ctor === '[]') {
				return _elm_lang$core$Maybe$Just(_p2._0);
			} else {
				if (((_p2._0.ctor === '_Tuple2') && (_p2._1._0.ctor === '_Tuple2')) && (_p2._1._1.ctor === '[]')) {
					return A2(
						_elm_lang$core$Maybe$map,
						F2(
							function (v0, v1) {
								return {ctor: '_Tuple2', _0: v0, _1: v1};
							})(_p2._0._0),
						A2(getValidOperatorInterface, _p2._0._1, _p2._1._0._1));
				} else {
					return _elm_lang$core$Maybe$Nothing;
				}
			}
		}
	};
	var allDeclarations = A2(
		_elm_lang$core$List$filterMap,
		function (decl) {
			var _p3 = decl;
			switch (_p3.ctor) {
				case 'TypeDecl':
					var _p4 = _p3._0;
					return _elm_lang$core$Maybe$Just(
						{
							ctor: '_Tuple2',
							_0: _p4.name,
							_1: _user$project$Analyser_Files_Types$Type(
								{
									ctor: '_Tuple2',
									_0: _p4.name,
									_1: A2(
										_elm_lang$core$List$map,
										function (_) {
											return _.name;
										},
										_p4.constructors)
								})
						});
				case 'AliasDecl':
					var _p5 = _p3._0;
					return _elm_lang$core$Maybe$Just(
						{
							ctor: '_Tuple2',
							_0: _p5.name,
							_1: _user$project$Analyser_Files_Types$Alias(_p5.name)
						});
				case 'PortDeclaration':
					var _p6 = _p3._0;
					return _elm_lang$core$Maybe$Just(
						{
							ctor: '_Tuple2',
							_0: _p6.name,
							_1: _user$project$Analyser_Files_Types$Function(_p6.name)
						});
				case 'FuncDecl':
					var _p7 = _p3._0;
					return _p7.declaration.operatorDefinition ? _elm_lang$core$Maybe$Just(
						{
							ctor: '_Tuple2',
							_0: _p7.declaration.name.value,
							_1: _user$project$Analyser_Files_Types$Operator(
								{operator: _p7.declaration.name.value, precedence: 5, direction: _user$project$AST_Types$Left})
						}) : _elm_lang$core$Maybe$Just(
						{
							ctor: '_Tuple2',
							_0: _p7.declaration.name.value,
							_1: _user$project$Analyser_Files_Types$Function(_p7.declaration.name.value)
						});
				case 'InfixDeclaration':
					var _p8 = _p3._0;
					return _elm_lang$core$Maybe$Just(
						{
							ctor: '_Tuple2',
							_0: _p8.operator,
							_1: _user$project$Analyser_Files_Types$Operator(_p8)
						});
				default:
					return _elm_lang$core$Maybe$Nothing;
			}
		},
		file.declarations);
	return A2(
		_elm_lang$core$List$filterMap,
		function (_p9) {
			return resolveGroup(
				_elm_lang$core$Tuple$second(_p9));
		},
		A2(
			_elm_lang$core$List$map,
			function (x) {
				return {
					ctor: '_Tuple2',
					_0: x,
					_1: A2(
						_elm_lang$core$List$filter,
						function (_p10) {
							return A2(
								F2(
									function (x, y) {
										return _elm_lang$core$Native_Utils.eq(x, y);
									}),
								x,
								_elm_lang$core$Tuple$first(_p10));
						},
						allDeclarations)
				};
			},
			_elm_community$list_extra$List_Extra$unique(
				A2(_elm_lang$core$List$map, _elm_lang$core$Tuple$first, allDeclarations))));
};
var _user$project$Analyser_Files_Interface$ifType = F2(
	function (f, i) {
		var _p11 = i;
		if (_p11.ctor === 'Type') {
			return f(_p11._0);
		} else {
			return i;
		}
	});
var _user$project$Analyser_Files_Interface$lookupForDefinition = function (key) {
	return function (_p12) {
		return A2(
			_elm_lang$core$Maybe$map,
			_elm_lang$core$Tuple$second,
			_elm_lang$core$List$head(
				A2(
					_elm_lang$core$List$filter,
					function (_p13) {
						return A2(
							F2(
								function (x, y) {
									return _elm_lang$core$Native_Utils.eq(x, y);
								}),
							key,
							_elm_lang$core$Tuple$first(_p13));
					},
					_p12)));
	};
};
var _user$project$Analyser_Files_Interface$buildInterfaceFromExplicit = F2(
	function (x, fileDefinitionList) {
		return A2(
			_elm_lang$core$List$filterMap,
			function (expose) {
				var _p14 = expose;
				switch (_p14.ctor) {
					case 'InfixExpose':
						return A2(_user$project$Analyser_Files_Interface$lookupForDefinition, _p14._0, fileDefinitionList);
					case 'TypeOrAliasExpose':
						return A2(
							_elm_lang$core$Maybe$map,
							_user$project$Analyser_Files_Interface$ifType(
								function (_p15) {
									var _p16 = _p15;
									return _user$project$Analyser_Files_Types$Type(
										{
											ctor: '_Tuple2',
											_0: _p16._0,
											_1: {ctor: '[]'}
										});
								}),
							A2(_user$project$Analyser_Files_Interface$lookupForDefinition, _p14._0, fileDefinitionList));
					case 'FunctionExpose':
						return _elm_lang$core$Maybe$Just(
							_user$project$Analyser_Files_Types$Function(_p14._0));
					default:
						var _p18 = _p14._0;
						var _p17 = _p18.constructors;
						switch (_p17.ctor) {
							case 'None':
								return _elm_lang$core$Maybe$Just(
									_user$project$Analyser_Files_Types$Type(
										{
											ctor: '_Tuple2',
											_0: _p18.name,
											_1: {ctor: '[]'}
										}));
							case 'All':
								return A2(_user$project$Analyser_Files_Interface$lookupForDefinition, _p18.name, fileDefinitionList);
							default:
								return _elm_lang$core$Maybe$Just(
									_user$project$Analyser_Files_Types$Type(
										{
											ctor: '_Tuple2',
											_0: _p18.name,
											_1: A2(_elm_lang$core$List$map, _elm_lang$core$Tuple$first, _p17._0)
										}));
						}
				}
			},
			x);
	});
var _user$project$Analyser_Files_Interface$build = function (file) {
	var moduleExposure = _user$project$AST_Util$moduleExposingList(file.moduleDefinition);
	var fileDefinitionList = _user$project$Analyser_Files_Interface$fileToDefinitions(file);
	var _p19 = moduleExposure;
	switch (_p19.ctor) {
		case 'None':
			return {ctor: '[]'};
		case 'Explicit':
			return A2(_user$project$Analyser_Files_Interface$buildInterfaceFromExplicit, _p19._0, fileDefinitionList);
		default:
			return A2(_elm_lang$core$List$map, _elm_lang$core$Tuple$second, fileDefinitionList);
	}
};
var _user$project$Analyser_Files_Interface$getOperators = _elm_lang$core$List$filterMap(
	function (i) {
		var _p20 = i;
		if (_p20.ctor === 'Operator') {
			return _elm_lang$core$Maybe$Just(_p20._0);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _user$project$Analyser_Files_Interface$doesExposeFunction = F2(
	function (k, $interface) {
		return A2(
			_elm_lang$core$List$any,
			function (x) {
				var _p21 = x;
				switch (_p21.ctor) {
					case 'Function':
						return _elm_lang$core$Native_Utils.eq(k, _p21._0);
					case 'Type':
						return A2(_elm_lang$core$List$member, k, _p21._0._1);
					case 'Operator':
						return _elm_lang$core$Native_Utils.eq(_p21._0.operator, k);
					default:
						return false;
				}
			},
			$interface);
	});
var _user$project$Analyser_Files_Interface$doesExposeAlias = F2(
	function (k, $interface) {
		return A2(
			_elm_lang$core$List$any,
			function (x) {
				var _p22 = x;
				if (_p22.ctor === 'Alias') {
					return _elm_lang$core$Native_Utils.eq(k, _p22._0);
				} else {
					return false;
				}
			},
			$interface);
	});

var _user$project$Analyser_Files_Json$decodeExposedInterface = _user$project$Util_Json$decodeTyped(
	{
		ctor: '::',
		_0: {
			ctor: '_Tuple2',
			_0: 'function',
			_1: A2(_elm_lang$core$Json_Decode$map, _user$project$Analyser_Files_Types$Function, _elm_lang$core$Json_Decode$string)
		},
		_1: {
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'type_',
				_1: A2(
					_elm_lang$core$Json_Decode$map,
					_user$project$Analyser_Files_Types$Type,
					A2(
						_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
						A2(
							_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
							_elm_lang$core$Json_Decode$succeed(
								F2(
									function (v0, v1) {
										return {ctor: '_Tuple2', _0: v0, _1: v1};
									})),
							A2(_elm_lang$core$Json_Decode$field, 'name', _elm_lang$core$Json_Decode$string)),
						A2(
							_elm_lang$core$Json_Decode$field,
							'constructors',
							_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string))))
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'alias',
					_1: A2(_elm_lang$core$Json_Decode$map, _user$project$Analyser_Files_Types$Alias, _elm_lang$core$Json_Decode$string)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'operator',
						_1: A2(_elm_lang$core$Json_Decode$map, _user$project$Analyser_Files_Types$Operator, _user$project$AST_Decoding$decodeInfix)
					},
					_1: {ctor: '[]'}
				}
			}
		}
	});
var _user$project$Analyser_Files_Json$decodeInterface = _elm_lang$core$Json_Decode$list(_user$project$Analyser_Files_Json$decodeExposedInterface);
var _user$project$Analyser_Files_Json$encodeExposedInterface = function (x) {
	var _p0 = x;
	switch (_p0.ctor) {
		case 'Function':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'function',
				_elm_lang$core$Json_Encode$string(_p0._0));
		case 'Type':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'type_',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'name',
							_1: _elm_lang$core$Json_Encode$string(_p0._0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'constructors',
								_1: _elm_lang$core$Json_Encode$list(
									A2(_elm_lang$core$List$map, _elm_lang$core$Json_Encode$string, _p0._0._1))
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'Alias':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'alias',
				_elm_lang$core$Json_Encode$string(_p0._0));
		default:
			return A2(
				_user$project$Util_Json$encodeTyped,
				'operator',
				_user$project$AST_Encoding$encodeInfix(_p0._0));
	}
};
var _user$project$Analyser_Files_Json$encodeInterface = function (_p1) {
	return _elm_lang$core$Json_Encode$list(
		A2(_elm_lang$core$List$map, _user$project$Analyser_Files_Json$encodeExposedInterface, _p1));
};
var _user$project$Analyser_Files_Json$encodeDependency = function (dep) {
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'name',
				_1: _elm_lang$core$Json_Encode$string(dep.name)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'version',
					_1: _elm_lang$core$Json_Encode$string(dep.version)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'interfaces',
						_1: _elm_lang$core$Json_Encode$list(
							A2(
								_elm_lang$core$List$map,
								function (_p2) {
									var _p3 = _p2;
									return _elm_lang$core$Json_Encode$object(
										{
											ctor: '::',
											_0: {
												ctor: '_Tuple2',
												_0: 'key',
												_1: _elm_lang$core$Json_Encode$list(
													A2(_elm_lang$core$List$map, _elm_lang$core$Json_Encode$string, _p3._0))
											},
											_1: {
												ctor: '::',
												_0: {
													ctor: '_Tuple2',
													_0: 'value',
													_1: _user$project$Analyser_Files_Json$encodeInterface(_p3._1)
												},
												_1: {ctor: '[]'}
											}
										});
								},
								_elm_lang$core$Dict$toList(dep.interfaces)))
					},
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$Analyser_Files_Json$decodeDependency = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			_elm_lang$core$Json_Decode$succeed(_user$project$Analyser_Files_Types$Dependency),
			A2(_elm_lang$core$Json_Decode$field, 'name', _elm_lang$core$Json_Decode$string)),
		A2(_elm_lang$core$Json_Decode$field, 'version', _elm_lang$core$Json_Decode$string)),
	A2(
		_elm_lang$core$Json_Decode$field,
		'interfaces',
		A2(
			_elm_lang$core$Json_Decode$map,
			_elm_lang$core$Dict$fromList,
			_elm_lang$core$Json_Decode$list(
				A3(
					_elm_lang$core$Json_Decode$map2,
					F2(
						function (v0, v1) {
							return {ctor: '_Tuple2', _0: v0, _1: v1};
						}),
					A2(
						_elm_lang$core$Json_Decode$field,
						'key',
						_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string)),
					A2(_elm_lang$core$Json_Decode$field, 'value', _user$project$Analyser_Files_Json$decodeInterface))))));
var _user$project$Analyser_Files_Json$serialiseDependency = function (_p4) {
	return A2(
		_elm_lang$core$Json_Encode$encode,
		2,
		_user$project$Analyser_Files_Json$encodeDependency(_p4));
};
var _user$project$Analyser_Files_Json$deserialiseDependency = function (_p5) {
	return _elm_lang$core$Result$toMaybe(
		A2(_elm_lang$core$Json_Decode$decodeString, _user$project$Analyser_Files_Json$decodeDependency, _p5));
};

var _user$project$Parser_Tokens$allowedOperatorTokens = {
	ctor: '::',
	_0: _elm_lang$core$Native_Utils.chr('+'),
	_1: {
		ctor: '::',
		_0: _elm_lang$core$Native_Utils.chr('-'),
		_1: {
			ctor: '::',
			_0: _elm_lang$core$Native_Utils.chr(':'),
			_1: {
				ctor: '::',
				_0: _elm_lang$core$Native_Utils.chr('/'),
				_1: {
					ctor: '::',
					_0: _elm_lang$core$Native_Utils.chr('*'),
					_1: {
						ctor: '::',
						_0: _elm_lang$core$Native_Utils.chr('>'),
						_1: {
							ctor: '::',
							_0: _elm_lang$core$Native_Utils.chr('<'),
							_1: {
								ctor: '::',
								_0: _elm_lang$core$Native_Utils.chr('='),
								_1: {
									ctor: '::',
									_0: _elm_lang$core$Native_Utils.chr('/'),
									_1: {
										ctor: '::',
										_0: _elm_lang$core$Native_Utils.chr('&'),
										_1: {
											ctor: '::',
											_0: _elm_lang$core$Native_Utils.chr('^'),
											_1: {
												ctor: '::',
												_0: _elm_lang$core$Native_Utils.chr('%'),
												_1: {
													ctor: '::',
													_0: _elm_lang$core$Native_Utils.chr('|'),
													_1: {
														ctor: '::',
														_0: _elm_lang$core$Native_Utils.chr('!'),
														_1: {
															ctor: '::',
															_0: _elm_lang$core$Native_Utils.chr('.'),
															_1: {
																ctor: '::',
																_0: _elm_lang$core$Native_Utils.chr('#'),
																_1: {
																	ctor: '::',
																	_0: _elm_lang$core$Native_Utils.chr('$'),
																	_1: {
																		ctor: '::',
																		_0: _elm_lang$core$Native_Utils.chr('≡'),
																		_1: {
																			ctor: '::',
																			_0: _elm_lang$core$Native_Utils.chr('~'),
																			_1: {
																				ctor: '::',
																				_0: _elm_lang$core$Native_Utils.chr('?'),
																				_1: {
																					ctor: '::',
																					_0: _elm_lang$core$Native_Utils.chr('@'),
																					_1: {ctor: '[]'}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var _user$project$Parser_Tokens$allowedPrefixOperatorTokens = {
	ctor: '::',
	_0: _elm_lang$core$Native_Utils.chr(','),
	_1: _user$project$Parser_Tokens$allowedOperatorTokens
};
var _user$project$Parser_Tokens$excludedOperators = {
	ctor: '::',
	_0: ':',
	_1: {
		ctor: '::',
		_0: '->',
		_1: {
			ctor: '::',
			_0: '--',
			_1: {
				ctor: '::',
				_0: '=',
				_1: {ctor: '[]'}
			}
		}
	}
};
var _user$project$Parser_Tokens$operatorTokenFromList = function (allowedChars) {
	return A2(
		_elm_community$parser_combinators$Combine_ops['>>='],
		A2(
			_elm_community$parser_combinators$Combine_ops['<$>'],
			_elm_lang$core$String$fromList,
			_elm_community$parser_combinators$Combine$many1(
				_elm_community$parser_combinators$Combine_Char$oneOf(allowedChars))),
		function (m) {
			return A2(_elm_lang$core$List$member, m, _user$project$Parser_Tokens$excludedOperators) ? _elm_community$parser_combinators$Combine$fail('operator is not allowed') : _elm_community$parser_combinators$Combine$succeed(m);
		});
};
var _user$project$Parser_Tokens$prefixOperatorToken = _user$project$Parser_Tokens$operatorTokenFromList(_user$project$Parser_Tokens$allowedPrefixOperatorTokens);
var _user$project$Parser_Tokens$infixOperatorToken = _user$project$Parser_Tokens$operatorTokenFromList(_user$project$Parser_Tokens$allowedOperatorTokens);
var _user$project$Parser_Tokens$typeName = _elm_community$parser_combinators$Combine$regex('[A-Z][a-zA-Z0-9_]*');
var _user$project$Parser_Tokens$moduleName = A2(
	_elm_community$parser_combinators$Combine$sepBy1,
	_elm_community$parser_combinators$Combine$string('.'),
	_user$project$Parser_Tokens$typeName);
var _user$project$Parser_Tokens$functionNamePatternInfix = '`([A-Z][a-zA-Z0-9_]*\\.)*[a-z][a-zA-Z0-9_]*\'?`';
var _user$project$Parser_Tokens$functionNamePattern = '[a-z][a-zA-Z0-9_]*\'?';
var _user$project$Parser_Tokens$escapedChar = A2(
	_elm_community$parser_combinators$Combine_ops['*>'],
	_elm_community$parser_combinators$Combine_Char$char(
		_elm_lang$core$Native_Utils.chr('\\')),
	_elm_community$parser_combinators$Combine$choice(
		{
			ctor: '::',
			_0: A2(
				_elm_community$parser_combinators$Combine_ops['<$'],
				_elm_lang$core$Native_Utils.chr('\''),
				_elm_community$parser_combinators$Combine_Char$char(
					_elm_lang$core$Native_Utils.chr('\''))),
			_1: {
				ctor: '::',
				_0: A2(
					_elm_community$parser_combinators$Combine_ops['<$'],
					_elm_lang$core$Native_Utils.chr('\"'),
					_elm_community$parser_combinators$Combine_Char$char(
						_elm_lang$core$Native_Utils.chr('\"'))),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_community$parser_combinators$Combine_ops['<$'],
						_elm_lang$core$Native_Utils.chr('\n'),
						_elm_community$parser_combinators$Combine_Char$char(
							_elm_lang$core$Native_Utils.chr('n'))),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_community$parser_combinators$Combine_ops['<$'],
							_elm_lang$core$Native_Utils.chr('\t'),
							_elm_community$parser_combinators$Combine_Char$char(
								_elm_lang$core$Native_Utils.chr('t'))),
						_1: {
							ctor: '::',
							_0: A2(
								_elm_community$parser_combinators$Combine_ops['<$'],
								_elm_lang$core$Native_Utils.chr('\\'),
								_elm_community$parser_combinators$Combine_Char$char(
									_elm_lang$core$Native_Utils.chr('\\'))),
							_1: {
								ctor: '::',
								_0: A2(
									_elm_community$parser_combinators$Combine_ops['<$'],
									_elm_lang$core$Native_Utils.chr(''),
									_elm_community$parser_combinators$Combine_Char$char(
										_elm_lang$core$Native_Utils.chr('a'))),
								_1: {
									ctor: '::',
									_0: A2(
										_elm_community$parser_combinators$Combine_ops['<$'],
										_elm_lang$core$Native_Utils.chr('\b'),
										_elm_community$parser_combinators$Combine_Char$char(
											_elm_lang$core$Native_Utils.chr('b'))),
									_1: {
										ctor: '::',
										_0: A2(
											_elm_community$parser_combinators$Combine_ops['<$'],
											_elm_lang$core$Native_Utils.chr('\f'),
											_elm_community$parser_combinators$Combine_Char$char(
												_elm_lang$core$Native_Utils.chr('f'))),
										_1: {
											ctor: '::',
											_0: A2(
												_elm_community$parser_combinators$Combine_ops['<$'],
												_elm_lang$core$Native_Utils.chr('\r'),
												_elm_community$parser_combinators$Combine_Char$char(
													_elm_lang$core$Native_Utils.chr('r'))),
											_1: {
												ctor: '::',
												_0: A2(
													_elm_community$parser_combinators$Combine_ops['<$'],
													_elm_lang$core$Native_Utils.chr('\v'),
													_elm_community$parser_combinators$Combine_Char$char(
														_elm_lang$core$Native_Utils.chr('v'))),
												_1: {
													ctor: '::',
													_0: A2(
														_elm_community$parser_combinators$Combine_ops['>>='],
														A2(
															_elm_community$parser_combinators$Combine_ops['*>'],
															_elm_community$parser_combinators$Combine_Char$char(
																_elm_lang$core$Native_Utils.chr('x')),
															_elm_community$parser_combinators$Combine$regex('[0-9A-Fa-f]{2}')),
														function (l) {
															var _p0 = _rtfeldman$hex$Hex$fromString(
																_elm_lang$core$String$toLower(l));
															if (_p0.ctor === 'Ok') {
																return _elm_community$parser_combinators$Combine$succeed(
																	_elm_lang$core$Char$fromCode(_p0._0));
															} else {
																return _elm_community$parser_combinators$Combine$fail(_p0._0);
															}
														}),
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}));
var _user$project$Parser_Tokens$quotedSingleQuote = A2(
	_elm_community$parser_combinators$Combine_ops['<*'],
	A2(
		_elm_community$parser_combinators$Combine_ops['*>'],
		_elm_community$parser_combinators$Combine_Char$char(
			_elm_lang$core$Native_Utils.chr('\'')),
		_user$project$Parser_Tokens$escapedChar),
	_elm_community$parser_combinators$Combine_Char$char(
		_elm_lang$core$Native_Utils.chr('\'')));
var _user$project$Parser_Tokens$characterLiteral = A2(
	_elm_community$parser_combinators$Combine$or,
	_user$project$Parser_Tokens$quotedSingleQuote,
	A2(
		_elm_community$parser_combinators$Combine_ops['<*'],
		A2(
			_elm_community$parser_combinators$Combine_ops['*>'],
			_elm_community$parser_combinators$Combine_Char$char(
				_elm_lang$core$Native_Utils.chr('\'')),
			_elm_community$parser_combinators$Combine_Char$anyChar),
		_elm_community$parser_combinators$Combine_Char$char(
			_elm_lang$core$Native_Utils.chr('\''))));
var _user$project$Parser_Tokens$stringLiteral = A2(
	_elm_community$parser_combinators$Combine_ops['<*'],
	A2(
		_elm_community$parser_combinators$Combine_ops['*>'],
		_elm_community$parser_combinators$Combine_Char$char(
			_elm_lang$core$Native_Utils.chr('\"')),
		A2(
			_elm_community$parser_combinators$Combine_ops['<$>'],
			_elm_lang$core$String$concat,
			_elm_community$parser_combinators$Combine$many(
				_elm_community$parser_combinators$Combine$choice(
					{
						ctor: '::',
						_0: _elm_community$parser_combinators$Combine$regex('[^\\\\\\\"]+'),
						_1: {
							ctor: '::',
							_0: A2(_elm_community$parser_combinators$Combine_ops['<$>'], _elm_lang$core$String$fromChar, _user$project$Parser_Tokens$escapedChar),
							_1: {ctor: '[]'}
						}
					})))),
	_elm_community$parser_combinators$Combine_Char$char(
		_elm_lang$core$Native_Utils.chr('\"')));
var _user$project$Parser_Tokens$multiLineStringLiteral = A3(
	_elm_community$parser_combinators$Combine$between,
	_elm_community$parser_combinators$Combine$string('\"\"\"'),
	_elm_community$parser_combinators$Combine$string('\"\"\"'),
	A2(
		_elm_community$parser_combinators$Combine_ops['<$>'],
		_elm_lang$core$String$concat,
		_elm_community$parser_combinators$Combine$many(
			A2(
				_elm_community$parser_combinators$Combine$or,
				_elm_community$parser_combinators$Combine$regex('[^\\\\\\\"]+'),
				A2(
					_elm_community$parser_combinators$Combine_ops['>>='],
					_elm_community$parser_combinators$Combine$lookAhead(
						A2(_elm_community$parser_combinators$Combine$count, 3, _elm_community$parser_combinators$Combine_Char$anyChar)),
					function (x) {
						return _elm_lang$core$Native_Utils.eq(
							x,
							{
								ctor: '::',
								_0: _elm_lang$core$Native_Utils.chr('\"'),
								_1: {
									ctor: '::',
									_0: _elm_lang$core$Native_Utils.chr('\"'),
									_1: {
										ctor: '::',
										_0: _elm_lang$core$Native_Utils.chr('\"'),
										_1: {ctor: '[]'}
									}
								}
							}) ? _elm_community$parser_combinators$Combine$fail('end of input') : A2(
							_elm_community$parser_combinators$Combine_ops['<$>'],
							_elm_lang$core$String$fromChar,
							A2(_elm_community$parser_combinators$Combine$or, _user$project$Parser_Tokens$escapedChar, _elm_community$parser_combinators$Combine_Char$anyChar));
					})))));
var _user$project$Parser_Tokens$unitToken = _elm_community$parser_combinators$Combine$string('()');
var _user$project$Parser_Tokens$ofToken = _elm_community$parser_combinators$Combine$string('of');
var _user$project$Parser_Tokens$caseToken = _elm_community$parser_combinators$Combine$string('case');
var _user$project$Parser_Tokens$elseToken = _elm_community$parser_combinators$Combine$string('else');
var _user$project$Parser_Tokens$thenToken = _elm_community$parser_combinators$Combine$string('then');
var _user$project$Parser_Tokens$ifToken = _elm_community$parser_combinators$Combine$string('if');
var _user$project$Parser_Tokens$asToken = _elm_community$parser_combinators$Combine$string('as');
var _user$project$Parser_Tokens$importToken = _elm_community$parser_combinators$Combine$string('import');
var _user$project$Parser_Tokens$exposingToken = _elm_community$parser_combinators$Combine$string('exposing');
var _user$project$Parser_Tokens$moduleToken = _elm_community$parser_combinators$Combine$string('module');
var _user$project$Parser_Tokens$portToken = _elm_community$parser_combinators$Combine$string('port');
var _user$project$Parser_Tokens$reserved = _elm_lang$core$Dict$fromList(
	A2(
		_elm_lang$core$List$map,
		A2(
			_elm_lang$core$Basics$flip,
			F2(
				function (v0, v1) {
					return {ctor: '_Tuple2', _0: v0, _1: v1};
				}),
			true),
		{
			ctor: '::',
			_0: 'module',
			_1: {
				ctor: '::',
				_0: 'exposing',
				_1: {
					ctor: '::',
					_0: 'import',
					_1: {
						ctor: '::',
						_0: 'as',
						_1: {
							ctor: '::',
							_0: 'if',
							_1: {
								ctor: '::',
								_0: 'then',
								_1: {
									ctor: '::',
									_0: 'else',
									_1: {
										ctor: '::',
										_0: 'let',
										_1: {
											ctor: '::',
											_0: 'in',
											_1: {
												ctor: '::',
												_0: 'case',
												_1: {
													ctor: '::',
													_0: 'of',
													_1: {
														ctor: '::',
														_0: 'port',
														_1: {
															ctor: '::',
															_0: 'infixr',
															_1: {
																ctor: '::',
																_0: 'infixl',
																_1: {
																	ctor: '::',
																	_0: 'type',
																	_1: {
																		ctor: '::',
																		_0: 'where',
																		_1: {ctor: '[]'}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}));
var _user$project$Parser_Tokens$notReserved = function (match) {
	return A2(_elm_lang$core$Dict$member, match, _user$project$Parser_Tokens$reserved) ? _elm_community$parser_combinators$Combine$fail('functionName is reserved') : _elm_community$parser_combinators$Combine$succeed(match);
};
var _user$project$Parser_Tokens$functionName = A2(
	_elm_community$parser_combinators$Combine$or,
	_elm_community$parser_combinators$Combine$regex(_user$project$Parser_Tokens$functionNamePatternInfix),
	A2(
		_elm_community$parser_combinators$Combine_ops['>>='],
		_elm_community$parser_combinators$Combine$regex(_user$project$Parser_Tokens$functionNamePattern),
		_user$project$Parser_Tokens$notReserved));
var _user$project$Parser_Tokens$functionOrTypeName = A2(_elm_community$parser_combinators$Combine$or, _user$project$Parser_Tokens$functionName, _user$project$Parser_Tokens$typeName);

var _user$project$Parser_Whitespace$untilNewlineToken = _elm_community$parser_combinators$Combine$regex('[^\r\n]*');
var _user$project$Parser_Whitespace$realNewLine = _elm_community$parser_combinators$Combine$regex('\r?\n');
var _user$project$Parser_Whitespace$many1Spaces = _elm_community$parser_combinators$Combine$regex(' +');
var _user$project$Parser_Whitespace$manySpaces = _elm_community$parser_combinators$Combine$regex(' *');
var _user$project$Parser_Whitespace$nSpaces = function (x) {
	return _elm_community$parser_combinators$Combine$regex(
		A2(
			_elm_lang$core$Basics_ops['++'],
			' {',
			A2(
				_elm_lang$core$Basics_ops['++'],
				_elm_lang$core$Basics$toString(x),
				'}')));
};

var _user$project$Parser_State$getComments = function (_p0) {
	var _p1 = _p0;
	return _p1._0.comments;
};
var _user$project$Parser_State$currentIndent = function (_p2) {
	var _p3 = _p2;
	return A2(
		_elm_lang$core$Maybe$withDefault,
		0,
		_elm_lang$core$List$head(_p3._0.indents));
};
var _user$project$Parser_State$State = function (a) {
	return {ctor: 'State', _0: a};
};
var _user$project$Parser_State$emptyState = _user$project$Parser_State$State(
	{
		indents: {ctor: '[]'},
		comments: {ctor: '[]'}
	});
var _user$project$Parser_State$popIndent = function (_p4) {
	var _p5 = _p4;
	var _p6 = _p5._0;
	return _user$project$Parser_State$State(
		_elm_lang$core$Native_Utils.update(
			_p6,
			{
				indents: A2(_elm_lang$core$List$drop, 1, _p6.indents)
			}));
};
var _user$project$Parser_State$pushIndent = F2(
	function (x, _p7) {
		var _p8 = _p7;
		var _p9 = _p8._0;
		return _user$project$Parser_State$State(
			_elm_lang$core$Native_Utils.update(
				_p9,
				{
					indents: {ctor: '::', _0: x, _1: _p9.indents}
				}));
	});
var _user$project$Parser_State$addComment = F2(
	function (pair, _p10) {
		var _p11 = _p10;
		var _p12 = _p11._0;
		return _user$project$Parser_State$State(
			_elm_lang$core$Native_Utils.update(
				_p12,
				{
					comments: {ctor: '::', _0: pair, _1: _p12.comments}
				}));
	});

var _user$project$Parser_Ranges$asPointerLocation = function (_p0) {
	var _p1 = _p0;
	return {row: _p1.line, column: _p1.column};
};
var _user$project$Parser_Ranges$withRangeCustomStart = F2(
	function (_p2, p) {
		var _p3 = _p2;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			p,
			_elm_community$parser_combinators$Combine$withLocation(
				function (end) {
					return _elm_community$parser_combinators$Combine$succeed(
						{
							start: _p3.start,
							end: _user$project$Parser_Ranges$asPointerLocation(end)
						});
				}));
	});
var _user$project$Parser_Ranges$withRange = function (p) {
	return _elm_community$parser_combinators$Combine$withLocation(
		function (start) {
			return A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				p,
				_elm_community$parser_combinators$Combine$withLocation(
					function (end) {
						return _elm_community$parser_combinators$Combine$succeed(
							{
								start: _user$project$Parser_Ranges$asPointerLocation(start),
								end: _user$project$Parser_Ranges$asPointerLocation(end)
							});
					}));
		});
};
var _user$project$Parser_Ranges$withRangeTuple = function (p) {
	return _user$project$Parser_Ranges$withRange(
		A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			_elm_community$parser_combinators$Combine$succeed(
				F2(
					function (pv, r) {
						return {
							ctor: '_Tuple2',
							_0: r,
							_1: pv(r)
						};
					})),
			p));
};

var _user$project$Parser_Comments$multilineCommentInner = _elm_community$parser_combinators$Combine$lazy(
	function (_p0) {
		var _p1 = _p0;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<$>'],
			_elm_lang$core$String$concat,
			_elm_community$parser_combinators$Combine$sequence(
				{
					ctor: '::',
					_0: _elm_community$parser_combinators$Combine$string('{-'),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_community$parser_combinators$Combine_ops['<$>'],
							_elm_lang$core$String$concat,
							A2(
								_elm_community$parser_combinators$Combine$manyTill,
								A2(
									_elm_community$parser_combinators$Combine_ops['>>='],
									_elm_community$parser_combinators$Combine$lookAhead(
										A2(_elm_community$parser_combinators$Combine$count, 2, _elm_community$parser_combinators$Combine_Char$anyChar)),
									function (x) {
										return _elm_lang$core$Native_Utils.eq(
											x,
											{
												ctor: '::',
												_0: _elm_lang$core$Native_Utils.chr('{'),
												_1: {
													ctor: '::',
													_0: _elm_lang$core$Native_Utils.chr('-'),
													_1: {ctor: '[]'}
												}
											}) ? _user$project$Parser_Comments$multilineCommentInner : A2(_elm_community$parser_combinators$Combine_ops['<$>'], _elm_lang$core$String$fromChar, _elm_community$parser_combinators$Combine_Char$anyChar);
									}),
								_elm_community$parser_combinators$Combine$string('-}'))),
						_1: {
							ctor: '::',
							_0: _elm_community$parser_combinators$Combine$succeed('-}'),
							_1: {ctor: '[]'}
						}
					}
				}));
	});
var _user$project$Parser_Comments$addCommentToState = function (p) {
	return A2(
		_elm_community$parser_combinators$Combine_ops['>>='],
		p,
		function (pair) {
			return A2(
				_elm_community$parser_combinators$Combine_ops['*>'],
				_elm_community$parser_combinators$Combine$modifyState(
					_user$project$Parser_State$addComment(pair)),
				_elm_community$parser_combinators$Combine$succeed(
					{ctor: '_Tuple0'}));
		});
};
var _user$project$Parser_Comments$parseComment = function (commentParser) {
	return _user$project$Parser_Comments$addCommentToState(
		_user$project$Parser_Ranges$withRange(
			A2(
				_elm_community$parser_combinators$Combine_ops['<$>'],
				F2(
					function (v0, v1) {
						return {ctor: '_Tuple2', _0: v0, _1: v1};
					}),
				commentParser)));
};
var _user$project$Parser_Comments$singleLineComment = _user$project$Parser_Comments$parseComment(
	A2(
		_elm_community$parser_combinators$Combine_ops['<*>'],
		A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			_elm_community$parser_combinators$Combine$succeed(
				F2(
					function (x, y) {
						return A2(_elm_lang$core$Basics_ops['++'], x, y);
					})),
			_elm_community$parser_combinators$Combine$string('--')),
		_user$project$Parser_Whitespace$untilNewlineToken));
var _user$project$Parser_Comments$multilineComment = _elm_community$parser_combinators$Combine$lazy(
	function (_p2) {
		var _p3 = _p2;
		return _user$project$Parser_Comments$parseComment(_user$project$Parser_Comments$multilineCommentInner);
	});

var _user$project$Parser_Util$newLineWithIndentPlus = function (state) {
	return _elm_community$parser_combinators$Combine$many1(
		A2(
			_elm_community$parser_combinators$Combine_ops['*>'],
			A2(
				_elm_community$parser_combinators$Combine_ops['*>'],
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					_user$project$Parser_Whitespace$realNewLine,
					_elm_community$parser_combinators$Combine$many(
						A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Whitespace$manySpaces, _user$project$Parser_Whitespace$realNewLine))),
				_user$project$Parser_Whitespace$nSpaces(
					_user$project$Parser_State$currentIndent(state))),
			_user$project$Parser_Whitespace$many1Spaces));
};
var _user$project$Parser_Util$newLineWithIndentExact = function (state) {
	return A2(
		_elm_community$parser_combinators$Combine_ops['*>'],
		A2(
			_elm_community$parser_combinators$Combine_ops['*>'],
			_user$project$Parser_Whitespace$realNewLine,
			_elm_community$parser_combinators$Combine$many(
				A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Whitespace$manySpaces, _user$project$Parser_Whitespace$realNewLine))),
		_user$project$Parser_Whitespace$nSpaces(
			_user$project$Parser_State$currentIndent(state)));
};
var _user$project$Parser_Util$newLineWithSomeIndent = _elm_community$parser_combinators$Combine$many1(
	A2(_elm_community$parser_combinators$Combine_ops['<*'], _user$project$Parser_Whitespace$realNewLine, _user$project$Parser_Whitespace$manySpaces));
var _user$project$Parser_Util$multiLineCommentWithTrailingSpaces = A2(_elm_community$parser_combinators$Combine_ops['<*'], _user$project$Parser_Comments$multilineComment, _user$project$Parser_Whitespace$manySpaces);
var _user$project$Parser_Util$someComment = A2(_elm_community$parser_combinators$Combine$or, _user$project$Parser_Comments$singleLineComment, _user$project$Parser_Util$multiLineCommentWithTrailingSpaces);
var _user$project$Parser_Util$commentSequence = A2(
	_elm_community$parser_combinators$Combine_ops['<$'],
	{ctor: '_Tuple0'},
	_elm_community$parser_combinators$Combine$many(
		A2(
			_elm_community$parser_combinators$Combine$or,
			_user$project$Parser_Util$someComment,
			A2(
				_elm_community$parser_combinators$Combine_ops['*>'],
				A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Whitespace$realNewLine, _user$project$Parser_Whitespace$manySpaces),
				_user$project$Parser_Util$someComment))));
var _user$project$Parser_Util$moreThanIndentWhitespace = _elm_community$parser_combinators$Combine$withState(
	function (state) {
		return _elm_community$parser_combinators$Combine$choice(
			{
				ctor: '::',
				_0: A2(
					_elm_community$parser_combinators$Combine_ops['<$'],
					{ctor: '_Tuple0'},
					A2(
						_elm_community$parser_combinators$Combine_ops['<*'],
						_elm_community$parser_combinators$Combine$regex(
							A2(
								_elm_lang$core$Basics_ops['++'],
								'(( *\\n)+ {',
								A2(
									_elm_lang$core$Basics_ops['++'],
									_elm_lang$core$Basics$toString(
										_user$project$Parser_State$currentIndent(state)),
									'} +| +)'))),
						_elm_community$parser_combinators$Combine$lookAhead(
							_elm_community$parser_combinators$Combine$regex('[a-zA-Z0-9\\(\\+/*\\|\\>]')))),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_community$parser_combinators$Combine_ops['<$'],
						{ctor: '_Tuple0'},
						_elm_community$parser_combinators$Combine$many1(
							A2(
								_elm_community$parser_combinators$Combine_ops['*>'],
								A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Whitespace$manySpaces, _user$project$Parser_Util$commentSequence),
								_user$project$Parser_Util$newLineWithIndentPlus(state)))),
					_1: {
						ctor: '::',
						_0: A2(
							_elm_community$parser_combinators$Combine_ops['<*'],
							A2(
								_elm_community$parser_combinators$Combine_ops['<$'],
								{ctor: '_Tuple0'},
								_user$project$Parser_Whitespace$many1Spaces),
							_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$someComment)),
						_1: {ctor: '[]'}
					}
				}
			});
	});
var _user$project$Parser_Util$trimmed = function (x) {
	return A2(
		_elm_community$parser_combinators$Combine_ops['<*'],
		A2(
			_elm_community$parser_combinators$Combine_ops['*>'],
			_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$moreThanIndentWhitespace),
			x),
		_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$moreThanIndentWhitespace));
};
var _user$project$Parser_Util$exactIndentWhitespace = _elm_community$parser_combinators$Combine$withState(
	function (state) {
		return _elm_community$parser_combinators$Combine$choice(
			{
				ctor: '::',
				_0: A2(
					_elm_community$parser_combinators$Combine_ops['<$'],
					{ctor: '_Tuple0'},
					A2(
						_elm_community$parser_combinators$Combine_ops['<*'],
						_elm_community$parser_combinators$Combine$regex(
							A2(
								_elm_lang$core$Basics_ops['++'],
								'( *\\n)+ {',
								A2(
									_elm_lang$core$Basics_ops['++'],
									_elm_lang$core$Basics$toString(
										_user$project$Parser_State$currentIndent(state)),
									'}'))),
						_elm_community$parser_combinators$Combine$lookAhead(
							_elm_community$parser_combinators$Combine$regex('[a-zA-Z0-9\\(\\+/*\\|\\>]')))),
				_1: {
					ctor: '::',
					_0: A2(
						_elm_community$parser_combinators$Combine_ops['<$'],
						{ctor: '_Tuple0'},
						_elm_community$parser_combinators$Combine$many1(
							A2(
								_elm_community$parser_combinators$Combine_ops['*>'],
								A2(
									_elm_community$parser_combinators$Combine_ops['*>'],
									_user$project$Parser_Whitespace$manySpaces,
									_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$someComment)),
								_user$project$Parser_Util$newLineWithIndentExact(state)))),
					_1: {ctor: '[]'}
				}
			});
	});
var _user$project$Parser_Util$unstrictIndentWhitespace = _elm_community$parser_combinators$Combine$many1(
	A2(
		_elm_community$parser_combinators$Combine_ops['<*'],
		A2(
			_elm_community$parser_combinators$Combine_ops['<*'],
			_user$project$Parser_Whitespace$manySpaces,
			_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$someComment)),
		_user$project$Parser_Util$newLineWithSomeIndent));
var _user$project$Parser_Util$asPointer = function (p) {
	return _user$project$Parser_Ranges$withRange(
		A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$VariablePointer, p));
};

var _user$project$Parser_Expose$definitionExpose = _user$project$Parser_Ranges$withRange(
	A2(
		_elm_community$parser_combinators$Combine$or,
		A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$FunctionExpose, _user$project$Parser_Tokens$functionName),
		A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$TypeOrAliasExpose, _user$project$Parser_Tokens$typeName)));
var _user$project$Parser_Expose$exposingListInner = function (p) {
	return A2(
		_elm_community$parser_combinators$Combine$or,
		_user$project$Parser_Ranges$withRange(
			A2(
				_elm_community$parser_combinators$Combine_ops['<$'],
				_user$project$AST_Types$All,
				_user$project$Parser_Util$trimmed(
					_elm_community$parser_combinators$Combine$string('..')))),
		A2(
			_elm_community$parser_combinators$Combine_ops['<$>'],
			_user$project$AST_Types$Explicit,
			A2(
				_elm_community$parser_combinators$Combine$sepBy,
				_elm_community$parser_combinators$Combine_Char$char(
					_elm_lang$core$Native_Utils.chr(',')),
				_user$project$Parser_Util$trimmed(p))));
};
var _user$project$Parser_Expose$exposeListWith = function (p) {
	return _elm_community$parser_combinators$Combine$parens(
		_user$project$Parser_Expose$exposingListInner(p));
};
var _user$project$Parser_Expose$valueConstructorExpose = _user$project$Parser_Ranges$withRange(
	A2(
		_elm_community$parser_combinators$Combine_ops['<$>'],
		F2(
			function (v0, v1) {
				return {ctor: '_Tuple2', _0: v0, _1: v1};
			}),
		_user$project$Parser_Tokens$typeName));
var _user$project$Parser_Expose$exposedType = _user$project$Parser_Ranges$withRange(
	A2(
		_elm_community$parser_combinators$Combine_ops['<*>'],
		A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$ExposedType),
			_user$project$Parser_Tokens$typeName),
		A2(
			_elm_community$parser_combinators$Combine_ops['*>'],
			_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$moreThanIndentWhitespace),
			_user$project$Parser_Expose$exposeListWith(_user$project$Parser_Expose$valueConstructorExpose))));
var _user$project$Parser_Expose$typeExpose = A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$TypeExpose, _user$project$Parser_Expose$exposedType);
var _user$project$Parser_Expose$infixExpose = _user$project$Parser_Ranges$withRange(
	A2(
		_elm_community$parser_combinators$Combine_ops['<$>'],
		_user$project$AST_Types$InfixExpose,
		_elm_community$parser_combinators$Combine$parens(
			_elm_community$parser_combinators$Combine$while(
				F2(
					function (x, y) {
						return !_elm_lang$core$Native_Utils.eq(x, y);
					})(
					_elm_lang$core$Native_Utils.chr(')'))))));
var _user$project$Parser_Expose$exposable = _elm_community$parser_combinators$Combine$choice(
	{
		ctor: '::',
		_0: _user$project$Parser_Expose$typeExpose,
		_1: {
			ctor: '::',
			_0: _user$project$Parser_Expose$infixExpose,
			_1: {
				ctor: '::',
				_0: _user$project$Parser_Expose$definitionExpose,
				_1: {ctor: '[]'}
			}
		}
	});
var _user$project$Parser_Expose$exposeDefinition = function (p) {
	return _elm_community$parser_combinators$Combine$choice(
		{
			ctor: '::',
			_0: A2(
				_elm_community$parser_combinators$Combine_ops['*>'],
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Util$moreThanIndentWhitespace, _user$project$Parser_Tokens$exposingToken),
					_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$moreThanIndentWhitespace)),
				_user$project$Parser_Expose$exposeListWith(p)),
			_1: {
				ctor: '::',
				_0: _elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$None),
				_1: {ctor: '[]'}
			}
		});
};

var _user$project$Parser_Imports$importDefinition = _user$project$Parser_Ranges$withRange(
	A2(
		_elm_community$parser_combinators$Combine_ops['<*>'],
		A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$Import),
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Tokens$importToken, _user$project$Parser_Util$moreThanIndentWhitespace),
					_user$project$Parser_Tokens$moduleName)),
			_elm_community$parser_combinators$Combine$maybe(
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					A2(
						_elm_community$parser_combinators$Combine_ops['*>'],
						A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Util$moreThanIndentWhitespace, _user$project$Parser_Tokens$asToken),
						_user$project$Parser_Util$moreThanIndentWhitespace),
					_user$project$Parser_Tokens$moduleName))),
		_user$project$Parser_Expose$exposeDefinition(_user$project$Parser_Expose$exposable)));

var _user$project$Parser_Modules$portModuleDefinition = A2(
	_elm_community$parser_combinators$Combine_ops['<$>'],
	_user$project$AST_Types$PortModule,
	A2(
		_elm_community$parser_combinators$Combine_ops['<*>'],
		A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$DefaultModuleData),
			A2(
				_elm_community$parser_combinators$Combine_ops['*>'],
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					A2(
						_elm_community$parser_combinators$Combine_ops['*>'],
						A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Tokens$portToken, _user$project$Parser_Util$moreThanIndentWhitespace),
						_user$project$Parser_Tokens$moduleToken),
					_user$project$Parser_Util$moreThanIndentWhitespace),
				_user$project$Parser_Tokens$moduleName)),
		_user$project$Parser_Expose$exposeDefinition(_user$project$Parser_Expose$exposable)));
var _user$project$Parser_Modules$normalModuleDefinition = A2(
	_elm_community$parser_combinators$Combine_ops['<$>'],
	_user$project$AST_Types$NormalModule,
	A2(
		_elm_community$parser_combinators$Combine_ops['<*>'],
		A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$DefaultModuleData),
			A2(
				_elm_community$parser_combinators$Combine_ops['*>'],
				A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Tokens$moduleToken, _user$project$Parser_Util$moreThanIndentWhitespace),
				_user$project$Parser_Tokens$moduleName)),
		_user$project$Parser_Expose$exposeDefinition(_user$project$Parser_Expose$exposable)));
var _user$project$Parser_Modules$effectWhereClause = A2(
	_elm_community$parser_combinators$Combine_ops['<*>'],
	A2(
		_elm_community$parser_combinators$Combine_ops['<*>'],
		_elm_community$parser_combinators$Combine$succeed(
			F2(
				function (v0, v1) {
					return {ctor: '_Tuple2', _0: v0, _1: v1};
				})),
		_user$project$Parser_Tokens$functionName),
	A2(
		_elm_community$parser_combinators$Combine_ops['*>'],
		_user$project$Parser_Util$trimmed(
			_elm_community$parser_combinators$Combine$string('=')),
		_user$project$Parser_Tokens$typeName));
var _user$project$Parser_Modules$whereBlock = A2(
	_elm_community$parser_combinators$Combine_ops['<$>'],
	function (pairs) {
		return {
			command: A2(
				_elm_lang$core$Maybe$map,
				_elm_lang$core$Tuple$second,
				_elm_lang$core$List$head(
					A2(
						_elm_lang$core$List$filter,
						function (_p0) {
							return A2(
								F2(
									function (x, y) {
										return _elm_lang$core$Native_Utils.eq(x, y);
									}),
								'command',
								_elm_lang$core$Tuple$first(_p0));
						},
						pairs))),
			subscription: A2(
				_elm_lang$core$Maybe$map,
				_elm_lang$core$Tuple$second,
				_elm_lang$core$List$head(
					A2(
						_elm_lang$core$List$filter,
						function (_p1) {
							return A2(
								F2(
									function (x, y) {
										return _elm_lang$core$Native_Utils.eq(x, y);
									}),
								'subscription',
								_elm_lang$core$Tuple$first(_p1));
						},
						pairs)))
		};
	},
	A3(
		_elm_community$parser_combinators$Combine$between,
		_elm_community$parser_combinators$Combine$string('{'),
		_elm_community$parser_combinators$Combine$string('}'),
		A2(
			_elm_community$parser_combinators$Combine$sepBy1,
			_elm_community$parser_combinators$Combine$string(','),
			_user$project$Parser_Util$trimmed(_user$project$Parser_Modules$effectWhereClause))));
var _user$project$Parser_Modules$effectWhereClauses = A2(
	_elm_community$parser_combinators$Combine_ops['*>'],
	A2(
		_elm_community$parser_combinators$Combine_ops['*>'],
		_elm_community$parser_combinators$Combine$string('where'),
		_user$project$Parser_Util$moreThanIndentWhitespace),
	_user$project$Parser_Modules$whereBlock);
var _user$project$Parser_Modules$effectModuleDefinition = function () {
	var createEffectModule = F3(
		function (name, whereClauses, exp) {
			return _user$project$AST_Types$EffectModule(
				{moduleName: name, exposingList: exp, command: whereClauses.command, subscription: whereClauses.subscription});
		});
	return A2(
		_elm_community$parser_combinators$Combine_ops['<*>'],
		A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				_elm_community$parser_combinators$Combine$succeed(createEffectModule),
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					A2(
						_elm_community$parser_combinators$Combine_ops['*>'],
						A2(
							_elm_community$parser_combinators$Combine_ops['*>'],
							A2(
								_elm_community$parser_combinators$Combine_ops['*>'],
								_elm_community$parser_combinators$Combine$string('effect'),
								_user$project$Parser_Util$moreThanIndentWhitespace),
							_user$project$Parser_Tokens$moduleToken),
						_user$project$Parser_Util$moreThanIndentWhitespace),
					_user$project$Parser_Tokens$moduleName)),
			A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Util$moreThanIndentWhitespace, _user$project$Parser_Modules$effectWhereClauses)),
		_user$project$Parser_Expose$exposeDefinition(_user$project$Parser_Expose$exposable));
}();
var _user$project$Parser_Modules$noModule = _elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$NoModule);
var _user$project$Parser_Modules$moduleDefinition = _elm_community$parser_combinators$Combine$choice(
	{
		ctor: '::',
		_0: _user$project$Parser_Modules$normalModuleDefinition,
		_1: {
			ctor: '::',
			_0: _user$project$Parser_Modules$portModuleDefinition,
			_1: {
				ctor: '::',
				_0: _user$project$Parser_Modules$effectModuleDefinition,
				_1: {
					ctor: '::',
					_0: _user$project$Parser_Modules$noModule,
					_1: {ctor: '[]'}
				}
			}
		}
	});

var _user$project$Parser_Infix$infixDirection = _elm_community$parser_combinators$Combine$choice(
	{
		ctor: '::',
		_0: A2(
			_elm_community$parser_combinators$Combine_ops['<$'],
			_user$project$AST_Types$Right,
			_elm_community$parser_combinators$Combine$string('infixr')),
		_1: {
			ctor: '::',
			_0: A2(
				_elm_community$parser_combinators$Combine_ops['<$'],
				_user$project$AST_Types$Left,
				A2(
					_elm_community$parser_combinators$Combine$or,
					_elm_community$parser_combinators$Combine$string('infixl'),
					_elm_community$parser_combinators$Combine$string('infix'))),
			_1: {ctor: '[]'}
		}
	});
var _user$project$Parser_Infix$infixDefinition = A2(
	_elm_community$parser_combinators$Combine_ops['<*>'],
	A2(
		_elm_community$parser_combinators$Combine_ops['<*>'],
		A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$Infix),
			_user$project$Parser_Infix$infixDirection),
		A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Util$moreThanIndentWhitespace, _elm_community$parser_combinators$Combine_Num$int)),
	A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Util$moreThanIndentWhitespace, _user$project$Parser_Tokens$prefixOperatorToken));

var _user$project$Parser_Patterns$unitPattern = _elm_community$parser_combinators$Combine$lazy(
	function (_p0) {
		var _p1 = _p0;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<$'],
			_user$project$AST_Types$UnitPattern,
			_elm_community$parser_combinators$Combine$string('()'));
	});
var _user$project$Parser_Patterns$allPattern = _elm_community$parser_combinators$Combine$lazy(
	function (_p2) {
		var _p3 = _p2;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<$'],
			_user$project$AST_Types$AllPattern,
			_elm_community$parser_combinators$Combine$string('_'));
	});
var _user$project$Parser_Patterns$qualifiedNameRef = A2(
	_elm_community$parser_combinators$Combine_ops['<*>'],
	A2(
		_elm_community$parser_combinators$Combine_ops['<*>'],
		_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$QualifiedNameRef),
		_elm_community$parser_combinators$Combine$many(
			A2(
				_elm_community$parser_combinators$Combine_ops['<*'],
				_user$project$Parser_Tokens$typeName,
				_elm_community$parser_combinators$Combine$string('.')))),
	_user$project$Parser_Tokens$typeName);
var _user$project$Parser_Patterns$qualifiedNamePattern = A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$QualifiedNamePattern, _user$project$Parser_Patterns$qualifiedNameRef);
var _user$project$Parser_Patterns$varPattern = _elm_community$parser_combinators$Combine$lazy(
	function (_p4) {
		var _p5 = _p4;
		return A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$VarPattern, _user$project$Parser_Tokens$functionName);
	});
var _user$project$Parser_Patterns$recordPattern = _elm_community$parser_combinators$Combine$lazy(
	function (_p6) {
		var _p7 = _p6;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<$>'],
			_user$project$AST_Types$RecordPattern,
			A3(
				_elm_community$parser_combinators$Combine$between,
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					_elm_community$parser_combinators$Combine$string('{'),
					_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$moreThanIndentWhitespace)),
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$moreThanIndentWhitespace),
					_elm_community$parser_combinators$Combine$string('}')),
				A2(
					_elm_community$parser_combinators$Combine$sepBy1,
					_elm_community$parser_combinators$Combine$string(','),
					_user$project$Parser_Util$trimmed(
						_user$project$Parser_Util$asPointer(_user$project$Parser_Tokens$functionName)))));
	});
var _user$project$Parser_Patterns$asPattern2 = function (p) {
	return _elm_community$parser_combinators$Combine$lazy(
		function (_p8) {
			var _p9 = _p8;
			return A2(
				_elm_community$parser_combinators$Combine_ops['<$>'],
				_user$project$AST_Types$AsPattern(p),
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					A2(
						_elm_community$parser_combinators$Combine_ops['*>'],
						A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Util$moreThanIndentWhitespace, _user$project$Parser_Tokens$asToken),
						_user$project$Parser_Util$moreThanIndentWhitespace),
					_user$project$Parser_Util$asPointer(_user$project$Parser_Tokens$functionName)));
		});
};
var _user$project$Parser_Patterns$floatPattern = _elm_community$parser_combinators$Combine$lazy(
	function (_p10) {
		var _p11 = _p10;
		return A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$FloatPattern, _elm_community$parser_combinators$Combine_Num$float);
	});
var _user$project$Parser_Patterns$intPattern = _elm_community$parser_combinators$Combine$lazy(
	function (_p12) {
		var _p13 = _p12;
		return A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$IntPattern, _elm_community$parser_combinators$Combine_Num$int);
	});
var _user$project$Parser_Patterns$stringPattern = _elm_community$parser_combinators$Combine$lazy(
	function (_p14) {
		var _p15 = _p14;
		return A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$StringPattern, _user$project$Parser_Tokens$stringLiteral);
	});
var _user$project$Parser_Patterns$charPattern = _elm_community$parser_combinators$Combine$lazy(
	function (_p16) {
		var _p17 = _p16;
		return A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$CharPattern, _user$project$Parser_Tokens$characterLiteral);
	});
var _user$project$Parser_Patterns$pattern = _elm_community$parser_combinators$Combine$lazy(
	function (_p18) {
		var _p19 = _p18;
		return A2(
			_elm_community$parser_combinators$Combine_ops['>>='],
			_user$project$Parser_Ranges$withRangeTuple(
				_elm_community$parser_combinators$Combine$choice(
					{
						ctor: '::',
						_0: _user$project$Parser_Patterns$declarablePatternRangeless,
						_1: {
							ctor: '::',
							_0: _user$project$Parser_Patterns$variablePattern,
							_1: {
								ctor: '::',
								_0: _user$project$Parser_Patterns$namedPattern,
								_1: {ctor: '[]'}
							}
						}
					})),
			_user$project$Parser_Patterns$promoteToCompositePattern);
	});
var _user$project$Parser_Patterns$declarablePatternRangeless = _elm_community$parser_combinators$Combine$lazy(
	function (_p20) {
		var _p21 = _p20;
		return _elm_community$parser_combinators$Combine$choice(
			{
				ctor: '::',
				_0: _user$project$Parser_Patterns$allPattern,
				_1: {
					ctor: '::',
					_0: _user$project$Parser_Patterns$tuplePattern,
					_1: {
						ctor: '::',
						_0: _user$project$Parser_Patterns$recordPattern,
						_1: {ctor: '[]'}
					}
				}
			});
	});
var _user$project$Parser_Patterns$tuplePattern = _elm_community$parser_combinators$Combine$lazy(
	function (_p22) {
		var _p23 = _p22;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<$>'],
			_user$project$AST_Types$TuplePattern,
			_elm_community$parser_combinators$Combine$parens(
				A2(
					_elm_community$parser_combinators$Combine$sepBy1,
					_elm_community$parser_combinators$Combine$string(','),
					_user$project$Parser_Util$trimmed(_user$project$Parser_Patterns$pattern))));
	});
var _user$project$Parser_Patterns$namedPattern = _elm_community$parser_combinators$Combine$lazy(
	function (_p24) {
		var _p25 = _p24;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$NamedPattern),
				_user$project$Parser_Patterns$qualifiedNameRef),
			_elm_community$parser_combinators$Combine$many(
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					_user$project$Parser_Util$moreThanIndentWhitespace,
					_user$project$Parser_Ranges$withRange(
						A2(_elm_community$parser_combinators$Combine$or, _user$project$Parser_Patterns$qualifiedNamePattern, _user$project$Parser_Patterns$nonNamedPattern)))));
	});
var _user$project$Parser_Patterns$nonNamedPattern = _elm_community$parser_combinators$Combine$lazy(
	function (_p26) {
		var _p27 = _p26;
		return _elm_community$parser_combinators$Combine$choice(
			{
				ctor: '::',
				_0: _user$project$Parser_Patterns$declarablePatternRangeless,
				_1: {
					ctor: '::',
					_0: _user$project$Parser_Patterns$asPattern,
					_1: {
						ctor: '::',
						_0: _user$project$Parser_Patterns$variablePattern,
						_1: {ctor: '[]'}
					}
				}
			});
	});
var _user$project$Parser_Patterns$asPattern = _elm_community$parser_combinators$Combine$lazy(
	function (_p28) {
		var _p29 = _p28;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$AsPattern),
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$moreThanIndentWhitespace),
					_user$project$Parser_Ranges$withRange(_user$project$Parser_Patterns$nonAsPattern))),
			A2(
				_elm_community$parser_combinators$Combine_ops['*>'],
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Util$moreThanIndentWhitespace, _user$project$Parser_Tokens$asToken),
					_user$project$Parser_Util$moreThanIndentWhitespace),
				_user$project$Parser_Util$asPointer(_user$project$Parser_Tokens$functionName)));
	});
var _user$project$Parser_Patterns$nonAsPattern = _elm_community$parser_combinators$Combine$lazy(
	function (_p30) {
		var _p31 = _p30;
		return _elm_community$parser_combinators$Combine$choice(
			{
				ctor: '::',
				_0: _user$project$Parser_Patterns$declarablePatternRangeless,
				_1: {
					ctor: '::',
					_0: _user$project$Parser_Patterns$variablePattern,
					_1: {
						ctor: '::',
						_0: _user$project$Parser_Patterns$namedPattern,
						_1: {ctor: '[]'}
					}
				}
			});
	});
var _user$project$Parser_Patterns$variablePattern = _elm_community$parser_combinators$Combine$lazy(
	function (_p32) {
		var _p33 = _p32;
		return _elm_community$parser_combinators$Combine$choice(
			{
				ctor: '::',
				_0: _user$project$Parser_Patterns$allPattern,
				_1: {
					ctor: '::',
					_0: _user$project$Parser_Patterns$charPattern,
					_1: {
						ctor: '::',
						_0: _user$project$Parser_Patterns$stringPattern,
						_1: {
							ctor: '::',
							_0: _user$project$Parser_Patterns$floatPattern,
							_1: {
								ctor: '::',
								_0: _user$project$Parser_Patterns$intPattern,
								_1: {
									ctor: '::',
									_0: _user$project$Parser_Patterns$unitPattern,
									_1: {
										ctor: '::',
										_0: _user$project$Parser_Patterns$varPattern,
										_1: {
											ctor: '::',
											_0: _user$project$Parser_Patterns$listPattern,
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}
				}
			});
	});
var _user$project$Parser_Patterns$listPattern = _elm_community$parser_combinators$Combine$lazy(
	function (_p34) {
		var _p35 = _p34;
		return A3(
			_elm_community$parser_combinators$Combine$between,
			_elm_community$parser_combinators$Combine$string('['),
			_elm_community$parser_combinators$Combine$string(']'),
			A2(
				_elm_community$parser_combinators$Combine_ops['<$>'],
				_user$project$AST_Types$ListPattern,
				A2(
					_elm_community$parser_combinators$Combine$sepBy,
					_elm_community$parser_combinators$Combine$string(','),
					_user$project$Parser_Util$trimmed(_user$project$Parser_Patterns$pattern))));
	});
var _user$project$Parser_Patterns$promoteToCompositePattern = function (_p36) {
	var _p37 = _p36;
	var _p38 = _p37._1;
	return A2(
		_elm_community$parser_combinators$Combine$or,
		A2(
			_user$project$Parser_Ranges$withRangeCustomStart,
			_p37._0,
			_elm_community$parser_combinators$Combine$choice(
				{
					ctor: '::',
					_0: _user$project$Parser_Patterns$unConsPattern2(_p38),
					_1: {
						ctor: '::',
						_0: _user$project$Parser_Patterns$asPattern2(_p38),
						_1: {ctor: '[]'}
					}
				})),
		_elm_community$parser_combinators$Combine$succeed(_p38));
};
var _user$project$Parser_Patterns$unConsPattern2 = function (p) {
	return _elm_community$parser_combinators$Combine$lazy(
		function (_p39) {
			var _p40 = _p39;
			return A2(
				_elm_community$parser_combinators$Combine_ops['<$>'],
				_user$project$AST_Types$UnConsPattern(p),
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					_user$project$Parser_Util$trimmed(
						_elm_community$parser_combinators$Combine$string('::')),
					_user$project$Parser_Patterns$pattern));
		});
};
var _user$project$Parser_Patterns$declarablePattern = _elm_community$parser_combinators$Combine$lazy(
	function (_p41) {
		var _p42 = _p41;
		return _user$project$Parser_Ranges$withRange(_user$project$Parser_Patterns$declarablePatternRangeless);
	});

var _user$project$Parser_TypeReference$genericTypeReference = _elm_community$parser_combinators$Combine$lazy(
	function (_p0) {
		var _p1 = _p0;
		return A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$GenericType, _user$project$Parser_Tokens$functionName);
	});
var _user$project$Parser_TypeReference$asTypeReference = function (x) {
	var _p2 = x;
	if (_p2.ctor === '[]') {
		return _user$project$AST_Types$Unit;
	} else {
		if (_p2._1.ctor === '[]') {
			return _elm_lang$core$Basics$always(_p2._0);
		} else {
			return _user$project$AST_Types$Tupled(_p2);
		}
	}
};
var _user$project$Parser_TypeReference$typeReferenceNoFn = _elm_community$parser_combinators$Combine$lazy(
	function (_p3) {
		var _p4 = _p3;
		return _user$project$Parser_Ranges$withRange(
			_elm_community$parser_combinators$Combine$choice(
				{
					ctor: '::',
					_0: _user$project$Parser_TypeReference$parensTypeReference,
					_1: {
						ctor: '::',
						_0: _user$project$Parser_TypeReference$typedTypeReference,
						_1: {
							ctor: '::',
							_0: _user$project$Parser_TypeReference$recordTypeReference,
							_1: {
								ctor: '::',
								_0: _user$project$Parser_TypeReference$genericRecordTypeReference,
								_1: {
									ctor: '::',
									_0: _user$project$Parser_TypeReference$genericTypeReference,
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}));
	});
var _user$project$Parser_TypeReference$genericRecordTypeReference = _elm_community$parser_combinators$Combine$lazy(
	function (_p5) {
		var _p6 = _p5;
		return A3(
			_elm_community$parser_combinators$Combine$between,
			_elm_community$parser_combinators$Combine$string('{'),
			A2(
				_elm_community$parser_combinators$Combine_ops['*>'],
				_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Whitespace$realNewLine),
				_elm_community$parser_combinators$Combine$string('}')),
			A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				A2(
					_elm_community$parser_combinators$Combine_ops['<*>'],
					_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$GenericRecord),
					A2(
						_elm_community$parser_combinators$Combine_ops['*>'],
						_elm_community$parser_combinators$Combine$maybe(_elm_community$parser_combinators$Combine$whitespace),
						_user$project$Parser_Tokens$functionName)),
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					A2(
						_elm_community$parser_combinators$Combine_ops['*>'],
						A2(
							_elm_community$parser_combinators$Combine_ops['*>'],
							_elm_community$parser_combinators$Combine$maybe(_elm_community$parser_combinators$Combine$whitespace),
							_elm_community$parser_combinators$Combine$string('|')),
						_elm_community$parser_combinators$Combine$maybe(_elm_community$parser_combinators$Combine$whitespace)),
					_user$project$Parser_TypeReference$recordFieldsTypeReference)));
	});
var _user$project$Parser_TypeReference$recordFieldsTypeReference = _elm_community$parser_combinators$Combine$lazy(
	function (_p7) {
		var _p8 = _p7;
		return A2(
			_elm_community$parser_combinators$Combine$sepBy,
			_elm_community$parser_combinators$Combine$string(','),
			_user$project$Parser_Util$trimmed(_user$project$Parser_TypeReference$recordFieldDefinition));
	});
var _user$project$Parser_TypeReference$recordFieldDefinition = _elm_community$parser_combinators$Combine$lazy(
	function (_p9) {
		var _p10 = _p9;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				_elm_community$parser_combinators$Combine$succeed(
					F2(
						function (v0, v1) {
							return {ctor: '_Tuple2', _0: v0, _1: v1};
						})),
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$moreThanIndentWhitespace),
					_user$project$Parser_Tokens$functionName)),
			A2(
				_elm_community$parser_combinators$Combine_ops['*>'],
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					A2(
						_elm_community$parser_combinators$Combine_ops['*>'],
						_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$moreThanIndentWhitespace),
						_elm_community$parser_combinators$Combine$string(':')),
					_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$moreThanIndentWhitespace)),
				_user$project$Parser_TypeReference$typeReference));
	});
var _user$project$Parser_TypeReference$typeReference = _elm_community$parser_combinators$Combine$lazy(
	function (_p11) {
		var _p12 = _p11;
		return _user$project$Parser_Ranges$withRange(
			A2(
				_elm_community$parser_combinators$Combine_ops['>>='],
				_user$project$Parser_TypeReference$typeReferenceNoFn,
				function (typeRef) {
					return A2(
						_elm_community$parser_combinators$Combine$or,
						A2(
							_elm_community$parser_combinators$Combine_ops['<$>'],
							_user$project$AST_Types$FunctionTypeReference(typeRef),
							A2(
								_elm_community$parser_combinators$Combine_ops['*>'],
								_user$project$Parser_Util$trimmed(
									_elm_community$parser_combinators$Combine$string('->')),
								_user$project$Parser_TypeReference$typeReference)),
						_elm_community$parser_combinators$Combine$succeed(
							_elm_lang$core$Basics$always(typeRef)));
				}));
	});
var _user$project$Parser_TypeReference$parensTypeReference = _elm_community$parser_combinators$Combine$lazy(
	function (_p13) {
		var _p14 = _p13;
		return A2(
			_elm_community$parser_combinators$Combine$map,
			_user$project$Parser_TypeReference$asTypeReference,
			_elm_community$parser_combinators$Combine$parens(
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$moreThanIndentWhitespace),
					A2(
						_elm_community$parser_combinators$Combine$sepBy,
						_elm_community$parser_combinators$Combine$string(','),
						_user$project$Parser_Util$trimmed(_user$project$Parser_TypeReference$typeReference)))));
	});
var _user$project$Parser_TypeReference$recordTypeReference = _elm_community$parser_combinators$Combine$lazy(
	function (_p15) {
		var _p16 = _p15;
		return A3(
			_elm_community$parser_combinators$Combine$between,
			_elm_community$parser_combinators$Combine$string('{'),
			A2(
				_elm_community$parser_combinators$Combine_ops['*>'],
				_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Whitespace$realNewLine),
				_elm_community$parser_combinators$Combine$string('}')),
			A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$Record, _user$project$Parser_TypeReference$recordFieldsTypeReference));
	});
var _user$project$Parser_TypeReference$typedTypeReference = _elm_community$parser_combinators$Combine$lazy(
	function (_p17) {
		var _p18 = _p17;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				A2(
					_elm_community$parser_combinators$Combine_ops['<*>'],
					_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$Typed),
					_elm_community$parser_combinators$Combine$many(
						A2(
							_elm_community$parser_combinators$Combine_ops['<*'],
							_user$project$Parser_Tokens$typeName,
							_elm_community$parser_combinators$Combine$string('.')))),
				_user$project$Parser_Tokens$typeName),
			A2(
				_elm_community$parser_combinators$Combine_ops['<$>'],
				_elm_lang$core$Maybe$withDefault(
					{ctor: '[]'}),
				_elm_community$parser_combinators$Combine$maybe(
					A2(
						_elm_community$parser_combinators$Combine_ops['*>'],
						_user$project$Parser_Util$moreThanIndentWhitespace,
						A2(_elm_community$parser_combinators$Combine$sepBy, _user$project$Parser_Util$moreThanIndentWhitespace, _user$project$Parser_TypeReference$typeReferenceNoFn)))));
	});

var _user$project$Parser_Typings$typePrefix = A2(
	_elm_community$parser_combinators$Combine_ops['*>'],
	_elm_community$parser_combinators$Combine$string('type'),
	_user$project$Parser_Util$moreThanIndentWhitespace);
var _user$project$Parser_Typings$typeAliasPrefix = A2(
	_elm_community$parser_combinators$Combine_ops['*>'],
	A2(
		_elm_community$parser_combinators$Combine_ops['*>'],
		_user$project$Parser_Typings$typePrefix,
		_elm_community$parser_combinators$Combine$string('alias')),
	_user$project$Parser_Util$moreThanIndentWhitespace);
var _user$project$Parser_Typings$genericList = _elm_community$parser_combinators$Combine$many(
	A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Util$moreThanIndentWhitespace, _user$project$Parser_Tokens$functionName));
var _user$project$Parser_Typings$typeAlias = _user$project$Parser_Ranges$withRange(
	A2(
		_elm_community$parser_combinators$Combine_ops['<*>'],
		A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				_elm_community$parser_combinators$Combine$succeed(
					_user$project$AST_Types$TypeAlias(_elm_lang$core$Maybe$Nothing)),
				A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Typings$typeAliasPrefix, _user$project$Parser_Tokens$typeName)),
			_user$project$Parser_Typings$genericList),
		A2(
			_elm_community$parser_combinators$Combine_ops['*>'],
			_user$project$Parser_Util$trimmed(
				_elm_community$parser_combinators$Combine$string('=')),
			_user$project$Parser_TypeReference$typeReference)));
var _user$project$Parser_Typings$valueConstructor = _user$project$Parser_Ranges$withRange(
	A2(
		_elm_community$parser_combinators$Combine_ops['<*>'],
		A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$ValueConstructor),
			_user$project$Parser_Tokens$typeName),
		_elm_community$parser_combinators$Combine$many(
			A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Util$moreThanIndentWhitespace, _user$project$Parser_TypeReference$typeReference))));
var _user$project$Parser_Typings$valueConstructors = A2(
	_elm_community$parser_combinators$Combine$sepBy,
	_elm_community$parser_combinators$Combine$string('|'),
	_user$project$Parser_Util$trimmed(_user$project$Parser_Typings$valueConstructor));
var _user$project$Parser_Typings$typeDeclaration = A2(
	_elm_community$parser_combinators$Combine_ops['<*>'],
	A2(
		_elm_community$parser_combinators$Combine_ops['<*>'],
		A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$Type),
			A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Typings$typePrefix, _user$project$Parser_Tokens$typeName)),
		_user$project$Parser_Typings$genericList),
	A2(
		_elm_community$parser_combinators$Combine_ops['*>'],
		_user$project$Parser_Util$trimmed(
			_elm_community$parser_combinators$Combine$string('=')),
		_user$project$Parser_Typings$valueConstructors));

var _user$project$Parser_Declarations$recordAccessFunctionExpression = A2(
	_elm_community$parser_combinators$Combine_ops['<$>'],
	function (_p0) {
		return _user$project$AST_Types$RecordAccessFunction(
			A2(
				F2(
					function (x, y) {
						return A2(_elm_lang$core$Basics_ops['++'], x, y);
					}),
				'.',
				_p0));
	},
	A2(
		_elm_community$parser_combinators$Combine_ops['*>'],
		_elm_community$parser_combinators$Combine$string('.'),
		_user$project$Parser_Tokens$functionName));
var _user$project$Parser_Declarations$qualifiedExpression = _elm_community$parser_combinators$Combine$lazy(
	function (_p1) {
		var _p2 = _p1;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$QualifiedExpr),
				_elm_community$parser_combinators$Combine$many1(
					A2(
						_elm_community$parser_combinators$Combine_ops['<*'],
						_user$project$Parser_Tokens$typeName,
						_elm_community$parser_combinators$Combine$string('.')))),
			A2(_elm_community$parser_combinators$Combine$or, _user$project$Parser_Tokens$functionName, _user$project$Parser_Tokens$typeName));
	});
var _user$project$Parser_Declarations$functionOrValueExpression = _elm_community$parser_combinators$Combine$lazy(
	function (_p3) {
		var _p4 = _p3;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<$>'],
			_user$project$AST_Types$FunctionOrValue,
			_elm_community$parser_combinators$Combine$choice(
				{
					ctor: '::',
					_0: _user$project$Parser_Tokens$functionName,
					_1: {
						ctor: '::',
						_0: _user$project$Parser_Tokens$typeName,
						_1: {ctor: '[]'}
					}
				}));
	});
var _user$project$Parser_Declarations$operatorExpression = A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$Operator, _user$project$Parser_Tokens$infixOperatorToken);
var _user$project$Parser_Declarations$prefixOperatorExpression = A2(
	_elm_community$parser_combinators$Combine_ops['<$>'],
	_user$project$AST_Types$PrefixOperator,
	_elm_community$parser_combinators$Combine$parens(_user$project$Parser_Tokens$prefixOperatorToken));
var _user$project$Parser_Declarations$floatableExpression = A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$Floatable, _elm_community$parser_combinators$Combine_Num$float);
var _user$project$Parser_Declarations$integerExpression = A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$Integer, _elm_community$parser_combinators$Combine_Num$int);
var _user$project$Parser_Declarations$charLiteralExpression = A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$CharLiteral, _user$project$Parser_Tokens$characterLiteral);
var _user$project$Parser_Declarations$literalExpression = A2(
	_elm_community$parser_combinators$Combine_ops['<$>'],
	_user$project$AST_Types$Literal,
	A2(_elm_community$parser_combinators$Combine$or, _user$project$Parser_Tokens$multiLineStringLiteral, _user$project$Parser_Tokens$stringLiteral));
var _user$project$Parser_Declarations$emptyListExpression = A2(
	_elm_community$parser_combinators$Combine_ops['<$'],
	_user$project$AST_Types$ListExpr(
		{ctor: '[]'}),
	A2(
		_elm_community$parser_combinators$Combine_ops['*>'],
		A2(
			_elm_community$parser_combinators$Combine_ops['*>'],
			_elm_community$parser_combinators$Combine$string('['),
			_elm_community$parser_combinators$Combine$maybe(
				_elm_community$parser_combinators$Combine$choice(
					{
						ctor: '::',
						_0: _user$project$Parser_Util$moreThanIndentWhitespace,
						_1: {
							ctor: '::',
							_0: _user$project$Parser_Util$exactIndentWhitespace,
							_1: {
								ctor: '::',
								_0: _user$project$Parser_Util$trimmed(_user$project$Parser_Util$commentSequence),
								_1: {ctor: '[]'}
							}
						}
					}))),
		_elm_community$parser_combinators$Combine$string(']')));
var _user$project$Parser_Declarations$glslExpression = A2(
	_elm_community$parser_combinators$Combine_ops['<$>'],
	function (_p5) {
		return _user$project$AST_Types$GLSLExpression(
			_elm_lang$core$String$fromList(_p5));
	},
	A3(
		_elm_community$parser_combinators$Combine$between,
		_elm_community$parser_combinators$Combine$string('[glsl|'),
		_elm_community$parser_combinators$Combine$string('|]'),
		_elm_community$parser_combinators$Combine$many(
			A2(
				_elm_community$parser_combinators$Combine_ops['>>='],
				_elm_community$parser_combinators$Combine$lookAhead(
					A2(
						_elm_community$parser_combinators$Combine_ops['<$>'],
						_elm_lang$core$String$fromList,
						A2(_elm_community$parser_combinators$Combine$count, 2, _elm_community$parser_combinators$Combine_Char$anyChar))),
				function (s) {
					return _elm_lang$core$Native_Utils.eq(s, '|]') ? _elm_community$parser_combinators$Combine$fail('end symbol') : _elm_community$parser_combinators$Combine_Char$anyChar;
				}))));
var _user$project$Parser_Declarations$unitExpression = A2(
	_elm_community$parser_combinators$Combine_ops['<$'],
	_user$project$AST_Types$UnitExpr,
	_elm_community$parser_combinators$Combine$string('()'));
var _user$project$Parser_Declarations$withIndentedState2 = function (p) {
	return _elm_community$parser_combinators$Combine$withLocation(
		function (location) {
			var x = _elm_lang$core$List$length(
				A2(
					_elm_community$list_extra$List_Extra$takeWhile,
					F2(
						function (x, y) {
							return _elm_lang$core$Native_Utils.eq(x, y);
						})(
						_elm_lang$core$Native_Utils.chr(' ')),
					_elm_lang$core$String$toList(location.source)));
			return A2(
				_elm_community$parser_combinators$Combine_ops['<*'],
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					_elm_community$parser_combinators$Combine$modifyState(
						_user$project$Parser_State$pushIndent(x)),
					p),
				_elm_community$parser_combinators$Combine$modifyState(_user$project$Parser_State$popIndent));
		});
};
var _user$project$Parser_Declarations$withIndentedState = function (p) {
	return _elm_community$parser_combinators$Combine$withLocation(
		function (location) {
			return A2(
				_elm_community$parser_combinators$Combine_ops['<*'],
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					_elm_community$parser_combinators$Combine$modifyState(
						_user$project$Parser_State$pushIndent(location.column + 1)),
					p),
				_elm_community$parser_combinators$Combine$modifyState(_user$project$Parser_State$popIndent));
		});
};
var _user$project$Parser_Declarations$rangedExpressionWithStart = F2(
	function (r, p) {
		return A2(
			_user$project$Parser_Ranges$withRangeCustomStart,
			r,
			A2(
				_elm_community$parser_combinators$Combine_ops['<$>'],
				_elm_lang$core$Basics$flip(
					F2(
						function (v0, v1) {
							return {ctor: '_Tuple2', _0: v0, _1: v1};
						})),
				p));
	});
var _user$project$Parser_Declarations$rangedExpression = function (p) {
	return _user$project$Parser_Ranges$withRange(
		A2(
			_elm_community$parser_combinators$Combine_ops['<$>'],
			_elm_lang$core$Basics$flip(
				F2(
					function (v0, v1) {
						return {ctor: '_Tuple2', _0: v0, _1: v1};
					})),
			p));
};
var _user$project$Parser_Declarations$liftRecordAccess = function (e) {
	return A2(
		_elm_community$parser_combinators$Combine$or,
		A2(
			_elm_community$parser_combinators$Combine_ops['>>='],
			_user$project$Parser_Declarations$rangedExpression(
				A2(
					_elm_community$parser_combinators$Combine_ops['<$>'],
					_user$project$AST_Types$RecordAccess(e),
					A2(
						_elm_community$parser_combinators$Combine_ops['*>'],
						_elm_community$parser_combinators$Combine$string('.'),
						_user$project$Parser_Tokens$functionName))),
			_user$project$Parser_Declarations$liftRecordAccess),
		_elm_community$parser_combinators$Combine$succeed(e));
};
var _user$project$Parser_Declarations$functionArgument = _user$project$Parser_Patterns$pattern;
var _user$project$Parser_Declarations$signature = _user$project$Parser_Ranges$withRange(
	A2(
		_elm_community$parser_combinators$Combine_ops['<*>'],
		A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$FunctionSignature),
				A2(
					_elm_community$parser_combinators$Combine_ops['>>='],
					_elm_community$parser_combinators$Combine$lookAhead(_elm_community$parser_combinators$Combine_Char$anyChar),
					function (c) {
						return _elm_community$parser_combinators$Combine$succeed(
							_elm_lang$core$Native_Utils.eq(
								c,
								_elm_lang$core$Native_Utils.chr('(')));
					})),
			A2(
				_elm_community$parser_combinators$Combine$or,
				_user$project$Parser_Tokens$functionName,
				_elm_community$parser_combinators$Combine$parens(_user$project$Parser_Tokens$prefixOperatorToken))),
		A2(
			_elm_community$parser_combinators$Combine_ops['*>'],
			A2(
				_elm_community$parser_combinators$Combine_ops['*>'],
				_user$project$Parser_Util$trimmed(
					_elm_community$parser_combinators$Combine$string(':')),
				_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$moreThanIndentWhitespace)),
			_user$project$Parser_TypeReference$typeReference)));
var _user$project$Parser_Declarations$portDeclaration = A2(
	_elm_community$parser_combinators$Combine_ops['*>'],
	_user$project$Parser_Tokens$portToken,
	_elm_community$parser_combinators$Combine$lazy(
		function (_p6) {
			var _p7 = _p6;
			return A2(
				_elm_community$parser_combinators$Combine_ops['<$>'],
				_user$project$AST_Types$PortDeclaration,
				A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Util$moreThanIndentWhitespace, _user$project$Parser_Declarations$signature));
		}));
var _user$project$Parser_Declarations$infixDeclaration = _elm_community$parser_combinators$Combine$lazy(
	function (_p8) {
		var _p9 = _p8;
		return A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$InfixDeclaration, _user$project$Parser_Infix$infixDefinition);
	});
var _user$project$Parser_Declarations$function = _elm_community$parser_combinators$Combine$lazy(
	function (_p10) {
		var _p11 = _p10;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				A2(
					_elm_community$parser_combinators$Combine_ops['<*>'],
					_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$Function),
					_elm_community$parser_combinators$Combine$succeed(_elm_lang$core$Maybe$Nothing)),
				_elm_community$parser_combinators$Combine$maybe(
					A2(_elm_community$parser_combinators$Combine_ops['<*'], _user$project$Parser_Declarations$signature, _user$project$Parser_Util$exactIndentWhitespace))),
			_user$project$Parser_Declarations$functionDeclaration);
	});
var _user$project$Parser_Declarations$functionDeclaration = _elm_community$parser_combinators$Combine$lazy(
	function (_p12) {
		var _p13 = _p12;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				A2(
					_elm_community$parser_combinators$Combine_ops['<*>'],
					A2(
						_elm_community$parser_combinators$Combine_ops['<*>'],
						_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$FunctionDeclaration),
						A2(
							_elm_community$parser_combinators$Combine_ops['>>='],
							_elm_community$parser_combinators$Combine$lookAhead(_elm_community$parser_combinators$Combine_Char$anyChar),
							function (c) {
								return _elm_community$parser_combinators$Combine$succeed(
									_elm_lang$core$Native_Utils.eq(
										c,
										_elm_lang$core$Native_Utils.chr('(')));
							})),
					_user$project$Parser_Util$asPointer(
						A2(
							_elm_community$parser_combinators$Combine$or,
							_user$project$Parser_Tokens$functionName,
							_elm_community$parser_combinators$Combine$parens(_user$project$Parser_Tokens$prefixOperatorToken)))),
				_elm_community$parser_combinators$Combine$many(
					A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Util$moreThanIndentWhitespace, _user$project$Parser_Declarations$functionArgument))),
			A2(
				_elm_community$parser_combinators$Combine_ops['*>'],
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					A2(
						_elm_community$parser_combinators$Combine_ops['*>'],
						_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$moreThanIndentWhitespace),
						_elm_community$parser_combinators$Combine$string('=')),
					_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$moreThanIndentWhitespace)),
				_user$project$Parser_Declarations$expression));
	});
var _user$project$Parser_Declarations$expression = _elm_community$parser_combinators$Combine$lazy(
	function (_p14) {
		var _p15 = _p14;
		return A2(
			_elm_community$parser_combinators$Combine_ops['>>='],
			_user$project$Parser_Declarations$expressionNotApplication,
			function (expr) {
				return A2(
					_elm_community$parser_combinators$Combine$or,
					_user$project$Parser_Declarations$promoteToApplicationExpression(expr),
					_elm_community$parser_combinators$Combine$succeed(expr));
			});
	});
var _user$project$Parser_Declarations$expressionNotApplication = _elm_community$parser_combinators$Combine$lazy(
	function (_p16) {
		var _p17 = _p16;
		return A2(
			_elm_community$parser_combinators$Combine_ops['>>='],
			_user$project$Parser_Declarations$rangedExpression(
				_elm_community$parser_combinators$Combine$choice(
					{
						ctor: '::',
						_0: _user$project$Parser_Declarations$unitExpression,
						_1: {
							ctor: '::',
							_0: _user$project$Parser_Declarations$qualifiedExpression,
							_1: {
								ctor: '::',
								_0: _user$project$Parser_Declarations$functionOrValueExpression,
								_1: {
									ctor: '::',
									_0: _user$project$Parser_Declarations$ifBlockExpression,
									_1: {
										ctor: '::',
										_0: _user$project$Parser_Declarations$prefixOperatorExpression,
										_1: {
											ctor: '::',
											_0: _user$project$Parser_Declarations$tupledExpression,
											_1: {
												ctor: '::',
												_0: _user$project$Parser_Declarations$recordAccessFunctionExpression,
												_1: {
													ctor: '::',
													_0: _user$project$Parser_Declarations$negationExpression,
													_1: {
														ctor: '::',
														_0: _user$project$Parser_Declarations$operatorExpression,
														_1: {
															ctor: '::',
															_0: _user$project$Parser_Declarations$floatableExpression,
															_1: {
																ctor: '::',
																_0: _user$project$Parser_Declarations$integerExpression,
																_1: {
																	ctor: '::',
																	_0: _user$project$Parser_Declarations$letExpression,
																	_1: {
																		ctor: '::',
																		_0: _user$project$Parser_Declarations$lambdaExpression,
																		_1: {
																			ctor: '::',
																			_0: _user$project$Parser_Declarations$literalExpression,
																			_1: {
																				ctor: '::',
																				_0: _user$project$Parser_Declarations$charLiteralExpression,
																				_1: {
																					ctor: '::',
																					_0: _user$project$Parser_Declarations$recordExpression,
																					_1: {
																						ctor: '::',
																						_0: _user$project$Parser_Declarations$recordUpdateExpression,
																						_1: {
																							ctor: '::',
																							_0: _user$project$Parser_Declarations$glslExpression,
																							_1: {
																								ctor: '::',
																								_0: _user$project$Parser_Declarations$listExpression,
																								_1: {
																									ctor: '::',
																									_0: _user$project$Parser_Declarations$caseExpression,
																									_1: {ctor: '[]'}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					})),
			_user$project$Parser_Declarations$liftRecordAccess);
	});
var _user$project$Parser_Declarations$caseExpression = _elm_community$parser_combinators$Combine$lazy(
	function (_p18) {
		var _p19 = _p18;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<$>'],
			_user$project$AST_Types$CaseExpression,
			A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				A2(
					_elm_community$parser_combinators$Combine_ops['<*>'],
					_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$CaseBlock),
					_user$project$Parser_Declarations$caseBlock),
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					_user$project$Parser_Util$moreThanIndentWhitespace,
					_user$project$Parser_Declarations$withIndentedState(_user$project$Parser_Declarations$caseStatements))));
	});
var _user$project$Parser_Declarations$caseBlock = _elm_community$parser_combinators$Combine$lazy(
	function (_p20) {
		var _p21 = _p20;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<*'],
			A2(
				_elm_community$parser_combinators$Combine_ops['<*'],
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Tokens$caseToken, _user$project$Parser_Util$moreThanIndentWhitespace),
					_user$project$Parser_Declarations$expression),
				_user$project$Parser_Util$moreThanIndentWhitespace),
			_user$project$Parser_Tokens$ofToken);
	});
var _user$project$Parser_Declarations$caseStatements = _elm_community$parser_combinators$Combine$lazy(
	function (_p22) {
		var _p23 = _p22;
		return A2(_elm_community$parser_combinators$Combine$sepBy1, _user$project$Parser_Util$exactIndentWhitespace, _user$project$Parser_Declarations$caseStatement);
	});
var _user$project$Parser_Declarations$caseStatement = _elm_community$parser_combinators$Combine$lazy(
	function (_p24) {
		var _p25 = _p24;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				_elm_community$parser_combinators$Combine$succeed(
					F2(
						function (v0, v1) {
							return {ctor: '_Tuple2', _0: v0, _1: v1};
						})),
				_user$project$Parser_Patterns$pattern),
			A2(
				_elm_community$parser_combinators$Combine_ops['*>'],
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					A2(
						_elm_community$parser_combinators$Combine_ops['*>'],
						_elm_community$parser_combinators$Combine$maybe(
							A2(_elm_community$parser_combinators$Combine$or, _user$project$Parser_Util$moreThanIndentWhitespace, _user$project$Parser_Util$exactIndentWhitespace)),
						_elm_community$parser_combinators$Combine$string('->')),
					_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$moreThanIndentWhitespace)),
				_user$project$Parser_Declarations$expression));
	});
var _user$project$Parser_Declarations$ifBlockExpression = A2(
	_elm_community$parser_combinators$Combine_ops['*>'],
	_user$project$Parser_Tokens$ifToken,
	_elm_community$parser_combinators$Combine$lazy(
		function (_p26) {
			var _p27 = _p26;
			return A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				A2(
					_elm_community$parser_combinators$Combine_ops['<*>'],
					A2(
						_elm_community$parser_combinators$Combine_ops['<*>'],
						_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$IfBlock),
						_user$project$Parser_Util$trimmed(_user$project$Parser_Declarations$expression)),
					A2(
						_elm_community$parser_combinators$Combine_ops['*>'],
						_user$project$Parser_Tokens$thenToken,
						_user$project$Parser_Util$trimmed(_user$project$Parser_Declarations$expression))),
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Tokens$elseToken, _user$project$Parser_Util$moreThanIndentWhitespace),
					_user$project$Parser_Declarations$expression));
		}));
var _user$project$Parser_Declarations$lambdaExpression = _elm_community$parser_combinators$Combine$lazy(
	function (_p28) {
		var _p29 = _p28;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				_elm_community$parser_combinators$Combine$succeed(
					F2(
						function (args, expr) {
							return _user$project$AST_Types$LambdaExpression(
								A2(_user$project$AST_Types$Lambda, args, expr));
						})),
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					A2(
						_elm_community$parser_combinators$Combine_ops['*>'],
						_elm_community$parser_combinators$Combine$string('\\'),
						_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$moreThanIndentWhitespace)),
					A2(_elm_community$parser_combinators$Combine$sepBy1, _user$project$Parser_Util$moreThanIndentWhitespace, _user$project$Parser_Declarations$functionArgument))),
			A2(
				_elm_community$parser_combinators$Combine_ops['*>'],
				_user$project$Parser_Util$trimmed(
					_elm_community$parser_combinators$Combine$string('->')),
				_user$project$Parser_Declarations$expression));
	});
var _user$project$Parser_Declarations$letExpression = _elm_community$parser_combinators$Combine$lazy(
	function (_p30) {
		var _p31 = _p30;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				_elm_community$parser_combinators$Combine$succeed(
					function (decls) {
						return function (_p32) {
							return _user$project$AST_Types$LetExpression(
								A2(_user$project$AST_Types$LetBlock, decls, _p32));
						};
					}),
				_user$project$Parser_Declarations$withIndentedState2(_user$project$Parser_Declarations$letBlock)),
			A2(_elm_community$parser_combinators$Combine_ops['*>'], _user$project$Parser_Util$moreThanIndentWhitespace, _user$project$Parser_Declarations$expression));
	});
var _user$project$Parser_Declarations$letBlock = _elm_community$parser_combinators$Combine$lazy(
	function (_p33) {
		var _p34 = _p33;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<*'],
			A2(
				_elm_community$parser_combinators$Combine_ops['*>'],
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					_elm_community$parser_combinators$Combine$string('let'),
					_user$project$Parser_Util$moreThanIndentWhitespace),
				_user$project$Parser_Declarations$withIndentedState(_user$project$Parser_Declarations$letBody)),
			A2(
				_elm_community$parser_combinators$Combine_ops['*>'],
				_elm_community$parser_combinators$Combine$choice(
					{
						ctor: '::',
						_0: _user$project$Parser_Util$unstrictIndentWhitespace,
						_1: {
							ctor: '::',
							_0: A2(_elm_community$parser_combinators$Combine_ops['<$>'], _elm_lang$core$List$singleton, _user$project$Parser_Whitespace$manySpaces),
							_1: {ctor: '[]'}
						}
					}),
				_elm_community$parser_combinators$Combine$string('in')));
	});
var _user$project$Parser_Declarations$letBody = _elm_community$parser_combinators$Combine$lazy(
	function (_p35) {
		var _p36 = _p35;
		return A2(
			_elm_community$parser_combinators$Combine$sepBy1,
			_user$project$Parser_Util$exactIndentWhitespace,
			A2(
				_elm_community$parser_combinators$Combine$or,
				_user$project$Parser_Declarations$destructuringDeclaration,
				A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$FuncDecl, _user$project$Parser_Declarations$function)));
	});
var _user$project$Parser_Declarations$destructuringDeclaration = _elm_community$parser_combinators$Combine$lazy(
	function (_p37) {
		var _p38 = _p37;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<$>'],
			_user$project$AST_Types$DestructuringDeclaration,
			A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				A2(
					_elm_community$parser_combinators$Combine_ops['<*>'],
					_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$Destructuring),
					_user$project$Parser_Patterns$declarablePattern),
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					A2(
						_elm_community$parser_combinators$Combine_ops['*>'],
						A2(
							_elm_community$parser_combinators$Combine_ops['*>'],
							_user$project$Parser_Util$moreThanIndentWhitespace,
							_elm_community$parser_combinators$Combine$string('=')),
						_user$project$Parser_Util$moreThanIndentWhitespace),
					_user$project$Parser_Declarations$expression)));
	});
var _user$project$Parser_Declarations$listExpression = _elm_community$parser_combinators$Combine$lazy(
	function (_p39) {
		var _p40 = _p39;
		return A2(
			_elm_community$parser_combinators$Combine$or,
			_user$project$Parser_Declarations$emptyListExpression,
			A2(
				_elm_community$parser_combinators$Combine_ops['<$>'],
				_user$project$AST_Types$ListExpr,
				A3(
					_elm_community$parser_combinators$Combine$between,
					_elm_community$parser_combinators$Combine$string('['),
					_elm_community$parser_combinators$Combine$string(']'),
					A2(
						_elm_community$parser_combinators$Combine$sepBy,
						_elm_community$parser_combinators$Combine$string(','),
						_user$project$Parser_Util$trimmed(_user$project$Parser_Declarations$expression)))));
	});
var _user$project$Parser_Declarations$negationExpression = _elm_community$parser_combinators$Combine$lazy(
	function (_p41) {
		var _p42 = _p41;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<$>'],
			_user$project$AST_Types$Negation,
			A2(
				_elm_community$parser_combinators$Combine_ops['*>'],
				_elm_community$parser_combinators$Combine$string('-'),
				A2(
					_elm_community$parser_combinators$Combine_ops['>>='],
					_user$project$Parser_Declarations$rangedExpression(
						_elm_community$parser_combinators$Combine$choice(
							{
								ctor: '::',
								_0: _user$project$Parser_Declarations$qualifiedExpression,
								_1: {
									ctor: '::',
									_0: _user$project$Parser_Declarations$functionOrValueExpression,
									_1: {
										ctor: '::',
										_0: _user$project$Parser_Declarations$integerExpression,
										_1: {
											ctor: '::',
											_0: _user$project$Parser_Declarations$floatableExpression,
											_1: {
												ctor: '::',
												_0: _user$project$Parser_Declarations$tupledExpression,
												_1: {ctor: '[]'}
											}
										}
									}
								}
							})),
					_user$project$Parser_Declarations$liftRecordAccess)));
	});
var _user$project$Parser_Declarations$tupledExpression = _elm_community$parser_combinators$Combine$lazy(
	function (_p43) {
		var _p44 = _p43;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<$>'],
			function (l) {
				var _p45 = l;
				if ((_p45.ctor === '::') && (_p45._1.ctor === '[]')) {
					return _user$project$AST_Types$ParenthesizedExpression(_p45._0);
				} else {
					return _user$project$AST_Types$TupledExpression(_p45);
				}
			},
			_elm_community$parser_combinators$Combine$parens(
				A2(
					_elm_community$parser_combinators$Combine$sepBy1,
					_elm_community$parser_combinators$Combine$string(','),
					_user$project$Parser_Util$trimmed(_user$project$Parser_Declarations$expression))));
	});
var _user$project$Parser_Declarations$recordExpression = _elm_community$parser_combinators$Combine$lazy(
	function (_p46) {
		var _p47 = _p46;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<$>'],
			_user$project$AST_Types$RecordExpr,
			A3(
				_elm_community$parser_combinators$Combine$between,
				_elm_community$parser_combinators$Combine$string('{'),
				_elm_community$parser_combinators$Combine$string('}'),
				_user$project$Parser_Declarations$recordFields(false)));
	});
var _user$project$Parser_Declarations$recordFields = function (oneOrMore) {
	var p = oneOrMore ? _elm_community$parser_combinators$Combine$sepBy1 : _elm_community$parser_combinators$Combine$sepBy;
	return A2(
		p,
		_elm_community$parser_combinators$Combine$string(','),
		_user$project$Parser_Util$trimmed(_user$project$Parser_Declarations$recordExpressionField));
};
var _user$project$Parser_Declarations$recordExpressionField = _elm_community$parser_combinators$Combine$lazy(
	function (_p48) {
		var _p49 = _p48;
		return A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				_elm_community$parser_combinators$Combine$succeed(
					F2(
						function (v0, v1) {
							return {ctor: '_Tuple2', _0: v0, _1: v1};
						})),
				_user$project$Parser_Tokens$functionName),
			A2(
				_elm_community$parser_combinators$Combine_ops['*>'],
				A2(
					_elm_community$parser_combinators$Combine_ops['*>'],
					A2(
						_elm_community$parser_combinators$Combine_ops['*>'],
						_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$moreThanIndentWhitespace),
						_elm_community$parser_combinators$Combine$string('=')),
					_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$moreThanIndentWhitespace)),
				_user$project$Parser_Declarations$expression));
	});
var _user$project$Parser_Declarations$recordUpdateExpression = _elm_community$parser_combinators$Combine$lazy(
	function (_p50) {
		var _p51 = _p50;
		return A3(
			_elm_community$parser_combinators$Combine$between,
			_elm_community$parser_combinators$Combine$string('{'),
			_elm_community$parser_combinators$Combine$string('}'),
			A2(
				_elm_community$parser_combinators$Combine_ops['<$>'],
				_user$project$AST_Types$RecordUpdateExpression,
				A2(
					_elm_community$parser_combinators$Combine_ops['<*>'],
					A2(
						_elm_community$parser_combinators$Combine_ops['<*>'],
						_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$RecordUpdate),
						_user$project$Parser_Util$trimmed(_user$project$Parser_Tokens$functionName)),
					A2(
						_elm_community$parser_combinators$Combine_ops['*>'],
						_elm_community$parser_combinators$Combine$string('|'),
						_user$project$Parser_Declarations$recordFields(true)))));
	});
var _user$project$Parser_Declarations$promoteToApplicationExpression = function (expr) {
	return _elm_community$parser_combinators$Combine$lazy(
		function (_p52) {
			var _p53 = _p52;
			return A2(
				_user$project$Parser_Declarations$rangedExpressionWithStart,
				_elm_lang$core$Tuple$first(expr),
				A2(
					_elm_community$parser_combinators$Combine_ops['<*>'],
					_elm_community$parser_combinators$Combine$succeed(
						function (rest) {
							return _user$project$AST_Types$Application(
								{ctor: '::', _0: expr, _1: rest});
						}),
					_elm_community$parser_combinators$Combine$lazy(
						function (_p54) {
							var _p55 = _p54;
							return _elm_community$parser_combinators$Combine$many1(
								A2(
									_elm_community$parser_combinators$Combine_ops['*>'],
									_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$moreThanIndentWhitespace),
									_user$project$Parser_Declarations$expressionNotApplication));
						})));
		});
};
var _user$project$Parser_Declarations$declaration = _elm_community$parser_combinators$Combine$lazy(
	function (_p56) {
		var _p57 = _p56;
		return _elm_community$parser_combinators$Combine$choice(
			{
				ctor: '::',
				_0: A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$AliasDecl, _user$project$Parser_Typings$typeAlias),
				_1: {
					ctor: '::',
					_0: A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$FuncDecl, _user$project$Parser_Declarations$function),
					_1: {
						ctor: '::',
						_0: A2(_elm_community$parser_combinators$Combine_ops['<$>'], _user$project$AST_Types$TypeDecl, _user$project$Parser_Typings$typeDeclaration),
						_1: {
							ctor: '::',
							_0: _user$project$Parser_Declarations$portDeclaration,
							_1: {
								ctor: '::',
								_0: _user$project$Parser_Declarations$infixDeclaration,
								_1: {
									ctor: '::',
									_0: _user$project$Parser_Declarations$destructuringDeclaration,
									_1: {ctor: '[]'}
								}
							}
						}
					}
				}
			});
	});

var _user$project$Parser_File$fileDeclarations = A2(
	_elm_community$parser_combinators$Combine_ops['<*'],
	A2(
		_elm_community$parser_combinators$Combine_ops['<*'],
		A2(_elm_community$parser_combinators$Combine$sepBy, _user$project$Parser_Util$exactIndentWhitespace, _user$project$Parser_Declarations$declaration),
		_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$exactIndentWhitespace)),
	_user$project$Parser_Whitespace$manySpaces);
var _user$project$Parser_File$collectComments = _elm_community$parser_combinators$Combine$withState(
	function (_p0) {
		return _elm_community$parser_combinators$Combine$succeed(
			_user$project$Parser_State$getComments(_p0));
	});
var _user$project$Parser_File$file = A2(
	_elm_community$parser_combinators$Combine_ops['<*>'],
	A2(
		_elm_community$parser_combinators$Combine_ops['<*>'],
		A2(
			_elm_community$parser_combinators$Combine_ops['<*>'],
			A2(
				_elm_community$parser_combinators$Combine_ops['<*>'],
				_elm_community$parser_combinators$Combine$succeed(_user$project$AST_Types$File),
				A2(
					_elm_community$parser_combinators$Combine_ops['<*'],
					A2(
						_elm_community$parser_combinators$Combine_ops['*>'],
						_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$exactIndentWhitespace),
						_user$project$Parser_Modules$moduleDefinition),
					_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$exactIndentWhitespace))),
			A2(
				_elm_community$parser_combinators$Combine_ops['<*'],
				A2(_elm_community$parser_combinators$Combine$sepBy, _user$project$Parser_Util$exactIndentWhitespace, _user$project$Parser_Imports$importDefinition),
				_elm_community$parser_combinators$Combine$maybe(_user$project$Parser_Util$exactIndentWhitespace))),
		_user$project$Parser_File$fileDeclarations),
	_user$project$Parser_File$collectComments);

var _user$project$Parser_Parser$withEnd = function (p) {
	return A2(
		_elm_community$parser_combinators$Combine_ops['<*'],
		p,
		_elm_community$parser_combinators$Combine$withLocation(
			function (s) {
				return A2(
					_elm_community$parser_combinators$Combine$mapError,
					function (_p0) {
						return {
							ctor: '::',
							_0: A2(
								_elm_lang$core$Basics_ops['++'],
								'Could not continue parsing on location ',
								_elm_lang$core$Basics$toString(
									{ctor: '_Tuple2', _0: s.line, _1: s.column})),
							_1: {ctor: '[]'}
						};
					},
					_elm_community$parser_combinators$Combine$end);
			}));
};
var _user$project$Parser_Parser$parse = function (input) {
	var _p1 = A3(
		_elm_community$parser_combinators$Combine$runParser,
		_user$project$Parser_Parser$withEnd(_user$project$Parser_File$file),
		_user$project$Parser_State$emptyState,
		A2(_elm_lang$core$Basics_ops['++'], input, '\n'));
	if (_p1.ctor === 'Ok') {
		return _elm_lang$core$Result$Ok(_p1._0._2);
	} else {
		return _elm_lang$core$Result$Err(_p1._0._2);
	}
};

var _user$project$Analyser_Util$withLoaded = function (x) {
	var _p0 = x;
	if (_p0.ctor === 'Loaded') {
		return _elm_lang$core$Maybe$Just(_p0._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _user$project$Analyser_Util$fileLoadError = function (x) {
	var _p1 = x;
	if (_p1.ctor === 'Failed') {
		return _elm_lang$core$Maybe$Just(_p1._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _user$project$Analyser_Util$isLoaded = function (_p2) {
	return !A2(
		F2(
			function (x, y) {
				return _elm_lang$core$Native_Utils.eq(x, y);
			}),
		_elm_lang$core$Maybe$Nothing,
		_user$project$Analyser_Util$withLoaded(_p2));
};

var _user$project$Logger$log = _elm_lang$core$Native_Platform.outgoingPort(
	'log',
	function (v) {
		return [v._0, v._1];
	});
var _user$project$Logger$info = function (_p0) {
	return _user$project$Logger$log(
		A2(
			F2(
				function (v0, v1) {
					return {ctor: '_Tuple2', _0: v0, _1: v1};
				}),
			'INFO',
			_p0));
};
var _user$project$Logger$warning = function (_p1) {
	return _user$project$Logger$log(
		A2(
			F2(
				function (v0, v1) {
					return {ctor: '_Tuple2', _0: v0, _1: v1};
				}),
			'WARN',
			_p1));
};
var _user$project$Logger$error = function (_p2) {
	return _user$project$Logger$log(
		A2(
			F2(
				function (v0, v1) {
					return {ctor: '_Tuple2', _0: v0, _1: v1};
				}),
			'ERROR',
			_p2));
};

var _user$project$Analyser_Files_DependencyLoader$loadedFileFromContent = function (fileContent) {
	var loadedInterfaceForFile = function (file) {
		return _user$project$Analyser_Files_Types$Loaded(
			{
				ast: file,
				moduleName: _user$project$AST_Util$fileModuleName(file),
				$interface: _user$project$Analyser_Files_Interface$build(file)
			});
	};
	var _p0 = fileContent.content;
	if (_p0.ctor === 'Just') {
		return _elm_community$result_extra$Result_Extra$merge(
			A2(
				_elm_lang$core$Result$mapError,
				function (_p1) {
					return _user$project$Analyser_Files_Types$Failed(
						A2(
							_elm_lang$core$Maybe$withDefault,
							'',
							_elm_lang$core$List$head(_p1)));
				},
				A2(
					_elm_lang$core$Result$map,
					loadedInterfaceForFile,
					_user$project$Parser_Parser$parse(_p0._0))));
	} else {
		return _user$project$Analyser_Files_Types$Failed('No file content');
	}
};
var _user$project$Analyser_Files_DependencyLoader$loadedInterfaceForFile = function (file) {
	return _user$project$Analyser_Files_Types$Loaded(
		{
			ast: file,
			moduleName: _user$project$AST_Util$fileModuleName(file),
			$interface: _user$project$Analyser_Files_Interface$build(file)
		});
};
var _user$project$Analyser_Files_DependencyLoader$onInputLoadingInterface = function (fileContent) {
	return A2(
		_elm_lang$core$Maybe$withDefault,
		_user$project$Analyser_Files_Types$Failed('Internal problem in the file loader. Please report an issue.'),
		A2(
			_elm_community$maybe_extra$Maybe_Extra$orElseLazy,
			function (_p2) {
				var _p3 = _p2;
				return _elm_lang$core$Maybe$Just(
					_user$project$Analyser_Files_DependencyLoader$loadedFileFromContent(fileContent));
			},
			A2(
				_elm_lang$core$Maybe$map,
				_user$project$Analyser_Files_DependencyLoader$loadedInterfaceForFile,
				A2(
					_elm_lang$core$Maybe$andThen,
					function (_p4) {
						return _elm_lang$core$Result$toMaybe(
							A2(_elm_lang$core$Json_Decode$decodeString, _user$project$AST_Decoding$decode, _p4));
					},
					fileContent.ast))));
};
var _user$project$Analyser_Files_DependencyLoader$getResult = function (_) {
	return _.result;
};
var _user$project$Analyser_Files_DependencyLoader$getDependency = function (m) {
	return {ctor: '_Tuple2', _0: m.name, _1: m.version};
};
var _user$project$Analyser_Files_DependencyLoader$loadRawDependency = _elm_lang$core$Native_Platform.outgoingPort(
	'loadRawDependency',
	function (v) {
		return [v._0, v._1];
	});
var _user$project$Analyser_Files_DependencyLoader$init = function (_p5) {
	var _p6 = _p5;
	var _p8 = _p6._1;
	var _p7 = _p6._0;
	return {
		ctor: '_Tuple2',
		_0: {
			name: _p7,
			version: _p8,
			toParse: {ctor: '[]'},
			parsed: {ctor: '[]'},
			result: _elm_lang$core$Maybe$Nothing
		},
		_1: _elm_lang$core$Platform_Cmd$batch(
			{
				ctor: '::',
				_0: _user$project$Analyser_Files_DependencyLoader$loadRawDependency(
					{ctor: '_Tuple2', _0: _p7, _1: _p8}),
				_1: {
					ctor: '::',
					_0: _user$project$Logger$info(
						A2(
							_elm_lang$core$Basics_ops['++'],
							'Load dependency ',
							A2(_elm_lang$core$Basics_ops['++'], _p7, _p8))),
					_1: {ctor: '[]'}
				}
			})
	};
};
var _user$project$Analyser_Files_DependencyLoader$loadDependencyFiles = _elm_lang$core$Native_Platform.outgoingPort(
	'loadDependencyFiles',
	function (v) {
		return [v._0, v._1];
	});
var _user$project$Analyser_Files_DependencyLoader$storeRawDependency = _elm_lang$core$Native_Platform.outgoingPort(
	'storeRawDependency',
	function (v) {
		return [v._0, v._1, v._2];
	});
var _user$project$Analyser_Files_DependencyLoader$update = F2(
	function (msg, model) {
		var _p9 = msg;
		if (_p9.ctor === 'LoadedRawDependency') {
			if ((!_elm_lang$core$Native_Utils.eq(model.name, _p9._0._0)) || (!_elm_lang$core$Native_Utils.eq(model.version, _p9._0._1))) {
				return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
			} else {
				var _p10 = _user$project$Analyser_Files_Json$deserialiseDependency(_p9._0._2);
				if (_p10.ctor === 'Nothing') {
					return {
						ctor: '_Tuple2',
						_0: model,
						_1: _user$project$Analyser_Files_DependencyLoader$loadDependencyFiles(
							{ctor: '_Tuple2', _0: model.name, _1: model.version})
					};
				} else {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							model,
							{
								result: _elm_lang$core$Maybe$Just(
									_elm_lang$core$Result$Ok(_p10._0))
							}),
						_1: _elm_lang$core$Platform_Cmd$none
					};
				}
			}
		} else {
			if ((!_elm_lang$core$Native_Utils.eq(model.name, _p9._0._0)) || (!_elm_lang$core$Native_Utils.eq(model.version, _p9._0._1))) {
				return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
			} else {
				var loadedFiles = A2(_elm_lang$core$List$map, _user$project$Analyser_Files_DependencyLoader$onInputLoadingInterface, _p9._0._2);
				var interfaces = _elm_lang$core$Dict$fromList(
					A2(
						_elm_lang$core$List$filterMap,
						function (_p11) {
							return A2(
								_elm_lang$core$Maybe$andThen,
								function (z) {
									return A2(
										_elm_lang$core$Maybe$map,
										A2(
											_elm_lang$core$Basics$flip,
											F2(
												function (v0, v1) {
													return {ctor: '_Tuple2', _0: v0, _1: v1};
												}),
											z.$interface),
										_user$project$AST_Util$fileModuleName(z.ast));
								},
								_user$project$Analyser_Util$withLoaded(_p11));
						},
						loadedFiles));
				var dependency = A3(_user$project$Analyser_Files_Types$Dependency, model.name, model.version, interfaces);
				return (!A2(_elm_lang$core$List$all, _user$project$Analyser_Util$isLoaded, loadedFiles)) ? {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{
							result: _elm_lang$core$Maybe$Just(
								_elm_lang$core$Result$Err('Could not load all dependency files'))
						}),
					_1: _elm_lang$core$Platform_Cmd$none
				} : {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{
							result: _elm_lang$core$Maybe$Just(
								_elm_lang$core$Result$Ok(dependency))
						}),
					_1: _user$project$Analyser_Files_DependencyLoader$storeRawDependency(
						{
							ctor: '_Tuple3',
							_0: dependency.name,
							_1: dependency.version,
							_2: _user$project$Analyser_Files_Json$serialiseDependency(dependency)
						})
				};
			}
		}
	});
var _user$project$Analyser_Files_DependencyLoader$onRawDependency = _elm_lang$core$Native_Platform.incomingPort(
	'onRawDependency',
	A2(
		_elm_lang$core$Json_Decode$andThen,
		function (x0) {
			return A2(
				_elm_lang$core$Json_Decode$andThen,
				function (x1) {
					return A2(
						_elm_lang$core$Json_Decode$andThen,
						function (x2) {
							return _elm_lang$core$Json_Decode$succeed(
								{ctor: '_Tuple3', _0: x0, _1: x1, _2: x2});
						},
						A2(_elm_lang$core$Json_Decode$index, 2, _elm_lang$core$Json_Decode$string));
				},
				A2(_elm_lang$core$Json_Decode$index, 1, _elm_lang$core$Json_Decode$string));
		},
		A2(_elm_lang$core$Json_Decode$index, 0, _elm_lang$core$Json_Decode$string)));
var _user$project$Analyser_Files_DependencyLoader$onDependencyFiles = _elm_lang$core$Native_Platform.incomingPort(
	'onDependencyFiles',
	A2(
		_elm_lang$core$Json_Decode$andThen,
		function (x0) {
			return A2(
				_elm_lang$core$Json_Decode$andThen,
				function (x1) {
					return A2(
						_elm_lang$core$Json_Decode$andThen,
						function (x2) {
							return _elm_lang$core$Json_Decode$succeed(
								{ctor: '_Tuple3', _0: x0, _1: x1, _2: x2});
						},
						A2(
							_elm_lang$core$Json_Decode$index,
							2,
							_elm_lang$core$Json_Decode$list(
								A2(
									_elm_lang$core$Json_Decode$andThen,
									function (path) {
										return A2(
											_elm_lang$core$Json_Decode$andThen,
											function (success) {
												return A2(
													_elm_lang$core$Json_Decode$andThen,
													function (sha1) {
														return A2(
															_elm_lang$core$Json_Decode$andThen,
															function (content) {
																return A2(
																	_elm_lang$core$Json_Decode$andThen,
																	function (ast) {
																		return A2(
																			_elm_lang$core$Json_Decode$andThen,
																			function (formatted) {
																				return _elm_lang$core$Json_Decode$succeed(
																					{path: path, success: success, sha1: sha1, content: content, ast: ast, formatted: formatted});
																			},
																			A2(_elm_lang$core$Json_Decode$field, 'formatted', _elm_lang$core$Json_Decode$bool));
																	},
																	A2(
																		_elm_lang$core$Json_Decode$field,
																		'ast',
																		_elm_lang$core$Json_Decode$oneOf(
																			{
																				ctor: '::',
																				_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
																				_1: {
																					ctor: '::',
																					_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, _elm_lang$core$Json_Decode$string),
																					_1: {ctor: '[]'}
																				}
																			})));
															},
															A2(
																_elm_lang$core$Json_Decode$field,
																'content',
																_elm_lang$core$Json_Decode$oneOf(
																	{
																		ctor: '::',
																		_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
																		_1: {
																			ctor: '::',
																			_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, _elm_lang$core$Json_Decode$string),
																			_1: {ctor: '[]'}
																		}
																	})));
													},
													A2(
														_elm_lang$core$Json_Decode$field,
														'sha1',
														_elm_lang$core$Json_Decode$oneOf(
															{
																ctor: '::',
																_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
																_1: {
																	ctor: '::',
																	_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, _elm_lang$core$Json_Decode$string),
																	_1: {ctor: '[]'}
																}
															})));
											},
											A2(_elm_lang$core$Json_Decode$field, 'success', _elm_lang$core$Json_Decode$bool));
									},
									A2(_elm_lang$core$Json_Decode$field, 'path', _elm_lang$core$Json_Decode$string)))));
				},
				A2(_elm_lang$core$Json_Decode$index, 1, _elm_lang$core$Json_Decode$string));
		},
		A2(_elm_lang$core$Json_Decode$index, 0, _elm_lang$core$Json_Decode$string)));
var _user$project$Analyser_Files_DependencyLoader$Model = F5(
	function (a, b, c, d, e) {
		return {name: a, version: b, toParse: c, parsed: d, result: e};
	});
var _user$project$Analyser_Files_DependencyLoader$LoadedDependencyFiles = function (a) {
	return {ctor: 'LoadedDependencyFiles', _0: a};
};
var _user$project$Analyser_Files_DependencyLoader$LoadedRawDependency = function (a) {
	return {ctor: 'LoadedRawDependency', _0: a};
};
var _user$project$Analyser_Files_DependencyLoader$subscriptions = function (_p12) {
	return _elm_lang$core$Platform_Sub$batch(
		{
			ctor: '::',
			_0: _user$project$Analyser_Files_DependencyLoader$onRawDependency(_user$project$Analyser_Files_DependencyLoader$LoadedRawDependency),
			_1: {
				ctor: '::',
				_0: _user$project$Analyser_Files_DependencyLoader$onDependencyFiles(_user$project$Analyser_Files_DependencyLoader$LoadedDependencyFiles),
				_1: {ctor: '[]'}
			}
		});
};

var _user$project$Analyser_InterfaceLoadingStage$isDone = function (_p0) {
	var _p1 = _p0;
	var _p2 = _p1._0;
	return _elm_lang$core$Native_Utils.eq(_p2.activeLoader, _elm_lang$core$Maybe$Nothing) && _elm_lang$core$List$isEmpty(_p2.queue);
};
var _user$project$Analyser_InterfaceLoadingStage$getDependencies = function (_p3) {
	var _p4 = _p3;
	return A2(_elm_lang$core$List$filterMap, _elm_lang$core$Result$toMaybe, _p4._0.loadedDependencies);
};
var _user$project$Analyser_InterfaceLoadingStage$State = F3(
	function (a, b, c) {
		return {queue: a, activeLoader: b, loadedDependencies: c};
	});
var _user$project$Analyser_InterfaceLoadingStage$Model = function (a) {
	return {ctor: 'Model', _0: a};
};
var _user$project$Analyser_InterfaceLoadingStage$DependencyLoaderMsg = function (a) {
	return {ctor: 'DependencyLoaderMsg', _0: a};
};
var _user$project$Analyser_InterfaceLoadingStage$loadNextDependency = function (_p5) {
	var _p6 = _p5;
	var _p8 = _p6._0._0;
	if (!_elm_lang$core$Native_Utils.eq(_p8.activeLoader, _elm_lang$core$Maybe$Nothing)) {
		return _p6;
	} else {
		var nextLoaderPair = A2(
			_elm_lang$core$Maybe$map,
			_user$project$Analyser_Files_DependencyLoader$init,
			_elm_lang$core$List$head(_p8.queue));
		return {
			ctor: '_Tuple2',
			_0: _user$project$Analyser_InterfaceLoadingStage$Model(
				_elm_lang$core$Native_Utils.update(
					_p8,
					{
						queue: A2(_elm_lang$core$List$drop, 1, _p8.queue),
						activeLoader: A2(_elm_lang$core$Maybe$map, _elm_lang$core$Tuple$first, nextLoaderPair)
					})),
			_1: _elm_lang$core$Platform_Cmd$batch(
				{
					ctor: '::',
					_0: _p6._1,
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$core$Maybe$withDefault,
							_elm_lang$core$Platform_Cmd$none,
							A2(
								_elm_lang$core$Maybe$map,
								function (_p7) {
									return A2(
										_elm_lang$core$Platform_Cmd$map,
										_user$project$Analyser_InterfaceLoadingStage$DependencyLoaderMsg,
										_elm_lang$core$Tuple$second(_p7));
								},
								nextLoaderPair)),
						_1: {ctor: '[]'}
					}
				})
		};
	}
};
var _user$project$Analyser_InterfaceLoadingStage$init = function (input) {
	return _user$project$Analyser_InterfaceLoadingStage$loadNextDependency(
		{
			ctor: '_Tuple2',
			_0: _user$project$Analyser_InterfaceLoadingStage$Model(
				{
					queue: input,
					activeLoader: _elm_lang$core$Maybe$Nothing,
					loadedDependencies: {ctor: '[]'}
				}),
			_1: _elm_lang$core$Platform_Cmd$none
		});
};
var _user$project$Analyser_InterfaceLoadingStage$subscriptions = function (_p9) {
	var _p10 = _p9;
	return A2(
		_elm_lang$core$Maybe$withDefault,
		_elm_lang$core$Platform_Sub$none,
		A2(
			_elm_lang$core$Maybe$map,
			function (_p11) {
				return A2(
					_elm_lang$core$Platform_Sub$map,
					_user$project$Analyser_InterfaceLoadingStage$DependencyLoaderMsg,
					_user$project$Analyser_Files_DependencyLoader$subscriptions(_p11));
			},
			_p10._0.activeLoader));
};
var _user$project$Analyser_InterfaceLoadingStage$update = F2(
	function (msg, _p12) {
		var _p13 = _p12;
		var _p20 = _p13._0;
		var _p14 = msg;
		return A2(
			_elm_lang$core$Maybe$withDefault,
			{
				ctor: '_Tuple2',
				_0: _user$project$Analyser_InterfaceLoadingStage$Model(_p20),
				_1: _elm_lang$core$Platform_Cmd$none
			},
			A2(
				_elm_lang$core$Maybe$map,
				function (_p15) {
					var _p16 = _p15;
					var _p19 = _p16._0;
					var _p18 = _p16._1;
					var _p17 = _user$project$Analyser_Files_DependencyLoader$getResult(_p19);
					if (_p17.ctor === 'Nothing') {
						return {
							ctor: '_Tuple2',
							_0: _user$project$Analyser_InterfaceLoadingStage$Model(
								_elm_lang$core$Native_Utils.update(
									_p20,
									{
										activeLoader: _elm_lang$core$Maybe$Just(_p19)
									})),
							_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$Analyser_InterfaceLoadingStage$DependencyLoaderMsg, _p18)
						};
					} else {
						return _user$project$Analyser_InterfaceLoadingStage$loadNextDependency(
							{
								ctor: '_Tuple2',
								_0: _user$project$Analyser_InterfaceLoadingStage$Model(
									_elm_lang$core$Native_Utils.update(
										_p20,
										{
											loadedDependencies: {ctor: '::', _0: _p17._0, _1: _p20.loadedDependencies},
											activeLoader: _elm_lang$core$Maybe$Nothing
										})),
								_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$Analyser_InterfaceLoadingStage$DependencyLoaderMsg, _p18)
							});
					}
				},
				A2(
					_elm_lang$core$Maybe$map,
					_user$project$Analyser_Files_DependencyLoader$update(_p14._0),
					_p20.activeLoader)));
	});

var _user$project$Analyser_Files_FileLoader$loadedFileFromContent = function (fileContent) {
	var loadedInterfaceForFile = function (file) {
		return _user$project$Analyser_Files_Types$Loaded(
			{
				ast: file,
				moduleName: _user$project$AST_Util$fileModuleName(file),
				$interface: _user$project$Analyser_Files_Interface$build(file)
			});
	};
	var _p0 = fileContent.content;
	if (_p0.ctor === 'Just') {
		return _elm_community$result_extra$Result_Extra$merge(
			A2(
				_elm_lang$core$Result$mapError,
				function (_p1) {
					return _user$project$Analyser_Files_Types$Failed(
						A2(
							_elm_lang$core$Maybe$withDefault,
							'',
							_elm_lang$core$List$head(_p1)));
				},
				A2(
					_elm_lang$core$Result$map,
					loadedInterfaceForFile,
					_user$project$Parser_Parser$parse(_p0._0))));
	} else {
		return _user$project$Analyser_Files_Types$Failed('No file content');
	}
};
var _user$project$Analyser_Files_FileLoader$loadedInterfaceForFile = function (file) {
	return _user$project$Analyser_Files_Types$Loaded(
		{
			ast: file,
			moduleName: _user$project$AST_Util$fileModuleName(file),
			$interface: _user$project$Analyser_Files_Interface$build(file)
		});
};
var _user$project$Analyser_Files_FileLoader$onInputLoadingInterface = function (fileContent) {
	return A2(
		_elm_lang$core$Maybe$withDefault,
		{
			ctor: '_Tuple2',
			_0: _user$project$Analyser_Files_Types$Failed('Internal problem in the file loader. Please report an issue.'),
			_1: false
		},
		A2(
			_elm_community$maybe_extra$Maybe_Extra$orElseLazy,
			function (_p2) {
				var _p3 = _p2;
				return _elm_lang$core$Maybe$Just(
					{
						ctor: '_Tuple2',
						_0: _user$project$Analyser_Files_FileLoader$loadedFileFromContent(fileContent),
						_1: true
					});
			},
			A2(
				_elm_lang$core$Maybe$map,
				A2(
					_elm_lang$core$Basics$flip,
					F2(
						function (v0, v1) {
							return {ctor: '_Tuple2', _0: v0, _1: v1};
						}),
					false),
				A2(
					_elm_lang$core$Maybe$map,
					_user$project$Analyser_Files_FileLoader$loadedInterfaceForFile,
					A2(
						_elm_lang$core$Maybe$andThen,
						function (_p4) {
							return _elm_lang$core$Result$toMaybe(
								A2(_elm_lang$core$Json_Decode$decodeString, _user$project$AST_Decoding$decode, _p4));
						},
						fileContent.ast)))));
};
var _user$project$Analyser_Files_FileLoader$loadFile = _elm_lang$core$Native_Platform.outgoingPort(
	'loadFile',
	function (v) {
		return v;
	});
var _user$project$Analyser_Files_FileLoader$init = function (s) {
	return _elm_lang$core$Platform_Cmd$batch(
		{
			ctor: '::',
			_0: _user$project$Analyser_Files_FileLoader$loadFile(s),
			_1: {
				ctor: '::',
				_0: _user$project$Logger$info(
					A2(
						_elm_lang$core$Basics_ops['++'],
						'Load file ',
						A2(_elm_lang$core$Basics_ops['++'], s, '...'))),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Analyser_Files_FileLoader$fileContent = _elm_lang$core$Native_Platform.incomingPort(
	'fileContent',
	A2(
		_elm_lang$core$Json_Decode$andThen,
		function (path) {
			return A2(
				_elm_lang$core$Json_Decode$andThen,
				function (success) {
					return A2(
						_elm_lang$core$Json_Decode$andThen,
						function (sha1) {
							return A2(
								_elm_lang$core$Json_Decode$andThen,
								function (content) {
									return A2(
										_elm_lang$core$Json_Decode$andThen,
										function (ast) {
											return A2(
												_elm_lang$core$Json_Decode$andThen,
												function (formatted) {
													return _elm_lang$core$Json_Decode$succeed(
														{path: path, success: success, sha1: sha1, content: content, ast: ast, formatted: formatted});
												},
												A2(_elm_lang$core$Json_Decode$field, 'formatted', _elm_lang$core$Json_Decode$bool));
										},
										A2(
											_elm_lang$core$Json_Decode$field,
											'ast',
											_elm_lang$core$Json_Decode$oneOf(
												{
													ctor: '::',
													_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
													_1: {
														ctor: '::',
														_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, _elm_lang$core$Json_Decode$string),
														_1: {ctor: '[]'}
													}
												})));
								},
								A2(
									_elm_lang$core$Json_Decode$field,
									'content',
									_elm_lang$core$Json_Decode$oneOf(
										{
											ctor: '::',
											_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
											_1: {
												ctor: '::',
												_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, _elm_lang$core$Json_Decode$string),
												_1: {ctor: '[]'}
											}
										})));
						},
						A2(
							_elm_lang$core$Json_Decode$field,
							'sha1',
							_elm_lang$core$Json_Decode$oneOf(
								{
									ctor: '::',
									_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
									_1: {
										ctor: '::',
										_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, _elm_lang$core$Json_Decode$string),
										_1: {ctor: '[]'}
									}
								})));
				},
				A2(_elm_lang$core$Json_Decode$field, 'success', _elm_lang$core$Json_Decode$bool));
		},
		A2(_elm_lang$core$Json_Decode$field, 'path', _elm_lang$core$Json_Decode$string)));
var _user$project$Analyser_Files_FileLoader$storeAstForSha = _elm_lang$core$Native_Platform.outgoingPort(
	'storeAstForSha',
	function (v) {
		return [v._0, v._1];
	});
var _user$project$Analyser_Files_FileLoader$update = function (msg) {
	var _p5 = msg;
	var _p7 = _p5._0;
	var _p6 = _user$project$Analyser_Files_FileLoader$onInputLoadingInterface(_p7);
	var fileLoad = _p6._0;
	var store = _p6._1;
	var cmd = store ? A2(
		_elm_lang$core$Maybe$withDefault,
		_elm_lang$core$Platform_Cmd$none,
		A2(
			_elm_lang$core$Basics$uncurry,
			_elm_lang$core$Maybe$map2(
				F2(
					function (a, b) {
						return _user$project$Analyser_Files_FileLoader$storeAstForSha(
							{
								ctor: '_Tuple2',
								_0: a,
								_1: A2(
									_elm_lang$core$Json_Encode$encode,
									0,
									_user$project$AST_Encoding$encode(b.ast))
							});
					})),
			{
				ctor: '_Tuple2',
				_0: _p7.sha1,
				_1: _user$project$Analyser_Util$withLoaded(fileLoad)
			})) : _elm_lang$core$Platform_Cmd$none;
	return {
		ctor: '_Tuple2',
		_0: {ctor: '_Tuple2', _0: _p7, _1: fileLoad},
		_1: cmd
	};
};
var _user$project$Analyser_Files_FileLoader$OnFileContent = function (a) {
	return {ctor: 'OnFileContent', _0: a};
};
var _user$project$Analyser_Files_FileLoader$subscriptions = _user$project$Analyser_Files_FileLoader$fileContent(_user$project$Analyser_Files_FileLoader$OnFileContent);

var _user$project$Analyser_SourceLoadingStage$parsedFiles = function (_p0) {
	var _p1 = _p0;
	return _p1._0.parsedFiles;
};
var _user$project$Analyser_SourceLoadingStage$isDone = function (_p2) {
	var _p3 = _p2;
	return _elm_lang$core$Native_Utils.eq(_p3._0.filesToLoad, _elm_lang$core$Maybe$Nothing);
};
var _user$project$Analyser_SourceLoadingStage$State = F2(
	function (a, b) {
		return {filesToLoad: a, parsedFiles: b};
	});
var _user$project$Analyser_SourceLoadingStage$Model = function (a) {
	return {ctor: 'Model', _0: a};
};
var _user$project$Analyser_SourceLoadingStage$FileLoaderMsg = function (a) {
	return {ctor: 'FileLoaderMsg', _0: a};
};
var _user$project$Analyser_SourceLoadingStage$loadNextFile = function (_p4) {
	var _p5 = _p4;
	var _p9 = _p5._1;
	var _p8 = _p5._0._0;
	return A2(
		_elm_lang$core$Maybe$withDefault,
		{
			ctor: '_Tuple2',
			_0: _user$project$Analyser_SourceLoadingStage$Model(_p8),
			_1: _p9
		},
		A2(
			_elm_lang$core$Maybe$map,
			function (_p6) {
				var _p7 = _p6;
				return {
					ctor: '_Tuple2',
					_0: _user$project$Analyser_SourceLoadingStage$Model(_p8),
					_1: _elm_lang$core$Platform_Cmd$batch(
						{
							ctor: '::',
							_0: _p9,
							_1: {
								ctor: '::',
								_0: A2(
									_elm_lang$core$Platform_Cmd$map,
									_user$project$Analyser_SourceLoadingStage$FileLoaderMsg,
									_user$project$Analyser_Files_FileLoader$init(_p7._0)),
								_1: {ctor: '[]'}
							}
						})
				};
			},
			_p8.filesToLoad));
};
var _user$project$Analyser_SourceLoadingStage$init = function (input) {
	return _user$project$Analyser_SourceLoadingStage$loadNextFile(
		{
			ctor: '_Tuple2',
			_0: _user$project$Analyser_SourceLoadingStage$Model(
				{
					filesToLoad: _elm_community$list_extra$List_Extra$uncons(input),
					parsedFiles: {ctor: '[]'}
				}),
			_1: _elm_lang$core$Platform_Cmd$none
		});
};
var _user$project$Analyser_SourceLoadingStage$update = F2(
	function (msg, _p10) {
		var _p11 = _p10;
		var _p16 = _p11._0;
		var _p12 = msg;
		return A2(
			_elm_lang$core$Maybe$withDefault,
			A2(
				_elm_lang$core$Platform_Cmd_ops['!'],
				_user$project$Analyser_SourceLoadingStage$Model(_p16),
				{ctor: '[]'}),
			A2(
				_elm_lang$core$Maybe$map,
				_user$project$Analyser_SourceLoadingStage$loadNextFile,
				A2(
					_elm_lang$core$Maybe$map,
					function (_p13) {
						var _p14 = _p13;
						var _p15 = _user$project$Analyser_Files_FileLoader$update(_p12._0);
						var fileLoad = _p15._0;
						var cmd = _p15._1;
						return {
							ctor: '_Tuple2',
							_0: _user$project$Analyser_SourceLoadingStage$Model(
								_elm_lang$core$Native_Utils.update(
									_p16,
									{
										filesToLoad: _elm_community$list_extra$List_Extra$uncons(_p14._1),
										parsedFiles: {ctor: '::', _0: fileLoad, _1: _p16.parsedFiles}
									})),
							_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$Analyser_SourceLoadingStage$FileLoaderMsg, cmd)
						};
					},
					_p16.filesToLoad)));
	});
var _user$project$Analyser_SourceLoadingStage$subscriptions = function (_p17) {
	return A2(_elm_lang$core$Platform_Sub$map, _user$project$Analyser_SourceLoadingStage$FileLoaderMsg, _user$project$Analyser_Files_FileLoader$subscriptions);
};

var _user$project$Analyser_Messages_Types$Message = F4(
	function (a, b, c, d) {
		return {id: a, status: b, files: c, data: d};
	});
var _user$project$Analyser_Messages_Types$Applicable = {ctor: 'Applicable'};
var _user$project$Analyser_Messages_Types$newMessage = A2(_user$project$Analyser_Messages_Types$Message, 0, _user$project$Analyser_Messages_Types$Applicable);
var _user$project$Analyser_Messages_Types$Fixing = {ctor: 'Fixing'};
var _user$project$Analyser_Messages_Types$Blocked = {ctor: 'Blocked'};
var _user$project$Analyser_Messages_Types$Outdated = {ctor: 'Outdated'};
var _user$project$Analyser_Messages_Types$FunctionInLet = F2(
	function (a, b) {
		return {ctor: 'FunctionInLet', _0: a, _1: b};
	});
var _user$project$Analyser_Messages_Types$CoreArrayUsage = F2(
	function (a, b) {
		return {ctor: 'CoreArrayUsage', _0: a, _1: b};
	});
var _user$project$Analyser_Messages_Types$NonStaticRegex = F2(
	function (a, b) {
		return {ctor: 'NonStaticRegex', _0: a, _1: b};
	});
var _user$project$Analyser_Messages_Types$UnnecessaryPortModule = function (a) {
	return {ctor: 'UnnecessaryPortModule', _0: a};
};
var _user$project$Analyser_Messages_Types$MultiLineRecordFormatting = F2(
	function (a, b) {
		return {ctor: 'MultiLineRecordFormatting', _0: a, _1: b};
	});
var _user$project$Analyser_Messages_Types$LineLengthExceeded = F2(
	function (a, b) {
		return {ctor: 'LineLengthExceeded', _0: a, _1: b};
	});
var _user$project$Analyser_Messages_Types$UnnecessaryListConcat = F2(
	function (a, b) {
		return {ctor: 'UnnecessaryListConcat', _0: a, _1: b};
	});
var _user$project$Analyser_Messages_Types$DropConsOfItemAndList = F2(
	function (a, b) {
		return {ctor: 'DropConsOfItemAndList', _0: a, _1: b};
	});
var _user$project$Analyser_Messages_Types$DropConcatOfLists = F2(
	function (a, b) {
		return {ctor: 'DropConcatOfLists', _0: a, _1: b};
	});
var _user$project$Analyser_Messages_Types$UseConsOverConcat = F2(
	function (a, b) {
		return {ctor: 'UseConsOverConcat', _0: a, _1: b};
	});
var _user$project$Analyser_Messages_Types$UnusedImport = F3(
	function (a, b, c) {
		return {ctor: 'UnusedImport', _0: a, _1: b, _2: c};
	});
var _user$project$Analyser_Messages_Types$UnusedImportAlias = F3(
	function (a, b, c) {
		return {ctor: 'UnusedImportAlias', _0: a, _1: b, _2: c};
	});
var _user$project$Analyser_Messages_Types$NoUncurriedPrefix = F3(
	function (a, b, c) {
		return {ctor: 'NoUncurriedPrefix', _0: a, _1: b, _2: c};
	});
var _user$project$Analyser_Messages_Types$RedefineVariable = F4(
	function (a, b, c, d) {
		return {ctor: 'RedefineVariable', _0: a, _1: b, _2: c, _3: d};
	});
var _user$project$Analyser_Messages_Types$UnusedTypeAlias = F3(
	function (a, b, c) {
		return {ctor: 'UnusedTypeAlias', _0: a, _1: b, _2: c};
	});
var _user$project$Analyser_Messages_Types$DuplicateImport = F3(
	function (a, b, c) {
		return {ctor: 'DuplicateImport', _0: a, _1: b, _2: c};
	});
var _user$project$Analyser_Messages_Types$FileLoadFailed = F2(
	function (a, b) {
		return {ctor: 'FileLoadFailed', _0: a, _1: b};
	});
var _user$project$Analyser_Messages_Types$UnformattedFile = function (a) {
	return {ctor: 'UnformattedFile', _0: a};
};
var _user$project$Analyser_Messages_Types$DebugCrash = F2(
	function (a, b) {
		return {ctor: 'DebugCrash', _0: a, _1: b};
	});
var _user$project$Analyser_Messages_Types$DebugLog = F2(
	function (a, b) {
		return {ctor: 'DebugLog', _0: a, _1: b};
	});
var _user$project$Analyser_Messages_Types$UnnecessaryParens = F2(
	function (a, b) {
		return {ctor: 'UnnecessaryParens', _0: a, _1: b};
	});
var _user$project$Analyser_Messages_Types$NoTopLevelSignature = F3(
	function (a, b, c) {
		return {ctor: 'NoTopLevelSignature', _0: a, _1: b, _2: c};
	});
var _user$project$Analyser_Messages_Types$ImportAll = F3(
	function (a, b, c) {
		return {ctor: 'ImportAll', _0: a, _1: b, _2: c};
	});
var _user$project$Analyser_Messages_Types$ExposeAll = F2(
	function (a, b) {
		return {ctor: 'ExposeAll', _0: a, _1: b};
	});
var _user$project$Analyser_Messages_Types$UnusedPatternVariable = F3(
	function (a, b, c) {
		return {ctor: 'UnusedPatternVariable', _0: a, _1: b, _2: c};
	});
var _user$project$Analyser_Messages_Types$UnusedImportedVariable = F3(
	function (a, b, c) {
		return {ctor: 'UnusedImportedVariable', _0: a, _1: b, _2: c};
	});
var _user$project$Analyser_Messages_Types$UnusedTopLevel = F3(
	function (a, b, c) {
		return {ctor: 'UnusedTopLevel', _0: a, _1: b, _2: c};
	});
var _user$project$Analyser_Messages_Types$UnusedVariable = F3(
	function (a, b, c) {
		return {ctor: 'UnusedVariable', _0: a, _1: b, _2: c};
	});
var _user$project$Analyser_Messages_Types$UnreadableSourceFile = function (a) {
	return {ctor: 'UnreadableSourceFile', _0: a};
};

var _user$project$Analyser_Messages_Util$getMessageInfo = function (m) {
	var _p0 = m;
	switch (_p0.ctor) {
		case 'UnusedTopLevel':
			var _p2 = _p0._2;
			var _p1 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Unused top level definition `',
						_1: {
							ctor: '::',
							_0: _p0._1,
							_1: {
								ctor: '::',
								_0: '` in file \"',
								_1: {
									ctor: '::',
									_0: _p1,
									_1: {
										ctor: '::',
										_0: '\" at ',
										_1: {
											ctor: '::',
											_0: _user$project$AST_Ranges$rangeToString(_p2),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p1,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p2,
					_1: {ctor: '[]'}
				},
				_3: true
			};
		case 'UnusedVariable':
			var _p4 = _p0._2;
			var _p3 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Unused variable `',
						_1: {
							ctor: '::',
							_0: _p0._1,
							_1: {
								ctor: '::',
								_0: '` in file \"',
								_1: {
									ctor: '::',
									_0: _p3,
									_1: {
										ctor: '::',
										_0: '\" at ',
										_1: {
											ctor: '::',
											_0: _user$project$AST_Ranges$rangeToString(_p4),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p3,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p4,
					_1: {ctor: '[]'}
				},
				_3: true
			};
		case 'UnusedImportedVariable':
			var _p6 = _p0._2;
			var _p5 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Unused imported variable `',
						_1: {
							ctor: '::',
							_0: _p0._1,
							_1: {
								ctor: '::',
								_0: '` in file \"',
								_1: {
									ctor: '::',
									_0: _p5,
									_1: {
										ctor: '::',
										_0: '\" at ',
										_1: {
											ctor: '::',
											_0: _user$project$AST_Ranges$rangeToString(_p6),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p5,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p6,
					_1: {ctor: '[]'}
				},
				_3: true
			};
		case 'UnusedPatternVariable':
			var _p8 = _p0._2;
			var _p7 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Unused variable `',
						_1: {
							ctor: '::',
							_0: _p0._1,
							_1: {
								ctor: '::',
								_0: '` inside pattern in file \"',
								_1: {
									ctor: '::',
									_0: _p7,
									_1: {
										ctor: '::',
										_0: '\" at ',
										_1: {
											ctor: '::',
											_0: _user$project$AST_Ranges$rangeToString(_p8),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p7,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p8,
					_1: {ctor: '[]'}
				},
				_3: true
			};
		case 'UnreadableSourceFile':
			var _p9 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Could not parse source file: ',
						_1: {
							ctor: '::',
							_0: _p9,
							_1: {ctor: '[]'}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p9,
						_1: {ctor: '[]'}
					}),
				_2: {ctor: '[]'},
				_3: true
			};
		case 'UnnecessaryPortModule':
			var _p10 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'File  `',
						_1: {
							ctor: '::',
							_0: _p10,
							_1: {
								ctor: '::',
								_0: '` is defined as a `port` module, but is does not declare ports. It may be better to remove these.',
								_1: {ctor: '[]'}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p10,
						_1: {ctor: '[]'}
					}),
				_2: {ctor: '[]'},
				_3: true
			};
		case 'ExposeAll':
			var _p12 = _p0._1;
			var _p11 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Exposing all in file \"',
						_1: {
							ctor: '::',
							_0: _p11,
							_1: {
								ctor: '::',
								_0: '\" at ',
								_1: {
									ctor: '::',
									_0: _user$project$AST_Ranges$rangeToString(_p12),
									_1: {ctor: '[]'}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p11,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p12,
					_1: {ctor: '[]'}
				},
				_3: false
			};
		case 'ImportAll':
			var _p14 = _p0._2;
			var _p13 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Importing all from module `',
						_1: {
							ctor: '::',
							_0: A2(_elm_lang$core$String$join, '.', _p0._1),
							_1: {
								ctor: '::',
								_0: '`in file \"',
								_1: {
									ctor: '::',
									_0: _p13,
									_1: {
										ctor: '::',
										_0: '\" at ',
										_1: {
											ctor: '::',
											_0: _user$project$AST_Ranges$rangeToString(_p14),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p13,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p14,
					_1: {ctor: '[]'}
				},
				_3: false
			};
		case 'NoTopLevelSignature':
			var _p16 = _p0._2;
			var _p15 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'No signature for top level definition `',
						_1: {
							ctor: '::',
							_0: _p0._1,
							_1: {
								ctor: '::',
								_0: '` in file \"',
								_1: {
									ctor: '::',
									_0: _p15,
									_1: {
										ctor: '::',
										_0: '\" at ',
										_1: {
											ctor: '::',
											_0: _user$project$AST_Ranges$rangeToString(_p16),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p15,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p16,
					_1: {ctor: '[]'}
				},
				_3: false
			};
		case 'UnnecessaryParens':
			var _p18 = _p0._1;
			var _p17 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Unnecessary parens in file \"',
						_1: {
							ctor: '::',
							_0: _p17,
							_1: {
								ctor: '::',
								_0: '\" at ',
								_1: {
									ctor: '::',
									_0: _user$project$AST_Ranges$rangeToString(_p18),
									_1: {ctor: '[]'}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p17,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p18,
					_1: {ctor: '[]'}
				},
				_3: true
			};
		case 'NonStaticRegex':
			var _p20 = _p0._1;
			var _p19 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Use of `Regex.regex` as non-static in file \"',
						_1: {
							ctor: '::',
							_0: _p19,
							_1: {
								ctor: '::',
								_0: '\" at ',
								_1: {
									ctor: '::',
									_0: _user$project$AST_Ranges$rangeToString(_p20),
									_1: {ctor: '[]'}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p19,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p20,
					_1: {ctor: '[]'}
				},
				_3: false
			};
		case 'CoreArrayUsage':
			var _p22 = _p0._1;
			var _p21 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Use of `Array` is disadviced. In \"',
						_1: {
							ctor: '::',
							_0: _p21,
							_1: {
								ctor: '::',
								_0: '\" at ',
								_1: {
									ctor: '::',
									_0: _user$project$AST_Ranges$rangeToString(_p22),
									_1: {ctor: '[]'}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p21,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p22,
					_1: {ctor: '[]'}
				},
				_3: false
			};
		case 'DebugLog':
			var _p24 = _p0._1;
			var _p23 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Use of debug log in file \"',
						_1: {
							ctor: '::',
							_0: _p23,
							_1: {
								ctor: '::',
								_0: '\" at ',
								_1: {
									ctor: '::',
									_0: _user$project$AST_Ranges$rangeToString(_p24),
									_1: {ctor: '[]'}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p23,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p24,
					_1: {ctor: '[]'}
				},
				_3: true
			};
		case 'DebugCrash':
			var _p26 = _p0._1;
			var _p25 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Use of debug crash in file \"',
						_1: {
							ctor: '::',
							_0: _p25,
							_1: {
								ctor: '::',
								_0: '\" at ',
								_1: {
									ctor: '::',
									_0: _user$project$AST_Ranges$rangeToString(_p26),
									_1: {ctor: '[]'}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p25,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p26,
					_1: {ctor: '[]'}
				},
				_3: true
			};
		case 'UnformattedFile':
			var _p27 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Unformatted file \"',
						_1: {
							ctor: '::',
							_0: _p27,
							_1: {
								ctor: '::',
								_0: '\"',
								_1: {ctor: '[]'}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p27,
						_1: {ctor: '[]'}
					}),
				_2: {ctor: '[]'},
				_3: true
			};
		case 'FileLoadFailed':
			var _p28 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Could not load file \"',
						_1: {
							ctor: '::',
							_0: _p28,
							_1: {
								ctor: '::',
								_0: '\" due to: ',
								_1: {
									ctor: '::',
									_0: _p0._1,
									_1: {ctor: '[]'}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p28,
						_1: {ctor: '[]'}
					}),
				_2: {ctor: '[]'},
				_3: true
			};
		case 'DuplicateImport':
			var _p30 = _p0._2;
			var _p29 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Duplicate import for module `',
						_1: {
							ctor: '::',
							_0: A2(_elm_lang$core$String$join, '.', _p0._1),
							_1: {
								ctor: '::',
								_0: '`in file \"',
								_1: {
									ctor: '::',
									_0: _p29,
									_1: {
										ctor: '::',
										_0: '\" at [ ',
										_1: {
											ctor: '::',
											_0: A2(
												_elm_lang$core$String$join,
												' | ',
												A2(_elm_lang$core$List$map, _user$project$AST_Ranges$rangeToString, _p30)),
											_1: {
												ctor: '::',
												_0: ' ]',
												_1: {ctor: '[]'}
											}
										}
									}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p29,
						_1: {ctor: '[]'}
					}),
				_2: _p30,
				_3: true
			};
		case 'UnusedImportAlias':
			var _p32 = _p0._2;
			var _p31 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Unused import alias `',
						_1: {
							ctor: '::',
							_0: A2(_elm_lang$core$String$join, '.', _p0._1),
							_1: {
								ctor: '::',
								_0: '`in file \"',
								_1: {
									ctor: '::',
									_0: _p31,
									_1: {
										ctor: '::',
										_0: '\" at ',
										_1: {
											ctor: '::',
											_0: _user$project$AST_Ranges$rangeToString(_p32),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p31,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p32,
					_1: {ctor: '[]'}
				},
				_3: true
			};
		case 'UnusedImport':
			var _p34 = _p0._2;
			var _p33 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Unused import `',
						_1: {
							ctor: '::',
							_0: A2(_elm_lang$core$String$join, '.', _p0._1),
							_1: {
								ctor: '::',
								_0: '`in file \"',
								_1: {
									ctor: '::',
									_0: _p33,
									_1: {
										ctor: '::',
										_0: '\" at ',
										_1: {
											ctor: '::',
											_0: _user$project$AST_Ranges$rangeToString(_p34),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p33,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p34,
					_1: {ctor: '[]'}
				},
				_3: true
			};
		case 'UnusedTypeAlias':
			var _p36 = _p0._2;
			var _p35 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Type alias `',
						_1: {
							ctor: '::',
							_0: _p0._1,
							_1: {
								ctor: '::',
								_0: '` is not used in file \"',
								_1: {
									ctor: '::',
									_0: _p35,
									_1: {
										ctor: '::',
										_0: '\" at ',
										_1: {
											ctor: '::',
											_0: _user$project$AST_Ranges$rangeToString(_p36),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p35,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p36,
					_1: {ctor: '[]'}
				},
				_3: true
			};
		case 'MultiLineRecordFormatting':
			var _p38 = _p0._1;
			var _p37 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Record should be formatted over multiple lines in file \"',
						_1: {
							ctor: '::',
							_0: _p37,
							_1: {
								ctor: '::',
								_0: '\" at ',
								_1: {
									ctor: '::',
									_0: _user$project$AST_Ranges$rangeToString(_p38),
									_1: {ctor: '[]'}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p37,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p38,
					_1: {ctor: '[]'}
				},
				_3: true
			};
		case 'NoUncurriedPrefix':
			var _p40 = _p0._2;
			var _p39 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Prefix notation for `',
						_1: {
							ctor: '::',
							_0: _p0._1,
							_1: {
								ctor: '::',
								_0: '` is unneeded in file \"',
								_1: {
									ctor: '::',
									_0: _p39,
									_1: {
										ctor: '::',
										_0: '\" at ',
										_1: {
											ctor: '::',
											_0: _user$project$AST_Ranges$rangeToString(_p40),
											_1: {ctor: '[]'}
										}
									}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p39,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p40,
					_1: {ctor: '[]'}
				},
				_3: false
			};
		case 'RedefineVariable':
			var _p43 = _p0._3;
			var _p42 = _p0._2;
			var _p41 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Variable `',
						_1: {
							ctor: '::',
							_0: _p0._1,
							_1: {
								ctor: '::',
								_0: '` is redefined in file \"',
								_1: {
									ctor: '::',
									_0: _p41,
									_1: {
										ctor: '::',
										_0: '\". At ',
										_1: {
											ctor: '::',
											_0: _user$project$AST_Ranges$rangeToString(_p42),
											_1: {
												ctor: '::',
												_0: ' and ',
												_1: {
													ctor: '::',
													_0: _user$project$AST_Ranges$rangeToString(_p43),
													_1: {ctor: '[]'}
												}
											}
										}
									}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p41,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p42,
					_1: {
						ctor: '::',
						_0: _p43,
						_1: {ctor: '[]'}
					}
				},
				_3: false
			};
		case 'UseConsOverConcat':
			var _p45 = _p0._1;
			var _p44 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Use `::` instead of `++` in file \"',
						_1: {
							ctor: '::',
							_0: _p44,
							_1: {
								ctor: '::',
								_0: '\" at ',
								_1: {
									ctor: '::',
									_0: _user$project$AST_Ranges$rangeToString(_p45),
									_1: {ctor: '[]'}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p44,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p45,
					_1: {ctor: '[]'}
				},
				_3: true
			};
		case 'DropConcatOfLists':
			var _p47 = _p0._1;
			var _p46 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Joining two literal lists with `++`, but instead you can just join the lists. \"',
						_1: {
							ctor: '::',
							_0: _p46,
							_1: {
								ctor: '::',
								_0: '\" at ',
								_1: {
									ctor: '::',
									_0: _user$project$AST_Ranges$rangeToString(_p47),
									_1: {ctor: '[]'}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p46,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p47,
					_1: {ctor: '[]'}
				},
				_3: true
			};
		case 'DropConsOfItemAndList':
			var _p49 = _p0._1;
			var _p48 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Adding an item to the front of a literal list, but instead you can just put it in the list. \"',
						_1: {
							ctor: '::',
							_0: _p48,
							_1: {
								ctor: '::',
								_0: '\" at ',
								_1: {
									ctor: '::',
									_0: _user$project$AST_Ranges$rangeToString(_p49),
									_1: {ctor: '[]'}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p48,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p49,
					_1: {ctor: '[]'}
				},
				_3: true
			};
		case 'LineLengthExceeded':
			var _p51 = _p0._1;
			var _p50 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Line length exceeded on ',
						_1: {
							ctor: '::',
							_0: _elm_lang$core$Basics$toString(
								_elm_lang$core$List$length(_p51)),
							_1: {
								ctor: '::',
								_0: ' line(s) in file \"',
								_1: {
									ctor: '::',
									_0: _p50,
									_1: {
										ctor: '::',
										_0: '\".',
										_1: {ctor: '[]'}
									}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p50,
						_1: {ctor: '[]'}
					}),
				_2: _p51,
				_3: false
			};
		case 'UnnecessaryListConcat':
			var _p53 = _p0._1;
			var _p52 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Better merge the arguments of `List.concat` to a single list in file \"',
						_1: {
							ctor: '::',
							_0: _p52,
							_1: {
								ctor: '::',
								_0: '\" at ',
								_1: {
									ctor: '::',
									_0: _user$project$AST_Ranges$rangeToString(_p53),
									_1: {ctor: '[]'}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p52,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p53,
					_1: {ctor: '[]'}
				},
				_3: true
			};
		default:
			var _p55 = _p0._1;
			var _p54 = _p0._0;
			return {
				ctor: '_Tuple4',
				_0: _elm_lang$core$String$concat(
					{
						ctor: '::',
						_0: 'Let statement containing functions should be avoided in \"',
						_1: {
							ctor: '::',
							_0: _p54,
							_1: {
								ctor: '::',
								_0: '\" at ',
								_1: {
									ctor: '::',
									_0: _user$project$AST_Ranges$rangeToString(_p55),
									_1: {ctor: '[]'}
								}
							}
						}
					}),
				_1: _elm_lang$core$Basics$always(
					{
						ctor: '::',
						_0: _p54,
						_1: {ctor: '[]'}
					}),
				_2: {
					ctor: '::',
					_0: _p55,
					_1: {ctor: '[]'}
				},
				_3: false
			};
	}
};
var _user$project$Analyser_Messages_Util$canFix = function (m) {
	var _p56 = _user$project$Analyser_Messages_Util$getMessageInfo(m);
	var result = _p56._3;
	return result;
};
var _user$project$Analyser_Messages_Util$getRanges = function (m) {
	var _p57 = _user$project$Analyser_Messages_Util$getMessageInfo(m);
	var r = _p57._2;
	return r;
};
var _user$project$Analyser_Messages_Util$getFiles = function (m) {
	var _p58 = _user$project$Analyser_Messages_Util$getMessageInfo(m);
	var f = _p58._1;
	return f(m);
};
var _user$project$Analyser_Messages_Util$compareMessage = F2(
	function (a, b) {
		var bFile = A2(
			_elm_lang$core$Maybe$withDefault,
			'',
			_elm_lang$core$List$head(
				_user$project$Analyser_Messages_Util$getFiles(a.data)));
		var aFile = A2(
			_elm_lang$core$Maybe$withDefault,
			'',
			_elm_lang$core$List$head(
				_user$project$Analyser_Messages_Util$getFiles(a.data)));
		return _elm_lang$core$Native_Utils.eq(aFile, bFile) ? A2(
			_user$project$AST_Ranges$compareRangeStarts,
			A2(
				_elm_lang$core$Maybe$withDefault,
				_user$project$AST_Ranges$emptyRange,
				_elm_lang$core$List$head(
					_user$project$Analyser_Messages_Util$getRanges(a.data))),
			A2(
				_elm_lang$core$Maybe$withDefault,
				_user$project$AST_Ranges$emptyRange,
				_elm_lang$core$List$head(
					_user$project$Analyser_Messages_Util$getRanges(b.data)))) : A2(_elm_lang$core$Basics$compare, aFile, bFile);
	});
var _user$project$Analyser_Messages_Util$asString = function (m) {
	var _p59 = _user$project$Analyser_Messages_Util$getMessageInfo(m);
	var f = _p59._0;
	return f;
};
var _user$project$Analyser_Messages_Util$markFixing = F2(
	function (x, message) {
		return _elm_lang$core$Native_Utils.eq(message.id, x) ? _elm_lang$core$Native_Utils.update(
			message,
			{status: _user$project$Analyser_Messages_Types$Fixing}) : message;
	});
var _user$project$Analyser_Messages_Util$blockForShas = F2(
	function (shas, message) {
		var shouldBlock = A2(
			_elm_lang$core$List$any,
			A2(_elm_lang$core$Basics$flip, _elm_lang$core$List$member, shas),
			A2(_elm_lang$core$List$map, _elm_lang$core$Tuple$first, message.files));
		return shouldBlock ? _elm_lang$core$Native_Utils.update(
			message,
			{status: _user$project$Analyser_Messages_Types$Blocked}) : message;
	});

var _user$project$Analyser_Messages_Json$encodeMessageData = function (m) {
	var _p0 = m;
	switch (_p0.ctor) {
		case 'UnreadableSourceFile':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'UnreadableSourceFile',
				_elm_lang$core$Json_Encode$string(_p0._0));
		case 'UnusedVariable':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'UnusedVariable',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'varName',
								_1: _elm_lang$core$Json_Encode$string(_p0._1)
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'range',
									_1: _user$project$AST_Ranges$encode(_p0._2)
								},
								_1: {ctor: '[]'}
							}
						}
					}));
		case 'UnusedTopLevel':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'UnusedTopLevel',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'varName',
								_1: _elm_lang$core$Json_Encode$string(_p0._1)
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'range',
									_1: _user$project$AST_Ranges$encode(_p0._2)
								},
								_1: {ctor: '[]'}
							}
						}
					}));
		case 'UnusedImportedVariable':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'UnusedImportedVariable',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'varName',
								_1: _elm_lang$core$Json_Encode$string(_p0._1)
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'range',
									_1: _user$project$AST_Ranges$encode(_p0._2)
								},
								_1: {ctor: '[]'}
							}
						}
					}));
		case 'UnusedPatternVariable':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'UnusedPatternVariable',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'varName',
								_1: _elm_lang$core$Json_Encode$string(_p0._1)
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'range',
									_1: _user$project$AST_Ranges$encode(_p0._2)
								},
								_1: {ctor: '[]'}
							}
						}
					}));
		case 'ExposeAll':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'ExposeAll',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p0._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'ImportAll':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'ImportAll',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'moduleName',
								_1: _elm_lang$core$Json_Encode$list(
									A2(_elm_lang$core$List$map, _elm_lang$core$Json_Encode$string, _p0._1))
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'range',
									_1: _user$project$AST_Ranges$encode(_p0._2)
								},
								_1: {ctor: '[]'}
							}
						}
					}));
		case 'NoTopLevelSignature':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'NoTopLevelSignature',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'varName',
								_1: _elm_lang$core$Json_Encode$string(_p0._1)
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'range',
									_1: _user$project$AST_Ranges$encode(_p0._2)
								},
								_1: {ctor: '[]'}
							}
						}
					}));
		case 'UnnecessaryParens':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'UnnecessaryParens',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p0._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'MultiLineRecordFormatting':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'MultiLineRecordFormatting',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p0._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'DebugLog':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'DebugLog',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p0._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'DebugCrash':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'DebugCrash',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p0._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'UnformattedFile':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'UnformattedFile',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {ctor: '[]'}
					}));
		case 'UnnecessaryPortModule':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'UnnecessaryPortModule',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {ctor: '[]'}
					}));
		case 'FileLoadFailed':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'FileLoadFailed',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'message',
								_1: _elm_lang$core$Json_Encode$string(_p0._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'DuplicateImport':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'DuplicateImport',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'moduleName',
								_1: _elm_lang$core$Json_Encode$list(
									A2(_elm_lang$core$List$map, _elm_lang$core$Json_Encode$string, _p0._1))
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'ranges',
									_1: _elm_lang$core$Json_Encode$list(
										A2(_elm_lang$core$List$map, _user$project$AST_Ranges$encode, _p0._2))
								},
								_1: {ctor: '[]'}
							}
						}
					}));
		case 'UnusedTypeAlias':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'UnusedTypeAlias',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'varName',
								_1: _elm_lang$core$Json_Encode$string(_p0._1)
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'range',
									_1: _user$project$AST_Ranges$encode(_p0._2)
								},
								_1: {ctor: '[]'}
							}
						}
					}));
		case 'RedefineVariable':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'RedefineVariable',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'varName',
								_1: _elm_lang$core$Json_Encode$string(_p0._1)
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'range1',
									_1: _user$project$AST_Ranges$encode(_p0._2)
								},
								_1: {
									ctor: '::',
									_0: {
										ctor: '_Tuple2',
										_0: 'range2',
										_1: _user$project$AST_Ranges$encode(_p0._3)
									},
									_1: {ctor: '[]'}
								}
							}
						}
					}));
		case 'NoUncurriedPrefix':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'NoUncurriedPrefix',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'varName',
								_1: _elm_lang$core$Json_Encode$string(_p0._1)
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'range',
									_1: _user$project$AST_Ranges$encode(_p0._2)
								},
								_1: {ctor: '[]'}
							}
						}
					}));
		case 'UnusedImportAlias':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'UnusedImportAlias',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'moduleName',
								_1: _elm_lang$core$Json_Encode$list(
									A2(_elm_lang$core$List$map, _elm_lang$core$Json_Encode$string, _p0._1))
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'range',
									_1: _user$project$AST_Ranges$encode(_p0._2)
								},
								_1: {ctor: '[]'}
							}
						}
					}));
		case 'UnusedImport':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'UnusedImport',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'moduleName',
								_1: _elm_lang$core$Json_Encode$list(
									A2(_elm_lang$core$List$map, _elm_lang$core$Json_Encode$string, _p0._1))
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'range',
									_1: _user$project$AST_Ranges$encode(_p0._2)
								},
								_1: {ctor: '[]'}
							}
						}
					}));
		case 'UseConsOverConcat':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'UseConsOverConcat',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p0._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'DropConcatOfLists':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'DropConcatOfLists',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p0._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'DropConsOfItemAndList':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'DropConsOfItemAndList',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p0._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'UnnecessaryListConcat':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'UnnecessaryListConcat',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p0._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'LineLengthExceeded':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'LineLengthExceeded',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'ranges',
								_1: _elm_lang$core$Json_Encode$list(
									A2(_elm_lang$core$List$map, _user$project$AST_Ranges$encode, _p0._1))
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'NonStaticRegex':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'NonStaticRegex',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p0._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		case 'CoreArrayUsage':
			return A2(
				_user$project$Util_Json$encodeTyped,
				'CoreArrayUsage',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p0._1)
							},
							_1: {ctor: '[]'}
						}
					}));
		default:
			return A2(
				_user$project$Util_Json$encodeTyped,
				'FunctionInLet',
				_elm_lang$core$Json_Encode$object(
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'file',
							_1: _elm_lang$core$Json_Encode$string(_p0._0)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'range',
								_1: _user$project$AST_Ranges$encode(_p0._1)
							},
							_1: {ctor: '[]'}
						}
					}));
	}
};
var _user$project$Analyser_Messages_Json$encodeMessageStatus = function (m) {
	return _elm_lang$core$Json_Encode$string(
		function () {
			var _p1 = m;
			switch (_p1.ctor) {
				case 'Applicable':
					return 'applicable';
				case 'Outdated':
					return 'outdated';
				case 'Blocked':
					return 'blocked';
				default:
					return 'fixing';
			}
		}());
};
var _user$project$Analyser_Messages_Json$encodeMessage = function (m) {
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'id',
				_1: _elm_lang$core$Json_Encode$int(m.id)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'status',
					_1: _user$project$Analyser_Messages_Json$encodeMessageStatus(m.status)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'files',
						_1: _elm_lang$core$Json_Encode$list(
							A2(
								_elm_lang$core$List$map,
								function (_p2) {
									var _p3 = _p2;
									return _elm_lang$core$Json_Encode$object(
										{
											ctor: '::',
											_0: {
												ctor: '_Tuple2',
												_0: 'path',
												_1: _elm_lang$core$Json_Encode$string(_p3._1)
											},
											_1: {
												ctor: '::',
												_0: {
													ctor: '_Tuple2',
													_0: 'sha1',
													_1: _elm_lang$core$Json_Encode$string(_p3._0)
												},
												_1: {ctor: '[]'}
											}
										});
								},
								m.files))
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'data',
							_1: _user$project$Analyser_Messages_Json$encodeMessageData(m.data)
						},
						_1: {ctor: '[]'}
					}
				}
			}
		});
};
var _user$project$Analyser_Messages_Json$serialiseMessage = function (_p4) {
	return A2(
		_elm_lang$core$Json_Encode$encode,
		0,
		_user$project$Analyser_Messages_Json$encodeMessage(_p4));
};
var _user$project$Analyser_Messages_Json$decodeMessageFile = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		_elm_lang$core$Json_Decode$succeed(
			F2(
				function (v0, v1) {
					return {ctor: '_Tuple2', _0: v0, _1: v1};
				})),
		A2(_elm_lang$core$Json_Decode$field, 'sha1', _elm_lang$core$Json_Decode$string)),
	A2(_elm_lang$core$Json_Decode$field, 'path', _elm_lang$core$Json_Decode$string));
var _user$project$Analyser_Messages_Json$decodeMessageStatus = A2(
	_elm_lang$core$Json_Decode$andThen,
	function (x) {
		var _p5 = x;
		switch (_p5) {
			case 'outdated':
				return _elm_lang$core$Json_Decode$succeed(_user$project$Analyser_Messages_Types$Outdated);
			case 'blocked':
				return _elm_lang$core$Json_Decode$succeed(_user$project$Analyser_Messages_Types$Blocked);
			case 'applicable':
				return _elm_lang$core$Json_Decode$succeed(_user$project$Analyser_Messages_Types$Applicable);
			case 'fixing':
				return _elm_lang$core$Json_Decode$succeed(_user$project$Analyser_Messages_Types$Fixing);
			default:
				return _elm_lang$core$Json_Decode$fail(
					A2(_elm_lang$core$Basics_ops['++'], 'Expecected message status, but got: ', x));
		}
	},
	_elm_lang$core$Json_Decode$string);
var _user$project$Analyser_Messages_Json$fileField = A2(_elm_lang$core$Json_Decode$field, 'file', _elm_lang$core$Json_Decode$string);
var _user$project$Analyser_Messages_Json$moduleNameField = A2(
	_elm_lang$core$Json_Decode$field,
	'moduleName',
	_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string));
var _user$project$Analyser_Messages_Json$varNameField = A2(_elm_lang$core$Json_Decode$field, 'varName', _elm_lang$core$Json_Decode$string);
var _user$project$Analyser_Messages_Json$decodeFileAndRange = function (f) {
	return A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			_elm_lang$core$Json_Decode$succeed(f),
			_user$project$Analyser_Messages_Json$fileField),
		A2(_elm_lang$core$Json_Decode$field, 'range', _user$project$AST_Ranges$decode));
};
var _user$project$Analyser_Messages_Json$decodeFileModuleNameAndRange = function (f) {
	return A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				_elm_lang$core$Json_Decode$succeed(f),
				_user$project$Analyser_Messages_Json$fileField),
			_user$project$Analyser_Messages_Json$moduleNameField),
		A2(_elm_lang$core$Json_Decode$field, 'range', _user$project$AST_Ranges$decode));
};
var _user$project$Analyser_Messages_Json$decodeFileVarNameAndRange = function (f) {
	return A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				_elm_lang$core$Json_Decode$succeed(f),
				_user$project$Analyser_Messages_Json$fileField),
			_user$project$Analyser_Messages_Json$varNameField),
		A2(_elm_lang$core$Json_Decode$field, 'range', _user$project$AST_Ranges$decode));
};
var _user$project$Analyser_Messages_Json$decodeMessageData = _user$project$Util_Json$decodeTyped(
	{
		ctor: '::',
		_0: {
			ctor: '_Tuple2',
			_0: 'UnreadableSourceFile',
			_1: A2(_elm_lang$core$Json_Decode$map, _user$project$Analyser_Messages_Types$UnreadableSourceFile, _elm_lang$core$Json_Decode$string)
		},
		_1: {
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'UnusedVariable',
				_1: _user$project$Analyser_Messages_Json$decodeFileVarNameAndRange(_user$project$Analyser_Messages_Types$UnusedVariable)
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'UnusedTopLevel',
					_1: _user$project$Analyser_Messages_Json$decodeFileVarNameAndRange(_user$project$Analyser_Messages_Types$UnusedTopLevel)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'UnusedImportedVariable',
						_1: _user$project$Analyser_Messages_Json$decodeFileVarNameAndRange(_user$project$Analyser_Messages_Types$UnusedImportedVariable)
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'UnusedPatternVariable',
							_1: _user$project$Analyser_Messages_Json$decodeFileVarNameAndRange(_user$project$Analyser_Messages_Types$UnusedPatternVariable)
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'ExposeAll',
								_1: _user$project$Analyser_Messages_Json$decodeFileAndRange(_user$project$Analyser_Messages_Types$ExposeAll)
							},
							_1: {
								ctor: '::',
								_0: {
									ctor: '_Tuple2',
									_0: 'ImportAll',
									_1: _user$project$Analyser_Messages_Json$decodeFileModuleNameAndRange(_user$project$Analyser_Messages_Types$ImportAll)
								},
								_1: {
									ctor: '::',
									_0: {
										ctor: '_Tuple2',
										_0: 'NoTopLevelSignature',
										_1: _user$project$Analyser_Messages_Json$decodeFileVarNameAndRange(_user$project$Analyser_Messages_Types$NoTopLevelSignature)
									},
									_1: {
										ctor: '::',
										_0: {
											ctor: '_Tuple2',
											_0: 'UnnecessaryParens',
											_1: _user$project$Analyser_Messages_Json$decodeFileAndRange(_user$project$Analyser_Messages_Types$UnnecessaryParens)
										},
										_1: {
											ctor: '::',
											_0: {
												ctor: '_Tuple2',
												_0: 'DebugLog',
												_1: _user$project$Analyser_Messages_Json$decodeFileAndRange(_user$project$Analyser_Messages_Types$DebugLog)
											},
											_1: {
												ctor: '::',
												_0: {
													ctor: '_Tuple2',
													_0: 'DebugCrash',
													_1: _user$project$Analyser_Messages_Json$decodeFileAndRange(_user$project$Analyser_Messages_Types$DebugCrash)
												},
												_1: {
													ctor: '::',
													_0: {
														ctor: '_Tuple2',
														_0: 'MultiLineRecordFormatting',
														_1: _user$project$Analyser_Messages_Json$decodeFileAndRange(_user$project$Analyser_Messages_Types$MultiLineRecordFormatting)
													},
													_1: {
														ctor: '::',
														_0: {
															ctor: '_Tuple2',
															_0: 'UnformattedFile',
															_1: A2(_elm_lang$core$Json_Decode$map, _user$project$Analyser_Messages_Types$UnformattedFile, _user$project$Analyser_Messages_Json$fileField)
														},
														_1: {
															ctor: '::',
															_0: {
																ctor: '_Tuple2',
																_0: 'UnnecessaryPortModule',
																_1: A2(_elm_lang$core$Json_Decode$map, _user$project$Analyser_Messages_Types$UnnecessaryPortModule, _user$project$Analyser_Messages_Json$fileField)
															},
															_1: {
																ctor: '::',
																_0: {
																	ctor: '_Tuple2',
																	_0: 'FileLoadFailed',
																	_1: A3(
																		_elm_lang$core$Json_Decode$map2,
																		_user$project$Analyser_Messages_Types$FileLoadFailed,
																		_user$project$Analyser_Messages_Json$fileField,
																		A2(_elm_lang$core$Json_Decode$field, 'message', _elm_lang$core$Json_Decode$string))
																},
																_1: {
																	ctor: '::',
																	_0: {
																		ctor: '_Tuple2',
																		_0: 'DuplicateImport',
																		_1: A2(
																			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
																			A2(
																				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
																				A2(
																					_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
																					_elm_lang$core$Json_Decode$succeed(_user$project$Analyser_Messages_Types$DuplicateImport),
																					_user$project$Analyser_Messages_Json$fileField),
																				_user$project$Analyser_Messages_Json$moduleNameField),
																			A2(
																				_elm_lang$core$Json_Decode$field,
																				'ranges',
																				_elm_lang$core$Json_Decode$list(_user$project$AST_Ranges$decode)))
																	},
																	_1: {
																		ctor: '::',
																		_0: {
																			ctor: '_Tuple2',
																			_0: 'UnusedTypeAlias',
																			_1: _user$project$Analyser_Messages_Json$decodeFileVarNameAndRange(_user$project$Analyser_Messages_Types$UnusedTypeAlias)
																		},
																		_1: {
																			ctor: '::',
																			_0: {
																				ctor: '_Tuple2',
																				_0: 'RedefineVariable',
																				_1: A2(
																					_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
																					A2(
																						_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
																						A2(
																							_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
																							A2(
																								_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
																								_elm_lang$core$Json_Decode$succeed(_user$project$Analyser_Messages_Types$RedefineVariable),
																								_user$project$Analyser_Messages_Json$fileField),
																							_user$project$Analyser_Messages_Json$varNameField),
																						A2(_elm_lang$core$Json_Decode$field, 'range1', _user$project$AST_Ranges$decode)),
																					A2(_elm_lang$core$Json_Decode$field, 'range2', _user$project$AST_Ranges$decode))
																			},
																			_1: {
																				ctor: '::',
																				_0: {
																					ctor: '_Tuple2',
																					_0: 'LineLengthExceeded',
																					_1: A2(
																						_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
																						A2(
																							_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
																							_elm_lang$core$Json_Decode$succeed(_user$project$Analyser_Messages_Types$LineLengthExceeded),
																							_user$project$Analyser_Messages_Json$fileField),
																						A2(
																							_elm_lang$core$Json_Decode$field,
																							'ranges',
																							_elm_lang$core$Json_Decode$list(_user$project$AST_Ranges$decode)))
																				},
																				_1: {
																					ctor: '::',
																					_0: {
																						ctor: '_Tuple2',
																						_0: 'NoUncurriedPrefix',
																						_1: _user$project$Analyser_Messages_Json$decodeFileVarNameAndRange(_user$project$Analyser_Messages_Types$NoUncurriedPrefix)
																					},
																					_1: {
																						ctor: '::',
																						_0: {
																							ctor: '_Tuple2',
																							_0: 'UnusedImportAlias',
																							_1: _user$project$Analyser_Messages_Json$decodeFileModuleNameAndRange(_user$project$Analyser_Messages_Types$UnusedImportAlias)
																						},
																						_1: {
																							ctor: '::',
																							_0: {
																								ctor: '_Tuple2',
																								_0: 'UnusedImport',
																								_1: _user$project$Analyser_Messages_Json$decodeFileModuleNameAndRange(_user$project$Analyser_Messages_Types$UnusedImport)
																							},
																							_1: {
																								ctor: '::',
																								_0: {
																									ctor: '_Tuple2',
																									_0: 'UseConsOverConcat',
																									_1: _user$project$Analyser_Messages_Json$decodeFileAndRange(_user$project$Analyser_Messages_Types$UseConsOverConcat)
																								},
																								_1: {
																									ctor: '::',
																									_0: {
																										ctor: '_Tuple2',
																										_0: 'DropConcatOfLists',
																										_1: _user$project$Analyser_Messages_Json$decodeFileAndRange(_user$project$Analyser_Messages_Types$DropConcatOfLists)
																									},
																									_1: {
																										ctor: '::',
																										_0: {
																											ctor: '_Tuple2',
																											_0: 'DropConsOfItemAndList',
																											_1: _user$project$Analyser_Messages_Json$decodeFileAndRange(_user$project$Analyser_Messages_Types$DropConsOfItemAndList)
																										},
																										_1: {
																											ctor: '::',
																											_0: {
																												ctor: '_Tuple2',
																												_0: 'UnnecessaryListConcat',
																												_1: _user$project$Analyser_Messages_Json$decodeFileAndRange(_user$project$Analyser_Messages_Types$UnnecessaryListConcat)
																											},
																											_1: {
																												ctor: '::',
																												_0: {
																													ctor: '_Tuple2',
																													_0: 'NonStaticRegex',
																													_1: _user$project$Analyser_Messages_Json$decodeFileAndRange(_user$project$Analyser_Messages_Types$NonStaticRegex)
																												},
																												_1: {
																													ctor: '::',
																													_0: {
																														ctor: '_Tuple2',
																														_0: 'CoreArrayUsage',
																														_1: _user$project$Analyser_Messages_Json$decodeFileAndRange(_user$project$Analyser_Messages_Types$CoreArrayUsage)
																													},
																													_1: {
																														ctor: '::',
																														_0: {
																															ctor: '_Tuple2',
																															_0: 'FunctionInLet',
																															_1: _user$project$Analyser_Messages_Json$decodeFileAndRange(_user$project$Analyser_Messages_Types$FunctionInLet)
																														},
																														_1: {ctor: '[]'}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var _user$project$Analyser_Messages_Json$decodeMessage = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				_elm_lang$core$Json_Decode$succeed(_user$project$Analyser_Messages_Types$Message),
				A2(_elm_lang$core$Json_Decode$field, 'id', _elm_lang$core$Json_Decode$int)),
			A2(_elm_lang$core$Json_Decode$field, 'status', _user$project$Analyser_Messages_Json$decodeMessageStatus)),
		A2(
			_elm_lang$core$Json_Decode$field,
			'files',
			_elm_lang$core$Json_Decode$list(_user$project$Analyser_Messages_Json$decodeMessageFile))),
	A2(_elm_lang$core$Json_Decode$field, 'data', _user$project$Analyser_Messages_Json$decodeMessageData));

var _user$project$Analyser_State$encodeStatus = function (s) {
	var _p0 = s;
	switch (_p0.ctor) {
		case 'Initialising':
			return _elm_lang$core$Json_Encode$string('initialising');
		case 'Idle':
			return _elm_lang$core$Json_Encode$string('idle');
		default:
			return _elm_lang$core$Json_Encode$string('fixing');
	}
};
var _user$project$Analyser_State$encodeState = function (state) {
	return _elm_lang$core$Json_Encode$object(
		{
			ctor: '::',
			_0: {
				ctor: '_Tuple2',
				_0: 'messages',
				_1: _elm_lang$core$Json_Encode$list(
					A2(_elm_lang$core$List$map, _user$project$Analyser_Messages_Json$encodeMessage, state.messages))
			},
			_1: {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: 'idCount',
					_1: _elm_lang$core$Json_Encode$int(state.idCount)
				},
				_1: {
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 'status',
						_1: _user$project$Analyser_State$encodeStatus(state.status)
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'queue',
							_1: _elm_lang$core$Json_Encode$list(
								A2(_elm_lang$core$List$map, _elm_lang$core$Json_Encode$int, state.queue))
						},
						_1: {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: 'graph',
								_1: _iosphere$elm_network_graph$Graph_Json$encode(state.graph)
							},
							_1: {ctor: '[]'}
						}
					}
				}
			}
		});
};
var _user$project$Analyser_State$updateGraph = F2(
	function (newGraph, s) {
		return _elm_lang$core$Native_Utils.update(
			s,
			{graph: newGraph});
	});
var _user$project$Analyser_State$sortMessages = function (state) {
	return _elm_lang$core$Native_Utils.update(
		state,
		{
			messages: A2(_elm_lang$core$List$sortWith, _user$project$Analyser_Messages_Util$compareMessage, state.messages)
		});
};
var _user$project$Analyser_State$addFixToQueue = F2(
	function (m, s) {
		return _elm_lang$core$Native_Utils.update(
			s,
			{
				queue: A2(
					_elm_lang$core$Basics_ops['++'],
					s.queue,
					{
						ctor: '::',
						_0: m,
						_1: {ctor: '[]'}
					})
			});
	});
var _user$project$Analyser_State$nextTask = function (state) {
	var _p1 = state.queue;
	if (_p1.ctor === '[]') {
		return _elm_lang$core$Maybe$Nothing;
	} else {
		return _elm_lang$core$Maybe$Just(
			{
				ctor: '_Tuple2',
				_0: _elm_lang$core$Native_Utils.update(
					state,
					{queue: _p1._1}),
				_1: _p1._0
			});
	}
};
var _user$project$Analyser_State$getMessage = function (messageId) {
	return function (_p2) {
		return _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$filter,
				function (_p3) {
					return A2(
						F2(
							function (x, y) {
								return _elm_lang$core$Native_Utils.eq(x, y);
							}),
						messageId,
						function (_) {
							return _.id;
						}(_p3));
				},
				function (_) {
					return _.messages;
				}(_p2)));
	};
};
var _user$project$Analyser_State$isBusy = function (s) {
	var _p4 = s.status;
	switch (_p4.ctor) {
		case 'Idle':
			return false;
		case 'Initialising':
			return true;
		default:
			return false;
	}
};
var _user$project$Analyser_State$State = F5(
	function (a, b, c, d, e) {
		return {messages: a, idCount: b, status: c, queue: d, graph: e};
	});
var _user$project$Analyser_State$Idle = {ctor: 'Idle'};
var _user$project$Analyser_State$finishWithNewMessages = F2(
	function (messages, s) {
		var messagesWithId = A2(
			_elm_lang$core$List$indexedMap,
			F2(
				function (n, message) {
					return _elm_lang$core$Native_Utils.update(
						message,
						{id: n + s.idCount});
				}),
			messages);
		var untouchedMessages = A2(
			_elm_lang$core$List$filter,
			function (_p5) {
				return A2(
					F2(
						function (x, y) {
							return _elm_lang$core$Native_Utils.eq(x, y);
						}),
					_user$project$Analyser_Messages_Types$Applicable,
					function (_) {
						return _.status;
					}(_p5));
			},
			s.messages);
		return _user$project$Analyser_State$sortMessages(
			_elm_lang$core$Native_Utils.update(
				s,
				{
					messages: A2(_elm_lang$core$Basics_ops['++'], untouchedMessages, messagesWithId),
					status: _user$project$Analyser_State$Idle,
					idCount: s.idCount + _elm_lang$core$List$length(messages)
				}));
	});
var _user$project$Analyser_State$Fixing = {ctor: 'Fixing'};
var _user$project$Analyser_State$startFixing = F2(
	function (message, state) {
		return _elm_lang$core$Native_Utils.update(
			state,
			{
				status: _user$project$Analyser_State$Fixing,
				messages: A2(
					_elm_lang$core$List$map,
					_user$project$Analyser_Messages_Util$markFixing(message.id),
					A2(
						_elm_lang$core$List$map,
						_user$project$Analyser_Messages_Util$blockForShas(
							A2(_elm_lang$core$List$map, _elm_lang$core$Tuple$first, message.files)),
						state.messages))
			});
	});
var _user$project$Analyser_State$Initialising = {ctor: 'Initialising'};
var _user$project$Analyser_State$initialState = {
	messages: {ctor: '[]'},
	idCount: 0,
	status: _user$project$Analyser_State$Initialising,
	queue: {ctor: '[]'},
	graph: _iosphere$elm_network_graph$Graph$empty
};
var _user$project$Analyser_State$decodeStatus = A2(
	_elm_lang$core$Json_Decode$andThen,
	function (x) {
		var _p6 = x;
		switch (_p6) {
			case 'initialising':
				return _elm_lang$core$Json_Decode$succeed(_user$project$Analyser_State$Initialising);
			case 'idle':
				return _elm_lang$core$Json_Decode$succeed(_user$project$Analyser_State$Idle);
			case 'fixing':
				return _elm_lang$core$Json_Decode$succeed(_user$project$Analyser_State$Fixing);
			default:
				return _elm_lang$core$Json_Decode$fail(
					A2(_elm_lang$core$Basics_ops['++'], 'Could not decode status. got: ', x));
		}
	},
	_elm_lang$core$Json_Decode$string);
var _user$project$Analyser_State$decodeState = A2(
	_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
		A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				A2(
					_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
					_elm_lang$core$Json_Decode$succeed(_user$project$Analyser_State$State),
					A2(
						_elm_lang$core$Json_Decode$field,
						'messages',
						_elm_lang$core$Json_Decode$list(_user$project$Analyser_Messages_Json$decodeMessage))),
				A2(_elm_lang$core$Json_Decode$field, 'idCount', _elm_lang$core$Json_Decode$int)),
			A2(_elm_lang$core$Json_Decode$field, 'status', _user$project$Analyser_State$decodeStatus)),
		A2(
			_elm_lang$core$Json_Decode$field,
			'queue',
			_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$int))),
	A2(_elm_lang$core$Json_Decode$field, 'graph', _iosphere$elm_network_graph$Graph_Json$decode));

var _user$project$AnalyserPorts$messagesAsJson = _elm_lang$core$Native_Platform.outgoingPort(
	'messagesAsJson',
	function (v) {
		return _elm_lang$core$Native_List.toArray(v).map(
			function (v) {
				return v;
			});
	});
var _user$project$AnalyserPorts$sendMessagesAsJson = function (_p0) {
	return _user$project$AnalyserPorts$messagesAsJson(
		A2(_elm_lang$core$List$map, _user$project$Analyser_Messages_Json$serialiseMessage, _p0));
};
var _user$project$AnalyserPorts$sendMessages = _elm_lang$core$Native_Platform.outgoingPort(
	'sendMessages',
	function (v) {
		return _elm_lang$core$Native_List.toArray(v).map(
			function (v) {
				return v;
			});
	});
var _user$project$AnalyserPorts$sendMessagesAsStrings = function (_p1) {
	return _user$project$AnalyserPorts$sendMessages(
		A2(
			_elm_lang$core$List$map,
			function (_p2) {
				return _user$project$Analyser_Messages_Util$asString(
					function (_) {
						return _.data;
					}(_p2));
			},
			_p1));
};
var _user$project$AnalyserPorts$sendState = _elm_lang$core$Native_Platform.outgoingPort(
	'sendState',
	function (v) {
		return v;
	});
var _user$project$AnalyserPorts$sendStateAsJson = function (_p3) {
	return _user$project$AnalyserPorts$sendState(
		A2(
			_elm_lang$core$Json_Encode$encode,
			0,
			_user$project$Analyser_State$encodeState(_p3)));
};
var _user$project$AnalyserPorts$onReset = _elm_lang$core$Native_Platform.incomingPort('onReset', _elm_lang$core$Json_Decode$bool);
var _user$project$AnalyserPorts$onFixMessage = _elm_lang$core$Native_Platform.incomingPort('onFixMessage', _elm_lang$core$Json_Decode$int);

var _user$project$Analyser_OperatorTable$defaultImportString = '\nimport Basics exposing (..)\nimport List exposing ( List, (::) )\nimport Maybe exposing ( Maybe( Just, Nothing ) )\nimport Result exposing ( Result( Ok, Err ) )\nimport String\nimport Tuple\n\nimport Debug\n\nimport Platform exposing ( Program )\nimport Platform.Cmd exposing ( Cmd, (!) )\nimport Platform.Sub exposing ( Sub )\n';
var _user$project$Analyser_OperatorTable$defaultImports = A2(
	_elm_lang$core$Result$withDefault,
	{ctor: '[]'},
	A2(
		_elm_lang$core$Result$map,
		function (_) {
			return _.imports;
		},
		_user$project$Parser_Parser$parse(_user$project$Analyser_OperatorTable$defaultImportString)));
var _user$project$Analyser_OperatorTable$getExposedOperators = function (x) {
	var _p0 = x;
	if (_p0.ctor === 'InfixExpose') {
		return _elm_lang$core$Maybe$Just(_p0._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _user$project$Analyser_OperatorTable$buildSingle = F2(
	function (imp, moduleIndex) {
		var _p1 = imp.exposingList;
		switch (_p1.ctor) {
			case 'None':
				return {ctor: '[]'};
			case 'All':
				return A2(
					_elm_lang$core$List$map,
					function (x) {
						return {ctor: '_Tuple2', _0: x.operator, _1: x};
					},
					_user$project$Analyser_Files_Interface$getOperators(
						A2(
							_elm_lang$core$Maybe$withDefault,
							{ctor: '[]'},
							A2(_elm_lang$core$Dict$get, imp.moduleName, moduleIndex))));
			default:
				var selectedOperators = A2(_elm_lang$core$List$filterMap, _user$project$Analyser_OperatorTable$getExposedOperators, _p1._0);
				return A2(
					_elm_lang$core$List$filter,
					function (_p2) {
						return A3(
							_elm_lang$core$Basics$flip,
							_elm_lang$core$List$member,
							selectedOperators,
							_elm_lang$core$Tuple$first(_p2));
					},
					A2(
						_elm_lang$core$List$map,
						function (x) {
							return {ctor: '_Tuple2', _0: x.operator, _1: x};
						},
						_user$project$Analyser_Files_Interface$getOperators(
							A2(
								_elm_lang$core$Maybe$withDefault,
								{ctor: '[]'},
								A2(_elm_lang$core$Dict$get, imp.moduleName, moduleIndex)))));
		}
	});
var _user$project$Analyser_OperatorTable$build = F2(
	function (imports, moduleIndex) {
		return _elm_lang$core$Dict$fromList(
			A2(
				_elm_lang$core$List$concatMap,
				A2(_elm_lang$core$Basics$flip, _user$project$Analyser_OperatorTable$buildSingle, moduleIndex),
				A2(_elm_lang$core$Basics_ops['++'], _user$project$Analyser_OperatorTable$defaultImports, imports)));
	});
var _user$project$Analyser_OperatorTable$fromFileLoad = function (fl) {
	var _p3 = fl;
	if (_p3.ctor === 'Loaded') {
		var _p4 = _p3._0;
		return A2(
			_elm_lang$core$Maybe$map,
			A2(
				_elm_lang$core$Basics$flip,
				F2(
					function (v0, v1) {
						return {ctor: '_Tuple2', _0: v0, _1: v1};
					}),
				_p4.$interface),
			_p4.moduleName);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _user$project$Analyser_OperatorTable$buildModuleIndex = F2(
	function (sourceFiles, dependencies) {
		return _elm_lang$core$Dict$fromList(
			A2(
				_elm_lang$core$Basics_ops['++'],
				A2(
					_elm_lang$core$List$filterMap,
					function (_p5) {
						return _user$project$Analyser_OperatorTable$fromFileLoad(
							_elm_lang$core$Tuple$second(_p5));
					},
					sourceFiles),
				A2(
					_elm_lang$core$List$concatMap,
					function (_p6) {
						return _elm_lang$core$Dict$toList(
							function (_) {
								return _.interfaces;
							}(_p6));
					},
					dependencies)));
	});

var _user$project$Analyser_PostProcessing_Documentation$isDocumentationForRange = F2(
	function (range, _p0) {
		var _p1 = _p0;
		var _p2 = _p1._1;
		if (A2(_elm_lang$core$String$startsWith, '{-|', _p1._0)) {
			var functionStartRow = range.start.row;
			return _elm_lang$core$Native_Utils.eq(_p2.end.row, functionStartRow) && _elm_lang$core$Native_Utils.eq(_p2.end.column, -2);
		} else {
			return false;
		}
	});
var _user$project$Analyser_PostProcessing_Documentation$replaceFunction = F2(
	function (f1, decl) {
		var _p3 = decl;
		if (_p3.ctor === 'FuncDecl') {
			return _elm_lang$core$Native_Utils.eq(f1.declaration.name.range, _p3._0.declaration.name.range) ? _user$project$AST_Types$FuncDecl(f1) : decl;
		} else {
			return decl;
		}
	});
var _user$project$Analyser_PostProcessing_Documentation$replaceTypeAlias = F2(
	function (f1, decl) {
		var _p4 = decl;
		if (_p4.ctor === 'AliasDecl') {
			return _elm_lang$core$Native_Utils.eq(f1.range, _p4._0.range) ? _user$project$AST_Types$AliasDecl(f1) : decl;
		} else {
			return decl;
		}
	});
var _user$project$Analyser_PostProcessing_Documentation$onFunction = F2(
	function ($function, file) {
		var functionRange = A2(
			_elm_lang$core$Maybe$withDefault,
			$function.declaration.name.range,
			A2(
				_elm_lang$core$Maybe$map,
				function (_) {
					return _.range;
				},
				$function.signature));
		var docs = A2(
			_elm_lang$core$List$filter,
			_user$project$Analyser_PostProcessing_Documentation$isDocumentationForRange(functionRange),
			file.comments);
		var _p5 = _elm_lang$core$List$head(docs);
		if (_p5.ctor === 'Just') {
			var _p6 = _p5._0;
			return _elm_lang$core$Native_Utils.update(
				file,
				{
					comments: A2(
						_elm_lang$core$List$filter,
						F2(
							function (x, y) {
								return !_elm_lang$core$Native_Utils.eq(x, y);
							})(_p6),
						file.comments),
					declarations: A2(
						_elm_lang$core$List$map,
						_user$project$Analyser_PostProcessing_Documentation$replaceFunction(
							_elm_lang$core$Native_Utils.update(
								$function,
								{
									documentation: _elm_lang$core$Maybe$Just(_p6)
								})),
						file.declarations)
				});
		} else {
			return file;
		}
	});
var _user$project$Analyser_PostProcessing_Documentation$onTypeAlias = F2(
	function (typeAlias, file) {
		var docs = A2(
			_elm_lang$core$List$filter,
			_user$project$Analyser_PostProcessing_Documentation$isDocumentationForRange(typeAlias.range),
			file.comments);
		var _p7 = _elm_lang$core$List$head(docs);
		if (_p7.ctor === 'Just') {
			var _p8 = _p7._0;
			return _elm_lang$core$Native_Utils.update(
				file,
				{
					comments: A2(
						_elm_lang$core$List$filter,
						F2(
							function (x, y) {
								return !_elm_lang$core$Native_Utils.eq(x, y);
							})(_p8),
						file.comments),
					declarations: A2(
						_elm_lang$core$List$map,
						_user$project$Analyser_PostProcessing_Documentation$replaceTypeAlias(
							_elm_lang$core$Native_Utils.update(
								typeAlias,
								{
									documentation: _elm_lang$core$Maybe$Just(_p8)
								})),
						file.declarations)
				});
		} else {
			return file;
		}
	});
var _user$project$Analyser_PostProcessing_Documentation$postProcess = function (file) {
	return A3(
		_user$project$Inspector$inspect,
		_elm_lang$core$Native_Utils.update(
			_user$project$Inspector$defaultConfig,
			{
				onFunction: _user$project$Inspector$Post(_user$project$Analyser_PostProcessing_Documentation$onFunction),
				onTypeAlias: _user$project$Inspector$Post(_user$project$Analyser_PostProcessing_Documentation$onTypeAlias)
			}),
		file,
		file);
};

var _user$project$Analyser_PostProcessing$visitDeclarations = F3(
	function (visitor, context, declarations) {
		return A2(
			_elm_lang$core$List$map,
			A2(_user$project$Analyser_PostProcessing$visitDeclaration, visitor, context),
			declarations);
	});
var _user$project$Analyser_PostProcessing$visitDeclaration = F3(
	function (visitor, context, declaration) {
		var _p0 = declaration;
		if (_p0.ctor === 'FuncDecl') {
			return _user$project$AST_Types$FuncDecl(
				A3(_user$project$Analyser_PostProcessing$visitFunctionDecl, visitor, context, _p0._0));
		} else {
			return declaration;
		}
	});
var _user$project$Analyser_PostProcessing$visitFunctionDecl = F3(
	function (visitor, context, $function) {
		var newFunctionDeclaration = A3(_user$project$Analyser_PostProcessing$visitFunctionDeclaration, visitor, context, $function.declaration);
		return _elm_lang$core$Native_Utils.update(
			$function,
			{declaration: newFunctionDeclaration});
	});
var _user$project$Analyser_PostProcessing$visitFunctionDeclaration = F3(
	function (visitor, context, functionDeclaration) {
		var newExpression = A3(_user$project$Analyser_PostProcessing$visitExpression, visitor, context, functionDeclaration.expression);
		return _elm_lang$core$Native_Utils.update(
			functionDeclaration,
			{expression: newExpression});
	});
var _user$project$Analyser_PostProcessing$visitExpression = F3(
	function (visitor, context, expression) {
		var inner = A2(_user$project$Analyser_PostProcessing$visitExpressionInner, visitor, context);
		return A3(
			A2(
				_elm_lang$core$Maybe$withDefault,
				F3(
					function (_p1, inner, expr) {
						return inner(expr);
					}),
				visitor.onExpression),
			context,
			inner,
			expression);
	});
var _user$project$Analyser_PostProcessing$visitExpressionInner = F3(
	function (visitor, context, _p2) {
		var _p3 = _p2;
		var _p10 = _p3._1;
		var subVisit = A2(_user$project$Analyser_PostProcessing$visitExpression, visitor, context);
		return A2(
			F2(
				function (v0, v1) {
					return {ctor: '_Tuple2', _0: v0, _1: v1};
				}),
			_p3._0,
			function () {
				var _p4 = _p10;
				switch (_p4.ctor) {
					case 'Application':
						return _user$project$AST_Types$Application(
							A2(_elm_lang$core$List$map, subVisit, _p4._0));
					case 'OperatorApplication':
						return A4(
							_user$project$AST_Types$OperatorApplication,
							_p4._0,
							_p4._1,
							subVisit(_p4._2),
							subVisit(_p4._3));
					case 'IfBlock':
						return A3(
							_user$project$AST_Types$IfBlock,
							subVisit(_p4._0),
							subVisit(_p4._1),
							subVisit(_p4._2));
					case 'TupledExpression':
						return _user$project$AST_Types$TupledExpression(
							A2(_elm_lang$core$List$map, subVisit, _p4._0));
					case 'ParenthesizedExpression':
						return _user$project$AST_Types$ParenthesizedExpression(
							subVisit(_p4._0));
					case 'LetExpression':
						var _p5 = _p4._0;
						return _user$project$AST_Types$LetExpression(
							{
								declarations: A3(_user$project$Analyser_PostProcessing$visitDeclarations, visitor, context, _p5.declarations),
								expression: subVisit(_p5.expression)
							});
					case 'CaseExpression':
						var _p6 = _p4._0;
						return _user$project$AST_Types$CaseExpression(
							{
								expression: subVisit(_p6.expression),
								cases: A2(
									_elm_lang$core$List$map,
									_Fresheyeball$elm_tuple_extra$Tuple2$mapSecond(subVisit),
									_p6.cases)
							});
					case 'LambdaExpression':
						var _p7 = _p4._0;
						return _user$project$AST_Types$LambdaExpression(
							_elm_lang$core$Native_Utils.update(
								_p7,
								{
									expression: subVisit(_p7.expression)
								}));
					case 'RecordExpr':
						return _user$project$AST_Types$RecordExpr(
							A2(
								_elm_lang$core$List$map,
								_Fresheyeball$elm_tuple_extra$Tuple2$mapSecond(subVisit),
								_p4._0));
					case 'ListExpr':
						return _user$project$AST_Types$ListExpr(
							A2(_elm_lang$core$List$map, subVisit, _p4._0));
					case 'RecordUpdateExpression':
						var _p9 = _p4._0;
						return function (_p8) {
							return _user$project$AST_Types$RecordUpdateExpression(
								A2(_user$project$AST_Types$RecordUpdate, _p9.name, _p8));
						}(
							A2(
								_elm_lang$core$List$map,
								_elm_lang$core$Tuple$mapSecond(subVisit),
								_p9.updates));
					default:
						return _p10;
				}
			}());
	});
var _user$project$Analyser_PostProcessing$visit = F3(
	function (visitor, context, file) {
		var newDeclarations = A3(_user$project$Analyser_PostProcessing$visitDeclarations, visitor, context, file.declarations);
		return _elm_lang$core$Native_Utils.update(
			file,
			{declarations: newDeclarations});
	});
var _user$project$Analyser_PostProcessing$expressionOperators = function (_p11) {
	var _p12 = _p11;
	var _p13 = _p12._1;
	if (_p13.ctor === 'Operator') {
		return _elm_lang$core$Maybe$Just(_p13._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _user$project$Analyser_PostProcessing$highestPrecedence = function (input) {
	var maxi = _elm_lang$core$List$maximum(
		A2(
			_elm_lang$core$List$map,
			function (_p14) {
				return function (_) {
					return _.precedence;
				}(
					_elm_lang$core$Tuple$second(_p14));
			},
			input));
	return _elm_lang$core$Dict$fromList(
		A2(
			_elm_lang$core$Maybe$withDefault,
			{ctor: '[]'},
			A2(
				_elm_lang$core$Maybe$map,
				function (m) {
					return A2(
						_elm_lang$core$List$filter,
						function (_p15) {
							return A2(
								F2(
									function (x, y) {
										return _elm_lang$core$Native_Utils.eq(x, y);
									}),
								m,
								function (_) {
									return _.precedence;
								}(
									_elm_lang$core$Tuple$second(_p15)));
						},
						input);
				},
				maxi)));
};
var _user$project$Analyser_PostProcessing$findNextSplit = F2(
	function (dict, exps) {
		var prefix = A2(
			_elm_community$list_extra$List_Extra$takeWhile,
			function (x) {
				return A2(
					F2(
						function (x, y) {
							return _elm_lang$core$Native_Utils.eq(x, y);
						}),
					_elm_lang$core$Maybe$Nothing,
					A2(
						_elm_lang$core$Maybe$andThen,
						A2(_elm_lang$core$Basics$flip, _elm_lang$core$Dict$get, dict),
						_user$project$Analyser_PostProcessing$expressionOperators(x)));
			},
			exps);
		var suffix = A2(
			_elm_lang$core$List$drop,
			_elm_lang$core$List$length(prefix) + 1,
			exps);
		return A2(
			_elm_lang$core$Maybe$map,
			function (x) {
				return {ctor: '_Tuple3', _0: prefix, _1: x, _2: suffix};
			},
			A2(
				_elm_lang$core$Maybe$andThen,
				function (x) {
					return A2(_elm_lang$core$Dict$get, x, dict);
				},
				A2(
					_elm_lang$core$Maybe$andThen,
					_user$project$Analyser_PostProcessing$expressionOperators,
					_elm_lang$core$List$head(
						A2(
							_elm_lang$core$List$drop,
							_elm_lang$core$List$length(prefix),
							exps)))));
	});
var _user$project$Analyser_PostProcessing$fixApplication = F2(
	function (operators, expressions) {
		var fixExprs = function (exps) {
			var _p16 = exps;
			if ((_p16.ctor === '::') && (_p16._1.ctor === '[]')) {
				return _elm_lang$core$Tuple$second(_p16._0);
			} else {
				return _user$project$AST_Types$Application(exps);
			}
		};
		var ops = _user$project$Analyser_PostProcessing$highestPrecedence(
			A2(
				_elm_lang$core$List$map,
				function (x) {
					return {
						ctor: '_Tuple2',
						_0: x,
						_1: A2(
							_elm_lang$core$Maybe$withDefault,
							{operator: x, precedence: 5, direction: _user$project$AST_Types$Left},
							A2(_elm_lang$core$Dict$get, x, operators))
					};
				},
				A2(_elm_lang$core$List$filterMap, _user$project$Analyser_PostProcessing$expressionOperators, expressions)));
		var divideAndConquer = function (exps) {
			return _elm_lang$core$Dict$isEmpty(ops) ? fixExprs(exps) : A2(
				_elm_lang$core$Maybe$withDefault,
				fixExprs(exps),
				A2(
					_elm_lang$core$Maybe$map,
					function (_p17) {
						var _p18 = _p17;
						var _p21 = _p18._2;
						var _p20 = _p18._0;
						var _p19 = _p18._1;
						return A4(
							_user$project$AST_Types$OperatorApplication,
							_p19.operator,
							_p19.direction,
							{
								ctor: '_Tuple2',
								_0: _user$project$AST_Ranges$getRange(
									A2(_elm_lang$core$List$map, _elm_lang$core$Tuple$first, _p20)),
								_1: divideAndConquer(_p20)
							},
							{
								ctor: '_Tuple2',
								_0: _user$project$AST_Ranges$getRange(
									A2(_elm_lang$core$List$map, _elm_lang$core$Tuple$first, _p21)),
								_1: divideAndConquer(_p21)
							});
					},
					A2(_user$project$Analyser_PostProcessing$findNextSplit, ops, exps)));
		};
		return divideAndConquer(expressions);
	});
var _user$project$Analyser_PostProcessing$postProcess = F2(
	function (table, file) {
		var operatorFixed = A3(
			_user$project$Analyser_PostProcessing$visit,
			{
				onExpression: _elm_lang$core$Maybe$Just(
					F3(
						function (context, inner, expression) {
							return inner(
								function () {
									var _p22 = expression;
									if ((_p22.ctor === '_Tuple2') && (_p22._1.ctor === 'Application')) {
										return {
											ctor: '_Tuple2',
											_0: _p22._0,
											_1: A2(_user$project$Analyser_PostProcessing$fixApplication, context, _p22._1._0)
										};
									} else {
										return expression;
									}
								}());
						}))
			},
			table,
			file);
		return _user$project$Analyser_PostProcessing_Documentation$postProcess(operatorFixed);
	});
var _user$project$Analyser_PostProcessing$Visitor = function (a) {
	return {onExpression: a};
};

var _user$project$Analyser_FileContext$create = F3(
	function (sourceFiles, dependencies, _p0) {
		var _p1 = _p0;
		var _p4 = _p1._0;
		var moduleIndex = A2(_user$project$Analyser_OperatorTable$buildModuleIndex, sourceFiles, dependencies);
		var _p2 = _p1._1;
		if (_p2.ctor === 'Failed') {
			return _elm_lang$core$Maybe$Nothing;
		} else {
			var _p3 = _p2._0;
			return _elm_lang$core$Maybe$Just(
				function () {
					var operatorTable = A2(_user$project$Analyser_OperatorTable$build, _p3.ast.imports, moduleIndex);
					return {
						moduleName: _p3.moduleName,
						ast: A2(_user$project$Analyser_PostProcessing$postProcess, operatorTable, _p3.ast),
						path: _p4.path,
						content: A2(_elm_lang$core$Maybe$withDefault, '', _p4.content),
						$interface: _user$project$Analyser_Files_Interface$build(_p3.ast),
						sha1: A2(_elm_lang$core$Maybe$withDefault, '', _p4.sha1)
					};
				}());
		}
	});
var _user$project$Analyser_FileContext$FileContext = F6(
	function (a, b, c, d, e, f) {
		return {$interface: a, moduleName: b, ast: c, content: d, path: e, sha1: f};
	});

var _user$project$Analyser_Configuration$decodeChecks = _elm_lang$core$Json_Decode$dict(_elm_lang$core$Json_Decode$bool);
var _user$project$Analyser_Configuration$checkPropertyAsInt = F3(
	function (check, prop, _p0) {
		var _p1 = _p0;
		return A2(
			_elm_lang$core$Maybe$andThen,
			_elm_lang$core$Basics$identity,
			_elm_lang$core$Result$toMaybe(
				A2(
					_elm_lang$core$Json_Decode$decodeString,
					_elm_lang$core$Json_Decode$maybe(
						A2(
							_elm_lang$core$Json_Decode$at,
							{
								ctor: '::',
								_0: check,
								_1: {
									ctor: '::',
									_0: prop,
									_1: {ctor: '[]'}
								}
							},
							_elm_lang$core$Json_Decode$int)),
					_p1._0.raw)));
	});
var _user$project$Analyser_Configuration$defaultChecks = _elm_lang$core$Dict$fromList(
	{
		ctor: '::',
		_0: {ctor: '_Tuple2', _0: 'FunctionsInLet', _1: false},
		_1: {ctor: '[]'}
	});
var _user$project$Analyser_Configuration$withDefaultChecks = function (x) {
	return A6(
		_elm_lang$core$Dict$merge,
		_elm_lang$core$Dict$insert,
		F4(
			function (k, _p2, b, result) {
				return A3(_elm_lang$core$Dict$insert, k, b, result);
			}),
		_elm_lang$core$Dict$insert,
		_user$project$Analyser_Configuration$defaultChecks,
		x,
		_elm_lang$core$Dict$empty);
};
var _user$project$Analyser_Configuration$isPathExcluded = F2(
	function (p, _p3) {
		var _p4 = _p3;
		return A2(
			_elm_lang$core$List$any,
			A2(_elm_lang$core$Basics$flip, _elm_lang$core$String$startsWith, p),
			_p4._0.excludedPaths);
	});
var _user$project$Analyser_Configuration$checkEnabled = F2(
	function (k, _p5) {
		var _p6 = _p5;
		return A2(
			_elm_lang$core$Maybe$withDefault,
			true,
			A2(_elm_lang$core$Dict$get, k, _p6._0.checks));
	});
var _user$project$Analyser_Configuration$ConfigurationInner = F3(
	function (a, b, c) {
		return {raw: a, checks: b, excludedPaths: c};
	});
var _user$project$Analyser_Configuration$B = function (a) {
	return {ctor: 'B', _0: a};
};
var _user$project$Analyser_Configuration$S = function (a) {
	return {ctor: 'S', _0: a};
};
var _user$project$Analyser_Configuration$I = function (a) {
	return {ctor: 'I', _0: a};
};
var _user$project$Analyser_Configuration$Configuration = function (a) {
	return {ctor: 'Configuration', _0: a};
};
var _user$project$Analyser_Configuration$defaultConfiguration = _user$project$Analyser_Configuration$Configuration(
	{
		raw: '',
		checks: _user$project$Analyser_Configuration$defaultChecks,
		excludedPaths: {ctor: '[]'}
	});
var _user$project$Analyser_Configuration$mergeWithDefaults = function (_p7) {
	var _p8 = _p7;
	var _p9 = _p8._0;
	return _user$project$Analyser_Configuration$Configuration(
		_elm_lang$core$Native_Utils.update(
			_p9,
			{
				checks: _user$project$Analyser_Configuration$withDefaultChecks(_p9.checks)
			}));
};
var _user$project$Analyser_Configuration$decodeConfiguration = function (raw) {
	return A2(
		_elm_lang$core$Json_Decode$map,
		_user$project$Analyser_Configuration$Configuration,
		A2(
			_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$json_extra$Json_Decode_Extra_ops['|:'],
				_elm_lang$core$Json_Decode$succeed(
					_user$project$Analyser_Configuration$ConfigurationInner(raw)),
				_elm_lang$core$Json_Decode$oneOf(
					{
						ctor: '::',
						_0: A2(_elm_lang$core$Json_Decode$field, 'checks', _user$project$Analyser_Configuration$decodeChecks),
						_1: {
							ctor: '::',
							_0: _elm_lang$core$Json_Decode$succeed(_elm_lang$core$Dict$empty),
							_1: {ctor: '[]'}
						}
					})),
			_elm_lang$core$Json_Decode$oneOf(
				{
					ctor: '::',
					_0: A2(
						_elm_lang$core$Json_Decode$field,
						'excludedPaths',
						_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string)),
					_1: {
						ctor: '::',
						_0: _elm_lang$core$Json_Decode$succeed(
							{ctor: '[]'}),
						_1: {ctor: '[]'}
					}
				})));
};
var _user$project$Analyser_Configuration$fromString = function (input) {
	if (_elm_lang$core$Native_Utils.eq(input, '')) {
		return {
			ctor: '_Tuple2',
			_0: _user$project$Analyser_Configuration$defaultConfiguration,
			_1: {
				ctor: '::',
				_0: 'No configuration provided. Using default configuration.',
				_1: {ctor: '[]'}
			}
		};
	} else {
		var _p10 = A2(
			_elm_lang$core$Json_Decode$decodeString,
			_user$project$Analyser_Configuration$decodeConfiguration(input),
			input);
		if (_p10.ctor === 'Err') {
			return {
				ctor: '_Tuple2',
				_0: _user$project$Analyser_Configuration$defaultConfiguration,
				_1: {
					ctor: '::',
					_0: A2(
						_elm_lang$core$Basics_ops['++'],
						'Failed to decode defined configuration due to: ',
						A2(_elm_lang$core$Basics_ops['++'], _p10._0, '. Falling back to default configuration')),
					_1: {ctor: '[]'}
				}
			};
		} else {
			return {
				ctor: '_Tuple2',
				_0: _user$project$Analyser_Configuration$mergeWithDefaults(_p10._0),
				_1: {ctor: '[]'}
			};
		}
	}
};

var _user$project$Analyser_Checks_Base$keyBasedChecker = F2(
	function (keys, configuration) {
		return A2(
			_elm_lang$core$List$any,
			A2(_elm_lang$core$Basics$flip, _user$project$Analyser_Configuration$checkEnabled, configuration),
			keys);
	});
var _user$project$Analyser_Checks_Base$Checker = F2(
	function (a, b) {
		return {shouldCheck: a, check: b};
	});

var _user$project$Analyser_Checks_UnusedVariable$flagVariable = F2(
	function (k, l) {
		var _p0 = l;
		if (_p0.ctor === '[]') {
			return {ctor: '[]'};
		} else {
			var _p3 = _p0._1;
			var _p2 = _p0._0._1;
			var _p1 = _p0._0._0;
			return A2(_elm_lang$core$List$member, k, _p1) ? {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _p1, _1: _p2},
				_1: _p3
			} : (A2(_elm_lang$core$Dict$member, k, _p2) ? {
				ctor: '::',
				_0: {
					ctor: '_Tuple2',
					_0: _p1,
					_1: A3(
						_elm_lang$core$Dict$update,
						k,
						_elm_lang$core$Maybe$map(
							_Fresheyeball$elm_tuple_extra$Tuple3$mapFirst(
								F2(
									function (x, y) {
										return x + y;
									})(1))),
						_p2)
				},
				_1: _p3
			} : {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _p1, _1: _p2},
				_1: A2(_user$project$Analyser_Checks_UnusedVariable$flagVariable, k, _p3)
			});
		}
	});
var _user$project$Analyser_Checks_UnusedVariable$addUsedVariable = F2(
	function (x, context) {
		return _elm_lang$core$Native_Utils.update(
			context,
			{
				activeScopes: A2(_user$project$Analyser_Checks_UnusedVariable$flagVariable, x, context.activeScopes)
			});
	});
var _user$project$Analyser_Checks_UnusedVariable$onFunctionOrValue = F2(
	function (x, context) {
		return A2(_user$project$Analyser_Checks_UnusedVariable$addUsedVariable, x, context);
	});
var _user$project$Analyser_Checks_UnusedVariable$onRecordUpdate = F2(
	function (recordUpdate, context) {
		return A2(_user$project$Analyser_Checks_UnusedVariable$addUsedVariable, recordUpdate.name, context);
	});
var _user$project$Analyser_Checks_UnusedVariable$onOperatorAppliction = F2(
	function (_p4, context) {
		var _p5 = _p4;
		return A2(_user$project$Analyser_Checks_UnusedVariable$addUsedVariable, _p5._0, context);
	});
var _user$project$Analyser_Checks_UnusedVariable$onDestructuring = F2(
	function (_p6, context) {
		var _p7 = _p6;
		return A3(
			_elm_lang$core$List$foldl,
			_user$project$Analyser_Checks_UnusedVariable$addUsedVariable,
			context,
			A2(
				_elm_lang$core$List$map,
				function (_) {
					return _.value;
				},
				_user$project$ASTUtil_Variables$patternToUsedVars(_p7.pattern)));
	});
var _user$project$Analyser_Checks_UnusedVariable$maskVariable = F2(
	function (k, context) {
		return _elm_lang$core$Native_Utils.update(
			context,
			{
				activeScopes: function () {
					var _p8 = context.activeScopes;
					if (_p8.ctor === '[]') {
						return {ctor: '[]'};
					} else {
						return {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: {ctor: '::', _0: k, _1: _p8._0._0},
								_1: _p8._0._1
							},
							_1: _p8._1
						};
					}
				}()
			});
	});
var _user$project$Analyser_Checks_UnusedVariable$unMaskVariable = F2(
	function (k, context) {
		return _elm_lang$core$Native_Utils.update(
			context,
			{
				activeScopes: function () {
					var _p9 = context.activeScopes;
					if (_p9.ctor === '[]') {
						return {ctor: '[]'};
					} else {
						return {
							ctor: '::',
							_0: {
								ctor: '_Tuple2',
								_0: A2(
									_elm_lang$core$List$filter,
									F2(
										function (x, y) {
											return !_elm_lang$core$Native_Utils.eq(x, y);
										})(k),
									_p9._0._0),
								_1: _p9._0._1
							},
							_1: _p9._1
						};
					}
				}()
			});
	});
var _user$project$Analyser_Checks_UnusedVariable$emptyContext = {
	poppedScopes: {ctor: '[]'},
	activeScopes: {ctor: '[]'}
};
var _user$project$Analyser_Checks_UnusedVariable$popScope = function (x) {
	return _elm_lang$core$Native_Utils.update(
		x,
		{
			activeScopes: A2(_elm_lang$core$List$drop, 1, x.activeScopes),
			poppedScopes: A2(
				_elm_lang$core$Maybe$withDefault,
				x.poppedScopes,
				A2(
					_elm_lang$core$Maybe$map,
					function (_p10) {
						var _p11 = _p10;
						var _p12 = _p11._1;
						return _elm_lang$core$Dict$isEmpty(_p12) ? x.poppedScopes : {ctor: '::', _0: _p12, _1: x.poppedScopes};
					},
					_elm_lang$core$List$head(x.activeScopes)))
		});
};
var _user$project$Analyser_Checks_UnusedVariable$pushScope = F2(
	function (vars, x) {
		var y = A2(
			F2(
				function (v0, v1) {
					return {ctor: '_Tuple2', _0: v0, _1: v1};
				}),
			{ctor: '[]'},
			_elm_lang$core$Dict$fromList(
				A2(
					_elm_lang$core$List$map,
					function (_p13) {
						var _p14 = _p13;
						var _p15 = _p14._0;
						return {
							ctor: '_Tuple2',
							_0: _p15.value,
							_1: {ctor: '_Tuple3', _0: 0, _1: _p14._1, _2: _p15.range}
						};
					},
					vars)));
		return _elm_lang$core$Native_Utils.update(
			x,
			{
				activeScopes: {ctor: '::', _0: y, _1: x.activeScopes}
			});
	});
var _user$project$Analyser_Checks_UnusedVariable$onFile = F2(
	function (file, context) {
		return A3(
			_elm_lang$core$Basics$flip,
			_user$project$Analyser_Checks_UnusedVariable$pushScope,
			context,
			_user$project$ASTUtil_Variables$getTopLevels(file));
	});
var _user$project$Analyser_Checks_UnusedVariable$onFunction = F3(
	function (f, $function, context) {
		var postContext = function (c) {
			return A2(
				_user$project$Analyser_Checks_UnusedVariable$unMaskVariable,
				$function.declaration.name.value,
				_user$project$Analyser_Checks_UnusedVariable$popScope(
					f(
						A3(
							_elm_lang$core$Basics$flip,
							_user$project$Analyser_Checks_UnusedVariable$pushScope,
							c,
							A2(_elm_lang$core$List$concatMap, _user$project$ASTUtil_Variables$patternToVars, $function.declaration.$arguments)))));
		}(
			A2(_user$project$Analyser_Checks_UnusedVariable$maskVariable, $function.declaration.name.value, context));
		var used = A2(
			_elm_lang$core$List$map,
			function (_) {
				return _.value;
			},
			A2(_elm_lang$core$List$concatMap, _user$project$ASTUtil_Variables$patternToUsedVars, $function.declaration.$arguments));
		return A3(_elm_lang$core$List$foldl, _user$project$Analyser_Checks_UnusedVariable$addUsedVariable, postContext, used);
	});
var _user$project$Analyser_Checks_UnusedVariable$onLambda = F3(
	function (f, lambda, context) {
		var preContext = A3(
			_elm_lang$core$Basics$flip,
			_user$project$Analyser_Checks_UnusedVariable$pushScope,
			context,
			A2(_elm_lang$core$List$concatMap, _user$project$ASTUtil_Variables$patternToVars, lambda.args));
		var postContext = f(preContext);
		return _user$project$Analyser_Checks_UnusedVariable$popScope(postContext);
	});
var _user$project$Analyser_Checks_UnusedVariable$onLetBlock = F3(
	function (f, letBlock, context) {
		return _user$project$Analyser_Checks_UnusedVariable$popScope(
			f(
				A3(
					_elm_lang$core$Basics$flip,
					_user$project$Analyser_Checks_UnusedVariable$pushScope,
					context,
					function (_p16) {
						return _user$project$ASTUtil_Variables$withoutTopLevel(
							_user$project$ASTUtil_Variables$getDeclarationsVars(_p16));
					}(letBlock.declarations))));
	});
var _user$project$Analyser_Checks_UnusedVariable$onCase = F3(
	function (f, caze, context) {
		var postContext = _user$project$Analyser_Checks_UnusedVariable$popScope(
			f(
				A3(
					_elm_lang$core$Basics$flip,
					_user$project$Analyser_Checks_UnusedVariable$pushScope,
					context,
					A2(
						_user$project$ASTUtil_Variables$patternToVarsInner,
						false,
						_elm_lang$core$Tuple$first(caze)))));
		var used = A2(
			_elm_lang$core$List$map,
			function (_) {
				return _.value;
			},
			_user$project$ASTUtil_Variables$patternToUsedVars(
				_elm_lang$core$Tuple$first(caze)));
		return A3(_elm_lang$core$List$foldl, _user$project$Analyser_Checks_UnusedVariable$addUsedVariable, postContext, used);
	});
var _user$project$Analyser_Checks_UnusedVariable$filterForEffectModule = function (_p17) {
	var _p18 = _p17;
	return !A2(
		_elm_lang$core$List$member,
		_p18._0,
		{
			ctor: '::',
			_0: 'init',
			_1: {
				ctor: '::',
				_0: 'onEffects',
				_1: {
					ctor: '::',
					_0: 'onSelfMsg',
					_1: {
						ctor: '::',
						_0: 'subMap',
						_1: {
							ctor: '::',
							_0: 'cmdMap',
							_1: {ctor: '[]'}
						}
					}
				}
			}
		});
};
var _user$project$Analyser_Checks_UnusedVariable$filterByModuleType = function (fileContext) {
	var _p19 = fileContext.ast.moduleDefinition;
	if (_p19.ctor === 'EffectModule') {
		return _user$project$Analyser_Checks_UnusedVariable$filterForEffectModule;
	} else {
		return _elm_lang$core$Basics$always(true);
	}
};
var _user$project$Analyser_Checks_UnusedVariable$forVariableType = F5(
	function (path, configuration, variableType, variableName, range) {
		var _p20 = variableType;
		switch (_p20.ctor) {
			case 'Imported':
				return A2(_user$project$Analyser_Configuration$checkEnabled, 'UnusedImportedVariable', configuration) ? _elm_lang$core$Maybe$Just(
					A3(_user$project$Analyser_Messages_Types$UnusedImportedVariable, path, variableName, range)) : _elm_lang$core$Maybe$Nothing;
			case 'TopLevel':
				return A2(_user$project$Analyser_Configuration$checkEnabled, 'UnusedTopLevel', configuration) ? _elm_lang$core$Maybe$Just(
					A3(_user$project$Analyser_Messages_Types$UnusedTopLevel, path, variableName, range)) : _elm_lang$core$Maybe$Nothing;
			case 'Defined':
				return A2(_user$project$Analyser_Configuration$checkEnabled, 'UnusedVariable', configuration) ? _elm_lang$core$Maybe$Just(
					A3(_user$project$Analyser_Messages_Types$UnusedVariable, path, variableName, range)) : _elm_lang$core$Maybe$Nothing;
			default:
				return A2(_user$project$Analyser_Configuration$checkEnabled, 'UnusedPatternVariable', configuration) ? _elm_lang$core$Maybe$Just(
					A3(_user$project$Analyser_Messages_Types$UnusedPatternVariable, path, variableName, range)) : _elm_lang$core$Maybe$Nothing;
		}
	});
var _user$project$Analyser_Checks_UnusedVariable$scan = F2(
	function (fileContext, configuration) {
		var onlyUnused = _elm_lang$core$List$filter(
			function (_p21) {
				return A2(
					F2(
						function (x, y) {
							return _elm_lang$core$Native_Utils.eq(x, y);
						}),
					0,
					_Fresheyeball$elm_tuple_extra$Tuple3$first(
						_elm_lang$core$Tuple$second(_p21)));
			});
		var x = A3(
			_user$project$Inspector$inspect,
			_elm_lang$core$Native_Utils.update(
				_user$project$Inspector$defaultConfig,
				{
					onFile: _user$project$Inspector$Pre(_user$project$Analyser_Checks_UnusedVariable$onFile),
					onFunction: _user$project$Inspector$Inner(_user$project$Analyser_Checks_UnusedVariable$onFunction),
					onLetBlock: _user$project$Inspector$Inner(_user$project$Analyser_Checks_UnusedVariable$onLetBlock),
					onLambda: _user$project$Inspector$Inner(_user$project$Analyser_Checks_UnusedVariable$onLambda),
					onCase: _user$project$Inspector$Inner(_user$project$Analyser_Checks_UnusedVariable$onCase),
					onOperatorApplication: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnusedVariable$onOperatorAppliction),
					onDestructuring: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnusedVariable$onDestructuring),
					onFunctionOrValue: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnusedVariable$onFunctionOrValue),
					onRecordUpdate: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnusedVariable$onRecordUpdate)
				}),
			fileContext.ast,
			_user$project$Analyser_Checks_UnusedVariable$emptyContext);
		var unusedVariables = A2(
			_elm_lang$core$List$map,
			_user$project$Analyser_Messages_Types$newMessage(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
					_1: {ctor: '[]'}
				}),
			A2(
				_elm_lang$core$List$filterMap,
				function (_p22) {
					var _p23 = _p22;
					return A5(_user$project$Analyser_Checks_UnusedVariable$forVariableType, fileContext.path, configuration, _p23._1._1, _p23._0, _p23._1._2);
				},
				onlyUnused(
					A2(_elm_lang$core$List$concatMap, _elm_lang$core$Dict$toList, x.poppedScopes))));
		var unusedTopLevels = A2(
			_elm_lang$core$List$map,
			_user$project$Analyser_Messages_Types$newMessage(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
					_1: {ctor: '[]'}
				}),
			A2(
				_elm_lang$core$List$filterMap,
				function (_p24) {
					var _p25 = _p24;
					return A5(_user$project$Analyser_Checks_UnusedVariable$forVariableType, fileContext.path, configuration, _p25._1._1, _p25._0, _p25._1._2);
				},
				A2(
					_elm_lang$core$List$filter,
					function (_p26) {
						return !A3(
							_elm_lang$core$Basics$flip,
							_user$project$Analyser_Files_Interface$doesExposeFunction,
							fileContext.$interface,
							_elm_lang$core$Tuple$first(_p26));
					},
					A2(
						_elm_lang$core$List$filter,
						_user$project$Analyser_Checks_UnusedVariable$filterByModuleType(fileContext),
						onlyUnused(
							_elm_lang$core$Dict$toList(
								A2(
									_elm_lang$core$Maybe$withDefault,
									_elm_lang$core$Dict$empty,
									A2(
										_elm_lang$core$Maybe$map,
										_elm_lang$core$Tuple$second,
										_elm_lang$core$List$head(x.activeScopes)))))))));
		return A2(_elm_lang$core$Basics_ops['++'], unusedVariables, unusedTopLevels);
	});
var _user$project$Analyser_Checks_UnusedVariable$checker = {
	check: _user$project$Analyser_Checks_UnusedVariable$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'UnusedImportedVariable',
			_1: {
				ctor: '::',
				_0: 'UnusedTopLevel',
				_1: {
					ctor: '::',
					_0: 'UnusedVariable',
					_1: {
						ctor: '::',
						_0: 'UnusedPatternVariable',
						_1: {ctor: '[]'}
					}
				}
			}
		})
};
var _user$project$Analyser_Checks_UnusedVariable$UsedVariableContext = F2(
	function (a, b) {
		return {poppedScopes: a, activeScopes: b};
	});

var _user$project$Analyser_Checks_ExposeAll$onFile = F3(
	function (_p1, file, _p0) {
		var _p2 = A2(
			_elm_lang$core$Maybe$withDefault,
			_user$project$AST_Types$None,
			_user$project$AST_Util$fileExposingList(file));
		switch (_p2.ctor) {
			case 'None':
				return {ctor: '[]'};
			case 'All':
				return {
					ctor: '::',
					_0: _p2._0,
					_1: {ctor: '[]'}
				};
			default:
				return A2(
					_elm_lang$core$List$filterMap,
					function (y) {
						var _p3 = y;
						if (_p3.ctor === 'TypeExpose') {
							var _p4 = _p3._0.constructors;
							if (_p4.ctor === 'All') {
								return _elm_lang$core$Maybe$Just(_p4._0);
							} else {
								return _elm_lang$core$Maybe$Nothing;
							}
						} else {
							return _elm_lang$core$Maybe$Nothing;
						}
					},
					_p2._0);
		}
	});
var _user$project$Analyser_Checks_ExposeAll$scan = F2(
	function (fileContext, _p5) {
		var x = A3(
			_user$project$Inspector$inspect,
			_elm_lang$core$Native_Utils.update(
				_user$project$Inspector$defaultConfig,
				{
					onFile: _user$project$Inspector$Inner(_user$project$Analyser_Checks_ExposeAll$onFile)
				}),
			fileContext.ast,
			{ctor: '[]'});
		return A2(
			_elm_lang$core$List$map,
			_user$project$Analyser_Messages_Types$newMessage(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
					_1: {ctor: '[]'}
				}),
			A2(
				_elm_lang$core$List$map,
				_user$project$Analyser_Messages_Types$ExposeAll(fileContext.path),
				x));
	});
var _user$project$Analyser_Checks_ExposeAll$checker = {
	check: _user$project$Analyser_Checks_ExposeAll$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'ExposeAll',
			_1: {ctor: '[]'}
		})
};

var _user$project$Analyser_Checks_ImportAll$onImport = F2(
	function (imp, context) {
		return A3(
			_elm_lang$core$Basics$flip,
			_elm_lang$core$List$append,
			context,
			function () {
				var _p0 = imp.exposingList;
				switch (_p0.ctor) {
					case 'All':
						return {
							ctor: '::',
							_0: {ctor: '_Tuple2', _0: imp.moduleName, _1: _p0._0},
							_1: {ctor: '[]'}
						};
					case 'None':
						return {ctor: '[]'};
					default:
						return A2(
							_elm_lang$core$List$filterMap,
							function (explicitItem) {
								var _p1 = explicitItem;
								if (_p1.ctor === 'TypeExpose') {
									var _p2 = _p1._0.constructors;
									if (_p2.ctor === 'All') {
										return _elm_lang$core$Maybe$Just(
											{ctor: '_Tuple2', _0: imp.moduleName, _1: _p2._0});
									} else {
										return _elm_lang$core$Maybe$Nothing;
									}
								} else {
									return _elm_lang$core$Maybe$Nothing;
								}
							},
							_p0._0);
				}
			}());
	});
var _user$project$Analyser_Checks_ImportAll$scan = F2(
	function (fileContext, _p3) {
		return A2(
			_elm_lang$core$List$map,
			_user$project$Analyser_Messages_Types$newMessage(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
					_1: {ctor: '[]'}
				}),
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Basics$uncurry(
					_user$project$Analyser_Messages_Types$ImportAll(fileContext.path)),
				A2(
					_elm_lang$core$List$sortWith,
					F2(
						function (_p5, _p4) {
							var _p6 = _p5;
							var _p7 = _p4;
							return A2(_user$project$AST_Ranges$orderByStart, _p6._1, _p7._1);
						}),
					A3(
						_user$project$Inspector$inspect,
						_elm_lang$core$Native_Utils.update(
							_user$project$Inspector$defaultConfig,
							{
								onImport: _user$project$Inspector$Post(_user$project$Analyser_Checks_ImportAll$onImport)
							}),
						fileContext.ast,
						{ctor: '[]'}))));
	});
var _user$project$Analyser_Checks_ImportAll$checker = {
	check: _user$project$Analyser_Checks_ImportAll$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'ImportAll',
			_1: {ctor: '[]'}
		})
};

var _user$project$Analyser_Checks_NoTopLevelSignature$onFunction = F3(
	function (_p0, $function, context) {
		var _p1 = $function.signature;
		if (_p1.ctor === 'Nothing') {
			return {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: $function.declaration.name.value, _1: $function.declaration.name.range},
				_1: context
			};
		} else {
			return context;
		}
	});
var _user$project$Analyser_Checks_NoTopLevelSignature$scan = F2(
	function (fileContext, _p2) {
		return A2(
			_elm_lang$core$List$map,
			_user$project$Analyser_Messages_Types$newMessage(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
					_1: {ctor: '[]'}
				}),
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Basics$uncurry(
					_user$project$Analyser_Messages_Types$NoTopLevelSignature(fileContext.path)),
				A3(
					_user$project$Inspector$inspect,
					_elm_lang$core$Native_Utils.update(
						_user$project$Inspector$defaultConfig,
						{
							onFunction: _user$project$Inspector$Inner(_user$project$Analyser_Checks_NoTopLevelSignature$onFunction),
							onDestructuring: _user$project$Inspector$Skip
						}),
					fileContext.ast,
					{ctor: '[]'})));
	});
var _user$project$Analyser_Checks_NoTopLevelSignature$checker = {
	check: _user$project$Analyser_Checks_NoTopLevelSignature$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'NoTopLevelSignature',
			_1: {ctor: '[]'}
		})
};

var _user$project$Analyser_Checks_UnnecessaryParens$onParenthesizedExpression = F3(
	function (range, expression, context) {
		var _p0 = _elm_lang$core$Tuple$second(expression);
		switch (_p0.ctor) {
			case 'RecordAccess':
				return {ctor: '::', _0: range, _1: context};
			case 'RecordAccessFunction':
				return {ctor: '::', _0: range, _1: context};
			case 'RecordUpdateExpression':
				return {ctor: '::', _0: range, _1: context};
			case 'RecordExpr':
				return {ctor: '::', _0: range, _1: context};
			case 'TupledExpression':
				return {ctor: '::', _0: range, _1: context};
			case 'ListExpr':
				return {ctor: '::', _0: range, _1: context};
			case 'FunctionOrValue':
				return {ctor: '::', _0: range, _1: context};
			case 'Integer':
				return {ctor: '::', _0: range, _1: context};
			case 'Floatable':
				return {ctor: '::', _0: range, _1: context};
			case 'CharLiteral':
				return {ctor: '::', _0: range, _1: context};
			case 'Literal':
				return {ctor: '::', _0: range, _1: context};
			case 'QualifiedExpr':
				return {ctor: '::', _0: range, _1: context};
			default:
				return context;
		}
	});
var _user$project$Analyser_Checks_UnnecessaryParens$allowedOnLHS = function (expr) {
	return A2(
		_elm_lang$core$List$all,
		F2(
			function (x, y) {
				return y(x);
			})(expr),
		{
			ctor: '::',
			_0: function (_p1) {
				return !_user$project$AST_Util$isLambda(_p1);
			},
			_1: {
				ctor: '::',
				_0: function (_p2) {
					return !_user$project$AST_Util$isCase(_p2);
				},
				_1: {
					ctor: '::',
					_0: function (_p3) {
						return !_user$project$AST_Util$isIf(_p3);
					},
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$Analyser_Checks_UnnecessaryParens$onOperatorApplication = F2(
	function (_p4, context) {
		var _p5 = _p4;
		var fixHandSide = function (f) {
			return function (_p6) {
				return A2(
					_elm_lang$core$Maybe$map,
					_elm_lang$core$Tuple$first,
					A2(
						_elm_community$maybe_extra$Maybe_Extra$filter,
						function (_p7) {
							return f(
								_elm_lang$core$Tuple$second(_p7));
						},
						A2(
							_elm_community$maybe_extra$Maybe_Extra$filter,
							function (_p8) {
								return !_user$project$AST_Util$isOperatorApplication(
									_elm_lang$core$Tuple$second(_p8));
							},
							_user$project$AST_Util$getParenthesized(_p6))));
			};
		};
		return A3(
			_elm_lang$core$Basics$flip,
			F2(
				function (x, y) {
					return A2(_elm_lang$core$Basics_ops['++'], x, y);
				}),
			context,
			A2(
				_elm_lang$core$List$filterMap,
				_elm_lang$core$Basics$identity,
				{
					ctor: '::',
					_0: A2(fixHandSide, _user$project$Analyser_Checks_UnnecessaryParens$allowedOnLHS, _p5._2),
					_1: {
						ctor: '::',
						_0: A2(
							fixHandSide,
							_elm_lang$core$Basics$always(true),
							_p5._3),
						_1: {ctor: '[]'}
					}
				}));
	});
var _user$project$Analyser_Checks_UnnecessaryParens$onApplication = F2(
	function (parts, context) {
		return A2(
			_elm_lang$core$Maybe$withDefault,
			context,
			A2(
				_elm_lang$core$Maybe$map,
				A2(
					_elm_lang$core$Basics$flip,
					F2(
						function (x, y) {
							return {ctor: '::', _0: x, _1: y};
						}),
					context),
				A2(
					_elm_lang$core$Maybe$map,
					_elm_lang$core$Tuple$first,
					A2(
						_elm_community$maybe_extra$Maybe_Extra$filter,
						function (_p9) {
							return !_user$project$AST_Util$isOperatorApplication(
								_elm_lang$core$Tuple$second(_p9));
						},
						A2(
							_elm_lang$core$Maybe$andThen,
							_user$project$AST_Util$getParenthesized,
							_elm_lang$core$List$head(parts))))));
	});
var _user$project$Analyser_Checks_UnnecessaryParens$onIfBlock = F4(
	function (clause, thenBranch, elseBranch, context) {
		return A3(
			_elm_lang$core$Basics$flip,
			F2(
				function (x, y) {
					return A2(_elm_lang$core$Basics_ops['++'], x, y);
				}),
			context,
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Tuple$first,
				A2(
					_elm_lang$core$List$filterMap,
					_user$project$AST_Util$getParenthesized,
					{
						ctor: '::',
						_0: clause,
						_1: {
							ctor: '::',
							_0: thenBranch,
							_1: {
								ctor: '::',
								_0: elseBranch,
								_1: {ctor: '[]'}
							}
						}
					})));
	});
var _user$project$Analyser_Checks_UnnecessaryParens$onCaseBlock = F2(
	function (caseBlock, context) {
		var _p10 = _user$project$AST_Util$getParenthesized(caseBlock.expression);
		if (_p10.ctor === 'Just') {
			return {ctor: '::', _0: _p10._0._0, _1: context};
		} else {
			return context;
		}
	});
var _user$project$Analyser_Checks_UnnecessaryParens$onRecord = F2(
	function (fields, context) {
		return A3(
			_elm_lang$core$Basics$flip,
			F2(
				function (x, y) {
					return A2(_elm_lang$core$Basics_ops['++'], x, y);
				}),
			context,
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Tuple$first,
				A2(
					_elm_lang$core$List$filterMap,
					function (_p11) {
						return _user$project$AST_Util$getParenthesized(
							_elm_lang$core$Tuple$second(_p11));
					},
					fields)));
	});
var _user$project$Analyser_Checks_UnnecessaryParens$onTuple = F2(
	function (exprs, context) {
		return A3(
			_elm_lang$core$Basics$flip,
			F2(
				function (x, y) {
					return A2(_elm_lang$core$Basics_ops['++'], x, y);
				}),
			context,
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Tuple$first,
				A2(_elm_lang$core$List$filterMap, _user$project$AST_Util$getParenthesized, exprs)));
	});
var _user$project$Analyser_Checks_UnnecessaryParens$onListExpr = F2(
	function (exprs, context) {
		return A3(
			_elm_lang$core$Basics$flip,
			F2(
				function (x, y) {
					return A2(_elm_lang$core$Basics_ops['++'], x, y);
				}),
			context,
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Tuple$first,
				A2(_elm_lang$core$List$filterMap, _user$project$AST_Util$getParenthesized, exprs)));
	});
var _user$project$Analyser_Checks_UnnecessaryParens$onExpression = F2(
	function (_p12, context) {
		var _p13 = _p12;
		var _p14 = _p13._1;
		switch (_p14.ctor) {
			case 'ParenthesizedExpression':
				return A3(_user$project$Analyser_Checks_UnnecessaryParens$onParenthesizedExpression, _p13._0, _p14._0, context);
			case 'OperatorApplication':
				return A2(
					_user$project$Analyser_Checks_UnnecessaryParens$onOperatorApplication,
					{ctor: '_Tuple4', _0: _p14._0, _1: _p14._1, _2: _p14._2, _3: _p14._3},
					context);
			case 'Application':
				return A2(_user$project$Analyser_Checks_UnnecessaryParens$onApplication, _p14._0, context);
			case 'IfBlock':
				return A4(_user$project$Analyser_Checks_UnnecessaryParens$onIfBlock, _p14._0, _p14._1, _p14._2, context);
			case 'CaseExpression':
				return A2(_user$project$Analyser_Checks_UnnecessaryParens$onCaseBlock, _p14._0, context);
			case 'RecordExpr':
				return A2(_user$project$Analyser_Checks_UnnecessaryParens$onRecord, _p14._0, context);
			case 'RecordUpdateExpression':
				return A2(_user$project$Analyser_Checks_UnnecessaryParens$onRecord, _p14._0.updates, context);
			case 'TupledExpression':
				return A2(_user$project$Analyser_Checks_UnnecessaryParens$onTuple, _p14._0, context);
			case 'ListExpr':
				return A2(_user$project$Analyser_Checks_UnnecessaryParens$onListExpr, _p14._0, context);
			default:
				return context;
		}
	});
var _user$project$Analyser_Checks_UnnecessaryParens$onLambda = F2(
	function (lambda, context) {
		var _p15 = lambda.expression;
		if ((_p15.ctor === '_Tuple2') && (_p15._1.ctor === 'ParenthesizedExpression')) {
			return {ctor: '::', _0: _p15._0, _1: context};
		} else {
			return context;
		}
	});
var _user$project$Analyser_Checks_UnnecessaryParens$onFunction = F2(
	function ($function, context) {
		var _p16 = $function.declaration.expression;
		if ((_p16.ctor === '_Tuple2') && (_p16._1.ctor === 'ParenthesizedExpression')) {
			return {ctor: '::', _0: _p16._0, _1: context};
		} else {
			return context;
		}
	});
var _user$project$Analyser_Checks_UnnecessaryParens$rangetoTuple = function (x) {
	return {ctor: '_Tuple4', _0: x.start.row, _1: x.start.column, _2: x.end.row, _3: x.end.column};
};
var _user$project$Analyser_Checks_UnnecessaryParens$scan = F2(
	function (fileContext, _p17) {
		var x = A3(
			_user$project$Inspector$inspect,
			_elm_lang$core$Native_Utils.update(
				_user$project$Inspector$defaultConfig,
				{
					onExpression: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnnecessaryParens$onExpression),
					onFunction: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnnecessaryParens$onFunction),
					onLambda: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnnecessaryParens$onLambda)
				}),
			fileContext.ast,
			{ctor: '[]'});
		return A2(
			_elm_lang$core$List$map,
			_user$project$Analyser_Messages_Types$newMessage(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
					_1: {ctor: '[]'}
				}),
			A2(
				_elm_lang$core$List$map,
				_user$project$Analyser_Messages_Types$UnnecessaryParens(fileContext.path),
				A2(_elm_community$list_extra$List_Extra$uniqueBy, _user$project$Analyser_Checks_UnnecessaryParens$rangetoTuple, x)));
	});
var _user$project$Analyser_Checks_UnnecessaryParens$checker = {
	check: _user$project$Analyser_Checks_UnnecessaryParens$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'UnnecessaryParens',
			_1: {ctor: '[]'}
		})
};

var _user$project$Analyser_Checks_NoDebug$asMessage = F3(
	function (path, configuration, _p0) {
		var _p1 = _p0;
		var _p3 = _p1._1;
		var _p2 = _p1._0;
		if (_p2.ctor === 'Log') {
			return A2(_user$project$Analyser_Configuration$checkEnabled, 'DebugLog', configuration) ? _elm_lang$core$Maybe$Just(
				A2(_user$project$Analyser_Messages_Types$DebugLog, path, _p3)) : _elm_lang$core$Maybe$Nothing;
		} else {
			return A2(_user$project$Analyser_Configuration$checkEnabled, 'DebugCrash', configuration) ? _elm_lang$core$Maybe$Just(
				A2(_user$project$Analyser_Messages_Types$DebugCrash, path, _p3)) : _elm_lang$core$Maybe$Nothing;
		}
	});
var _user$project$Analyser_Checks_NoDebug$Crash = {ctor: 'Crash'};
var _user$project$Analyser_Checks_NoDebug$Log = {ctor: 'Log'};
var _user$project$Analyser_Checks_NoDebug$entryForQualifiedExpr = F2(
	function (moduleName, f) {
		return _elm_lang$core$Native_Utils.eq(
			moduleName,
			{
				ctor: '::',
				_0: 'Debug',
				_1: {ctor: '[]'}
			}) ? (_elm_lang$core$Native_Utils.eq(f, 'log') ? _elm_lang$core$Maybe$Just(_user$project$Analyser_Checks_NoDebug$Log) : (_elm_lang$core$Native_Utils.eq(f, 'crash') ? _elm_lang$core$Maybe$Just(_user$project$Analyser_Checks_NoDebug$Crash) : _elm_lang$core$Maybe$Nothing)) : _elm_lang$core$Maybe$Nothing;
	});
var _user$project$Analyser_Checks_NoDebug$onExpression = F2(
	function (_p4, context) {
		var _p5 = _p4;
		var _p6 = _p5._1;
		if (_p6.ctor === 'QualifiedExpr') {
			return A2(
				_elm_lang$core$Maybe$withDefault,
				context,
				A2(
					_elm_lang$core$Maybe$map,
					function (_p7) {
						return A3(
							_elm_lang$core$Basics$flip,
							F2(
								function (x, y) {
									return {ctor: '::', _0: x, _1: y};
								}),
							context,
							A3(
								_elm_lang$core$Basics$flip,
								F2(
									function (v0, v1) {
										return {ctor: '_Tuple2', _0: v0, _1: v1};
									}),
								_p5._0,
								_p7));
					},
					A2(_user$project$Analyser_Checks_NoDebug$entryForQualifiedExpr, _p6._0, _p6._1)));
		} else {
			return context;
		}
	});
var _user$project$Analyser_Checks_NoDebug$scan = F2(
	function (fileContext, configuration) {
		return A2(
			_elm_lang$core$List$map,
			_user$project$Analyser_Messages_Types$newMessage(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
					_1: {ctor: '[]'}
				}),
			A2(
				_elm_lang$core$List$filterMap,
				A2(_user$project$Analyser_Checks_NoDebug$asMessage, fileContext.path, configuration),
				A3(
					_user$project$Inspector$inspect,
					_elm_lang$core$Native_Utils.update(
						_user$project$Inspector$defaultConfig,
						{
							onExpression: _user$project$Inspector$Post(_user$project$Analyser_Checks_NoDebug$onExpression)
						}),
					fileContext.ast,
					{ctor: '[]'})));
	});
var _user$project$Analyser_Checks_NoDebug$checker = {
	check: _user$project$Analyser_Checks_NoDebug$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'DebugLog',
			_1: {
				ctor: '::',
				_0: 'DebugCrash',
				_1: {ctor: '[]'}
			}
		})
};

var _user$project$Analyser_Checks_DuplicateImport$onImport = F2(
	function (_p0, context) {
		var _p1 = _p0;
		var _p4 = _p1.range;
		var _p3 = _p1.moduleName;
		var _p2 = A2(_elm_lang$core$Dict$get, _p3, context);
		if (_p2.ctor === 'Just') {
			return A3(
				_elm_lang$core$Dict$update,
				_p3,
				_elm_lang$core$Maybe$map(
					A2(
						_elm_lang$core$Basics$flip,
						F2(
							function (x, y) {
								return A2(_elm_lang$core$Basics_ops['++'], x, y);
							}),
						{
							ctor: '::',
							_0: _p4,
							_1: {ctor: '[]'}
						})),
				context);
		} else {
			return A3(
				_elm_lang$core$Dict$insert,
				_p3,
				{
					ctor: '::',
					_0: _p4,
					_1: {ctor: '[]'}
				},
				context);
		}
	});
var _user$project$Analyser_Checks_DuplicateImport$hasLength = function (f) {
	return function (_p5) {
		return f(
			_elm_lang$core$List$length(_p5));
	};
};
var _user$project$Analyser_Checks_DuplicateImport$scan = F2(
	function (fileContext, _p6) {
		return A2(
			_elm_lang$core$List$map,
			_user$project$Analyser_Messages_Types$newMessage(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
					_1: {ctor: '[]'}
				}),
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Basics$uncurry(
					_user$project$Analyser_Messages_Types$DuplicateImport(fileContext.path)),
				_elm_lang$core$Dict$toList(
					A2(
						_elm_lang$core$Dict$filter,
						_elm_lang$core$Basics$always(
							_user$project$Analyser_Checks_DuplicateImport$hasLength(
								F2(
									function (x, y) {
										return _elm_lang$core$Native_Utils.cmp(x, y) < 0;
									})(1))),
						A3(
							_user$project$Inspector$inspect,
							_elm_lang$core$Native_Utils.update(
								_user$project$Inspector$defaultConfig,
								{
									onImport: _user$project$Inspector$Post(_user$project$Analyser_Checks_DuplicateImport$onImport),
									onFunction: _user$project$Inspector$Skip
								}),
							fileContext.ast,
							_elm_lang$core$Dict$empty)))));
	});
var _user$project$Analyser_Checks_DuplicateImport$checker = {
	check: _user$project$Analyser_Checks_DuplicateImport$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'DuplicateImport',
			_1: {ctor: '[]'}
		})
};

var _user$project$Analyser_Checks_UnusedTypeAlias$onTypeAlias = F2(
	function (typeAlias, context) {
		return A3(
			_elm_lang$core$Dict$insert,
			typeAlias.name,
			{ctor: '_Tuple3', _0: typeAlias.name, _1: typeAlias.range, _2: 0},
			context);
	});
var _user$project$Analyser_Checks_UnusedTypeAlias$markTypeAlias = F2(
	function (key, context) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Maybe$map(
				_Fresheyeball$elm_tuple_extra$Tuple3$mapThird(
					F2(
						function (x, y) {
							return x + y;
						})(1))),
			context);
	});
var _user$project$Analyser_Checks_UnusedTypeAlias$onTypeReference = F2(
	function (typeReference, context) {
		var _p0 = typeReference;
		if ((_p0.ctor === 'Typed') && (_p0._0.ctor === '[]')) {
			return A2(_user$project$Analyser_Checks_UnusedTypeAlias$markTypeAlias, _p0._1, context);
		} else {
			return context;
		}
	});
var _user$project$Analyser_Checks_UnusedTypeAlias$onFunctionOrValue = _user$project$Analyser_Checks_UnusedTypeAlias$markTypeAlias;
var _user$project$Analyser_Checks_UnusedTypeAlias$scan = F2(
	function (fileContext, _p1) {
		var collectedAliased = A3(
			_user$project$Inspector$inspect,
			_elm_lang$core$Native_Utils.update(
				_user$project$Inspector$defaultConfig,
				{
					onTypeAlias: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnusedTypeAlias$onTypeAlias)
				}),
			fileContext.ast,
			_elm_lang$core$Dict$empty);
		return A2(
			_elm_lang$core$List$map,
			_user$project$Analyser_Messages_Types$newMessage(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
					_1: {ctor: '[]'}
				}),
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Basics$uncurry(
					_user$project$Analyser_Messages_Types$UnusedTypeAlias(fileContext.path)),
				A2(
					_elm_lang$core$List$map,
					_Fresheyeball$elm_tuple_extra$Tuple2$mapSecond(_Fresheyeball$elm_tuple_extra$Tuple3$second),
					A2(
						_elm_lang$core$List$filter,
						function (_p2) {
							return !A3(
								_elm_lang$core$Basics$flip,
								_user$project$Analyser_Files_Interface$doesExposeAlias,
								fileContext.$interface,
								_elm_lang$core$Tuple$first(_p2));
						},
						A2(
							_elm_lang$core$List$filter,
							function (_p3) {
								return !A2(
									F2(
										function (x, y) {
											return _elm_lang$core$Native_Utils.cmp(x, y) < 0;
										}),
									0,
									_Fresheyeball$elm_tuple_extra$Tuple3$third(
										_elm_lang$core$Tuple$second(_p3)));
							},
							_elm_lang$core$Dict$toList(
								A3(
									_user$project$Inspector$inspect,
									_elm_lang$core$Native_Utils.update(
										_user$project$Inspector$defaultConfig,
										{
											onTypeReference: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnusedTypeAlias$onTypeReference),
											onFunctionOrValue: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnusedTypeAlias$onFunctionOrValue)
										}),
									fileContext.ast,
									collectedAliased)))))));
	});
var _user$project$Analyser_Checks_UnusedTypeAlias$checker = {
	check: _user$project$Analyser_Checks_UnusedTypeAlias$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'UnusedTypeAlias',
			_1: {ctor: '[]'}
		})
};

var _user$project$Analyser_Checks_OverriddenVariables$visitWithVariablePointers = F3(
	function (variablePointers, f, _p0) {
		var _p1 = _p0;
		var _p4 = _p1._1;
		var newKnown = A3(
			_elm_lang$core$List$foldl,
			F2(
				function (a, b) {
					return A3(_elm_lang$core$Dict$insert, a.value, a.range, b);
				}),
			_p4,
			variablePointers);
		var _p2 = f(
			{ctor: '_Tuple2', _0: _p1._0, _1: newKnown});
		var newRedefines = _p2._0;
		var redefinedPattern = A2(
			_elm_lang$core$List$filter,
			function (_p3) {
				return A3(
					_elm_lang$core$Basics$flip,
					_elm_lang$core$Dict$member,
					_p4,
					function (_) {
						return _.value;
					}(_p3));
			},
			variablePointers);
		return {
			ctor: '_Tuple2',
			_0: A2(
				_elm_lang$core$Basics_ops['++'],
				newRedefines,
				A2(
					_elm_lang$core$List$filterMap,
					function (x) {
						return A2(
							_elm_lang$core$Maybe$map,
							function (r) {
								return {ctor: '_Tuple3', _0: x.value, _1: r, _2: x.range};
							},
							A2(_elm_lang$core$Dict$get, x.value, _p4));
					},
					redefinedPattern)),
			_1: _p4
		};
	});
var _user$project$Analyser_Checks_OverriddenVariables$visitWithPatterns = F3(
	function (patterns, f, context) {
		return A3(
			_user$project$Analyser_Checks_OverriddenVariables$visitWithVariablePointers,
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Tuple$first,
				A2(_elm_lang$core$List$concatMap, _user$project$ASTUtil_Variables$patternToVars, patterns)),
			f,
			context);
	});
var _user$project$Analyser_Checks_OverriddenVariables$onLambda = F3(
	function (f, lambda, context) {
		return A3(_user$project$Analyser_Checks_OverriddenVariables$visitWithPatterns, lambda.args, f, context);
	});
var _user$project$Analyser_Checks_OverriddenVariables$onDestructuring = F3(
	function (f, destructuring, context) {
		return A3(
			_user$project$Analyser_Checks_OverriddenVariables$visitWithVariablePointers,
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Tuple$first,
				_user$project$ASTUtil_Variables$patternToVars(destructuring.pattern)),
			f,
			context);
	});
var _user$project$Analyser_Checks_OverriddenVariables$onFunction = F3(
	function (f, $function, context) {
		return A3(
			_user$project$Analyser_Checks_OverriddenVariables$visitWithVariablePointers,
			A2(
				F2(
					function (x, y) {
						return {ctor: '::', _0: x, _1: y};
					}),
				$function.declaration.name,
				A2(
					_elm_lang$core$List$map,
					_elm_lang$core$Tuple$first,
					A2(_elm_lang$core$List$concatMap, _user$project$ASTUtil_Variables$patternToVars, $function.declaration.$arguments))),
			f,
			context);
	});
var _user$project$Analyser_Checks_OverriddenVariables$onCase = F3(
	function (f, caze, context) {
		return A3(
			_user$project$Analyser_Checks_OverriddenVariables$visitWithVariablePointers,
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Tuple$first,
				_user$project$ASTUtil_Variables$patternToVars(
					_elm_lang$core$Tuple$first(caze))),
			f,
			context);
	});
var _user$project$Analyser_Checks_OverriddenVariables$scan = F2(
	function (fileContext, _p5) {
		var topLevels = _elm_lang$core$Dict$fromList(
			A2(
				_elm_lang$core$List$map,
				function (_p6) {
					var _p7 = _p6;
					var _p8 = _p7._0;
					return {ctor: '_Tuple2', _0: _p8.value, _1: _p8.range};
				},
				_user$project$ASTUtil_Variables$getImportsVars(fileContext.ast.imports)));
		return A2(
			_elm_lang$core$List$map,
			_user$project$Analyser_Messages_Types$newMessage(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
					_1: {ctor: '[]'}
				}),
			A2(
				_elm_lang$core$List$map,
				function (_p9) {
					var _p10 = _p9;
					return A4(_user$project$Analyser_Messages_Types$RedefineVariable, fileContext.path, _p10._0, _p10._1, _p10._2);
				},
				_elm_lang$core$Tuple$first(
					A3(
						_user$project$Inspector$inspect,
						_elm_lang$core$Native_Utils.update(
							_user$project$Inspector$defaultConfig,
							{
								onFunction: _user$project$Inspector$Inner(_user$project$Analyser_Checks_OverriddenVariables$onFunction),
								onLambda: _user$project$Inspector$Inner(_user$project$Analyser_Checks_OverriddenVariables$onLambda),
								onCase: _user$project$Inspector$Inner(_user$project$Analyser_Checks_OverriddenVariables$onCase),
								onDestructuring: _user$project$Inspector$Inner(_user$project$Analyser_Checks_OverriddenVariables$onDestructuring)
							}),
						fileContext.ast,
						{
							ctor: '_Tuple2',
							_0: {ctor: '[]'},
							_1: topLevels
						}))));
	});
var _user$project$Analyser_Checks_OverriddenVariables$checker = {
	check: _user$project$Analyser_Checks_OverriddenVariables$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'RedefineVariable',
			_1: {ctor: '[]'}
		})
};

var _user$project$Analyser_Checks_NoUncurriedPrefix$onExpression = F2(
	function (_p0, context) {
		var _p1 = _p0;
		var _p2 = _p1._1;
		if (_p2.ctor === 'Application') {
			var _p3 = _p2._0;
			if ((((((_p3.ctor === '::') && (_p3._0.ctor === '_Tuple2')) && (_p3._0._1.ctor === 'PrefixOperator')) && (_p3._1.ctor === '::')) && (_p3._1._1.ctor === '::')) && (_p3._1._1._1.ctor === '[]')) {
				var _p4 = _p3._0._1._0;
				return A2(_elm_lang$core$String$startsWith, ',,', _p4) ? context : {
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: _p4, _1: _p3._0._0},
					_1: context
				};
			} else {
				return context;
			}
		} else {
			return context;
		}
	});
var _user$project$Analyser_Checks_NoUncurriedPrefix$scan = F2(
	function (fileContext, _p5) {
		return A2(
			_elm_lang$core$List$map,
			_user$project$Analyser_Messages_Types$newMessage(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
					_1: {ctor: '[]'}
				}),
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Basics$uncurry(
					_user$project$Analyser_Messages_Types$NoUncurriedPrefix(fileContext.path)),
				A3(
					_user$project$Inspector$inspect,
					_elm_lang$core$Native_Utils.update(
						_user$project$Inspector$defaultConfig,
						{
							onExpression: _user$project$Inspector$Post(_user$project$Analyser_Checks_NoUncurriedPrefix$onExpression)
						}),
					fileContext.ast,
					{ctor: '[]'})));
	});
var _user$project$Analyser_Checks_NoUncurriedPrefix$checker = {
	check: _user$project$Analyser_Checks_NoUncurriedPrefix$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'NoUncurriedPrefix',
			_1: {ctor: '[]'}
		})
};

var _user$project$Analyser_Checks_UnusedImportAliases$onImport = F2(
	function (imp, context) {
		var _p0 = imp.moduleAlias;
		if (_p0.ctor === 'Just') {
			return A3(
				_elm_lang$core$Dict$insert,
				_p0._0,
				{ctor: '_Tuple2', _0: imp.range, _1: 0},
				context);
		} else {
			return context;
		}
	});
var _user$project$Analyser_Checks_UnusedImportAliases$markUsage = F2(
	function (key, context) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Maybe$map(
				_Fresheyeball$elm_tuple_extra$Tuple2$mapSecond(
					F2(
						function (x, y) {
							return x + y;
						})(1))),
			context);
	});
var _user$project$Analyser_Checks_UnusedImportAliases$onTypeReference = F2(
	function (typeReference, context) {
		var _p1 = typeReference;
		if (_p1.ctor === 'Typed') {
			return A2(_user$project$Analyser_Checks_UnusedImportAliases$markUsage, _p1._0, context);
		} else {
			return context;
		}
	});
var _user$project$Analyser_Checks_UnusedImportAliases$onExpression = F2(
	function (expr, context) {
		var _p2 = _elm_lang$core$Tuple$second(expr);
		if (_p2.ctor === 'QualifiedExpr') {
			return A2(_user$project$Analyser_Checks_UnusedImportAliases$markUsage, _p2._0, context);
		} else {
			return context;
		}
	});
var _user$project$Analyser_Checks_UnusedImportAliases$onCase = F2(
	function (_p3, context) {
		var _p4 = _p3;
		return A3(
			_elm_lang$core$List$foldl,
			_user$project$Analyser_Checks_UnusedImportAliases$markUsage,
			context,
			_user$project$AST_Util$patternModuleNames(_p4._0));
	});
var _user$project$Analyser_Checks_UnusedImportAliases$scan = F2(
	function (fileContext, _p5) {
		var aliases = A3(
			_user$project$Inspector$inspect,
			_elm_lang$core$Native_Utils.update(
				_user$project$Inspector$defaultConfig,
				{
					onImport: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnusedImportAliases$onImport)
				}),
			fileContext.ast,
			_elm_lang$core$Dict$empty);
		return A2(
			_elm_lang$core$List$map,
			_user$project$Analyser_Messages_Types$newMessage(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
					_1: {ctor: '[]'}
				}),
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Basics$uncurry(
					_user$project$Analyser_Messages_Types$UnusedImportAlias(fileContext.path)),
				A2(
					_elm_lang$core$List$map,
					_Fresheyeball$elm_tuple_extra$Tuple2$mapSecond(_elm_lang$core$Tuple$first),
					A2(
						_elm_lang$core$List$filter,
						function (_p6) {
							return A2(
								F2(
									function (x, y) {
										return _elm_lang$core$Native_Utils.eq(x, y);
									}),
								0,
								_elm_lang$core$Tuple$second(
									_elm_lang$core$Tuple$second(_p6)));
						},
						_elm_lang$core$Dict$toList(
							A3(
								_user$project$Inspector$inspect,
								_elm_lang$core$Native_Utils.update(
									_user$project$Inspector$defaultConfig,
									{
										onTypeReference: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnusedImportAliases$onTypeReference),
										onExpression: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnusedImportAliases$onExpression),
										onCase: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnusedImportAliases$onCase)
									}),
								fileContext.ast,
								aliases))))));
	});
var _user$project$Analyser_Checks_UnusedImportAliases$checker = {
	check: _user$project$Analyser_Checks_UnusedImportAliases$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'UnusedImportAlias',
			_1: {ctor: '[]'}
		})
};

var _user$project$Analyser_Checks_UnusedImport$onImport = F2(
	function (imp, context) {
		return (_elm_lang$core$Native_Utils.eq(imp.moduleAlias, _elm_lang$core$Maybe$Nothing) && _elm_lang$core$Native_Utils.eq(imp.exposingList, _user$project$AST_Types$None)) ? A3(
			_elm_lang$core$Dict$insert,
			imp.moduleName,
			{ctor: '_Tuple2', _0: imp.range, _1: 0},
			context) : context;
	});
var _user$project$Analyser_Checks_UnusedImport$markUsage = F2(
	function (key, context) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Maybe$map(
				_Fresheyeball$elm_tuple_extra$Tuple2$mapSecond(
					F2(
						function (x, y) {
							return x + y;
						})(1))),
			context);
	});
var _user$project$Analyser_Checks_UnusedImport$onTypeReference = F2(
	function (typeReference, context) {
		var _p0 = typeReference;
		if (_p0.ctor === 'Typed') {
			return A2(_user$project$Analyser_Checks_UnusedImport$markUsage, _p0._0, context);
		} else {
			return context;
		}
	});
var _user$project$Analyser_Checks_UnusedImport$onExpression = F2(
	function (expr, context) {
		var _p1 = _elm_lang$core$Tuple$second(expr);
		if (_p1.ctor === 'QualifiedExpr') {
			return A2(_user$project$Analyser_Checks_UnusedImport$markUsage, _p1._0, context);
		} else {
			return context;
		}
	});
var _user$project$Analyser_Checks_UnusedImport$onCase = F2(
	function (_p2, context) {
		var _p3 = _p2;
		return A3(
			_elm_lang$core$List$foldl,
			_user$project$Analyser_Checks_UnusedImport$markUsage,
			context,
			_user$project$AST_Util$patternModuleNames(_p3._0));
	});
var _user$project$Analyser_Checks_UnusedImport$scan = F2(
	function (fileContext, _p4) {
		var aliases = A3(
			_user$project$Inspector$inspect,
			_elm_lang$core$Native_Utils.update(
				_user$project$Inspector$defaultConfig,
				{
					onImport: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnusedImport$onImport)
				}),
			fileContext.ast,
			_elm_lang$core$Dict$empty);
		return A2(
			_elm_lang$core$List$map,
			_user$project$Analyser_Messages_Types$newMessage(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
					_1: {ctor: '[]'}
				}),
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Basics$uncurry(
					_user$project$Analyser_Messages_Types$UnusedImport(fileContext.path)),
				A2(
					_elm_lang$core$List$map,
					_Fresheyeball$elm_tuple_extra$Tuple2$mapSecond(_elm_lang$core$Tuple$first),
					A2(
						_elm_lang$core$List$filter,
						function (_p5) {
							return A2(
								F2(
									function (x, y) {
										return _elm_lang$core$Native_Utils.eq(x, y);
									}),
								0,
								_elm_lang$core$Tuple$second(
									_elm_lang$core$Tuple$second(_p5)));
						},
						_elm_lang$core$Dict$toList(
							A3(
								_user$project$Inspector$inspect,
								_elm_lang$core$Native_Utils.update(
									_user$project$Inspector$defaultConfig,
									{
										onTypeReference: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnusedImport$onTypeReference),
										onExpression: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnusedImport$onExpression),
										onCase: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnusedImport$onCase)
									}),
								fileContext.ast,
								aliases))))));
	});
var _user$project$Analyser_Checks_UnusedImport$checker = {
	check: _user$project$Analyser_Checks_UnusedImport$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'UnusedImport',
			_1: {ctor: '[]'}
		})
};

var _user$project$Analyser_Checks_ListOperators$deficiencyToMessageData = F3(
	function (path, configuration, _p0) {
		var _p1 = _p0;
		return A2(
			_elm_lang$core$Maybe$map,
			function (messageConstructor) {
				return A2(messageConstructor, path, _p1._1);
			},
			function () {
				var _p2 = _p1._0;
				switch (_p2.ctor) {
					case 'DropConcat':
						return A2(_user$project$Analyser_Configuration$checkEnabled, 'DropConcatOfLists', configuration) ? _elm_lang$core$Maybe$Just(_user$project$Analyser_Messages_Types$DropConcatOfLists) : _elm_lang$core$Maybe$Nothing;
					case 'DropCons':
						return A2(_user$project$Analyser_Configuration$checkEnabled, 'DropConsOfItemAndList', configuration) ? _elm_lang$core$Maybe$Just(_user$project$Analyser_Messages_Types$DropConsOfItemAndList) : _elm_lang$core$Maybe$Nothing;
					default:
						return A2(_user$project$Analyser_Configuration$checkEnabled, 'UseConsOverConcat', configuration) ? _elm_lang$core$Maybe$Just(_user$project$Analyser_Messages_Types$UseConsOverConcat) : _elm_lang$core$Maybe$Nothing;
				}
			}());
	});
var _user$project$Analyser_Checks_ListOperators$UseCons = {ctor: 'UseCons'};
var _user$project$Analyser_Checks_ListOperators$DropCons = {ctor: 'DropCons'};
var _user$project$Analyser_Checks_ListOperators$DropConcat = {ctor: 'DropConcat'};
var _user$project$Analyser_Checks_ListOperators$onExpression = F2(
	function (_p3, context) {
		var _p4 = _p3;
		var _p6 = _p4._0;
		var _p5 = _p4._1;
		_v3_3:
		do {
			if (_p5.ctor === 'OperatorApplication') {
				switch (_p5._0) {
					case '::':
						if ((_p5._3.ctor === '_Tuple2') && (_p5._3._1.ctor === 'ListExpr')) {
							return {
								ctor: '::',
								_0: {ctor: '_Tuple2', _0: _user$project$Analyser_Checks_ListOperators$DropCons, _1: _p6},
								_1: context
							};
						} else {
							break _v3_3;
						}
					case '++':
						if ((_p5._2.ctor === '_Tuple2') && (_p5._2._1.ctor === 'ListExpr')) {
							if ((_p5._3.ctor === '_Tuple2') && (_p5._3._1.ctor === 'ListExpr')) {
								return {
									ctor: '::',
									_0: {ctor: '_Tuple2', _0: _user$project$Analyser_Checks_ListOperators$DropConcat, _1: _p6},
									_1: context
								};
							} else {
								if ((_p5._2._1._0.ctor === '::') && (_p5._2._1._0._1.ctor === '[]')) {
									return {
										ctor: '::',
										_0: {ctor: '_Tuple2', _0: _user$project$Analyser_Checks_ListOperators$UseCons, _1: _p6},
										_1: context
									};
								} else {
									break _v3_3;
								}
							}
						} else {
							break _v3_3;
						}
					default:
						break _v3_3;
				}
			} else {
				break _v3_3;
			}
		} while(false);
		return context;
	});
var _user$project$Analyser_Checks_ListOperators$scan = F2(
	function (fileContext, configuration) {
		return A2(
			_elm_lang$core$List$map,
			_user$project$Analyser_Messages_Types$newMessage(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
					_1: {ctor: '[]'}
				}),
			A2(
				_elm_lang$core$List$filterMap,
				A2(_user$project$Analyser_Checks_ListOperators$deficiencyToMessageData, fileContext.path, configuration),
				A3(
					_user$project$Inspector$inspect,
					_elm_lang$core$Native_Utils.update(
						_user$project$Inspector$defaultConfig,
						{
							onExpression: _user$project$Inspector$Post(_user$project$Analyser_Checks_ListOperators$onExpression)
						}),
					fileContext.ast,
					{ctor: '[]'})));
	});
var _user$project$Analyser_Checks_ListOperators$checker = {
	check: _user$project$Analyser_Checks_ListOperators$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'DropConcatOfLists',
			_1: {
				ctor: '::',
				_0: 'DropConsOfItemAndList',
				_1: {
					ctor: '::',
					_0: 'UseConsOverConcat',
					_1: {ctor: '[]'}
				}
			}
		})
};

var _user$project$Analyser_Checks_LineLength$scan = F2(
	function (fileContext, configuration) {
		var threshold = A2(
			_elm_lang$core$Maybe$withDefault,
			150,
			A3(_user$project$Analyser_Configuration$checkPropertyAsInt, 'LineLengthExceeded', 'threshold', configuration));
		var longLineRanges = A2(
			_elm_lang$core$List$map,
			function (_p0) {
				var _p1 = _p0;
				var _p2 = _p1._0;
				return {
					start: {row: _p2, column: -1},
					end: {row: _p2 + 1, column: -2}
				};
			},
			A2(
				_elm_lang$core$List$filter,
				function (_p3) {
					return !A2(
						_elm_lang$core$String$startsWith,
						'import',
						_elm_lang$core$Tuple$second(_p3));
				},
				A2(
					_elm_lang$core$List$filter,
					function (_p4) {
						return !A2(
							_elm_lang$core$String$startsWith,
							'module',
							_elm_lang$core$Tuple$second(_p4));
					},
					A2(
						_elm_lang$core$List$filter,
						function (_p5) {
							return A2(
								F2(
									function (x, y) {
										return _elm_lang$core$Native_Utils.cmp(x, y) < 0;
									}),
								threshold,
								_elm_lang$core$String$length(
									_elm_lang$core$Tuple$second(_p5)));
						},
						A2(
							_elm_lang$core$List$indexedMap,
							F2(
								function (v0, v1) {
									return {ctor: '_Tuple2', _0: v0, _1: v1};
								}),
							A2(_elm_lang$core$String$split, '\n', fileContext.content))))));
		return _elm_lang$core$List$isEmpty(longLineRanges) ? {ctor: '[]'} : {
			ctor: '::',
			_0: A2(
				_user$project$Analyser_Messages_Types$newMessage,
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
					_1: {ctor: '[]'}
				},
				A2(_user$project$Analyser_Messages_Types$LineLengthExceeded, fileContext.path, longLineRanges)),
			_1: {ctor: '[]'}
		};
	});
var _user$project$Analyser_Checks_LineLength$checker = {
	check: _user$project$Analyser_Checks_LineLength$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'LineLengthExceeded',
			_1: {ctor: '[]'}
		})
};

var _user$project$Analyser_Checks_UnnecessaryListConcat$isListExpression = function (_p0) {
	var _p1 = _p0;
	var _p2 = _p1._1;
	if (_p2.ctor === 'ListExpr') {
		return true;
	} else {
		return false;
	}
};
var _user$project$Analyser_Checks_UnnecessaryListConcat$onExpression = F2(
	function (_p3, context) {
		var _p4 = _p3;
		var _p5 = _p4._1;
		if ((((((((((((_p5.ctor === 'Application') && (_p5._0.ctor === '::')) && (_p5._0._0.ctor === '_Tuple2')) && (_p5._0._0._1.ctor === 'QualifiedExpr')) && (_p5._0._0._1._0.ctor === '::')) && (_p5._0._0._1._0._0 === 'List')) && (_p5._0._0._1._0._1.ctor === '[]')) && (_p5._0._0._1._1 === 'concat')) && (_p5._0._1.ctor === '::')) && (_p5._0._1._0.ctor === '_Tuple2')) && (_p5._0._1._0._1.ctor === 'ListExpr')) && (_p5._0._1._1.ctor === '[]')) {
			return A2(_elm_lang$core$List$all, _user$project$Analyser_Checks_UnnecessaryListConcat$isListExpression, _p5._0._1._0._1._0) ? {ctor: '::', _0: _p4._0, _1: context} : context;
		} else {
			return context;
		}
	});
var _user$project$Analyser_Checks_UnnecessaryListConcat$scan = F2(
	function (fileContext, _p6) {
		return A2(
			_elm_lang$core$List$map,
			_user$project$Analyser_Messages_Types$newMessage(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
					_1: {ctor: '[]'}
				}),
			A2(
				_elm_lang$core$List$map,
				_user$project$Analyser_Messages_Types$UnnecessaryListConcat(fileContext.path),
				A3(
					_user$project$Inspector$inspect,
					_elm_lang$core$Native_Utils.update(
						_user$project$Inspector$defaultConfig,
						{
							onExpression: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnnecessaryListConcat$onExpression)
						}),
					fileContext.ast,
					{ctor: '[]'})));
	});
var _user$project$Analyser_Checks_UnnecessaryListConcat$checker = {
	check: _user$project$Analyser_Checks_UnnecessaryListConcat$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'UnnecessaryListConcat',
			_1: {ctor: '[]'}
		})
};

var _user$project$Analyser_Checks_MultiLineRecordFormatting$findRecords = function (x) {
	var _p0 = x;
	switch (_p0.ctor) {
		case 'GenericType':
			return {ctor: '[]'};
		case 'Typed':
			return A2(_elm_lang$core$List$concatMap, _user$project$Analyser_Checks_MultiLineRecordFormatting$findRecords, _p0._2);
		case 'Unit':
			return {ctor: '[]'};
		case 'Tupled':
			return A2(_elm_lang$core$List$concatMap, _user$project$Analyser_Checks_MultiLineRecordFormatting$findRecords, _p0._0);
		case 'Record':
			var _p2 = _p0._0;
			return {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _p0._1, _1: _p2},
				_1: A2(
					_elm_lang$core$List$concatMap,
					function (_p1) {
						return _user$project$Analyser_Checks_MultiLineRecordFormatting$findRecords(
							_elm_lang$core$Tuple$second(_p1));
					},
					_p2)
			};
		case 'GenericRecord':
			var _p4 = _p0._1;
			return {
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: _p0._2, _1: _p4},
				_1: A2(
					_elm_lang$core$List$concatMap,
					function (_p3) {
						return _user$project$Analyser_Checks_MultiLineRecordFormatting$findRecords(
							_elm_lang$core$Tuple$second(_p3));
					},
					_p4)
			};
		default:
			return A2(
				_elm_lang$core$Basics_ops['++'],
				_user$project$Analyser_Checks_MultiLineRecordFormatting$findRecords(_p0._0),
				_user$project$Analyser_Checks_MultiLineRecordFormatting$findRecords(_p0._1));
	}
};
var _user$project$Analyser_Checks_MultiLineRecordFormatting$typeReferenceRange = function (x) {
	var _p5 = x;
	switch (_p5.ctor) {
		case 'GenericType':
			return _p5._1;
		case 'Typed':
			return _p5._3;
		case 'Unit':
			return _p5._0;
		case 'Tupled':
			return _p5._1;
		case 'Record':
			return _p5._1;
		case 'GenericRecord':
			return _p5._2;
		default:
			return _p5._2;
	}
};
var _user$project$Analyser_Checks_MultiLineRecordFormatting$onTypeAlias = F2(
	function (x, context) {
		return A2(
			_elm_lang$core$Basics_ops['++'],
			_user$project$Analyser_Checks_MultiLineRecordFormatting$findRecords(x.typeReference),
			context);
	});
var _user$project$Analyser_Checks_MultiLineRecordFormatting$firstTwo = function (def) {
	var _p6 = def;
	if ((_p6.ctor === '::') && (_p6._1.ctor === '::')) {
		return _elm_lang$core$Maybe$Just(
			{ctor: '_Tuple2', _0: _p6._0, _1: _p6._1._0});
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _user$project$Analyser_Checks_MultiLineRecordFormatting$fieldsOnSameLine = function (_p7) {
	var _p8 = _p7;
	return _elm_lang$core$Native_Utils.eq(
		_user$project$Analyser_Checks_MultiLineRecordFormatting$typeReferenceRange(
			_elm_lang$core$Tuple$second(_p8._0)).start.row,
		_user$project$Analyser_Checks_MultiLineRecordFormatting$typeReferenceRange(
			_elm_lang$core$Tuple$second(_p8._1)).start.row);
};
var _user$project$Analyser_Checks_MultiLineRecordFormatting$scan = F2(
	function (fileContext, _p9) {
		var threshold = 2;
		return A2(
			_elm_lang$core$List$map,
			_user$project$Analyser_Messages_Types$newMessage(
				{
					ctor: '::',
					_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
					_1: {ctor: '[]'}
				}),
			A2(
				_elm_lang$core$List$map,
				function (_p10) {
					return A2(
						_user$project$Analyser_Messages_Types$MultiLineRecordFormatting,
						fileContext.path,
						_elm_lang$core$Tuple$first(_p10));
				},
				A2(
					_elm_lang$core$List$filter,
					function (_p11) {
						return _user$project$Analyser_Checks_MultiLineRecordFormatting$fieldsOnSameLine(
							_elm_lang$core$Tuple$second(_p11));
					},
					A2(
						_elm_lang$core$List$filterMap,
						function (_p12) {
							var _p13 = _p12;
							return A2(
								_elm_lang$core$Maybe$map,
								F2(
									function (v0, v1) {
										return {ctor: '_Tuple2', _0: v0, _1: v1};
									})(_p13._0),
								_user$project$Analyser_Checks_MultiLineRecordFormatting$firstTwo(_p13._1));
						},
						A2(
							_elm_lang$core$List$filter,
							function (_p14) {
								return A2(
									F2(
										function (x, y) {
											return _elm_lang$core$Native_Utils.cmp(x, y) < 1;
										}),
									threshold,
									_elm_lang$core$List$length(
										_elm_lang$core$Tuple$second(_p14)));
							},
							A3(
								_user$project$Inspector$inspect,
								_elm_lang$core$Native_Utils.update(
									_user$project$Inspector$defaultConfig,
									{
										onTypeAlias: _user$project$Inspector$Post(_user$project$Analyser_Checks_MultiLineRecordFormatting$onTypeAlias)
									}),
								fileContext.ast,
								{ctor: '[]'}))))));
	});
var _user$project$Analyser_Checks_MultiLineRecordFormatting$checker = {
	check: _user$project$Analyser_Checks_MultiLineRecordFormatting$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'MultiLineRecordFormatting',
			_1: {ctor: '[]'}
		})
};

var _user$project$Analyser_Checks_UnnecessaryPortModule$onPortDeclaration = F2(
	function (_p0, x) {
		return x + 1;
	});
var _user$project$Analyser_Checks_UnnecessaryPortModule$scan = F2(
	function (fileContext, _p1) {
		if (_user$project$AST_Util$isPortModule(fileContext.ast)) {
			var portDeclCount = A3(
				_user$project$Inspector$inspect,
				_elm_lang$core$Native_Utils.update(
					_user$project$Inspector$defaultConfig,
					{
						onPortDeclaration: _user$project$Inspector$Post(_user$project$Analyser_Checks_UnnecessaryPortModule$onPortDeclaration)
					}),
				fileContext.ast,
				0);
			return _elm_lang$core$Native_Utils.eq(portDeclCount, 0) ? {
				ctor: '::',
				_0: A2(
					_user$project$Analyser_Messages_Types$newMessage,
					{
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
						_1: {ctor: '[]'}
					},
					_user$project$Analyser_Messages_Types$UnnecessaryPortModule(fileContext.path)),
				_1: {ctor: '[]'}
			} : {ctor: '[]'};
		} else {
			return {ctor: '[]'};
		}
	});
var _user$project$Analyser_Checks_UnnecessaryPortModule$checker = {
	check: _user$project$Analyser_Checks_UnnecessaryPortModule$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'UnnecessaryPortModule',
			_1: {ctor: '[]'}
		})
};

var _user$project$Analyser_Checks_NonStaticRegex$addUsedRegex = F2(
	function (range, context) {
		return context.staticEnvironment ? context : _elm_lang$core$Native_Utils.update(
			context,
			{
				usages: {ctor: '::', _0: range, _1: context.usages}
			});
	});
var _user$project$Analyser_Checks_NonStaticRegex$onExpressionQualified = F3(
	function (moduleName, _p0, context) {
		var _p1 = _p0;
		var _p2 = _p1._1;
		if (_p2.ctor === 'QualifiedExpr') {
			return (_elm_lang$core$Native_Utils.eq(_p2._1, 'regex') && _elm_lang$core$Native_Utils.eq(_p2._0, moduleName)) ? A2(_user$project$Analyser_Checks_NonStaticRegex$addUsedRegex, _p1._0, context) : context;
		} else {
			return context;
		}
	});
var _user$project$Analyser_Checks_NonStaticRegex$onExpressionFunctionReference = F2(
	function (_p3, context) {
		var _p4 = _p3;
		var _p5 = _p4._1;
		if ((_p5.ctor === 'FunctionOrValue') && (_p5._0 === 'regex')) {
			return A2(_user$project$Analyser_Checks_NonStaticRegex$addUsedRegex, _p4._0, context);
		} else {
			return context;
		}
	});
var _user$project$Analyser_Checks_NonStaticRegex$onExpression = F3(
	function (x, expression, context) {
		return x.exposesRegex ? A3(
			_user$project$Analyser_Checks_NonStaticRegex$onExpressionQualified,
			x.moduleName,
			expression,
			A2(_user$project$Analyser_Checks_NonStaticRegex$onExpressionFunctionReference, expression, context)) : A3(_user$project$Analyser_Checks_NonStaticRegex$onExpressionQualified, x.moduleName, expression, context);
	});
var _user$project$Analyser_Checks_NonStaticRegex$onFunction = F3(
	function (inner, $function, context) {
		if (!_user$project$ASTUtil_Functions$isStatic($function)) {
			var after = inner(
				_elm_lang$core$Native_Utils.update(
					context,
					{staticEnvironment: false}));
			return _elm_lang$core$Native_Utils.update(
				after,
				{staticEnvironment: context.staticEnvironment});
		} else {
			return inner(context);
		}
	});
var _user$project$Analyser_Checks_NonStaticRegex$startingContext = {
	staticEnvironment: true,
	usages: {ctor: '[]'}
};
var _user$project$Analyser_Checks_NonStaticRegex$findRegexUsagesInFunctions = F2(
	function (regexImport, fileContext) {
		return A3(
			_user$project$Inspector$inspect,
			_elm_lang$core$Native_Utils.update(
				_user$project$Inspector$defaultConfig,
				{
					onFunction: _user$project$Inspector$Inner(_user$project$Analyser_Checks_NonStaticRegex$onFunction),
					onExpression: _user$project$Inspector$Post(
						_user$project$Analyser_Checks_NonStaticRegex$onExpression(regexImport))
				}),
			fileContext.ast,
			_user$project$Analyser_Checks_NonStaticRegex$startingContext);
	});
var _user$project$Analyser_Checks_NonStaticRegex$scan = F2(
	function (fileContext, _p6) {
		var regexImport = A3(
			_user$project$ASTUtil_Imports$buildImportInformation,
			{
				ctor: '::',
				_0: 'Regex',
				_1: {ctor: '[]'}
			},
			'regex',
			fileContext.ast);
		var _p7 = regexImport;
		if (_p7.ctor === 'Nothing') {
			return {ctor: '[]'};
		} else {
			return A2(
				_elm_lang$core$List$map,
				_user$project$Analyser_Messages_Types$newMessage(
					{
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
						_1: {ctor: '[]'}
					}),
				A2(
					_elm_lang$core$List$map,
					_user$project$Analyser_Messages_Types$NonStaticRegex(fileContext.path),
					function (_) {
						return _.usages;
					}(
						A2(_user$project$Analyser_Checks_NonStaticRegex$findRegexUsagesInFunctions, _p7._0, fileContext))));
		}
	});
var _user$project$Analyser_Checks_NonStaticRegex$checker = {
	check: _user$project$Analyser_Checks_NonStaticRegex$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'NonStaticRegex',
			_1: {ctor: '[]'}
		})
};
var _user$project$Analyser_Checks_NonStaticRegex$Context = F2(
	function (a, b) {
		return {staticEnvironment: a, usages: b};
	});

var _user$project$Analyser_Checks_CoreArrayUsage$isArrayImport = function (_p0) {
	var _p1 = _p0;
	return _elm_lang$core$Native_Utils.eq(
		_p1.moduleName,
		{
			ctor: '::',
			_0: 'Array',
			_1: {ctor: '[]'}
		});
};
var _user$project$Analyser_Checks_CoreArrayUsage$scan = F2(
	function (fileContext, _p2) {
		return A2(
			_elm_lang$core$List$take,
			1,
			A2(
				_elm_lang$core$List$map,
				_user$project$Analyser_Messages_Types$newMessage(
					{
						ctor: '::',
						_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
						_1: {ctor: '[]'}
					}),
				A2(
					_elm_lang$core$List$map,
					function (_p3) {
						return A2(
							_user$project$Analyser_Messages_Types$CoreArrayUsage,
							fileContext.path,
							function (_) {
								return _.range;
							}(_p3));
					},
					A2(_elm_lang$core$List$filter, _user$project$Analyser_Checks_CoreArrayUsage$isArrayImport, fileContext.ast.imports))));
	});
var _user$project$Analyser_Checks_CoreArrayUsage$checker = {
	check: _user$project$Analyser_Checks_CoreArrayUsage$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'CoreArrayUsage',
			_1: {ctor: '[]'}
		})
};

var _user$project$Analyser_Checks_FunctionsInLet$onLetBlock = F3(
	function ($continue, _p0, context) {
		return function (after) {
			return _elm_lang$core$Native_Utils.update(
				after,
				{inLetBlock: context.inLetBlock});
		}(
			$continue(
				_elm_lang$core$Native_Utils.update(
					context,
					{inLetBlock: true})));
	});
var _user$project$Analyser_Checks_FunctionsInLet$onFunction = F2(
	function ($function, context) {
		var isStatic = _user$project$ASTUtil_Functions$isStatic($function);
		return ((!isStatic) && context.inLetBlock) ? _elm_lang$core$Native_Utils.update(
			context,
			{
				functions: {ctor: '::', _0: $function, _1: context.functions}
			}) : context;
	});
var _user$project$Analyser_Checks_FunctionsInLet$asMessage = F2(
	function (fileContext, f) {
		return A2(
			_user$project$Analyser_Messages_Types$newMessage,
			{
				ctor: '::',
				_0: {ctor: '_Tuple2', _0: fileContext.sha1, _1: fileContext.path},
				_1: {ctor: '[]'}
			},
			A2(_user$project$Analyser_Messages_Types$FunctionInLet, fileContext.path, f.declaration.name.range));
	});
var _user$project$Analyser_Checks_FunctionsInLet$startingContext = {
	inLetBlock: false,
	functions: {ctor: '[]'}
};
var _user$project$Analyser_Checks_FunctionsInLet$scan = F2(
	function (fileContext, _p1) {
		return A2(
			_elm_lang$core$List$map,
			_user$project$Analyser_Checks_FunctionsInLet$asMessage(fileContext),
			function (_) {
				return _.functions;
			}(
				A3(
					_user$project$Inspector$inspect,
					_elm_lang$core$Native_Utils.update(
						_user$project$Inspector$defaultConfig,
						{
							onLetBlock: _user$project$Inspector$Inner(_user$project$Analyser_Checks_FunctionsInLet$onLetBlock),
							onFunction: _user$project$Inspector$Post(_user$project$Analyser_Checks_FunctionsInLet$onFunction)
						}),
					fileContext.ast,
					_user$project$Analyser_Checks_FunctionsInLet$startingContext)));
	});
var _user$project$Analyser_Checks_FunctionsInLet$checker = {
	check: _user$project$Analyser_Checks_FunctionsInLet$scan,
	shouldCheck: _user$project$Analyser_Checks_Base$keyBasedChecker(
		{
			ctor: '::',
			_0: 'FunctionsInLet',
			_1: {ctor: '[]'}
		})
};
var _user$project$Analyser_Checks_FunctionsInLet$Context = F2(
	function (a, b) {
		return {inLetBlock: a, functions: b};
	});

var _user$project$Inspection$checkers = {
	ctor: '::',
	_0: _user$project$Analyser_Checks_UnusedVariable$checker,
	_1: {
		ctor: '::',
		_0: _user$project$Analyser_Checks_ExposeAll$checker,
		_1: {
			ctor: '::',
			_0: _user$project$Analyser_Checks_ImportAll$checker,
			_1: {
				ctor: '::',
				_0: _user$project$Analyser_Checks_NoTopLevelSignature$checker,
				_1: {
					ctor: '::',
					_0: _user$project$Analyser_Checks_UnnecessaryParens$checker,
					_1: {
						ctor: '::',
						_0: _user$project$Analyser_Checks_NoDebug$checker,
						_1: {
							ctor: '::',
							_0: _user$project$Analyser_Checks_DuplicateImport$checker,
							_1: {
								ctor: '::',
								_0: _user$project$Analyser_Checks_UnusedTypeAlias$checker,
								_1: {
									ctor: '::',
									_0: _user$project$Analyser_Checks_OverriddenVariables$checker,
									_1: {
										ctor: '::',
										_0: _user$project$Analyser_Checks_NoUncurriedPrefix$checker,
										_1: {
											ctor: '::',
											_0: _user$project$Analyser_Checks_UnusedImportAliases$checker,
											_1: {
												ctor: '::',
												_0: _user$project$Analyser_Checks_UnusedImport$checker,
												_1: {
													ctor: '::',
													_0: _user$project$Analyser_Checks_ListOperators$checker,
													_1: {
														ctor: '::',
														_0: _user$project$Analyser_Checks_LineLength$checker,
														_1: {
															ctor: '::',
															_0: _user$project$Analyser_Checks_UnnecessaryListConcat$checker,
															_1: {
																ctor: '::',
																_0: _user$project$Analyser_Checks_MultiLineRecordFormatting$checker,
																_1: {
																	ctor: '::',
																	_0: _user$project$Analyser_Checks_UnnecessaryPortModule$checker,
																	_1: {
																		ctor: '::',
																		_0: _user$project$Analyser_Checks_NonStaticRegex$checker,
																		_1: {
																			ctor: '::',
																			_0: _user$project$Analyser_Checks_CoreArrayUsage$checker,
																			_1: {
																				ctor: '::',
																				_0: _user$project$Analyser_Checks_FunctionsInLet$checker,
																				_1: {ctor: '[]'}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var _user$project$Inspection$run = F3(
	function (sources, deps, configuration) {
		var includedSources = A2(
			_elm_lang$core$List$filter,
			function (_p0) {
				return !A3(
					_elm_lang$core$Basics$flip,
					_user$project$Analyser_Configuration$isPathExcluded,
					configuration,
					function (_) {
						return _.path;
					}(
						_elm_lang$core$Tuple$first(_p0)));
			},
			sources);
		var _p1 = A2(
			_elm_lang$core$List$partition,
			function (_p2) {
				return _user$project$Analyser_Util$isLoaded(
					_elm_lang$core$Tuple$second(_p2));
			},
			includedSources);
		var validSources = _p1._0;
		var invalidSources = _p1._1;
		var failedMessages = A2(
			_elm_lang$core$List$map,
			function (_p3) {
				var _p4 = _p3;
				var _p5 = _p4._0;
				return A2(
					_user$project$Analyser_Messages_Types$newMessage,
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: A2(_elm_lang$core$Maybe$withDefault, '', _p5.sha1),
							_1: _p5.path
						},
						_1: {ctor: '[]'}
					},
					A2(_user$project$Analyser_Messages_Types$FileLoadFailed, _p5.path, _p4._1));
			},
			A2(
				_elm_lang$core$List$filterMap,
				function (_p6) {
					var _p7 = _p6;
					return A2(
						_elm_lang$core$Maybe$map,
						F2(
							function (v0, v1) {
								return {ctor: '_Tuple2', _0: v0, _1: v1};
							})(_p7._0),
						_user$project$Analyser_Util$fileLoadError(_p7._1));
				},
				invalidSources));
		var fileMessages = A2(
			_elm_lang$core$List$map,
			function (source) {
				return A2(
					_user$project$Analyser_Messages_Types$newMessage,
					{
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: A2(_elm_lang$core$Maybe$withDefault, '', source.sha1),
							_1: source.path
						},
						_1: {ctor: '[]'}
					},
					_user$project$Analyser_Messages_Types$UnformattedFile(source.path));
			},
			A2(
				_elm_lang$core$List$filter,
				function (_p8) {
					return !function (_) {
						return _.formatted;
					}(_p8);
				},
				A2(_elm_lang$core$List$map, _elm_lang$core$Tuple$first, validSources)));
		var enabledChecks = A2(
			_elm_lang$core$List$filter,
			function (x) {
				return x.shouldCheck(configuration);
			},
			_user$project$Inspection$checkers);
		var inspectionMessages = A2(
			_elm_lang$core$List$concatMap,
			function (x) {
				return A2(
					_elm_lang$core$List$concatMap,
					function (c) {
						return A2(c.check, x, configuration);
					},
					enabledChecks);
			},
			A2(
				_elm_lang$core$List$filterMap,
				A2(_user$project$Analyser_FileContext$create, sources, deps),
				includedSources));
		var messages = _elm_lang$core$List$concat(
			{
				ctor: '::',
				_0: failedMessages,
				_1: {
					ctor: '::',
					_0: fileMessages,
					_1: {
						ctor: '::',
						_0: inspectionMessages,
						_1: {ctor: '[]'}
					}
				}
			});
		return messages;
	});

var _user$project$Analyser_Fixes_FileContent$replaceLines = F3(
	function (_p0, fix, input) {
		var _p1 = _p0;
		var lines = A2(_elm_lang$core$String$split, '\n', input);
		return A2(
			_elm_lang$core$String$join,
			'\n',
			_elm_lang$core$List$concat(
				{
					ctor: '::',
					_0: A2(_elm_lang$core$List$take, _p1._0, lines),
					_1: {
						ctor: '::',
						_0: {
							ctor: '::',
							_0: fix,
							_1: {ctor: '[]'}
						},
						_1: {
							ctor: '::',
							_0: A2(_elm_lang$core$List$drop, _p1._1, lines),
							_1: {ctor: '[]'}
						}
					}
				}));
	});
var _user$project$Analyser_Fixes_FileContent$getCharAtLocation = F2(
	function (loc, input) {
		return A2(
			_elm_lang$core$Maybe$map,
			function (_p2) {
				return A2(
					_elm_lang$core$String$left,
					1,
					A2(_elm_lang$core$String$dropLeft, loc.column + 1, _p2));
			},
			_elm_lang$core$List$head(
				A2(
					_elm_lang$core$List$drop,
					loc.row,
					A2(_elm_lang$core$String$split, '\n', input))));
	});
var _user$project$Analyser_Fixes_FileContent$replaceLocationWith = F3(
	function (loc, x, input) {
		var lineUpdater = function (target) {
			return _elm_lang$core$String$concat(
				{
					ctor: '::',
					_0: A2(_elm_lang$core$String$left, loc.column + 1, target),
					_1: {
						ctor: '::',
						_0: x,
						_1: {
							ctor: '::',
							_0: A2(_elm_lang$core$String$dropLeft, loc.column + 2, target),
							_1: {ctor: '[]'}
						}
					}
				});
		};
		var rows = A2(_elm_lang$core$String$split, '\n', input);
		return A2(
			_elm_lang$core$String$join,
			'\n',
			A3(
				_elm_community$list_extra$List_Extra$updateIfIndex,
				F2(
					function (x, y) {
						return _elm_lang$core$Native_Utils.eq(x, y);
					})(loc.row),
				lineUpdater,
				rows));
	});
var _user$project$Analyser_Fixes_FileContent$replaceRangeWith = F3(
	function (range, x, input) {
		var rowPostPartTakeFn = (_elm_lang$core$Native_Utils.cmp(range.end.column, -2) < 1) ? _elm_lang$core$Basics$always('') : _elm_lang$core$String$dropLeft(range.end.column + 2);
		var rowPrePartTakeFn = (_elm_lang$core$Native_Utils.cmp(range.start.column, -2) < 1) ? _elm_lang$core$Basics$identity : _elm_lang$core$String$left(range.start.column + 1);
		var afterRows = (_elm_lang$core$Native_Utils.cmp(range.end.column, -2) < 1) ? (range.end.row - 1) : range.end.row;
		var beforeRows = (_elm_lang$core$Native_Utils.cmp(range.start.column, -2) < 1) ? (range.start.row - 1) : range.start.row;
		var rows = A2(_elm_lang$core$String$split, '\n', input);
		var linesBefore = A2(_elm_lang$core$List$take, beforeRows, rows);
		var rowPrePart = A2(
			_elm_lang$core$Maybe$withDefault,
			'',
			A2(
				_elm_lang$core$Maybe$map,
				rowPrePartTakeFn,
				_elm_lang$core$List$head(
					A2(_elm_lang$core$List$drop, beforeRows, rows))));
		var postRows = A2(_elm_lang$core$List$drop, afterRows + 1, rows);
		var rowPostPart = A2(
			_elm_lang$core$Maybe$withDefault,
			'',
			A2(
				_elm_lang$core$Maybe$map,
				rowPostPartTakeFn,
				_elm_lang$core$List$head(
					A2(_elm_lang$core$List$drop, afterRows, rows))));
		return _elm_lang$core$String$concat(
			{
				ctor: '::',
				_0: A2(
					_elm_lang$core$String$join,
					'\n',
					A2(
						_elm_lang$core$Basics_ops['++'],
						linesBefore,
						{
							ctor: '::',
							_0: rowPrePart,
							_1: {ctor: '[]'}
						})),
				_1: {
					ctor: '::',
					_0: x,
					_1: {
						ctor: '::',
						_0: A2(
							_elm_lang$core$String$join,
							'\n',
							{ctor: '::', _0: rowPostPart, _1: postRows}),
						_1: {ctor: '[]'}
					}
				}
			});
	});

var _user$project$Analyser_Fixes_Base$Fixer = F2(
	function (a, b) {
		return {canFix: a, fix: b};
	});

var _user$project$Analyser_Fixes_UnnecessaryParens$fixContent = F2(
	function (_p1, _p0) {
		var _p2 = _p1;
		var _p7 = _p2.start;
		var _p6 = _p2.end;
		var _p3 = _p0;
		var _p5 = _p3._1;
		var lines = A2(_elm_lang$core$String$split, '\n', _p5);
		var endCharLoc = (_elm_lang$core$Native_Utils.cmp(_p6.column, -2) < 1) ? _elm_lang$core$Native_Utils.update(
			_p6,
			{
				column: A3(
					_elm_lang$core$Basics$flip,
					F2(
						function (x, y) {
							return x - y;
						}),
					2,
					_elm_lang$core$String$length(
						A2(
							_elm_lang$core$Maybe$withDefault,
							'',
							_elm_lang$core$List$head(
								A2(_elm_lang$core$List$drop, _p6.row - 1, lines))))),
				row: _p6.row - 1
			}) : (_elm_lang$core$Native_Utils.eq(_p6.column, -1) ? _elm_lang$core$Native_Utils.update(
			_p6,
			{
				column: A3(
					_elm_lang$core$Basics$flip,
					F2(
						function (x, y) {
							return x - y;
						}),
					2,
					_elm_lang$core$String$length(
						A2(
							_elm_lang$core$Maybe$withDefault,
							'',
							_elm_lang$core$List$head(
								A2(_elm_lang$core$List$drop, _p6.row - 2, lines))))),
				row: _p6.row - 2
			}) : _elm_lang$core$Native_Utils.update(
			_p6,
			{column: _p6.column - 1}));
		var endChar = A2(_user$project$Analyser_Fixes_FileContent$getCharAtLocation, endCharLoc, _p5);
		var startChar = A2(_user$project$Analyser_Fixes_FileContent$getCharAtLocation, _p7, _p5);
		var _p4 = {ctor: '_Tuple2', _0: startChar, _1: endChar};
		if (((((_p4.ctor === '_Tuple2') && (_p4._0.ctor === 'Just')) && (_p4._0._0 === '(')) && (_p4._1.ctor === 'Just')) && (_p4._1._0 === ')')) {
			return _elm_lang$core$Result$Ok(
				A2(
					F2(
						function (v0, v1) {
							return {ctor: '_Tuple2', _0: v0, _1: v1};
						}),
					_p3._0,
					A3(
						_user$project$Analyser_Fixes_FileContent$replaceLocationWith,
						endCharLoc,
						'',
						A3(_user$project$Analyser_Fixes_FileContent$replaceLocationWith, _p7, ' ', _p5))));
		} else {
			return _elm_lang$core$Result$Err('Could not locate parens to replace');
		}
	});
var _user$project$Analyser_Fixes_UnnecessaryParens$fix = F2(
	function (input, messageData) {
		var _p8 = messageData;
		if (_p8.ctor === 'UnnecessaryParens') {
			return A2(
				_elm_lang$core$Maybe$withDefault,
				_elm_lang$core$Result$Err('Could not find the right file to replace the unnecessary parens'),
				A2(
					_elm_lang$core$Maybe$map,
					_elm_lang$core$Result$map(_elm_lang$core$List$singleton),
					A2(
						_elm_lang$core$Maybe$map,
						function (_p9) {
							return A2(
								_user$project$Analyser_Fixes_UnnecessaryParens$fixContent,
								_p8._1,
								_Fresheyeball$elm_tuple_extra$Tuple3$init(_p9));
						},
						_elm_lang$core$List$head(
							A2(
								_elm_lang$core$List$filter,
								function (_p10) {
									return A2(
										F2(
											function (x, y) {
												return _elm_lang$core$Native_Utils.eq(x, y);
											}),
										_p8._0,
										_Fresheyeball$elm_tuple_extra$Tuple3$first(_p10));
								},
								input)))));
		} else {
			return _elm_lang$core$Result$Err('Invalid message data for fixer UnnecessaryParens');
		}
	});
var _user$project$Analyser_Fixes_UnnecessaryParens$canFix = function (message) {
	var _p11 = message;
	if (_p11.ctor === 'UnnecessaryParens') {
		return true;
	} else {
		return false;
	}
};
var _user$project$Analyser_Fixes_UnnecessaryParens$fixer = A2(_user$project$Analyser_Fixes_Base$Fixer, _user$project$Analyser_Fixes_UnnecessaryParens$canFix, _user$project$Analyser_Fixes_UnnecessaryParens$fix);

var _user$project$Analyser_Fixes_UnusedImportedVariable$writeNewImport = F3(
	function (r, imp, i) {
		return A3(
			_user$project$Analyser_Fixes_FileContent$replaceLines,
			{ctor: '_Tuple2', _0: r.start.row, _1: r.end.row},
			_user$project$ASTUtil_Imports$naiveStringifyImport(imp),
			i);
	});
var _user$project$Analyser_Fixes_UnusedImportedVariable$removeImport = F2(
	function (_p0, range) {
		var _p1 = _p0;
		var _p2 = A2(_user$project$ASTUtil_Imports$findImportWithRange, _p1._2, range);
		if (_p2.ctor === 'Just') {
			var _p3 = _p2._0;
			return _elm_lang$core$Result$Ok(
				{
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: _p1._0,
						_1: A3(
							_user$project$Analyser_Fixes_UnusedImportedVariable$writeNewImport,
							_p3.range,
							A2(_user$project$ASTUtil_Imports$removeRangeFromImport, range, _p3),
							_p1._1)
					},
					_1: {ctor: '[]'}
				});
		} else {
			return _elm_lang$core$Result$Err('Could not locate import for the target range');
		}
	});
var _user$project$Analyser_Fixes_UnusedImportedVariable$fix = F2(
	function (input, messageData) {
		var _p4 = messageData;
		if (_p4.ctor === 'UnusedImportedVariable') {
			var _p5 = _elm_lang$core$List$head(input);
			if (_p5.ctor === 'Nothing') {
				return _elm_lang$core$Result$Err('No input for fixer UnusedImportedVariable');
			} else {
				return A2(_user$project$Analyser_Fixes_UnusedImportedVariable$removeImport, _p5._0, _p4._2);
			}
		} else {
			return _elm_lang$core$Result$Err('Invalid message data for fixer UnusedImportedVariable');
		}
	});
var _user$project$Analyser_Fixes_UnusedImportedVariable$canFix = function (message) {
	var _p6 = message;
	if (_p6.ctor === 'UnusedImportedVariable') {
		return true;
	} else {
		return false;
	}
};
var _user$project$Analyser_Fixes_UnusedImportedVariable$fixer = A2(_user$project$Analyser_Fixes_Base$Fixer, _user$project$Analyser_Fixes_UnusedImportedVariable$canFix, _user$project$Analyser_Fixes_UnusedImportedVariable$fix);

var _user$project$Analyser_Fixes_UnusedImportAlias$writeNewImport = F3(
	function (r, imp, i) {
		return A3(
			_user$project$Analyser_Fixes_FileContent$replaceLines,
			{ctor: '_Tuple2', _0: r.start.row, _1: r.end.row},
			_user$project$ASTUtil_Imports$naiveStringifyImport(imp),
			i);
	});
var _user$project$Analyser_Fixes_UnusedImportAlias$updateImport = F2(
	function (_p0, range) {
		var _p1 = _p0;
		var _p2 = A2(_user$project$ASTUtil_Imports$findImportWithRange, _p1._2, range);
		if (_p2.ctor === 'Just') {
			var _p3 = _p2._0;
			return _elm_lang$core$Result$Ok(
				{
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: _p1._0,
						_1: A3(
							_user$project$Analyser_Fixes_UnusedImportAlias$writeNewImport,
							_p3.range,
							_elm_lang$core$Native_Utils.update(
								_p3,
								{moduleAlias: _elm_lang$core$Maybe$Nothing}),
							_p1._1)
					},
					_1: {ctor: '[]'}
				});
		} else {
			return _elm_lang$core$Result$Err('Could not locate import for the target range');
		}
	});
var _user$project$Analyser_Fixes_UnusedImportAlias$fix = F2(
	function (input, messageData) {
		var _p4 = messageData;
		if (_p4.ctor === 'UnusedImportAlias') {
			var _p5 = _elm_lang$core$List$head(input);
			if (_p5.ctor === 'Nothing') {
				return _elm_lang$core$Result$Err('No input for fixer UnusedImportAlias');
			} else {
				return A2(_user$project$Analyser_Fixes_UnusedImportAlias$updateImport, _p5._0, _p4._2);
			}
		} else {
			return _elm_lang$core$Result$Err('Invalid message data for fixer UnusedImportAlias');
		}
	});
var _user$project$Analyser_Fixes_UnusedImportAlias$canFix = function (message) {
	var _p6 = message;
	if (_p6.ctor === 'UnusedImportAlias') {
		return true;
	} else {
		return false;
	}
};
var _user$project$Analyser_Fixes_UnusedImportAlias$fixer = A2(_user$project$Analyser_Fixes_Base$Fixer, _user$project$Analyser_Fixes_UnusedImportAlias$canFix, _user$project$Analyser_Fixes_UnusedImportAlias$fix);

var _user$project$Analyser_Fixes_UnusedPatternVariable$fixPattern = F2(
	function (_p0, range) {
		var _p1 = _p0;
		var _p2 = A2(_user$project$ASTUtil_Patterns$findParentPattern, _p1._2, range);
		if (_p2.ctor === 'Just') {
			var _p3 = _p2._0;
			return _elm_lang$core$Result$Ok(
				{
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: _p1._0,
						_1: A3(
							_user$project$Analyser_Fixes_FileContent$replaceRangeWith,
							_user$project$ASTUtil_PatternOptimizer$patternRange(_p3),
							_user$project$ASTUtil_ASTWriter$write(
								_user$project$ASTUtil_ASTWriter$writePattern(
									A2(_user$project$ASTUtil_PatternOptimizer$optimize, range, _p3))),
							_p1._1)
					},
					_1: {ctor: '[]'}
				});
		} else {
			return _elm_lang$core$Result$Err('Could not find location to replace unused variable in pattern');
		}
	});
var _user$project$Analyser_Fixes_UnusedPatternVariable$fix = F2(
	function (input, messageData) {
		var _p4 = messageData;
		if (_p4.ctor === 'UnusedPatternVariable') {
			var _p5 = _elm_lang$core$List$head(input);
			if (_p5.ctor === 'Nothing') {
				return _elm_lang$core$Result$Err('No input for fixer UnusedPatternVariable');
			} else {
				return A2(_user$project$Analyser_Fixes_UnusedPatternVariable$fixPattern, _p5._0, _p4._2);
			}
		} else {
			return _elm_lang$core$Result$Err('Invalid message data for fixer UnusedPatternVariable');
		}
	});
var _user$project$Analyser_Fixes_UnusedPatternVariable$canFix = function (message) {
	var _p6 = message;
	if (_p6.ctor === 'UnusedPatternVariable') {
		return true;
	} else {
		return false;
	}
};
var _user$project$Analyser_Fixes_UnusedPatternVariable$fixer = A2(_user$project$Analyser_Fixes_Base$Fixer, _user$project$Analyser_Fixes_UnusedPatternVariable$canFix, _user$project$Analyser_Fixes_UnusedPatternVariable$fix);

var _user$project$Analyser_Fixes_UnformattedFile$fix = F2(
	function (input, messageData) {
		var _p0 = messageData;
		if (_p0.ctor === 'UnformattedFile') {
			return _elm_lang$core$Result$Ok(
				A2(_elm_lang$core$List$map, _Fresheyeball$elm_tuple_extra$Tuple3$init, input));
		} else {
			return _elm_lang$core$Result$Err('Invalid message data for fixer UnformattedFile');
		}
	});
var _user$project$Analyser_Fixes_UnformattedFile$canFix = function (message) {
	var _p1 = message;
	if (_p1.ctor === 'UnformattedFile') {
		return true;
	} else {
		return false;
	}
};
var _user$project$Analyser_Fixes_UnformattedFile$fixer = A2(_user$project$Analyser_Fixes_Base$Fixer, _user$project$Analyser_Fixes_UnformattedFile$canFix, _user$project$Analyser_Fixes_UnformattedFile$fix);

var _user$project$Analyser_Fixes_UnusedTypeAlias$removeTypeAlias = F2(
	function (typeAlias, content) {
		var end = typeAlias.range.end;
		var start = A2(
			_elm_lang$core$Maybe$withDefault,
			typeAlias.range.start,
			A2(
				_elm_lang$core$Maybe$map,
				function (_p0) {
					return function (_) {
						return _.start;
					}(
						_elm_lang$core$Tuple$second(_p0));
				},
				typeAlias.documentation));
		return A3(
			_user$project$Analyser_Fixes_FileContent$replaceRangeWith,
			A2(_user$project$AST_Ranges$Range, start, end),
			'',
			content);
	});
var _user$project$Analyser_Fixes_UnusedTypeAlias$findTypeAlias = F2(
	function (range, file) {
		return _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$filterMap,
				function (decl) {
					var _p1 = decl;
					if (_p1.ctor === 'AliasDecl') {
						var _p2 = _p1._0;
						return _elm_lang$core$Native_Utils.eq(_p2.range, range) ? _elm_lang$core$Maybe$Just(_p2) : _elm_lang$core$Maybe$Nothing;
					} else {
						return _elm_lang$core$Maybe$Nothing;
					}
				},
				file.declarations));
	});
var _user$project$Analyser_Fixes_UnusedTypeAlias$findAndRemoveTypeAlias = F2(
	function (_p3, range) {
		var _p4 = _p3;
		return A2(
			_elm_lang$core$Maybe$map,
			function (typeAlias) {
				return {
					ctor: '_Tuple2',
					_0: _p4._0,
					_1: A2(_user$project$Analyser_Fixes_UnusedTypeAlias$removeTypeAlias, typeAlias, _p4._1)
				};
			},
			A2(_user$project$Analyser_Fixes_UnusedTypeAlias$findTypeAlias, range, _p4._2));
	});
var _user$project$Analyser_Fixes_UnusedTypeAlias$fix = F2(
	function (input, messageData) {
		var _p5 = messageData;
		if (_p5.ctor === 'UnusedTypeAlias') {
			var _p6 = _elm_lang$core$List$head(input);
			if (_p6.ctor === 'Nothing') {
				return _elm_lang$core$Result$Err('No input for fixer UnusedTypeAlias');
			} else {
				return A2(
					_elm_lang$core$Result$fromMaybe,
					'Could not find type alias',
					A2(
						_elm_lang$core$Maybe$map,
						_elm_lang$core$List$singleton,
						A2(_user$project$Analyser_Fixes_UnusedTypeAlias$findAndRemoveTypeAlias, _p6._0, _p5._2)));
			}
		} else {
			return _elm_lang$core$Result$Err('Invalid message data for fixer UnusedTypeAlias');
		}
	});
var _user$project$Analyser_Fixes_UnusedTypeAlias$canFix = function (message) {
	var _p7 = message;
	if (_p7.ctor === 'UnusedTypeAlias') {
		return true;
	} else {
		return false;
	}
};
var _user$project$Analyser_Fixes_UnusedTypeAlias$fixer = A2(_user$project$Analyser_Fixes_Base$Fixer, _user$project$Analyser_Fixes_UnusedTypeAlias$canFix, _user$project$Analyser_Fixes_UnusedTypeAlias$fix);

var _user$project$Analyser_Fixer$fixers = {
	ctor: '::',
	_0: _user$project$Analyser_Fixes_UnnecessaryParens$fixer,
	_1: {
		ctor: '::',
		_0: _user$project$Analyser_Fixes_UnusedImportedVariable$fixer,
		_1: {
			ctor: '::',
			_0: _user$project$Analyser_Fixes_UnusedImportAlias$fixer,
			_1: {
				ctor: '::',
				_0: _user$project$Analyser_Fixes_UnusedPatternVariable$fixer,
				_1: {
					ctor: '::',
					_0: _user$project$Analyser_Fixes_UnformattedFile$fixer,
					_1: {
						ctor: '::',
						_0: _user$project$Analyser_Fixes_UnusedTypeAlias$fixer,
						_1: {ctor: '[]'}
					}
				}
			}
		}
	}
};
var _user$project$Analyser_Fixer$getFixer = function (m) {
	return _elm_lang$core$List$head(
		A2(
			_elm_lang$core$List$filter,
			function (x) {
				return x.canFix(m.data);
			},
			_user$project$Analyser_Fixer$fixers));
};
var _user$project$Analyser_Fixer$fileHashesEqual = F2(
	function (reference, message) {
		return _elm_lang$core$Native_Utils.eq(
			A2(
				_elm_lang$core$List$sortBy,
				_elm_lang$core$Tuple$first,
				A2(_elm_lang$core$List$map, _Fresheyeball$elm_tuple_extra$Tuple3$init, reference)),
			A2(_elm_lang$core$List$sortBy, _elm_lang$core$Tuple$first, message.files));
	});
var _user$project$Analyser_Fixer$message = function (_p0) {
	var _p1 = _p0;
	return _p1._0.message;
};
var _user$project$Analyser_Fixer$touchedFiles = function (_p2) {
	var _p3 = _p2;
	return _p3._0.touchedFiles;
};
var _user$project$Analyser_Fixer$succeeded = function (_p4) {
	var _p5 = _p4;
	return _p5._0.success;
};
var _user$project$Analyser_Fixer$isDone = function (_p6) {
	var _p7 = _p6;
	return _p7._0.done;
};
var _user$project$Analyser_Fixer$storeFiles = _elm_lang$core$Native_Platform.outgoingPort(
	'storeFiles',
	function (v) {
		return _elm_lang$core$Native_List.toArray(v).map(
			function (v) {
				return [v._0, v._1];
			});
	});
var _user$project$Analyser_Fixer$onStoredFiles = _elm_lang$core$Native_Platform.incomingPort('onStoredFiles', _elm_lang$core$Json_Decode$bool);
var _user$project$Analyser_Fixer$loadFileContentWithShas = _elm_lang$core$Native_Platform.outgoingPort(
	'loadFileContentWithShas',
	function (v) {
		return _elm_lang$core$Native_List.toArray(v).map(
			function (v) {
				return v;
			});
	});
var _user$project$Analyser_Fixer$onFileContentWithShas = _elm_lang$core$Native_Platform.incomingPort(
	'onFileContentWithShas',
	_elm_lang$core$Json_Decode$list(
		A2(
			_elm_lang$core$Json_Decode$andThen,
			function (x0) {
				return A2(
					_elm_lang$core$Json_Decode$andThen,
					function (x1) {
						return A2(
							_elm_lang$core$Json_Decode$andThen,
							function (x2) {
								return _elm_lang$core$Json_Decode$succeed(
									{ctor: '_Tuple3', _0: x0, _1: x1, _2: x2});
							},
							A2(_elm_lang$core$Json_Decode$index, 2, _elm_lang$core$Json_Decode$string));
					},
					A2(_elm_lang$core$Json_Decode$index, 1, _elm_lang$core$Json_Decode$string));
			},
			A2(_elm_lang$core$Json_Decode$index, 0, _elm_lang$core$Json_Decode$string))));
var _user$project$Analyser_Fixer$sendFixResult = _elm_lang$core$Native_Platform.outgoingPort(
	'sendFixResult',
	function (v) {
		return {success: v.success, message: v.message};
	});
var _user$project$Analyser_Fixer$FixResult = F2(
	function (a, b) {
		return {success: a, message: b};
	});
var _user$project$Analyser_Fixer$Stored = function (a) {
	return {ctor: 'Stored', _0: a};
};
var _user$project$Analyser_Fixer$LoadedFileContent = function (a) {
	return {ctor: 'LoadedFileContent', _0: a};
};
var _user$project$Analyser_Fixer$subscriptions = function (_p8) {
	return _elm_lang$core$Platform_Sub$batch(
		{
			ctor: '::',
			_0: _user$project$Analyser_Fixer$onFileContentWithShas(_user$project$Analyser_Fixer$LoadedFileContent),
			_1: {
				ctor: '::',
				_0: _user$project$Analyser_Fixer$onStoredFiles(_user$project$Analyser_Fixer$Stored),
				_1: {ctor: '[]'}
			}
		});
};
var _user$project$Analyser_Fixer$Model = function (a) {
	return {ctor: 'Model', _0: a};
};
var _user$project$Analyser_Fixer$initWithMessage = F2(
	function (message, state) {
		return A2(
			_elm_lang$core$Maybe$map,
			function (fixer) {
				return {
					ctor: '_Tuple3',
					_0: _user$project$Analyser_Fixer$Model(
						{
							message: message,
							fixer: fixer,
							done: false,
							success: true,
							touchedFiles: {ctor: '[]'}
						}),
					_1: _user$project$Analyser_Fixer$loadFileContentWithShas(
						A2(_elm_lang$core$List$map, _elm_lang$core$Tuple$second, message.files)),
					_2: A2(_user$project$Analyser_State$startFixing, message, state)
				};
			},
			_user$project$Analyser_Fixer$getFixer(message));
	});
var _user$project$Analyser_Fixer$init = F2(
	function (x, state) {
		return A2(
			_elm_lang$core$Maybe$andThen,
			A2(_elm_lang$core$Basics$flip, _user$project$Analyser_Fixer$initWithMessage, state),
			A2(_user$project$Analyser_State$getMessage, x, state));
	});
var _user$project$Analyser_Fixer$update = F2(
	function (msg, _p9) {
		var _p10 = _p9;
		var _p18 = _p10._0;
		var _p11 = msg;
		if (_p11.ctor === 'LoadedFileContent') {
			var _p17 = _p11._0;
			if (!A2(_user$project$Analyser_Fixer$fileHashesEqual, _p17, _p18.message)) {
				return {
					ctor: '_Tuple2',
					_0: _user$project$Analyser_Fixer$Model(
						_elm_lang$core$Native_Utils.update(
							_p18,
							{done: true, success: false})),
					_1: _user$project$Analyser_Fixer$sendFixResult(
						{success: false, message: 'Sha1 mismatch. Message is outdated for the corresponding file. Maybe refresh the messages.'})
				};
			} else {
				var fixData = A2(
					_elm_lang$core$List$filterMap,
					function (_p12) {
						var _p13 = _p12;
						var _p14 = _p13._2;
						return _elm_lang$core$Result$toMaybe(
							A2(
								_elm_lang$core$Result$map,
								A2(
									F3(
										function (v0, v1, v2) {
											return {ctor: '_Tuple3', _0: v0, _1: v1, _2: v2};
										}),
									_p13._1,
									_p14),
								A2(
									_elm_lang$core$Result$map,
									_user$project$Analyser_PostProcessing$postProcess(_elm_lang$core$Dict$empty),
									_user$project$Parser_Parser$parse(_p14))));
					},
					_p17);
				var changedFiles = A2(_p18.fixer.fix, fixData, _p18.message.data);
				var _p15 = changedFiles;
				if (_p15.ctor === 'Ok') {
					var _p16 = _p15._0;
					return {
						ctor: '_Tuple2',
						_0: _user$project$Analyser_Fixer$Model(
							_elm_lang$core$Native_Utils.update(
								_p18,
								{
									touchedFiles: A2(_elm_lang$core$List$map, _elm_lang$core$Tuple$first, _p16)
								})),
						_1: _user$project$Analyser_Fixer$storeFiles(_p16)
					};
				} else {
					return {
						ctor: '_Tuple2',
						_0: _user$project$Analyser_Fixer$Model(
							_elm_lang$core$Native_Utils.update(
								_p18,
								{done: true, success: false})),
						_1: _user$project$Analyser_Fixer$sendFixResult(
							{success: false, message: _p15._0})
					};
				}
			}
		} else {
			return {
				ctor: '_Tuple2',
				_0: _user$project$Analyser_Fixer$Model(
					_elm_lang$core$Native_Utils.update(
						_p18,
						{done: true})),
				_1: _user$project$Analyser_Fixer$sendFixResult(
					{
						success: true,
						message: A2(
							_elm_lang$core$Basics_ops['++'],
							'Fixed message: ',
							_user$project$Analyser_Messages_Util$asString(_p18.message.data))
					})
			};
		}
	});

var _user$project$Analyser_ContextLoader$emptyContext = {
	interfaceFiles: {ctor: '[]'},
	sourceFiles: {ctor: '[]'},
	configuration: ''
};
var _user$project$Analyser_ContextLoader$loadContext = _elm_lang$core$Native_Platform.outgoingPort(
	'loadContext',
	function (v) {
		return null;
	});
var _user$project$Analyser_ContextLoader$onLoadedContext = _elm_lang$core$Native_Platform.incomingPort(
	'onLoadedContext',
	A2(
		_elm_lang$core$Json_Decode$andThen,
		function (interfaceFiles) {
			return A2(
				_elm_lang$core$Json_Decode$andThen,
				function (sourceFiles) {
					return A2(
						_elm_lang$core$Json_Decode$andThen,
						function (configuration) {
							return _elm_lang$core$Json_Decode$succeed(
								{interfaceFiles: interfaceFiles, sourceFiles: sourceFiles, configuration: configuration});
						},
						A2(_elm_lang$core$Json_Decode$field, 'configuration', _elm_lang$core$Json_Decode$string));
				},
				A2(
					_elm_lang$core$Json_Decode$field,
					'sourceFiles',
					_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string)));
		},
		A2(
			_elm_lang$core$Json_Decode$field,
			'interfaceFiles',
			_elm_lang$core$Json_Decode$list(
				A2(
					_elm_lang$core$Json_Decode$andThen,
					function (x0) {
						return A2(
							_elm_lang$core$Json_Decode$andThen,
							function (x1) {
								return _elm_lang$core$Json_Decode$succeed(
									{ctor: '_Tuple2', _0: x0, _1: x1});
							},
							A2(_elm_lang$core$Json_Decode$index, 1, _elm_lang$core$Json_Decode$string));
					},
					A2(_elm_lang$core$Json_Decode$index, 0, _elm_lang$core$Json_Decode$string))))));
var _user$project$Analyser_ContextLoader$Context = F3(
	function (a, b, c) {
		return {interfaceFiles: a, sourceFiles: b, configuration: c};
	});

var _user$project$GraphBuilder$edgesInFile = function (file) {
	var _p0 = file.moduleName;
	if (_p0.ctor === 'Just') {
		var imports = A2(
			_elm_lang$core$List$map,
			_iosphere$elm_network_graph$Graph_Node$identifierFromName,
			A2(
				_elm_lang$core$List$map,
				function (_) {
					return _.moduleName;
				},
				file.ast.imports));
		var from = _iosphere$elm_network_graph$Graph_Node$identifierFromName(_p0._0);
		return A2(
			_elm_lang$core$List$map,
			function (to) {
				return A2(_iosphere$elm_network_graph$Graph_Edge$Edge, from, to);
			},
			imports);
	} else {
		return {ctor: '[]'};
	}
};
var _user$project$GraphBuilder$run = F2(
	function (sources, deps) {
		var files = A2(
			_elm_lang$core$List$filterMap,
			A2(_user$project$Analyser_FileContext$create, sources, deps),
			sources);
		var moduleNames = A2(
			_elm_lang$core$List$filterMap,
			function (_) {
				return _.moduleName;
			},
			files);
		var nodes = A2(_elm_lang$core$List$map, _iosphere$elm_network_graph$Graph_Node$fromName, moduleNames);
		var identifiers = _elm_lang$core$Set$fromList(
			A2(
				_elm_lang$core$List$map,
				function (_) {
					return _.identifier;
				},
				nodes));
		var allEdges = _elm_lang$core$List$concat(
			A2(_elm_lang$core$List$map, _user$project$GraphBuilder$edgesInFile, files));
		var edges = A2(_iosphere$elm_network_graph$Graph_Edge$filterForIdentifiers, identifiers, allEdges);
		return A2(_iosphere$elm_network_graph$Graph$init, edges, nodes);
	});

var _user$project$Analyser_CodeBase$mergeLoadedSourceFiles = F2(
	function (newItems, dict) {
		return A3(
			_elm_lang$core$List$foldl,
			function (sourceFile) {
				return A2(
					_elm_lang$core$Dict$insert,
					_elm_lang$core$Tuple$first(sourceFile).path,
					sourceFile);
			},
			dict,
			newItems);
	});
var _user$project$Analyser_CodeBase$sourceFiles = function (_p0) {
	var _p1 = _p0;
	return _elm_lang$core$Dict$values(_p1._0.sources);
};
var _user$project$Analyser_CodeBase$dependencies = function (_p2) {
	var _p3 = _p2;
	return _p3._0.dependencies;
};
var _user$project$Analyser_CodeBase$CodeBase = function (a) {
	return {ctor: 'CodeBase', _0: a};
};
var _user$project$Analyser_CodeBase$init = _user$project$Analyser_CodeBase$CodeBase(
	{
		dependencies: {ctor: '[]'},
		sources: _elm_lang$core$Dict$empty
	});
var _user$project$Analyser_CodeBase$setDependencies = F2(
	function (deps, _p4) {
		var _p5 = _p4;
		return _user$project$Analyser_CodeBase$CodeBase(
			_elm_lang$core$Native_Utils.update(
				_p5._0,
				{dependencies: deps}));
	});
var _user$project$Analyser_CodeBase$addSourceFiles = F2(
	function (sourceFiles, _p6) {
		var _p7 = _p6;
		var _p8 = _p7._0;
		return _user$project$Analyser_CodeBase$CodeBase(
			_elm_lang$core$Native_Utils.update(
				_p8,
				{
					sources: A2(_user$project$Analyser_CodeBase$mergeLoadedSourceFiles, sourceFiles, _p8.sources)
				}));
	});

var _user$project$Analyser$doSendState = function (_p0) {
	var _p1 = _p0;
	var _p2 = _p1._0;
	return {
		ctor: '_Tuple2',
		_0: _p2,
		_1: _elm_lang$core$Platform_Cmd$batch(
			{
				ctor: '::',
				_0: _p1._1,
				_1: {
					ctor: '::',
					_0: _user$project$AnalyserPorts$sendStateAsJson(_p2.state),
					_1: {ctor: '[]'}
				}
			})
	};
};
var _user$project$Analyser$Model = F5(
	function (a, b, c, d, e) {
		return {codeBase: a, context: b, configuration: c, stage: d, state: e};
	});
var _user$project$Analyser$FixerMsg = function (a) {
	return {ctor: 'FixerMsg', _0: a};
};
var _user$project$Analyser$OnFixMessage = function (a) {
	return {ctor: 'OnFixMessage', _0: a};
};
var _user$project$Analyser$Reset = {ctor: 'Reset'};
var _user$project$Analyser$SourceLoadingStageMsg = function (a) {
	return {ctor: 'SourceLoadingStageMsg', _0: a};
};
var _user$project$Analyser$InterfaceLoadingStageMsg = function (a) {
	return {ctor: 'InterfaceLoadingStageMsg', _0: a};
};
var _user$project$Analyser$OnContext = function (a) {
	return {ctor: 'OnContext', _0: a};
};
var _user$project$Analyser$subscriptions = function (model) {
	return _elm_lang$core$Platform_Sub$batch(
		{
			ctor: '::',
			_0: _user$project$AnalyserPorts$onReset(
				_elm_lang$core$Basics$always(_user$project$Analyser$Reset)),
			_1: {
				ctor: '::',
				_0: _user$project$AnalyserPorts$onFixMessage(_user$project$Analyser$OnFixMessage),
				_1: {
					ctor: '::',
					_0: function () {
						var _p3 = model.stage;
						switch (_p3.ctor) {
							case 'ContextLoadingStage':
								return _user$project$Analyser_ContextLoader$onLoadedContext(_user$project$Analyser$OnContext);
							case 'InterfaceLoadingStage':
								return A2(
									_elm_lang$core$Platform_Sub$map,
									_user$project$Analyser$InterfaceLoadingStageMsg,
									_user$project$Analyser_InterfaceLoadingStage$subscriptions(_p3._0));
							case 'SourceLoadingStage':
								return A2(
									_elm_lang$core$Platform_Sub$map,
									_user$project$Analyser$SourceLoadingStageMsg,
									_user$project$Analyser_SourceLoadingStage$subscriptions(_p3._0));
							case 'Finished':
								return _elm_lang$core$Platform_Sub$none;
							default:
								return A2(
									_elm_lang$core$Platform_Sub$map,
									_user$project$Analyser$FixerMsg,
									_user$project$Analyser_Fixer$subscriptions(_p3._0));
						}
					}(),
					_1: {ctor: '[]'}
				}
			}
		});
};
var _user$project$Analyser$Finished = {ctor: 'Finished'};
var _user$project$Analyser$FixerStage = function (a) {
	return {ctor: 'FixerStage', _0: a};
};
var _user$project$Analyser$handleNextStep = function (_p4) {
	var _p5 = _p4;
	var _p11 = _p5._0;
	var _p10 = _p5;
	var _p6 = _p11.stage;
	if (_p6.ctor === 'Finished') {
		var _p7 = _user$project$Analyser_State$nextTask(_p11.state);
		if (_p7.ctor === 'Nothing') {
			return _p10;
		} else {
			var _p9 = _p7._0._0;
			var _p8 = A2(_user$project$Analyser_Fixer$init, _p7._0._1, _p9);
			if (_p8.ctor === 'Nothing') {
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						_p11,
						{state: _p9}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			} else {
				return _user$project$Analyser$doSendState(
					{
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							_p11,
							{
								state: _p8._0._2,
								stage: _user$project$Analyser$FixerStage(_p8._0._0)
							}),
						_1: _elm_lang$core$Platform_Cmd$batch(
							{
								ctor: '::',
								_0: _p5._1,
								_1: {
									ctor: '::',
									_0: A2(_elm_lang$core$Platform_Cmd$map, _user$project$Analyser$FixerMsg, _p8._0._1),
									_1: {ctor: '[]'}
								}
							})
					});
			}
		}
	} else {
		return _p10;
	}
};
var _user$project$Analyser$finishProcess = F3(
	function (newStage, cmds, model) {
		var loadedSourceFiles = _user$project$Analyser_SourceLoadingStage$parsedFiles(newStage);
		var newCodeBase = A2(_user$project$Analyser_CodeBase$addSourceFiles, loadedSourceFiles, model.codeBase);
		var newGraph = A2(
			_user$project$GraphBuilder$run,
			_user$project$Analyser_CodeBase$sourceFiles(newCodeBase),
			_user$project$Analyser_CodeBase$dependencies(newCodeBase));
		var messages = A3(
			_user$project$Inspection$run,
			loadedSourceFiles,
			_user$project$Analyser_CodeBase$dependencies(newCodeBase),
			model.configuration);
		var newState = A2(
			_user$project$Analyser_State$updateGraph,
			newGraph,
			A2(_user$project$Analyser_State$finishWithNewMessages, messages, model.state));
		var newModel = _elm_lang$core$Native_Utils.update(
			model,
			{stage: _user$project$Analyser$Finished, state: newState, codeBase: newCodeBase});
		return _user$project$Analyser$handleNextStep(
			{
				ctor: '_Tuple2',
				_0: newModel,
				_1: _elm_lang$core$Platform_Cmd$batch(
					{
						ctor: '::',
						_0: _user$project$AnalyserPorts$sendMessagesAsStrings(newState.messages),
						_1: {
							ctor: '::',
							_0: _user$project$AnalyserPorts$sendMessagesAsJson(newState.messages),
							_1: {
								ctor: '::',
								_0: _user$project$AnalyserPorts$sendStateAsJson(newState),
								_1: {
									ctor: '::',
									_0: A2(_elm_lang$core$Platform_Cmd$map, _user$project$Analyser$SourceLoadingStageMsg, cmds),
									_1: {ctor: '[]'}
								}
							}
						}
					})
			});
	});
var _user$project$Analyser$SourceLoadingStage = function (a) {
	return {ctor: 'SourceLoadingStage', _0: a};
};
var _user$project$Analyser$startSourceLoading = F2(
	function (files, _p12) {
		var _p13 = _p12;
		var _p14 = function () {
			var _p15 = files;
			if (_p15.ctor === '[]') {
				return {ctor: '_Tuple2', _0: _user$project$Analyser$Finished, _1: _elm_lang$core$Platform_Cmd$none};
			} else {
				return A2(
					_elm_lang$core$Tuple$mapSecond,
					_elm_lang$core$Platform_Cmd$map(_user$project$Analyser$SourceLoadingStageMsg),
					A2(
						_Fresheyeball$elm_tuple_extra$Tuple2$mapFirst,
						_user$project$Analyser$SourceLoadingStage,
						_user$project$Analyser_SourceLoadingStage$init(_p15)));
			}
		}();
		var nextStage = _p14._0;
		var stageCmds = _p14._1;
		return {
			ctor: '_Tuple2',
			_0: _elm_lang$core$Native_Utils.update(
				_p13._0,
				{stage: nextStage}),
			_1: _elm_lang$core$Platform_Cmd$batch(
				{
					ctor: '::',
					_0: stageCmds,
					_1: {
						ctor: '::',
						_0: _p13._1,
						_1: {ctor: '[]'}
					}
				})
		};
	});
var _user$project$Analyser$onFixerMsg = F3(
	function (x, stage, model) {
		var _p16 = A2(
			_Fresheyeball$elm_tuple_extra$Tuple2$mapSecond,
			_elm_lang$core$Platform_Cmd$map(_user$project$Analyser$FixerMsg),
			A2(_user$project$Analyser_Fixer$update, x, stage));
		var newFixerModel = _p16._0;
		var fixerCmds = _p16._1;
		return _user$project$Analyser_Fixer$isDone(newFixerModel) ? (_user$project$Analyser_Fixer$succeeded(newFixerModel) ? A2(
			_user$project$Analyser$startSourceLoading,
			_user$project$Analyser_Fixer$touchedFiles(newFixerModel),
			{ctor: '_Tuple2', _0: model, _1: fixerCmds}) : A2(
			_user$project$Analyser$startSourceLoading,
			_user$project$Analyser_Messages_Util$getFiles(
				_user$project$Analyser_Fixer$message(newFixerModel).data),
			{ctor: '_Tuple2', _0: model, _1: fixerCmds})) : {
			ctor: '_Tuple2',
			_0: _elm_lang$core$Native_Utils.update(
				model,
				{
					stage: _user$project$Analyser$FixerStage(newFixerModel)
				}),
			_1: fixerCmds
		};
	});
var _user$project$Analyser$onSourceLoadingStageMsg = F3(
	function (x, stage, model) {
		var _p17 = A2(_user$project$Analyser_SourceLoadingStage$update, x, stage);
		var newStage = _p17._0;
		var cmds = _p17._1;
		return _user$project$Analyser_SourceLoadingStage$isDone(newStage) ? A3(_user$project$Analyser$finishProcess, newStage, cmds, model) : {
			ctor: '_Tuple2',
			_0: _elm_lang$core$Native_Utils.update(
				model,
				{
					stage: _user$project$Analyser$SourceLoadingStage(newStage)
				}),
			_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$Analyser$SourceLoadingStageMsg, cmds)
		};
	});
var _user$project$Analyser$InterfaceLoadingStage = function (a) {
	return {ctor: 'InterfaceLoadingStage', _0: a};
};
var _user$project$Analyser$onInterfaceLoadingStageMsg = F3(
	function (x, stage, model) {
		var _p18 = A2(_user$project$Analyser_InterfaceLoadingStage$update, x, stage);
		var newStage = _p18._0;
		var cmds = _p18._1;
		return _user$project$Analyser_InterfaceLoadingStage$isDone(newStage) ? A2(
			_user$project$Analyser$startSourceLoading,
			model.context.sourceFiles,
			{
				ctor: '_Tuple2',
				_0: _elm_lang$core$Native_Utils.update(
					model,
					{
						codeBase: A2(
							_user$project$Analyser_CodeBase$setDependencies,
							_user$project$Analyser_InterfaceLoadingStage$getDependencies(newStage),
							model.codeBase)
					}),
				_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$Analyser$InterfaceLoadingStageMsg, cmds)
			}) : {
			ctor: '_Tuple2',
			_0: _elm_lang$core$Native_Utils.update(
				model,
				{
					stage: _user$project$Analyser$InterfaceLoadingStage(newStage)
				}),
			_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$Analyser$InterfaceLoadingStageMsg, cmds)
		};
	});
var _user$project$Analyser$ContextLoadingStage = {ctor: 'ContextLoadingStage'};
var _user$project$Analyser$reset = function (model) {
	return _user$project$Analyser$doSendState(
		{
			ctor: '_Tuple2',
			_0: _elm_lang$core$Native_Utils.update(
				model,
				{stage: _user$project$Analyser$ContextLoadingStage, state: _user$project$Analyser_State$initialState, codeBase: _user$project$Analyser_CodeBase$init}),
			_1: _user$project$Analyser_ContextLoader$loadContext(
				{ctor: '_Tuple0'})
		});
};
var _user$project$Analyser$init = _user$project$Analyser$reset(
	{context: _user$project$Analyser_ContextLoader$emptyContext, stage: _user$project$Analyser$Finished, configuration: _user$project$Analyser_Configuration$defaultConfiguration, codeBase: _user$project$Analyser_CodeBase$init, state: _user$project$Analyser_State$initialState});
var _user$project$Analyser$update = F2(
	function (msg, model) {
		var _p19 = msg;
		switch (_p19.ctor) {
			case 'OnFixMessage':
				return _user$project$Analyser$handleNextStep(
					{
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							model,
							{
								state: A2(_user$project$Analyser_State$addFixToQueue, _p19._0, model.state)
							}),
						_1: _elm_lang$core$Platform_Cmd$none
					});
			case 'Reset':
				return _user$project$Analyser$init;
			case 'OnContext':
				var _p22 = _p19._0;
				var _p20 = _user$project$Analyser_InterfaceLoadingStage$init(_p22.interfaceFiles);
				var stage = _p20._0;
				var cmds = _p20._1;
				var _p21 = _user$project$Analyser_Configuration$fromString(_p22.configuration);
				var configuration = _p21._0;
				var messages = _p21._1;
				return _user$project$Analyser$doSendState(
					{
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							model,
							{
								context: _p22,
								configuration: configuration,
								stage: _user$project$Analyser$InterfaceLoadingStage(stage)
							}),
						_1: _elm_lang$core$Platform_Cmd$batch(
							{
								ctor: '::',
								_0: A2(_elm_lang$core$Platform_Cmd$map, _user$project$Analyser$InterfaceLoadingStageMsg, cmds),
								_1: A2(_elm_lang$core$List$map, _user$project$Logger$info, messages)
							})
					});
			case 'InterfaceLoadingStageMsg':
				var _p23 = model.stage;
				if (_p23.ctor === 'InterfaceLoadingStage') {
					return A3(_user$project$Analyser$onInterfaceLoadingStageMsg, _p19._0, _p23._0, model);
				} else {
					return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
				}
			case 'SourceLoadingStageMsg':
				var _p24 = model.stage;
				if (_p24.ctor === 'SourceLoadingStage') {
					return A3(_user$project$Analyser$onSourceLoadingStageMsg, _p19._0, _p24._0, model);
				} else {
					return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
				}
			default:
				var _p25 = model.stage;
				if (_p25.ctor === 'FixerStage') {
					return A3(_user$project$Analyser$onFixerMsg, _p19._0, _p25._0, model);
				} else {
					return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
				}
		}
	});
var _user$project$Analyser$main = _elm_lang$core$Platform$program(
	{init: _user$project$Analyser$init, update: _user$project$Analyser$update, subscriptions: _user$project$Analyser$subscriptions})();

var Elm = {};
Elm['Analyser'] = Elm['Analyser'] || {};
if (typeof _user$project$Analyser$main !== 'undefined') {
    _user$project$Analyser$main(Elm['Analyser'], 'Analyser', undefined);
}

if (typeof define === "function" && define['amd'])
{
  define([], function() { return Elm; });
  return;
}

if (typeof module === "object")
{
  module['exports'] = Elm;
  return;
}

var globalElm = this['Elm'];
if (typeof globalElm === "undefined")
{
  this['Elm'] = Elm;
  return;
}

for (var publicModule in Elm)
{
  if (publicModule in globalElm)
  {
    throw new Error('There are two Elm modules called `' + publicModule + '` on this page! Rename one of them.');
  }
  globalElm[publicModule] = Elm[publicModule];
}

}).call(this);

