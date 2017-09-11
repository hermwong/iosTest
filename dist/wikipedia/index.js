'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var querystring = require('querystring');
var RSVP = require('rsvp');
var request = require('request');
var requestPromise = RSVP.denodeify(request);
var replaceStream = require('replacestream');

var apiBase = 'https://en.wikipedia.org/w/api.php?';
var viewBase = 'https://en.m.wikipedia.org/wiki/';

module.exports = {
  apiBase: apiBase,

  getMetaData: function getMetaData(name) {
    return requestPromise(apiBase + querystring.stringify({
      action: 'query',
      titles: name,
      format: 'json',
      redirects: 'resolve',
      prop: 'extracts|revisions',
      explaintext: 1,
      exsentences: 1
    })).then(function (r) {
      return JSON.parse(r.body);
    }).then(function (data) {
      var page = data.query.pages[Object.keys(data.query.pages)[0]];

      if ('missing' in page) {
        return { err: "Not found" };
      }

      return {
        title: page.title,
        extract: page.extract,
        urlId: page.title.replace(/\s/g, '_'),
        updated: page.revisions[0].timestamp
      };
    });
  },

  search: function search(term) {
    return requestPromise(apiBase + querystring.stringify({
      action: 'opensearch',
      search: term,
      format: 'json',
      redirects: 'resolve',
      limit: 4
    })).then(function (r) {
      return JSON.parse(r.body);
    }).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 4);

      var term = _ref2[0];
      var pageTitles = _ref2[1];
      var descriptions = _ref2[2];
      var urls = _ref2[3];

      return pageTitles.map(function (title, i) {
        return {
          title: title,
          description: descriptions[i],
          id: /en.wikipedia.org\/wiki\/(.+)$/.exec(urls[i])[1]
        };
      });
    });
  },

  getArticle: function getArticle(name) {
    return requestPromise(viewBase + name + '?action=render').then(function (r) {
      return r.body.replace(/\/\/en\.wikipedia\.org\/wiki\//g, '/wiki/');
    });
  },

  getArticleStream: function getArticleStream(name) {
    return request(viewBase + name + '?action=render').pipe(replaceStream('//en.wikipedia.org/wiki/', '/wiki/'));
  }
};
//# sourceMappingURL=index.js.map
