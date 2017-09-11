(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./public/js/sw/index.js":[function(require,module,exports){
'use strict';

var _this = this;

require('regenerator/runtime');
require('serviceworker-cache-polyfill');
var wikipedia = require('../shared/wikipedia');
var storage = require('../shared/storage');

var version = '24';
var prefix = 'wikioffline';
var staticCacheName = prefix + '-static-v' + version;

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(staticCacheName).then(function (cache) {
    return cache.addAll(['/', '/shell.html', '/js/page.js', '/js/page-framework.js', // yeahhhh, we're caching waayyyyy more than we need, but keeps the request tests fair
    '/css/head-wiki.css', // don't need this when it's inlined, but helps when rendered with blocking CSS in settings
    '/css/wiki.css']).then(function () {
      return cache.match('/shell.html');
    }).then(function (response) {
      // bit hacky, making the shell start & end from the shell just fetched
      return response.text().then(function (text) {
        var headerEnd = text.indexOf('<div class="article-header subheading">');
        var articleEnd = text.indexOf('<div class="background-load-offer card">');
        return Promise.all([cache.put('/shell-start.html', new Response(text.slice(0, headerEnd), response)), cache.put('/shell-end.html', new Response(text.slice(articleEnd), response))]);
      });
    });
  }));
});

var expectedCaches = [staticCacheName];

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (key) {
      if (key.startsWith(prefix + '-') && !key.startsWith(prefix + '-article-') && expectedCaches.indexOf(key) == -1) {
        return caches['delete'](key);
      }
    }));
  }));
});

// This will vanish when the ServiceWorker closes,
// but that's cool, I want that.
var dataTmpCache = {};

self.addEventListener('fetch', function (event) {
  var requestURL = new URL(event.request.url);

  // catch the root request
  if (requestURL.origin == location.origin) {
    if (requestURL.pathname == '/') {
      event.respondWith(caches.match('/'));
      return;
    }
    if (requestURL.pathname.startsWith('/wiki/')) {
      if (/\.(middle.inc)$/.test(requestURL.pathname)) {
        return;
      }

      if (/\.(json|inc)$/.test(requestURL.pathname)) {
        if (dataTmpCache[requestURL.href]) {
          var response = dataTmpCache[requestURL.href];
          delete dataTmpCache[requestURL.href];
          event.respondWith(response);
        }
        return;
      }

      if (requestURL.search.includes('sw-stream')) {
        event.respondWith(streamArticle(requestURL));
        return;
      }

      // Get ahead of the pack by starting the json request now
      if (!requestURL.search.includes('no-prefetch')) {
        var jsonURL = new URL(requestURL);
        jsonURL.pathname += '.json';
        jsonURL.search = '';
        var incURL = new URL(requestURL);
        incURL.pathname += '.inc';
        incURL.search = '';
        dataTmpCache[jsonURL.href] = fetch(jsonURL, {
          credentials: 'include' // needed for flag cookies
        });
        dataTmpCache[incURL.href] = fetch(incURL, {
          credentials: 'include' // needed for flag cookies
        });
      }

      event.respondWith(caches.match('/shell.html'));
      return;
    }
  }

  // default fetch behaviour
  event.respondWith(caches.match(event.request).then(function (response) {
    return response || fetch(event.request);
  }));
});

function streamArticle(url) {
  try {
    new ReadableStream({});
  } catch (e) {
    return new Response("Streams not supported");
  }
  var stream = new ReadableStream({
    start: function start(controller) {
      var contentURL = new URL(url);
      contentURL.pathname += '.middle.inc';
      var startFetch = caches.match('/shell-start.html');
      var contentFetch = fetch(contentURL)['catch'](function () {
        return new Response("Failed, soz");
      });
      var endFetch = caches.match('/shell-end.html');

      function pushStream(stream) {
        var reader = stream.getReader();
        function read() {
          return reader.read().then(function (result) {
            if (result.done) return;
            controller.enqueue(result.value);
            return read();
          });
        }
        return read();
      }

      startFetch.then(function (response) {
        return pushStream(response.body);
      }).then(function () {
        return contentFetch;
      }).then(function (response) {
        return pushStream(response.body);
      }).then(function () {
        return endFetch;
      }).then(function (response) {
        return pushStream(response.body);
      }).then(function () {
        return controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/html' }
  });
}

self.addEventListener('sync', function (event) {
  // My use of storage here has race conditions. Meh.
  console.log("Good lord, a sync event");

  event.waitUntil(storage.get('to-bg-cache').then(function (toCache) {
    toCache = toCache || [];

    return Promise.all(toCache.map(function callee$2$0(articleName) {
      var article;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return regeneratorRuntime.awrap(wikipedia.article(articleName));

          case 2:
            article = context$3$0.sent;
            context$3$0.next = 5;
            return regeneratorRuntime.awrap(article.cache());

          case 5:
            context$3$0.t0 = registration;
            context$3$0.next = 8;
            return regeneratorRuntime.awrap(article.meta);

          case 8:
            context$3$0.t1 = context$3$0.sent.title;
            context$3$0.t2 = context$3$0.t1 + " ready!";
            context$3$0.next = 12;
            return regeneratorRuntime.awrap(article.meta);

          case 12:
            context$3$0.t3 = context$3$0.sent.urlId;
            context$3$0.t4 = {
              icon: "/imgs/wikipedia-192.png",
              body: "View the article",
              data: context$3$0.t3
            };
            context$3$0.t0.showNotification.call(context$3$0.t0, context$3$0.t2, context$3$0.t4);

          case 15:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    }));
  }).then(function (_) {
    storage.set('to-bg-cache', []);
  }));
});

self.addEventListener('notificationclick', function (event) {
  // assuming only one type of notification right now
  event.notification.close();
  clients.openWindow(location.origin + '/wiki/' + event.notification.data);
});

self.addEventListener('message', function (event) {
  if (event.data == 'skipWaiting') {
    self.skipWaiting();
  }
});

},{"../shared/storage":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/shared/storage.js","../shared/wikipedia":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/shared/wikipedia.js","regenerator/runtime":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/regenerator/runtime.js","serviceworker-cache-polyfill":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/serviceworker-cache-polyfill/index.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/process/browser.js":[function(require,module,exports){
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

},{}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/regenerator-runtime/runtime.js":[function(require,module,exports){
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

},{"regenerator-runtime/runtime":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/regenerator-runtime/runtime.js"}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/serviceworker-cache-polyfill/index.js":[function(require,module,exports){
if (!Cache.prototype.add) {
  Cache.prototype.add = function add(request) {
    return this.addAll([request]);
  };
}

if (!Cache.prototype.addAll) {
  Cache.prototype.addAll = function addAll(requests) {
    var cache = this;

    // Since DOMExceptions are not constructable:
    function NetworkError(message) {
      this.name = 'NetworkError';
      this.code = 19;
      this.message = message;
    }
    NetworkError.prototype = Object.create(Error.prototype);

    return Promise.resolve().then(function() {
      if (arguments.length < 1) throw new TypeError();
      
      // Simulate sequence<(Request or USVString)> binding:
      var sequence = [];

      requests = requests.map(function(request) {
        if (request instanceof Request) {
          return request;
        }
        else {
          return String(request); // may throw TypeError
        }
      });

      return Promise.all(
        requests.map(function(request) {
          if (typeof request === 'string') {
            request = new Request(request);
          }

          var scheme = new URL(request.url).protocol;

          if (scheme !== 'http:' && scheme !== 'https:') {
            throw new NetworkError("Invalid scheme");
          }

          return fetch(request.clone());
        })
      );
    }).then(function(responses) {
      // TODO: check that requests don't overwrite one another
      // (don't think this is possible to polyfill due to opaque responses)
      return Promise.all(
        responses.map(function(response, i) {
          return cache.put(requests[i], response);
        })
      );
    }).then(function() {
      return undefined;
    });
  };
}

},{}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/srcset/srcset.js":[function(require,module,exports){
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

},{}],"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/shared/indexeddouchbag.js":[function(require,module,exports){
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

},{"./storage":"/Users/hermanw/Documents/hermwong/offline-wikipedia/public/js/shared/storage.js","srcset":"/Users/hermanw/Documents/hermwong/offline-wikipedia/node_modules/srcset/srcset.js"}]},{},["./public/js/sw/index.js"])

//# sourceMappingURL=sw.js.map
