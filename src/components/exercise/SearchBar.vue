<script setup>
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
  resultCountLabel: {
    type: String,
    default: '',
  },
})

defineEmits(['update-query'])
</script>

<template>
  <div class="search-inner">
    <h3>🔍 도시 검색</h3>
    <input
      type="text"
      :value="currentQuery"
      @input="$emit('update-query', $event.target.value)"
      placeholder="검색할 도시 이름 입력"
    />
    <p>
      검색 중인 도시: <strong>{{ currentQuery || '입력 없음' }}</strong> ({{ resultCountLabel }})
    </p>
  </div>
</template>

<style scoped>
.search-inner input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
