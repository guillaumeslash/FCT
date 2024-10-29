export function TimeAdjustButtons({ onAdjustTime }) {
  return (
    <div className="flex flex-row justify-center items-center gap-4 h-10 mb-2">
      <div className="basis-1/4"></div>
      <button
        onClick={() => onAdjustTime(-1)}
        className="basis-1/4 text-sm bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-3 rounded-full w-full h-full"
      >
        -1 min
      </button>
      <button
        onClick={() => onAdjustTime(1)}
        className="basis-1/4 text-sm bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-3 rounded-full w-full h-full"
      >
        +1 min
      </button>
      <div className="basis-1/4"></div>
    </div>
  );
}
