// 设置 pageIdentifier 和 tag 相同
const pageIdentifier = '第四组加赛题'; // 使用统一的标识符
const tag = pageIdentifier;  // tag 与 pageIdentifier 相同

// 函数用于查询 tag 的值
function getTag() {
    return tag; // 返回当前 tag 的值
}

// 监听“下一轮”按钮的点击事件，跳转到指定网页
document.querySelector('.next-round-button').addEventListener('click', function() {
    window.location.href = '/index.html';  // 确保链接正确
});

// 获取按钮容器
const grid = document.querySelector('.grid');

// 加载 CSV 文件并根据 tag 过滤题目
Papa.parse("../questions4.csv", {
    download: true,
    header: true,
    complete: function(results) {
        const questions = results.data;
        const filteredQuestions = questions.filter(question => question.tag === tag); // 筛选匹配的题目

        if (filteredQuestions.length > 0) {
            loadButtons(filteredQuestions);  // 动态生成按钮
        } else {
            console.error("未找到对应的题目");
            grid.innerHTML = "未找到对应的题目"; // 在界面上显示提示
        }
    },
    error: function(err) {
        console.error("CSV 加载错误：", err);
    }
});

// 动态生成按钮并设置点击事件
function loadButtons(questions) {
    questions.forEach((question, index) => {
        const questionItem = document.createElement('div');
        questionItem.classList.add('question-item');
        questionItem.id = `question-${pageIdentifier}-${index + 1}`;  // 使用页面标识符
        questionItem.setAttribute('data-index', index);  // 使用当前数组中的索引
        questionItem.textContent = `${index + 1}`;  // 显示题目按钮文本

        // 添加点击事件，隐藏按钮并保存状态
        questionItem.addEventListener('click', function() {
            questionItem.classList.add('hidden');
            localStorage.setItem(`${pageIdentifier}-questionHidden-${index}`, 'true');  // 保存状态，带页面标识符
            window.location.href = `Quiz.html?index=${index}&tag=${tag}`;  // 传递当前数组中的索引和 tag
        });

        // 检查 localStorage 中是否记录了隐藏状态
        if (localStorage.getItem(`${pageIdentifier}-questionHidden-${index}`) === 'true') {
            questionItem.classList.add('hidden');
        }

        // 添加到 grid 容器中
        grid.appendChild(questionItem);
    });
}

// 监听键盘事件，按下 "K" 键时重置按钮状态
document.addEventListener('keydown', function(event) {
    if (event.key.toLowerCase() === 'k') {
        document.querySelectorAll('.question-item').forEach(item => {
            const questionIndex = item.getAttribute('data-index');
            localStorage.removeItem(`${pageIdentifier}-questionHidden-${questionIndex}`);
            item.classList.remove('hidden');  // 重置隐藏的按钮
        });
    }

    // 监听 "P" 键，按下 "P" 键时清除所有页面的按钮状态
    if (event.key.toLowerCase() === 'p') {
        localStorage.clear();  // 清除所有 localStorage 数据
        document.querySelectorAll('.question-item').forEach(item => {
            item.classList.remove('hidden');  // 显示所有按钮
        });
    }
});