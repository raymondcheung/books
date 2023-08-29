const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { check } = require('express-validator');

const app = express();
const port = process.env.PORT || 3000;

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost', // Change this to your MySQL server's host
  user: 'root', // Change this to your MySQL username
  password: 'root', // Change this to your MySQL password
  database: 'Booklist', // Change this to your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('MySQL connection error: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Create a new book
app.post('/books', [
  check('title', "Title needs to be at least one character").isLength({ min: 1 }).trim().escape(),
  check('author', "Author needs to be at least three characters").isLength({min: 3}).escape(),
  check('publication_year', "Publication Year needs to be numeric").isNumeric().trim().escape() // This is treating the year 1 BC, as -1
], (req, res) => {
  const { title, author, publication_year } = req.body;
  const insertQuery = 'INSERT INTO Books (title, author, publication_year) VALUES (?, ?, ?)';

  db.query(insertQuery, [title, author, publication_year], (err, result) => {
    if (err) {
      console.error('Error creating book: ' + err.stack);
      res.status(500).send('Error creating book');
    } else {
      res.status(201).json({ message: 'Book created successfully', bookId: result.insertId });
    }
  });
});

// Retrieve all books
app.get('/books', (req, res) => {
  const selectQuery = 'SELECT * FROM Books';

  db.query(selectQuery, (err, result) => {
    if (err) {
      console.error('Error retrieving books: ' + err.stack);
      res.status(500).send('Error retrieving books');
    } else {
      res.status(200).json(result);
    }
  });
});

// Retrieve a book by ID
app.get('/books/:id', [
  param('book_id', "Book ID needs to be numeric value").isNumeric().trim().escape(),
], (req, res) => {
  const bookId = req.params.id;
  const selectQuery = 'SELECT * FROM Books WHERE book_id = ?';

  db.query(selectQuery, [bookId], (err, result) => {
    if (err) {
      console.error('Error retrieving book: ' + err.stack);
      res.status(500).send('Error retrieving book');
    } else if (result.length === 0) {
      res.status(404).json({ message: 'Book not found1' });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

// Update a book by ID
app.put('/books/:id', [
  param('book_id', "Book ID needs to be numeric value").isNumeric().trim().escape(),
  check('title', "Title needs to be at least one character").isLength({ min: 1 }).trim().escape(),
  check('author', "Author needs to be at least three characters").isLength({min: 3}).escape(),
  check('publication_year', "Publication Year needs to be numeric").isNumeric().trim().escape() // This is treating the year 1 BC, as -1
], (req, res) => {
  const bookId = req.params.id;
  const { title, author, publication_year } = req.body;
  const updateQuery = 'UPDATE Books SET title = ?, author = ?, publication_year = ? WHERE book_id = ?';

  db.query(updateQuery, [title, author, publication_year, bookId], (err, result) => {
    if (err) {
      console.error('Error updating book: ' + err.stack);
      res.status(500).send('Error updating book');
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Book not found2' });
    } else {
      res.status(200).json({ message: 'Book updated successfully' });
    }
  });
});

// Delete a book by ID
app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const deleteQuery = 'DELETE FROM Books WHERE book_id = ?';

  db.query(deleteQuery, [bookId], (err, result) => {
    if (err) {
      console.error('Error deleting book: ' + err.stack);
      res.status(500).send('Error deleting book');
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Book not found3' });
    } else {
      res.status(200).json({ message: 'Book deleted successfully' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});