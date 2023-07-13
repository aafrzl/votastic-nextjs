import { zeroPad } from 'react-countdown';

interface Props {
  value: number;
  label: string;
}

const CountDownItem = (props: Props) => {
  return (
    <div className="flex items-center">
      <div className="flex flex-col text-center">
        <span className="text-5xl font-bold">{zeroPad(props.value, 2)}</span>
        <span className="text-xl font-light">{props.label}</span>
      </div>
      {props.label !== 'Detik' && <span className='text-4xl mx-5'>:</span>}
    </div>
  );
};

export default CountDownItem;
