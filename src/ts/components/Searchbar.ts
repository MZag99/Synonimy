import Router from '../Router';
import { routerInstance } from '../Main';

interface IWordObject {
    word: string;
    adjective?: string;
}

interface IGroupObject {
    searchWord: IWordObject;
    synonyms: IWordObject[];
}

export class Searchbar {
    public groupArray: IGroupObject[];

    private filteredTemp: string[];
    private dataString: string;
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
        this.groupArray = [];
        this.filteredTemp = [];

        await this.loadData();
        this.formatData();

        this.getElems();
        this.bind();
    };

    private loadData = async (): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            try {
                fetch('public/data.txt')
                    .then((response) => response.text())
                    .then((data) => {
                        this.dataString = data;
                        resolve();
                    });
            } catch (err) {
                console.error(err);
            }
        });
    };

    private formatData = (): void => {
        if (!this.dataString) {
            console.error('Unable to format data!');
            return;
        }

        const splitString = this.dataString.split('\n');

        splitString.forEach((item) => {
            const splitItem = item.split(';');
            const objectArray = splitItem.map((el) => {
                // CHECK FOR ADJECTIVE
                if (el.includes('(') && el.includes(')')) {
                    return {
                        word: el.replace(/ *\([^)]*\) */g, ''),
                        adjective: el.split('(').pop().split(')')[0]
                    };
                } else {
                    return {
                        word: el
                    };
                }
            });

            const groupObject = {
                searchWord: objectArray[0],
                synonyms: objectArray.slice(1)
            };

            this.groupArray.push(groupObject);
        });
        console.log(this.groupArray);
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

    private handleSearch = (): void => {
        if (!this.searchInput.value) {
            this.searchInput.classList.add('error');
            this.isError = true;
        }

        const searchPhrase = this.searchInput.value;

        const results = this.groupArray.filter(
            (el) => el.searchWord.word === searchPhrase
        );

        console.log(results);
    };

    private handleChange = (): void => {
        this.toggleDropdown();
        this.searchList.innerHTML = '';

        const searchPhrase = this.searchInput.value;

        this.filteredTemp = this.groupArray
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
            liEl.innerText = el;
            liEl.addEventListener('click', () => {
                console.log('sraka');
                routerInstance.itemRoute(liEl);
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
