<template>
  <section class="admin-posts-page">
    <h1 class="page-title">📰 Haber Yönetimi</h1>

    <div class="card">
      <!-- Haber Listesi -->
      <div class="posts-list-container">
        <!-- Liste Başlığı -->
        <div class="posts-list-header">
          <div class="header-cell">Başlık</div>
          <div class="header-cell">Oluşturulma</div>
          <div class="header-cell actions-header">İşlemler</div>
        </div>

        <!-- Liste İçeriği -->
        <div class="posts-list-body">
          <div v-for="p in posts" :key="p.id" class="post-row">
            <div class="post-cell" data-label="Başlık">
              <router-link :to="`/posts/${p.id}`" class="post-link">
                {{ p.title }}
              </router-link>
            </div>
            <div class="post-cell" data-label="Oluşturulma">{{ new Date(p.created_at).toLocaleDateString() }}</div>
            <div class="post-cell actions-cell">
              <button class="action-btn delete-btn" @click="promptDelete(p)">
                <i class="fa-solid fa-trash-can"></i> Sil
              </button>
            </div>
          </div>
          <div v-if="posts.length === 0" class="empty-row">
            Gösterilecek haber bulunamadı.
          </div>
        </div>
      </div>

      <!-- Sayfalama (Pagination) -->
      <div class="pagination" v-if="pagination.totalPages > 1">
        <button class="btn-nav" :disabled="pagination.currentPage === 1" @click="changePage(pagination.currentPage - 1)">
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <button
          v-for="page in visiblePages"
          :key="page"
          class="btn-page"
          :class="{ active: page === pagination.currentPage }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>

        <span v-if="pagination.totalPages > maxVisiblePages" class="dots">...</span>

        <button
          v-if="pagination.totalPages > maxVisiblePages && !visiblePages.includes(pagination.totalPages)"
          class="btn-page"
          :class="{ active: pagination.totalPages === pagination.currentPage }"
          @click="changePage(pagination.totalPages)"
        >
          {{ pagination.totalPages }}
        </button>

        <button class="btn-nav" :disabled="pagination.currentPage === pagination.totalPages" @click="changePage(pagination.currentPage + 1)">
           <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
    
    <!-- Silme Onay Modal'ı -->
    <div v-if="showDeleteConfirmModal" class="modal-overlay" @click.self="showDeleteConfirmModal = false">
      <div class="modal delete-confirm-modal">
        <div class="delete-confirm-header">
          <div class="warning-icon">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h2>Haberi Sil</h2>
        </div>
        <p class="delete-confirm-text">
          <strong>'{{ postToDelete?.title }}'</strong> başlıklı haberi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
        </p>
        <div class="modal-actions">
          <button type="button" class="btn-secondary" @click="showDeleteConfirmModal = false">
            İptal
          </button>
          <button type="button" class="btn-danger" @click="confirmDelete">
            Evet, Sil
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getAllPosts, deletePost } from "@/api/admin/adminPostService";

const posts = ref([]);
const pagination = ref({ total: 0, currentPage: 1, totalPages: 1 });
const maxVisiblePages = 5;
const showDeleteConfirmModal = ref(false);
const postToDelete = ref(null);

async function fetchPosts(page = 1) {
  try {
    const res = await getAllPosts({ page, limit: 10 });
    posts.value = res.posts;
    pagination.value = {
      total: res.total,
      currentPage: page,
      totalPages: res.totalPages,
    };
  } catch (error) {
    console.error("Haberler alınamadı:", error);
  }
}

function changePage(page) {
  if (page >= 1 && page <= pagination.value.totalPages) {
    fetchPosts(page);
  }
}

const visiblePages = computed(() => {
  const total = pagination.value.totalPages;
  const current = pagination.value.currentPage;
  const range = [];

  if (total <= maxVisiblePages) {
    for (let i = 1; i <= total; i++) {
      range.push(i);
    }
    return range;
  }

  let start = Math.max(1, current - 2);
  let end = Math.min(total, current + 2);

  if (current <= 3) {
    end = maxVisiblePages;
  } else if (current > total - 3) {
    start = total - maxVisiblePages + 1;
  }
  
  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  return range;
});

function promptDelete(post) {
  postToDelete.value = post;
  showDeleteConfirmModal.value = true;
}

async function confirmDelete() {
  if (!postToDelete.value) return;
  try {
    await deletePost(postToDelete.value.id);
    // Eğer son sayfadaki son eleman siliniyorsa, bir önceki sayfaya git
    if (posts.value.length === 1 && pagination.value.currentPage > 1) {
      await fetchPosts(pagination.value.currentPage - 1);
    } else {
      await fetchPosts(pagination.value.currentPage);
    }
  } catch (error) {
    console.error("Haber silinemedi:", error);
  } finally {
    showDeleteConfirmModal.value = false;
    postToDelete.value = null;
  }
}

onMounted(() => fetchPosts());
</script>

<style scoped>
.admin-posts-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.page-title {
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
}

/* Ana Kart */
.card {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* Liste Tasarımı */
.posts-list-header {
  display: grid;
  grid-template-columns: 4fr 2fr 1fr;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  color: #4b5563;
  border-radius: 0.5rem 0.5rem 0 0;
}
.post-row {
  display: grid;
  grid-template-columns: 4fr 2fr 1fr;
  gap: 1rem;
  padding: 1rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  align-items: center;
}
.post-row:hover {
  background-color: #f9fafb;
}
.post-cell { color: #374151; }
.actions-header { text-align: right; }
.actions-cell {
  display: flex;
  justify-content: flex-end;
}
.empty-row {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}
.post-link {
  color: #374151;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}
.post-link:hover {
  color: #3b82f6;
  text-decoration: underline;
}

/* Aksiyon Butonları */
.action-btn {
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.4rem 0.8rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: background-color 0.2s;
}
.delete-btn {
  background-color: #fee2e2;
  color: #991b1b;
}
.delete-btn:hover {
  background-color: #fecaca;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}
.btn-nav, .btn-page {
  border: 1px solid #d1d5db;
  background-color: white;
  color: #374151;
  border-radius: 0.375rem;
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-nav:hover:not(:disabled), .btn-page:hover {
  background-color: #f9fafb;
}
.btn-page.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}
.dots {
  color: #6b7280;
}


/* Modal Stilleri */
.modal-overlay { position: fixed; inset: 0; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; }
.modal { background: white; padding: 2rem; border-radius: 1rem; width: 100%; max-width: 450px; display: flex; flex-direction: column; gap: 1.5rem; }
.modal h2 { font-size: 1.25rem; font-weight: 700; margin: 0; }
.modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem; }
.btn-secondary { background-color: #e5e7eb; color: #374151; border: none; padding: 0.6rem 1.2rem; border-radius: 0.5rem; cursor: pointer; }
.delete-confirm-modal { gap: 1rem; }
.delete-confirm-header { display: flex; align-items: center; gap: 1rem; }
.warning-icon { font-size: 1.5rem; color: #ef4444; background-color: #fee2e2; width: 3rem; height: 3rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.delete-confirm-text { color: #4b5563; line-height: 1.5; margin: 0; }
.btn-danger { background-color: #ef4444; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 0.5rem; cursor: pointer; font-weight: 600; }
.btn-danger:hover { background-color: #dc2626; }

/* Responsive Kısım */
@media (max-width: 768px) {
    .posts-list-header {
        display: none;
    }
    .post-row {
        grid-template-columns: 1fr;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
    }
    .post-cell::before {
        content: attr(data-label);
        font-weight: 600;
        display: block;
        margin-bottom: 0.25rem;
        color: #6b7280;
    }
    .actions-cell {
        justify-content: flex-start;
    }
}
</style>
