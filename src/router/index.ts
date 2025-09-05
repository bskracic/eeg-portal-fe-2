import AppLayout from '@/layout/AppLayout.vue';
import { useAuthStore } from '@/stores/authStore';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/dashboard',
            component: AppLayout,
            children: [
                // {
                //     path: '/index',
                //     name: 'dashboard',
                //     component: () => import('@/views/Dashboard.vue')
                // },
                {
                    path: '/upload',
                    name: 'sample-upload',
                    component: () => import('@/views/SampleUpload.vue'),
                    meta: { requiresAdmin: true }
                },
                {
                    path: '/users',
                    name: 'user-table',
                    component: () => import('@/views/admin/UserTable.vue'),
                    meta: { requiresAdmin: true }
                },
                {
                    path: '/users/detail',
                    name: 'user-detail',
                    component: () => import('@/views/admin/UserDetail.vue'),
                    meta: { requiresAdmin: true }
                },
                {
                    path: '/users/detail/requests',
                    name: 'user-detail-request',
                    component: () => import('@/views/admin/UserDataRequestDetail.vue'),
                    meta: { requiresAdmin: true }
                },
                {
                    path: '/data-requests/new',
                    name: 'new-data-request',
                    component: () => import('@/views/user/NewUserDataRequest.vue')
                },
                {
                    path: '/data-requests/list',
                    name: 'data-request-list',
                    component: () => import('@/views/user/UserDataRequestTable.vue')
                }
            ],
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/register',
            name: 'register',
            component: () => import('@/views/pages/auth/Register.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAdmin && !authStore.isAdmin()) {
        return next({ name: "error" });
    }

    next();
});

export default router;
