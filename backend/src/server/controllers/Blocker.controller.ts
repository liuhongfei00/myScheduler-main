// Controller to handle the request to add a blocker with time conflict check
import { Request, Response } from "express"
import {
	addBlocker,
	deleteBlocker,
	getAllBlockers,
	getByTime,
	getBetweenTimes,
	addMultiple,
} from "../services/Blocker.service"

export const addBlockerController = async (req: Request, res: Response) => {
	try {
		const { token, time, duration, name, description } = req.body
		const result = await addBlocker(token, time, duration)
		res.status(201).json(result)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const addMultipleController = async (req: Request, res: Response) => {
	try {
		const { token, time, number } = req.body
		const result = await addMultiple(token, time, number)
		res.status(201).json(result)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const deleteBlockerController = async (req: Request, res: Response) => {
	try {
		const { token, time } = req.params
		const result = await deleteBlocker(token, new Date(time))
		res.status(200).json(result)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const getAllBlockersController = async (req: Request, res: Response) => {
	try {
		const { token } = req.params
		const result = await getAllBlockers(token)
		res.status(200).json(result)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const getByTimeController = async (req: Request, res: Response) => {
	try {
		const { token, time } = req.params
		const result = await getByTime(token, new Date(time))
		res.status(200).json(result)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}

export const getBetweenTimesController = async (
	req: Request,
	res: Response
) => {
	try {
		const { token, startTime, endTime } = req.params
		const result = await getBetweenTimes(
			token,
			new Date(startTime),
			new Date(endTime)
		)
		res.status(200).json(result)
	} catch (error: any) {
		res.status(400).json({ error: error.message })
	}
}
