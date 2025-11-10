using Ait;
using Ait.Game;
using Ait.Iap;
using Ait.Storage;
using UnityEngine;
using WebViewRPC;
using AitBridge.Generated;

namespace AitBridge.RPC
{
    /// <summary>
    /// AIT RPC Bridge MonoBehaviour
    /// 
    /// This GameObject receives messages from React and routes them to the RPC system.
    /// 
    /// Setup:
    /// 1. Create an empty GameObject named "AitRpcBridge" in your scene
    /// 2. Attach this script to that GameObject
    /// 3. The bridge will automatically initialize and connect to React
    /// </summary>
    public class AitRpcBridge : MonoBehaviour
    {
        private static AitRpcBridge _instance;
        public static AitRpcBridge Instance
        {
            get
            {
                if (_instance == null)
                {
                    Debug.LogError("[AitRpcBridge] Instance is null. Make sure AitRpcBridge GameObject exists in the scene.");
                }
                return _instance;
            }
        }

        private ReactUnityWebGLBridge _bridge;
        private WebViewRpcClient _rpcClient;
        
        // Service clients
        private OpenURLServiceClient _openURLServiceClient;
        private GameServiceClient _gameServiceClient;
        private AdServiceClient _adServiceClient;
        private IapServiceClient _iapServiceClient;
        private StorageServiceClient _storageServiceClient;

        // Public accessor for OpenURL service
        public OpenURLServiceClient OpenURLService => _openURLServiceClient;
        public GameServiceClient GameService => _gameServiceClient;
        public AdServiceClient AdService => _adServiceClient;
        public IapServiceClient IapService => _iapServiceClient;
        public StorageServiceClient StorageService => _storageServiceClient;


        private void Awake()
        {
            // Singleton pattern
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }

            _instance = this;
            DontDestroyOnLoad(gameObject);

            // Initialize bridge
            _bridge = new ReactUnityWebGLBridge();

            // Initialize RPC client
            _rpcClient = new WebViewRpcClient(_bridge);

            // Initialize service clients
            _openURLServiceClient = new OpenURLServiceClient(_rpcClient);
            _gameServiceClient = new GameServiceClient(_rpcClient);
            _adServiceClient = new AdServiceClient(_rpcClient);
            _iapServiceClient = new IapServiceClient(_rpcClient);
            _storageServiceClient = new StorageServiceClient(_rpcClient);


            // Add more service clients here:
            // _paymentServiceClient = new PaymentServiceClient(_rpcClient);

            Debug.Log("[AitRpcBridge] Initialized successfully");
            Debug.Log("[AitRpcBridge] Available services: OpenURL");
        }

        /// <summary>
        /// Called by React via SendMessage
        /// Routes messages from React to the RPC system
        /// </summary>
        /// <param name="message">Base64-encoded RPC message</param>
        public void ReceiveMessageFromWeb(string message)
        {
            _bridge.ReceiveMessageFromWeb(message);
        }

        private void OnDestroy()
        {
            if (_instance == this)
            {
                _instance = null;
            }
        }
    }
}


