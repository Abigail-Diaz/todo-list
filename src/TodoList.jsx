// import TodoListItem component
import TodoListItem from './TodoListItem';
// function to return a list of todos
// This component will be used to display the list of todos
function TodoList({ todoList }) {
  return (
    <>
      <ul>
        {todoList.map((todo) => (
          // Render each todos item as a TodoListItem component for better organization
          <TodoListItem todo={todo} key={todo.id} />
        ))}
      </ul>
    </>
  );
}

export default TodoList;
