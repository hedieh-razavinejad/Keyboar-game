<script setup>
defineProps({
  letter: { type: String, required: true },
  finish: { type: String, default: 'ink' },
  state: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})
defineEmits(['press'])
</script>

<template>
  <button
    type="button"
    class="cap"
    :class="['f-' + finish, state && 'is-' + state]"
    :disabled="disabled"
    :aria-label="letter"
    @click="$emit('press')"
  >
    <span>{{ state === 'bomb' ? '💣' : letter }}</span>
  </button>
</template>
