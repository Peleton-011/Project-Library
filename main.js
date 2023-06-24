let id = 0;

const books = [];

class Book {
    constructor (
        title,
        author,
        pageLen,
        isRead,
        coverImg,
        description,
        id
    ) {
        this.title = typeof (title) !== "string" ? "Untitled" : title;
        this.author = typeof (author) !== "string" ? "Anonymous" : author;
        this.pageLen = typeof (pageLen) !== "number" ? null : pageLen;
        this.isRead = typeof (isRead) !== "boolean" ? false : isRead;
        this.info = () => {
            let readStatus = this.isRead ? "already read" : "not read yet";
            return `${this.title} by ${this.author}, ${this.pageLen} pages, ${readStatus}`;
        };
        this.coverImg = typeof (coverImg) !== "string" ? "" : coverImg;
        this.description =
        typeof (description) !== "string"
            ? "Read to find out more!"
            : description;
        this.id = typeof (id) !== "number" ? newId() : id;
        };
}

function setup() {
    //Add sample books to library
    sampleBooks();
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
        bookCanvas.insertAdjacentHTML("beforeend", `<div class="newButtonContainer popIn">
            <button class="book book-add popOut-button">Add a new book</button>
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
    const desc = book.description ? book.description : "";
    const newBooksHTML = `
    <div class="book popIn" id="id${book.id}">
    <div class="background" style="background-image: url(${book.coverImg})"></div>
    <div class="book-nav">
        <button class="book-isRead ${book.isRead ? "isRead" : ""} poppy-button">
        </button>
        <button class="book-delete poppy-button"></button>
    </div>
    <div class="book-info">
        <h3 class="book-title">${book.title} - ${book.author}</h3>
        <p class="book-description">${desc}</p>
        <p class="book-pageLen">${book.pageLen ? book.pageLen + " pgs" : ""
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

    //Clamp titles
    const titles = Array.from(document.querySelectorAll(".book-title"));
    for (let i = 0; i < titles.length; i++) {
        const title = titles[i];
        $clamp(title, {clamp: 2});
    }
    //Clamp descriptions
    const descriptions = Array.from(document.querySelectorAll(".book-description"));
    for (let i = 0; i < descriptions.length; i++) {
        const desc = descriptions[i];
        $clamp(desc, {clamp: 3});    
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

function sampleBooks() {
    addBookToLibrary("The Banquet", "Plato", 296, false, `data:image/jpeg;base64,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`, `It depicts a friendly contest of extemporaneous speeches given by a group of notable men attending a banquet. The men include the philosopher Socrates, the general and political figure Alcibiades, and the comic playwright Aristophanes.`)
    addBookToLibrary("On truth and lies in a Nonmoral Sense")
}

//Add random books to library

function randomBooks(amt) {
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
                        Title must be shorter than 40 characters
                    </p>
                </div>

                <div class="input-group">
                    <label for="author">Author:</label>
                    <input
                        type="text"
                        name="author"
                        id="author"
                        maxlength="40"
                        placeholder="Plato"
                    />
                    <p>
                        Author must be shorter than 40 characters
                    </p>
                </div>

                <div class="input-group">
                    <label for="desc">Description:</label>
                    <br />
                    <textarea
                        class="neumorph"
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
                        max="10000"
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
                        type="url"
                        name="imgUrl"
                        id="img-url"
                        placeholder="https://www.images.net/myImages/02"
                    />
                </div>
            </form>
            <button class="neumorph" id="submit">Add Book</button>
        </div>`;
    bookCanvas.insertAdjacentHTML("beforeend", formHTML);
    document.getElementById("title").oninput = checkTitle
    document.getElementById("author").oninput = checkAuthor
    document.getElementById("desc").oninput = checkDesc
    document.getElementById("page-len").oninput = checkLen
    document.getElementById("img-url").oninput = checkURL

}

function checkTitle() {
    const title = document.getElementById("title");
    
    if (!title.value) {
        return;
    }

    const textyRegex = /^[\w\s-]{1,}$/gi;

    //Check
    const validity = textyRegex.test(title.value) ? "" : "The title must only contain characters from the following: Letters, numbers, hyphens, underscores and spaces."
    title.setCustomValidity(validity)
}

function checkAuthor() {
    const author = document.getElementById("author");
    
    if (!author.value) {
        return;
    }

    const textyRegex = /^[\w\s-]{1,}$/gi;

    //Check
    const validity = textyRegex.test(author.value) ? "" : "The author must only contain characters from the following: Letters, numbers, hyphens, underscores and spaces."
    author.setCustomValidity(validity)
}

function checkDesc() {
    const desc = document.getElementById("desc");
    
    if (!desc.value) {
        return;
    }
    
    const textyRegex = /^[\w\s-]{1,}$/gi;

    //Check
    const validity = textyRegex.test(desc.value) ? "" : "The description must only contain characters from the following: Letters, numbers, hyphens, underscores and spaces."
    desc.setCustomValidity(validity)
}

function checkLen() {
    const length = document.getElementById("page-len");
    
    if (!length.value) {
        return;
    }
    
    const numRegex = /^\d*$/g;

    //Check
    const validity = numRegex.test(length.value) ? "" : "The length must contain only numbers."
    length.setCustomValidity(validity)
}

function checkURL() {
    const url = document.getElementById("img-url");
    
    if (!url.value) {
        return;
    }

    const urlRegex = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;

    //Check
    const validity = urlRegex.test(url.value) ? "" : "This URL is invalid. Try using a different URL.";
    url.setCustomValidity(validity)
}


//Plays an animation designed to indicate being pressed

function pressAnimation(target) { }

setup();
