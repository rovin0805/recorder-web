interface ToastMsgProps {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
}

const ToastMsg = ({ message, type, isVisible }: ToastMsgProps) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`w-[90%] fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-white shadow-lg py-2 px-4 rounded-lg border-l-4 ${
        type === "success" ? "border-green-500" : "border-red-500"
      }`}
    >
      <span
        className={`material-icons text-xl ${
          type === "success" ? "text-green-500" : "text-red-500"
        }`}
      >
        {type === "success" ? "check_circle" : "error"}
      </span>
      <span className="ml-2">{message}</span>
    </div>
  );
};

export default ToastMsg;
