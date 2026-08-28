import { NavLink, Route, Routes } from "react-router-dom";
import KanbanBoard from "./components/KanbanBoard";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <>
      <header>
        <NavLink to="/">Kanban Board</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
      </header>

      <Routes>
        <Route path="/" element={<KanbanBoard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;