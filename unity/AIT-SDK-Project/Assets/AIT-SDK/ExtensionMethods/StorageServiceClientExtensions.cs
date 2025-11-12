using Ait.Storage;
using Cysharp.Threading.Tasks;

namespace AIT.AIT_SDK.ExtensionMethods
{
    public static class StorageServiceClientExtensions
    {
        /// <summary>
        /// Clears all items from the storage.
        /// </summary>
        public static UniTask<ClearItemsResponse> ClearItems(this StorageServiceClient client)
        {
            return client.ClearItems(new ClearItemsRequest { Dummy = true });
        }
    }
}
