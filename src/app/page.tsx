// app/page.tsx
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import FetchUserDetails from "@/components/FetchUserDetails";

export default async function Home() {
  return (
    <>
      <FetchUserDetails />
    </>
  );
}