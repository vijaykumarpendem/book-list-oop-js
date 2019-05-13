class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href='#' class='delete'>X</a></td>
    `;
    list.appendChild(row);
  }

  showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    setTimeout(function() {
      document.querySelector('.alert').remove();
    }, 2000);
  }

  deleteBook(target) {
    if(target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();
    const ui = new UI();
    books.forEach(function(book) {
      ui.addBookToList(book);
    })
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    const updatedBooks = books.filter((book) => book.isbn!==isbn);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
  }
}

 document.addEventListener('DOMContentLoaded', Store.displayBooks);

const form = document.getElementById('book-form');
form.addEventListener('submit', function(e) {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const isbn = document.getElementById('isbn').value;

  const book = new Book(title, author, isbn);

  const ui = new UI();
  if(title === '' || author === '' || isbn === '') {
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    ui.addBookToList(book);
    Store.addBook(book);
    ui.showAlert('Book Added!', 'success');
    ui.clearFields();
  }
  e.preventDefault();
});

const bookList = document.getElementById('book-list');
 bookList.addEventListener('click', function(e) {
   const ui = new UI();
   ui.deleteBook(e.target);
   Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
   ui.showAlert('Book removed!', 'success');
   e.preventDefault();
 })
