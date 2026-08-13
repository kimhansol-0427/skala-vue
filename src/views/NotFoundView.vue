<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-icon">☀️❓</div>
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>요청하신 주소가 존재하지 않거나,<br />아직 개발되지 않았습니다.</p>
      <button class="home-button" @click="goHome">날씨 메인으로 이동</button>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  padding: 30px 0;
}
.not-found-content {
  text-align: center;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 30px 20px;
  max-width: 320px;
}
.error-icon {
  font-size: 32px;
  margin-bottom: 10px;
}
.not-found-content h2 {
  font-size: 16px;
  margin: 8px 0;
}
.not-found-content p {
  font-size: 13px;
  color: #777;
  margin-bottom: 16px;
}
.home-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #3498db;
  color: white;
  cursor: pointer;
}
</style>
