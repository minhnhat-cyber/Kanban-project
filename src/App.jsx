import { HashRouter, Route, Routes } from "react-router-dom";
import KanbanBoard from "./components/KanbanBoard";
import Dashboard from "./components/Dashboard";

function App() {
  return (
      <Routes>
        <Route path="/" element={<KanbanBoard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
  );
}

export default App;