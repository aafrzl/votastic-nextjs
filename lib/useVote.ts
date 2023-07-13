import useSWR from 'swr';

export default function useVote(code: string) {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data, mutate, error } = useSWR<Res<Votes>>(code ? '/api/votes/' + code : null, fetcher);
  return {
    vote: data?.data,
    isLoading: !error && !data,
    mutate,
    isError: error,
  };
}
