import { BrowserRouter, NavLink, Outlet, Route, Routes } from 'react-router';

function DashboardLayout() {
  return (
    <>
      <header>
        <h1>Dashboard</h1>
        <nav>
          <NavLink to="/dashboard" end>
            Overview
          </NavLink>{' '}
          <NavLink to="/dashboard/settings">Settings</NavLink>
        </nav>
      </header>
      <main id="page">
        <Outlet />
      </main>
    </>
  );
}

function Overview() {
  return <p className="content">3 new messages</p>;
}

function Settings() {
  return <p className="content">Notifications: on</p>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavLink to="/dashboard">Open dashboard</NavLink>} />
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
