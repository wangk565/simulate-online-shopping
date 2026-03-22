<template>
  <RouterView />
  <Toast />
  <Loading />
</template>

<script setup>
import { RouterView } from 'vue-router'
import Loading from './shared/components/Loading.vue'
import Toast from './shared/components/Toast.vue'
</script>
