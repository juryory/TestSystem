// 页面标识符，确保不同页面或组的按钮有不同的标识
const pageIdentifier = 'index'; // index 页面标识符，确保与其他页面不同
const columns = 5; // 5列
const rows = 1; // 1行
const totalQuestions = columns * rows;

// 按钮对应的跳转链接
const links = [
    '../page/Team1/010-SingleChoice/SelectQuestion.html',  // 第一个按钮的跳转地址
    '../page/Team2/010-SingleChoice/SelectQuestion.html',  // 第二个按钮的跳转地址
    '../page/Team3/010-SingleChoice/SelectQuestion.html',  // 第三个按钮的跳转地址
    '../page/Team4/010-SingleChoice/SelectQuestion.html',  // 第四个按钮的跳转地址
    '../page/Team5/010-SingleChoice/SelectQuestion.html'   // 第五个按钮的跳转地址
];

// 获取按钮容器
const grid = document.querySelector('.grid');

// 动态生成按钮
for (let i = 0; i < totalQuestions; i++) {
    const questionItem = document.createElement('div');
    questionItem.classList.add('question-item');
    questionItem.id = `question-${pageIdentifier}-${i + 1}`;  // 使用页面标识符
    questionItem.setAttribute('data-index', i);
    questionItem.textContent = `第${i + 1}组`;

    // 添加点击事件，隐藏按钮并保存状态
    questionItem.addEventListener('click', function() {
        // questionItem.classList.add('hidden');
        localStorage.setItem(`${pageIdentifier}-questionHidden-${i}`, 'true'); // 保存状态，带页面标识符
        window.location.href = links[i]; // 跳转到对应页面
    });

    // 检查 localStorage 中是否记录了隐藏状态
    // if (localStorage.getItem(`${pageIdentifier}-questionHidden-${i}`) === 'true') {
    //     questionItem.classList.add('hidden');
    // }

    // 添加到 grid 容器中
    grid.appendChild(questionItem);
}

// 监听键盘事件，按下 "K" 键时重置按钮状态
document.addEventListener('keydown', function(event) {
    if (event.key.toLowerCase() === 'k') {
        document.querySelectorAll('.question-item').forEach(item => {
            const questionIndex = item.getAttribute('data-index');
            localStorage.removeItem(`${pageIdentifier}-questionHidden-${questionIndex}`);
            item.classList.remove('hidden');
        });
    }

    // 监听 "P" 键，按下 "P" 键时清除所有页面的按钮状态
    if (event.key.toLowerCase() === 'p') {
        localStorage.clear(); // 清除 localStorage 中的所有数据
        document.querySelectorAll('.question-item').forEach(item => {
            item.classList.remove('hidden'); // 显示所有按钮
        });
    }
});