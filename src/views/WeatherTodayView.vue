<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { getMoodMessage } from '../utils/weatherMood.js'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const AIR_POLLUTION_URL = 'https://api.openweathermap.org/data/2.5/air_pollution'

const cityMeta = [
  { id: 'city_01', name: '서울', english: 'Seoul' },
  { id: 'city_02', name: '울산', english: 'Ulsan' },
  { id: 'city_03', name: '강릉', english: 'Gangneung' },
  { id: 'city_04', name: '제주', english: 'Jeju' },
]

const getDustLabel = (aqi) => {
  if (aqi <= 2) return '좋음'
  if (aqi === 3) return '보통'
  return '나쁨'
}

const fetchCityWeatherAndAir = async (city) => {
  const weatherRes = await axios.get(
    `${WEATHER_URL}?q=${city.english}&appid=${API_KEY}&units=metric&lang=kr`,
  )
  const { lat, lon } = weatherRes.data.coord

  const airRes = await axios.get(`${AIR_POLLUTION_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`)

  return {
    ...city,
    temp: Math.round(weatherRes.data.main.temp),
    status: weatherRes.data.weather[0].description,
    dust: getDustLabel(airRes.data.list[0].main.aqi),
  }
}

const weatherList = ref([])
const isLoading = ref(true)
const resolved = ref({ city: null, source: 'default' })

const FAVORITE_STORAGE_KEY = 'skala-weather-favorites'
const LAST_VIEWED_STORAGE_KEY = 'skala-weather-last-viewed'

const savedFavoriteIds = JSON.parse(localStorage.getItem(FAVORITE_STORAGE_KEY) || '[]')
const savedLastViewedId = localStorage.getItem(LAST_VIEWED_STORAGE_KEY)

const cityIdFromRoute = route.params.cityId

function resolveFeaturedCity() {
  if (cityIdFromRoute) {
    const found = weatherList.value.find((item) => item.id === cityIdFromRoute)
    if (found) return { city: found, source: 'direct' }
  }
  if (savedFavoriteIds.length > 0) {
    const found = weatherList.value.find((item) => item.id === savedFavoriteIds[0])
    if (found) return { city: found, source: 'favorite' }
  }
  if (savedLastViewedId) {
    const found = weatherList.value.find((item) => item.id === savedLastViewedId)
    if (found) return { city: found, source: 'lastViewed' }
  }
  return { city: weatherList.value[0], source: 'default' }
}

onMounted(async () => {
  isLoading.value = true
  try {
    weatherList.value = await Promise.all(cityMeta.map((city) => fetchCityWeatherAndAir(city)))
    resolved.value = resolveFeaturedCity()
    console.log('🟢 [API 통신 완료] 오늘의 한마디 대표 도시:', resolved.value)
  } catch (error) {
    console.error('🔴 오늘의 한마디 데이터 로딩 실패:', error)
  } finally {
    isLoading.value = false
  }
})

const featuredCity = computed(() => resolved.value.city)

const sourceLabel = computed(() => {
  if (resolved.value.source === 'direct') return '📌 방금 선택하신 도시 기준'
  if (resolved.value.source === 'favorite') return '⭐ 즐겨찾기한 도시 기준'
  if (resolved.value.source === 'lastViewed') return '🕒 방금 확인하신 도시 기준'
  return '아직 확인한 도시가 없어서 기본 도시(서울)를 보여드려요'
})

const mood = computed(() => (featuredCity.value ? getMoodMessage(featuredCity.value) : null))

const displayTemp = computed(() => {
  if (!featuredCity.value) return 0
  const rawTemp = featuredCity.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

const todayLabel = new Date().toLocaleDateString('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

const goToDetail = () => {
  router.push(`/weather/${featuredCity.value.id}`)
}
</script>

<template>
  <div class="today-container">
    <h3>🌈 오늘의 한마디</h3>
    <hr />

    <p
      v-if="isLoading"
      style="text-align: center; color: #3498db; font-weight: bold; padding: 20px 0"
    >
      🛰️ 오늘의 날씨를 확인하는 중입니다...
    </p>

    <template v-else-if="featuredCity">
      <p class="today-date">{{ todayLabel }}</p>
      <p class="today-source">{{ sourceLabel }}</p>

      <div class="mood-card">
        <p class="mood-city">
          📍 {{ featuredCity.name }} · {{ featuredCity.status }} · {{ displayTemp
          }}{{ configStore.unitSymbol }}
        </p>
        <div class="mood-emoji">{{ mood.emoji }}</div>
        <p class="mood-text">{{ mood.text }}</p>
      </div>

      <button @click="goToDetail" class="detail-link-btn">
        🔎 {{ featuredCity.name }} 상세 정보(습도·풍속) 보기
      </button>
    </template>

    <button @click="router.push('/')" class="back-btn">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.today-date {
  text-align: center;
  font-size: 16px;
  color: #888;
  margin: 4px 0 0;
}
.today-source {
  text-align: center;
  font-size: 15px;
  color: #aaa;
  margin: 2px 0 16px;
}

.mood-card {
  background: linear-gradient(135deg, #fef9e7, #eaf6ff);
  border-radius: 10px;
  padding: 24px 16px;
  text-align: center;
  margin-bottom: 16px;
}
.mood-city {
  font-size: 17px;
  color: #666;
  margin: 0 0 12px;
}
.mood-emoji {
  font-size: 52px;
  margin-bottom: 14px;
}
.mood-text {
  font-size: 20px;
  color: #333;
  font-weight: bold;
  line-height: 1.6;
  margin: 0;
}

.detail-link-btn {
  display: block;
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 6px;
  background: #f39c12;
  color: white;
  font-size: 17px;
  cursor: pointer;
  margin-bottom: 8px;
}
.back-btn {
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
