import areEqual from 'deep-equal';
import { useState, useCallback, useRef } from 'react';

export default function useSelection(editor) {
  const [selection, setSelection] = useState(editor.selection);
  const previousSelection = useRef(null);
  const setSelectionOptimized = useCallback(
    (newSelection) => {
      if (areEqual(selection, newSelection)) {
        return;
      }
      previousSelection.current = selection;
      setSelection(newSelection);
    },
    [setSelection, selection]
  );

  return [previousSelection.current, selection, setSelectionOptimized];
}
