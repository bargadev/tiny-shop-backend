# Validadores Customizados

Este diretório contém validadores customizados para serem usados com `class-validator` no NestJS.

## IsUlid

Validador customizado para verificar se um campo é um ULID (Universally Unique Lexicographically Sortable Identifier) válido.

### Características

- Valida se o valor é uma string de exatamente 26 caracteres
- Verifica se usa o alfabeto Base32 de Crockford (0-9, A-Z excluindo I, L, O, U)
- Case insensitive (aceita maiúsculas, minúsculas ou misto)

### Uso

```typescript
import { IsUlid } from '@/validators';

export class MeuDto {
  @IsUlid()
  item_id: string;
}
```

### Mensagem de Erro

Quando a validação falha, a mensagem padrão é:

```
{campo} must be a valid ULID (26 characters, Base32 encoded)
```

### Exemplos de ULIDs Válidos

```
01ARZ3NDEKTSV4RRFFQ69G5FAV  // maiúsculas
01arz3ndektsv4rrffq69g5fav  // minúsculas
01ArZ3NdEkTsV4RrFfQ69g5FaV  // misto
```

### Exemplos de ULIDs Inválidos

```
01ARZ3NDEKTSV4RRFFQ69G5    // muito curto (24 caracteres)
01ARZ3NDEKTSV4RRFFQ69G5FAVXX // muito longo (28 caracteres)
01ARZ3NDEKTSV4RRFFQ69G5FAI  // contém 'I' (inválido)
01ARZ3NDEKTSV4RRFFQ69G5FOL  // contém 'O' e 'L' (inválido)
```

### Testes

Os testes unitários podem ser executados com:

```bash
npm test -- is-ulid.validator.spec
```

## Criando Novos Validadores

Para criar um novo validador customizado:

1. Crie um arquivo `meu-validador.validator.ts`
2. Implemente o validador usando `registerDecorator` do `class-validator`
3. Exporte o validador no arquivo `index.ts`
4. Crie testes em `meu-validador.validator.spec.ts`

### Template

```typescript
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function MeuValidador(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'meuValidador',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Lógica de validação aqui
          return true; // ou false
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} não é válido`;
        },
      },
    });
  };
}
```
