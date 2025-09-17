/**
 * DevKanban v2.1.0 - High Performance Developer Kanban Board
 * Optimized for 60fps animations and responsive interactions
 * Fixed: Task creation and drag-and-drop functionality
 */

(function() {
    'use strict';

    // Sample data from application_data_json
    const SAMPLE_TASKS = [
        {
            "id": "task_001",
            "title": "implement_user_auth()",
            "description": "// TODO: Add JWT token authentication\n// - Set up middleware\n// - Create login/logout endpoints\n// - Handle token refresh",
            "status": "todo",
            "createdAt": "2025-09-17T02:25:00.000Z",
            "priority": "high",
            "tags": ["backend", "security"]
        },
        {
            "id": "task_002",
            "title": "refactor_api_endpoints",
            "description": "/* Optimize REST API performance */\nconst optimizations = {\n  caching: 'redis',\n  pagination: 'cursor-based',\n  compression: 'gzip'\n};",
            "status": "inprogress",
            "createdAt": "2025-09-16T18:30:00.000Z",
            "priority": "medium",
            "tags": ["api", "performance"]
        },
        {
            "id": "task_003",
            "title": "unit_tests_coverage++;",
            "description": "# Testing Checklist\n- [x] Component tests\n- [x] Integration tests  \n- [x] E2E tests\n- [x] 95% coverage achieved ✅",
            "status": "done",
            "createdAt": "2025-09-15T14:15:00.000Z",
            "priority": "high",
            "tags": ["testing", "quality"]
        }
    ];

    /**
     * Performance Monitoring Module
     */
    const PerformanceMonitor = (function() {
        let frameCount = 0;
        let lastTime = performance.now();
        let fps = 60;
        let renderTimes = [];

        function updateFPS() {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                
                const fpsCounter = document.getElementById('fpsCounter');
                if (fpsCounter) {
                    fpsCounter.textContent = fps;
                    fpsCounter.style.color = fps >= 50 ? '#3fb950' : fps >= 30 ? '#d29922' : '#f85149';
                }
            }
            
            requestAnimationFrame(updateFPS);
        }

        function trackRenderTime(startTime) {
            const endTime = performance.now();
            const renderTime = Math.round(endTime - startTime);
            renderTimes.push(renderTime);
            
            if (renderTimes.length > 10) {
                renderTimes.shift();
            }
            
            const avgRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
            const renderTimeElement = document.getElementById('renderTime');
            if (renderTimeElement) {
                renderTimeElement.textContent = `${Math.round(avgRenderTime)}ms`;
            }
        }

        function initialize() {
            requestAnimationFrame(updateFPS);
        }

        return {
            initialize,
            trackRenderTime
        };
    })();

    /**
     * Boot Sequence Module
     */
    const BootSequence = (function() {
        function animateBootLines() {
            const bootLines = document.querySelectorAll('.boot-line');
            
            bootLines.forEach((line, index) => {
                const delay = parseInt(line.dataset.delay) || (index * 200);
                
                setTimeout(() => {
                    line.style.animationDelay = '0ms';
                    line.classList.add('animate');
                }, delay);
            });
        }

        function animateProgressBar() {
            const progressFill = document.querySelector('.progress-fill');
            const progressPercent = document.getElementById('progressPercent');
            let progress = 0;
            
            const progressInterval = setInterval(() => {
                progress += Math.random() * 15 + 5;
                if (progress > 100) progress = 100;
                
                if (progressFill) progressFill.style.width = `${progress}%`;
                if (progressPercent) progressPercent.textContent = Math.round(progress);
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(hideBootSequence, 500);
                }
            }, 100);
        }

        function hideBootSequence() {
            const bootSequence = document.getElementById('bootSequence');
            const mainApp = document.getElementById('mainApp');
            
            if (bootSequence) {
                bootSequence.classList.add('hidden');
            }
            
            setTimeout(() => {
                if (mainApp) {
                    mainApp.classList.remove('hidden');
                }
                // Initialize main app after showing it
                App.initializeMainApp();
            }, 500);
        }

        function initialize() {
            setTimeout(() => {
                animateBootLines();
                setTimeout(animateProgressBar, 2500);
            }, 100);
        }

        return {
            initialize
        };
    })();

    /**
     * Storage Module
     */
    const Storage = (function() {
        const STORAGE_KEY = 'devkanban_tasks_v2';

        function saveData(key, data) {
            try {
                const jsonData = JSON.stringify(data);
                localStorage.setItem(key, jsonData);
                return true;
            } catch (error) {
                console.error('Storage save failed:', error);
                return false;
            }
        }

        function loadData(key) {
            try {
                const jsonData = localStorage.getItem(key);
                return jsonData ? JSON.parse(jsonData) : null;
            } catch (error) {
                console.error('Storage load failed:', error);
                return null;
            }
        }

        function saveTasks(tasks) {
            return saveData(STORAGE_KEY, tasks);
        }

        function loadTasks() {
            const tasks = loadData(STORAGE_KEY);
            return tasks || [...SAMPLE_TASKS];
        }

        return {
            saveTasks,
            loadTasks
        };
    })();

    /**
     * Task Manager Module
     */
    const TaskManager = (function() {
        let tasks = [];
        let taskMap = new Map();

        function generateTaskId() {
            return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }

        function createTask(title, description) {
            const task = {
                id: generateTaskId(),
                title: title.trim(),
                description: description.trim(),
                status: 'todo',
                createdAt: new Date().toISOString(),
                priority: 'medium',
                tags: []
            };
            
            // Auto-detect priority from title/description
            const content = (title + ' ' + description).toLowerCase();
            if (content.includes('urgent') || content.includes('critical') || content.includes('bug')) {
                task.priority = 'high';
            } else if (content.includes('minor') || content.includes('cleanup') || content.includes('refactor')) {
                task.priority = 'low';
            }
            
            // Auto-detect tags
            const tagPatterns = {
                'frontend': /frontend|ui|css|html|react|vue|angular/i,
                'backend': /backend|api|server|database|node/i,
                'testing': /test|spec|coverage|qa/i,
                'security': /auth|security|login|jwt|token/i,
                'performance': /optimize|performance|speed|cache/i,
                'bug': /bug|fix|error|issue/i
            };
            
            Object.entries(tagPatterns).forEach(([tag, pattern]) => {
                if (pattern.test(content)) {
                    task.tags.push(tag);
                }
            });
            
            return task;
        }

        function addTask(title, description) {
            const task = createTask(title, description);
            tasks.push(task);
            taskMap.set(task.id, task);
            Storage.saveTasks(tasks);
            return task;
        }

        function removeTask(taskId) {
            const initialLength = tasks.length;
            tasks = tasks.filter(task => task.id !== taskId);
            taskMap.delete(taskId);
            
            const success = tasks.length < initialLength;
            if (success) {
                Storage.saveTasks(tasks);
            }
            return success;
        }

        function updateTaskStatus(taskId, newStatus) {
            const task = taskMap.get(taskId);
            if (task) {
                task.status = newStatus;
                Storage.saveTasks(tasks);
                return true;
            }
            return false;
        }

        function getAllTasks() {
            return [...tasks];
        }

        function getTasksByStatus(status) {
            return tasks.filter(task => task.status === status);
        }

        function loadTasks() {
            tasks = Storage.loadTasks();
            taskMap.clear();
            tasks.forEach(task => taskMap.set(task.id, task));
        }

        function getTaskCount() {
            return tasks.length;
        }

        return {
            addTask,
            removeTask,
            updateTaskStatus,
            getAllTasks,
            getTasksByStatus,
            loadTasks,
            getTaskCount
        };
    })();

    /**
     * Enhanced Drag and Drop Module
     */
    const DragDrop = (function() {
        let draggedTask = null;
        let draggedElement = null;
        let dragStartTime = 0;

        function handleDragStart(e) {
            draggedElement = e.target.closest('.task-card');
            if (!draggedElement) return;

            dragStartTime = performance.now();
            draggedTask = draggedElement.dataset.taskId;
            draggedElement.classList.add('dragging');
            
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', draggedTask);
            
            console.log('Drag started for task:', draggedTask);
        }

        function handleDragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }

        function handleDragEnter(e) {
            e.preventDefault();
            const columnContent = e.target.closest('.column-content');
            if (columnContent && draggedTask) {
                columnContent.classList.add('drag-over');
            }
        }

        function handleDragLeave(e) {
            const columnContent = e.target.closest('.column-content');
            if (columnContent && !columnContent.contains(e.relatedTarget)) {
                columnContent.classList.remove('drag-over');
            }
        }

        function handleDrop(e) {
            e.preventDefault();
            
            const columnContent = e.target.closest('.column-content');
            if (!columnContent || !draggedTask) return;

            const newStatus = columnContent.dataset.column;
            const taskId = e.dataTransfer.getData('text/plain');
            
            console.log('Dropping task:', taskId, 'in column:', newStatus);
            
            const success = TaskManager.updateTaskStatus(taskId, newStatus);
            
            if (success) {
                UI.renderTasks();
                UI.updateTaskCounts();
                UI.showNotification('Task moved successfully');
            }

            cleanupDragState();
        }

        function handleDragEnd(e) {
            cleanupDragState();
        }

        function cleanupDragState() {
            if (draggedElement) {
                draggedElement.classList.remove('dragging');
            }
            
            document.querySelectorAll('.column-content').forEach(column => {
                column.classList.remove('drag-over');
            });
            
            draggedTask = null;
            draggedElement = null;
        }

        function makeTaskDraggable(taskCard) {
            taskCard.setAttribute('draggable', 'true');
            taskCard.addEventListener('dragstart', handleDragStart);
            taskCard.addEventListener('dragend', handleDragEnd);
        }

        function makeColumnDroppable(columnContent) {
            columnContent.addEventListener('dragover', handleDragOver);
            columnContent.addEventListener('dragenter', handleDragEnter);
            columnContent.addEventListener('dragleave', handleDragLeave);
            columnContent.addEventListener('drop', handleDrop);
        }

        function initialize() {
            console.log('Initializing drag and drop...');
            document.querySelectorAll('.column-content').forEach(column => {
                makeColumnDroppable(column);
                console.log('Made column droppable:', column.dataset.column);
            });
        }

        function reinitialize() {
            document.querySelectorAll('.task-card').forEach(taskCard => {
                if (!taskCard.hasAttribute('draggable')) {
                    makeTaskDraggable(taskCard);
                }
            });
        }

        return {
            initialize,
            reinitialize,
            makeTaskDraggable
        };
    })();

    /**
     * UI Module
     */
    const UI = (function() {

        function createTaskCard(task) {
            const startTime = performance.now();
            
            const template = document.getElementById('taskTemplate');
            if (!template) {
                console.error('Task template not found');
                return null;
            }
            
            const taskCard = template.content.cloneNode(true).querySelector('.task-card');
            
            // Set task data
            taskCard.dataset.taskId = task.id;
            
            // Populate task header
            const taskId = taskCard.querySelector('.task-id');
            if (taskId) {
                taskId.textContent = `#${task.id.slice(-6)}`;
            }
            
            // Status indicator color
            const statusIndicator = taskCard.querySelector('.task-status-indicator');
            if (statusIndicator) {
                const statusColors = {
                    'todo': '#f85149',
                    'inprogress': '#d29922',
                    'done': '#3fb950'
                };
                statusIndicator.style.background = statusColors[task.status] || '#8b949e';
            }
            
            // Populate content
            const titleElement = taskCard.querySelector('.task-title');
            const codeElement = taskCard.querySelector('.code-block code');
            const tagsContainer = taskCard.querySelector('.task-tags');
            const dateElement = taskCard.querySelector('.task-date');
            const priorityElement = taskCard.querySelector('.task-priority');
            
            if (titleElement) {
                titleElement.textContent = task.title;
            }
            
            if (task.description && codeElement) {
                codeElement.textContent = task.description;
            } else if (taskCard.querySelector('.task-description')) {
                taskCard.querySelector('.task-description').style.display = 'none';
            }
            
            // Add tags
            if (task.tags && task.tags.length > 0 && tagsContainer) {
                task.tags.forEach(tag => {
                    const tagElement = document.createElement('span');
                    tagElement.className = 'task-tag';
                    tagElement.textContent = tag;
                    tagsContainer.appendChild(tagElement);
                });
            }
            
            if (dateElement) {
                dateElement.textContent = formatDate(task.createdAt);
            }
            
            if (task.priority && priorityElement) {
                priorityElement.textContent = task.priority;
                priorityElement.className = `task-priority ${task.priority}`;
            }
            
            // Make draggable
            DragDrop.makeTaskDraggable(taskCard);
            
            PerformanceMonitor.trackRenderTime(startTime);
            return taskCard;
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diff = now - date;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            
            if (days === 0) return 'today';
            if (days === 1) return 'yesterday';
            if (days < 7) return `${days}d ago`;
            
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }

        function renderTasks() {
            const startTime = performance.now();
            
            const columns = {
                todo: document.getElementById('todoColumn'),
                inprogress: document.getElementById('inprogressColumn'),
                done: document.getElementById('doneColumn')
            };

            // Clear columns
            Object.values(columns).forEach(column => {
                if (column) {
                    column.innerHTML = '';
                }
            });

            // Get tasks by status
            const tasksByStatus = {
                todo: TaskManager.getTasksByStatus('todo'),
                inprogress: TaskManager.getTasksByStatus('inprogress'),
                done: TaskManager.getTasksByStatus('done')
            };

            // Render tasks
            Object.entries(tasksByStatus).forEach(([status, statusTasks]) => {
                const column = columns[status];
                if (!column) return;

                statusTasks.forEach(task => {
                    const taskCard = createTaskCard(task);
                    if (taskCard) {
                        column.appendChild(taskCard);
                    }
                });
            });

            // Reinitialize drag and drop
            DragDrop.reinitialize();
            
            PerformanceMonitor.trackRenderTime(startTime);
        }

        function updateTaskCounts() {
            const counts = {
                todo: TaskManager.getTasksByStatus('todo').length,
                inprogress: TaskManager.getTasksByStatus('inprogress').length,
                done: TaskManager.getTasksByStatus('done').length
            };

            // Update column badges
            Object.entries(counts).forEach(([status, count]) => {
                const countElement = document.getElementById(`${status}Count`);
                if (countElement) {
                    countElement.textContent = count;
                }
            });

            // Update total tasks in header
            const totalTasks = document.getElementById('totalTasks');
            if (totalTasks) {
                totalTasks.textContent = TaskManager.getTaskCount();
            }
        }

        function addTaskWithAnimation(task) {
            const todoColumn = document.getElementById('todoColumn');
            if (!todoColumn) return;

            const taskCard = createTaskCard(task);
            if (!taskCard) return;
            
            taskCard.classList.add('newly-added');
            
            // Insert at top
            if (todoColumn.firstChild) {
                todoColumn.insertBefore(taskCard, todoColumn.firstChild);
            } else {
                todoColumn.appendChild(taskCard);
            }
            
            // Clean up animation class
            setTimeout(() => {
                taskCard.classList.remove('newly-added');
            }, 300);
        }

        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: ${type === 'success' ? '#238636' : '#da3633'};
                color: #f0f6fc;
                padding: 12px 16px;
                border-radius: 6px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 13px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease-out;
            `;
            notification.textContent = `// ${message}`;
            
            document.body.appendChild(notification);
            
            // Slide in animation
            requestAnimationFrame(() => {
                notification.style.transform = 'translateX(0)';
            });
            
            // Auto remove
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        return {
            renderTasks,
            updateTaskCounts,
            addTaskWithAnimation,
            showNotification
        };
    })();

    /**
     * Event Handling Module
     */
    const Events = (function() {
        let debounceTimer = null;

        function debounce(func, delay) {
            return function(...args) {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => func.apply(this, args), delay);
            };
        }

        function handleFormSubmit(e) {
            e.preventDefault();
            
            const titleInput = document.getElementById('taskTitle');
            const descriptionInput = document.getElementById('taskDescription');
            
            if (!titleInput || !descriptionInput) {
                console.error('Form inputs not found');
                return;
            }

            const title = titleInput.value.trim();
            const description = descriptionInput.value.trim();

            console.log('Form submitted:', { title, description });

            if (!title) {
                UI.showNotification('Task title is required', 'error');
                titleInput.focus();
                return;
            }

            try {
                const task = TaskManager.addTask(title, description);
                UI.addTaskWithAnimation(task);
                UI.updateTaskCounts();
                
                // Reset form
                titleInput.value = '';
                descriptionInput.value = '';
                titleInput.focus();
                
                UI.showNotification('Task created successfully');
                
            } catch (error) {
                console.error('Error adding task:', error);
                UI.showNotification('Failed to create task', 'error');
            }
        }

        function handleTaskDelete(e) {
            if (!e.target.closest('.task-delete')) return;
            
            const taskCard = e.target.closest('.task-card');
            if (!taskCard) return;

            const taskId = taskCard.dataset.taskId;
            
            taskCard.classList.add('removing');
            
            setTimeout(() => {
                const success = TaskManager.removeTask(taskId);
                
                if (success) {
                    taskCard.remove();
                    UI.updateTaskCounts();
                    UI.showNotification('Task deleted');
                } else {
                    taskCard.classList.remove('removing');
                    UI.showNotification('Failed to delete task', 'error');
                }
            }, 200);
        }

        function handleKeyboardShortcuts(e) {
            // Ctrl/Cmd + Enter to submit form
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const taskForm = document.getElementById('taskForm');
                if (taskForm) {
                    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                    taskForm.dispatchEvent(submitEvent);
                }
                e.preventDefault();
                return;
            }
            
            // Escape to clear form
            if (e.key === 'Escape') {
                const titleInput = document.getElementById('taskTitle');
                const descriptionInput = document.getElementById('taskDescription');
                if (titleInput && descriptionInput) {
                    titleInput.value = '';
                    descriptionInput.value = '';
                    titleInput.focus();
                }
                return;
            }
        }

        function initialize() {
            console.log('Initializing events...');
            
            // Form submission
            const taskForm = document.getElementById('taskForm');
            if (taskForm) {
                taskForm.addEventListener('submit', handleFormSubmit);
                console.log('Form submit listener added');
            } else {
                console.error('Task form not found');
            }

            // Task deletion
            document.addEventListener('click', handleTaskDelete);
            
            // Keyboard shortcuts
            document.addEventListener('keydown', handleKeyboardShortcuts);
            
            // Focus on title input
            const titleInput = document.getElementById('taskTitle');
            if (titleInput) {
                titleInput.focus();
            }
        }

        return {
            initialize
        };
    })();

    /**
     * Main Application Controller
     */
    const App = (function() {
        let mainAppInitialized = false;

        function initialize() {
            try {
                console.log('🚀 Starting DevKanban v2.1.0...');
                
                // Start boot sequence
                BootSequence.initialize();
                
                // Initialize performance monitoring
                PerformanceMonitor.initialize();
                
                // Load tasks
                TaskManager.loadTasks();
                
            } catch (error) {
                console.error('Failed to initialize DevKanban:', error);
            }
        }

        function initializeMainApp() {
            if (mainAppInitialized) return;
            
            try {
                console.log('Initializing main app...');
                
                // Initialize UI
                UI.renderTasks();
                UI.updateTaskCounts();
                
                // Initialize modules
                Events.initialize();
                DragDrop.initialize();
                
                mainAppInitialized = true;
                console.log('✅ DevKanban v2.1.0 initialized successfully');
                
            } catch (error) {
                console.error('Failed to initialize main app:', error);
                UI.showNotification('Initialization failed', 'error');
            }
        }

        // Public API
        const publicAPI = {
            modules: {
                TaskManager,
                Storage,
                UI,
                Events,
                DragDrop,
                PerformanceMonitor
            },
            
            addTask: (title, description) => {
                const task = TaskManager.addTask(title, description);
                UI.addTaskWithAnimation(task);
                UI.updateTaskCounts();
                return task;
            },
            
            getTasks: () => TaskManager.getAllTasks(),
            
            initializeMainApp: initializeMainApp,
            
            version: '2.1.0'
        };

        // Auto-initialize
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }

        // Expose API for development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.DevKanban = publicAPI;
        }

        return publicAPI;
    })();

})();