// 监听“下一轮”按钮的点击事件，跳转到指定网页
document.querySelector('.next-round-button').addEventListener('click', function() {
    window.location.href = 'next-round.html'; // 跳转到指定网页
});

// 设置列数和行数
const columns = 4;
const rows = 3;
const totalQuestions = columns * rows;

// 获取按钮容器
const grid = document.querySelector('.grid');

// 动态生成题目按钮
for (let i = 0; i < totalQuestions; i++) {
    const questionItem = document.createElement('div');
    questionItem.classList.add('question-item');
    questionItem.id = `question-${i + 1}`;
    questionItem.setAttribute('data-index', i);
    questionItem.textContent = `${i + 1}`;

    // 添加点击事件，隐藏按钮并保存状态
    questionItem.addEventListener('click', function() {
        questionItem.classList.add('hidden');
        localStorage.setItem(`questionHidden-${i}`, 'true');
        window.location.href = `Quiz.html?index=${i}`;
    });

    // 检查 localStorage 中是否记录了隐藏状态
    if (localStorage.getItem(`questionHidden-${i}`) === 'true') {
        questionItem.classList.add('hidden');
    }

    // 添加到 grid 容器中
    grid.appendChild(questionItem);
}

// 监听键盘事件，按下 "K" 键时重置按钮状态
document.addEventListener('keydown', function(event) {
    if (event.key.toLowerCase() === 'k') {
        document.querySelectorAll('.question-item').forEach(item => {
            const questionIndex = item.getAttribute('data-index');
            localStorage.removeItem(`questionHidden-${questionIndex}`);
            item.classList.remove('hidden');
        });
    }
});