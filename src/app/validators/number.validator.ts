import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})

export class ValidateNumber { 
  constructor() { }
  invalidChars = [
    "e",
    "E",
  ];
  validateNo(e): boolean {
    if (this.invalidChars.includes(e.key)) {
        e.preventDefault();
        return false;
      }
      return true;
}  
}