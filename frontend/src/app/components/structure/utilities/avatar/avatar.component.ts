import { Component, Input } from '@angular/core';

// Tonos oscuros: las iniciales claras mantienen buen contraste
const TONES = ['#14573A', '#BF3B25', '#7A4B14', '#1E5C63', '#6B3A5C', '#3F5B2A'];

@Component({
  selector: 'app-avatar',
  template: `
    <img
      *ngIf="user?.avatar; else initials"
      [src]="user?.avatar | media"
      [alt]="user?.name"
      class="rounded-full object-cover"
      [style.width.px]="size"
      [style.height.px]="size"
    />
    <ng-template #initials>
      <span
        class="inline-flex select-none items-center justify-center rounded-full font-medium text-paper"
        [style.width.px]="size"
        [style.height.px]="size"
        [style.fontSize.px]="size * 0.38"
        [style.backgroundColor]="tone"
        [attr.aria-label]="user?.name"
        role="img"
        >{{ letters }}</span
      >
    </ng-template>
  `,
  host: { class: 'inline-flex shrink-0' },
})
export class AvatarComponent {
  @Input() user: { name: string; avatar: string | null } | null = null;
  @Input() size = 40;

  get letters(): string {
    const words = (this.user?.name ?? '').trim().split(/\s+/);
    return words
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  }

  get tone(): string {
    const name = this.user?.name ?? '';
    const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return TONES[hash % TONES.length];
  }
}
