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
    Papa.parse("../questions1.csv", {
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
            <label for="option${index}">${option}</label>
        `;
        optionElement.style.fontSize = fontSize;
        optionsContainer.appendChild(optionElement);
    });

    // 监听键盘按键事件
    document.addEventListener('keydown', function(event) {
        const key = event.key.toUpperCase();

        // 检查是否按下了 A, B, C, D, E, F, G, H 对应的键
        const validKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const index = validKeys.indexOf(key);
        
        if (index !== -1 && document.getElementById(`option${index}`)) {
            const optionInput = document.getElementById(`option${index}`);
            optionInput.checked = !optionInput.checked;  // 切换选中状态
        }

        // 按下回车键时提交答案
        if (event.key === 'Enter') {
            submitAnswer();  // 调用提交答案函数
        }
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

    // 提交答案的函数
    function submitAnswer() {
        const userAnswers = [];
        document.querySelectorAll('input[name="option"]:checked').forEach(input => {
            userAnswers.push(input.value);
        });
        const userAnswerString = userAnswers.sort().join('').trim();

        const answerText = document.getElementById("answer-text");

        console.log("正确答案: ", correctAnswer);
        console.log("用户提交的答案: ", userAnswerString);

        if (userAnswerString === correctAnswer) {
            answerText.textContent = `${correctAnswer}`;
            correctSound.play();
        } else {
            answerText.textContent = `${correctAnswer}`;
            wrongSound.play();
        }

        answerText.style.display = 'block';
    }

    // 显示答案并判断正确或错误
    function showAnswer() {
        const userAnswers = [];
        document.querySelectorAll('input[name="option"]:checked').forEach(input => {
            userAnswers.push(input.value);
        });
        const userAnswerString = userAnswers.sort().join('').trim();  // 将用户答案按字母顺序转为字符串

        const answerText = document.getElementById("answer-text");

        if (userAnswerString === correctAnswer) {
            answerText.textContent = `${correctAnswer}`;
            correctSound.play();  // 播放正确的声音
        } else {
            answerText.textContent = ` ${correctAnswer}`;
            wrongSound.play();  // 播放错误的声音
        }

        answerText.style.display = 'block';
        isAnswerVisible = true;
    }

    // D 键和 C 键功能
    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();

        if (key === 'y') {
            handleDKeyPress();
        } else if (key === 'n') {
            handleCKeyPress();
        }
    });

    function handleDKeyPress() {
        if (!isAnswerVisible) {
            showAnswer();  // 第一次按 Y 键显示答案
        } else {
            correctSound.play();  // 第二次按 Y 键播放正确答案提示音
        }
    }

    function handleCKeyPress() {
        if (!isAnswerVisible) {
            showAnswer();  // 第一次按 N 键显示答案
        } else {
            wrongSound.play();  // 第二次按 N 键播放错误答案提示音
        }
    }

    // 返回选题页面
    document.getElementById("select-question").addEventListener("click", () => {
        window.location.href = "SelectQuestion.html";  
    });
});