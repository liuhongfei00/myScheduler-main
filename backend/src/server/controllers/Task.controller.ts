import { Request, Response } from "express"
import { getAllBlockers } from "../services/Blocker.service"
import { getTotalHoursWorked } from "../services/Day.service"
import {
	addTask,
	updateTask,
	deleteTask,
	getTask,
	getAllTasks,
	deleteAllTasks,
} from "../services/Task.service"

export const addController = async (req: Request, res: Response) => {
	try {
		const {
			taskId,
			dueDate,
			lengthOfWork,
			priorityValue,
			token,
			categoryValue,
			name,
			description,
		} = req.body

		const task = await addTask(
			taskId,
			dueDate,
			lengthOfWork,
			priorityValue,
			token,
			categoryValue,
			name,
			description
		)

		res.status(201).json({ message: "Task created successfully", task })
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const updateController = async (req: Request, res: Response) => {
	try {
		const {
			taskId,
			newDueDate,
			newLengthOfWork,
			newName,
			newDescription,
			workDone,
			newPriority,
			newCategory,
		} = req.body

		const task = await updateTask({
			taskId,
			newDueDate,
			newLengthOfWork,
			newName,
			newDescription,
			workDone,
			newPriority,
			newCategory,
		})

		res.status(201).json({ message: "Task updated successfully", task })
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const deleteController = async (req: Request, res: Response) => {
	try {
		const { taskId } = req.params
		const result = await deleteTask(taskId)

		res.status(200).json(result)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const deleteAllController = async (req: Request, res: Response) => {
	try {
		const { token } = req.params
		const result = await deleteAllTasks(token)

		res.status(200).json(result)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const getController = async (req: Request, res: Response) => {
	try {
		const taskId = req.params.taskId

		const task = await getTask(taskId)

		res.status(200).json(task)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const getAllController = async (req: Request, res: Response) => {
	try {
		const token = req.params.token
		const tasks = await getAllTasks(token)

		res.status(200).json(tasks)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const getAllWorkSessions = async (req: Request, res: Response) => {
	try {
		const token = req.params.token
		let tasks = await getAllTasks(token)
		let blockers = await getAllBlockers(token)
		let hourMili = 1000 * 60 * 60
		let halfHourMili = 1000 * 60 * 30
		let lastTaskTime = 0
		const sortedAsc = tasks.tasks.sort(
			(objA, objB) => objA.dueDate - objB.dueDate
		)

		const sortedBlocker = blockers.blockers.sort(
			(objA, objB) => objA.time - objB.time
		)

		let today = new Date().getTime()

		let remainder = today % halfHourMili
		today = today - remainder + halfHourMili
		//console.log("today :" + new Date())
		console.log("Today time shifted to the next 30 min: " + today)
		let blockersPeriods = new Array()
		let taskAlloted = new Array()

		sortedBlocker.forEach((element) => {
			let temp = [2]
			temp[0] = element.time.getTime()
			temp[1] = temp[0] + hourMili * element.duration
			blockersPeriods.push(temp)
		})

		blockersPeriods.forEach((element) => {
			let start = new Date(element[0])
			let end = new Date(element[1])
			console.log(
				"Blocker starts @ " + start.toString() + " ends @ " + end.toString()
			)
		})

		sortedAsc.forEach((element) => {
			let temp = [4]
			temp[0] = element.taskId
			temp[1] = element.dueDate.getTime()
			temp[2] = element.lengthOfWork - element.workDoneSoFar
			temp[3] = 0
			taskAlloted.push(temp)
		})

		taskAlloted.forEach((element) => {
			console.log(
				"Task " +
				element[0] +
				" due: " +
				element[1] +
				" dura: " +
				element[2] +
				" ass: " +
				element[3]
			)
			lastTaskTime = element[1]
		})
		//taskid, start time, end time
		let workPeriods = new Array()

		taskAlloted.forEach((element) => {
			let start = today
			let end = start
			while (element[3] < element[2]) {
				end += halfHourMili
				let isSat = true
				//checking if start, end period is in intereference with any blocker
				blockersPeriods.forEach((currblock) => {
					if (
						(start >= currblock[0] && start <= currblock[1]) ||
						(end >= currblock[0] && end <= currblock[1])
					) {
						isSat = false
					}
				})
				workPeriods.forEach((currblock) => {
					if (
						(start >= currblock[0] && start <= currblock[1]) ||
						(end >= currblock[0] && end <= currblock[1])
					) {
						isSat = false
					}
				})

				const hours = `0${new Date(start).getHours() - 1}`.slice(-2);

				if (!(parseInt(hours) >= 8 && parseInt(hours) < 17)) {
					isSat = false
				}

				if (!isSat) {
					start += halfHourMili
				} else {
					let temp = [3]
					temp[0] = element[0]
					temp[1] = start
					temp[2] = end
					element[3] = element[3] + 0.5
					workPeriods.push(temp)
					start += halfHourMili
				}
			}
		})
		console.log("Work periods___")

		let converted = new Array()
		workPeriods.forEach((element) => {
			const taskId = element[0].toString()
			const task = tasks.tasks.find((task) => task.taskId === taskId)

			if (task) {
				let temp = {
					taskId: taskId,
					start: new Date(element[1]).toString(),
					end: new Date(element[2]).toString(),
					task: task.name,
				}
				converted.push(temp)
			} else {
				console.error(`Task not found for taskId: ${taskId}`)
			}
		})

		res.status(200).json(converted)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}
