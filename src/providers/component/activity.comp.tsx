export default function ActivityCard({ text }: { text: string }) {
  return (
    <div class={'bg-slate-100 border-2 border-slate-200 rounded-lg p-2 mb-4'}>
      <p>{text}</p>
    </div>
  );
}
