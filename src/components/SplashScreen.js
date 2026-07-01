import { motion } from 'framer-motion';
import Logo from '../images/youmovieslogo-removebg.png';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-[9999]">
      <motion.img
        src={Logo}
        alt="Logo"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 3.5, 
          ease: "easeInOut",
          repeat: 0 
        }}
        className="w-64"
      />
    </div>
  );
};

export default SplashScreen;