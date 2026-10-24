<script setup>
const letters = [
  { ch: 'ک', left: '5%', size: 44, time: 14, delay: -2 },
  { ch: 'ل', left: '14%', size: 30, time: 18, delay: -9 },
  { ch: 'ی', left: '23%', size: 56, time: 16, delay: -5 },
  { ch: 'د', left: '33%', size: 34, time: 20, delay: -12 },
  { ch: 'ا', left: '42%', size: 48, time: 15, delay: -7 },
  { ch: 'ر', left: '51%', size: 28, time: 19, delay: -1 },
  { ch: 'م', left: '60%', size: 52, time: 17, delay: -10 },
  { ch: 'ن', left: '69%', size: 36, time: 21, delay: -4 },
  { ch: 'ب', left: '77%', size: 46, time: 14, delay: -8 },
  { ch: 'ح', left: '85%', size: 32, time: 18, delay: -13 },
  { ch: 'س', left: '92%', size: 50, time: 16, delay: -6 },
  { ch: 'و', left: '38%', size: 26, time: 22, delay: -15 },
]
</script>

<template>
  <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
    <span
      v-for="l in letters"
      :key="l.ch"
      class="float-letter"
      :style="{
        left: l.left,
        fontSize: l.size + 'px',
        animationDuration: l.time + 's',
        animationDelay: l.delay + 's',
      }"
    >{{ l.ch }}</span>
  </div>
</template>
