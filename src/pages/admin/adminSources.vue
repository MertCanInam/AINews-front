<template>
  <section class="admin-sources">
    <!-- Header -->
    <div class="header">
      <h1>Kaynak Yönetimi</h1>
      <div class="actions">
        <button class="btn-primary" @click="openCreateModal">➕ Yeni Kaynak</button>
      </div>
    </div>

    <!-- Kaynak Tablosu -->
    <table class="source-table">
      <thead>
        <tr>
          <th>Ad</th>
          <th>URL</th>
          <th>Durum</th>
          <th>İşlemler</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in sources" :key="s.id">
          <td data-label="Ad">{{ s.name }}</td>
          <td data-label="URL">{{ s.url }}</td>
          <td data-label="Durum">
            <span :class="s.active ? 'status-active' : 'status-passive'">
              {{ s.active ? "Aktif" : "Pasif" }}
            </span>
          </td>
          <td data-label="İşlemler">
            <button class="btn-secondary" @click="editSource(s)">✏️</button>
            <button class="btn-danger" @click="deleteSourceConfirm(s)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Yeni/Güncelleme Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>{{ editMode ? "Kaynağı Güncelle" : "Yeni Kaynak Ekle" }}</h2>
        <form @submit.prevent="saveSource">
          <input v-model="form.name" type="text" placeholder="Kaynak Adı" required />
          <input v-model="form.url" type="url" placeholder="Kaynak URL" required />
          <select v-model="form.is_active" required>
            <option :value="true">Aktif</option>
            <option :value="false">Pasif</option>
          </select>
          <div class="modal-actions">
            <button type="submit" class="btn-primary">Kaydet</button>
            <button type="button" class="btn-secondary" @click="closeModal">
              Kapat
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Log Modal -->
    <div v-if="showLogsModal" class="modal-overlay">
      <div class="modal">
        <h2>{{ selectedSource?.name }} - Loglar</h2>
        <pre>{{ logs }}</pre>
        <div class="modal-actions">
          <button class="btn-secondary" @click="showLogsModal = false">
            Kapat
          </button>
        </div>
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
  getSourceLogs,
} from "@/api/admin/adminSourceService";

const sources = ref([]);
const showModal = ref(false);
const editMode = ref(false);
const selectedSource = ref(null);
const showLogsModal = ref(false);
const logs = ref("");

const form = ref({
  name: "",
  url: "",
  active: true,
});

// 🔹 Kaynakları getir
async function fetchSources() {
  const { data } = await getAllSources();
  sources.value = data;
}

// 🔹 Yeni kaynak modalını aç
function openCreateModal() {
  form.value = { name: "", url: "", active: true };
  editMode.value = false;
  showModal.value = true;
}

// 🔹 Kaynak düzenleme modalı
function editSource(source) {
  form.value = { ...source };
  editMode.value = true;
  showModal.value = true;
}

// 🔹 Kaydet
async function saveSource() {
  const payload = { ...form.value };
  if (!editMode.value) {
    delete payload.id;
    await createSource(payload);
  } else {
    await updateSource(form.value.id, payload);
  }
  await fetchSources();
  closeModal();
}

// 🔹 Kaynağı sil
async function deleteSourceConfirm(source) {
  if (confirm(`"${source.name}" kaynağı silinsin mi?`)) {
    await deleteSource(source.id);
    await fetchSources();
  }
}

// 🔹 Logları getir
async function viewLogs(source) {
  selectedSource.value = source;
  const { data } = await getSourceLogs(source.id);
  logs.value = JSON.stringify(data, null, 2);
  showLogsModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

onMounted(fetchSources);
</script>

<style scoped>
.admin-sources {
  padding: 20px;
  margin-top: 40px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.source-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}
.source-table th {
  padding: 14px;
  text-align: left;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  font-weight: 600;
  font-size: 14px;
}
.source-table td {
  padding: 14px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

/* ✅ Hover animasyon */
.source-table tbody tr {
  transition: all 0.2s ease;
}
.source-table tbody tr:hover {
  background: #f8fbff;
  transform: scale(1.01);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.btn-primary {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  filter: brightness(0.9);
}

.btn-secondary {
  background: #f0f0f0;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-secondary:hover {
  background: #e2e2e2;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 420px;
  max-width: 90%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
.modal input,
.modal select {
  width: 100%;
  margin-bottom: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 14px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.status-active {
  color: green;
  font-weight: 600;
}
.status-passive {
  color: red;
  font-weight: 600;
}

/* 🔹 Tablet */
@media (max-width: 992px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .btn-primary {
    width: 100%;
  }
}

/* 🔹 Telefon */
@media (max-width: 576px) {
  .admin-sources {
    padding: 10px;
  }

  /* 🔥 tablo kaydırılabilir */
  .source-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .source-table th,
  .source-table td {
    font-size: 13px;
    padding: 10px;
  }

  .modal {
    padding: 16px;
  }
  .modal-actions {
    flex-direction: column;
  }
  .modal-actions button {
    width: 100%;
  }
}
</style>
