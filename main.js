let id = 0;

const books = [];

const Book = function (
    title,
    author,
    pageLen,
    isRead,
    coverImg,
    description,
    id
) {
    (this.title = String(title) || "Untitled"),
        (this.author = String(author) || "Anonymous"),
        (this.pageLen = Number(pageLen)),
        (this.isRead = Boolean(isRead) || false),
        (this.info = () => {
            let readStatus = this.isRead ? "already read" : "not read yet";
            return `${this.title} by ${this.author}, ${this.pageLen} pages, ${readStatus}`;
        });
    this.coverImg = String(coverImg) || null;
    this.description =
        description === undefined
            ? "Lorem ipsum dolor sit amet watever watever watever and this should almost certainly not be visible to anyone"
            : String(description);
    this.id = id || newId();
};

function setup() {
    // Close form button
    const closeBtn = document.querySelector("#form-top > #close");
    closeBtn.addEventListener("click", () => {
        hideNewBookForm();
    });

    // Submit button
    const submitBtn = document.querySelector("#submit");
    submitBtn.addEventListener("click", () => {
        const form = document.getElementById("new-book");
        const formData = new FormData(form);

        addBookToLibrary(
            formData.get("title"),
            formData.get("author"),
            formData.get("pageLen"),
            formData.get("isRead"),
            formData.get("imgUrl"),
            formData.get("desc")
        );
        hideNewBookForm();
    });

    //Add sample books to library
    sampleBooks(10);
    displayBooks();
}

function addBookToLibrary(
    title,
    author,
    pageLen,
    isRead,
    coverImg,
    description
) {
    books.push(new Book(title, author, pageLen, isRead, coverImg, description));
    displayBooks();
}

function displayBooks() {
    let html = "";
    const newBookBtn = `<button class="book book-add">+</div>`;
    for (let i = 0; i < books.length; i++) {
        let book = books[i];
        let desc = book.description ? book.description : "...";
        html += `
            <div class="book" id="id${book.id}" style="background-image: url(${
            book.coverImg
        })">
            <div class="book-nav">
                <button class="book-isRead ${
                    book.isRead ? "isRead" : ""
                }"></button>
                <button class="book-delete">Del</button>
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title} - ${book.author}</h3>
                <p class="book-description truncate-overflow fade">${desc}</p>
                <p class="book-pageLen">${
                    book.pageLen ? book.pageLen + " pgs" : "length unknown"
                }</p>
            </div>
            </div>
        `;
        //Add to dom
        document.getElementById("book-list").innerHTML = html + newBookBtn;
    }
    //Add event listeners
    addEvents();
}

//Add book event listeners

function addEvents() {
    // Delete book button
    const delBtns = document.querySelectorAll(".book-delete");
    for (let i = 0; i < delBtns.length; i++) {
        const btn = delBtns[i];
        btn.addEventListener("click", () => {
            const id = Number(btn.closest(".book").id.replace(/[^0-9]/g, ""));
            books.splice(getIndexById(id), 1);
            displayBooks();
        });
    }

    // Read/Not-Read toggle button
    const readBtns = document.querySelectorAll(".book-isRead");
    for (let i = 0; i < readBtns.length; i++) {
        const btn = readBtns[i];
        btn.addEventListener("click", () => {
            const id = Number(btn.closest(".book").id.replace(/[^0-9]/g, ""));
            const book = getBookById(id);
            book.isRead = !book.isRead;
            btn.classList.toggle("isRead");
        });
    }

    // New-book button
    const newBookBtn = document.querySelector(".book-add");
    newBookBtn.addEventListener("click", () => {
        displayNewBookForm();
    });
}

function newId() {
    //    console.log(`${books[books.length - 1].id} => ${parseInt(books[books.length - 1].id)}`);
    return id++;
    //`id${books[books.length - 1] ? parseInt(books[books.length - 1].id) + 1 : 0}`;
}

// Get the book by id

function getBookById(id) {
    const index = books.findIndex((book) => book.id == id);
    return books[index];
}

// Get the index by id

function getIndexById(id) {
    const index = books.findIndex((book) => book.id == id);
    return index;
}

// Get the book by title

function getBookByTitle(title) {
    const index = books.findIndex((book) => book.title == title);
    return books[index];
}

// Display the new book form

function displayNewBookForm() {
    const form = document.getElementById("form-popup");
    form.style.display = "block";
}

// Hide the new book form

function hideNewBookForm() {
    const form = document.getElementById("form-popup");
    form.style.display = "none";
}

//Add sample books to library

function sampleBooks(amt) {
    for (let i = 0; i < amt; i++) {
        addBookToLibrary(
            "Book " + i,
            "Author " + i,
            i,
            i % 2 == 0,
            "https://picsum.photos/id/" + i
        );
    }
}

setup();
