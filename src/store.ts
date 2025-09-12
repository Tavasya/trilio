import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import onboardingReducer from "./features/onboarding/onboardingSlice";
import calendarReducer from "./store/slices/calendarSlice";
import postReducer from "./features/post/postSlice";
import chatReducer from "./features/chat/chatSlice";

const store = configureStore({
    reducer: {
        onboarding: onboardingReducer,
        calendar: calendarReducer,
        post: postReducer,
        chat: chatReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;