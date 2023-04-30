import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Button,
} from "@material-ui/core";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

function AddTask(props) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  //const [taskStart, setTaskStart] = useState("");
  //const [taskEnd, setTaskEnd] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskLengthOfWork, setTaskLengthOfWork] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [priorityType, setPriorityType] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [taskID, setTaskID] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [errorDescription, setErrorDescription] = useState("");

  function openModal() {
    fetchTasks();
    setModalIsOpen(true);
  }

  async function fetchTasks() {
    // Fetch tasks from the database here.
    // Replace the URL with the actual API endpoint.

    const token = localStorage.getItem("token");
    const response = await axios.get(`/api/task/getAll/${token}`);

    if (Array.isArray(response.data.tasks)) {
      setTasks(response.data.tasks);
    } else {
      console.error("Invalid response data:", response.data);
    }
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  function handleTaskTextChange(e) {
    setTaskText(e.target.value);
  }

  function handleTaskLengthOfWork(e) {
    setTaskLengthOfWork(e.target.value);
  }

  function handleTaskDueDate(e) {
    setTaskDueDate(e.target.value);
  }

  function handleTaskDescriptionChange(e) {
    setTaskDescription(e.target.value);
  }

  function handlePriorityTypeChange(e) {
    setPriorityType(e.target.value);
  }

  function handleCategoryTypeChange(e) {
    setCategoryType(e.target.value);
  }

  function handleTaskIDChange(e) {
    setTaskID(e.target.value);
  }

  function handleTaskSelectChange(e) {
    setSelectedTask(e.target.value);
    const selectedTask = tasks.find((task) => task.name === e.target.value);
    if (selectedTask) {
      setTaskDescription(selectedTask.description);
    } else {
      setTaskDescription("");
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const offsetInMilliseconds = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
    //     const adjustedStart = new Date(
    //       new Date(taskStart).getTime() - offsetInMilliseconds
    //     );
    //     const adjustedEnd = new Date(
    //       new Date(taskEnd).getTime() - offsetInMilliseconds
    //     );
    // const duration = (adjustedEnd.getTime() - adjustedStart.getTime()) / 60000;

    // let taskId = "";
    //     if (type === "Task") {
    //       let task = tasks.find((task) => task.name === selectedTask);
    //       taskId = task.taskId;
    //     }

    // const adjustedStartFormatted = adjustedStart.toISOString();
    // console.log("Type:", type);
    // console.log("TaskId:", taskId);
    // console.log("Duration:", duration);
    // console.log("name:", taskText);
    // console.log("description:", taskDescription);
    // console.log("Adjusted Start Formatted:", adjustedStartFormatted);

    const newTask = {
      name: taskText,
      dueDate: taskDueDate,
      priorityValue: priorityType,
      categoryValue: categoryType,
      description: taskDescription,
      lengthOfWork: taskLengthOfWork,
      taskId: taskID,
    };
    console.log(newTask);

    try {
      await props.onSubmit(newTask);
      setModalIsOpen(false);
      setTaskDueDate("");
      setTaskLengthOfWork("");
      setTaskText("");
      setTaskDescription("");
      setPriorityType("");
      setCategoryType("");
      setTaskID("");
      setSelectedTask("");
      setErrorDescription("");
    } catch (error) {
      setErrorDescription(error.message);
    }
  }

  return (
    <>
      <Button variant="outlined" onClick={openModal}>Add Task</Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Task Modal"
      >
        <h2>Add a New Task</h2>
        <form onSubmit={handleFormSubmit}>
          <br />
          <label>
            Task Name:
            <input
              type="text"
              value={taskText}
              onChange={handleTaskTextChange}
            />
          </label>
          <br />
          <label>
            Task ID:
            <input
              type="text"
              value={taskID}
              onChange={handleTaskIDChange}
            />
            <br>
            </br>
          </label>
          <label>
            Priority:
            <select value={priorityType} onChange={handlePriorityTypeChange}>
              <option value="">-- Select Priority Type --</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>
          <br />
          <br>
          </br>
          <label>
            Category:
            <select value={categoryType} onChange={handleCategoryTypeChange}>
              <option value="">-- Select Category Type --</option>
              <option value="Unassigned">Unassigned</option>
              <option value="Assignment">Assignment</option>
              <option value="Hobby">Hobby</option>
              <option value="Relaxing">Relaxing</option>
              <option value="Exercises">Exercises</option>
            </select>
          </label>
          <br />
          {/*           {type === "Task" && ( */}
          {/*             <label> */}
          {/*               Select Task: */}
          {/*               <select value={selectedTask} onChange={handleTaskSelectChange}> */}
          {/*                 <option value="">-- Select Task --</option> */}
          {/*                 {tasks.map((task) => ( */}
          {/*                   <option key={task.id} value={task.name}> */}
          {/*                     {task.name} */}
          {/*                   </option> */}
          {/*                 ))} */}
          {/*               </select> */}
          {/*             </label> */}
          {/*           )} */}
          <br />
          <br />
          <label>
            Due Date:
            <input
              type="datetime-local"
              value={taskDueDate}
              onChange={handleTaskDueDate}
            />
          </label>
          <br />
          <label>
            Length of Work:
            <input
              type="text"
              value={taskLengthOfWork}
              onChange={handleTaskLengthOfWork}
            />
          </label>
          <br />
          <label>
            Description:
            <textarea
              value={taskDescription}
              onChange={handleTaskDescriptionChange}
            ></textarea>
          </label>
          <br />
          <button type="submit">Add</button>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
          <br />
          <label>
            ErrorMessage:
            <textarea value={errorDescription}></textarea>
          </label>
        </form>
      </Modal>
    </>
  );
}

export default AddTask;