import { Link, Outlet, useNavigation } from 'react-router';

export default function Layout() {
  const navigation = useNavigation();
  return (
    <>
      <header>
        <nav>
          <Link to="/">All notes</Link> · <Link to="/notes/new">New note</Link>
        </nav>
        {navigation.state === 'loading' && <p>Loading …</p>}
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
