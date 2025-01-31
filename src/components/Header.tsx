import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  renderRight?: () => JSX.Element;
}

const Header = ({ title, renderRight }: HeaderProps) => {
  const router = useRouter();

  // TODO: fix : 뒤로가기 히스토리 스택이 없으면 뒤로가기가 되지 않음
  const onPressBack = () => router.back();

  return (
    <div className="h-[44px] flex items-center">
      <div className="flex flex-1">
        <button className="ml-[20px]" onClick={onPressBack}>
          <span className="material-icons text-[#4A4A4A] !text-[24px]">
            arrow_back_ios
          </span>
        </button>
      </div>
      <div className="flex flex-1 justify-center">
        <span className="text-[15px] text-[#4A4A4A]">{title}</span>
      </div>

      <div className="flex flex-1 justify-end">
        {renderRight != null && renderRight()}
      </div>
    </div>
  );
};

export default Header;
