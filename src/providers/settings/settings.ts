import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import {Observable} from 'rxjs/Observable';
 
@Injectable()
export class SettingsProvider {
 
    private theme: BehaviorSubject<String>;
    public colorTheme: String;
    public themeColor:String;
 
    constructor(public storage: Storage) {

        this.colorTheme = 'light-theme';

        this.storage.get('colortheme').then(colortheme=>{
            this.colorTheme = colortheme;
            this.setActiveTheme(this.colorTheme);
        });

        this.theme = new BehaviorSubject(this.colorTheme); 
    }
 
    setActiveTheme(val) {
        this.theme.next(val);
    }
 
    getActiveTheme() {
        return this.theme.asObservable();
    }
}