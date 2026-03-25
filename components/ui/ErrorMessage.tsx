const messages: Record<string, string> = {
  access_denied:
    "You need to authorize Strava access to use this app. Please try again.",
  OAuthError:
    "Something went wrong during sign in. Please try again.",
};

export default function ErrorMessage({ error }: { error: string }) {
  const message = messages[error] ?? messages.OAuthError;
  return (
    <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}
