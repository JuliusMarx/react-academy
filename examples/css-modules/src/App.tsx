import Button from './Button';
import Card from './Card';

export default function App() {
  return (
    <main>
      <h1>CSS Modules</h1>
      <Card title="Two components, one class name">
        <p>
          Button.module.css and Card.module.css both define a class called <code>.title</code> – they
          don't clash, because each file gets its own unique class names.
        </p>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
      </Card>
      <p>Inspect the elements: the class names look like "_title_1x2y3_1".</p>
    </main>
  );
}
