import { Account, Category, Transaction } from "@/types/accounts";


// lib/api.ts
export async function apiFetch<T>(
    url: string,
    token: string | null,
    options: RequestInit = {}
  ): Promise<T> {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
  
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      const message = errorData?.error || "Request failed";
      throw new Error(message);
    }
  
    return res.json();
  }

  export async function getAccounts(token: string): Promise<Account[]> {
    const data = await apiFetch<{ result: Account[] }>(
      "/api/account/getallaccounts",
      token
    );
    return data.result || [];
  }
  
  export async function getCategories(token: string): Promise<Category[]> {
    const data = await apiFetch<{ categories: Category[] }>(
      "/api/categories",
      token
    );
    return data.categories || [];
  }

  export async function getTransactions(accountId: string, token: string): Promise<Transaction[]> {
    const data = await apiFetch<{ accountTransactions: Transaction[] }>(
      `/api/account/${accountId}`,
      token
    );
    return data.accountTransactions || [];
  }

export async function getInitialTransactionData(token: string): Promise<{
  accounts: Account[];
  categories: Category[];
}> {
  const [accounts, categories] = await Promise.all([
    getAccounts(token),
    getCategories(token),
  ]);

  return { accounts, categories };
}

  