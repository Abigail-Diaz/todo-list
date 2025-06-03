import './App.css';

import styles from './App.module.css';
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

// Import pages
import TodosPage from './pages/TodosPage';

// import useState hook to create a new state variable
import { useState, useEffect, useCallback, useReducer } from 'react';

import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
// Airtable API constants
const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const { isLoading, todoList, isSaving, errorMessage, sortField, sortDirection, queryString } = todoState;
  const encodeUrl = useCallback(
    () => {
      let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
      let searchQuery = '';
      if (queryString) {
        searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
      }
      return encodeURI(`${url}?${sortQuery}${searchQuery}`);
    },
    [queryString, sortDirection, sortField]
  );

  // helpers to refactor the code and handle repeated code
  function createOptions(method, records) {
    const opts = {
      method,
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    };
    if (records) {
      opts.body = JSON.stringify({ records });
    }
    return opts;
  }

  // fetch the todos from the Airtable
  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });
      try {
        const resp = await fetch(
          encodeUrl(),
          createOptions('GET')
        );
        if (!resp.ok) throw new Error(resp.statusText);
        const { records } = await resp.json();
        dispatch({
          type: todoActions.loadTodos,
          records: records,
        });
      } catch (error) {
        // handle errors when fetching from the API
        dispatch({
          type: todoActions.setLoadError,
          error,
        });
      }
    };

    fetchTodos();
  }, [sortDirection, sortField, queryString]);

  // Add a new todo to the list
  const handleAddTodo = async (newTodo) => {
    const fields = { title: newTodo.title, isCompleted: newTodo.isCompleted };
    // send POST with helper
    const options = createOptions('POST', [{ fields }]);

    try {
      // display the saving message
      dispatch({ type: todoActions.startRequest });
      const resp = await fetch(
        encodeUrl(),
        options
      );

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
      dispatch({
        type: todoActions.addTodo,
        records: records,
      });
    } catch (error) {
      dispatch({
        type: todoActions.setLoadError,
        error,
      });
    } finally {
      // stop saving message on button
      dispatch({ type: todoActions.endRequest });
    }
  };

  // helper function to set a todo as completed
  async function completeTodo(id) {
    dispatch({ type: todoActions.startRequest });
    const originalTodo = todoList.find((todo) => todo.id === id);
    // send PATCH request to mark as completed
    const records = [{ id, fields: { isCompleted: true } }];
    const options = createOptions('PATCH', records);

    try {
      dispatch({
        type: todoActions.completeTodo, id
      });

      // Send the PATCH request
      const resp = await fetch(
        encodeUrl(),
        options
      );
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
      dispatch({
        type: todoActions.updateTodo,
        editedTodo: completedTodo,
      });
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: originalTodo,
        error
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  }

  // helper function to set a todo as completed
  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    // send PATCH request with updated fields
    const records = [
      {
        id: editedTodo.id,
        fields: {
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        },
      },
    ];
    const options = createOptions('PATCH', records);

    try {
      // display the saving message
      dispatch({ type: todoActions.startRequest });
      dispatch({
        type: todoActions.updateTodo,
        editedTodo,
      });
      // Send the PATCH request
      const resp = await fetch(
        encodeUrl(),
        options
      );
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
      dispatch({
        type: todoActions.updateTodo,
        editedTodo: updatedTodo,
      });
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: originalTodo,
        error
      });
    } finally {
      // Reset isSaving to false after the operation completes
      dispatch({ type: todoActions.endRequest });
    }
  }
  return (
    <>
      <div className={styles.formContainer}>
        <nav>
          <NavLink to="/">Home</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={
            <TodosPage
              todoList={todoList}
              isLoading={isLoading}
              updateTodo={updateTodo}
              completeTodo={completeTodo}
              handleAddTodo={handleAddTodo}
              isSaving={isSaving}
              sortField={sortField}
              errorMessage={errorMessage}
              queryString={queryString}
              dispatch={dispatch}
              sortDirection={sortDirection}
            />
          }>
          </Route>
          <Route path="/about" element={<h1>About Page</h1>}></Route>
        </Routes >
      </div>
    </>
  );
}
export default App;
