import { create } from 'zustand';
import { Todo } from '@prisma/client';
import { getApi, postApi, putApi, deleteApi } from '../services/api';

interface TodoState {
    todos: Todo[];
    isLoading: boolean;
    error: string | null;
    fetchTodos: () => Promise<void>;
    addTodo: (title: string, description?: string) => Promise<void>;
    updateTodo: (id: string, data: Partial<Todo>) => Promise<void>;
    removeTodo: (id: string) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set) => ({
    todos: [],
    isLoading: false,
    error: null,

    fetchTodos: async () => {
        set({ isLoading: true, error: null });
        try {
            const todos = await getApi<Todo[]>('/api/todos');
            set({ todos, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    addTodo: async (title: string, description?: string) => {
        set({ isLoading: true, error: null });
        try {
            const newTodo = await postApi<Todo>('/api/todos', { title, description });
            set((state) => ({ todos: [...state.todos, newTodo], isLoading: false }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateTodo: async (id: string, data: Partial<Todo>) => {
        try {
            const updated = await putApi<Todo>(`/api/todos/${id}`, data);
            set((state) => ({
                todos: state.todos.map((t) => (t.id === id ? updated : t)),
            }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    removeTodo: async (id: string) => {
        try {
            await deleteApi(`/api/todos/${id}`);
            set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },
}));
