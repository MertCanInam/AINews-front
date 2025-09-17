<template>
  <section class="admin-users">
    <!-- Header -->
    <div class="header">
      <h1>Kullanıcı Yönetimi</h1>
      <div class="actions">
        <input
          v-model="search"
          type="text"
          placeholder="Ara (isim veya e-mail)..."
          class="search-input"
          @input="fetchUsers"
        />
        <button class="btn-primary" @click="showCreateModal = true">
          ➕ Yeni Kullanıcı
        </button>
      </div>
    </div>

    <!-- Kullanıcı Tablosu -->
    <div class="table-wrapper">
      <table class="user-table">
        <thead>
          <tr>
            <th>Ad Soyad</th>
            <th>Email</th>
            <th>Rol</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.user_id">
            <td>{{ u.first_name }} {{ u.last_name }}</td>
            <td>{{ u.email }}</td>
            <td>
              <select v-model="u.role_id" @change="updateRole(u)">
                <option :value="1">Admin</option>
                <option :value="2">User</option>
              </select>
            </td>
            <td>
              <button class="btn-secondary" @click="viewActivity(u)">📊</button>
              <button class="btn-danger" @click="deleteUser(u)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Yeni Kullanıcı Modal -->
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal">
        <h2>Yeni Kullanıcı Ekle</h2>
        <form @submit.prevent="createUser">
          <input v-model="form.first_name" type="text" placeholder="Ad" required />
          <input v-model="form.last_name" type="text" placeholder="Soyad" required />
          <input v-model="form.email" type="email" placeholder="E-mail" required />
          <input v-model="form.password" type="password" placeholder="Şifre" required />
          <select v-model="form.role_id" required>
            <option disabled value="">Rol Seç</option>
            <option :value="1">Admin</option>
            <option :value="2">User</option>
          </select>
          <div class="modal-actions">
            <button type="submit" class="btn-primary">Kaydet</button>
            <button type="button" class="btn-secondary" @click="showCreateModal = false">
              Kapat
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Aktivite Modal -->
    <div v-if="showActivityModal" class="modal-overlay">
      <div class="modal">
        <h2>{{ selectedUser?.first_name }} {{ selectedUser?.last_name }}</h2>
        <p>📌 Kaydedilen Gönderiler: {{ activity.savedPostsCount }}</p>
        <p>📌 Açılan Ticket: {{ activity.ticketsCount }}</p>
        <p>📌 Son Giriş: {{ formatDate(activity.lastLogin) }}</p>
        <div class="modal-actions">
          <button class="btn-secondary" @click="showActivityModal = false">
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
  const { data } = await getAllUsers({ search: search.value });
  users.value = data;
}

async function createUser() {
  await apiCreateUser(form.value);
  showCreateModal.value = false;
  await fetchUsers();
  form.value = { first_name: "", last_name: "", email: "", password: "", role_id: "" };
}

async function updateRole(user) {
  await updateUserRole(user.user_id, user.role_id);
  await fetchUsers();
}

async function deleteUser(user) {
  if (confirm("Bu kullanıcı silinsin mi?")) {
    await apiDeleteUser(user.user_id);
    await fetchUsers();
  }
}

async function viewActivity(user) {
  selectedUser.value = user;
  const { data } = await getUserActivity(user.user_id);
  activity.value = data;
  showActivityModal.value = true;
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
.admin-users {
  padding: 20px;
  margin-top: 40px;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.search-input {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
}
.search-input:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 6px rgba(79,172,254,0.6);
}

/* Tablo wrapper */
.table-wrapper {
  overflow-x: auto;
  border-radius: 16px;
}
.user-table {
  width: 100%;
  min-width: 600px; /* küçük ekranlarda kaydırılabilir */
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
}
.user-table th {
  padding: 14px;
  text-align: left;
  background: linear-gradient(135deg,#4facfe,#00f2fe);
  color: white;
  font-weight: 600;
  font-size: 14px;
}
.user-table td {
  padding: 14px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}
.user-table tbody tr {
  transition: all 0.2s ease;
}
.user-table tbody tr:hover {
  background: #f8fbff;
  transform: scale(1.01);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

/* Butonlar */
.btn-primary {
  background: linear-gradient(135deg,#4facfe,#00f2fe);
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

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
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
  max-width: 95%;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  animation: pop 0.25s ease;
}
.modal input,
.modal select {
  width: 100%;
  margin-bottom: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 14px;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
}
.modal input:focus,
.modal select:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 6px rgba(79,172,254,0.6);
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@keyframes pop {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* 📱 Responsive */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
  .search-input {
    width: 100%;
  }
}
</style>
