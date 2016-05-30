var express = require('express'),
    credentials = require('../../../modules/credentials.js'),
    router = express.Router();


router.get('/', function(req, res) {
    var cr = credentials(req.session),
        login = cr.login,
        admin = cr.admin;

    if (login) {
        if (admin) {
            req.getConnection(function(err, connection) {
                var sql = 'SELECT id, slideshowId, name FROM displays';
                // Get the user id using username
                connection.query(sql, function(err, match) {
                    if (err) {
                        throw err;
                    }
                    if (match !== '' && match.length > 0) {
                        res.render('admin/displays/show', {
                            title: 'Displays',
                            rights: {
                                admin: admin,
                                logedin: login
                            },
                            data: match
                        });
                    } else {
                        res.render('admin/displays/show', {
                            title: 'Displays',
                            rights: {
                                admin: admin,
                                logedin: login
                            },
                            error: 'You have no displays jet',
                            data: match
                        });
                    }
                });
            });
        } else {
            res.redirect('/admin');
        }
    } else {
        res.redirect('/users/login');
    }
});

router.get('/add', function(req, res) {
    var cr = credentials(req.session),
        login = cr.login,
        admin = cr.admin;

    if (login) {
        getDisplayNames(req, res, false, login, admin);
    } else {
        res.redirect('/users/login');
    }
});

router.post('/add', function(req, res) {
    var cr = credentials(req.session),
        login = cr.login,
        admin = cr.admin,
        body = req.body,
        name = body.name,
        slideshowId = body.slideshowId,
        now = new Date();
    if (login) {
        if (name !== undefined && name.length !== 0 && slideshowId !== null) {
            req.getConnection(function(err, connection) {
                var sqlQuery = 'INSERT INTO displays SET ?',
                    sqlValues = {
                        name: name,
                        slideshowId: slideshowId,
                        dataCreated: now
                    };

                // Insert the new photo data
                connection.query(sqlQuery, sqlValues, function(err) {
                    if (err) {
                        throw err;
                    }
                    res.redirect('/admin/displays');
                });
            });
        } else {
            getDisplayNames(req, res, 'You haven\'t filled in a name', login);
        }
    }
});

function getDisplayNames(req, res, error, login, admin) {
    req.getConnection(function(err, connection) {
        var sql = 'SELECT id, name FROM slideshows';
        // Get the user id using username
        connection.query(sql, function(err, match) {
            if (err) {
                throw err;
            }
            res.render('admin/displays/add', {
                title: 'Add a display',
                rights: {
                    admin: admin,
                    logedin: login
                },
                postUrl: '/admin/displays/add',
                error: error,
                data: match
            });
        });
    });
}


module.exports = router;
