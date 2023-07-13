import React from 'react';
import Button from './Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';

const Menu = () => {
  const router = useRouter();

  const { data: session } = useSession();

  return (
    <div className="flex justify-between items-center py-5">
      <Link
        href="/"
        className="text-xl font-bold hover:text-zinc-400">
        Votastic
      </Link>
      {session ? (
        <div className="flex items-center space-x-3">
          <p className="text-md font-medium">{session?.user?.name}</p>
          <Button
            text="Logout"
            onClick={signOut}
          />
        </div>
      ) : (
        <Button
          text="Login"
          onClick={signIn}
        />
      )}
    </div>
  );
};

export default Menu;
