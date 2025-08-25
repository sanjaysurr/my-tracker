// Food database
const FOOD_DATABASE = [
    { name: 'Idli (2 pieces)', calories: 78 },
    { name: 'Dosa (1 plain)', calories: 168 },
    { name: 'Masala Dosa', calories: 280 },
    { name: 'Vada (2 pieces)', calories: 185 },
    { name: 'Upma (1 bowl)', calories: 200 },
    { name: 'Pongal (1 bowl)', calories: 250 },
    { name: 'Uttapam (1 piece)', calories: 147 },
    { name: 'Appam (2 pieces)', calories: 120 },
    { name: 'Puttu (1 bowl)', calories: 135 },
    { name: 'Idiyappam (1 bowl)', calories: 158 },
    { name: 'Sambar (1 bowl)', calories: 85 },
    { name: 'Rasam (1 bowl)', calories: 45 },
    { name: 'Coconut Chutney', calories: 65 },
    { name: 'Curd Rice (1 bowl)', calories: 180 },
    { name: 'Lemon Rice (1 bowl)', calories: 220 },
    { name: 'Tamarind Rice (1 bowl)', calories: 240 },
    { name: 'Biryani (1 plate)', calories: 485 },
    { name: 'Chicken Curry (1 bowl)', calories: 245 },
    { name: 'Fish Curry (1 bowl)', calories: 195 },
    { name: 'Dal (1 bowl)', calories: 104 },
    { name: 'Payasam (1 bowl)', calories: 180 },
    { name: 'Banana', calories: 105 },
    { name: 'Coconut Water (1 glass)', calories: 46 },
    { name: 'Filter Coffee', calories: 15 }
];

// Expense categories
const EXPENSE_CATEGORIES = [
    'Food & Dining',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Bills & Utilities',
    'Healthcare',
    'Groceries',
    'Other'
];

// Application state
let foodEntries = [];
let expenseEntries = [];
let studyEntries = [];

// DOM elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const currentDateEl = document.getElementById('currentDate');
const foodSelect = document.getElementById('foodSelect');
const expenseCategorySelect = document.getElementById('expenseCategory');
const foodForm = document.getElementById('foodForm');
const expenseForm = document.getElementById('expenseForm');
const studyForm = document.getElementById('studyForm');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadData();
    updateDisplays();
});

function initializeApp() {
    // Set current date
    const today = new Date();
    currentDateEl.textContent = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Populate food select
    foodSelect.innerHTML = '<option value="">Choose a food...</option>';
    FOOD_DATABASE.forEach(food => {
        const option = document.createElement('option');
        option.value = JSON.stringify(food);
        option.textContent = `${food.name} (${food.calories} cal)`;
        foodSelect.appendChild(option);
    });

    // Populate expense categories
    expenseCategorySelect.innerHTML = '<option value="">Select category...</option>';
    EXPENSE_CATEGORIES.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        expenseCategorySelect.appendChild(option);
    });

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Form submissions
    foodForm.addEventListener('submit', handleFoodSubmit);
    expenseForm.addEventListener('submit', handleExpenseSubmit);
    studyForm.addEventListener('submit', handleStudySubmit);

    // Food select change
    foodSelect.addEventListener('change', handleFoodSelect);
}

function switchTab(tabName) {
    // Update tab buttons
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });

    // Update tab content
    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabName}-tab`) {
            content.classList.add('active');
        }
    });
}

function handleFoodSelect() {
    if (foodSelect.value) {
        const food = JSON.parse(foodSelect.value);
        document.getElementById('customFood').value = food.name;
        document.getElementById('calories').value = food.calories;
    }
}

function handleFoodSubmit(e) {
    e.preventDefault();
    
    const foodName = document.getElementById('customFood').value.trim();
    const calories = parseInt(document.getElementById('calories').value);
    
    if (!foodName || !calories || calories < 0) {
        alert('Please enter a valid food name and calorie amount.');
        return;
    }
    
    const entry = {
        id: Date.now().toString(),
        name: foodName,
        calories: calories,
        time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    foodEntries.push(entry);
    saveData();
    updateDisplays();
    foodForm.reset();
    foodSelect.value = '';
}

function handleExpenseSubmit(e) {
    e.preventDefault();
    
    const description = document.getElementById('expenseDescription').value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;
    
    if (!description || !amount || amount < 0 || !category) {
        alert('Please fill in all fields with valid values.');
        return;
    }
    
    const entry = {
        id: Date.now().toString(),
        description: description,
        amount: amount,
        category: category,
        time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    expenseEntries.push(entry);
    saveData();
    updateDisplays();
    expenseForm.reset();
}

function handleStudySubmit(e) {
    e.preventDefault();
    
    const subject = document.getElementById('studySubject').value.trim();
    const hours = parseFloat(document.getElementById('studyHours').value);
    const minutes = parseInt(document.getElementById('studyMinutes').value) || 0;
    
    if (!subject || !hours || hours < 0 || minutes < 0 || minutes >= 60) {
        alert('Please fill in all fields with valid values.');
        return;
    }
    
    const totalMinutes = (hours * 60) + minutes;
    
    const entry = {
        id: Date.now().toString(),
        subject: subject,
        hours: hours,
        minutes: minutes,
        totalMinutes: totalMinutes,
        time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    studyEntries.push(entry);
    saveData();
    updateDisplays();
    studyForm.reset();
}

function deleteEntry(id, type) {
    if (type === 'food') {
        foodEntries = foodEntries.filter(entry => entry.id !== id);
    } else if (type === 'expense') {
        expenseEntries = expenseEntries.filter(entry => entry.id !== id);
    } else if (type === 'study') {
        studyEntries = studyEntries.filter(entry => entry.id !== id);
    }
    saveData();
    updateDisplays();
}

function updateDisplays() {
    updateFoodDisplay();
    updateExpenseDisplay();
    updateStudyDisplay();
}

function updateFoodDisplay() {
    const totalCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
    const targetCalories = 2000;
    const progress = Math.min((totalCalories / targetCalories) * 100, 100);
    
    document.getElementById('totalCalories').textContent = totalCalories;
    document.getElementById('caloriesProgress').style.width = `${progress}%`;
    
    const entriesContainer = document.getElementById('foodEntries');
    
    if (foodEntries.length === 0) {
        entriesContainer.innerHTML = `
            <div class="empty-state">
                <p>No food entries yet today</p>
                <small>Add your first meal above to start tracking</small>
            </div>
        `;
        return;
    }
    
    entriesContainer.innerHTML = foodEntries.map(entry => `
        <div class="entry-item food-entry">
            <div class="entry-info">
                <h4>${entry.name}</h4>
                <p>Added at ${entry.time}</p>
            </div>
            <div class="entry-meta">
                <div class="entry-value">${entry.calories} cal</div>
                <div class="entry-time">${entry.time}</div>
                <button class="delete-btn" onclick="deleteEntry('${entry.id}', 'food')">
                    ×
                </button>
            </div>
        </div>
    `).join('');
}

function updateExpenseDisplay() {
    const totalExpenses = expenseEntries.reduce((sum, entry) => sum + entry.amount, 0);
    
    document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(2);
    
    const entriesContainer = document.getElementById('expenseEntries');
    
    if (expenseEntries.length === 0) {
        entriesContainer.innerHTML = `
            <div class="empty-state">
                <p>No expenses logged today</p>
                <small>Add your first expense above to start tracking</small>
            </div>
        `;
    } else {
        entriesContainer.innerHTML = expenseEntries.map(entry => `
            <div class="entry-item expense-entry">
                <div class="entry-info">
                    <h4>${entry.description}</h4>
                    <p>${entry.category} • ${entry.time}</p>
                </div>
                <div class="entry-meta">
                    <div class="entry-value">₹${entry.amount.toFixed(2)}</div>
                    <div class="entry-time">${entry.time}</div>
                    <button class="delete-btn" onclick="deleteEntry('${entry.id}', 'expense')">
                        ×
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    updateCategoryBreakdown();
}

function updateCategoryBreakdown() {
    const categoryTotals = {};
    
    expenseEntries.forEach(entry => {
        if (!categoryTotals[entry.category]) {
            categoryTotals[entry.category] = 0;
        }
        categoryTotals[entry.category] += entry.amount;
    });
    
    const breakdownContainer = document.getElementById('categoryBreakdown');
    
    if (Object.keys(categoryTotals).length === 0) {
        breakdownContainer.innerHTML = `
            <div class="empty-state">
                <p>No categories to display</p>
                <small>Add some expenses to see the breakdown</small>
            </div>
        `;
        return;
    }
    
    breakdownContainer.innerHTML = Object.entries(categoryTotals)
        .sort(([,a], [,b]) => b - a)
        .map(([category, amount]) => `
            <div class="category-item">
                <span class="category-name">${category}</span>
                <span class="category-amount">₹${amount.toFixed(2)}</span>
            </div>
        `).join('');
}

function updateStudyDisplay() {
    const totalMinutes = studyEntries.reduce((sum, entry) => sum + entry.totalMinutes, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    const targetMinutes = 2 * 60; // 2 hours target
    const progress = Math.min((totalMinutes / targetMinutes) * 100, 100);
    
    document.getElementById('totalStudyHours').textContent = totalHours;
    document.getElementById('totalStudyMinutes').textContent = remainingMinutes;
    document.getElementById('studyProgress').style.width = `${progress}%`;
    
    const entriesContainer = document.getElementById('studyEntries');
    
    if (studyEntries.length === 0) {
        entriesContainer.innerHTML = `
            <div class="empty-state">
                <p>No study sessions logged today</p>
                <small>Add your first study session above to start tracking</small>
            </div>
        `;
        return;
    }
    
    entriesContainer.innerHTML = studyEntries.map(entry => `
        <div class="entry-item study-entry">
            <div class="entry-info">
                <h4>${entry.subject}</h4>
                <p>Studied at ${entry.time}</p>
            </div>
            <div class="entry-meta">
                <div class="entry-value">${entry.hours}h ${entry.minutes}m</div>
                <div class="entry-time">${entry.time}</div>
                <button class="delete-btn" onclick="deleteEntry('${entry.id}', 'study')">
                    ×
                </button>
            </div>
        </div>
    `).join('');
}

function saveData() {
    const today = new Date().toDateString();
    const data = {
        date: today,
        foodEntries: foodEntries,
        expenseEntries: expenseEntries,
        studyEntries: studyEntries
    };
    localStorage.setItem('trackerData', JSON.stringify(data));
}

function loadData() {
    const today = new Date().toDateString();
    const savedData = localStorage.getItem('trackerData');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        // Only load data if it's from today
        if (data.date === today) {
            foodEntries = data.foodEntries || [];
            expenseEntries = data.expenseEntries || [];
            studyEntries = data.studyEntries || [];
        }
    }
}

// Make deleteEntry function available globally
window.deleteEntry = deleteEntry;

class WorkTimeTracker {
    constructor() {
        // Work schedule configuration
        this.schedule = {
            workStart: '09:30',
            workEnd: '18:30',
            morningBreak: { start: '11:00', end: '11:15' },
            lunchBreak: { start: '13:20', end: '14:00' },
            afternoonBreak: { start: '16:30', end: '16:45' }
        };

        // Task tracking
        this.tasks = JSON.parse(localStorage.getItem('dailyTasks')) || [];
        this.currentTask = null;
        this.taskStartTime = null;

        // Initialize the app
        this.init();
    }

    init() {
        this.updateCurrentTime();
        this.updateStatus();
        this.updateTimeSummary();
        this.updateScheduleDisplay();
        this.setupEventListeners();
        this.displayTaskHistory();

        // Update every second
        setInterval(() => {
            this.updateCurrentTime();
            this.updateStatus();
            this.updateTimeSummary();
            this.updateTaskTimer();
        }, 1000);
    }

    setupEventListeners() {
        const startTaskBtn = document.getElementById('startTaskBtn');
        const stopTaskBtn = document.getElementById('stopTaskBtn');
        const taskInput = document.getElementById('taskInput');

        startTaskBtn.addEventListener('click', () => this.startTask());
        stopTaskBtn.addEventListener('click', () => this.stopTask());
        
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startTask();
            }
        });
    }

    timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = Math.floor(minutes % 60);
        return `${hours}h ${mins}m`;
    }

    getCurrentTime() {
        return new Date();
    }

    getCurrentTimeString() {
        const now = this.getCurrentTime();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }

    updateCurrentTime() {
        const now = this.getCurrentTime();
        const timeStr = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const dateStr = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('currentTime').textContent = `${dateStr} - ${timeStr}`;
    }

    getCurrentStatus() {
        const currentTime = this.getCurrentTimeString();
        const currentMinutes = this.timeToMinutes(currentTime);

        // Check if it's lunch time
        const lunchStart = this.timeToMinutes(this.schedule.lunchBreak.start);
        const lunchEnd = this.timeToMinutes(this.schedule.lunchBreak.end);
        
        if (currentMinutes >= lunchStart && currentMinutes < lunchEnd) {
            return {
                status: 'Lunch Break',
                icon: '🍽️',
                class: 'status-lunch',
                message: 'Enjoy your lunch!'
            };
        }

        // Check morning break
        const morningBreakStart = this.timeToMinutes(this.schedule.morningBreak.start);
        const morningBreakEnd = this.timeToMinutes(this.schedule.morningBreak.end);
        
        if (currentMinutes >= morningBreakStart && currentMinutes < morningBreakEnd) {
            return {
                status: 'Morning Break',
                icon: '☕',
                class: 'status-break',
                message: 'Time for a quick break!'
            };
        }

        // Check afternoon break
        const afternoonBreakStart = this.timeToMinutes(this.schedule.afternoonBreak.start);
        const afternoonBreakEnd = this.timeToMinutes(this.schedule.afternoonBreak.end);
        
        if (currentMinutes >= afternoonBreakStart && currentMinutes < afternoonBreakEnd) {
            return {
                status: 'Afternoon Break',
                icon: '☕',
                class: 'status-break',
                message: 'Take a breather!'
            };
        }

        // Check work hours
        const workStart = this.timeToMinutes(this.schedule.workStart);
        const workEnd = this.timeToMinutes(this.schedule.workEnd);
        
        if (currentMinutes >= workStart && currentMinutes < workEnd) {
            return {
                status: 'Working',
                icon: '💼',
                class: 'status-working',
                message: 'Focus time!'
            };
        }

        return {
            status: 'Off Work',
            icon: '🏠',
            class: 'status-off',
            message: 'Work day is over!'
        };
    }

    updateStatus() {
        const status = this.getCurrentStatus();
        const statusIcon = document.getElementById('statusIcon');
        const statusText = document.getElementById('statusText');
        const statusIndicator = document.getElementById('statusIndicator');

        statusIcon.textContent = status.icon;
        statusText.textContent = status.status;
        
        // Remove all status classes
        statusIndicator.className = 'status-indicator';
        statusIndicator.classList.add(status.class);

        // Update progress bar
        this.updateWorkProgress();
    }

    updateWorkProgress() {
        const currentMinutes = this.timeToMinutes(this.getCurrentTimeString());
        const workStart = this.timeToMinutes(this.schedule.workStart);
        const workEnd = this.timeToMinutes(this.schedule.workEnd);

        let progress = 0;
        let progressText = '';

        if (currentMinutes < workStart) {
            progressText = `Work starts at ${this.schedule.workStart}`;
        } else if (currentMinutes >= workEnd) {
            progress = 100;
            progressText = 'Work day completed!';
        } else {
            const totalWorkMinutes = workEnd - workStart;
            const workedMinutes = currentMinutes - workStart;
            progress = (workedMinutes / totalWorkMinutes) * 100;
            progressText = `${Math.round(progress)}% of work day completed`;
        }

        document.getElementById('workProgress').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = progressText;
    }

    calculateWorkTimes() {
        const currentMinutes = this.timeToMinutes(this.getCurrentTimeString());
        const workStart = this.timeToMinutes(this.schedule.workStart);
        const workEnd = this.timeToMinutes(this.schedule.workEnd);

        // Total work time (excluding breaks)
        const totalWorkTime = (workEnd - workStart) - 70; // 70 minutes total breaks (15+40+15)
        
        // Calculate time worked so far (excluding breaks)
        let timeWorkedSoFar = 0;
        
        if (currentMinutes > workStart) {
            timeWorkedSoFar = Math.min(currentMinutes, workEnd) - workStart;
            
            // Subtract break times if they've passed
            const morningBreakStart = this.timeToMinutes(this.schedule.morningBreak.start);
            const morningBreakEnd = this.timeToMinutes(this.schedule.morningBreak.end);
            const lunchStart = this.timeToMinutes(this.schedule.lunchBreak.start);
            const lunchEnd = this.timeToMinutes(this.schedule.lunchBreak.end);
            const afternoonBreakStart = this.timeToMinutes(this.schedule.afternoonBreak.start);
            const afternoonBreakEnd = this.timeToMinutes(this.schedule.afternoonBreak.end);

            if (currentMinutes > morningBreakEnd) {
                timeWorkedSoFar -= (morningBreakEnd - morningBreakStart);
            } else if (currentMinutes > morningBreakStart) {
                timeWorkedSoFar -= (currentMinutes - morningBreakStart);
            }

            if (currentMinutes > lunchEnd) {
                timeWorkedSoFar -= (lunchEnd - lunchStart);
            } else if (currentMinutes > lunchStart) {
                timeWorkedSoFar -= (currentMinutes - lunchStart);
            }

            if (currentMinutes > afternoonBreakEnd) {
                timeWorkedSoFar -= (afternoonBreakEnd - afternoonBreakStart);
            } else if (currentMinutes > afternoonBreakStart) {
                timeWorkedSoFar -= (currentMinutes - afternoonBreakStart);
            }
        }

        const remainingWorkTime = Math.max(0, totalWorkTime - timeWorkedSoFar);

        return {
            totalWorkTime: totalWorkTime,
            timeWorkedSoFar: Math.max(0, timeWorkedSoFar),
            remainingWorkTime: remainingWorkTime
        };
    }

    updateTimeSummary() {
        const workTimes = this.calculateWorkTimes();
        
        document.getElementById('totalWorkTime').textContent = this.formatDuration(workTimes.totalWorkTime);
        document.getElementById('timeWorkedSoFar').textContent = this.formatDuration(workTimes.timeWorkedSoFar);
        document.getElementById('remainingWorkTime').textContent = this.formatDuration(workTimes.remainingWorkTime);
        
        // Break time is fixed
        document.getElementById('totalBreakTime').textContent = '1h 10m';
    }

    updateScheduleDisplay() {
        const scheduleItems = document.querySelectorAll('.schedule-item');
        const currentMinutes = this.timeToMinutes(this.getCurrentTimeString());

        scheduleItems.forEach(item => {
            const startTime = item.getAttribute('data-start');
            const endTime = item.getAttribute('data-end');
            
            if (startTime && endTime) {
                const startMinutes = this.timeToMinutes(startTime);
                const endMinutes = this.timeToMinutes(endTime);
                
                // Remove current class first
                item.classList.remove('current');
                
                // Add current class if within time range
                if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
                    item.classList.add('current');
                }
            }
        });
    }

    startTask() {
        const taskInput = document.getElementById('taskInput');
        const taskName = taskInput.value.trim();
        
        if (!taskName) {
            alert('Please enter a task name');
            return;
        }

        // Stop current task if any
        if (this.currentTask) {
            this.stopTask();
        }

        // Start new task
        this.currentTask = {
            id: Date.now().toString(),
            name: taskName,
            startTime: new Date(),
            endTime: null,
            duration: 0
        };

        this.taskStartTime = new Date();

        // Update UI
        document.getElementById('activeTaskName').textContent = taskName;
        document.getElementById('activeTaskContainer').style.display = 'block';
        document.getElementById('taskInput').style.display = 'none';
        document.getElementById('startTaskBtn').style.display = 'none';

        // Clear input
        taskInput.value = '';
    }

    stopTask() {
        if (!this.currentTask) return;

        // Calculate duration
        const endTime = new Date();
        const duration = Math.floor((endTime - this.taskStartTime) / 60000); // Duration in minutes
        
        // Complete the task
        this.currentTask.endTime = endTime;
        this.currentTask.duration = duration;

        // Add to tasks array
        this.tasks.push({ ...this.currentTask });
        
        // Save to localStorage
        localStorage.setItem('dailyTasks', JSON.stringify(this.tasks));

        // Reset current task
        this.currentTask = null;
        this.taskStartTime = null;

        // Update UI
        document.getElementById('activeTaskContainer').style.display = 'none';
        document.getElementById('taskInput').style.display = 'block';
        document.getElementById('startTaskBtn').style.display = 'block';

        // Refresh task history
        this.displayTaskHistory();
    }

    updateTaskTimer() {
        if (!this.currentTask || !this.taskStartTime) return;

        const now = new Date();
        const elapsed = Math.floor((now - this.taskStartTime) / 1000); // Elapsed time in seconds
        
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('taskTimer').textContent = timeStr;
    }

    displayTaskHistory() {
        const historyContainer = document.getElementById('taskHistory');
        const totalTasksElement = document.getElementById('totalTasks');
        const totalTaskTimeElement = document.getElementById('totalTaskTime');

        if (this.tasks.length === 0) {
            historyContainer.innerHTML = '<p class="no-tasks">No tasks completed yet today.</p>';
            totalTasksElement.textContent = '0';
            totalTaskTimeElement.textContent = '0h 0m';
            return;
        }

        // Calculate total time
        const totalMinutes = this.tasks.reduce((sum, task) => sum + task.duration, 0);

        // Generate task list HTML
        const tasksHtml = this.tasks.map(task => `
            <div class="task-item">
                <div class="task-details">
                    <div class="name">${task.name}</div>
                    <div class="time-range">
                        ${task.startTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })} - 
                        ${task.endTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
                <div class="task-duration">${this.formatDuration(task.duration)}</div>
            </div>
        `).join('');

        historyContainer.innerHTML = tasksHtml;
        totalTasksElement.textContent = this.tasks.length.toString();
        totalTaskTimeElement.textContent = this.formatDuration(totalMinutes);
    }
}

// Initialize the work tracker when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WorkTimeTracker();
});