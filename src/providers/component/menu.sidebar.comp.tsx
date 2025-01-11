import { JSX } from 'hono/jsx';

export default function MenuSidebar({
  children,
  href,
  title,
  id,
}: {
  children: JSX.HTMLAttributes;
  href: string;
  title: string;
  id?: string;
}) {
  return (
    <a
      href={href}
      id={id}
      class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
    >
      {children}
      <span class="ms-3">{title}</span>
    </a>
  );
}
