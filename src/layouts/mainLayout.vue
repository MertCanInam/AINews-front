<template>
  <div class="layout">
    <Navbar />

    <div class="main">
      <Sidebar />

      <!-- sadece içerik dark/light olacak -->
      <main class="content" :class="{ dark: isDark }">
        <router-view />
      </main>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import Footer from "@/components/Footer.vue";
import { inject } from "vue";

const isDark = inject("isDark");
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  display: flex;
  flex: 1;
  min-height: 0;
}

.content {
  flex: 1;
  padding: 20px;
  background: var(--bg-color);
  color: var(--text-color);
  overflow-y: auto;
  transition: background 0.3s ease, color 0.3s ease; 
}

.content.dark {
  background: #1e293b; 
  color: #f1f5f9;
}
</style>
