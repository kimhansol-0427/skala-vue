<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const handleGoHome = () => {
  router.push('/')
}
</script>

<template>
  <div>
    <h3>ℹ️ 서비스 소개</h3>
    <hr />
    <div class="description-box">
      본 앱은 Vue 3 및 Vue Router 4 기반으로 제작한 실습용 가상 관측 대시보드입니다.
      <ul>
        <li>components/exercise/ 폴더 내부의 독립 부품을 재사용합니다.</li>
        <li>클라이언트 사이드 라우팅으로 새로고침 없이 화면을 전환합니다.</li>
        <li>URL 쿼리 스트링으로 검색 상태를 동기화합니다.</li>
      </ul>
    </div>
    <button @click="handleGoHome" class="home-btn">대시보드 홈으로 이동</button>
  </div>
</template>

<style scoped>
.description-box {
  background: #f4f4f4;
  border-radius: 8px;
  padding: 20px 24px;
  margin: 16px 0;
  font-size: 17px;
  line-height: 1.7;
  color: #444;
}
.description-box ul {
  margin: 10px 0 0;
  padding-left: 22px;
}
.description-box li {
  margin: 6px 0;
}
.home-btn {
  display: block;
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 6px;
  background: #3498db;
  color: white;
  font-size: 17px;
  cursor: pointer;
}
</style>
