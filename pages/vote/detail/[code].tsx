import Form from '@/components/Form';
import Menu from '@/components/Menu';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
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
import useVote from '@/lib/useVote';

registerLocale('id', id);

const DetailOrEditVote = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [startDate, setStartDate] = useState(new Date()); // tanggal mulai
  const [endDate, setEndDate] = useState(new Date()); //tanggal selesai
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const { code } = router.query;

  const { vote, isLoading, isError } = useVote(code as string);

  useEffect(() => {
    if (vote) {
      setTitle(vote.title);
      setStartDate(new Date(vote.startDateTime));
      setEndDate(new Date(vote.endDateTime));
      setCandidates(vote.candidates);
    }
  }, [vote]);

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

  const updateVote = async () => {
    // Validasi
    if (title === '') {
      showAlert({ title: 'Hmmh', subtitle: 'Judul tidak boleh kosong' });
      return;
    }
    if (candidates.length < 2) {
      showAlert({ title: 'Hmmh', subtitle: 'Minimal ada 2 kandidat' });
      return;
    }
    if (startDate > endDate) {
      showAlert({ title: 'Hmmh', subtitle: 'Tanggal mulai tidak boleh lebih besar dari tanggal selesai' });
      return;
    }
    if (candidates.some((c) => c.name === '')) {
      showAlert({ title: 'Hmmh', subtitle: 'Nama Kandidat tidak boleh kosong' });
      return;
    }

    setLoading(true);
    //Mengirim data ke API
    fetch('/api/votes', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        title,
        startDate,
        endDate,
        candidates: candidates.map((c) => ({
          name: c.name,
          title: c.title,
          key: c.key,
        })),
        publisher: session.user.email,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        showAlert({ title: 'Yeay! 🎉', subtitle: 'Voting berhasil diubah', negativeText: 'Tutup' });
      })
      .catch(() => {
        showAlert({ title: 'Hmmh', subtitle: 'Voting gagal diubah, sepertinya telah terjadi kesalahan' });
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
        <h1 className="text-4xl font-bold mt-5 mb-5">Detail Voting</h1>
        <p className="bg-zinc-100 py-3 px-3 font-bold rounded-lg border border-zinc-200 shadow-md">{vote?.title}</p>
        <form
          className="flex flex-col"
          onSubmit={updateVote}>
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
          <h3 className="font-medium text-xl mt-10">Kode</h3>
          <div className="bg-zinc-100 p-5">
            Undang pemilih dengan menggunakan kode
            <span className="bg-zinc-200 font-bold py-2 px-3 rounded-full ml-1">{vote?.code}</span>,
            <p>
              Atau gunalan link berikut :{' '}
              <a
                href={`/participant/${vote?.code}`}
                target="_blank"
                rel="noreferrer noopener"
                className="text-blue-500">
                Buka Link
              </a>
            </p>
          </div>
          <div className="py-10">
            <Button
              text="Update Voting 👍🏻"
              size="lg"
              onClick={() => {
                updateVote();
              }}
              isLoading={loading}
            />
          </div>
        </form>
      </div>
    </main>
  );
};

export default DetailOrEditVote;
