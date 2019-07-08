import { DOMObserver } from "../utils/observer";

export class FishSpinnerModule {
  public constructor(
    private observer: DOMObserver,
  ) { }

  public init() {
    this.observer.addParser(node => {
      const element = node as HTMLElement;
      let spinner = element.querySelector<HTMLImageElement>('img[src="//cdn-chat.sstatic.net/chat/img/ajax-loader.gif"]');
      if (spinner && spinner.getAttribute('src') === '//cdn-chat.sstatic.net/chat/img/ajax-loader.gif') {
        spinner.src = 'data:image/gif;base64,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';
      }
    }, '.user-container .message .ob-image')
  }
}