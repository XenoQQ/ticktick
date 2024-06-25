import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarIconPng from "../assets/calendar-icon.png";

const InputDateContainer = styled.div`
    display: flex;

    align-items: center;
`;

const DatePickerWrapper = styled.div`
    position: absolute;
    top: 80px;

    border: none;
    background-color: transparent;
    font-size: 16px;

    cursor: pointer;
`;

const CalendarIcon = styled.div`
    width: 30px;
    height: 30px;

    background: no-repeat center/100% url(${CalendarIconPng});

    cursor: pointer;
    margin-right: 8px;

    transition: 1s ease;

    &:hover {
        background-size: 110%;
        transition: background-size 0.3s ease;
    }
`;



interface DateProps {
    onChange?: (date: Date | null) => void;
    value?: Date | null;
}

const Datepicker: React.FC<DateProps> = ({ value, onChange }) => {
    const [currentDate, setCurrentDate] = React.useState<Date | null>(value || null);
    const [calendarVisible, setCalendarVisible] = React.useState<boolean>(false);

    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setCalendarVisible(false);
        }
    };

    useEffect(() => {
        if (calendarVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [calendarVisible]);

    const handleClick = () => {
        setCalendarVisible((prevstate) => !prevstate);
    };

    const handleChange = (date: Date | null) => {
        const selectedDate = date ?? null;
        setCurrentDate(selectedDate);
        if (onChange) {
            onChange(selectedDate);
        }
        setCalendarVisible((prevstate) => !prevstate);
    };

    return (
        <>
            <InputDateContainer ref={wrapperRef}>
                <CalendarIcon onClick={() => handleClick()} title="Выбрать дату выполнения" />
                {calendarVisible && (
                    <DatePickerWrapper>
                        <DatePicker
                            id="date-picker"
                            selected={currentDate}
                            onChange={handleChange}
                            dateFormat="dd/MM/yyyy"
                            inline
                        />
                    </DatePickerWrapper>
                )}
            </InputDateContainer>
        </>
    );
};

export default Datepicker;
