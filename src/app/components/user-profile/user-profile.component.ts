import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services';
import { DatePipe } from '@angular/common';
import { User } from 'src/app/models/user';
import { GroupRequestService } from 'src/app/services/groupRequest.service';
import { FriendRequestService } from 'src/app/services/friendRequest.service';
import { Group } from 'src/app/models/group';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [DatePipe]
})
export class UserProfileComponent {
  currentUser!: User;
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  passwordForm!: FormGroup;
  userForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;
  approvedGroups: Group[] = [];
  friends: User[] = [];
  selectedImage!: File;

  constructor(
    private userService: UserService,
    private groupRequestService: GroupRequestService,
    private friendRequestService: FriendRequestService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
  ) {}


  
  ngOnInit() {
    this.userService.getMyInfo().subscribe((user) => {
      this.currentUser = user;
      this.userForm.patchValue(user);

      this.groupRequestService
      .getApprovedGroupsForUser(this.currentUser.id)
      .subscribe((approvedGroups: any[]) => {
        this.approvedGroups = approvedGroups;
      });
      this.friendRequestService
      .getApprovedFriendsForUser(this.currentUser.id)
      .subscribe((friends: any[]) => {
        this.friends = friends;
      });
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordsMatchValidator
    });
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      profileName: [''],
      username: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      description: [''],
    });
   
  }


  hasSignedIn() {
    return !!this.currentUser;
  }
  update(user: User) {
    this.userService.update(user.id, user).subscribe((updatedUser) => {
      this.currentUser = updatedUser; 
      this.successMessage = 'Profile updated successfully!';
      this.errorMessage = '';
      this.userService.setCurrentUser(updatedUser);
    }, (error) => {
      this.successMessage = '';
      this.errorMessage = 'An error occurred while updating the profile. Please try again.';
    });
  }

  updateProfilePicture(currentUser: User) {
    const formData = new FormData();
  if (this.selectedImage) {
    formData.append('profilePicture', this.selectedImage);
  }
    this.userService.updateProfilePicture(currentUser.id, formData).subscribe(() => {
      this.userService.getMyInfo().subscribe((updatedUser) => {
        this.currentUser = updatedUser;
        this.userService.setCurrentUser(updatedUser);
      });
    });
  }
  deleteProfilePicture(currentUser: User): void {
    this.userService.deleteProfilePicture(currentUser.id).subscribe(() => {
      this.userService.getMyInfo().subscribe((updatedUser) => {
        this.currentUser = updatedUser;
      });
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedImage = file;
  }
  
  onSubmit() {
    if (this.userForm.valid) {
      const updatedUser: User = { ...this.currentUser, ...this.userForm.value };
      this.update(updatedUser);
    }
  }
  
  
  changePassword() {
    const currentPassword = this.passwordForm.get('currentPassword')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;

    this.userService.changePassword(currentPassword, newPassword, confirmPassword).subscribe(
      () => {
        this.successMessage = 'Password changed successfully!';
        this.errorMessage = ''; 
        this.passwordForm.reset(); 
      },
      (error) => {
        this.successMessage = ''; 
        this.errorMessage = 'Wrong current password. Please try again.'; 
      }
    );
  }
  

  passwordsMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordsNotMatch: true };
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  formatDate(date: any): string {
    const [year, month, day, hour, minute] = date;
    const formattedDate = new Date(year, month - 1, day, hour, minute);
    return this.datePipe.transform(formattedDate, 'HH:mm dd/MM/yyy ') || '';
  }

}
