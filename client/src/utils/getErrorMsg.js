const getErrorMsg = (err) => {
  if (err?.response?.data?.message) {
    return err.response.data.message;
  } else if (err?.message === "خطای شبکه") {
    return err.message;
  } else {
    return "مشکلی رخ داد";
  }
};

export default getErrorMsg;
