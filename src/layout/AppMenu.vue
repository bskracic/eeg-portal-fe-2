<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Data',
        items: [
            { label: 'Overview', icon: 'pi pi-fw pi-database', to: '/' },
            { label: 'Upload', icon: 'pi pi-upload', to: '/upload' },
            // { label: 'Columns', icon: 'pi pi-hashtag', to: '/dashboard/columns' },
            // { label: 'Markers', icon: 'pi pi-stop-circle', to: '/dashboard/columns' },
            // { label: 'Demographic', icon: 'pi pi-id-card', to: '/dashboard/demographic' },
        ]
    },
    {
        label: 'Requests',
        items: [
            { label: 'List', icon: 'pi pi-fw pi-id-card', to: '/data-requests/list' },
            { label: 'New Request ', icon: 'pi pi-fw pi-check-square', to: '/data-requests/new' },
        ]
    },
    {
        label: 'Users',
        items: [
            { label: 'List', icon: 'pi pi-users', to: '/users' }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
