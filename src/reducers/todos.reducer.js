const actions = {
  //actions in useEffect that loads todos
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  //found in useEffect and addTodo to handle failed requests
  setLoadError: 'setLoadError',
  //actions found in addTodo
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  //found in helper functions
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  //reverts todos when requests fail
  revertTodo: 'revertTodo',
  //action on Dismiss Error button
  clearError: 'clearError',

  setSortField: 'setSortField',
  setSortDirection: 'setSortDirection',
  setQueryString: 'setQueryString',
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
      };
    case actions.loadTodos:
      return {
        ...state,
        todoList: action.records.map(recordToTodo),
        isLoading: false,
      };
    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
      };
    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };
    case actions.addTodo:
      const record = action.records[0];
      const savedTodo = {
        id: record.id,
        ...record.fields,
        isCompleted: record.fields.isCompleted ?? false,
      };

      return {
        ...state,
        todoList: [savedTodo, ...state.todoList],
        isSaving: false,
      };
    case actions.endRequest:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };
    case actions.revertTodo:

    case actions.updateTodo:
      const updatedTodos = state.todoList.map((todo) =>
        todo.id === action.editedTodo.id ? { ...action.editedTodo } : todo
      );

      const updatedState = {
        ...state,
        todoList: updatedTodos,
      };

      if (action.error) {
        updatedState.errorMessage = action.error.message;
      }

      return updatedState;

    case actions.completeTodo:
      const completedTodos = state.todoList.map((todo) =>
        todo.id === action.id ? { ...todo, isCompleted: true } : todo
      );
      return {
        ...state,
        todoList: completedTodos,
      };

    case actions.clearError:
      return {
        ...state,
        errorMessage: '',
      };
    case actions.setSortField:
      return {
        ...state,
        sortField: action.sortField,
      };

    case actions.setSortDirection:
      return {
        ...state,
        sortDirection: action.sortDirection,
      };

    case actions.setQueryString:
      return {
        ...state,
        queryString: action.queryString,
      };

    default:
      return state;
  }
}

const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
  sortDirection: 'desc',
  sortField: 'createdTime',
  queryString: '',
};

function recordToTodo(record) {
  const todo = { id: record.id, ...record.fields };
  if (!todo.isCompleted) todo.isCompleted = false;
  return todo;
}

export { reducer, actions, initialState };
