// 存储记忆的数组
let memories = JSON.parse(localStorage.getItem('memories')) || [];

// DOM 元素
const modal = document.getElementById('addMemoryModal');
const addBtn = document.getElementById('addMemoryBtn');
const closeBtn = document.querySelector('.close');
const form = document.getElementById('memoryForm');
const filterYear = document.getElementById('filterYear');
const memoriesContainer = document.getElementById('memoriesContainer');

// 打开模态框
addBtn.onclick = () => {
    modal.style.display = 'block';
}

// 关闭模态框
closeBtn.onclick = () => {
    modal.style.display = 'none';
}

// 点击模态框外部关闭
window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// 表单提交处理
form.onsubmit = async (e) => {
    e.preventDefault();
    
    const imageFile = document.getElementById('image').files[0];
    const imageUrl = await readFileAsDataURL(imageFile);
    
    const memory = {
        id: Date.now(),
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        date: document.getElementById('date').value,
        grade: document.getElementById('grade').value,
        image: imageUrl
    };
    
    memories.push(memory);
    localStorage.setItem('memories', JSON.stringify(memories));
    
    displayMemories();
    form.reset();
    modal.style.display = 'none';
}

// 将文件转换为 Data URL
function readFileAsDataURL(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

// 显示记忆卡片
function displayMemories(grade = 'all') {
    memoriesContainer.innerHTML = '';
    
    let filteredMemories = memories;
    if (grade !== 'all') {
        filteredMemories = memories.filter(memory => memory.grade === grade);
    }
    
    filteredMemories.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    filteredMemories.forEach(memory => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = `
            <img src="${memory.image}" alt="${memory.title}">
            <div class="content">
                <h3>${memory.title}</h3>
                <p>${memory.description}</p>
                <p class="date">${new Date(memory.date).toLocaleDateString()}</p>
            </div>
        `;
        memoriesContainer.appendChild(card);
    });
}

// 年级筛选
filterYear.onchange = (e) => {
    displayMemories(e.target.value);
}

// 初始化显示
displayMemories(); 