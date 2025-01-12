export default function TextInput({
  placeholder,
  iconPath,
  formName,
  borderColor,
}: {
  placeholder: string;
  iconPath: string;
  formName: string;
  borderColor?: string | Promise<string> | undefined;
}) {
  return (
    <>
      <div class="relative mb-6">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
          <img class={'w-4 h-4 '} src={iconPath} alt="Icon Email" />
        </div>
        <input
          type="text"
          id={formName}
          class={
            borderColor
              ? borderColor +
                ' bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          }
          placeholder={placeholder}
        />
      </div>
    </>
  );
}
