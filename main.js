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
    const newBooksById = [];
    for (let i = 0; i < books.length; i++) {
        let book = books[i];
        if (document.querySelector(`#id${book.id}`)) {
            continue;
        }
        newBooksById.push(book.id);
        let desc = book.description ? book.description : "...";
        html += `
            <div class="book" id="id${book.id}" style="background-image: url(${
            book.coverImg
        })">
            <div class="book-nav">
                <button class="book-isRead ${book.isRead ? "isRead" : ""}">
                </button>
                <button class="book-delete"></button>
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
    document.getElementById("book-list").innerHTML = html + newBookBtn;
    //Pop-in effect
    for (let i = 0; i < newBooksById.length; i++ ) {
        popIn(`#id${newBooksById[i]}`);
    }
        //Add line clamping to book descriptions
    const descriptions = document.querySelectorAll("p.book-description");
    for (let i = 0; i < descriptions.length; i++) {
        $clamp(descriptions[i], { clamp: 2 });
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
        btn.addEventListener("mousedown", async () => {
            const thisBook = btn.closest(".book");
            const id = Number(thisBook.id.replace(/[^0-9]/g, ""));
            books.splice(getIndexById(id), 1);
            popOut(thisBook)
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
        popIn("#form-popup");
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

//Add sample books to library

function sampleBooks(amt) {
    for (let i = 0; i < amt; i++) {
        addBookToLibrary(
            "Book " + i,
            "Author " + i,
            i,
            i % 2 == 0
        );
    }
}

//Delay function

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

//Appear using the pop animation

async function popIn(selector) {
    console.log(selector)
    const elements = selector === String(selector) ? document.querySelectorAll(selector) : [selector];
    console.log(elements)
    for (let i = 0; i < elements.length; i++) {
        console.log(i);
        console.log(elements[i])
        elements[i].style.display = "flex";
        elements[i].classList.add("popIn");
    }
    await delay(500);
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove("popIn");
    }
}

//Disappar using the pop animation

async function popOut(selector) {
    const elements = selector === String(selector) ? document.querySelectorAll(selector) : [selector];
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add("popOut");
    }
    await delay(500);
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove("popOut");
        elements[i].style.display = "none";
    }
}


setup();
