import { Component, ContentChildren, Input, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './Tab.component.html',
  styleUrl: './Tab.component.css',
})
export class TabComponent {
    
    @ContentChildren( TabItemComponent ) tabs?: QueryList<TabItemComponent>;

    ngAfterContentInit()
    {
        const activeTabs = this.tabs?.filter( tab => tab.active );
        if ( activeTabs?.length === 0 && this.tabs ) this.selectTab( this.tabs.first );
    }


    selectTab( tab: TabItemComponent )
    {
        this.tabs?.toArray().forEach( t => t.active = false );
        tab.active = true;
    }
}