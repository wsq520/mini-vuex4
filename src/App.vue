<template>
  <div>
    App
    <!-- <todo-list/> -->
    <div>{{ $store.state.count }}</div>
    <button @click="$store.state.count++">count+1</button>
  </div>
</template>

<script setup>
// import TodoList from './components/TodoList/index.vue'

</script>

<style scoped>

</style>
