<script setup>
import { ref, watch } from 'vue'
import angry from '../assets/robots/angry.webp'
import happy from '../assets/robots/happy.webp'
import typing from '../assets/robots/typing.webp'

const props = defineProps({
  mood: { type: String, default: 'typing' },
  hop: { type: Number, default: 0 },
})

const images = { angry, happy, typing }
const hopping = ref(false)

watch(() => props.hop, () => {
  if (props.mood !== 'typing') return
  hopping.value = false
  requestAnimationFrame(() => (hopping.value = true))
})
</script>

<template>
  <div class="relative min-h-0">
    <img
      :src="images[mood]"
      alt=""
      class="bot absolute inset-0 h-full w-full object-contain object-bottom"
      :class="['bot-' + mood, hopping && mood === 'typing' && 'hop']"
      @animationend="hopping = false"
    />
  </div>
</template>
