var express = require('express'),
    getSpecificData = require('../../modules/getSpecificData.js'),
    renderTemplate = require('../../modules/renderTemplate.js'),
    credentials = require('../../modules/credentials.js'),
    router = express.Router();

router.get('/', function(req, res) {
    var cr = credentials(req.session),
        general = {
            title: 'Your content',
            admin: cr.admin,
            editor: cr.editor,
            login: cr.login
        },
        sql;


    req.getConnection(function(err, connection) {
        if (general.admin) { //get count all the data and show it in the admin screen
            sql = "SELECT (SELECT COUNT(id) FROM content WHERE dateEnd > CURDATE()) AS 'content', (SELECT COUNT(id) FROM content WHERE checked = 0) AS 'uncheckedContent', (SELECT COUNT(id) FROM slideshows) AS 'slideshows', (SELECT COUNT(id) FROM content WHERE dateStart < CURDATE() AND dateEnd > CURDATE()) AS 'slideshowscontent', (SELECT COUNT(display_id) FROM displays) AS 'displays'";
        } else { //if the user is not admin only show the data from the user
            sql = 'SELECT COUNT(id) AS content FROM content WHERE userId = ? AND dateEnd > CURDATE()';
        }

        getSpecificData(sql, connection, [req.session.user_id]).then(function(rows) {
            var data = {
                general: rows[0]
            };

            //render the Template
            renderTemplate(res, req, 'admin/index', data, general, {}, false);
        }).catch(function(err) {
            renderTemplate(res, req, 'admin/index', {}, general, {}, 'there was a error with getting the data');
            throw err;
        });
    });
});

module.exports = router;
