<template>
  <article class="post-card" @click="goToDetail">
    <div class="image-wrap">
      <img :src="resolvedImage" :alt="post.title" />
    </div>

    <div class="content">
      <h2 class="post-title">{{ post.title }}</h2>
      <p class="post-summary">{{ post.summary }}</p>
    </div>

    <!-- ❤️ Kaydetme butonu -->
    <button
      class="save-btn"
      :class="{ saved: isSaved }"
      @click.stop="toggleSave"
    >
      {{ isSaved ? "❤️" : "🤍" }}
    </button>
  </article>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { savePost, unsavePost, isPostSaved } from "@/api/savedPostsService";

const props = defineProps({
  post: { type: Object, required: true },
});

const router = useRouter();

// Kaynak ID → Logo eşleştirmesi
const sourceImages = {
  17: "https://upload.wikimedia.org/wikipedia/commons/6/65/BBC_logo_%281997-2021%29.svg",
  15: "https://upload.wikimedia.org/wikipedia/tr/9/9a/Donan%C4%B1mhaber-Logo.png",
  16: "https://siberbulten.com/wp-content/uploads/2021/02/siberbulten-logo-web-125.png",
  14: "https://cdn.brandfetch.io/idnyPaPCQR/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B",
  20: "https://ares.shiftdelete.net/2025/03/logo-2x-1.png"
};
const globalFallback = "https://via.placeholder.com/300x200.png?text=AI+News";

const resolvedImage = computed(() => {
  return sourceImages[props.post.source_id] || globalFallback;
});

// 🔥 Detaya git
const goToDetail = () => {
  router.push(`/posts/${props.post.id}`);
};

// --- Kaydetme butonu ---
const isSaved = ref(false);

const checkSaved = async () => {
  try {
    const { data } = await isPostSaved(props.post.id);
    isSaved.value = data?.saved ?? false;
  } catch {
    isSaved.value = false;
  }
};

const toggleSave = async () => {
  try {
    if (isSaved.value) {
      await unsavePost(props.post.id);
      isSaved.value = false;
    } else {
      await savePost(props.post.id);
      isSaved.value = true;
    }
  } catch (e) {
    console.error("❌ Kaydetme hatası:", e);
  }
};

onMounted(checkSaved);
</script>

<style scoped>
.post-card {
  position: relative;
  display: grid;
  grid-template-columns: 4fr 6fr;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 2px 6px var(--shadow);
  cursor: pointer;
  width: 90%;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.post-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 12px 28px rgba(79, 172, 254, 0.25);
  border-color: #4facfe;
}

.image-wrap {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-alt);
  overflow: hidden;
}
.image-wrap img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.post-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.post-summary {
  margin: 0;
  font-size: 0.92rem;
  color: var(--muted);
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ❤️ Kaydet butonu */
.save-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  border: none;
  background: transparent;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;
}
.save-btn:hover {
  transform: scale(1.2);
}
.save-btn.saved {
  color: #ff4d4f;
}

/* 🔹 Responsive */
@media (max-width: 992px) {
  .post-card {
    grid-template-columns: 1fr; /* Tablet ve küçük cihazlarda tek sütun */
    text-align: center;
  }

  .image-wrap {
    height: auto;
    padding: 8px 0;
  }

  .content {
    align-items: center;
  }
}

@media (max-width: 576px) {
  .post-card {
    padding: 10px;
    gap: 10px;
  }

  .post-title {
    font-size: 0.95rem;
  }

  .post-summary {
    font-size: 0.85rem;
  }

  .save-btn {
    font-size: 1.3rem;
  }
}
</style>
