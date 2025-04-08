import { useRef } from 'react';

// Component to handle the form
function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef('');

  // function to add a new todo
  function handleAddTodo(event) {
    event.preventDefault();
    const title = event.target.title.value;
    const id = Date.now();

    // Handle empty title case
    if (title.trim() === '') {
      alert('Please enter a todo title.');
      return;
    }
    // pass the new todo object to the onAddTodo function
    // This allows the new todo to be added to the todo list in the parent component
    onAddTodo({ title, id });

    // clear the input field and set focus back to it
    event.target.title.value = '';
    todoTitleInput.current.focus();
  }

  return (
    <>
      <form onSubmit={handleAddTodo}>
        {' '}
        {/* call function to add a new todo item upon submission */}
        <label htmlFor="todoTitle">Todo</label>
        <input
          ref={todoTitleInput}
          name="title"
          id="todoTitle"
          type="text"
        ></input>
        <button type="submit">Add Todo</button>
      </form>
    </>
  );
}
export default TodoForm;
