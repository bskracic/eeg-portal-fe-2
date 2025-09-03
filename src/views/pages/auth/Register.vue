<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50" style="background: url('/images/pattern.png');">
    <Card class="p-6 mx-auto" style="max-width: 600px;">
      <template #title>
        <h2 class="text-center text-xl font-semibold">
          {{ t('register.title') }}
        </h2>
      </template>

      <template #content>
        <!-- Error Alert -->
        <Message v-if="error" severity="error" class="mb-4">
          {{ error }}
        </Message>

        <!-- Registration Form -->
        <form @submit.prevent="submit" class="flex flex-col gap-4" ref="formRef">
          <!-- Username -->
          <span class="p-float-label w-full">
            <InputText id="username" v-model="form.username" :disabled="loading" class="w-full" />
            <label for="username">{{ t('register.username') }}</label>
          </span>
          <small v-if="showErrors && usernameError" class="p-error">{{ usernameError }}</small>

          <!-- Password -->
          <span class="p-float-label w-full">
            <Password id="password" v-model="form.password" toggleMask :disabled="loading" inputClass="w-full"
              class="w-full" />
            <label for="password">{{ t('register.password') }}</label>
          </span>
          <small v-if="showErrors && passwordError" class="p-error">{{ passwordError }}</small>

          <!-- Email -->
          <span class="p-float-label w-full">
            <InputText id="email" v-model="form.email" type="email" :disabled="loading" class="w-full" />
            <label for="email">{{ t('register.email') }}</label>
          </span>
          <small v-if="showErrors && emailError" class="p-error">{{ emailError }}</small>

          <!-- Organization Name -->
          <span class="p-float-label w-full">
            <InputText id="organizationName" v-model="form.organizationName" :disabled="loading" class="w-full" />
            <label for="organizationName">{{ t('register.organizationName') }}</label>
          </span>
          <small v-if="showErrors && orgNameError" class="p-error">{{ orgNameError }}</small>

          <!-- Description -->
          <span class="p-float-label w-full">
            <Textarea id="description" v-model="form.description" autoResize :disabled="loading" class="w-full" />
            <label for="description">{{ t('register.description') }}</label>
          </span>
          <small v-if="showErrors && descriptionError" class="p-error">{{ descriptionError }}</small>

          <!-- Submit Button -->
          <Button type="submit" class="mt-4 w-full" :label="t('register.submit')" :loading="loading"
            :disabled="loading || !formValidComputed" />
        </form>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import type { RegisterRequest } from '@/api/auth'
import i18n from '@/i18n'
import { authService } from '@/services/authService'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

// PrimeVue components
import { Textarea } from 'primevue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Password from 'primevue/password'

const { t } = i18n.global
const router = useRouter()

// Form state
interface RegisterForm {
  username: string
  password: string
  email: string
  organizationName: string
  description: string
}

const form = ref<RegisterForm>({
  username: '',
  password: '',
  email: '',
  organizationName: '',
  description: ''
})

const loading = ref(false)
const error = ref<string | null>(null)
const showErrors = ref(false)
const formRef = ref<HTMLFormElement | null>(null)

// Validation
const usernameError = computed(() => (!form.value.username && showErrors.value ? t('validation.required', { field: t('register.username') }) : ''))
const passwordError = computed(() => (!form.value.password && showErrors.value ? t('validation.required', { field: t('register.password') }) : ''))
const emailError = computed(() => {
  if (!form.value.email && showErrors.value) return t('validation.required', { field: t('register.email') })
  if (form.value.email && !/^\S+@\S+\.\S+$/.test(form.value.email)) return t('validation.email')
  return ''
})
const orgNameError = computed(() => (!form.value.organizationName && showErrors.value ? t('validation.required', { field: t('register.organizationName') }) : ''))
const descriptionError = computed(() => (!form.value.description && showErrors.value ? t('validation.required', { field: t('register.description') }) : ''))

const formValidComputed = computed(() => {
  return !usernameError.value && !passwordError.value && !emailError.value && !orgNameError.value && !descriptionError.value
})

// Submit
async function submit() {
  showErrors.value = true
  if (!formValidComputed.value) return

  loading.value = true
  error.value = null

  const submitData: RegisterRequest = {
    username: form.value.username,
    password: form.value.password,
    email: form.value.email,
    organization_name: form.value.organizationName,
    description: form.value.description
  }

  try {
    await authService.register(submitData)
    router.push('/')
  } catch (err: any) {
    error.value = err.message || t('errors.server')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.w-full {
  width: 100%;
}

.mt-4 {
  margin-top: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.text-center {
  text-align: center;
}
</style>
