<template>
  <div>
    <!-- <todo-list/> -->
    <div>rootState-count: {{ $store.state.count }}</div>
    <div>rootState-count * 2: {{ $store.getters.double }}</div>
    <button @click="$store.state.count++">count+1</button>
    <button @click="$store.commit('add', 10)">count+10</button>
    <button @click="$store.dispatch('addOne', 1)">count+1</button>
    <button @click="$store.commit('addOne', 1)">cCount.count+1</button>
  </div>
</template>

<script setup>
// import TodoList from './components/TodoList/index.vue'

</script>

<style scoped>
button {
  margin-right: 10px;
}
</style>
