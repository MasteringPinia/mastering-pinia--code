<script lang="ts" setup>
import { $settings, convertToTitle } from '~/utils/settings'

const inputAttrs: Record<
  'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function',
  { type?: 'checkbox' | 'number' }
> = {
  boolean: { type: 'checkbox' },
  string: {},
  number: { type: 'number' },
  bigint: {},
  function: {},
  object: {},
  symbol: {},
  undefined: {},
}
</script>

<template>
  <h1>Settings</h1>

  <div v-for="(value, setting) in $settings">
    <!-- TODO: Example of refactoring into components to not recalculate a property too often -->
    <template v-if="inputAttrs[typeof $settings[setting]]">
      <label>
        <input v-model="$settings[setting]" v-bind="inputAttrs[typeof $settings[setting]]" />
        {{ convertToTitle(setting) }}
      </label>
    </template>
    <span v-else>No setting for {{ setting }}</span>
  </div>
  <pre>{{ $settings }}</pre>
</template>
