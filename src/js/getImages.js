import { error as notifyError, Stack } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

export const myStack = new Stack({
  dir1: "down",
  dir2: "right",
  firstpos1: 20,
  firstpos2: 20,
  spacing1: 10,
  spacing2: 10,
});

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "57619990-0b83a72e5311572d43b501e51";

export async function getImages(search, page, limit) {
  try {
    const response = await fetch(
      `${BASE_URL}?key=${API_KEY}&q=${search}&page=${page}&per_page=${limit}&orientation=horizontal`
    );
    if (!response.ok) {
      throw new Error(`Помилка HTTP! Статус: ${response.status}`);
    }
    const images = await response.json();
    return images;
  } catch (err) {
    console.error("Помилка отримання зображень:", err);
    notifyError({
      text: "Не вдалося отримати зображення із сервера. Спробуйте пізніше!",
      delay: 2000,
      stack: myStack,
    });
    throw err;
  }
}