import { useRef } from 'react';
import { useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

// Component to handle the form
function TodoForm({ onAddTodo }) {
  // state variable to hold the input value of the todo title
  const [workingTodo, setWorkingTodo] = useState('');
  const todoTitleInput = useRef('');

  // function to add a new todo
  function handleAddTodo(event) {
    event.preventDefault();
    const id = Date.now();

    // pass the new todo object to the onAddTodo function
    // This allows the new todo to be added to the todo list in the parent component
    onAddTodo({ title: workingTodo, id, isCompleted: false });

    // clear the input field and set focus back to it
    setWorkingTodo('');
    todoTitleInput.current.focus();
  }

  return (
    <>
      <form onSubmit={handleAddTodo}>
        {/* call function to add a new todo item upon submission */}
        <TextInputWithLabel
          elementId="todoTitle"
          label="Todo"
          onChange={(event) => {
            setWorkingTodo(event.target.value);
          }}
          ref={todoTitleInput}
          value={workingTodo}
        />

        <button type="submit" disabled={workingTodo.trim() == ''}>
          Add Todo
        </button>
      </form>
    </>
  );
}
export default TodoForm;
