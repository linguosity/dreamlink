import Image from 'next/image';
import LoginCard from '@/components/LoginCard';

export default function LoginPage() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* <Image
        src="/images/login-background.jpg"
        alt="Login background"
        layout="fill"
        objectFit="cover"
      /> */}
      <div className="relative z-10 flex justify-center items-center min-h-screen">
        <LoginCard />
      </div>
    </div>
  );
}