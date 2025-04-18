import React, { useState } from 'react';
import { Todo } from './types';
import { useAuth } from './context/AuthContext';
import { useTodos } from './hooks/useTodos';
import Header from './components/Header';
import Login from './components/Auth/Login';
import MotivationalQuote from './components/MotivationalQuote';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import EisenhowerMatrix from './components/EisenhowerMatrix';
import DailyTimetable from './components/DailyTimetable';
import WeekSchedule from './components/WeekSchedule';
import MonthSchedule from './components/MonthSchedule';
import ProgressBar from './components/ProgressBar';
import MotivationalTips from './components/MotivationalTips';
import DailyAffirmation from './components/DailyAffirmation';
import MotivationalDashboard from './components/MotivationalDashboard';
import WeeklyGoals from './components/WeeklyGoals';
import SuccessCelebration from './components/SuccessCelebration';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { 
    todos, 
    loading: todosLoading, 
    addTodo, 
    toggleTodo, 
    deleteTodo, 
    updateTodo 
  } = useTodos();
  
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'matrix' | 'timetable' | 'week' | 'month'>('list');
  const [editingTodo, setEditingTodo] = useState<{ 
    id: string; 
    text: string; 
    category: string; 
    priority: string;
    scheduledDate?: string;
    scheduledTime?: string;
    startTime?: string;
    endTime?: string;
  } | null>(null);

  const handleAddTodo = (
    text: string, 
    category: string, 
    priority: string, 
    scheduledDate?: string, 
    scheduledTime?: string,
    startTime?: string,
    endTime?: string
  ) => {
    addTodo(text, category, priority, scheduledDate, scheduledTime, startTime, endTime);
  };

  const startEditTodo = (id: string) => {
    const todoToEdit = todos.find(todo => todo.id === id);
    if (todoToEdit) {
      setEditingTodo({
        id: todoToEdit.id,
        text: todoToEdit.text,
        category: todoToEdit.category,
        priority: todoToEdit.priority,
        scheduledDate: todoToEdit.scheduledDate,
        scheduledTime: todoToEdit.scheduledTime,
        startTime: todoToEdit.startTime,
        endTime: todoToEdit.endTime
      });
    }
  };

  const handleUpdateTodo = (
    id: string, 
    text: string, 
    category: string, 
    priority: string,
    scheduledDate?: string,
    scheduledTime?: string,
    startTime?: string,
    endTime?: string
  ) => {
    updateTodo(id, text, category, priority, scheduledDate, scheduledTime, startTime, endTime);
    setEditingTodo(null);
  };

  const cancelEdit = () => {
    setEditingTodo(null);
  };

  if (authLoading || todosLoading) {
    return (
      <div className="min-h-screen bg-morandi-sand flex items-center justify-center">
        <div className="text-morandi-stone text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-morandi-sand">
      <div className="max-w-6xl mx-auto p-6">
        {!user ? (
          <div className="mt-16">
            <Login />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 my-8 border border-morandi-fog">
            <Header />
            
            <MotivationalDashboard todos={todos} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <MotivationalQuote />
              <DailyAffirmation />
            </div>
            
            <ProgressBar todos={todos} />
            
            <MotivationalTips />
            
            <WeeklyGoals />
            
            <TodoForm 
              addTodo={handleAddTodo} 
              editingTodo={editingTodo}
              updateTodo={handleUpdateTodo}
              cancelEdit={cancelEdit}
            />
            
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={startEditTodo}
              filter={filter}
              setFilter={setFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
            
            {viewMode === 'matrix' && (
              <EisenhowerMatrix
                todos={todos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={startEditTodo}
                filter={filter}
                categoryFilter={categoryFilter}
              />
            )}

            {viewMode === 'timetable' && (
              <DailyTimetable
                todos={todos}
                onToggle={toggleTodo}
                onEdit={startEditTodo}
                filter={filter}
                categoryFilter={categoryFilter}
              />
            )}

            {viewMode === 'week' && (
              <WeekSchedule
                todos={todos}
                onToggle={toggleTodo}
                onEdit={startEditTodo}
                filter={filter}
                categoryFilter={categoryFilter}
              />
            )}

            {viewMode === 'month' && (
              <MonthSchedule
                todos={todos}
                onToggle={toggleTodo}
                onEdit={startEditTodo}
                filter={filter}
                categoryFilter={categoryFilter}
              />
            )}
          </div>
        )}
      </div>
      
      <SuccessCelebration todos={todos} />
    </div>
  );
}

export default App;
