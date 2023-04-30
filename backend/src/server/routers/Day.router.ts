import { Router } from "express"
import {
	createDayController,
	createEmptyDayController,
	deleteDayController,
	getDayByIdController,
	updateDayController,
	getTotalHoursWorkedController,
	getAllTasksController,
} from "../controllers/Day.controller"

const dayRouter = Router()

dayRouter.post("/api/day/create", createDayController)
dayRouter.post("/api/day/createEmpty/:_id/:user", createEmptyDayController)
dayRouter.get("/api/day/getById/:dayId", getDayByIdController)
dayRouter.get("/api/day/getTotalHours/:dayId", getTotalHoursWorkedController)
dayRouter.get("/api/day/getAllTasks/:dayId", getAllTasksController)
dayRouter.patch("/api/day/update/", updateDayController)
dayRouter.delete("/api/day/delete/:dayId", deleteDayController)

export default dayRouter
