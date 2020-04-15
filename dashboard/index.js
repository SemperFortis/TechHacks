const express = require('express');
const app = express();
let path = process.cwd();
const betterSqlite = require("better-sqlite3");
const statements = {
  selectXp: null
}

/**
 * @type {import("better-sqlite3").Database}
 */
let database = null;

app.use('/api/discord', require('./api/discord'));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

// Users profile (level, stats, etc) defaults to logged in user (or) top user if not logged in.

app.get('/', function (req, res) {
  //  Change directory to directory of bot leveling.db file.
  if (database === null) {
    database = betterSqlite("../leveling.db");
		statements.selectXp = database.prepare("SELECT xp FROM levelup WHERE user_id = ?");
  }
  res.render(path + '/Views/users', {statements, database});
});

app.use((err, req, res, next) => {
  switch (err.message) {
    case 'NoCodeProvided':
      return res.status(400).send({
        status: 'ERROR',
        error: err.message,
      });
    default:
      return res.status(500).send({
        status: 'ERROR',
        error: err.message,
      });
  }
});

app.listen(8000, '0.0.0.0', function () {
  console.log("Listening on Port 8000")
});