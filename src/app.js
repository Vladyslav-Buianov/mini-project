import * as basicLightbox from "basiclightbox";
import 'basiclightbox/dist/basicLightbox.min.css';
import { getImages, myStack } from "./js/getImages.js";
import { renderImages } from "./js/renderImages.js";
import { error as notifyError, success as notifySuccess } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

const listRef = document.querySelector(".gallery");
const inputRef = document.querySelector("input");
const elemRef = document.querySelector(".elem");
let largeImage = null;
let instance = null;

let page = 1;
let search = "";
const limit = 12;
listRef.addEventListener("click", (event) => {
  if (event.target.nodeName !== "IMG") {
    return;
  }
  largeImage = event.target.dataset.image;
  instance = basicLightbox.create(`
    <div class="modal">
        <img class="large" src="${largeImage}" alt="">
    </div>`);

  instance.show();
});

const observer = new IntersectionObserver(
  async (entries) => {
    if (entries[0].isIntersecting && search.length > 0) {
      page++;
      try {
        const res = await getImages(search, page, limit);
        if (!res.hits || res.hits.length === 0) {
          observer.unobserve(elemRef);
          return;
        }
        renderImages(res.hits, listRef);
        const totalPages = Math.ceil(res.totalHits / limit);
        if (page >= totalPages) {
          observer.unobserve(elemRef);
          notifyError({
            text: "Вибачте, але ви досягли кінця результатів пошуку.",
            delay: 2000,
            stack: myStack,
          });
        }
      } catch (error) {
        console.error("Помилка завантаження додаткових зображень:", error);
      }
    }
  },
  { rootMargin: "100px" },
);

inputRef.addEventListener("input", async (evt) => {
  search = evt.target.value.trim();
  observer.unobserve(elemRef);
  listRef.innerHTML = "";
  page = 1;
  if (!search) return;
  try {
    const res = await getImages(search, page, limit);
    if (!res.hits || res.hits.length === 0) {
      notifyError({
        text: "Не знайдено зображень, що відповідають вашому пошуковому запиту. Будь ласка, спробуйте інше слово!",
        delay: 2000,
        stack: myStack,
      });
      return;
    }
    notifySuccess({
      text: `Ура! Ми знайшли ${res.totalHits} зображень.`,
      delay: 2000,
      stack: myStack,
    });
    renderImages(res.hits, listRef);
    const totalPages = Math.ceil(res.totalHits / limit);
    if (page < totalPages) {
      observer.observe(elemRef);
    }
  } catch (error) {
    console.error("Помилка в обробнику вводу:", error);
  }
});
