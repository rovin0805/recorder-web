"use client";

import { dummyScripts } from "@/constants/dummy";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
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
};

type ScriptContextType = {
  create: (data: Data) => void;
  get: ({ id }: { id: string }) => Data | undefined;
  update: ({ id, summary }: { id: string; summary?: string }) => void;
};

type Database = {
  [id: string]: Data;
};

const ScriptContext = createContext<ScriptContextType | undefined>(undefined);

export const DataProvider = ({ children }: PropsWithChildren<{}>) => {
  const [database, setDatabase] = useState<Database>(dummyScripts);

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

  const update = useCallback(
    ({ id, summary }: { id: string; summary?: string }) => {
      setDatabase((prev) => {
        const prevData = prev[id];
        if (!prevData) {
          return prev;
        }

        return {
          ...prev,
          [id]: {
            ...prevData,
            ...(summary ? { summary } : {}),
          },
        };
      });
    },
    []
  );

  return (
    <ScriptContext.Provider value={{ create, get, update }}>
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
