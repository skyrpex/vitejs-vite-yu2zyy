import {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
  PropsWithChildren,
  MutableRefObject,
  SetStateAction,
  Dispatch,
} from 'react';

const PersistentState = createContext<{
  state: MutableRefObject<any[]>;
}>(undefined!);
const PersistentStateConsumer = createContext<{
  index: MutableRefObject<number>;
}>(undefined!);

export const PersistentStateProvider = (props: PropsWithChildren) => {
  const state = useRef([]);
  return (
    <PersistentState.Provider value={{ state }}>
      {props.children}
    </PersistentState.Provider>
  );
};

export function PersistentStateConsumerProvider(props: PropsWithChildren) {
  const index = useRef(0);
  useEffect(() => {
    index.current = 0;
  }, []);
  return (
    <PersistentStateConsumer.Provider value={{ index }}>
      {props.children}
    </PersistentStateConsumer.Provider>
  );
}

export function usePersistentState<S>(
  initialValue: S
): [S, Dispatch<SetStateAction<S>>] {
  const { state: contextState } = useContext(PersistentState)!;
  const { index: contextIndex } = useContext(PersistentStateConsumer)!;
  const [index, setIndex] = useState(-1);
  const [state, setState] = useState(initialValue);
  useEffect(() => {
    const newIndex = contextIndex!.current++;
    setIndex(newIndex);
    if (contextState.current.length > newIndex) {
      setState(contextState.current[newIndex]);
    }
  }, []);
  useEffect(() => {
    return () => {
      contextState.current[index] = state;
    };
  }, [state, index]);
  return [state, setState];
}
