/* eslint-disable no-return-assign */
export class Hamburger {

    private toggleBtn: HTMLElement;
    private isOpen: boolean = false;

    constructor(protected view: HTMLElement) {
        this.view = view;

        this.init();
    }



    private init = (): void => {

        this.getElems();
        this.bind();
    };



    private bind = (): void => {
        this.toggleBtn.addEventListener('click', this.toggle);
        window.addEventListener('click', (e: PointerEvent) => {
            const target = e.target as HTMLElement;

            if (this.isOpen && target !== this.toggleBtn) {
                this.toggle(e, false);
            }
        });
    };



    private toggle = (e: Event, show?: boolean): void => {
        const duration = 0.3;

        document.body.classList.toggle('is-menu-open', show);

        setTimeout(() => this.isOpen = !this.isOpen, duration * 1000);
    };



    private getElems = (): void => {
        this.toggleBtn = this.view.querySelector('.js-hamburger-toggle')!;
    };
}
