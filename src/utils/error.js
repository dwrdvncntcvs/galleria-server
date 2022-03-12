exports.errorMessage = (err) => {
  const error =
    typeof err.message === "string"
      ? err.message.split(": ")[1].split(",\n")
      : err.message;
  return { status: error[0], msg: error[1] };
};
