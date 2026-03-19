import { type Provider } from "@/data/providers";

interface ProviderLogoProps {
  provider: Provider;
  size?: number;
  className?: string;
}

export function ProviderLogo({ provider, size = 20, className = "" }: ProviderLogoProps) {
  if (provider.logo) {
    return (
      <img
        src={provider.logo}
        alt={provider.name}
        width={size}
        height={size}
        className={`object-contain ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // Styled letter avatar fallback
  return (
    <div
      className={`flex items-center justify-center rounded-md font-bold text-white shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.5,
        backgroundColor: provider.brandColor,
      }}
    >
      {provider.name.charAt(0)}
    </div>
  );
}
