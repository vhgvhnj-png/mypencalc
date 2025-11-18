document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    const petTypeSelect = document.getElementById('petType');
    const birthDateInput = document.getElementById('birthDate');
    const resultDiv = document.getElementById('result');
    const formulaText = document.getElementById('formulaText');
    const petIconSpan = document.getElementById('petIcon'); // Icon 元素

    // Icon 映射
    const petIcons = {
        dog: '🐶',
        cat: '🐱'
    };

    // --- 1. localStorage 存儲與讀取功能 ---

    // 存儲結果到 localStorage
    function saveResult(petType, birthDate, resultHTML) {
        localStorage.setItem('lastPetType', petType);
        localStorage.setItem('lastBirthDate', birthDate);
        localStorage.setItem('lastResultHTML', resultHTML);
    }

    // 從 localStorage 讀取結果
    function loadResult() {
        const lastPetType = localStorage.getItem('lastPetType');
        const lastBirthDate = localStorage.getItem('lastBirthDate');
        const lastResultHTML = localStorage.getItem('lastResultHTML');

        if (lastResultHTML) {
            // 載入結果到顯示區
            resultDiv.innerHTML = lastResultHTML;
            
            // 載入上次的輸入值
            if (lastPetType) {
                petTypeSelect.value = lastPetType;
            }
            if (lastBirthDate) {
                birthDateInput.value = lastBirthDate;
            }
            
            // 更新 Icon 和公式顯示以匹配上次結果
            updatePetDisplay();
        } else {
            // 如果沒有儲存的結果，則顯示初始狀態
            updatePetDisplay();
            // 如果想要載入時自動計算當前日期，可以在這裡呼叫 calculatePetAge()
        }
    }


    // --- 2. 顯示更新功能 (Icon & Formula) ---

    // 更新 Icon 和公式顯示
    function updatePetDisplay() {
        const selectedPetType = petTypeSelect.value;
        
        // 更新 Icon
        petIconSpan.textContent = petIcons[selectedPetType] || '';
        
        // 更新公式文字
        if (selectedPetType === 'dog') {
            formulaText.innerHTML = `<strong style="color: #6a0572;">狗狗公式：</strong> $16 \times \ln(\text{狗狗年齡}) + 31 = \text{人類年齡}$`;
        } else {
            formulaText.innerHTML = `
                <strong style="color: #6a0572;">貓貓公式：</strong>
                <ul style="margin: 5px 0 0 20px; padding: 0; list-style-type: disc; text-align: left;">
                    <li>1歲 = 人類 15歲</li>
                    <li>2歲 = 人類 24歲 (再加 9歲)</li>
                    <li>2歲後，每年約加 4歲</li>
                </ul>
            `;
        }
    }

    // --- 3. 主要計算邏輯 ---

    function calculatePetAge() {
        const selectedPetType = petTypeSelect.value;
        const birthDateStr = birthDateInput.value;
        const birthDate = new Date(birthDateStr);
        const today = new Date();

        if (isNaN(birthDate.getTime())) { 
            resultDiv.innerHTML = '<p style="color: red;">請輸入有效的出生日期！</p>';
            return;
        }
        
        const diffTime = today.getTime() - birthDate.getTime();
        const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25; 
        const petAgeYearsFloat = diffTime / MS_PER_YEAR;

        let humanAge = 0;
        let petAgeDisplay = ''; 

        // 計算寵物的年/月/日（用於友善顯示）
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += lastMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        petAgeDisplay = `${years} 歲 ${months} 個月 ${days} 天`;

        if (petAgeYearsFloat <= 0) {
            humanAge = 0;
            petAgeDisplay = `0 歲 0 個月 0 天`;
        } else if (selectedPetType === 'dog') {
            humanAge = 16 * Math.log(petAgeYearsFloat) + 31;
            if (humanAge < 0) humanAge = 0; 
        } else if (selectedPetType === 'cat') {
            // 貓貓年齡換算公式
            if (petAgeYearsFloat < 1) { 
                humanAge = 15 * petAgeYearsFloat; 
            } else if (petAgeYearsFloat < 2) { 
                humanAge = 15 + (9 * (petAgeYearsFloat - 1));
            } else { 
                humanAge = 24 + (4 * (petAgeYearsFloat - 2));
            }
            if (humanAge < 0) humanAge = 0; 
        }
        
        // --- 顯示結果並儲存 ---
        const resultHTML = `
            <h2>✨ 恭喜！你的<span style="color:#FF7B54;">小寶貝</span>是 ✨</h2>
            <p><strong>實際年齡：</strong> ${petAgeDisplay}</p>
            <p><strong>換算人類年齡：</strong> <span style="font-size: 1.4em; color: #FF7B54; font-weight: 700;">${humanAge.toFixed(1)} 歲</span></p>
            <hr>
            <p style="font-size:0.9em; color:#666;">
                <small>（這個換算是一個近似值，不同品種和個體可能會有差異喔！）</small>
            </p>
        `;

        resultDiv.innerHTML = resultHTML;
        
        // 儲存結果
        saveResult(selectedPetType, birthDateStr, resultHTML);
    }

    // 事件監聽器
    petTypeSelect.addEventListener('change', updatePetDisplay);
    calculateBtn.addEventListener('click', calculatePetAge);

    // 頁面載入時執行：
    loadResult();
});