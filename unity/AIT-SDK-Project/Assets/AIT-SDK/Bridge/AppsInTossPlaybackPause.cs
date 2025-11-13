using System.Collections.Generic;
using UnityEngine;

namespace AIT.AIT_SDK.Bridge
{
    /// <summary>
    /// Centralized helper that pauses Unity's simulation/audio while at least one subsystem
    /// requests it (ads, host visibility, etc.). Prevents competing systems from fighting
    /// over Time.timeScale or AudioListener.pause. Supports independent toggles for time/audio.
    /// </summary>
    public static class AppsInTossPlaybackPause
    {
        [System.Flags]
        public enum PauseChannels
        {
            None = 0,
            Time = 1 << 0,
            Audio = 1 << 1,
            All = Time | Audio,
        }

        static readonly Dictionary<int, PauseChannels> ActiveRequests = new();
        static int _nextRequestId = 1;

        static int _timeRequestCount;
        static bool _cachedTimeScaleValid;
        static float _cachedTimeScale;

        static int _audioRequestCount;
        static bool _cachedAudioPauseValid;
        static bool _cachedAudioPause;

        /// <summary>
        /// Requests that gameplay/audio be paused. Returns a handle that must be disposed
        /// when the requesting system is done (e.g., ad dismissed, host became visible).
        /// </summary>
        public static PauseHandle Acquire(PauseChannels channels, string reason)
        {
            if (channels == PauseChannels.None)
            {
                return null;
            }

            var id = _nextRequestId++;
            ActiveRequests[id] = channels;

            if ((channels & PauseChannels.Time) != 0)
            {
                if (_timeRequestCount++ == 0)
                {
                    _cachedTimeScale = Time.timeScale;
                    _cachedTimeScaleValid = true;
                    Time.timeScale = 0f;
                }
            }

            if ((channels & PauseChannels.Audio) != 0)
            {
                if (_audioRequestCount++ == 0)
                {
                    _cachedAudioPause = AudioListener.pause;
                    _cachedAudioPauseValid = true;
                    AudioListener.pause = true;
                }
            }

            return new PauseHandle(id, channels, reason);
        }

        internal static void Release(PauseHandle handle)
        {
            if (handle == null || !ActiveRequests.Remove(handle.RequestId))
            {
                return;
            }

            if ((handle.Channels & PauseChannels.Time) != 0)
            {
                _timeRequestCount = Mathf.Max(0, _timeRequestCount - 1);
                if (_timeRequestCount == 0 && _cachedTimeScaleValid)
                {
                    Time.timeScale = _cachedTimeScale;
                    _cachedTimeScaleValid = false;
                }
            }

            if ((handle.Channels & PauseChannels.Audio) != 0)
            {
                _audioRequestCount = Mathf.Max(0, _audioRequestCount - 1);
                if (_audioRequestCount == 0 && _cachedAudioPauseValid)
                {
                    AudioListener.pause = _cachedAudioPause;
                    _cachedAudioPauseValid = false;
                }
            }
        }

        /// <summary>
        /// Disposable handle returned by Acquire. Disposing releases the request.
        /// </summary>
        public sealed class PauseHandle : System.IDisposable
        {
            internal PauseHandle(int requestId, PauseChannels channels, string reason)
            {
                RequestId = requestId;
                Channels = channels;
                Reason = reason;
            }

            internal int RequestId { get; }
            internal PauseChannels Channels { get; }
            public string Reason { get; }
            bool _isReleased;

            public void Dispose()
            {
                if (_isReleased)
                {
                    return;
                }

                _isReleased = true;
                Release(this);
            }
        }
    }
}
