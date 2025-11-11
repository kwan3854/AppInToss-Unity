using Ait.Device;
using Cysharp.Threading.Tasks;

public static class DeviceServiceClientExtensions
{
    public static async UniTask<GetSafeAreaInsetsResponse> GetSafeAreaInsets(this DeviceServiceClient client)
    {
        var response = await client.GetSafeAreaInsets(new GetSafeAreaInsetsRequest { Dummy = true });
        return response;
    }
}
