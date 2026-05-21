# VaultsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**vaultsControllerCreateOne**](VaultsApi.md#vaultscontrollercreateone) | **POST** /vaults | Create a new vault |
| [**vaultsControllerDeleteOne**](VaultsApi.md#vaultscontrollerdeleteone) | **DELETE** /vaults/{id} | Delete a vault and its contents |
| [**vaultsControllerFindAll**](VaultsApi.md#vaultscontrollerfindall) | **GET** /vaults | Returns all user vaults |
| [**vaultsControllerFindOne**](VaultsApi.md#vaultscontrollerfindone) | **GET** /vaults/{id} | Return a single vault by ID |
| [**vaultsControllerFindVaultPasswords**](VaultsApi.md#vaultscontrollerfindvaultpasswords) | **GET** /vaults/{vaultId}/passwords | Returns all passwords contained in a specific vault |
| [**vaultsControllerUpdateOne**](VaultsApi.md#vaultscontrollerupdateone) | **PUT** /vaults/{id} | Update an existing vault |



## vaultsControllerCreateOne

> VaultResponseDto vaultsControllerCreateOne(vaultCreateDto)

Create a new vault

### Example

```ts
import {
  Configuration,
  VaultsApi,
} from '';
import type { VaultsControllerCreateOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new VaultsApi(config);

  const body = {
    // VaultCreateDto
    vaultCreateDto: ...,
  } satisfies VaultsControllerCreateOneRequest;

  try {
    const data = await api.vaultsControllerCreateOne(body);
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
| **vaultCreateDto** | [VaultCreateDto](VaultCreateDto.md) |  | |

### Return type

[**VaultResponseDto**](VaultResponseDto.md)

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


## vaultsControllerDeleteOne

> VaultResponseDto vaultsControllerDeleteOne(id)

Delete a vault and its contents

### Example

```ts
import {
  Configuration,
  VaultsApi,
} from '';
import type { VaultsControllerDeleteOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new VaultsApi(config);

  const body = {
    // string
    id: id_example,
  } satisfies VaultsControllerDeleteOneRequest;

  try {
    const data = await api.vaultsControllerDeleteOne(body);
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

[**VaultResponseDto**](VaultResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Vault successfully deleted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## vaultsControllerFindAll

> Array&lt;VaultResponseDto&gt; vaultsControllerFindAll()

Returns all user vaults

### Example

```ts
import {
  Configuration,
  VaultsApi,
} from '';
import type { VaultsControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new VaultsApi(config);

  try {
    const data = await api.vaultsControllerFindAll();
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

[**Array&lt;VaultResponseDto&gt;**](VaultResponseDto.md)

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


## vaultsControllerFindOne

> VaultResponseDto vaultsControllerFindOne(id)

Return a single vault by ID

### Example

```ts
import {
  Configuration,
  VaultsApi,
} from '';
import type { VaultsControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new VaultsApi(config);

  const body = {
    // string | Vault UUID
    id: id_example,
  } satisfies VaultsControllerFindOneRequest;

  try {
    const data = await api.vaultsControllerFindOne(body);
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
| **id** | `string` | Vault UUID | [Defaults to `undefined`] |

### Return type

[**VaultResponseDto**](VaultResponseDto.md)

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


## vaultsControllerFindVaultPasswords

> Array&lt;PasswordResponseDto&gt; vaultsControllerFindVaultPasswords(vaultId)

Returns all passwords contained in a specific vault

### Example

```ts
import {
  Configuration,
  VaultsApi,
} from '';
import type { VaultsControllerFindVaultPasswordsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new VaultsApi(config);

  const body = {
    // string | Vault UUID
    vaultId: vaultId_example,
  } satisfies VaultsControllerFindVaultPasswordsRequest;

  try {
    const data = await api.vaultsControllerFindVaultPasswords(body);
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
| **vaultId** | `string` | Vault UUID | [Defaults to `undefined`] |

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


## vaultsControllerUpdateOne

> VaultResponseDto vaultsControllerUpdateOne(id, vaultUpdateDto)

Update an existing vault

### Example

```ts
import {
  Configuration,
  VaultsApi,
} from '';
import type { VaultsControllerUpdateOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new VaultsApi(config);

  const body = {
    // string
    id: id_example,
    // VaultUpdateDto
    vaultUpdateDto: ...,
  } satisfies VaultsControllerUpdateOneRequest;

  try {
    const data = await api.vaultsControllerUpdateOne(body);
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
| **vaultUpdateDto** | [VaultUpdateDto](VaultUpdateDto.md) |  | |

### Return type

[**VaultResponseDto**](VaultResponseDto.md)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

