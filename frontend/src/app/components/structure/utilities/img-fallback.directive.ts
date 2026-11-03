import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({ selector: 'img[appImgFallback]' })
export class ImgFallbackDirective {
  constructor(private readonly el: ElementRef<HTMLImageElement>) {}

  @HostListener('error')
  onError() {
    const fallback = 'assets/no-image.jpg';
    if (!this.el.nativeElement.src.endsWith(fallback)) {
      this.el.nativeElement.src = fallback;
    }
  }
}
