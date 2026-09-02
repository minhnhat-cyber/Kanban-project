import { useEffect, useState } from "react";

const STORAGE_KEY = "kanban-tasks";

function useTasks() {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const handleStorage = () => {
            const saved = localStorage.getItem(STORAGE_KEY);
            setTasks(saved ? JSON.parse(saved) : []);
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);
    return tasks;
}

export default useTasks;