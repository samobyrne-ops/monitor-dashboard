import { useState, useEffect, useCallback } from 'react';
import { SummaryBar } from './components/SummaryBar';
import { KanbanBoard } from './components/KanbanBoard';
import { CardDetail } from './components/CardDetail';
import { fetchTasks, updateTask } from './api/sheets';
import { CONFIG } from './config';
import type { MonitorTask, TaskStatus, TaskPriority } from './types';

function App() {
  const [tasks, setTasks] = useState<MonitorTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<MonitorTask | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    const data = await fetchTasks();
    setTasks(data);
    setLastRefresh(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTasks();
    const interval = setInterval(loadTasks, CONFIG.POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [loadTasks]);

  useEffect(() => {
    const handleFocus = () => { loadTasks(); };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadTasks]);

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status, updated_at: new Date().toISOString(), ...(status === 'done' ? { resolved_at: new Date().toISOString() } : {}) } : t));
    if (selectedTask?.id === id) {
      setSelectedTask(prev => prev ? { ...prev, status } : null);
    }
    await updateTask(id, { status });
  };

  const handlePriorityChange = async (id: string, priority: TaskPriority) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, priority, updated_at: new Date().toISOString() } : t));
    if (selectedTask?.id === id) {
      setSelectedTask(prev => prev ? { ...prev, priority } : null);
    }
    await updateTask(id, { priority });
  };

  const handleResponse = async (id: string, response: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, sam_response: response, updated_at: new Date().toISOString() } : t));
    if (selectedTask?.id === id) {
      setSelectedTask(prev => prev ? { ...prev, sam_response: response } : null);
    }
    await updateTask(id, { sam_response: response });
  };

  return (
    <div className="min-h-dvh bg-layer-floor-0-grouped">
      <SummaryBar tasks={tasks} lastRefresh={lastRefresh} loading={loading} />
      <main className="px-6 pb-6">
        <KanbanBoard
          tasks={tasks}
          onSelectTask={setSelectedTask}
          selectedTaskId={selectedTask?.id}
        />
      </main>
      {selectedTask && (
        <CardDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onResponse={handleResponse}
        />
      )}
    </div>
  );
}

export default App;
