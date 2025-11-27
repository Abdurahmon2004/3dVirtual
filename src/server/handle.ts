import utils from "@/helpers/utils";

export default function handleError(error: any) {
  const status = error.response?.status;
  const data = error.response?.data;
  const code = error.code;
  if (code === "ERR_NETWORK") {
    utils.alert("error", "Server bilan aloqa yo‘q. Internetni tekshiring!");
    return;
  }
  let messages: string[] = [];

  if (Array.isArray(data?.errors)) {
    messages = data.errors
      .map((err: any) => err?.message)
      .filter(Boolean);
  } else if (typeof data?.detail === "string") {
    messages = [data.detail];
  } else if (typeof data?.message === "string") {
    messages = [data.message];
  } else if (typeof data === "string") {
    messages = [data];
  } else {
    messages = ["Noma'lum xatolik yuz berdi."];
    localStorage.removeItem("user");
    window.location.href = "/sign-in";
  }
  if (status === 401) {
    localStorage.removeItem("user");
    window.location.href = "/sign-in";

  }

  messages.forEach((msg, index) => {
    setTimeout(() => {
      utils.alert("error", msg);
    }, index * 300);
  });
}
