import LoginCard from '@/components/LoginCard';
import styles from '../../components/LoginPage.module.css';

export default function LoginPage() {
  return (
    <div className={styles.loginBackground}>
        <div className="flex justify-center items-center min-h-screen">
            <LoginCard />
        </div>
    </div>
  );
}
