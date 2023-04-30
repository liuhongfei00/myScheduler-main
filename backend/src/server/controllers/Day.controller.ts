import { Request, Response } from "express"
import {
	createDay,
	createEmptyDay,
	deleteDay,
	getDayById,
	updateDay,
	getTotalHoursWorked,
	getAllTasks,
} from "../services/Day.service"

export const createDayController = async (req: Request, res: Response) => {
	try {
		const { dayId, hoursWorked, tasksWorked, userEmail } = req.body
		const newDay = await createDay({
			dayId,
			hoursWorked,
			tasksWorked,
			userEmail,
		})

		res.status(201).json({ message: "Day created successfully", newDay })
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const createEmptyDayController = async (req: Request, res: Response) => {
	try {
		const { _id, user } = req.body
		const newDay = await createEmptyDay(_id, user)

		res.status(201).json({ message: "Empty day created successfully", newDay })
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const getDayByIdController = async (req: Request, res: Response) => {
	try {
		const { dayId } = req.params
		const day = await getDayById(dayId)

		res.status(200).json(day)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const updateDayController = async (req: Request, res: Response) => {
	try {
		const { dayId, hoursWorked, tasksWorked } = req.body
		const updatedDay = await updateDay({
			dayId,
			hoursWorked,
			tasksWorked,
		})

		res.status(200).json({ message: "Day updated successfully", updatedDay })
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const deleteDayController = async (req: Request, res: Response) => {
	try {
		const { dayId } = req.params
		const deletedDay = await deleteDay(dayId)

		res.status(200).json({ message: "Day deleted successfully", deletedDay })
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const getTotalHoursWorkedController = async (
	req: Request,
	res: Response
) => {
	try {
		const { dayId } = req.params
		const total = await getTotalHoursWorked(dayId)
		res.status(200).json({ total })
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const getAllTasksController = async (req: Request, res: Response) => {
	try {
		const { dayId } = req.params
		const tasks = await getAllTasks(dayId)
		res.status(200).json({ tasks })
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}
