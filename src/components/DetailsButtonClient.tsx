// components/details-button-client.tsx
"use client";
import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import Link from "next/link";

export default function DetailsButtonClient({
  session,
  rawDreams,
  error
}: {
  session: Session | null;
  rawDreams: any | null;
  error: any | null;
}) {
  const user = session?.user;
  const [isHidden, setIsHidden] = useState(true);

  return (
    <>
      {user ? (
        <>
          <button onClick={() => setIsHidden((prev) => !prev)}>
            {isHidden ? "Show Details" : "Hide Details"}{" "}
          </button>
          <br />
          {isHidden ? null : (
            <>
              <p>{`username: ${user?.user_metadata?.full_name}`}</p>
              <p>{`email: ${user?.email}`}</p>
              <br />
              <Link href={"/account"}>
                <button>View Account Page</button>
              </Link>
              {rawDreams && (
                <div>
                  <h3>Recent Dreams:</h3>
                  <ul>
                    {rawDreams.map((dream: any) => (
                      <li key={dream.id}>{dream.title}</li>
                    ))}
                  </ul>
                </div>
              )}
              {error && <p>Error fetching dreams: {error.message}</p>}
            </>
          )}
        </>
      ) : (
        <p>user is not logged in</p>
      )}
    </>
  );
}