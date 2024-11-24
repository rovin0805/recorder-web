import { useEffect, useState } from "react";

const useToast = () => {
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToastMsg = () => {
    setIsToastVisible(true);
  };

  useEffect(() => {
    if (isToastVisible) {
      const id = setTimeout(() => {
        setIsToastVisible(false);
      }, 2000);
      return () => {
        clearTimeout(id);
      };
    }
  }, [isToastVisible]);

  return { isToastVisible, showToastMsg };
};

export default useToast;
