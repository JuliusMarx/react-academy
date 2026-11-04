import { BrowserRouter, NavLink, Route, Routes } from 'react-router';

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About us</h2>;
}

function NotFound() {
  return <h2>404 – Page not found</h2>;
}

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: 'flex', gap: 12 }}>
        {/* NavLink sets class="active" and aria-current="page" on the current link */}
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/does-not-exist">Broken link</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <style>{'.active { font-weight: bold; }'}</style>
    </BrowserRouter>
  );
}
