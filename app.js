let tasks = [];
let projects = ["Personal", "Work"];
let darkMode = false;

const content = document.getElementById("content");
const tasksBtn = document.getElementById("tasksBtn");
const projectsBtn = document.getElementById("projectsBtn");
const calendarBtn = document.getElementById("calendarBtn");
const darkModeBtn = document.getElementById("darkModeBtn");

tasksBtn.addEventListener("click", showTasks);
projectsBtn.addEventListener("click", showProjects);
calendarBtn.addEventListener("click", showCalendar);
darkModeBtn.addEventListener("click", toggleDarkMode);
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
function toggleDarkMode() {
  darkMode = !darkMode;
  document.body.classList.toggle("dark-mode");
}

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

function addProject() {
  const name = document.getElementById("newProjectName").value;
  if (name && !projects.includes(name)) {
    projects.push(name);
    showProjects();
  }
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    showTasks();
  }
}

// Initialize the app
showTasks();

function setActiveNavButton(buttonId) {
  document
    .querySelectorAll(".nav-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(buttonId).classList.add("active");
}
