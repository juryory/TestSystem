document.addEventListener("DOMContentLoaded", () => {
    // 获取 URL 参数中的题目序号
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // 获取传递的题目序号
    const questionIndex = getQueryParam('index');
    let correctAnswer = '';
    let isMultiSelect = false;

    // 加载 CSV 文件并显示对应题目
    Papa.parse("data/Quiz.csv", {
        download: true,
        header: true,
        complete: function(results) {
            const questions = results.data;
            const questionData = questions[questionIndex];
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
        document.getElementById("question-text").textContent = questionData.question;

        const optionsContainer = document.getElementById("options");
        optionsContainer.innerHTML = '';

        const options = questionData.options.split('|');
        correctAnswer = questionData.correct_answer.split('|'); // 正确答案可能为多选
        isMultiSelect = (questionData.type === 'multiple'); // 判断题型是否为多选

        options.forEach(option => {
            const optionElement = document.createElement("div");
            optionElement.innerHTML = `
                <input type="${isMultiSelect ? 'checkbox' : 'radio'}" name="option" value="${option}"> ${option}
            `;
            optionsContainer.appendChild(optionElement);
        });
    }

    let timerInterval;
    let timerRunning = false;  // 用于追踪倒计时是否已经开始
    let countdownSound = document.getElementById('countdown-sound');
    let correctSound = document.getElementById('correct-sound');
    let wrongSound = document.getElementById('wrong-sound');
    let isAnswerVisible = false; // 用于追踪答案是否已显示

    // 开始计时按钮功能
    document.getElementById("start-timer").addEventListener("click", () => {
        const timerElement = document.getElementById("timer");

        if (timerRunning) {
            // 再次点击时：停止倒计时并隐藏倒计时文字
            clearInterval(timerInterval);
            stopCountdownSound();
            timerElement.style.display = 'none';
            timerRunning = false;
        } else {
            // 第一次点击时：开始计时并播放倒计时声音
            timerRunning = true;
            let timeLeft = 5;
            timerElement.textContent = `${timeLeft}`;
            timerElement.style.display = 'block';
            countdownSound.play();

            timerInterval = setInterval(() => {
                timeLeft--;
                timerElement.textContent = `${timeLeft}`;
                if (timeLeft === 0) {
                    clearInterval(timerInterval);
                    stopCountdownSound();
                    timerElement.style.display = 'none';
                    timerRunning = false;
                }
            }, 1000);
        }
    });

    // 提交并查看答案按钮功能
    document.getElementById("submit-answer").addEventListener("click", () => {
        if (timerRunning) {
            clearInterval(timerInterval);  // 停止倒计时
            stopCountdownSound();  // 停止倒计时声音
            timerRunning = false;  // 重置标志
        }
        showAnswer();
    });

    // 显示答案
    function showAnswer() {
        const userAnswers = [];
        document.querySelectorAll('input[name="option"]:checked').forEach(input => {
            userAnswers.push(input.value);
        });

        const answerText = document.getElementById("answer-text");

        // 判断是否正确
        if (arraysEqual(userAnswers.sort(), correctAnswer.sort())) {
            answerText.textContent = `${correctAnswer.join(', ')}`;
        } else {
            answerText.textContent = `${correctAnswer.join(', ')}`;
        }

        answerText.style.display = 'block';
        isAnswerVisible = true;
    }

    // 停止倒计时声音的函数
    function stopCountdownSound() {
        if (countdownSound) {
            countdownSound.pause();
            countdownSound.currentTime = 0;  // 重置音频播放进度
        }
    }

    // D 键和 C 键功能
    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();

        if (key === 'd') {
            handleDKeyPress();
        } else if (key === 'c') {
            handleCKeyPress();
        }
    });

    function handleDKeyPress() {
        if (!isAnswerVisible) {
            showAnswer();  // 第一次按 D 键显示答案
        } else {
            correctSound.play();  // 第二次按 D 键播放正确答案提示音
        }
    }

    function handleCKeyPress() {
        if (!isAnswerVisible) {
            showAnswer();  // 第一次按 C 键显示答案
        } else {
            wrongSound.play();  // 第二次按 C 键播放错误答案提示音
        }
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
        window.location.href = "../PointSelection/PointSelection.html"; // 请确保此路径正确指向选题页面
    });
});