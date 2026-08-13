<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span class="unit-label">
      날씨단위: <strong>{{ configStore.unitSymbol }}</strong>
    </span>
    <button @click="configStore.toggleUnit" class="toggle-btn">단위변경</button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.unit-label {
  font-size: 13px;
  color: #4b6584;
}
.toggle-btn {
  padding: 5px 10px;
  background-color: #4b6584;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 12px;
  white-space: nowrap;
}
</style>
