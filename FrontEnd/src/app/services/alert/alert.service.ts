import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  // Example of a success alert
  showSuccess(message: string, title: string = 'Success') {
    return Swal.fire({
      title,
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }

  // Example of an error alert
  showError(message: string, title: string = 'Error') {
    return Swal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }

  // Example of a confirmation dialog
  showConfirmation(message: string, title: string = 'Are you sure?') {
    return Swal.fire({
      title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
  }
}
