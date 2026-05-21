
# EventSessionDto


## Properties

Name | Type
------------ | -------------
`socketId` | string
`userAgent` | string
`ip` | string
`connectedAt` | Date

## Example

```typescript
import type { EventSessionDto } from ''

// TODO: Update the object below with actual values
const example = {
  "socketId": session-12,
  "userAgent": Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7),
  "ip": 192.168.1.12,
  "connectedAt": null,
} satisfies EventSessionDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as EventSessionDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


