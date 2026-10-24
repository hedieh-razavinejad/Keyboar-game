<script setup>
import angry from '../assets/robots/angry.webp'
import happy from '../assets/robots/happy.webp'
import typing from '../assets/robots/typing.webp'

defineProps({
  active: { type: String, default: 'happy' },
})

const robots = [
  { mood: 'angry', img: angry },
  { mood: 'happy', img: happy },
  { mood: 'typing', img: typing },
]
</script>

<template>
  <div dir="ltr" class="flex items-end justify-center gap-1 sm:gap-6">
    <div
      v-for="r in robots"
      :key="r.mood"
      class="relative h-36 w-24 transition-all duration-300 sm:h-48 sm:w-32"
      :class="active === r.mood ? 'scale-110 opacity-100' : 'scale-90 opacity-50'"
    >
      <div v-if="active === r.mood" class="absolute inset-0 rounded-full bg-blue-500/25 blur-2xl"></div>
      <div class="absolute inset-x-3 bottom-0 h-3 rounded-full bg-blue-500/40 blur-md"></div>
      <img
        :src="r.img"
        alt=""
        class="absolute inset-0 h-full w-full object-contain object-bottom"
        :class="active === r.mood && 'bot-' + r.mood"
      />
    </div>
  </div>
</template>
