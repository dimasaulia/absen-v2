export default function PassowrdInput({
  placeholder,
  iconPath,
  formName,
}: {
  placeholder: string;
  iconPath: string;
  formName: string;
}) {
  return (
    <>
      <div class="relative mb-6">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
          <img class={'w-4 h-4 '} src={iconPath} alt="Icon Email" />
        </div>
        <input
          type="password"
          id={formName}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={placeholder}
          autocomplete={'username webauthn'}
        />
      </div>
    </>
  );
}
