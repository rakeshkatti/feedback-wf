import { Low } from "lowdb"
import { JSONFile } from "lowdb/node"
import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const app = express()
const port = process.env.PORT || 8080

app.use(cors()) // Enable CORS for development (frontend runs on port 3000)
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const file = join(__dirname, "db.json")
const adapter = new JSONFile(file)

// Initialize with default data
const defaultData = { pins: [] }
const db = new Low(adapter, defaultData)

// Initialize the database
const initDb = async () => {
	await db.read()
	await db.write()
}

// Call the initialization
initDb()

/**
 * GET /api/pins
 * Expects: { page }
 */
app.get("/api/pins", async (req, res) => {
	if (!req.query.page) {
		return res.status(400).json({ error: "Page is required" })
	}
	await db.read()
	let pins = db.data.pins.filter((pin) => pin.page === req.query.page)
	res.json(pins)
})

/**
 * POST /api/pins
 * Expects: { x, y, feedback, page }
 * Enforces a maximum of 10 pins per page.
 */
app.post("/api/pins", async (req, res) => {
	const { x, y, feedback, page } = req.body
	if (x === undefined || y === undefined || feedback === undefined || !page) {
		return res
			.status(400)
			.json({ error: "Missing required fields: x, y, feedback, and page" })
	}

	await db.read()

	// Enforce maximum 10 pins per page
	const pinsOnPage = db.data.pins.filter((pin) => pin.page === page)
	if (pinsOnPage.length >= 10) {
		return res
			.status(400)
			.json({ error: "Maximum number of pins reached for this page." })
	}

	const newPin = {
		id: Date.now().toString(),
		x,
		y,
		feedback,
		page,
	}

	db.data.pins.push(newPin)
	await db.write()
	res.status(201).json(newPin)
})

/**
 * PUT /api/pins/:id
 * Expects: { feedback }
 */
app.put("/api/pins/:id", async (req, res) => {
	const pinId = req.params.id
	const { feedback } = req.body

	if (feedback === undefined) {
		return res.status(400).json({ error: "Missing feedback field." })
	}

	await db.read()
	const pin = db.data.pins.find((p) => p.id === pinId)
	if (!pin) {
		return res.status(404).json({ error: "Pin not found" })
	}
	pin.feedback = feedback
	await db.write()
	res.json(pin)
})

app.use(express.static(path.join(__dirname, "../client/build")))
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/build/index.html"))
})

app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})
