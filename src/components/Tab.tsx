import colors from "@/styles/colors";

interface TabProps {
  title: string;
  focused?: boolean;
  onClick?: () => void;
}

const Tab = ({ title, focused, onClick }: TabProps) => {
  return (
    <button
      className={`flex flex-1 justify-center items-center text-[16px] font-[500] py-[11px] ${
        focused
          ? `border-b-[2px] border-[${colors.green}] text-[#1A1A1A]`
          : "text-[#848487]"
      }`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Tab;
