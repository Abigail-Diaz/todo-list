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
  // hold the saving state
  const [isSaving, setIsSaving] = useState(false);
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
      // display the saving message
      setIsSaving(true);
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
      // stop saving message on button
      setIsSaving(false);
    }
  };

  // helper function to set a todo as completed
  async function completeTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id);

    const payload = {
      records: [
        {
          id: id,
          fields: {
            isCompleted: true,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const updatedTodos = todoList.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: true } : todo
      );
      setTodoList(updatedTodos);

      // 5. Send the PATCH request
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error('Failed to complete todo');
      }

      const { records } = await resp.json();

      const completedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      if (records[0].fields.isCompleted === undefined) {
        completedTodo.isCompleted = true;
      }

      const finalTodos = todoList.map((todo) =>
        todo.id === completedTodo.id ? { ...completedTodo } : todo
      );
      setTodoList(finalTodos);
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      const revertedTodos = todoList.map((todo) =>
        todo.id === originalTodo.id ? { ...originalTodo } : todo
      );
      setTodoList(revertedTodos);
    } finally {
      setIsSaving(false);
    }
  }

  // helper function to set a todo as completed
  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    // Create options object for fetch request
    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token, // Using the same Authorization token as before
        'Content-Type': 'application/json', // JSON
      },
      body: JSON.stringify(payload), //  JSON
    };

    try {
      // display the saving message
      setIsSaving(true);
      // Optimistically update the UI before the request completes
      const updatedTodos = todoList.map((todo) =>
        todo.id === editedTodo.id ? { ...editedTodo } : todo
      );
      setTodoList(updatedTodos);

      // Send the PATCH request
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error('Failed to update todo');
      }

      const { records } = await resp.json();

      // Create updatedTodo object
      const updatedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      // Ensure isCompleted is explicitly set to false if missing
      if (!records[0].fields.isCompleted) {
        updatedTodo.isCompleted = false;
      }

      // update after successful API call
      const finalTodos = todoList.map((todo) =>
        todo.id === updatedTodo.id ? { ...updatedTodo } : todo
      );
      setTodoList(finalTodos);
    } catch (error) {
      // Revert the UI update if the API request fails
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      // Revert to the original todo state in case of an error
      // This is the original todo before the optimistic update
      const revertedTodos = todoList.map((todo) =>
        todo.id === originalTodo.id ? { ...originalTodo } : todo
      );
      setTodoList(revertedTodos);
    } finally {
      // Reset isSaving to false after the operation completes
      setIsSaving(false);
    }
  }
  return (
    <div>
      <h1>My Todos</h1>
      {/*Pass the handleAddTodo function to the TodoForm component*/}
      <TodoForm onAddTodo={handleAddTodo} isSaving={isSaving} />
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
