import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ConstantVariable } from '../../app/constant-variable';
import 'rxjs/add/operator/map';

const SERVER_URL:any = {
    getNormal   : ConstantVariable.APIURL+'index.php/tbl_note',
    getLimit    : ConstantVariable.APIURL+'limit.php',
};

@Injectable()
export class CrudHttpProvider {

    limitData:number = 10;
    datas:any = [];
    data:any = [];

    constructor(public http: Http) {
        console.log('Hello CrudHttpProvider Provider');
        this.datas = null;
        this.data = null;
    }

    callToCrudPost(data) {
        
        let api_url   = data.api_url;
        let postParam = data.post;
        
        let headers: any = new Headers({ 'Accept':'application/json', 'Content-Type': 'application/json' }),
            options: any = new RequestOptions({ headers: headers });

        return new Promise(resolve => {
            this.http.post(ConstantVariable.BASE_URL + api_url, postParam, options)
                .map(res => res.json())
                .subscribe((data) => {
                    resolve(data);
                }, error => {
                    console.log("error " + error);
                });
        });
    }

}
