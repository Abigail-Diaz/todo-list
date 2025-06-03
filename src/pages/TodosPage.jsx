import TodoList from '../features/TodoList/TodoList';
import TodoForm from '../features/TodoForm';
import TodosViewForm from '../features/TodosViewForm';

import {
    actions as todoActions,
} from '../reducers/todos.reducer';

// Contains the todo list page main components
function TodosPage({ 
    todoList,
    isLoading,
    updateTodo,
    completeTodo,
    handleAddTodo,
    isSaving,
    sortField,
    errorMessage,
    queryString,
    dispatch,
    sortDirection}) {
    return (
        <>
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
            <hr />
            <TodosViewForm
                sortField={sortField}
                setSortField={(field) => dispatch({ type: todoActions.setSortField, sortField: field })}
                sortDirection={sortDirection}
                setSortDirection={(dir) => dispatch({ type: todoActions.setSortDirection, sortDirection: dir })}
                queryString={queryString}
                setQueryString={(q) => dispatch({ type: todoActions.setQueryString, queryString: q })}
            />
            {errorMessage && (
                <div className={styles.errorMessage}>
                    <hr />
                    <p>{errorMessage}</p>
                    <button onClick={() => dispatch({ type: todoActions.clearError })}>Dismiss</button>
                </div>
            )}
        </>
    );
}

export default TodosPage;