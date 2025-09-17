<template>
  <footer class="footer">
    <p>© 2025 AI News | Tüm Hakları Saklıdır.</p>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: #2c3e50;
  color: #ecf0f1;
  text-align: center;
  padding: 12px;
  font-size: 14px;
  margin-top: auto; /* sayfa sonuna itmek için */
}

/* 🔹 Tablet */
@media (max-width: 992px) {
  .footer {
    font-size: 13px;
    padding: 10px;
  }
}

/* 🔹 Telefon */
@media (max-width: 576px) {
  .footer {
    font-size: 12px;
    padding: 8px;
    line-height: 1.4;
  }
}
</style>

