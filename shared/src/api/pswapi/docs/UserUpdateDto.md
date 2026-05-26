# UserUpdateDto

## Properties

| Name       | Type   |
| ---------- | ------ |
| `username` | string |
| `password` | string |
| `email`    | string |

## Example

```typescript
import type { UserUpdateDto } from ''

// TODO: Update the object below with actual values
const example = {
  "username": mario_rossi,
  "password": P@ssword123,
  "email": mario@example.com,
} satisfies UserUpdateDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UserUpdateDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
