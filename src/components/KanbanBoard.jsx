import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";

const STORAGE_KEY = "kanban-tasks";

const INITIAL_TASKS = [
  {
    id: 1,
    title: "Create Kanban Board UI",
    description: "Build the three-column layout.",
    category: "Frontend",
    startDate: "2026-09-01",
    dueDate: "2026-09-05",
    completedDate: null,
    responsiblePersonId: "P001",
    person: "M",
    status: "TODO",
  },
  {
    id: 2,
    title: "Prepare README",
    description: "Write project description and usage instructions.",
    category: "Documentation",
    startDate: "2026-09-02",
    dueDate: "2026-09-08",
    completedDate: null,
    responsiblePersonId: "P002",
    person: "T",
    status: "TODO",
  },
  {
    id: 3,
    title: "Create Task Form",
    description: "Allow users to add a new task.",
    category: "Frontend",
    startDate: "2026-09-02",
    dueDate: "2026-09-06",
    completedDate: null,
    responsiblePersonId: "P001",
    person: "M",
    status: "DOING",
  },
  {
    id: 4,
    title: "Set up React Router",
    description: "Create Board and Dashboard pages.",
    category: "Setup",
    startDate: "2026-08-28",
    dueDate: "2026-08-29",
    completedDate: "2026-08-29",
    responsiblePersonId: "P001",
    person: "M",
    status: "DONE",
  },
];

const COLUMN_INFO = [
  { id: "TODO", title: "TO DO", color: "primary" },
  { id: "DOING", title: "DOING", color: "warning" },
  { id: "DONE", title: "DONE", color: "success" },
];
  const EMPTY_FORM ={
    title: "",
    description: "",
    category: "",
    startDate: "",
    dueDate: "",
    responsiblePersonId: "",
    person: "",
    status: "TODO",
  }

function KanbanBoard() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    return savedTasks ? JSON.parse(savedTasks) : INITIAL_TASKS;
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function handleAddTask(event) {
    event.preventDefault();

    if (
      formData.title.trim() === "" ||
      formData.description.trim() === ""
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (
      formData.startDate &&
      formData.dueDate &&
      formData.dueDate < formData.startDate
    ) {
      alert("Due date cannot be earlier than start date.");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim() || "General",
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      completedDate:
        formData.status === "DONE"
          ? new Date().toISOString().split("T")[0]
          : null,
      responsiblePersonId: formData.responsiblePersonId.trim(),
      person:
        formData.person.trim().charAt(0).toUpperCase() || "?",
      status: formData.status,
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);

    setFormData(EMPTY_FORM);
    setShowForm(false);
  }

  function handleDeleteTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    );
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const columns = COLUMN_INFO.map((column) => ({
    ...column,
    tasks: tasks.filter((task) => task.status === column.id),
  }));

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "DONE"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "TODO"
  ).length;

return (
  <div className="bg-dark text-light min-vh-100">
    <div className="container-fluid p-4">
      <div className="position-relative d-flex justify-content-center align-items-center mb-4">
        <div className="text-center">
          <h1 className="h3 mb-1">KANBAN</h1>

          <p className="text-secondary mb-0">
            Manage your team work in one place.
          </p>
        </div>

        <Link to="/dashboard" className="btn btn-outline-info position-absolute end-0">
          View Dashboard
        </Link>
      </div>
    

        <div className="row align-items-center text-center mb-4">
          <div className="col-12 col-md-3">
            <h2 className="text-primary mb-0">{totalTasks}</h2>
            <p className="text-secondary mb-0">Total</p>
          </div>

          <div className="col-12 col-md-3">
            <h2 className="text-success mb-0">{completedTasks}</h2>
            <p className="text-secondary mb-0">Completed</p>
          </div>

          <div className="col-12 col-md-3">
            <h2 className="text-warning mb-0">{pendingTasks}</h2>
            <p className="text-secondary mb-0">Pending</p>
          </div>

          <div className="col-12 col-md-3 mt-3 mt-md-0">
            <button
              type="button"
              className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2"
              onClick={() => setShowForm(true)}
            >
              <AddBoxIcon fontSize="small" />
              Add Task
            </button>
          </div>
        </div>
        {showForm && (
  <div className="card bg-dark border-secondary text-light mb-4">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Add New Task</h2>

        <button
          type="button"
          className="btn-close btn-close-white"
          onClick={() => {
            setShowForm(false);
            setFormData(EMPTY_FORM);
          }}
          aria-label="Close"
        />
      </div>

      <form onSubmit={handleAddTask}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label">Task title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-control"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Frontend, Backend..."
            />
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Start date</label>
            <input
              type="date"
              className="form-control"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Due date</label>
            <input
              type="date"
              className="form-control"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">Person ID</label>
            <input
              type="text"
              className="form-control"
              name="responsiblePersonId"
              value={formData.responsiblePersonId}
              onChange={handleInputChange}
              placeholder="P001"
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">Person name</label>
            <input
              type="text"
              className="form-control"
              name="person"
              value={formData.person}
              onChange={handleInputChange}
              placeholder="Minh"
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="TODO">TO DO</option>
              <option value="DOING">DOING</option>
              <option value="DONE">DONE</option>
            </select>
          </div>

          <div className="col-12 d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setShowForm(false);
                setFormData(EMPTY_FORM);
              }}
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-primary">
              Create Task
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
)}
        <hr className="border-secondary" />

        <div className="row g-4">
          {columns.map((column) => (
            <div className="col-12 col-lg-4" key={column.id}>
              <div className="bg-secondary bg-opacity-25 rounded-3 p-3 h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="h6 mb-0">
                    <span
                      className={`badge rounded-pill text-bg-${column.color} me-2`}
                    >
                      {column.tasks.length}
                    </span>
                    {column.title}
                  </h2>
                </div>

                {column.tasks.map((task) => (
                  <div
                    className="card bg-dark border-secondary text-light mb-3"
                    key={task.id}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="badge text-bg-primary">
                          {task.category}
                        </span>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteTask(task.id)}
                          aria-label={`Delete ${task.title}`}
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>

                      <h3 className="h6">{task.title}</h3>

                      <p className="card-text small text-secondary">
                        {task.description}
                      </p>

                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <small className="text-secondary">
                          Due: {task.dueDate}
                        </small>

                        <span className="badge rounded-circle text-bg-success p-2">
                          {task.person}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {column.tasks.length === 0 && (
                  <p className="text-secondary small text-center py-4">
                    No tasks here yet.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default KanbanBoard;
