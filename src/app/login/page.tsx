import LoginCard from '@/components/LoginCard';
import loginBackground from '../../../public/images/login-background.jpg';

export default function LoginPage() {
  return (
    <div 
      style={{ 
        backgroundImage: `url(${loginBackground.src})`, 
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
