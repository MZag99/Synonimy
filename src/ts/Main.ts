import Scroll from './Scroll';
import Components from './Components';
import Router from './Router';
import { WordView } from './components/WordView';
import DataHandler from './DataHandler';

export let routerInstance: Router;
export let wordViewInstance: WordView;

export class Main {
    private text: string;
    private scroll: Scroll;
    private components: Components;
    private router: Router;
    private dataHandler: DataHandler;

    constructor() {
        this.text = 'Page script initialized!';
    }



    public init = (): void => {

        this.dataHandler = new DataHandler();
        this.scroll = new Scroll();
        this.components = new Components();
        this.router = new Router({
            '/': '/index.html',
            '/about': '/about.html',
            '/info': '/info.html',
            '/kontakt': '/contact.html',
            '/synonim': '/view.html',
            '404': '/404.html'
        });

        routerInstance = this.router;
        wordViewInstance = new WordView();

        window.addEventListener('pagechange', this.handleChange);
        window.addEventListener('textdataloaded', this.toggleLoader);
    };



    private handleChange = (): void => {
        document.body.classList.remove('no-word-error');
        this.components.refresh();
    };



    private toggleLoader = (): void => {
        document.body.classList.add('is-loaded');
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const page = new Main();
    page.init();
});
