# VaultResponseDto

## Properties

| Name          | Type   |
| ------------- | ------ |
| `id`          | string |
| `ownerId`     | string |
| `name`        | string |
| `description` | string |
| `color`       | string |

## Example

```typescript
import type { VaultResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 550e8400-e29b-41d4-a716-446655440000,
  "ownerId": user-uuid-123,
  "name": Work,
  "description": Company passwords,
  "color": #FF5733,
} satisfies VaultResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as VaultResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
