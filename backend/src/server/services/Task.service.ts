import Task from "../models/Task.model"
import { fetchUser } from "../services/User.service"
import { Priority, Category } from "../models/Task.model"

const getPrioEnum = (value: String) => {
	switch (value) {
		case "Urgent":
			return Priority.URG
		case "High":
			return Priority.HIG
		case "Medium":
			return Priority.MED
		case "Low":
			return Priority.LOW
		default:
			throw new Error("Invalid enum value")
	}
}

const getCategoryEnum = (value: String) => {
	switch (value) {
		case "NA":
			return Category.NA
		case "Assignment":
			return Category.ASS
		case "Hobby":
			return Category.HOB
		case "Relaxing":
			return Category.REL
		case "Exercises":
			return Category.EXE
		default:
			throw new Error("Invalid enum value")
	}
}

export const addTask = async (
	taskId: string,
	dueDate: Date,
	lengthOfWork: number,
	priorityValue: string,
	token: string,
	categoryValue: string,
	name?: string,
	description?: string
) => {
	// Validate dueDate
	var now = new Date()
	if (dueDate < now) {
		throw new Error("Invalid due date")
	}
	const priority = getPrioEnum(priorityValue)
	const user = await fetchUser(token)
	name = name ? name : "New Task"
	description = description ? description : ""
	const category = getCategoryEnum(categoryValue)

	// Create the new task
	const task = new Task({
		taskId: taskId,
		dueDate,
		priority,
		lengthOfWork,
		name,
		description,
		user,
		category,
	})
	return task.save()
}

export const getTask = async (taskId: string) => {
	try {
		const task = await Task.findOne({ taskId: taskId })

		if (!task) {
			throw new Error("Task not found")
		}

		return {
			message: `Task with ID ${taskId} retrived successfully.`,
			task,
		}
	} catch (error) {
		throw error
	}
}

export async function getAllTasks(token: string) {
	try {
		const user = await fetchUser(token)
		const tasks = await Task.find({ user: user._id })

		if (!tasks) {
			throw new Error("Tasks not found")
		}
		return {
			message: "Tasks retrieved successfully",
			tasks,
		}
	} catch (error) {
		throw error
	}
}

export async function deleteTask(taskId: string) {
	try {
		const task = await Task.findOne({ taskId: taskId })

		if (!task) {
			throw new Error("Task not found")
		}

		await task.remove()

		return {
			message: "Task deleted successfully",
		}
	} catch (error) {
		throw error
	}
}

export const deleteAllTasks = async (token: string) => {
	try {
		const user = await fetchUser(token)
		await Task.deleteMany({ user: user._id })

		return {
			message: "All tasks deleted successfully",
		}
	} catch (error) {
		throw error
	}
}

interface IUpdateTaskInput {
	taskId: string
	newDueDate?: Date
	newLengthOfWork?: number
	newName?: string
	newDescription?: string
	workDone?: number
	newPriority?: string
	newCategory?: string
}

export const updateTask = async ({
	taskId,
	newDueDate,
	newLengthOfWork,
	newName,
	newDescription,
	workDone,
	newPriority,
	newCategory,
}: IUpdateTaskInput) => {
	try {
		// Find the task in the database
		const task = await Task.findOne({ taskId })
		if (!task) {
			throw new Error("Task not found")
		}

		//make sure new values are different from prev
		// if (newDueDate && newDueDate === task.dueDate) {
		// 	throw new Error("New due date must be different from the old one")
		// }
		// if (newLengthOfWork && newLengthOfWork === task.lengthOfWork) {
		// 	throw new Error("New length must be different from the old one")
		// }
		// if (newName && newName === task.name) {
		// 	throw new Error("New name must be different from the old one")
		// }
		// if (newDescription && newDescription === task.description) {
		// 	throw new Error("New description must be different from the old one")
		// }

		//updating info
		if (newDueDate) {
			task.dueDate = newDueDate
		}
		if (newLengthOfWork) {
			task.lengthOfWork = newLengthOfWork
		}
		if (newName) {
			task.name = newName
		}
		if (newDescription) {
			task.description = newDescription
		}

		if (newPriority) {
			task.priority = getPrioEnum(newPriority)
		}

		if (newCategory) {
			task.category = getCategoryEnum(newCategory)
		}

		if (workDone) {
			//adding work done
			if (workDone < 0) {
				throw new Error("Task progress cannot be negative")
			} else {
				task.workDoneSoFar = workDone
			}
		}

		// Save task to the database
		await task.save()

		return {
			message: "Task updated successfully",
			task,
		}
	} catch (error) {
		throw error
	}
}
