// Import necessary modules and dependencies
import { expect } from "chai"
import { describe, it, beforeEach, afterEach, before, after } from "mocha"
import User from "../../server/models/User.model"
import sinon from "sinon"
import supertest from "supertest"
import app from "../../server/index"
import { loginService } from "../../server/services/User.service"

// Define a test suite for the "POST /api/user/signUp" route
describe("POST /api/user/signUp", () => {
	// Declare a variable to hold a sinon stub for the User.save() method
	let createUserStub

	// Run this function before all tests to sign up an existing user
	before(async () => {
		const user = new User({
			email: "existinguser@example.com",
			username: "existinguser",
			password: "Existingpassword123",
		})
		await user.save()
	})
	// Delete the existing user after all tests
	after(async () => {
		await User.deleteOne({ email: "existinguser@example.com" })
	})
	// Run this function before each test to set up the stub
	beforeEach(() => {
		createUserStub = sinon.stub(User.prototype, "save")
	})

	// Run this function after each test to restore the stub
	afterEach(() => {
		createUserStub.restore()
	})

	// Define a test case for successful signup
	it("should create a new user with valid input", (done) => {
		// Set up variables for user attributes
		const email = "testuser@example.com"
		const username = "testuser"
		const password = "Testpassword123"

		// Set up the mock response from User.save()
		createUserStub.resolves({
			_id: "6140baf2f6d68d6c748fa6e1",
			email,
			username,
			password,
		})

		// Make the request to create a new user
		supertest(app)
			.post("/api/user/signUp")
			.send({ email, username, password })
			.expect(201)
			.end((err, res) => {
				if (err) return done(err)
				expect(res.body).to.have.property("user")
				expect(res.body.user).to.have.property("email", email)
				expect(res.body.user).to.have.property("username", username)
				done()
			})
	})

	// Define a test case for when a user with an existing email tries to sign up
	it("should fail to create a user with an existing email", (done) => {
		// Make a POST request to the sign-up route with the existing username
		supertest(app)
			.post("/api/user/signUp")
			.send({
				email: "existinguser@example.com",
				username: "testuser",
				password: "Testpassword123",
			})
			.expect(400) // Expect the response status code to be 400
			.end((err, res) => {
				// If there's an error, pass it to the done() function to fail the test
				if (err) return done(err)

				// Assert that the response body contains the expected error message
				expect(res.body.error).to.equal("Email or username already exists")
				done()
			})
	})

	// Define a test case for when a user with an existing username tries to sign up
	it("should fail to create a user with an existing username", (done) => {
		// Make a POST request to the sign-up route with the existing email address
		supertest(app)
			.post("/api/user/signUp")
			.send({
				email: "testuser@example.com",
				username: "existinguser",
				password: "Testpassword123",
			})
			.expect(400) // Expect the response status code to be 400
			.end((err, res) => {
				// If there's an error, pass it to the done() function to fail the test
				if (err) return done(err)

				// Assert that the response body contains the expected error message
				expect(res.body.error).to.equal("Email or username already exists")
				done()
			})
	})

	// Define a test case for when a user with an invalid email address tries to sign up
	it("should fail to create a user with an invalid email address", (done) => {
		// Make a POST request to the sign-up route with the invalid password
		supertest(app)
			.post("/api/user/signUp")
			.send({
				email: "invalidemail",
				username: "testuser",
				password: "Testpassword123",
			})
			.expect(400) // Expect the response status code to be 400
			.end((err, res) => {
				// If there's an error, pass it to the done() function to fail the test
				if (err) return done(err)

				// Assert that the response body contains the expected error message
				expect(res.body.error).to.equal("Invalid email address")
				done()
			})
	})

	// Define a test case for when a user with an invalid password tries to sign up
	it("should fail to create a user with an invalid password", (done) => {
		// Make a POST request to the sign-up route with the invalid password
		supertest(app)
			.post("/api/user/signUp")
			.send({
				email: "testuser@example.com",
				username: "testuser",
				password: "invalidpassword",
			})
			.expect(400) // Expect the response status code to be 400
			.end((err, res) => {
				// If there's an error, pass it to the done() function to fail the test
				if (err) return done(err)

				// Assert that the response body contains the expected error message
				expect(res.body.error).to.equal(
					"Password must be at least 7 characters long, contain one uppercase letter, one lowercase letter and one digit"
				)
				done()
			})
	})
})

// Define a test suite for the "POST /api/user/signUp" route
describe("POST /api/user/login", () => {
	// Run this function before all tests to sign up an existing user
	before(async () => {
		const user = new User({
			email: "existinguser@example.com",
			username: "existinguser",
			password: "Existingpassword123",
		})
		await user.save()
	})
	// Delete the existing user after all tests
	after(async () => {
		await User.deleteOne({ email: "existinguser@example.com" })
	})

	it("should successfully login a user with valid inputs", (done) => {
		let username = "existinguser"
		let password = "Existingpassword123"
		supertest(app)
			.post("/api/user/login")
			.send({ username: username, password: password })
			.expect(200)
			.end((err, res) => {
				if (err) return done(err)
				expect(res.body).to.have.property("user")
				expect(res.body.user).to.have.property(
					"email",
					"existinguser@example.com"
				)
				expect(res.body.user).to.have.property("username", username)
				expect(res.body).to.have.property("token")
				done()
			})
	})

	it("should fail to login a user with invalid username", (done) => {
		let username = "wrongusername"
		let password = "Existingpassword123"
		supertest(app)
			.post("/api/user/login")
			.send({ username: username, password: password })
			.expect(400)
			.end((err, res) => {
				if (err) return done(err)
				expect(res.body.error).to.equal("Username or password is incorrect")
				done()
			})
	})

	it("should fail to login a user with invalid password", (done) => {
		let username = "existinguser"
		let password = "Wrongpassword123"
		supertest(app)
			.post("/api/user/login")
			.send({ username: username, password: password })
			.expect(400)
			.end((err, res) => {
				if (err) return done(err)
				expect(res.body.error).to.equal("Username or password is incorrect")
				done()
			})
	})
})

describe("DELETE /api/user/delete", () => {
	it("should successfully delete a user with valid inputs", async () => {
		const user = new User({
			email: "existinguser@example.com",
			username: "existinguser",
			password: "Existingpassword123",
		})
		await user.save()
		let token = (
			await loginService({
				username: "existinguser",
				password: "Existingpassword123",
			})
		).token
		supertest(app)
			.delete("/api/user/delete")
			.send({ token })
			.expect(200)
			.end((err, res) => {
				expect(res.body).to.have.property(
					"message",
					"Account under email existinguser@example.com deleted successfully"
				)
			})
	})
})
