import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  displayAllTasks,
  displayCompletedTasks,
  displayUncompletedTasks,
  updateTasks,
} from "../../store/reducers/tasks.reducer";
import axios from "axios";
import Cookies from "js-cookie";
import { TasksState } from "../../types";
import Header from "../../components/header/Header";
import Task from "../../components/task/Task";
import Modal from "../../components/UI/modal/Modal";
import Loader from "../../components/UI/loader/Loader";
import "./tasks.css";

interface TaskData {
  task_id: number;
  title: string;
  description: string;
  completed: number;
}

const Tasks = () => {
  const dispatch = useDispatch();
  const userId = Cookies.get("user_id");
  const options = useMemo(() => {
    return ["Все задачи", "Не выполненные задачи", "Выполненные задачи"];
  }, []);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [failedAddTaskModalOpen, setFailedAddTaskModalOpen] = useState(false);
  const [isTaskTitleEmpty, setIsTaskTitleEmpty] = useState(false);
  const [isLoaderShow, setIsLoaderShow] = useState(false);
  const [taskData, setTaskData] = useState({ title: "", description: "" });

  useEffect(() => {
    if (selectedOption === options[0]) {
      dispatch(displayAllTasks());
    } else if (selectedOption === options[1]) {
      dispatch(displayUncompletedTasks());
    } else if (selectedOption === options[2]) {
      dispatch(displayCompletedTasks());
    }
  }, [selectedOption, options, dispatch]);

  const tasks = useSelector((state: TasksState) => state.displayedTasks);

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  const toggleDropdown = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ) => {
    event.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const clearTaskInput = () => {
    setTaskData({ title: "", description: "" });
  };

  const toggleAddTaskModal = () => {
    setIsAddTaskModalOpen(!isAddTaskModalOpen);
  };

  const toggleFailedAddTaskModal = () => {
    setFailedAddTaskModalOpen(!failedAddTaskModalOpen);
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTaskData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleCancel = () => {
    toggleAddTaskModal();
    clearTaskInput();
    setIsTaskTitleEmpty(false);
  };

  const addTask = async () => {
    try {
      if (taskData.title.trim() !== "") {
        setIsTaskTitleEmpty(false);
        setIsLoaderShow(true);

        const response = await axios.post("http://localhost:3000/add-task", {
          userId,
          title: taskData.title,
          description: taskData.description,
        });

        if (response.status === 200) {
          toggleAddTaskModal();
          clearTaskInput();

          dispatch(updateTasks(response.data.tasks));
          if (selectedOption === options[0]) {
            dispatch(displayAllTasks());
          } else if (selectedOption === options[1]) {
            dispatch(displayUncompletedTasks());
          } else if (selectedOption === options[2]) {
            dispatch(displayCompletedTasks());
          }
        }
      } else {
        setIsTaskTitleEmpty(true);
      }
    } catch (error) {
      toggleAddTaskModal();
      setFailedAddTaskModalOpen(true);
      throw new Error("Error adding task");
    } finally {
      setIsLoaderShow(false);
    }
  };

  return (
    <div className="main" onClick={closeDropdown}>
      <Header />

      <div className="tasksContainer">
        <div className="dropdown">
          <button className="dropdownButton" onClick={toggleDropdown}>
            {selectedOption}
            <img src="src/assets/triangle.svg" alt="" className="triangle" />
          </button>
          {isDropdownOpen ? (
            <div className="options" onClick={toggleDropdown}>
              {options.map((option, index) => (
                <div
                  className="option"
                  key={index}
                  onClick={() => handleSelectOption(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="tasks">
          {tasks.length > 0 ? (
            <div className="tasksWrap">
              {tasks.map((task: TaskData) => (
                <Task
                  taskId={task.task_id}
                  title={task.title}
                  description={task.description}
                  taskStatus={task.completed}
                  selectedOption={selectedOption}
                  key={task.task_id}
                />
              ))}
            </div>
          ) : (
            <h1 className="noTasks">Задач нет</h1>
          )}

          <button
            className="addTask"
            title="Добавить задачу"
            onClick={toggleAddTaskModal}
          ></button>
        </div>
      </div>
      {isAddTaskModalOpen && (
        <Modal onClose={toggleAddTaskModal}>
          <div className="tasksModalInputWrap">
            <label className="tasksModalLabel">
              {isTaskTitleEmpty ? (
                <span className="taskValidationText">
                  Введите название задачи
                </span>
              ) : (
                "Название задачи"
              )}
              <input
                type="text"
                placeholder="Название задачи"
                className="tasksModalInput"
                name="title"
                value={taskData.title}
                onChange={handleChange}
              />
            </label>
            <label className="tasksModalLabel">
              Описание задачи
              <textarea
                placeholder="Описание задачи"
                className="tasksModalInput"
                name="description"
                value={taskData.description}
                onChange={handleChange}
              ></textarea>
            </label>
          </div>
          <div className="tasksModalBtnsWrap">
            <button className="tasksModalBtn" onClick={handleCancel}>
              Отмена
            </button>
            <button className="tasksModalBtn" onClick={addTask}>
              Добавить
            </button>
          </div>
        </Modal>
      )}
      {failedAddTaskModalOpen && (
        <Modal onClose={toggleFailedAddTaskModal}>
          <p className="failedAddTaskModalText">Не удалось добавить задачу</p>
          <button
            className="failedAddTaskModalBtn"
            onClick={toggleFailedAddTaskModal}
          >
            Ок
          </button>
        </Modal>
      )}
      {isLoaderShow && <Loader />}
    </div>
  );
};

export default Tasks;
