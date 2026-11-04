import { FavoritesProvider, useFavorites } from './favorites';

const recipes = [
  { id: 1, name: 'Pancakes' },
  { id: 2, name: 'Risotto' },
  { id: 3, name: 'Curry' },
];

function Header() {
  const { favorites } = useFavorites();
  return <header id="count">♥ {favorites.length}</header>;
}

function RecipeList() {
  const { favorites, toggle } = useFavorites();
  return (
    <ul>
      {recipes.map((r) => (
        <li key={r.id}>
          {r.name}{' '}
          <button aria-pressed={favorites.includes(r.id)} onClick={() => toggle(r.id)}>
            {favorites.includes(r.id) ? '♥ Saved' : '♡ Save'} {r.name}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  return (
    <FavoritesProvider>
      <Header />
      <RecipeList />
    </FavoritesProvider>
  );
}
