/**
 * Toggles the dark mode state and applies the corresponding CSS class to the body element.
 */
function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark-mode");
}

/** Array to store tasks */
let tasks = [];

/** Array to store project categories */
let projects = ["Personal", "Work"];

/** Boolean to track dark mode state */
let darkMode = false;

/** Main content container element */
const content = document.getElementById("content");

/** Button element for tasks view */
const tasksBtn = document.getElementById("tasksBtn");

/** Button element for projects view */
const projectsBtn = document.getElementById("projectsBtn");

/** Button element for calendar view */
const calendarBtn = document.getElementById("calendarBtn");

/** Button element for toggling dark mode */
const darkModeBtn = document.getElementById("darkModeBtn");

// Event listeners for navigation buttons
tasksBtn.addEventListener("click", showTasks);
projectsBtn.addEventListener("click", showProjects);
calendarBtn.addEventListener("click", showCalendar);
darkModeBtn.addEventListener("click", toggleDarkMode);

/**
 * Displays the tasks view, including incomplete and completed tasks.
 */
function showTasks() {
  setActiveNavButton("tasksBtn");

  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completeTasks = tasks.filter((task) => task.completed);

  content.innerHTML = `
          <h2>Tasks</h2>
          <div class="add-task-form">
              <h3>Add a New Task</h3>
              <form onsubmit="addTask(event)">
                  <input type="text" id="newTaskTitle" placeholder="Task title" required>
                  <input type="date" id="newTaskDate">
                  <select id="newTaskProject">
                      ${projects
                        .map(
                          (project) =>
                            `<option value="${project}">${project}</option>`
                        )
                        .join("")}
                  </select>
                  <button type="submit">Add Task</button>
              </form>
          </div>
          <h3>Incomplete Tasks</h3>
          <ul class="task-list">
              ${incompleteTasks.map((task) => createTaskItem(task)).join("")}
          </ul>
          <h3>Completed Tasks</h3>
          <ul class="task-list complete-list">
              ${completeTasks.map((task) => createTaskItem(task)).join("")}
          </ul>
      `;
}

/**
 * Creates an HTML string for a task item.
 * @param {Object} task - The task object.
 * @returns {string} HTML string representing the task item.
 */
function createTaskItem(task) {
  return `
          <li class="task-item ${task.completed ? "completed" : ""}">
              <input type="checkbox" ${
                task.completed ? "checked" : ""
              } onchange="toggleTask(${task.id})">
              <span class="task-title">${task.title}</span>
              <span class="task-details">${task.project} - ${
    task.date || "No date"
  }</span>
          </li>
      `;
}

/**
 * Adds a new task to the tasks array.
 * @param {Event} event - The form submission event.
 */
function addTask(event) {
  event.preventDefault();
  const title = document.getElementById("newTaskTitle").value;
  const date = document.getElementById("newTaskDate").value;
  const project = document.getElementById("newTaskProject").value;
  if (title) {
    tasks.push({
      id: tasks.length,
      title,
      date,
      project,
      completed: false,
    });
    showTasks();
  }
}

/**
 * Displays the projects view, showing tasks grouped by project.
 */
function showProjects() {
  setActiveNavButton("projectsBtn");
  content.innerHTML = `
        <h2>Projects</h2>
        <ul class="project-list">
            ${projects
              .map(
                (project) => `
                <li class="project-item">
                    ${project}
                    <ul>
                        ${tasks
                          .filter((task) => task.project === project)
                          .map(
                            (task) => `
                          <li class="${task.completed ? "completed" : ""}">${
                              task.title
                            } - ${task.date || "No date"}</li>
                      `
                          )
                          .join("")}
                  </ul>
              </li>
          `
              )
              .join("")}
      </ul>
      <div class="add-form">
          <input type="text" id="newProjectName" placeholder="New project name">
          <button onclick="addProject()">Add Project</button>
      </div>
  `;
}

/**
 * Displays the calendar view, showing tasks grouped by date.
 */
function showCalendar() {
  setActiveNavButton("calendarBtn");

  const tasksByDate = {};
  const today = new Date().toISOString().split("T")[0];

  // Group tasks by date
  tasks.forEach((task) => {
    const date = task.date || "No Date";
    if (!tasksByDate[date]) {
      tasksByDate[date] = [];
    }
    tasksByDate[date].push(task);
  });

  // Sort dates
  const sortedDates = Object.keys(tasksByDate).sort((a, b) => {
    if (a === "No Date") return 1;
    if (b === "No Date") return -1;
    return new Date(a) - new Date(b);
  });

  content.innerHTML = `
      <h2>Calendar View</h2>
      <div class="calendar-view">
          ${sortedDates
            .map(
              (date) => `
              <div class="date-group ${date === today ? "today" : ""}">
                  <h3 class="date-header">${formatDate(date)}</h3>
                  <ul class="task-list">
                      ${tasksByDate[date]
                        .map(
                          (task) => `
                          <li class="task-item ${
                            task.completed ? "completed" : ""
                          }">
                              <input type="checkbox" ${
                                task.completed ? "checked" : ""
                              } onchange="toggleTask(${task.id})">
                              <span class="task-title">${task.title}</span>
                              <span class="task-project">${task.project}</span>
                          </li>
                      `
                        )
                        .join("")}
                  </ul>
              </div>
          `
            )
            .join("")}
      </div>
  `;
}

/**
 * Formats a date string into a more readable format.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 */
function formatDate(dateString) {
  if (dateString === "No Date") return "No Date";
  const date = new Date(dateString);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

/**
 * Generates HTML for a calendar month view.
 * @param {number} month - The month (0-11).
 * @param {number} year - The year.
 * @returns {string} HTML string for the calendar.
 */
function generateCalendarDays(month, year) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  let calendarHTML = `
      <div class="calendar-header">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>
  `;

  let dayCount = 1;
  for (let i = 0; i < 6; i++) {
    calendarHTML += '<div class="calendar-row">';
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDayOfMonth) {
        calendarHTML += '<div class="calendar-day empty"></div>';
      } else if (dayCount > daysInMonth) {
        calendarHTML += '<div class="calendar-day empty"></div>';
      } else {
        const date = `${year}-${(month + 1)
          .toString()
          .padStart(2, "0")}-${dayCount.toString().padStart(2, "0")}`;
        const dayTasks = tasks.filter((task) => task.date === date);
        calendarHTML += `
                  <div class="calendar-day">
                      <div class="day-number">${dayCount}</div>
                      <div class="day-tasks">
                          ${dayTasks
                            .map(
                              (task) => `
                              <div class="calendar-task ${
                                task.completed ? "completed" : ""
                              }" title="${task.title}">
                                  ${task.title.substring(0, 15)}${
                                task.title.length > 15 ? "..." : ""
                              }
                              </div>
                          `
                            )
                            .join("")}
                      </div>
                  </div>
              `;
        dayCount++;
      }
    }
    calendarHTML += "</div>";
    if (dayCount > daysInMonth) break;
  }

  return calendarHTML;
}

/**
 * Returns the name of a month given its index.
 * @param {number} monthIndex - The month index (0-11).
 * @returns {string} The name of the month.
 */
function getMonthName(monthIndex) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthIndex];
}

/**
 * Toggles the dark mode state and updates the UI.
 */
function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark-mode");
}

/**
 * Adds a new task to the tasks array.
 */
function addTask() {
  const title = document.getElementById("newTaskTitle").value;
  const date = document.getElementById("newTaskDate").value;
  const project = document.getElementById("newTaskProject").value;
  if (title) {
    tasks.push({
      id: tasks.length,
      title,
      date,
      project,
      completed: false,
    });
    showTasks();
  }
}

/**
 * Adds a new project to the projects array.
 */
function addProject() {
  const name = document.getElementById("newProjectName").value;
  if (name && !projects.includes(name)) {
    projects.push(name);
    showProjects();
  }
}

/**
 * Toggles the completed state of a task.
 * @param {number} id - The ID of the task to toggle.
 */
function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    showTasks();
  }
}

// Initialize the app
showTasks();

/**
 * Sets the active navigation button.
 * @param {string} buttonId - The ID of the button to set as active.
 */
function setActiveNavButton(buttonId) {
  document
    .querySelectorAll(".nav-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(buttonId).classList.add("active");
}
