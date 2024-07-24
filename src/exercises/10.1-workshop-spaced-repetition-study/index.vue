<script lang="ts" setup></script>

<template>
  <h1>Spaced Repetition Study</h1>

  <nav>
    <RouterLink :to="{ name: '/10.1-workshop-spaced-repetition-study//decks' }">My Decks</RouterLink>
    |
    <RouterLink :to="{ name: '/10.1-workshop-spaced-repetition-study//review' }">Review</RouterLink>
  </nav>

  <RouterView />
</template>
