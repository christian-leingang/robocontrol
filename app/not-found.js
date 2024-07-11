import { Button } from '@/components/ui/button';
import Link from 'next/link';

function NotFound() {
  return (
    <main className='mt-20 space-y-6 text-center'>
      <h1 className='mb-8 text-3xl font-semibold'>This page could not be found :(</h1>
      <Link href='/' className='px-6 py-3 text-lg'>
        <Button>Go back home</Button>
      </Link>
    </main>
  );
}

export default NotFound;
