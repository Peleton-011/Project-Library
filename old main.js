let id = 0;

const form = document.getElementById("form-popup");
form.parentElement.removeChild(form);

const books = [];

const Book = function (
    title,
    author,
    pageLen,
    isRead,
    coverImg,,,,n
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
    console.log(typeof(books[0]));
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
}

function displayBooks() {
    const bookList = document.getElementById("book-list");
    //Remove add book button
    const newBookBtn = document.querySelector(".book.book-add");
    newBookBtn && popOut(newBookBtn);
    //Find displayed books
    const displayedBooksId = [];
    const correctlyDisplayed = [];
    const toDelete = [];
    const toAdd = [];
    for (let i = 0; i < bookList.children.length; i++) {
        displayedBooksId.push(
            Number(bookList.children[i].id.replace(/[^0-9]/g, ""))
        );
    }
    for (let i = 0; i < displayedBooksId.length; i++) {
        for (let j = 0; j < books.length; j++) {
            if (displayedBooksId[i] == books[j].id) {
                correctlyDisplayed.push(displayedBooksId[i]);
                continue;
            }
        }
        //Delete books which are being displayed but are not inside the books[] array
        toDelete.push(displayedBooksId[i]);
    }
    for (let i = 0; i < books.length; i++) {
        for (let j = 0; j < correctlyDisplayed.length; j++) {
            if (books[i].id == correctlyDisplayed[j]) {
                continue;
            }
        }
        //Add books which are inside the books[] array but not being displayed
        toAdd.push(books[i].id);
    }

    //Actually add and delete books
    console.log("Adding");
    console.log(toAdd);
    console.log("Deleting");
    console.log(toDelete);
    removeBooks(toDelete);
    addBooks(toAdd);

    async function removeBooks(ids) {
        for (let i = 0; i < ids.length; i++) {
            const target = idToSelector(ids [i]);
            await popOut(target);
            const targets = selectorOrElemToArr(target);
            for (let j = 0; j < targets.length; j++) {
                bookList.removeChild(targets[j]);
            }
        }
    }

    async function addBooks(ids) {
        //Make new books html
        let newBooksHTML = "";
        for (let i = 0; i < ids.length; i++) {
            const book = getBookById(ids[i]);
            const desc = book.description ? book.description : "...";
            newBooksHTML += `
            <div class="book" id="id${book.id}" style="background-image: url(${
                book.coverImg
            })">
            <div class="book-nav">
                <button class="book-isRead ${
                    book.isRead ? "isRead" : ""
                } poppy-button">
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
        }

        //Add to dom
        bookList.innerHTML += `${newBooksHTML} <div class="newButtonContainer">
            <button class="book book-add popOut-button">+</button>
            </div>`;
        for (let i = 0; i < ids.length; i++) {
            popIn(idToSelector(ids[i]));
        }
        await popIn(".book.book-add");
        //Add line clamping to book descriptions
        const descriptions = document.querySelectorAll("p.book-description");
        for (let i = 0; i < descriptions.length; i++) {
            $clamp(descriptions[i], { clamp: 2 });
        }

        //Add event listeners
        addEvents();
    }
}

//Add book event listeners

function addEvents() {
    // Delete book button
    const delBtns = document.querySelectorAll(".book-delete");
    for (let i = 0; i < delBtns.length; i++) {
        const btn = delBtns[i];
        btn.addEventListener("mousedown", async () => {
            const thisBook = btn.closest(".book");
            const id = Number(thisBook.id.replace(/[^0-9]/g, ""));
            books.splice(getIndexById(id), 1);
            popOut(idToSelector(id));
        });
    }

    // Read/Not-Read toggle button
    const readBtns = document.querySelectorAll(".book-isRead");
    for (let i = 0; i < readBtns.length; i++) {
        const btn = readBtns[i];
        btn.addEventListener("mousedown", async () => {
            const id = Number(btn.closest(".book").id.replace(/[^0-9]/g, ""));
            const book = getBookById(id);
            book.isRead = !book.isRead;
            await delay(250);
            btn.classList.toggle("isRead");
        });
    }

    // New-book button
    const newBookBtn = document.querySelector(".book-add");
    newBookBtn.addEventListener("click", () => {
        const bookList = document.getElementById("book-list");
        bookList.appendChild(form);
        popIn("#form-popup");
        newBookFormSetup();
    });
}

//General setup for the newBook form

function newBookFormSetup () {
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
    const targets = [...document.querySelectorAll(selector)];
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        target.classList.add("popIn");
        await delay(500);
        target.classList.remove("popIn");
    }
}

//Disappar using the pop animation

async function popOut(selector, isKept) {
    const targets = [...document.querySelectorAll(selector)];
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

function idToSelector(id) {
    return `#id${id}`;
}

//If target is a string, use it as a selector, otherwise treat it as a DOM object

// function selectorOrElemToArr(target) {
//     return target === String(target)
//         ? Array.from(document.querySelectorAll(target))
//         : [target];
// }

//Plays an animation designed to indicate being pressed

function pressAnimation(target) {}

setup();
