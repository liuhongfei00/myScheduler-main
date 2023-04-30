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
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import { Link } from "react-router-dom";
import AddTask from "./AddTask";
import UpdateTask from "./UpdateTask";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: purple[500],
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#11cb5f',
    },
  },
});
const TaskList = () => {
  const [tasks, setTasks] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const loadTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/task/getAll/${token}`);

      console.log(response.data);

      if (Array.isArray(response.data.tasks)) {
        setTasks(response.data.tasks);
      } else {
        console.error("Invalid response data:", response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRowClick = (task) => {
    if (selectedTask === task) {
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/task/delete/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.taskId !== taskId)
      );
      setSelectedTask(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAllTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/task/deleteAll/${token}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(null);
      setSelectedTask(null);
    } catch (error) {
      console.error(error);
    }
  };


  const handleAddTask = async (newTask) => {
    const { name, dueDate, description, taskId, lengthOfWork, priorityValue, categoryValue } = newTask;

    const token = localStorage.getItem("token");

    //     console.log("Token:", token);
    //     console.log("Due Date", dueDate);
    //     console.log("Length Of Work:", lengthOfWork);
    //     console.log("name:", name);
    //     console.log("description:", description);
    //     console.log("Priority:", priority);
    //     console.log("Category:", category);
    //     console.log("taskId:", taskid);
    // Prepare the data to send to the backend
    const taskData = {
      token,
      dueDate,
      priorityValue,
      categoryValue,
      name,
      description,
      taskId,
      lengthOfWork,
    };

    try {
      // Replace '/api/blocker/add' with the correct API endpoint if needed
      const response = await axios.post("/api/task/create", taskData);
      console.log(response.data);
    } catch (error) {
      console.error("Error adding task:", error);

      let errorMessage = "An error occurred while adding the task.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }

      throw new Error(errorMessage);

    }
  };


  const handleUpdateTask = async (updatedTask) => {
    const {
      taskId,
      newName,
      newDueDate,
      newDescription,
      newLengthOfWork,
      workDone,
    } = updatedTask;

    const token = localStorage.getItem("token");

    const taskData = {
      taskId,
      newName,
      newDueDate,
      newDescription,
      newLengthOfWork,
      workDone,
    };

    try {
      // Replace '/api/task/update/:id' with the correct API endpoint if needed
      const response = await axios.patch(`/api/task/update`, taskData);
      console.log(response.data);
    } catch (error) {
      console.error("Error updating task:", error);

      let errorMessage = "An error occurred while updating the task.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }

      throw new Error(errorMessage);
    }
  };

  const renderTaskRow = (task) => {
    const isExpanded = task === selectedTask;
    const handleSubmit = (updatedTask) => {
      updatedTask.taskId = task.taskId;
      handleUpdateTask(updatedTask);
    };
    return (
      <React.Fragment key={task.taskId}>
        <TableRow onClick={() => handleRowClick(task)}>
          <TableCell>
            <IconButton size="small">
              {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
            {task.name}
          </TableCell>
          <TableCell align="right">{task.dueDate}</TableCell>
          <TableCell align="right">{task.priority}</TableCell>
          <TableCell align="right">
            <UpdateTask onSubmit={handleSubmit} />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDeleteTask(task.taskId)}
            >
              Delete task
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <div>
                <p>{task.description}</p>
                <p>Length of work: {task.lengthOfWork}</p>
                <p>Work done so far: {task.workDoneSoFar}</p>
                <p>Category: {task.category}</p>
              </div>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={loadTasks}>Load Tasks</Button>
      &nbsp;
      <Button variant="outlined" onClick={handleDeleteAllTasks}>Delete All Tasks</Button>
      &nbsp;
      <Link to="/calendar">
        <Button variant="outlined" color="primary" >Go to Calendar</Button>
      </Link>
      &nbsp;
      <AddTask onSubmit={handleAddTask} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Due Date</TableCell>
              <TableCell align="right">Priority</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{tasks && tasks.map(renderTaskRow)}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );

};

export default TaskList;
