const dynamicEventContainer = document.getElementById('dynamic-event-list');
const eventForm = document.getElementById('event-form');
const emptyStateMessage = document.getElementById('empty-state');
const editIndexInput = document.getElementById('edit-index');
const formTitle = document.getElementById('form-title');
const btnSubmit = document.getElementById('btn-submit');
const btnCancel = document.getElementById('btn-cancel');

function getEventsFromStorage() {
    const savedEvents = localStorage.getItem('user_events');
    return savedEvents ? JSON.parse(savedEvents) : [];
}

function saveEventsToStorage(eventsArray) {
    localStorage.setItem('user_events', JSON.stringify(eventsArray));
}

function renderUserEvents() {
    if (!dynamicEventContainer) return;
    const events = getEventsFromStorage();
    dynamicEventContainer.innerHTML = "";

    if (events.length === 0) {
        if (emptyStateMessage) emptyStateMessage.style.display = 'block';
        return;
    } else {
        if (emptyStateMessage) emptyStateMessage.style.display = 'none';
    }

    events.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

    events.forEach((event, index) => {
        const card = document.createElement('div');
        card.className = 'card event-card';
        const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = new Date(event.date).toLocaleDateString('id-ID', dateOptions);

        card.innerHTML = `
            <div class="card-time">🔔 ${event.time}</div>
            <div class="card-title">📝 ${event.name}</div>
            <div class="card-date">📆 ${formattedDate}</div>
            <div class="card-control-buttons">
                <button type="button" class="btn-item btn-item-edit" onclick="startEditEvent(${index})">✏️ Edit</button>
                <button type="button" class="btn-item btn-item-delete" onclick="triggerDeleteEvent(${index})">🗑️ Hapus</button>
            </div>
        `;
        dynamicEventContainer.appendChild(card);
    });
}

if (eventForm) {
    eventForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const nameInput = document.getElementById('event-name').value.trim();
        const dateInput = document.getElementById('event-date').value;
        const timeInput = document.getElementById('event-time').value;
        const modeIndex = parseInt(editIndexInput.value);

        if (!nameInput) return;

        const currentEventData = { name: nameInput, date: dateInput, time: timeInput };
        let totalEvents = getEventsFromStorage();

        if (modeIndex === -1) {
            totalEvents.push(currentEventData);
        } else {
            totalEvents[modeIndex] = currentEventData;
            clearFormModeStatus();
        }

        saveEventsToStorage(totalEvents);
        renderUserEvents();
        eventForm.reset();
    });
}

window.startEditEvent = function (index) {
    const totalEvents = getEventsFromStorage();
    const selectedData = totalEvents[index];

    document.getElementById('event-name').value = selectedData.name;
    document.getElementById('event-date').value = selectedData.date;
    document.getElementById('event-time').value = selectedData.time;

    editIndexInput.value = index;
    formTitle.innerText = "✏️ Perbarui Detil Kegiatan";
    btnSubmit.innerText = "Simpan Perubahan";
    btnSubmit.style.backgroundColor = "var(--warning-color)";
    if (btnCancel) btnCancel.style.display = "block";

    const sectionTitle = document.getElementById('form-section-title');
    if (sectionTitle) sectionTitle.scrollIntoView({ behavior: 'smooth' });
};

window.triggerDeleteEvent = function (index) {
    if (confirm("Apakah Anda yakin ingin menghapus agenda kegiatan ini?")) {
        let totalEvents = getEventsFromStorage();
        totalEvents.splice(index, 1);
        saveEventsToStorage(totalEvents);
        renderUserEvents();
        clearFormModeStatus();
        eventForm.reset();
    }
};

if (btnCancel) {
    btnCancel.addEventListener('click', () => {
        clearFormModeStatus();
        eventForm.reset();
    });
}

function clearFormModeStatus() {
    if (editIndexInput) editIndexInput.value = "-1";
    if (formTitle) formTitle.innerText = "Tambah Event Baru";
    if (btnSubmit) {
        btnSubmit.innerText = "Simpan Event";
        btnSubmit.style.backgroundColor = "var(--primary-color)";
    }
    if (btnCancel) btnCancel.style.display = "none";
}