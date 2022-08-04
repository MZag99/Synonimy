import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface IParallaxItem {
    el: Element,
    value: number;
}

interface IScrollCacheObject {
    parallaxes?: Array<IParallaxItem>,
    animations?: Array<IParallaxItem>;
}

export default class Scroll {

    private cache: IScrollCacheObject = {};

    constructor() {

        this.saveCache();
    }

    private saveCache = (): void => {

        // SAVE PARALLAX ELEMENTS
        const parallaxes: Array<IParallaxItem> = [];
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        for ( let element of parallaxElements ) {
            parallaxes.push(
                {
                    el: element,
                    value: parseInt(element.getAttribute('data-parallax'), 10),
                },
            );
        }

        this.cache.parallaxes = parallaxes;

        if ( this.cache.parallaxes && this.cache.parallaxes.length > 0 ) {
            for ( let item of this.cache.parallaxes ) {
                this.parallax(item.el, item.value);
            }
        }
    }



    private parallax = (element: Element, value: number ): void => {

        const itemParent = element.parentElement;

        gsap.to(element, {
        y: -value,
        ease: 'none',
        scrollTrigger: {
            trigger: itemParent,
            scrub: true,
        },
        });
    }
}
