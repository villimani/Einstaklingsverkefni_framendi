// Simple Account type
export type Account = {
    id: number,
    name: string;
    balance: string;
  };

  export type Category = {
    name: string;
  };

  export type Transaction = {
    amount: string;
    transaction_type: "income" | "expense";
    category_name: string;
    account_balance: string;
  };