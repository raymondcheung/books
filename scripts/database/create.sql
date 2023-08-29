CREATE DATABASE IF NOT EXISTS Booklist;
USE Booklist;

-- Create a table to store book information
CREATE TABLE Books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publication_year INT
);