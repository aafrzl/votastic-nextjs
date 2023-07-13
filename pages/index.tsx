import Image from 'next/image';
import Menu from '@/components/Menu';
import Button from '@/components/Button';
import Link from 'next/link';
import { LinkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import useVotes from '@/lib/useVotes';
import { useEffect, useState } from 'react';
import moment from 'moment';
import Loading from '@/components/Loading';
import { showAlert } from '@/components/Alert';

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const { votes: votesApi, isError, isLoading } = useVotes();

  const [votes, setVotes] = useState<Votes[]>();
  const [loadingItem, setLoadingItem] = useState<string | null>(null);

  useEffect(() => {
    if (votesApi) {
      setVotes(votesApi);
    }
  }, [votesApi]);

  const handleDelete = (code: string) => {
    showAlert({
      title: 'Anda Yakin?',
      subtitle: 'ingin menghapus data ini?',
      onPositiveClick: () => {
        setLoadingItem(code);
        fetch(`/api/votes/${code}`, {
          method: 'DELETE',
        })
          .then(() => {
            showAlert({
              title: 'Berhasil',
              subtitle: 'Data berhasil dihapus',
            });
            setVotes(votes?.filter((vote) => vote.code !== code));
          })
          .catch(() => {
            showAlert({
              title: 'Gagal',
              subtitle: 'Data gagal dihapus',
            });
          })
          .finally(() => {
            setLoadingItem(null);
          });
      },
    });
  };

  return (
    <main>
      <Menu />
      <div className="flex flex-col place-items-center py-44 space-y-3">
        <h1 className="text-5xl font-bold">Selamat datang di Votastic! 🎉</h1>
        <p className="text-lg bg-zinc-200 text-center rounded-lg py-1 px-3">
          Voting online yang hanya dalam genggamanmu.
          <br />
          Berikan suaramu dalam pemilihan.
          <span className="bg-yellow-200 py-1 px-1 rounded-lg">Ayo buat & mulai Voting!</span>
        </p>
        <Image
          src="/girl-looking.svg"
          alt="Landing page image"
          width={274}
          height={243}
          className="object-contain"
        />
        <div className="space-x-10">
          <Button
            text="Buat Voting Baru"
            onClick={() => router.push('/vote/create')}
          />
          <Button
            text="Ikutan Voting"
            type="secondary"
            onClick={() => router.push('/participant')}
          />
        </div>
      </div>
      {session && (
        <div className="mb-14">
          <p className="py-5 text-lg font-bold">Vote yang saya buat</p>
          {isLoading ? (
            <Loading />
          ) : votes && votes.length > 0 ? (
            <table className="table-auto w-full border border-zinc-100">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="text-left p-5">No</th>
                  <th className="text-left p-5">Judul</th>
                  <th className="text-left p-5">Kandidat</th>
                  <th className="text-left p-5">Kode</th>
                  <th className="text-left p-5">Mulai</th>
                  <th className="text-left p-5">Selesai</th>
                  <th className="text-left p-5"></th>
                </tr>
              </thead>
              <tbody>
                {votes?.map((vote: Votes, index: number) => (
                  <tr
                    key={index}
                    className={`${vote.code === loadingItem && 'animate-pulse'}`}>
                    <td className="p-5 text-left">{index + 1}</td>
                    <td className="p-5 text-left font-medium text-blue-500">
                      <a
                        href={`/vote/detail/${vote.code}`}
                        target="_blank"
                        rel="noreferrer noopener">
                        {vote.title}
                      </a>
                    </td>
                    <td className="p-5 text-left">
                      {vote.candidates.map((candidate: any, index: number) => (
                        <span key={index}>{candidate.name + (index < vote.candidates.length - 1 ? ' vs ' : '')}</span>
                      ))}
                    </td>
                    <td className="p-5 text-left font-bold">{vote.code}</td>
                    <td className="p-5 text-left text-sm">{moment(vote.startDateTime).format('DD MMM YYYY hh:mm a')}</td>
                    <td className="p-5 text-left text-sm">{moment(vote.endDateTime).format('DD MMM YYYY hh:mm a')}</td>
                    <td className="p-5 text-left text-sm">
                      <Link
                        href={`/participant/${vote.code}`}
                        target="_blank"
                        rel="noreferrer noopener">
                        <LinkIcon className="w-8 h-8 p-2 hover:bg-zinc-100 rounded-md" />
                      </Link>
                      <button
                        onClick={() => {
                          handleDelete(vote.code);
                        }}>
                        <TrashIcon className="w-8 h-8 p-2 hover:bg-zinc-100 rounded-md" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center bg-zinc-100 p-5 font-medium">Belum ada Votes yang dibuat</div>
          )}
        </div>
      )}
    </main>
  );
}
