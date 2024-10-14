// 页面标识符，确保不同页面或组的按钮有不同的标识
const pageIdentifier = 'TieBreaker-1'; // SelectQuestion 页面标识符
const columns = 6; // 6列
const rows = 1; // 1行
const totalQuestions = columns * rows;

// 定义每个按钮的文本
const buttonTexts = [
    "10分",  // 第一个按钮的文字
    "20分",  // 第二个按钮的文字
    "30分",  // 第三个按钮的文字
    "40分",  // 第四个按钮的文字
    "50分",  // 第五个按钮的文字
    "60分"   // 第六个按钮的文字
];

// 获取按钮容器
const grid = document.querySelector('.grid');

// 动态生成题目按钮
for (let i = 0; i < totalQuestions; i++) {
    const questionItem = document.createElement('div');
    questionItem.classList.add('question-item');
    questionItem.id = `question-${pageIdentifier}-${i + 1}`;  // 使用页面标识符
    questionItem.setAttribute('data-index', i);
    
    // 使用数组中的文本替代按钮的编号
    questionItem.textContent = buttonTexts[i];

    // 添加点击事件，隐藏按钮并保存状态
    questionItem.addEventListener('click', function() {
        questionItem.classList.add('hidden');
        localStorage.setItem(`${pageIdentifier}-questionHidden-${i}`, 'true'); // 保存状态，带页面标识符
        window.location.href = `Quiz.html?index=${i}`;
    });

    // 检查 localStorage 中是否记录了隐藏状态
    if (localStorage.getItem(`${pageIdentifier}-questionHidden-${i}`) === 'true') {
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

// 监听“下一轮”按钮的点击事件，跳转到指定网页
// document.querySelector('.next-round-button').addEventListener('click', function() {
//     window.location.href = '../MultipleChoise/SelectQuestion.html'; // 确保链接正确
// });