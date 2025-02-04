import React from "react"
import "./index.css"

const Pin = ({ pin, onClick, className }) => {
	return (
		<div
			className={`pin ${className}`}
			style={{
				position: "absolute",
				top: pin.y,
				left: pin.x,
				cursor: "pointer",
			}}
			onClick={(e) => onClick(e, pin)}
		>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
			</svg>
		</div>
	)
}

export default Pin
