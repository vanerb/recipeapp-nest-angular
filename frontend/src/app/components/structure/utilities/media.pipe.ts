import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../../environments/environment';

// Las subidas viven en la API; las imágenes del seed y las de la demo ya son rutas completas
@Pipe({ name: 'media' })
export class MediaPipe implements PipeTransform {
  transform(url: string | null | undefined): string {
    if (!url) {
      return 'assets/no-image.jpg';
    }
    return url.startsWith('/uploads/') ? `${environment.apiUrl}${url}` : url;
  }
}
