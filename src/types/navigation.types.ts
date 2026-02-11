/**
 * Navigation-related type definitions
 */

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  badge?: string | number;
  disabled?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface NavigationState {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  activeSection?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
