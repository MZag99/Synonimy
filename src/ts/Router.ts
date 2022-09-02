interface IRoutesObject {
    key: string;
}

export default class Router {
    public routes: IRoutesObject;
    private page: HTMLElement;

    constructor(options?) {
        this.routes = options;

        this.page = document.querySelector('#page')!;
        this.bind();
        this.handleLocation();
    }

    private bind = (): void => {
        window.onpopstate = this.handleLocation;
    };

    public itemRoute = (arg: HTMLElement): void => {
        window.history.pushState({}, '', '/synonim');
        window.location.search = `word=${arg.innerText}`;

        this.handleLocation();
    };

    public route = (e: PointerEvent): void => {
        const event = e || window.event;
        const target = event.target as HTMLAnchorElement;

        event.preventDefault();
        window.history.pushState({}, '', target.href);
        this.handleLocation();
    };

    public handleLocation = async () => {
        if (window.location.pathname === '/') {
            return;
        }

        const path = window.location.pathname;
        const route = this.routes[path] || this.routes[404];
        const html = await fetch(route).then((data) => data.text());

        this.page.innerHTML = html;
    };
}
