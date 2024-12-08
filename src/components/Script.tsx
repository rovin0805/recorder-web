import colors from "@/styles/colors";
import { formatTime } from "@/utils/formatStr";

interface ScriptProps {
  scripts: { start: number; end: number; text: string }[];
  onPressSummarize: () => void;
}

const Script = ({ scripts, onPressSummarize }: ScriptProps) => {
  return (
    <div className="flex flex-col px-[16px] py-[24px]">
      <button
        className={`relative bg-[#09CC7F] mb-[18px] flex justify-center items-center py-[13px] rounded-[6px] text-[16px] font-[700] text-[#FFFFFF]`}
        onClick={onPressSummarize}
      >
        요약하기
        <span className="material-icons text-white text-[24px] absolute right-[17px]">
          east
        </span>
      </button>

      <div className="flex flex-col gap-[18px]">
        {scripts.map((script, index) => {
          return (
            <div key={index}>
              <div className="text-[#848487] text-[15px] font-[400]">
                {`${formatTime(script.start)} ~ ${formatTime(script.end)}`}
              </div>
              <div className="mt-[10px] text-[15px] font-[400] text-[#1A1A1A]">
                {script.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Script;
