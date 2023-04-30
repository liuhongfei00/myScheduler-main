import { Router } from "express"
import {
	addBlockerController,
	deleteBlockerController,
	getAllBlockersController,
	getByTimeController,
	getBetweenTimesController,
	addMultipleController,
} from "../controllers/Blocker.controller"

const blockerRouter = Router()

blockerRouter.post("/api/blocker/add", addBlockerController)
blockerRouter.post("/api/blocker/addMultiple", addMultipleController)

blockerRouter.delete(
	"/api/blocker/delete/:token/:time",
	deleteBlockerController
)
blockerRouter.get("/api/blockers/getAll/:token", getAllBlockersController)

blockerRouter.get("/api/blockers/getByTime/:token/:time", getByTimeController)
blockerRouter.get(
	"/api/blockers/getBetweenTimes/:token/:startTime/:endTime",
	getBetweenTimesController
)

export default blockerRouter
