// Display for a text input with a label

import styled from 'styled-components';

 const StyledLabel = styled.label`
    padding-right: 0.5rem;
    font-weight: bold;
  `;

function TextInputWithLabel({ elementId, label, onChange, ref, value }) {
  return (
    <>
      <StyledLabel htmlFor={elementId}>{label}</StyledLabel>
      <input
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
      />
    </>
  );
}
export default TextInputWithLabel;
