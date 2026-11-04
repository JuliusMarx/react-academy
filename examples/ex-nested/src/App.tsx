import { BrowserRouter, NavLink, Route, Routes } from 'react-router';

// TODO 1: turn DashboardLayout into a layout route: it renders the header once and
//         the current child page with <Outlet /> inside <main id="page">.
// TODO 2: nest the routes under path="dashboard": the index route shows Overview,
//         "dashboard/settings" shows Settings. Remove the duplicated headers from the pages.
function DashboardLayout() {
  return (
    <header>
      <h1>Dashboard</h1>
      <nav>
        <NavLink to="/dashboard" end>
          Overview
        </NavLink>{' '}
        <NavLink to="/dashboard/settings">Settings</NavLink>
      </nav>
    </header>
  );
}

function Overview() {
  return (
    <>
      <DashboardLayout />
      <p className="content">3 new messages</p>
    </>
  );
}

function Settings() {
  return <p className="content">Notifications: on</p>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavLink to="/dashboard">Open dashboard</NavLink>} />
        <Route path="/dashboard" element={<Overview />} />
        <Route path="/dashboard/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
