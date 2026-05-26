# VaultUpdateDto

## Properties

| Name          | Type   |
| ------------- | ------ |
| `name`        | string |
| `description` | string |
| `color`       | string |

## Example

```typescript
import type { VaultUpdateDto } from ''

// TODO: Update the object below with actual values
const example = {
  "name": Work,
  "description": Password for business services,
  "color": #FF5733,
} satisfies VaultUpdateDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as VaultUpdateDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
