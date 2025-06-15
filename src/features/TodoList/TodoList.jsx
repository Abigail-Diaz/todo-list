// import TodoListItem component
import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';
// function to return a list of todos
// This component will be used to display the list of todos
function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  if (isLoading) {
    return <p>Todo list loading...</p>;
  }
  return (
    <>
      {/* Render a add to do message if the todo list is empty */}
      {todoList.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <ul className={styles.list}>
          {/* Render each todos item as a TodoListItem component for better organization*/}
          {todoList.map((todo) => (
            <TodoListItem
              todo={todo}
              key={todo.id}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default TodoList;
