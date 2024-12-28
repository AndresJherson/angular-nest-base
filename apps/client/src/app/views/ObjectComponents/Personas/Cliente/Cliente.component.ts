import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IComponent } from 'apps/client/src/app/interfaces/IComponent';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ComponentStore } from 'apps/client/src/app/services/ComponentStore';
import { Cliente } from 'apps/models/src/lib/Personas/Cliente/Cliente';
import { TabComponent, TabItemComponent } from "../../../Components/Tab/Tab.component";
import { ObjectComponent, ObjectComponentVm, StateObjectComponent } from "../../Object/Object.component";
import { StateRowTableComponent, TableComponent } from "../../../CollectionComponents/Table/Table.component";
import { ClienteService } from 'apps/client/src/app/models/Personas/Cliente/cliente.service';
import { PropBehavior } from 'apps/models/src/lib/Model';
import { ModalService } from 'apps/client/src/app/services/modal.service';
import { DocumentoIdentificacionService } from 'apps/client/src/app/models/Personas/documento-identificacion.service';
import { GeneroService } from 'apps/client/src/app/models/Personas/genero.service';
import { MessageBoxComponent } from '../../../Components/MessageBox/MessageBox.component';

@Component({
  selector: 'app-cliente',
  imports: [CommonModule, TabComponent, TabItemComponent, ObjectComponent, TableComponent],
  templateUrl: './Cliente.component.html',
  styleUrl: './Cliente.component.css',
})
export class ClienteComponent implements IComponent<ClienteComponent> {

    @Input() storeCliente = new ComponentStore<Cliente>( new Cliente(), () => new Cliente() );
    cliente = new Cliente();

    @Output() readonly onInit = new EventEmitter<ClienteComponent>();
    @Output() readonly onDestroy = new EventEmitter<ClienteComponent>();
    @Output() readonly onClose = new EventEmitter<ClienteComponentEventData>();

    sub: Subscription = new Subscription();
    clienteService = inject( ClienteService );
    documentoIdentificacionService = inject( DocumentoIdentificacionService );
    generoService = inject( GeneroService );
    modalService = inject( ModalService );

    ngOnInit(): void 
    {
        this.onInit.emit( this );

        this.sub.add( this.storeCliente.state$.subscribe( cliente => {

            this.cliente = cliente;

        } ) );

        this.sub.add( this.storeCliente.error$.subscribe( error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error ) ) );
    }

    
    close( e: Event )
    {
        this.modalService.close( this );
        this.onClose.emit({
            event: e,
            sender: this,
            cliente: this.cliente
        });
    }


    objectComponentOnInit( c: ObjectComponent<Cliente> )
    {
        c.store = this.storeCliente.storeFromThisAsync( this.cliente, this.clienteService.getItem( this.cliente ) );

        c.vm$.next({
            title: '',
            isCloseActive: false,
            state: StateObjectComponent.read,
            bindingProperties: [
                { title: 'Documento Id', getValue: item => item.documentoIdentificacion?.nombre, setValue: ( item, value ) => item.set({ documentoIdentificacion: value }), required: true, behavior: PropBehavior.model, onClick: item => {
                    this.documentoIdentificacionService.openTableComponent2selectItem().subscribe( tc => {

                        tc.sub.add( tc.store.state$.subscribe( state => 
                            item.documentoIdentificacion 
                            ? tc.setDataChecked( [item.documentoIdentificacion] ) 
                            : undefined
                        ) );

                        tc.sub.add( tc.onSelectItem.subscribe( e => {
                            c.store.setState( cliente => new Cliente({
                                ...cliente,
                                documentoIdentificacion: e.item
                            }) );
                        } ) );

                        tc.sub.add( tc.onResetItem.subscribe( e => {
                            c.store.setState( cliente => new Cliente({
                                ...cliente,
                                documentoIdentificacion: e.item
                            }) )
                        } ) );

                    } );
                } },
                { title: 'Código', getValue: item => item.codigo, setValue: ( item, value ) => item.set({ codigo: value }), required: true, behavior: PropBehavior.string },
                { title: 'Nombre', getValue: item => item.nombre, setValue: ( item, value ) => item.set({ nombre: value }), required: true, behavior: PropBehavior.string },
                { title: 'Apellido', getValue: item => item.apellido, setValue: ( item, value ) => item.set({ apellido: value }), required: true, behavior: PropBehavior.string },
                { title: 'Género', getValue: item => item.genero?.nombre, setValue: ( item, value ) => item.set({ genero: value }), required: true, behavior: PropBehavior.model, onClick: item => {
                    this.generoService.openTableComponent2selectItem().subscribe( tc => {

                        tc.sub.add( tc.store.state$.subscribe( state =>  
                            item.genero
                            ? tc.setDataChecked( [item.genero] )
                            : undefined
                        ) )

                        tc.sub.add( tc.onSelectItem.subscribe( e => {
                            c.store.setState( cliente => new Cliente({
                                ...cliente,
                                genero: e.item
                            }) )
                        } ) );

                        tc.sub.add( tc.onResetItem.subscribe( e => {
                            c.store.setState( cliente => new Cliente({
                                ...cliente,
                                genero: e.item
                            }) )
                        } ) );

                    } )
                } },
                { title: 'Celular', getValue: item => item.celular, setValue: ( item, value ) => item.set({ celular: value }), behavior: PropBehavior.number },
                { title: 'Celular Respaldo', getValue: item => item.celularRespaldo, setValue: ( item, value ) => item.set({ celularRespaldo: value }), behavior: PropBehavior.number },
            ]
        });


        c.sub.add( c.onUpdate.subscribe( e => {

            this.clienteService.updateItem( e.item ).subscribe({
                next: item => {
                    this.storeCliente.setRead( () => item )
                                    .getRead()
                                    .subscribe();

                    c.vm$.next({ ...c.vm$.value, state: StateObjectComponent.read });
                },
                error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
            })

        } ) );

        c.sub.add( c.onDelete.subscribe( e => {

            this.clienteService.deleteItem( e.item ).subscribe({
                next: () => this.close( e.event ),
                error: error => this.modalService.open( MessageBoxComponent ).subscribe( c => c.mensaje = error )
            })

        } ) );
    }


    tableComponentOnInit( c: TableComponent<Cliente> )
    {
        // get collection about relation with client
        c.store.setRead( this.clienteService.getCollection() )
                .getRead()
                .subscribe();

        c.vm$.next({
            title: 'clientes',
            isHeadActive: true,
            isCloseButtonActive: false,
            stateRow: StateRowTableComponent.select,
            bindingProperties: this.clienteService.tableBindingProperties
        });
    }


    ngOnDestroy(): void 
    {
        this.onDestroy.emit( this );
        this.storeCliente.complete();
        this.sub.unsubscribe();
    }
}


export interface ClienteComponentEventData
{
    event: Event,
    sender: ClienteComponent,
    cliente: Cliente
}