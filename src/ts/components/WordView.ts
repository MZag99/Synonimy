/* eslint-disable no-return-assign */
import { dataInstance, IGroupObject, IWordObject } from '../DataHandler';
import { Searchbar } from './Searchbar';
import { routerInstance } from '../Main';
import Utils from '../Utils';

export class WordView {
    private view: HTMLElement;
    private word: HTMLHeadingElement[];
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
        const pathname = url.pathname.replace('/synonim', '');
        const word = decodeURIComponent(pathname).replace('/', '');

        if (!(await this.checkInclusion(word.toLowerCase()))) {
            document.body.classList.add('no-word-error');
        }

        this.word.forEach(el => el.innerText = `"${word}"`);

        this.results = Searchbar.filterSynonyms(word.toLowerCase());

        this.getSynonyms();
        await this.populateList();
        this.overrideLinks();

        document.body.classList.add('is-loaded');
    };



    private overrideLinks = (): void => {
        const links = [...this.list.querySelectorAll('a[href]')];

        links.forEach((el:HTMLAnchorElement) => {
            el.onclick = e => {
                e.preventDefault();
                document.body.classList.remove('is-loaded');
                // Override links behaviour here:
                const target = e.target as HTMLElement;
                const searchPhrase = target.innerText;
                const fSearchPhrase = searchPhrase.replace(/ *\([^)]*\) */g, '');

                this.clearList();
                routerInstance.itemRoute(fSearchPhrase);
            };
        });
    };



    private checkInclusion = async (arg: string): Promise<boolean> => new Promise((resolve, reject) => {
        if (
            dataInstance.groupArray.filter(
                el => el.searchWord.word === arg
            ).length > 0
        ) {
            resolve(true);
        } else {
            resolve(false);
        }
    });



    private getSynonyms = (): void => {
        const tempWordArr = [].concat.apply(
            [],
            this.results.map(el => el.synonyms)
        ) as IWordObject[];

        tempWordArr.forEach(el => {
            if (!Utils.isArrayRedundant(this.synonyms, el, 'word')) {
                this.synonyms.push(el);
            }
        });
    };



    private clearList = (): void => {
        this.list.innerHTML = '';
        this.synonyms = [];
    };



    private populateList = async (): Promise<void> => new Promise((resolve, reject) => {
        this.synonyms.forEach(el => {
            const liEl = document.createElement('li');
            liEl.innerHTML = '<span style="font-size:25px; margin-right:5px">&#8226;</span>';
            const a = document.createElement('a');
            a.innerHTML = el.word;
            a.href = `/synonim/${el.word}`;

            if (el.adjective) {
                const span = document.createElement('span');
                span.innerText = ` (${el.adjective})`;

                a.innerHTML += span.innerHTML;
            }

            a.onclick = e => {
                e.preventDefault();

                const value = a.innerText.replace(/ *\([^)]*\) */g, '');
                routerInstance.itemRoute(value);
                this.update();
            };

            liEl.appendChild(a);
            this.list.appendChild(liEl);
        });

        setTimeout(() => resolve(), 200);
    });



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
        this.word = [...document.querySelectorAll('.js-word-title')] as HTMLHeadingElement[];
        this.list = document.querySelector('.js-synonym-list');
    };
}
