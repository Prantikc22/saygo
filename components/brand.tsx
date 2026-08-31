export function Brand({
  compact = false,
  inverse = false,
}: {
  compact?: boolean;
  inverse?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`${compact ? 'size-7' : 'size-8'} rounded-full border-[5px] ${inverse ? 'border-[#e9f784]/25 bg-[#e9f784]' : 'border-[#dce975] bg-[#1d211d]'} shadow-[0_0_0_1px_rgba(29,33,29,.08)]`}
        aria-hidden="true"
      />
      <span
        className={`${compact ? 'text-[17px]' : 'text-xl'} font-semibold tracking-[-0.04em]`}
      >
        saygo
      </span>
    </span>
  );
}
