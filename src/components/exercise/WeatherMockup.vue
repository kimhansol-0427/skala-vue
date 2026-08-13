<script setup>
import { ref } from 'vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 29, status: '맑음', dust: '보통', favorite: false },
  { id: 'city_02', name: '울산', temp: 31, status: '맑음', dust: '나쁨', favorite: false },
  { id: 'city_03', name: '강릉', temp: 23, status: '비', dust: '좋음', favorite: false },
  { id: 'city_04', name: '제주', temp: 27, status: '구름', dust: '좋음', favorite: false },
])

const searchQuery = ref('')
const selectedCityId = ref(null)
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

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

const getActivity = (item) => {
  if (item.dust === '나쁨') return '😷 마스크 챙기고 실내 활동 추천'
  if (item.status === '맑음' && item.temp >= 25) return '🧴 선크림 챙기고 야외 나들이'
  if (item.status === '맑음') return '☀️ 가볍게 야외 나들이 추천'
  if (item.status === '비') return '☕ 실내 카페 투어 추천'
  if (item.status === '구름') return '🚶 가볍게 산책하기 좋은 날'
  return '🏠 집에서 푹 쉬기'
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery || '입력 없음' }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>

      <div class="weather-grid">
        <div
          v-for="item in weatherList"
          :key="item.id"
          class="weather-card"
          :class="{ selected: selectedCityId === item.id }"
          @click="selectCity(item)"
        >
          <button class="btn-favorite" @click.stop="toggleFavorite(item)">
            {{ item.favorite ? '⭐' : '☆' }}
          </button>

          <h4>{{ item.name }} ({{ item.status }})</h4>
          <p>현재 기온: {{ item.temp }}°C</p>

          <span v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
          <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

          <span v-if="item.status === '비'" class="badge rain">☔ 우산 필요</span>

          <span v-if="item.dust === '좋음'" class="badge dust-good">🟢 공기질 좋음</span>
          <span v-else-if="item.dust === '보통'" class="badge dust-normal">🟡 공기질 보통</span>
          <span v-else class="badge dust-bad">🔴 공기질 나쁨</span>

          <p class="activity">{{ getActivity(item) }}</p>

          <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
            상세보기
          </button>
        </div>
      </div>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>
