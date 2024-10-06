import { Button } from '@nextui-org/react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex w-full flex-col items-center justify-between p-24'>
      <Link href='/dashboard'>
        <Button>ダッシュボードに行く</Button>
      </Link>
    </main>
  );
}
