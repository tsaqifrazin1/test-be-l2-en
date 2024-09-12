import {flatten, unflatten} from 'flat'

export function flatenObject(data: any){
    return flatten(data)
}

export function unflatenObject(flatenObj: any){
    return unflatten(flatenObj)
}