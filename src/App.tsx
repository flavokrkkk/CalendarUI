import { useState } from "react";
import DatePicker from "./components/DatePicker";

function App() {
  const [date, setDate] = useState(() => new Date());

  return (
    <>
      <DatePicker date={date} />
    </>
  );
}

export default App;
