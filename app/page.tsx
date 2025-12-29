'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Target,
  Lightbulb,
  Play,
  Pause,
  BarChart3,
  AlertCircle,
  Trash2,
  Plus
} from 'lucide-react';

interface Task {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  timeEstimate: number;
}

interface FocusSession {
  startTime: number;
  duration: number;
}

const productivityTips = [
  "Use the Pomodoro Technique: Work for 25 minutes, then take a 5-minute break.",
  "Start your day with the most important task (MIT) - your top priority.",
  "Batch similar tasks together to reduce context switching.",
  "Turn off notifications during focus sessions for deep work.",
  "Take regular breaks to maintain high energy and focus levels.",
  "Use the 2-minute rule: If a task takes less than 2 minutes, do it now.",
  "Set specific times to check email instead of constantly monitoring.",
  "Create a distraction-free workspace for focused work.",
  "Use the Eisenhower Matrix to prioritize: Urgent vs Important.",
  "Review and plan your day every morning for 10 minutes.",
  "Track your time to understand where it actually goes.",
  "Single-task instead of multitasking for better quality work.",
  "Set boundaries and learn to say no to non-essential tasks.",
  "Keep your workspace clean and organized to reduce mental clutter.",
  "Use time blocking to allocate specific times for different activities."
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTaskTime, setNewTaskTime] = useState(30);

  const [focusTime, setFocusTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [totalFocusToday, setTotalFocusToday] = useState(0);

  const [dailyTip, setDailyTip] = useState('');
  const [blockedSites, setBlockedSites] = useState<string[]>(['facebook.com', 'twitter.com', 'reddit.com']);
  const [newBlockedSite, setNewBlockedSite] = useState('');

  useEffect(() => {
    // Load data from localStorage
    const savedTasks = localStorage.getItem('tasks');
    const savedFocusTime = localStorage.getItem('totalFocusToday');
    const savedDate = localStorage.getItem('lastDate');
    const today = new Date().toDateString();

    if (savedDate !== today) {
      localStorage.setItem('lastDate', today);
      localStorage.setItem('totalFocusToday', '0');
      setTotalFocusToday(0);
    } else if (savedFocusTime) {
      setTotalFocusToday(parseInt(savedFocusTime));
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    // Set daily tip
    const tipIndex = new Date().getDate() % productivityTips.length;
    setDailyTip(productivityTips[tipIndex]);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setFocusTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask,
        priority: newTaskPriority,
        completed: false,
        timeEstimate: newTaskTime
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setNewTaskTime(30);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    setCurrentSession({ startTime: Date.now(), duration: 0 });
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    const newTotal = totalFocusToday + focusTime;
    setTotalFocusToday(newTotal);
    localStorage.setItem('totalFocusToday', newTotal.toString());
    setFocusTime(0);
    setCurrentSession(null);
  };

  const addBlockedSite = () => {
    if (newBlockedSite.trim() && !blockedSites.includes(newBlockedSite.trim())) {
      setBlockedSites([...blockedSites, newBlockedSite.trim()]);
      setNewBlockedSite('');
    }
  };

  const removeBlockedSite = (site: string) => {
    setBlockedSites(blockedSites.filter(s => s !== site));
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            AI Productivity Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Plan your day, stay focused, and achieve your goals
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Tip */}
          <div className="lg:col-span-3 bg-gradient-to-r from-yellow-400 to-orange-400 p-6 rounded-lg shadow-lg">
            <div className="flex items-start gap-4">
              <Lightbulb className="w-8 h-8 text-white flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Today's Productivity Tip</h2>
                <p className="text-white text-lg">{dailyTip}</p>
              </div>
            </div>
          </div>

          {/* Task Management */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-bold">Task Planner</h2>
            </div>

            {/* Add Task Form */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="What needs to be done?"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-3 bg-white dark:bg-gray-800"
              />
              <div className="flex flex-wrap gap-3">
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as 'high' | 'medium' | 'low')}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <input
                  type="number"
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(parseInt(e.target.value) || 0)}
                  placeholder="Minutes"
                  className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                />
                <button
                  onClick={addTask}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  Add Task
                </button>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {sortedTasks.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No tasks yet. Add one to get started!</p>
              ) : (
                sortedTasks.map(task => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition ${
                      task.completed
                        ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                        : task.priority === 'high'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                        : task.priority === 'medium'
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
                        : 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                    }`}
                  >
                    <button onClick={() => toggleTask(task.id)}>
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.text}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold capitalize">{task.priority}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {task.timeEstimate}m
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Focus Timer & Stats */}
          <div className="space-y-6">
            {/* Focus Timer */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-2xl font-bold">Focus Timer</h2>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
                  {formatTime(focusTime)}
                </div>
                {!isTimerRunning ? (
                  <button
                    onClick={startTimer}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <Play className="w-5 h-5" />
                    Start Focus Session
                  </button>
                ) : (
                  <button
                    onClick={stopTimer}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <Pause className="w-5 h-5" />
                    End Session
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-2xl font-bold">Today's Stats</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Tasks Completed</span>
                    <span className="font-bold">{completedTasks}/{totalTasks}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-indigo-600 h-3 rounded-full transition-all"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Focus Time</span>
                    <span className="font-bold">{formatTime(totalFocusToday)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Distraction Blocker */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                <h2 className="text-2xl font-bold">Distraction Blocker</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Track sites to avoid during focus time
              </p>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newBlockedSite}
                  onChange={(e) => setNewBlockedSite(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addBlockedSite()}
                  placeholder="example.com"
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
                <button
                  onClick={addBlockedSite}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {blockedSites.map(site => (
                  <div
                    key={site}
                    className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <span className="text-sm">{site}</span>
                    <button
                      onClick={() => removeBlockedSite(site)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
