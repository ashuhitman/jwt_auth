export const validateUser = (data) => {
  let isError = false;
  const errors = {};

  if (data.password.length === 0) {
    errors.password = "Password is required";
    isError = true;
  } else if (data.password.length < 5) {
    errors.password = "Password length must be greater than 4";
    isError = true;
  }

  if (data.password && !data.rePassword) {
    errors.rePassword = "Re-enter password";
    isError = true;
  } else if (data.password && data.password != data.rePassword) {
    errors.rePassword = "Password does not match";
    isError = true;
  }
  if (!data.username) {
    errors.username = "Username is required";
    isError = true;
  } else if (data.username.length < 4) {
    errors.username = "Username length must be greater than 4 characters";
    isError = true;
  }

  return [isError, errors];
};

export const validateLoginData = ({ identifier, password }) => {
  let isError = false;
  const errors = {};
  if (!identifier) {
    isError = true;
    errors.identifier = "Please enter your email or username";
  } else {
    // Check if the entered identifier is a valid email address
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isUsername = /^[a-zA-Z0-9_]+$/.test(identifier);
    if (!isEmail && !isUsername) {
      isError = true;
      // You can add more specific username validation if needed
      errors.identifier = "Please enter a valid email address or username";
    }
  }
  // Validate password
  if (!password) {
    isError = true;
    errors.password = "Please enter your password";
  } else if (password.length < 5) {
    isError = true;
    errors.password = "Password length must be at least 5 characters";
  }
  return [isError, errors];
};

export const validateChangePasswordData = ({
  password,
  password_confirmation,
}) => {
  const errors = {};
  let isError = false;
  if (!password) {
    errors.password = "Password field is required";
    isError = true;
  } else if (password.length < 4) {
    errors.password = "Password field must be at least 4 characters long";
    isError = true;
  }
  if (!password_confirmation) {
    errors.password_confirmation = "Password confrimation field is required";
    isError = true;
  } else if (password_confirmation.length < 4) {
    errors.password_confirmation =
      "Password confirmation field must be at least 4 characters long";
    isError = true;
  }
  return [isError, errors];
};
