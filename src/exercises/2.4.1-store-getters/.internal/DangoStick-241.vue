<script lang="ts">
const dangoColors = ['#919F50', '#FFA8A7', '#FFEBCC']
</script>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    dango?: number
    seed?: number
  }>(),
  {
    dango: 3,
    seed: () => Math.floor(Math.random() * dangoColors.length),
  },
)
</script>

<template>
  <svg
    width="103"
    height="285"
    viewBox="0 0 103 285"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="block m-auto animate__animated animate__bounceIn"
  >
    <path
      d="M57.25 65.3098V231.506L61 236.699V281.364C57.8508 284.069 55.6355 284.821 51 285C45.8603 284.574 43.5883 283.745 41 280.845V236.699L44.75 231.506V65.3098C44.75 64.1412 48.25 0 51 0C53.75 0 57.25 64.2711 57.25 65.3098Z"
      fill="#F3C975"
    />

    <template v-for="i in dango">
      <g :transform="`translate(0 ${-57 * (i - 1)})`">
        <path
          d="M54.1098 147.935C34.9918 147.874 15.3932 156.826 12.8584 180.308C10.5542 201.641 33.6208 215.813 51.3 214.814C68.9791 213.814 86.0233 205.843 88.7009 183.727C91.4447 160.877 71.2801 147.984 54.1098 147.935Z"
          :fill="dangoColors[(i - 1 + seed) % dangoColors.length]"
        />
        <path
          d="M62.4834 156.577C59.8704 161.021 65.4897 164.693 69.4787 168.824C73.4553 172.964 75.9214 177.495 79.002 174.894C82.092 172.305 82.1922 167.174 76.4208 160.391C71.7174 154.853 64.5354 153.093 62.4834 156.577Z"
          fill="#FFFFFE"
        />
      </g>
    </template>
  </svg>
</template>
