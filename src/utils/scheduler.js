/**
 * Generates a clean hourly timeline for tasks, injecting buffer breaks
 */
export const generateTimeline = (tasks) => {
  const activeTasks = tasks.filter(t => t.status === 'pending');
  if (activeTasks.length === 0) return [];

  // Start scheduling from the current hour rounded to nearest 15 mins
  const start = new Date();
  const minutes = start.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 15) * 15;
  start.setMinutes(roundedMinutes);
  start.setSeconds(0);
  start.setMilliseconds(0);

  const timeline = [];
  let currentTimeTracker = new Date(start.getTime());

  // Sort tasks by priority (high -> medium -> low) to optimize order
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  const sortedTasks = [...activeTasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  sortedTasks.forEach((task, idx) => {
    const duration = task.estimatedTime || 30; // minutes
    const taskStart = new Date(currentTimeTracker.getTime());
    const taskEnd = new Date(taskStart.getTime() + duration * 60000);

    timeline.push({
      id: `time-${task.id}`,
      taskId: task.id,
      title: task.title,
      priority: task.priority,
      startTime: taskStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: taskEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration,
      isBreak: false
    });

    currentTimeTracker = new Date(taskEnd.getTime());

    // Inject a 10 min AI buffer recharge block after each task, except the last one
    if (idx < sortedTasks.length - 1) {
      const breakStart = new Date(currentTimeTracker.getTime());
      const breakEnd = new Date(breakStart.getTime() + 10 * 60000);

      timeline.push({
        id: `break-${idx}`,
        title: '🔋 Brain Recharge Break',
        startTime: breakStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: breakEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: 10,
        isBreak: true
      });

      currentTimeTracker = new Date(breakEnd.getTime());
    }
  });

  return timeline;
};
