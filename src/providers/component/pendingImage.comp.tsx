export default function PendingImageCard({ id }: { id: string }) {
  return (
    <>
      <div
        class={'flex bg-gray-100 p-2 rounded-md mb-4'}
        id={`pending-containe-${id}`}
      >
        <h4 class={'me-2 text-gray-500'}>{id}</h4>
        <div
          class={
            'w-16 aspect-square overflow-hidden me-2 rounded-md bg-slate-300'
          }
        >
          <img
            class={'object-cover w-16 h-16'}
            src=""
            alt=""
            id={`clock-in-${id}`}
          />
        </div>
        <div
          class={
            'w-16 aspect-square overflow-hidden me-2 rounded-md bg-slate-300'
          }
        >
          <img
            class={'object-cover w-16 h-16'}
            src=""
            alt=""
            id={`clock-out-${id}`}
          />
        </div>
        <div class={'ms-auto close-container'} id={`close-container-${id}`}>
          <svg
            class="w-6 h-6 text-slate-500 dark:text-white cursor-pointer"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
