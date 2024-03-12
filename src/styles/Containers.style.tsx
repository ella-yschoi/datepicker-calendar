import styled from 'styled-components';

const StyledCalendarContainer = styled.div`
  background-color: #252525;
  border-radius: 10px;
  margin: 5px;
  padding: 25px;
  width: 250px;
  height: 327px;
  max-width: 300px;
  font-family: 'Noto Sans KR';
`;

const StyledHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0px;
`;

export { StyledCalendarContainer, StyledHeaderContainer };