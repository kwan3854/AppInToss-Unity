import { Storage } from "@apps-in-toss/web-framework";
import { StorageServiceBase } from "../../generated/StorageService/ait_storage_StorageServiceBase";
import type {
  GetItemRequest,
  GetItemResponse,
  SetItemRequest,
  SetItemResponse,
  RemoveItemRequest,
  RemoveItemResponse,
  ClearItemsRequest,
  ClearItemsResponse
} from "../../generated/StorageService/StorageService";

export class StorageServiceImpl extends StorageServiceBase {
  async GetItem(request: GetItemRequest): Promise<GetItemResponse> {
    const value = await Storage.getItem(request.key);
    return { value: value ?? "" };
  }

  async SetItem(request: SetItemRequest): Promise<SetItemResponse> {
    await Storage.setItem(request.key, request.value);
    return { dummy: true };
  }

  async RemoveItem(request: RemoveItemRequest): Promise<RemoveItemResponse> {
    await Storage.removeItem(request.key);
    return { dummy: true };
  }

  async ClearItems(request: ClearItemsRequest): Promise<ClearItemsResponse> {
    await Storage.clearItems();
    return { dummy: true };
  }
}
