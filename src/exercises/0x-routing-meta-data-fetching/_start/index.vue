<script lang="ts" setup></script>

<template>
  <h3>Data fetching</h3>
  <section class="masonry">
    <figure class="item">
      <img class="item__content" src="https://i.imgflip.com/gk5el.jpg" alt="Hide the Pain Harold" />
      <figcaption>
        <a href="#">Hide the Pain Harold</a>
      </figcaption>
    </figure>
  </section>
</template>

<style scoped>
img {
  max-width: 100%;
  display: block;
  margin-bottom: 0;
}

figure {
  margin: 0;
  display: grid;
  grid-template-rows: 1fr auto;
  margin-bottom: 10px;
  break-inside: avoid;
}

figure > img {
  grid-row: 1 / -1;
  grid-column: 1;
}

figure a {
  color: black;
  text-decoration: none;
}

figcaption {
  grid-row: 2;
  grid-column: 1;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 0.2em 0.5em;
  justify-self: start;
}

.masonry {
  column-count: 3;
  column-gap: 10px;
}

@media screen and (max-width: 1024px) {
  .masonry {
    column-count: 2;
  }
}

@media screen and (max-width: 500px) {
  .masonry {
    column-count: 1;
  }
}
</style>
