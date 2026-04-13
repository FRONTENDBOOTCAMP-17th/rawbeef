const token = localStorage.getItem('adminToken');
if (!token) {
  alert('로그인이 필요합니다.');
  location.href = './admin_open.html';
}
let category = [];
async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    const json = await res.json();
    if (!res.ok) {
      alert('카테고리 불러오기에 실패했습니다.');
      return;
    }
    category = json.data;
    renderCategory();
  } catch {
    alert('카테고리 불러오기에 실패했습니다.');
  }
}

let editIndex = null;
const modal = document.getElementById('modal');
const categoryList = document.getElementById('categoryList');

const saveCategory = async (title) => {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      alert('카테고리 저장에 실패했습니다.');
      return;
    }
    const json = await res.json();
    return json.data;
  } catch {
    alert('카테고리 저장에 실패했습니다.');
  }
};

const editCategory = async (id, newTitle) => {
  try {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTitle }),
    });
    if (!res.ok) {
      alert('카테고리 수정에 실패했습니다.');
      return;
    }

    const json = await res.json();
    return json.data;
  } catch {
    alert('카테고리 수정에 실패했습니다.');
  }
};
const addCategoryBtn = document.getElementById('addCategoryBtn');
addCategoryBtn.addEventListener('click', () => {
  editIndex = null;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
});

const closeCategoryBtn = document.getElementById('closeCategoryBtn');
closeCategoryBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
});

const moveCategoryUp = async (id) => {
  try {
    await fetch(`${API_BASE}/categories/${id}/move-up`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('카테고리 순서 변경 중 오류 발생:', error);
  }
  await loadCategories();
};

const moveCategoryDown = async (id) => {
  try {
    await fetch(`${API_BASE}/categories/${id}/move-down`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('카테고리 순서 변경 중 오류 발생:', error);
  }
  await loadCategories();
};
const renderCategory = () => {
  categoryList.innerHTML = '';

  category.forEach((item, index) => {
    const divCreate = document.createElement('div');
    divCreate.className = 'flex justify-between items-center px-6 py-4 mb-3  bg-gray-300 dark:bg-gray-900 border-b border-t text-black border-gray-500 dark:border-white hover:border-gray-500 transition-all duration-200';

    const spanTitle = document.createElement('span');
    spanTitle.className = 'text-lg font-bold text-black dark:text-white';
    spanTitle.textContent = item.title;

    const btnManage = document.createElement('div');
    btnManage.className = 'flex items-center gap-4';

    const upBtn = document.createElement('button');
    upBtn.textContent = '▲';
    upBtn.className = 'w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white  text-xl';
    upBtn.addEventListener('click', async () => {
      await moveCategoryUp(item.id);
    });

    const downBtn = document.createElement('button');
    downBtn.textContent = '▼';
    downBtn.className = 'w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white  transition-color text-xl';
    downBtn.addEventListener('click', async () => {
      await moveCategoryDown(item.id);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'categoryDeleteBtn  text-red-400 hover:text-red-400 dark:text-red-400 transition-color text-3xl text-bold hover:text-red-500 hover:scale-125';
    deleteBtn.textContent = 'x';

    deleteBtn.addEventListener('click', function () {
      deleteCategory(index);
    });

    const editBtn = document.createElement('button');
    editBtn.className = 'categoryEditBtn text-l text-bold hover:text-blue-700 dark:text-white dark:hover:text-blue-400 hover:scale-125 ';
    editBtn.textContent = 'EDIT';
    editBtn.addEventListener('click', function () {
      editIndex = index;
      document.querySelector('#modal h2').textContent = '카테고리 수정';
      document.getElementById('titleInput').value = item.title;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });

    btnManage.append(upBtn, downBtn, deleteBtn, editBtn);
    divCreate.append(spanTitle, btnManage);

    categoryList.appendChild(divCreate);
  });
};
const saveCategoryBtn = document.getElementById('saveCategoryBtn');
saveCategoryBtn.addEventListener('click', async () => {
  const titleInput = document.getElementById('titleInput');
  const title = titleInput.value;

  if (title) {
    if (editIndex !== null) {
      await editCategory(category[editIndex].id, title);
      await loadCategories();
      editIndex = null;
    } else {
      await saveCategory(title);
      await loadCategories();
    }
    renderCategory();

    modal.classList.add('hidden');
    modal.classList.remove('flex');
    titleInput.value = '';
    document.querySelector('#modal h2').textContent = '신규 카테고리 등록';
  } else {
    alert('카테고리 제목을 입력해주세요.');
  }
});

const deleteCategory = async (index) => {
  if (confirm('이 카테고리를 정말 삭제할까요?')) {
    try {
      const id = category[index].id;

      await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('카테고리 삭제 중 오류 발생:', error);
    }
    await loadCategories();
  }
};

loadCategories();
