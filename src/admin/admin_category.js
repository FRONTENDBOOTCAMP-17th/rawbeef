const token = requireAuth();
let category = [];

const openModal = () => {
  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

const closeModal = () => {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
};
async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);

    if (!res.ok) {
      alert('카테고리 불러오기에 실패했습니다.');
      return;
    }
    const json = await res.json();
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
    return null;
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
    return null;
  }
};
const addCategoryBtn = document.getElementById('addCategoryBtn');
addCategoryBtn.addEventListener('click', () => {
  editIndex = null;
  openModal();
});

const closeCategoryBtn = document.getElementById('closeCategoryBtn');
closeCategoryBtn.addEventListener('click', () => {
  closeModal();
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
    divCreate.className =
      'flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 sm:px-6 py-4 mb-3 bg-gray-100 dark:bg-gray-900 border-b border-t text-black border-gray-500 dark:border-white hover:border-gray-500 transition-all duration-200';

    const spanTitle = document.createElement('span');
    spanTitle.className = 'text-lg font-bold text-black dark:text-white';
    spanTitle.textContent = item.title;

    const btnManage = document.createElement('div');
    btnManage.className = 'flex items-center gap-4';

    const upBtn = document.createElement('button');
    upBtn.textContent = '▲';
    upBtn.className = 'w-8 h-8 flex items-center justify-center text-gray-400 dark:hover:text-white hover:text-gray-600  text-xl';
    upBtn.addEventListener('click', async () => {
      await moveCategoryUp(item.id);
    });

    const downBtn = document.createElement('button');
    downBtn.textContent = '▼';
    downBtn.className = 'w-8 h-8 flex items-center justify-center text-gray-400 dark:hover:text-white hover:text-gray-600  transition-color text-xl';
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
      openModal();
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
      alert('카테고리가 수정이 완료 되었습니다!');
    } else {
      const created = await saveCategory(title);
      if (!created) return;

      await loadCategories();
      alert('카테고리 등록이 완료되었습니다!');
    }
    renderCategory();

    closeModal();
    titleInput.value = '';
    document.querySelector('#modal h2').textContent = '신규 카테고리 등록';
  } else {
    alert('카테고리 제목을 입력해주세요.');
  }
});

const deleteCategory = async (index) => {
  if (confirm(' 🚨 주의! 카테고리를 삭제 하면 연결된 노래 데이터가 모두 삭제 됩니다. \n 정말 삭제할까요?')) {
    try {
      const id = category[index].id;

      await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        alert('카테고리 삭제에 실패했습니다.');
        return;
      }
      alert('카테고리 삭제가 완료되었습니다!');
    } catch (error) {
      console.error('카테고리 삭제 중 오류 발생:', error);
    }
    await loadCategories();
  }
};

loadCategories();
