// Prevent default form submission to avoid page refresh
function preventRefresh(event) {
  event.preventDefault();
}

// This component is used to sort the todos by title or created time
function TodosViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  return (
    <>
      <form onSubmit={preventRefresh}>
        <div>
          <label for="queryString">Search todos</label>
          <input
            type="text"
            id="queryString"
            value={queryString}
            onChange={(e) => setQueryString(e.target.value)}
          />
          <button type="button" onClick={(e) => setQueryString('')}>
            Clear
          </button>
        </div>
        <div>
          <label for="sortBy">Sort By</label>
          <select
            id="sortBy"
            name="sortBy"
            defaultValue="title"
            value={sortField}
            onChange={(event) => setSortField(event.target.value)}
          >
            <option value="title">Title</option>
            <option value="createdTime">Time added</option>
          </select>
        </div>
      </form>
    </>
  );
}

export default TodosViewForm;
