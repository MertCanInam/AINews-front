<template>
  <section class="admin-posts">
    <!-- Header -->
    <div class="header">
      <h1>Haber Yönetimi</h1>
    </div>

    <!-- Haberler Tablosu -->
    <div class="table-wrapper">
      <table class="post-table">
        <thead>
          <tr>
            <th>Başlık</th>
            <th>Oluşturulma</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in posts" :key="p.id">
            <td>
              <router-link :to="`/posts/${p.id}`" class="post-link">
                {{ p.title }}
              </router-link>
            </td>
            <td>{{ new Date(p.created_at).toLocaleDateString() }}</td>
            <td>
              <button class="btn-danger" @click="deletePostConfirm(p)">
                🗑️ Sil
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ✅ Modern Pagination -->
    <div class="pagination" v-if="pagination.totalPages > 1">
      <button
        class="btn-nav"
        :disabled="pagination.currentPage === 1"
        @click="changePage(pagination.currentPage - 1)"
      >
        ⬅️ Önceki
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
        v-if="pagination.totalPages > maxVisiblePages"
        class="btn-page"
        :class="{ active: pagination.totalPages === pagination.currentPage }"
        @click="changePage(pagination.totalPages)"
      >
        {{ pagination.totalPages }}
      </button>

      <button
        class="btn-nav"
        :disabled="pagination.currentPage === pagination.totalPages"
        @click="changePage(pagination.currentPage + 1)"
      >
        Sonraki ➡️
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getAllPosts, deletePost } from "@/api/admin/adminPostService";

const posts = ref([]);
const pagination = ref({ total: 0, currentPage: 1, totalPages: 1 });
const maxVisiblePages = 6;

async function fetchPosts(page = 1) {
  const res = await getAllPosts({ page, limit: 10 });
  posts.value = res.posts;
  pagination.value = {
    total: res.total,
    currentPage: page,
    totalPages: res.totalPages,
  };
}

function changePage(page) {
  if (page >= 1 && page <= pagination.value.totalPages) {
    fetchPosts(page);
  }
}

const visiblePages = computed(() => {
  const total = pagination.value.totalPages;
  const current = pagination.value.currentPage;

  if (total <= maxVisiblePages) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, 5, 6];
  }

  if (current >= total - 2) {
    return Array.from({ length: 6 }, (_, i) => total - 5 + i);
  }

  return Array.from({ length: 6 }, (_, i) => current - 2 + i);
});

async function deletePostConfirm(post) {
  if (confirm(`"${post.title}" haberi silinsin mi?`)) {
    await deletePost(post.id);
    await fetchPosts(pagination.value.currentPage);
  }
}

onMounted(() => fetchPosts());
</script>

<style scoped>
.admin-posts {
  padding: 20px;
  margin-top: 40px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

/* ✅ Tablo sarmalayıcı (mobil kaydırma için) */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.post-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  min-width: 500px; /* mobilde yatay kaydırılabilir */
}

.post-table th {
  padding: 14px;
  text-align: left;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  font-weight: 600;
  font-size: 14px;
}
.post-table td {
  padding: 14px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #444;
}

.post-table tbody tr {
  transition: all 0.2s ease;
}
.post-table tbody tr:hover {
  background: #f8fbff;
  transform: scale(1.01);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.btn-danger {
  background: #ff5f5f;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-danger:hover {
  background: #e84141;
}

/* ✅ Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  flex-wrap: wrap; /* mobilde satıra sığmazsa alta iner */
}

.btn-nav {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 25px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-nav:hover:not(:disabled) {
  filter: brightness(0.9);
}

.btn-page {
  background: #f8f9fa;
  border: 1px solid #ddd;
  padding: 8px 14px;
  border-radius: 50%;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}
.btn-page:hover {
  background: #e9ecef;
}
.btn-page.active {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  font-weight: bold;
  border: none;
}

.dots {
  font-weight: bold;
  padding: 0 6px;
  color: #666;
}

.post-link {
  color: #444;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}
.post-link:hover {
  color: #000;
  text-decoration: underline;
}

/* 🔹 Tablet */
@media (max-width: 992px) {
  .post-table th, .post-table td {
    padding: 10px;
    font-size: 13px;
  }
  .btn-danger {
    padding: 5px 10px;
    font-size: 13px;
  }
}

/* 🔹 Telefon */
@media (max-width: 576px) {
  .header h1 {
    font-size: 18px;
  }
  .btn-nav {
    padding: 6px 12px;
    font-size: 13px;
  }
  .btn-page {
    padding: 6px 10px;
    font-size: 12px;
  }
}
</style>
