import { Component, EventEmitter, HostBinding, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IComponent } from 'apps/client/src/app/interfaces/IComponent';
import { ComponentStore } from 'apps/client/src/app/services/ComponentStore';
import { DocumentoTransaccion, Producto, PropBehavior } from '@app/models';
import { BehaviorSubject, Subscription } from 'rxjs';
import { OverlayService } from 'apps/client/src/app/services/overlay.service';
import { ProductoService } from 'apps/client/src/app/models/ElementosEconomicos/Bien/Producto/producto.service';
import { MagnitudService } from 'apps/client/src/app/models/ElementosEconomicos/Bien/magnitud.service';
import { BienCategoriaService } from 'apps/client/src/app/models/ElementosEconomicos/Bien/bien-categoria.service';
import { BienMarcaService } from 'apps/client/src/app/models/ElementosEconomicos/Bien/bien-marca.service';
import { ModalService } from 'apps/client/src/app/services/modal.service';
import { MessageBoxComponent } from '../../../Components/MessageBox/MessageBox.component';
import { ObjectComponent, StateObjectComponent } from '../../Object/Object.component';
import { TableComponent } from '../../../CollectionComponents/Table/Table.component';
import { KardexComponent } from '../Kardex/Kardex.component';
import { TabComponent, TabItemComponent } from "../../../Components/Tab/Tab.component";

@Component({
  selector: 'app-producto',
  imports: [CommonModule, KardexComponent, TabComponent, TabItemComponent, ObjectComponent],
  templateUrl: './Producto.component.html',
  styleUrl: './Producto.component.css',
})
export class ProductoComponent implements IComponent<ProductoComponent> {

    @Input() storeProducto = new ComponentStore<Producto>( new Producto(), () => new Producto() );
    producto = new Producto();

    @Input() vm$ = new BehaviorSubject<ProductoComponentVm>({
        classesCss: ''
    })
    
    @Input() overlayService = new OverlayService();

    @HostBinding( 'class' ) hostClasses: string = '';

    @Output() readonly onInit = new EventEmitter<ProductoComponent>();
    @Output() readonly onDestroy = new EventEmitter<ProductoComponent>();
    @Output() readonly onClose = new EventEmitter<ProductoComponentEventData>();

    sub: Subscription = new Subscription();
    modalService = inject( ModalService );
    productoService = inject( ProductoService );
    magnitudService = inject( MagnitudService );
    bienCategoriaService = inject( BienCategoriaService );
    bienMarcaService = inject( BienMarcaService );


    ngOnInit(): void 
    {
        this.onInit.emit( this );

        this.sub.add( this.storeProducto.state$.subscribe( producto => {

            this.producto = producto;

        } ) );

        this.sub.add( this.storeProducto.error$.subscribe( error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error ) ) );

        this.sub.add( this.vm$.subscribe( vm => {
            this.hostClasses = vm.classesCss ?? '';
        } ) );
    }

    
    close( e: Event )
    {
        this.onClose.emit({
            event: e,
            sender: this,
            producto: this.producto
        });
        this.modalService.close( this );
    }


    // Producto
    objectComponentOnInit( c: ObjectComponent<Producto> )
    {
        c.store = this.storeProducto.storeFromThisAsync( this.producto, this.productoService.getItem( this.producto ) );

        c.vm$.next({
            title: '',
            classesCss: '',
            isCloseButtonActive: false,
            isReadButtonActive: true,
            state: StateObjectComponent.read,
            bindingProperties: [
                { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
                { title: 'Uuid', getValue: item => item.uuid, behavior: PropBehavior.string },
                { title: 'Código', getValue: item => item.codigo, behavior: PropBehavior.string },
                { title: 'Nombre', getValue: item => item.nombre, setValue: ( item, value ) => item.set({ nombre: value }), required: true, behavior: PropBehavior.string },
                { title: 'Magnitud', getValue: item => item.magnitud?.nombre, setValue: ( item, value ) => item.set({ magnitud: value }), required: true, behavior: PropBehavior.model, onClick: item => {
                    this.magnitudService.openTableComponent2selectItem().subscribe( tc => {
                        
                        tc.sub.add( tc.store.state$.subscribe( () => 
                            item.magnitud
                            ? tc.setDataChecked([ item.magnitud ])
                            : undefined
                        ) );

                        tc.sub.add( tc.onSelectItem.subscribe( e => {
                            c.store.setState( magnitud => new Producto({
                                ...magnitud,
                                magnitud: e.item
                            }) )
                        } ) );

                        tc.sub.add( tc.onResetItem.subscribe( e => {
                            c.store.setState( magnitud => new Producto({
                                ...magnitud,
                                magnitud: e.item
                            }) )
                        }) );

                    } );
                } },
                { title: 'Marca', getValue: item => item.bienMarca?.nombre, setValue: ( item, value ) => item.set({ bienMarca: value }), required: true, behavior: PropBehavior.model, onClick: item => {
                    this.bienMarcaService.openTableComponent2selectItem().subscribe( tc => {
                        
                        tc.sub.add( tc.store.state$.subscribe( () => 
                            item.bienMarca
                            ? tc.setDataChecked([ item.bienMarca ])
                            : undefined
                        ) );

                        tc.sub.add( tc.onSelectItem.subscribe( e => {
                            c.store.setState( magnitud => new Producto({
                                ...magnitud,
                                bienMarca: e.item
                            }) )
                        } ) );

                        tc.sub.add( tc.onResetItem.subscribe( e => {
                            c.store.setState( magnitud => new Producto({
                                ...magnitud,
                                bienMarca: e.item
                            }) )
                        }) );                                

                    } );
                } },
                { title: 'Categoria', getValue: item => item.bienCategoria?.nombre, setValue: ( item, value ) => item.set({ bienCategoria: value }), required: true, behavior: PropBehavior.model, onClick: item => {
                    this.bienCategoriaService.openTableComponent2selectItem().subscribe( tc => {
                        
                        tc.sub.add( tc.store.state$.subscribe( () => 
                            item.bienCategoria
                            ? tc.setDataChecked([ item.bienCategoria ])
                            : undefined
                        ) );

                        tc.sub.add( tc.onSelectItem.subscribe( e => {
                            c.store.setState( magnitud => new Producto({
                                ...magnitud,
                                bienCategoria: e.item
                            }) )
                        } ) );

                        tc.sub.add( tc.onResetItem.subscribe( e => {
                            c.store.setState( magnitud => new Producto({
                                ...magnitud,
                                bienCategoria: e.item
                            }) )
                        }) );                                

                    } );
                } },
                { title: 'Precio Uni.', getValue: item => item.precioUnitario, setValue: ( item, value ) => item.set({ precioUnitario: value }), required: true, behavior: PropBehavior.number },
                { title: 'Salida', getValue: ( item, obj ) => obj ? item.esSalida : ( item.esSalida ? 'Si' : 'No' ), setValue: ( item, value ) => item.set({ esSalida: value }), behavior: PropBehavior.boolean },
            ]
        });


        c.sub.add( c.onUpdate.subscribe( e => {

            this.productoService.updateItem( e.item ).subscribe({
                next: item => {
                    this.storeProducto.setRead( () => item )
                                    .getRead()
                                    .subscribe();

                    c.vm$.next({ ...c.vm$.value, state: StateObjectComponent.read });
                },
                error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
            })

        } ) );

        c.sub.add( c.onDelete.subscribe( e => {

            this.productoService.deleteItem( e.item ).subscribe({
                next: () => this.close( e.event ),
                error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
            })

        } ) );
    }


    // Documentos Transacción Relacionado
    kardexComponentOnInit( c: KardexComponent<Producto> )
    {
        c.storeKardex.setRead( this.productoService.kardexMetodoPromedio( this.producto ) )
                    .getRead()
                    .subscribe();

        c.vm$.next({
            title: `Kardex [ ${this.producto.nombre ?? ''} ]`,
            isCloseButtonActive: false
        });
    }


    ngOnDestroy(): void 
    {
        this.onDestroy.emit( this );
        this.storeProducto.complete();
        this.sub.unsubscribe();
    }
}


export interface ProductoComponentEventData
{
    event: Event,
    sender: ProductoComponent,
    producto: Producto
}


export interface ProductoComponentVm
{
    classesCss?: string,
}