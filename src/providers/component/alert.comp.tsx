export default function AlertCard({
  type,
  text,
}: {
  type: 'error' | 'info' | 'success';
  text: string;
}) {
  let cardColorClass: string = 'bg-blue-50 border-blue-500 text-blue-500';
  switch (type) {
    case 'error':
      cardColorClass = 'bg-red-50 border-red-500 text-red-500';
      break;

    case 'info':
      cardColorClass = 'bg-blue-50 border-blue-500 text-blue-500';
      break;

    case 'success':
      cardColorClass = 'bg-emerald-50 border-emerald-500 text-emerald-500';
      break;

    default:
      cardColorClass = 'bg-blue-50 border-blue-500 text-blue-500';
      break;
  }
  return (
    <div
      class={`${cardColorClass} w-full border-2 font-bold rounded-lg p-2 mb-6`}
    >
      <p>{text}</p>
    </div>
  );
}
