from queue import PriorityQueue

def printMaze(maze):
    for i in range(len(maze)):
        for j in range(len(maze[0])):
            print(maze[i][j],end=" ")
        print()

def heuristic(a, b):
    (x1, y1), (x2, y2) = a, b
    return abs(x1 - x2) + abs(y1 - y2)

def reconstruct_path(came_from, start, goal):
    current = goal
    path = [current]
    while current != start:
        current = came_from[current]
        path.append(current)
    path.reverse()
    return path

def findStartAndGoal(maze):
    for i, row in enumerate(maze):
        for j, cell in enumerate(row):
            if cell == 'S':
                start = (j, i)
            elif cell == 'G':
                goal = (j, i)
    return start, goal

def find_shortest_path(maze, start, goal):
    queue = PriorityQueue()
    queue.put((0, start)) 
    came_from = {start: None}
    g_score = {start: 0}
    f_score = {start: heuristic(start, goal)}

    while not queue.empty():
        #print(queue.queue)
        current = queue.get()[1]

        if current == goal:
            return reconstruct_path(came_from, start, goal)

        for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            neighbor = (current[0] + dx, current[1] + dy)
            if 0 <= neighbor[0] < len(maze[0]) and 0 <= neighbor[1] < len(maze) and maze[neighbor[0]][neighbor[1]] != '#':
                tentative_g_score = g_score[current] + 1
                if neighbor not in g_score or tentative_g_score < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g_score
                    f_score[neighbor] = tentative_g_score + heuristic(neighbor, goal)
                    queue.put((f_score[neighbor], neighbor))

    return None


maze = [
    ['S', '.', '#', '#', '#', '#', '#', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '#'],
    ['#', '.', '#', '#', '#', '#', '.', '#'],
    ['#', '.', '#', '.', '.', '#', '.', '#'],
    ['#', '.', '#', '.', '.', '#', '.', '#'],
    ['#', '.', '#', '#', '.', '#', '.', '#'],
    ['#', '.', '.', '.', '.', '.', '.', '#'],
    ['#', '#', '#', '#', '#', '#', '#', 'G']
]

start, goal = findStartAndGoal(maze)
path = find_shortest_path(maze, start, goal)
if path:
    printMaze(maze)
    print("Shortest path:", " -> ".join(str(cell) for cell in path))
else:
    printMaze(maze)
    print("No path found.")