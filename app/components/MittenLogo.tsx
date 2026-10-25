import Image from 'next/image';

interface MittenLogoProps {
  className?: string;
  compact?: boolean;
}

export default function MittenLogo({ className = '', compact = false }: MittenLogoProps) {
  return (
    <div className={className}>
      <Image
        src="/mitten-meals-logo.png"
        alt="Mitten Meals logo"
        width={compact ? 56 : 200}
        height={compact ? 56 : 200}
        className={compact ? 'h-14 w-14 object-contain' : 'h-full w-full object-contain'}
      />
    </div>
  );
}
