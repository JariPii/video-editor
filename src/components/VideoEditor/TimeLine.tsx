'use client';

import { useEditorStore } from '@/hooks/useEditorStore';
import { editorStore } from '@/lib/editor.store';
import { useCallback, useEffect, useRef } from 'react';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

type DragTarget = 'playhead' | 'in' | 'out' | null;

const TimeLine = () => {
  const duration = useEditorStore((s) => s.duration);
  const currentTIme = useEditorStore((s) => s.currentTime);
  const inPoint = useEditorStore((s) => s.inPoint);
  const outPoint = useEditorStore((s) => s.outPoint);

  const trackRef = useRef<HTMLDivElement>(null);
  const dragTarget = useRef<DragTarget>(null);

  const progress = duration === 0 ? 0 : (currentTIme / duration) * 100;
  const inPct =
    inPoint !== null && duration > 0 ? (inPoint / duration) * 100 : null;
  const outPct =
    outPoint !== null && duration > 0 ? (outPoint / duration) * 100 : null;

  const timeFromClientX = useCallback(
    (clientX: number): number => {
      if (!trackRef.current || duration === 0) return 0;

      const rect = trackRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return pct * duration;
    },
    [duration],
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const target = dragTarget.current;
      if (!target) return;
      const time = timeFromClientX(e.clientX);

      if (target === 'playhead') {
        editorStore.setCurrentTime(time);
        editorStore.player?.seek(time);
      } else if (target === 'in') {
        editorStore.setInPoint(time);
      } else if (target === 'out') {
        editorStore.setOutPoint(time);
      }
    };

    const onMouseUp = () => {
      dragTarget.current = null;
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [timeFromClientX]);

  const handleTrackMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration === 0) return;
    dragTarget.current = 'playhead';
    const time = timeFromClientX(e.clientX);
    editorStore.setCurrentTime(time);
    editorStore.player?.seek(time);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      if (e.key === 'i' || e.key === 'I') {
        editorStore.setInPoint(editorStore.getState().currentTime);
      }
      if (e.key === 'o' || e.key === 'O') {
        editorStore.setOutPoint(editorStore.getState().currentTime);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const ticks = () => {
    if (duration === 0) return null;

    const marks = [];

    const interval = duration > 120 ? 10 : duration > 30 ? 5 : 1;

    for (let t = interval; t < duration; t += interval) {
      const pct = (t / duration) * 100;
      const isMajor = t % (interval * 5) === 0 || interval >= 5;

      marks.push(
        <div
          key={t}
          className='absolute flex flex-col items-center'
          style={{ left: `${pct}%` }}
        >
          {isMajor && (
            <span
              className={`text-gray-500 text-[10px] mb-0.5 ${isMajor ? 'block' : 'hidden'}`}
            >
              {formatTime(t)}
            </span>
          )}
          <div
            className={`w-px ${isMajor ? 'h-3 bg-gray-400' : 'h-2 bg-gray-600'}`}
          />
        </div>,
      );
    }

    return marks;
  };

  return (
    <div className='mt-6 w-full max-w-4xl select-none'>
      <div className='relative h-6 mb-1'>{ticks()}</div>

      <div
        ref={trackRef}
        className='relative h-4 rounded bg-neutral-800 cursor-pointer'
        onMouseDown={handleTrackMouseDown}
      >
        {inPct !== null && outPct !== null && (
          <div
            className='absolute top-0 bottom-0 bg-blue-500 opacity-25'
            style={{ left: `${inPct}%`, width: `${outPct - inPct}%` }}
          />
        )}

        {inPct !== null && (
          <div
            className='absolute top-0 bottom-0 w-0.5 bg-green-400 cursor-ew-resize'
            style={{ left: `${inPct}%` }}
            onMouseDown={(e) => {
              e.stopPropagation();
              dragTarget.current = 'in';
            }}
          >
            <div className='absolute -top-2 left-0 w-3 h-3 bg-green-400 rounded-sm' />
          </div>
        )}

        {outPct !== null && (
          <div
            className='absolute top-0 bottom-0 w-0.5 bg-red-400 cursor-ew-resize'
            style={{ left: `${outPct}%` }}
            onMouseDown={(e) => {
              e.stopPropagation();
              dragTarget.current = 'out';
            }}
          >
            <div className='absolute -top-2 -left-3 w-3 h-3 bg-red-400 rounded-sm' />
          </div>
        )}

        <div
          className='absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize z-10'
          style={{ left: `${progress}%` }}
        >
          {formatTime(currentTIme)}
        </div>
      </div>

      {(inPoint !== null || outPoint !== null) && (
        <div className='mt-3 flex gap-4 text-[11px] font-mono text-gray-400'>
          {inPoint !== null && (
            <span className='flex items-center gap-1'>
              <span className='text-green-400'>IN</span>
              {formatTime(inPoint)}
              <button
                className='ml-1 text-gray-600 hover:text.gray-300'
                onClick={() => editorStore.setInPoint(null)}
              >
                X
              </button>
            </span>
          )}
          {outPoint !== null && (
            <span className='flex items-center gap-1'>
              <span className='text-red-400'>OUT</span>
              {formatTime(outPoint)}
              <button
                className='ml-1 text-gray-600 hover:text-gray-300'
                onClick={() => editorStore.setOutPoint(null)}
              >
                X
              </button>
            </span>
          )}
          {inPoint !== null && outPoint !== null && (
            <span className='text-gray-600'>
              Length: {formatTime(outPoint - inPoint)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeLine;
