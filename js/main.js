(() => {
  'use strict';

  const TASKS_KEY = 'todo:tasks';
  const THEME_KEY = 'todo:theme';

  const $ = (id) => document.getElementById(id);

  const addOpen = $('add-open');
  const addModal = $('add-modal');
  const addForm = $('add-form');
  const addInput = $('add-input');
  const addError = $('add-error');
  const list = $('task-list');
  const emptyEl = $('empty');
  const counter = $('counter');
  const statusEl = $('status');
  const searchInput = $('search-input');
  const themeButton = $('theme-switcher');
  const filterButtons = document.querySelectorAll('[data-filter]');

  const deleteModal = $('delete-modal');
  const deleteText = $('delete-text');
  const editModal = $('edit-modal');
  const editForm = $('edit-form');
  const editInput = $('edit-input');
  const editError = $('edit-error');

  const ICON_EDIT =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">' +
    '<path d="M4 20h4L19 9l-4-4L4 16v4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
  const ICON_DELETE =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">' +
    '<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  let tasks = loadTasks();
  let filter = 'all';
  let query = '';
  let pendingDelete = null;
  let editing = null;

  // Хранилище
  function loadTasks() {
    try {
      const data = JSON.parse(localStorage.getItem(TASKS_KEY));
      if (!Array.isArray(data)) return [];
      return data
        .filter((t) => t && typeof t.id === 'string' && typeof t.title === 'string')
        .map((t) => ({ id: t.id, title: t.title, done: Boolean(t.done) }));
    } catch {
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch {
    }
  }

  // Утилиты
  const createId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const findTask = (id) => tasks.find((t) => t.id === id);

  // Озвучиваем действие скринридеру (live-область)
  function announce(message) {
    statusEl.textContent = '';
    setTimeout(() => { statusEl.textContent = message; }, 50);
  }

  function showError(field, errorNode, message) {
    field.setAttribute('aria-invalid', 'true');
    errorNode.textContent = message;
    errorNode.hidden = false;
  }

  function clearError(field, errorNode) {
    field.removeAttribute('aria-invalid');
    errorNode.textContent = '';
    errorNode.hidden = true;
  }

  function focusControl(action, id) {
    const el = list.querySelector(`[data-action="${action}"][data-id="${id}"]`);
    if (el) el.focus();
  }

  // Отрисовка
  function iconButton(action, id, label, icon, extraClass) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `btn btn--icon ${extraClass || ''}`.trim();
    btn.dataset.action = action;
    btn.dataset.id = id;
    btn.id = `${action}-${id}`;
    btn.setAttribute('aria-label', label);
    btn.setAttribute('aria-labelledby', `${btn.id} task-title-${id}`);
    btn.innerHTML = icon;
    return btn;
  }

  function createTaskItem(task) {
    const li = document.createElement('li');
    li.className = task.done ? 'task task--done' : 'task';

    const label = document.createElement('label');
    label.className = 'task__check';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task__checkbox';
    checkbox.checked = task.done;
    checkbox.dataset.action = 'toggle';
    checkbox.dataset.id = task.id;

    const title = document.createElement('span');
    title.className = 'task__title';
    title.id = `task-title-${task.id}`;
    title.textContent = task.title;

    checkbox.setAttribute('aria-labelledby', title.id);
    label.append(checkbox, title);

    const actions = document.createElement('div');
    actions.className = 'task__actions';
    actions.append(
      iconButton('edit', task.id, 'Редактировать', ICON_EDIT),
      iconButton('delete', task.id, 'Удалить', ICON_DELETE, 'btn--danger-hover')
    );

    li.append(label, actions);
    return li;
  }

  function visibleTasks() {
    const q = query.trim().toLowerCase();
    return tasks
      .filter((t) => {
        if (filter === 'active' && t.done) return false;
        if (filter === 'done' && !t.done) return false;
        return !q || t.title.toLowerCase().includes(q);
      })
      // выполненные уходят вниз; сортировка стабильная, порядок внутри групп сохраняется
      .sort((a, b) => Number(a.done) - Number(b.done));
  }

  function render() {
    const visible = visibleTasks();
    list.replaceChildren(...visible.map(createTaskItem));

    const left = tasks.filter((t) => !t.done).length;
    counter.textContent = tasks.length ? `Осталось сделать: ${left} из ${tasks.length}` : '';

    emptyEl.hidden = visible.length > 0;
    emptyEl.textContent = tasks.length
      ? 'Ничего не найдено. Измените запрос или фильтр.'
      : 'Задач пока нет. Добавьте первую в поле выше.';
  }

  // Действия
  addOpen.addEventListener('click', () => {
    addForm.reset();
    clearError(addInput, addError);
    addModal.showModal();
  });

  addInput.addEventListener('input', () => clearError(addInput, addError));
  $('add-cancel').addEventListener('click', () => addModal.close());

  addForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = addInput.value.trim();

    if (!title) {
      showError(addInput, addError, 'Введите название задачи');
      addInput.focus();
      return;
    }

    tasks.unshift({ id: createId(), title, done: false });
    saveTasks();
    render();
    announce(`Задача «${title}» добавлена`);
    addModal.close();
  });

  list.addEventListener('change', (event) => {
    const target = event.target;
    if (target.dataset.action !== 'toggle') return;

    const task = findTask(target.dataset.id);
    task.done = target.checked;
    saveTasks();
    render();
    focusControl('toggle', task.id);
    announce(task.done ? 'Задача выполнена' : 'Задача снова активна');
  });

  list.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-action]');
    if (!btn) return;

    if (btn.dataset.action === 'delete') askDelete(btn.dataset.id);
    if (btn.dataset.action === 'edit') openEdit(btn.dataset.id);
  });

  // Поиск и фильтры 
  searchInput.addEventListener('input', () => {
    query = searchInput.value;
    render();
  });

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filter = btn.dataset.filter;
      filterButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      render();
      announce(`Показано задач: ${visibleTasks().length}`);
    });
  });

  // Модальные окна
  [addModal, deleteModal, editModal].forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) modal.close();
    });
  });

  function askDelete(id) {
    pendingDelete = findTask(id);
    deleteText.textContent = `Задача «${pendingDelete.title}» будет удалена без возможности восстановления.`;
    deleteModal.showModal();
  }

  deleteModal.addEventListener('close', () => {
    const task = pendingDelete;
    pendingDelete = null;
    if (!task) return;

    if (deleteModal.returnValue === 'confirm') {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      render();
      announce('Задача удалена');
      addOpen.focus();
    } else {
      focusControl('delete', task.id); // Esc / «Отмена» — вернуть фокус на кнопку
    }
    deleteModal.returnValue = '';
  });

  function openEdit(id) {
    editing = findTask(id);
    editInput.value = editing.title;
    clearError(editInput, editError);
    editModal.showModal();
    editInput.select();
  }

  editInput.addEventListener('input', () => clearError(editInput, editError));
  $('edit-cancel').addEventListener('click', () => editModal.close());

  editForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = editInput.value.trim();

    if (!title) {
      showError(editInput, editError, 'Название не может быть пустым');
      editInput.focus();
      return;
    }

    editing.title = title;
    saveTasks();
    render();
    announce('Задача обновлена');
    editModal.close();
  });

  editModal.addEventListener('close', () => {
    if (editing) focusControl('edit', editing.id);
    editing = null;
  });

  // Тема 
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
  }

  themeButton.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
    }
    announce(next === 'dark' ? 'Включена тёмная тема' : 'Включена светлая тема');
  });

  applyTheme(document.documentElement.dataset.theme || 'light');

  render();
})();
