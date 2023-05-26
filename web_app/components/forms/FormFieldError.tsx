function FormFieldError({ error }: { error: string }) {
  return <p className="mt-1 text-xs text-red-600">{error}</p>;
}

export default FormFieldError;
