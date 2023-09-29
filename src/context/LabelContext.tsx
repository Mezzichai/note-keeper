import { createContext, useState, useContext, useEffect } from "react";
import { LabelType } from "../interfaces";
import { getLabels } from "../utils/labels";
import { useAsync } from "../hooks/useAsync";


interface LabelProviderProps {
  children: React.ReactNode;
}

interface ContextType {
  labels: LabelType[];
  setLabels: React.Dispatch<React.SetStateAction<LabelType[]>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentLabel: string;
  setCurrentLabel: React.Dispatch<React.SetStateAction<string>>;
  updateLocalLabel: (id: string, newName: string) => void;
  createLocalLabel: (label: LabelType) => void;
  deleteLocalLabel: (id: string) => void;
}

const LabelContext = createContext({} as ContextType);

const useLabels = () => {
  return useContext(LabelContext)
}

const LabelProvider: React.FC<LabelProviderProps> = ({ children }) => {
  const { loading, error, data } = useAsync(getLabels)
  const [labels, setLabels] = useState<LabelType[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentLabel, setCurrentLabel] = useState<string>("Notes")

  useEffect(() => {
    if (data) {
      setLabels(data)
    }
  }, [data])

  function updateLocalLabel(id: string, newName: string) {
    id + newName
  }

  function createLocalLabel(label: LabelType) {
    label
  }

  function deleteLocalLabel(id: string) {
    id
  }

  const context: ContextType = {
    labels,
    setLabels,
    isOpen,
    setIsOpen,
    currentLabel,
    setCurrentLabel,
    updateLocalLabel,
    createLocalLabel, 
    deleteLocalLabel
  };
  

  return (
    <LabelContext.Provider value={context}>
      {loading ? (
        <h1>Loading</h1>
      ) : error ? (
        <h1 className="error-msg">{error.message}</h1> 
      ) : (
        <>
          {children}
        </>
      )}
    </LabelContext.Provider>
  );
};

export { LabelProvider, useLabels };