import { InputHTMLAttributes } from "react";

type CheckBoxInputProps = {
  label: string;
  name: string;
} & InputHTMLAttributes<HTMLInputElement>;

function CheckBoxInput({ label, name, ...props }: CheckBoxInputProps) {
  return (
    <div className="relative flex gap-x-3">
      <div className="flex h-6 items-center">
        <input
          id={name}
          name={name}
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 disabled:cursor-not-allowed dark:border-white/10 dark:bg-white/5  dark:focus:ring-offset-gray-900"
          {...props}
        />
      </div>
      <div className="text-sm leading-6">
        <label
          htmlFor={name}
          className={`${
            props.disabled ? "text-opacity-50 dark:text-opacity-50 cursor-not-allowed" : ""
          } font-medium text-gray-900 dark:text-white`}
        >
          {label}
        </label>
      </div>
    </div>
  );
}

export default CheckBoxInput;
