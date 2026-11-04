import { Suspense, use, useState } from 'react';
import { getBook, type Book } from './api';

function BookDetails({ bookPromise }: { bookPromise: Promise<Book> }) {
  const book = use(bookPromise);
  return <p id="book">{book.title}</p>;
}

export default function App() {
  const [bookId, setBookId] = useState(1);

  return (
    <main>
      <h1>Books</h1>
      {[1, 2, 3].map((id) => (
        <button key={id} onClick={() => setBookId(id)}>
          Book {id}
        </button>
      ))}
      <Suspense fallback={<p id="fallback">Loading book …</p>}>
        <BookDetails bookPromise={getBook(bookId)} />
      </Suspense>
    </main>
  );
}
