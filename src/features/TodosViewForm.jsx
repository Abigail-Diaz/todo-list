import { useEffect, useState } from 'react';
import styled from 'styled-components';

// Styled components
const StyledSelect = styled.select`
  padding: 5px;
  border-radius: 5px;
  margin-right: 0.5rem;
`;

const StyledLabel = styled.label`
  padding-right: 0.5rem;
`;

// Prevent default form submission to avoid page refresh
function preventRefresh(event) {
  event.preventDefault();
}

function TodosViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);

    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryString]);

  return (
    <>
      <form onSubmit={preventRefresh}>
        <div>
          <StyledLabel htmlFor="queryString">Search todos</StyledLabel>
          <input
            type="text"
            id="queryString"
            value={localQueryString}
            onChange={(e) => setLocalQueryString(e.target.value)}
          />
          <button type="button" onClick={() => setLocalQueryString('')}>
            Clear
          </button>
        </div>

        <div>
          <StyledLabel htmlFor="sortBy">Sort By</StyledLabel>
          <StyledSelect
            id="sortBy"
            name="sortBy"
            value={sortField}
            onChange={(event) => setSortField(event.target.value)}
          >
            <option value="title">Title</option>
            <option value="createdTime">Time added</option>
          </StyledSelect>

          <StyledLabel htmlFor="sortDirection">Direction</StyledLabel>
          <StyledSelect
            id="sortDirection"
            name="sortDirection"
            value={sortDirection}
            onChange={(event) => setSortDirection(event.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </StyledSelect>
        </div>
      </form>
    </>
  );
}

export default TodosViewForm;
