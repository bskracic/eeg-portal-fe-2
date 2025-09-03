<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50" style="background: url('/images/pattern.png');">
    <Card class="p-6 mx-auto" style="max-width: 400px; width: 100%; height: auto;">
      <template #title>
        <div class="text-center text-xl font-semibold">
          {{ t('login.title') }}
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
          <Message v-if="authStore.error" severity="error" class="mb-2 w-full">
            {{ authStore.error }}
          </Message>

          <div>
            <span class="p-float-label w-full">
              <InputText id="username" v-model="username" :disabled="authStore.loading" class="w-full" />
              <label for="username"> {{ t('login.email') }} </label>
            </span>
            <small v-if="showErrors && usernameErrors" class="p-error">
              {{ usernameErrors }}
            </small>
          </div>

          <div>
            <span class="p-float-label w-full">
              <Password id="password" v-model="password" toggleMask :disabled="authStore.loading" inputClass="w-full"
                class="w-full" />
              <label for="password"> {{ t('login.password') }} </label>
            </span>
            <small v-if="showErrors && passwordErrors" class="p-error">
              {{ passwordErrors }}
            </small>
          </div>

          <!-- Submit Button -->
          <Button type="submit" :label="t('login.submit')" class="w-full" :loading="authStore.loading"
            :disabled="authStore.loading" />
        </form>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import i18n from '@/i18n'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { computed, ref } from 'vue'

import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Password from 'primevue/password'

const { t } = i18n.global
const username = ref('')
const password = ref('')
const showErrors = ref(false)

const authStore = useAuthStore()

const usernameErrors = computed(() => {
  if (!username.value) {
    return t('validation.required', { field: t('login.email').toLowerCase() })
  }
  return ''
})

const passwordErrors = computed(() => {
  if (!password.value) {
    return t('validation.required', { field: t('login.password').toLowerCase() })
  }
  return ''
})

const handleSubmit = async () => {
  showErrors.value = true
  if (usernameErrors.value || passwordErrors.value) return
  await authService.login(username.value, password.value)
}
</script>

<style scoped>
/* optional: keep button text normal case */
.p-button {
  text-transform: none;
}
</style>
