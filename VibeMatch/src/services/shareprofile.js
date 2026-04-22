export async function createShareProfile(profileData) {
  // depois você troca isso pelo Supabase/Firebase
  const shareId = crypto.randomUUID();

  const savedProfiles =
    JSON.parse(localStorage.getItem("vibematch_public_profiles")) || [];

  savedProfiles.push({
    shareId,
    ...profileData,
  });

  localStorage.setItem(
    "vibematch_public_profiles",
    JSON.stringify(savedProfiles)
  );

  return shareId;
}

export function getSharedProfileById(shareId) {
  const savedProfiles =
    JSON.parse(localStorage.getItem("vibematch_public_profiles")) || [];

  return savedProfiles.find((profile) => profile.shareId === shareId) || null;
}