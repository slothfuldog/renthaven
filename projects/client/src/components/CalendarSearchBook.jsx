import React, { useEffect, useRef } from "react";
import { DateRange } from "react-date-range";
import format from "date-fns/format";
import { addDays } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { setDateAction, setDateActionBook } from "../actions/dateAction";

function CalendarSearchBook(props) {
  const { currentStartDate, currentEndDate } = useSelector((state) => {
    return {
      currentStartDate: state.dateBook.startDate,
      currentEndDate: state.dateBook.endDate,
    };
  });
  //state untuk menyimpan date
  const [calendar, setCalendar] = React.useState([
    {
      startDate: new Date(currentStartDate),
      endDate: new Date(currentEndDate),
      key: "selection",
    },
  ]);

  //state untuk mengontrol buka tutup calendar
  const [open, setOpen] = React.useState(false);

  // elemen untuk di toggle
  const refOne = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // event listener untuk mengecek keydown dan click
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  // hide calendar ketika menekan tombol esc
  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // hide calendar ketika menekan diluar calendar
  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const handleChange = (item) => {
    if(new Date(item.selection.startDate).getTime() == new Date(item.selection.endDate).getTime()){
      setCalendar([
        {
          startDate: item.selection.startDate,
          endDate: new Date(new Date(format(addDays(item.selection.startDate, 1), "MM/dd/yyyy")).getTime()),
          key: "selection",
        }
      ])
    }
    else{
      setCalendar([item.selection]);
    }
    if (props.checkinHandler && props.checkoutHandler && new Date(item.selection.startDate).getTime() == new Date(item.selection.endDate).getTime()) {
      props.checkinHandler(new Date(format(item.selection.startDate, "MM/dd/yyyy")).getTime());
      props.checkoutHandler(new Date(format(addDays(item.selection.startDate, 1), "MM/dd/yyyy")).getTime());
    }else if(props.checkinHandler && props.checkoutHandler){
      props.checkinHandler(new Date(format(item.selection.startDate, "MM/dd/yyyy")).getTime());
      props.checkoutHandler(new Date(format(item.selection.endDate, "MM/dd/yyyy")).getTime());
    }
    if(new Date(item.selection.startDate).getTime() == new Date(item.selection.endDate).getTime()){
      dispatch(
        setDateActionBook({
          startDate: new Date(format(item.selection.startDate, "MM/dd/yyyy")).getTime(),
          endDate: new Date(format(addDays(item.selection.startDate, 1), "MM/dd/yyyy")).getTime(),
        })
      );
    }else{
      dispatch(
        setDateActionBook({
          startDate: new Date(format(item.selection.startDate, "MM/dd/yyyy")).getTime(),
          endDate: new Date(format(item.selection.endDate, "MM/dd/yyyy")).getTime(),
        })
      );
    }
  };

  return (
    <div className="calendarWrap" >
      <InputGroup order={props.direction ? 2 : 1}>
        <InputLeftElement pointerEvents="none" children={<CalendarIcon color="green.500" />} />
        <Input 
          value={`${format(calendar[0].startDate, "MMM dd, yyy")} - ${format(
            calendar[0].endDate,
            "MMM dd, yyy"
          )}`}
          readOnly
          onClick={() => setOpen((open) => !open)}
        />
      </InputGroup>
      <div ref={refOne} style={{order: props.direction ? 1 : 2}}>
        {open && (
          <DateRange
            onChange={(item) => handleChange(item)}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={calendar}
            minDate={new Date(new Date(format(addDays(new Date(), 1), "MM/dd/yyyy")).getTime())}
            maxDate={addDays(calendar[0].startDate, 365)}
            months={1}
            direction="horizontal"
            className="calendarElement"
            rangeColors={["#38A169", "#cf543e", "#3e78cf"]}
          />
        )}
      </div>
    </div>
  );
}

export default CalendarSearchBook;
