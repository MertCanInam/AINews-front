<template>
  <div>
    <!-- Mobil görünümde menü dışına tıklandığında kapanmayı sağlayan overlay -->
    <div 
      v-if="isOpen" 
      @click="$emit('close-sidebar')" 
      class="mobile-overlay"
    ></div>

    <!-- Sidebar'ın kendisi -->
    <aside :class="['sidebar', { 'is-open': isOpen }]">
      <!-- Logo -->
      <div class="logo-container">
        <svg class="logo-svg" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20C30 25.5228 25.5228 30 20 30C14.4772 30 10 25.5228 10 20Z" fill="white"/>
          <path d="M20 10L15 0H25L20 10Z" fill="white"/>
          <path d="M20 30L15 40H25L20 30Z" fill="white"/>
          <path d="M20 10L25 0V40L20 30V10Z" fill="white" fill-opacity="0.6"/>
          <path d="M10 20L0 25L0 15L10 20Z" fill="white"/>
          <path d="M30 20L40 25L40 15L30 20Z" fill="white"/>
          <text x="50" y="28" font-family="Inter, sans-serif" font-size="24" font-weight="bold" fill="white">News</text>
        </svg>
      </div>
      
      <!-- Kaydırılabilir Menü Alanı -->
      <div class="scrollable-nav">
        <!-- User Menüsü -->
        <nav v-show="!isAdminMode" class="nav-menu">
          <router-link
            v-for="item in userMenu"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            active-class="active-link"
            @click="$emit('close-sidebar')"
          >
            <span class="nav-icon"><i :class="item.icon"></i></span> {{ item.title }}
          </router-link>
        </nav>

        <!-- Admin Menüsü -->
        <nav v-show="isAdminMode" class="nav-menu">
           <router-link
            v-for="item in adminMenu"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            active-class="active-link"
            @click="$emit('close-sidebar')"
          >
            <span class="nav-icon"><i :class="item.icon"></i></span> {{ item.title }}
          </router-link>
        </nav>
      </div>

      <!-- Admin Modu Anahtarı (Sabit Alt Kısım) -->
      <div v-if="auth.roleId === 1" class="admin-switch-container">
        <div class="admin-switch-box">
          <span class="admin-switch-label">⚙️ Admin Modu</span>
          <label class="switch">
            <input type="checkbox" v-model="isAdminMode" />
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useAuthStore } from "@/store/auth";
import { useRouter, useRoute } from "vue-router";
import { usePanelStore } from "@/store/panel";

// Props from parent (MainLayout) to control visibility
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  }
});

// Event to notify parent to close the sidebar
const emit = defineEmits(['close-sidebar']);

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const panelStore = usePanelStore();

const isAdminMode = ref(panelStore.mode === "admin");

// Font Awesome icons
const userMenu = [
  { title: "Ana Sayfa", path: "/dashboard", icon: "fa-solid fa-house" },
  { title: "Gönderiler", path: "/posts", icon: "fa-solid fa-newspaper" },
  { title: "Öneriler", path: "/tickets", icon: "fa-solid fa-comment-dots" },
  { title: "Kaydedilenler", path: "/saved-posts", icon: "fa-solid fa-heart" },
  { title: "Profil", path: "/profile", icon: "fa-solid fa-user" },
];
const adminMenu = [
  { title: "Dashboard", path: "/admin/dashboard", icon: "fa-solid fa-chart-pie" },
  { title: "Kullanıcılar", path: "/admin/users", icon: "fa-solid fa-users" },
  { title: "Gönderiler", path: "/admin/posts", icon: "fa-solid fa-newspaper" },
  { title: "Kaydedilenler", path: "/admin/saved-posts", icon: "fa-solid fa-floppy-disk" },
  { title: "Kaynaklar", path: "/admin/sources", icon: "fa-solid fa-globe" },
  { title: "Ticketlar", path: "/admin/tickets", icon: "fa-solid fa-ticket" },
  { title: "Raporlar", path: "/admin/reports", icon: "fa-solid fa-chart-line" },
  { title: "Admin Profili", path: "/admin/profile", icon: "fa-solid fa-user-shield" },
];

watch(isAdminMode, (val) => {
  panelStore.setMode(val ? "admin" : "user");
  if (val) router.push("/admin/dashboard");
  else router.push("/dashboard");
});

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
/* Ana Sidebar Konteyneri */
.sidebar {
  /* Görünüm */
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  color: white;
  width: 16rem; /* 256px */
  
  /* Konumlandırma */
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 40;
  
  /* Yerleşim */
  display: flex;
  flex-direction: column;
  
  /* Animasyon */
  transition: transform 0.3s ease-in-out;
}

/* Logo Alanı */
.logo-container {
  height: 7rem; /* 112px */
  padding: 1.5rem; /* 24px */
  flex-shrink: 0; /* Küçülmesin */
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-svg {
  height: 4rem; /* 64px */
  width: auto;
}

/* Kaydırılabilir Menü Alanı */
.scrollable-nav {
  flex-grow: 1; /* Mevcut boşluğu doldurur */
  overflow-y: auto; /* Gerektiğinde dikey scrollbar çıkarır */
}
.nav-menu {
  padding-left: 1rem; /* 16px */
  padding-right: 1rem; /* 16px */
}

/* Menü Linkleri */
.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem; /* 12px dikey, 16px yatay boşluk */
  margin: 0.25rem 0; /* 4px dikey boşluk */
  border-radius: 0.5rem; /* 8px köşe yuvarlaklığı */
  color: white;
  text-decoration: none;
  transition: background-color 0.2s;
}
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.nav-icon {
  margin-right: 0.75rem; /* 12px */
  font-size: 1.25rem; /* 20px */
  width: 1.5rem; /* 24px */
  text-align: center;
}

/* Aktif Link Stili */
.active-link {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 700;
  border-left: 4px solid white;
}

/* Admin Anahtarı Alanı */
.admin-switch-container {
  padding: 1.5rem; /* 24px */
  flex-shrink: 0; /* Küçülmesin */
}
.admin-switch-box {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 0.75rem; /* 12px */
  border-radius: 0.5rem; /* 8px */
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.admin-switch-label {
  font-weight: 600; /* Yarı-kalın */
}

/* Admin Anahtarı (Switch) Stilleri */
.switch { position: relative; display: inline-block; width: 60px; height: 34px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #4a5568; transition: .4s; border-radius: 34px; }
.slider:before { position: absolute; content: ""; height: 26px; width: 26px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
input:checked + .slider { background-color: #2563eb; }
input:checked + .slider:before { transform: translateX(26px); }

/* Mobil Arkaplan Karartması (Overlay) */
.mobile-overlay {
  position: fixed;
  inset: 0;
  background-color: black;
  opacity: 0.5;
  z-index: 30;
}

/* --- RESPONSIVE TASARIM --- */

/* Masaüstü (1024px ve daha geniş ekranlar) */
@media (min-width: 1024px) {
  .sidebar {
    /* Masaüstünde sabitlenir ve gizlenmez */
    transform: translateX(0);
  }
  .mobile-overlay {
    display: none; /* Masaüstünde overlay'e gerek yok */
  }
}

/* Tablet ve Mobil (1023px ve daha dar ekranlar) */
@media (max-width: 1023px) {
  .sidebar {
    /* Varsayılan olarak ekranın dışında gizli durur */
    transform: translateX(-100%);
  }
  .sidebar.is-open {
    /* 'is-open' class'ı geldiğinde görünür hale gelir */
    transform: translateX(0);
  }
}
</style>

