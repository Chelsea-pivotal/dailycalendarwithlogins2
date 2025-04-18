import React, { useState, useEffect } from 'react';

interface TodoFormProps {
  addTodo: (
    text: string, 
    category: string, 
    priority: string, 
    scheduledDate?: string, 
    scheduledTime?: string,
    startTime?: string,
    endTime?: string
  ) => void;
  editingTodo: { 
    id: string; 
    text: string; 
    category: string; 
    priority: string;
    scheduledDate?: string;
    scheduledTime?: string;
    startTime?: string;
    endTime?: string;
  } | null;
  updateTodo: (
    id: string, 
    text: string, 
    category: string, 
    priority: string,
    scheduledDate?: string,
    scheduledTime?: string,
    startTime?: string,
    endTime?: string
  ) => void;
  cancelEdit: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ 
  addTodo, 
  editingTodo, 
  updateTodo, 
  cancelEdit 
}) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showScheduling, setShowScheduling] = useState(false);

  useEffect(() => {
    if (editingTodo) {
      setText(editingTodo.text);
      setCategory(editingTodo.category);
      setPriority(editingTodo.priority);
      setScheduledDate(editingTodo.scheduledDate || '');
      setScheduledTime(editingTodo.scheduledTime || '');
      setStartTime(editingTodo.startTime || '');
      setEndTime(editingTodo.endTime || '');
      setShowScheduling(
        !!(editingTodo.scheduledDate || editingTodo.scheduledTime || editingTodo.startTime || editingTodo.endTime)
      );
    } else {
      resetForm();
    }
  }, [editingTodo]);

  const resetForm = () => {
    setText('');
    setCategory('');
    setPriority('medium');
    setScheduledDate('');
    setScheduledTime('');
    setStartTime('');
    setEndTime('');
    setShowScheduling(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) return;
    
    if (editingTodo) {
      updateTodo(
        editingTodo.id, 
        text, 
        category, 
        priority, 
        scheduledDate || undefined, 
        scheduledTime || undefined,
        startTime || undefined,
        endTime || undefined
      );
    } else {
      addTodo(
        text, 
        category, 
        priority, 
        scheduledDate || undefined, 
        scheduledTime || undefined,
        startTime || undefined,
        endTime || undefined
      );
    }
    
    resetForm();
  };

  const categories = ['work', 'personal', 'health', 'learning', 'errands'];

  return (
    <div className="mb-8 bg-morandi-sand bg-opacity-20 p-6 rounded-lg border border-morandi-fog">
      <h2 className="text-xl font-semibold text-morandi-stone mb-4">
        {editingTodo ? 'Edit Task' : 'Add New Task'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-morandi-stone mb-1">
              Task Description
            </label>
            <input
              type="text"
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 border border-morandi-fog rounded-md focus:outline-none focus:ring-2 focus:ring-morandi-sage"
              placeholder="What needs to be done?"
              required
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-morandi-stone mb-1">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    category === cat
                      ? 'bg-morandi-sage text-white'
                      : 'bg-white border border-morandi-fog text-morandi-stone hover:bg-morandi-fog/20'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-morandi-stone mb-1">
            Priority
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPriority('low')}
              className={`px-4 py-1 rounded-md ${
                priority === 'low'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-white border border-morandi-fog text-morandi-stone hover:bg-morandi-fog/20'
              }`}
            >
              Low
            </button>
            <button
              type="button"
              onClick={() => setPriority('medium')}
              className={`px-4 py-1 rounded-md ${
                priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  : 'bg-white border border-morandi-fog text-morandi-stone hover:bg-morandi-fog/20'
              }`}
            >
              Medium
            </button>
            <button
              type="button"
              onClick={() => setPriority('high')}
              className={`px-4 py-1 rounded-md ${
                priority === 'high'
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-white border border-morandi-fog text-morandi-stone hover:bg-morandi-fog/20'
              }`}
            >
              High
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowScheduling(!showScheduling)}
            className="text-morandi-sage hover:underline text-sm flex items-center"
          >
            {showScheduling ? 'Hide Scheduling Options' : 'Add Scheduling Options'}
          </button>
        </div>
        
        {showScheduling && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-white rounded-md border border-morandi-fog">
            <div>
              <label htmlFor="scheduledDate" className="block text-sm font-medium text-morandi-stone mb-1">
                Date
              </label>
              <input
                type="date"
                id="scheduledDate"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 border border-morandi-fog rounded-md focus:outline-none focus:ring-2 focus:ring-morandi-sage"
              />
            </div>
            
            <div>
              <label htmlFor="scheduledTime" className="block text-sm font-medium text-morandi-stone mb-1">
                Reminder Time
              </label>
              <input
                type="time"
                id="scheduledTime"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 border border-morandi-fog rounded-md focus:outline-none focus:ring-2 focus:ring-morandi-sage"
              />
            </div>
            
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-morandi-stone mb-1">
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-morandi-fog rounded-md focus:outline-none focus:ring-2 focus:ring-morandi-sage"
              />
            </div>
            
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-morandi-stone mb-1">
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-morandi-fog rounded-md focus:outline-none focus:ring-2 focus:ring-morandi-sage"
              />
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-morandi-sage text-white py-2 px-4 rounded-md hover:bg-morandi-sage/90 transition-colors"
          >
            {editingTodo ? 'Update Task' : 'Add Task'}
          </button>
          
          {editingTodo && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-morandi-fog text-morandi-stone py-2 px-4 rounded-md hover:bg-morandi-fog/80 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TodoForm;
