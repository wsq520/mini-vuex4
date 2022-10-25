<template>
  <div>
    <a href="#" @click="setFilter('all')" :class="{active: store.state.filter === 'all'}">
      All</a>
    <a href="#" @click="setFilter('finished')" :class="{active: store.state.filter === 'finished'}">
      Finished</a>
    <a href="#" @click="setFilter('unfinished')" :class="{active: store.state.filter === 'unfinished'}">
      UnFinished</a>
  </div>
</template>

<script setup>
// import { useStore } from 'vuex'
import { useStore } from '../../../vuex'

const store = useStore()

const setFilter = (filter) => {
  store.commit('setFilter', filter)
}
</script>

<style scoped>
.active {
  text-decoration: none;
  color: #000;
}

a {
  margin-right: 20px;
}
</style>