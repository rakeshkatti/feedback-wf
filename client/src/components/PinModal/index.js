import React, { useState } from "react"
import { Modal, Button, Form } from "react-bootstrap"

const PinModal = ({
	show,
	onHide,
	selectedPin,
	feedback,
	onFeedbackChange,
	onSave,
}) => {
	const [isEditing, setIsEditing] = useState(false)
	const isViewMode = Boolean(selectedPin) && !isEditing

	const handleEditClick = () => {
		setIsEditing(true)
	}

	const handleSave = () => {
		onSave()
		setIsEditing(false)
	}

	const handleClose = () => {
		setIsEditing(false)
		onHide()
	}

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Feedback Form</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{isViewMode ? (
					<div className="d-flex justify-content-between">
						<p>{feedback}</p>
					</div>
				) : (
					<Form>
						<Form.Group>
							<Form.Label>Feedback</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								value={feedback}
								onChange={(e) => onFeedbackChange(e.target.value)}
								placeholder="Enter your feedback here..."
							/>
						</Form.Group>
					</Form>
				)}
			</Modal.Body>
			<Modal.Footer>
				{isViewMode ? (
					<>
						<Button variant="tertiary" onClick={handleEditClick}>
							Edit
						</Button>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
					</>
				) : (
					<>
						<Button variant="secondary" onClick={handleClose}>
							Cancel
						</Button>
						<Button variant="primary" onClick={handleSave}>
							Save
						</Button>
					</>
				)}
			</Modal.Footer>
		</Modal>
	)
}

export default PinModal
