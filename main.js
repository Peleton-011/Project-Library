const books = [];

const Book = function (title, author, pageLen, isRead, coverImg, description) {
    this.title = String(title),
    this.author = String(author),
    this.pageLen = Number(pageLen),
    this.isRead = Boolean(isRead),
    this.info = () => {
        let readStatus = this.isRead ? "already read" : "not read yet";
        return `${this.title} by ${this.author}, ${this.pageLen} pages, ${readStatus}`;
    }
    this.coverImg = String(coverImg) || null;
    this.description = String(description) || null;
}

function addBookToLibrary (title, author, pageLen, isRead, coverImg) {
    books.push(new Book(title, author, pageLen, isRead, coverImg));
}

function displayBooks () {
    let html = "";
    for (let i = 0; i < books.length; i++) {
        let book = books[i];
        let desc = book.description ? `<p class="book-desc">${book.description}</p>` : ""; 
        html += `
            <div class="book">
            <button class="book-isRead">${book.isRead ? "already read" : "not read yet"}</button>
            <button class="book-delete">Del</button>
            <div class="book-info">
                <h3 class="book-title">${book.title} - ${book.author}</h3>
                ${desc}
                <p class="book-pageLen">${book.pageLen}</p>
            </div>
            </div>
        `;
    }
    //Add to dom
    document.getElementById("book-list").innerHTML = html;
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