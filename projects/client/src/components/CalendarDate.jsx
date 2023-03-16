import React, { useEffect, useRef } from "react";
import { Calendar } from "react-date-range";
import format from "date-fns/format";
import { setDateAction } from "../actions/dateAction";
import { useDispatch } from "react-redux";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";

function CalendarDate(props) {
  const [calendar, setCalendar] = React.useState("");

  //state untuk mengontrol buka tutup calendar
  const [open, setOpen] = React.useState(false);

  const [minDate, setMinDate] = React.useState("");
  const [maxDate, setMaxDate] = React.useState("");
  const [calendarValue, setCalendarValue] = React.useState("mm/dd/yyyy");

  const dispatch = useDispatch();
  const refOne = useRef(null);

  const handleSelect = (date) => {
    setCalendar(date);
    setCalendarValue(format(date, "MM/dd/yyyy"));
    dispatch(setDateAction({ dob: format(date, "yyyy-MM-dd") }));
  };

  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
    const date = new Date().getFullYear();
    setMaxDate(`${date - 17}-12-31`);
    setMinDate(`${date - 70}-01-01`);
  }, []);

  return (
    <div className="calendarWrap">
      <InputGroup>
        <InputLeftElement pointerEvents="none" children={<CalendarIcon color="green.500" />} />
        <Input value={calendarValue} readOnly onClick={() => setOpen((open) => !open)} />
      </InputGroup>
      <div ref={refOne}>
        {open && (
          <Calendar
            date={calendar === "" ? new Date(maxDate) : calendar}
            minDate={new Date(minDate)}
            maxDate={new Date(maxDate)}
            onChange={handleSelect}
            className="calendarElement"
            color="#38A169"
          />
        )}
      </div>
    </div>
  );
}

export default CalendarDate;
