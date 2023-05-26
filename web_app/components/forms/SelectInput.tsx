import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {classNames} from "@/lib/helpers";
import { useFormikContext } from "formik";

type SelectInputOption = {
  id: string;
  label: string;
  value: string;
};

type SelectInputProps = {
  label: string;
  name: string;
  value: string;
  options: SelectInputOption[];
};

export default function SelectInput({ label, options, name, value }: SelectInputProps) {
  const { setFieldValue } = useFormikContext();

  const selectedOption = options.find((option) => option.value === value) || options[0];

  const handleChange = (val: any) => {
    setFieldValue(name, val);
  };

  return (
    <Listbox name={name} value={selectedOption} onChange={handleChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
            {label}
          </Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-white/5 dark:ring-white/10 hover:cursor-pointer">
              <span className="block truncate">{selectedOption?.label}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-zinc-800 dark:text-white dark:ring-white/10">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-indigo-600 text-white" : "text-gray-900 dark:text-white",
                        "relative cursor-default select-none py-2 pl-3 pr-9 hover:cursor-pointer"
                      )
                    }
                    value={option.value}
                  >
                    {({ active }) => (
                      <>
                        <span
                          className={classNames(
                            value === option.value ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {option.label}
                        </span>

                        {value === option.value ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
