document.addEventListener("DOMContentLoaded", () => {
    // 获取正确和错误答案声音元素
    let correctSound = document.getElementById('correct-sound');
    let wrongSound = document.getElementById('wrong-sound');
    
    // 获取 URL 参数中的题目序号和 tag
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // 获取传递的题目序号和 tag
    const questionIndex = getQueryParam('index');  // 从 URL 获取题目 index
    const tag = getQueryParam('tag'); // 从 URL 获取 tag
    let correctAnswer = '';
    let isMultiSelect = false;

    // 加载 CSV 文件并显示题目
    Papa.parse("../questions3.csv", {
        download: true,
        header: true,
        complete: function(results) {
            const questions = results.data;
            const filteredQuestions = questions.filter(question => question.tag === tag);
            const questionData = filteredQuestions[questionIndex];

            if (questionData) {
                loadQuestion(questionData);
            } else {
                document.getElementById("question-text").textContent = "未找到该题目。";
            }
        },
        error: function(err) {
            console.error("CSV 加载错误：", err);
            document.getElementById("question-text").textContent = "加载题目失败。";
        }
    });

    // 加载题目和选项
    function loadQuestion(questionData) {
        const fontSize = questionData.font_size ? `${questionData.font_size}px` : '40px';
        const questionText = document.getElementById("question-text");
        questionText.textContent = questionData.question;
        questionText.style.fontSize = fontSize;

        const optionsContainer = document.getElementById("options");
        optionsContainer.innerHTML = '';

        const options = questionData.options.split('|');
        correctAnswer = questionData.correct_answer.trim();  // 正确答案作为字符串
        isMultiSelect = (questionData.type === 'multiple');

        options.forEach((option, index) => {
            const optionElement = document.createElement("div");
            optionElement.innerHTML = `
                <input type="${isMultiSelect ? 'checkbox' : 'radio'}" id="option${index}" name="option" value="${String.fromCharCode(65 + index)}">
                <label for="option${index}" id="label${index}">${option}</label>
            `;
            optionElement.style.fontSize = fontSize;
            optionsContainer.appendChild(optionElement);

            // 添加点击事件监听器
            const optionInput = document.getElementById(`option${index}`);
            const optionLabel = document.getElementById(`label${index}`);

            optionInput.addEventListener('click', function() {
                if (!isMultiSelect) {
                    resetOptionColors();  // 单选题时重置所有选项的颜色
                }

                // 切换当前选项的文字颜色
                if (optionInput.checked) {
                    optionLabel.style.color = '#f5f5f6';  // 选中时设置为黑色
                } else {
                    optionLabel.style.color = '';  // 取消选中时恢复默认颜色
                }
            });            
        });

        // 监听键盘按键事件
        document.addEventListener('keydown', function(event) {
            const key = event.key.toUpperCase();

            // 检查是否按下了 A, B, C, D, E, F, G, H 对应的键
            const validKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            const index = validKeys.indexOf(key);
            
            if (index !== -1 && document.getElementById(`option${index}`)) {
                const optionInput = document.getElementById(`option${index}`);
                const optionLabel = document.getElementById(`label${index}`);

                // 如果是单选题，重置所有选项的文字颜色
                if (!isMultiSelect) {
                    resetOptionColors();
                }

                optionInput.checked = !optionInput.checked;  // 切换选中状态

                // 切换选项的文字颜色
                if (optionInput.checked) {
                    optionLabel.style.color = '#f5f5f6';  // 选中时变成黑色
                } else {
                    optionLabel.style.color = '';  // 取消选中时恢复默认颜色
                }
            }

            // 按下回车键时提交答案
            if (event.key === 'Enter') {
                submitAnswer();  // 调用提交答案函数
            }
        });
    }

    // 重置所有选项的文字颜色
    function resetOptionColors() {
        document.querySelectorAll('label').forEach(label => {
            label.style.color = '';  // 恢复默认颜色
        });
    }

    // 倒计时声音和结束声音
    let countdownSound = document.getElementById('countdown-sound');
    let endSound = document.getElementById('end-sound');
    let timerInterval;
    let timerRunning = false;  
    let isAnswerVisible = false;

    // 开始计时按钮功能
    document.getElementById("start-timer").addEventListener("click", () => {
        const timerElement = document.getElementById("timer");
        const answerText = document.getElementById("answer-text");

        if (timerRunning) {
            clearInterval(timerInterval);
            stopCountdownSound();
            timerElement.style.display = 'none';
            timerRunning = false;
        } else {
            timerRunning = true;
            let timeLeft = 30;  
            timerElement.textContent = `${timeLeft}`;
            timerElement.style.display = 'block';
            answerText.style.display = 'none'; 

            countdownSound.play();

            timerInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    timerElement.textContent = `${timeLeft}`;
                    countdownSound.currentTime = 0;  
                    countdownSound.play();  
                }

                if (timeLeft === 0) {
                    clearInterval(timerInterval);
                    stopCountdownSound();
                    timerElement.textContent = '0';  
                    timerRunning = false;
                    endSound.play();
                }
            }, 1000);  
        }
    });

    // 停止倒计时声音的函数
    function stopCountdownSound() {
        if (countdownSound) {
            countdownSound.pause();
            countdownSound.currentTime = 0;  
        }
    }

    // 提交答案的函数
    function submitAnswer() {
        const userAnswers = [];
        document.querySelectorAll('input[name="option"]:checked').forEach(input => {
            userAnswers.push(input.value);
        });
        const userAnswerString = userAnswers.sort().join('').trim();

        const answerText = document.getElementById("answer-text");
        const timerElement = document.getElementById("timer");  // 获取倒计时元素

        // 隐藏倒计时并停止声音，无论倒计时是否运行
        clearInterval(timerInterval);  // 清除倒计时
        stopCountdownSound();  // 停止倒计时声音
        timerElement.style.display = 'none';  // 隐藏倒计时文字
        timerRunning = false;  // 将倒计时状态设置为 false

        console.log("正确答案: ", correctAnswer);
        console.log("用户提交的答案: ", userAnswerString);

        if (userAnswerString === correctAnswer) {
            answerText.innerHTML = `回答正确<br>${correctAnswer}`;
            correctSound.play();
        } else {
            answerText.innerHTML = `回答错误<br>${correctAnswer}`;
            wrongSound.play();
        }

        answerText.style.display = 'block';
    }

    // 绑定提交按钮点击事件
    document.getElementById("submit-answer").addEventListener("click", submitAnswer);

    // 返回选题页面
    document.getElementById("select-question").addEventListener("click", () => {
        window.location.href = "SelectQuestion.html";
    });

    // 设置答案和倒计时的文字大小
    document.getElementById("answer-text").style.fontSize = "80px";  // 设置答案文字大小
    document.getElementById("timer").style.fontSize = "200px";  // 设置倒计时文字大小
});