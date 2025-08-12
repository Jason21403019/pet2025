<template>
  <section class="prize">
    <!-- 標題區塊 -->
    <div class="prize__title">
      <img
        :src="getImgPath('prize_title.png')"
        alt="禮品區塊"
        class="prize__title-img"
      />
    </div>

    <!-- 禮品展示區域 -->
    <div class="prize__items">
      <div v-for="(item, index) in prizeItems" :key="index" class="prize__item">
        <div class="prize__item-image">
          <img
            :src="getImgPath(`prize${index + 1}.png`)"
            :alt="item.alt"
            :class="`prize__image prize__image--${index + 1}`"
          />
        </div>
        <div class="prize__item-text">
          <div class="prize__item-text-top">{{ item.title }}</div>
          <div class="prize__item-text-bottom">{{ item.subtitle }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, inject, onMounted, onBeforeUnmount } from "vue";

// 動態生成圖片路徑
function getImgPath(filename) {
  const config = useRuntimeConfig();
  const baseURL = config.app.baseURL || "/";
  return `${baseURL}imgs/${filename}`.replace(/\/+/g, "/");
}

const prizeItems = [
  {
    title: "汪喵精選",
    subtitle: "一年份貓砂",
    alt: "汪喵精選一年份貓砂",
  },
  {
    title: "汪喵精選",
    subtitle: "一年份尿布墊",
    alt: "汪喵精選一年份尿布墊",
  },
  {
    title: "榮獲IF設計獎",
    subtitle: "多功能緩衝牽繩",
    alt: "榮獲IF設計獎多功能緩衝牽繩",
  },
  {
    title: "汪喵商城",
    subtitle: "購物金$100",
    alt: "汪喵商城購物金$100",
  },
];
</script>

<style lang="scss" scoped>
.prize {
  padding: 0 12px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__title {
    text-align: center;
  }

  &__title-img {
    display: block;
    width: 100%;
    max-width: 290px;
    height: auto;

    @media (max-width: 460px) {
      content: url("/imgs/prize_title_m.png");
    }
  }

  &__items {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-top: 25px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    transition: all 0.3s ease;

    &:first-child {
      margin-left: 0;
    }

    &:nth-child(2) {
      margin-left: -50px;
    }

    &:nth-child(3) {
      margin-left: -30px;
    }

    &:nth-child(4) {
      margin-left: -30px;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      margin-left: 0 !important;
      margin-top: 20px;
      align-items: center;
      width: 100%;
      display: flex;
      justify-content: center;

      &:first-child {
        margin-top: 0;
        align-items: center;
        justify-content: center;

        .prize__image {
          margin-left: 20px;
          @media (max-width: 460px) {
            margin-left: 35px;
          }
        }
      }

      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4) {
        margin-left: 0 !important;
      }
    }

    &:hover {
      transform: translateY(-5px);
    }

    &-image {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      margin-bottom: 10px;

      @media (max-width: 768px) {
        width: 100%;
        justify-content: center;
        align-items: center;
      }
    }

    &-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      line-height: 1.4;
      color: #0c3d6d;

      &-top {
        font-size: 18px;
      }

      &-bottom {
        font-size: 20px;
        font-weight: 700;
      }
    }
  }

  &__image {
    object-fit: contain;
    transition: all 0.3s ease;
    display: block;

    &:hover {
      transform: scale(1.05);
    }

    &--1 {
      width: 289.5601px;
      height: 207.6921px;

      @media (max-width: 460px) {
        width: 269.5601px;
        height: 227.6921px;
      }
    }

    &--2 {
      width: 202.6921px;
      height: 246.1261px;

      @media (max-width: 460px) {
        width: 222.6921px;
        height: 266.1261px;
      }
    }

    &--3 {
      width: 289.5601px;
      height: 207.6921px;

      @media (max-width: 460px) {
        width: 299.5601px;
        height: 217.6921px;
      }
    }

    &--4 {
      width: 202.6921px;
      height: 246.1261px;

      @media (max-width: 460px) {
        width: 222.6921px;
        height: 266.1261px;
      }
    }
  }
}
</style>
