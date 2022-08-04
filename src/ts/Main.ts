import Scroll from './Scroll';
import Components from './Components';

export class Main {
    private text: string;
    private scroll: Scroll;
    private components: Components;

    constructor() {
        this.text = 'Page script initialized!';
        this.scroll = new Scroll();
        this.components = new Components();
    }

    public init = (): void => {
        console.log(this.text);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new Main();
    page.init();
});
