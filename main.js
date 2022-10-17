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
    (this.title = String(title)),
        (this.author = String(author)),
        (this.pageLen = Number(pageLen)),
        (this.isRead = Boolean(isRead)),
        (this.info = () => {
            let readStatus = this.isRead ? "already read" : "not read yet";
            return `${this.title} by ${this.author}, ${this.pageLen} pages, ${readStatus}`;
        });
    this.coverImg = String(coverImg) || null;
    this.description = String(description) || null;
    this.id = id || newId();
};

function addBookToLibrary(title, author, pageLen, isRead, coverImg) {
    books.push(new Book(title, author, pageLen, isRead, coverImg));
}

function displayBooks() {
    let html = "";
    for (let i = 0; i < books.length; i++) {
        let book = books[i];
        let desc = book.description
            ? `<p class="book-description">${book.description}</p>`
            : "c";
        html += `
            <div class="book" id="id${book.id}" style="background-image: ${
            book.coverImg
        }">
            <div class="buttons">
                <button class="book-isRead ${book.isRead ? "isRead" : ""}"></button>
                <button class="book-delete">Del</button>
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title} - ${book.author}</h3>
                ${desc}
                <p class="book-pageLen">${book.pageLen}</p>
            </div>
            </div>
        `;
        //Add to dom
        document.getElementById("book-list").innerHTML = html;
    }
    //Add event listeners
    addEvents();
}

//Add event listeners

function addEvents () {
    // Delete book button
    const delBtns = document.querySelectorAll(".book-delete");
    for (let i = 0; i < delBtns.length; i++) {
        const btn = delBtns[i]
        btn.addEventListener("click", () => {
            const id = Number((btn.closest(".book").id).replace(/[^0-9]/g, ''));
            books.splice(getIndexById(id), 1);
            displayBooks();
        });
    }

    // Read/Not-Read toggle button
    const readBtns = document.querySelectorAll(".book-isRead");
    for (let i = 0; i < readBtns.length; i++) {
        const btn = readBtns[i]
        btn.addEventListener("click", () => {
            const id = Number((btn.closest(".book").id).replace(/[^0-9]/g, ''));
            const book = getBookById(id);
            book.isRead =!book.isRead;
            btn.classList.toggle("isRead");
        });
    }
}

function newId() {
//    console.log(`${books[books.length - 1].id} => ${parseInt(books[books.length - 1].id)}`);
    id++;
    return id;
    //`id${books[books.length - 1] ? parseInt(books[books.length - 1].id) + 1 : 0}`;
}

// Get the book by id

function getBookById(id) {
    const index = books.findIndex(book => book.id == id )
    return books[index];
}

// Get the index by id 

function getIndexById(id) {
    const index = books.findIndex(book => book.id == id )
    return index;
}

// Get the book by title

function getBookByTitle(title) {
    const index = books.findIndex(book => book.title == title )
    return books[index];
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

//Add sample books to library
sampleBooks(10);
displayBooks();