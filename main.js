const Book = function (title, author, pageLen, isRead) {
    this.title = String(title),
    this.author = String(author),
    this.pageLen = Number(pageLen),
    this.isRead = Boolean(isRead),
    this.info = () => {
        let readStatus = this.isRead ? "already read" : "not read yet";
        return `${this.title} by ${this.author}, ${this.pageLen} pages, ${readStatus}`;
    }
}