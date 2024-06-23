import React from "react";
import styled from "styled-components";
import DatePicker, { DatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";

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

const CalendarIcon = styled(FaRegCalendarAlt)`
    font-size: 24px;
    cursor: pointer;
    margin-right: 8px;
`;

interface DateProps {
    onChange?: (date: Date | undefined) => void;
    value?: Date | undefined;
}

const Datepicker: React.FC<DateProps> = ({ value, onChange }) => {
    const [startDate, setStartDate] = React.useState<Date | undefined>(value || undefined);
    const [calendarVisible, setCalendarVisible] = React.useState<boolean>(false);

    const handleClick = () => {
        document.getElementById("date-picker")?.focus();
        setCalendarVisible((prevstate) => !prevstate);
    };

    const handleChange = (date) => {
        const selectedDate = date as Date | undefined;
        setStartDate(selectedDate);
        if (onChange) {
            onChange(selectedDate);
        }
        console.log(date);
    };

    return (
        <>
            <InputDateContainer>
                <CalendarIcon onClick={() => handleClick()} />
                {calendarVisible && (
                    <DatePickerWrapper>
                        <DatePicker
                            id="date-picker"
                            selected={startDate}
                            onChange={(date: Date | null) => handleChange(date)}
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
