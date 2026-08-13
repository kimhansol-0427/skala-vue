<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const snapshot = computed(() => {
  const q = route.query
  if (!q.name) return null
  return {
    name: q.name,
    temp: q.temp,
    status: q.status,
    humidity: q.humidity,
    wind: q.wind,
    at: q.at ? Number(q.at) : null,
  }
})

const formattedTime = computed(() => {
  if (!snapshot.value?.at) return ''
  return new Date(snapshot.value.at).toLocaleString('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})
</script>

<template>
  <div class="share-container">
    <h3>🔗 공유된 날씨 스냅샷</h3>
    <hr />

    <div v-if="snapshot" class="snapshot-card">
      <p class="snapshot-time">📅 {{ formattedTime }} 기준</p>
      <h4>📍 {{ snapshot.name }}</h4>
      <p>
        당시 기온: <strong>{{ snapshot.temp }}°C</strong>
      </p>
      <p>당시 상태: {{ snapshot.status }}</p>
      <p v-if="snapshot.humidity">대기 습도: {{ snapshot.humidity }}</p>
      <p v-if="snapshot.wind">풍속: {{ snapshot.wind }}</p>
      <p class="snapshot-note">
        ⚠️ 이 정보는 링크가 생성된 시점의 스냅샷이며, 실시간 데이터가 아닙니다.
      </p>
    </div>
    <div v-else>
      <p>공유된 정보가 없습니다. 잘못된 링크일 수 있어요.</p>
    </div>

    <button @click="router.push(`/weather/${route.params.cityId}`)" class="live-btn">
      🔄 실시간 정보 보러 가기
    </button>
    <button @click="router.push('/')" class="back-btn">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.snapshot-card {
  background: #f8f4fc;
  border: 1px solid #e0d0ee;
  border-radius: 8px;
  padding: 14px 16px;
  margin: 12px 0;
}
.snapshot-time {
  font-size: 12px;
  color: #9b59b6;
  font-weight: bold;
  margin: 0 0 8px;
}
.snapshot-card h4 {
  margin-top: 0;
}
.snapshot-card p {
  margin: 6px 0;
  font-size: 14px;
  color: #444;
}
.snapshot-note {
  font-size: 12px;
  color: #999;
  font-style: italic;
  margin-top: 10px !important;
}

.live-btn {
  display: block;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: #9b59b6;
  color: white;
  font-size: 14px;
  cursor: pointer;
  margin-top: 8px;
}
.back-btn {
  display: block;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: #3498db;
  color: white;
  font-size: 14px;
  cursor: pointer;
  margin-top: 8px;
}
</style>
