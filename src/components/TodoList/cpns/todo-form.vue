<template>
  <div>
    <input type="text" placeholder="请输入内容" v-model="inputRef">
    <button @click="addTodo">Add Todo</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import { useStore } from 'vuex'
import {useStore} from '../../../vuex'

const inputRef = ref('')
const store = useStore()

const addTodo = () => {
  store.dispatch('addTodo', inputRef.value)
  inputRef.value = ''
}
</script>

<style lang="scss" scoped>

</style>