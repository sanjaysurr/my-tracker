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