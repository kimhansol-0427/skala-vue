<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

// OpenWeatherMap 필수 연동 규격
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const AIR_POLLUTION_URL = 'https://api.openweathermap.org/data/2.5/air_pollution'

// 도시별 고정 정보 (영문 쿼리명 · 어제 기온은 그대로 유지)
const cityMeta = [
  { id: 'city_01', name: '서울', english: 'Seoul', yesterdayTemp: 26, favorite: false },
  { id: 'city_02', name: '울산', english: 'Ulsan', yesterdayTemp: 31, favorite: false },
  { id: 'city_03', name: '강릉', english: 'Gangneung', yesterdayTemp: 27, favorite: false },
  { id: 'city_04', name: '제주', english: 'Jeju', yesterdayTemp: 24, favorite: false },
]

const weatherList = ref([])
const isLoading = ref(false)

const searchQuery = ref('')
const selectedCityId = ref(null)
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const FAVORITE_STORAGE_KEY = 'skala-weather-favorites'
const LAST_VIEWED_STORAGE_KEY = 'skala-weather-last-viewed'

// AQI 숫자(1~5)를 기존 배지 체계(좋음/보통/나쁨)로 변환
const getDustLabel = (aqi) => {
  if (aqi <= 2) return '좋음'
  if (aqi === 3) return '보통'
  return '나쁨'
}

// 도시 1곳의 날씨 + 미세먼지를 순서대로 받아오는 함수
// (미세먼지는 좌표가 필요해서, 날씨를 먼저 받아 좌표를 얻은 뒤 요청한다)
const fetchCityWeatherAndAir = async (city) => {
  const weatherRes = await axios.get(
    `${WEATHER_URL}?q=${city.english}&appid=${API_KEY}&units=metric&lang=kr`,
  )
  const { lat, lon } = weatherRes.data.coord

  const airRes = await axios.get(`${AIR_POLLUTION_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`)

  return {
    ...city,
    temp: weatherRes.data.main.temp,
    status: weatherRes.data.weather[0].description,
    condition: weatherRes.data.weather[0].main, // ★ 추가: 영문 대분류 (Clear/Clouds/Rain 등)
    dust: getDustLabel(airRes.data.list[0].main.aqi),
  }
}

// 4개 도시를 동시에(병렬로) 처리하는 함수
const fetchRealTimeWeather = async () => {
  isLoading.value = true
  try {
    weatherList.value = await Promise.all(cityMeta.map((city) => fetchCityWeatherAndAir(city)))

    const savedFavoriteIds = JSON.parse(localStorage.getItem(FAVORITE_STORAGE_KEY) || '[]')
    weatherList.value.forEach((item) => {
      item.favorite = savedFavoriteIds.includes(item.id)
    })

    console.log('🟢 [API 통신 완료] 날씨+미세먼지:', weatherList.value)
  } catch (error) {
    console.error('🔴 날씨/미세먼지 API 연동 실패:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  fetchRealTimeWeather()
})

watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: { search: newQuery || undefined },
  })
})

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

const resultCountLabel = computed(() => {
  const count = filteredWeatherList.value.length
  return count === 0 ? '검색된 도시 없음' : `${count}곳 검색됨`
})

const selectCity = (item) => {
  selectedCityId.value = item.id
  selectedCityInfo.value = `${item.name}이(가) 선택되었습니다.`
  localStorage.setItem(LAST_VIEWED_STORAGE_KEY, item.id)
}

const toggleFavorite = (item) => {
  item.favorite = !item.favorite
  const favoriteIds = weatherList.value.filter((w) => w.favorite).map((w) => w.id)
  localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(favoriteIds))

  if (item.favorite) {
    ElMessage.success(`⭐ ${item.name}이(가) 즐겨찾기에 추가되었습니다.`)
  } else {
    ElMessage.info(`☆ ${item.name}이(가) 즐겨찾기에서 제거되었습니다.`)
  }
}

const handleDetailJump = (id) => {
  router.push(`/weather/${id}/today`)
}

watch(selectedCityInfo, (newInfo) => {
  console.log(`👁️ [watch 감지] 상태 바 문구가 업데이트되었습니다. -> "${newInfo}"`)
})

watchEffect(() => {
  console.log(
    `🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 도시를 필터링합니다.`,
  )
})
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar
        :current-query="searchQuery"
        :result-count-label="resultCountLabel"
        @update-query="(val) => (searchQuery = val)"
      />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>🏙️ 지역별 날씨 현황</h3>

      <p
        v-if="isLoading"
        style="text-align: center; color: #3498db; font-weight: bold; padding: 20px 0"
      >
        🛰️ 실시간 기상 데이터를 수신 중입니다...
      </p>

      <template v-else>
        <WeatherCard
          v-for="item in filteredWeatherList"
          :key="item.id"
          :city-item="item"
          :is-selected="selectedCityId === item.id"
          @select-card="selectCity"
          @toggle-favorite="toggleFavorite"
          @click-detail="handleDetailJump(item.id)"
        />
        <p
          v-if="filteredWeatherList.length === 0"
          style="text-align: center; color: #e74c3c; padding: 10px 0"
        >
          😭 검색 결과와 일치하는 도시가 없습니다.
        </p>
      </template>
    </BaseDashboardCard>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>
