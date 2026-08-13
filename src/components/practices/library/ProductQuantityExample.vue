<script setup>
import { ref, computed } from 'vue'

const productQuantity = ref(1) // 수량 카운터 기본값
const productRate = ref(4) // 별점 기본값 (별 4개)

const summaryText = computed(
  () =>
    `실시간 장부 요약: 선택 수량 ${productQuantity.value}개 / 내가 준 점수 ${productRate.value}점`,
)
</script>

<template>
  <el-card class="practice-card">
    <template #header>
      <span>🛒 실습 2. 커머스 상품 수량 및 평점 시스템</span>
    </template>

    <div class="form-row">
      <label>구매 수량 선택:</label>
      <el-input-number v-model="productQuantity" :min="1" :max="10" />
      <span class="hint">(최대 10개 구매 가능)</span>
    </div>

    <div class="form-row">
      <label>상품 만족도 별점:</label>
      <el-rate v-model="productRate" />
      <span class="hint">{{ productRate }}점</span>
    </div>

    <el-alert :title="summaryText" type="success" :closable="false" show-icon />
  </el-card>
</template>

<style scoped>
.practice-card {
  max-width: 460px;
  margin: 16px auto;
}
.form-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.form-row label {
  width: 130px;
  font-size: 14px;
  color: #444;
}
.hint {
  font-size: 12px;
  color: #888;
}
</style>
