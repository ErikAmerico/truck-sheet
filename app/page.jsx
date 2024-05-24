import { auth } from "../auth";
import Login from "./components/Login";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return <Login />;
  }

  return (
    <main>
      <div>
        Hello, {session.user.firstName} {session.user.lastName}
      </div>
    </main>
  );
}
