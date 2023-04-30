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
import React, { useState, useEffect } from "react";

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)"
    }
};



Modal.setAppElement("#root");

function UpdateTask(props) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [taskID, setTaskID] = useState("");
    const [taskDueDate, setTaskDueDate] = useState("");
    const [taskText, setTaskText] = useState("");
    const [taskLengthOfWork, setTaskLengthOfWork] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    // const [priorityType, setPriorityType] = useState("");
    // const [categoryType, setCategoryType] = useState("");
    //const [selectedTask, setSelectedTask] = useState("");
    const [taskWorkDone, setWorkDone] = useState("");
    const [errorDescription, setErrorDescription] = useState("");

    useEffect(() => {
        async function fetchTask() {
            const response = await axios.get(`/api/task/getById/${props.taskId}`);
            const task = response.data.task;
            if (task) {
                setTaskText(task.name);
                setTaskDescription(task.description);
                // setPriorityType(task.priorityValue);
                // setCategoryType(task.categoryValue);
                //setSelectedTask(task.name);
                setTaskDueDate(task.dueDate);
                setTaskLengthOfWork(task.lengthOfWork);
                setTaskID(task.taskId);
                setWorkDone(task.workDoneSoFar);
            } else {
                console.error("Invalid task ID:", props.taskId);
            }
        }
        fetchTask();
    }, [props.taskId]);

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    function handleTaskTextChange(e) {
        setTaskText(e.target.value);
    }

    function handleTaskDescriptionChange(e) {
        setTaskDescription(e.target.value);
    }

    // function handlePriorityTypeChange(e) {
    //     setPriorityType(e.target.value);
    // }

    // function handleCategoryTypeChange(e) {
    //     setCategoryType(e.target.value);
    // }

    function handleTaskDueDateChange(e) {
        setTaskDueDate(e.target.value);
    }

    function handleTaskLengthOfWorkChange(e) {
        setTaskLengthOfWork(e.target.value);
    }

    function handleTaskWorlDoneChange(e) {
        setWorkDone(e.target.value);
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const updatedTask = {
            taskId: taskID,
            newName: taskText,
            newDescription: taskDescription,
            newDueDate: taskDueDate,
            newLengthOfWork: taskLengthOfWork,
            workDone: taskWorkDone
        };
        console.log(updatedTask);

        try {
            await props.onSubmit(updatedTask);
            setModalIsOpen(false);
            //setSelectedTask("");
            setTaskText("");
            setTaskDescription("");
            // setPriorityType("");
            // setCategoryType("");
            setTaskDueDate("");
            setTaskLengthOfWork("");
            setWorkDone("");
            setErrorDescription("");
        } catch (error) {
            setErrorDescription(error.message);
        }
    }

    return (
        <>
            <Button variant="contained" color="blue" onClick={openModal}>Update Task</Button>
            &nbsp;
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Update Task Modal"
            >
                <h2>Update Task</h2>
                <form onSubmit={handleFormSubmit}>
                    <br />
                    <label>
                        Task Name:
                        <input
                            type="text"
                            value={taskText}
                            onChange={handleTaskTextChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Due Date:
                        <input
                            type="datetime-local"
                            value={taskDueDate}
                            onChange={handleTaskDueDateChange}
                        />
                    </label>
                    <br />
                    <label>
                        Length of Work:
                        <input
                            type="text"
                            value={taskLengthOfWork}
                            onChange={handleTaskLengthOfWorkChange}
                        />
                    </label>
                    <br />
                    <label>
                        Work Done:
                        <input
                            type="text"
                            value={taskWorkDone}
                            onChange={handleTaskWorlDoneChange}
                        />
                    </label>
                    <br />
                    <label>
                        Task Description:
                        <input
                            type="text"
                            value={taskDescription}
                            onChange={handleTaskDescriptionChange}
                        />
                    </label>
                    <br />
                    {/* < label >
                        Priority:
                        <select value={priorityType} onChange={handlePriorityTypeChange}>
                            <option value="">-- Select a Priority --</option>
                            <option value="Urgent">Urgent</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </label>
                    <br />
                    <label>
                        Category:
                        <select value={categoryType} onChange={handleCategoryTypeChange}>
                            <option value="">-- Select a Category --</option>
                            <option value="Unassigned">Unassigned</option>
                            <option value="Assignment">Assignment</option>
                            <option value="Hobby">Hobby</option>
                            <option value="Relaxing">Relaxing</option>
                            <option value="Exercises">Exercises</option>
                        </select>
                    </label> */}
                    <br />
                    <button type="submit">Update Task</button>
                    {errorDescription && <p>{errorDescription}</p>}
                </form>
            </Modal>
        </>
    );
}

export default UpdateTask;              
