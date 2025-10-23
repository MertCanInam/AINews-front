<template>
  <section class="admin-users-page">
    <h1 class="page-title">👥 Kullanıcı Yönetimi</h1>

    <div class="card">
      <!-- Kart Üstü: Arama ve Buton -->
      <div class="card-header">
        <input
          v-model="search"
          type="text"
          placeholder="Ara (isim veya e-posta)..."
          class="search-input"
          @input="fetchUsers"
        />
        <button class="add-user-btn" @click="showCreateModal = true">
          <i class="fa-solid fa-plus"></i> Yeni Kullanıcı
        </button>
      </div>

      <!-- Yeni Kullanıcı Listesi Tasarımı -->
      <div class="user-list-container">
        <!-- Liste Başlığı -->
        <div class="user-list-header">
          <div class="header-cell">Ad Soyad</div>
          <div class="header-cell">Email</div>
          <div class="header-cell">Rol</div>
          <div class="header-cell actions-header">İşlemler</div>
        </div>
        
        <!-- Liste İçeriği -->
        <div class="user-list-body">
          <div v-for="u in users" :key="u.user_id" class="user-row">
            <div class="user-cell" data-label="Ad Soyad">{{ u.first_name }} {{ u.last_name }}</div>
            <div class="user-cell" data-label="Email">{{ u.email }}</div>
            <div class="user-cell" data-label="Rol">
              <select v-model="u.role_id" @change="updateRole(u)" class="role-select">
                <option :value="1">Admin</option>
                <option :value="2">User</option>
              </select>
            </div>
            <div class="user-cell actions-cell">
              <button class="action-btn activity-btn" @click="viewActivity(u)">
                <i class="fa-solid fa-chart-line"></i> Aktivite
              </button>
              <button class="action-btn delete-btn" @click="promptDelete(u)">
                <i class="fa-solid fa-trash-can"></i> Sil
              </button>
            </div>
          </div>
          <div v-if="users.length === 0" class="empty-row">
            Kullanıcı bulunamadı.
          </div>
        </div>
      </div>
    </div>

    <!-- Yeni Kullanıcı Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal">
        <h2>Yeni Kullanıcı Ekle</h2>
        <form @submit.prevent="createUser">
          <input v-model="form.first_name" type="text" placeholder="Ad" required />
          <input v-model="form.last_name" type="text" placeholder="Soyad" required />
          <input v-model="form.email" type="email" placeholder="E-posta" required />
          <input v-model="form.password" type="password" placeholder="Şifre" required />
          <select v-model="form.role_id" required>
            <option disabled value="">Rol Seç</option>
            <option :value="1">Admin</option>
            <option :value="2">User</option>
          </select>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="showCreateModal = false">
              Kapat
            </button>
            <button type="submit" class="btn-primary">Kaydet</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Aktivite Modal -->
    <div v-if="showActivityModal" class="modal-overlay" @click.self="showActivityModal = false">
      <div class="modal">
        <h2>{{ selectedUser?.first_name }} {{ selectedUser?.last_name }}</h2>
        <div class="activity-info">
            <p><strong>Kaydedilen Gönderiler:</strong> {{ activity.savedPostsCount }}</p>
            <p><strong>Açılan Ticket:</strong> {{ activity.ticketsCount }}</p>
            <p><strong>Son Giriş:</strong> {{ formatDate(activity.lastLogin) }}</p>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="showActivityModal = false">
            Kapat
          </button>
        </div>
      </div>
    </div>

    <!-- Silme Onay Modal'ı -->
    <div v-if="showDeleteConfirmModal" class="modal-overlay" @click.self="showDeleteConfirmModal = false">
      <div class="modal delete-confirm-modal">
        <div class="delete-confirm-header">
          <div class="warning-icon">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h2>Kullanıcıyı Sil</h2>
        </div>
        <p class="delete-confirm-text">
          <strong>'{{ userToDelete?.first_name }} {{ userToDelete?.last_name }}'</strong> adlı kullanıcıyı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
import { ref, onMounted } from "vue";
import {
  getAllUsers,
  createUser as apiCreateUser,
  updateUserRole,
  deleteUser as apiDeleteUser,
  getUserActivity,
} from "@/api/admin/adminUserService";

const users = ref([]);
const search = ref("");
const showCreateModal = ref(false);
const showActivityModal = ref(false);
const showDeleteConfirmModal = ref(false); // Yeni state
const userToDelete = ref(null); // Silinecek kullanıcıyı tutmak için
const selectedUser = ref(null);
const activity = ref({});

const form = ref({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  role_id: "",
});

async function fetchUsers() {
  try {
    const { data } = await getAllUsers({ search: search.value });
    users.value = data;
  } catch (error) {
    console.error("Kullanıcılar alınamadı:", error);
  }
}

async function createUser() {
  try {
    await apiCreateUser(form.value);
    showCreateModal.value = false;
    await fetchUsers();
    form.value = { first_name: "", last_name: "", email: "", password: "", role_id: "" };
  } catch (error) {
    console.error("Kullanıcı oluşturulamadı:", error);
  }
}

async function updateRole(user) {
  try {
    await updateUserRole(user.user_id, user.role_id);
  } catch (error) {
    console.error("Rol güncellenemedi:", error);
    await fetchUsers(); 
  }
}

// Silme işlemini başlatan fonksiyon
function promptDelete(user) {
  userToDelete.value = user;
  showDeleteConfirmModal.value = true;
}

// Onay sonrası silme işlemini yapan fonksiyon
async function confirmDelete() {
  if (!userToDelete.value) return;
  try {
    await apiDeleteUser(userToDelete.value.user_id);
    await fetchUsers();
  } catch (error) {
    console.error("Kullanıcı silinemedi:", error);
  } finally {
    showDeleteConfirmModal.value = false;
    userToDelete.value = null;
  }
}

async function viewActivity(user) {
  try {
    selectedUser.value = user;
    const { data } = await getUserActivity(user.user_id);
    activity.value = data;
    showActivityModal.value = true;
  } catch (error) {
    console.error("Kullanıcı aktivitesi alınamadı:", error);
  }
}

function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

onMounted(fetchUsers);
</script>

<style scoped>
.admin-users-page {
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
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}
.search-input {
  padding: 0.6rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 320px;
}
.add-user-btn {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  color: white;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.add-user-btn:hover {
  opacity: 0.9;
}

/* Yeni Liste Tasarımı */
.user-list-header {
  display: grid;
  grid-template-columns: 2fr 3fr 1fr 2fr;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  color: #4b5563;
  border-radius: 0.5rem 0.5rem 0 0;
}
.user-row {
  display: grid;
  grid-template-columns: 2fr 3fr 1fr 2fr;
  gap: 1rem;
  padding: 1rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  align-items: center;
}
.user-row:hover {
  background-color: #f9fafb;
}
.user-cell {
  color: #374151;
}
.actions-header {
  text-align: right;
}
.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
.empty-row {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}
.role-select {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background-color: white;
}

/* Yeni Aksiyon Butonları */
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
.activity-btn {
  background-color: #e0f2fe;
  color: #0c4a6e;
}
.activity-btn:hover {
  background-color: #bae6fd;
}
.delete-btn {
  background-color: #fee2e2;
  color: #991b1b;
}
.delete-btn:hover {
  background-color: #fecaca;
}

/* Modal Stilleri */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.modal {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.modal h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}
.modal form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.modal input, .modal select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}
.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  cursor: pointer;
}
.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  cursor: pointer;
}
.activity-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}
.activity-info p {
    margin: 0;
}

/* Silme Onay Modal'ı için Ek Stiller */
.delete-confirm-modal {
    gap: 1rem;
}
.delete-confirm-header {
    display: flex;
    align-items: center;
    gap: 1rem;
}
.warning-icon {
    font-size: 1.5rem;
    color: #ef4444; /* Kırmızı */
    background-color: #fee2e2;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.delete-confirm-text {
    color: #4b5563;
    line-height: 1.5;
    margin: 0;
}
.btn-danger {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
}
.btn-danger:hover {
  background-color: #dc2626;
}

/* Responsive Kısım */
@media (max-width: 768px) {
    .user-list-header {
        display: none;
    }
    .user-row {
        grid-template-columns: 1fr;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
    }
    .user-row:last-child {
        margin-bottom: 0;
    }
    .user-cell::before {
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

