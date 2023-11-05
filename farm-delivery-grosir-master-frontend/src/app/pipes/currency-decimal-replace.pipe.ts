import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalReplace'
})
export class CurrencyDecimalReplacePipe implements PipeTransform {

  transform(item: any, replace, replacement): any {
    if(item == null) return "";
    item = item.replace(replace, replacement);
    return item;
  }
}
