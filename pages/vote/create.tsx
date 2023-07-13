import Form from '@/components/Form';
import Menu from '@/components/Menu';
import Image from 'next/image';
import React, { useState } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import id from 'date-fns/locale/id';
import { useSession } from 'next-auth/react';

import 'react-datepicker/dist/react-datepicker.css';
import CandidateForm from '@/components/CandidateForm';
import { PlusIcon } from '@heroicons/react/24/outline';
import Button from '@/components/Button';
import RestrictedPage from '@/components/page/RestrictedPage';
import { showAlert } from '@/components/Alert';
import { useRouter } from 'next/router';

registerLocale('id', id);

const CreateVote = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [startDate, setStartDate] = useState(new Date()); // tanggal mulai
  const [endDate, setEndDate] = useState(new Date()); //tanggal selesai
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  if (!session) {
    return <RestrictedPage />;
  }

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
    console.log('Start date: ', date);
  };

  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
    console.log('End date: ', date);
  };

  const submitCandidate = (candidate: Candidate) => {
    setCandidates(candidates.map((c) => (c.key === candidate.key ? candidate : c)));
  };

  const addCandidateForm = () => {
    const newCandidate: Candidate = {
      name: '',
      key: candidates.length + 1,
      title: '',
    };

    setCandidates([...candidates, newCandidate]);
  };

  const removeCandidateForm = (key: number) => {
    const newCandidates = candidates.filter((candidate) => candidate.key !== key);

    newCandidates.forEach((candidates, index) => {
      candidates.key = index + 1;
    });

    setCandidates(newCandidates);
  };

  const createVote = async () => {
    // Validasi
    if (title === '') {
      showAlert({ title: 'Hmmh', subtitle: 'Judul tidak boleh kosong' });
      return;
    }

    if (candidates.length < 2) {
      showAlert({ title: 'Hmmh', subtitle: 'Minimal ada 2 kandidat' });
      return;
    }

    if (candidates.some((c) => c.name === '')) {
      showAlert({ title: 'Hmmh', subtitle: 'Nama Kandidat tidak boleh kosong' });
      return;
    }

    setLoading(true);
    //Mengirim data ke API
    fetch('/api/votes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        startDate,
        endDate,
        candidates,
        publisher: session?.user?.email,
      }),
    })
      .then((data) => {
        router.push('/vote/success');
      }).catch(() => {
        showAlert({ title: 'Hmmh', subtitle: 'Gagal membuat voting, sepertinya telah terjadi kesalahan' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main>
      <Menu />
      <div className="flex flex-col place-items-center py-10">
        <Image
          src="/man-writing.svg"
          alt="Create vote image"
          width={285}
          height={200}
          className="object-contain"
        />
        <h1 className="text-4xl font-bold mt-5 mb-5">Buat Voting Baru</h1>
        <p className="bg-zinc-100 py-3 px-3 rounded-lg border border-zinc-200 shadow-md">Silahkan masukkan data yang dibutuhkan sebelum membuat vote online.</p>
        <form
          className="flex flex-col"
          onSubmit={createVote}>
          <div className="space-y-5">
            <h3 className="font-medium text-xl mt-10">Detail Voting</h3>
            <div className="flex flex-col">
              <label className="text-sm">Judul</label>
              <Form
                onChange={(e) => setTitle(e)}
                value={title}
                placeholder="Pemilihan Ketua OSIS"
                className="w-full rounded-xl"
              />
            </div>
            <div className="flex flex-col w-2/3">
              <label className="text-sm">Kapan dimulai?</label>
              <div className="inline-flex">
                <ReactDatePicker
                  locale={'id'}
                  showTimeSelect
                  dateFormat="Pp"
                  selected={startDate}
                  minDate={new Date()}
                  onChange={handleStartDateChange}
                  className="w-full border bg-zinc-200 border-transparent py-2 px-3 rounded-xl"
                />
                <span className="text-sm text-center p-3">sampai</span>
                <ReactDatePicker
                  locale={'id'}
                  showTimeSelect
                  dateFormat="Pp"
                  selected={endDate}
                  minDate={startDate}
                  onChange={handleEndDateChange}
                  className="w-full border bg-zinc-200 border-transparent py-2 px-3 rounded-xl"
                />
              </div>
            </div>
          </div>
          <h3 className="font-medium text-xl mt-10">Kandidat</h3>
          <div className="grid gap-4 grid-cols-4 mt-5">
            {candidates.map((candidate, index) => (
              <CandidateForm
                key={index}
                candidate={candidate}
                submitCandidate={submitCandidate}
                removeCandidateForm={removeCandidateForm}
              />
            ))}
            <div
              className="w-1/3 flex flex-col items-center justify-center cursor-pointer bg-zinc-100 aspect-square text-zinc-500 hover:bg-black hover:text-white rounded-full"
              onClick={addCandidateForm}>
              <PlusIcon className="h-10 w-10 text-zinc-300" />
            </div>
          </div>
          <div className="py-10">
            <Button
              text="Buat Voting 👍🏻"
              size="lg"
              onClick={() => {
                createVote();
              }}
              isLoading={loading}
            />
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateVote;
