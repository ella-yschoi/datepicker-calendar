import styled from 'styled-components';
import { useState } from 'react';

import { DAYS_OF_WEEK_KO } from '../constants/daysOfWeek';
import { LeftButton, TodayButton, RightButton } from './Butttons';
import CalendarInput from './Inputs';

const renderCalendar = (currentDate: Date) => {
  const showYear = currentDate.getFullYear();
  const showMonth = currentDate.getMonth();

  const prevMonthLast = new Date(showYear, showMonth, 0);
  const currentMonthLast = new Date(showYear, showMonth + 1, 0);

  const prevMonthLastDate = prevMonthLast.getDate();
  const prevMonthLastDay = prevMonthLast.getDay();

  const currentMonthLastDate = currentMonthLast.getDate();
  const currentMonthLastDay = currentMonthLast.getDay();

  // 이전 달의 날짜들을 계산
  const prevDates = [];
  if (prevMonthLastDay !== 6) {
    for (let i = 0; i < prevMonthLastDay + 1; i++) {
      prevDates.unshift(prevMonthLastDate - i);
    }
  }

  // 현재 달의 날짜들을 계산
  const currentDates = Array.from(
    { length: currentMonthLastDate },
    (_, i) => i + 1
  );

  // 다음 달 날짜들을 계산
  const nextDates = [];
  // 다음 달의 첫 번째 날짜가 시작할 요일을 구하기
  const firstDayNextMonth = (currentMonthLastDay + 1) % 7;
  // 최소한 한 주를 채우고, 필요한 경우 두 번째 주까지 날짜를 추가
  for (let i = 1; i <= 14 - firstDayNextMonth; i++) {
    nextDates.push(i);
  }

  // 만약 다음 달 날짜가 7개 미만이라면, 다음 주까지 날짜를 14개 추가
  if (nextDates.length < 7) {
    for (let i = 7 - firstDayNextMonth; i < 14 - firstDayNextMonth; i++) {
      nextDates.push(i);
    }
  }

  // 이전 달, 현재 달, 다음 달 날짜를 합쳐 총 날짜 수를 계산
  const totalDays = prevDates.length + currentDates.length + nextDates.length;

  // 총 날짜가 42를 넘지 않도록 다음 달 날짜 배열을 조정
  if (totalDays > 42) {
    const excessDays = totalDays - 42;
    nextDates.splice(nextDates.length - excessDays, excessDays); // 초과하는 날짜들을 제거
  }

  return {
    prevMonthDays: prevDates,
    currentMonthDays: currentDates,
    nextMonthDays: nextDates,
  };
};

const Calendar = () => {
  const [dateInput, setDateInput] = useState(''); // 사용자의 입력 추적
  const [displayDate, setDisplayDate] = useState(''); // 화면에 표시할 날짜
  const [$isInputValid, setIsInputValid] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date()); // currentDate이 초기값

  // 오늘 날짜를 확인하는 함수
  const isToday = (date: number) => {
    const today = new Date();
    return (
      date === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // 사용자가 선택한 날짜를 확인 후 업데이트
  const isSelected = (date: number, monthOffset: number) => {
    const selectedDate = new Date(displayDate);
    const adjustedMonth = currentDate.getMonth() + monthOffset;

    return (
      date === selectedDate.getDate() &&
      adjustedMonth === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  // 달력의 날짜들을 가져오기
  const { prevMonthDays, currentMonthDays, nextMonthDays } =
    renderCalendar(currentDate);

  // YYYY년 MM월 형태
  const displayYearMonth = `${currentDate.getFullYear()}년 ${
    currentDate.getMonth() + 1
  }월`;

  const handleDateSelect = (year: number, month: number, day: number) => {
    let updatedYear = year;
    let updatedMonth = month - 1; // JavaScript의 Date 객체는 0부터 11까지 월을 나타냄

    // 이전 달 날짜 클릭 시 년/월 조정
    if (month === 0) {
      updatedYear = year - 1;
      updatedMonth = 11; // 12월
    }

    // 다음 달 날짜 클릭 시 년/월 조정
    if (month === 13) {
      updatedYear = year + 1;
      updatedMonth = 0; // 1월
    }

    const updatedDate = new Date(updatedYear, updatedMonth, day);
    setCurrentDate(updatedDate);

    // 포맷팅된 날짜로 상태 업데이트
    const formattedMonth =
      updatedMonth + 1 < 10 ? `0${updatedMonth + 1}` : `${updatedMonth + 1}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedDate = `${updatedYear}/${formattedMonth}/${formattedDay}`;

    setDisplayDate(formattedDate);
    setDateInput(formattedDate);
  };

  return (
    <>
      <SelectedDateContainer>날짜 : {displayDate}</SelectedDateContainer>
      <CalendarContainer>
        <CalendarInput
          dateInput={dateInput}
          setDateInput={setDateInput}
          displayDate={displayDate}
          setDisplayDate={setDisplayDate}
          setIsInputValid={setIsInputValid}
          setCurrentDate={setCurrentDate}
          $isInputValid={$isInputValid}
        />
        <CalendarHeader>
          <YearMonthDisplay>{displayYearMonth}</YearMonthDisplay>
          <LeftButton
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
          <TodayButton setCurrentDate={setCurrentDate} />
          <RightButton
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
        </CalendarHeader>
        <DayComponent>
          {DAYS_OF_WEEK_KO.map((day) => (
            <DayUnit key={day}>{day}</DayUnit>
          ))}
        </DayComponent>
        <DateComponent>
          {prevMonthDays.map((date) => (
            <ExtraDateUnit
              key={`prev-${date}`}
              className={isSelected(date, -1) ? 'selected' : ''}
              onClick={() =>
                handleDateSelect(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  date
                )
              }
            >
              {date}
            </ExtraDateUnit>
          ))}
          {currentMonthDays.map((date) => {
            // 해당 날짜가 오늘 날짜인지 확인
            const todayClass = isToday(date) ? 'today' : '';
            // 해당 날짜가 선택된 날짜인지 확인
            const selectedClass = isSelected(date, 0) ? 'selected' : '';

            // todayClass와 selectedClass가 동일하게 적용될 수 있도록 우선순위를 정하기
            // 여기서는 'selected' 클래스를 우선시
            const className = selectedClass ? selectedClass : todayClass;

            return (
              <DateUnit
                key={`current-${date}`}
                className={className}
                onClick={() =>
                  handleDateSelect(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                    date
                  )
                }
              >
                {date}
              </DateUnit>
            );
          })}
          {nextMonthDays.map((date) => (
            <ExtraDateUnit
              key={`next-${date}`}
              className={isSelected(date, 1) ? 'selected' : ''}
              onClick={() =>
                handleDateSelect(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 2,
                  date
                )
              }
            >
              {date}
            </ExtraDateUnit>
          ))}
        </DateComponent>
      </CalendarContainer>
    </>
  );
};

export default Calendar;

const SelectedDateContainer = styled.div`
  margin: 5px;
  padding: 25px 25px 25px 28px;
  width: 247px;
  height: 10px;
  background-color: #252525;
  border-radius: 10px;
  font-size: 15px;
  color: #c5c5c5;
  font-family: 'Noto Sans KR';
`;

const CalendarContainer = styled.div`
  background-color: #252525;
  border-radius: 10px;
  margin: 5px;
  padding: 25px;
  width: 250px;
  height: 327px;
  max-width: 300px;
  font-family: 'Noto Sans KR';
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0px;
`;

const YearMonthDisplay = styled.div`
  flex: 1;
  text-align: center;
  color: #c5c5c5;
  font-size: 15px;
`;

const DayComponent = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-bottom: 10px;
`;

const DayUnit = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5px;
  width: 15px;
  height: 10px;
  font-size: 14px;
  color: #899797;
`;

const DateComponent = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
`;

const DateUnit = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  width: 15px;
  height: 15px;
  text-align: center;
  font-size: 14px;
  color: #d5d5d5;
  border: 1px solid transparent;

  &:hover {
    cursor: pointer;
    background-color: #273241;
    border: 1px solid #2383e2;
    border-radius: 20%;
  }

  &.today {
    color: #eff5fd;
    background-color: #eb5756;
    border-radius: 50%;
    font-weight: 600;
  }

  &.selected {
    color: #eff5fd;
    background-color: #2383e2;
    border-radius: 20%;
  }
`;

const ExtraDateUnit = styled(DateUnit)`
  color: #899797;
`;