import { supabase } from "./supabase";

export async function createOrGetShareProfile(userId, profileData) {
  const { data: existing, error: fetchError } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) {
    console.error(fetchError);
    throw new Error("Erro ao buscar perfil compartilhado.");
  }

  if (existing) {
    await supabase
      .from("public_profiles")
      .update({ profile_data: profileData })
      .eq("user_id", userId);

    return existing.share_id;
  }

  const shareId = crypto.randomUUID();

  const { error: insertError } = await supabase
    .from("public_profiles")
    .insert([
      {
        user_id: userId,
        share_id: shareId,
        profile_data: profileData,
      },
    ]);

  if (insertError) {
    console.error(insertError);
    throw new Error("Erro ao salvar perfil compartilhado.");
  }

  return shareId;
}

export async function getSharedProfileById(shareId) {
  const { data, error } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("share_id", shareId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Erro ao buscar perfil compartilhado.");
  }

  return data?.profile_data || null;
}

export async function getSharedProfileByShareId(shareId) {
  const { data, error } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("share_id", shareId)
    .maybeSingle();

  if (error) throw new Error("Erro ao buscar perfil.");
  return data ? { ...data.profile_data, shareId: data.share_id } : null;
}

export async function getSharedProfileByUsername(username) {
  const { data, error } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("profile_data->>username", username)
    .maybeSingle();

  if (error) throw new Error("Erro ao buscar perfil.");
  return data ? { ...data.profile_data, shareId: data.share_id } : null;
}

export async function getMySharedProfile() {
  const user = JSON.parse(localStorage.getItem("spotify_user"));
  if (!user?.id) return null;

  const { data, error } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return null;
  return data ? { ...data.profile_data, shareId: data.share_id } : null;
}