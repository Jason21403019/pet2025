<template>
  <div class="index-page">
    <Nav />
    <Banner />
    <div
      class="questionnaire-container"
      :class="{ 'questionnaire-container--visible': showQuestionnaire }"
    >
      <Questionnaire
        v-if="showQuestionnaire"
        @questionnaire-completed="onSubmit"
      />
    </div>
    <Prize />
    <Act_area />
    <Footer />
    <ToTop />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, inject } from "vue";
import Banner from "../components/Banner.vue";
import Questionnaire from "../components/Questionnaire.vue";
import Nav from "../components/Nav.vue";
import Prize from "../components/Prize.vue";
import Act_area from "../components/Act_area.vue";
import Footer from "../components/Footer.vue";
import ToTop from "../components/ToTop.vue";
// 使用注入的狀態和方法
const showDialog = inject("showDialog", () => {});
const submitData = inject("submitData", () => {});

const showQuestionnaire = ref(false);

// 監聽問卷啟動事件
onMounted(() => {
  const handleQuestionnaireStart = () => {
    showQuestionnaire.value = true;
    nextTick(() => {
      scrollToQues();
    });
  };

  window.addEventListener("questionnaire-start", handleQuestionnaireStart);

  onBeforeUnmount(() => {
    window.removeEventListener("questionnaire-start", handleQuestionnaireStart);
  });
});

// 問卷提交處理
async function onSubmit(data) {
  try {
    console.log("收到問卷數據:", data);

    const result = await submitData(data.answers);

    if (result.status === "success") {
      // 設置問卷完成標記
      localStorage.setItem("pet2025_questionnaire_completed", "true");

      // 跳轉到完成頁面
      await navigateTo("/completed");
    } else {
      showDialog({
        icon: "error",
        title: "提交失敗",
        text: result.message || "請稍後再試",
        confirmButtonText: "確定",
        showCancelButton: false,
      });
    }
  } catch (error) {
    console.error("問卷提交錯誤:", error);

    showDialog({
      icon: "error",
      title: "系統錯誤",
      text: "請稍後再試",
      confirmButtonText: "確定",
      showCancelButton: false,
    });
  }
}

// 滾動到問卷區塊的函數
function scrollToQues() {
  const quesElement = document.querySelector(".ques");
  if (quesElement) {
    quesElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    console.log("已滾動到問卷區塊");
  } else {
    // 如果問卷元素還沒載入，延遲一點再試
    setTimeout(() => {
      const element = document.querySelector(".ques");
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        console.log("延遲滾動到問卷區塊");
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 90vh;
  background-image: url("/imgs/body_bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center top;
  @media screen and (max-width: 768px) {
    min-height: 100vh;
    background-image: url("/imgs/body_bg_m.jpg");
    background-size: cover;
    background-position: bottom;
    background-repeat: no-repeat;
  }
}

.questionnaire-container {
  padding: 20px 0 60px 0;
  background: transparent;
  min-height: 0;
  transition: all 0.3s ease;
  @media screen and (max-width: 460px) {
    padding: 20px 0 30px 0;
  }

  &--visible {
    min-height: 90vh;
  }
}

#__nuxt {
  position: relative;
  z-index: 1;
}
</style>
