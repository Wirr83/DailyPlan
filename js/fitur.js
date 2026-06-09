const todoForm = document.getElementById('todo-form');
const todoListContainer = document.getElementById('todo-list');
const todoEmptyMessage = document.getElementById('todo-empty');

function getTodosFromStorage() {
    const savedTodos = localStorage.getItem('user_todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
}

function saveTodosToStorage(todosArray) {
    localStorage.setItem('user_todos', JSON.stringify(todosArray));
}

function renderTodos() {
    if (!todoListContainer) return;
    const todos = getTodosFromStorage();
    todoListContainer.innerHTML = "";

    if (todos.length === 0) {
        if (todoEmptyMessage) todoEmptyMessage.style.display = 'block';
        return;
    } else {
        if (todoEmptyMessage) todoEmptyMessage.style.display = 'none';
    }

    todos.forEach((todo, index) => {
        const itemRow = document.createElement('div');
        itemRow.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        let priorityBadge = "";
        if (todo.priority === "Tinggi") priorityBadge = `<span class="badge priority-high">Tinggi</span>`;
        else if (todo.priority === "Sedang") priorityBadge = `<span class="badge priority-medium">Sedang</span>`;
        else priorityBadge = `<span class="badge priority-low">Rendah</span>`;

        itemRow.innerHTML = `
            <div class="todo-left">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} onclick="toggleTodoStatus(${index})">
                <span class="todo-text">${todo.title}</span>
                ${priorityBadge}
            </div>
            <button class="btn-delete-todo" onclick="deleteTodoItem(${index})">❌</button>
        `;
        todoListContainer.appendChild(itemRow);
    });
}

if (todoForm) {
    todoForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const todoTitleInput = document.getElementById('todo-title').value.trim();
        const todoPriorityInput = document.getElementById('todo-priority').value;

        if (!todoTitleInput) return;

        const newTodo = { title: todoTitleInput, priority: todoPriorityInput, completed: false };
        const totalTodos = getTodosFromStorage();
        totalTodos.push(newTodo);

        saveTodosToStorage(totalTodos);
        renderTodos();
        todoForm.reset();
    });
}

window.toggleTodoStatus = function (index) {
    const totalTodos = getTodosFromStorage();
    totalTodos[index].completed = !totalTodos[index].completed;
    saveTodosToStorage(totalTodos);
    renderTodos();
};

window.deleteTodoItem = function (index) {
    const totalTodos = getTodosFromStorage();
    totalTodos.splice(index, 1);
    saveTodosToStorage(totalTodos);
    renderTodos();
};
const noteForm = document.getElementById('note-form');
const notesGridContainer = document.getElementById('notes-grid');
const notesEmptyMessage = document.getElementById('notes-empty');
const searchNotesInput = document.getElementById('search-notes');

function getNotesFromStorage() {
    const savedNotes = localStorage.getItem('user_notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
}

function saveNotesToStorage(notesArray) {
    localStorage.setItem('user_notes', JSON.stringify(notesArray));
}

function renderNotes(filterText = "") {
    if (!notesGridContainer) return;
    const notes = getNotesFromStorage();
    notesGridContainer.innerHTML = "";

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(filterText.toLowerCase()) ||
        note.category.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filteredNotes.length === 0) {
        if (notesEmptyMessage) notesEmptyMessage.style.display = 'block';
        return;
    } else {
        if (notesEmptyMessage) notesEmptyMessage.style.display = 'none';
    }

    filteredNotes.forEach((note, index) => {
        const card = document.createElement('div');
        card.className = 'card note-card';
        card.innerHTML = `
            <div class="note-header">
                <span class="badge note-category-badge">🏷️ ${note.category}</span>
                <button class="btn-small-delete" onclick="deleteNoteItem(${index})">🗑️</button>
            </div>
            <h4 class="note-card-title">${note.title}</h4>
            <p class="note-card-body">${note.content.replace(/\n/g, '<br>')}</p>
        `;
        notesGridContainer.appendChild(card);
    });
}

if (noteForm) {
    noteForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const noteTitle = document.getElementById('note-title').value.trim();
        const noteCategory = document.getElementById('note-category').value.trim();
        const noteContent = document.getElementById('note-content').value.trim();

        const newNote = {
            title: noteTitle,
            category: noteCategory,
            content: noteContent,
            timestamp: new Date().getTime()
        };

        const totalNotes = getNotesFromStorage();
        totalNotes.unshift(newNote);

        saveNotesToStorage(totalNotes);
        renderNotes(searchNotesInput ? searchNotesInput.value : "");
        noteForm.reset();
    });
}

window.deleteNoteItem = function (index) {
    if (confirm("Hapus catatan ini secara permanen?")) {
        const totalNotes = getNotesFromStorage();
        totalNotes.splice(index, 1);
        saveNotesToStorage(totalNotes);
        renderNotes(searchNotesInput ? searchNotesInput.value : "");
    }
};

if (searchNotesInput) {
    searchNotesInput.addEventListener('input', function (e) {
        renderNotes(e.target.value);
    });
}