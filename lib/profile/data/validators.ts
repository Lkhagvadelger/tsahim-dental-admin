export const validateName = (name: string) => {
  const re = /^[a-zа-яүө ,.'-]+$/i;
  return re.test(String(name).toLowerCase());
};
