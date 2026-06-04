import "./App.css";
import { Diagram } from "./components/Diagram";
import { strings } from "./content/strings";

function App() {
  return (
    <main className="app">
      <header className="app__header">
        <h1 className="app__title">{strings.app.title}</h1>
        <p className="app__subtitle">{strings.app.subtitle}</p>
      </header>
      <Diagram />
    </main>
  );
}

export default App;
