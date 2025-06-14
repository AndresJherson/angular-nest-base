import { Usuario } from "apps/models/src/lib/Personas/Usuario";
import { ComponentStore } from "./services/ComponentStore";
import { BehaviorSubject, map, Observable, of } from "rxjs";
import { Bien } from "apps/models/src/lib/ElementosEconomicos/Bien";
import { v4 } from "uuid";
import { BienMarca } from "apps/models/src/lib/ElementosEconomicos/BienMarca";
import { BienCategoria } from "apps/models/src/lib/ElementosEconomicos/BienCategoria";
import { Magnitud } from "apps/models/src/lib/ElementosEconomicos/Magnitud";
import { MagnitudTipo } from "apps/models/src/lib/ElementosEconomicos/MagnitudTipo";
import { ObjectComponent, ObjectComponentVm, StateObjectComponent } from "./views/ObjectComponents/Object/Object.component";
import { inject } from "@angular/core";
import { ModalService } from "./services/modal.service";
import { PropBehavior } from "apps/models/src/lib/Model";
import { StateRowTableComponent, TableComponent } from "./views/CollectionComponents/Table/Table.component";
import { BUTTON_CLASS_BOOTSTRAP } from "./utils/ButtonsClass";
import { ListSelectComponent } from "./views/CollectionComponents/ListSelect/ListSelect.component";

export class DataPrueba {

    modalService = inject( ModalService );

    store = new ComponentStore<Usuario[]>([],of([
        new Usuario({
            symbol: Symbol(),
            id: 1,
            nombre: "Juan Pérez",
            usuario: "juan.perez",
            contrasena: "12345",
            esActivo: true
        }),
        new Usuario({
            symbol: Symbol(),
            id: 2,
            nombre: "María López",
            usuario: "maria.lopez",
            contrasena: "contraseña123",
            esActivo: false
        }),
        new Usuario({
            symbol: Symbol(),
            id: 3,
            nombre: "Carlos Sánchez",
            usuario: "carlos.sanchez",
            contrasena: "admin2024",
            esActivo: true
        }),
        new Usuario({
            symbol: Symbol(),
            id: 4,
            nombre: "Ana García",
            usuario: "ana.garcia",
            contrasena: "pass456",
            esActivo: true
        }),
        new Usuario({
            symbol: Symbol(),
            id: 5,
            nombre: "Luis Fernández",
            usuario: "luis.fernandez",
            contrasena: "luispass789",
            esActivo: false
        }),
        new Usuario({
            symbol: Symbol(),
            id: 1,
            nombre: "Juan Pérez",
            usuario: "juan.perez",
            contrasena: "12345",
            esActivo: true
        }),
        new Usuario({
            symbol: Symbol(),
            id: 2,
            nombre: "María López",
            usuario: "maria.lopez",
            contrasena: "contraseña123",
            esActivo: false
        }),
        new Usuario({
            symbol: Symbol(),
            id: 3,
            nombre: "Carlos Sánchez",
            usuario: "carlos.sanchez",
            contrasena: "admin2024",
            esActivo: true
        }),
        new Usuario({
            symbol: Symbol(),
            id: 4,
            nombre: "Ana García",
            usuario: "ana.garcia",
            contrasena: "pass456",
            esActivo: true
        }),
        new Usuario({
            symbol: Symbol(),
            id: 5,
            nombre: "Luis Fernández",
            usuario: "luis.fernandez",
            contrasena: "luispass789",
            esActivo: false
        }),
        new Usuario({
            symbol: Symbol(),
            id: 1,
            nombre: "Juan Pérez",
            usuario: "juan.perez",
            contrasena: "12345",
            esActivo: true
        }),
        new Usuario({
            symbol: Symbol(),
            id: 2,
            nombre: "María López",
            usuario: "maria.lopez",
            contrasena: "contraseña123",
            esActivo: false
        }),
        new Usuario({
            symbol: Symbol(),
            id: 3,
            nombre: "Carlos Sánchez",
            usuario: "carlos.sanchez",
            contrasena: "admin2024",
            esActivo: true
        }),
        new Usuario({
            symbol: Symbol(),
            id: 4,
            nombre: "Ana García",
            usuario: "ana.garcia",
            contrasena: "pass456",
            esActivo: true
        }),
        new Usuario({
            symbol: Symbol(),
            id: 5,
            nombre: "Luis Fernández",
            usuario: "luis.fernandez",
            contrasena: "luispass789",
            esActivo: false
        }),
        new Usuario({
            symbol: Symbol(),
            id: 1,
            nombre: "Juan Pérez",
            usuario: "juan.perez",
            contrasena: "12345",
            esActivo: true
        }),
        new Usuario({
            symbol: Symbol(),
            id: 2,
            nombre: "María López",
            usuario: "maria.lopez",
            contrasena: "contraseña123",
            esActivo: false
        }),
        new Usuario({
            symbol: Symbol(),
            id: 3,
            nombre: "Carlos Sánchez",
            usuario: "carlos.sanchez",
            contrasena: "admin2024",
            esActivo: true
        }),
        new Usuario({
            symbol: Symbol(),
            id: 4,
            nombre: "Ana García",
            usuario: "ana.garcia",
            contrasena: "pass456",
            esActivo: true
        }),
        new Usuario({
            symbol: Symbol(),
            id: 5,
            nombre: "Luis Fernández",
            usuario: "luis.fernandez",
            contrasena: "luispass789",
            esActivo: false
        }),
    ]))

    store$ = new ComponentStore<Bien>( new Bien(), of(new Bien({
        symbol: Symbol(),
        id: 1,
        uuid: v4(),
        codigo: 'EC-00234',
        nombre: 'Pantalla LCD',
        magnitudNombre: 'uni',
        categoria: 'pantallas',
        precioUnitario: 45.50,
        bienMarca: new BienMarca({
            id: 2,
            nombre: 'LG'
        }),
        bienCategoria: new BienCategoria({
            id: 3,
            nombre: 'pantallas'
        }),
        magnitud: new Magnitud({
            id: 1,
            nombre: 'uni',
            magnitudTipo: new MagnitudTipo({
                id: 2,
                nombre: 'unidades'
            })
        })
    })));

    storeBien = this.store$.storeFromThis( state => new Bien( state ) );


    // vm$ = new BehaviorSubject<TableComponentVm<Usuario>>({
    //     title: 'Usuarios',
    //     isHeadActive: true,
    //     isCloseButtonActive: true,
    //     stateRow: StateRowTableComponent.select,
    //     dataBindingProperty: [
    //         { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
    //         { title: 'Nombre', getValue: item => item.nombre, behavior: PropBehavior.string },
    //         { title: 'Usuario', getValue: item => item.usuario, behavior: PropBehavior.string },
    //         { title: 'Contraseña', getValue: item => item.contrasena, behavior: PropBehavior.string },
    //         { title: 'Activo', getValue: item => item.esActivo ? 'Si' : 'No', behavior: PropBehavior.string }
    //     ]
    // });

    // vm$ = new BehaviorSubject<ListSelectComponentVm<Usuario>>({
    //     title: 'Usuarios',
    //     displayValue: item => item.nombre
    // });

    dataCategoria: Observable<BienCategoria[]> = of([
        new BienCategoria({
            id: 1,
            nombre: 'computadoras'
        }),
        new BienCategoria({
            id: 2,
            nombre: 'laptops'
        }),
        new BienCategoria({
            id: 3,
            nombre: 'pantallas'
        }),
        new BienCategoria({
            id: 4,
            nombre: 'mouses'
        }),
        new BienCategoria({
            id: 5,
            nombre: 'TV'
        }),
    ]).pipe( map( data => data.map( item => new BienCategoria( item ) ) ) );
 
    dataMagnitud: Observable<Magnitud[]> = of([
        new Magnitud({
            id: 1,
            nombre: 'uni',
        }),
        new Magnitud({
            id: 2,
            nombre: 'ml',
        }),
        new Magnitud({
            id: 3,
            nombre: 'L',
        }),
        new Magnitud({
            id: 4,
            nombre: 'kg',
        }),
    ]).pipe( map( data => data.map( item => new Magnitud( item ) ) ) )

    vm$ = new BehaviorSubject<ObjectComponentVm<Bien>>({
        title: 'Bienes',
        state: StateObjectComponent.read,
        bindingProperties: [
            { title: 'Id', getValue: item => item.id, readonly: true, behavior: PropBehavior.number },
            { title: 'Uuid', getValue: item => item.uuid, readonly: true, behavior: PropBehavior.string },
            { title: 'Codigo', getValue: item => item.codigo, readonly: true, behavior: PropBehavior.string },
            { title: 'Nombre', getValue: item => item.nombre, setValue: ( item, value ) => item.nombre = value, behavior: PropBehavior.string },
            { title: 'Precio Unitario', getValue: item => item.precioUnitario, setValue: ( item, value ) => item.precioUnitario = value, behavior: PropBehavior.number },
            { title: 'Marca', getValue: item => item.bienMarca?.nombre, readonly: true, behavior: PropBehavior.string },
            { 
                title: 'Categoria', 
                getValue: item => item.bienCategoria?.nombre, 
                onClick: item => {

                    this.modalService.open( TableComponent<BienCategoria> ).subscribe( c => {

                        console.log( 'prueba1', item.bienCategoria );

                        c.store.setRead( this.dataCategoria )
                            .read()
                            .subscribe();

                        c.vm$.next({
                            ...c.vm$.value,
                            bindingProperties: [
                                { title: 'Id', getValue: item => item.id, behavior: PropBehavior.number },
                                { title: 'Nombre', getValue: item => item.nombre, behavior: PropBehavior.string },
                            ],
                            stateRow: StateRowTableComponent.radioButton
                        });

                        c.buttonsFooterComponentVm$.next({
                            ...c.buttonsFooterComponentVm$.value,
                            buttonsHtml: [
                                {
                                    class: BUTTON_CLASS_BOOTSTRAP.light,
                                    title: 'Cancelar',
                                    onClick: e => c.close( e )
                                },
                                {
                                    class: BUTTON_CLASS_BOOTSTRAP.primary,
                                    title: 'Confirmar',
                                    onClick: e => {
                                        item.bienCategoria = c.getDataChecked()[ 0 ];
                                        c.close( e );
                                    }
                                },
                            ]
                        });

                        console.log( 'prueba2', item.bienCategoria );

                        c.sub.add( c.store.state$.subscribe( state => item.bienCategoria ? c.setDataChecked( [ item.bienCategoria ] ) : undefined ) );

                    } );

                },
                behavior: PropBehavior.model 
            },
            { 
                title: 'Magnitud', 
                getValue: item => item.magnitud?.nombre, 
                onClick: item => {
                  
                    this.modalService.open( ListSelectComponent<Magnitud> ).subscribe( c => {

                        c.store.setRead( this.dataMagnitud )
                            .read()
                            .subscribe();

                        c.vm$.next({
                            title: 'Magnitudes',
                            displayValue: item => item.nombre,
                        })

                        c.sub.add( c.store.state$.subscribe( state => c.setItemSelected( item.magnitud ) ) );

                        c.sub.add( c.onSelect.subscribe( e => item.magnitud = e.item ) );

                    } );
                    
                },
                behavior: PropBehavior.model 
            },
        ]
    });


        setObjectComponent( c: ObjectComponent<Bien> )
        {
    
            c.store.subscribeFrom( this.store$, state => new Bien( state ) );
    
            c.sub.add( c.onUpdate.subscribe( e => {
    
                this.store$.setState( new Bien({...e.item}) );
    
                c.vm$.next({
                    ...c.vm$.value,
                    state: StateObjectComponent.read
                });
    
            } ) );
        }
    
        setTableComponent( c: TableComponent<Usuario> )
        {
            c.buttonsMenuComponentVm$.next({
                buttons: [
                    c.recordActions.addItem,
                    c.recordActions.updateItems,
                    c.recordActions.deleteItems
                ]
            });
        }
}