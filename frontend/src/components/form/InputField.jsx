import { useFormContext } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function InputField({
  name,
  label,
  type = "text",
  placeholder = "Type here",
  defaultValue = null,
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-2 relative">
      {type === "password" && (
        <button
          type="button"
          className="absolute top-0 right-0"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <Eye /> : <EyeOff />}
        </button>
      )}
      <label htmlFor={name}>{label}</label>
      <input
        className={`input ${
          errors[name] ? "border-rose-700 ring-rose-500/50" : ""
        }`}
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        {...register(name)}
      />
      <div className="overflow-hidden">
        <p
          className={`text-red-500 text-sm transition-all duration-300 ${
            errors[name] ? "" : "opacity-0 h-0 translate-x-full"
          }`}
        >
          {errors[name]?.message}
        </p>
      </div>
    </div>
  );
}
export default InputField;
