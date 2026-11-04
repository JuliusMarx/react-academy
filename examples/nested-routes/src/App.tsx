import { BrowserRouter, NavLink, Outlet, Route, Routes } from 'react-router';

function Layout() {
  return (
    <>
      <header style={{ borderBottom: '1px solid #ccc', marginBottom: 12 }}>
        <h1>My App</h1>
        <nav style={{ display: 'flex', gap: 12 }}>
          {/* "end": only active on exactly "/", not on every page below it */}
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/settings">Settings</NavLink>
          <NavLink to="/settings/profile">Profile</NavLink>
        </nav>
      </header>
      {/* The matching child route renders here */}
      <Outlet />
      <style>{'.active { font-weight: bold; }'}</style>
    </>
  );
}

function SettingsLayout() {
  return (
    <section>
      <h2>Settings</h2>
      <Outlet />
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<p>Welcome home.</p>} />
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<p>Choose a settings page.</p>} />
            <Route path="profile" element={<p>Your profile settings.</p>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
