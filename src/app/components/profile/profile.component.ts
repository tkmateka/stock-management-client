import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnDestroy {
  serverUrl: string = environment.serverUrl;
  uploadSub!: Subscription;
  imagePlaceholder: string = '../../../assets/illustrations/user.svg';
  userInfo;

  constructor(private api: ApiService, private token: TokenService) {
    this.userInfo = token.getItem('userInfo');
  }

  updateImage(files: any) {
    const formData: FormData = new FormData();

    formData.append('files', files[0], files[0].name);

    this.uploadSub = this.api.post('/upload', formData).subscribe({
      next: (res: any) => {
        if(res) {
          for (const file of res['file']) {
            this.userInfo['image'] = {
              name: file.originalname,
              path: `${this.serverUrl}/file/${file.filename}`,
              _id: file['_id']
            };
  
            let user = {...this.userInfo};
            delete user['_id'];
            delete user['__v'];
  
            // Update User Info
            this.token.setItem('userInfo', this.userInfo);
            this.api.put('/update_employee', user);
          }
        }
      },
      error: err => console.log(err),
    })
  }

  ngOnDestroy() {
    if (this.uploadSub) {
      this.uploadSub.unsubscribe();
    }
  }
}
