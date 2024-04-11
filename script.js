// Constants for grid dimensions
const GRID_WIDTH = 8;
const GRID_HEIGHT = 8;

// Global variables
let grid = [];
let startCell = null;
let endCell = null;
let obstacles = new Set();
let heuristic = "manhattan";

// Initialize grid
function initializeGrid() {
	const gridContainer = document.getElementById("grid-container");
	for (let i = 0; i < GRID_HEIGHT; i++) {
		grid[i] = [];
		for (let j = 0; j < GRID_WIDTH; j++) {
			const cell = document.createElement("div");
			cell.className = "cell";
			cell.dataset.row = i;
			cell.dataset.col = j;
			cell.addEventListener("click", () => toggleCell(cell));
			grid[i][j] = cell;
			gridContainer.appendChild(cell);
		}
	}
}

// Toggle cell between start, end, and obstacle states
function toggleCell(cell) {
	const row = parseInt(cell.dataset.row);
	const col = parseInt(cell.dataset.col);

	if (cell.classList.contains("start")) {
		cell.classList.remove("start");
		startCell = null;
	} else if (cell.classList.contains("end")) {
		cell.classList.remove("end");
		endCell = null;
	} else if (obstacles.has(cell)) {
		obstacles.delete(cell);
		cell.classList.remove("obstacle");
	} else {
		if (!startCell) {
			cell.classList.add("start");
			startCell = cell;
		} else if (!endCell) {
			cell.classList.add("end");
			endCell = cell;
		} else {
			obstacles.add(cell);
			cell.classList.add("obstacle");
		}
	}
}

// Find shortest path using A* algorithm
// Find shortest path using A* algorithm
// Find shortest path using A* algorithm
async function findShortestPath() {
	if (!startCell || !endCell) {
		alert("Please select start and end cells.");
		return;
	}

	// A* algorithm implementation
	const openSet = new Set([startCell]);
	const cameFrom = new Map();
	const gScore = new Map();
	const fScore = new Map();

	for (let row = 0; row < GRID_HEIGHT; row++) {
		for (let col = 0; col < GRID_WIDTH; col++) {
			const cell = grid[row][col];
			gScore.set(cell, Infinity);
			fScore.set(cell, Infinity);
		}
	}

	gScore.set(startCell, 0);
	fScore.set(startCell, heuristicCostEstimate(startCell, endCell));

	while (openSet.size > 0) {
		let current = null;
		for (const cell of openSet) {
			if (!current || fScore.get(cell) < fScore.get(current)) {
				current = cell;
			}
		}

		if (current === endCell) {
			reconstructPath(cameFrom, endCell);
			return;
		}

		openSet.delete(current);

		const neighbors = getNeighbors(current);
		for (const neighbor of neighbors) {
			const tentativeGScore = gScore.get(current) + 1; // Assuming each step has a cost of 1
			if (tentativeGScore < gScore.get(neighbor)) {
				cameFrom.set(neighbor, current);
				gScore.set(neighbor, tentativeGScore);
				fScore.set(
					neighbor,
					tentativeGScore + heuristicCostEstimate(neighbor, endCell)
				);
				openSet.add(neighbor);
				if (!neighbor.classList.contains("end")) {
					neighbor.classList.add("visited"); // Add visited class to the neighbor cell
				}
			}
		}

		// Delay for visualization
		await delay(100); // Adjust delay time (in milliseconds) as needed
	}

	alert("No path found.");
}

// Heuristic function (Manhattan or Euclidean)
function heuristicCostEstimate(cell, endCell) {
	const rowDiff = Math.abs(cell.dataset.row - endCell.dataset.row);
	const colDiff = Math.abs(cell.dataset.col - endCell.dataset.col);
	if (heuristic === "manhattan") {
		return rowDiff + colDiff;
	} else if (heuristic === "euclidean") {
		return Math.sqrt(rowDiff ** 2 + colDiff ** 2);
	}
}

// Get neighboring cells of a given cell
function getNeighbors(cell) {
	const neighbors = [];
	const row = parseInt(cell.dataset.row);
	const col = parseInt(cell.dataset.col);
	const directions = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	]; // Up, down, left, right

	for (const [dx, dy] of directions) {
		const newRow = row + dx;
		const newCol = col + dy;
		if (
			newRow >= 0 &&
			newRow < GRID_HEIGHT &&
			newCol >= 0 &&
			newCol < GRID_WIDTH
		) {
			const neighbor = grid[newRow][newCol];
			if (!obstacles.has(neighbor)) {
				neighbors.push(neighbor);
			}
		}
	}

	return neighbors;
}

// Reconstruct path from start cell to end cell
async function reconstructPath(cameFrom, current) {
	const path = [current];
	while (cameFrom.has(current)) {
		current = cameFrom.get(current);
		path.unshift(current);
	}

	// Visualize path
	for (const cell of path) {
		if (
			!cell.classList.contains("start") &&
			!cell.classList.contains("end")
		) {
			cell.classList.add("path");
			await delay(100);
		}
	}
}

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Initialize grid when the page loads
window.onload = initializeGrid;
