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
}) {
  return (
    <>
      <form onSubmit={preventRefresh}>
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
