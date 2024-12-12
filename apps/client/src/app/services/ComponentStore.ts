import { BehaviorSubject, catchError, map, Observable, tap, throwError } from "rxjs";

export class ComponentStore<T extends Object>
{
    private store$: BehaviorSubject<T>;
    private read$: Observable<T>;
    public readonly state$: Observable<T>;

    constructor( initialState: T, read$: Observable<T> )
    {   
        this.store$ = new BehaviorSubject( initialState );
        this.state$ = this.store$.asObservable();
        this.read$ = read$;
        this.read().subscribe()
    }


    public getState(): T
    {
        return this.store$.value;
    }
    
    
    public read(): Observable<undefined>
    {
        return this.read$.pipe(
            tap( state => this.store$.next( state ) ),
            catchError( error => {
                this.store$.error( error );
                this.store$.complete();
                return throwError( () => error );
            } ),
            map( () => void 0 )
        );
    }


    public setRead( read$: Observable<T> ): ComponentStore<T>
    {
        this.read$ = read$;
        return this;
    }


    setState( newState: T ): void
    setState( newStateFn: ( state: T ) => T ): void
    setState( newStateOrFn: ( ( state: T ) => T ) | T ): void
    {
        let newState;
        if ( typeof newStateOrFn === 'function' ) {
            newState = newStateOrFn( this.store$.value );
        }
        else {
            newState = newStateOrFn;
        }

        this.store$.next( newState );
    }


    storeFromThis<K extends Object>( selectMapper: ( state: T ) => K ): ComponentStore<K>
    {
        const initialState = selectMapper( this.getState() );

        const read$ = new Observable<K>( o => {
            try {
                o.next( selectMapper( this.getState() ) );
                o.complete();
            }
            catch ( error ) {
                o.error( error );
            }
        } );
        
        const childStore = new ComponentStore<K>( initialState, read$ );
        
        const sub = this.state$.subscribe({
            next: state => childStore.read().subscribe(),
            error: error => {
                childStore.store$.error( error );
                sub.unsubscribe();
            },
            complete: () => {
                childStore.store$.complete();
                sub.unsubscribe();
            }
        });

        return childStore;
    }


    storeFromThisAsync<K extends Object>( initialState: K, read$: Observable<K> ): ComponentStore<K>
    {
        const childStore = new ComponentStore<K>( initialState, read$ );

        const s = this.state$.subscribe({
            next: state => childStore.read().subscribe(),
            error: error => {
                childStore.store$.error( error );
                setTimeout( () => s.unsubscribe(), 0 )
            },
            complete: () => {
                childStore.store$.complete();
                setTimeout( () => s.unsubscribe(), 0 )
            }
        });

        return childStore;
    }


    subscribeFrom<K extends Object>( parentStore: ComponentStore<K>, selectMapper: ( state: K ) => T )
    {
        const read$ = new Observable<T>( o => {
            try {
                o.next( selectMapper( parentStore.getState() ) );
                o.complete();
            }
            catch ( error ) {
                o.error( error );
            }
        } );

        this.setRead( read$ );

        const s = parentStore.state$.subscribe({
            next: state => this.read().subscribe(),
            error: error => {
                this.store$.error( error );
                setTimeout( () => s.unsubscribe(), 0 )
            },
            complete: () => {
                this.store$.complete();
                setTimeout( () => s.unsubscribe(), 0 )
            }
        });
    }

    emitTo<K extends Object>( childStore: ComponentStore<K>, selectMapper: ( state: T ) => K )
    {
        const read$ = new Observable<K>( o => {
            try {
                o.next( selectMapper( this.getState() ) );
                o.complete();
            }
            catch ( error ) {
                o.error( error );
            }
        } );

        childStore.setRead( read$ );

        const s = this.state$.subscribe({
            next: state => childStore.read().subscribe(),
            error: error => {
                childStore.store$.error( error );
                setTimeout( () => s.unsubscribe(), 0 )
            },
            complete: () => {
                childStore.store$.complete();
                setTimeout( () => s.unsubscribe(), 0 )
            }
        });
    }
}