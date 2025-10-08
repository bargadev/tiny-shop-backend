import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * Validates if a string is a valid ULID (Universally Unique Lexicographically Sortable Identifier)
 *
 * ULID format:
 * - 26 characters long
 * - Uses Crockford's Base32 alphabet (0-9, A-Z excluding I, L, O, U)
 * - Case insensitive but typically uppercase
 */
export function IsUlid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUlid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          // ULID must be exactly 26 characters
          if (value.length !== 26) {
            return false;
          }

          // ULID uses Crockford's Base32 alphabet: 0-9 and A-Z excluding I, L, O, U
          // Case insensitive
          const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
          return ulidRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ULID (26 characters, Base32 encoded)`;
        },
      },
    });
  };
}
