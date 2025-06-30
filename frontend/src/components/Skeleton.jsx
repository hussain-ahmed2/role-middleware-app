function Skeleton({ className, children }) {
  return (
    <div
      className={`animate-pulse transition duration-300 ease-in-out ${className}`}
    >
      {children}
    </div>
  );
}
export default Skeleton;
