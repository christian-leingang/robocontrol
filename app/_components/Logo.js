import Image from 'next/image';
import Link from 'next/link';

import logo from '@/public/logo.png';

function Logo() {
  return (
    <Link href='/' className='z-10 flex items-center gap-4'>
      <Image src={logo} height='50' width='50' quality={100} alt='RoboControl' />
      <span className='text-primary-100 text-2xl font-semibold'>RoboControl</span>
    </Link>
  );
}

export default Logo;
