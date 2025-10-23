<template>
  <section class="admin-sources-page">
    <h1 class="page-title">🌐 Kaynak Yönetimi</h1>

    <div class="card">
      <div class="card-header">
        <button class="add-source-btn" @click="openCreateModal">
          <i class="fa-solid fa-plus"></i> Yeni Kaynak Ekle
        </button>
      </div>

      <div class="table-wrapper">
        <table class="source-table">
          <thead>
            <tr>
              <th>Ad</th>
              <th>URL</th>
              <th>Durum</th>
              <th class="actions-header">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in sources" :key="s.id">
              <td data-label="Ad">{{ s.name }}</td>
              <td data-label="URL">{{ s.url }}</td>
              <td data-label="Durum">
                <span class="status-badge" :class="s.active ? 'status-active' : 'status-passive'">
                  {{ s.active ? "Aktif" : "Pasif" }}
                </span>
              </td>
              <td data-label="İşlemler" class="actions-cell">
                <button class="action-btn edit-btn" @click="editSource(s)">
                  <i class="fa-solid fa-pencil"></i> Düzenle
                </button>
                <button class="action-btn delete-btn" @click="deleteSourceConfirm(s)">
                  <i class="fa-solid fa-trash-can"></i> Sil
                </button>
              </td>
            </tr>
            <tr v-if="sources.length === 0">
              <td colspan="4" class="empty-row">Kaynak bulunamadı.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Yeni/Güncelleme Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ editMode ? "Kaynağı Güncelle" : "Yeni Kaynak Ekle" }}</h2>
        <form @submit.prevent="saveSource">
          <input v-model="form.name" type="text" placeholder="Kaynak Adı" required />
          <input v-model="form.url" type="url" placeholder="Kaynak URL" required />
          <select v-model="form.active" required>
            <option :value="true">Aktif</option>
            <option :value="false">Pasif</option>
          </select>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="closeModal">
              Kapat
            </button>
            <button type="submit" class="btn-primary">Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getAllSources,
  createSource,
  updateSource,
  deleteSource,
} from "@/api/admin/adminSourceService";

const sources = ref([]);
const showModal = ref(false);
const editMode = ref(false);

const form = ref({
  name: "",
  url: "",
  active: true,
});

// Kaynakları getir
async function fetchSources() {
  try {
    const { data } = await getAllSources();
    sources.value = data;
  } catch (error) {
    console.error("Kaynaklar alınamadı:", error);
  }
}

// Yeni kaynak modalını aç
function openCreateModal() {
  form.value = { id: null, name: "", url: "", active: true };
  editMode.value = false;
  showModal.value = true;
}

// Kaynak düzenleme modalı
function editSource(source) {
  form.value = { ...source };
  editMode.value = true;
  showModal.value = true;
}

// Kaydet
async function saveSource() {
  try {
    const payload = { ...form.value };
    if (!editMode.value) {
      delete payload.id;
      await createSource(payload);
    } else {
      await updateSource(form.value.id, payload);
    }
    await fetchSources();
    closeModal();
  } catch (error) {
    console.error("Kaynak kaydedilemedi:", error);
  }
}

// Kaynağı sil
async function deleteSourceConfirm(source) {
  if (confirm(`'${source.name}' kaynağını silmek istediğinizden emin misiniz?`)) {
    try {
      await deleteSource(source.id);
      await fetchSources();
    } catch (error) {
      console.error("Kaynak silinemedi:", error);
    }
  }
}

function closeModal() {
  showModal.value = false;
}

onMounted(fetchSources);
</script>

<style scoped>
.admin-sources-page {
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
.card-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}
.add-source-btn {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  color: white;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.add-source-btn:hover {
  opacity: 0.9;
}

/* Tablo */
.table-wrapper {
  overflow-x: auto;
}
.source-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
.source-table th {
  background-color: #f9fafb;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
}
.source-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
}
.source-table tbody tr:hover {
  background-color: #f9fafb;
}
.empty-row td {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

/* Durum Rozeti */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.8rem;
}
.status-active {
  background-color: #dcfce7;
  color: #166534;
}
.status-passive {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Aksiyon Butonları */
.actions-header { text-align: right; }
.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
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
.edit-btn {
  background-color: #e0e7ff;
  color: #3730a3;
}
.edit-btn:hover { background-color: #c7d2fe; }
.delete-btn {
  background-color: #fee2e2;
  color: #991b1b;
}
.delete-btn:hover { background-color: #fecaca; }

/* Modal Stilleri */
.modal-overlay { position: fixed; inset: 0; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; }
.modal { background: white; padding: 2rem; border-radius: 1rem; width: 100%; max-width: 450px; display: flex; flex-direction: column; gap: 1.5rem; }
.modal h2 { font-size: 1.25rem; font-weight: 700; margin: 0; }
.modal form { display: flex; flex-direction: column; gap: 1rem; }
.modal input, .modal select { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; }
.modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem; }
.btn-primary { background-color: #3b82f6; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 0.5rem; cursor: pointer; }
.btn-secondary { background-color: #e5e7eb; color: #374151; border: none; padding: 0.6rem 1.2rem; border-radius: 0.5rem; cursor: pointer; }

/* Responsive */
@media (max-width: 640px) {
  .source-table th, .source-table td {
    padding: 0.75rem 1rem;
  }
  .actions-cell {
    flex-direction: column;
  }
}
</style>
