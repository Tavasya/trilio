import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { 
  setSelectedMonth, 
  setSelectedYear, 
  setSelectedDate,
  nextWeek,
  previousWeek 
} from '../../store/slices/calendarSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedMonth, selectedYear, selectedDate, selectedWeek } = useAppSelector((state) => state.calendar);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDaysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      dispatch(setSelectedMonth(11));
      dispatch(setSelectedYear(selectedYear - 1));
    } else {
      dispatch(setSelectedMonth(selectedMonth - 1));
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      dispatch(setSelectedMonth(0));
      dispatch(setSelectedYear(selectedYear + 1));
    } else {
      dispatch(setSelectedMonth(selectedMonth + 1));
    }
  };

  const handlePreviousWeek = () => {
    dispatch(previousWeek());
  };

  const handleNextWeek = () => {
    dispatch(nextWeek());
  };

  const renderMiniCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-6"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(selectedYear, selectedMonth, day);
      const isToday = 
        day === new Date().getDate() &&
        selectedMonth === new Date().getMonth() &&
        selectedYear === new Date().getFullYear();
      
      const selectedDateObj = selectedDate ? new Date(selectedDate) : null;
      const isSelected = selectedDateObj && 
        day === selectedDateObj.getDate() &&
        selectedMonth === selectedDateObj.getMonth() &&
        selectedYear === selectedDateObj.getFullYear();

      days.push(
        <div
          key={day}
          onClick={() => dispatch(setSelectedDate(currentDate))}
          className={`h-6 flex items-center justify-center text-xs cursor-pointer rounded transition-colors
            ${isToday && !isSelected
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold' 
              : ''
            }
            ${isSelected 
              ? 'bg-blue-500 text-white font-semibold' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(selectedWeek);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const weekDates = getWeekDates();
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  const formatWeekRange = () => {
    const startMonth = monthNames[weekStart.getMonth()];
    const endMonth = monthNames[weekEnd.getMonth()];
    const startYear = weekStart.getFullYear();
    const endYear = weekEnd.getFullYear();

    if (startMonth === endMonth && startYear === endYear) {
      return `${startMonth} ${weekStart.getDate()}-${weekEnd.getDate()}, ${startYear}`;
    } else if (startYear === endYear) {
      return `${startMonth} ${weekStart.getDate()} - ${endMonth} ${weekEnd.getDate()}, ${startYear}`;
    } else {
      return `${startMonth} ${weekStart.getDate()}, ${startYear} - ${endMonth} ${weekEnd.getDate()}, ${endYear}`;
    }
  };

  const timeSlots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    timeSlots.push(
      `${hour === 0 ? '12' : hour > 12 ? hour - 12 : hour}:00 ${hour < 12 ? 'AM' : 'PM'}`
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-[20%] bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">
              {monthNames[selectedMonth]} {selectedYear}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={handlePreviousMonth}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {shortDaysOfWeek.map((day) => (
              <div
                key={day}
                className="text-center text-[10px] font-medium text-gray-500 dark:text-gray-400 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {renderMiniCalendar()}
          </div>
        </div>
      </div>
      
      <div className="w-[80%] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold">
            {formatWeekRange()}
          </h2>
          
          <div className="flex gap-3">
            <button
              onClick={handlePreviousWeek}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous week"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => dispatch(setSelectedDate(new Date()))}
              className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNextWeek}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Next week"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="flex">
            <div className="w-20 flex-shrink-0">
              <div className="h-12"></div>
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className="h-16 text-xs text-gray-500 dark:text-gray-400 pr-2 text-right border-r border-gray-200 dark:border-gray-700"
                >
                  {time}
                </div>
              ))}
            </div>

            <div className="flex-1 grid grid-cols-7">
              {weekDates.map((date, index) => {
                const isToday = 
                  date.toDateString() === new Date().toDateString();
                
                return (
                  <div key={index} className="border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                    <div className={`h-12 border-b border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center ${
                      isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {daysOfWeek[date.getDay()]}
                      </div>
                      <div className={`text-sm font-medium ${
                        isToday ? 'text-blue-600 dark:text-blue-400' : ''
                      }`}>
                        {date.getDate()}
                      </div>
                    </div>
                    
                    {timeSlots.map((_, timeIndex) => (
                      <div
                        key={timeIndex}
                        className={`h-16 border-b border-gray-100 dark:border-gray-800 ${
                          isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                        }`}
                      >
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;