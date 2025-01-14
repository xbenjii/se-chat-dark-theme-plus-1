import { DOMObserver } from "../utils/observer";

const FALSE = 'false';
const TRUE = 'true';
const lblOpen = '▼ show ';
const lblClose = '▲ hide ';


export class CollapseOneboxModule {
  public constructor(
    private observer: DOMObserver,
    private settings: { collapseOneboxDefault: boolean, pauseYoutubeOnCollapse: boolean },
  ) { }

  private collapseOnebox = (node: Node) => {
    const element = node as HTMLElement;
    const autoCollapse = this.settings.collapseOneboxDefault;
    const pauseYoutubeOnCollapse = this.settings.pauseYoutubeOnCollapse;
    if (!element.classList || !element.classList.contains('message') || element.classList.contains('pending')) return;
    const ob = element.querySelector<HTMLDivElement | HTMLIFrameElement>('.onebox,.youtube-onebox');
    const tb = element.querySelector<HTMLDivElement>('.toggle-bar-dark-theme');
    if (!ob || tb) return; // exit if not found
    const container = ob.parentNode!;
    const toggleBar = document.createElement('div');
    toggleBar.classList.add('toggle-bar-dark-theme');
    toggleBar.dataset.isOpen = autoCollapse ? TRUE : FALSE;
    const link = ob.querySelector<HTMLAnchorElement | HTMLIFrameElement>('a,iframe');
    let anchor = '';
    // TODO: The following is not working because of collisions with the InlineYoutubeModule
    // if (link) {
    //   anchor += ` <a href="${link.href}" target="_blank" title="${link.href}">${prettyLink(link.href)}</a>`
    // }
    toggleBar.innerHTML = (autoCollapse ? lblOpen : lblClose) + anchor;
    toggleBar.addEventListener('click', function (event) {
      if (event.target !== this) return;
      const { isOpen } = this.dataset;
      this.dataset.isOpen = isOpen === TRUE ? FALSE : TRUE;
      this.innerHTML = (isOpen === TRUE ? lblClose : lblOpen) + anchor;
      (this.nextElementSibling as HTMLElement).hidden = isOpen === FALSE;
      const youtube = container.querySelector<HTMLIFrameElement>('iframe.youtube-onebox');
      if (youtube && pauseYoutubeOnCollapse) {
        const { contentWindow } = youtube;
        if (!contentWindow) { return; }
        const func = isOpen === FALSE ? 'pauseVideo' : 'playVideo';
        contentWindow.postMessage(`{"event":"command","func":"${func}","args":""}`, '*');
      }
    });
    ob.hidden = autoCollapse;
    container.insertBefore(toggleBar, ob);
  }

  public init() {
    this.observer.addParser(this.collapseOnebox, '.user-container .message');
  }
}