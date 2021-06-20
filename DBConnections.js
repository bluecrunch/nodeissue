var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'host',
  user     : 'user',
  password : 'pw',
  database : 'db'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Database connected!");
});


module.exports = {connection};
