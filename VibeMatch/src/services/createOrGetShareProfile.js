import { supabase } from "./supabase";

export async function createOrGetShareProfile(userId, profileData) {
  // tenta buscar perfil existente
  const { data: existing, error: fetchError } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) {
    console.error(fetchError);
    throw new Error("Erro ao buscar perfil compartilhado.");
  }

  // se já existe → atualiza e retorna o mesmo share_id
  if (existing) {
    await supabase
      .from("public_profiles")
      .update({ profile_data: profileData })
      .eq("user_id", userId);

    return existing.share_id;
  }

  // se não existe → cria
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