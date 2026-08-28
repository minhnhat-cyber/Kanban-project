const columns = [
  {
    id: "TODO",
    title: "TO DO",
    color: "primary",
    tasks: [
      {
        id: 1,
        title: "Create Kanban Board UI",
        description: "Build the three-column layout.",
        category: "Frontend",
        dueDate: "Sep 5, 2026",
        person: "M",
      },
      {
        id: 2,
        title: "Prepare README",
        description: "Write project description and usage instructions.",
        category: "Documentation",
        dueDate: "Sep 8, 2026",
        person: "T",
      },
    ],
  },
  {
    id: "DOING",
    title: "DOING",
    color: "warning",
    tasks: [
      {
        id: 3,
        title: "Create Task Form",
        description: "Allow users to add a new task.",
        category: "Frontend",
        dueDate: "Sep 6, 2026",
        person: "M",
      },
    ],
  },
  {
    id: "DONE",
    title: "DONE",
    color: "success",
    tasks: [
      {
        id: 4,
        title: "Set up React Router",
        description: "Create Board and Dashboard pages.",
        category: "Setup",
        dueDate: "Aug 29, 2026",
        person: "M",
      },
    ],
  },
];



function KanbanBoard() {
const todoTasks = columns.find(
  (column) => column.id === "TODO"
).tasks.length;

const doingTasks = columns.find(
  (column) => column.id === "DOING"
).tasks.length;

const doneTasks = columns.find(
  (column) => column.id === "DONE"
).tasks.length;

  return (
    <div className="bg-dark text-light min-vh-100">
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className= "col-md-12 text-center">
            <p className="text-secondary small mb-1">PROJECT 1</p>
            <h1 className="h3 mb-1">Team Task</h1>
            <p className="text-secondary mb-0">
              Manage your team work in one place.
            </p>
          </div>
        </div>
            <div class="container text-center">
            <div class="row row-cols-4">
            <div class="col">
                <h2 className="text-warning mb-0" >{doingTasks}</h2>
                <p>DOING</p>
                </div>
            <div class="col">
                <h2 className="text-success mb-0" >{doneTasks}</h2>
                <p>DONE</p>
                </div>
            <div class="col">
                <h2 className="text-primary mb-0" >{todoTasks}</h2>
                <p>TO DO</p>
                </div>
            <button className="btn btn-primary">
                + Add Task
            </button>
        </div>
        </div>
    </div>
<hr></hr>
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
                  <div className="card bg-dark border-secondary text-light mb-3" key={task.id}>
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
  );
}

export default KanbanBoard;