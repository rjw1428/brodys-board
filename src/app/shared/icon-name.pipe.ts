import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconName'
})
export class IconNamePipe implements PipeTransform {

  transform(value: string): string {
    var lowerName = value.toLowerCase().trim();
    var words = this.removeSpecialChars(lowerName).split(' ');
    //let lowerName=value.toLowerCase();
    //let words=lowerName.split(' ');
    var keyWordLocation = words.indexOf("brewing")
    if (keyWordLocation > -1) {
      words.splice(keyWordLocation, 1);
    }

    var keyWordLocation = words.indexOf('brewery')
    if (keyWordLocation > -1) {
      words.splice(keyWordLocation, 1);
    }

    var keyWordLocation = words.indexOf('beer')
    if (keyWordLocation > -1) {
      words.splice(keyWordLocation, 1);
    }
    var keyWordLocation = words.indexOf('co.')
    if (keyWordLocation > -1) {
      words.splice(keyWordLocation, 1);
    }

    var keyWordLocation = words.indexOf('.')
    var parsedString = []
    words.forEach(word => {
      if (word.indexOf('.') > -1) {
        parsedString.push(word.substr(0, word.indexOf('.')))
      } else {
        parsedString.push(word)
      }
    })
    words = parsedString;


    if (words.length > 1) {
      return words[0].toLocaleLowerCase() + ' ' + words[1].toLocaleLowerCase() + '.png';
    } else {
      return words[0].toLocaleLowerCase() + '.png'
    }
  }

  removeSpecialChars(str: string): string {
    let result=str.replace(/ü/g, "u")
    result=result.replace(/ä/g, "a")
    result=result.replace(/ö/g, "o")
    result=result.replace(/ß/g, "ss")
    result=result.replace(/ñ/g, "n")
    result=result.replace(/ë/g, "e")
    result=result.replace(/'/g, "")
    return result
  }

}
