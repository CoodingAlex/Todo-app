var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var DEFAULT_TASKS = [];
var TasksManager = /** @class */ (function () {
    function TasksManager() {
        this.tasks = DEFAULT_TASKS;
    }
    TasksManager.getInstance = function () {
        if (!TasksManager.instance) {
            TasksManager.instance = new TasksManager();
        }
        return TasksManager.instance;
    };
    TasksManager.prototype.AddTask = function (data) {
        this.tasks.push(data);
    };
    TasksManager.prototype.getTasks = function () {
        return this.tasks;
    };
    TasksManager.prototype.removeCompletedTasks = function () {
        this.tasks = this.tasks.filter(function (task) { return !task.completed; });
        return this.tasks;
    };
    TasksManager.prototype.removeTaskById = function (id) {
        this.tasks = this.tasks.filter(function (task) { return task.id !== id; });
        return this.tasks;
    };
    TasksManager.prototype.toggleCompletedTask = function (id) {
        this.tasks = this.tasks.map(function (task) {
            if (task.id === id) {
                return __assign(__assign({}, task), { completed: !task.completed });
            }
            return task;
        });
    };
    return TasksManager;
}());
var TodoApp = /** @class */ (function () {
    function TodoApp() {
        this.handleCheckedInput = this.handleCheckedInput.bind(this);
        this.handleDeleteAllTasks = this.handleDeleteAllTasks.bind(this);
        this.taskManager = TasksManager.getInstance();
        this.tasks = this.taskManager.getTasks();
    }
    TodoApp.getInstance = function () {
        if (!TodoApp.instance) {
            TodoApp.instance = new TodoApp();
        }
        return TodoApp.instance;
    };
    TodoApp.prototype.loadData = function (filter) {
        var _this = this;
        var listOfTasks = document.querySelector('.app_tasks--list');
        listOfTasks.innerHTML = '';
        this.tasks = this.taskManager.getTasks();
        var filteredTasks;
        var renderButtons = [
            document.getElementById('render__completed__button'),
            document.getElementById('render__active__button'),
            document.getElementById('render__all__button'),
        ];
        renderButtons.forEach(function (button) {
            button.style.border = 'none';
        });
        var deleteAllButton = document.querySelector('.delete__all');
        deleteAllButton.style.display = 'none';
        deleteAllButton.onclick = this.handleDeleteAllTasks;
        if (filter === 'Completed') {
            filteredTasks = this.tasks.filter(function (task) { return task.completed; });
            renderButtons[0].style.borderBottom = '3px solid  #2F80ED';
            deleteAllButton.style.display = 'block';
        }
        if (filter === 'Active') {
            filteredTasks = this.tasks.filter(function (task) { return !task.completed; });
            renderButtons[1].style.borderBottom = '3px solid  #2F80ED';
        }
        if (!filter) {
            filteredTasks = this.tasks;
            renderButtons[2].style.borderBottom = '3px solid  #2F80ED';
        }
        filteredTasks.forEach(this.handleRenderTasks(listOfTasks));
        var deleteIcons = document.querySelectorAll('.delete__icon--container ');
        if (filter === 'Completed') {
            deleteIcons.forEach(function (item) {
                item.style.display = 'block';
                item.onclick = _this.handleDeleteIcon(item);
            });
        }
        else {
            deleteIcons.forEach(function (item) {
                item.style.display = 'none';
            });
        }
        var inputs = document.querySelectorAll('.task_checkbox');
        inputs.forEach(function (input) {
            input.onclick = _this.handleCheckedInput(input);
        });
    };
    TodoApp.prototype.handleRenderTasks = function (listOfTasks) {
        return function (task) {
            listOfTasks.innerHTML += "\n    <li class=\"tasks__list--item\">\n      <input class=\"task_checkbox\" type=\"checkbox\" name=\"\" id=\"task_" + task.id + "\" " + (task.completed ? 'checked' : '') + "/>\n      <span id=tasktext_" + task.id + " class=\"" + (task.completed ? 'completed' : '') + "\">" + task.name + "</span>\n      <div class=\"delete__icon--container\" id=\"icondelete_" + task.id + "\">\n      <img src=\"/assets/icons/delete.svg\" class=\"delete__icon\">\n      </div>\n    </li>\n      ";
        };
    };
    TodoApp.prototype.handleCreateButton = function (data) {
        this.taskManager.AddTask(data);
        this.loadData();
    };
    TodoApp.prototype.handleDeleteAllTasks = function () {
        this.taskManager.removeCompletedTasks();
        this.loadData('');
    };
    TodoApp.prototype.handleDeleteIcon = function (item) {
        var _this = this;
        return function () {
            var id = parseInt(item.id.split('_')[1]);
            _this.taskManager.removeTaskById(id);
            _this.loadData('Completed');
        };
    };
    TodoApp.prototype.handleCheckedInput = function (input) {
        var _this = this;
        return function () {
            var id = parseInt(input.id.split('_')[1]);
            var span = document.querySelector("#tasktext_" + id);
            if (input.checked) {
                span.style.textDecoration = 'line-through';
            }
            else {
                span.style.textDecoration = 'none';
            }
            _this.taskManager.toggleCompletedTask(id);
        };
    };
    return TodoApp;
}());
var insted = TodoApp.getInstance();
insted.loadData();
var addTaskInput = document.querySelector('input#add_task_input');
var addTaskButton = document.getElementById('add_task_button');
addTaskButton.onclick = function () {
    insted.handleCreateButton({
        name: addTaskInput.value,
        id: Math.floor(Math.random() * 1000),
        completed: false
    });
    addTaskInput.value = '';
};
var renderAllButton = document.getElementById('render__all__button');
var renderCompletedButton = document.getElementById('render__completed__button');
var renderActiveButton = document.getElementById('render__active__button');
renderAllButton.onclick = function () {
    insted.loadData();
};
renderCompletedButton.onclick = function () {
    insted.loadData('Completed');
};
renderActiveButton.onclick = function () {
    insted.loadData('Active');
};
