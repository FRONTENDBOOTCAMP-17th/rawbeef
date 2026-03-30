import '../style.css';
import { createSidebar } from '../components/sidebar.js';

const app = document.getElementById('app');
app.insertBefore(createSidebar(), app.firstChild);

// --- 카테고리 관리 로직 ---
const input = document.getElementById('categoryInput');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('categoryList');

// LocalStorage에서 데이터 불러오기
let categories = JSON.parse(localStorage.getItem('categories')) || [];

function save() {
  localStorage.setItem('categories', JSON.stringify(categories));
}

function render() {
  list.innerHTML = '';
  categories.forEach((name, index) => {
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between bg-white p-4 rounded border';

    const span = document.createElement('span');
    span.textContent = name;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '삭제';
    deleteBtn.className = 'text-red-500 hover:text-red-700';
    deleteBtn.addEventListener('click', () => {
      if (confirm(`"${name}" 카테고리를 삭제하시겠습니까?`)) {
        categories.splice(index, 1);
        save();
        render();
      }
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

addBtn.addEventListener('click', () => {
  const name = input.value.trim();
  if (!name) {
    alert('카테고리 이름을 입력해주세요.');
    return;
  }
  categories.push(name);
  save();
  render();
  input.value = '';
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addBtn.click();
});

render();
