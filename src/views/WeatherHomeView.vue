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

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const AIR_POLLUTION_URL = 'https://api.openweathermap.org/data/2.5/air_pollution'

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
    temp: weatherRes.data.main.temp,
    status: weatherRes.data.weather[0].description,
    condition: weatherRes.data.weather[0].main,
    dust: getDustLabel(airRes.data.list[0].main.aqi),
  }
}

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

const searchCityQuery = ref('')
const searchCityError = ref('')
const isSearchingCity = ref(false)

// 한글로 입력해도 검색되도록 자주 쓰는 도시 이름을 영문으로 미리 매핑해둔다.
// 여기 없는 한글 이름은 매핑 없이 그대로 검색을 시도한다 (실패하면 에러 안내가 뜬다).
const cityNameMap = {
  서울: 'Seoul',
  부산: 'Busan',
  인천: 'Incheon',
  대구: 'Daegu',
  대전: 'Daejeon',
  광주: 'Gwangju',
  울산: 'Ulsan',
  수원: 'Suwon',
  성남: 'Seongnam',
  용인: 'Yongin',
  고양: 'Goyang',
  창원: 'Changwon',
  청주: 'Cheongju',
  전주: 'Jeonju',
  천안: 'Cheonan',
  강릉: 'Gangneung',
  춘천: 'Chuncheon',
  원주: 'Wonju',
  속초: 'Sokcho',
  제주: 'Jeju',
  서귀포: 'Seogwipo',
  포항: 'Pohang',
  경주: 'Gyeongju',
  구미: 'Gumi',
  안동: 'Andong',
  진주: 'Jinju',
  통영: 'Tongyeong',
  거제: 'Geoje',
  여수: 'Yeosu',
  순천: 'Suncheon',
  목포: 'Mokpo',
  군산: 'Gunsan',
  도쿄: 'Tokyo',
  오사카: 'Osaka',
  후쿠오카: 'Fukuoka',
  삿포로: 'Sapporo',
  베이징: 'Beijing',
  상하이: 'Shanghai',
  홍콩: 'Hong Kong',
  방콕: 'Bangkok',
  뉴욕: 'New York',
  런던: 'London',
  파리: 'Paris',
}

const handleSearchCity = async () => {
  const query = searchCityQuery.value.trim()
  if (!query) return

  // 매핑표에 있으면 영문으로 바꿔서 검색, 없으면 입력한 그대로 검색 시도
  const searchTarget = cityNameMap[query] || query
  // 매핑표에 있던 한글 이름이면 그 한글을 그대로 화면 표시용으로 쓰고,
  // 없으면(영문으로 직접 입력한 경우) API가 돌려주는 이름을 그대로 쓴다.
  const isKoreanMapped = Boolean(cityNameMap[query])

  isSearchingCity.value = true
  searchCityError.value = ''
  try {
    const weatherRes = await axios.get(
      `${WEATHER_URL}?q=${searchTarget}&appid=${API_KEY}&units=metric&lang=kr`,
    )
    const { lat, lon } = weatherRes.data.coord
    const airRes = await axios.get(`${AIR_POLLUTION_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`)

    const newCity = {
      id: `search_${Date.now()}`,
      name: isKoreanMapped ? query : weatherRes.data.name,
      english: searchTarget,
      temp: weatherRes.data.main.temp,
      yesterdayTemp: weatherRes.data.main.temp,
      status: weatherRes.data.weather[0].description,
      condition: weatherRes.data.weather[0].main,
      dust: getDustLabel(airRes.data.list[0].main.aqi),
      favorite: false,
      searched: true,
    }

    weatherList.value = weatherList.value.filter((item) => item.name !== newCity.name)
    weatherList.value.unshift(newCity)
    searchCityQuery.value = ''
  } catch {
    searchCityError.value =
      '해당 이름의 도시를 찾지 못했어요. 영문으로 다시 시도해보세요. (예: Incheon, Daegu)'
  } finally {
    isSearchingCity.value = false
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
      <h3>🌍 다른 지역 검색</h3>
      <div class="city-search-row">
        <input
          v-model="searchCityQuery"
          @keyup.enter="handleSearchCity"
          placeholder="도시 이름 입력 (예: 인천, 대구, 도쿄)"
          class="city-search-input"
        />
        <button @click="handleSearchCity" :disabled="isSearchingCity" class="city-search-btn">
          {{ isSearchingCity ? '검색 중...' : '검색' }}
        </button>
      </div>
      <p v-if="searchCityError" class="city-search-error">{{ searchCityError }}</p>
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
        <div class="weather-grid">
          <WeatherCard
            v-for="item in filteredWeatherList"
            :key="item.id"
            :city-item="item"
            :is-selected="selectedCityId === item.id"
            @select-card="selectCity"
            @toggle-favorite="toggleFavorite"
            @click-detail="handleDetailJump(item.id)"
          />
        </div>
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

<style scoped>
.status-bar {
  background: #e8f5e9;
  padding: 14px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  font-size: 16px;
  border-radius: 6px;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.city-search-row {
  display: flex;
  gap: 10px;
}
.city-search-input {
  flex: 1;
  padding: 10px 14px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.city-search-btn {
  padding: 10px 18px;
  font-size: 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}
.city-search-btn:disabled {
  background: #a9c9e0;
  cursor: not-allowed;
}
.city-search-error {
  color: #e74c3c;
  font-size: 14px;
  margin: 8px 0 0;
}
</style>
