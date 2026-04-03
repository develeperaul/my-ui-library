<template>
  <div class="hello-world">
    <h1>{{ greeting }}</h1>
    <p>Добро пожаловать в UI библиотеку!</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  greeting?: string
}

withDefaults(defineProps<Props>(), {
  greeting: 'Привет!'
})
</script>

<style scoped>
.hello-world {
  padding: 20px;
  background: var(--ui-color-gray-100);
  border-radius: var(--ui-radius-md);
  text-align: center;
}

h1 {
  color: var(--ui-color-primary);
  margin-bottom: 10px;
}
</style>
