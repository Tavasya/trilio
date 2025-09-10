import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CalendarState {
  selectedMonth: number;
  selectedYear: number;
  selectedDate: string | null;
  selectedWeek: string;
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
  selectedDate: new Date().toISOString(),
  selectedWeek: getStartOfWeek(new Date()).toISOString(),
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
      if (action.payload) {
        state.selectedDate = action.payload.toISOString();
        state.selectedWeek = getStartOfWeek(action.payload).toISOString();
        state.selectedMonth = action.payload.getMonth();
        state.selectedYear = action.payload.getFullYear();
      } else {
        state.selectedDate = null;
      }
    },
    setSelectedWeek: (state, action: PayloadAction<Date>) => {
      state.selectedWeek = getStartOfWeek(action.payload).toISOString();
    },
    nextWeek: (state) => {
      const nextWeek = new Date(state.selectedWeek);
      nextWeek.setDate(nextWeek.getDate() + 7);
      state.selectedWeek = nextWeek.toISOString();
    },
    previousWeek: (state) => {
      const prevWeek = new Date(state.selectedWeek);
      prevWeek.setDate(prevWeek.getDate() - 7);
      state.selectedWeek = prevWeek.toISOString();
    },
    resetToToday: (state) => {
      const today = new Date();
      state.selectedMonth = today.getMonth();
      state.selectedYear = today.getFullYear();
      state.selectedDate = today.toISOString();
      state.selectedWeek = getStartOfWeek(today).toISOString();
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