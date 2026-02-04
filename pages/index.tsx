
import { useEffect, useState } from 'react';
import { useTodoStore } from '../store/useTodoStore';

export default function Home() {
  const { todos, fetchTodos, addTodo, updateTodo, removeTodo, isLoading, error } = useTodoStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const startEditing = (todo: any) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const saveEditing = async (id: string) => {
    if (!editTitle.trim()) return;
    await updateTodo(id, { title: editTitle, description: editDescription });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addTodo(title, description);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-cyan-400">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 tracking-tight mb-2">
            Task Master
          </h1>
          <p className="text-gray-400 text-lg">Manage your tasks with style & efficiency</p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-4 mb-6 rounded-r shadow-lg backdrop-blur-sm animate-pulse">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Input Form */}
        <section className="mb-10">
          <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 p-6 rounded-2xl shadow-2xl transition-all hover:shadow-purple-500/10">
            <div className="grid gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1 ml-1">Title</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-gray-600 text-gray-100"
                />
              </div>

              <div>
                <label htmlFor="desc" className="block text-sm font-medium text-gray-300 mb-1 ml-1">Description (Optional)</label>
                <textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details about the task..."
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-gray-600 text-gray-100 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !title}
                className="w-full sm:w-auto sm:self-end sm:ml-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : 'Add Task'}
              </button>
            </div>
          </form>
        </section>

        {/* Todo List */}
        <section className="space-y-4">
          {isLoading && todos.length === 0 ? (
            <div className="text-center text-gray-500 py-10 animate-pulse">Loading tasks...</div>
          ) : todos.length === 0 ? (
            <div className="text-center text-gray-500 py-10 bg-gray-800/30 rounded-2xl border border-dashed border-gray-700">
              <p>No tasks yet. Start by adding one!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`group relative flex items-start sm:items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${todo.status === 'completed'
                  ? 'bg-gray-900/40 border-gray-800 opacity-75'
                  : 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-800/80 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5'
                  }`}
              >
                {editingId === todo.id ? (
                  <div className="flex-1 w-full space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-purple-500 outline-none"
                      placeholder="Task title"
                      autoFocus
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:border-purple-500 outline-none resize-none"
                      placeholder="Description"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={cancelEditing} className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">Cancel</button>
                      <button onClick={() => saveEditing(todo.id)} className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 rounded-md transition-colors">Save</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => updateTodo(todo.id, { status: todo.status === 'completed' ? 'pending' : 'completed' })}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-1 sm:mt-0 ${todo.status === 'completed'
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-500 text-transparent hover:border-purple-400'
                        }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                    </button>

                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-semibold truncate transition-all ${todo.status === 'completed' ? 'text-gray-500 line-through decoration-2 decoration-gray-600' : 'text-gray-100'}`}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className={`text-sm mt-0.5 break-words ${todo.status === 'completed' ? 'text-gray-600' : 'text-gray-400'}`}>
                          {todo.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 mt-2">
                        {new Date(todo.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditing(todo)}
                        className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                        title="Edit Task"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button
                        onClick={() => removeTodo(todo.id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete Task"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
