import React from 'react';
import { styled } from 'styled-components';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ru } from 'date-fns/locale';
import { DateProps } from '../controls/types';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/datepicker-custom.css';

registerLocale('ru', ru);

const Wrapper = styled.div`
    z-index: 9999;
    position: absolute;

    display: flex;
    height: 100%;

    border: none;
    background-color: transparent;

    align-items: center;

    user-select: none;

    cursor: pointer;
`;

const Datepicker: React.FC<DateProps> = ({ value, onChange }) => {
    const [currentDate, setCurrentDate] = React.useState<Date | null>(value || null);

    const handleChange = (date: Date | null) => {
        const selectedDate = date ?? null;
        setCurrentDate(selectedDate);
        if (onChange) {
            onChange(selectedDate);
        }
    };

    return (
        <>
            <Wrapper>
                <DatePicker id="date-picker" selected={currentDate} onChange={handleChange} dateFormat="dd/MM/yyyy" inline locale="ru" />
            </Wrapper>
        </>
    );
};

export default Datepicker;
