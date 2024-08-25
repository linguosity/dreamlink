// app/page.tsx
import DetailsButtonServer from "@/components/DetailsButtonServer";

export default async function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Welcome to DreamLink</h1>
      <br />
      <br />
      <DetailsButtonServer />
    </>
  );
}