import LoginCard from '@/components/LoginCard';

export default function LoginPage() {
  return (
    <div 
      style={{ 
        backgroundImage: `url('/images/login-background.jpg')`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100vh'
      }} 
      className="flex justify-center items-center"
    >
        <div className="flex justify-center items-center min-h-screen">
            <LoginCard />
        </div>
    </div>
  );
}
