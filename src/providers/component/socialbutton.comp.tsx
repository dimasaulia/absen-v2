import { JSX } from 'hono/jsx';

export default function SocialButton({
  icon,
  text,
  className,
  href,
}: {
  icon: string;
  text: string;
  className?: string | Promise<string> | undefined;
  href: string;
}) {
  return (
    <a
      href={href}
      class={
        'flex items-center text-gray-800 font-bold bg-slate-100 border-slate-200 border-[1px] rounded-lg py-2 px-4 me-2 mb-2 ' +
        className
      }
    >
      <img class={'w-4 h-4 me-2'} alt="" src={icon} />
      {text}
    </a>
  );
}
