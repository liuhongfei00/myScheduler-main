import mongoose, { Schema, Document } from "mongoose"
import bcrypt from "bcryptjs"

// Define the UI color enum type
export enum UiColor {
	LIGHT = "light",
	DARK = "dark",
}

// Define the language preference enum type
export enum LanguagePref {
	EN = "EN",
	FR = "FR",
}

// Define the Mongoose schema for the User document
const UserSchema: Schema = new Schema({
	email: { type: String, required: true, unique: true }, // email is a required string field and must be unique
	username: { type: String, required: true, unique: true }, // username is a required string field and must be unique
	password: { type: String, required: true }, // password is a required string field
	uiColor: {
		// uiColor is an optional field, defaulting to LIGHT
		type: String,
		enum: Object.values(UiColor),
		default: UiColor.LIGHT,
	},
	languagePref: {
		// languagePref is an optional field, defaulting to EN
		type: String,
		enum: Object.values(LanguagePref),
		default: LanguagePref.EN,
	},
	score: { type: Number, default: 0 }, // score is an optional number field, defaulting to 0
})

UserSchema.pre("save", async function (next) {
	const rounds = 10 // What you want number for round paasword

	const hash = await bcrypt.hash(this.password, rounds)
	this.password = hash
	next()
})

// Compile the User model from the UserSchema and export it
export default mongoose.model("User", UserSchema)
