import { useState } from 'react';

// A small bar chart as an inline SVG image
const chart =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60"><rect x="10" y="30" width="40" height="30" fill="#087ea4"/><rect x="70" y="0" width="40" height="60" fill="#087ea4"/></svg>',
  );

const fakeButton = {
  display: 'inline-block',
  padding: '0.35rem 0.9rem',
  marginRight: 8,
  borderRadius: 6,
  background: '#4b5260',
  color: '#fff',
  cursor: 'pointer',
};

export default function App() {
  const [divClicks, setDivClicks] = useState(0);
  const [buttonClicks, setButtonClicks] = useState(0);

  return (
    <>
      <header>
        <nav aria-label="Main">
          <a href="#buttons">Buttons</a> · <a href="#form">Form</a>
        </nav>
      </header>

      <main>
        <h1>Semantic HTML</h1>

        <section id="buttons" aria-labelledby="buttons-title">
          <h2 id="buttons-title">div vs. button</h2>
          <p>Press Tab, then Enter or Space. Only one of them reacts.</p>

          {/* Looks like a button – but no focus, no keyboard, no role */}
          <div style={fakeButton} onClick={() => setDivClicks((c) => c + 1)}>
            div ({divClicks})
          </div>

          {/* Focusable, Enter and Space work, screen readers say "button" */}
          <button onClick={() => setButtonClicks((c) => c + 1)}>button ({buttonClicks})</button>
        </section>

        <section id="form" aria-labelledby="form-title">
          <h2 id="form-title">Labels</h2>
          {/* Click the label: the input gets the focus */}
          <label htmlFor="email">Email</label> <input id="email" type="email" />
          <p>
            <label>
              <input type="checkbox" /> Remember me
            </label>
          </p>
        </section>

        <section aria-labelledby="images-title">
          <h2 id="images-title">Images</h2>
          {/* Informative: alt says what the image shows. Decorative: alt="" */}
          <img src={chart} alt="Sales doubled from 10 to 20" width={120} height={60} />
          <img src={chart} alt="" width={40} height={20} />
        </section>
      </main>

      <footer>
        <p>Tip: the Accessibility panel in your browser's DevTools shows each element's role and name.</p>
      </footer>
    </>
  );
}
