document.addEventListener("DOMContentLoaded", () => {
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

    // 加载 CSV 文件并显示对应题目
    Papa.parse("../questions1.csv", {
        download: true,
        header: true,
        complete: function(results) {
            const questions = results.data;
            // 根据 tag 筛选题目
            const filteredQuestions = questions.filter(question => question.tag === tag);
            const questionData = filteredQuestions[questionIndex]; // 从筛选后的题目中获取

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

    // 加载题目和选项到页面
    function loadQuestion(questionData) {
        const fontSize = questionData.font_size ? `${questionData.font_size}px` : '40px';  // 设置字体大小
        const questionText = document.getElementById("question-text");
        questionText.textContent = questionData.question;
        questionText.style.fontSize = fontSize;  // 应用自定义的字体大小

        const optionsContainer = document.getElementById("options");
        optionsContainer.innerHTML = ''; // 清空选项容器

        const options = questionData.options.split('|');
        correctAnswer = questionData.correct_answer.split('|');
        isMultiSelect = (questionData.type === 'multiple');

        // 动态生成选项并设置字体大小
        options.forEach(option => {
            const optionElement = document.createElement("div");
            optionElement.innerHTML = `
                <input type="${isMultiSelect ? 'checkbox' : 'radio'}" name="option" value="${option}"> ${option}
            `;
            optionElement.style.fontSize = fontSize;  // 设置选项字体大小
            optionsContainer.appendChild(optionElement);
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
            let timeLeft = 5;  
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

    // 提交并查看答案按钮功能
    document.getElementById("submit-answer").addEventListener("click", () => {
        const timerElement = document.getElementById("timer");
        const answerText = document.getElementById("answer-text");

        if (timerRunning) {
            clearInterval(timerInterval);
            stopCountdownSound();
            timerRunning = false;
        }
        timerElement.style.display = 'none';  
        showAnswer();
    });

    // 显示答案
    function showAnswer() {
        const userAnswers = [];
        document.querySelectorAll('input[name="option"]:checked').forEach(input => {
            userAnswers.push(input.value);
        });

        const answerText = document.getElementById("answer-text");

        if (arraysEqual(userAnswers.sort(), correctAnswer.sort())) {
            answerText.textContent = `${correctAnswer.join(', ')}`;
        } else {
            answerText.textContent = `${correctAnswer.join(', ')}`;
        }

        answerText.style.display = 'block';
        isAnswerVisible = true;
    }

    // 判断两个数组是否相等
    function arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    // 返回选题页面
    document.getElementById("select-question").addEventListener("click", () => {
        window.location.href = "SelectQuestion.html";  
    });
});