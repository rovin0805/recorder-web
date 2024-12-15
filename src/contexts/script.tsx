"use client";

import { dummyScripts } from "@/constants/dummy";
import { hasReactNativeWebview, postMsgToRn } from "@/utils/webView";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Script = {
  start: number;
  end: number;
  text: string;
};

export type Data = {
  id: string;
  text: string;
  scripts: Script[];
  summary?: string;
  photos?: string[];
  createdAt: number;
};

type ScriptContextType = {
  create: (data: Data) => void;
  get: ({ id }: { id: string }) => Data | undefined;
  update: ({ id, summary }: { id: string; summary?: string }) => void;
  getAll: () => Data[];
};

type Database = {
  [id: string]: Data;
};

const ScriptContext = createContext<ScriptContextType | undefined>(undefined);

export const DataProvider = ({ children }: PropsWithChildren<{}>) => {
  const [database, setDatabase] = useState<Database>({});
  const [loaded, setLoaded] = useState(false);

  // 1. 앱에서 스토리지를 로드하도록 메시지 전송
  useEffect(() => {
    if (!loaded && hasReactNativeWebview) {
      postMsgToRn({ type: "loadDatabase" });
    }
  }, [loaded, hasReactNativeWebview]);
  // 2. 앱에서 로드한 스토리지를 전달받아서 컨텍스트에 저장
  useEffect(() => {
    const handlerMsgFromRn = (event: any) => {
      const { type, data } = JSON.parse(event.data);
      if (type === "loadDatabase") {
        setDatabase(data);
        setLoaded(true);
      }
    };
    const listenerType = "message";
    window.addEventListener(listenerType, handlerMsgFromRn);
    document.addEventListener(listenerType, handlerMsgFromRn);
    return () => {
      window.removeEventListener(listenerType, handlerMsgFromRn);
      document.removeEventListener(listenerType, handlerMsgFromRn);
    };
  }, [hasReactNativeWebview]);

  useEffect(() => {
    if (loaded && hasReactNativeWebview) {
      postMsgToRn({ type: "saveDatabase", data: database });
    }
  }, [loaded, hasReactNativeWebview, database]);

  const create = useCallback((data: Data) => {
    setDatabase((prev) => ({
      ...prev,
      [data.id]: data,
    }));
  }, []);

  const get = useCallback(
    ({ id }: { id: string }) => {
      return database[id];
    },
    [database]
  );

  const getAll = useCallback(() => {
    return Object.values(database) as Data[];
  }, [database]);

  const update = useCallback(
    ({ id, summary }: { id: string; summary?: string }) => {
      setDatabase((prevDatabase) => {
        const prevData = prevDatabase[id];
        if (prevData == null) {
          return prevDatabase;
        }
        return {
          ...prevDatabase,
          [id]: {
            ...prevData,
            ...(summary != null ? { summary } : {}),
          },
        };
      });
    },
    []
  );

  return (
    <ScriptContext.Provider value={{ create, get, update, getAll }}>
      {children}
    </ScriptContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(ScriptContext);

  if (!context) {
    throw new Error("useDatabase must be used within a DataProvider");
  }

  return context;
};
