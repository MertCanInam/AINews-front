<template>
  <div>
    <!-- Hamburger buton -->
    <button class="hamburger" @click="isOpen = !isOpen">☰</button>

    <!-- Sidebar -->
    <aside :class="['sidebar', { open: isOpen }]">
      <nav class="text">
        <ul>
          <li v-for="item in activeMenu" :key="item.path">
            <router-link :to="item.path" @click="isOpen = false">
              {{ item.icon }} {{ item.title }}
            </router-link>
          </li>
        </ul>

        <!-- Switch sadece adminlerde görünür -->
        <div v-if="auth.roleId === 1" class="switch-container">
          <span>{{ mode === "user" ? "👤 User" : "⚙️ Admin" }}</span>
          <label class="switch">
            <input type="checkbox" v-model="isAdminMode" />
            <span class="slider"></span>
          </label>
        </div>
      </nav>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useAuthStore } from "@/store/auth";
import { useRouter, useRoute } from "vue-router";
import { usePanelStore } from "@/store/panel";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const panelStore = usePanelStore();

// switch input state
const isAdminMode = ref(panelStore.mode === "admin");
const isOpen = ref(false); // 🔹 mobil sidebar aç/kapa

// menüler
const userMenu = [
  { title: "Ana Sayfa", path: "/dashboard", icon: "📊" },
  { title: "Gönderiler", path: "/posts", icon: "📰" },
  { title: "Öneriler", path: "/tickets", icon: "💬" },
  { title: "Kaydedilenler", path: "/saved-posts", icon: "❤️" },
  { title: "Profil", path: "/profile", icon: "👤" },
];

const adminMenu = [
  { title: "Dashboard", path: "/admin/dashboard", icon: "📊" },
  { title: "Kullanıcı Yönetimi", path: "/admin/users", icon: "⚙️" },
  { title: "Kaynak Yönetimi", path: "/admin/sources", icon: "🌐" },
  { title: "Gönderi Yönetimi", path: "/admin/posts", icon: "📰" },
  { title: "Ticket Yönetimi", path: "/admin/tickets", icon: "🎟️" },
  { title: "Raporlar", path: "/admin/reports", icon: "📈" },
  { title: "Kaydedilen Gönderiler", path: "/admin/saved-posts", icon: "❤️" },
  { title: "Profil", path: "/admin/profile", icon: "👤" },
];

// aktif menü
const activeMenu = computed(() =>
  panelStore.mode === "user" ? userMenu : adminMenu
);

// geçişleri izle
watch(isAdminMode, (val) => {
  panelStore.setMode(val ? "admin" : "user");

  if (val) router.push("/admin/dashboard");
  else router.push("/dashboard");
});

// 🔹 route değişince sidebar otomatik kapanır
watch(
  () => route.fullPath,
  () => {
    isOpen.value = false;
  }
);

// sayfa yenilendiğinde route kontrolü
onMounted(() => {
  if (route.path.startsWith("/admin")) {
    panelStore.setMode("admin");
    isAdminMode.value = true;
  } else {
    panelStore.setMode("user");
    isAdminMode.value = false;
  }
});
</script>


<style scoped>
.sidebar {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: #fff;
  padding-top: 100px;
  flex-shrink: 0;
  min-height: calc(100vh - 56px - 48px);
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: left 0.3s ease;
}

/* Menü elemanları */
.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar li {
  margin-bottom: 12px;
}
.sidebar a {
  display: block;
  padding: 10px 15px;
  border-radius: 4px;
  color: #ecf0f1;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}
.sidebar a:hover {
  background: #3d566e;
}
.sidebar a.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: bold;
  border-left: 4px solid white;
}

.text {
  margin-left: 20px;
}

/* Switch */
.switch-container {
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  border-radius: 26px;
  transition: 0.4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: #4facfe;
  transition: 0.4s;
  border-radius: 50%;
}
.switch input:checked + .slider {
  background-color: black;
}
.switch input:checked + .slider:before {
  transform: translateX(24px);
  background-color: white;
}

/* 🔹 Hamburger buton */
.hamburger {
  display: none;
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1100;
  background: #4facfe;
  color: white;
  border: none;
  font-size: 22px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

/* 🔹 Responsive */
@media (max-width: 992px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: -220px;
    height: 100vh;
    z-index: 1000;
  }
  .sidebar.open {
    left: 0;
  }
  .hamburger {
    display: block;
  }
}
</style>
