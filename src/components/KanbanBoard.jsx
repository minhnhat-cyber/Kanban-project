import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TASKS_KEY = "kanban-tasks";
const CATEGORIES_KEY = "kanban-categories";

const PEOPLE = [
  { id: "P001", name: "Ben" },
  { id: "P002", name: "Emma" },
  { id: "P003", name: "Liam" },
];

const INITIAL_TASKS = [
  { id: 1, title: "Create Kanban Board UI", description: "Build the three-column layout.", category: "Frontend", startDate: "2026-09-01", dueDate: "2026-09-05", completedDate: null, responsiblePersonId: "P001", status: "TODO" },
  { id: 2, title: "Prepare README", description: "Write project description and usage instructions.", category: "Documentation", startDate: "2026-09-02", dueDate: "2026-09-08", completedDate: null, responsiblePersonId: "P002", status: "TODO" },
  { id: 3, title: "Create Task Form", description: "Allow users to add a new task.", category: "Frontend", startDate: "2026-09-02", dueDate: "2026-09-06", completedDate: null, responsiblePersonId: "P001", status: "DOING" },
  { id: 4, title: "Set up React Router", description: "Create Board and Dashboard pages.", category: "Setup", startDate: "2026-08-28", dueDate: "2026-08-29", completedDate: "2026-08-29", responsiblePersonId: "P001", status: "DONE" },
];

const COLUMNS = [
  { id: "TODO", title: "TO DO", color: "primary" },
  { id: "DOING", title: "DOING", color: "warning" },
  { id: "DONE", title: "DONE", color: "success" },
];
const EMPTY_FORM = { title: "", description: "", category: "", newCategory: "", startDate: "", dueDate: "", responsiblePersonId: "", status: "TODO" };
const today = () => new Date().toISOString().slice(0, 10);

function fromStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function KanbanBoard() {
  const [tasks, setTasks] = useState(() => fromStorage(TASKS_KEY, INITIAL_TASKS));
  const [categories, setCategories] = useState(() => fromStorage(CATEGORIES_KEY, ["Frontend", "Documentation", "Setup", "General"]));
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories)), [categories]);

  const closeForm = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const openNewTask = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditTask = (task) => {
    setFormData({ ...task, newCategory: "" });
    setEditingId(task.id);
    setShowForm(true);
  };

  const changeField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const saveTask = (event) => {
    event.preventDefault();
    const newCategory = formData.newCategory.trim();
    const category = newCategory || formData.category;
    if (!category) return;
    if (formData.dueDate < formData.startDate) {
      alert("Due date cannot be earlier than start date.");
      return;
    }
    if (newCategory && !categories.includes(newCategory)) {
      setCategories((current) => [...current, newCategory]);
    }
    const values = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category,
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      responsiblePersonId: formData.responsiblePersonId,
      status: formData.status,
    };

    if (editingId) {
      setTasks((current) => current.map((task) => task.id === editingId ? {
        ...task,
        ...values,
        completedDate: values.status === "DONE" ? task.completedDate || today() : null,
      } : task));
    } else {
      setTasks((current) => [...current, {
        id: Date.now(),
        ...values,
        completedDate: values.status === "DONE" ? today() : null,
      }]);
    }
    closeForm();
  };

  const moveTask = (task, step) => {
    const currentIndex = COLUMNS.findIndex((column) => column.id === task.status);
    const status = COLUMNS[currentIndex + step]?.id;
    if (!status) return;
    setTasks((current) => current.map((item) => item.id === task.id ? {
      ...item,
      status,
      completedDate: status === "DONE" ? today() : null,
    } : item));
  };

  const deleteTask = (id) => {
    if (window.confirm("Delete this task?")) {
      setTasks((current) => current.filter((task) => task.id !== id));
    }
  };

  return (
    <div className="bg-dark text-light min-vh-100">
      <div className="container-fluid p-4">
        <header className="position-relative d-flex justify-content-center align-items-center mb-4">
          <div className="text-center">
            <h1 className="h3 mb-1">KANBAN</h1>
            <p className="text-secondary mb-0">Manage your team work in one place.</p>
          </div>
          <Link to="/dashboard" className="btn btn-outline-info position-absolute end-0">View Dashboard</Link>
        </header>

        <div className="d-flex justify-content-end mb-4">
          <button type="button" className="btn btn-primary" onClick={openNewTask}>+ Add Task</button>
        </div>

        {showForm && (
          <section className="card bg-dark border-secondary text-light mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 mb-0">{editingId ? "Edit Task" : "Add New Task"}</h2>
                <button type="button" className="btn-close btn-close-white" onClick={closeForm} aria-label="Close" />
              </div>
              <form onSubmit={saveTask}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Task title</label>
                    <input className="form-control" name="title" value={formData.title} onChange={changeField} required />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Responsible person</label>
                    <select className="form-select" name="responsiblePersonId" value={formData.responsiblePersonId} onChange={changeField} required>
                      <option value="">Select a person</option>
                      {PEOPLE.map((person) => <option key={person.id} value={person.id}>{person.name} ({person.id})</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" name="description" value={formData.description} onChange={changeField} rows="3" required />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Existing category</label>
                    <select className="form-select" name="category" value={formData.category} onChange={changeField} required={!formData.newCategory}>
                      <option value="">Select a category</option>
                      {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Or add a new category</label>
                    <input className="form-control" name="newCategory" value={formData.newCategory} onChange={changeField} placeholder="e.g. Testing" />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label">Start date</label>
                    <input type="date" className="form-control" name="startDate" value={formData.startDate} onChange={changeField} required />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label">Due date</label>
                    <input type="date" className="form-control" name="dueDate" value={formData.dueDate} onChange={changeField} required />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label">Status</label>
                    <select className="form-select" name="status" value={formData.status} onChange={changeField}>
                      <option value="TODO">TO DO</option>
                      <option value="DOING">DOING</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </div>
                  <div className="col-12 d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-outline-secondary" onClick={closeForm}>Cancel</button>
                    <button type="submit" className="btn btn-primary">{editingId ? "Save Changes" : "Create Task"}</button>
                  </div>
                </div>
              </form>
            </div>
          </section>
        )}

        <main className="row g-4">
          {COLUMNS.map((column, columnIndex) => {
            const columnTasks = tasks.filter((task) => task.status === column.id);
            return (
              <div className="col-12 col-lg-4" key={column.id}>
                <section className="bg-secondary bg-opacity-25 rounded-3 p-3 h-100">
                  <h2 className="h6 mb-3">
                    <span className={`badge rounded-pill text-bg-${column.color} me-2`}>{columnTasks.length}</span>
                    {column.title}
                  </h2>
                  {columnTasks.map((task) => {
                    const person = PEOPLE.find((item) => item.id === task.responsiblePersonId);
                    return (
                      <article className="card bg-dark border-secondary text-light mb-3" key={task.id}>
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                            <span className="badge text-bg-primary">{task.category}</span>
                            <div className="d-flex gap-1">
                              <button type="button" className="btn btn-sm btn-outline-info" onClick={() => openEditTask(task)}>Edit</button>
                              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteTask(task.id)}>Delete</button>
                            </div>
                          </div>
                          <h3 className="h6">{task.title}</h3>
                          <p className="card-text small text-secondary">{task.description}</p>
                          <div className="small text-secondary">
                            <div>Start: {task.startDate}</div>
                            <div>Due: {task.dueDate}</div>
                            {task.completedDate && <div>Completed: {task.completedDate}</div>}
                          </div>
                          <div className="d-flex justify-content-between align-items-center mt-3 gap-2">
                            <button type="button" className="btn btn-sm btn-outline-light" disabled={columnIndex === 0} onClick={() => moveTask(task, -1)}>← Move</button>
                            <span className="badge text-bg-success">{person?.name || "Unassigned"}</span>
                            <button type="button" className="btn btn-sm btn-outline-light" disabled={columnIndex === COLUMNS.length - 1} onClick={() => moveTask(task, 1)}>Move →</button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                  {columnTasks.length === 0 && <p className="text-secondary small text-center py-4">No tasks here yet.</p>}
                </section>
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}

export default KanbanBoard;
