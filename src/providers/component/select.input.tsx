export type SelectOption = {
  id: number;
  value: string;
};
export default function SelectInput({
  id,
  data,
}: {
  id: string;
  data: SelectOption[];
}) {
  return (
    <select
      id={`select-${id}`}
      class="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="Pilih Lokasi"
    >
      {data.map((d) => (
        <option value={d.id}>{d.value}</option>
      ))}
    </select>
  );
}
