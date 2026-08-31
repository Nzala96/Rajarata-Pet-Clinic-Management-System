import { Component } from '@angular/core';
import { ContactService } from '../../service/contact/contact.service';
import { ContactMessage } from '../../models/contact-message.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contact: ContactMessage = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;

  constructor(private contactService: ContactService, private toastr: ToastrService) {}

  onSubmit() {
    this.isSubmitting = true;

    // Validate form
    if (!this.contact.name || !this.contact.email || !this.contact.subject || !this.contact.message) {
      this.toastr.error('Please fill in all required fields.', 'Validation Error', {
        timeOut: 5000,
        progressBar: true,
        closeButton: true
      });
      this.isSubmitting = false;
      return;
    }

    if (!this.isValidEmail(this.contact.email)) {
      this.toastr.error('Please enter a valid email address.', 'Validation Error', {
        timeOut: 5000,
        progressBar: true,
        closeButton: true
      });
      this.isSubmitting = false;
      return;
    }

    this.contactService.sendMessage(this.contact).subscribe({
      next: (response: any) => {
        console.log('Message sent:', response);
        this.isSubmitting = false;
        this.resetForm();
        
        // Show success toast notification
        this.toastr.success('Your message has been sent successfully! We\'ll get back to you soon.', 'Message Sent!', {
          timeOut: 5000,
          progressBar: true,
          closeButton: true
        });
      },
      error: (err: any) => {
        console.error('Error sending message:', err);
        this.isSubmitting = false;
        
        // Show error toast notification
        this.toastr.error('Something went wrong while sending your message. Please try again later.', 'Error', {
          timeOut: 5000,
          progressBar: true,
          closeButton: true
        });
      }
    });
  }

  resetForm() {
    this.contact = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

