// JavaScript code to handle the form submission and task list functionality
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const filterByPriorityButton = document.getElementById("filterByPriority");
const filterOption = document.getElementById("priorityFilter");
const clearTasksBtn = document.getElementById("clearTasksBtn");
const countB = document.getElementById("countBox");
const countElement = document.getElementById("countElement");
const countElementHigh = document.getElementById("countElementHigh");
const countElementMedium = document.getElementById("countElementMedium");
const countElementLow = document.getElementById("countElementLow");
const alertContainer = document.getElementById("alert");

let tasks = [];

// Function to display a Bootstrap alert
function displayAlert(message, type) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.setAttribute("role", "alert");
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  alertContainer.appendChild(alert);
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskInput = document.getElementById("task");
  const deadlineInput = document.getElementById("deadline");
  const prioritySelect = document.getElementById("priority");
  const labelInput = document.getElementById("label");

  const task = taskInput.value;
  const deadline = deadlineInput.value;
  const priority = prioritySelect.value;
  const label = labelInput.value;

  const taskObj = {
    task: task,
    deadline: deadline,
    priority: priority,
    label: label,
  };
  tasks.push(taskObj);
  showAlert("New task added!", "success");
  sortTasks();
  const taskItem = document.createElement("li");
  taskItem.dataset.id = taskObj.id;
  taskItem.innerHTML = `
    <div class="task-item ${priority}">
      <span class="task-name">${task}</span>
      <span class="task-details">
        <strong>Deadline:</strong> ${deadline} |
        <strong>Priority:</strong> ${priority} |
        <strong>Label:</strong> ${label}
      </span>
      <button class="delete-button" onclick="deleteTask(event)"><i class="fa fa-trash-o"></i>&nbspDelete</button>
    </div>
  `;

  taskList.appendChild(taskItem);

  // Save the tasks to localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskInput.value = "";
  deadlineInput.value = getCurrentDate();
  prioritySelect.value = "high";
  labelInput.value = "";

  // displayAlert("Task added successfully!", "success");

  updateCountBox();
  updateTaskCount();
  updateCountText();
  updateClearTasksButtonVisibility();
  updateFilterButtonVisibility();
});

function sortTasks() {
  // Sort the tasks by date and priority
  tasks.sort(function (a, b) {
    const dateA = new Date(a.deadline);
    const dateB = new Date(b.deadline);

    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;

    const priorityA = convertPriorityToNumber(a.priority);
    const priorityB = convertPriorityToNumber(b.priority);

    return priorityB - priorityA;
  });
}

function showAlert(message, type) {
  const alertElement = document.getElementById("alert");
  alertElement.innerHTML = message;
  alertElement.classList.add(`alert-${type}`);
  alertElement.style.display = "block";
  setTimeout(() => {
    alertElement.style.display = "none";
    alertElement.classList.remove(`alert-${type}`);
  }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
  // Get the date input element
  var dateInput = document.getElementById("deadline");

  // Create a new Date object for the current date
  var currentDate = new Date();

  // Get the current date in the format YYYY-MM-DD
  var formattedDate = currentDate.toISOString().split("T")[0];

  // Set the default value of the date input to the current date
  dateInput.value = formattedDate;

  // Load saved tasks from localStorage
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Create and display task items for each saved task
  tasks.forEach(function (taskObj) {
    
    const { task, deadline, priority, label } = taskObj;

    const taskItem = document.createElement("li");
    taskItem.innerHTML = `
    
    <div class="task-item ${priority}">
        <span class="task-name">${task}</span>
        <span class="task-details">
          <strong>Deadline:</strong> ${deadline} |
          <strong>Priority:</strong> ${priority} |
          <strong>Label:</strong> ${label}
        </span>
        <button class="delete-button" onclick="deleteTask(event)"><i class="fa fa-trash-o"></i>&nbspDelete</button>
      </div>
    `;
 
    taskList.appendChild(taskItem);
  });

  updateTaskCount();
  countBoxDisplay();
  updateTaskListDisplay();

  updateCountText();
  updateCountBox();

  updateClearTasksButtonVisibility();
  updateFilterButtonVisibility();
});

clearTasksBtn.addEventListener("click", function () {
  taskList.innerHTML = "";
  tasks = [];

  // Save the tasks to localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  updateCountBox();
  updateClearTasksButtonVisibility();
  updateFilterButtonVisibility();
  updateTaskCount();
});

document
  .getElementById("filterByPriority")
  .addEventListener("click", function () {
    const priorityFilter = document.getElementById("priorityFilter").value;

    if (priorityFilter === "all") {
      // If "All" is selected, display all tasks without filtering
      countBoxDisplay();
      updateTaskListDisplay();
      updateCountText();
      updateClearTasksButtonVisibility();
    } else {
      countElement.style.display = "none";
      countB.style.justifyContent = "center";
      if (priorityFilter === "high") {
        countElementHigh.style.display = "flex";
        countElementMedium.style.display = "none";
        countElementLow.style.display = "none";
      } else if (priorityFilter === "medium") {
        countElementHigh.style.display = "none";
        countElementMedium.style.display = "flex";
        countElementLow.style.display = "none";
      } else if (priorityFilter === "low") {
        countElementHigh.style.display = "none";
        countElementMedium.style.display = "none";
        countElementLow.style.display = "flex";
      }

      // Filter tasks based on the selected priority
      const filteredTasks = tasks.filter(function (taskObj) {
        return taskObj.priority === priorityFilter;
      });

      // Sort the filtered tasks by priority
      filteredTasks.sort(function (a, b) {
        const priorityA = convertPriorityToNumber(a.priority);
        const priorityB = convertPriorityToNumber(b.priority);

        return priorityA - priorityB;
      });

      // Update the task list with the filtered and sorted tasks

      updateTaskListDisplay(filteredTasks);
      updateCountText();
      updateClearTasksButtonVisibility();
    }
  });

function deleteTask(event) {
  const taskItem = event.target.parentElement.parentElement;
  const taskIndex = Array.from(taskList.children).indexOf(taskItem);
  taskList.removeChild(taskItem);
  tasks.splice(taskIndex, 1);

  showAlert("Task deleted!", "danger");
  // Save the tasks to localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  updateCountBox();
  updateTaskCount();
  updateCountText();
  updateClearTasksButtonVisibility();
  // updateFilterButtonVisibility();
}

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function countBoxDisplay() {
  countB.style.display = "flex";
  countB.style.justifyContent = "space-evenly";
  countElement.style.display = "block";
  countElementHigh.style.display = "flex";
  countElementHigh.style.borderBottom = "5px solid #ff0000";
  countElementHigh.style.padding = "5px 10px";
  countElementMedium.style.display = "flex";
  countElementMedium.style.borderBottom = "5px solid #ffd700";
  countElementMedium.style.padding = "5px 10px";
  countElementLow.style.display = "flex";
  countElementLow.style.borderBottom = "5px solid #008000";
  countElementLow.style.padding = "5px 10px";
}

function updateClearTasksButtonVisibility() {
  if (taskList.children.length > 1) {
    clearTasksBtn.style.display = "block";
  } else {
    clearTasksBtn.style.display = "none";
  }
}

function updateFilterButtonVisibility() {
  if (taskList.children.length > 1) {
    filterButtons.style.display = "block";
  } else {
    filterButtons.style.display = "none";
  }
}

function updateCountBox() {
  if (taskList.children.length > 1) {
    countB.style.display = "flex";
  } else {
    countB.style.display = "none";
  }
}

function updateTaskCount() {
  const taskCountElement = document.getElementById("taskCount");
  let tasksCount = tasks.length;
  taskCountElement.textContent = "Tasks : " + tasksCount; // Update the task count text
  console.log("lenght of tasks : " + tasksCount);
}

function updateCountText() {
  // Count variables for each priority
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  // Count the number of tasks for each priority
  tasks.forEach(function (task) {
    if (task.priority === "high") {
      highCount++;
    } else if (task.priority === "medium") {
      mediumCount++;
    } else if (task.priority === "low") {
      lowCount++;
    }
  });

  // Update the count text for each priority
  const countElementHigh = document.getElementById("countElementHigh");
  countElementHigh.textContent = `High Priority Task: ${highCount}`;

  const countElementMedium = document.getElementById("countElementMedium");
  countElementMedium.textContent = `Medium Priority Task: ${mediumCount}`;

  const countElementLow = document.getElementById("countElementLow");
  countElementLow.textContent = `Low Priority Task: ${lowCount}`;
}

function convertPriorityToNumber(priority) {
  switch (priority) {
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    default:
      return 0;
  }
}

function updateTaskListDisplay(updatedTasks = tasks) {
  taskList.innerHTML = "";

  updatedTasks.forEach(function (taskObj) {
    const { task, deadline, priority, label } = taskObj;

    const taskItem = document.createElement("li");
    taskItem.innerHTML = `
        <div class="task-item ${priority}">
          <span class="task-name">${task}</span>
          <span class="task-details">
            <strong>Deadline:</strong> ${deadline} |
            <strong>Priority:</strong> ${priority} |
            <strong>Label:</strong> ${label}
          </span>
          <button class="delete-button" onclick="deleteTask(event)"><i class="fa fa-trash-o"></i>&nbspDelete</button>
        </div>
      `;

    taskList.appendChild(taskItem);
  });
}
