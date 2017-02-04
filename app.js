var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var _ = require('underscore');
var mongoose = require('mongoose');
var Apk = require('./models/apk.js');
var port = process.env.PORT || 3001;
var app = express();


mongoose.connect('mongodb://210.209.85.192:27017/byc/appstation');
mongoose.connection.on('connected', function () {
  console.log('Connection success!');
});
//mongoose.Promise = global.Promise;
app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));
//app.use(bodyParser.json());
app.locals.moment = require('moment');
app.listen(port, function () {
  console.log('server start on port:' + port);
});

//routes
//index
app.get('/', function (req, res) {
  Apk.fetch(function (err, apks) {
    if (err) {
      console.log(err)
    }
    res.render('index', {
      title: '首页',
      apks: apks
    });
  });
});

//detail
app.get('/apk/:id', function (req, res) {
  var id = req.params.id;
  Apk.findById(id, function (err, apk) {
    if (err) {
      console.log(err)
    }
    res.render('detail', {
      title: '详情页--' + apk.title,
      apk: apk
    });
  });

});
//admin
app.get('/admin/apk', function (req, res) {
  res.render('admin', {
    title: '后台录入',
    apk: {
      title: '',
      doctor: '',
      country: '',
      language: '',
      summary: '',
      year: '',
      flash: '',
      poster: ''
    }
  });
});
app.get('/admin/update/:id', function (req, res) {
  var id = req.params.id;
  if (id) {
    Apk.findById(id, function (err, apk) {
      res.render('admin', {
        title: '后台更新',
        apk: apk
      });
    });
  }
});
app.post('/admin/apk/new', function (req, res) {
  var id = req.body.apk._id;
  var apkObj = req.body.apk;
  var _apk;
  if (id !== 'undefined') {
    Apk.findById(id, function (err, apk) {
      if (err) {
        console.log(err);
      }
      _apk = _.extend(apk, apkObj);
      _apk.save(function (err, apk) {
        if (err) {
          console.log(err)
        }
        res.redirect('/apk/' + apk._id)
      })
    })
  } else {
    _apk = new Apk({
      doctor: apkObj.doctor,
      title: apkObj.title,
      language: apkObj.language,
      country: apkObj.country,
      year: apkObj.year,
      poster: apkObj.poster,
      flash: apkObj.flash,
      summary: apkObj.summary,

    })
    _apk.save(function (err, apk) {
      if (err) {
        console.log(err);
      }
      res.redirect('/apk/' + apk._id)
    })
  }
})

//list
app.get('/admin/list', function (req, res) {
  Apk.fetch(function (err, apks) {
    if (err) {
      console.log(err);
    }
    res.render('list', {
      title: '应用列表',
      apks: apks
    });
  })
});

//delete
app.delete('/admin/list', function (req, res) {
  var id = req.query.id
  if (id) {
    Apk.remove({
      _id: id
    }, function (err, apk) {
      if (err) {
        console.log(err);
      } else {
        res.json({
          success: 1
        })
      }
    })
  }
})
