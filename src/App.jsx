import { useState } from "react";
import "./App.css";

const STORAGE_KEY = "activeTab";

const DESC = "This is a description of the content.";

const TABS = [
  { id: 1, label: "Tab 1", title: "First Content", body: DESC },
  { id: 2, label: "Tab 2", title: "Second Content", body: DESC },
  { id: 3, label: "Tab 3", title: "Third Content", body: DESC },
  { id: 4, label: "Tab 4", title: "Fourth Content", body: DESC },
];

function getSavedTab() {
  const saved = Number(localStorage.getItem(STORAGE_KEY));
  return TABS.some((tab) => tab.id === saved) ? saved : TABS[0].id;
}

export default function App() {
  const [activeId, setActiveId] = useState(getSavedTab);

  function handleTabClick(id) {
    setActiveId(id);
    localStorage.setItem(STORAGE_KEY, id);
  }

  const activeTab = TABS.find((tab) => tab.id === activeId);

  return (
    <div className="app">
      <header className="header">
        <h1>Tabs Component with React</h1>
        <h2>تمرین هفته سیزدهم (علی خلیلی)</h2>
        <div className="tab-list">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={tab.id === activeId ? "tab active" : "tab"}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <section className="content">
        <h2>{activeTab.title}</h2>
        <p>{activeTab.body}</p>
      </section>
    </div>
  );
}
