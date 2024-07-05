import Logo from './Logo';
import { ModeToggle } from './ModeToggle';

export default function Header() {
  return (
    <div className='px-8 py-5'>
      <div className='mx-auto flex max-w-7xl items-center justify-between'>
        <Logo />
        <ModeToggle />
      </div>
    </div>
  );
}
