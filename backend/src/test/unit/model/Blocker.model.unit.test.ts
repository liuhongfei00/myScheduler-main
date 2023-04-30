import { expect } from "chai"
import Blocker from "../../../server/models/Blocker.model"
import { describe, it, afterEach, before, after } from "mocha"
import mongoose from "mongoose"

describe("Blocker model", () => {
	before(async () => {
		mongoose.connect("mongodb://localhost:27017/my_scheduler")
	})
	after(async () => {
		await mongoose.connection.close()
	})
	it("should be invalid if time is empty", async () => {
		const blocker = new Blocker({
			duration: 60,
			name: "Test Blocker",
			description: "This is a test blocker.",
			user: "user123",
		})
		try {
			await blocker.validate()
		} catch (err: any) {
			expect(err.errors.time).to.exist
		}
	})

	it("should be invalid if duration is empty", async () => {
		const blocker = new Blocker({
			time: "2060-02-13T07:00:00.000Z",
			name: "Test Blocker",
			description: "This is a test blocker.",
			user: "user123",
		})
		try {
			await blocker.validate()
		} catch (err: any) {
			expect(err.errors.duration).to.exist
		}
	})

	it("should be invalid if name is empty", async () => {
		const blocker = new Blocker({
			time: "2060-02-13T07:00:00.000Z",
			duration: 60,
			description: "This is a test blocker.",
			user: "user123",
		})
		try {
			await blocker.validate()
		} catch (err: any) {
			expect(err.errors.name).to.exist
		}
	})

	it("should be invalid if description is empty", async () => {
		const blocker = new Blocker({
			time: "2060-02-13T07:00:00.000Z",
			duration: 60,
			name: "Test Blocker",
			user: "user123",
		})
		try {
			await blocker.validate()
		} catch (err: any) {
			expect(err.errors.description).to.exist
		}
	})

	it("should be invalid if user is empty", async () => {
		const blocker = new Blocker({
			time: "2060-02-13T07:00:00.000Z",
			duration: 60,
			name: "Test Blocker",
			description: "This is a test blocker.",
		})
		try {
			await blocker.validate()
		} catch (err: any) {
			expect(err.errors.user).to.exist
		}
	})

	it("should allow saving a blocker with a valid schema", async () => {
		const userId = new mongoose.Types.ObjectId()
		const blocker = new Blocker({
			time: "2060-02-13T07:00:00.000Z",
			duration: 60,
			name: "Test Blocker",
			description: "This is a test blocker.",
			user: userId,
		})
		await blocker.save()
		const savedBlocker = await Blocker.findOne({
			time: "2060-02-13T07:00:00.000Z",
		})
		if (savedBlocker) {
			expect(savedBlocker.time.getTime).to.equal(blocker.time.getTime)
			expect(savedBlocker.duration).to.equal(blocker.duration)
			expect(savedBlocker.name).to.equal(blocker.name)
			expect(savedBlocker.description).to.equal(blocker.description)
			expect(savedBlocker.user.userId).to.equal(blocker.user.userId)
		}
		await blocker.remove()
	})
})
