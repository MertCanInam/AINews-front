<template>
  <div class="dashboard">
    <section class="dashboard-body">
      <h1 class="page-title">📰 Tüm Gönderiler</h1>

      <!-- Gönderiler -->
      <div v-if="posts.length" class="posts-grid">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
      </div>
      <p v-else class="no-posts">Henüz haber bulunmuyor...</p>

      <!-- Yükleniyor animasyonu -->
      <div v-if="isLoading" class="loading">⏳ Yükleniyor...</div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import http from "@/api/http";
import PostCard from "@/components/postCard.vue";

const posts = ref([]);
const pagination = ref({ total: 0, currentPage: 1, totalPages: 1 });
const isLoading = ref(false);

async function fetchPosts(page = 1) {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    const res = await http.get("/posts", { params: { page, limit: 15 } });

    if (page === 1) {
      posts.value = res.data.data.posts; 
    } else {
      posts.value.push(...res.data.data.posts); 
    }

    pagination.value = {
      total: res.data.data.total,
      currentPage: page,
      totalPages: res.data.data.totalPages,
    };
  } catch (err) {
    console.error("Haberler alınamadı:", err);
  } finally {
    isLoading.value = false;
  }
}

// Scroll event
function handleScroll() {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 50) {
    if (pagination.value.currentPage < pagination.value.totalPages) {
      fetchPosts(pagination.value.currentPage + 1);
    }
  }
}

onMounted(() => {
  fetchPosts();
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  padding: 2rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-color);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
  padding-top: 40px;
  text-align: center;
}

/* Responsive grid */
.posts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 600px) {
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
  color: #666;
  text-align: center;
  margin-top: 20px;
  font-size: 1.1rem;
  font-weight: 500;
}

.loading {
  text-align: center;
  margin: 20px 0;
  color: #4facfe;
  font-weight: 600;
}
</style>
