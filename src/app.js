import { getImages, renderImages } from "./js/getImages.js";
import { error as notifyError, success as notifySuccess } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const listRef = document.querySelector(".gallery");
const inputRef = document.querySelector("input");
const elemRef = document.querySelector(".elem");

let page = 1;
let search = "";
const limit = 12;

inputRef.addEventListener("input", async (evt) => {
  search = evt.target.value.trim();
  listRef.innerHTML = "";
  page = 1;

  if (!search) return;

  try {
    const res = await getImages(search, page, limit);
    
    if (!res.hits || res.hits.length === 0) {
      notifyError({
        text: "Не знайдено зображень, що відповідають вашому пошуковому запиту. Будь ласка, спробуйте інше слово!",
        delay: 2000,
      });
      return;
    }

    notifySuccess({
      text: `Ура! Ми знайшли ${res.totalHits} зображень.`,
      delay: 2000,
    });

    renderImages(res.hits, listRef);
    
    if (page >= Math.ceil(res.totalHits / limit)) {
      observer.unobserve(elemRef);
    } else {
      observer.observe(elemRef);
    }
  } catch (error) {
    console.error("Помилка в обробнику вводу:", error);
  }
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
          });
        }
      } catch (error) {
        console.error("Помилка завантаження додаткових зображень:", error);
      }
    }
  },
  { rootMargin: "100px" }
);

observer.observe(elemRef);