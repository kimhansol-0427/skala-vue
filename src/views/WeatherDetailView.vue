<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

// OpenWeatherMap 필수 연동 규격
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

// 라우터 ID 파라미터 → 실제 API 쿼리용 영문/한글 명칭 매핑 (yesterdayTemp는 그대로 유지)
const cityMapping = {
  city_01: { english: 'Seoul', korean: '대한민국 서울특별시', yesterdayTemp: 26 },
  city_02: { english: 'Ulsan', korean: '울산광역시', yesterdayTemp: 31 },
  city_03: { english: 'Gangneung', korean: '강원도 강릉시', yesterdayTemp: 27 },
  city_04: { english: 'Jeju', korean: '제주특별자치도', yesterdayTemp: 24 },
}

const cityData = ref(null)
const isLoading = ref(false)

onMounted(async () => {
  const id = route.params.cityId
  const targetCity = cityMapping[id]

  if (targetCity) {
    isLoading.value = true
    try {
      const response = await axios.get(
        `${BASE_URL}?q=${targetCity.english}&appid=${API_KEY}&units=metric&lang=kr`,
      )
      const raw = response.data

      cityData.value = {
        name: targetCity.korean,
        temp: raw.main.temp,
        yesterdayTemp: targetCity.yesterdayTemp,
        status: raw.weather[0].description,
        humidity: `${raw.main.humidity}%`,
        wind: `${raw.wind.speed}m/s`,
      }
      console.log('🟢 [API 통신 완료] 상세 정보:', cityData.value)
    } catch (error) {
      console.error('🔴 상세 정보 로딩 중 네트워크 에러 발생:', error)
    } finally {
      isLoading.value = false
    }
  }
})

const displayTemp = computed(() => {
  if (!cityData.value) return 0
  const rawTemp = cityData.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return Math.round(rawTemp * 10) / 10
})

const tempDiff = computed(() => {
  if (!cityData.value) return 0
  const diffCelsius = cityData.value.temp - cityData.value.yesterdayTemp
  if (configStore.unit === 'fahrenheit') {
    return Math.round(diffCelsius * (9 / 5))
  }
  return Math.round(diffCelsius * 10) / 10
})

const diffLabel = computed(() => {
  const diff = tempDiff.value
  if (diff > 0) return { arrow: '▲', text: `어제보다 ${diff}도 높아요`, className: 'diff-up' }
  if (diff < 0)
    return { arrow: '▼', text: `어제보다 ${Math.abs(diff)}도 낮아요`, className: 'diff-down' }
  return { arrow: '→', text: '어제와 같아요', className: 'diff-same' }
})

const shareMessage = ref('')

const shareSnapshot = async () => {
  if (!cityData.value) return

  const params = new URLSearchParams({
    name: cityData.value.name,
    temp: cityData.value.temp,
    status: cityData.value.status,
    humidity: cityData.value.humidity,
    wind: cityData.value.wind,
    at: Date.now(),
  })

  const shareUrl = `${window.location.origin}/weather/${route.params.cityId}/share?${params.toString()}`

  try {
    await navigator.clipboard.writeText(shareUrl)
    shareMessage.value = '✅ 링크가 복사되었습니다! 붙여넣기 해서 보내보세요.'
  } catch {
    shareMessage.value = '⚠️ 복사에 실패했습니다. 브라우저 권한을 확인해주세요.'
  }

  setTimeout(() => {
    shareMessage.value = ''
  }, 3000)
}
</script>

<template>
  <div class="detail-container">
    <h3>📊 지역별 상세 기상 관측 정보 (실시간 데이터 연동)</h3>
    <hr />

    <p
      v-if="isLoading"
      style="text-align: center; color: #3498db; font-weight: bold; padding: 20px 0"
    >
      🛰️ 상세 정보를 수신 중입니다...
    </p>

    <div v-else-if="cityData" class="info-card">
      <h4>📍 지정 지역: {{ cityData.name }}</h4>
      <p>
        실시간 기온: <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
      </p>
      <p class="diff-text" :class="diffLabel.className">
        {{ diffLabel.arrow }} {{ diffLabel.text }}
      </p>
      <p>기상 현황: {{ cityData.status }}</p>
      <p>대기 습도: {{ cityData.humidity }}</p>
      <p>현재 풍속: {{ cityData.wind }}</p>
    </div>
    <div v-else>
      <p>해당 지역의 상세 데이터 장부가 존재하지 않습니다.</p>
    </div>

    <button v-if="cityData" @click="shareSnapshot" class="share-btn">📤 이 날씨 공유하기</button>
    <p v-if="shareMessage" class="share-message">{{ shareMessage }}</p>

    <button @click="router.push('/')" class="back-btn">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.info-card {
  background: #f4f4f4;
  border-radius: 8px;
  padding: 14px 16px;
  margin: 12px 0;
}
.info-card h4 {
  margin-top: 0;
}
.info-card p {
  margin: 6px 0;
  font-size: 14px;
  color: #444;
}
.diff-text {
  font-weight: bold;
}
.diff-up {
  color: #c0392b;
}
.diff-down {
  color: #2980b9;
}
.diff-same {
  color: #888;
}

.share-btn {
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
.share-message {
  text-align: center;
  font-size: 13px;
  color: #2e7d32;
  margin: 8px 0 0;
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
