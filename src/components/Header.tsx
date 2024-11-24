import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const router = useRouter();

  // TODO: fix : 뒤로가기 히스토리 스택이 없으면 뒤로가기가 되지 않음
  const onPressBack = () => router.back();

  return (
    <div className="flex justify-between items-center px-5 py-3">
      <button onClick={onPressBack}>
        <span className="material-icons text-[24px]">arrow_back_ios</span>
      </button>

      <span className="text-lg font-bold">{title}</span>

      <button>
        <span className="material-icons text-[24px]">photo_camera</span>
      </button>
    </div>
  );
};

export default Header;
