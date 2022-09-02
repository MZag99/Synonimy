import Scroll from './Scroll';
import Components from './Components';
import Router from './Router';
import { WordView } from './components/WordView';

export let routerInstance;
export let wordViewInstance;

export class Main {
    private text: string;
    private scroll: Scroll;
    private components: Components;
    private router: Router;

    constructor() {
        this.text = 'Page script initialized!';
    }

    public init = (): void => {
        console.log(this.text);

        this.scroll = new Scroll();
        this.components = new Components();
        this.router = new Router({
            '/': '/index.html',
            '/about': '/about.html',
            '/info': '/info.html',
            '/kontakt': '/contact.html',
            '/synonim': '/view.html',
            404: '/404.html'
        });

        routerInstance = this.router;
        wordViewInstance = new WordView();
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new Main();
    page.init();
});
