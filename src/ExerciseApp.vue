<script setup>
import WeatherMockup from './components/exercise/WeatherMockup.vue'
import WeatherComposition from './components/exercise/WeatherComposition.vue'
import WeatherParent from './components/exercise/WeatherParent.vue'
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<template>
  <div class="app-container">
    <h1>⛅ 과제 1: 날씨 (Mockup)</h1>
    <hr />
    <WeatherMockup />
  </div>

  <div class="app-container">
    <h1>⛅ 과제 2: 날씨 (컴포지션)</h1>
    <hr />
    <WeatherComposition />
  </div>

  <div class="app-container">
    <h1>⛅ 과제 3: 날씨 (컴포넌트)</h1>
    <hr />
    <WeatherParent />
  </div>

  <div class="app-container">
    <h1>⛅ 과제 5: 스토어 적용</h1>
    <hr />
    <div class="dashboard-wrapper">
      <nav class="navigation-bar">
        <RouterLink to="/" class="nav-item">☁️ 날씨 대시보드</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/today" class="nav-item">🌈 오늘의 한마디</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
        <UnitToggler />
      </nav>
      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
@import '@/assets/exercise.css';
</style>

<style scoped>
.navigation-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  row-gap: 8px;
  column-gap: 16px;
  padding: 12px 10px;
  margin-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
}
.nav-item {
  white-space: nowrap;
  color: #555;
  text-decoration: none;
  font-size: 14px;
  padding: 4px 8px;
}
.nav-item.router-link-exact-active {
  color: #2471a3;
  font-weight: bold;
  border-bottom: 2px solid #3498db;
}
.divider {
  color: #ccc;
}
</style>
