import { Injectable } from '@angular/core';
import { OverlayService } from '../../../services/overlay.service';
import { NotaVentaComponent } from '../../../views/ObjectComponents/DocumentosTransaccion/NotaVenta/NotaVenta.component';

@Injectable({
  providedIn: 'root'
})
export class NotaVentaService {

    openNotaVentaComponent( overlayService: OverlayService )
    {
        return overlayService.open( NotaVentaComponent );
    }
}
