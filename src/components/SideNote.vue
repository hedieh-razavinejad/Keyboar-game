<script setup>
import { computed } from 'vue'
import { SIDE_TONES } from '../data'

const props = defineProps({
  tone: { type: String, default: 'info' },
  head: { type: String, default: '' },
  text: { type: String, default: '' },
})

const style = computed(() => SIDE_TONES[props.tone] || SIDE_TONES.info)
</script>

<template>
  <div
    class="animate-pop flex flex-col justify-center gap-0.5 overflow-hidden rounded-xl border px-2 py-1"
    :class="style[0]"
  >
    <b class="text-[11px] leading-tight sm:text-sm">{{ style[1] }} {{ head }}</b>
    <span class="line-clamp-2 text-[9px] leading-tight text-slate-300 sm:text-xs">{{ text }}</span>
  </div>
</template>
