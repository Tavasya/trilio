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
  const { posts } = useAppSelector((state) => state.post);

  // Simulated post dates for demonstration
  const simulatedPostDates = [
    new Date(2025, 0, 10), // Jan 10
    new Date(2025, 0, 12), // Jan 12
    new Date(2025, 0, 15), // Jan 15
    new Date(2025, 0, 18), // Jan 18
    new Date(2025, 0, 22), // Jan 22
    new Date(2025, 0, 25), // Jan 25
    new Date(2025, 0, 28), // Jan 28
  ];

  const hasPostOnDate = (date: Date) => {
    // Check simulated posts
    const hasSimulated = simulatedPostDates.some(postDate => 
      postDate.getDate() === date.getDate() &&
      postDate.getMonth() === date.getMonth() &&
      postDate.getFullYear() === date.getFullYear()
    );

    // Check actual posts from Redux
    const hasActual = posts.some(post => {
      const postDate = new Date(post.created_at);
      return postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear();
    });

    return hasSimulated || hasActual;
  };

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
        <div key={`empty-${i}`} className="h-8"></div>
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

      const hasPost = hasPostOnDate(currentDate);

      days.push(
        <div
          key={day}
          onClick={() => dispatch(setSelectedDate(currentDate))}
          className={`h-8 flex items-center justify-center text-sm cursor-pointer rounded-lg transition-all relative
            ${isToday && !isSelected
              ? 'bg-primary/10 text-primary font-medium' 
              : ''
            }
            ${isSelected 
              ? 'bg-primary text-white font-medium shadow-sm' 
              : 'hover:bg-gray-100 text-gray-700'
            }`}
        >
          {day}
          {hasPost && (
            <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${
              isSelected ? 'bg-white' : 'bg-[#0077b5]'
            }`} />
          )}
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
  for (let hour = 0; hour < 24; hour += 2) {
    timeSlots.push(
      `${hour === 0 ? '12' : hour > 12 ? hour - 12 : hour}:00 ${hour < 12 ? 'AM' : 'PM'}`
    );
  }

  return (
    <div className="flex h-full bg-white">
      <div className="w-72 bg-gray-50/50 border-r border-gray-100 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-gray-900">
              {monthNames[selectedMonth]} {selectedYear}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handlePreviousMonth}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-3">
            {shortDaysOfWeek.map((day) => (
              <div
                key={day}
                className="text-center text-[11px] font-medium text-gray-400 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {renderMiniCalendar()}
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-medium text-gray-900">
            {formatWeekRange()}
          </h2>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handlePreviousWeek}
              className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Previous week"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => dispatch(setSelectedDate(new Date()))}
              className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNextWeek}
              className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Next week"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-white">
          <div className="flex">
            <div className="w-24 flex-shrink-0">
              <div className="h-16"></div>
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className="h-32 text-xs text-gray-400 pr-4 pt-2 text-right border-r border-gray-100"
                >
                  {time}
                </div>
              ))}
            </div>

            <div className="flex-1 grid grid-cols-7">
              {weekDates.map((date, index) => {
                const isToday = 
                  date.toDateString() === new Date().toDateString();
                const hasPost = hasPostOnDate(date);
                
                return (
                  <div key={index} className="border-r border-gray-100 last:border-r-0">
                    <div className={`h-16 border-b border-gray-100 flex flex-col items-center justify-center relative ${
                      isToday ? 'bg-primary/5' : 'bg-gray-50/50'
                    }`}>
                      <div className="text-xs text-gray-500 mb-1">
                        {daysOfWeek[date.getDay()]}
                      </div>
                      <div className={`text-sm font-medium ${
                        isToday ? 'text-primary' : 'text-gray-700'
                      }`}>
                        {date.getDate()}
                      </div>
                      {hasPost && (
                        <div className="absolute top-2 right-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0077b5">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {timeSlots.map((_, timeIndex) => {
                      // Show LinkedIn post indicator at 10 AM slot (which is now index 5 for 2-hour intervals)
                      const showPostIndicator = hasPost && timeIndex === 5;
                      
                      return (
                        <div
                          key={timeIndex}
                          className={`h-32 border-b border-gray-50 ${
                            isToday ? 'bg-primary/[0.02]' : 'hover:bg-gray-50/50'
                          } transition-colors cursor-pointer relative`}
                        >
                          {showPostIndicator && (
                            <div className="absolute inset-x-2 top-3 bg-[#0077b5]/10 border border-[#0077b5]/20 rounded-lg p-3">
                              <div className="flex flex-col items-center gap-2">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0077b5">
                                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                                </svg>
                                <span className="text-xs text-[#0077b5] font-semibold">LinkedIn</span>
                                <span className="text-[10px] text-[#0077b5]/80">10:00 AM</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
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