import React, { useState, useRef } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  // state variable to edit the todo title
  const [isEditing, setIsEditing] = useState(false);
  // state variable to hold the input value of the todo title
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  const handleCancel = () => {
    setIsEditing(false);
    setWorkingTitle(todo.title);
  };

  const handleEdit = (event) => {
    setWorkingTitle(event.target.value);
  };

  const handleUpdate = (event) => {
    if (!isEditing) {
      return;
    }
    event.preventDefault();
    onUpdateTodo({ ...todo, title: workingTitle });
    setIsEditing(false);
  };
  return (
    <li>
      <form onSubmit={handleUpdate}>
        {/* Display the editing mode if the todo is being edited */}
        {isEditing ? (
          <>
            <TextInputWithLabel value={workingTitle} onChange={handleEdit} />
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" onClick={handleUpdate}>
              Update
            </button>
          </>
        ) : (
          <>
            <label>
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => {
                  return onCompleteTodo(todo.id);
                }}
              />
              <span onClick={() => setIsEditing(true)}>{todo.title}</span>
            </label>
          </>
        )}
      </form>
    </li>
  );
}
export default TodoListItem;
