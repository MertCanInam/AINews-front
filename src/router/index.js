import { createRouter, createWebHistory } from "vue-router";
import Login from "@/pages/login.vue";
import Register from "@/pages/register.vue";
import Dashboard from "@/pages/dashboard.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import { useAuthStore } from "@/store/auth";

const routes = [
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        redirect: () => {
          const authStore = useAuthStore();
          if (authStore.user?.role_id === 1) {
            return "/admin/dashboard"; // admin → admin dashboard
          }
          return "/dashboard"; // normal user → user dashboard
        },
      },

      // Dashboard
      { path: "dashboard", component: Dashboard, meta: { requiresAuth: true } },

      // Posts
      {
        path: "posts",
        component: () => import("@/pages/posts.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "posts/:id",
        component: () => import("@/pages/postDetail.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "saved-posts",
        component: () => import("@/pages/savedPosts.vue"),
        meta: { requiresAuth: true },
      },

      // Tickets
      {
        path: "tickets",
        component: () => import("@/pages/tickets.vue"),
        meta: { requiresAuth: true },
      },

      // Profile
      {
        path: "profile",
        component: () => import("@/pages/profile.vue"),
        meta: { requiresAuth: true },
      },

      // Confirm Email
      {
        path: "confirm-email",
        component: () => import("@/pages/confirmEmail.vue"),
      },

      // Admin Dashboard
      {
        path: "admin/dashboard",
        component: () => import("@/pages/admin/adminDashboard.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },

      //  Admin Routes
      {
        path: "admin/users",
        component: () => import("@/pages/admin/adminUsers.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "admin/sources",
        component: () => import("@/pages/admin/adminSources.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "admin/posts", 
        component: () => import("@/pages/admin/adminPosts.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      // router/index.js
      {
        path: "admin/tickets",
        component: () => import("@/pages/admin/adminTickets.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "admin/reports",
        component: () => import("@/pages/admin/adminReports.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "admin/saved-posts",
        component: () => import("@/pages/admin/adminSavedPosts.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "admin/profile", 
        component: () => import("@/pages/admin/adminProfile.vue"),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  // token varsa global header set et
  if (authStore.token) {
    import("@/api/http").then(({ setAuthHeader }) =>
      setAuthHeader(authStore.token)
    );
  }

  // Giriş kontrolü
  if (to.meta.requiresAuth) {
    if (!authStore.token) {
      return "/login";
    }
    if (!authStore.user) {
      try {
        await authStore.fetchMe();
      } catch {
        authStore.logoutUser();
        return "/login";
      }
    }
  }

  //  Admin kontrolü
  if (to.meta.requiresAdmin && authStore.user?.role_id !== 1) {
    return "/dashboard"; // admin değilse ana sayfaya at
  }
});

export default router;
