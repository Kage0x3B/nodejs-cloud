var mysql = require('mysql');

var connection = mysql.createConnection({
				  host     : '127.0.0.1',
          port:    '3306',
          user     : 'username',
          password : 'password',
					database: 'databasename'
          });

connection.connect(function(err) {
        if (err) throw err;
});

module.exports = connection;
