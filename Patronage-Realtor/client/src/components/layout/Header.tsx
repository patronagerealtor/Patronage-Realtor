import { useState } from "react";
import { Menu, X, ChevronDown, User, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 font-heading font-bold text-xl tracking-tight" data-testid="logo">
          <img
            src="/logo/logo-full.png"
            alt="Patronage Realtor"
            className="w-8 h-8 object-contain"
            data-testid="img-logo"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent font-medium">Properties</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-secondary p-6 no-underline outline-none focus:shadow-md">
                        <MapPin className="h-6 w-6" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          New Projects
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Discover our latest luxury developments.
                        </p>
                      </div>
                    </li>
                    <li>
                      <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Buy</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Find your perfect home.
                        </p>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Rent</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Explore rental properties.
                        </p>
                      </a>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="#" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  Interiors
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="#" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  About Us
                </a>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" className="gap-2">
            Contact Us
          </Button>
          <Button className="shadow-sm" data-testid="button-book-call">Book a Call</Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="font-heading font-bold text-xl mb-6">Menu</SheetTitle>
              <nav className="flex flex-col gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">Properties</h4>
                  <a href="#" className="block py-2 text-lg font-medium hover:text-primary/70 border-b border-border/50">Buy</a>
                  <a href="#" className="block py-2 text-lg font-medium hover:text-primary/70 border-b border-border/50">Rent</a>
                  <a href="#" className="block py-2 text-lg font-medium hover:text-primary/70 border-b border-border/50">Commercial</a>
                  <a href="#" className="block py-2 text-lg font-medium hover:text-primary/70 border-b border-border/50">New Projects</a>
                </div>
                
                <div className="space-y-2 mt-4">
                   <a href="#" className="block py-2 text-lg font-medium hover:text-primary/70">Interiors</a>
                   <a href="#" className="block py-2 text-lg font-medium hover:text-primary/70">About Us</a>
                   <a href="#" className="block py-2 text-lg font-medium hover:text-primary/70">Contact Us</a>
                </div>

                <div className="mt-8">
                  <Button className="w-full mb-3" size="lg">Book a Call</Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
