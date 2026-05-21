# AuthApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**authControllerRegister**](AuthApi.md#authcontrollerregister) | **POST** /auth/register | Register a new user and return the JWT immediately |
| [**authControllerSignIn**](AuthApi.md#authcontrollersignin) | **POST** /auth/login | Log in and return the JWT token |



## authControllerRegister

> AuthResponseDto authControllerRegister(userCreateDto)

Register a new user and return the JWT immediately

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerRegisterRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // UserCreateDto
    userCreateDto: ...,
  } satisfies AuthControllerRegisterRequest;

  try {
    const data = await api.authControllerRegister(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userCreateDto** | [UserCreateDto](UserCreateDto.md) |  | |

### Return type

[**AuthResponseDto**](AuthResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |
| **400** | Invalid data |  -  |
| **409** | User alredy exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## authControllerSignIn

> AuthResponseDto authControllerSignIn(userCreateDto)

Log in and return the JWT token

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerSignInRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // UserCreateDto
    userCreateDto: ...,
  } satisfies AuthControllerSignInRequest;

  try {
    const data = await api.authControllerSignIn(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userCreateDto** | [UserCreateDto](UserCreateDto.md) |  | |

### Return type

[**AuthResponseDto**](AuthResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Login successfullty done |  -  |
| **401** | Invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

