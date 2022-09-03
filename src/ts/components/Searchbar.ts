import Router from '../Router';
import { routerInstance } from '../Main';
import DataHandler, { IGroupObject, dataInstance } from '../DataHandler';

export class Searchbar {
    public results: IGroupObject[];

    private filteredTemp: string[];
    private searchIcon: HTMLElement;
    private searchInput: HTMLInputElement;
    private searchDropdown: HTMLElement;
    private searchList: HTMLUListElement;
    private isError: boolean;
    private isFocused: boolean;

    constructor(protected view) {
        this.view = view;

        this.init();
    }

    private init = async (): Promise<void> => {
        this.filteredTemp = [];

        this.getElems();
        this.bind();
    };

    private getElems = (): void => {
        this.searchIcon = this.view.querySelector('.js-search');
        this.searchInput = this.view.querySelector('.js-search-input');
        this.searchDropdown = this.view.querySelector('.js-search-dropdown');
        this.searchList = this.view.querySelector('.js-search-list');
    };

    private bind = (): void => {
        this.searchInput.addEventListener('focus', this.handleFocus);
        this.searchInput.addEventListener('blur', this.handleFocus);
        this.searchInput.addEventListener('input', this.handleChange);

        this.searchIcon.addEventListener('click', this.handleSearch);
    };

    private handleSearch = (e: PointerEvent): void => {
        if (!this.searchInput.value) {
            this.searchInput.classList.add('error');
            this.isError = true;
            return;
        }

        const target = e.target as HTMLElement;
        const isLink = target.dataset.link !== undefined;

        const searchPhrase = isLink ? target.innerText : this.searchInput.value;

        this.results = Searchbar.filterSynonyms(searchPhrase);

        dataInstance.results = this.results;
        routerInstance.itemRoute(isLink ? target : this.searchInput.value);
    };

    /**
     * Filters synonyms from DataHandler instance
     * groupArray property based on a
     * given searchphrase.
     *
     * */
    public static filterSynonyms = (arg: string): IGroupObject[] => {
        const dataObj = dataInstance as DataHandler;

        return dataObj.groupArray.filter((el) => el.searchWord.word === arg);
    };

    private handleChange = (): void => {
        this.toggleDropdown();
        this.searchList.innerHTML = '';

        const searchPhrase = this.searchInput.value;
        const dataObj = dataInstance as DataHandler;

        this.filteredTemp = dataObj.groupArray
            .filter((el) =>
                el.searchWord.word
                    .toLowerCase()
                    .startsWith(searchPhrase.toLowerCase())
            )
            .map((el) => el.searchWord.word);

        this.filteredTemp.forEach((el) => {
            const childrenArray = Array.from(
                this.searchList.children
            ) as HTMLElement[];

            if (
                childrenArray.length > 5 ||
                childrenArray.some((item) => item.innerText === el)
            ) {
                return;
            }

            const liEl = document.createElement('li');
            liEl.dataset.link = 'true';
            liEl.innerText = el;
            liEl.addEventListener('click', (e) => {
                this.handleSearch(e as PointerEvent);
            });
            this.searchList.appendChild(liEl);
        });

        if (!this.filteredTemp.length) {
            this.toggleDropdown(true);
        }
    };

    private toggleDropdown = (hide?: boolean): void => {
        if (!this.searchInput.value || hide) {
            this.searchDropdown.style.display = 'none';
        } else {
            this.searchDropdown.style.display = 'block';
        }
    };

    private handleFocus = (): void => {
        if (!this.isFocused) {
            this.view.classList.add('is-focused');
            this.isFocused = true;
            this.removeError();

            this.toggleDropdown();
        } else {
            setTimeout(() => {
                this.view.classList.remove('is-focused');
                this.isFocused = false;

                this.toggleDropdown(true);
            }, 200);
        }
    };

    private removeError = (): void => {
        if (!this.isError) {
            return;
        }

        this.isError = false;
        this.searchInput.classList.remove('error');
    };
}
