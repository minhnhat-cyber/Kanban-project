import { useEffect, useState } from "react";

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

function KanbanBoard() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    return savedTasks ? JSON.parse(savedTasks) : INITIAL_TASKS;
  });

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

  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="bg-dark text-light min-vh-100">
      <div className="container-fluid p-4">
        <div className="text-center mb-4">
          <p className="text-secondary small mb-1">PROJECT 1</p>
          <h1 className="h3 mb-1">Team Task</h1>
          <p className="text-secondary mb-0">
            Manage your team work in one place.
          </p>
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
            <button className="btn btn-primary w-100">
              + Add Task
            </button>
          </div>
        </div>

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

                  <button className="btn btn-sm btn-outline-light">
                    + Add
                  </button>
                </div>

                {column.tasks.map((task) => (
                  <div
                    className="card bg-dark border-secondary text-light mb-3"
                    key={task.id}
                  >
                    <div className="card-body">
                      <span className="badge text-bg-primary mb-2">
                        {task.category}
                      </span>

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