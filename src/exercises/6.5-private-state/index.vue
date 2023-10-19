<template>
  <h2>Private state</h2>

  <p>Visit each page in order and follow the instructions to resolve each exercise.</p>

  <ol>
    <li>
      <RouterLink to="/6/5-private-state/private-user">Auth store with Private State</RouterLink>
    </li>
    <li>
      <RouterLink to="/6/5-private-state/define-private-state">Define Private State</RouterLink>
    </li>
    <li>
      <RouterLink to="/6/5-private-state/define-private-store">Define Private Store</RouterLink>
    </li>
    <li>
      <RouterLink to="/6/5-private-state/define-readonly-state">Define Readonly State</RouterLink>
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
