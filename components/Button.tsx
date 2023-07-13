interface Props {
  text: string;
  type?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = (props: Props) => {
  return (
    <button
      disabled={props.isLoading}
      onClick={props.onClick}
      className={`${props.type === 'secondary' ? 'bg-white border-2 border-black px-3 py-2 hover:text-white hover:bg-black' : 'bg-black border-2 border-black px-5 py-2 text-white hover:bg-zinc-800'}
    ${props.className}
    ${props.size === 'sm' ? 'py-1 px-2 text-sm' : props.size === 'lg' ? 'py-3 px-4' : 'py-2 px-3'}
    rounded-full
    `}>
      {props.isLoading ? 'Loading...' : props.text}
    </button>
  );
};

export default Button;
