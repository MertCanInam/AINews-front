<template>
  <div class="app-container">
    <!-- Sidebar'ı çağırıyoruz ve durumunu yönetiyoruz -->
    <Sidebar :is-open="sidebarOpen" @close-sidebar="sidebarOpen = false" />
    
    <!-- Ana İçerik Alanı -->
    <div class="main-content-area">
      <!-- Bu iç sarmalayıcı, footer'ın doğru konumlanmasını sağlar -->
      <div class="content-wrapper">
        <!-- Navbar'ı çağırıyoruz ve event'ini dinliyoruz -->
        <Navbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
        
        <!-- Sayfa içeriğinin yükleneceği alan -->
        <main class="page-content">
          <router-view />
        </main>
      </div>
      
      <!-- Footer -->
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Navbar from "@/components/navbar.vue";
import Sidebar from "@/components/sidebar.vue";
import Footer from "@/components/footer.vue";

// Sidebar'ın mobil görünümdeki açık/kapalı durumunu tutan state
const sidebarOpen = ref(false);
</script>

<style scoped>
/* Font Awesome ikon kütüphanesini projeye dahil eder */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

/* Navbar'daki genişlik sorununu çözmek için derin seçici (:deep) kullanılır.
  Bu kural, Navbar bileşeninin içindeki .navbar class'ına etki ederek
  yatay kaydırmaya neden olan 'width: 100%' stilini geçersiz kılar ve
  genişliğin otomatik olarak ayarlanmasını sağlar.
*/
:deep(.navbar) {
  width: auto;
}

/* Navbar'ın sağ tarafındaki kullanıcı bilgisi ve çıkış butonunu sağdan biraz ayırır */
:deep(.navbar .right-side) {
  margin-right: 1rem; /* 16px sağdan boşluk */
}

.app-container {
  background-color: #f1f5f9; /* Açık gri arkaplan */
  /* Yatay kaydırmayı engellemek için */
  overflow-x: hidden;
}

.main-content-area {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  transition: margin-left 0.3s ease-in-out;
}

.content-wrapper {
  flex-grow: 1; /* Footer'ı aşağı itmek için bu alanın büyümesini sağlar */
}

.page-content {
  padding: 2rem; /* 32px içerik boşluğu */
}

/* --- RESPONSIVE TASARIM --- */

/* Masaüstü (1024px ve daha geniş ekranlar) */
@media (min-width: 1024px) {
  .main-content-area {
    /* Kenar çubuğu genişliği (16rem = 256px) kadar soldan boşluk bırakır */
    margin-left: 16rem; 
  }
}

/* Tablet ve Mobil (1023px ve daha dar ekranlar) */
@media (max-width: 1023px) {
  .page-content {
    padding: 1.5rem; /* 24px */
  }
}
</style>

