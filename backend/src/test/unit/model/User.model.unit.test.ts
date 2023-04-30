import { expect } from "chai"
import { describe, it, afterEach, before, after } from "mocha"
import User, { UiColor, LanguagePref } from "../../../server/models/User.model"
import mongoose from "mongoose"

describe("User model", function () {
	before(async () => {
		mongoose.connect("mongodb://localhost:27017/my_scheduler")
	})
	after(async () => {
		await mongoose.connection.close()
	})

	it("should be invalid if username is empty", async () => {
		const user = new User({
			email: "testuser@example.com",
			password: "testpassword",
		})
		try {
			await user.validate()
		} catch (err: any) {
			expect(err.errors.username).to.exist
		}
	})

	it("should be invalid if password is empty", async () => {
		const user = new User({
			email: "testuser@example.com",
			username: "testuser",
		})
		try {
			await user.validate()
		} catch (err: any) {
			expect(err.errors.password).to.exist
		}
	})

	it("should default uiColor to LIGHT if not provided", async () => {
		const user = new User({
			email: "testuser@example.com",
			username: "testuser",
			password: "testpassword",
		})
		await user.validate()
		expect(user.uiColor).to.equal(UiColor.LIGHT)
	})
	it("should default languagePref to EN if not provided", async () => {
		const user = new User({
			email: "testuser@example.com",
			username: "testuser",
			password: "testpassword",
		})
		await user.validate()
		expect(user.languagePref).to.equal(LanguagePref.EN)
	})

	it("should hash password before saving", async () => {
		const user = new User({
			email: "testuser@example.com",
			username: "testuser",
			password: "testpassword",
		})
		await user.save()
		expect(user.password).to.not.equal("testpassword")
		await user.remove()
	})

	it("should allow saving a user with a valid schema", async () => {
		const user = new User({
			email: "testuser@example.com",
			username: "testuser",
			password: "testpassword",
			uiColor: UiColor.DARK,
			languagePref: LanguagePref.FR,
			score: 42,
		})
		await user.save()
		const savedUser = await User.findOne({ email: "testuser@example.com" })
		if (savedUser) {
			expect(savedUser.username).to.equal("testuser")
			expect(savedUser.password).to.not.equal("testpassword")
			expect(savedUser.uiColor).to.equal(UiColor.DARK)
			expect(savedUser.languagePref).to.equal(LanguagePref.FR)
			expect(savedUser.score).to.equal(42)
		}
		await user.remove()
	})
})
