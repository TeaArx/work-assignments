import { defineStore } from 'pinia';

interface Account {
  label: string;
  type: 'LDAP' | 'Локальная';
  login: string;
  password: string | null;
  labels: { text: string }[];
}

export const useAccountStore = defineStore('account', {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    saveAccounts(accounts: Account[]) {
      this.accounts = accounts;
    },
  },
  persist: true,
});