import { InputHTMLAttributes } from "react";

type TextInputProps = {
  name: string;
  label?: string;
} & InputHTMLAttributes<HTMLInputElement>;

function TextInput({ name, label, ...props }: TextInputProps) {
  return (
    <>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
        >
          {label}
        </label>
      )}
      <div className="mt-2">
        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 dark:bg-white/5 dark:ring-white/10">
          <input
            id={name}
            name={name}
            type="text"
            className="block flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 dark:text-white"
            {...props}
          />
        </div>
      </div>
    </>
  );
}

export default TextInput;
