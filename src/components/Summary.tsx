import { TailSpin } from "react-loader-spinner";
import colors from "@/styles/colors";

const Summary = ({ text, loading }: { text?: string; loading?: boolean }) => {
  return (
    <div className="h-full pt-[22px] px-[20px]">
      {loading || !text ? (
        <div className="flex items-center justify-center h-full w-full">
          <TailSpin color={colors.green} width={50} height={50} />{" "}
        </div>
      ) : (
        <div className="text-[15px] font-[400] text-[#1A1A1A]">{text}</div>
      )}{" "}
    </div>
  );
};

export default Summary;
