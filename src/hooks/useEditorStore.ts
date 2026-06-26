import { useSyncExternalStore } from 'react';

import { editorStore, type EditorState } from '@/lib/editor.store';

export const useEditorStore = <T>(selector: (state: EditorState) => T) => {
  return useSyncExternalStore(
    editorStore.subscribe,
    () => selector(editorStore.getState()),
    () => selector(editorStore.getState()),
  );
};
