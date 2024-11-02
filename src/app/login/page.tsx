import Image from 'next/image';
import LoginCard from '@/components/LoginCard';

export default function LoginPage() {
  return (
    <main className="fixed inset-0 flex min-h-screen items-center justify-center overflow-y-auto overflow-x-hidden px-4 py-16">
      <div className="my-auto w-full max-w-md rounded-lg p-8 shadow-lg backdrop-blur-sm">
        {/* Your existing login form content */}
        <LoginCard />
      </div>
    </main>
  );
}