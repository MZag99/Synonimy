/* eslint-disable no-async-promise-executor */
export interface IGroupObject {
    searchWord: IWordObject;
    synonyms: IWordObject[];
}

export interface IWordObject {
    word: string;
    adjective?: string;
}

export let dataInstance: DataHandler;

export default class DataHandler {
    public groupArray: IGroupObject[];
    public results: IGroupObject[];
    private dataString: string;

    constructor() {
        this.groupArray = [];
        dataInstance = this;

        console.log('new data handler!');

        this.init();
    }



    private init = async (): Promise<void> => new Promise(async (resolve, reject) => {
        await this.loadData();
        await this.formatData();

        const e = new Event('textdataloaded');

        setTimeout(() => window.dispatchEvent(e), 100);

        resolve();
    });



    private loadData = async (): Promise<void> => new Promise(async (resolve, reject) => {
        try {
            fetch('/public/data.txt')
                .then(response => response.text())
                .then(data => {
                    this.dataString = data;

                    resolve();
                });
        } catch (err) {
            console.error(err);
        }
    });



    private formatData = async (): Promise<void> => {
        if (!this.dataString) {
            console.error('Unable to format data!');
            return;
        }

        const splitString = this.dataString.split('\n');

        splitString.forEach(item => {
            const splitItem = item.split(';');
            const objectArray = splitItem.map(el => {
                // CHECK FOR ADJECTIVE
                if (el.includes('(') && el.includes(')')) {
                    return {
                        word: el.replace(/ *\([^)]*\) */g, ''),
                        // @ts-ignore
                        adjective: el.split('(').pop().split(')')[0]
                    };
                }
                return { word: el };

            });

            objectArray.forEach(obj => {
                const groupObject = {
                    searchWord: obj,
                    synonyms: objectArray.filter(objectElem => objectElem !== obj)
                };

                this.groupArray.push(groupObject);
            });
        });
    };
}
