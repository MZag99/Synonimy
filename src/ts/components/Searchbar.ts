import * as fs from 'fs';

interface IGroupObject {
    word: string;
    synonyms: string[];
}

export class Searchbar {
    public groupArray: IGroupObject;

    private dataString: string;

    constructor(protected view) {
        this.init();
    }

    private init = async (): Promise<void> => {
        await this.loadData();
        console.log('Data loaded!');
        this.formatData();
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
                console.log(err);
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

            console.log(objectArray);
        });
    };
}
