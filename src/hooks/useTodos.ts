import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Todo } from '../types';
import { useAuth } from '../context/AuthContext';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch todos from Supabase
  const fetchTodos = async () => {
    if (!user) {
      setTodos([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const formattedTodos = data.map((todo: any) => ({
          id: todo.id,
          text: todo.text,
          completed: todo.completed,
          category: todo.category || '',
          priority: todo.priority || 'medium',
          createdAt: new Date(todo.created_at),
          scheduledDate: todo.scheduled_date,
          scheduledTime: todo.scheduled_time,
          startTime: todo.start_time,
          endTime: todo.end_time,
          user_id: todo.user_id
        }));
        setTodos(formattedTodos);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new todo
  const addTodo = async (
    text: string, 
    category: string, 
    priority: string, 
    scheduledDate?: string, 
    scheduledTime?: string,
    startTime?: string,
    endTime?: string
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([
          { 
            text, 
            category, 
            priority, 
            scheduled_date: scheduledDate,
            scheduled_time: scheduledTime,
            start_time: startTime,
            end_time: endTime,
            user_id: user.id
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      if (data && data[0]) {
        const newTodo: Todo = {
          id: data[0].id,
          text: data[0].text,
          completed: data[0].completed,
          category: data[0].category || '',
          priority: data[0].priority || 'medium',
          createdAt: new Date(data[0].created_at),
          scheduledDate: data[0].scheduled_date,
          scheduledTime: data[0].scheduled_time,
          startTime: data[0].start_time,
          endTime: data[0].end_time,
          user_id: data[0].user_id
        };
        setTodos([newTodo, ...todos]);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding todo:', err);
    }
  };

  // Toggle todo completion status
  const toggleTodo = async (id: string) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      if (!todoToUpdate) return;

      const { error } = await supabase
        .from('todos')
        .update({ completed: !todoToUpdate.completed })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTodos(
        todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (err: any) {
      setError(err.message);
      console.error('Error toggling todo:', err);
    }
  };

  // Delete a todo
  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting todo:', err);
    }
  };

  // Update a todo
  const updateTodo = async (
    id: string, 
    text: string, 
    category: string, 
    priority: string,
    scheduledDate?: string,
    scheduledTime?: string,
    startTime?: string,
    endTime?: string
  ) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ 
          text, 
          category, 
          priority, 
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
          start_time: startTime,
          end_time: endTime
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTodos(
        todos.map(todo =>
          todo.id === id ? { 
            ...todo, 
            text, 
            category, 
            priority: priority as Todo['priority'],
            scheduledDate,
            scheduledTime,
            startTime,
            endTime
          } : todo
        )
      );
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating todo:', err);
    }
  };

  // Load todos when user changes
  useEffect(() => {
    if (user) {
      fetchTodos();
    } else {
      setTodos([]);
      setLoading(false);
    }
  }, [user]);

  return {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo
  };
};
