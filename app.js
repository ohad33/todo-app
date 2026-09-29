const form = document.getElementById('add-form');
const input = document.getElementById('new-task');
const list = document.getElementById('task-list');

const STORAGE_KEY = 'tasks';

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('שמירה נכשלה', err);
  }
}

let tasks = load();

function render() {
  list.replaceChildren();
  for (const task of tasks) {
    const li = document.createElement('li');
    li.textContent = task.text;
    list.append(li);
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  tasks.unshift({ text: input.value });
  input.value = '';
  save();
  render();
});

render();
