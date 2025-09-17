<template>
  <div class="p-4 max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Учетные записи</h1>
      <button
        @click="addAccount"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow"
      >
        +
      </button>
    </div>

    <div
      class="bg-blue-50 border border-blue-300 text-blue-800 text-sm rounded px-4 py-3 mb-6 flex items-start gap-2"
    >
      <svg class="w-5 h-5 mt-0.5 text-blue-500" fill="none" viewBox="0 0 16 16">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M7.5 1a6.5 6.5 0 1 0 0 13a6.5 6.5 0 0 0 0-13m0 12a5.5 5.5 0 1 1 0-11a5.5 5.5 0 0 1 0 11m1.55-8.42a1.84 1.84 0 0 0-.61-.42A2.25 2.25 0 0 0 7.53 4a2.16 2.16 0 0 0-.88.17c-.239.1-.45.254-.62.45a1.89 1.89 0 0 0-.38.62a3 3 0 0 0-.15.72h1.23a.84.84 0 0 1 .506-.741a.72.72 0 0 1 .304-.049a.86.86 0 0 1 .27 0a.64.64 0 0 1 .22.14a.6.6 0 0 1 .16.22a.73.73 0 0 1 .06.3c0 .173-.037.343-.11.5a2.4 2.4 0 0 1-.27.46l-.35.42c-.12.13-.24.27-.35.41a2.33 2.33 0 0 0-.27.45a1.18 1.18 0 0 0-.1.5v.66H8v-.49a.94.94 0 0 1 .11-.42a3.09 3.09 0 0 1 .28-.41l.36-.44a4.29 4.29 0 0 0 .36-.48a2.59 2.59 0 0 0 .28-.55a1.91 1.91 0 0 0 .11-.64a2.18 2.18 0 0 0-.1-.67a1.52 1.52 0 0 0-.35-.55M6.8 9.83h1.17V11H6.8z"
        />
      </svg>
      <span>
        Для указания нескольких меток для одной пары логин/пароль используйте
        разделитель
        <code class="bg-blue-100 px-1 py-0.5 rounded text-xs font-mono">;</code>
      </span>
    </div>

    <div
      v-for="(account, index) in accounts"
      :key="index"
      class="border p-4 mb-4 rounded shadow-sm hover:shadow-md bg-white transition"
    >
      <div class="flex items-start gap-4">
        <div class="flex-1">
          <div class="p-4 rounded-lg">
            <div class="relative">
              <input
                v-model="account.label"
                @blur="validateAndSave(index)"
                type="text"
                :id="`label-${index}`"
                placeholder="Метка"
                class="peer bg-transparent h-10 w-full rounded-lg text-gray-800 placeholder-transparent ring-2 px-2 ring-gray-300 focus:ring-sky-600 focus:outline-none"
                :class="{ 'ring-red-500': account.errors.label }"
                maxlength="50"
                title="Максимум 50 символов"
              />
              <label
                :for="`label-${index}`"
                class="pointer-events-none absolute left-2 -top-3 text-sm text-gray-500 bg-white px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
              >
                Метка
              </label>
            </div>
          </div>
        </div>

        <div class="flex-1">
          <div class="p-4 rounded-lg">
            <div class="relative">
              <select
                v-model="account.type"
                @change="validateAndSave(index)"
                :id="`type-${index}`"
                class="peer bg-transparent h-10 w-full rounded-lg text-gray-800 ring-2 px-2 ring-gray-300 focus:ring-sky-600 focus:outline-none appearance-none"
                :class="{ 'ring-red-500': account.errors.type }"
              >
                <option value="" disabled hidden></option>
                <option value="LDAP">LDAP</option>
                <option value="Локальная">Локальная</option>
              </select>
              <label
                :for="`type-${index}`"
                class="pointer-events-none absolute left-2 -top-3 text-sm text-gray-500 bg-white px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
              >
                Тип записи
              </label>
            </div>
          </div>
        </div>

        <div class="flex-1">
          <div class="p-4 rounded-lg">
            <div class="relative">
              <input
                v-model="account.login"
                @blur="validateAndSave(index)"
                type="text"
                :id="`login-${index}`"
                placeholder="Логин"
                class="peer bg-transparent h-10 w-full rounded-lg text-gray-800 placeholder-transparent ring-2 px-2 ring-gray-300 focus:ring-sky-600 focus:outline-none"
                :class="{ 'ring-red-500': account.errors.login }"
                maxlength="100"
                title="Максимум 100 символов"
              />
              <label
                :for="`login-${index}`"
                class="pointer-events-none absolute left-2 -top-3 text-sm text-gray-500 bg-white px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
              >
                Логин*
              </label>
            </div>
          </div>
        </div>

        <div v-if="account.type === 'Локальная'" class="flex-1">
          <div class="p-4 rounded-lg">
            <div class="relative">
              <input
                :type="passwordVisible[index] ? 'text' : 'password'"
                v-model="account.password"
                @blur="validateAndSave(index)"
                :id="`password-${index}`"
                placeholder="Пароль"
                class="peer bg-transparent h-10 w-full rounded-lg text-gray-800 placeholder-transparent ring-2 px-2 pr-10 ring-gray-300 focus:ring-sky-600 focus:outline-none"
                :class="{ 'ring-red-500': account.errors.password }"
                maxlength="100"
                title="Максимум 100 символов"
              />
              <label
                :for="`password-${index}`"
                class="pointer-events-none absolute left-2 -top-3 text-sm text-gray-500 bg-white px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
              >
                Пароль*
              </label>

              <button
                type="button"
                @click="togglePasswordVisibility(index)"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabindex="-1"
                title="Показать/скрыть пароль"
              >
                <svg
                  v-if="passwordVisible[index]"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 012.145-3.568m3.34-2.168A9.935 9.935 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.975 9.975 0 01-4.293 5.293M3 3l18 18"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-center mt-1.5">
          <button
            @click="removeAccount(index)"
            class="text-gray-500 hover:text-red-600 transition p-2"
            title="Удалить запись"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-10 h-10"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M14.748 5.891c.89.1 1.591.24 2.133.384c.505.135.87.273 1.119.383c.204.09.31.147.416.218a.75.75 0 0 1-.823 1.254c-.022-.013-.344-.204-1.099-.405c-.865-.231-2.299-.475-4.494-.475c-4.11 0-5.546.851-5.593.88c-.344.222-.829.144-1.031-.214c-.376-.666.209-1.04.209-1.04c.459-.296 1.013-.462 1.534-.6a14.6 14.6 0 0 1 2.133-.385a2.75 2.75 0 0 1 5.496 0m-3.978-.115a28 28 0 0 1 2.46 0a1.25 1.25 0 0 0-2.46 0M6.394 8.758a.75.75 0 0 1 .849.636l1.009 7.066c.089.62.15 1.043.222 1.37c.07.319.141.49.222.615c.18.283.44.507.745.647c.135.062.315.107.64.132c.334.026.762.026 1.388.026h1.394c.654 0 1.101 0 1.45-.028c.34-.026.525-.075.664-.14a1.75 1.75 0 0 0 .753-.686c.078-.131.144-.312.203-.647c.06-.344.103-.79.165-1.44l.656-6.88a.75.75 0 1 1 1.493.142l-.658 6.909c-.059.614-.107 1.118-.178 1.527c-.075.425-.183.806-.393 1.157a3.25 3.25 0 0 1-1.399 1.273c-.37.175-.759.247-1.189.28c-.414.033-.92.033-1.537.033H11.44c-.59 0-1.075 0-1.474-.03c-.414-.032-.789-.1-1.149-.264a3.25 3.25 0 0 1-1.384-1.2c-.213-.333-.333-.695-.423-1.1c-.087-.39-.155-.871-.239-1.456L5.758 9.606a.75.75 0 0 1 .636-.848"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useAccountStore } from "../stores/accountStore";

interface Account {
  label: string;
  type: "LDAP" | "Локальная";
  login: string;
  password: string | null;
  labels: { text: string }[];
  errors: { label: boolean; type: boolean; login: boolean; password: boolean };
}

const accountStore = useAccountStore();

const accounts = ref<Account[]>(
  accountStore.accounts.map((acc) => ({
    ...acc,
    errors: { label: false, type: false, login: false, password: false },
  }))
);

const passwordVisible = ref<boolean[]>([]);
onMounted(() => {
  passwordVisible.value = accounts.value.map(() => false);
});
watch(
  () => accounts.value.length,
  (len, prev) => {
    if (len > prev) passwordVisible.value.push(false);
    else if (len < prev) passwordVisible.value.splice(len);
  }
);

const togglePasswordVisibility = (index: number) => {
  passwordVisible.value[index] = !passwordVisible.value[index];
};

const validate = (acc: Account) => {
  const login = acc.login.trim();
  const pwd = acc.type === "Локальная" ? (acc.password ?? "").trim() : null;

  const errors = {
    label: false,
    type: !acc.type,
    login: login.length === 0,
    password: acc.type === "Локальная" && (!pwd || pwd.length === 0),
  };
  return { errors, isValid: !Object.values(errors).some(Boolean) };
};

const toPersist = (acc: Account) => ({
  label: acc.label,
  type: acc.type,
  login: acc.login.trim(),
  password: acc.type === "LDAP" ? null : (acc.password ?? "").trim(),
  labels: acc.label
    .split(";")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((text) => ({ text })),
});

const addAccount = () => {
  accounts.value.push({
    label: "",
    type: "LDAP",
    login: "",
    password: null,
    labels: [],
    errors: { label: false, type: false, login: false, password: false },
  });
  passwordVisible.value.push(false);
};

const removeAccount = (index: number) => {
  accounts.value.splice(index, 1);
  passwordVisible.value.splice(index, 1);
  const persisted = [...accountStore.accounts];
  persisted.splice(index, 1);
  accountStore.saveAccounts(persisted);
};

const validateAndSave = (index: number) => {
  const acc = accounts.value[index];

  if (acc.type === "LDAP") acc.password = null;

  const { errors, isValid } = validate(acc);
  acc.errors = errors;

  if (!isValid) return;
  const persisted = [...accountStore.accounts];
  persisted[index] = toPersist(acc);
  accountStore.saveAccounts(persisted);
};
</script>
