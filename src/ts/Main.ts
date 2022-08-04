import Scroll from './Scroll';
import Components from './Components';

export class Main {
    private text: string;
    private scroll: Scroll;
    private components: Components;

    constructor() {
        this.text = 'Page script initialized!';
    }

    public init = (): void => {
        console.log(this.text);

        this.scroll = new Scroll();
        this.components = new Components();
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new Main();
    page.init();
});
