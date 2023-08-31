import { useEffect, useState } from 'react';
import {
  PersistentStateConsumerProvider,
  PersistentStateProvider,
  usePersistentState,
} from './use-persistent-state';

function MyComponent() {
  const [state1, setState1] = usePersistentState('a');
  const [state2, setState2] = usePersistentState('b');
  return (
    <div>
      Hello,{' '}
      <input
        value={state1}
        onInput={(event) => setState1(event.currentTarget.value)}
      />
      <input
        value={state2}
        onInput={(event) => setState2(event.currentTarget.value)}
      />
    </div>
  );
}

function App() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <button onClick={() => setVisible((visible) => !visible)}>Toggle</button>

      <PersistentStateProvider>
        {visible && (
          <PersistentStateConsumerProvider>
            <MyComponent />
          </PersistentStateConsumerProvider>
        )}
      </PersistentStateProvider>
    </>
  );
}

export default App;
