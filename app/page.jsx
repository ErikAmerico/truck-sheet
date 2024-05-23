import { auth } from "../auth";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return <main>No session</main>;
  }

  return (
    <main>
      <div>
        Hello, {session.user.firstName} {session.user.lastName}
      </div>
    </main>
  );
}
