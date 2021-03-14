interface Task {
  name: string
  completed: boolean
  id?: number
}
const DEFAULT_TASKS: Task[] = []
class TasksManager {
  private static instance: TasksManager
  tasks: Task[]
  private constructor() {
    this.tasks = DEFAULT_TASKS
  }
  static getInstance() {
    if (!TasksManager.instance) {
      TasksManager.instance = new TasksManager()
    }

    return TasksManager.instance
  }

  AddTask(data: Task) {
    this.tasks.push(data)
  }

  getTasks(): Task[] {
    return this.tasks
  }
  removeCompletedTasks() {
    this.tasks = this.tasks.filter((task) => !task.completed)
    return this.tasks
  }

  removeTaskById(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id)
    return this.tasks
  }
  toggleCompletedTask(id: number) {
    this.tasks = this.tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed }
      }
      return task
    })
  }
}

class TodoApp {
  private static instance: TodoApp
  tasks: Task[]
  taskManager: TasksManager
  private constructor() {
    this.handleCheckedInput = this.handleCheckedInput.bind(this)
    this.handleDeleteAllTasks = this.handleDeleteAllTasks.bind(this)
    this.taskManager = TasksManager.getInstance()
    this.tasks = this.taskManager.getTasks()
  }
  static getInstance() {
    if (!TodoApp.instance) {
      TodoApp.instance = new TodoApp()
    }

    return TodoApp.instance
  }

  loadData(filter?: string) {
    const listOfTasks: HTMLElement = document.querySelector('.app_tasks--list')
    listOfTasks.innerHTML = ''
    this.tasks = this.taskManager.getTasks()
    let filteredTasks: Task[]
    let renderButtons: HTMLElement[] = [
      document.getElementById('render__completed__button'),
      document.getElementById('render__active__button'),
      document.getElementById('render__all__button'),
    ]
    renderButtons.forEach((button) => {
      button.style.border = 'none'
    })

    const deleteAllButton: HTMLButtonElement = document.querySelector(
      '.delete__all'
    )
    deleteAllButton.style.display = 'none'
    deleteAllButton.onclick = this.handleDeleteAllTasks

    if (filter === 'Completed') {
      filteredTasks = this.tasks.filter((task) => task.completed)
      renderButtons[0].style.borderBottom = '3px solid  #2F80ED'
      deleteAllButton.style.display = 'block'
    }

    if (filter === 'Active') {
      filteredTasks = this.tasks.filter((task) => !task.completed)
      renderButtons[1].style.borderBottom = '3px solid  #2F80ED'
    }
    if (!filter) {
      filteredTasks = this.tasks
      renderButtons[2].style.borderBottom = '3px solid  #2F80ED'
    }
    filteredTasks.forEach(this.handleRenderTasks(listOfTasks))

    const deleteIcons: NodeListOf<HTMLElement> = document.querySelectorAll(
      '.delete__icon--container '
    )
    if (filter === 'Completed') {
      deleteIcons.forEach((item) => {
        item.style.display = 'block'
        item.onclick = this.handleDeleteIcon(item)
      })
    } else {
      deleteIcons.forEach((item) => {
        item.style.display = 'none'
      })
    }
    const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      '.task_checkbox'
    )
    inputs.forEach((input) => {
      input.onclick = this.handleCheckedInput(input)
    })
  }

  handleRenderTasks(listOfTasks) {
    return (task) => {
      listOfTasks.innerHTML += `
    <li class="tasks__list--item">
      <input class="task_checkbox" type="checkbox" name="" id="task_${
        task.id
      }" ${task.completed ? 'checked' : ''}/>
      <span id=tasktext_${task.id} class="${
        task.completed ? 'completed' : ''
      }">${task.name}</span>
      <div class="delete__icon--container" id="icondelete_${task.id}">
      <img src="/assets/icons/delete.svg" class="delete__icon">
      </div>
    </li>
      `
    }
  }

  handleCreateButton(data: Task) {
    this.taskManager.AddTask(data)
    this.loadData()
  }

  handleDeleteAllTasks() {
    this.taskManager.removeCompletedTasks()
    this.loadData('')
  }

  handleDeleteIcon(item) {
    return () => {
      const id = parseInt(item.id.split('_')[1])
      this.taskManager.removeTaskById(id)
      this.loadData('Completed')
    }
  }
  handleCheckedInput(input: HTMLInputElement) {
    return () => {
      const id = parseInt(input.id.split('_')[1])
      const span: HTMLElement = document.querySelector(`#tasktext_${id}`)
      if (input.checked) {
        span.style.textDecoration = 'line-through'
      } else {
        span.style.textDecoration = 'none'
      }

      this.taskManager.toggleCompletedTask(id)
    }
  }
}

const insted = TodoApp.getInstance()
insted.loadData()

const addTaskInput: HTMLInputElement = document.querySelector(
  'input#add_task_input'
)
const addTaskButton = document.getElementById('add_task_button')
addTaskButton.onclick = () => {
  insted.handleCreateButton({
    name: addTaskInput.value,
    id: Math.floor(Math.random() * 1000),
    completed: false,
  })

  addTaskInput.value = ''
}

const renderAllButton = document.getElementById('render__all__button')
const renderCompletedButton = document.getElementById(
  'render__completed__button'
)
const renderActiveButton = document.getElementById('render__active__button')

renderAllButton.onclick = () => {
  insted.loadData()
}
renderCompletedButton.onclick = () => {
  insted.loadData('Completed')
}
renderActiveButton.onclick = () => {
  insted.loadData('Active')
}
