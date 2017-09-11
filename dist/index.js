'use strict';

var _this = this;

var RSVP = require('rsvp');
global.Promise = RSVP.Promise;
require('regenerator/runtime');
var fs = require('fs');
var express = require('express');
var compression = require('compression');
var readFile = RSVP.denodeify(fs.readFile);
var gzipStatic = require('connect-gzip-static');
var cookieParser = require('cookie-parser');
var url = require('url');
var zlib = require('zlib');
global.dust = require('dustjs-linkedin');

// dust templates
require('./server-templates/base');
require('./server-templates/index');
require('./server-templates/flags');
require('./server-templates/article-shell');
require('./server-templates/article');
require('./server-templates/article-stream');

var Flags = require('./isojs/flags');
var wikipedia = require('./wikipedia');
var wikiDisplayDate = require('./isojs/wiki-display-date');
var articleHeader = require('./shared-templates/article-header');

var app = express();

var inlineCss = readFile(__dirname + '/public/css/head.css', { encoding: 'utf8' });

var env = process.env.NODE_ENV;
var staticOptions = {
  maxAge: env === 'production' ? '500 days' : 0
};

app.set('port', process.env.PORT || 8000);

app.use('/js', gzipStatic('public/js', staticOptions));
app.use('/css', gzipStatic('public/css', staticOptions));
app.use('/imgs', gzipStatic('public/imgs', staticOptions));
app.use('/sw.js', gzipStatic('public/sw.js', {
  maxAge: 0
}));
app.use('/manifest.json', gzipStatic('public/manifest.json'));
app.use('/google589825ec7319e599.html', gzipStatic('public/google589825ec7319e599.html'));

app.use(cookieParser(), function (req, res, next) {
  req.flags = new Flags(req.cookies.flags || '', url.parse(req.url).query || '');

  next();
});

function sendDustTemplateOutput(req, res, name, data) {
  if (req.flags.get('disable-chunking')) {
    dust.render(name, data, function (err, str) {
      return res.send(str);
    });
  } else {
    dust.stream(name, data).pipe(res);
  }
}

app.get('/', compression({
  flush: zlib.Z_PARTIAL_FLUSH
}), function (req, res) {
  res.status(200);
  res.type('html');
  sendDustTemplateOutput(req, res, 'index', {
    inlineCss: inlineCss,
    flags: req.flags.getAll()
  });
});

app.get('/flags', compression({
  flush: zlib.Z_PARTIAL_FLUSH
}), function (req, res) {
  res.status(200);
  res.type('html');
  sendDustTemplateOutput(req, res, 'flags', {
    title: "Flags",
    inlineCss: inlineCss,
    flags: req.flags.getAll()
  });
});

function handlePageShellRequest(req, res) {
  return regeneratorRuntime.async(function handlePageShellRequest$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        res.status(200);
        res.type('html');
        sendDustTemplateOutput(req, res, 'article-shell', {
          inlineCss: inlineCss,
          flags: req.flags.getAll()
        });

      case 3:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

app.get('/shell.html', compression({
  flush: zlib.Z_PARTIAL_FLUSH
}), handlePageShellRequest);

app.get(/\/wiki\/(.+)\.json/, compression(), function callee$0$0(req, res) {
  var name, metaContent;
  return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        name = req.params[0];

        if (req.flags.get('avoid-wikipedia')) {
          metaContent = new Promise(function (r) {
            return setTimeout(r, 900);
          }).then(function (_) {
            return readFile(__dirname + '/wikipedia/google.json').then(JSON.parse);
          });
        } else {
          metaContent = wikipedia.getMetaData(name);
        }

        context$1$0.prev = 2;
        context$1$0.next = 5;
        return regeneratorRuntime.awrap(metaContent);

      case 5:
        metaContent = context$1$0.sent;

        if (!(metaContent.err == "Not found")) {
          context$1$0.next = 9;
          break;
        }

        res.status(404).json({
          err: metaContent.err
        });
        return context$1$0.abrupt('return');

      case 9:

        res.json(metaContent);
        context$1$0.next = 16;
        break;

      case 12:
        context$1$0.prev = 12;
        context$1$0.t0 = context$1$0['catch'](2);

        console.log(context$1$0.t0, context$1$0.t0.stack);
        res.status(500).json({
          err: context$1$0.t0.message
        });

      case 16:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[2, 12]]);
});

// TODO: this is a horrible copy & paste job from the main server-render route. Should be refactored.
app.get(/\/wiki\/(.+)\.middle\.inc/, compression({
  flush: zlib.Z_PARTIAL_FLUSH
}), function callee$0$0(req, res) {
  var name, meta, articleStream;
  return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        try {
          name = req.params[0];

          if (req.flags.get('avoid-wikipedia')) {
            meta = readFile(__dirname + '/wikipedia/google.json').then(JSON.parse);
            articleStream = new Promise(function (r) {
              return setTimeout(r, 900);
            }).then(function (_) {
              return fs.createReadStream(__dirname + '/wikipedia/google.html', {
                encoding: 'utf8'
              });
            });
          } else {
            meta = wikipedia.getMetaData(name);

            if (req.flags.get('no-wiki-piping')) {
              articleStream = wikipedia.getArticle(name);
            } else {
              articleStream = wikipedia.getArticleStream(name);
            }
          }

          meta = meta.then(function (data) {
            data.updated = wikiDisplayDate(new Date(data.updated));
            data.server = true;
            data.safeTitle = JSON.stringify(data.title);
            data.safeUrlId = JSON.stringify(data.urlId);
            return data;
          });

          res.status(200);
          res.type('html');

          sendDustTemplateOutput(req, res, 'article-stream', {
            title: name.replace(/_/g, ' '),
            flags: req.flags.getAll(),
            content: articleStream,
            headerContent: meta.then(function (meta) {
              return articleHeader(meta);
            })
          });
        } catch (err) {
          console.log(err, err.stack);
          res.write("ERRORD");
          res.end();
        }

      case 1:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this);
});

app.get(/\/wiki\/(.+)\.inc/, compression({
  flush: zlib.Z_PARTIAL_FLUSH
}), function callee$0$0(req, res) {
  var name, articleStream;
  return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        name = req.params[0];

        if (!req.flags.get('avoid-wikipedia')) {
          context$1$0.next = 7;
          break;
        }

        context$1$0.next = 4;
        return regeneratorRuntime.awrap(new Promise(function (r) {
          return setTimeout(r, 900);
        }));

      case 4:
        articleStream = fs.createReadStream(__dirname + '/wikipedia/google.html', {
          encoding: 'utf8'
        });
        context$1$0.next = 8;
        break;

      case 7:
        articleStream = wikipedia.getArticleStream(name);

      case 8:

        try {
          res.status(200);
          res.type('html');
          articleStream.pipe(res);
        } catch (err) {
          console.log(err, err.stack);
          res.send(500, "Failed");
        }

      case 9:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this);
});

app.get('/search.json', compression(), function callee$0$0(req, res) {
  var term;
  return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        term = (req.query.s || '').trim();

        if (term) {
          context$1$0.next = 4;
          break;
        }

        res.json([]);
        return context$1$0.abrupt('return');

      case 4:
        context$1$0.prev = 4;
        context$1$0.t0 = res;
        context$1$0.next = 8;
        return regeneratorRuntime.awrap(wikipedia.search(req.query.s));

      case 8:
        context$1$0.t1 = context$1$0.sent;
        context$1$0.t0.json.call(context$1$0.t0, context$1$0.t1);
        context$1$0.next = 16;
        break;

      case 12:
        context$1$0.prev = 12;
        context$1$0.t2 = context$1$0['catch'](4);

        console.log(context$1$0.t2, context$1$0.t2.stack);
        res.json(500, {
          err: context$1$0.t2.message
        });

      case 16:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[4, 12]]);
});

app.get(/\/wiki\/(.*)/, compression({
  flush: zlib.Z_PARTIAL_FLUSH
}), function (req, res) {
  try {
    if (req.flags.get('client-render')) {
      handlePageShellRequest(req, res);
      return;
    }

    var name = req.params[0];

    if (req.flags.get('avoid-wikipedia')) {
      var meta = readFile(__dirname + '/wikipedia/google.json').then(JSON.parse);
      var articleStream = new Promise(function (r) {
        return setTimeout(r, 900);
      }).then(function (_) {
        return fs.createReadStream(__dirname + '/wikipedia/google.html', {
          encoding: 'utf8'
        });
      });
    } else {
      var meta = wikipedia.getMetaData(name);
      if (req.flags.get('no-wiki-piping')) {
        var articleStream = wikipedia.getArticle(name);
      } else {
        var articleStream = wikipedia.getArticleStream(name);
      }
    }

    meta = meta.then(function (data) {
      data.updated = wikiDisplayDate(new Date(data.updated));
      data.server = true;
      data.safeTitle = JSON.stringify(data.title);
      data.safeUrlId = JSON.stringify(data.urlId);
      return data;
    });

    res.status(200);
    res.type('html');

    sendDustTemplateOutput(req, res, 'article', {
      title: name.replace(/_/g, ' '),
      inlineCss: inlineCss,
      flags: req.flags.getAll(),
      content: articleStream,
      headerContent: meta.then(function (meta) {
        return articleHeader(meta);
      }),
      canonical: 'https://en.wikipedia.org/wiki/' + name
    });
  } catch (err) {
    console.log(err, err.stack);
    res.write("ERRORD");
    res.end();
  }
});

app.listen(app.get('port'), function () {
  console.log("Server listening at localhost:" + app.get('port'));
});
//# sourceMappingURL=index.js.map
