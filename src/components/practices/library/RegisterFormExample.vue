<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const userForm = ref({
  email: '',
  agree: false,
})

const handleRegister = () => {
  if (!userForm.value.email.includes('@')) {
    ElMessage.error('❌ 올바른 이메일 형식이 아닙니다.')
    return
  }
  if (!userForm.value.agree) {
    ElMessage.warning('⚠️ 이용약관에 동의하셔야 합니다.')
    return
  }
  ElMessage.success('🎉 가입 신청이 정상적으로 완료되었습니다!')
}
</script>

<template>
  <el-card class="practice-card">
    <template #header>
      <span>📝 실습 1. 회원가입 Form & 인풋 제어</span>
    </template>

    <div class="form-row">
      <label>이메일 주소:</label>
      <el-input v-model="userForm.email" placeholder="example@email.com" />
    </div>

    <div class="form-row">
      <el-switch v-model="userForm.agree" />
      <span class="agree-text">개인정보 수집 및 필수 이용약관에 동의합니다.</span>
    </div>

    <el-button type="success" style="width: 100%" @click="handleRegister">
      🚀 회원가입하기
    </el-button>
  </el-card>
</template>

<style scoped>
.practice-card {
  max-width: 420px;
  margin: 16px auto;
}
.form-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.form-row label {
  width: 90px;
  font-size: 14px;
  color: #444;
}
.agree-text {
  font-size: 13px;
  color: #666;
}
</style>
