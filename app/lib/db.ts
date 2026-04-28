import { createClient } from "./supabase";

export type Transaction = {
  id: string;
  user_id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  note: string | null;
  date: string;
  created_at: string;
};

export const INCOME_CATEGORIES = [
  "Salary",
  "Side hustle",
  "Freelance",
  "Investment returns",
  "Gift / support",
  "Remittance",
  "Other income",
];

export const EXPENSE_CATEGORIES = [
  "Rent",
  "Chop money",
  "Utilities",
  "Transport",
  "Airtime & data",
  "Tithe & offering",
  "Family support",
  "School fees",
  "Entertainment",
  "Healthcare",
  "Clothing",
  "Subscriptions",
  "Savings transfer",
  "Other",
];

export const CATEGORY_COLORS: Record<string, string> = {
  "Rent": "#c85a5a",
  "Chop money": "#d4a947",
  "Utilities": "#6a8ac0",
  "Transport": "#7aa87a",
  "Airtime & data": "#a87a8a",
  "Tithe & offering": "#e8c16d",
  "Family support": "#8a7ac0",
  "School fees": "#c09a6a",
  "Healthcare": "#6ac0a8",
  "Entertainment": "#c06a9a",
  "Clothing": "#9a8a6a",
  "Subscriptions": "#6ab0c0",
  "Savings transfer": "#7aa87a",
  "Other": "#7a7468",
};

export async function getTransactions(userId: string, month: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .gte("date", `${month}-01`)
    .lte("date", `${month}-31`)
    .order("date", { ascending: false });
  if (error) throw error;
  return data as Transaction[];
}

export async function addTransaction(
  userId: string,
  txn: Omit<Transaction, "id" | "user_id" | "created_at">
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("transactions")
    .insert({ ...txn, user_id: userId });
  if (error) throw error;
}

export async function deleteTransaction(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export type Habit = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  created_at: string;
};

export type HabitLog = {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  completed: boolean;
};

export const HABIT_TEMPLATES = [
  { name: "Morning prayer & reading", category: "Faith" },
  { name: "Read 10 pages", category: "Mind" },
  { name: "Exercise", category: "Health" },
  { name: "Drink 8 glasses of water", category: "Health" },
  { name: "No social media before noon", category: "Mind" },
  { name: "Walk 6,000 steps", category: "Health" },
  { name: "Journal", category: "Mind" },
  { name: "Review budget", category: "Finance" },
];

// Add these new types and functions to lib/db.ts

export type CustomCategory = {
  id: string;
  user_id: string;
  type: "income" | "expense";
  name: string;
  created_at: string;
};

export type HiddenCategory = {
  id: string;
  user_id: string;
  type: "income" | "expense";
  name: string;
  created_at: string;
};

// Fetch custom + hidden categories for a user
export async function getCategoryPrefs(userId: string) {
  const { createClient } = await import("./supabase");
  const supabase = createClient();

  const [customRes, hiddenRes] = await Promise.all([
    supabase.from("custom_categories").select("*").eq("user_id", userId),
    supabase.from("hidden_categories").select("*").eq("user_id", userId),
  ]);

  return {
    custom: (customRes.data || []) as CustomCategory[],
    hidden: (hiddenRes.data || []) as HiddenCategory[],
  };
}

export async function addCustomCategory(
  userId: string,
  type: "income" | "expense",
  name: string
) {
  const { createClient } = await import("./supabase");
  const supabase = createClient();
  const { data, error } = await supabase
    .from("custom_categories")
    .insert({ user_id: userId, type, name })
    .select()
    .single();
  if (error) throw error;
  return data as CustomCategory;
}

export async function deleteCustomCategory(id: string) {
  const { createClient } = await import("./supabase");
  const supabase = createClient();
  const { error } = await supabase.from("custom_categories").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleHiddenCategory(
  userId: string,
  type: "income" | "expense",
  name: string,
  isCurrentlyHidden: boolean
) {
  const { createClient } = await import("./supabase");
  const supabase = createClient();

  if (isCurrentlyHidden) {
    const { error } = await supabase
      .from("hidden_categories")
      .delete()
      .eq("user_id", userId)
      .eq("type", type)
      .eq("name", name);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("hidden_categories")
      .insert({ user_id: userId, type, name });
    if (error) throw error;
  }
}