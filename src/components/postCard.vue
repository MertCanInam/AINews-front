<template>
  <article class="post-card" @click="goToDetail">
    <!-- Kaydetme Butonu -->
    <button
      class="save-btn"
      :class="{ saved: isSaved }"
      @click.stop="toggleSave"
    >
      {{ isSaved ? "❤️" : "🤍" }}
    </button>

    <div class="card-content">
      <!-- Resim Alanı -->
      <div class="image-wrap">
        <img :src="resolvedImage" :alt="post.title" />
      </div>

      <!-- Metin İçeriği -->
      <div class="text-content">
        <h2 class="post-title">{{ post.title }}</h2>
        <p class="post-summary">{{ post.summary }}</p>
      </div>
    </div>
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

// Detaya git
const goToDetail = () => {
  router.push(`/posts/${props.post.id}`);
};

// Kaydetme butonu mantığı
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
/* Ana Kart Konteyneri */
.post-card {
  position: relative;
  background-color: white;
  border: 2px solid transparent;
  border-radius: 1rem; /* 16px */
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}
/* Kart üzerine gelince efekt */
.post-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 12px 28px rgba(79, 172, 254, 0.25);
  border-color: #4facfe;
}

/* Kart İçeriği (Resim ve Metinleri Tutan Esnek Kutu) */
.card-content {
  padding: 1.25rem; /* 20px */
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Resim Alanı */
.image-wrap {
  height: 6rem; /* 96px */
  margin-bottom: 1rem; /* 16px */
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-wrap img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

/* Metin İçeriği Alanı */
.text-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Mevcut boşluğu doldurarak kartları aynı hizada tutar */
}

/* Başlık */
.post-title {
  margin: 0;
  font-size: 1.125rem; /* 18px */
  font-weight: 700;
  color: #111827; /* Koyu gri */
  line-height: 1.25;
  margin-bottom: 0.5rem; /* 8px */
  /* Çoklu satırda metni kesme */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Özet Metni */
.post-summary {
  margin: 0;
  font-size: 0.875rem; /* 14px */
  color: #4B5563; /* Orta gri */
  line-height: 1.5;
  /* Çoklu satırda metni kesme */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Kaydetme Butonu */
.save-btn {
  position: absolute;
  top: 0.75rem;  /* 12px */
  right: 0.75rem; /* 12px */
  border: none;
  background: transparent;
  font-size: 1.875rem; /* 30px */
  cursor: pointer;
  transition: transform 0.2s;
  z-index: 10;
}
.save-btn:hover {
  transform: scale(1.2);
}
.save-btn.saved {
  color: #ff4d4f; /* Kırmızı kalp */
}
@keyframes pop {
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
</style>
