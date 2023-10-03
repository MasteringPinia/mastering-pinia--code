<script lang="ts" setup>
// add variables here
import { useSpeechRecognition } from '@vueuse/core'
import { ref } from 'vue'

const lang = ref('en')
const { isSupported, error, isListening, recognition, result, isFinal, toggle } = useSpeechRecognition({
  lang,
})
if (!recognition) {
  console.log('SpeechRecognition is not supported')
} else {
  const colors = [
    'aqua',
    'azure',
    'beige',
    'bisque',
    'black',
    'blue',
    'brown',
    'chocolate',
    'coral',
    'crimson',
    'cyan',
    'fuchsia',
    'ghostwhite',
    'gold',
    'goldenrod',
    'gray',
    'green',
    'indigo',
    'ivory',
    'khaki',
    'lavender',
    'lime',
    'linen',
    'magenta',
    'maroon',
    'moccasin',
    'navy',
    'olive',
    'orange',
    'orchid',
    'peru',
    'pink',
    'plum',
    'purple',
    'red',
    'salmon',
    'sienna',
    'silver',
    'snow',
    'tan',
    'teal',
    'thistle',
    'tomato',
    'turquoise',
    'violet',
    'white',
    'yellow',
  ]
  // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
  // This code is provided as a demonstration of possible capability. You may choose not to use it.
  const grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
  recognition.grammars.addFromString(grammar, 1)
  recognition.continuous = false
  recognition.lang = 'en-US'
  recognition.interimResults = false
  recognition.maxAlternatives = 1
}
</script>

<template>
  <h1>Template to start an exercise</h1>

  <button @click="toggle()">Toggle</button>

  <ClientOnly>
    <p>
      isSupported: {{ isSupported }} <br />
      Lang: {{ lang }}
      <br />
      Error: {{ error }}
      <br />
      isListening: {{ isListening }}
      <br />
      isFinal: {{ isFinal }}
    </p>

    <pre v-if="error">
    <code>{{  error.error }}</code>
  </pre>

    <p>Result: {{ result }}</p>
  </ClientOnly>
</template>
