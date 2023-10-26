let allBooks = [];

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser Anda tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  allBooks = JSON.parse(localStorage.getItem("BOOKS") || "[]");
  showBooks();
}

function makeBook(title, author, year, isComplete) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Penulis: " + author;

  const textYear = document.createElement("p");
  textYear.innerText = "Tahun: " + year;

  const action = document.createElement("div");
  action.classList.add("action");

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear, action);

  if (isComplete) {
    action.append(createUndoButton(), createDeleteButton());
  } else {
    action.append(
      createFinishButton(),
      createEditButton(),
      createDeleteButton()
    );
  }

  return container;
}

function createButton(buttonTypeClass, buttonText, eventListener) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.innerText = buttonText;
  button.addEventListener("click", function (event) {
    eventListener(event);
  });
  return button;
}

function createFinishButton() {
  return createButton("green", "Selesai Dibaca", function (event) {
    addBookToCompleted(event.target.parentElement.parentElement);
  });
}

function createDeleteButton() {
  return createButton("red", "Hapus Buku", function (event) {
    removeBook(event.target.parentElement.parentElement);
  });
}

function createEditButton() {
  return createButton("blue", "Edit Buku", function (event) {
    editBook(event.target.parentElement.parentElement);
  });
}

function createUndoButton() {
  return createButton("green", "Belum Selesai Dibaca", function (event) {
    undoBookFromCompleted(event.target.parentElement.parentElement);
  });
}

function updateButtonStatus() {
  const isComplete = document.getElementById("inputBookIsComplete");
  const buttonSubmit = document.getElementById("bookSubmit");
  if (isComplete.checked) {
    buttonSubmit.innerHTML = "Masukkan Buku ke rak <span>Selesai dibaca</span>";
  } else {
    buttonSubmit.innerHTML =
      "Masukkan Buku ke rak <span>Belum selesai dibaca</span>";
  }
}

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const bookObject = composeBookObject(title, author, year, isComplete);
  allBooks.push(bookObject);
  updateDataToStorage();
  showBooks();
}

function addBookToCompleted(bookElement) {
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  const textTitle = bookElement.querySelector("h3").innerText;
  const bookIndex = allBooks.findIndex((book) => book.title === textTitle);

  allBooks[bookIndex].isComplete = true;

  const textAuthor = bookElement
    .querySelectorAll("p")[0]
    .innerText.substring(9);
  const textYear = bookElement.querySelectorAll("p")[1].innerText.substring(7);

  const newBook = makeBook(textTitle, textAuthor, textYear, true);
  completeBookshelfList.append(newBook);

  bookElement.remove();
  updateDataToStorage();
}

function undoBookFromCompleted(bookElement) {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const textTitle = bookElement.querySelector("h3").innerText;
  const textAuthor = bookElement
    .querySelectorAll("p")[0]
    .innerText.substring(9);
  const textYear = bookElement.querySelectorAll("p")[1].innerText.substring(7);

  const newBook = makeBook(textTitle, textAuthor, textYear, false);
  incompleteBookshelfList.append(newBook);

  const bookIndex = allBooks.findIndex((book) => book.title === textTitle);
  allBooks[bookIndex].isComplete = false;

  bookElement.remove();
  updateDataToStorage();
}

function editBook(bookElement) {
  const title = bookElement.querySelector("h3").innerText;
  const bookIndex = allBooks.findIndex((book) => book.title === title);

  const newTitle = prompt("Masukkan judul baru", allBooks[bookIndex].title);
  const newAuthor = prompt("Masukkan penulis baru", allBooks[bookIndex].author);
  const newYear = prompt(
    "Masukkan tahun terbit baru",
    allBooks[bookIndex].year
  );

  if (newTitle !== null && newAuthor !== null && newAuthor !== null) {
    allBooks[bookIndex].title = newTitle;
    allBooks[bookIndex].author = newAuthor;
    allBooks[bookIndex].year = Number(newYear);

    updateDataToStorage();
    showBooks();
  }
}

function removeBook(bookElement) {
  const bookTitle = bookElement.querySelector("h3").innerText;
  const isConfirmed = confirm(
    `Apakah Anda yakin ingin menghapus buku "${bookTitle}"?`
  );
  if (isConfirmed) {
    const bookIndex = allBooks.findIndex((book) => book.title === bookTitle);
    allBooks.splice(bookIndex, 1);
    bookElement.remove();
    updateDataToStorage();
  }
}

function searchBooks() {
  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toUpperCase();
  const filteredBooks = allBooks.filter((book) =>
    book.title.toUpperCase().includes(searchTitle)
  );
  updateBookshelf(filteredBooks);
}

function showBooks() {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  for (book of allBooks) {
    const newBook = makeBook(
      book.title,
      book.author,
      book.year,
      book.isComplete
    );
    if (book.isComplete) {
      completeBookshelfList.append(newBook);
    } else {
      incompleteBookshelfList.append(newBook);
    }
  }
}

function updateBookshelf(books) {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  for (book of books) {
    const newBook = makeBook(
      book.title,
      book.author,
      book.year,
      book.isComplete
    );
    if (book.isComplete) {
      completeBookshelfList.append(newBook);
    } else {
      incompleteBookshelfList.append(newBook);
    }
  }
}

function composeBookObject(title, author, year, isComplete) {
  return {
    id: +new Date(),
    title,
    author,
    year: Number(year),
    isComplete,
  };
}

function updateDataToStorage() {
  localStorage.setItem("BOOKS", JSON.stringify(allBooks));
}

document.addEventListener("DOMContentLoaded", function () {
  const inputBook = document.getElementById("inputBook");
  const searchBook = document.getElementById("searchBook");
  const inputBookIsComplete = document.getElementById("inputBookIsComplete");

  inputBookIsComplete.addEventListener("change", function () {
    updateButtonStatus();
  });

  inputBook.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  searchBook.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBooks();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
