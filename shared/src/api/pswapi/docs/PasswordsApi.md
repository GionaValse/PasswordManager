# PasswordsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**passwordsControllerCreateOne**](PasswordsApi.md#passwordscontrollercreateone) | **POST** /passwords | Create a new password |
| [**passwordsControllerDeleteOne**](PasswordsApi.md#passwordscontrollerdeleteone) | **DELETE** /passwords/{id} | Delete a password |
| [**passwordsControllerFindAll**](PasswordsApi.md#passwordscontrollerfindall) | **GET** /passwords | Returns all user passwords |
| [**passwordsControllerFindFavorites**](PasswordsApi.md#passwordscontrollerfindfavorites) | **GET** /passwords/favorites | Returns favorite passwords only |
| [**passwordsControllerFindOne**](PasswordsApi.md#passwordscontrollerfindone) | **GET** /passwords/{id} | Returns a single password via ID |
| [**passwordsControllerUpdateFavorite**](PasswordsApi.md#passwordscontrollerupdatefavoriteoperation) | **PATCH** /passwords/{id}/favorite | Change the favorite state of a passowrd |
| [**passwordsControllerUpdateOne**](PasswordsApi.md#passwordscontrollerupdateone) | **PUT** /passwords/{id} | Update completely a password |



## passwordsControllerCreateOne

> PasswordResponseDto passwordsControllerCreateOne(passwordCreateDto)

Create a new password

### Example

```ts
import {
  Configuration,
  PasswordsApi,
} from '';
import type { PasswordsControllerCreateOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PasswordsApi(config);

  const body = {
    // PasswordCreateDto
    passwordCreateDto: ...,
  } satisfies PasswordsControllerCreateOneRequest;

  try {
    const data = await api.passwordsControllerCreateOne(body);
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
| **passwordCreateDto** | [PasswordCreateDto](PasswordCreateDto.md) |  | |

### Return type

[**PasswordResponseDto**](PasswordResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## passwordsControllerDeleteOne

> PasswordResponseDto passwordsControllerDeleteOne(id)

Delete a password

### Example

```ts
import {
  Configuration,
  PasswordsApi,
} from '';
import type { PasswordsControllerDeleteOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PasswordsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies PasswordsControllerDeleteOneRequest;

  try {
    const data = await api.passwordsControllerDeleteOne(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**PasswordResponseDto**](PasswordResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Password successfully deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## passwordsControllerFindAll

> Array&lt;PasswordResponseDto&gt; passwordsControllerFindAll()

Returns all user passwords

### Example

```ts
import {
  Configuration,
  PasswordsApi,
} from '';
import type { PasswordsControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PasswordsApi(config);

  try {
    const data = await api.passwordsControllerFindAll();
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

[**Array&lt;PasswordResponseDto&gt;**](PasswordResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## passwordsControllerFindFavorites

> Array&lt;PasswordResponseDto&gt; passwordsControllerFindFavorites()

Returns favorite passwords only

### Example

```ts
import {
  Configuration,
  PasswordsApi,
} from '';
import type { PasswordsControllerFindFavoritesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PasswordsApi(config);

  try {
    const data = await api.passwordsControllerFindFavorites();
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

[**Array&lt;PasswordResponseDto&gt;**](PasswordResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## passwordsControllerFindOne

> PasswordResponseDto passwordsControllerFindOne(id)

Returns a single password via ID

### Example

```ts
import {
  Configuration,
  PasswordsApi,
} from '';
import type { PasswordsControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PasswordsApi(config);

  const body = {
    // string | UUID della password
    id: id_example,
  } satisfies PasswordsControllerFindOneRequest;

  try {
    const data = await api.passwordsControllerFindOne(body);
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
| **id** | `string` | UUID della password | [Defaults to `undefined`] |

### Return type

[**PasswordResponseDto**](PasswordResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## passwordsControllerUpdateFavorite

> PasswordResponseDto passwordsControllerUpdateFavorite(id, passwordsControllerUpdateFavoriteRequest)

Change the favorite state of a passowrd

### Example

```ts
import {
  Configuration,
  PasswordsApi,
} from '';
import type { PasswordsControllerUpdateFavoriteOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PasswordsApi(config);

  const body = {
    // string
    id: id_example,
    // PasswordsControllerUpdateFavoriteRequest
    passwordsControllerUpdateFavoriteRequest: ...,
  } satisfies PasswordsControllerUpdateFavoriteOperationRequest;

  try {
    const data = await api.passwordsControllerUpdateFavorite(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **passwordsControllerUpdateFavoriteRequest** | [PasswordsControllerUpdateFavoriteRequest](PasswordsControllerUpdateFavoriteRequest.md) |  | |

### Return type

[**PasswordResponseDto**](PasswordResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Favorite status changed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## passwordsControllerUpdateOne

> PasswordResponseDto passwordsControllerUpdateOne(id, passwordUpdateDto)

Update completely a password

### Example

```ts
import {
  Configuration,
  PasswordsApi,
} from '';
import type { PasswordsControllerUpdateOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PasswordsApi(config);

  const body = {
    // string
    id: id_example,
    // PasswordUpdateDto
    passwordUpdateDto: ...,
  } satisfies PasswordsControllerUpdateOneRequest;

  try {
    const data = await api.passwordsControllerUpdateOne(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **passwordUpdateDto** | [PasswordUpdateDto](PasswordUpdateDto.md) |  | |

### Return type

[**PasswordResponseDto**](PasswordResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Password updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

