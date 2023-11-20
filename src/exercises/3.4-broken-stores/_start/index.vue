<template>
  <h2>Fix the store usage in the following pages</h2>

  <p>
    The following pages need to be fixed by changing how the store is consumed. Visit each page and click on
    <code>Edit this file</code> on the navbar to open the corresponding file.
  </p>

  <ol>
    <li>
      <RouterLink to="/3/4-broken-stores/todo-list-1">Destructuring stores (1)</RouterLink>
    </li>
    <li>
      <RouterLink to="/3/4-broken-stores/todo-list-2">Destructuring stores (2)</RouterLink>
    </li>
    <li>
      <RouterLink to="/3/4-broken-stores/todo-list-3">Performance (1)</RouterLink>
    </li>
  </ol>

  <hr />

  <RouterView />
</template>

<style scoped>
ol {
  list-style: decimal;
}
</style>
