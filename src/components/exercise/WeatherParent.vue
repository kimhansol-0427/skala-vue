<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

const weatherList = ref([
  {
    id: 'city_01',
    name: '서울',
    temp: 29,
    yesterdayTemp: 26,
    status: '맑음',
    dust: '보통',
    favorite: false,
  },
  {
    id: 'city_02',
    name: '울산',
    temp: 31,
    yesterdayTemp: 31,
    status: '맑음',
    dust: '나쁨',
    favorite: false,
  },
  {
    id: 'city_03',
    name: '강릉',
    temp: 23,
    yesterdayTemp: 27,
    status: '비',
    dust: '좋음',
    favorite: false,
  },
  {
    id: 'city_04',
    name: '제주',
    temp: 27,
    yesterdayTemp: 24,
    status: '구름',
    dust: '좋음',
    favorite: false,
  },
])

const searchQuery = ref('')
const selectedCityId = ref(null)
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

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
}

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

const toggleFavorite = (item) => {
  item.favorite = !item.favorite
}

watch(selectedCityInfo, (newInfo) => {
  console.log(`👁️ [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
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
      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        :is-selected="selectedCityId === item.id"
        @select-card="selectCity"
        @toggle-favorite="toggleFavorite"
        @click-detail="showDetail"
      />
      <p
        v-if="filteredWeatherList.length === 0"
        style="text-align: center; color: #e74c3c; padding: 10px 0"
      >
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>
