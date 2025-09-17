<template>
  <div class="dashboard">
    <section class="dashboard-body">
      <h1 class="page-title">📰 Bugünün Haberleri</h1>

      <div v-if="posts.length" class="posts-grid">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
      </div>

      <p v-else class="no-posts">Henüz haber bulunmuyor...</p>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import http from "@/api/http";
import PostCard from "@/components/PostCard.vue";

const posts = ref([]);

async function fetchPosts() {
  try {
    const { data } = await http.get("/posts/by-date");
    posts.value = data.data.posts; // ✅ API array döndürüyor
  } catch (err) {
    console.error("Haberler alınamadı:", err);
  }
}

onMounted(fetchPosts);
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  padding: 1rem;
}

/* Sayfa içi */
.dashboard-body {
  padding-top: 80px; /* 🔹 navbar yüksekliği kadar boşluk */
}

.page-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

/* Tablet */
@media (min-width: 640px) {
  .page-title {
    font-size: 1.6rem;
  }
}

/* Büyük ekran */
@media (min-width: 1024px) {
  .page-title {
    font-size: 1.8rem;
  }
}

.posts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 640px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .posts-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.no-posts {
  color: #d41414;
  text-align: center;
  margin-top: 20px;
  font-size: 1.1rem;
  font-weight: 500;
}
</style>
