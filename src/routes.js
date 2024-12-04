const { addBooksHandlers, getBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler } = require("./handlers");

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler:  addBooksHandlers,
    },
    {
        method: 'GET',
        path: '/books',
        handler:  getBooksHandler,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler:  getBookByIdHandler,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateBookByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookByIdHandler,
    }
]

module.exports = routes;