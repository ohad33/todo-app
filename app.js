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

let editingIndex = null;

function makeButton(label, onClick) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = label;
  btn.addEventListener('click', onClick);
  return btn;
}

function render() {
  list.replaceChildren();
  let editInput = null;
  tasks.forEach((task, i) => {
    const li = document.createElement('li');

    if (i === editingIndex) {
      const edit = document.createElement('input');
      edit.type = 'text';
      edit.value = task.text;
      edit.setAttribute('aria-label', 'עריכת משימה');
      editInput = edit;

      const error = document.createElement('span');
      error.setAttribute('role', 'alert');

      li.append(
        edit,
        makeButton('שמור', () => {
          if (edit.value.trim() === '') {
            error.textContent = 'לא ניתן לשמור משימה ריקה';
            return;
          }
          task.text = edit.value;
          editingIndex = null;
          save();
          render();
        }),
        makeButton('בטל', () => {
          editingIndex = null;
          render();
        }),
        error
      );
    } else {
      const check = document.createElement('input');
      check.type = 'checkbox';
      check.setAttribute('aria-label', 'בוצע');
      check.checked = task.done === true;
      check.addEventListener('change', () => {
        task.done = check.checked;
        save();
        render();
      });

      const text = document.createElement('span');
      text.textContent = task.text;
      if (task.done) text.style.textDecoration = 'line-through';

      li.append(
        check,
        text,
        makeButton('ערוך', () => {
          editingIndex = i;
          render();
        }),
        makeButton('מחק', () => {
          if (confirm('למחוק את המשימה?')) {
            tasks.splice(i, 1);
            editingIndex = null;
            save();
            render();
          }
        })
      );
    }
    list.append(li);
  });
  if (editInput) editInput.focus();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  tasks.unshift({ text: input.value });
  input.value = '';
  save();
  render();
});

render();
