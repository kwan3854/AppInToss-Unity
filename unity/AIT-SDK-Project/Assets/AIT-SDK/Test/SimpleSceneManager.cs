using UnityEngine;
using UnityEngine.SceneManagement;

namespace AIT.AIT_SDK.Test
{
    public class SimpleSceneManager : MonoBehaviour
    {
        public void LoadGameServiceTestScene()
        {
            SceneManager.LoadScene("GameServiceTestScene");
        }

        public void LoadOpenURLTestScene()
        {
            SceneManager.LoadScene("OpenURLTestScene");
        }

        public void LoadAdTestScene()
        {
            SceneManager.LoadScene("AdServiceTestScene");
        }
        
        public void LoadIapTestScene()
        {
            SceneManager.LoadScene("IAPTestScene");
        }
        
        
        public void LoadStorageTestScene()
        {
            SceneManager.LoadScene("StorageServiceTestScene");
        }

        public void LoadInitScene()
        {
            SceneManager.LoadScene("InitScene");
        }
    }
}