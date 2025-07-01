import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AuthService} from '../../../../services/auth.service';
import {Header} from '../../../../interfaces/header';
import {ActivatedRoute, Router} from '@angular/router';
import {log} from 'console';
import {UsersService} from '../../../../services/users.service';
import {User} from '../../../../interfaces/users';
import {firstValueFrom} from "rxjs";
import {UtilitiesService} from "../../../../services/utilities.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  menu: Header[] = []
  selected: string = ""


  constructor(
    private readonly authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private readonly userService: UsersService,
    private readonly utilitiesService: UtilitiesService
  ) {

  }


  async ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.menu = [
        {
          key: "init",
          name: "Inicio",
          position: "left",
          action: async () => {
            await this.router.navigate(['/']);
            await this.selectionMenu();
          }
        },
        {
          key: "recipes",
          name: "Recetas",
          position: "left",
          action: async () => {
            await this.router.navigate(['/recipes']);
            await this.selectionMenu();
          }
        },
        {
          key: "contact",
          name: "Contacto",
          position: "left",
          action: async () => {
            await this.router.navigate(['/contact']);
            await this.selectionMenu();
          }
        },
        {
          key: "profile",
          name: "Mi perfil",
          position: "right",
          children: [
            {
              key: "profile-page",
              name: "Perfil",
              position: "right",
              action: async () => {
                const user = await firstValueFrom(this.userService.getByToken(this.authService.getToken() ?? ''));
                await this.router.navigate(['/profile/' + user.id]);
                await this.selectionMenu();
              }
            },
            {
              key: "my-recipes",
              name: "Mis recetas",
              position: "right",
              action: async () => {
                const user = await firstValueFrom(this.userService.getByToken(this.authService.getToken() ?? ''));
                await this.router.navigate(['/management/' + user.id]);
                await this.selectionMenu();
              }
            },
            {
              key: "my-categories",
              name: "Mis categorias",
              position: "right",
              action: async () => {
                const user = await firstValueFrom(this.userService.getByToken(this.authService.getToken() ?? ''));
                await this.router.navigate(['/categories/' + user.id]);
                await this.selectionMenu();
              }
            },
            {
              key: "logout",
              name: "Cerrar sesión",
              position: "right",
              action: async () => {
                await this.authService.logout();
                await this.router.navigate(['/login']);
                await this.selectionMenu();
              }
            }
          ]
        }
      ];
    }


    this.selectionMenu()


  }

  getMenu(pos: string) {
    if (pos === "right") {
      return this.menu.filter(el => el.position === "right")
    } else {
      return this.menu.filter(el => el.position === "left")
    }

  }


  async selectionMenu() {
    await this.utilitiesService.sleep(0)
    let item = this.router.url.split("/")[1]

    console.log(item)
    switch (item) {
      case "recipes":
        this.selected = this.menu.find(el => el.key === "recipes")?.name ?? ""
        return

      case "register":
        this.selected = this.menu.find(el => el.key === "register")?.name ?? ""
        return
      case "contact":
        this.selected = this.menu.find(el => el.key === "contact")?.name ?? ""
        return
      case "profile":
        this.selected = this.menu.find(el => el.key === "profile")?.name ?? ""
        return
      case "":
        this.selected = this.menu.find(el => el.key === "init")?.name ?? ""
        return

      case "login":
        this.selected = this.menu.find(el => el.key === "login")?.name ?? ""
        return
      case "logout":
        this.selected = this.menu.find(el => el.key === "login")?.name ?? ""
        return

    }
  }


}
