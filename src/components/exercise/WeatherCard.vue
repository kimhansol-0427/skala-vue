<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore'

const props = defineProps({
  cityItem: { type: Object, required: true },
  isSelected: { type: Boolean, default: false },
})

const emit = defineEmits(['select-card', 'toggle-favorite', 'click-detail'])

const configStore = useConfigStore()

const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return Math.round(rawTemp)
})

const tempDiff = computed(() => {
  const diffCelsius = props.cityItem.temp - props.cityItem.yesterdayTemp
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

const getActivity = (item) => {
  if (item.dust === '나쁨') return '😷 마스크 챙기고 실내 활동 추천'
  if (item.condition === 'Clear' && item.temp >= 25) return '🧴 선크림 챙기고 야외 나들이'
  if (item.condition === 'Clear') return '☀️ 가볍게 야외 나들이 추천'
  if (
    item.condition === 'Rain' ||
    item.condition === 'Drizzle' ||
    item.condition === 'Thunderstorm'
  )
    return '☕ 실내 카페 투어 추천'
  if (item.condition === 'Clouds') return '🚶 가볍게 산책하기 좋은 날'
  if (item.condition === 'Snow') return '☃️ 눈길 조심, 따뜻하게 챙겨입기'
  return '🏠 집에서 푹 쉬기'
}
</script>

<template>
  <el-card
    class="weather-card"
    :class="{ selected: isSelected }"
    shadow="hover"
    @click="emit('select-card', cityItem)"
  >
    <el-button
      class="btn-favorite"
      circle
      :type="cityItem.favorite ? 'warning' : 'default'"
      @click.stop="emit('toggle-favorite', cityItem)"
    >
      {{ cityItem.favorite ? '⭐' : '☆' }}
    </el-button>

    <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
    <p class="temp-text">현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
    <p class="diff-text" :class="diffLabel.className">{{ diffLabel.arrow }} {{ diffLabel.text }}</p>

    <div class="badge-row">
      <el-tag v-if="cityItem.temp >= 25" type="danger" effect="light" round>
        🔥 더움 (25도 이상)
      </el-tag>
      <el-tag v-else type="info" effect="light" round> ❄️ 선선함 (25도 미만) </el-tag>

      <el-tag v-if="cityItem.status === '비'" type="primary" effect="light" round>
        ☔ 우산 필요
      </el-tag>

      <el-tag v-if="cityItem.dust === '좋음'" type="success" effect="light" round>
        🟢 공기질 좋음
      </el-tag>
      <el-tag v-else-if="cityItem.dust === '보통'" type="warning" effect="light" round>
        🟡 공기질 보통
      </el-tag>
      <el-tag v-else type="danger" effect="light" round> 🔴 공기질 나쁨 </el-tag>
    </div>

    <p class="activity">{{ getActivity(cityItem) }}</p>

    <el-button
      class="btn-detail"
      type="primary"
      plain
      @click.stop="emit('click-detail', cityItem.name, cityItem.status)"
    >
      상세보기
    </el-button>
  </el-card>
</template>

<style scoped>
.weather-card {
  position: relative;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: box-shadow 0.15s ease;
  font-size: 16px;
}
.weather-card.selected :deep(.el-card__body) {
  box-shadow: inset 0 0 0 2px #3498db;
  border-radius: 8px;
}

.weather-card h4 {
  font-size: 22px;
  margin: 4px 0 10px;
}

.temp-text {
  font-size: 18px;
  margin: 6px 0;
}

.diff-text {
  font-size: 16px;
  margin: 4px 0 10px;
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

.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0;
}
:deep(.el-tag) {
  font-size: 15px;
  padding: 6px 12px;
  height: auto;
  line-height: 1.6;
}

.btn-favorite {
  position: absolute;
  top: 12px;
  right: 14px;
  font-size: 20px;
}

.activity {
  font-size: 17px;
  color: #555;
  font-style: italic;
  margin: 10px 0;
}

.btn-detail {
  margin-top: 10px;
  font-size: 16px;
  padding: 10px 18px;
}
</style>
