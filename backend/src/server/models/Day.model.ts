import mongoose, { Schema, Document } from "mongoose"

// Define the DaySchema using Mongoose Schema
const DaySchema: Schema = new Schema({
	dayId: { type: String, required: true }, // The objectId (dayId)
	hoursWorked: { type: [Number], default: [] }, // The list of hours of work completed is given by the tasks completed on the same day
	tasksWorked: {
		type: [String],
		default: [],
	}, // The list of tasks completed is a reference to the Task model
	userEmail: { type: String, required: true }, // The user who worked on the tasks of the day is a reference to the User model and is required
})

export default mongoose.model("Day", DaySchema)
