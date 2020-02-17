import axios from 'axios';
import qs from 'qs';

export function request(options,context){
    return new Promise((resolve,reject)=>{
        return axios(options).then(res=>{
            resolve(res);
        }).catch(e=>{
            const {status=''}=res;
            if(status==-1){
                
            }
            reject(res)
        });
    })
}