import { redirect } from "next/navigation";
import { fetchAthleteProfile, StravaAuthError } from "@/lib/strava";
import Image from "next/image";

interface Props {
  accessToken: string;
}

export default async function AthleteProfileCard({ accessToken }: Props) {
  let profile;
  try {
    profile = await fetchAthleteProfile(accessToken);
  } catch (err) {
    if (err instanceof StravaAuthError) redirect("/api/auth/signout");
    throw err;
  }

  const name = `${profile.firstname} ${profile.lastname}`;

  const location = [profile.city, profile.country]
    .filter(Boolean)
    .join(", ") || null;

  return (
    <div className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-200">
      <div className="shrink-0">
        {profile.profile_medium ? (
          <Image
            src={profile.profile_medium}
            alt={name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-semibold">
            {profile.firstname[0]}{profile.lastname[0]}
          </div>
        )}
      </div>
      <div>
        <p className="text-lg font-semibold text-gray-900">{name}</p>
        {location && (
          <p className="text-sm text-gray-500" data-testid="athlete-location">
            {location}
          </p>
        )}
      </div>
    </div>
  );
}
