let bookList = [
  {
    id: 1,
    title: 'The Alchemist',
    genre: 'sf',
    price: 450,
    likes: 5,
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
  //  bookList = bookList.map(b=> {
  //    if(b.id ===book.id){
  //      b.isFav = book.isFav;
  //    }
  //    return b;
  //  })
  //         displayBooks(favouriteBooks,'favouritesList');
  //         return favouriteBooks;
  //       });
  //   }
  favouriteBooks.push(book);
  bookList = bookList.map((b) => {
    if (b.id === book.id) {
      b.isFav = book.isFav;
    }
    return b;
  });
  displayBooks(favouriteBooks, 'favouritesList');
  return favouriteBooks;
}

function displayBooks(list, element) {
  const ele = document.getElementById(element);
  let htmlString = '';

  list.forEach((book) => {
    htmlString += `
    <div class="card">
    <div class="card-header">${book.title}</div>
    <div class="card-body">
      <div><strong>Genre: </strong> ${book.genre}</div>
      <div><strong>Price: </strong>${book.price}<sub>INR</sub></div>
    </div>`;
    if (element === 'bookList') {
      htmlString += `
      <div class="card-footer bg-transparent border-success">
      <button type="button" onclick="likeBook(${book.id})" class="btn btn-success position-relative">
      ${likeSvg}
  <span class="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger" id="${book.id}-likes">
    ${book.likes}
  </span>
</button>
      <button class="btn btn-primary" onclick="addFavourite(${book.id})">${favIcon}</button>
      <button class="btn btn-primary" onclick="editBook(${book.id})">${editIcon}</button>
      <button class="btn btn-danger" onclick="removeBook(${book.id})">${deleteIcon}</button>`;
    }
    htmlString += `</div>
      </div>
    </div>`;
  });

  ele.innerHTML = htmlString;
}

function addBook() {
  const title = document.getElementById('book-title').value;
  const genre = document.getElementById('book-genre').value;
  const price = document.getElementById('price').value;

  const id = bookList.length + 1;

  const bookExist = bookList.find((book) => book.title === title);

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
  // cancelUpdate();

  //         return bookList;
  //       });
  //   }
  bookList.push(book);
  displayBooks(bookList, 'bookList');
  cancelUpdate();
  return bookList;
}

likeBook = (id) => {
  let book = bookList.find((book) => book.id === id);
  book['likes'] = book['likes'] + 1;
  updateBook(book, (update) => {
    if (update.status === 'SUCCESS') {
      bookList
        .filter((b) => b.id === book.id)
        .forEach((b) => (b.likes = book.likes));
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
  //         update({status:'SUCCESS'});
  //         return book;
  //       });
  update({ status: 'SUCCESS' });
}

function editBook(id) {
  let book = bookList.find((book) => book.id === id);
  document.getElementById('book-title').value = book.title;
  document.getElementById('book-genre').value = book.genre;
  document.getElementById('price').value = book.price;
  const formActions = document.getElementById('form-action');

  formActions.innerHTML = getFormActionTemplate(id);
}

function getFormActionTemplate(id) {
  let htmlString = `<button class="btn btn-primary" type="button" onclick="cancelUpdate()">
  cancel
</button> <button class="btn btn-primary" type="button" onclick="update(${id})">
  Update Book
</button>`;

  return htmlString;
}

function cancelUpdate() {
  document.getElementById('book-title').value = '';
  document.getElementById('book-genre').value = '';
  document.getElementById('price').value = '';
  const formActions = document.getElementById('form-action');

  formActions.innerHTML = `<button class="btn btn-primary" type="button" onclick="addBook()">
  Save Book
</button>`;
}

function update(id) {
  let book = bookList.find((book) => book.id === id);
  const title = document.getElementById('book-title').value;
  const genre = document.getElementById('book-genre').value;
  const price = document.getElementById('price').value;
  const updatedBook = {
    id,
    title,
    genre,
    price,
    isFav: book.isFav,
    likes: book.likes,
  };
  updateBook(updatedBook, (response) => {
    if (response.status === 'SUCCESS') {
      bookList = bookList.map((b) => {
        if (b.id === updatedBook.id) {
          b = Object.assign({}, updatedBook);
        }
        return b;
      });
      displayBooks(bookList, 'bookList');
      cancelUpdate();
      return bookList;
    }
  });
}

function removeBook(id) {
  let book = bookList.find((book) => book.id === id);
  // return fetch(`http://localhost:3000/books`, {
  //       method: 'DELETE',
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
  //  displayBooks(bookList,'bookList');
  //         return book;
  //       });
  bookList = bookList.filter((b) => b.id !== book.id);
  displayBooks(bookList, 'bookList');
}

const likeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
<path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
</svg>`;

const deleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
</svg>`;

const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
<path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
</svg>`;

const favIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
<path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
</svg>`;

module.exports = {
  getBooks,
};
