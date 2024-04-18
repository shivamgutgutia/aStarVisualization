let customGrid = [];
let startPoint = null;
let endPoint = null;
let blockedCells = new Set();
let selectedHeuristic = "manhattan";

const heuristicSelector = document.getElementById("heuristic");
heuristicSelector.addEventListener("change", function () {
	selectedHeuristic = heuristicSelector.value;
});

const gridHolder = document.getElementById("grid-container");
let mousePressed = false;

gridHolder.addEventListener("mousedown", () => {
	mousePressed = true;
});

gridHolder.addEventListener("mouseup", () => {
	mousePressed = false;
});

function initializeCustomGrid() {
	for (let i = 0; i < 8; i++) {
		customGrid[i] = [];
		for (let j = 0; j < 8; j++) {
			const gridCell = document.createElement("div");
			gridCell.className = "cell";
			gridCell.dataset.row = i;
			gridCell.dataset.col = j;
			gridCell.addEventListener("mouseover", () => {
				if (mousePressed) {
					toggleCell(gridCell);
				}
			});
			gridCell.addEventListener("click", () => {
				toggleCell(gridCell);
			});
			customGrid[i][j] = gridCell;
			gridHolder.appendChild(gridCell);
		}
	}
}

function toggleCell(cell) {
	const row = parseInt(cell.dataset.row);
	const col = parseInt(cell.dataset.col);

	if (cell.classList.contains("start")) {
		cell.classList.remove("start");
		startPoint = null;
	} else if (cell.classList.contains("end")) {
		cell.classList.remove("end");
		endPoint = null;
	} else if (blockedCells.has(cell)) {
		blockedCells.delete(cell);
		cell.classList.remove("obstacle");
	} else {
		if (!startPoint) {
			cell.classList.add("start");
			startPoint = cell;
		} else if (!endPoint) {
			cell.classList.add("end");
			endPoint = cell;
		} else {
			blockedCells.add(cell);
			cell.classList.add("obstacle");
		}
	}
}

async function findPath() {
	if (!startPoint || !endPoint) {
		alert("Please choose start and end points.");
		return;
	}

	const openSet = new Set([startPoint]);
	const cameFromMap = new Map();
	const gScoreMap = new Map();
	const fScoreMap = new Map();

	for (let row = 0; row < 8; row++) {
		for (let col = 0; col < 8; col++) {
			const cell = customGrid[row][col];
			gScoreMap.set(cell, Infinity);
			fScoreMap.set(cell, Infinity);
			cell.textContent = "";
			cell.classList.remove("visited", "path");
		}
	}

	gScoreMap.set(startPoint, 0);
	fScoreMap.set(startPoint, heuristicCost(startPoint, endPoint));
	startPoint.textContent = fScoreMap.get(startPoint);

	while (openSet.size > 0) {
		console.log(openSet);
		let current = null;
		for (const cell of openSet) {
			if (!current || fScoreMap.get(cell) < fScoreMap.get(current)) {
				current = cell;
			}
		}

		if (current === endPoint) {
			await reconstructPath(cameFromMap, endPoint);
			return;
		}

		openSet.delete(current);

		const neighbors = getAdjacentCells(current);
		for (const neighbor of neighbors) {
			const tentativeGScore = gScoreMap.get(current) + 1;
			if (tentativeGScore < gScoreMap.get(neighbor)) {
				cameFromMap.set(neighbor, current);
				gScoreMap.set(neighbor, tentativeGScore);
				fScoreMap.set(
					neighbor,
					tentativeGScore + heuristicCost(neighbor, endPoint)
				);
				openSet.add(neighbor);
				if (!neighbor.classList.contains("end")) {
					neighbor.classList.add("visited");
				}
				neighbor.textContent = parseFloat(
					fScoreMap.get(neighbor).toFixed(2)
				);
			}
		}
		await delay(100);
	}
	alert("No viable path found.");
}

function heuristicCost(cell, end) {
	const rowDifference = Math.abs(cell.dataset.row - end.dataset.row);
	const colDifference = Math.abs(cell.dataset.col - end.dataset.col);
	if (selectedHeuristic === "random") {
		return Math.floor(Math.random() * 8);
	} else if (selectedHeuristic === "manhattan") {
		return rowDifference + colDifference;
	} else if (selectedHeuristic === "euclidean") {
		return parseFloat(
			Math.sqrt(rowDifference ** 2 + colDifference ** 2).toFixed(2)
		);
	}
}

function getAdjacentCells(cell) {
	const neighbors = [];
	const row = parseInt(cell.dataset.row);
	const col = parseInt(cell.dataset.col);
	const directions = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	];
	for (const [dx, dy] of directions) {
		const newRow = row + dx;
		const newCol = col + dy;
		if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
			const neighbor = customGrid[newRow][newCol];
			if (!blockedCells.has(neighbor)) {
				neighbors.push(neighbor);
			}
		}
	}
	return neighbors;
}

async function reconstructPath(cameFrom, current) {
	const path = [current];
	while (cameFrom.has(current)) {
		current = cameFrom.get(current);
		path.unshift(current);
	}

	for (const cell of path) {
		if (
			!cell.classList.contains("start") &&
			!cell.classList.contains("end")
		) {
			cell.classList.add("path");
			await delay(10);
		}
	}
}

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

window.onload = initializeCustomGrid;
