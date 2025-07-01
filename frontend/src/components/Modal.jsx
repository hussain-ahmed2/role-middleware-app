function Modal({ children, isOpen }) {
  return (
    <div
      className={`transition-all duration-300 ease-in-out fixed top 0 inset-0 z-20 flex items-center justify-center ${
        isOpen
          ? "scale-100 opacity-100 pointer-events-auto visible"
          : "scale-70 opacity-0 pointer-events-none invisible"
      }`}
    >
      <div className="bg-neutral-700 p-5 rounded-md w-full max-w-xl border border-neutral-600 shadow-lg">
        {children}
      </div>
    </div>
  );
}
export default Modal;
