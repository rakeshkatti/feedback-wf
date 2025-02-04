import React from "react"
import Feedback from "./components/Feedback"
import "./App.css"

function App() {
	return (
		<Feedback>
			{/* Dummy Website Layout */}
			<header
				style={{ backgroundColor: "#007bff", color: "#fff", padding: "1rem" }}
			>
				<h1>My Dummy Website</h1>
				<nav>
					<a href="#home" style={{ marginRight: "1rem", color: "#fff" }}>
						Home
					</a>
					<a href="#about" style={{ marginRight: "1rem", color: "#fff" }}>
						About
					</a>
					<a href="#contact" style={{ color: "#fff" }}>
						Contact
					</a>
				</nav>
			</header>

			<main style={{ padding: "2rem", height: "calc(100vh - 200px)" }}>
				<h2>Welcome to My Dummy Site</h2>
				<p>
					This is a sample paragraph of text on my dummy website. Click anywhere
					(except on links or buttons) to leave feedback!
				</p>
				<button style={{ padding: "0.5rem 1rem", marginBottom: "1rem" }}>
					Click Me
				</button>
				<p>
					More content can go here. Enjoy browsing and feel free to share your
					feedback by clicking on the page!
				</p>
			</main>

			<footer
				style={{
					backgroundColor: "#f8f9fa",
					padding: "1rem",
					textAlign: "center",
				}}
			>
				<p>&copy; 2025 My Dummy Website. All rights reserved.</p>
				<a href="#privacy">Privacy Policy</a> |{" "}
				<a href="#terms">Terms of Service</a>
			</footer>
		</Feedback>
	)
}

export default App
