const { nanoid } = require("nanoid");
const books = require("./book");

const addBooksHandlers = (request, h) => {
  const id = nanoid(16);
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query;

  let filteredBooks = books;

  if (reading !== undefined) {
      const isReading = reading === '1';
      filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  if (finished !== undefined) {
      const isFinished = finished === '1';
      filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
  }

  if (name) {
      filteredBooks = filteredBooks.filter((book) => 
          book.name.toLowerCase().includes(name.toLowerCase())
      );
  }

  const result = filteredBooks.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
  }));

  const response = h.response({
      status: "success",
      data: {
          books: result,
      },
  });

  response.code(200);
  return response;
};


const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.find(book => book.id === bookId);

  if (book !== undefined) {
    return {
      status: "success",
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  })

  response.code(404);
  return response;
}

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex(book => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished: pageCount === readPage, 
      updatedAt, 
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex(book => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
}

module.exports = {
  addBooksHandlers,
  getBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
}
