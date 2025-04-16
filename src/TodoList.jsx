// import TodoListItem component
import TodoListItem from './TodoListItem';
// function to return a list of todos
// This component will be used to display the list of todos
function TodoList({ todoList, onCompleteTodo }) {
  // filter out completed todos from the list
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);
  return (
    <>
      {/* Render a add to do message if the todo list is empty */}
      {filteredTodoList.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <ul>
          {/* Render each todos item as a TodoListItem component for better organization*/}
          {filteredTodoList.map((todo) => (
            <TodoListItem
              todo={todo}
              key={todo.id}
              onCompleteTodo={onCompleteTodo}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default TodoList;
