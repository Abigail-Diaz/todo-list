// import TodoListItem component
import TodoListItem from './TodoListItem';
// function to return a list of todos
// This component will be used to display the list of todos
function TodoList({ todoList }) {
  return (
    <>
      {/* Render a add to do message if the todo list is empty */}
      {todoList.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <ul>
          {/* Render each todos item as a TodoListItem component for better organization*/}
          {todoList.map((todo) => (
            <TodoListItem todo={todo} key={todo.id} />
          ))}
        </ul>
      )}
    </>
  );
}

export default TodoList;
