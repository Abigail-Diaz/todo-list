import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

// import useState hook to create a new state variable
import { useState, useEffect } from 'react';

function App() {
  // Create a state variable to hold the current list of todos
  const [todoList, setTodoList] = useState([]);
  // Create a state variable to hold the current error message (if any)
  const [errorMessage, setErrorMessage] = useState('');
  // hold loading state
  const [isLoading, setIsLoading] = useState(false);
  // Airtable API constants
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  // fetch the todos from the Airtable
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };
      // fetch data from the API and handle errors
      try {
        const resp = await fetch(url, options);
        if (!resp.ok) {
          throw new Error(resp.statusText);
        }
        const { records } = await resp.json();

        // map Airtable records to todo objects
        const todos = records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          };
          // ensure isCompleted has a boolean value in case it is not returned by the Airtable
          if (!todo.isCompleted) {
            todo.isCompleted = false;
          }
          return todo;
        });
        setTodoList(todos);
      } catch (error) {
        // handle errors when fetching from the API
        setErrorMessage(error.message);
      } finally {
        // loading state set to false to clear loading message
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Add a new todo to the list
  const handleAddTodo = async (newTodo) => {
    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);

      if (!resp.ok) {
        throw new Error(resp.statusText);
      }

      const { records } = await resp.json();

      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };
      // ensure isCompleted has a boolean value in case it is not returned by the Airtable
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }
      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      // implement saving message on button functionality on next commit
    }
  };

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

  // update the todo title when edited
  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return { ...editedTodo };
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
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Dismiss</button>
        </div>
      )}
    </div>
  );
}
export default App;
