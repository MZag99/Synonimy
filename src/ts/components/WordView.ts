import { dataInstance, IGroupObject, IWordObject } from '../DataHandler';
import { Searchbar } from './Searchbar';
import Utils from '../Utils';

export class WordView {
    private view: HTMLElement;
    private word: HTMLHeadingElement;
    private list: HTMLUListElement;
    private results: IGroupObject[];
    private synonyms: IWordObject[] = [];

    constructor() {
        this.view = document.getElementById('page');
        this.bindInit();
    }

    public update = async (): Promise<void> => {
        this.getElems();

        const url = new URL(window.location.href);
        const hash = decodeURIComponent(url.hash).replace('#', '');

        if (!(await this.checkInclusion(hash))) {
            document.body.classList.add('no-word-error');
        }

        this.word.innerText = hash;

        if (!dataInstance.results) {
            this.results = Searchbar.filterSynonyms(this.word.innerText);
        } else {
            this.results = dataInstance.results;
        }

        this.getSynonyms();
        this.populateList();
    };

    private checkInclusion = async (arg: string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            if (
                dataInstance.groupArray.filter(
                    (el) => el.searchWord.word === arg
                ).length > 0
            ) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    };

    private getSynonyms = (): void => {
        const tempWordArr = [].concat.apply(
            [],
            this.results.map((el) => el.synonyms)
        ) as IWordObject[];

        tempWordArr.forEach((el) => {
            if (!Utils.isArrayRedundant(this.synonyms, el, 'word')) {
                this.synonyms.push(el);
            }
        });
    };

    private populateList = (): void => {
        this.synonyms.forEach((el) => {
            const liEl = document.createElement('li');
            liEl.innerHTML = el.word;

            if (el.adjective) {
                const span = document.createElement('span');
                span.innerText = ` (${el.adjective})`;

                liEl.innerHTML += span.innerHTML;
            }

            this.list.appendChild(liEl);
        });
    };

    private bindInit = (): void => {
        window.addEventListener('wordviewactive', () => {
            if (!dataInstance.results) {
                setTimeout(() => this.update(), 100);
            } else {
                this.update();
            }
        });
    };

    private getElems = (): void => {
        this.word = document.querySelector('.js-word-title');
        this.list = document.querySelector('.js-synonym-list');
    };
}
