export function WhatsAppCta({
  courseTitle,
  className,
}: {
  courseTitle: string;
  className?: string;
}) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!phone) return null;

  const message = `Bonjour, je suis intéressé(e) par la formation "${courseTitle}".`;
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-green bg-white px-6 py-3 text-sm font-semibold text-brand-green-700 transition-colors hover:bg-brand-green-50"
      }
    >
      💬 Discuter sur WhatsApp
    </a>
  );
}
