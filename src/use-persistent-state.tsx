import {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
  PropsWithChildren,
  MutableRefObject,
} from 'react';

const PersistentState = createContext<{
  state: MutableRefObject<any[]>;
  // setState()
}>(undefined!);
const PersistentStateConsumer = createContext<{
  index: MutableRefObject<number>;
}>(undefined!);

export const PersistentStateProvider = (props: PropsWithChildren) => {
  // const [state, setState] = useState(() => []);
  const state = useRef([]);
  return (
    <PersistentState.Provider value={{ state }}>
      {props.children}
    </PersistentState.Provider>
  );
};

export function PersistentStateConsumerProvider(props: PropsWithChildren) {
  const index = useRef(0);
  // index.current = 0;
  useEffect(() => {
    index.current = 0;
  }, []);
  return (
    <PersistentStateConsumer.Provider value={{ index }}>
      {props.children}
    </PersistentStateConsumer.Provider>
  );
}

export function usePersistentState<T>(initialValue: T) {
  const { state: contextState } = useContext(PersistentState)!;
  const { index: contextIndex } = useContext(PersistentStateConsumer)!;
  const [index, setIndex] = useState(-1);
  const [otherIndex] = useState(() => {
    return contextIndex.current + 1;
  });
  useEffect(() => {
    console.log({ otherIndex });
  }, [otherIndex]);
  // const states = useContext(PersistentState);
  // const state = states[currentIndex];
  // const setState = useCallback((value) => {});
  // return [states[currentIndex]];
  const [state, setState] = useState(initialValue);
  useEffect(() => {
    const newIndex = contextIndex!.current++;
    setIndex(newIndex);
    setState(contextState.current[newIndex] ?? initialValue);
  }, []);
  useEffect(() => {
    return () => {
      contextState.current[index] = state;
    };
  }, [state, index]);
  return [state, setState];
}
