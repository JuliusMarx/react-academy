import { useState } from 'react';
import { getBook, type Book } from './api';

// TODO 1: read the book with use(bookPromise) instead of showing nothing
function BookDetails({ bookPromise }: { bookPromise: Promise<Book> }) {
  void bookPromise;
  return <p id="book"></p>;
}

export default function App() {
  const [bookId, setBookId] = useState(1);

  // TODO 2: wrap BookDetails in <Suspense> with the fallback <p id="fallback">Loading book …</p>
  return (
    <main>
      <h1>Books</h1>
      {[1, 2, 3].map((id) => (
        <button key={id} onClick={() => setBookId(id)}>
          Book {id}
        </button>
      ))}
      <BookDetails bookPromise={getBook(bookId)} />
    </main>
  );
}
