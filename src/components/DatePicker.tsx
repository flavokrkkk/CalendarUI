import { FC, useMemo, useState } from "react";

interface IDatePicker {
  date: Date;
  setDate?: (date: Date) => void;
}

interface DateCell {
  day: number;
  month: number;
  year: number;
  backGround?: string;
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const daysOfTheWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getDaysAmountInMonth = (year: number, month: number) => {
  //логика высчитывания дней в месяце
  const nextMonthDate = new Date(year, month + 1);
  nextMonthDate.setMinutes(-1);
  return nextMonthDate.getDate();
};

const getPreviousMonthDays = (year: number, month: number) => {
  const currentMonthFirstDay = new Date(year, month, 1);
  //получаем день недели первого дня месяца
  const dayOfTheWeek =
    currentMonthFirstDay.getDay() === 0
      ? currentMonthFirstDay.getDay() + 7
      : currentMonthFirstDay.getDay();

  const prevMonthCellsAmount = dayOfTheWeek - 1;
  const daysAmountInPrevMonth = getDaysAmountInMonth(year, month - 1);
  const dateCells: DateCell[] = [];

  const [cellYear, cellMonth] =
    month === 0 ? [year - 1, 11] : [year, month - 1];

  for (let i = prevMonthCellsAmount - 1; i >= 0; i--) {
    dateCells.push({
      year: cellYear,
      month: cellMonth,
      day: daysAmountInPrevMonth - i,
    });
  }
  return dateCells;
};

const enum TotalCells {
  TOTAL = 7 * 5,
}

const getNextMonthDays = (year: number, month: number) => {
  //Вынести в функцию
  const lastDayOfCurrentMonth = new Date(year, month + 1);
  lastDayOfCurrentMonth.setMinutes(-1);
  const numberDayInWeek = lastDayOfCurrentMonth;
  const isLastDayInMonth =
    numberDayInWeek.getDate() === 31 && numberDayInWeek.getDay() === 1;

  const currentMonthFirstDay = new Date(year, month);
  //получаем день недели первого дня месяца
  const dayOfTheWeek = isLastDayInMonth
    ? currentMonthFirstDay.getDay() - 7
    : currentMonthFirstDay.getDay();

  const prevMonthCellsAmount = dayOfTheWeek - 1;
  const daysAmount = getDaysAmountInMonth(year, month);

  const nextMonthDays = TotalCells.TOTAL - daysAmount - prevMonthCellsAmount;

  const [cellYear, cellMonth] =
    month === 11 ? [year + 1, 0] : [year, month + 1];

  const dateCells: DateCell[] = [];

  for (let i = 1; i <= nextMonthDays; i++) {
    dateCells.push({
      year: cellYear,
      month: cellMonth,
      day: i,
    });
  }

  return dateCells;
};

const getCurrentMonth = (year: number, month: number, numberOfDays: number) => {
  const dateCells: DateCell[] = [];
  for (let i = 1; i <= numberOfDays; i++) {
    dateCells.push({
      year,
      month,
      day: i,
    });
  }

  return dateCells;
};

const DatePicker: FC<IDatePicker> = ({ date }) => {
  const [panelYear, setPanelYear] = useState(() => date.getFullYear());
  const [panelMonth, setPanelMonth] = useState(() => date.getMonth());
  const [selectDate, setSelectDate] = useState({} as DateCell);
  //текущие параметры
  const [year, month, day] = useMemo(() => {
    const currentYear = date.getFullYear();
    const currentDay = date.getDate();
    const currentMonth = date.getMonth();

    return [currentYear, currentMonth, currentDay];
  }, [date]);

  const dateCells = useMemo(() => {
    const daysInAMonth = getDaysAmountInMonth(panelYear, panelMonth);

    const currentMonthDays = getCurrentMonth(
      panelYear,
      panelMonth,
      daysInAMonth
    );

    const prevMonthDays = getPreviousMonthDays(panelYear, panelMonth);
    const nextMonthDays = getNextMonthDays(panelYear, panelMonth);
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }, [panelYear, panelMonth]);

  const nextYear = () => {
    setPanelYear((year) => year + 1);
  };

  const prevYear = () => {
    setPanelYear((year) => year - 1);
  };

  const nextMonth = () => {
    if (panelMonth === 11) {
      setPanelMonth(0);
      setPanelYear((year) => year + 1);
    } else {
      setPanelMonth((month) => month + 1);
    }
  };

  const prevMonth = () => {
    if (panelMonth === 0) {
      setPanelMonth(11);
      setPanelYear((year) => year - 1);
    } else {
      setPanelMonth((month) => month - 1);
    }
  };

  const handleSelectedDate = (param: DateCell) => {
    setSelectDate(param);
    console.log(selectDate);
  };

  return (
    <div>
      {day}.{months[panelMonth]}.{panelYear}
      <div>
        <button onClick={prevYear}>Prev Year</button>
        <button onClick={prevMonth}>Prev Month</button>
        <button onClick={nextMonth}>Next Month</button>
        <button onClick={nextYear}>Next Year</button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gridTemplateRows: "repeat(7, 100px)",
        }}
      >
        {daysOfTheWeek.map((el) => (
          <div>{el}</div>
        ))}
        {dateCells.map((el) => (
          <div
            onClick={() =>
              handleSelectedDate({
                year: el.year,
                month: el.month,
                day: el.day,
              })
            }
            style={{
              border: "1px solid black",
              backgroundColor:
                year === el.year && day === el.day && month === el.month
                  ? "red"
                  : "" ||
                    new Date(el.year, el.month, el.day).getDay() === 0 ||
                    new Date(el.year, el.month, el.day).getDay() === 6
                  ? "lightgray"
                  : "#fff",
            }}
          >
            <span
              style={{
                cursor: "pointer",
                backgroundColor:
                  selectDate.day === el.day &&
                  selectDate.month === el.month &&
                  selectDate.year === el.year
                    ? "red"
                    : "",
              }}
            >
              {el.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatePicker;
