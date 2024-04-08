import { createSlice } from "@reduxjs/toolkit";
import { TasksState } from "../../types";

const initialState: TasksState = {
    tasks: [],
    displayedTasks: [],
};

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        updateTasks: (state, action) => {
            state.tasks = action.payload
        },
        displayAllTasks: (state) => {
            state.displayedTasks = state.tasks
        },
        displayUncompletedTasks: (state) => {
            state.displayedTasks = state.tasks.filter((task) => !task.completed)
        },
        displayCompletedTasks: (state) => {
            state.displayedTasks = state.tasks.filter((task) => task.completed)
        },
    }
});

export const {updateTasks, displayAllTasks, displayUncompletedTasks, displayCompletedTasks} = tasksSlice.actions

export default tasksSlice.reducer