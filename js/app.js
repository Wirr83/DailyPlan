const fixedSchedule = [
    { time: "05:30", activity: "Bangun Tidur", emoji: "🌅" },
    { time: "06:00", activity: "Olahraga", emoji: "🏃‍♂️" },
    { time: "06:30", activity: "Sarapan", emoji: "🍳" },
    { time: "07:00", activity: "Kerja/Kuliah", emoji: "💻" },
    { time: "12:00", activity: "Makan", emoji: "🍱" },
    { time: "13:00", activity: "Kerja/Kuliah", emoji: "💻" },
    { time: "17:00", activity: "Pulang", emoji: "🏚️🏍️" },
    { time: "19:00", activity: "Santai atau Menyelesaikan Tugas", emoji: "🍺" },
    { time: "22:00", activity: "Tidur", emoji: "😴" }
];

const views = {
    home: document.getElementById('view-home'),
    jadwal: document.getElementById('view-jadwal'),
    event: document.getElementById('view-event'),
    todo: document.getElementById('view-todo'),
    notes: document.getElementById('view-notes')
};

const navLinks = {
    home: document.getElementById('nav-home'),
    jadwal: document.getElementById('nav-jadwal'),
    event: document.getElementById('nav-event'),
    todo: document.getElementById('nav-todo'),
    notes: document.getElementById('nav-notes')
};

function switchView(viewName) {
    Object.keys(views).forEach(key => {
        if (views[key]) views[key].classList.remove('active');
        if (navLinks[key]) navLinks[key].classList.remove('active');
    });

    if (views[viewName]) {
        views[viewName].classList.add('active');
    }
    if (navLinks[viewName]) {
        navLinks[viewName].classList.add('active');
    }
    window.scrollTo(0, 0);
}

document.getElementById('nav-brand').addEventListener('click', () => switchView('home'));
Object.keys(navLinks).forEach(key => {
    if (navLinks[key]) {
        navLinks[key].addEventListener('click', (e) => {
            e.preventDefault();
            switchView(key);
        });
    }
});

const btnToJadwal = document.getElementById('btn-to-jadwal');
const btnToEvent = document.getElementById('btn-to-event');
if (btnToJadwal) btnToJadwal.addEventListener('click', () => switchView('jadwal'));
if (btnToEvent) btnToEvent.addEventListener('click', () => switchView('event'));

function renderFixedSchedule() {
    const container = document.getElementById('fixed-schedule-list');
    if (!container) return;
    container.innerHTML = "";
    fixedSchedule.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class=\"card-time\">⏱️ ${item.time}</div>
            <div class=\"card-title\">${item.emoji} ${item.activity}</div>
        `;
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderFixedSchedule();
    if (typeof renderUserEvents === 'function') renderUserEvents();
    if (typeof renderTodos === 'function') renderTodos();
    if (typeof renderNotes === 'function') renderNotes("");
});