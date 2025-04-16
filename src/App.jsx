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
  }

  // helper function to set a todo as completed
  function completeTodo(id) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  }

  return (
    <div>
      <h1>My Todos</h1>
      {/*Pass the handleAddTodo function to the TodoForm component*/}
      <TodoForm onAddTodo={handleAddTodo} />
      {/*Pass the todoList state variable to the TodoList component*/}
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
  );
}
export default App;
