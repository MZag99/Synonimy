// ADD COMPONENT IMPORTS HERE
import { classesMapping } from './components/All';

export default class Components {
    private elements: HTMLElement[];
    private components: any[] = [];

    constructor() {
        this.init();
    }

    public refresh = (): void => {
        this.components = [];
        this.init(true);
    };

    private init = (refresh?: boolean): void => {
        this.elements = Array.from(
            document.querySelectorAll('[data-component]')
        );

        this.elements.forEach(el => {
            const c = el.dataset.component!;

            if (classesMapping[c]) {
                if (refresh && !!el.dataset.noreload) {
                    return;
                }
                console.log('creating new: ', c);
                this.components.push(new classesMapping[c](el));
            } else {
                console.warn(
                    'THERE IS NO SUCH COMPONENT:',
                    c,
                    '- CHECK "All.ts" AND MAKE SURE YOU INCLUDED IT.'
                );
            }
        });
    };
}
