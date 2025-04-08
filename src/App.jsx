import './App.css';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

// import useState hook to create a new state variable
import { useState } from 'react';

function App() {
  // Create a state variable to hold the current list of todos
  const [todoList, setTodoList] = useState([]);

  // Add a new todo to the list
  function handleAddTodo(newTodo) {
    setTodoList([...todoList, newTodo]);
    console.log(todoList);
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={handleAddTodo} />{' '}
      {/*Pass the handleAddTodo function to the TodoForm component*/}
      <TodoList todoList={todoList} />{' '}
      {/*Pass the todoList state variable to the TodoList component*/}
    </div>
  );
}
export default App;
