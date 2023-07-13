import { XCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import Form from './Form';

interface Props {
  candidate: Candidate;
  submitCandidate: (candidate: Candidate) => void;
  removeCandidateForm: (key: number) => void;
}

const CandidateForm = (props: Props) => {
  const [candidate, setCandidate] = useState<Candidate>({
    key: 0,
    name: '',
    title: '',
  });

  useEffect(() => {
    setCandidate(props.candidate);
  }, [props.candidate]);

  useEffect(() => {
    props.submitCandidate(candidate);
  }, [candidate]);

  return (
    <div className="flex flex-col border border-zinc-200 p-5 rounded-lg">
      <div className="self-end">
        <XCircleIcon className='h-6 w-6 cursor-pointer hover:bg-zinc-100 text-zinc-300' onClick={()=>props.removeCandidateForm(candidate.key)}/>
      </div>
      <h1 className="flex w-1/2 bg-zinc-200 aspect-square text-center text-4xl rounded-full justify-center items-center self-center">{props.candidate.key}</h1>
      <label className="text-sm mt-3 mb-1">Nama Kandidat</label>
      <Form
        placeholder="Masukkan nama kandidat"
        value={candidate.name}
        onChange={(e) => {
          setCandidate({ ...candidate, name: e });
        }}
        className="rounded-lg text-sm"
      />
    </div>
  );
};

export default CandidateForm;
