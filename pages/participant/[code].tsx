import Alert, { showAlert } from '@/components/Alert';
import Button from '@/components/Button';
import CandidateItem from '@/components/CandidateItem';
import CountDown from '@/components/Countdown/CountDown';
import Menu from '@/components/Menu';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import RestrictedPage from '@/components/page/RestrictedPage';
import useVote from '@/lib/useVote';
import moment from 'moment';
import useParticipant from '@/lib/useParticipant';

export const STATE_NOT_STARTED = 'STATE_NOT_STARTED',
  STATE_STARTED = 'STATE_STARTED',
  STATE_ENDED = 'STATE_ENDED',
  STATE_LOADING = 'STATE_LOADING';

const DetailParticipant = () => {
  const router = useRouter();
  const { code } = router.query;
  const { data: session } = useSession();
  const { data: participant, mutate: mutateParticipant, isLoading: participantLoading, isError } = useParticipant(code as string);
  const { vote, mutate: mutateVote, isLoading } = useVote(code as string);

  const [currentState, setCurrentState] = useState(STATE_LOADING);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const submitVote = async () => {
    if (selectedCandidate) {
      showAlert({
        title: 'Apakah kamu yakin?',
        subtitle: 'Kamu akan memilih ' + selectedCandidate.name,
        positiveText: 'Ya, saya yakin',
        negativeText: 'Tidak',
        onPositiveClick: async () => {
          const res = await fetch('/api/participant/' + vote?.code, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              candidate: selectedCandidate.name,
              email: session?.user?.email,
            }),
          });
          if (res.status === 200) {
            mutateParticipant();
            mutateVote();
            showAlert({
              title: 'Vote Berhasil ✅',
              subtitle: 'Terima kasih telah berpartisipasi dalam vote ini. Vote kamu sudah tercatat.',
            });
          }
        },
      });
    } else {
      showAlert({
        title: 'Vote Gagal ❌',
        subtitle: 'Pilih salah satu kandidat terlebih dahulu, untuk mengirim vote',
      });
    }
  };

  useEffect(() => {
    if (vote) {
      if (currentState === STATE_ENDED) {
        return;
      }
      const start = moment(vote.startDateTime);
      const end = moment(vote.endDateTime);

      const interval = setInterval(async () => {
        const now = moment();

        if (now.isBefore(start)) {
          setCurrentState(STATE_NOT_STARTED);
        } else if (now.isAfter(start) && now.isBefore(end)) {
          setCurrentState(STATE_STARTED);
        } else if (now.isAfter(end)) {
          setCurrentState(STATE_ENDED);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [vote]);

  useEffect(() => {
    if (vote && participant) {
      const candidate = vote?.candidates?.find((c) => c.name === participant?.candidate);
      if (candidate) {
        setSelectedCandidate(candidate);
      }
    }
  }, [participant, vote]);

  if (!session) {
    return <RestrictedPage />;
  }

  return (
    <main>
      <Menu />

      <h1 className="text-4xl mt-10 text-center">{vote?.title}</h1>

      {/* timer */}
      <CountDown
        start={String(vote?.startDateTime)}
        end={String(vote?.endDateTime)}
        currentState={currentState}
        className="mt-10"
      />
      <div className="mt-10 space-y-3 mx-auto w-2/3">
        {!participantLoading &&
          vote?.candidates?.map((candidate: Candidate, index: number) => (
            <CandidateItem
              onClick={() => !participant && currentState === STATE_STARTED && setSelectedCandidate(candidate)}
              isSelected={selectedCandidate?.name === candidate.name}
              name={candidate.name}
              key={candidate.key}
              index={candidate.key}
              title={'Kandidat ' + candidate.key}
              percentage={candidate.votes ? (candidate.votes / vote?.totalVotes) * 100 : 0}
            />
          ))}
      </div>
      <div className="text-center mt-10">
        {session?.user?.email != vote?.publisher && !participant && currentState === STATE_STARTED && (
          <Button
            onClick={() => {
              submitVote();
            }}
            text="Kirim Vote Saya"
            size="lg"
            isLoading={participantLoading}
          />
        )}
        {participant && <span className="bg-zinc-200 rounded-lg shadow-sm py-2 px-3">Kamu sudah memilih, dan tidak diperbolehkan untuk mengganti pilihan</span>}
        {session?.user?.email === vote?.publisher && <span className="bg-zinc-200 rounded-lg shadow-sm py-2 px-3">Pembuat vote tidak dapat melakukan voting</span>}
      </div>
    </main>
  );
};

export default DetailParticipant;
