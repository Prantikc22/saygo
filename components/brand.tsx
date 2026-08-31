import { AudioLines } from 'lucide-react';

export function Brand({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`grid ${compact ? 'size-8' : 'size-9'} place-items-center rounded-xl ${inverse ? 'bg-[#e9f784] text-[#1d211d]' : 'bg-[#1d211d] text-[#e9f784]'}`}>
        <AudioLines className={compact ? 'size-4' : 'size-5'} strokeWidth={2.5} />
      </span>
      <span className={`${compact ? 'text-[17px]' : 'text-xl'} font-semibold tracking-[-0.04em]`}>openwhispr</span>
    </span>
  );
}
