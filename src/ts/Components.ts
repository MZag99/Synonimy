//ADD COMPONENT IMPORTS HERE
import { classesMapping } from './components/All';

export default class Components {
    private elements: HTMLElement[];

    constructor() {
        this.init();
    }

    private init = (): void => {
        this.elements = Array.from(
            document.querySelectorAll('[data-component]')
        );

        this.elements.forEach((el) => {
            const c = el.dataset.component!;

            if (classesMapping[c]) {
                new classesMapping[c](el);
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
