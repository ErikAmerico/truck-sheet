import React from "react";
import { auth, signOut, signIn } from "auth";

async function Appbar() {
  const session = await auth();
  return (
    <div className="">
      <div className="">
        {session && session.user ? (
          <div>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              {session.user.username}
              <button type="submit">Sign out</button>
            </form>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Appbar;
