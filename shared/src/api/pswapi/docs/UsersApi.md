# UsersApi

All URIs are relative to _http://localhost_

| Method                                                                         | HTTP request           | Description                              |
| ------------------------------------------------------------------------------ | ---------------------- | ---------------------------------------- |
| [**usersControllerActiveSessions**](UsersApi.md#userscontrolleractivesessions) | **GET** /users/session | Returns the current user\&#39;s sessions |
| [**usersControllerCreateOne**](UsersApi.md#userscontrollercreateone)           | **POST** /users        | Register a new user                      |
| [**usersControllerDeleteMe**](UsersApi.md#userscontrollerdeleteme)             | **DELETE** /users/me   | Delete the current user\&#39;s profile   |
| [**usersControllerFindMe**](UsersApi.md#userscontrollerfindme)                 | **GET** /users/me      | Returns the current user\&#39;s profile  |
| [**usersControllerUpdateMe**](UsersApi.md#userscontrollerupdateme)             | **PATCH** /users/me    | Update the current user\&#39;s profile   |

## usersControllerActiveSessions

> Array&lt;EventSessionDto&gt; usersControllerActiveSessions()

Returns the current user\&#39;s sessions

### Example

```ts
import { Configuration, UsersApi } from '';
import type { UsersControllerActiveSessionsRequest } from '';

async function example() {
  console.log('🚀 Testing  SDK...');
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearer
    accessToken: 'YOUR BEARER TOKEN',
  });
  const api = new UsersApi(config);

  try {
    const data = await api.usersControllerActiveSessions();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;EventSessionDto&gt;**](EventSessionDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## usersControllerCreateOne

> UserResponseDto usersControllerCreateOne(userCreateDto)

Register a new user

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersControllerCreateOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UsersApi();

  const body = {
    // UserCreateDto
    userCreateDto: ...,
  } satisfies UsersControllerCreateOneRequest;

  try {
    const data = await api.usersControllerCreateOne(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name              | Type                              | Description | Notes |
| ----------------- | --------------------------------- | ----------- | ----- |
| **userCreateDto** | [UserCreateDto](UserCreateDto.md) |             |       |

### Return type

[**UserResponseDto**](UserResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description       | Response headers |
| ----------- | ----------------- | ---------------- |
| **201**     |                   | -                |
| **400**     | Invalid data      | -                |
| **409**     | User alredy exist | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## usersControllerDeleteMe

> UserResponseDto usersControllerDeleteMe()

Delete the current user\&#39;s profile

### Example

```ts
import { Configuration, UsersApi } from '';
import type { UsersControllerDeleteMeRequest } from '';

async function example() {
  console.log('🚀 Testing  SDK...');
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearer
    accessToken: 'YOUR BEARER TOKEN',
  });
  const api = new UsersApi(config);

  try {
    const data = await api.usersControllerDeleteMe();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**UserResponseDto**](UserResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## usersControllerFindMe

> UserResponseDto usersControllerFindMe()

Returns the current user\&#39;s profile

### Example

```ts
import { Configuration, UsersApi } from '';
import type { UsersControllerFindMeRequest } from '';

async function example() {
  console.log('🚀 Testing  SDK...');
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearer
    accessToken: 'YOUR BEARER TOKEN',
  });
  const api = new UsersApi(config);

  try {
    const data = await api.usersControllerFindMe();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**UserResponseDto**](UserResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## usersControllerUpdateMe

> UserResponseDto usersControllerUpdateMe(userUpdateDto)

Update the current user\&#39;s profile

### Example

```ts
import {
  Configuration,
  UsersApi,
} from '';
import type { UsersControllerUpdateMeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UsersApi(config);

  const body = {
    // UserUpdateDto
    userUpdateDto: ...,
  } satisfies UsersControllerUpdateMeRequest;

  try {
    const data = await api.usersControllerUpdateMe(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name              | Type                              | Description | Notes |
| ----------------- | --------------------------------- | ----------- | ----- |
| **userUpdateDto** | [UserUpdateDto](UserUpdateDto.md) |             |       |

### Return type

[**UserResponseDto**](UserResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### HTTP response details

| Status code | Description | Response headers |
| ----------- | ----------- | ---------------- |
| **200**     |             | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
