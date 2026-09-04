import { Link } from "react-router-dom";
import useTasks from "../hooks/useTasks";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const STATUS_COLORS = ["#0d6efd", "#ffc107", "#198754"];
const PERFORMANCE_COLORS = ["#198754", "#0d6efd", "#dc3545"];


function getStatusCounts(tasks) {
  return {
    todo: tasks.filter(t => t.status === "TODO").length,
    doing: tasks.filter(t => t.status === "DOING").length,
    done: tasks.filter(t => t.status === "DONE").length,
  };
}

function getOverdueCount(tasks) {
  const today = new Date().toISOString().split("T")[0];
  return tasks.filter(t => t.status !== "DONE" && t.dueDate < today).length;
}
export function getCategoryCounts(tasks) {
  return tasks.reduce((counts, task) => {
    counts[task.category] = (counts[task.category] || 0) + 1;
    return counts;
  }, {});
}

export function getCompletionPerformance(tasks) {
  return tasks
    .filter(task => task.status === "DONE" && task.completedDate != null)
    .reduce((counts, task) => {
      if (task.completedDate < task.dueDate) {
        counts.early += 1;
      } else if (task.completedDate === task.dueDate) {
        counts.onTime += 1;
      } else { // completedDate > dueDate 
        counts.late += 1;
      }
      return counts;
    }, { early: 0, onTime: 0, late: 0 });
}

function Dashboard() {
  const tasks = useTasks();
  const totalTasks = tasks.length;
  const statusCounts = getStatusCounts(tasks);
  const overdueCount = getOverdueCount(tasks);
  const categoryCounts = getCategoryCounts(tasks);
  const completionPerformance = getCompletionPerformance(tasks);
  const statusData = [
  { name: "To Do", value: statusCounts.todo },
  { name: "Doing", value: statusCounts.doing },
  { name: "Done", value: statusCounts.done },
];
  const performanceData = [
    { name: "Early", value: completionPerformance.early },
    { name: "On Time", value: completionPerformance.onTime },
    { name: "Late", value: completionPerformance.late },
  ];
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  
  return (
    <div className="bg-dark text-light min-vh-100">
      <div className="container-fluid p-4">
        <div className="position-relative d-flex justify-content-center align-items-center mb-4">
          <div className="text-center">
            <h1 className="h3 mb-1">DASHBOARD</h1>
            <p className="text-secondary mb-0">Overview of your team's tasks.</p>
          </div>
          <Link to="/" className="btn btn-outline-info position-absolute end-0">
            Back to Board
          </Link>
        </div>

        <div className="row row-cols-2 row-cols-md-5 g-3 text-center mb-4">
          <div className="col">
            <h2 className="text-light mb-0">{totalTasks}</h2>
            <p className="text-secondary mb-0">Total</p>
          </div>
          <div className="col">
            <h2 className="text-primary mb-0">{statusCounts.todo}</h2>
            <p className="text-secondary mb-0">To Do</p>
          </div>
          <div className="col">
            <h2 className="text-warning mb-0">{statusCounts.doing}</h2>
            <p className="text-secondary mb-0">Doing</p>

          </div>
          <div className="col">
            <h2 className="text-success mb-0">{statusCounts.done}</h2>
            <p className="text-secondary mb-0">Done</p>
          </div>
          <div className="col">
            <h2 className="text-danger mb-0">{overdueCount}</h2>
            <p className="text-secondary mb-0">Overdue</p>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-lg-4">
            <div className="card bg-dark border-secondary text-light h-100">
              <div className="card-body">
                <h2 className="h6 mb-3">Task Status</h2>
                <div style={{ width: "100%", height: 180 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
                        {statusData.map((entry, index) => (
                          <Cell key={entry.name} fill={STATUS_COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card bg-dark border-secondary text-light h-100">
              <div className="card-body">
                <h2 className="h6 mb-3">Task Category</h2>
                <div style={{ width: "100%", height: 180 }}>
                  <ResponsiveContainer>
                    <BarChart data={categoryData}>
                      <CartesianGrid stroke="#495057" />
                      <XAxis dataKey="name" stroke="#adb5bd" />
                      <YAxis stroke="#adb5bd" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#6f42c1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card bg-dark border-secondary text-light h-100">
              <div className="card-body">
                <h2 className="h6 mb-3">Completion Performance</h2>
                 <div style={{ width: "100%", height: 180 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={performanceData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
                        {statusData.map((entry, index) => (
                          <Cell key={entry.name} fill={PERFORMANCE_COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;