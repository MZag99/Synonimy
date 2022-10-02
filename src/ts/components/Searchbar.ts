/* eslint-disable no-plusplus */
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
    private selectIndex: number = 0;

    constructor(protected view) {
        this.view = view;

        this.init();
    }



    /**
     * Filters synonyms from DataHandler instance
     * groupArray property based on a
     * given searchphrase.
     * */
    public static filterSynonyms = (arg: string): IGroupObject[] => {
        const dataObj = dataInstance as DataHandler;

        return dataObj.groupArray.filter(el => el.searchWord.word === arg);
    };



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
        this.view.addEventListener('keydown', this.handleKeyboard);

        this.searchIcon.addEventListener('click', this.handleSearch);

        this.overrideEnter();
    };



    private handleSearch = (e?: PointerEvent, el?: HTMLElement): void => {
        if (!this.searchInput.value) {
            this.searchInput.classList.add('error');
            this.isError = true;
            return;
        }

        const target = el || e.target as HTMLElement;
        const isLink = target.dataset.link !== undefined;

        const searchPhrase = isLink ? target.innerText : this.searchInput.value;

        this.results = Searchbar.filterSynonyms(searchPhrase);

        dataInstance.results = this.results;
        routerInstance.itemRoute(isLink ? target : this.searchInput.value);
    };



    private handleKeyboard = (e: KeyboardEvent): void => {

        if (!this.searchInput.value) {
            return;
        }

        const els = [...this.searchList.children];
        const prevSelected = els[this.selectIndex - 1] as HTMLElement;

        switch (e.keyCode) {
            case 40:
                if (this.selectIndex < els.length) {
                    this.selectIndex++;
                } else {
                    this.selectIndex = 1;
                }
                break;
            case 38:
                if (this.selectIndex === 1) {
                    this.selectIndex = els.length;
                } else {
                    this.selectIndex--;
                }
                break;
            case 27:
                this.toggleDropdown(true);
                return;
            case 13:
                this.handleSearch(null, prevSelected);
                break;
            default:
                return;
        }

        const selected = els[this.selectIndex - 1] as HTMLElement;

        els.forEach(el => el.classList.remove('is-selected'));
        this.searchInput.value = selected?.innerText;

        selected?.classList.add('is-selected');
    };



    private removeSelection = ():void => {
        const els = [...this.searchList.children];
        els.forEach(el => el.classList.remove('is-selected'));

        this.selectIndex = 0;
    };


    /**
    * Overrides enter button on input element.
    */
    private overrideEnter = (): void => {
        this.searchInput.onclick = () => {
            const el = this.searchInput;
            el.addEventListener('keypress', e => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                }
            });
        };
    };



    private handleChange = (): void => {
        this.toggleDropdown();
        this.searchList.innerHTML = '';

        const searchPhrase = this.searchInput.value;
        const dataObj = dataInstance as DataHandler;

        this.filteredTemp = dataObj.groupArray
            .filter(el => el.searchWord.word
                .toLowerCase()
                .startsWith(searchPhrase.toLowerCase()))
            .map(el => el.searchWord.word);

        this.filteredTemp.forEach(el => {
            const childrenArray = Array.from(
                this.searchList.children
            ) as HTMLElement[];

            if (
                childrenArray.length > 5
                || childrenArray.some(item => item.innerText === el)
            ) {
                return;
            }

            const liEl = document.createElement('li');
            liEl.dataset.link = 'true';
            liEl.innerText = el;
            liEl.addEventListener('click', e => {
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
            this.removeSelection();
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

