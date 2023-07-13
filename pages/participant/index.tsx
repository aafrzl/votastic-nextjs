import Menu from '@/components/Menu';
import Image from 'next/image';
import React, { useState } from 'react';
import Form from '@/components/Form';
import Button from '@/components/Button';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import RestrictedPage from '@/components/page/RestrictedPage';
import { showAlert } from '@/components/Alert';

const Participant = () => {
  const router = useRouter();

  const { data: session } = useSession();

  const [code, setCode] = useState('');

  const handleSubmit = async () => {
    if (code === '') {
      showAlert({ title: 'Hmmh..', subtitle: 'Tolong masukkan kode yang benar' });
      return;
    }

    await fetch('/api/votes/' + code, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.message && data?.message === 'Not Found') {
          showAlert({ title: 'Hmmh..', subtitle: 'Voting tidak tersedia, masukkan kode dengan benar' });
          return;
        }
        router.push('/participant/' + code);
      });
  };

  if (!session) {
    return <RestrictedPage />;
  }

  return (
    <main>
      <Menu />
      <div className="flex flex-col items-center justify-center h-screen space-y-5">
        <Image
          src="/participant.svg"
          alt="Participant image"
          width={480}
          height={285}
          className="object-contain"
        />
        <h1 className="text-4xl font-bold">Ikutan Voting</h1>
        <p className="w-1/3 text-center">Untuk ikutan voting, kamu harus memasukkan kode voting yang sudah di buat oleh penyelenggara</p>
        <Form
          placeholder="Masukkan kode voting"
          className="w-1/3 mt-3"
          value={code}
          onChange={setCode}
        />
        <Button
          onClick={handleSubmit}
          text="Lanjutkan"
          className="w-1/3 mt-3"
        />
        <Button
          onClick={() => router.push('/')}
          text="Kembali"
          className="w-1/3"
          type="secondary"
        />
      </div>
    </main>
  );
};

export default Participant;
