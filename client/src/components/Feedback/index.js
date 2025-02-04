import React, { useState, useEffect, useRef } from "react"
import Pin from "../Pin"
import PinModal from "../PinModal"

const SELECTED_PIN = {
	id: "current-pin-selected",
	x: 0,
	y: 0,
	feedback: "",
	page: "home",
}

function Feedback({ children }) {
	const [clickCoords, setClickCoords] = useState({ x: null, y: null })
	const [showModal, setShowModal] = useState(false)
	const [feedback, setFeedback] = useState("")
	const [pins, setPins] = useState([])
	const [selectedPin, setSelectedPin] = useState(null)

	const page = "home"
	const containerRef = useRef(null)

	useEffect(() => {
		fetchPins()
	}, [])

	const fetchPins = async () => {
		try {
			const response = await fetch(`/api/pins?page=${page}`)
			if (!response.ok) {
				throw new Error("Failed to fetch pins")
			}
			const data = await response.json()
			setPins(data)
		} catch (error) {
			console.error("Error fetching pins:", error)
		}
	}

	const handleContainerClick = (e) => {
		// Prevent handling clicks if modal is open
		if (showModal) return

		// Do nothing if a link or button is clicked
		if (e.target.closest("a, button")) return

		// Calculate the click coordinates relative to the container.
		const rect = containerRef.current.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top
		setClickCoords({ x, y })
		setSelectedPin(null)
		setFeedback("")
		setShowModal(true)
	}

	// When clicking on an existing pin, open the modal to view its feedback.
	const handlePinClick = (e, pin) => {
		e.stopPropagation()
		setSelectedPin(pin)
		setFeedback(pin.feedback)
		setShowModal(true)
	}

	const handleModalClose = () => {
		setShowModal(false)
		setFeedback("")
		setSelectedPin(null)
		setClickCoords({ x: null, y: null })
	}

	// Save handler for adding a new pin or updating an existing one.
	const handleSaveFeedback = async () => {
		try {
			if (selectedPin) {
				// Update an existing pin.
				const response = await fetch(`/api/pins/${selectedPin.id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ feedback }),
				})
				if (!response.ok) {
					throw new Error("Failed to update pin")
				}
				setPins((prevPins) =>
					prevPins.map((pin) =>
						pin.id === selectedPin.id ? { ...pin, feedback } : pin
					)
				)
			} else {
				// Create a new pin.
				const newPinData = {
					x: clickCoords.x,
					y: clickCoords.y,
					feedback: feedback,
					page: page,
				}
				const response = await fetch("/api/pins", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(newPinData),
				})
				if (!response.ok) {
					throw new Error("Failed to create new pin")
				}
				const newPin = await response.json()
				setPins((prevPins) => [...prevPins, newPin])
			}
			setShowModal(false)
			setFeedback("")
			setSelectedPin(null)
		} catch (error) {
			console.error("Error saving feedback:", error)
		}
	}

	const currentPin = {
		...SELECTED_PIN,
		x: clickCoords.x,
		y: clickCoords.y,
	}

	return (
		<div
			ref={containerRef}
			onClick={handleContainerClick}
			style={{
				position: "relative",
				minHeight: "100vh",
				margin: 0,
				padding: 0,
			}}
		>
			{children}
			{currentPin.x && currentPin.y && (
				<Pin
					key="current-pin-selected"
					pin={currentPin}
					onClick={handlePinClick}
					className="current"
				/>
			)}
			{pins.map((pin) => (
				<Pin key={pin.id} pin={pin} onClick={handlePinClick} />
			))}
			<PinModal
				show={showModal}
				onHide={handleModalClose}
				selectedPin={selectedPin}
				feedback={feedback}
				onFeedbackChange={setFeedback}
				onSave={handleSaveFeedback}
			/>
		</div>
	)
}

export default Feedback
