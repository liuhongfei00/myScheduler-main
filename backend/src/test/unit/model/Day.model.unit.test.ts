// import { expect } from "chai"
// import Day from "../../../server/models/Day.model"
// import { describe, it, afterEach, before, after } from "mocha"
// import mongoose from "mongoose"

// describe("Day model", () => {
// 	before(async () => {
// 		await mongoose.connect("mongodb://localhost:27017/my_scheduler")
// 	})

// 	after(async () => {
// 		await mongoose.connection.close()
// 	})

// 	it("should allow saving a day with a valid schema", async () => {
// 		const userId = new mongoose.Types.ObjectId()
// 		const hoursWorked = 5
// 		const workCompleted = [2, 3]
// 		const taskCompleted = [
// 			new mongoose.Types.ObjectId(),
// 			new mongoose.Types.ObjectId(),
// 		]
// 		const day = new Day({
// 			hoursWorked,
// 			workCompleted,
// 			taskCompleted,
// 			user: userId,
// 		})
// 		await day.save()
// 		const savedDay = await Day.findOne({ _id: day._id })
// 		if (savedDay) {
// 			expect(savedDay.hoursWorked).to.equal(day.hoursWorked)
// 			expect(savedDay.workCompleted).to.eql(day.workCompleted)
// 			expect(savedDay.taskCompleted).to.eql(day.taskCompleted)
// 			expect(savedDay.user).to.eql(day.user)
// 		}
// 		await day.remove()
// 	})

// 	it("should default hoursWorked to 0 if not provided", async () => {
// 		const userId = new mongoose.Types.ObjectId()
// 		const workCompleted = [2, 3]
// 		const taskCompleted = [
// 			new mongoose.Types.ObjectId(),
// 			new mongoose.Types.ObjectId(),
// 		]
// 		const day = new Day({
// 			workCompleted,
// 			taskCompleted,
// 			user: userId,
// 		})
// 		await day.validate()
// 		expect(day.hoursWorked).to.equal(0)
// 		await day.remove()
// 	})
// })
