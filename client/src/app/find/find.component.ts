import { Component, OnInit } from "@angular/core";
import { HeroService } from "../common/services/hero.service";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "app-find",
  templateUrl: "./find.component.html",
  styleUrls: ["./find.component.scss"]
})
export class FindComponent implements OnInit {
  character: any = {};
  id: any;
  constructor(
    private heroService: HeroService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.getHeroes(params["id"]);
    });
  }

  getHeroes(id: any): void {
    this.heroService.getHero(id).subscribe(hero => (this.character = hero));
  }
}
