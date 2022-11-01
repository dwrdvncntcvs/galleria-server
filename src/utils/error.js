exports.errorMessage = (err) => {
  let error =
    typeof err.message === "string"
      ? err.message.split(": ")[1].split(",\n")
      : err.message;

  if (error.length < 2) {
    error = error[0].split(",");
  }

  console.log(error);
  return { status: error[0], msg: error[1] };
};
