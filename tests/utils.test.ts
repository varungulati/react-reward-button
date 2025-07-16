import { cn } from '../src/utils';

describe('Utils', () => {
  describe('cn function', () => {
    it('combines multiple string classes', () => {
      const result = cn('class1', 'class2', 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('handles undefined and null values', () => {
      const result = cn('class1', undefined, null, 'class2');
      expect(result).toBe('class1 class2');
    });

    it('handles empty strings', () => {
      const result = cn('class1', '', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('handles boolean conditions', () => {
      const result = cn('class1', true && 'class2', false && 'class3');
      expect(result).toBe('class1 class2');
    });

    it('handles objects with boolean values', () => {
      const result = cn('class1', {
        'class2': true,
        'class3': false,
        'class4': true,
      });
      expect(result).toBe('class1 class2 class4');
    });

    it('handles arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('handles mixed types', () => {
      const result = cn(
        'base-class',
        ['array-class1', 'array-class2'],
        {
          'object-class1': true,
          'object-class2': false,
        },
        undefined,
        null,
        '',
        'final-class'
      );
      expect(result).toBe('base-class array-class1 array-class2 object-class1 final-class');
    });

    it('handles no arguments', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('handles single argument', () => {
      const result = cn('single-class');
      expect(result).toBe('single-class');
    });

    it('handles duplicate classes', () => {
      const result = cn('class1', 'class2', 'class1');
      expect(result).toBe('class1 class2 class1');
    });

    it('handles complex nested structures', () => {
      const isActive = true;
      const isDisabled = false;
      const variant = 'primary';
      
      const result = cn(
        'btn',
        `btn-${variant}`,
        {
          'btn-active': isActive,
          'btn-disabled': isDisabled,
        },
        isActive && 'active-state',
        !isDisabled && 'enabled-state'
      );
      
      expect(result).toBe('btn btn-primary btn-active active-state enabled-state');
    });

    it('handles function calls that return classes', () => {
      const getClass = (condition: boolean) => condition ? 'dynamic-class' : '';
      const result = cn('static-class', getClass(true), getClass(false));
      expect(result).toBe('static-class dynamic-class');
    });

    it('is consistent with clsx behavior', () => {
      const inputs = [
        'class1',
        { 'class2': true, 'class3': false },
        ['class4', 'class5'],
        undefined,
        null,
        '',
        'class6'
      ];
      
      const result = cn(...inputs);
      expect(result).toBe('class1 class2 class4 class5 class6');
    });

    it('handles very long class strings', () => {
      const longClass = 'a'.repeat(1000);
      const result = cn('short', longClass, 'another-short');
      expect(result).toContain('short');
      expect(result).toContain(longClass);
      expect(result).toContain('another-short');
    });

    it('handles special characters in class names', () => {
      const result = cn('class-with-dash', 'class_with_underscore', 'class:with:colon');
      expect(result).toBe('class-with-dash class_with_underscore class:with:colon');
    });

    it('handles numeric values', () => {
      const result = cn('class1', 0, 1, 'class2');
      expect(result).toBe('class1 1 class2');
    });

    it('handles template literals', () => {
      const variant = 'primary';
      const size = 'lg';
      const result = cn(`btn-${variant}`, `btn-${size}`);
      expect(result).toBe('btn-primary btn-lg');
    });
  });
}); 