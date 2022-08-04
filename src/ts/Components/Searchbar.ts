// const { promises: fsPromises } = require('fs');

export class Searchbar {
    constructor(protected view) {
        this.init();
    }

    private init = async (): Promise<void> => {
        await this.loadData();
        console.log('data loaded!');
    };

    private loadData = async (): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            const filename = '../media/data.txt';

            try {
                const contents = await fsPromises.readFile(filename, 'utf-8');

                const arr = contents.split(/\r?\n/);

                console.log(arr);

                return arr;
            } catch (err) {
                console.log(err);
            }
        });
    };
}
