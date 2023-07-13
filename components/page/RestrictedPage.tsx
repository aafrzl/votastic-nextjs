import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Button from '../Button';

export default function RestrictedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-5">
      <Image
        src={'/restricted.svg'}
        alt="thinking"
        width={300}
        height={300}
        className="object-contain"
      />
      <h1 className="text-4xl font-bold">Login Dulu Yah!</h1>
      <h2>Untuk mengakses halaman ini, kamu wajib login terlebih dahulu</h2>
      <Button
        onClick={signIn}
        text="Login"
        size="lg"
      />
    </div>
  );
}
