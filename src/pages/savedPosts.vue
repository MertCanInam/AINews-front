<template>
  <div class="saved-posts-container">
    <h1 class="page-title">❤️ Kaydedilen Gönderiler</h1>

    <!-- Durum Mesajları -->
    <div v-if="loading" class="loading-message">Yükleniyor...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>

    <!-- Gönderi Listesi -->
    <div v-else>
      <div v-if="posts.length > 0" class="posts-grid">
        <!-- PostCard bileşeni, daha önce stillendirildiği için bu gride uyum sağlayacaktır -->
        <PostCard v-for="p in posts" :key="p.id" :post="p" />
      </div>
      <p v-else class="empty-message">Henüz hiç kaydedilmiş gönderiniz bulunmuyor.</p>
    </div>
  </div>
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
    posts.value = data?.data ?? [];
  } catch (e) {
    error.value = e?.response?.data?.message || "Kaydedilen gönderiler yüklenemedi.";
  } finally {
    loading.value = false;
  }
};

onMounted(load);
</script>

<style scoped>
.saved-posts-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem; /* 32px */
}

.page-title {
  font-size: 1.875rem; /* 30px */
  font-weight: 800;
  text-align: center;
  color: #111827;
}

/* Post listesi için grid yapısı */
.posts-grid {
  display: grid;
  gap: 1.5rem; /* 24px */
  grid-template-columns: 1fr; /* Mobil: Varsayılan tek sütun */
}

/* Yükleniyor Mesajı */
.loading-message {
  text-align: center;
  font-weight: 600;
  color: #3b82f6; /* Mavi */
  padding: 2rem;
  font-size: 1.125rem; /* 18px */
}

/* Hata Mesajı */
.error-message {
  text-align: center;
  font-weight: 600;
  color: #991b1b; /* Koyu Kırmızı */
  padding: 1rem;
  background-color: #fee2e2; /* Açık Kırmızı */
  border-radius: 0.5rem; /* 8px */
  border: 1px solid #fca5a5;
}

/* Boş Liste Mesajı */
.empty-message {
  color: #6b7280; /* Orta Gri */
  text-align: center;
  padding: 2rem;
  background-color: #f3f4f6; /* Çok Açık Gri */
  border-radius: 0.5rem; /* 8px */
  font-style: italic;
}

/* --- RESPONSIVE TASARIM --- */

/* Tablet (768px ve üzeri) */
@media (min-width: 768px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr); /* İki sütunlu görünüm */
  }
}

/* Masaüstü (1024px ve üzeri) */
@media (min-width: 1024px) {
  .posts-grid {
    grid-template-columns: repeat(3, 1fr); /* Üç sütunlu görünüm */
  }
}
</style>
