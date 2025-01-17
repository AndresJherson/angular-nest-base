import { ComponentRef, createComponent, Directive, EnvironmentInjector, inject, Injectable, Injector, Input, Renderer2, Type, ViewContainerRef } from "@angular/core";
import { BehaviorSubject, distinctUntilChanged, Observable, Subscription } from "rxjs";
import { IComponent } from "../interfaces/IComponent";


@Injectable({
  providedIn: null,
})
export class OverlayService {

    private envInject = inject( EnvironmentInjector );
    private injector = inject( Injector );
    private components: Array<{ componentRef: ComponentRef<any> }> = []; 
    public component$ = new BehaviorSubject<ComponentRef<IComponent<any>>|undefined>( undefined );

    
    open<T extends IComponent<any>>(component: Type<T> ): Observable<T>
    {
        return new Observable( o => {

            try {
                const componentRef = createComponent( component, {
                    environmentInjector: this.envInject,
                    elementInjector: this.injector
                } );

                componentRef.instance.sub.add( componentRef.instance.onInit.subscribe({
                    next: ( c: any ) => {
                        o.next( componentRef.instance );
                        o.complete();
                    },
                    error: ( error: any ) => o.error( error )
                }));
        
                this.components.push({ componentRef });
                this.component$.next( componentRef );
            }
            catch ( error ) {
                o.error( error );
            }

        } );
    }

    

    close( instance: IComponent<any> ): void 
    {
        const index = this.components.findIndex( c => c.componentRef.instance === instance );
    
        if (index !== -1) {
            this.components[ index ].componentRef.destroy();
            this.components.splice( index, 1 );

            const lastComponent = this.components.length
                                    ? this.components[this.components.length - 1].componentRef
                                    : undefined;

            this.component$.next( lastComponent );
        }
    }


    clear(): void {
        this.components.reverse().forEach( c => c.componentRef.destroy() );
        this.components = [];
    }
    

    isOverlay( instance: any ): boolean
    {
        const i = this.components.map( c => c.componentRef.instance ).indexOf( instance );
        return i === -1 ? false : true;
    }

}


@Directive({
    selector: '[overlayDirective]',
    standalone: true
})
export class OverlayDirective
{
    @Input() overlayService?: OverlayService;
    private vcr = inject( ViewContainerRef );
    private sub = new Subscription();
    private renderer = inject( Renderer2 );


    ngAfterViewInit()
    {
        this.sub.add( this.overlayService?.component$.pipe( distinctUntilChanged() ).subscribe( container => {
            if ( container ) {
                this.vcr.insert( container.hostView );
                const vcrElement = this.vcr.element.nativeElement as HTMLElement;
                vcrElement.replaceChildren();
                this.renderer.appendChild( vcrElement, container.location.nativeElement );
            }
        } ) )
    }


    ngOnDestroy()
    {
        this.sub.unsubscribe();
    }
}