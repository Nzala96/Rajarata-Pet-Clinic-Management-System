
import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent implements OnInit{
  username: string | null = '';
  useremail: string | null = '';
  userIsAdmin: string | null = '';

  // Responsive sidebar state
  isSidebarOpen: boolean = false;
  isMobile: boolean = false;

  constructor(private authService: AuthService, private router: Router){}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.useremail = this.authService.getUserEmail();
    this.userIsAdmin = this.authService.getUserIsAdmin();

    // Check initial screen size
    this.checkScreenSize();

    console.log("Username: " , this.username);
    console.log("User Email: " , this.useremail);
    console.log("User Is Admin: " , this.userIsAdmin);
    console.log("Admin Status Check:", this.userIsAdmin === 'true');
    
    // If no admin status is set, check if user is logged in and set a default for testing
    if (!this.userIsAdmin && this.username) {
      console.log("Setting default admin status for testing");
      localStorage.setItem('authIsAdmin', 'true');
      this.userIsAdmin = 'true';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) {
      this.isSidebarOpen = true; // Always open on desktop
    } else {
      this.isSidebarOpen = false; // Closed by default on mobile
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    if (this.isMobile) {
      this.isSidebarOpen = false;
    }
  }

  // Test method to toggle admin status
  toggleAdminStatus(): void {
    const currentStatus = this.userIsAdmin === 'true';
    const newStatus = !currentStatus;
    localStorage.setItem('authIsAdmin', newStatus.toString());
    this.userIsAdmin = newStatus.toString();
    console.log("Admin status toggled to:", newStatus);
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
