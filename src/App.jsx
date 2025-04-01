import './App.css';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

// import useState hook to create a new state variable
import { useState } from 'react';

function App() {
  const [newTodo, setNewTodo] = useState('add todos here');
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <p>{newTodo}</p>
      <TodoList />
    </div>
  );
}
export default App;
