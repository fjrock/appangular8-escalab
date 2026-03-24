import { Component, OnInit} from '@angular/core';
import { Router } from "@angular/router";
import { map, switchMap, tap } from 'rxjs/operators';
import { CocktailService } from '../../../../services/cocktail.service'
import { Drink } from '../../../../models/drink'
import { forkJoin, Observable, of } from 'rxjs';

@Component({
  selector: 'app-cocktail',
  templateUrl: './cocktail.component.html',
  styleUrls: ['./cocktail.component.scss']
})
export class CocktailComponent implements OnInit{

  cocktailLetter: Drink;
  searchLetter = '';
  searchName = '';
  searchIngredient = '';
  selectedCategory = '';
  selectedAlcoholic = '';
  selectedGlass = '';
  categories: string[] = [];
  alcoholicTypes: string[] = [];
  glasses: string[] = [];
  allIngredients: string[] = [];
  filteredIngredients: string[] = [];
  filteredNames: string[] = [];
  noResults = false;
  currentSlide = 0;
  random: string;
  asyncDrink$: Observable<Drink>;
  asyncRandom$: Observable<any[]>;

  constructor(private router: Router,
              private cocktailService: CocktailService) { }

  ngOnInit() {
    this.asyncDrink$ = this.cocktailService.getRandom().pipe(
      map (response => response.drinks[0])
    );

    this.random = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    this.getCocktailByLetterCocktailInit(this.random);
    this.loadFilterOptions();

  }

  getCocktailById(id: any) {
  
    this.router.navigate([`detalle/${id}`]);

  }

  getCocktailByLetterCocktail() {
    if (this.searchLetter.trim() !== '') {
      this.resetAdvancedFilters();
      this.asyncRandom$ = this.cocktailService.findByLetter(this.searchLetter).pipe(
        map((response) => {
          const drinks = response.drinks || [];
          this.noResults = drinks.length === 0;
          this.cocktailLetter = drinks;
          this.currentSlide = 0;
          return drinks;
        })
      );
    }
  }
  
  getCocktailByLetterCocktailInit(random: string) {
    this.asyncRandom$ = this.cocktailService.findByLetter(random).pipe(
      map((response) => {
        const drinks = response.drinks || [];
        this.noResults = drinks.length === 0;
        this.cocktailLetter = drinks;
        this.currentSlide = 0;
        return drinks;
      })
    );
  }

  applyFilters() {
    this.searchLetter = '';
    const name = this.searchName.trim();
    const ingredient = this.searchIngredient.trim();
    const category = this.selectedCategory;
    const alcoholic = this.selectedAlcoholic;
    const glass = this.selectedGlass;

    if (!name && !ingredient && !category && !alcoholic && !glass) {
      this.random = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      this.getCocktailByLetterCocktailInit(this.random);
      return;
    }

    this.asyncRandom$ = this.buildFilteredResults(name, ingredient, category, alcoholic, glass);
  }

  clearFilters() {
    this.searchLetter = '';
    this.searchName = '';
    this.searchIngredient = '';
    this.selectedCategory = '';
    this.selectedAlcoholic = '';
    this.selectedGlass = '';
    this.noResults = false;
    this.random = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    this.getCocktailByLetterCocktailInit(this.random);
  }

  private loadFilterOptions() {
    this.cocktailService.listCategories().pipe(
      map((response) => (response.drinks || []).map((item) => item.strCategory).filter(Boolean))
    ).subscribe((categories) => {
      this.categories = categories;
    });

    this.cocktailService.listAlcoholicTypes().pipe(
      map((response) => (response.drinks || []).map((item) => item.strAlcoholic).filter(Boolean))
    ).subscribe((types) => {
      this.alcoholicTypes = types;
    });

    this.cocktailService.listGlasses().pipe(
      map((response) => (response.drinks || []).map((item) => item.strGlass).filter(Boolean))
    ).subscribe((glasses) => {
      this.glasses = glasses;
    });

    this.cocktailService.listIngredients().pipe(
      map((response) => (response.drinks || []).map((item) => item.strIngredient1).filter(Boolean))
    ).subscribe((ingredients) => {
      this.allIngredients = ingredients;
      this.filteredIngredients = [];
    });
  }

  private resetAdvancedFilters() {
    this.searchName = '';
    this.searchIngredient = '';
    this.selectedCategory = '';
    this.selectedAlcoholic = '';
    this.selectedGlass = '';
  }

  onIngredientInput() {
    const term = this.searchIngredient.trim().toLowerCase();
    if (term.length < 1) {
      this.filteredIngredients = [];
      return;
    }

    this.filteredIngredients = this.allIngredients
      .filter((ingredient) => ingredient.toLowerCase().includes(term))
      .slice(0, 20);
  }

  onNameInput() {
    const term = this.searchName.trim();
    if (term.length < 1) {
      this.filteredNames = [];
      return;
    }

    this.cocktailService.findByName(term).pipe(
      map((response) => (response.drinks || []).map((drink) => drink.strDrink as string).filter(Boolean))
    ).subscribe((names: string[]) => {
      this.filteredNames = [...new Set(names)].slice(0, 20);
    });
  }

  private buildFilteredResults(name: string, ingredient: string, category: string, alcoholic: string, glass: string): Observable<any[]> {
    let base$: Observable<any[]>;
    if (name) {
      base$ = this.cocktailService.findByName(name).pipe(map((res) => res.drinks || []));
    } else if (ingredient) {
      base$ = this.cocktailService.findByIngredient(ingredient).pipe(map((res) => res.drinks || []));
    } else if (category) {
      base$ = this.cocktailService.findByCategory(category).pipe(map((res) => res.drinks || []));
    } else if (alcoholic) {
      base$ = this.cocktailService.findByAlcoholic(alcoholic).pipe(map((res) => res.drinks || []));
    } else {
      base$ = this.cocktailService.findByGlass(glass).pipe(map((res) => res.drinks || []));
    }

    if (name) {
      return base$.pipe(
        map((drinks) => this.filterLocally(drinks, ingredient, category, alcoholic, glass)),
        tap((drinks) => {
          this.noResults = drinks.length === 0;
          this.currentSlide = 0;
        })
      );
    }

    return base$.pipe(
      switchMap((drinks) => {
        const ids = (drinks || []).map((d) => d.idDrink);
        if (!ids.length) {
          return of([]);
        }
        return forkJoin(
          ids.map((id) =>
            this.cocktailService.findDetailCocktail(id).pipe(
              map((res) => (res.drinks && res.drinks[0]) || null)
            )
          )
        );
      }),
      map((details) => this.filterLocally(details, ingredient, category, alcoholic, glass)),
      tap((drinks) => {
        this.noResults = drinks.length === 0;
        this.currentSlide = 0;
      })
    );
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  prevSlide(total: number) {
    if (!total) {
      return;
    }
    this.currentSlide = (this.currentSlide - 1 + total) % total;
  }

  nextSlide(total: number) {
    if (!total) {
      return;
    }
    this.currentSlide = (this.currentSlide + 1) % total;
  }

  private filterLocally(drinks: any[], ingredient: string, category: string, alcoholic: string, glass: string): any[] {
    const ingredientNeedle = ingredient.toLowerCase();
    return (drinks || []).filter((drink) => {
      const ingredientOk = !ingredientNeedle || this.hasIngredient(drink, ingredientNeedle);
      const categoryOk = !category || drink.strCategory === category;
      const alcoholicOk = !alcoholic || drink.strAlcoholic === alcoholic;
      const glassOk = !glass || drink.strGlass === glass;
      return ingredientOk && categoryOk && alcoholicOk && glassOk;
    });
  }

  private hasIngredient(drink: any, ingredientNeedle: string): boolean {
    for (let i = 1; i <= 15; i++) {
      const key = `strIngredient${i}`;
      const value = (drink[key] || '').toString().toLowerCase();
      if (value.includes(ingredientNeedle)) {
        return true;
      }
    }
    return false;
  }

}
