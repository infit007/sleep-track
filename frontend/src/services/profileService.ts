import { supabase } from "@/lib/supabaseClient";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
}

export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as Profile | null;
};

export const updateProfile = async (userId: string, updates: { full_name?: string }) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
};

export const updateUserMetadata = async (fullName: string) => {
  const { data: { user }, error } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  if (error) throw error;
  return user;
};

