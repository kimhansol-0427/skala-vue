<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 💡 1. 백엔드 공용 주소
const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

// 💡 2. 반응형 상태 데이터
const items = ref([]) // 서버에서 받아온 데이터 배열 박스
const textInput = ref('') // 입력창과 연결된 글자 데이터 박스
const isLoading = ref(false)

// ----------------------------------------
// [READ] GET : 데이터 가져오기
// ----------------------------------------
const handleRead = async () => {
  isLoading.value = true
  try {
    // 공부용으로 딱 3개만 들고 옵니다.
    const response = await axios.get(BASE_URL, { params: { _limit: 3 } })
    items.value = response.data
    console.log('GET 성공:', response.data)
  } catch (error) {
    console.error('GET 실패:', error)
  } finally {
    isLoading.value = false
  }
}

// ----------------------------------------
// [CREATE] POST : 새 글 추가하기
// ----------------------------------------
const handleCreate = async () => {
  if (!textInput.value.trim()) return
  try {
    const response = await axios.post(BASE_URL, {
      title: textInput.value,
      body: '내용은 비워둡니다.',
      userId: 1,
    })
    // JSONPlaceholder는 실제로 저장하지 않고 응답만 흉내내므로,
    // 화면에서 바로 보이게 하려면 우리가 직접 배열 맨 앞에 추가해줍니다.
    items.value.unshift(response.data)
    textInput.value = ''
    console.log('POST 성공:', response.data)
  } catch (error) {
    console.error('POST 실패:', error)
  }
}

// ----------------------------------------
// [UPDATE] PUT : 글 수정하기
// ----------------------------------------
const handleUpdate = async (item) => {
  const newTitle = window.prompt('수정할 내용을 입력하세요.', item.title)
  if (!newTitle) return
  try {
    const response = await axios.put(`${BASE_URL}/${item.id}`, {
      ...item,
      title: newTitle,
    })
    // 화면에도 즉시 반영
    const target = items.value.find((i) => i.id === item.id)
    if (target) target.title = response.data.title
    console.log('PUT 성공:', response.data)
  } catch (error) {
    console.error('PUT 실패:', error)
  }
}

// ----------------------------------------
// [DELETE] DELETE : 글 삭제하기
// ----------------------------------------
const handleDelete = async (item) => {
  try {
    await axios.delete(`${BASE_URL}/${item.id}`)
    items.value = items.value.filter((i) => i.id !== item.id)
    console.log('DELETE 성공: id =', item.id)
  } catch (error) {
    console.error('DELETE 실패:', error)
  }
}

onMounted(() => {
  handleRead()
})
</script>

<template>
  <div class="practice-section">
    <h2>⚡ Axios CRUD 프로토타입 훈련</h2>

    <div class="input-row">
      <input v-model="textInput" placeholder="저장할 텍스트를 입력하세요" />
      <button @click="handleCreate">POST (추가)</button>
    </div>

    <p v-if="isLoading">불러오는 중...</p>

    <ul v-else class="item-list">
      <li v-for="item in items" :key="item.id" class="item-row">
        <span>ID: {{ item.id }} — {{ item.title }}</span>
        <span class="btn-group">
          <button @click="handleUpdate(item)">PUT (수정)</button>
          <button @click="handleDelete(item)">DEL (삭제)</button>
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.input-row input {
  flex: 1;
  padding: 6px 8px;
}
.item-list {
  list-style: none;
  padding: 0;
}
.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #eee;
}
.btn-group button {
  margin-left: 6px;
}
</style>
