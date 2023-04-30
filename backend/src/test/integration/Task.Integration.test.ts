import supertest from "supertest"
import { fetchUser, loginService } from "../../server/services/User.service"
import sinon from "sinon"
import { expect } from "chai"
import Task, { Priority, Category } from "../../server/models/Task.model"
import app from "../../server/index"
import { describe, it, beforeEach, afterEach, before, after } from "mocha"
import jwt from "jsonwebtoken"
import User from "../../server/models/User.model"

describe("Task API", () => {
	describe("POST /api/task/add", () => {
		let createTaskStub

		beforeEach(() => {
			createTaskStub = sinon.stub(Task.prototype, "save")
		})

		afterEach(() => {
			// Restore the original method after each test
			createTaskStub.restore()
		})

		it("should create a new task with valid input", async () => {
			try {
				const user = new User({
					email: "existinguser@example.com",
					username: "existinguser",
					password: "Existingpassword123",
				})
				await user.save()

				const token = (
					await loginService({
						username: "existinguser",
						password: "Existingpassword123",
					})
				).token

				// Set up variables for task attributes
				const taskId = "28"
				const priority = "Urgent"
				const dueDate = "2025-12-17T03:24:00"
				const lengthOfWork = "5"
				const category = "NA"

				console.log(token)

				createTaskStub.resolves({
					taskId: taskId,
					categoryValue: category,
					dueDate: dueDate,
					lengthOfWork: lengthOfWork,
					priorityValue: priority,
					token: token,
				})
				// Make the request to create a new task
				const res = await supertest(app)
					.post("/api/task/add")
					.send({
						taskId: taskId,
						categoryValue: category,
						dueDate: dueDate,
						lengthOfWork: lengthOfWork,
						priorityValue: priority,
						token: token,
					})
					.expect(201)

				expect(res.body).to.have.property("task")
				// expect(res.body.task).to.have.property("priority", priority)
				// expect(res.body.task).to.have.property("dueDate", dueDate)
				// expect(res.body.task).to.have.property("lengthOfWork", lengthOfWork)
				// expect(res.body.task).to.have.property("category", category)
				// expect(res.body.task).to.have.property("user")
			} catch (error) {
				throw error
			} finally {
				await User.deleteOne({ email: "existinguser@example.com" })
				await Task.deleteOne({ taskId: "28" })
			}
		})
	})

	describe("GET /api/task/getATask", () => {
		it("should fetch a task with valid input", async () => {
			try {
				const user = new User({
					email: "existinguser@example.com",
					username: "existinguser",
					password: "Existingpassword123",
				})
				await user.save()

				const task = new Task({
					taskId: "28",
					priority: Priority.URG,
					dueDate: "2023-07-25T22:39:55.872Z",
					lengthOfWork: 60,
					name: "Test Task",
					category: Category.NA,
					user: user,
				})
				await task.save()

				// Make the request to fetch a task
				const res = await supertest(app)
					.get("/api/task/getAtask")
					.send({
						taskId: "28",
					})
					.expect(200)

				expect(res.body).to.have.property("task")
			} catch (error) {
				throw error
			} finally {
				await User.deleteOne({ email: "existinguser@example.com" })
				await Task.deleteOne({ taskId: "28" })
			}
		})
		it("should display a task not found error when task doesn't exist", () => {
			// Make the request to fetch a task
			const res = supertest(app)
				.get("/api/task/getAtask")
				.send({ taskId: "999" })
				.expect(404)
		})
	})

	describe("DELETE /api/task/delete", () => {
		it("should delete a task with valid input", async () => {
			try {
				const user = new User({
					email: "existinguser@example.com",
					username: "existinguser",
					password: "Existingpassword123",
				})
				await user.save()

				const task = new Task({
					taskId: "28",
					priority: Priority.URG,
					dueDate: "2023-07-25T22:39:55.872Z",
					lengthOfWork: 60,
					name: "Test Task",
					category: Category.NA,
					user: user,
				})
				await task.save()

				// Make the request to fetch a task
				const res = await supertest(app)
					.delete("/api/task/delete")
					.send({
						taskId: "28",
					})
					.expect(200)
			} catch (error) {
				throw error
			} finally {
				await User.deleteOne({ email: "existinguser@example.com" })
				// await Task.deleteOne({ taskId: "28" })
			}
		})
		it("should display a task not found error when task doesn't exist", () => {
			// Make the request to fetch a task
			const res = supertest(app)
				.delete("/api/task/delete")
				.send({ taskId: "999" })
				.expect(404)
		})
	})

	describe("PATCH /api/task/update", () => {
		it("should update a task with valid input", async () => {
			try {
				const user = new User({
					email: "existinguser@example.com",
					username: "existinguser",
					password: "Existingpassword123",
				})
				await user.save()

				const token = (
					await loginService({
						username: "existinguser",
						password: "Existingpassword123",
					})
				).token

				const task = new Task({
					taskId: "28",
					priority: Priority.URG,
					dueDate: "2023-07-25T22:39:55.872Z",
					lengthOfWork: 60,
					name: "Test Task",
					category: Category.NA,
					user: user,
				})
				await task.save()

				const newDueDate = "2023-07-25T22:39:55.872Z"
				const newLengthOfWork = "10"
				const newName = "s"
				const newDescription = "task"
				const workDone = "0"
				// Make the request to fetch a task
				const res = await supertest(app).patch("/api/task/update").send({
					taskId: "28",
					token: token,
					newDueDate: newDueDate,
					newLengthOfWork: newLengthOfWork,
					newName: newName,
					newDescription: newDescription,
					workDone: workDone,
				})
				console.log(res.body)
				expect(res.body).to.have.property("task")
			} catch (error) {
				throw error
			} finally {
				await User.deleteOne({ email: "existinguser@example.com" })
				await Task.deleteOne({ taskId: "28" })
			}
		})

		it("should throw error when task doesn't exist", async () => {
			const user = new User({
				email: "existinguser@example.com",
				username: "existinguser",
				password: "Existingpassword123",
			})
			await user.save()

			const token = (
				await loginService({
					username: "existinguser",
					password: "Existingpassword123",
				})
			).token

			// Make the request to fetch a task
			const res = supertest(app)
				.patch("/api/task/update")
				.send({
					taskId: "28",
					token: token,
					newDueDate: "2025-12-17T03:24:00",
					newLengthOfWork: 60,
					newName: "1",
					newDescription: "asd",
					workDone: 2,
				})
				.send({ taskId: "999" })
				.expect(404)

			await User.deleteOne({ email: "existinguser@example.com" })
		})
	})

	describe("DELETE /api/task/delete", () => {
		it("should delete a task with valid input", async () => {
			try {
				const user = new User({
					email: "existinguser@example.com",
					username: "existinguser",
					password: "Existingpassword123",
				})
				await user.save()

				const task = new Task({
					taskId: "28",
					priority: Priority.URG,
					dueDate: "2023-07-25T22:39:55.872Z",
					lengthOfWork: 60,
					name: "Test Task",
					category: Category.NA,
					user: user,
				})
				await task.save()

				// Make the request to fetch a task
				const res = await supertest(app)
					.delete("/api/task/delete")
					.send({
						taskId: "28",
					})
					.expect(200)
			} catch (error) {
				throw error
			} finally {
				await User.deleteOne({ email: "existinguser@example.com" })
				// await Task.deleteOne({ taskId: "28" })
			}
		})
		it("should display a task not found error when task doesn't exist", () => {
			// Make the request to fetch a task
			const res = supertest(app)
				.delete("/api/task/delete")
				.send({ taskId: "999" })
				.expect(404)
		})
	})

	describe("GET /api/task/getAllTasks", () => {
		it("should all of an user's task with a valid input", async () => {
			try {
				const user = new User({
					email: "existinguser@example.com",
					username: "existinguser",
					password: "Existingpassword123",
				})
				await user.save()

				const token = (
					await loginService({
						username: "existinguser",
						password: "Existingpassword123",
					})
				).token

				// Make the request to fetch a task
				const res = await supertest(app)
					.get("/api/task/getAllTasks")
					.send({
						token: token,
					})
					.expect(200)
			} catch (error) {
				throw error
			} finally {
				await User.deleteOne({ email: "existinguser@example.com" })
			}
		})
		it("should throw error when user doesn't exist", async () => {
			const user = new User({
				email: "existinguser@example.com",
				username: "existinguser",
				password: "Existingpassword123",
			})
			await user.save()
			const token = (
				await loginService({
					username: "existinguser",
					password: "Existingpassword123",
				})
			).token
			await User.deleteOne({ email: "existinguser@example.com" })

			// Make the request to fetch a task
			const res = supertest(app)
				.get("/api/task/getAllTasks")
				.send({
					token: token,
				})
				.expect(404)
		})
	})
})
