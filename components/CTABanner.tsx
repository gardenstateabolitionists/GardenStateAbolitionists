import Link from 'next/link';

interface CTABannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function CTABanner({
  title = 'SEEK JUSTICE',
  subtitle = 'Sign the petition to abolish abortion in New Jersey',
  buttonText = 'SIGN',
  buttonLink = '/the-petition',
}: CTABannerProps) {
  return (
    <section className="bg-[#1a1a1a] py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
        {subtitle && <p className="text-gray-400 mb-8">{subtitle}</p>}
        <div className="w-16 h-0.5 bg-red-600 mx-auto mb-8" />
        <Link
          href={buttonLink}
          className="inline-block px-8 py-3 bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-colors"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
