import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CalendarState {
  selectedMonth: number;
  selectedYear: number;
  selectedDate: Date | null;
  selectedWeek: Date;
}

const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

const initialState: CalendarState = {
  selectedMonth: new Date().getMonth(),
  selectedYear: new Date().getFullYear(),
  selectedDate: new Date(),
  selectedWeek: getStartOfWeek(new Date()),
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedMonth: (state, action: PayloadAction<number>) => {
      state.selectedMonth = action.payload;
    },
    setSelectedYear: (state, action: PayloadAction<number>) => {
      state.selectedYear = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<Date | null>) => {
      state.selectedDate = action.payload;
      if (action.payload) {
        state.selectedWeek = getStartOfWeek(action.payload);
        state.selectedMonth = action.payload.getMonth();
        state.selectedYear = action.payload.getFullYear();
      }
    },
    setSelectedWeek: (state, action: PayloadAction<Date>) => {
      state.selectedWeek = getStartOfWeek(action.payload);
    },
    nextWeek: (state) => {
      const nextWeek = new Date(state.selectedWeek);
      nextWeek.setDate(nextWeek.getDate() + 7);
      state.selectedWeek = nextWeek;
    },
    previousWeek: (state) => {
      const prevWeek = new Date(state.selectedWeek);
      prevWeek.setDate(prevWeek.getDate() - 7);
      state.selectedWeek = prevWeek;
    },
    resetToToday: (state) => {
      const today = new Date();
      state.selectedMonth = today.getMonth();
      state.selectedYear = today.getFullYear();
      state.selectedDate = today;
      state.selectedWeek = getStartOfWeek(today);
    },
  },
});

export const { 
  setSelectedMonth, 
  setSelectedYear, 
  setSelectedDate, 
  setSelectedWeek,
  nextWeek,
  previousWeek,
  resetToToday 
} = calendarSlice.actions;
export default calendarSlice.reducer;