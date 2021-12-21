let bookList = [
  {
    id: 1,
    title: 'The Alchemist',
    genre: 'sf',
    price: 450,
    likes: 0,
    isFav: true,
  },
];
let favouriteBooks = [];
function getBooks() {
  // return fetch('http://localhost:3000/books')
  //   .then((response) => {
  //     if (response.ok) {
  //       return response.json();
  //     } else if (response.status == 404) {
  //       return Promise.reject(new Error('Invalid URL'));
  //     } else if (response.status == 401) {
  //       return Promise.reject(new Error('UnAuthorized User...'));
  //     } else {
  //       return Promise.reject(new Error('Internal Server Error'));
  //     }
  //   })
  //   .then((bookListResponse) => {
  //     bookList = bookListResponse;
  //     displayBooks(bookList,'bookList');
  //     getFavourites();
  //     return bookList;
  //   })
  //   .catch((error) => {
  //     return error;
  //   });
  displayBooks(bookList, 'bookList');
  getFavourites();
  return bookList;
}

function getFavourites() {
  favouriteBooks = bookList.filter((books) => books.isFav);
  displayBooks(favouriteBooks, 'favouritesList');
}

function addFavourite(id) {
  let book = bookList.find((book) => book.id === id);
  let existingFav = favouriteBooks.find((favBook) => {
    if (favBook.id == book.id) {
      return favBook;
    }
  });
  if (existingFav) {
    return Promise.reject(new Error('Movie is already added to favourites'));
  }
  // else {
  //     return fetch(`http://localhost:3000/books`, {
  //       method: 'PUT',
  //       headers: {
  //         'content-type': 'application/json',
  //       },
  //       body: JSON.stringify({ ...book, isFav: true }),
  //     })
  //       .then((response) => {
  //         if (response.ok) {
  //           return response.json();
  //         }
  //       })
  //       .then((book) => {
  //         favouriteBooks.push(book);
  //         displayBooks(favouriteBooks,'favouritesList');
  //         return favouriteBooks;
  //       });
  //   }
  favouriteBooks.push(book);
  displayBooks(favouriteBooks, 'favouritesList');
  return favouriteBooks;
}

function displayBooks(list, element) {
  const ele = document.getElementById(element);
  let htmlString = '';

  list.forEach((book) => {
    htmlString += `
			  <li>
            <div>${book.title}</div>
			      <div>${book.genre}</div>
			      <div>${book.price}</div>
            <div class="actions">
              <span id="${book.id}-likes">Likes : ${book.likes}</span>`;
    if (element === 'bookList') {
      htmlString += `<div class="actions"><button class="btn btn-primary" onclick="addFavourite(${book.id})">Add to favourites</button><button onclick="likeBook(${book.id})">Like</button></div>`;
    }
    htmlString += `</div></li>`;
  });

  ele.innerHTML = htmlString;
}

function addBook() {
  const title = document.getElementById('book-title').value;
  const genre = document.getElementById('book-genre').value;
  const price = document.getElementById('price').value;
  const id = bookList.length + 1;

  const bookExist = bookList.find((book) => book.title === title);

  console.log({ bookExist });
  const book = { id, title, genre, price, isFav: false, likes: 0 };
  if (bookExist) {
    alert('Book already exist');
    return Promise.reject(new Error('Book already exist'));
  }
  //else {
  //     return fetch(`http://localhost:3000/books`, {
  //       method: 'POST',
  //       headers: {
  //         'content-type': 'application/json',
  //       },
  //       body: JSON.stringify(book),
  //     })
  //       .then((response) => {
  //         if (response.ok) {
  //           return response.json();
  //         }
  //       })
  //       .then((addedBook) => {
  //         bookList.push(addedBook);
  //         displayBooks(bookList,'bookList');
  //         return bookList;
  //       });
  //   }
  bookList.push(book);
  displayBooks(bookList, 'bookList');
  return bookList;
}

likeBook = (id) => {
  let book = bookList.find((book) => book.id === id);
  book['likes'] = book['likes'] + 1;
  updateBook(book, (update) => {
    if (update.status === 'SUCCESS') {
      let likeLabel = document.getElementById(`${id}-likes`);
      likeLabel.textContent = book['likes'];
    }
  });
};

function updateBook(book, update) {
  // return fetch(`http://localhost:3000/books`, {
  //       method: 'PUT',
  //       headers: {
  //         'content-type': 'application/json',
  //       },
  //       body: JSON.stringify(book),
  //     })
  //       .then((response) => {
  //         if (response.ok) {
  //           return response.json();
  //         }
  //       })
  //       .then((book) => {
  //         update('SUCCESS');
  //         return book;
  //       });
  update('SUCCESS');
}

module.exports = {
  getBooks,
};
