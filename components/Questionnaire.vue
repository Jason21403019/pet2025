<template>
  <div class="ques" v-if="isVisible">
    <div class="ques__wrap">
      <!-- 問卷標題 -->
      <div class="ques__head">
        <h2 class="ques__title">寵物飼主調查問卷</h2>
        <p class="ques__sub">
          感謝您參與我們的問卷調查，您的意見對我們非常重要
        </p>
      </div>

      <!-- 問卷表單 -->
      <form @submit.prevent="submit" class="ques__form">
        <div class="ques__list">
          <div
            v-for="(q, index) in allQuestions"
            :key="q.id"
            class="q"
            :class="{
              'q--error': hasError(q.id),
            }"
          >
            <!-- 分類標題 -->
            <div v-if="q.category" class="q__cat">
              {{ q.category }}
            </div>

            <!-- 題目標題 -->
            <div class="q__head">
              <h3 class="q__title">
                {{ index + 1 }}. {{ q.text }}
                <span v-if="q.required" class="q__req">*</span>
              </h3>
            </div>

            <!-- 選項區域 -->
            <div class="q__opts">
              <!-- 單選題 -->
              <div v-if="q.type === 'single'" class="opts">
                <label
                  v-for="opt in q.options"
                  :key="opt.value"
                  class="opt"
                  :class="{
                    'opt--selected': isOptionSelected(q.id, opt.text, 'single'),
                  }"
                >
                  <input
                    type="radio"
                    :name="`q_${q.id}`"
                    :value="opt.text"
                    :checked="isOptionSelected(q.id, opt.text, 'single')"
                    @change="handleSingle(q.id, opt.text, opt.value)"
                    class="opt__input"
                  />
                  <span class="opt__text">{{ opt.text }}</span>
                </label>

                <!-- 單選題的其他說明輸入框 -->
                <div v-if="showOtherInput(q.id, 'single')" class="other-input">
                  <input
                    type="text"
                    :value="getOtherText(q.id, 'single')"
                    placeholder="請說明..."
                    class="other-input__field"
                    @input="handleOtherInput(q.id, $event, 'single')"
                  />
                </div>
              </div>

              <!-- 多選題 -->
              <div v-else-if="q.type === 'multiple'" class="opts">
                <label
                  v-for="opt in q.options"
                  :key="opt.value"
                  class="opt opt--check"
                  :class="{
                    'opt--selected': isOptionSelected(
                      q.id,
                      opt.text,
                      'multiple',
                    ),
                  }"
                >
                  <input
                    type="checkbox"
                    :value="opt.text"
                    :checked="isOptionSelected(q.id, opt.text, 'multiple')"
                    @change="handleMultiple(q.id, opt.text, opt.value)"
                    class="opt__input opt__input--check"
                  />
                  <span class="opt__text">{{ opt.text }}</span>
                </label>

                <!-- 多選題的其他說明輸入框 -->
                <div
                  v-if="showOtherInput(q.id, 'multiple')"
                  class="other-input"
                >
                  <input
                    type="text"
                    :value="getOtherText(q.id, 'multiple')"
                    placeholder="請說明..."
                    class="other-input__field"
                    @input="handleOtherInput(q.id, $event, 'multiple')"
                  />
                </div>
              </div>
            </div>

            <!-- 錯誤提示 -->
            <div v-if="hasError(q.id)" class="q__error">
              {{ getError(q.id) }}
            </div>
          </div>
        </div>

        <!-- 提交按鈕區域 -->
        <div class="ques__foot">
          <div class="ques__info">
            <p class="ques__note">
              <span class="ques__req">*</span> 為必填項目
            </p>
            <p class="ques__privacy">
              我們將嚴格保護您的隱私，問卷資料僅用於研究分析
            </p>
          </div>

          <button
            type="submit"
            class="ques__btn"
            :disabled="submitting || !canSubmit"
            :class="{ 'ques__btn--loading': submitting }"
          >
            <span v-if="!submitting">提交問卷</span>
            <span v-else class="ques__loading">
              <span class="ques__spinner"></span>
              提交中...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: true,
  },
});

// Emits
const emit = defineEmits(["questionnaire-completed"]);

// 響應式數據
const answers = ref({});
const errors = ref({});
const submitting = ref(false);

// 問卷題目數據
const questions = ref([
  // Part.1 飼主基本資訊
  {
    id: 1,
    category: "Part.1 飼主基本資訊",
    text: "您家毛孩是？",
    type: "single",
    required: true,
    options: [
      { value: 1, text: "狗狗" },
      { value: 2, text: "貓咪" },
      { value: 3, text: "狗貓都有" },
      { value: 4, text: "特寵（兔、鳥、鼠、爬蟲類等）" },
    ],
  },
  {
    id: 2,
    text: "您所飼養的寵物隻數？",
    type: "single",
    required: true,
    options: [
      { value: 1, text: "1隻" },
      { value: 2, text: "2隻" },
      { value: 3, text: "3隻" },
      { value: 4, text: "4隻(含)以上" },
    ],
  },
  {
    id: 3,
    text: "您所飼養的寵物年齡為？（可複選）",
    type: "multiple",
    required: true,
    options: [
      { value: 1, text: "0-1歲" },
      { value: 2, text: "1-7歲" },
      { value: 3, text: "7歲以上" },
    ],
  },
  // Part.2 飼主消費習慣
  {
    id: 4,
    category: "Part.2 飼主消費習慣",
    text: "您平均一個月花多少錢在寵物身上？",
    type: "single",
    required: true,
    options: [
      { value: 1, text: "1000元以下" },
      { value: 2, text: "1001-3000元" },
      { value: 3, text: "3001-5000元" },
      { value: 4, text: "5001-10000元" },
      { value: 5, text: "10000元以上" },
    ],
  },
  {
    id: 5,
    text: "您通常在哪些管道購買寵物用品？（可複選）",
    type: "multiple",
    required: true,
    options: [
      { value: 1, text: "寵物實體商店" },
      { value: 2, text: "網路電商平台" },
      { value: 3, text: "超市／量販店／生活百貨" },
      { value: 4, text: "動物醫院售出的商品" },
      { value: 5, text: "寵物展" },
      { value: 6, text: "其他（請說明）" },
    ],
  },
  {
    id: 6,
    text: "您最常購買的寵物用品類型是？（可複選）",
    type: "multiple",
    required: true,
    options: [
      { value: 1, text: "寵物乾糧" },
      { value: 2, text: "寵物濕糧" },
      { value: 3, text: "寵物零食 (如潔牙骨、凍乾)" },
      {
        value: 4,
        text: "寵物居家用品（如狗窩、貓砂、砂盆、食器、牽繩、寵物推車、提籠等）",
      },
      { value: 5, text: "清潔美容用品（洗毛精、指甲剪、潔耳液、毛梳等）" },
      {
        value: 6,
        text: "娛樂與玩具（如服飾配件、逗貓棒、跳台、抓板、藏食玩具等）",
      },
      { value: 7, text: "醫療與健康檢查" },
      { value: 8, text: "營養保健食品與藥物" },
      {
        value: 9,
        text: "智能家電（如自動餵食機、自動飲水機、自動貓砂機、寵物攝影機等）",
      },
      { value: 10, text: "寵物保險" },
      { value: 11, text: "寵物美容" },
      { value: 12, text: "寵物旅館" },
      { value: 13, text: "其他（請說明）" },
    ],
  },
  {
    id: 7,
    text: "選購寵物產品時，您最重視的因素是？（可複選）",
    type: "multiple",
    required: true,
    options: [
      { value: 1, text: "價格" },
      { value: 2, text: "品質／成分" },
      { value: 3, text: "品牌知名度" },
      { value: 4, text: "好評／網路推薦" },
      { value: 5, text: "國產或進口來源" },
      { value: 6, text: "包裝設計" },
      { value: 7, text: "寵物喜好" },
      { value: 8, text: "其他（請說明）" },
    ],
  },
  {
    id: 8,
    text: "什麼因素會影響您嘗試購買新的產品給毛孩？（可複選）",
    type: "multiple",
    required: true,
    options: [
      { value: 1, text: "獸醫、專業人士推薦" },
      { value: 2, text: "名人、網紅推薦" },
      { value: 3, text: "新聞媒體報導" },
      { value: 4, text: "親友推薦" },
      { value: 5, text: "促銷優惠" },
      { value: 6, text: "其他（請說明）" },
    ],
  },
  // Part.3 寵物保健食品
  {
    id: 9,
    category: "Part.3 寵物保健食品",
    text: "您是否有幫寵物補充營養保健食品？",
    type: "single",
    required: true,
    options: [
      { value: 1, text: "有，正在使用" },
      { value: 2, text: "曾經使用，但現在沒有" },
      { value: 3, text: "從未使用過" },
    ],
  },
  {
    id: 10,
    text: "您會想提供營養保健食品給寵物的主要原因是什麼？（可複選）",
    type: "multiple",
    required: true,
    options: [
      { value: 1, text: "腸胃道保健" },
      { value: 2, text: "皮毛保健" },
      { value: 3, text: "骨骼關節保健" },
      { value: 4, text: "牙齒保健" },
      { value: 5, text: "心血管保健" },
      { value: 6, text: "視力保健" },
      { value: 7, text: "肝／腎保健" },
      { value: 8, text: "呼吸道保健" },
      { value: 9, text: "情緒舒緩保健" },
      { value: 10, text: "其他（請說明）" },
    ],
  },
  {
    id: 11,
    text: "您會希望提供給寵物哪種形式的營養保健食品？（可複選）",
    type: "multiple",
    required: true,
    options: [
      { value: 1, text: "粉末" },
      { value: 2, text: "錠劑" },
      { value: 3, text: "膠囊" },
      { value: 4, text: "藥水" },
      { value: 5, text: "結合飼料型" },
      { value: 6, text: "結合零食型" },
      { value: 7, text: "沒特別偏好，以寵物接受度為主" },
    ],
  },
  {
    id: 12,
    text: "您選擇寵物營養保健食品最在意什麼？（可複選）",
    type: "multiple",
    required: true,
    options: [
      { value: 1, text: "寵物品種、年齡、需求" },
      { value: 2, text: "成分標示完整" },
      { value: 3, text: "價格合理" },
      { value: 4, text: "製造地與來源" },
      { value: 5, text: "品牌信任度" },
      { value: 6, text: "飼主社群或網友好評" },
      { value: 7, text: "其他（請說明）" },
    ],
  },
  {
    id: 13,
    text: "您會想透過哪些方式了解寵物營養保健食品資訊？（可複選）",
    type: "multiple",
    required: true,
    options: [
      { value: 1, text: "醫師／獸醫建議" },
      { value: 2, text: "網路評測文（部落格、寵物媒體網站）" },
      { value: 3, text: "社群媒體（FB/IG等）" },
      { value: 4, text: "飼主社團／論壇內分享" },
      { value: 5, text: "網購平台的用戶評論" },
      { value: 6, text: "親友推薦" },
      { value: 7, text: "廠商廣告" },
      { value: 8, text: "其他（請說明）" },
    ],
  },
  {
    id: 14,
    text: "您一個月願意花多少錢買寵物營養保健食品？",
    type: "single",
    required: true,
    options: [
      { value: 1, text: "500元以下" },
      { value: 2, text: "501-1000元" },
      { value: 3, text: "1001-2000元" },
      { value: 4, text: "2000元以上" },
    ],
  },
  {
    id: 15,
    text: "「就您認知，最具有健康形象的寵物食品品牌為何？」",
    type: "single",
    required: true,
    options: [
      { value: 1, text: "皇家" },
      { value: 2, text: "希爾斯" },
      { value: 3, text: "汪喵星球" },
      { value: 4, text: "法米納" },
      { value: 5, text: "瑞威" },
      { value: 6, text: "怪獸部落" },
      { value: 7, text: "無敵貓糧" },
      { value: 8, text: "其他（點擊後自行填寫）" },
    ],
  },
]);

// 輔助函數：根據選項的中文找到對應的 value（保留但可能不再需要）
const getValueByText = (questionId, text) => {
  const question = questions.value.find((q) => q.id === questionId);
  if (!question) return null;

  const option = question.options.find((opt) => opt.text === text);
  return option ? option.value : null;
};

// 計算屬性：所有題目（移除跳過邏輯）
const allQuestions = computed(() => {
  return questions.value.map((question) => {
    return {
      ...question,
      isSkipped: false, // 所有题目都不跳过
    };
  });
});

// 計算屬性：檢查是否可以提交（所有必填題目都要回答）
const canSubmit = computed(() => {
  const requiredQuestions = allQuestions.value.filter((q) => q.required);

  return requiredQuestions.every((question) => {
    const answer = answers.value[question.id];

    if (question.type === "multiple") {
      return Array.isArray(answer) && answer.length > 0;
    }

    return answer !== undefined && answer !== null && answer !== "";
  });
});

// 檢查選項是否被選中
const isOptionSelected = (questionId, optionText, type) => {
  const answer = answers.value[questionId];

  if (type === "single") {
    if (!answer) return false;
    // 檢查是否為"其他"選項或包含"其他："前綴的答案
    if (optionText.includes("其他")) {
      return answer === optionText || answer.startsWith("其他：");
    }
    return answer === optionText;
  } else if (type === "multiple") {
    if (!Array.isArray(answer)) return false;
    // 檢查是否為"其他"選項或包含"其他："前綴的答案
    if (optionText.includes("其他")) {
      return answer.some(
        (item) => item === optionText || item.startsWith("其他："),
      );
    }
    return answer.includes(optionText);
  }

  return false;
};

// 檢查是否需要顯示"其他"輸入框
const showOtherInput = (questionId, type) => {
  const answer = answers.value[questionId];

  if (type === "single") {
    return answer && (answer.includes("其他") || answer.startsWith("其他："));
  } else if (type === "multiple") {
    return (
      Array.isArray(answer) &&
      answer.some(
        (item) => item && (item.includes("其他") || item.startsWith("其他：")),
      )
    );
  }

  return false;
};

// 獲取"其他"選項的文本內容
const getOtherText = (questionId, type) => {
  const answer = answers.value[questionId];

  if (type === "single") {
    if (answer && answer.startsWith("其他：")) {
      return answer.substring(3); // 移除"其他："前綴
    }
  } else if (type === "multiple") {
    if (Array.isArray(answer)) {
      const otherItem = answer.find(
        (item) => item && item.startsWith("其他："),
      );
      if (otherItem) {
        return otherItem.substring(3); // 移除"其他："前綴
      }
    }
  }

  return "";
};

// 處理"其他"輸入框的變更
const handleOtherInput = (questionId, event, type) => {
  const inputText = event.target.value;
  const answer = answers.value[questionId];

  if (type === "single") {
    // 單選：直接更新答案
    if (inputText.trim()) {
      answers.value[questionId] = `其他：${inputText}`;
    } else {
      // 如果輸入為空，保持原來的"其他"選項
      const question = allQuestions.value.find((q) => q.id === questionId);
      const otherOption = question.options.find((opt) =>
        opt.text.includes("其他"),
      );
      answers.value[questionId] = otherOption?.text || "";
    }
  } else if (type === "multiple") {
    // 多選：更新數組中的"其他"項目
    if (!Array.isArray(answers.value[questionId])) {
      answers.value[questionId] = [];
    }

    // 移除舊的"其他"項目
    answers.value[questionId] = answers.value[questionId].filter(
      (item) => !item.includes("其他"),
    );

    // 添加新的"其他"項目
    if (inputText.trim()) {
      answers.value[questionId].push(`其他：${inputText}`);
    } else {
      // 如果輸入為空，添加原來的"其他"選項
      const question = allQuestions.value.find((q) => q.id === questionId);
      const otherOption = question.options.find((opt) =>
        opt.text.includes("其他"),
      );
      if (otherOption) {
        answers.value[questionId].push(otherOption.text);
      }
    }
  }

  // 清除該題目的錯誤
  if (errors.value[questionId]) {
    delete errors.value[questionId];
  }
};

// 單選答案變更處理
const handleSingle = (questionId, text, value) => {
  answers.value[questionId] = text;

  // 清除該題目的錯誤
  if (errors.value[questionId]) {
    delete errors.value[questionId];
  }
};

// 多選題答案變更處理
const handleMultiple = (questionId, text, value) => {
  // 確保答案是數組格式
  if (!Array.isArray(answers.value[questionId])) {
    answers.value[questionId] = [];
  }

  const currentAnswers = answers.value[questionId];

  // 如果是"其他"選項，特殊處理
  if (text.includes("其他")) {
    const hasOtherVariant = currentAnswers.some((item) =>
      item.includes("其他"),
    );

    if (hasOtherVariant) {
      // 移除所有"其他"相關項目
      answers.value[questionId] = currentAnswers.filter(
        (item) => !item.includes("其他"),
      );
    } else {
      // 添加"其他"選項
      answers.value[questionId].push(text);
    }
  } else {
    // 一般選項的切換
    const index = currentAnswers.indexOf(text);
    if (index > -1) {
      answers.value[questionId].splice(index, 1);
    } else {
      answers.value[questionId].push(text);
    }
  }

  // 清除錯誤
  if (errors.value[questionId]) {
    delete errors.value[questionId];
  }
};

// 檢查多選題選項是否被選中（保留兼容性）
const isOptSelected = (questionId, optText) => {
  return isOptionSelected(questionId, optText, "multiple");
};

// 檢查題目是否有錯誤
const hasError = (questionId) => {
  return !!errors.value[questionId];
};

// 獲取錯誤訊息
const getError = (questionId) => {
  return errors.value[questionId] || "";
};

// 驗證答案（包括"其他"選項的文本驗證）
const validate = () => {
  errors.value = {};
  let isValid = true;

  allQuestions.value.forEach((question) => {
    // 驗證所有必填題目
    if (question.required) {
      const answer = answers.value[question.id];

      if (question.type === "multiple") {
        if (!Array.isArray(answer) || answer.length === 0) {
          errors.value[question.id] = "請至少選擇一個選項";
          isValid = false;
        } else {
          // 檢查"其他"選項是否有說明文字
          const hasIncompleteOther = answer.some(
            (item) => item && item.includes("其他") && !item.includes("："),
          );
          if (hasIncompleteOther) {
            errors.value[question.id] = "選擇其他選項時，請填寫說明內容";
            isValid = false;
          }
        }
      } else if (answer === undefined || answer === null || answer === "") {
        errors.value[question.id] = "此為必填項目，請選擇答案";
        isValid = false;
      } else {
        // 檢查單選"其他"選項是否有說明文字
        if (answer.includes("其他") && !answer.includes("：")) {
          errors.value[question.id] = "選擇其他選項時，請填寫說明內容";
          isValid = false;
        }
      }
    }
  });

  return isValid;
};

// 提交問卷
const submit = async () => {
  if (!validate()) {
    const firstError = document.querySelector(".q--error");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  submitting.value = true;

  try {
    const submitData = {
      answers: answers.value, // 所有答案都在同一個對象中，包括"其他"的說明
      completedQuestions: allQuestions.value.map((q) => q.id),
      skippedQuestions: [],
    };

    console.log("提交問卷數據:", submitData);

    // 模擬 API 調用
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 通知父組件
    emit("questionnaire-completed", submitData);
  } catch (error) {
    console.error("提交問卷失敗:", error);
  } finally {
    submitting.value = false;
  }
};

// 初始化多選題答案
onMounted(() => {
  questions.value.forEach((question) => {
    if (question.type === "multiple") {
      answers.value[question.id] = [];
    }
  });
});
</script>

<style lang="scss" scoped>
.ques {
  margin-top: 80px;
  width: 100%;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  padding: 40px 20px;
  box-sizing: border-box;
}

.ques__wrap {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.ques__head {
  background: linear-gradient(135deg, #9eaec0 0%, #8a9ba8 100%);
  color: white;
  padding: 40px 30px;
  text-align: center;
}

.ques__title {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.ques__sub {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
  line-height: 1.5;
}

.ques__form {
  padding: 40px 30px;
}

.ques__list {
  margin-bottom: 40px;
}

.q {
  margin-bottom: 40px;
  padding: 30px;
  border: 2px solid #f0f0f0;
  border-radius: 15px;
  background: #fafafa;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: #e0e0e0;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }

  &--error {
    border-color: #ff4d4f;
    background: #fff2f2;
  }
}

.q__cat {
  font-size: 18px;
  font-weight: bold;
  color: #9eaec0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
}

.q__head {
  margin-bottom: 20px;
}

.q__title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
}

.q__req {
  color: #ff4d4f;
  margin-left: 4px;
}

.opts {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.opt {
  display: flex;
  align-items: flex-start;
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #d4c5a9;
    background: #faf8f4;
  }

  &--selected {
    border-color: #d4c5a9;
    background: #f5f2ec;
    box-shadow: 0 2px 8px rgba(212, 197, 169, 0.3);
  }
}

.opt__input {
  margin-right: 12px;
  margin-top: 2px;
  width: 18px;
  height: 18px;
  accent-color: #d4c5a9;
  flex-shrink: 0;

  &--check {
    border-radius: 4px;
  }
}

.opt__text {
  flex: 1;
  font-size: 16px;
  color: #333;
  line-height: 1.4;
}

.q__error {
  margin-top: 8px;
  padding: 8px 12px;
  background: #fff2f2;
  border: 1px solid #ffccc7;
  border-radius: 6px;
  color: #ff4d4f;
  font-size: 14px;
}

.ques__foot {
  border-top: 1px solid #f0f0f0;
  padding-top: 30px;
  text-align: center;
}

.ques__info {
  margin-bottom: 30px;
}

.ques__note {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
}

.ques__req {
  color: #ff4d4f;
}

.ques__privacy {
  font-size: 12px;
  color: #999;
  margin: 0;
  line-height: 1.4;
}

.ques__btn {
  background: linear-gradient(135deg, #9eaec0 0%, #8a9ba8 100%);
  color: white;
  border: none;
  padding: 18px 50px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(158, 174, 192, 0.4);
  min-width: 200px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(158, 174, 192, 0.5);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &--loading {
    cursor: wait;
  }
}

.ques__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.ques__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// "其他"選項輸入框樣式
.other-input {
  margin-top: 12px;
  padding-left: 30px; // 與選項對齊

  &__field {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    color: #333;
    background: #fff;
    transition: all 0.3s ease;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #d4c5a9;
      box-shadow: 0 0 0 3px rgba(212, 197, 169, 0.1);
    }

    &::placeholder {
      color: #999;
      font-style: italic;
    }
  }
}

// 響應式設計
@media (max-width: 768px) {
  .ques {
    padding: 20px 10px;
  }

  .ques__head {
    padding: 30px 20px;
  }

  .ques__title {
    font-size: 24px;
  }

  .ques__sub {
    font-size: 14px;
  }

  .ques__form {
    padding: 30px 20px;
  }

  .q {
    padding: 20px;
    margin-bottom: 30px;
  }

  .q__title {
    font-size: 16px;
  }

  .opt {
    padding: 12px 15px;
  }

  .opt__text {
    font-size: 14px;
  }

  .ques__btn {
    padding: 15px 40px;
    font-size: 16px;
  }

  .other-input {
    padding-left: 20px;
    margin-top: 10px;

    &__field {
      padding: 10px 12px;
      font-size: 13px;
    }
  }
}
</style>
