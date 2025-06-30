function Loader() {
  return (
    <div className="flex gap-1 my-1">
      <div className="size-3 bg-neutral-400 rounded-full animate-scale-in-out"></div>
      <div className="size-3 bg-neutral-400 rounded-full animate-[scale-in-out_0.5s_ease-in-out_0.1s_infinite_alternate]"></div>
      <div className="size-3 bg-neutral-400 rounded-full animate-[scale-in-out_0.5s_ease-in-out_0.2s_infinite_alternate]"></div>
    </div>
  );
}
export default Loader;
