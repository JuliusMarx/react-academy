import { Home } from './pages';

// TODO 1: wrap everything in <BrowserRouter> and show the pages with <Routes>/<Route>:
//         "/" → Home, "/about" → About, "/contact" → Contact, anything else → NotFound
// TODO 2: turn the three nav entries into <NavLink>s, so the current one gets class="active"
export default function App() {
  return (
    <>
      <nav>
        <span>Home</span> <span>About</span> <span>Contact</span>
      </nav>
      <main>
        <Home />
      </main>
    </>
  );
}
