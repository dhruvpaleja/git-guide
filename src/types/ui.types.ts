/**
 * UI Component type definitions
 */

import { ReactNode, CSSProperties } from 'react';

export interface BaseComponentProps {
  className?: string;
  style?: CSSProperties;
  'data-testid'?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

export interface CardProps extends BaseComponentProps {
  children: ReactNode;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdropClick?: boolean;
}

export interface FormInputProps extends BaseComponentProps {
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
}

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}
