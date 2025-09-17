<template>
  <section class="saved-posts">
    <h1>❤️ Kaydedilen Gönderiler</h1>

    <div v-if="loading" class="loading">Yükleniyor...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else>
      <div v-if="posts.length" class="posts-list">
        <PostCard v-for="p in posts" :key="p.id" :post="p" />
      </div>
      <p v-else class="empty">Henüz hiç kaydettiğin gönderi yok.</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getSavedPosts } from "@/api/savedPostsService";
import PostCard from "@/components/PostCard.vue";

const posts = ref([]);
const loading = ref(false);
const error = ref(null);

const load = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await getSavedPosts();
    // backend response: { success: true, data: [...] }
    posts.value = data?.data ?? [];
  } catch (e) {
    error.value = e?.response?.data?.message || "Postlar yüklenemedi.";
  } finally {
    loading.value = false;
  }
};

onMounted(load);
</script>


<style scoped>
.saved-posts {
  margin: 100px auto 0;
  max-width: 960px;
  padding: 24px;
  display: grid;
  gap: 24px;
}

.saved-posts h1 {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--text-color);
  text-align: center;
  margin-bottom: 12px;
}

.posts-list {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr; /* 📱 mobil */
}

@media (min-width: 600px) {
  .posts-list {
    grid-template-columns: 1fr 1fr; /* tablet */
  }
}
@media (min-width: 900px) {
  .posts-list {
    grid-template-columns: 1fr 1fr 1fr; /* desktop */
  }
}

.loading {
  text-align: center;
  font-weight: 600;
  opacity: 0.8;
  animation: pulse 1.5s infinite;
}

.error {
  color: #ff4d4f;
  text-align: center;
  font-weight: 600;
}

.empty {
  opacity: 0.6;
  font-style: italic;
  text-align: center;
}

@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}
</style>
