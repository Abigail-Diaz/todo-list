// import TodoListItem component
import TodoListItem from "./TodoListItem";
{/*extract from TodoList.jsx*/}

function TodoList(){
    const todos = [
      { id: 1, title: 'review resouces' },
      { id: 2, title: 'take notes' },
      { id: 3, title: 'code out app' },
    ];
    
    return(
    <>
    <ul>
        {todos.map((todo) => (
          // Render each todos item as a TodoListItem component for better organization
          <TodoListItem key = {todo.id} todo = {todo}/>
        ))}
    </ul>
    </>
    )
}

export default TodoList