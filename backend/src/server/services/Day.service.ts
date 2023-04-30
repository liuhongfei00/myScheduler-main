import Day from "../models/Day.model"
import User from "../models/User.model"
import Task from "../models/Task.model"

interface ICreateDayInput {
	dayId: string
	hoursWorked?: number[]
	tasksWorked?: string[]
	userEmail: string
}

interface IUpdateDayInput {
	dayId: string
	hoursWorked?: number[]
	tasksWorked?: string[]
}

const checkHoursAndTasks = (hours: number[], tasks: string[]) => {
	if (hours.length !== tasks.length) {
		throw new Error(
			"The hoursWorked and tasksWorked arrays must have the same length"
		)
	}
}

export const createDay = async (dayInput: ICreateDayInput) => {
	// Check if the passed user exists in the database
	const user = await User.findOne({ email: dayInput.userEmail })
	if (!user) {
		throw new Error("User not found")
	}

	checkHoursAndTasks(dayInput.hoursWorked || [], dayInput.tasksWorked || [])

	// Check if the passed tasks exist in the database
	const tasks = await Task.find({ taskId: { $in: dayInput.tasksWorked || [] } })
	if (dayInput.tasksWorked && tasks.length !== dayInput.tasksWorked.length) {
		throw new Error("One or more tasks not found")
	}
	const newDay = new Day(dayInput)
	return await newDay.save()
}

export const createEmptyDay = async (dayId: string, user: string) => {
	const newDay = new Day({ dayId, user })
	return await newDay.save()
}

export const getDayById = async (dayId: string) => {
	const day = await Day.findOne({ dayId })
	if (!day) {
		throw new Error("Day not found")
	}
	return day
}

export const updateDay = async (dayUpdates: IUpdateDayInput) => {
	const day = await Day.findOne({ dayId: dayUpdates.dayId })
	if (!day) {
		throw new Error("Day not found")
	}

	if (dayUpdates.hoursWorked || dayUpdates.tasksWorked) {
		checkHoursAndTasks(
			dayUpdates.hoursWorked || day.hoursWorked,
			dayUpdates.tasksWorked || day.tasksWorked
		)
	}

	// Check if the passed tasks exist in the database
	const tasks = await Task.find({
		taskId: { $in: dayUpdates.tasksWorked || [] },
	})
	if (
		dayUpdates.tasksWorked &&
		tasks.length !== dayUpdates.tasksWorked.length
	) {
		throw new Error("One or more tasks not found")
	}

	return await Day.findOneAndUpdate({ dayId: dayUpdates.dayId }, dayUpdates, {
		new: true,
	})
}

export const deleteDay = async (dayId: string) => {
	return await Day.findOneAndDelete({ dayId })
}

export const getTotalHoursWorked = async (dayId: string): Promise<number> => {
	// Find the Day document with the given dayId
	const day = await Day.findOne({ dayId })
	if (!day) {
		throw new Error("Day not found")
	}

	// Use the reduce method to add up all of the elements in hoursWorked
	const total = day.hoursWorked.reduce((acc, cur) => acc + cur, 0)

	return total
}

export const getAllTasks = async (dayId: string) => {
	const day = await Day.findOne({ dayId })
	if (!day) {
		throw new Error("Day not found")
	}
	const tasks = await Task.find({ taskId: { $in: day.tasksWorked } })
	return tasks
}
