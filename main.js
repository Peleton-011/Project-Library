const books = [];

const Book = function (title, author, pageLen, isRead, coverImg) {
    this.title = String(title),
    this.author = String(author),
    this.pageLen = Number(pageLen),
    this.isRead = Boolean(isRead),
    this.info = () => {
        let readStatus = this.isRead ? "already read" : "not read yet";
        return `${this.title} by ${this.author}, ${this.pageLen} pages, ${readStatus}`;
    }
    this.coverImg = String(coverImg) || null;
}

function addBookToLibrary (title, author, pageLen, isRead, coverImg) {
    books.push(new Book(title, author, pageLen, isRead, coverImg));
}

