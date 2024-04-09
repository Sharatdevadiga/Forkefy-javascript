import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultsPerPage
    );
    const curPage = this._data.page;

    // page 1, and there are other pages
    if (curPage === 1) {
      return this._generateMarkUpNextpgBtn(curPage);
    }

    // other page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkUpPrevpgBtn(curPage);
    }
    // last page
    if (curPage < numPages) {
      return (
        this._generateMarkUpPrevpgBtn(curPage) +
        this._generateMarkUpNextpgBtn(curPage)
      );
    }

    // page 1, and there are no other pages
    if (curPage === 1 && numPages === 1) return '';
  }
  _generateMarkUpNextpgBtn(page) {
    return `
        <button class="btn--inline pagination__btn--next" data-goto="${
          page + 1
        }">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${page}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
  }
  _generateMarkUpPrevpgBtn(page) {
    return `
        <button class="btn--inline pagination__btn--prev" data-goto="${
          page - 1
        }">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page - 1}</span>
          </button>
        `;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }
}

export default new PaginationView();
