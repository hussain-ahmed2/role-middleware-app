export const handleErrors = (errors, setError) => {
  for (const [key, value] of Object.entries(errors)) {
    setError(key, { message: value }, { shouldFocus: true });
  }
};
