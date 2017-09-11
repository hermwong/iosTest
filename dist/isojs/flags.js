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
//# sourceMappingURL=flags.js.map
