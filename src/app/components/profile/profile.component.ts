import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { FileUploadsService } from 'src/app/services/file-uploads.service';
import { LoaderService } from 'src/app/services/loader.service';
import { TokenService } from 'src/app/services/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  serverUrl: string = environment.serverUrl;
  uploadSub!: Subscription;
  imagePlaceholder: string = '../../../assets/illustrations/user.svg';
  userInfo;

  constructor(private api: ApiService, private upload: FileUploadsService, private token: TokenService, private loader: LoaderService) {
    this.userInfo = token.getItem('userInfo');
  }

  async updateImage(files: FileList) {
    this.loader.show();

    try {
      const response = await this.upload.uploadFiles(`/profile-pictures/${this.userInfo.email}`, files)

      if (response) {
        for (const file of response) {
          this.userInfo['image'] = file;

          let user = { ...this.userInfo };
          delete user['_id'];
          delete user['__v'];

          // Update User Info
          this.token.setItem('userInfo', this.userInfo);
          this.api.put('/update_employee', user);
        }
        this.loader.hide();
      }
    } catch (error) {
      this.loader.hide();
      console.log(error);
    }
  }
}
