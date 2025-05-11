export default function ImageCard({
  clock_in_path,
  clock_out_path,
  id,
}: {
  clock_in_path: string;
  clock_out_path: string;
  id: string;
}) {
  return (
    <>
      <div
        class={
          'bg-blue-50 py-3 px-5 rounded-md w-full sm:w-full md:w-[300px] me-4 mb-4'
        }
      >
        <h5 class={'mb-2 text-slate-600'}>Image Pair #{id}</h5>
        <div class={'flex justify-around md:justify-between'}>
          <div class={'flex flex-col content-end'}>
            <img class={'rounded-md w-28 me-10'} src={clock_in_path} alt="" />
            <h6 class={'text-blue-400 font-semibold mt-auto'}>Clock In</h6>
          </div>

          <div class={'flex flex-col content-end'}>
            <img class={'rounded-md w-28'} src={clock_out_path} alt="" />
            <h6 class={'text-blue-400 font-semibold mt-auto'}>Clock Out</h6>
          </div>
        </div>
      </div>
    </>
  );
}
