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

        if (window.location.pathname !== '/') {
            this.handleLocation();
        }
    }

    private bind = (): void => {
        (window as any).onpopstate = this.handleLocation;
        (window as any).route = this.route;
    };

    public itemRoute = (arg: HTMLElement | string): void => {
        window.history.pushState({}, '', '/synonim');
        window.location.hash = `${
            typeof arg === 'string' ? arg : arg.innerText
        }`;

        this.handleLocation();
    };

    public route = (e: PointerEvent): void => {
        const event = e || window.event;
        const target = event.target as HTMLAnchorElement;

        event.preventDefault();
        window.history.pushState({}, '', target.href);

        if (window.location.pathname === '/') {
            location.reload();
            return;
        }

        this.handleLocation();
    };

    public handleLocation = async (): Promise<void> => {
        const path = window.location.pathname;
        const route = this.routes[path] || this.routes[404];
        const html = await fetch(route).then((data) => data.text());

        this.page.innerHTML = html;

        if (route === '/view.html') {
            const e = new Event('wordviewactive');

            window.dispatchEvent(e);
        }
    };
}
