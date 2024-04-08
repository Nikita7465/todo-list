import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './reducers/tasks.reducer';

export const store = configureStore({
  reducer: tasksReducer
});
