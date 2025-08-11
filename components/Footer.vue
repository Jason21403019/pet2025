<template>
  <footer class="footer">
    <div class="footer__dogcat">
      <img src="/imgs/dogcat.png" alt="dogcat" class="footer__dogcat-img" />
    </div>
    <div class="footer__container">
      <p class="footer__text">
        聯合線上公司 著作權所有<br class="footer__text-br" />© udn.com All
        Rights Reserved.
      </p>
    </div>
  </footer>
</template>

<script setup></script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  background-color: #f9b234;
  position: relative;

  &__dogcat {
    position: absolute;
    top: -40px;
    left: 30%;
    transform: translate(-50%, -50%);
    z-index: 10;
    @media (max-width: 768px) {
      left: 20%;
    }
    @media (max-width: 460px) {
      left: 50%;
    }
    &-img {
      width: auto;
      height: 80px;
      display: block;

      @media (max-width: 460px) {
        height: 80px;
      }
    }
  }

  &__container {
    width: 100%;
    padding: 10px 0;
    text-align: center;
    padding-top: 40px;

    @media (min-width: 768px) {
      padding: 50px 0 40px 0;
    }
  }

  &__text {
    color: #fffbe1;
    font-size: 14px;
    margin: 0;
    line-height: 1.4;
    .footer__text-br {
      display: none;
      @media (max-width: 460px) {
        display: block;
      }
    }

    @media (min-width: 768px) {
      font-size: 16px;
    }
  }
}
</style>
