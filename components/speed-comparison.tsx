'use client';

import { Keyboard, Mic } from 'lucide-react';
import { useEffect, useState } from 'react';

const words =
  'Quick update: the launch is ahead of schedule, early feedback looks strong, and I’ll share final numbers tomorrow.'.split(
    ' ',
  );

const keys = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const keySequence = 'QUICKUPDATETHELAUNCHISAHEAD'.split('');

function SaygoDot() {
  return (
    <span
      className="grid size-7 shrink-0 place-items-center rounded-full bg-[#e9f784]"
      aria-hidden="true"
    >
      <span className="size-3.5 rounded-full bg-[#1d211d]" />
    </span>
  );
}

export function SpeedComparison() {
  const [voiceWordCount, setVoiceWordCount] = useState(0);
  const [keyboardWordCount, setKeyboardWordCount] = useState(0);
  const [activeKey, setActiveKey] = useState('');

  useEffect(() => {
    let voiceTimer: number | undefined;
    let keyboardTimer: number | undefined;

    const run = () => {
      setVoiceWordCount(0);
      setKeyboardWordCount(0);
      setActiveKey('');

      let voiceIndex = 0;
      voiceTimer = window.setInterval(() => {
        voiceIndex += 1;
        setVoiceWordCount(Math.min(words.length, voiceIndex));
        if (voiceIndex >= words.length && voiceTimer) {
          window.clearInterval(voiceTimer);
        }
      }, 105);

      let keyboardIndex = 0;
      keyboardTimer = window.setInterval(() => {
        keyboardIndex += 1;
        setKeyboardWordCount(Math.min(words.length, keyboardIndex));
        setActiveKey(keySequence[keyboardIndex % keySequence.length] || '');
        if (keyboardIndex >= words.length && keyboardTimer) {
          window.clearInterval(keyboardTimer);
          window.setTimeout(() => setActiveKey(''), 160);
        }
      }, 360);
    };

    run();
    const cycle = window.setInterval(run, 8200);
    return () => {
      window.clearInterval(cycle);
      if (voiceTimer) window.clearInterval(voiceTimer);
      if (keyboardTimer) window.clearInterval(keyboardTimer);
    };
  }, []);

  return (
    <section className="border-y border-[#1d211d]/10 bg-[#f7f8f5] px-5 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[.16em] text-[#7d8a1f]">
            Your thoughts set the pace
          </p>
          <h2 className="mt-4 text-5xl font-semibold tracking-[-.06em] sm:text-7xl">
            Speaking gets there first.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#687068]">
            Watch the same thought arrive word by word at voice speed and
            keyboard speed. Saygo keeps up, then cleans up.
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-[30px] border border-[#1d211d]/12 bg-white shadow-[0_30px_90px_rgba(29,33,29,.08)]">
          <div className="grid md:grid-cols-2">
            <article className="relative min-h-[430px] overflow-hidden border-b border-[#1d211d]/10 bg-[#1d211d] p-7 text-white md:border-b-0 md:border-r sm:p-10">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-sm font-semibold text-white/65">
                  <SaygoDot /> Speaking with Saygo
                </span>
                <strong className="font-mono text-2xl text-[#e9f784]">
                  240 WPM
                </strong>
              </div>
              <div className="mt-10 flex items-center gap-4">
                <span className="recording-glow grid size-12 place-items-center rounded-2xl bg-[#e9f784] text-[#1d211d]">
                  <Mic className="size-5" fill="currentColor" />
                </span>
                <div
                  className="flex h-16 items-center gap-1"
                  aria-hidden="true"
                >
                  {[
                    22, 42, 28, 61, 36, 72, 31, 54, 68, 39, 63, 29, 47, 24, 38,
                  ].map((height, index) => (
                    <span
                      key={`${height}-${index}`}
                      className="speed-wave w-1 rounded-full bg-[#e9f784]"
                      style={{ height, animationDelay: `${index * 70}ms` }}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-8 flex flex-wrap gap-x-[.28em] gap-y-1 text-2xl font-medium leading-[1.45] tracking-[-.03em]">
                {words.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className={`transition-all duration-200 ${index < voiceWordCount ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-15'}`}
                  >
                    {word}
                  </span>
                ))}
              </p>
              <div className="absolute bottom-0 left-0 h-1.5 w-full bg-white/10">
                <span
                  className="block h-full bg-[#e9f784] transition-[width] duration-150"
                  style={{ width: `${(voiceWordCount / words.length) * 100}%` }}
                />
              </div>
            </article>

            <article className="relative min-h-[430px] overflow-hidden p-7 sm:p-10">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-sm font-semibold text-[#727871]">
                  <Keyboard className="size-4" /> Using a keyboard
                </span>
                <strong className="font-mono text-2xl text-[#7d837b]">
                  40 WPM
                </strong>
              </div>

              <div className="mx-auto mt-9 max-w-[420px] space-y-1.5 rounded-[18px] border border-[#1d211d]/10 bg-[#f2f0ea] p-3 shadow-inner">
                {keys.map((row, rowIndex) => (
                  <div
                    key={row.join('')}
                    className="flex justify-center gap-1.5"
                    style={{ paddingInline: `${rowIndex * 9}px` }}
                  >
                    {row.map((key) => (
                      <span
                        key={key}
                        className={`grid size-7 place-items-center rounded-md border bg-white font-mono text-[9px] font-bold shadow-[0_2px_0_rgba(29,33,29,.12)] transition-all duration-75 ${activeKey === key ? 'translate-y-0.5 border-[#a5b333] bg-[#e9f784] shadow-none' : 'border-[#1d211d]/8 text-[#777d75]'}`}
                      >
                        {key}
                      </span>
                    ))}
                  </div>
                ))}
                <div className="mx-auto mt-2 h-5 w-44 rounded-md border border-[#1d211d]/8 bg-white shadow-[0_2px_0_rgba(29,33,29,.12)]" />
              </div>

              <p className="mt-8 flex flex-wrap gap-x-[.28em] gap-y-1 text-2xl font-medium leading-[1.45] tracking-[-.03em]">
                {words.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className={`transition-colors duration-150 ${index < keyboardWordCount ? 'text-[#1d211d]' : 'text-[#c2c5c0]'}`}
                  >
                    {word}
                  </span>
                ))}
                <span className="speed-caret h-7 w-0.5 bg-[#8c918a]" />
              </p>
              <div className="absolute bottom-0 left-0 h-1.5 w-full bg-[#1d211d]/8">
                <span
                  className="block h-full bg-[#8c918a] transition-[width] duration-300"
                  style={{
                    width: `${(keyboardWordCount / words.length) * 100}%`,
                  }}
                />
              </div>
            </article>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-[#92978f]">
          Illustrative 240-vs-40 WPM playback; individual pace and results vary.
        </p>
      </div>
    </section>
  );
}
