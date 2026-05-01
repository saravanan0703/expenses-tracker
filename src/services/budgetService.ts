import { supabase } from "./supabaseClient";

export const setBudget = async (amount: number) => {
  const { data: user } = await supabase.auth.getUser();

  return await supabase.from("budgets").upsert({
    user_id: user.user?.id,
    monthly_limit: amount,
  });
};

export const getBudget = async () => {
  const { data: user } = await supabase.auth.getUser();

  return await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", user.user?.id)
    .single();
};