import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import TodoList from '../features/TodoList/TodoList';
import TodoForm from '../features/TodoForm';
import TodosViewForm from '../features/TodosViewForm';
import styles from './TodosPage.module.css';

import { actions as todoActions } from '../reducers/todos.reducer';

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
    sortDirection,
}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const itemsPerPage = 15;
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
    const totalPages = Math.ceil(todoList.length / itemsPerPage);

    const currentTodos = todoList.slice(indexOfFirstTodo, indexOfFirstTodo + itemsPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setSearchParams({ page: (currentPage - 1).toString() });
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setSearchParams({ page: (currentPage + 1).toString() });
        }
    };

    useEffect(() => {
        if (
            totalPages > 0 &&
            (Number.isNaN(currentPage) || currentPage < 1 || currentPage > totalPages)
        ) {
            navigate('/');
        }
    }, [currentPage, totalPages, navigate]);

    return (
        <>
            <TodoForm onAddTodo={handleAddTodo} isSaving={isSaving} />
            <TodoList
                todoList={currentTodos}
                onCompleteTodo={completeTodo}
                onUpdateTodo={updateTodo}
                isLoading={isLoading}
            />
            <div className={styles.paginationControls}>
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
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
