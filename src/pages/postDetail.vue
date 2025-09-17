<template>
  <div class="post-detail" v-if="post">
    <!-- 🔙 Geri Butonu -->
    <button class="back-btn" @click="goBack">⬅️ Geri</button>

    <!-- Görsel -->
    <div class="image-wrap">
      <img :src="resolvedImage" :alt="post.title" loading="lazy" />
    </div>

    <!-- Başlık -->
    <h1 class="title" :aria-label="post.title">{{ post.title }}</h1>

    <!-- Özet -->
    <p class="summary" v-if="post.summary">{{ post.summary }}</p>

    <!-- İçerik -->
    <div
      class="content"
      v-if="post.content_clean || post.content"
      v-html="post.content_clean || post.content"
    ></div>

    <!-- Kaynağa Git -->
    <a
      v-if="post.source_url"
      :href="post.source_url"
      target="_blank"
      rel="noopener noreferrer"
      class="source-link"
    >
      🌐 Kaynağa Git ↗
    </a>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import http from "@/api/http";

const route = useRoute();
const router = useRouter();
const post = ref(null);

async function fetchPost() {
  try {
    const { data } = await http.get(`/posts/${route.params.id}`);
    post.value = data.data;
  } catch (err) {
    console.error("Post alınamadı:", err);
  }
}

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/posts");
  }
}

const sourceImages = {
  17: "https://upload.wikimedia.org/wikipedia/commons/6/65/BBC_logo_%281997-2021%29.svg",
  15: "https://upload.wikimedia.org/wikipedia/tr/9/9a/Donan%C4%B1mhaber-Logo.png",
  16: "https://siberbulten.com/wp-content/uploads/2021/02/siberbulten-logo-web-125.png",
  14: "https://cdn.brandfetch.io/idnyPaPCQR/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B",
  20: "https://ares.shiftdelete.net/2025/03/logo-2x-1.png"
};
const globalFallback = "https://via.placeholder.com/600x400.png?text=AI+News";

const resolvedImage = computed(() => {
  if (!post.value) return globalFallback;
  return sourceImages[post.value.source_id] || globalFallback;
});

onMounted(fetchPost);
</script>

<style scoped>
.post-detail {
  max-width: 800px;
  margin: 60px auto 20px auto;
  padding: 20px;
  background: var(--card-bg);
  border-radius: 20px;
  box-shadow: 0 12px 28px rgba(79, 172, 254, 0.25);
  border: 1px solid #4facfe;
  transition: box-shadow 0.3s ease;
}
.post-detail:hover {
  box-shadow: 0 40px 80px rgba(79, 172, 254, 0.45);
}

/* 🔙 Geri butonu */
.back-btn {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}
.back-btn:hover {
  filter: brightness(0.9);
}

.image-wrap {
  margin: 20px 0;
  width: 100%;
  aspect-ratio: 16 / 9; /* ✅ responsive */
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: var(--text-color);
}

.summary {
  font-size: 1.1rem;
  margin-bottom: 15px;
  color: var(--text-color);
}

.content {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-color);
  margin-bottom: 20px;
}

.source-link {
  display: inline-block;
  background: #4facfe;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.2s;
}
.source-link:hover {
  background: #1077d1;
}
</style>
