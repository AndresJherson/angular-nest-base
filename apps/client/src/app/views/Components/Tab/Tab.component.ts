import { ChangeDetectorRef, Component, ContentChildren, EventEmitter, HostBinding, inject, Input, Output, QueryList, Type } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { IComponent } from '../../../interfaces/IComponent';
import { BehaviorSubject, Subscription } from 'rxjs';
import { OverlayDirective, OverlayService } from '../../../services/overlay.service';
import { ModalService } from '../../../services/modal.service';

@Component({
    selector: 'app-tab-item',
    imports: [CommonModule],
    template: `
        @if( active ) {
            <ng-content></ng-content>
        }
    `,
    styles: [`
        :host {
            width: 100%;
            max-width: 100%;
            max-height: 100%;
            min-height: 100%;

            display: flex;
            flex-direction: column;
        }
    `]
})
export class TabItemComponent {
    @Input() title: string = '';
    @Input() active: boolean = false;
}


@Component({
  selector: 'app-tab',
  imports: [
    CommonModule,
    AsyncPipe,
    OverlayDirective
  ],
  providers: [
    OverlayService,
  ],
  templateUrl: './Tab.component.html',
  styleUrl: './Tab.component.css',
})
export class TabComponent implements IComponent<TabComponent> {
    
    @Input() vm$ = new BehaviorSubject<TabComponentVm>({
        title: '',
        tabs: [],
        classesCss: '',
        isCloseActive: true
    });

    @HostBinding( 'class' ) hostClasses: string = '';

    @ContentChildren( TabItemComponent ) tabs?: QueryList<TabItemComponent>;


    @Output() onInit = new EventEmitter<TabComponent>();
    @Output() onDestroy = new EventEmitter<TabComponent>();
    @Output() onClose = new EventEmitter<TabComponentEventData>();

    sub: Subscription = new Subscription();
    cd = inject( ChangeDetectorRef );
    overlayService = inject( OverlayService );
    modalService = inject( ModalService );
    

    ngOnInit()
    {
        this.onInit.emit( this );
    }


    ngAfterContentInit()
    {
        this.verifyTabsItemComponent();
        this.sub.add( this.vm$.subscribe( vm => {
            this.hostClasses = vm.classesCss ?? '';
            this.verifyTabsItemVm();
        } ) );
    }


    // Tabs Item Component
    verifyTabsItemComponent()
    {
        if ( this.tabs && this.tabs.length > 0 ) {
            const activeTabs = this.tabs.filter( tab => tab.active );
            if ( activeTabs.length === 0 && this.tabs.length > 0 ) this.selectTabItemComponent( this.tabs.first );
            this.cd.detectChanges();
        }
    }


    selectTabItemComponent( tab: TabItemComponent )
    {
        this.tabs?.toArray().forEach( t => t.active = false );
        tab.active = true;
    }


    // Tabs Item Vm
    verifyTabsItemVm()
    {
        if ( !this.tabs || this.tabs.length === 0 ) {
            const activeTabs = this.vm$.value.tabs.filter( tab => tab.active );
            if ( activeTabs.length === 0 && this.vm$.value.tabs.length > 0 ) {
                this.selectTabItemVm( this.vm$.value.tabs[0] )
            }
            else if ( activeTabs.length > 0 ) {
                this.selectTabItemVm( activeTabs[0] )
            };
            this.cd.detectChanges();
        }
    }


    selectTabItemVm( tab: TabItem<any> )
    {
        this.overlayService.clear();
        this.overlayService.open( tab.component ).subscribe( c => tab.onInit( c ) )
        this.vm$.value.tabs.forEach( tab => tab.active = false );
        tab.active = true;
    }


    // Otro
    close( e: Event )
    {
        this.onClose.emit({
            event: e,
            sender: this
        });
        this.modalService.close( this );
    }


    ngOnDestroy(): void 
    {
        this.onDestroy.emit( this );
        this.sub.unsubscribe();
        this.overlayService.clear();
    }
}


export type TabComponentEventData =
{
    event: Event,
    sender: TabComponent
}


export interface TabItem<C extends IComponent<any>>
{
    title: string,
    component: Type<IComponent<C>>,
    onInit: ( component: C ) => void,
    active?: boolean
}


export interface TabComponentVm
{
    title: string,
    tabs: TabItem<any>[],
    isCloseActive: boolean,
    classesCss?: string,
}