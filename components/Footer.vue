<template>
  <footer class="footer">
    <Nav_container>
      <div class="footer__container">
        <p class="footer__text">
          聯合線上公司 著作權所有© udn.com All Rights Reserved.
        </p>
      </div>
    </Nav_container>
  </footer>
</template>

<script setup>
// 如果需要的話可以加入邏輯
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  background-color: #f9b234;

  &__container {
    width: 100%;
    padding: 20px 0;
    text-align: center;

    @media (min-width: 768px) {
      padding: 40px 0;
    }
  }

  &__text {
    color: #fffbe1;
    font-size: 14px;
    margin: 0;
    line-height: 1.4;

    @media (min-width: 768px) {
      font-size: 16px;
    }
  }
}
</style>
