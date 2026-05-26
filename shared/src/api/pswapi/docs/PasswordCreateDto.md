# PasswordCreateDto

## Properties

| Name       | Type    |
| ---------- | ------- |
| `vaultId`  | string  |
| `service`  | string  |
| `website`  | string  |
| `username` | string  |
| `password` | string  |
| `otpCode`  | string  |
| `favorite` | boolean |
| `haveOtp`  | boolean |

## Example

```typescript
import type { PasswordCreateDto } from ''

// TODO: Update the object below with actual values
const example = {
  "vaultId": uuid-v4-vault-123,
  "service": Netflix,
  "website": https://netflix.com,
  "username": mario_rossi,
  "password": S3cureP@ss!,
  "otpCode": ABC 123,
  "favorite": null,
  "haveOtp": null,
} satisfies PasswordCreateDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PasswordCreateDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
