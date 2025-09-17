<template>
  <section class="confirm">
    <h1>E-posta Onayı</h1>
    <p v-if="loading">Onaylanıyor...</p>
    <p v-else-if="ok" class="ok">E-posta adresin güncellendi. Giriş yap sayfasına dönebilirsin.</p>
    <p v-else class="err">{{ errMsg }}</p>
    <router-link to="/profile">↩ Profil'e dön</router-link>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { confirmEmail } from "@/api/profileService";

const route = useRoute();
const loading = ref(true);
const ok = ref(false);
const errMsg = ref("");

onMounted(async () => {
  const token = route.query.token;
  if (!token) {
    loading.value = false;
    errMsg.value = "Geçersiz bağlantı.";
    return;
  }
  try {
    await confirmEmail(token);
    ok.value = true;
  } catch (e) {
    errMsg.value = e?.response?.data?.message || "Bağlantı geçersiz veya süresi dolmuş.";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.confirm { display: grid; gap: 8px; }
.ok { color: #2e7d32; }
.err { color: #c62828; }
</style>
