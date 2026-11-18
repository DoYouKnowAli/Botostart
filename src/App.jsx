import Contacts from "./components/Contacts";
import Header from "./components/Header";

function App() {
  return (
    <main className="page-enter">
      <div className="header-enter">
        <Header />
      </div>

      <div className="content-enter">
        <Contacts />
      </div>
    </main>
  );
}

export default App;
