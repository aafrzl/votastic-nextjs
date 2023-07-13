import Button from '@/components/Button';
import Image from 'next/image';
import Link from 'next/link';
import { getProviders, useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login({ providers }: any) {
  const { data: session } = useSession();

  const router = useRouter();

  if (session) {
    router.push('/');
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="rounded-xl shadow-md p-5 border-2 border-zinc-200 text-center space-y-5">
        <Link
          href="/"
          className="text-6xl font-bold text-center hover:text-zinc-400">
          Votastic
        </Link>

        <p className="bg-zinc-200 px-2 py-2 rounded-lg text-md font-medium text-center">Silahkan login terlebih dahulu</p>
        <div className="w-full mt-5">
          {Object.values(providers).map((provider: any) => (
            <button
              key={provider.name}
              className="inline-flex justify-center items-center bg-white py-2 w-full rounded-full border-2 border-black font-medium hover:bg-black hover:text-white"
              onClick={() => signIn(provider.id)}>
              <Image
                src='/google.svg'
                alt={provider.name}
                width={15}
                height={15}
                className="mr-2 object-contain"
              />
              Login dengan {provider.name}
            </button>
          ))}
          <Button
            text="Kembali"
            className="w-full mt-3 hover:text-zinc-800 hover:bg-zinc-100"
            onClick={() => router.push('/')}
          />
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
