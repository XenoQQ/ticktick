import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';

import { DateProps } from '../controls/types';

import 'react-datepicker/dist/react-datepicker.css';
import './styles/datepicker-custom.css';
import { ru } from 'date-fns/locale';

registerLocale('ru', ru);

const Datepicker: React.FC<DateProps> = ({ value, onChange }) => {
    const [currentDate, setCurrentDate] = React.useState<Date | null>(value || null);

    const handleChange = (date: Date | null) => {
        const selectedDate = date ?? null;
        setCurrentDate(selectedDate);

        onChange(selectedDate);
    };

    return <DatePicker id="date-picker" selected={currentDate} onChange={handleChange} dateFormat="dd/mm/yyyy" inline locale="ru" />;
};

export default Datepicker;
