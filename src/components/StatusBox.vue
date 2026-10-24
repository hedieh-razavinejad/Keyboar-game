<script setup>
import { TONES } from '../data'

defineProps({
  tone: { type: String, default: 'info' },
  head: { type: String, default: '' },
  text: { type: String, default: '' },
})
</script>

<template>
  <div class="animate-pop rounded-2xl border-s-4 bg-[#0e1632]/80 px-4 py-3" :class="TONES[tone]">
    <strong class="block text-lg">{{ head }}</strong>
    <span class="text-sm text-slate-100">{{ text }}</span>
  </div>
</template>
