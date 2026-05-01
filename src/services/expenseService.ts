import { supabase } from "./supabaseClient";

export const getExpenses = async () => {
  return await supabase.from("expenses").select("*").order("date", { ascending: false });
};

export const addExpense = async (expense: any) => {
  // const user = (await supabase.auth.getUser()).data.user;
  const { data: userData } = await supabase.auth.getUser();

  return await supabase.from("expenses").insert([
   {
      ...expense,
      user_id: userData.user?.id,
    },
  ]);
};

export const deleteExpense = async (id: string) => {
  return await supabase.from("expenses").delete().eq("id", id);
};
