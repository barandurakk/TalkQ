export const validateName = (name) => {
  let error = {};
  const re = /^[a-z ,.'-]+$/;

  if (isEmpty(name)) error.name = "Name can't be empty!";
  else if (!re.test(name.toLowerCase())) error.name = "Please enter a valid name!";

  return error;
};

export const validateEmail = (email) => {
  let error = {};
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (isEmpty(email)) error.email = "Email can't be empty!";
  else if (!re.test(email)) error.email = "Please enter a valid email!";

  return error;
};

export const validatePassword = (password) => {
  let error = {};
  const re = /^[A-Za-z]\w{7,14}$/;

  if (isEmpty(password)) error.password = "Password can't be empty!";
  else if (!re.test(password))
    error.password =
      "Password should be 7 to 15 characters, which contain only characters, numeric digits, underscore and first character must be a letter!";

  return error;
};

const isEmpty = (data) => {
  const re = /^(?![\s\S])/;
  return re.test(data);
};

export const validateRegister = (formData) => {
  let error = {};

  error = { ...error, ...validateEmail(formData.email) };
  error = { ...error, ...validatePassword(formData.password) };
  error = { ...error, ...validateName(formData.name) };
  error = { ...error, ...validateEmail(formData.email) };
  error =
    formData.password !== formData.rePassword
      ? { ...error, rePassword: "Passwords don't match!" }
      : { ...error };
  console.log("error: ", error);
  return error;
};
