import { TextareaHTMLAttributes } from "react";

type TextAreaProps = {
  name: string;
  label?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

function TextArea({ name, label, ...props }: TextAreaProps) {
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
        <textarea
          id={name}
          name={name}
          rows={3}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:focus:ring-indigo-500"
          {...props}
        />
      </div>
    </>
  );
}

export default TextArea;
