let id = 0;

const form = document.getElementById("form-popup");
form.parentElement.removeChild(form);

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
            ? "Read to find out more!"
            : String(description);
    this.id = id || newId();
};

function setup() {
    //Add sample books to library
    sampleBooks(10);
    displayBooks(books);
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
}

function displayBooks(
    books,
    DOMBooks = Array.from(document.getElementById("book-list").children)
) {
    if (typeof books !== "object") {
        books = [books];
    }

    const bookCanvas = document.getElementById("book-list");

    //Remove add book button
    const newBookBtn = document.querySelector(".book.book-add");
    newBookBtn && hide(newBookBtn);

    for (let i = 0; i < books.length; i++) {   
        const book = books[i];

        let alreadyDisplayed = false;
        for (let j = 0; j < DOMBooks.length; j++) {
            if (book.id === DOMBooks[j].id.replace(/[^0-9]/g, "")) {
                alreadyDisplayed = true;
                break;
            }
        }
        if (!alreadyDisplayed) {
            display(book, bookCanvas);
            addEvents(book);
        }
    }

    if (!document.querySelector(".book.book-add")) {
        bookCanvas.innerHTML += `
        <div class="newButtonContainer">
            <button class="book book-add popOut-button">+</button>
        </div>
        `;
    }
}

function display(book, target) {
    target.innerHTML += generateBookHTML(book);
    popIn(book);
}

function generateBookHTML(book) {
    if (!book) {
        return "";
    }
    const desc = book.description ? book.description : "...";
    const newBooksHTML = `
    <div class="book" id="id${book.id}" style="background-image: url(${
        book.coverImg
    })">
    <div class="book-nav">
        <button class="book-isRead ${book.isRead ? "isRead" : ""} poppy-button">
        </button>
        <button class="book-delete poppy-button"></button>
    </div>
    <div class="book-info">
        <h3 class="book-title">${book.title} - ${book.author}</h3>
        <p class="book-description">${desc}</p>
        <p class="book-pageLen">${
            book.pageLen ? book.pageLen + " pgs" : "length unknown"
        }</p>
    </div>
    </div>
    `;
    return newBooksHTML;
}

//Add book event listeners

function addEvents(book) {
    // Delete book button
    const delBtn = document.querySelector(
        `#id${book.id} > .book-nav > .book-delete`
        );
    console.log(delBtn);
    delBtn.style.border = "5px solid black";
    delBtn.addEventListener("click", () => {
        console.log("poop");
        const thisBook = delBtn.closest(".book");
        const id = Number(thisBook.id.replace(/[^0-9]/g, ""));
        books.splice(getIndexById(id), 1);
        popOut(`#id${id}`);
    });

    // Read/Not-Read toggle button
    const readBtn = document.querySelector(
        `#id${book.id} > .book-nav > .book-isRead`
    );
    readBtn.addEventListener("click", async () => {
        console.log("cum");
        const id = Number(readBtn.closest(".book").id.replace(/[^0-9]/g, ""));
        const book = books[getIndexById(id)];
        book.isRead = !book.isRead;
        await delay(250);
        readBtn.classList.toggle("isRead");
    });

    // To do description interaction
}
// New-book button events
function newBookBtnEvents() {
    const newBookBtn = document.querySelector(".book-add");
    newBookBtn.addEventListener("click", () => {
        const bookCanvas = document.getElementById("book-list");
        bookCanvas.appendChild(form);
        popIn("#form-popup");
        newBookFormSetup();
    });
}

//General setup for the newBook form

function newBookFormSetup() {
    // Close form button
    const closeBtn = document.querySelector("#form-top > #close");
    closeBtn.addEventListener("click", () => {
        popOut("#form-popup");
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
        popOut("#form-popup");
    });
}

function newId() {
    return id++;
    //`id${books[books.length - 1] ? parseInt(books[books.length - 1].id) + 1 : 0}`;
}

//Add sample books to library

function sampleBooks(amt) {
    for (let i = 0; i < amt; i++) {
        addBookToLibrary("Book " + i, "Author " + i, i, i % 2 == 0);
    }
}

//Delay function

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

//Appear using the pop animation

async function popIn(selector) {
    let targets
    if (typeof selector === "object") {
        targets = Array.from(
            document.querySelectorAll(`#id${selector.id}`)
        );
        console.log(targets);
    }
    if (typeof selector === "string") {
        targets = Array.from(document.querySelectorAll(selector));
        console.log(targets);
        console.log(selector);
    }
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        target.classList.add("popIn");
        await delay(500);
        target.classList.remove("popIn");
    }
}

//Disappar using the pop animation

async function popOut(selector, isKept) {
    if (typeof selector === "object") {
        const targets = Array.from(
            document.querySelectorAll(`#id${selector.id}`)
        );
    }
    if (typeof selector === "string") {
        const targets = [...document.querySelectorAll(selector)];
    }
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        target.classList.add("popOut");
        await delay(500);
        target.classList.remove("popOut");
        if (!isKept) {
            target.parentElement.removeChild(target);
        }
    }
}

// Get the book index from an id

function getIndexById(id) {
    const index = books.findIndex((book) => book.id == id);
    return index;
}

//Plays an animation designed to indicate being pressed

function pressAnimation(target) {}

setup();
