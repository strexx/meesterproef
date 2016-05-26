var fs = require('fs'),
    express = require('express'),
    moment = require('moment'),
    checklogin = require('../../../modules/checklogin.js'),
    isValidDate = require('../../../modules/isValidDate.js'),
    router = express.Router();

    router.get('/:slideshowID', function(req, res, next) {
        if (req.session.email) {
            req.getConnection(function(err, connection) {
                var sql = 'SELECT id, discription, posters FROM slideshows';
                // Get the user id using username
                connection.query(sql, function(err, match) {
                    if (err) {
                        throw err;
                    }

                    if (match !== '' && match.length > 0) {
                        res.render('admin/slideshows/show', {
                            title: 'Home',
                            logedin: checklogin(req.session),
                            data: match
                        });
                    }else{
                      res.render('admin/slideshows/show', {
                          title: 'Home',
                          logedin: checklogin(req.session),
                          error: 'You have no displays jet',
                          data: match
                      });
                    }
                });
            });
        } else {
            res.redirect('/users/login');
        }
    });

module.exports = router;
