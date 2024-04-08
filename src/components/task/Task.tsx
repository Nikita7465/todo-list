import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  displayAllTasks,
  displayCompletedTasks,
  displayUncompletedTasks,
  updateTasks,
} from "../../store/reducers/tasks.reducer";
import axios from "axios";
import Cookies from "js-cookie";
import { TaskState, TasksState } from "../../types";
import Modal from "../UI/modal/Modal";
import Loader from "../UI/loader/Loader";
import "./task.css";

interface TaskProps {
  taskId: number;
  title: string;
  description: string;
  taskStatus: number;
  selectedOption: string;
}

const Task = ({
  taskId,
  title,
  description,
  taskStatus,
  selectedOption,
}: TaskProps) => {
  const dispatch = useDispatch();
  const userId = Cookies.get("user_id");
  const tasks = useSelector((state: TasksState) => state.displayedTasks);
  const task = tasks.find((task: TaskState) => task.task_id === taskId);

  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isRemoveTaskConfirmModalOpen, setIsRemoveTaskConfirmModalOpen] =
    useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalText, setErrorModalText] = useState("");
  const [isTaskTitleEmpty, setIsTaskTitleEmpty] = useState(false);
  const [isLoaderShow, setIsLoaderShow] = useState(false);

  const [taskData, setTaskData] = useState({
    newTitle: task?.title,
    newDescription: task?.description,
  });

  const handleCancel = () => {
    toggleEditTaskModal();
    setIsTaskTitleEmpty(false);
    setTaskData({
      newTitle: task?.title,
      newDescription: task?.description,
    });
  };

  const toggleEditTaskModal = () => {
    setIsEditTaskModalOpen(!isEditTaskModalOpen);
  };
  const toggleRemoveTaskConfirmModal = () => {
    setIsRemoveTaskConfirmModalOpen(!isRemoveTaskConfirmModalOpen);
  };
  const toggleErrorModal = () => {
    setIsErrorModalOpen(!isErrorModalOpen);
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTaskData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const removeTask = async () => {
    try {
      setIsLoaderShow(true);
      const response = await axios.post("http://localhost:3000/remove-task", {
        userId,
        taskId,
      });

      if (response.status === 200) {
        dispatch(updateTasks(response.data.tasks));
        handleTaskDisplay(selectedOption);
      }
    } catch (error) {
      setErrorModalText("Не удалось удалить задачу");
      toggleErrorModal();
      throw new Error("Error removing task");
    } finally {
      toggleRemoveTaskConfirmModal();
      setIsLoaderShow(false);
    }
  };

  const editTask = async () => {
    try {
      if (taskData.newTitle?.trim() !== "") {
        setIsTaskTitleEmpty(false);
        setIsLoaderShow(true);

        const response = await axios.post("http://localhost:3000/edit-task", {
          userId,
          taskId,
          title: taskData.newTitle,
          description: taskData.newDescription,
        });

        if (response.status === 200) {
          toggleEditTaskModal();

          dispatch(updateTasks(response.data.tasks));
          handleTaskDisplay(selectedOption);
        }
      } else {
        setIsTaskTitleEmpty(true);
      }
    } catch (error) {
      toggleEditTaskModal();
      setErrorModalText("Не удалось изменить задачу");
      toggleErrorModal();
      throw new Error("Error removing task");
    } finally {
      setIsLoaderShow(false);
    }
  };

  const toggleCompleteTask = async () => {
    try {
      setIsLoaderShow(true);
      const response = await axios.post("http://localhost:3000/complete-task", {
        userId,
        taskId,
        taskStatus,
      });

      if (response.status === 200) {
        dispatch(updateTasks(response.data.tasks));
        handleTaskDisplay(selectedOption);
      }
    } catch (error) {
      setErrorModalText("Не удалось выполнить задачу");
      toggleErrorModal();
      throw new Error("Error completing task");
    } finally {
      setIsLoaderShow(false);
    }
  };

  const handleTaskDisplay = (option: string) => {
    switch (option) {
      case "Все задачи":
        dispatch(displayAllTasks());
        break;
      case "Не выполненные задачи":
        dispatch(displayUncompletedTasks());
        break;
      case "Выполненные задачи":
        dispatch(displayCompletedTasks());
        break;
      default:
        dispatch(displayAllTasks());
    }
  };

  return (
    <div className="task">
      <div className="taskTop">
        <div className="completedTaskCheckWrap" onClick={toggleCompleteTask}>
          {task?.completed ? (
            <img
              src="src/assets/check.svg"
              alt=""
              className="completedTaskCheck"
            />
          ) : null}
        </div>

        <h3 className="taskTitle">{title}</h3>

        <div className="taskIconsWrap">
          <button className="taskBtn" onClick={toggleEditTaskModal}>
            <img src="src/assets/edit.svg" alt="" className="taskIcon" />
          </button>

          <button className="taskBtn" onClick={toggleRemoveTaskConfirmModal}>
            <img src="src/assets/remove.svg" alt="" className="taskIcon" />
          </button>
        </div>
      </div>

      <p className="taskDesc">{description}</p>
      {isRemoveTaskConfirmModalOpen && (
        <Modal onClose={toggleRemoveTaskConfirmModal}>
          <span className="taskModalText">Удалить задачу?</span>
          <div className="taskBtnsWrap">
            <button
              className="taskConfirmModalBtn"
              onClick={toggleRemoveTaskConfirmModal}
            >
              Отмена
            </button>
            <button className="taskConfirmModalBtn" onClick={removeTask}>
              Удалить
            </button>
          </div>
        </Modal>
      )}

      {isEditTaskModalOpen && (
        <Modal onClose={toggleEditTaskModal}>
          <div className="editTaskModalInputWrap">
            <label className="editTaskModalLabel">
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
                name="newTitle"
                value={taskData.newTitle}
                onChange={handleChange}
              />
            </label>
            <label className="editTaskModalLabel">
              Описание задачи
              <textarea
                placeholder="Описание задачи"
                className="editTaskModalInput"
                name="newDescription"
                value={taskData.newDescription}
                onChange={handleChange}
              ></textarea>
            </label>
          </div>
          <div className="editTaskModalBtnsWrap">
            <button className="editTaskModalBtn" onClick={handleCancel}>
              Отмена
            </button>
            <button className="editTaskModalBtn" onClick={editTask}>
              Изменить
            </button>
          </div>
        </Modal>
      )}

      {isErrorModalOpen && (
        <Modal onClose={toggleErrorModal}>
          <p className="errorModalText">{errorModalText}</p>
          <button className="errorModalBtn" onClick={toggleErrorModal}>
            Ок
          </button>
        </Modal>
      )}

      {isLoaderShow && <Loader />}
    </div>
  );
};

export default Task;
