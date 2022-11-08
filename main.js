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
    this.title = typeof (title) !== "string" ? "Untitled" : title,
        this.author = typeof (author) !== "string" ? "Anonymous" : author,
        this.pageLen = typeof (pageLen) !== "number" ? "length unknown" : pageLen,
        this.isRead = typeof (isRead) !== "boolean" ? false : isRead,
        this.info = () => {
            let readStatus = this.isRead ? "already read" : "not read yet";
            return `${this.title} by ${this.author}, ${this.pageLen} pages, ${readStatus}`;
        },
        this.coverImg = typeof (coverImg) !== "string" ? "" : coverImg,
        this.description =
        typeof (description) !== "string"
            ? "Read to find out more!"
            : description,
        this.id = typeof (id) !== "number" ? newId() : id
};

function setup() {
    //Add sample books to library
    sampleBooks(10);
    displayBooks(books);
    addEvents();

    // setTimeout(() => {
    //     const initBooks = Array.from(document.querySelectorAll(".book"));
    //     for (let i = 0; i < initBooks.length; i++) {
    //         const initBook = initBooks[i];
    //         initBook.classList.remove("popIn");
    //     }
    // }, 500);
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
    if (!books.length) {
        books = new Array(books);
    }

    const bookCanvas = document.getElementById("book-list");

    //Remove add book button
    const newBookBtn = document.querySelector(".book.book-add");
    newBookBtn && hide(newBookBtn.parentNode);

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
        }
    }

    if (!document.querySelector(".book.book-add")) {
        bookCanvas.insertAdjacentHTML("beforeend", `<div class="newButtonContainer">
            <button class="book book-add popOut-button">+</button>
        </div>
        `);
    }
    newBookBtnEvents();
}

function display(book, target) {
    target.insertAdjacentHTML("beforeend", generateBookHTML(book));
}

function hide(elem) {
    const parent = elem.parentNode;
    parent.removeChild(elem);
}

function generateBookHTML(book) {
    if (!book) {
        return "";
    }
    const desc = book.description ? book.description : "...";
    const newBooksHTML = `
    <div class="book popIn" id="id${book.id}" style="background-image: url(${book.coverImg
        })">
    <div class="book-nav">
        <button class="book-isRead ${book.isRead ? "isRead" : ""} poppy-button">
        </button>
        <button class="book-delete poppy-button"></button>
    </div>
    <div class="book-info">
        <h3 class="book-title">${book.title} - ${book.author}</h3>
        <p class="book-description">${desc}</p>
        <p class="book-pageLen">${book.pageLen ? book.pageLen + " pgs" : "length unknown"
        }</p>
    </div>
    </div>
    `;
    return newBooksHTML;
}

//Add book event listeners

function addEvents() {
    const delBtns = document.querySelectorAll(".book-delete");
    for (let i = 0; i < delBtns.length; i++) {
        const btn = delBtns[i];
        const thisBook = btn.closest(".book");
        btn.addEventListener("mousedown", async () => {
            const id = Number(thisBook.id.replace(/[^0-9]/g, ""));
            books.splice(getIndexById(id), 1);
            popOut(idToSelector(id));
        });
    }

    // Read/Not-Read toggle button
    const readBtns = document.querySelectorAll(".book-isRead");
    for (let i = 0; i < readBtns.length; i++) {
        const btn = readBtns[i];
        const thisBook = btn.closest(".book");
        btn.addEventListener("mousedown", async () => {
            const id = Number(thisBook.id.replace(/[^0-9]/g, ""));
            const book = getBookById(id);
            book.isRead = !book.isRead;
            await delay(250);
            btn.classList.toggle("isRead");
        });
    }

    //Remove popIn after animation end
    const books = Array.from(document.querySelectorAll(".book"));
    for (let i = 0; i < books.length; i++) {
        const book = books[i];
        book.addEventListener("animationend", () => {
            book.classList.remove("popIn");
        });
    }
}

//Add book event listeners
// function addEvents(book) {
//     // Delete book button
//     const delBtn = document.querySelector(
//         `#id${book.id} > .book-nav > .book-delete`
//         );
//     delBtn.addEventListener("click", (e) => {
//         console.log("poop");
//         books.splice(getIndexById(book.id), 1);
//         popOut(`#id${book.id}`);
//     });

//     // Read/Not-Read toggle button
//     const readBtn = document.querySelector(
//         `#id${book.id} > .book-nav > .book-isRead`
//     );
//     readBtn.addEventListener("click", async () => {
//         console.log("cum");
//         book.isRead = !book.isRead;
//         await delay(250);
//         readBtn.classList.toggle("isRead");
//     });

//     // To do description interaction
// }

// New-book button events
function newBookBtnEvents() {
    const newBookBtn = document.querySelector(".book-add");
    newBookBtn.addEventListener("click", () => {
        console.log("making new form");
        const bookCanvas = document.getElementById("book-list");
        addForm();
        popIn("#form-popup");
        newBookFormSetup();
    });
}

//General setup for the newBook form

function newBookFormSetup() {
    // Close form button
    const closeBtn = document.querySelector("#form-top > #close");
    closeBtn.addEventListener("click", () => {
        const form = document.getElementById("new-book");
        const inputs = Array.from(form.querySelectorAll("input"));
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            input.value = "";
        }
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
        displayBooks(books[books.length - 1]);
        addEvents();
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

function popIn(selector) {
    let targets;
    if (typeof selector === "object") {
        targets = Array.from(document.querySelectorAll(`#id${selector.id}`));
        console.log(targets);
    } else if (typeof selector === "string") {
        targets = Array.from(document.querySelectorAll(selector));
    } else {
        console.log("Error Wrong Type");
    }
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        target.classList.add("popIn");
        setTimeout(() => target.classList.remove("popIn"), 500);
    }
}

//Disappar using the pop animation

function popOut(selector, isKept) {
    let targets;
    if (typeof selector === "object") {
        targets = Array.from(document.querySelectorAll(`#id${selector.id}`));
        console.log(targets);
    } else if (typeof selector === "string") {
        targets = Array.from(document.querySelectorAll(selector));
    } else {
        console.log("Error Wrong Type");
    }

    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        target.classList.add("popOut");
        setTimeout(() => {
            target.classList.remove("popOut");
            if (!isKept) {
                target.parentElement.removeChild(target);
            }
        }, 500);
    }
}

// Get the book index from an id

function getIndexById(id) {
    const index = books.findIndex((book) => book.id == id);
    return index;
}

function getBookById(id) {
    const index = books.findIndex((book) => book.id == id);
    return books[index];
}

function idToSelector(id) {
    return `#id${id}`;
}

function addForm() {
    const bookCanvas = document.querySelector("#book-list");
    const formHTML = `
        <div id="form-popup">
            <form id="new-book">
                <div id="form-top">
                    <legend id="new-book-legend">Add Book</legend>
                    <button id="close"></button>
                </div>

                <div class="input-group">
                    <label for="title">Title:</label>
                    <input type="text" name="title" id="title" required
                    maxlength=40" placeholder="The Banquet" />
                    <p>
                        Title must not contain special characters and be
                        shorter than 40
                    </p>
                </div>

                <div class="input-group">
                    <label for="author">Author:</label>
                    <input
                        type="text"
                        name="author"
                        id="author"
                        maxlength="20"
                        placeholder="Plato"
                    />
                    <p>
                        Author must not contain special characters and be
                        shorter than 40
                    </p>
                </div>

                <div class="input-group">
                    <label for="desc">Description:</label>
                    <br />
                    <textarea
                        name="desc"
                        id="desc"
                        rows="6"
                        maxlength="100"
                        placeholder="Add a short description in 100 characters o less"
                    ></textarea>
                </div>

                <div class="input-group">
                    <label for="page-len">Length in pages:</label>
                    <input
                        type="number"
                        name="pageLen"
                        id="page-len"
                        placeholder="296"
                    />
                    <p>Length in pages must only contain numbers</p>
                </div>

                <div class="input-group checkbox">
                    <label for="is-read">Have you read it?</label>
                    <input type="checkbox" name="isRead" id="is-read" />
                </div>

                <div class="input-group">
                    <label for="img-url">Cover image URL:</label>
                    <input
                        type="text"
                        name="imgUrl"
                        id="img-url"
                        placeholder="www.images.net/myImages/02"
                    />
                </div>
            </form>
            <button id="submit">Add Book</button>
        </div>`;
    bookCanvas.insertAdjacentHTML("beforeend", formHTML);
}

//Plays an animation designed to indicate being pressed

function pressAnimation(target) { }

setup();
