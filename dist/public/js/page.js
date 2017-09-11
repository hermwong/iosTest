(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./public/js/page/index.js":[function(require,module,exports){
'use strict';

var loadScripts = require("./load-scripts");
var polyfillsNeeded = [];

if (!window.Promise) {
  // IE :(
  polyfillsNeeded.push('/js/promise-polyfill.js');
}

if (!window.fetch) {
  polyfillsNeeded.push('/js/fetch.js');
}

// I'm sure user-agent sniffing will be fiiiiine
if (/(iPhone|iPad);/.test(navigator.userAgent)) {
  polyfillsNeeded.push('/js/fastclick.js');
}

loadScripts(polyfillsNeeded, function (_) {
  // Usually defer, but the blocking flag means
  // this happens early
  require('./utils').domReady.then(function (_) {
    var c = new (require('./global-controller'))();
  });
}, function (_) {
  console.error("Failed to load polyfills");
});

},{"./global-controller":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/global-controller.js","./load-scripts":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/load-scripts.js","./utils":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/utils.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/isojs/flags.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var querystring = require('querystring');

var Flags = (function () {
  function Flags() {
    var cookieVal = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
    var urlVal = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

    _classCallCheck(this, Flags);

    this._vals = querystring.parse(urlVal);

    if (!this.has('use-url-flags')) {
      this._vals = querystring.parse(cookieVal);
    }
  }

  _createClass(Flags, [{
    key: 'get',
    value: function get(key) {
      return this._vals[key];
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      return this._vals;
    }
  }, {
    key: 'has',
    value: function has(key) {
      return key in this._vals;
    }
  }]);

  return Flags;
})();

module.exports = Flags;

},{"querystring":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/querystring-es3/index.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/isojs/wiki-display-date.js":[function(require,module,exports){
'use strict';

module.exports = function (date) {
  var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  return date.getFullYear() + '/' + month + '/' + day + ' ' + hours + ':' + minutes;
};

},{}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/browser-cookies/src/browser-cookies.js":[function(require,module,exports){
exports.defaults = {};

exports.set = function(name, value, options) {
  // Retrieve options and defaults
  var opts = options || {};
  var defaults = exports.defaults;

  // Apply default value for unspecified options
  var expires  = opts.expires  || defaults.expires;
  var domain   = opts.domain   || defaults.domain;
  var path     = opts.path     !== undefined ? opts.path     : (defaults.path !== undefined ? defaults.path : '/');
  var secure   = opts.secure   !== undefined ? opts.secure   : defaults.secure;
  var httponly = opts.httponly !== undefined ? opts.httponly : defaults.httponly;

  // Determine cookie expiration date
  // If succesful the result will be a valid Date, otherwise it will be an invalid Date or false(ish)
  var expDate = expires ? new Date(
      // in case expires is an integer, it should specify the number of days till the cookie expires
      typeof expires === 'number' ? new Date().getTime() + (expires * 864e5) :
      // else expires should be either a Date object or in a format recognized by Date.parse()
      expires
  ) : '';

  // Set cookie
  document.cookie = name.replace(/[^+#$&^`|]/g, encodeURIComponent)                // Encode cookie name
  .replace('(', '%28')
  .replace(')', '%29') +
  '=' + value.replace(/[^+#$&/:<-\[\]-}]/g, encodeURIComponent) +                  // Encode cookie value (RFC6265)
  (expDate && expDate.getTime() >= 0 ? ';expires=' + expDate.toUTCString() : '') + // Add expiration date
  (domain   ? ';domain=' + domain : '') +                                          // Add domain
  (path     ? ';path='   + path   : '') +                                          // Add path
  (secure   ? ';secure'           : '') +                                          // Add secure option
  (httponly ? ';httponly'         : '');                                           // Add httponly option
};

exports.get = function(name) {
  var cookies = document.cookie.split(';');

  // Iterate all cookies
  for(var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var cookieLength = cookie.length;

    // Determine separator index ("name=value")
    var separatorIndex = cookie.indexOf('=');

    // IE<11 emits the equal sign when the cookie value is empty
    separatorIndex = separatorIndex < 0 ? cookieLength : separatorIndex;

    var cookie_name = decodeURIComponent(cookie.substring(0, separatorIndex).replace(/^\s+/, ''));

    // Return cookie value if the name matches
    if (cookie_name === name) {
      return decodeURIComponent(cookie.substring(separatorIndex + 1, cookieLength));
    }
  }

  // Return `null` as the cookie was not found
  return null;
};

exports.erase = function(name, options) {
  exports.set(name, '', {
    expires:  -1,
    domain:   options && options.domain,
    path:     options && options.path,
    secure:   0,
    httponly: 0}
  );
};

exports.all = function() {
  var all = {};
  var cookies = document.cookie.split(';');

  // Iterate all cookies
  for(var i = 0; i < cookies.length; i++) {
	  var cookie = cookies[i];
    var cookieLength = cookie.length;

	  // Determine separator index ("name=value")
	  var separatorIndex = cookie.indexOf('=');

	  // IE<11 emits the equal sign when the cookie value is empty
	  separatorIndex = separatorIndex < 0 ? cookieLength : separatorIndex;

    // add the cookie name and value to the `all` object
	  var cookie_name = decodeURIComponent(cookie.substring(0, separatorIndex).replace(/^\s+/, ''));
	  all[cookie_name] = decodeURIComponent(cookie.substring(separatorIndex + 1, cookieLength));
	}

  return all;
};

},{}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/debounce/index.js":[function(require,module,exports){
/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear' 
 * that is a function which will clear the timer to prevent previously scheduled executions. 
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

module.exports = function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  };

  var debounced = function(){
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  debounced.clear = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};

},{}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/events/events.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/dist/cjs/handlebars.runtime.js":[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _import = require('./handlebars/base');

var base = _interopRequireWildcard(_import);

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)

var _SafeString = require('./handlebars/safe-string');

var _SafeString2 = _interopRequireWildcard(_SafeString);

var _Exception = require('./handlebars/exception');

var _Exception2 = _interopRequireWildcard(_Exception);

var _import2 = require('./handlebars/utils');

var Utils = _interopRequireWildcard(_import2);

var _import3 = require('./handlebars/runtime');

var runtime = _interopRequireWildcard(_import3);

var _noConflict = require('./handlebars/no-conflict');

var _noConflict2 = _interopRequireWildcard(_noConflict);

// For compatibility and usage outside of module systems, make the Handlebars object a namespace
function create() {
  var hb = new base.HandlebarsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = _SafeString2['default'];
  hb.Exception = _Exception2['default'];
  hb.Utils = Utils;
  hb.escapeExpression = Utils.escapeExpression;

  hb.VM = runtime;
  hb.template = function (spec) {
    return runtime.template(spec, hb);
  };

  return hb;
}

var inst = create();
inst.create = create;

_noConflict2['default'](inst);

inst['default'] = inst;

exports['default'] = inst;
module.exports = exports['default'];
},{"./handlebars/base":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/dist/cjs/handlebars/base.js","./handlebars/exception":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/dist/cjs/handlebars/exception.js","./handlebars/no-conflict":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/dist/cjs/handlebars/no-conflict.js","./handlebars/runtime":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/dist/cjs/handlebars/runtime.js","./handlebars/safe-string":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/dist/cjs/handlebars/safe-string.js","./handlebars/utils":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/dist/cjs/handlebars/utils.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/dist/cjs/handlebars/base.js":[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;
exports.HandlebarsEnvironment = HandlebarsEnvironment;
exports.createFrame = createFrame;

var _import = require('./utils');

var Utils = _interopRequireWildcard(_import);

var _Exception = require('./exception');

var _Exception2 = _interopRequireWildcard(_Exception);

var VERSION = '3.0.1';
exports.VERSION = VERSION;
var COMPILER_REVISION = 6;

exports.COMPILER_REVISION = COMPILER_REVISION;
var REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '== 1.x.x',
  5: '== 2.0.0-alpha.x',
  6: '>= 2.0.0-beta.1'
};

exports.REVISION_CHANGES = REVISION_CHANGES;
var isArray = Utils.isArray,
    isFunction = Utils.isFunction,
    toString = Utils.toString,
    objectType = '[object Object]';

function HandlebarsEnvironment(helpers, partials) {
  this.helpers = helpers || {};
  this.partials = partials || {};

  registerDefaultHelpers(this);
}

HandlebarsEnvironment.prototype = {
  constructor: HandlebarsEnvironment,

  logger: logger,
  log: log,

  registerHelper: function registerHelper(name, fn) {
    if (toString.call(name) === objectType) {
      if (fn) {
        throw new _Exception2['default']('Arg not supported with multiple helpers');
      }
      Utils.extend(this.helpers, name);
    } else {
      this.helpers[name] = fn;
    }
  },
  unregisterHelper: function unregisterHelper(name) {
    delete this.helpers[name];
  },

  registerPartial: function registerPartial(name, partial) {
    if (toString.call(name) === objectType) {
      Utils.extend(this.partials, name);
    } else {
      if (typeof partial === 'undefined') {
        throw new _Exception2['default']('Attempting to register a partial as undefined');
      }
      this.partials[name] = partial;
    }
  },
  unregisterPartial: function unregisterPartial(name) {
    delete this.partials[name];
  }
};

function registerDefaultHelpers(instance) {
  instance.registerHelper('helperMissing', function () {
    if (arguments.length === 1) {
      // A missing field in a {{foo}} constuct.
      return undefined;
    } else {
      // Someone is actually trying to call something, blow up.
      throw new _Exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
    }
  });

  instance.registerHelper('blockHelperMissing', function (context, options) {
    var inverse = options.inverse,
        fn = options.fn;

    if (context === true) {
      return fn(this);
    } else if (context === false || context == null) {
      return inverse(this);
    } else if (isArray(context)) {
      if (context.length > 0) {
        if (options.ids) {
          options.ids = [options.name];
        }

        return instance.helpers.each(context, options);
      } else {
        return inverse(this);
      }
    } else {
      if (options.data && options.ids) {
        var data = createFrame(options.data);
        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.name);
        options = { data: data };
      }

      return fn(context, options);
    }
  });

  instance.registerHelper('each', function (context, options) {
    if (!options) {
      throw new _Exception2['default']('Must pass iterator to #each');
    }

    var fn = options.fn,
        inverse = options.inverse,
        i = 0,
        ret = '',
        data = undefined,
        contextPath = undefined;

    if (options.data && options.ids) {
      contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
    }

    if (isFunction(context)) {
      context = context.call(this);
    }

    if (options.data) {
      data = createFrame(options.data);
    }

    function execIteration(field, index, last) {
      if (data) {
        data.key = field;
        data.index = index;
        data.first = index === 0;
        data.last = !!last;

        if (contextPath) {
          data.contextPath = contextPath + field;
        }
      }

      ret = ret + fn(context[field], {
        data: data,
        blockParams: Utils.blockParams([context[field], field], [contextPath + field, null])
      });
    }

    if (context && typeof context === 'object') {
      if (isArray(context)) {
        for (var j = context.length; i < j; i++) {
          execIteration(i, i, i === context.length - 1);
        }
      } else {
        var priorKey = undefined;

        for (var key in context) {
          if (context.hasOwnProperty(key)) {
            // We're running the iterations one step out of sync so we can detect
            // the last iteration without have to scan the object twice and create
            // an itermediate keys array.
            if (priorKey) {
              execIteration(priorKey, i - 1);
            }
            priorKey = key;
            i++;
          }
        }
        if (priorKey) {
          execIteration(priorKey, i - 1, true);
        }
      }
    }

    if (i === 0) {
      ret = inverse(this);
    }

    return ret;
  });

  instance.registerHelper('if', function (conditional, options) {
    if (isFunction(conditional)) {
      conditional = conditional.call(this);
    }

    // Default behavior is to render the positive path if the value is truthy and not empty.
    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
    if (!options.hash.includeZero && !conditional || Utils.isEmpty(conditional)) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  });

  instance.registerHelper('unless', function (conditional, options) {
    return instance.helpers['if'].call(this, conditional, { fn: options.inverse, inverse: options.fn, hash: options.hash });
  });

  instance.registerHelper('with', function (context, options) {
    if (isFunction(context)) {
      context = context.call(this);
    }

    var fn = options.fn;

    if (!Utils.isEmpty(context)) {
      if (options.data && options.ids) {
        var data = createFrame(options.data);
        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]);
        options = { data: data };
      }

      return fn(context, options);
    } else {
      return options.inverse(this);
    }
  });

  instance.registerHelper('log', function (message, options) {
    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
    instance.log(level, message);
  });

  instance.registerHelper('lookup', function (obj, field) {
    return obj && obj[field];
  });
}

var logger = {
  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },

  // State enum
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  level: 1,

  // Can be overridden in the host environment
  log: function log(level, message) {
    if (typeof console !== 'undefined' && logger.level <= level) {
      var method = logger.methodMap[level];
      (console[method] || console.log).call(console, message); // eslint-disable-line no-console
    }
  }
};

exports.logger = logger;
var log = logger.log;

exports.log = log;

function createFrame(object) {
  var frame = Utils.extend({}, object);
  frame._parent = object;
  return frame;
}

/* [args, ]options */
},{"./exception":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/dist/cjs/handlebars/exception.js","./utils":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/dist/cjs/handlebars/utils.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/dist/cjs/handlebars/exception.js":[function(require,module,exports){
'use strict';

exports.__esModule = true;

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

function Exception(message, node) {
  var loc = node && node.loc,
      line = undefined,
      column = undefined;
  if (loc) {
    line = loc.start.line;
    column = loc.start.column;

    message += ' - ' + line + ':' + column;
  }

  var tmp = Error.prototype.constructor.call(this, message);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, Exception);
  }

  if (loc) {
    this.lineNumber = line;
    this.column = column;
  }
}

Exception.prototype = new Error();

exports['default'] = Exception;
module.exports = exports['default'];
},{}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/dist/cjs/handlebars/no-conflict.js":[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;
/*global window */

exports['default'] = function (Handlebars) {
  /* istanbul ignore next */
  var root = typeof global !== 'undefined' ? global : window,
      $Handlebars = root.Handlebars;
  /* istanbul ignore next */
  Handlebars.noConflict = function () {
    if (root.Handlebars === Handlebars) {
      root.Handlebars = $Handlebars;
    }
  };
};

module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/dist/cjs/handlebars/runtime.js":[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;
exports.checkRevision = checkRevision;

// TODO: Remove this line and break up compilePartial

exports.template = template;
exports.wrapProgram = wrapProgram;
exports.resolvePartial = resolvePartial;
exports.invokePartial = invokePartial;
exports.noop = noop;

var _import = require('./utils');

var Utils = _interopRequireWildcard(_import);

var _Exception = require('./exception');

var _Exception2 = _interopRequireWildcard(_Exception);

var _COMPILER_REVISION$REVISION_CHANGES$createFrame = require('./base');

function checkRevision(compilerInfo) {
  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
      currentRevision = _COMPILER_REVISION$REVISION_CHANGES$createFrame.COMPILER_REVISION;

  if (compilerRevision !== currentRevision) {
    if (compilerRevision < currentRevision) {
      var runtimeVersions = _COMPILER_REVISION$REVISION_CHANGES$createFrame.REVISION_CHANGES[currentRevision],
          compilerVersions = _COMPILER_REVISION$REVISION_CHANGES$createFrame.REVISION_CHANGES[compilerRevision];
      throw new _Exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
    } else {
      // Use the embedded version info since the runtime doesn't know about this revision yet
      throw new _Exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
    }
  }
}

function template(templateSpec, env) {
  /* istanbul ignore next */
  if (!env) {
    throw new _Exception2['default']('No environment passed to template');
  }
  if (!templateSpec || !templateSpec.main) {
    throw new _Exception2['default']('Unknown template object: ' + typeof templateSpec);
  }

  // Note: Using env.VM references rather than local var references throughout this section to allow
  // for external users to override these as psuedo-supported APIs.
  env.VM.checkRevision(templateSpec.compiler);

  function invokePartialWrapper(partial, context, options) {
    if (options.hash) {
      context = Utils.extend({}, context, options.hash);
    }

    partial = env.VM.resolvePartial.call(this, partial, context, options);
    var result = env.VM.invokePartial.call(this, partial, context, options);

    if (result == null && env.compile) {
      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
      result = options.partials[options.name](context, options);
    }
    if (result != null) {
      if (options.indent) {
        var lines = result.split('\n');
        for (var i = 0, l = lines.length; i < l; i++) {
          if (!lines[i] && i + 1 === l) {
            break;
          }

          lines[i] = options.indent + lines[i];
        }
        result = lines.join('\n');
      }
      return result;
    } else {
      throw new _Exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
    }
  }

  // Just add water
  var container = {
    strict: function strict(obj, name) {
      if (!(name in obj)) {
        throw new _Exception2['default']('"' + name + '" not defined in ' + obj);
      }
      return obj[name];
    },
    lookup: function lookup(depths, name) {
      var len = depths.length;
      for (var i = 0; i < len; i++) {
        if (depths[i] && depths[i][name] != null) {
          return depths[i][name];
        }
      }
    },
    lambda: function lambda(current, context) {
      return typeof current === 'function' ? current.call(context) : current;
    },

    escapeExpression: Utils.escapeExpression,
    invokePartial: invokePartialWrapper,

    fn: function fn(i) {
      return templateSpec[i];
    },

    programs: [],
    program: function program(i, data, declaredBlockParams, blockParams, depths) {
      var programWrapper = this.programs[i],
          fn = this.fn(i);
      if (data || depths || blockParams || declaredBlockParams) {
        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
      } else if (!programWrapper) {
        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
      }
      return programWrapper;
    },

    data: function data(value, depth) {
      while (value && depth--) {
        value = value._parent;
      }
      return value;
    },
    merge: function merge(param, common) {
      var obj = param || common;

      if (param && common && param !== common) {
        obj = Utils.extend({}, common, param);
      }

      return obj;
    },

    noop: env.VM.noop,
    compilerInfo: templateSpec.compiler
  };

  function ret(context) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    var data = options.data;

    ret._setup(options);
    if (!options.partial && templateSpec.useData) {
      data = initData(context, data);
    }
    var depths = undefined,
        blockParams = templateSpec.useBlockParams ? [] : undefined;
    if (templateSpec.useDepths) {
      depths = options.depths ? [context].concat(options.depths) : [context];
    }

    return templateSpec.main.call(container, context, container.helpers, container.partials, data, blockParams, depths);
  }
  ret.isTop = true;

  ret._setup = function (options) {
    if (!options.partial) {
      container.helpers = container.merge(options.helpers, env.helpers);

      if (templateSpec.usePartial) {
        container.partials = container.merge(options.partials, env.partials);
      }
    } else {
      container.helpers = options.helpers;
      container.partials = options.partials;
    }
  };

  ret._child = function (i, data, blockParams, depths) {
    if (templateSpec.useBlockParams && !blockParams) {
      throw new _Exception2['default']('must pass block params');
    }
    if (templateSpec.useDepths && !depths) {
      throw new _Exception2['default']('must pass parent depths');
    }

    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
  };
  return ret;
}

function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
  function prog(context) {
    var options = arguments[1] === undefined ? {} : arguments[1];

    return fn.call(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), depths && [context].concat(depths));
  }
  prog.program = i;
  prog.depth = depths ? depths.length : 0;
  prog.blockParams = declaredBlockParams || 0;
  return prog;
}

function resolvePartial(partial, context, options) {
  if (!partial) {
    partial = options.partials[options.name];
  } else if (!partial.call && !options.name) {
    // This is a dynamic partial that returned a string
    options.name = partial;
    partial = options.partials[partial];
  }
  return partial;
}

function invokePartial(partial, context, options) {
  options.partial = true;

  if (partial === undefined) {
    throw new _Exception2['default']('The partial ' + options.name + ' could not be found');
  } else if (partial instanceof Function) {
    return partial(context, options);
  }
}

function noop() {
  return '';
}

function initData(context, data) {
  if (!data || !('root' in data)) {
    data = data ? _COMPILER_REVISION$REVISION_CHANGES$createFrame.createFrame(data) : {};
    data.root = context;
  }
  return data;
}
},{"./base":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/dist/cjs/handlebars/base.js","./exception":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/dist/cjs/handlebars/exception.js","./utils":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/dist/cjs/handlebars/utils.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/dist/cjs/handlebars/safe-string.js":[function(require,module,exports){
'use strict';

exports.__esModule = true;
// Build out our basic SafeString type
function SafeString(string) {
  this.string = string;
}

SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
  return '' + this.string;
};

exports['default'] = SafeString;
module.exports = exports['default'];
},{}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/dist/cjs/handlebars/utils.js":[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.extend = extend;

// Older IE versions do not directly support indexOf so we must implement our own, sadly.
exports.indexOf = indexOf;
exports.escapeExpression = escapeExpression;
exports.isEmpty = isEmpty;
exports.blockParams = blockParams;
exports.appendContextPath = appendContextPath;
var escape = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#x27;',
  '`': '&#x60;'
};

var badChars = /[&<>"'`]/g,
    possible = /[&<>"'`]/;

function escapeChar(chr) {
  return escape[chr];
}

function extend(obj /* , ...source */) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }

  return obj;
}

var toString = Object.prototype.toString;

exports.toString = toString;
// Sourced from lodash
// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
/*eslint-disable func-style, no-var */
var isFunction = function isFunction(value) {
  return typeof value === 'function';
};
// fallback for older versions of Chrome and Safari
/* istanbul ignore next */
if (isFunction(/x/)) {
  exports.isFunction = isFunction = function (value) {
    return typeof value === 'function' && toString.call(value) === '[object Function]';
  };
}
var isFunction;
exports.isFunction = isFunction;
/*eslint-enable func-style, no-var */

/* istanbul ignore next */
var isArray = Array.isArray || function (value) {
  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
};exports.isArray = isArray;

function indexOf(array, value) {
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i] === value) {
      return i;
    }
  }
  return -1;
}

function escapeExpression(string) {
  if (typeof string !== 'string') {
    // don't escape SafeStrings, since they're already safe
    if (string && string.toHTML) {
      return string.toHTML();
    } else if (string == null) {
      return '';
    } else if (!string) {
      return string + '';
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = '' + string;
  }

  if (!possible.test(string)) {
    return string;
  }
  return string.replace(badChars, escapeChar);
}

function isEmpty(value) {
  if (!value && value !== 0) {
    return true;
  } else if (isArray(value) && value.length === 0) {
    return true;
  } else {
    return false;
  }
}

function blockParams(params, ids) {
  params.path = ids;
  return params;
}

function appendContextPath(contextPath, id) {
  return (contextPath ? contextPath + '.' : '') + id;
}
},{}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/runtime.js":[function(require,module,exports){
// Create a simple path alias to allow browserify to resolve
// the runtime on a supported path.
module.exports = require('./dist/cjs/handlebars.runtime')['default'];

},{"./dist/cjs/handlebars.runtime":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/dist/cjs/handlebars.runtime.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/hbsfy/runtime.js":[function(require,module,exports){
module.exports = require("handlebars/runtime")["default"];

},{"handlebars/runtime":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/handlebars/runtime.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/querystring-es3/decode.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/querystring-es3/encode.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/querystring-es3/index.js":[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/querystring-es3/decode.js","./encode":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/querystring-es3/encode.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/regenerator-runtime/runtime.js":[function(require,module,exports){
(function (process,global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function(arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value instanceof AwaitArgument) {
          return Promise.resolve(value.arg).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = arg;

        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp[toStringTagSymbol] = "Generator";

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/process/browser.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/regenerator/runtime.js":[function(require,module,exports){
console.warn(
  "The regenerator/runtime module is deprecated; " +
    "please import regenerator-runtime/runtime instead."
);

module.exports = require("regenerator-runtime/runtime");

},{"regenerator-runtime/runtime":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/regenerator-runtime/runtime.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/srcset/srcset.js":[function(require,module,exports){
/*global window */
(function () {
	'use strict';
	var srcset = {};
	var reInt = /^\d+$/;

	function deepUnique(arr) {
		return arr.sort().filter(function (el, i) {
			return JSON.stringify(el) !== JSON.stringify(arr[i - 1]);
		});
	}

	function unique(arr) {
		return arr.filter(function (el, i) {
			return arr.indexOf(el) === i;
		});
	}

	srcset.parse = function (str) {
		return deepUnique(str.split(',').map(function (el) {
			var ret = {};

			el.trim().split(/\s+/).forEach(function (el, i) {
				if (i === 0) {
					return ret.url = el;
				}

				var value = el.substring(0, el.length - 1);
				var postfix = el[el.length - 1];
				var intVal = parseInt(value, 10);
				var floatVal = parseFloat(value);

				if (postfix === 'w' && reInt.test(value)) {
					ret.width = intVal;
				} else if (postfix === 'h' && reInt.test(value)) {
					ret.height = intVal;
				} else if (postfix === 'x' && !isNaN(floatVal)) {
					ret.density = floatVal;
				} else {
					throw new Error('Invalid srcset descriptor: ' + el + '.');
				}
			});

			return ret;
		}));
	}

	srcset.stringify = function (arr) {
		return unique(arr.map(function (el) {
			if (!el.url) {
				throw new Error('URL is required.');
			}

			var ret = [el.url];

			if (el.width) {
				ret.push(el.width + 'w');
			}

			if (el.height) {
				ret.push(el.height + 'h');
			}

			if (el.density) {
				ret.push(el.density + 'x');
			}

			return ret.join(' ');
		})).join(', ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = srcset;
	} else {
		window.srcset = srcset;
	}
})();

},{}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/article-controller.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var debounce = require('debounce');
var wikipedia = require('../shared/wikipedia');
var storage = require('../shared/storage');
var wikiDisplayDate = require('../../../isojs/wiki-display-date');
var flags = require('./flags').parse();

var cacheCapable = 'caches' in window && navigator.serviceWorker.controller;
var backgroundSyncCapable = 'serviceWorker' in navigator && navigator.serviceWorker.controller && 'sync' in ServiceWorkerRegistration.prototype && 'getTags' in SyncManager.prototype && self.Set && Array.from;

var WIKI_RE = /^\/wiki\/(.+)/;

var ArticleController = (function () {
  function ArticleController() {
    var _this = this;

    _classCallCheck(this, ArticleController);

    // ui
    this._articleView = new (require('./views/article'))();
    this._toastsView = require('./views/toasts');

    // view events
    this._articleView.on('cacheChange', function (e) {
      return _this._onCacheChange(e);
    });
    this._articleView.on('backgroundLoadRequest', function (_) {
      return _this._onBackgroundLoadRequest();
    });

    // state
    this._article = null;
    this._urlArticleName = WIKI_RE.exec(location.pathname)[1];

    // setup
    if (this._articleView.serverRendered) {
      this._articleView.updateCachingAbility(cacheCapable);
    } else {
      this._loadArticle(this._urlArticleName);
    }

    if (flags.get('auto-cache-article') && cacheCapable) {
      // bit hacky, shouldn't be calling an event handler like this
      this._onCacheChange({ value: true });
    }

    if (flags.get('push-state-updates')) {
      document.addEventListener('click', function (event) {
        var link = event.target.closest('a');
        if (!link) return;

        var url = new URL(link.href);
        if (url.origin == location.origin && url.pathname.includes('/wiki/')) {
          event.preventDefault();
          _this._pushStateUpdate(url.pathname);
        }
      });
    }

    if (flags.get('sw-stream-url')) {
      document.addEventListener('click', function (event) {
        var link = event.target.closest('a');
        if (!link) return;

        var url = new URL(link.href);
        if (url.origin == location.origin && url.pathname.includes('/wiki/')) {
          event.preventDefault();
          url.searchParams.set('sw-stream', '');
          location.href = url;
        }
      });
    }
  }

  _createClass(ArticleController, [{
    key: '_pushStateUpdate',
    value: function _pushStateUpdate(pathname) {
      this._articleView.updateContent('');
      this._articleView.updateMeta();
      this._urlArticleName = WIKI_RE.exec(pathname)[1];
      history.pushState({}, '', pathname);
      this._loadArticle(this._urlArticleName);
    }
  }, {
    key: '_onBackgroundLoadRequest',
    value: function _onBackgroundLoadRequest() {
      var articleQueue, reg;
      return regeneratorRuntime.async(function _onBackgroundLoadRequest$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
              Notification.requestPermission(function (permission) {
                if (permission == 'granted') {
                  resolve();
                } else {
                  reject(Error("Notification permission denied"));
                }
              });
            }));

          case 2:
            context$2$0.t0 = Set;
            context$2$0.next = 5;
            return regeneratorRuntime.awrap(storage.get('to-bg-cache'));

          case 5:
            context$2$0.t1 = context$2$0.sent;

            if (context$2$0.t1) {
              context$2$0.next = 8;
              break;
            }

            context$2$0.t1 = [];

          case 8:
            context$2$0.t2 = context$2$0.t1;
            articleQueue = new context$2$0.t0(context$2$0.t2);

            articleQueue.add(this._urlArticleName);

            context$2$0.next = 13;
            return regeneratorRuntime.awrap(Promise.all([storage.set('to-bg-cache', Array.from(articleQueue)), storage.set('devicePixelRatio', self.devicePixelRatio)]));

          case 13:
            context$2$0.next = 15;
            return regeneratorRuntime.awrap(navigator.serviceWorker.ready);

          case 15:
            reg = context$2$0.sent;
            context$2$0.next = 18;
            return regeneratorRuntime.awrap(reg.sync.register('bg-cache'));

          case 18:

            this._articleView.confirmBackgroundLoad();

          case 19:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: '_onCacheChange',
    value: function _onCacheChange(_ref) {
      var value = _ref.value;
      return regeneratorRuntime.async(function _onCacheChange$(context$2$0) {
        var _this2 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (this._article) {
              context$2$0.next = 4;
              break;
            }

            context$2$0.next = 3;
            return regeneratorRuntime.awrap(wikipedia.article(this._urlArticleName));

          case 3:
            this._article = context$2$0.sent;

          case 4:
            if (!value) {
              context$2$0.next = 6;
              break;
            }

            return context$2$0.abrupt('return', this._article.cache()['catch'](function (err) {
              return _this2._showError(Error("Caching failed"));
            }));

          case 6:
            this._article.uncache();

          case 7:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: '_showError',
    value: function _showError(err) {
      this._toastsView.show(err.message, {
        duration: 3000
      });
    }
  }, {
    key: '_displayArticle',
    value: function _displayArticle(article) {
      var url, data;
      return regeneratorRuntime.async(function _displayArticle$(context$2$0) {
        var _this3 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            url = new URL(location);

            this._article = article;

            if (flags.get('prevent-streaming')) {
              article.getHtml().then(function (html) {
                return _this3._articleView.updateContent(html);
              });
            } else {
              this._articleView.streamContent(article);
            }
            context$2$0.next = 5;
            return regeneratorRuntime.awrap(article.meta.then(function (data) {
              return processData(article, data);
            }));

          case 5:
            data = context$2$0.sent;

            document.title = data.title + ' - Offline Wikipedia';
            url.pathname = url.pathname.replace(/\/wiki\/.+$/, '/wiki/' + data.urlId);
            history.replaceState({}, document.title, url);
            context$2$0.t0 = this._articleView;
            context$2$0.next = 12;
            return regeneratorRuntime.awrap(data);

          case 12:
            context$2$0.t1 = context$2$0.sent;
            context$2$0.t0.updateMeta.call(context$2$0.t0, context$2$0.t1);

          case 14:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: '_offerBackgroundLoad',
    value: function _offerBackgroundLoad() {
      var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref2$loadFailed = _ref2.loadFailed;
      var loadFailed = _ref2$loadFailed === undefined ? false : _ref2$loadFailed;

      if (!this._articleView.startedContentRender) {
        this._articleView.offerBackgroundLoad({ loadFailed: loadFailed });
      }
    }
  }, {
    key: '_loadArticle',
    value: function _loadArticle(name) {
      var articleCachedPromise, articleLivePromise, offerBackgroundLoadTimeout, showedCachedContent, cachedArticle, liveArticle;
      return regeneratorRuntime.async(function _loadArticle$(context$2$0) {
        var _this4 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            this._articleView.startLoading();
            articleCachedPromise = wikipedia.article(name, { fromCache: true });
            articleLivePromise = wikipedia.article(name);
            offerBackgroundLoadTimeout = setTimeout(function (_) {
              if (backgroundSyncCapable) {
                _this4._offerBackgroundLoad();
              }
            }, 3000);
            showedCachedContent = false;
            context$2$0.prev = 5;
            context$2$0.next = 8;
            return regeneratorRuntime.awrap(articleCachedPromise);

          case 8:
            cachedArticle = context$2$0.sent;
            context$2$0.next = 11;
            return regeneratorRuntime.awrap(this._displayArticle(cachedArticle));

          case 11:
            showedCachedContent = true;
            console.log('displayed from cache');
            clearTimeout(offerBackgroundLoadTimeout);
            context$2$0.next = 18;
            break;

          case 16:
            context$2$0.prev = 16;
            context$2$0.t0 = context$2$0['catch'](5);

          case 18:
            context$2$0.prev = 18;
            context$2$0.next = 21;
            return regeneratorRuntime.awrap(articleLivePromise);

          case 21:
            liveArticle = context$2$0.sent;

            if (!showedCachedContent) {
              context$2$0.next = 35;
              break;
            }

            context$2$0.next = 25;
            return regeneratorRuntime.awrap(cachedArticle.meta);

          case 25:
            context$2$0.t1 = context$2$0.sent.updated.valueOf();
            context$2$0.next = 28;
            return regeneratorRuntime.awrap(liveArticle.meta);

          case 28:
            context$2$0.t2 = context$2$0.sent.updated.valueOf();

            if (!(context$2$0.t1 == context$2$0.t2)) {
              context$2$0.next = 32;
              break;
            }

            console.log('cached version is up to date');
            return context$2$0.abrupt('return');

          case 32:
            console.log('found update, caching');
            context$2$0.next = 35;
            return regeneratorRuntime.awrap(liveArticle.cache());

          case 35:
            context$2$0.t3 = regeneratorRuntime;
            context$2$0.t4 = this;
            context$2$0.next = 39;
            return regeneratorRuntime.awrap(articleLivePromise);

          case 39:
            context$2$0.t5 = context$2$0.sent;
            context$2$0.t6 = context$2$0.t4._displayArticle.call(context$2$0.t4, context$2$0.t5);
            context$2$0.next = 43;
            return context$2$0.t3.awrap.call(context$2$0.t3, context$2$0.t6);

          case 43:
            clearTimeout(offerBackgroundLoadTimeout);
            console.log('displayed from live');
            context$2$0.next = 50;
            break;

          case 47:
            context$2$0.prev = 47;
            context$2$0.t7 = context$2$0['catch'](18);

            if (!showedCachedContent) {
              this._showError(Error("Failed to load article"));
              this._articleView.stopLoading();
              clearTimeout(offerBackgroundLoadTimeout);
              if (backgroundSyncCapable) {
                this._offerBackgroundLoad({ loadFailed: true });
              }
            }

          case 50:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[5, 16], [18, 47]]);
    }
  }]);

  return ArticleController;
})();

function processData(article, articleData) {
  var data;
  return regeneratorRuntime.async(function processData$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        data = Object.create(articleData);

        if (!cacheCapable) {
          context$1$0.next = 6;
          break;
        }

        data.cacheCapable = true;
        context$1$0.next = 5;
        return regeneratorRuntime.awrap(article.isCached());

      case 5:
        data.cached = context$1$0.sent;

      case 6:

        data.updated = wikiDisplayDate(data.updated);
        return context$1$0.abrupt('return', data);

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

module.exports = ArticleController;

// TODO: handle denied permission requests

},{"../../../isojs/wiki-display-date":"/Users/hermanw/Documents/hermwong/offline-wikipedia/isojs/wiki-display-date.js","../shared/storage":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/shared/storage.js","../shared/wikipedia":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/shared/wikipedia.js","./flags":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/flags.js","./views/article":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/article.js","./views/toasts":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/toasts.js","debounce":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/debounce/index.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/flags-controller.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Flags = require('./flags');
var utils = require('./utils');

var FlagsController = (function () {
  function FlagsController() {
    var _this = this;

    _classCallCheck(this, FlagsController);

    // ui
    this._toastsView = require('./views/toasts');
    this._flagsForm = document.querySelector('.flags-form');
    this._flagsQuery = document.querySelector('.flags-query');
    this._flagsScript = document.querySelector('.flags-webpagetest-script');

    // view events
    this._flagsForm.addEventListener('submit', function (e) {
      return _this._onFlagsSubmit(e);
    });
    this._flagsForm.addEventListener('change', function (e) {
      return _this._updateFlagsOutput();
    });

    this._updateFlagsOutput();
  }

  _createClass(FlagsController, [{
    key: '_getFlags',
    value: function _getFlags() {
      var checkboxes = utils.toArray(this._flagsForm.querySelectorAll('input[type=checkbox]'));
      var flags = new Flags();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = checkboxes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var checkbox = _step.value;

          flags.set(checkbox.name, checkbox.checked ? 1 : 0);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return flags;
    }
  }, {
    key: '_updateFlagsOutput',
    value: function _updateFlagsOutput(event) {
      var flags = this._getFlags();
      this._flagsQuery.textContent = flags.getQuerystring();
      this._flagsScript.textContent = flags.getWebPageTestScript();
    }
  }, {
    key: '_onFlagsSubmit',
    value: function _onFlagsSubmit(event) {
      event.preventDefault();
      this._getFlags().setCookie();
      this._toastsView.show("Flags updated", { duration: 2000 });
    }
  }]);

  return FlagsController;
})();

module.exports = FlagsController;

},{"./flags":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/flags.js","./utils":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/utils.js","./views/toasts":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/toasts.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/flags.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var querystring = require('querystring');
var cookies = require('browser-cookies');

var Flags = (function (_require) {
  _inherits(Flags, _require);

  function Flags() {
    _classCallCheck(this, Flags);

    _get(Object.getPrototypeOf(Flags.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Flags, [{
    key: 'set',
    value: function set(key, val) {
      this._vals[key] = val;
    }
  }, {
    key: 'stringify',
    value: function stringify() {
      var _this = this;

      var obj = {};

      Object.keys(this._vals).forEach(function (key) {
        if (key == 'use-url-flags') return;
        if (_this._vals[key]) obj[key] = 1;
      });

      return querystring.stringify(obj);
    }
  }, {
    key: 'getQuerystring',
    value: function getQuerystring() {
      return '?' + 'use-url-flags&' + this.stringify();
    }
  }, {
    key: 'getWebPageTestScript',
    value: function getWebPageTestScript() {
      return 'setCookie\thttps://wiki-offline.jakearchibald.com/\tflags=' + this.stringify() + '\nnavigate\thttps://wiki-offline.jakearchibald.com/wiki/Hulk_Hogan';
    }
  }, {
    key: 'setCookie',
    value: function setCookie() {
      cookies.set('flags', this.stringify(), { expires: 365 });
    }
  }], [{
    key: 'parse',
    value: function parse() {
      return new Flags(cookies.get('flags') || '', location.search);
    }
  }]);

  return Flags;
})(require('../../../isojs/flags'));

module.exports = Flags;

},{"../../../isojs/flags":"/Users/hermanw/Documents/hermwong/offline-wikipedia/isojs/flags.js","browser-cookies":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/browser-cookies/src/browser-cookies.js","querystring":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/querystring-es3/index.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/global-controller.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('regenerator/runtime');

var debounce = require('debounce');
var wikipedia = require('../shared/wikipedia');
var flags = require('./flags').parse();

var GlobalController = (function () {
  function GlobalController() {
    var _this = this;

    _classCallCheck(this, GlobalController);

    // ui
    this._toolbarView = new (require('./views/toolbar'))();
    this._searchResultsView = new (require('./views/search-results'))();
    this._toastsView = require('./views/toasts');

    // view events
    this._toolbarView.on('searchInput', function (event) {
      if (!event.value) {
        _this._onSearchInput(event);
        return;
      }
      debouncedSearch(event);
    });

    // state
    this._setupServiceWorker();
    this._lastSearchId = 0;

    // setup
    var debouncedSearch = debounce(function (e) {
      return _this._onSearchInput(e);
    }, 150);

    // router
    if (location.pathname == '/') {
      new (require('./home-controller'))();
    } else if (/^\/wiki\/[^\/]+/.test(location.pathname)) {
      new (require('./article-controller'))();
    } else if (location.pathname == '/flags') {
      new (require('./flags-controller'))();
    }
  }

  _createClass(GlobalController, [{
    key: '_setupServiceWorker',
    value: function _setupServiceWorker() {
      var reg, refreshing;
      return regeneratorRuntime.async(function _setupServiceWorker$(context$2$0) {
        var _this2 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if ('serviceWorker' in navigator) {
              context$2$0.next = 2;
              break;
            }

            return context$2$0.abrupt('return');

          case 2:
            if (!flags.get('prevent-sw')) {
              context$2$0.next = 12;
              break;
            }

            context$2$0.next = 5;
            return regeneratorRuntime.awrap(navigator.serviceWorker.getRegistration());

          case 5:
            reg = context$2$0.sent;

            if (reg) {
              context$2$0.next = 9;
              break;
            }

            console.log('ServiceWorker prevented due to flags');
            return context$2$0.abrupt('return');

          case 9:
            console.log('ServiceWorker found & unregistered - refresh to load without');
            reg.unregister();
            return context$2$0.abrupt('return');

          case 12:
            context$2$0.next = 14;
            return regeneratorRuntime.awrap(navigator.serviceWorker.register('/sw.js'));

          case 14:
            reg = context$2$0.sent;

            reg.addEventListener('updatefound', function (_) {
              return _this2._onSwUpdateFound(reg);
            });

            navigator.serviceWorker.addEventListener('controllerchange', function (_) {
              if (refreshing) return;
              window.location.reload();
              refreshing = true;
            });
            if (reg.waiting) this._onSwUpdateReady();

          case 18:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: '_onSwUpdateReady',
    value: function _onSwUpdateReady() {
      var toast, newWorker, answer;
      return regeneratorRuntime.async(function _onSwUpdateReady$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            toast = this._toastsView.show("Update available", {
              buttons: ['reload', 'dismiss']
            });
            context$2$0.next = 3;
            return regeneratorRuntime.awrap(navigator.serviceWorker.getRegistration());

          case 3:
            newWorker = context$2$0.sent.waiting;
            context$2$0.next = 6;
            return regeneratorRuntime.awrap(toast.answer);

          case 6:
            answer = context$2$0.sent;

            if (answer == 'reload') {
              newWorker.postMessage('skipWaiting');
            }

          case 8:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: '_onSwUpdateFound',
    value: function _onSwUpdateFound(registration) {
      var _this3 = this;

      var newWorker = registration.installing;

      registration.installing.addEventListener('statechange', function callee$2$0(_) {
        return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              if (!(newWorker.state == 'activated' && !navigator.serviceWorker.controller)) {
                context$3$0.next = 3;
                break;
              }

              this._toastsView.show("Ready to work offline", {
                duration: 5000
              });
              return context$3$0.abrupt('return');

            case 3:

              if (newWorker.state == 'installed' && navigator.serviceWorker.controller) {
                this._onSwUpdateReady();
              }

            case 4:
            case 'end':
              return context$3$0.stop();
          }
        }, null, _this3);
      });
    }
  }, {
    key: '_onSearchInput',
    value: function _onSearchInput(_ref) {
      var value = _ref.value;
      var id, results;
      return regeneratorRuntime.async(function _onSearchInput$(context$2$0) {
        var _this4 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            id = ++this._lastSearchId;

            if (value) {
              context$2$0.next = 4;
              break;
            }

            this._searchResultsView.hide();
            return context$2$0.abrupt('return');

          case 4:
            context$2$0.prev = 4;
            context$2$0.next = 7;
            return regeneratorRuntime.awrap(wikipedia.search(value));

          case 7:
            context$2$0.t0 = context$2$0.sent;
            results = {
              results: context$2$0.t0
            };
            context$2$0.next = 14;
            break;

          case 11:
            context$2$0.prev = 11;
            context$2$0.t1 = context$2$0['catch'](4);

            results = { err: "Search failed" };

          case 14:

            requestAnimationFrame(function (_) {
              if (id != _this4._lastSearchId) return;
              _this4._searchResultsView.update(results);
            });

          case 15:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[4, 11]]);
    }
  }]);

  return GlobalController;
})();

module.exports = GlobalController;

// the very first activation!
// tell the user stuff works offline

},{"../shared/wikipedia":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/shared/wikipedia.js","./article-controller":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/article-controller.js","./flags":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/flags.js","./flags-controller":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/flags-controller.js","./home-controller":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/home-controller.js","./views/search-results":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/search-results.js","./views/toasts":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/toasts.js","./views/toolbar":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/toolbar.js","debounce":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/debounce/index.js","regenerator/runtime":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/regenerator/runtime.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/home-controller.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var wikipedia = require('../shared/wikipedia');

var cacheCapable = ('caches' in window);

var HomeController = (function () {
  function HomeController() {
    var _this = this;

    _classCallCheck(this, HomeController);

    // ui
    this._cachedArticlesView = new (require('./views/cached-articles'))();
    this._toastsView = require('./views/toasts');

    // view events
    this._cachedArticlesView.on('delete', function (e) {
      return _this._onDeleteCachedArticle(e);
    });

    this._showCachedArticles();
  }

  _createClass(HomeController, [{
    key: '_onDeleteCachedArticle',
    value: function _onDeleteCachedArticle(_ref) {
      var id = _ref.id;
      return regeneratorRuntime.async(function _onDeleteCachedArticle$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return regeneratorRuntime.awrap(wikipedia.uncache(id));

          case 2:
            this._showCachedArticles();

          case 3:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: '_showCachedArticles',
    value: function _showCachedArticles() {
      return regeneratorRuntime.async(function _showCachedArticles$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.t0 = this._cachedArticlesView;
            context$2$0.next = 3;
            return regeneratorRuntime.awrap(wikipedia.getCachedArticleData());

          case 3:
            context$2$0.t1 = context$2$0.sent;
            context$2$0.t2 = cacheCapable;
            context$2$0.t3 = {
              items: context$2$0.t1,
              cacheCapable: context$2$0.t2
            };
            context$2$0.t0.update.call(context$2$0.t0, context$2$0.t3);

          case 7:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }]);

  return HomeController;
})();

module.exports = HomeController;

},{"../shared/wikipedia":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/shared/wikipedia.js","./views/cached-articles":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/cached-articles.js","./views/toasts":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/toasts.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/load-scripts.js":[function(require,module,exports){
"use strict";

// This is in its own file rather than utils.js because it's used for loading polyfills,
// and promises, is one of the things that gets polyfilled, hence the callbacks
module.exports = function loadScript(urls, yeyCallback, neyCallback) {
  var count = urls.length;
  var errored = false;

  if (urls.length == 0) return yeyCallback();

  urls.forEach(function (url) {
    var script = document.createElement('script');
    script.onload = function () {
      if (errored) return;
      if (! --count) yeyCallback();
    };
    script.onerror = function () {
      if (errored) return;
      neyCallback();
      errored = true;
    };
    script.src = url;
    document.head.insertBefore(script, document.head.firstChild);
  });
};

},{}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/utils.js":[function(require,module,exports){
"use strict";

exports.toArray = function toArray(obj) {
  return Array.prototype.slice.apply(obj);
};

exports.domReady = new Promise(function (resolve) {
  function checkState() {
    if (document.readyState != 'loading') {
      resolve();
    }
  }
  document.addEventListener('readystatechange', checkState);
  checkState();
});

exports.strToEl = (function () {
  var tmpEl = document.createElement('div');
  return function (str) {
    var r;
    tmpEl.innerHTML = str;
    r = tmpEl.children[0];
    while (tmpEl.firstChild) {
      tmpEl.removeChild(tmpEl.firstChild);
    }
    return r;
  };
})();

function transitionClassFunc() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$removeClass = _ref.removeClass;
  var removeClass = _ref$removeClass === undefined ? false : _ref$removeClass;

  return function (el) {
    var className = arguments.length <= 1 || arguments[1] === undefined ? 'active' : arguments[1];
    var transitionClass = arguments.length <= 2 || arguments[2] === undefined ? 'transition' : arguments[2];

    if (removeClass) {
      if (!el.classList.contains(className)) return Promise.resolve();
    } else {
      if (el.classList.contains(className)) return Promise.resolve();
    }

    return new Promise(function (resolve) {
      var listener = function listener(event) {
        if (event.target != el) return;
        el.removeEventListener('webkitTransitionEnd', listener);
        el.removeEventListener('transitionend', listener);
        el.classList.remove(transitionClass);
        resolve();
      };

      el.classList.add(transitionClass);

      requestAnimationFrame(function (_) {
        el.addEventListener('webkitTransitionEnd', listener);
        el.addEventListener('transitionend', listener);
        el.classList[removeClass ? 'remove' : 'add'](className);
      });
    });
  };
}

exports.transitionToClass = transitionClassFunc();
exports.transitionFromClass = transitionClassFunc({ removeClass: true });

exports.closest = function (el, selector) {
  if (el.closest) {
    return el.closest(selector);
  }

  var matches = el.matches || el.msMatchesSelector;

  do {
    if (el.nodeType != 1) continue;
    if (matches.call(el, selector)) return el;
  } while (el = el.parentNode);

  return undefined;
};

},{}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/article.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var contentTemplate = require('./templates/article-content.hbs');
var backgroundLoadTemplate = require('./templates/background-load.hbs');
var headerTemplate = require('../../../../shared-templates/article-header.hbs');
var Spinner = require('./spinner');
var utils = require('../utils');

var Article = (function (_require$EventEmitter) {
  _inherits(Article, _require$EventEmitter);

  function Article() {
    var _this = this;

    _classCallCheck(this, Article);

    _get(Object.getPrototypeOf(Article.prototype), 'constructor', this).call(this);
    this.container = document.querySelector('.article-container');
    this._content = this.container.querySelector('.article-content');
    this._backgroundLoadOffer = this.container.querySelector('.background-load-offer');
    this._header = this.container.querySelector('.article-header');
    this._spinner = new Spinner();
    this.startedContentRender = false;
    this.container.appendChild(this._spinner.container);
    this.serverRendered = !!document.querySelector('.content.server-rendered');

    this._header.addEventListener('change', function (event) {
      if (event.target.name == 'cache') _this.emit('cacheChange', { value: event.target.checked });
    });

    this._backgroundLoadOffer.addEventListener('click', function (event) {
      // we're assuming there's only one button in here right now.
      // yes I know that's bad
      if (utils.closest(event.target, 'button')) {
        _this.emit('backgroundLoadRequest');
      }
    });

    this._content.addEventListener('click', function (event) {
      var heading = utils.closest(event.target, 'h2');
      if (heading) _this._onHeadingClick(heading);
    });
  }

  _createClass(Article, [{
    key: '_onHeadingClick',
    value: function _onHeadingClick(heading) {
      var newDisplayVal = '';

      if (heading.classList.contains('active')) {
        heading.classList.remove('active');
      } else {
        heading.classList.add('active');
        newDisplayVal = 'block';
      }

      var element = heading;
      while ((element = element.nextElementSibling) && !element.matches('h2')) {
        element.style.display = newDisplayVal;
      }
    }
  }, {
    key: 'updateContent',
    value: function updateContent(articleHtml) {
      this.stopLoading();
      this.startedContentRender = true;
      this._hideBackgroundLoadUI();
      this._content.innerHTML = contentTemplate({
        content: articleHtml
      });
    }

    // this is a super hacky experiment
  }, {
    key: 'streamContent',
    value: function streamContent(article) {
      var response, fullContent, buffer, reader, decoder, result, awaitingInitialFlush;
      return regeneratorRuntime.async(function streamContent$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return regeneratorRuntime.awrap(article.getHtmlResponse());

          case 2:
            response = context$2$0.sent;

            if (response.body) {
              context$2$0.next = 10;
              break;
            }

            context$2$0.t0 = this;
            context$2$0.next = 7;
            return regeneratorRuntime.awrap(article.getHtml());

          case 7:
            context$2$0.t1 = context$2$0.sent;
            context$2$0.t0.updateContent.call(context$2$0.t0, context$2$0.t1);
            return context$2$0.abrupt('return');

          case 10:
            fullContent = '';
            buffer = '';
            reader = response.body.getReader();
            decoder = new TextDecoder();
            awaitingInitialFlush = true;

          case 15:
            if (!true) {
              context$2$0.next = 25;
              break;
            }

            context$2$0.next = 18;
            return regeneratorRuntime.awrap(reader.read());

          case 18:
            result = context$2$0.sent;

            buffer += decoder.decode(result.value || new Uint8Array(), {
              stream: !result.done
            });

            // so inefficient, but we don't have a better way to stream html
            if (result.done || awaitingInitialFlush && buffer.length > 9000) {
              this.stopLoading();
              this.startedContentRender = true;
              this._hideBackgroundLoadUI();
              fullContent += buffer;
              this._content.innerHTML = '<div id="content_wrapper" class="content card-content">' + fullContent + '</div>';
              awaitingInitialFlush = false;
              buffer = '';
            }

            if (!result.done) {
              context$2$0.next = 23;
              break;
            }

            return context$2$0.abrupt('break', 25);

          case 23:
            context$2$0.next = 15;
            break;

          case 25:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'offerBackgroundLoad',
    value: function offerBackgroundLoad() {
      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref$loadFailed = _ref.loadFailed;
      var loadFailed = _ref$loadFailed === undefined ? false : _ref$loadFailed;

      this._backgroundLoadOffer.innerHTML = backgroundLoadTemplate({ loadFailed: loadFailed });
      this._backgroundLoadOffer.style.display = 'block';
    }
  }, {
    key: 'confirmBackgroundLoad',
    value: function confirmBackgroundLoad() {
      this._backgroundLoadOffer.innerHTML = backgroundLoadTemplate({ confirmed: true });
    }
  }, {
    key: '_hideBackgroundLoadUI',
    value: function _hideBackgroundLoadUI() {
      this._backgroundLoadOffer.style.display = '';
    }
  }, {
    key: 'updateMeta',
    value: function updateMeta(data) {
      if (!data) {
        this._header.innerHTML = '';
        return;
      }
      this._header.innerHTML = headerTemplate(data);
    }
  }, {
    key: 'updateCachingAbility',
    value: function updateCachingAbility(cacheCapable) {
      this.container.querySelector('.cache-toggle').style.visibility = cacheCapable ? '' : 'hidden';
    }
  }, {
    key: 'startLoading',
    value: function startLoading() {
      this._spinner.show(800);
    }
  }, {
    key: 'stopLoading',
    value: function stopLoading() {
      this._spinner.hide();
    }
  }]);

  return Article;
})(require('events').EventEmitter);

module.exports = Article;

// not supported

// Here comes the haaaaack!

},{"../../../../shared-templates/article-header.hbs":"/Users/hermanw/Documents/hermwong/offline-wikipedia/shared-templates/article-header.hbs","../utils":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/utils.js","./spinner":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/spinner.js","./templates/article-content.hbs":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/templates/article-content.hbs","./templates/background-load.hbs":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/templates/background-load.hbs","events":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/events/events.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/cached-articles.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var template = require('./templates/cached-articles.hbs');

var CachedArticles = (function (_require$EventEmitter) {
  _inherits(CachedArticles, _require$EventEmitter);

  function CachedArticles() {
    var _this = this;

    _classCallCheck(this, CachedArticles);

    _get(Object.getPrototypeOf(CachedArticles.prototype), 'constructor', this).call(this);
    this.container = document.querySelector('.cached-articles-container');
    this.container.addEventListener('click', function (event) {
      return _this._onClick(event);
    });
  }

  _createClass(CachedArticles, [{
    key: '_onClick',
    value: function _onClick(event) {
      // Thankfully we can use this, because Canary!
      if (!event.target.closest) return;
      var button = event.target.closest('button');

      if (!button) return;

      this.emit('delete', { id: button.value });
    }
  }, {
    key: 'update',
    value: function update(data) {
      this.container.innerHTML = template(data);
    }
  }]);

  return CachedArticles;
})(require('events').EventEmitter);

module.exports = CachedArticles;

},{"./templates/cached-articles.hbs":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/templates/cached-articles.hbs","events":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/events/events.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/search-results.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var template = require('./templates/search-results.hbs');
var utils = require('../utils');

var SearchResults = (function () {
  function SearchResults() {
    var _this = this;

    _classCallCheck(this, SearchResults);

    this.container = document.querySelector('.search-results');
    this._items = [];
    this._activeIndex = -1;

    document.querySelector('.search').addEventListener('keydown', function (e) {
      return _this.onSearchKeyDown(e);
    });
  }

  _createClass(SearchResults, [{
    key: 'onSearchKeyDown',
    value: function onSearchKeyDown(event) {
      switch (event.keyCode) {
        case 13:
          // enter
          this._activate();
          event.preventDefault();
          break;
        case 38:
          // up
          this._previous();
          event.preventDefault();
          break;
        case 40:
          // down
          this._next();
          event.preventDefault();
          break;
      }
    }
  }, {
    key: 'update',
    value: function update(results) {
      this._activeIndex = -1;
      this.container.classList.add('active');
      this.container.innerHTML = template(results);
      this._items = utils.toArray(this.container.querySelectorAll('.search-result'));
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.container.classList.remove('active');
    }
  }, {
    key: '_previous',
    value: function _previous() {
      if (this._items[this._activeIndex]) {
        this._items[this._activeIndex].classList.remove('active');
      }

      this._activeIndex--;

      if (!this._items[this._activeIndex]) {
        this._activeIndex = this._items.length - 1;
      }

      this._items[this._activeIndex].classList.add('active');
    }
  }, {
    key: '_next',
    value: function _next() {
      if (this._items[this._activeIndex]) {
        this._items[this._activeIndex].classList.remove('active');
      }

      this._activeIndex++;

      if (!this._items[this._activeIndex]) {
        this._activeIndex = 0;
      }

      this._items[this._activeIndex].classList.add('active');
    }
  }, {
    key: '_activate',
    value: function _activate() {
      var itemToActivate = this._items[this._activeIndex] || this._items[0];

      if (itemToActivate) {
        itemToActivate.querySelector('a').click();
      }
    }
  }]);

  return SearchResults;
})();

module.exports = SearchResults;

},{"../utils":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/utils.js","./templates/search-results.hbs":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/templates/search-results.hbs"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/spinner.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var utils = require('../utils');

var Spinner = (function () {
  function Spinner() {
    var _this = this;

    _classCallCheck(this, Spinner);

    this.container = utils.strToEl('<div class="spinner">' + '<div class="spinner-container">' + '<div class="spinner-layer">' + '<div class="circle-clipper left">' + '<div class="circle"></div>' + '</div>' + '<div class="gap-patch">' + '<div class="circle"></div>' + '</div>' + '<div class="circle-clipper right">' + '<div class="circle"></div>' + '</div>' + '</div>' + '</div>' + '</div>' + '');

    this._showTimeout = null;
    this.container.style.display = 'none';

    var animEndListener = function animEndListener(event) {
      if (event.target == _this.container) {
        _this.container.style.display = 'none';
      }
    };

    this.container.addEventListener('webkitAnimationEnd', animEndListener);
    this.container.addEventListener('animationend', animEndListener);
  }

  _createClass(Spinner, [{
    key: 'show',
    value: function show() {
      var _this2 = this;

      var delay = arguments.length <= 0 || arguments[0] === undefined ? 300 : arguments[0];

      clearTimeout(this._showTimeout);
      this.container.style.display = 'none';
      this.container.classList.remove('cooldown');
      this._showTimeout = setTimeout(function (_) {
        _this2.container.style.display = '';
      }, delay);
    }
  }, {
    key: 'hide',
    value: function hide() {
      clearTimeout(this._showTimeout);
      this.container.classList.add('cooldown');
    }
  }]);

  return Spinner;
})();

module.exports = Spinner;

},{"../utils":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/utils.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/templates/article-content.hbs":[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div id=\"content_wrapper\" class=\"content card-content\">"
    + ((stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"content","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>";
},"useData":true});

},{"hbsfy/runtime":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/hbsfy/runtime.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/templates/background-load.hbs":[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(depth0,helpers,partials,data) {
    return "    <p>Cool, you'll get a notification when it's ready!</p>\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <p>\n      <strong>\n        Uh oh,\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.loadFailed : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "      </strong>\n      But it's ok, we can load it in the background\n      "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.loadFailed : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n      and let you know when it's ready.\n    </p>\n    <div class=\"button-row\">\n      <button>Load in background</button>\n    </div>\n";
},"4":function(depth0,helpers,partials,data) {
    return "          couldn't fetch that article!\n";
},"6":function(depth0,helpers,partials,data) {
    return "          a slow-loading article!\n";
},"8":function(depth0,helpers,partials,data) {
    return "when connectivity is better";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"content_wrapper\" class=\"content card-content\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.confirmed : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});

},{"hbsfy/runtime":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/hbsfy/runtime.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/templates/cached-articles.hbs":[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.items : depth0)) != null ? stack1.length : stack1),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(5, data, 0),"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return "        <ul> \n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\n";
},"3":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <li class=\"item-list-item\">\n              <a href=\"/wiki/"
    + alias3(((helper = (helper = helpers.urlId || (depth0 != null ? depth0.urlId : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"urlId","hash":{},"data":data}) : helper)))
    + "\">\n                <div class=\"title\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n                <div class=\"description\">"
    + alias3(((helper = (helper = helpers.extract || (depth0 != null ? depth0.extract : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"extract","hash":{},"data":data}) : helper)))
    + "</div>\n              </a>\n              <button class=\"delete-btn\" value=\""
    + alias3(((helper = (helper = helpers.urlId || (depth0 != null ? depth0.urlId : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"urlId","hash":{},"data":data}) : helper)))
    + "\">\n                <svg viewBox=\"0 0 24 24\"><title>Delete</title><path d=\"M6 19c0 1 1 2 2 2h8c1 0 2-1 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z\"/></svg>\n              </button>\n            </li>\n";
},"5":function(depth0,helpers,partials,data) {
    return "        <p>You don't have anything cached yet. Maybe read about <a href=\"/wiki/The_Raccoons\">The Raccoons</a> or something? That was ace.</p>\n";
},"7":function(depth0,helpers,partials,data) {
    return "      <p>\n        Unfortunately your browser doesn't support in-page caching. Try\n        <a href=\"https://www.google.co.uk/chrome/browser/canary.html\">Chrome Canary</a>.\n        Everything else works fine though! Although you may want to read about\n        <a href=\"/wiki/Disappointment\">disappointment</a>.\n      </p>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"subheading\">\n  <div class=\"heading-text\">\n    <h1>Cached articles</h1>\n  </div>\n</div>\n\n<div class=\"card\">\n  <div class=\"card-content cached-articles\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.cacheCapable : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "  </div>\n</div>";
},"useData":true});

},{"hbsfy/runtime":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/hbsfy/runtime.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/templates/search-results.hbs":[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "  <ol>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.results : depth0),{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </ol>\n";
},"2":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "      <li class=\"item-list-item search-result\">\n        <a href=\"/wiki/"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n          <div class=\"title\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n          <div class=\"description\">"
    + alias3(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"description","hash":{},"data":data}) : helper)))
    + "</div>\n        </a>\n      </li>\n";
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "  <div class=\"search-error\">"
    + this.escapeExpression(((helper = (helper = helpers.err || (depth0 != null ? depth0.err : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"err","hash":{},"data":data}) : helper)))
    + "</div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.results : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.err : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

},{"hbsfy/runtime":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/hbsfy/runtime.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/toasts.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var utils = require('../utils');

var Toast = (function () {
  function Toast(message, duration, buttons) {
    var _this = this;

    _classCallCheck(this, Toast);

    this.container = utils.strToEl('<div class="toast"><div class="toast-content"></div></div>' + '');

    this._content = this.container.querySelector('.toast-content');
    this._content.textContent = message;
    this._answerResolve;
    this._hideTimeout;

    this.answer = new Promise(function (r) {
      return _this._answerResolve = r;
    });

    buttons.forEach(function (button) {
      var buttonEl = document.createElement('button');
      buttonEl.className = 'unbutton';
      buttonEl.textContent = button;
      buttonEl.addEventListener('click', function (event) {
        _this._answerResolve(button);
      });
      _this.container.appendChild(buttonEl);
    });

    if (duration) {
      this._hideTimeout = setTimeout(function (_) {
        return _this.hide();
      }, duration);
    }
  }

  _createClass(Toast, [{
    key: 'hide',
    value: function hide() {
      clearTimeout(this._hideTimeout);
      this._answerResolve();
      return utils.transitionToClass(this.container, 'hide');
    }
  }]);

  return Toast;
})();

var Toasts = (function () {
  function Toasts() {
    _classCallCheck(this, Toasts);

    this.container = utils.strToEl("<div class='toasts'></div>");
    document.body.appendChild(this.container);
  }

  _createClass(Toasts, [{
    key: 'show',
    value: function show(message) {
      var _this2 = this;

      var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var _ref$duration = _ref.duration;
      var duration = _ref$duration === undefined ? 0 : _ref$duration;
      var _ref$buttons = _ref.buttons;
      var buttons = _ref$buttons === undefined ? ['dismiss'] : _ref$buttons;

      var toast = new Toast(message, duration, buttons);
      this.container.appendChild(toast.container);

      toast.answer.then(function (_) {
        return toast.hide();
      }).then(function (_) {
        _this2.container.removeChild(toast.container);
      });

      return toast;
    }
  }]);

  return Toasts;
})();

module.exports = new Toasts();

},{"../utils":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/utils.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/page/views/toolbar.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Toolbar = (function (_require$EventEmitter) {
  _inherits(Toolbar, _require$EventEmitter);

  function Toolbar() {
    var _this = this;

    _classCallCheck(this, Toolbar);

    _get(Object.getPrototypeOf(Toolbar.prototype), 'constructor', this).call(this);

    this.container = document.querySelector('.toolbar');
    this.searchBar = this.container.querySelector('.search-bar');
    this.searchInput = this.container.querySelector('.search');
    this.lastSearchTerm = '';

    this.container.querySelector('.search-btn').addEventListener('click', function (e) {
      return _this.onSearchBtnClick(e);
    });
    this.container.querySelector('.back-btn').addEventListener('click', function (e) {
      return _this.onBackBtnClick(e);
    });
    this.searchInput.addEventListener('input', function (e) {
      return _this.onSearchInput(e);
    });

    // was this activated before JS loaded?
    if (this.searchBar.classList.contains('active')) {
      // wait for a microtask (so event handlers are ready)
      Promise.resolve().then(function (_) {
        return _this.onSearchInput();
      });
    }
  }

  _createClass(Toolbar, [{
    key: 'onSearchBtnClick',
    value: function onSearchBtnClick(event) {
      // most of this is handled inline in base.dust
      this.lastSearchTerm = '';
    }
  }, {
    key: 'onBackBtnClick',
    value: function onBackBtnClick(event) {
      // most of this is handled inline in base.dust
      this.emit('searchInput', { value: '' });
    }
  }, {
    key: 'onSearchInput',
    value: function onSearchInput() {
      var value = this.searchInput.value.trim();

      if (value != this.lastSearchTerm) {
        this.lastSearchTerm = value;
        this.emit('searchInput', { value: value });
      }
    }
  }]);

  return Toolbar;
})(require('events').EventEmitter);

module.exports = Toolbar;

},{"events":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/events/events.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/shared/indexeddouchbag.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function promisifyRequest(obj) {
  return new Promise(function (resolve, reject) {
    function onsuccess(event) {
      resolve(obj.result);
      unlisten();
    }
    function onerror(event) {
      reject(obj.error);
      unlisten();
    }
    function unlisten() {
      obj.removeEventListener('complete', onsuccess);
      obj.removeEventListener('success', onsuccess);
      obj.removeEventListener('error', onerror);
      obj.removeEventListener('abort', onerror);
    }
    obj.addEventListener('complete', onsuccess);
    obj.addEventListener('success', onsuccess);
    obj.addEventListener('error', onerror);
    obj.addEventListener('abort', onerror);
  });
}

var IndexedDouchebag = (function () {
  function IndexedDouchebag(name, version, upgradeCallback) {
    _classCallCheck(this, IndexedDouchebag);

    var request = indexedDB.open(name, version);
    this.ready = promisifyRequest(request);
    request.onupgradeneeded = function (event) {
      upgradeCallback(request.result, event.oldVersion);
    };
  }

  _createClass(IndexedDouchebag, [{
    key: 'transaction',
    value: function transaction(stores, modeOrCallback, callback) {
      return this.ready.then(function (db) {
        var mode = 'readonly';

        if (modeOrCallback.apply) {
          callback = modeOrCallback;
        } else if (modeOrCallback) {
          mode = modeOrCallback;
        }

        var tx = db.transaction(stores, mode);
        var val = callback(tx, db);
        var promise = promisifyRequest(tx);
        var readPromise;

        if (!val) {
          return promise;
        }

        if (val[0] && 'result' in val[0]) {
          readPromise = Promise.all(val.map(promisifyRequest));
        } else {
          readPromise = promisifyRequest(val);
        }

        return promise.then(function () {
          return readPromise;
        });
      });
    }
  }, {
    key: 'get',
    value: function get(store, key) {
      return this.transaction(store, function (tx) {
        return tx.objectStore(store).get(key);
      });
    }
  }, {
    key: 'put',
    value: function put(store, key, value) {
      return this.transaction(store, 'readwrite', function (tx) {
        tx.objectStore(store).put(value, key);
      });
    }
  }, {
    key: 'delete',
    value: function _delete(store, key) {
      return this.transaction(store, 'readwrite', function (tx) {
        tx.objectStore(store)['delete'](key);
      });
    }
  }]);

  return IndexedDouchebag;
})();

module.exports = IndexedDouchebag;

},{}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/shared/storage.js":[function(require,module,exports){
'use strict';

var Idb = require('./indexeddouchbag');
var idb;

// avoid opening idb until first call
function getIdb() {
  if (!idb) {
    idb = new Idb('wiki-offline-keyval', 1, function (db) {
      db.createObjectStore('keyval');
    });
  }
  return idb;
}

if (self.indexedDB) {
  module.exports = {
    get: function get(key) {
      return getIdb().get('keyval', key);
    },
    set: function set(key, val) {
      return getIdb().put('keyval', key, val);
    },
    'delete': function _delete(key) {
      return getIdb()['delete']('keyval', key);
    }
  };
} else {
  module.exports = {
    get: function get(key) {
      return Promise.resolve(localStorage.getItem(key));
    },
    set: function set(key, val) {
      return Promise.resolve(localStorage.setItem(key, val));
    },
    'delete': function _delete(key) {
      return Promise.resolve(localStorage.removeItem(key));
    }
  };
}

},{"./indexeddouchbag":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/shared/indexeddouchbag.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/shared/wikipedia.js":[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var srcset = require('srcset');
var storage = require('./storage');

var cachePrefix = "wikioffline-article-";

function getMetaRequest(name) {
  return new Request('/wiki/' + name + '.json', {
    credentials: 'include' // needed for flag cookies
  });
}

function getArticleRequest(name) {
  return new Request('/wiki/' + name + '.inc', {
    credentials: 'include' // needed for flag cookies
  });
}

var Article = (function () {
  function Article(name) {
    var _this = this;

    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$fromCache = _ref.fromCache;
    var fromCache = _ref$fromCache === undefined ? false : _ref$fromCache;

    _classCallCheck(this, Article);

    var fetcher = fromCache ? caches.match.bind(caches) : fetch;
    this._metaPromise = fetcher(getMetaRequest(name));
    this._articlePromise = fetcher(getArticleRequest(name));

    this.ready = this._metaPromise.then(function (r) {
      if (!r) throw Error('No response');
    });

    var data = this.ready.then(function (_) {
      return _this._metaPromise;
    }).then(function (r) {
      return r.clone().json();
    });

    this._html = undefined;

    this.meta = data.then(function (meta) {
      meta.updated = new Date(meta.updated);
      return meta;
    });

    this._cacheName = this.meta.then(function (data) {
      return cachePrefix + data.urlId;
    });
  }

  _createClass(Article, [{
    key: 'getHtml',
    value: function getHtml() {
      return regeneratorRuntime.async(function getHtml$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            if (!(this._html === undefined)) {
              context$2$0.next = 4;
              break;
            }

            context$2$0.next = 3;
            return regeneratorRuntime.awrap(this._articlePromise.then(function (r) {
              return r.clone().text();
            }));

          case 3:
            this._html = context$2$0.sent;

          case 4:
            return context$2$0.abrupt('return', this._html);

          case 5:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'getHtmlResponse',
    value: function getHtmlResponse() {
      return this._articlePromise.then(function (r) {
        return r.clone();
      });
    }
  }, {
    key: '_createCacheArticleResponse',
    value: function _createCacheArticleResponse() {
      var text, devicePixelRatio;
      return regeneratorRuntime.async(function _createCacheArticleResponse$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return regeneratorRuntime.awrap(this.getHtml());

          case 2:
            text = context$2$0.sent;
            context$2$0.t1 = self.devicePixelRatio;

            if (context$2$0.t1) {
              context$2$0.next = 8;
              break;
            }

            context$2$0.next = 7;
            return regeneratorRuntime.awrap(storage.get('devicePixelRatio'));

          case 7:
            context$2$0.t1 = context$2$0.sent;

          case 8:
            context$2$0.t0 = context$2$0.t1;

            if (context$2$0.t0) {
              context$2$0.next = 11;
              break;
            }

            context$2$0.t0 = 2;

          case 11:
            devicePixelRatio = context$2$0.t0;

            // yes I'm parsing HTML with regex muahahaha
            // I'm flattening srcset to make it deterministic
            text = text.replace(/<img[^>]*>/ig, function (match) {
              // start with the image src as density 1
              var newSrc = (/src=(['"])(.*?)\1/i.exec(match) || [])[2];

              match = match.replace(/srcset=(['"])(.*?)\1/ig, function (srcsetAll, _, srcsetInner) {
                try {
                  var parsedSrcset = srcset.parse(srcsetInner).sort(function (a, b) {
                    return a.density < b.density ? -1 : 1;
                  });
                  var lastDensity = 1;

                  var _iteratorNormalCompletion = true;
                  var _didIteratorError = false;
                  var _iteratorError = undefined;

                  try {
                    for (var _iterator = parsedSrcset[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var srcSetItem = _step.value;

                      if (devicePixelRatio > lastDensity) {
                        newSrc = srcSetItem.url;
                      }
                      if (devicePixelRatio <= srcSetItem.density) {
                        break;
                      }
                      lastDensity = srcSetItem.density;
                    }
                  } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                      }
                    } finally {
                      if (_didIteratorError) {
                        throw _iteratorError;
                      }
                    }
                  }
                } catch (e) {}

                return '';
              });

              if (newSrc) {
                match = match.replace(/src=(['"]).*?\1/ig, 'src="' + newSrc + '"');
              }

              return match;
            });

            context$2$0.t2 = Response;
            context$2$0.t3 = text;
            context$2$0.next = 17;
            return regeneratorRuntime.awrap(this._articlePromise);

          case 17:
            context$2$0.t4 = context$2$0.sent.headers;
            context$2$0.t5 = {
              headers: context$2$0.t4
            };
            return context$2$0.abrupt('return', new context$2$0.t2(context$2$0.t3, context$2$0.t5));

          case 20:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'cache',
    value: function cache() {
      var previouslyCached, cache, imgRe, regexResult, articleResponse, htmlText, imgSrcs, urlId, cacheOpeations;
      return regeneratorRuntime.async(function cache$(context$2$0) {
        var _this2 = this;

        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return regeneratorRuntime.awrap(this.isCached());

          case 2:
            previouslyCached = context$2$0.sent;
            context$2$0.t0 = regeneratorRuntime;
            context$2$0.t1 = caches;
            context$2$0.next = 7;
            return regeneratorRuntime.awrap(this._cacheName);

          case 7:
            context$2$0.t2 = context$2$0.sent;
            context$2$0.t3 = context$2$0.t1.open.call(context$2$0.t1, context$2$0.t2);
            context$2$0.next = 11;
            return context$2$0.t0.awrap.call(context$2$0.t0, context$2$0.t3);

          case 11:
            cache = context$2$0.sent;
            imgRe = /<img[^>]*src=(['"])(.*?)\1[^>]*>/ig;
            context$2$0.next = 15;
            return regeneratorRuntime.awrap(this._createCacheArticleResponse());

          case 15:
            articleResponse = context$2$0.sent;
            context$2$0.next = 18;
            return regeneratorRuntime.awrap(articleResponse.clone().text());

          case 18:
            htmlText = context$2$0.sent;
            imgSrcs = new Set();
            context$2$0.next = 22;
            return regeneratorRuntime.awrap(this.meta);

          case 22:
            urlId = context$2$0.sent.urlId;

            while (regexResult = imgRe.exec(htmlText)) {
              imgSrcs.add(regexResult[2]);
            }

            context$2$0.t4 = cache;
            context$2$0.t5 = getMetaRequest(urlId);
            context$2$0.next = 28;
            return regeneratorRuntime.awrap(this._metaPromise);

          case 28:
            context$2$0.t6 = context$2$0.sent.clone();
            context$2$0.t7 = context$2$0.t4.put.call(context$2$0.t4, context$2$0.t5, context$2$0.t6);
            context$2$0.t8 = cache.put(getArticleRequest(urlId), articleResponse);
            cacheOpeations = [context$2$0.t7, context$2$0.t8];

            imgSrcs.forEach(function (url) {
              var request = new Request(url, { mode: 'no-cors' });
              cacheOpeations.push(
              // This is a workaround to https://code.google.com/p/chromium/issues/detail?id=477658
              // Once the bug is fixed, we can just do this:
              // fetch(request).then(response => cache.put(request, response))
              caches.match(request).then(function (response) {
                return response || fetch(request);
              }).then(function (response) {
                return cache.put(request, response);
              }));
            });

            return context$2$0.abrupt('return', Promise.all(cacheOpeations)['catch'](function (err) {
              if (!previouslyCached) {
                _this2.uncache();
              }
              throw err;
            }).then(function (_) {
              return undefined;
            }));

          case 34:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'uncache',
    value: function uncache() {
      return regeneratorRuntime.async(function uncache$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.t0 = caches;
            context$2$0.next = 3;
            return regeneratorRuntime.awrap(this._cacheName);

          case 3:
            context$2$0.t1 = context$2$0.sent;
            return context$2$0.abrupt('return', context$2$0.t0['delete'].call(context$2$0.t0, context$2$0.t1));

          case 5:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }, {
    key: 'isCached',
    value: function isCached() {
      return regeneratorRuntime.async(function isCached$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.t0 = caches;
            context$2$0.next = 3;
            return regeneratorRuntime.awrap(this._cacheName);

          case 3:
            context$2$0.t1 = context$2$0.sent;
            return context$2$0.abrupt('return', context$2$0.t0.has.call(context$2$0.t0, context$2$0.t1));

          case 5:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  }]);

  return Article;
})();

var wikipedia = {
  search: function search(term) {
    return fetch('/search.json?s=' + term, {
      credentials: 'include' // needed for flag cookies
    }).then(function (r) {
      return r.json();
    });
  },

  article: function article(name) {
    var _ref2,
        _ref2$fromCache,
        fromCache,
        article,
        args$1$0 = arguments;

    return regeneratorRuntime.async(function article$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          _ref2 = args$1$0.length <= 1 || args$1$0[1] === undefined ? {} : args$1$0[1];
          _ref2$fromCache = _ref2.fromCache;
          fromCache = _ref2$fromCache === undefined ? false : _ref2$fromCache;

          if (!(fromCache && !('caches' in self))) {
            context$1$0.next = 5;
            break;
          }

          return context$1$0.abrupt('return', Promise.reject(Error("Caching not supported")));

        case 5:
          article = new Article(name, { fromCache: fromCache });
          context$1$0.next = 8;
          return regeneratorRuntime.awrap(article.ready);

        case 8:
          return context$1$0.abrupt('return', article);

        case 9:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },

  getCachedArticleData: function getCachedArticleData() {
    var articleNames;
    return regeneratorRuntime.async(function getCachedArticleData$(context$1$0) {
      var _this3 = this;

      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          if ('caches' in self) {
            context$1$0.next = 2;
            break;
          }

          return context$1$0.abrupt('return', []);

        case 2:
          context$1$0.next = 4;
          return regeneratorRuntime.awrap(caches.keys());

        case 4:
          context$1$0.t0 = function (cacheName) {
            return cacheName.startsWith(cachePrefix);
          };

          context$1$0.t1 = function (cacheName) {
            return cacheName.slice(cachePrefix.length);
          };

          articleNames = context$1$0.sent.filter(context$1$0.t0).map(context$1$0.t1);
          return context$1$0.abrupt('return', Promise.all(articleNames.map(function callee$1$0(name) {
            var response;
            return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return regeneratorRuntime.awrap(caches.match(getMetaRequest(name)));

                case 2:
                  response = context$2$0.sent;

                  if (response) {
                    context$2$0.next = 6;
                    break;
                  }

                  wikipedia.uncache(name);
                  return context$2$0.abrupt('return', false);

                case 6:
                  ;

                  return context$2$0.abrupt('return', response.json());

                case 8:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this3);
          })).then(function (vals) {
            return vals.filter(function (val) {
              return val;
            });
          }));

        case 8:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },

  uncache: function uncache(name) {
    return caches['delete'](cachePrefix + name);
  }
};

module.exports = wikipedia;

// workers don't have access to DPR

// get a fresh request, as it may have originally been redirected

// seeing a bug where the response here is gone - not sure why
// but I'll guard against it

},{"./storage":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/shared/storage.js","srcset":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/srcset/srcset.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/shared-templates/article-header.hbs":[function(require,module,exports){
// hbsfy compiled Handlebars template
var HandlebarsCompiler = require('hbsfy/runtime');
module.exports = HandlebarsCompiler.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function";

  return "  <script>\n    document.title = "
    + ((stack1 = ((helper = (helper = helpers.safeTitle || (depth0 != null ? depth0.safeTitle : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"safeTitle","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + " + ' - Offline Wikipedia';\n    history.replaceState({}, document.title, '/wiki/' + "
    + ((stack1 = ((helper = (helper = helpers.safeUrlId || (depth0 != null ? depth0.safeUrlId : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"safeUrlId","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + " + location.search);\n  </script>\n";
},"3":function(depth0,helpers,partials,data) {
    return " style=\"visibility: hidden\"";
},"5":function(depth0,helpers,partials,data) {
    return " checked";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"heading-text\">\n  <h1>"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h1>\n  <div class=\"updated-meta\">- updated "
    + alias3(((helper = (helper = helpers.updated || (depth0 != null ? depth0.updated : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"updated","hash":{},"data":data}) : helper)))
    + "</div>\n</div>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.server : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n<label class=\"cache-toggle\""
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.cacheCapable : depth0),{"name":"unless","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">\n  <input type=\"checkbox\" name=\"cache\""
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.cached : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ">\n  <span class=\"material-switch\">\n    <span class=\"track\"></span>\n    <span class=\"handle\"></span>\n  </span>\n  <span class=\"read-offline-txt\">Read offline</span>\n</label>";
},"useData":true});

},{"hbsfy/runtime":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/hbsfy/runtime.js"}]},{},["./public/js/page/index.js"])

//# sourceMappingURL=page.js.map
