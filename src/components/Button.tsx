interface ButtonProps {
  buttonStyle?: string;
  iconName: string;
  text: string;
  onClick: () => void;
}

const Button = ({ buttonStyle = "", iconName, text, onClick }: ButtonProps) => {
  return (
    <div
      onClick={onClick}
      className={`bg-black rounded-[25px] py-[10px] px-[15px] flex items-center ${buttonStyle}`}
    >
      <span className="material-icons text-white text-[24px]">{iconName}</span>
      <span className="text-white ml-1">{text}</span>
    </div>
  );
};

export default Button;
