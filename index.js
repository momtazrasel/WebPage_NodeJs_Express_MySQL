const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_form'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/submit', (req, res) => {
  const { firstName, lastName, phone, address, age } = req.body;

  if (age.length === 2 && phone.length === 8 && !isNaN(age) && !isNaN(phone)) {
    const query = 'INSERT INTO users (first_name, last_name, phone, address, age) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [firstName, lastName, phone, address, age], (err, result) => {
      if (err) {
        console.error('Error inserting data into database:', err);
        res.sendStatus(500);
      } else {
        console.log('Data inserted into database');
        res.sendStatus(200);
      }
    });
  } else {
    res.sendStatus(400);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
