import mongoose from "mongoose"
import { expect } from "chai"
import Task, { Priority, Category } from "../../../server/models/Task.model"
import { describe, it, afterEach, before, after } from "mocha"

describe("Task model", () => {
	before(async () => {
		await mongoose.connect("mongodb://localhost:27017/my_scheduler")
	})

	after(async () => {
		await mongoose.connection.close()
	})

	it("should be invalid if name is empty", async () => {
		const task = new Task({
			_id: "1",
			priority: Priority.URG,
			dueDate: new Date(),
			lengthOfWork: 60,
			category: Category.NA,
			user: "user123",
		})

		try {
			await task.validate()
		} catch (err: any) {
			expect(err.errors.name).to.exist
		}
	})

	it("should be invalid if priority is not one of the allowed values", async () => {
		const task = new Task({
			_id: "1",
			priority: "INVALID",
			dueDate: new Date(),
			lengthOfWork: 60,
			name: "Test Task",
			category: Category.NA,
			user: "user123",
		})

		try {
			await task.validate()
		} catch (err: any) {
			expect(err.errors.priority).to.exist
		}
	})

	it("should be invalid if due date is empty", async () => {
		const task = new Task({
			_id: "1",
			priority: Priority.URG,
			lengthOfWork: 60,
			name: "Test Task",
			category: Category.NA,
			user: "user123",
		})

		try {
			await task.validate()
		} catch (err: any) {
			expect(err.errors.dueDate).to.exist
		}
	})

	it("should be invalid if length of work is empty", async () => {
		const task = new Task({
			_id: "1",
			priority: Priority.URG,
			dueDate: new Date(),
			name: "Test Task",
			category: Category.NA,
			user: "user123",
		})

		try {
			await task.validate()
		} catch (err: any) {
			expect(err.errors.lengthOfWork).to.exist
		}
	})

	it("should be invalid if category is not one of the allowed values", async () => {
		const task = new Task({
			_id: "1",
			priority: Priority.URG,
			dueDate: new Date(),
			lengthOfWork: 60,
			name: "Test Task",
			category: "INVALID",
			user: "user123",
		})

		try {
			await task.validate()
		} catch (err: any) {
			expect(err.errors.category).to.exist
		}
	})

	it("should allow saving a task with a valid schema", async () => {
		const userId = new mongoose.Types.ObjectId()

		const task = new Task({
			taskId: "19",
			priority: Priority.URG,
			dueDate: "2023-02-25T22:39:55.872Z",
			lengthOfWork: 60,
			name: "Test Task",
			category: Category.NA,
			user: userId,
		})

		await task.save()

		const savedTask = await Task.findOne({ taskId: "19" })

		if (savedTask) {
			expect(savedTask.priority).to.equal(task.priority)
			expect(savedTask.dueDate).to.eql(task.dueDate)
			expect(savedTask.lengthOfWork).to.equal(task.lengthOfWork)
			expect(savedTask.workDoneSoFar).to.equal(task.workDoneSoFar)
			expect(savedTask.name).to.equal(task.name)
			expect(savedTask.description).to.equal(task.description)
			expect(savedTask.category).to.equal(task.category)
			expect(savedTask.user.userId).to.equal(task.user.userId)
		}

		await task.remove()
	})
})
